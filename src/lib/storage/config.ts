import { env } from '@/config/env';
import { ConfigurationError } from '@/errors';

if (typeof window !== 'undefined') {
  throw new ConfigurationError("SECURITY VIOLATION: Storage config cannot be imported on the client.");
}

export const getStorageConfig = () => {
  if (!env.R2_ACCOUNT_ID || !env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY) {
    throw new ConfigurationError("Missing Cloudflare R2 credentials in environment variables.");
  }

  return {
    accountId: env.R2_ACCOUNT_ID,
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    defaultBucket: env.R2_BUCKET_NAME,
    publicUrl: env.NEXT_PUBLIC_R2_PUBLIC_URL,
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  };
};
