import { rolesRepository } from "./repository";
import { Role, Permission, RolePermission } from "./types";
import { createClient } from "@/lib/supabase/server";

async function requirePermission(_permissionName: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Unauthorized");
  // In a real app we'd query the user's role_permissions here
}

export const rolesService = {
  async getAllRoles(): Promise<Role[]> {
    await requirePermission("roles.view");
    return rolesRepository.getAllRoles();
  },

  async getAllPermissions(): Promise<Permission[]> {
    await requirePermission("roles.view");
    return rolesRepository.getAllPermissions();
  },

  async getRolePermissions(): Promise<RolePermission[]> {
    await requirePermission("roles.view");
    return rolesRepository.getRolePermissions();
  },

  async updateRolePermissions(roleId: string, permissionIds: string[]): Promise<void> {
    await requirePermission("roles.manage");
    return rolesRepository.updateRolePermissions(roleId, permissionIds);
  }
};
