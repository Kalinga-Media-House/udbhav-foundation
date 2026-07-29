import { DeleteObjectCommand } from '@aws-sdk/client-s3';

import { serverLogger } from "../logger/server-logger";

import { getStorageClient } from './client';
import { getStorageConfig } from './config';
import { DeleteError } from './errors';
import type { StorageResponse, DeleteOptions } from './types';

/**
 * Deletes an object from Cloudflare R2.
 */
export const deleteFile = async (
  key: string,
  options?: DeleteOptions
): Promise<StorageResponse<boolean>> => {
  try {
    const config = getStorageConfig();
    const bucket = options?.bucket || config.defaultBucket;
    const client = getStorageClient();

    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    await client.send(command);
    serverLogger.info(`File deleted from R2`, { bucket, key });

    return { data: true, error: null };
  } catch (error) {
    serverLogger.error(`Delete failed for ${key}`, error as Error);
    return { data: null, error: new DeleteError() };
  }
};
