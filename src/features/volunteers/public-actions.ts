'use server';

import { STORAGE } from '@/constants';
import { handleAction } from '@/contracts/actions';
import type { ActionResult } from '@/contracts/actions';
import { isValidImageFormat } from '@/lib/storage/image';
import { generatePresignedUploadUrl } from '@/lib/storage/presigned';
import type { ImageUploadMetadata } from '@/lib/storage/types';

interface PresignedUploadResponse {
  url: string;
  storageKey: string;
  expiresAt: string;
}

/**
 * Generates a presigned URL for public volunteer application photo uploads.
 * Restricts uploads to 'volunteer-profiles/temp' and enforces strict size/type checks.
 */
export async function requestPublicVolunteerImageUpload(
  metadata: Pick<ImageUploadMetadata, 'filename' | 'size' | 'contentType'>
): Promise<ActionResult<PresignedUploadResponse>> {
  return handleAction('requestPublicVolunteerImageUpload', async () => {
    
    if (metadata.size > STORAGE.LIMITS.MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      throw new Error(`File size exceeds the ${STORAGE.LIMITS.MAX_IMAGE_SIZE_MB}MB limit.`);
    }

    if (!isValidImageFormat(metadata.contentType)) {
      throw new Error(`Unsupported image format: ${metadata.contentType}`);
    }

    // Restrict strictly to temp folder for volunteer profiles
    const safeFolder = 'volunteer-profiles/temp';

    const res = await generatePresignedUploadUrl(metadata.filename, {
      contentType: metadata.contentType,
      folder: safeFolder,
    });

    if (res.error || !res.data) {
      throw new Error(res.error?.message || 'Failed to generate upload URL.');
    }

    return {
      url: res.data.url,
      storageKey: res.data.key,
      expiresAt: res.data.expiresAt,
    };
  });
}
