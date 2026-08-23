import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ROLES } from '@/constants/roles';

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
  async getAdministrators() {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        user_id,
        role_id,
        is_active,
        assigned_at,
        roles!inner(slug),
        profiles!inner(
          first_name,
          last_name,
          display_name,
          primary_email,
          status,
          slug
        )
      `)
      .in('roles.slug', [ROLES.SUPER_ADMIN, ROLES.ADMIN])
      .order('assigned_at', { ascending: false });

    if (error) {
      console.error('[getAdministrators] Error:', error);
      throw new Error(`Failed to fetch administrators: ${error.message}`);
    }

    // Map to a flatter structure
    return (data || []).map((row: any) => ({
      user_id: row.user_id,
      role_id: row.role_id,
      role_slug: row.roles.slug,
      is_active: row.is_active,
      assigned_at: row.assigned_at,
      profile: Array.isArray(row.profiles) ? row.profiles[0] : row.profiles
    })) as AdministratorRow[];
  },

  async getRoleBySlug(slug: string) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('roles')
      .select('id, slug, is_active')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data;
  }
};
