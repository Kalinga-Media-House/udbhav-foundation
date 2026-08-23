import { createStaticSupabaseClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database/database.generated';

export type SiteLinkRow = Database['public']['Tables']['site_links']['Row'];
export type SiteLinkInsert = Database['public']['Tables']['site_links']['Insert'];
export type SiteLinkUpdate = Database['public']['Tables']['site_links']['Update'];

export const siteLinksRepository = {
  async getBySlug(slug: string): Promise<SiteLinkRow | null> {
    const supabase = createStaticSupabaseClient();
    const { data, error } = await supabase
      .from('site_links')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error('Error fetching site_link by slug:', error);
      return null;
    }
    return data;
  },

  async getActiveBySlug(slug: string): Promise<SiteLinkRow | null> {
    const supabase = createStaticSupabaseClient();
    const { data, error } = await supabase
      .from('site_links')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Error fetching active site_link by slug:', error);
      return null;
    }
    return data;
  }
};
