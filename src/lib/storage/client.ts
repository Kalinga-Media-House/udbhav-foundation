import { S3Client } from '@aws-sdk/client-s3';

import { getStorageConfig } from './config';

/**
 * Singleton instance of the AWS S3 Client configured for Cloudflare R2.
 * Server-only execution.
 */
let s3ClientInstance: S3Client | null = null;

export const getStorageClient = (): S3Client => {
  if (!s3ClientInstance) {
    const config = getStorageConfig();
    
    s3ClientInstance = new S3Client({
      region: 'auto',
      endpoint: config.endpoint,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      // Cloudflare R2 requires path-style endpoint configuration
      forcePathStyle: true,
    });
  }
  
  return s3ClientInstance;
};
