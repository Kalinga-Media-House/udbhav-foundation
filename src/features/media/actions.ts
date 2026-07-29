'use server';

import { revalidateTag } from 'next/cache';

import { handleAction, requireAuth, requirePermission, CacheTags } from '@/contracts/actions';
import type { ActionResult } from '@/contracts/actions';

import type { MediaFileRow } from './repository';
import { mediaService } from './service';

/**
 * Protected action to upload a file via multipart FormData.
 * Requires 'media.upload' permission.
 *
 * @param formData - FormData containing 'file', optional 'folder', 'entityType', and 'entityId'.
 * @returns ActionResult wrapping created MediaFileRow.
 */
export async function uploadMedia(formData: FormData): Promise<ActionResult<MediaFileRow>> {
  return handleAction('uploadMedia', async () => {
    const session = await requireAuth();
    requirePermission(session, 'media.upload');
    const file = formData.get('file') as File;
    if (!file) throw new Error('No file provided');
    const buffer = Buffer.from(await file.arrayBuffer());
    const folder = (formData.get('folder') as string) || 'uploads';
    const entityType = formData.get('entityType') as string | null;
    const entityId = formData.get('entityId') as string | null;
    const result = await mediaService.upload(
      buffer,
      file.name,
      file.type,
      folder,
      entityType,
      entityId,
      session.id
    );
    if (!result.success) throw new Error(result.error ?? 'Upload failed');
    revalidateTag(CacheTags.media());
    return result.data!;
  });
}

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
