'use server';

import { revalidatePath } from 'next/cache';

import type { SocialLinkInsert, SocialLinkUpdate } from './repository';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function addSocialLink(data: SocialLinkInsert) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Check auth
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData?.user) {
      return { success: false, error: 'Unauthorized' };
    }

    const { error } = await supabase
      .from('site_social_links')
      .insert(data);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'An error occurred' };
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
  } catch (error: any) {
    return { success: false, error: error.message || 'An error occurred' };
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
  } catch (error: any) {
    return { success: false, error: error.message || 'An error occurred' };
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
  } catch (error: any) {
    return { success: false, error: error.message || 'An error occurred' };
  }
}
