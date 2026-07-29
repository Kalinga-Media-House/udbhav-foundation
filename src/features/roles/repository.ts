import { createClient } from "@/lib/supabase/server";
import { Role, Permission, RolePermission } from "./types";

export const rolesRepository = {
  async getAllRoles(): Promise<Role[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('roles').select('*').order('name');
    if (error) throw new Error(error.message);
    return data || [];
  },

  async getAllPermissions(): Promise<Permission[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('permissions').select('*').order('name');
    if (error) throw new Error(error.message);
    return data || [];
  },

  async getRolePermissions(): Promise<RolePermission[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('role_permissions').select('*');
    if (error) throw new Error(error.message);
    return data || [];
  },

  async updateRolePermissions(roleId: string, permissionIds: string[]): Promise<void> {
    const supabase = await createClient();
    // Delete existing
    const { error: deleteError } = await supabase
      .from('role_permissions')
      .delete()
      .eq('role_id', roleId);
    if (deleteError) throw new Error(deleteError.message);

    if (permissionIds.length > 0) {
      // Insert new
      const { error: insertError } = await supabase
        .from('role_permissions')
        .insert(permissionIds.map(pid => ({ role_id: roleId, permission_id: pid })));
      if (insertError) throw new Error(insertError.message);
    }
  }
};
