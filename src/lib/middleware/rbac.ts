import { ROLES } from '@/constants/roles';

/**
 * Validates if the user's role permits them to access the specific route.
 * Edge-compatible (no Node.js FS/crypto dependencies).
 */
export const checkRoleAccess = (pathname: string, userRole?: string): boolean => {
  if (!userRole) return false;
  
  // Super Admins bypass everything
  if (userRole === ROLES.SUPER_ADMIN) return true;

  // Explicit route restrictions can be defined here
  if (pathname.startsWith('/admin/settings')) {
    return userRole === ROLES.ADMIN;
  }

  // By default, if they hit this function, they are authenticated and trying to hit /admin
  return userRole === ROLES.ADMIN || userRole === ROLES.EDITOR || userRole === ROLES.MEMBER;
};
