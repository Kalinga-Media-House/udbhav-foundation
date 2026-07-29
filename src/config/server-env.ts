import { z } from "zod";

/**
 * Zod schema defining the expected shape of server-only environment variables.
 * These contain highly sensitive secrets and MUST NEVER be exposed to the client.
 */
export const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(32, "Supabase Service Role Key is required."),
  R2_ACCOUNT_ID: z.string().min(1, "Cloudflare R2 Account ID is required."),
  R2_ACCESS_KEY_ID: z.string().min(1, "Cloudflare R2 Access Key ID is required."),
  R2_SECRET_ACCESS_KEY: z.string().min(1, "Cloudflare R2 Secret Access Key is required."),
  R2_BUCKET_NAME: z.string().min(1, "Cloudflare R2 Bucket Name is required."),
});

/**
 * Parses and validates the server environment variables.
 * Next.js protects these from the client automatically, provided they don't start with NEXT_PUBLIC_.
 */
export const validateServerEnv = () => {
  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("❌ Invalid SERVER environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid SERVER environment variables. Check .env.local or deployment configuration.");
  }

  return parsed.data;
};

// Guarantee this file never runs on the client.
if (typeof window !== "undefined") {
  throw new Error("SECURITY VIOLATION: server-env.ts was imported in a client component.");
}

export const serverEnv = validateServerEnv();
