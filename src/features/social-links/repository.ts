import { createStaticSupabaseClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database/database.generated';

export type SocialLinkRow = Database['public']['Tables']['site_social_links']['Row'];
export type SocialLinkInsert = Database['public']['Tables']['site_social_links']['Insert'];
export type SocialLinkUpdate = Database['public']['Tables']['site_social_links']['Update'];

export const socialLinksRepository = {
  /** Fetch all social links ordered by display_order */
  async getAll(): Promise<SocialLinkRow[]> {
    const supabase = createStaticSupabaseClient();
    const { data, error } = await supabase
      .from('site_social_links')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching site_social_links:', error);
      return [];
    }
    return data || [];
  },

  /** Fetch active social links for the public footer */
  async getActiveLinks(): Promise<SocialLinkRow[]> {
    const supabase = createStaticSupabaseClient();
    const { data, error } = await supabase
      .from('site_social_links')
      .select('*')
      .eq('is_visible', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching active site_social_links:', error);
      return [];
    }
    return data || [];
  }
};
