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

  const isProd = process.env.NODE_ENV === 'production';
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://checkout.razorpay.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://api.dicebear.com https://avatars.githubusercontent.com https://media.udbhavfoundation.in;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' http://127.0.0.1:* http://localhost:* ws://127.0.0.1:* ws://localhost:* https://*.supabase.co wss://*.supabase.co https://api.razorpay.com https://*.r2.cloudflarestorage.com;
    frame-src 'self' https://js.stripe.com https://checkout.razorpay.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    ${isProd ? 'upgrade-insecure-requests;' : ''}
  `
    .replace(/\s{2,}/g, ' ')
    .trim();

  headers.set('Content-Security-Policy', cspHeader);

  return response;
};
