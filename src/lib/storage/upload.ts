import { PutObjectCommand } from '@aws-sdk/client-s3';

import { serverLogger } from '../logger/server-logger';

import { getStorageClient } from './client';
import { getStorageConfig } from './config';
import { UploadError } from './errors';
import { generateUniqueFilename, sanitizePath } from './helpers';
import type { StorageObject, UploadOptions, StorageResponse } from './types';

/**
 * Uploads a file (Buffer) directly to Cloudflare R2 from the server.
 */
export const uploadFile = async (
  file: Buffer,
  originalFilename: string,
  options: UploadOptions
): Promise<StorageResponse<StorageObject>> => {
  try {
    // 1. Validate Size
    if (options.maxSizeMB && file.length > options.maxSizeMB * 1024 * 1024) {
      throw new UploadError(`File size exceeds maximum allowed size of ${options.maxSizeMB}MB.`);
    }

    // 1.5. Validate MIME Type
    if (options.allowedMimeTypes && options.allowedMimeTypes.length > 0) {
      if (!options.contentType || !options.allowedMimeTypes.includes(options.contentType)) {
        throw new UploadError(
          `Invalid file type: ${options.contentType}. Allowed types: ${options.allowedMimeTypes.join(', ')}`
        );
      }
    }

    // 2. Prepare Config
    const config = getStorageConfig();
    const bucket = options.bucket || config.defaultBucket;

    // 3. Generate Path
    const safeFilename = generateUniqueFilename(originalFilename);
    const generatedKey = options.folder ? sanitizePath(options.folder, safeFilename) : safeFilename;
    const key = options.key || generatedKey;

    // 4. Upload
    const client = getStorageClient();
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file,
      ContentType: options.contentType,
    });

    await client.send(command);

    serverLogger.info(`File uploaded successfully to R2`, { bucket, key });

    return {
      data: {
        key,
        bucket,
        url: `${config.publicUrl}/${key}`,
        size: file.length,
        contentType: options.contentType,
      },
      error: null,
    };
  } catch (error) {
    serverLogger.error(`Upload failed`, error as Error, { originalFilename });
    return { data: null, error: error instanceof UploadError ? error : new UploadError() };
  }
};
