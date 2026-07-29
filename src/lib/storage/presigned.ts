import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { serverLogger } from "../logger/server-logger";

import { getStorageClient } from './client';
import { getStorageConfig } from './config';
import { UploadError } from './errors';
import { generateUniqueFilename, sanitizePath } from './helpers';
import type { StorageResponse, PresignedUrl, UploadOptions } from './types';

/**
 * Generates a presigned URL allowing the browser to upload a file DIRECTLY to R2,
 * completely bypassing the Next.js API route limits (Vercel max payload limit).
 */
export const generatePresignedUploadUrl = async (
  originalFilename: string,
  options: UploadOptions
): Promise<StorageResponse<PresignedUrl>> => {
  try {
    const config = getStorageConfig();
    const bucket = options.bucket || config.defaultBucket;
    const client = getStorageClient();

    const safeFilename = generateUniqueFilename(originalFilename);
    const key = options.folder ? sanitizePath(options.folder, safeFilename) : safeFilename;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: options.contentType,
      // If we need to enforce max size at S3 level via conditions, we would use Presigned POST.
      // For PutObject, we rely on client enforcement + backend verification post-upload.
    });

    // Valid for 15 minutes
    const url = await getSignedUrl(client, command, { expiresIn: 900 });
    const expiresAt = new Date(Date.now() + 900 * 1000).toISOString();

    serverLogger.info(`Presigned Upload URL generated`, { bucket, key });

    return {
      data: { url, expiresAt, key },
      error: null,
    };
  } catch (error) {
    serverLogger.error(`Failed to generate presigned upload URL`, error as Error);
    return { data: null, error: new UploadError('Failed to generate secure upload endpoint.') };
  }
};
