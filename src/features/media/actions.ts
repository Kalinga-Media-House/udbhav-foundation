'use server';

import { revalidateTag } from 'next/cache';

import { handleAction, requireAuth, requirePermission, CacheTags } from '@/contracts/actions';
import type { ActionResult } from '@/contracts/actions';

import type { MediaFileRow } from './repository';
import { mediaService } from './service';

/**
 * Protected action to soft-delete a media file record.
 * Requires 'media.delete' permission.
 *
 * @param id - Media file ID to delete.
 * @returns ActionResult wrapping deleted MediaFileRow.
 */
export async function deleteMedia(id: string): Promise<ActionResult<MediaFileRow>> {
  return handleAction('deleteMedia', async () => {
    const session = await requireAuth();
    requirePermission(session, 'media.delete');
    const result = await mediaService.remove(id, session.id);
    if (!result.success) throw new Error(result.error ?? 'Delete failed');
    revalidateTag(CacheTags.media());
    return result.data!;
  });
}
