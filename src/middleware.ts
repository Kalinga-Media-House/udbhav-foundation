import { type NextRequest } from 'next/server';

import { enforceAuthentication } from '@/lib/middleware/auth';
import { applySecurityHeaders } from '@/lib/middleware/headers';

/**
 * Next.js Edge Middleware
 * This runs before every request defined in the matcher.
 */
export async function middleware(request: NextRequest) {
  // 1. Enforce Authentication & Route Protection (which also syncs cookies)
  let response = await enforceAuthentication(request);
  
  // 2. Apply Security Headers (CSP, HSTS, XSS Protection)
  response = applySecurityHeaders(response);
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
