import { type NextRequest } from 'next/server';

import { updateSession } from '@/lib/supabase/middleware';

import { isAuthRoute, isAdminRoute } from './helpers';
import { checkRoleAccess } from './rbac';
import { redirectToLogin, redirectToDashboard, redirectToForbidden } from './redirects';

/**
 * Core Authentication and Route Protection Middleware block.
 * Syncs cookies and validates route permissions based on session.
 */
export const enforceAuthentication = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  
  // 1. Sync session and refresh cookies via Supabase
  const response = await updateSession(request);
  

  // To avoid hitting the DB in Edge, we can rely on standard Supabase session parsing.
  // Actually, updateSession already guarantees auth.getUser() has run inside it.
  // We need to fetch the user again to do RBAC, but we can do it efficiently.
  const { createServerClient } = await import('@supabase/ssr');
  const { env } = await import('@/config/env');
  
  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll() {} // handled by updateSession
      }
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const isAuthenticated = !!user;

  // 2. Auth Routes (Login, Register)
  if (isAuthRoute(pathname)) {
    if (isAuthenticated) {
      return redirectToDashboard(request.url);
    }
    return response;
  }

  // 3. Admin/Protected Routes
  if (isAdminRoute(pathname)) {
    if (!isAuthenticated) {
      return redirectToLogin(request.url);
    }
    
    // 4. RBAC Check
    const role = user?.user_metadata?.role;
    if (!checkRoleAccess(pathname, role)) {
      return redirectToForbidden(request.url);
    }
  }

  // 5. Default pass-through
  return response;
};
