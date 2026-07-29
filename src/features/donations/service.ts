import type { PaginatedResult } from '@/contracts/repositories';
import { ok, fail, fromRepo } from '@/contracts/services';
import type { ServiceResult } from '@/contracts/services';
import { serverLogger } from '@/lib/logger/server-logger';
import type { Pagination, ID } from '@/types';

import { receiptService } from './receipt-service';
import { donationsRepository } from './repository';
import type { DonationRow, CampaignRow } from './repository';
import { createDonationSchema, createCampaignSchema, updateCampaignSchema } from './validators';
import type { CreateDonationDTO, CreateCampaignDTO, UpdateCampaignDTO } from './validators';

/**
 * Service encapsulating business logic for donations and campaigns.
 */
export class DonationsService {
  async getDonation(id: ID): Promise<ServiceResult<DonationRow>> {
    return fromRepo(await donationsRepository.findDonationById(id));
  }

  async listDonations(pagination: Pagination, filters?: Record<string, unknown>): Promise<ServiceResult<PaginatedResult<DonationRow>>> {
    return ok(await donationsRepository.listDonations({ pagination, filters }));
  }

  async createDonation(dto: CreateDonationDTO, userId: ID): Promise<ServiceResult<DonationRow>> {
    const parsed = createDonationSchema.safeParse(dto);
    if (!parsed.success) return fail(parsed.error.issues.map((e: { message: string }) => e.message).join(', '));
    
    // 1. Create Donation Record
    const result = await donationsRepository.createDonation({ ...parsed.data, status: 'Pending', created_by: userId, updated_by: userId } as any);
    if (result.error || !result.data) return fromRepo(result);

    // 2. Append Ledger Event
    await donationsRepository.appendLedgerEvent(result.data.id, 'Donation Created', result.data.amount, result.data.currency);

    return fromRepo(result);
  }

  /**
   * Orchestrates the completion of a successful payment.
   */
  async markPaid(id: ID, gatewayTxId: string, eventId?: string): Promise<ServiceResult<DonationRow>> {
    // 1. Update Donation Status
    const result = await donationsRepository.updateDonation(id, { 
      status: 'Paid', 
      paid_at: new Date().toISOString(), 
      gateway_transaction_id: gatewayTxId 
    });
    
    if (result.error || !result.data) return fromRepo(result);
    const tx = result.data;

    // 2. Append Ledger Event (Immutable Financial Audit)
    await donationsRepository.appendLedgerEvent(id, 'Payment Captured', tx.amount, tx.currency, gatewayTxId, { webhook_event_id: eventId });

    // 3. Contacts & Interaction Service (Orchestration)
    // Here we would ideally call: await contactsService.addInteraction(tx.contact_id, 'Donation', ...)
    // For now, we log the orchestration requirement as per enterprise architecture.
    serverLogger.info(`[Orchestration] Donation ${tx.donation_number} paid. ContactsService should record interaction for contact ${tx.contact_id}`);

    // 4. Notification Service
    serverLogger.info(`[Orchestration] NotificationService should email contact ${tx.contact_id} regarding successful payment.`);

    // 5. Receipt Service
    if (tx.is_80g_eligible) {
      await receiptService.generateReceipt(tx.id);
    }

    // 6. Analytics Service
    serverLogger.info(`[Orchestration] AnalyticsService KPIs triggered for campaign ${tx.campaign_id || 'general'}`);

    return fromRepo(result);
  }

  async getCampaign(id: ID): Promise<ServiceResult<CampaignRow>> {
    return fromRepo(await donationsRepository.findCampaignById(id));
  }

  async createCampaign(dto: CreateCampaignDTO, userId: ID): Promise<ServiceResult<CampaignRow>> {
    const parsed = createCampaignSchema.safeParse(dto);
    if (!parsed.success) return fail(parsed.error.issues.map((e: { message: string }) => e.message).join(', '));
    return fromRepo(await donationsRepository.createCampaign({ ...parsed.data, created_by: userId, updated_by: userId } as any));
  }

  async updateCampaign(id: ID, dto: UpdateCampaignDTO, userId: ID): Promise<ServiceResult<CampaignRow>> {
    const parsed = updateCampaignSchema.safeParse(dto);
    if (!parsed.success) return fail(parsed.error.issues.map((e: { message: string }) => e.message).join(', '));
    return fromRepo(await donationsRepository.updateCampaign(id, { ...parsed.data, updated_by: userId } as any));
  }

  async activeCampaigns(limit = 10): Promise<ServiceResult<CampaignRow[]>> {
    return ok(await donationsRepository.activeCampaigns(limit));
  }
}

export const donationsService = new DonationsService();
