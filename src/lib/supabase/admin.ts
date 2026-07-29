import { createClient } from '@supabase/supabase-js';

import { env } from '@/config/env';

import { serverLogger } from "../logger/server-logger";

import type { Database } from './types';

if (typeof window !== 'undefined') {
  throw new Error("SECURITY VIOLATION: Supabase Admin Client imported on the browser.");
}

/**
 * Creates a Supabase Service Role client.
 * BYPASSES ROW LEVEL SECURITY (RLS).
 * Must ONLY be used in highly secure backend environments (e.g., webhooks, admin server actions).
 */
export const createAdminClient = () => {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    serverLogger.error("Failed to initialize Admin Client: Missing SUPABASE_SERVICE_ROLE_KEY");
    throw new Error("Missing Supabase Service Role Key");
  }

  return createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      }
    }
  );
};
