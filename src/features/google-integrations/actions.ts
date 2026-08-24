/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

/**
 * Google Integrations Server Actions.
 * CRITICAL: Every action enforces Super Admin authorization.
 */
import { revalidatePath } from 'next/cache';

import {
  handleAction,
  requireAuth,
  requireSuperAdminAuth,
} from '@/contracts/actions';
import type { ActionResult } from '@/contracts/actions';
import { auditLogger } from '@/lib/logger/audit-logger';

import { generateOAuthState } from './oauth-state';
import { googleIntegrationsRepository } from './repository';
import * as googleService from './service';
import type {
  GoogleService,
  GoogleIntegrationInfo,
  AnalyticsMetadata,
  AdsMetadata,
} from './types';

// ─── Helper ────────────────────────────────────────────────────────────────────

async function requireSuperAdmin() {
  const session = await requireAuth();
  requireSuperAdminAuth(session);
  return session;
}

// ─── Integration Status ────────────────────────────────────────────────────────

/**
 * Get the status of all Google integrations.
 * Returns safe info objects (no tokens).
 */
export async function getIntegrationStatuses(): Promise<ActionResult<GoogleIntegrationInfo[]>> {
  return handleAction('getIntegrationStatuses', async () => {
    await requireSuperAdmin();

    const result = await googleIntegrationsRepository.listIntegrations();
    if (!result.data) return [];

    return result.data.map((row) => googleIntegrationsRepository.toInfo(row));
  });
}

/**
 * Check if Google OAuth is configured (env vars present).
 */
export async function checkOAuthConfiguration(): Promise<ActionResult<{
  configured: boolean;
  hasClientId: boolean;
  hasClientSecret: boolean;
  hasEncryptionKey: boolean;
  hasAdsDevToken: boolean;
}>> {
  return handleAction('checkOAuthConfiguration', async () => {
    await requireSuperAdmin();

    return {
      configured: googleService.isGoogleOAuthConfigured(),
      hasClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasEncryptionKey: !!process.env.INTEGRATION_SECRET_KEY,
      hasAdsDevToken: !!process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
    };
  });
}

// ─── OAuth Flow ────────────────────────────────────────────────────────────────

/**
 * Initiate OAuth connection for a Google service.
 * Returns the Google OAuth authorization URL.
 */
export async function initiateOAuthConnection(
  service: GoogleService
): Promise<ActionResult<string>> {
  return handleAction('initiateOAuthConnection', async () => {
    const session = await requireSuperAdmin();

    if (!googleService.isGoogleOAuthConfigured()) {
      throw new Error(
        'Google OAuth is not configured. Please add GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, ' +
        'and INTEGRATION_SECRET_KEY to your environment variables.'
      );
    }

    // Generate cryptographically secure state parameter
    const state = generateOAuthState(service, session.id);
    const authUrl = googleService.generateAuthUrl(service, state);

    auditLogger.logAction(session.id, 'OAUTH_INITIATED', 'google_integrations', {
      service,
    });

    return authUrl;
  });
}

/**
 * Disconnect a Google service.
 */
export async function disconnectIntegration(
  service: GoogleService
): Promise<ActionResult<GoogleIntegrationInfo>> {
  return handleAction('disconnectIntegration', async () => {
    const session = await requireSuperAdmin();

    const result = await googleIntegrationsRepository.disconnect(service, session.id);
    if (!result.data) throw new Error(`Failed to disconnect ${service}.`);

    auditLogger.logAction(session.id, 'OAUTH_DISCONNECTED', 'google_integrations', {
      service,
    });

    revalidatePath('/admin/integrations/google');
    if (service === 'analytics') {
      revalidatePath('/', 'layout'); // Refresh GA tracking in public layout
    }

    return googleIntegrationsRepository.toInfo(result.data);
  });
}

// ─── Analytics ─────────────────────────────────────────────────────────────────

/**
 * List available GA4 properties.
 */
export async function listAnalyticsProperties(): Promise<ActionResult<any[]>> {
  return handleAction('listAnalyticsProperties', async () => {
    await requireSuperAdmin();
    return googleService.listAnalyticsProperties();
  });
}

/**
 * Select a GA4 property and retrieve its Measurement ID.
 */
export async function selectAnalyticsProperty(
  propertyId: string,
  propertyName: string
): Promise<ActionResult<GoogleIntegrationInfo>> {
  return handleAction('selectAnalyticsProperty', async () => {
    const session = await requireSuperAdmin();

    // Fetch measurement ID from data streams
    const metadata = await googleService.fetchAnalyticsMetadata(propertyId);
    const fullMeta: AnalyticsMetadata = {
      ...metadata,
      ga_property_name: propertyName,
    };

    const result = await googleIntegrationsRepository.updateMetadata(
      'analytics',
      fullMeta as any,
      session.id
    );
    if (!result.data) throw new Error('Failed to update Analytics property.');

    auditLogger.logAction(session.id, 'ANALYTICS_PROPERTY_SELECTED', 'google_integrations', {
      propertyId,
      propertyName,
      measurementId: metadata.ga_measurement_id || 'not_found',
    });

    revalidatePath('/admin/integrations/google');
    revalidatePath('/', 'layout'); // Refresh GA tracking

    return googleIntegrationsRepository.toInfo(result.data);
  });
}

// ─── Search Console ────────────────────────────────────────────────────────────

/**
 * List accessible Search Console sites.
 */
export async function listSearchConsoleSites(): Promise<ActionResult<any[]>> {
  return handleAction('listSearchConsoleSites', async () => {
    await requireSuperAdmin();
    return googleService.listSearchConsoleSites();
  });
}

/**
 * Select a Search Console site and fetch its status.
 */
export async function selectSearchConsoleSite(
  siteUrl: string
): Promise<ActionResult<GoogleIntegrationInfo>> {
  return handleAction('selectSearchConsoleSite', async () => {
    const session = await requireSuperAdmin();

    const metadata = await googleService.fetchSearchConsoleMetadata(siteUrl);

    const result = await googleIntegrationsRepository.updateMetadata(
      'search_console',
      metadata as any,
      session.id
    );
    if (!result.data) throw new Error('Failed to update Search Console property.');

    auditLogger.logAction(session.id, 'SEARCH_CONSOLE_SITE_SELECTED', 'google_integrations', {
      siteUrl,
      permissionLevel: metadata.permission_level,
    });

    revalidatePath('/admin/integrations/google');
    return googleIntegrationsRepository.toInfo(result.data);
  });
}

/**
 * Submit sitemap to Search Console.
 */
export async function submitSitemap(
  siteUrl: string,
  sitemapUrl: string
): Promise<ActionResult<void>> {
  return handleAction('submitSitemap', async () => {
    const session = await requireSuperAdmin();

    await googleService.submitSearchConsoleSitemap(siteUrl, sitemapUrl);

    // Refresh metadata after submission
    const metadata = await googleService.fetchSearchConsoleMetadata(siteUrl);
    await googleIntegrationsRepository.updateMetadata(
      'search_console',
      metadata as any,
      session.id
    );

    auditLogger.logAction(session.id, 'SITEMAP_SUBMITTED', 'google_integrations', {
      siteUrl,
      sitemapUrl,
    });

    revalidatePath('/admin/integrations/google');
  });
}

// ─── Google Ads ────────────────────────────────────────────────────────────────

/**
 * List accessible Google Ads customer accounts.
 */
export async function listAdsCustomers(): Promise<ActionResult<any[]>> {
  return handleAction('listAdsCustomers', async () => {
    await requireSuperAdmin();
    return googleService.listAdsCustomers();
  });
}

/**
 * Select a Google Ads customer account.
 */
export async function selectAdsCustomer(
  customerId: string,
  customerName: string
): Promise<ActionResult<GoogleIntegrationInfo>> {
  return handleAction('selectAdsCustomer', async () => {
    const session = await requireSuperAdmin();

    const metadata: AdsMetadata = {
      customer_id: customerId,
      customer_name: customerName,
    };

    const result = await googleIntegrationsRepository.updateMetadata(
      'ads',
      metadata as any,
      session.id
    );
    if (!result.data) throw new Error('Failed to update Ads customer.');

    auditLogger.logAction(session.id, 'ADS_CUSTOMER_SELECTED', 'google_integrations', {
      customerId,
      customerName,
    });

    revalidatePath('/admin/integrations/google');
    return googleIntegrationsRepository.toInfo(result.data);
  });
}

// ─── Refresh / Sync ────────────────────────────────────────────────────────────

/**
 * Refresh metadata for a connected service (re-fetch from Google APIs).
 */
export async function refreshIntegration(
  service: GoogleService
): Promise<ActionResult<GoogleIntegrationInfo>> {
  return handleAction('refreshIntegration', async () => {
    const session = await requireSuperAdmin();

    const integration = await googleIntegrationsRepository.getByService(service);
    if (!integration.data || integration.data.status !== 'connected') {
      throw new Error(`${service} is not connected.`);
    }

    const meta = integration.data.meta_data as any;

    try {
      let updatedMeta: any = meta;

      if (service === 'analytics' && meta.ga_property_id) {
        const freshMeta = await googleService.fetchAnalyticsMetadata(meta.ga_property_id);
        updatedMeta = { ...meta, ...freshMeta };
      } else if (service === 'search_console' && meta.site_url) {
        updatedMeta = await googleService.fetchSearchConsoleMetadata(meta.site_url);
      }

      const result = await googleIntegrationsRepository.updateMetadata(service, updatedMeta, session.id);
      if (!result.data) throw new Error(`Failed to refresh ${service}.`);

      revalidatePath('/admin/integrations/google');
      return googleIntegrationsRepository.toInfo(result.data);
    } catch (err: any) {
      // If refresh fails due to expired/revoked token, mark as error
      await googleIntegrationsRepository.updateStatus(service, 'error', session.id);
      throw new Error(`Failed to refresh ${service}: ${err.message}`);
    }
  });
}
