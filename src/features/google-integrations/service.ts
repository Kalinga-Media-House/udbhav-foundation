/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Google API service layer.
 * Uses raw fetch() for lightweight, direct API interaction.
 * Access tokens are generated on-demand from refresh tokens and never persisted.
 */
import { serverLogger } from '@/lib/logger/server-logger';

import { googleIntegrationsRepository } from './repository';
import type {
  GoogleService,
  AnalyticsMetadata,
  SearchConsoleMetadata,
  AdsMetadata,
} from './types';
import { GOOGLE_SCOPES } from './types';

// ─── Configuration helpers ─────────────────────────────────────────────────────

function getClientId(): string {
  const id = process.env.GOOGLE_CLIENT_ID;
  if (!id) throw new Error('GOOGLE_CLIENT_ID environment variable is not set.');
  return id;
}

function getClientSecret(): string {
  const secret = process.env.GOOGLE_CLIENT_SECRET;
  if (!secret) throw new Error('GOOGLE_CLIENT_SECRET environment variable is not set.');
  return secret;
}

function getRedirectUri(): string {
  return process.env.GOOGLE_REDIRECT_URI || 'https://udbhavfoundation.in/api/integrations/google/callback';
}

/**
 * Check whether Google OAuth credentials are configured.
 */
export function isGoogleOAuthConfigured(): boolean {
  return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.INTEGRATION_SECRET_KEY);
}

// ─── OAuth 2.0 ─────────────────────────────────────────────────────────────────

/**
 * Generate the Google OAuth 2.0 authorization URL for a specific service.
 */
export function generateAuthUrl(service: GoogleService, state: string): string {
  const scopes = GOOGLE_SCOPES[service];
  const params = new URLSearchParams({
    client_id: getClientId(),
    redirect_uri: getRedirectUri(),
    response_type: 'code',
    scope: scopes.join(' '),
    access_type: 'offline',
    prompt: 'consent',
    state,
    include_granted_scopes: 'false',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Exchange an authorization code for tokens.
 * Returns the refresh token and user info. Access token is NOT returned to caller.
 */
export async function exchangeCodeForTokens(code: string): Promise<{
  refreshToken: string;
  email: string;
  scopes: string;
}> {
  // 1. Exchange code for tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: getClientId(),
      client_secret: getClientSecret(),
      redirect_uri: getRedirectUri(),
      grant_type: 'authorization_code',
    }),
  });

  if (!tokenRes.ok) {
    const errBody = await tokenRes.text();
    serverLogger.error('Google token exchange failed', new Error(errBody));
    throw new Error('Failed to exchange authorization code for tokens.');
  }

  const tokenData = await tokenRes.json();

  if (!tokenData.refresh_token) {
    throw new Error(
      'No refresh token received. Please revoke app access at https://myaccount.google.com/permissions and try again.'
    );
  }

  // 2. Get user info using the short-lived access token (in-memory only)
  const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  if (!userRes.ok) {
    throw new Error('Failed to retrieve Google account info.');
  }

  const userInfo = await userRes.json();

  return {
    refreshToken: tokenData.refresh_token,
    email: userInfo.email || 'unknown',
    scopes: tokenData.scope || '',
  };
}

/**
 * Get a fresh access token from a stored refresh token.
 * The access token is returned in-memory and NEVER persisted.
 */
async function getAccessToken(service: GoogleService): Promise<string> {
  const refreshToken = await googleIntegrationsRepository.getDecryptedRefreshToken(service);
  if (!refreshToken) {
    throw new Error(`No refresh token available for ${service}. Please connect the service first.`);
  }

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: getClientId(),
      client_secret: getClientSecret(),
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    serverLogger.error('Google token refresh failed', new Error(errBody));
    throw new Error('Failed to refresh Google access token. The connection may have been revoked.');
  }

  const data = await res.json();
  return data.access_token;
}

// ─── Google Analytics ──────────────────────────────────────────────────────────

export interface AnalyticsProperty {
  name: string;         // "properties/123456789"
  displayName: string;
  propertyId: string;   // "123456789"
}

export interface AnalyticsDataStream {
  name: string;
  type: string;
  webStreamData?: {
    measurementId: string;    // "G-XXXXXXXXXX"
    defaultUri: string;
  };
}

/**
 * List all GA4 properties accessible by the connected account.
 */
export async function listAnalyticsProperties(): Promise<AnalyticsProperty[]> {
  const accessToken = await getAccessToken('analytics');

  // First get account summaries
  const res = await fetch(
    'https://analyticsadmin.googleapis.com/v1beta/accountSummaries?pageSize=200',
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) {
    const err = await res.text();
    serverLogger.error('GA4 accountSummaries failed', new Error(err));
    throw new Error('Failed to list Google Analytics accounts.');
  }

  const data = await res.json();
  const properties: AnalyticsProperty[] = [];

  for (const account of data.accountSummaries || []) {
    for (const prop of account.propertySummaries || []) {
      properties.push({
        name: prop.property,
        displayName: prop.displayName || prop.property,
        propertyId: prop.property?.replace('properties/', '') || '',
      });
    }
  }

  return properties;
}

/**
 * Get data streams for a GA4 property to find the Measurement ID.
 */
export async function getAnalyticsDataStreams(propertyId: string): Promise<AnalyticsDataStream[]> {
  const accessToken = await getAccessToken('analytics');

  const res = await fetch(
    `https://analyticsadmin.googleapis.com/v1beta/properties/${propertyId}/dataStreams`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) {
    const err = await res.text();
    serverLogger.error('GA4 dataStreams failed', new Error(err));
    throw new Error('Failed to retrieve Analytics data streams.');
  }

  const data = await res.json();
  return data.dataStreams || [];
}

/**
 * Fetch full Analytics metadata including Measurement ID.
 */
export async function fetchAnalyticsMetadata(propertyId: string): Promise<AnalyticsMetadata> {
  const streams = await getAnalyticsDataStreams(propertyId);
  const webStream = streams.find(
    (s: AnalyticsDataStream) => s.type === 'WEB_DATA_STREAM' && s.webStreamData?.measurementId
  );

  return {
    ga_property_id: propertyId,
    ga_measurement_id: webStream?.webStreamData?.measurementId || undefined,
    ga_property_name: undefined, // Will be filled from the properties list
  };
}

// ─── Google Search Console ─────────────────────────────────────────────────────

export interface SearchConsoleSite {
  siteUrl: string;
  permissionLevel: string;
}

export interface SearchConsoleSitemap {
  path: string;
  lastSubmitted?: string;
  lastDownloaded?: string;
  isPending: boolean;
  warnings?: number;
  errors?: number;
}

/**
 * List all sites accessible in Search Console.
 */
export async function listSearchConsoleSites(): Promise<SearchConsoleSite[]> {
  const accessToken = await getAccessToken('search_console');

  const res = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const err = await res.text();
    serverLogger.error('Search Console sites list failed', new Error(err));
    throw new Error('Failed to list Search Console sites.');
  }

  const data = await res.json();
  return (data.siteEntry || []).map((entry: any) => ({
    siteUrl: entry.siteUrl,
    permissionLevel: entry.permissionLevel,
  }));
}

/**
 * Get sitemaps for a Search Console site.
 */
export async function getSearchConsoleSitemaps(siteUrl: string): Promise<SearchConsoleSitemap[]> {
  const accessToken = await getAccessToken('search_console');
  const encodedUrl = encodeURIComponent(siteUrl);

  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodedUrl}/sitemaps`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) {
    const err = await res.text();
    serverLogger.error('Search Console sitemaps failed', new Error(err));
    throw new Error('Failed to retrieve sitemaps from Search Console.');
  }

  const data = await res.json();
  return (data.sitemap || []).map((sm: any) => ({
    path: sm.path,
    lastSubmitted: sm.lastSubmitted,
    lastDownloaded: sm.lastDownloaded,
    isPending: sm.isPending || false,
    warnings: sm.warnings,
    errors: sm.errors,
  }));
}

/**
 * Submit a sitemap to Search Console.
 */
export async function submitSearchConsoleSitemap(siteUrl: string, sitemapUrl: string): Promise<void> {
  const accessToken = await getAccessToken('search_console');
  const encodedSite = encodeURIComponent(siteUrl);
  const encodedSitemap = encodeURIComponent(sitemapUrl);

  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodedSite}/sitemaps/${encodedSitemap}`,
    {
      method: 'PUT',
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!res.ok) {
    const err = await res.text();
    serverLogger.error('Search Console sitemap submit failed', new Error(err));
    throw new Error('Failed to submit sitemap to Search Console.');
  }
}

/**
 * Fetch Search Console metadata for a connected site.
 */
export async function fetchSearchConsoleMetadata(siteUrl: string): Promise<SearchConsoleMetadata> {
  const sites = await listSearchConsoleSites();
  const site = sites.find((s) => s.siteUrl === siteUrl || s.siteUrl === `sc-domain:${siteUrl.replace('https://', '').replace('http://', '')}`);

  if (!site) {
    return { site_url: siteUrl, permission_level: 'not_accessible' };
  }

  let sitemaps: SearchConsoleSitemap[] = [];
  try {
    sitemaps = await getSearchConsoleSitemaps(site.siteUrl);
  } catch {
    // Sitemap data may not be available
  }

  const mainSitemap = sitemaps.find((sm) => sm.path.includes('sitemap.xml'));

  return {
    site_url: site.siteUrl,
    permission_level: site.permissionLevel,
    sitemap_url: mainSitemap?.path,
    sitemap_status: mainSitemap ? (mainSitemap.isPending ? 'pending' : 'submitted') : 'not_submitted',
    sitemap_last_submitted: mainSitemap?.lastSubmitted,
    sitemap_last_downloaded: mainSitemap?.lastDownloaded,
  };
}

// ─── Google Ads ────────────────────────────────────────────────────────────────

export interface AdsCustomer {
  customerId: string;
  descriptiveName: string;
  currencyCode: string;
  manager: boolean;
}

/**
 * List accessible Google Ads customer accounts.
 * Requires GOOGLE_ADS_DEVELOPER_TOKEN env var.
 */
export async function listAdsCustomers(): Promise<AdsCustomer[]> {
  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  if (!developerToken) {
    throw new Error(
      'GOOGLE_ADS_DEVELOPER_TOKEN is not configured. ' +
      'Apply for a developer token at https://developers.google.com/google-ads/api/docs/get-started/dev-token'
    );
  }

  const accessToken = await getAccessToken('ads');

  // Use the listAccessibleCustomers endpoint (doesn't require a customer ID)
  const res = await fetch(
    'https://googleads.googleapis.com/v17/customers:listAccessibleCustomers',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'developer-token': developerToken,
      },
    }
  );

  if (!res.ok) {
    const err = await res.text();
    serverLogger.error('Google Ads list customers failed', new Error(err));
    throw new Error('Failed to list Google Ads customer accounts.');
  }

  const data = await res.json();
  const resourceNames: string[] = data.resourceNames || [];

  // Fetch details for each customer
  const customers: AdsCustomer[] = [];
  for (const resourceName of resourceNames.slice(0, 10)) {
    try {
      const customerId = resourceName.replace('customers/', '');
      const detailRes = await fetch(
        `https://googleads.googleapis.com/v17/${resourceName}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'developer-token': developerToken,
            'login-customer-id': customerId,
          },
        }
      );

      if (detailRes.ok) {
        const detail = await detailRes.json();
        customers.push({
          customerId,
          descriptiveName: detail.descriptiveName || customerId,
          currencyCode: detail.currencyCode || 'USD',
          manager: detail.manager || false,
        });
      }
    } catch {
      // Skip inaccessible customers
    }
  }

  return customers;
}

/**
 * Fetch Ads metadata for a connected customer.
 */
export async function fetchAdsMetadata(customerId: string): Promise<AdsMetadata> {
  return {
    customer_id: customerId,
    customer_name: undefined, // Will be filled during connection
  };
}
