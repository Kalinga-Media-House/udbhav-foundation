/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseJsClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { cache } from 'react';

import { env } from '@/config/env';
import type { Database } from '@/types/database/database.generated';

/**
 * Creates a static Supabase client for Server Components during SSG/ISR.
 * Does NOT read or write cookies. Avoids Dynamic Server Usage errors.
 */
export const createStaticSupabaseClient = () => {
  return createSupabaseJsClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );
};

/**
 * Creates a Supabase client for Server Components, Server Actions, and Route Handlers.
 * Automatically handles cookie reading and writing via Next.js `cookies()`.
 * Wrapped in React `cache` to ensure the same client instance (and its in-memory token)
 * is shared across the entire request lifecycle, preventing stale cookie bugs after token refreshes.
 */
export const createServerSupabaseClient = cache(async () => {
  const cookieStore = await cookies();

  const client = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options as any)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
      global: {
        fetch: async (url, options) => {
          const headers = new Headers(options?.headers);
          const auth = headers.get('Authorization');
          console.log(`[SUPABASE_FETCH] ${options?.method || 'GET'} ${url}`);
          console.log(
            `[SUPABASE_FETCH] Auth Header Present: ${!!auth}, StartsWithBearer: ${auth?.startsWith('Bearer ')}`
          );
          return fetch(url, options);
        },
      },
    }
  );

  return client;
});

export const createClient = createServerSupabaseClient;
