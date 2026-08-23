/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { revalidateTag, revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';

import type { SiteLinkUpdate, SiteLinkInsert } from './repository';

// Note: Reusing the admin authentication logic used in other actions
const requireAdminAuth = async () => {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Unauthorized');
  }

  // Double check roles via user_roles or RLS (RLS already enforces this)
  return { supabase, user };
};

export async function upsertSiteLink(slug: string, data: Partial<SiteLinkInsert>) {
  try {
    const { supabase } = await requireAdminAuth();
    
    // Check if it exists
    const { data: existing } = await supabase
      .from('site_links')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('site_links')
        .update(data as SiteLinkUpdate)
        .eq('slug', slug);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('site_links')
        .insert({ slug, ...data } as SiteLinkInsert);

      if (error) throw error;
    }

    revalidateTag('site-links');
    revalidatePath('/podcast');
    revalidatePath('/admin/settings');
    
    return { success: true };
  } catch (error: any) {
    console.error('Error upserting site_link:', error);
    return { success: false, error: error.message };
  }
}

export async function toggleSiteLink(slug: string, is_active: boolean) {
  try {
    const { supabase } = await requireAdminAuth();

    const { error } = await supabase
      .from('site_links')
      .update({ is_active })
      .eq('slug', slug);

    if (error) throw error;

    revalidateTag('site-links');
    revalidatePath('/podcast');
    revalidatePath('/admin/settings');
    
    return { success: true };
  } catch (error: any) {
    console.error('Error toggling site_link:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteSiteLink(slug: string) {
  try {
    const { supabase } = await requireAdminAuth();

    const { error } = await supabase
      .from('site_links')
      .delete()
      .eq('slug', slug);

    if (error) throw error;

    revalidateTag('site-links');
    revalidatePath('/podcast');
    revalidatePath('/admin/settings');
    
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting site_link:', error);
    return { success: false, error: error.message };
  }
}
