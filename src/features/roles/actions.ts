'use server';

import {
  handleAction,
  requireAuth,
  requirePermission,
  type ActionResult,
} from '@/contracts/actions';

import { rolesService } from './service';
import type { Role, Permission, RolePermission } from './types';

export async function fetchAllRoles(): Promise<ActionResult<Role[]>> {
  return handleAction('fetchAllRoles', async () => {
    const session = await requireAuth();
    requirePermission(session, 'roles.view');
    return rolesService.getAllRoles();
  });
}

export async function fetchAllPermissions(): Promise<ActionResult<Permission[]>> {
  return handleAction('fetchAllPermissions', async () => {
    const session = await requireAuth();
    requirePermission(session, 'roles.view');
    return rolesService.getAllPermissions();
  });
}

export async function fetchRolePermissions(): Promise<ActionResult<RolePermission[]>> {
  return handleAction('fetchRolePermissions', async () => {
    const session = await requireAuth();
    requirePermission(session, 'roles.view');
    return rolesService.getRolePermissions();
  });
}

export async function updateRolePermissions(
  roleId: string,
  permissionIds: string[]
): Promise<ActionResult<void>> {
  return handleAction('updateRolePermissions', async () => {
    const session = await requireAuth();
    requirePermission(session, 'roles.manage');
    return rolesService.updateRolePermissions(roleId, permissionIds);
  });
}
