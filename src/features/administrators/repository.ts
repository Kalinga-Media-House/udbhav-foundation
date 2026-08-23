/* eslint-disable @typescript-eslint/no-explicit-any */
import { ROLES } from '@/constants/roles';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export interface AdministratorRow {
  user_id: string;
  role_id: string;
  role_slug: string;
  is_active: boolean;
  assigned_at: string;
  profile: {
    first_name: string;
    last_name: string | null;
    display_name: string;
    primary_email: string;
    status: string;
    slug: string;
  };
}

export const administratorsRepository = {
  /**
   * Fetches all admin/super-admin user_roles and then resolves their profiles.
   *
   * user_roles.user_id has NO foreign key to profiles (by design — see migration 003),
   * so we cannot use a PostgREST !inner join. Instead we query user_roles+roles first,
   * then fetch the corresponding profiles in a second query.
   */
  async getAdministrators(): Promise<AdministratorRow[]> {
    const supabase = await createServerSupabaseClient();

    // 1. Get admin role IDs
    const { data: adminRoles, error: rolesError } = await (supabase.from('roles') as any)
      .select('id, slug')
      .in('slug', [ROLES.SUPER_ADMIN, ROLES.ADMIN]);

    if (rolesError) {
      console.error('[getAdministrators] Roles Error:', rolesError);
      throw new Error(`Failed to fetch roles: ${rolesError.message}`);
    }

    if (!adminRoles || adminRoles.length === 0) {
      return [];
    }

    const roleIds = adminRoles.map((r: any) => r.id);
    const roleMap = new Map(adminRoles.map((r: any) => [r.id, r.slug]));

    // 2. Get user_roles for those role IDs
    const { data: userRoles, error: userRolesError } = await (supabase.from('user_roles') as any)
      .select('user_id, role_id, is_active, assigned_at')
      .in('role_id', roleIds)
      .order('assigned_at', { ascending: false });

    if (userRolesError) {
      console.error('[getAdministrators] UserRoles Error:', userRolesError);
      throw new Error(`Failed to fetch user roles: ${userRolesError.message}`);
    }

    if (!userRoles || userRoles.length === 0) {
      return [];
    }

    // 3. Get profiles for those user IDs
    const userIds = [...new Set(userRoles.map((ur: any) => ur.user_id))];
    const { data: profiles, error: profilesError } = await (supabase.from('profiles') as any)
      .select('id, first_name, last_name, display_name, primary_email, status, slug')
      .in('id', userIds);

    if (profilesError) {
      console.error('[getAdministrators] Profiles Error:', profilesError);
      throw new Error(`Failed to fetch profiles: ${profilesError.message}`);
    }

    const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]));

    // 4. Merge
    return userRoles
      .map((ur: any) => {
        const profile: any = profileMap.get(ur.user_id);
        if (!profile) return null; // Skip orphaned role records without a profile
        return {
          user_id: ur.user_id,
          role_id: ur.role_id,
          role_slug: roleMap.get(ur.role_id) || 'unknown',
          is_active: ur.is_active,
          assigned_at: ur.assigned_at,
          profile: {
            first_name: profile.first_name,
            last_name: profile.last_name,
            display_name: profile.display_name,
            primary_email: profile.primary_email,
            status: profile.status,
            slug: profile.slug,
          },
        };
      })
      .filter(Boolean) as AdministratorRow[];
  },

  async getRoleBySlug(slug: string) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await (supabase.from('roles') as any)
      .select('id, slug, is_active')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  }
};
