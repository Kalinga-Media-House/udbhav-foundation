/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { revalidateTag } from 'next/cache';

import { handleAction, requireAuth, requirePermission, CacheTags } from '@/contracts/actions';
import type { ActionResult } from '@/contracts/actions';
import type { PaginatedResult } from '@/contracts/repositories';
import type { Pagination } from '@/types';

import type { IndexInitiativeWithMedia, IndexInitiativeRow } from './repository';
import { indexService } from './service';
import type { CreateIndexInitiativeDTO, UpdateIndexInitiativeDTO, ManageInitiativeGalleryDTO } from './validators';

/** Server action to list index initiatives. Publicly accessible. */
export async function listIndexInitiatives(
  pagination: Pagination = { page: 1, limit: 12 },
  filters?: Record<string, unknown>,
  search?: string,
  sort?: { column: string; order: 'asc' | 'desc' }
): Promise<ActionResult<PaginatedResult<IndexInitiativeWithMedia>>> {
  return handleAction('listIndexInitiatives', async () => {
    const result = await indexService.list(pagination, filters, search, sort);
    if (!result.success) throw new Error(result.error ?? 'Failed to load initiatives');
    return result.data!;
  });
}

/** Server action to fetch a single index initiative by slug. Publicly accessible. */
export async function getIndexInitiativeBySlug(slug: string): Promise<ActionResult<IndexInitiativeWithMedia>> {
  return handleAction('getIndexInitiativeBySlug', async () => {
    const result = await indexService.getBySlug(slug);
    if (!result.success || !result.data) throw new Error(result.error ?? 'Initiative not found');
    return result.data;
  });
}

/** Server action to fetch related initiatives for "Explore More Initiatives". */
export async function getRelatedIndexInitiatives(
  currentId: string,
  initiativeType: string,
  year: number
): Promise<ActionResult<IndexInitiativeWithMedia[]>> {
  return handleAction('getRelatedIndexInitiatives', async () => {
    const result = await indexService.getRelated(currentId, initiativeType, year);
    if (!result.success) throw new Error(result.error ?? 'Failed to load related initiatives');
    return result.data!;
  });
}

/** Server action to fetch adjacent (prev/next) initiatives. */
export async function getAdjacentIndexInitiatives(
  currentId: string,
  displayOrder: number
): Promise<ActionResult<{ prev: IndexInitiativeWithMedia | null; next: IndexInitiativeWithMedia | null }>> {
  return handleAction('getAdjacentIndexInitiatives', async () => {
    const result = await indexService.getAdjacent(currentId, displayOrder);
    if (!result.success) throw new Error(result.error ?? 'Failed to load adjacent initiatives');
    return result.data!;
  });
}

/** Server action to create a new initiative. Protected by admin auth. */
export async function createIndexInitiative(dto: CreateIndexInitiativeDTO): Promise<ActionResult<IndexInitiativeRow>> {
  return handleAction('createIndexInitiative', async () => {
    const session = await requireAuth();
    requirePermission(session, 'settings.manage');
    const result = await indexService.create(dto, session.id);
    if (!result.success) throw new Error(result.error ?? 'Creation failed');
    (revalidateTag as any)(CacheTags.indexInitiatives());
    return result.data!;
  });
}

/** Server action to update an existing initiative. Protected by admin auth. */
export async function updateIndexInitiative(id: string, dto: UpdateIndexInitiativeDTO): Promise<ActionResult<IndexInitiativeRow>> {
  return handleAction('updateIndexInitiative', async () => {
    const session = await requireAuth();
    requirePermission(session, 'settings.manage');
    const result = await indexService.update(id, dto, session.id);
    if (!result.success) throw new Error(result.error ?? 'Update failed');
    (revalidateTag as any)(CacheTags.indexInitiatives());
    (revalidateTag as any)(CacheTags.indexInitiative(id));
    return result.data!;
  });
}

/** Server action to soft delete an initiative. Protected by admin auth. */
export async function deleteIndexInitiative(id: string): Promise<ActionResult<IndexInitiativeRow>> {
  return handleAction('deleteIndexInitiative', async () => {
    const session = await requireAuth();
    requirePermission(session, 'settings.manage');
    const result = await indexService.delete(id, session.id);
    if (!result.success) throw new Error(result.error ?? 'Deletion failed');
    (revalidateTag as any)(CacheTags.indexInitiatives());
    return result.data!;
  });
}

/** Server action to manage gallery photos for an initiative. Protected by admin auth. */
export async function manageIndexInitiativeGallery(id: string, dto: ManageInitiativeGalleryDTO): Promise<ActionResult<boolean>> {
  return handleAction('manageIndexInitiativeGallery', async () => {
    const session = await requireAuth();
    requirePermission(session, 'settings.manage');
    const result = await indexService.manageGallery(id, dto);
    if (!result.success) throw new Error(result.error ?? 'Gallery update failed');
    (revalidateTag as any)(CacheTags.indexInitiatives());
    (revalidateTag as any)(CacheTags.indexInitiative(id));
    return true;
  });
}
