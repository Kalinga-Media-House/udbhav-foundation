'use server';

import { revalidateTag } from 'next/cache';

import { handleAction, requireAuth, CacheTags } from '@/contracts/actions';
import type { ActionResult } from '@/contracts/actions';

import { profilesService } from './service';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { ProfileRow } from './service';

/**
 * Protected action to fetch current authenticated user profile.
 *
 * @returns ActionResult wrapping user ProfileRow.
 */
export async function getMyProfile(): Promise<ActionResult<ProfileRow>> {
  return handleAction('getMyProfile', async () => {
    const session = await requireAuth();
    const result = await profilesService.getById(session.id);
    if (!result.success) throw new Error(result.error ?? 'Failed');
    return result.data!;
  });
}

/**
 * Protected action to update current authenticated user profile.
 *
 * @param updates - Partial profile fields to update.
 * @returns ActionResult wrapping updated user ProfileRow.
 */
export async function updateMyProfile(
  updates: Partial<ProfileRow>
): Promise<ActionResult<ProfileRow>> {
  return handleAction('updateMyProfile', async () => {
    const session = await requireAuth();
    const result = await profilesService.updateProfile(session.id, updates);
    if (!result.success) throw new Error(result.error ?? 'Failed');
    revalidateTag(CacheTags.profile(session.id));
    return result.data!;
  });
}

export async function updatePassword(password: string): Promise<ActionResult<void>> {
  return handleAction('updatePassword', async () => {
    const session = await requireAuth();
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw new Error(error.message);
    return;
  });
}

import { uploadFile } from '@/lib/storage/upload';
export async function uploadAvatar(formData: FormData): Promise<ActionResult<string>> {
  return handleAction('uploadAvatar', async () => {
    const session = await requireAuth();
    const file = formData.get('avatar') as File;
    if (!file) throw new Error('No file');
    const buffer = Buffer.from(await file.arrayBuffer());
    const res = await uploadFile(buffer, file.name, { folder: 'avatars/' + session.id, contentType: file.type, maxSizeMB: 2 });
    if (res.error) throw new Error(res.error.message);
    const url = res.data.url;
    const upd = await profilesService.updateProfile(session.id, { avatar_url: url });
    if (!upd.success) throw new Error(upd.error ?? 'Update failed');
    revalidateTag(CacheTags.profile(session.id));
    return url;
  });
}
