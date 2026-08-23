'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

import { deleteFile } from '@/lib/storage/delete';
import { createClient } from '@/lib/supabase/server';

import type { PartnerUpdate } from './repository';

export type PartnerActionResponse = { success: boolean; error?: string };

interface PartnerInput {
  name: string;
  website_url?: string | null;
  logo_url?: string | null;
  display_order?: number;
  is_active?: boolean;
}

function revalidatePartnerPaths() {
  revalidatePath('/');
  revalidatePath('/admin/partners');
  revalidateTag('partners');
}

async function requireAdminAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return { supabase, user };
}

export async function addPartner(
  data: PartnerInput
): Promise<PartnerActionResponse> {
  try {
    const { supabase } = await requireAdminAuth();

    // Get the next display_order
    const { data: existing } = await supabase
      .from('partners')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1);

    const nextOrder = data.display_order ?? ((existing?.[0]?.display_order || 0) + 1);

    const { error } = await supabase
      .from('partners')
      .insert({
        name: data.name,
        website_url: data.website_url || null,
        logo_url: data.logo_url || null,
        display_order: nextOrder,
        is_active: data.is_active ?? true,
      });

    if (error) {
      console.error('Error adding partner:', error);
      return { success: false, error: error.message };
    }

    revalidatePartnerPaths();
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function updatePartnerData(
  id: string,
  data: Partial<PartnerInput>
): Promise<PartnerActionResponse> {
  try {
    const { supabase } = await requireAdminAuth();

    const updateData: PartnerUpdate = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.website_url !== undefined) updateData.website_url = data.website_url;
    if (data.logo_url !== undefined) updateData.logo_url = data.logo_url;
    if (data.display_order !== undefined) updateData.display_order = data.display_order;
    if (data.is_active !== undefined) updateData.is_active = data.is_active;

    const { error } = await supabase
      .from('partners')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating partner:', error);
      return { success: false, error: error.message };
    }

    revalidatePartnerPaths();
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function deletePartnerData(
  id: string,
  logoUrl?: string | null
): Promise<PartnerActionResponse> {
  try {
    const { supabase } = await requireAdminAuth();

    const { error } = await supabase
      .from('partners')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting partner:', error);
      return { success: false, error: error.message };
    }

    // Cleanup R2 photo if exists
    if (logoUrl) {
      try {
        const urlObj = new URL(logoUrl);
        const pathname = urlObj.pathname.startsWith('/') ? urlObj.pathname.substring(1) : urlObj.pathname;
        if (pathname) {
          await deleteFile(pathname);
          await supabase.from('media_files').delete().eq('r2_object_key', pathname);
        }
      } catch (deleteErr) {
        console.error('Failed to delete logo from R2/media_files:', deleteErr);
      }
    }

    revalidatePartnerPaths();
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function togglePartnerVisibility(
  id: string,
  isActive: boolean
): Promise<PartnerActionResponse> {
  try {
    const { supabase } = await requireAdminAuth();

    const { error } = await supabase
      .from('partners')
      .update({ is_active: isActive })
      .eq('id', id);

    if (error) {
      console.error('Error toggling partner visibility:', error);
      return { success: false, error: error.message };
    }

    revalidatePartnerPaths();
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function reorderPartners(
  orderedIds: string[]
): Promise<PartnerActionResponse> {
  try {
    const { supabase } = await requireAdminAuth();

    for (let i = 0; i < orderedIds.length; i++) {
      await supabase
        .from('partners')
        .update({ display_order: i + 1 })
        .eq('id', orderedIds[i]);
    }

    revalidatePartnerPaths();
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
