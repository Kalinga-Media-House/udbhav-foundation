import { rolesRepository } from './repository';
import type { Role, Permission, RolePermission } from './types';

export const rolesService = {
  async getAllRoles(): Promise<Role[]> {
    return rolesRepository.getAllRoles();
  },

  async getAllPermissions(): Promise<Permission[]> {
    return rolesRepository.getAllPermissions();
  },

  async getRolePermissions(): Promise<RolePermission[]> {
    return rolesRepository.getRolePermissions();
  },

  async updateRolePermissions(roleId: string, permissionIds: string[]): Promise<void> {
    return rolesRepository.updateRolePermissions(roleId, permissionIds);
  },
};
