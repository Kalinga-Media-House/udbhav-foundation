import { ROLES, type RoleType } from '@/constants';
import { AuthenticationError, AuthorizationError } from '@/errors';

import { securityLogger } from '../logger/security-logger';

import { createServerSupabaseClient } from './server';


/**
 * Safely retrieves the current authenticated user without throwing.
 * Returns null if not authenticated.
 */
export const getCurrentUser = async () => {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
};

/**
 * Enforces that a user is authenticated.
 * Throws AuthenticationError if not logged in.
 */
export const requireUser = async () => {
  const user = await getCurrentUser();
  if (!user) {
    securityLogger.logViolation('AUTH_FAILURE', 'unknown', { reason: 'Missing session' });
    throw new AuthenticationError();
  }
  return user;
};

/**
 * Enforces that an authenticated user has a specific role.
 * Throws AuthorizationError if role mismatch.
 */
export const requireRole = async (requiredRole: RoleType) => {
  const user = await requireUser();
  
  // NOTE: Role fetching logic will depend on how the database triggers copy roles to user_metadata.
  // Assuming role is stored in user_metadata for this helper.
  const userRole = user.user_metadata?.role;

  if (userRole !== requiredRole && userRole !== ROLES.SUPER_ADMIN) {
    securityLogger.logViolation('RLS_VIOLATION', 'unknown', { 
      userId: user.id, 
      requiredRole, 
      actualRole: userRole 
    });
    throw new AuthorizationError(`Role ${requiredRole} required.`);
  }

  return user;
};
