import { createClient } from '@/lib/supabase/server';

export async function fetchDonations() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('donations').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchContacts() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchVolunteers() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('volunteers').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchUsers() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}
