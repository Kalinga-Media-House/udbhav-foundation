import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { serverLogger } from "../logger/server-logger";

import { getStorageClient } from './client';
import { getStorageConfig } from './config';
import { DownloadError } from './errors';
import type { StorageResponse, PresignedUrl, DownloadOptions } from './types';

/**
 * Generates a presigned URL allowing temporary, secure public access 
 * to a private object in R2.
 */
export const generatePresignedDownloadUrl = async (
  key: string,
  options?: DownloadOptions
): Promise<StorageResponse<PresignedUrl>> => {
  try {
    const config = getStorageConfig();
    const bucket = options?.bucket || config.defaultBucket;
    const expiresIn = options?.expiresIn || 3600; // default 1 hour
    const client = getStorageClient();

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const url = await getSignedUrl(client, command, { expiresIn });
    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

    serverLogger.debug(`Presigned URL generated for ${key}`);

    return {
      data: { url, expiresAt, key },
      error: null,
    };
  } catch (error) {
    serverLogger.error(`Failed to generate presigned URL for ${key}`, error as Error);
    return { data: null, error: new DownloadError() };
  }
};

/**
 * Constructs the permanent public URL for a file in a public bucket.
 */
export const getPublicUrl = (key: string): string => {
  const config = getStorageConfig();
  return `${config.publicUrl}/${key}`;
};
