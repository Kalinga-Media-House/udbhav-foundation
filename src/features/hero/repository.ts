/* eslint-disable no-console */
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';

export type HeroImageRow = Database['public']['Tables']['hero_images']['Row'];

/**
 * Fetch all active hero images for a specific section, ordered by display_order.
 * This is used by public pages.
 */
export async function getActiveHeroImages(section: 'home_hero' | 'programmes_hero'): Promise<HeroImageRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('hero_images')
    .select('*')
    .eq('section', section)
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching active hero images:', error);
    return [];
  }
  return data;
}

/**
 * Fetch all hero images (active and inactive) for the admin dashboard.
 */
export async function getAdminHeroImages(section: 'home_hero' | 'programmes_hero'): Promise<HeroImageRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('hero_images')
    .select('*')
    .eq('section', section)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching admin hero images:', error);
    return [];
  }
  return data;
}
