import { createClient } from '@/lib/supabase/server';

import * as repository from './repository';

async function checkPermissions() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Unauthorized');

  let role = user.user_metadata?.role || user.app_metadata?.role;
  if (!role) {
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('is_active, roles(slug)')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .limit(1)
      .single<{ is_active: boolean; roles: { slug: string } }>();
    role = roleData?.roles?.slug;
  }
  const permissions = user.user_metadata?.permissions || user.app_metadata?.permissions || [];

  const isSuperAdmin = role === 'super-admin';
  const hasReportPerm =
    role === 'admin' || permissions.includes('report') || permissions.includes('reports_view');

  if (!isSuperAdmin && !hasReportPerm) {
    throw new Error('Forbidden: Insufficient permissions to access reports');
  }
}

export async function getDonationsReport() {
  await checkPermissions();
  return repository.fetchDonations();
}

export async function getContactsReport() {
  await checkPermissions();
  return repository.fetchContacts();
}

export async function getVolunteersReport() {
  await checkPermissions();
  return repository.fetchVolunteers();
}

export async function getUsersReport() {
  await checkPermissions();
  return repository.fetchUsers();
}
