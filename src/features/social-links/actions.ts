'use server';

import { revalidatePath } from 'next/cache';

import { createServerSupabaseClient } from '@/lib/supabase/server';

import type { SocialLinkInsert, SocialLinkUpdate } from './repository';

export async function addSocialLink(data: SocialLinkInsert) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Check auth
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData?.user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Use upsert to handle the unique constraint on platform.
    // If a row with the same platform already exists, update it instead of inserting.
    const { data: saved, error } = await supabase
      .from('site_social_links')
      .upsert(data, { onConflict: 'platform' })
      .select()
      .maybeSingle();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/', 'layout');
    return { success: true, data: saved };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'An error occurred' };
  }
}

export async function updateSocialLink(id: string, data: SocialLinkUpdate) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Check auth
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData?.user) {
      return { success: false, error: 'Unauthorized' };
    }

    const { error } = await supabase
      .from('site_social_links')
      .update(data)
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'An error occurred' };
  }
}

export async function deleteSocialLink(id: string) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Check auth
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData?.user) {
      return { success: false, error: 'Unauthorized' };
    }

    const { error } = await supabase
      .from('site_social_links')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'An error occurred' };
  }
}

export async function reorderSocialLinks(updates: { id: string; display_order: number }[]) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Check auth
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData?.user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Process updates sequentially to avoid complex rpc calls if we don't need them
    for (const update of updates) {
      await supabase
        .from('site_social_links')
        .update({ display_order: update.display_order })
        .eq('id', update.id);
    }

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'An error occurred' };
  }
}
