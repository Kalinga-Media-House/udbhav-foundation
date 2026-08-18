/**
 * Shared Action Helpers.
 * Thin utilities used by every server action to enforce authentication,
 * handle errors uniformly, and return consistent ActionResult payloads.
 */

import { AuthenticationError, AuthorizationError, AppError } from '@/errors';
import { serverLogger } from '@/lib/logger/server-logger';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { UserSession, ID } from '@/types';

/**
 * The result shape returned by every server action to the UI layer.
 */
export interface ActionResult<T = unknown> {
  success: boolean;
  data: T | null;
  error: string | null;
}

/**
 * Returns the authenticated user's session or throws AuthenticationError.
 * This is the single gateway for every protected server action.
 */
export async function requireAuth(): Promise<UserSession> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new AuthenticationError();
  }

  // 1. Fetch Profile
  const { data: profile, error: profileError } = await (supabase.from('profiles') as any)
    .select('id, primary_email')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) {
    console.error(
      `[requireAuth] Profile Fetch Error (Code: ${profileError.code}):`,
      profileError.message
    );
    throw new AuthenticationError(`Database Error: ${profileError.message}`);
  }

  if (!profile) {
    throw new AuthenticationError('User profile not found.');
  }

  // 2. Fetch User Role
  const { data: userRole, error: roleError } = await (supabase.from('user_roles') as any)
    .select(
      `
      role_id,
      roles ( slug )
    `
    )
    .eq('user_id', user.id)
    .eq('is_active', true)
    .maybeSingle();

  if (roleError) {
    console.error(`[requireAuth] Role Fetch Error (Code: ${roleError.code}):`, roleError.message);
    throw new AuthenticationError(`Database Error: ${roleError.message}`);
  }

  const roleSlug = userRole?.roles?.slug || 'guest';
  const roleId = userRole?.role_id;

  // 3. Fetch Permissions
  let permissionKeys: string[] = [];
  if (roleId) {
    const { data: rolePerms, error: permError } = await (supabase.from('role_permissions') as any)
      .select(
        `
        permissions ( code )
      `
      )
      .eq('role_id', roleId);

    if (permError) {
      console.error(
        `[requireAuth] Permissions Fetch Error (Code: ${permError.code}):`,
        permError.message
      );
    } else if (rolePerms) {
      permissionKeys = rolePerms.map((rp: any) => rp.permissions?.code).filter(Boolean);
    }
  }

  return {
    id: profile.id,
    email: profile.primary_email || user.email || '',
    role: roleSlug,
    permissions: permissionKeys,
  };
}

/**
 * Asserts the user has the specified permission key.
 * Throws AuthorizationError if missing.
 */
export function requirePermission(session: UserSession, permission: string): void {
  if (!session.permissions.includes(permission) && session.role !== 'super-admin') {
    throw new AuthorizationError(`Missing permission: ${permission}`);
  }
}

/**
 * Wraps any server action handler with standardized error handling.
 * Converts all thrown errors into a safe ActionResult shape.
 */
export async function handleAction<T>(
  actionName: string,
  handler: () => Promise<T>
): Promise<ActionResult<T>> {
  try {
    const data = await handler();
    return { success: true, data, error: null };
  } catch (err) {
    if (err instanceof AppError) {
      serverLogger.warn(`Action "${actionName}" failed: ${err.message}`, { code: err.code });
      return { success: false, data: null, error: err.message };
    }

    const unknownError = err instanceof Error ? err : new Error(String(err));
    serverLogger.error(`Action "${actionName}" unexpected error`, unknownError);
    return { success: false, data: null, error: unknownError.message };
  }
}

/**
 * Type-safe cache tag factory for consistent revalidation.
 */
export const CacheTags = {
  programs: () => 'programs' as const,
  program: (id: ID) => `program-${id}` as const,
  events: () => 'events' as const,
  event: (id: ID) => `event-${id}` as const,
  volunteers: () => 'volunteers' as const,
  volunteer: (id: ID) => `volunteer-${id}` as const,
  news: () => 'news' as const,
  article: (id: ID) => `article-${id}` as const,
  gallery: () => 'gallery' as const,
  album: (id: ID) => `album-${id}` as const,
  donations: () => 'donations' as const,
  campaigns: () => 'campaigns' as const,
  contacts: () => 'contacts' as const,
  contact: (id: ID) => `contact-${id}` as const,
  enquiry: (id: ID) => `enquiry-${id}` as const,
  dashboard: () => 'dashboard' as const,
  notifications: (userId: ID) => `notifications-${userId}` as const,
  media: () => 'media' as const,
  profiles: () => 'profiles' as const,
  profile: (id: ID) => `profile-${id}` as const,
  indexInitiatives: () => 'index-initiatives' as const,
  indexInitiative: (id: ID) => `index-initiative-${id}` as const,
  governingBody: () => 'governing-body' as const,
} as const;
