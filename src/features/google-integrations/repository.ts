/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Repository for google_integrations table.
 * Handles CRUD with encryption/decryption of refresh tokens.
 *
 * Note: google_integrations is not in the generated Supabase Database type
 * (the migration has not been applied to the type generator).
 * We use (supabase as any).from() to bypass the strict type check,
 * matching the established codebase pattern.
 */
import type { RepositoryResult } from '@/contracts/repositories';
import { DatabaseError } from '@/errors';
import { encrypt, decrypt, isEncryptionConfigured } from '@/lib/crypto/encryption';
import { serverLogger } from '@/lib/logger/server-logger';
import { createServerSupabaseClient } from '@/lib/supabase/server';

import type {
  GoogleService,
  GoogleIntegrationRow,
  GoogleIntegrationInfo,
  IntegrationStatus,
} from './types';

/**
 * Helper: get an untyped Supabase query builder for google_integrations.
 */
async function fromGoogleIntegrations() {
  const supabase = await createServerSupabaseClient();
  return (supabase as any).from('google_integrations');
}

export class GoogleIntegrationsRepository {
  /**
   * Get all integration rows (tokens are NOT decrypted for listing).
   */
  async listIntegrations(): Promise<RepositoryResult<GoogleIntegrationRow[]>> {
    try {
      const query = await fromGoogleIntegrations();
      const { data, error } = await query
        .select('*')
        .order('service');
      if (error) throw new DatabaseError(error.message);
      return { data: (data as GoogleIntegrationRow[]) || [], error: null };
    } catch (error) {
      serverLogger.error('GoogleIntegrationsRepository.listIntegrations failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get a single integration by service.
   */
  async getByService(service: GoogleService): Promise<RepositoryResult<GoogleIntegrationRow | null>> {
    try {
      const query = await fromGoogleIntegrations();
      const { data, error } = await query
        .select('*')
        .eq('service', service)
        .maybeSingle();
      if (error) throw new DatabaseError(error.message);
      return { data: data as GoogleIntegrationRow | null, error: null };
    } catch (error) {
      serverLogger.error('GoogleIntegrationsRepository.getByService failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get the decrypted refresh token for a service.
   * Returns null if not connected or encryption not configured.
   */
  async getDecryptedRefreshToken(service: GoogleService): Promise<string | null> {
    const result = await this.getByService(service);
    if (!result.data?.encrypted_refresh_token) return null;
    if (!isEncryptionConfigured()) return null;

    try {
      return decrypt(result.data.encrypted_refresh_token);
    } catch (err) {
      serverLogger.error('Failed to decrypt refresh token', err as Error);
      return null;
    }
  }

  /**
   * Upsert an integration connection (connect or reconnect).
   * Encrypts the refresh token before storing.
   */
  async upsertConnection(params: {
    service: GoogleService;
    googleAccountEmail: string;
    refreshToken: string;
    scopes: string;
    metaData?: Record<string, unknown>;
    userId: string;
  }): Promise<RepositoryResult<GoogleIntegrationRow>> {
    try {
      if (!isEncryptionConfigured()) {
        throw new Error('INTEGRATION_SECRET_KEY is not configured. Cannot store tokens.');
      }

      const encryptedToken = encrypt(params.refreshToken);

      const query = await fromGoogleIntegrations();
      const { data, error } = await query
        .upsert(
          {
            service: params.service,
            google_account_email: params.googleAccountEmail,
            encrypted_refresh_token: encryptedToken,
            scopes: params.scopes,
            status: 'connected',
            meta_data: params.metaData || {},
            last_connected_at: new Date().toISOString(),
            last_synced_at: new Date().toISOString(),
            updated_by: params.userId,
          },
          { onConflict: 'service' }
        )
        .select()
        .single();

      if (error) throw new DatabaseError(error.message);
      return { data: data as GoogleIntegrationRow, error: null };
    } catch (error) {
      serverLogger.error('GoogleIntegrationsRepository.upsertConnection failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Update integration metadata (e.g. after selecting a property).
   */
  async updateMetadata(
    service: GoogleService,
    metaData: Record<string, unknown>,
    userId: string
  ): Promise<RepositoryResult<GoogleIntegrationRow>> {
    try {
      const query = await fromGoogleIntegrations();
      const { data, error } = await query
        .update({
          meta_data: metaData,
          last_synced_at: new Date().toISOString(),
          updated_by: userId,
        })
        .eq('service', service)
        .select()
        .single();
      if (error) throw new DatabaseError(error.message);
      return { data: data as GoogleIntegrationRow, error: null };
    } catch (error) {
      serverLogger.error('GoogleIntegrationsRepository.updateMetadata failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Update status of an integration.
   */
  async updateStatus(
    service: GoogleService,
    status: IntegrationStatus,
    userId: string
  ): Promise<RepositoryResult<GoogleIntegrationRow>> {
    try {
      const query = await fromGoogleIntegrations();
      const { data, error } = await query
        .update({
          status,
          updated_by: userId,
        })
        .eq('service', service)
        .select()
        .single();
      if (error) throw new DatabaseError(error.message);
      return { data: data as GoogleIntegrationRow, error: null };
    } catch (error) {
      serverLogger.error('GoogleIntegrationsRepository.updateStatus failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Disconnect a service: clear tokens, reset status, clear metadata.
   */
  async disconnect(service: GoogleService, userId: string): Promise<RepositoryResult<GoogleIntegrationRow>> {
    try {
      const query = await fromGoogleIntegrations();
      const { data, error } = await query
        .update({
          encrypted_refresh_token: null,
          status: 'disconnected',
          scopes: null,
          google_account_email: null,
          meta_data: {},
          updated_by: userId,
        })
        .eq('service', service)
        .select()
        .single();
      if (error) throw new DatabaseError(error.message);
      return { data: data as GoogleIntegrationRow, error: null };
    } catch (error) {
      serverLogger.error('GoogleIntegrationsRepository.disconnect failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Convert a database row to a safe frontend-facing info object.
   * Never includes tokens.
   */
  toInfo(row: GoogleIntegrationRow): GoogleIntegrationInfo {
    return {
      service: row.service,
      status: row.status,
      googleAccountEmail: row.google_account_email,
      lastConnectedAt: row.last_connected_at,
      lastSyncedAt: row.last_synced_at,
      meta: row.meta_data || {},
    };
  }
}

export const googleIntegrationsRepository = new GoogleIntegrationsRepository();
