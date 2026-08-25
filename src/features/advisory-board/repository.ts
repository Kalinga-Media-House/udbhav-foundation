/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/server';

export interface AdvisoryBoardMemberRow {
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
 * Fetch only active advisory board members for public pages.
 * Ordered by display_order ASC.
 */
export async function getActiveAdvisoryBoardMembers(): Promise<AdvisoryBoardMemberRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('advisory_board_members' as any)
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching active advisory board members:', error);
    return [];
  }
  return (data as unknown as AdvisoryBoardMemberRow[]) || [];
}

/**
 * Fetch all advisory board members for the admin dashboard.
 * Ordered by display_order ASC.
 */
export async function getAllAdvisoryBoardMembers(): Promise<AdvisoryBoardMemberRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('advisory_board_members' as any)
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching all advisory board members:', error);
    return [];
  }
  return (data as unknown as AdvisoryBoardMemberRow[]) || [];
}
