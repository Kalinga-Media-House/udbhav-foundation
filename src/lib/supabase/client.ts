import { createBrowserClient } from '@supabase/ssr';

import { publicEnv as env } from '@/config/public-env';

import type { Database } from './types';

/**
 * Creates a singleton instance of the Supabase Browser Client.
 * Safe to use in React Client Components (e.g. for realtime subscriptions).
 */
export const createClient = () => {
  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};
