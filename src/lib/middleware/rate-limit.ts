import { NextRequest, NextResponse } from 'next/server';

/**
 * Basic in-memory rate limiter for Edge Runtime.
 * Note: For robust distributed rate limiting on Vercel, it is highly recommended
 * to swap this with @upstash/ratelimit + @upstash/redis.
 */
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

export const applyRateLimit = (request: NextRequest): NextResponse | null => {
  // Only apply to /api routes
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return null; // Skip
  }

  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 100;

  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return null; // Allow
  }

  // Reset window
  if (now - record.timestamp > windowMs) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return null; // Allow
  }

  // Increment
  record.count += 1;

  if (record.count > maxRequests) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': String(windowMs / 1000),
      },
    });
  }

  return null; // Allow
};
