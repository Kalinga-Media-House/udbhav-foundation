/**
 * Shared types for Google Integrations feature.
 */

export type GoogleService = 'analytics' | 'search_console' | 'ads';

export type IntegrationStatus = 'connected' | 'disconnected' | 'error' | 'partially_configured';

export interface GoogleIntegrationRow {
  id: string;
  service: GoogleService;
  google_account_email: string | null;
  encrypted_refresh_token: string | null;
  scopes: string | null;
  status: IntegrationStatus;
  meta_data: Record<string, unknown>;
  last_connected_at: string | null;
  last_synced_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Safe integration info returned to the frontend.
 * Never includes tokens or secrets.
 */
export interface GoogleIntegrationInfo {
  service: GoogleService;
  status: IntegrationStatus;
  googleAccountEmail: string | null;
  lastConnectedAt: string | null;
  lastSyncedAt: string | null;
  meta: Record<string, unknown>;
}

/** Analytics-specific metadata stored in meta_data JSONB */
export interface AnalyticsMetadata {
  ga_property_id?: string;        // Numeric GA4 Property ID (e.g. "123456789")
  ga_property_name?: string;      // Display name
  ga_measurement_id?: string;     // G-XXXXXXXXXX (used in gtag.js)
  ga_account_id?: string;
  ga_account_name?: string;
}

/** Search Console metadata stored in meta_data JSONB */
export interface SearchConsoleMetadata {
  site_url?: string;              // e.g. "https://udbhavfoundation.in"
  permission_level?: string;      // e.g. "siteOwner", "siteFullUser"
  sitemap_url?: string;
  sitemap_status?: string;
  sitemap_last_submitted?: string;
  sitemap_last_downloaded?: string;
}

/** Google Ads metadata stored in meta_data JSONB */
export interface AdsMetadata {
  customer_id?: string;
  customer_name?: string;
  manager_customer_id?: string;
  manager_name?: string;
  currency_code?: string;
}

/** Scopes per service — minimum required */
export const GOOGLE_SCOPES: Record<GoogleService, string[]> = {
  analytics: [
    'https://www.googleapis.com/auth/analytics.readonly',
    'https://www.googleapis.com/auth/analytics.edit',
  ],
  search_console: [
    'https://www.googleapis.com/auth/webmasters',
  ],
  ads: [
    'https://www.googleapis.com/auth/adwords',
  ],
};
