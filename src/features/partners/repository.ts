/* eslint-disable no-console */
import { createClient } from '@/lib/supabase/server';

export interface PartnerRow {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type PartnerInsert = Omit<PartnerRow, 'id' | 'created_at' | 'updated_at'>;
export type PartnerUpdate = Partial<PartnerInsert>;

export async function getActivePartners(): Promise<PartnerRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching active partners:', error);
    return [];
  }
  return data || [];
}

export async function getAllPartners(): Promise<PartnerRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching all partners:', error);
    return [];
  }
  return data || [];
}

export async function createPartner(partner: PartnerInsert): Promise<PartnerRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('partners')
    .insert(partner)
    .select()
    .single();

  if (error) {
    console.error('Error creating partner:', error);
    return null;
  }
  return data;
}

export async function updatePartner(id: string, updates: PartnerUpdate): Promise<PartnerRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('partners')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating partner:', error);
    return null;
  }
  return data;
}

export async function deletePartner(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.from('partners').delete().eq('id', id);

  if (error) {
    console.error('Error deleting partner:', error);
    return false;
  }
  return true;
}
