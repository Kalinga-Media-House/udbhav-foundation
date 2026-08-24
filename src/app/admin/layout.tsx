import { redirect } from 'next/navigation';
import React from 'react';

import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
import { GlobalSearch } from '@/components/admin/layout/GlobalSearch';
import { createClient } from '@/lib/supabase/server';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  // Retrieve authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // Authoritative server-side role check
  const { data: roleData, error: roleError } = await supabase
    .from('user_roles')
    .select('is_active, roles(slug)')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .limit(1)
    .single<{ is_active: boolean; roles: { slug: string } }>();

  if (roleError || !roleData) {
    // If no role found or error during retrieval, sign them out and redirect to unauthorized
    await supabase.auth.signOut();
    redirect('/login?error=unauthorized');
  }

  // Verify that the role is active and valid
  const validRoles = [
    'super-admin',
    'admin',
    'editor',
    'content-manager',
    'media-manager',
    'finance-manager',
    'volunteer-manager',
  ];
  const roleSlug = roleData.roles?.slug;

  if (!roleData.is_active || !roleSlug || !validRoles.includes(roleSlug)) {
    await supabase.auth.signOut();
    redirect('/login?error=unauthorized');
  }

  // If authorized, render the admin dashboard or nested admin pages
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-gray-50 font-sans text-gray-900 md:flex-row">
      <GlobalSearch />
      <AdminSidebar />
      <div className="flex w-full flex-1 flex-col overflow-x-hidden overflow-y-auto">
        <main className="h-full w-full p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
