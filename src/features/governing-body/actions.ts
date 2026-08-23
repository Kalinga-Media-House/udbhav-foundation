/* eslint-disable */
'use server';

import { revalidatePath } from 'next/cache';

import { deleteFile } from '@/lib/storage/delete';
import { createClient } from '@/lib/supabase/server';

export type GoverningBodyActionResponse = { success: boolean; error?: string };

interface MemberInput {
  full_name: string;
  designation: string;
  bio?: string | null;
  photo_url?: string | null;
  display_order?: number;
  is_active?: boolean;
}

function revalidateGoverningBodyPaths() {
  revalidatePath('/core-team');
  revalidatePath('/');
  revalidatePath('/admin/governing-body');
}

async function requireAdminAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return { supabase, user };
}

export async function addGoverningBodyMember(
  data: MemberInput
): Promise<GoverningBodyActionResponse> {
  try {
    const { supabase } = await requireAdminAuth();

    // Get the next display_order
    const { data: existing } = await (supabase.from('governing_body_members' as any) as any)
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1);

    const nextOrder = data.display_order ?? ((existing?.[0]?.display_order || 0) + 1);

    const { error } = await (supabase.from('governing_body_members' as any) as any)
      .insert({
        full_name: data.full_name,
        designation: data.designation,
        bio: data.bio || null,
        photo_url: data.photo_url || null,
        display_order: nextOrder,
        is_active: data.is_active ?? true,
      });

    if (error) {
      console.error('Error adding governing body member:', error);
      return { success: false, error: error.message };
    }

    revalidateGoverningBodyPaths();
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function updateGoverningBodyMember(
  id: string,
  data: Partial<MemberInput>
): Promise<GoverningBodyActionResponse> {
  try {
    const { supabase } = await requireAdminAuth();

    const updateData: Record<string, unknown> = {};
    if (data.full_name !== undefined) updateData.full_name = data.full_name;
    if (data.designation !== undefined) updateData.designation = data.designation;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.photo_url !== undefined) updateData.photo_url = data.photo_url;
    if (data.display_order !== undefined) updateData.display_order = data.display_order;
    if (data.is_active !== undefined) updateData.is_active = data.is_active;

    const { error } = await (supabase.from('governing_body_members' as any) as any)
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating governing body member:', error);
      return { success: false, error: error.message };
    }

    revalidateGoverningBodyPaths();
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function deleteGoverningBodyMember(
  id: string,
  photoUrl?: string | null
): Promise<GoverningBodyActionResponse> {
  try {
    const { supabase } = await requireAdminAuth();

    const { error } = await (supabase.from('governing_body_members' as any) as any)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting governing body member:', error);
      return { success: false, error: error.message };
    }

    // Cleanup R2 photo if exists
    if (photoUrl) {
      try {
        const urlObj = new URL(photoUrl);
        const pathname = urlObj.pathname.startsWith('/') ? urlObj.pathname.substring(1) : urlObj.pathname;
        if (pathname) {
          await deleteFile(pathname);
          await (supabase.from('media_files' as any) as any).delete().eq('r2_object_key', pathname);
        }
      } catch (deleteErr) {
        console.error('Failed to delete photo from R2/media_files:', deleteErr);
        // Non-fatal
      }
    }

    revalidateGoverningBodyPaths();
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function toggleGoverningBodyMemberVisibility(
  id: string,
  isActive: boolean
): Promise<GoverningBodyActionResponse> {
  try {
    const { supabase } = await requireAdminAuth();

    const { error } = await (supabase.from('governing_body_members' as any) as any)
      .update({ is_active: isActive })
      .eq('id', id);

    if (error) {
      console.error('Error toggling governing body member visibility:', error);
      return { success: false, error: error.message };
    }

    revalidateGoverningBodyPaths();
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function reorderGoverningBodyMembers(
  orderedIds: string[]
): Promise<GoverningBodyActionResponse> {
  try {
    const { supabase } = await requireAdminAuth();

    for (let i = 0; i < orderedIds.length; i++) {
      await (supabase.from('governing_body_members' as any) as any)
        .update({ display_order: i + 1 })
        .eq('id', orderedIds[i]);
    }

    revalidateGoverningBodyPaths();
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
