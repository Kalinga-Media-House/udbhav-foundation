/**
 * Shared Action Helpers.
 * Thin utilities used by every server action to enforce authentication,
 * handle errors uniformly, and return consistent ActionResult payloads.
 */

import { AuthenticationError, AuthorizationError, AppError } from '@/errors';
import { serverLogger } from "@/lib/logger/server-logger";
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
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new AuthenticationError();
  }

  // Fetch full profile to get role + permissions
  const { data: profile } = await (supabase
    .from('profiles') as any)
    .select('id, email, role')
    .eq('id', user.id)
    .single();

  if (!profile) {
    throw new AuthenticationError('User profile not found.');
  }

  // Fetch permissions from role_permissions join
  const { data: permissions } = await (supabase
    .from('role_permissions') as any)
    .select('permission_key')
    .eq('role_id', profile.role);

  return {
    id: profile.id,
    email: profile.email,
    role: profile.role,
    permissions: (permissions ?? []).map((p: { permission_key: string }) => p.permission_key),
  };
}

/**
 * Asserts the user has the specified permission key.
 * Throws AuthorizationError if missing.
 */
export function requirePermission(session: UserSession, permission: string): void {
  if (!session.permissions.includes(permission) && session.role !== 'SuperAdmin') {
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
    return { success: false, data: null, error: 'An unexpected error occurred.' };
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
} as const;
