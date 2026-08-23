/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PaginatedResult, RepositoryResult, FilterMap } from '@/contracts/repositories';
import { DatabaseError } from '@/errors';
import { serverLogger } from "@/lib/logger/server-logger";
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Pagination, ID } from '@/types';
import type { Database } from '@/types/database/database.generated';

/**
 * Database row shape for donations.
 */
export type DonationRow = {
  id: string;
  donation_number: string;
  contact_id: string;
  campaign_id: string | null;
  program_id: string | null;
  event_id: string | null;
  recurring_donation_id: string | null;
  donation_type: string;
  amount: number;
  currency: string;
  purpose: string | null;
  payment_method: string | null;
  provider: string;
  gateway_transaction_id: string | null;
  gateway_order_id: string | null;
  status: string;
  paid_at: string | null;
  is_80g_eligible: boolean;
  receipt_generated: boolean;
  metadata: Database['public']['Tables']['donation_campaigns']['Row']['metadata'];
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
};

/** Payload for creating a donation. */
export type DonationCreate = Omit<DonationRow, 'id' | 'created_at' | 'updated_at' | 'is_deleted' | 'receipt_generated'>;

/** Payload for updating a donation. */
export type DonationUpdate = Partial<Pick<DonationRow, 'status' | 'paid_at' | 'gateway_transaction_id' | 'gateway_order_id' | 'metadata' | 'updated_by'>>;

/**
 * Database row shape for donation campaigns.
 */
export type CampaignRow = {
  id: string;
  campaign_code: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  goal_amount: number;
  raised_amount: number;
  currency: string;
  cover_image_id: string | null;
  program_id: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  visibility: string;
  is_featured: boolean;
  priority: number;
  metadata: Database['public']['Tables']['donation_campaigns']['Row']['metadata'];
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
};

/** Payload for creating a campaign. */
export type CampaignCreate = Omit<CampaignRow, 'id' | 'created_at' | 'updated_at' | 'is_deleted' | 'raised_amount'>;

/** Payload for updating a campaign. */
export type CampaignUpdate = Partial<Omit<CampaignCreate, 'campaign_code'>>;

/**
 * Repository for managing database access for donations and campaigns.
 */
export class DonationsRepository {
  /**
   * Finds a donation by its unique ID.
   * @param id - Donation ID.
   * @returns Repository result containing DonationRow or error.
   */
  async findDonationById(id: ID): Promise<RepositoryResult<DonationRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.from('donations').select('*').eq('id', id).eq('is_deleted', false).single();
      if (error) throw new DatabaseError(error.message);
      return { data, error: null };
    } catch (error) {
      serverLogger.error('DonationsRepository.findDonationById failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Lists donations with pagination and filters.
   * @param params - Object containing pagination and optional filters.
   * @returns Paginated result of DonationRow records.
   */
  async listDonations(params: { pagination: Pagination; filters?: FilterMap }): Promise<PaginatedResult<DonationRow>> {
    const { pagination, filters } = params;
    const supabase = await createServerSupabaseClient();
    let query = supabase.from('donations').select('*', { count: 'exact' }).eq('is_deleted', false);
    if (filters?.status) query = query.eq('status', filters.status as any);
    if (filters?.contact_id) query = query.eq('contact_id', filters.contact_id as string);
    if (filters?.campaign_id) query = query.eq('campaign_id', filters.campaign_id as string);
    query = query.order('created_at', { ascending: false });
    const from = (pagination.page - 1) * pagination.limit;
    query = query.range(from, from + pagination.limit - 1);
    const { data, count, error } = await query;
    if (error) serverLogger.error('DonationsRepository.listDonations failed', new DatabaseError(error.message));
    return { data: data ?? [], total: count ?? 0, page: pagination.page, limit: pagination.limit };
  }

  /**
   * Creates a new donation record.
   * @param data - Donation creation data.
   * @returns Repository result with created DonationRow or error.
   */
  async createDonation(data: DonationCreate): Promise<RepositoryResult<DonationRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await (supabase.from('donations') as any).insert(data).select().single();
      if (error) throw new DatabaseError(error.message);
      return { data: row, error: null };
    } catch (error) {
      serverLogger.error('DonationsRepository.createDonation failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Updates an existing donation record.
   * @param id - Donation ID.
   * @param data - Partial update payload.
   * @returns Repository result with updated DonationRow or error.
   */
  async updateDonation(id: ID, data: DonationUpdate): Promise<RepositoryResult<DonationRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await (supabase.from('donations') as any).update(data).eq('id', id).select().single();
      if (error) throw new DatabaseError(error.message);
      return { data: row, error: null };
    } catch (error) {
      serverLogger.error('DonationsRepository.updateDonation failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Appends an event to the immutable financial ledger.
   */
  async appendLedgerEvent(donationId: ID, eventType: string, amount: number, currency = 'INR', gatewayReference?: string, metadata: Record<string, unknown> = {}): Promise<RepositoryResult<boolean>> {
    try {
      const supabase = await createServerSupabaseClient();
      const payload = {
        donation_id: donationId,
        event_type: eventType,
        amount,
        currency,
        gateway_reference: gatewayReference || null,
        metadata
      };
      const { error } = await (supabase.from('financial_ledger') as any).insert(payload);
      if (error) throw new DatabaseError(error.message);
      return { data: true, error: null };
    } catch (error) {
      serverLogger.error('DonationsRepository.appendLedgerEvent failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Records a webhook processing event.
   */
  async recordWebhookEvent(provider: string, eventType: string, eventId: string, payload: any, headers: any, signature: string): Promise<RepositoryResult<boolean>> {
    try {
      const supabase = await createServerSupabaseClient();
      const data = {
        provider,
        event_type: eventType,
        gateway_event_id: eventId,
        payload,
        headers,
        signature,
        is_verified: true,
        is_processed: true,
        processed_at: new Date().toISOString()
      };
      const { error } = await (supabase.from('payment_webhooks') as any).insert(data);
      if (error) throw new DatabaseError(error.message);
      return { data: true, error: null };
    } catch (error) {
      serverLogger.error('DonationsRepository.recordWebhookEvent failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Finds a campaign by ID.
   * @param id - Campaign ID.
   * @returns Repository result with CampaignRow or error.
   */
  async findCampaignById(id: ID): Promise<RepositoryResult<CampaignRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.from('donation_campaigns').select('*').eq('id', id).eq('is_deleted', false).single();
      if (error) throw new DatabaseError(error.message);
      return { data, error: null };
    } catch (error) {
      serverLogger.error('DonationsRepository.findCampaignById failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Creates a new campaign record.
   * @param data - Campaign creation payload.
   * @returns Repository result with created CampaignRow or error.
   */
  async createCampaign(data: CampaignCreate): Promise<RepositoryResult<CampaignRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await (supabase.from('donation_campaigns') as any).insert(data).select().single();
      if (error) throw new DatabaseError(error.message);
      return { data: row, error: null };
    } catch (error) {
      serverLogger.error('DonationsRepository.createCampaign failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Updates an existing campaign record.
   * @param id - Campaign ID.
   * @param data - Partial campaign update payload.
   * @returns Repository result with updated CampaignRow or error.
   */
  async updateCampaign(id: ID, data: CampaignUpdate): Promise<RepositoryResult<CampaignRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await (supabase.from('donation_campaigns') as any).update(data).eq('id', id).eq('is_deleted', false).select().single();
      if (error) throw new DatabaseError(error.message);
      return { data: row, error: null };
    } catch (error) {
      serverLogger.error('DonationsRepository.updateCampaign failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Calls stored procedure active_campaigns to retrieve top active campaigns.
   * @param limit - Maximum number of campaigns to return.
   * @returns List of active CampaignRow records.
   */
  async activeCampaigns(limit: number): Promise<CampaignRow[]> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await (supabase.rpc as any)('active_campaigns', { p_limit: limit });
    if (error) serverLogger.error('DonationsRepository.activeCampaigns failed', new DatabaseError(error.message));
    return (data as CampaignRow[]) ?? [];
  }
}

export const donationsRepository = new DonationsRepository();
