"use server";
import { rolesService } from "./service";
import { Role, Permission, RolePermission } from "./types";

export async function fetchAllRoles(): Promise<Role[]> {
  return rolesService.getAllRoles();
}

export async function fetchAllPermissions(): Promise<Permission[]> {
  return rolesService.getAllPermissions();
}

export async function fetchRolePermissions(): Promise<RolePermission[]> {
  return rolesService.getRolePermissions();
}

export async function updateRolePermissions(roleId: string, permissionIds: string[]): Promise<void> {
  return rolesService.updateRolePermissions(roleId, permissionIds);
}
