/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/server';

export interface GoverningBodyMemberRow {
  id: string;
  full_name: string;
  designation: string;
  bio: string | null;
  photo_url: string | null;
  display_order: number;
  is_active: boolean;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch only active governing body members for public pages.
 * Ordered by display_order ASC.
 */
export async function getActiveGoverningBodyMembers(): Promise<GoverningBodyMemberRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('governing_body_members' as any)
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching active governing body members:', error);
    return [];
  }
  return (data as unknown as GoverningBodyMemberRow[]) || [];
}

/**
 * Fetch all governing body members for the admin dashboard.
 * Ordered by display_order ASC.
 */
export async function getAllGoverningBodyMembers(): Promise<GoverningBodyMemberRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('governing_body_members' as any)
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching all governing body members:', error);
    return [];
  }
  return (data as unknown as GoverningBodyMemberRow[]) || [];
}
