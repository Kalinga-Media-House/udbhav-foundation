import type { NextResponse } from 'next/server';

/**
 * Applies strict security headers to the outgoing response.
 */
export const applySecurityHeaders = (response: NextResponse): NextResponse => {
  const headers = response.headers;

  headers.set('X-DNS-Prefetch-Control', 'on');
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  headers.set('X-Frame-Options', 'SAMEORIGIN');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  headers.set('X-XSS-Protection', '1; mode=block');

  return response;
};

