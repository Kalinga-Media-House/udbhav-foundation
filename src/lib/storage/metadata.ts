import { HeadObjectCommand } from '@aws-sdk/client-s3';

import { serverLogger } from "../logger/server-logger";

import { getStorageClient } from './client';
import { getStorageConfig } from './config';

export const getObjectMetadata = async (key: string, bucket?: string) => {
  try {
    const config = getStorageConfig();
    const targetBucket = bucket || config.defaultBucket;
    const client = getStorageClient();

    const command = new HeadObjectCommand({
      Bucket: targetBucket,
      Key: key,
    });

    const response = await client.send(command);
    return {
      size: response.ContentLength,
      contentType: response.ContentType,
      lastModified: response.LastModified,
      metadata: response.Metadata,
    };
  } catch (error) {
    serverLogger.error(`Failed to retrieve metadata for ${key}`, error as Error);
    return null;
  }
};
