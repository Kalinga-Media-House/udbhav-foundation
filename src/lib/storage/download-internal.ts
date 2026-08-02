import { GetObjectCommand } from '@aws-sdk/client-s3';

import { serverLogger } from '@/lib/logger/server-logger';

import { getStorageClient } from './client';
import { getStorageConfig } from './config';
import { DownloadError } from './errors';
import type { StorageResponse } from './types';

/**
 * Downloads a file directly from R2 into a Buffer for server-side processing.
 * Only intended for internal backend use (e.g., fetching a raw upload before optimization).
 */
export const downloadFileInternal = async (
  key: string,
  options?: { bucket?: string }
): Promise<StorageResponse<Buffer>> => {
  try {
    const config = getStorageConfig();
    const bucket = options?.bucket || config.defaultBucket;
    const client = getStorageClient();

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const response = await client.send(command);

    if (!response.Body) {
      throw new DownloadError('Object body is empty.');
    }

    // Convert the readable stream to a Buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of response.Body as any) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    serverLogger.info(`File downloaded internally from R2`, { bucket, key, size: buffer.length });

    return {
      data: buffer,
      error: null,
    };
  } catch (error) {
    serverLogger.error(`Internal download failed for key ${key}`, error as Error);
    return { data: null, error: error instanceof DownloadError ? error : new DownloadError() };
  }
};
