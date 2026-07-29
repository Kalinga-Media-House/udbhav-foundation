import { z } from 'zod';

/**
 * Zod schema defining the expected shape of public environment variables.
 * These are safe to expose to the browser bundle (prefixed with NEXT_PUBLIC_).
 */
export const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url('Must be a valid absolute URL. Example: http://localhost:3000'),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Must be a valid Supabase project URL.'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(32, 'Supabase Anon Key is required and must be valid.'),
  NEXT_PUBLIC_R2_PUBLIC_URL: z.string().url('Must be a valid R2 public routing URL.'),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
});

/**
 * Parses and validates the public environment variables.
 * We must manually map `process.env` here because Next.js only injects
 * NEXT_PUBLIC_ variables when they are explicitly referenced.
 */
export const validatePublicEnv = () => {
  const parsed = publicEnvSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_R2_PUBLIC_URL: process.env.NEXT_PUBLIC_R2_PUBLIC_URL,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  });

  if (!parsed.success) {
    console.error('❌ Invalid PUBLIC environment variables:', parsed.error.flatten().fieldErrors);
    throw new Error('Invalid PUBLIC environment variables. Check .env.local');
  }

  return parsed.data;
};

export const publicEnv = validatePublicEnv();
