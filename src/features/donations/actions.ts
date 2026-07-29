'use server';

import { revalidateTag } from 'next/cache';

import { handleAction, requireAuth, requirePermission, CacheTags } from '@/contracts/actions';
import type { ActionResult } from '@/contracts/actions';
import type { PaginatedResult } from '@/contracts/repositories';
import type { Pagination } from '@/types';

import type { DonationRow, CampaignRow } from './repository';
import { donationsService } from './service';
import type { CreateDonationDTO, CreateCampaignDTO, UpdateCampaignDTO } from './validators';

/**
 * Server action to create a donation.
 * Requires authentication.
 * @param dto - Create donation payload.
 * @returns ActionResult containing created DonationRow.
 */
export async function createDonation(dto: CreateDonationDTO): Promise<ActionResult<DonationRow>> {
  return handleAction('createDonation', async () => {
    const session = await requireAuth();
    const result = await donationsService.createDonation(dto, session.id);
    if (!result.success) throw new Error(result.error ?? 'Failed');
    revalidateTag(CacheTags.donations());
    return result.data!;
  });
}

/**
 * Server action to create a donation campaign.
 * Requires authentication and 'donations.manage' permission.
 * @param dto - Create campaign payload.
 * @returns ActionResult containing created CampaignRow.
 */
export async function createCampaign(dto: CreateCampaignDTO): Promise<ActionResult<CampaignRow>> {
  return handleAction('createCampaign', async () => {
    const session = await requireAuth();
    requirePermission(session, 'donations.manage');
    const result = await donationsService.createCampaign(dto, session.id);
    if (!result.success) throw new Error(result.error ?? 'Failed');
    revalidateTag(CacheTags.campaigns());
    return result.data!;
  });
}

/**
 * Server action to update a donation campaign.
 * Requires authentication and 'donations.manage' permission.
 * @param id - Campaign ID to update.
 * @param dto - Update campaign payload.
 * @returns ActionResult containing updated CampaignRow.
 */
export async function updateCampaign(id: string, dto: UpdateCampaignDTO): Promise<ActionResult<CampaignRow>> {
  return handleAction('updateCampaign', async () => {
    const session = await requireAuth();
    requirePermission(session, 'donations.manage');
    const result = await donationsService.updateCampaign(id, dto, session.id);
    if (!result.success) throw new Error(result.error ?? 'Failed');
    revalidateTag(CacheTags.campaigns());
    return result.data!;
  });
}

/**
 * Server action to list donations with pagination and optional filters.
 * Requires authentication and 'donations.read' permission.
 * @param pagination - Pagination configuration.
 * @param filters - Optional query filters.
 * @returns ActionResult containing paginated DonationRow results.
 */
export async function listDonations(pagination: Pagination, filters?: Record<string, unknown>): Promise<ActionResult<PaginatedResult<DonationRow>>> {
  return handleAction('listDonations', async () => {
    const session = await requireAuth();
    requirePermission(session, 'donations.read');
    const result = await donationsService.listDonations(pagination, filters);
    if (!result.success) throw new Error(result.error ?? 'Failed');
    return result.data!;
  });
}
