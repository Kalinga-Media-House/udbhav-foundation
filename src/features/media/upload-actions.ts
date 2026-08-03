'use server';

import { revalidateTag } from 'next/cache';

import { STORAGE } from '@/constants';
import { handleAction, requireAuth, CacheTags } from '@/contracts/actions';
import type { ActionResult } from '@/contracts/actions';
import { deleteFile } from '@/lib/storage/delete';
import { downloadFileInternal } from '@/lib/storage/download-internal';
import { isValidImageFormat } from '@/lib/storage/image';
import { processImage } from '@/lib/storage/image-pipeline';
import { generatePresignedUploadUrl } from '@/lib/storage/presigned';
import type { ImageUploadMetadata, ImageUploadResult } from '@/lib/storage/types';
import { uploadFile } from '@/lib/storage/upload';
import { createServerSupabaseClient } from '@/lib/supabase/server';

interface PresignedUploadResponse {
  url: string;
  storageKey: string;
  expiresAt: string;
}

/**
 * Phase 1: Request an upload URL
 * The client provides metadata, and the server generates a short-lived presigned PUT URL
 * to allow direct upload to Cloudflare R2, bypassing Vercel's 4MB body limit.
 */
export async function requestImageUpload(
  metadata: ImageUploadMetadata
): Promise<ActionResult<PresignedUploadResponse>> {
  return handleAction('requestImageUpload', async () => {
    await requireAuth();
    // In a real app, you might validate permission based on `metadata.folder`.
    // For now, any authenticated user can request an upload, but they still need permission to *save* it in Phase 2.

    if (metadata.size > STORAGE.LIMITS.MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      throw new Error(`File size exceeds the ${STORAGE.LIMITS.MAX_IMAGE_SIZE_MB}MB limit.`);
    }

    if (!isValidImageFormat(metadata.contentType)) {
      throw new Error(`Unsupported image format: ${metadata.contentType}`);
    }

    // Generate path for the raw file. We prefix it with 'temp-raw-' to indicate it's pre-processed.
    const tempFolder = `${metadata.folder}/temp`;

    const res = await generatePresignedUploadUrl(metadata.filename, {
      contentType: metadata.contentType,
      folder: tempFolder,
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

/**
 * Phase 2: Process and Register
 * The client notifies the server that the raw file has been uploaded to the temp key.
 * The server downloads it, optimizes it with Sharp, uploads the optimized version,
 * deletes the raw version, and registers the final asset in `media_files`.
 */
export async function processUploadedImage(
  tempStorageKey: string,
  originalFilename: string,
  folder: string,
  _entityType?: string,
  _entityId?: string
): Promise<ActionResult<ImageUploadResult>> {
  return handleAction('processUploadedImage', async () => {
    const session = await requireAuth();

    // 1. Download the raw file internally from R2
    const downloadRes = await downloadFileInternal(tempStorageKey);
    if (!downloadRes.data) {
      throw new Error(
        'Failed to retrieve the uploaded file for processing. It may have expired or failed to upload.'
      );
    }
    const rawBuffer = downloadRes.data;

    // 2. Process with Sharp
    const processed = await processImage(rawBuffer, originalFilename);

    // 3. Re-upload the optimized image
    // Generate a final key based on the original name but with the new extension (e.g. .webp)
    const baseName = originalFilename.substring(0, originalFilename.lastIndexOf('.'));
    const finalExtension = processed.format === 'gif' ? '.gif' : `.${processed.format}`;
    const finalFilename = `${baseName}${finalExtension}`;

    const uploadRes = await uploadFile(processed.buffer, finalFilename, {
      contentType: processed.mimeType,
      folder,
    });

    if (!uploadRes.data) {
      throw new Error('Failed to save the optimized image.');
    }
    const finalKey = uploadRes.data.key;
    const cdnUrl = uploadRes.data.url;
    const bucket = uploadRes.data.bucket;

    // 4. Delete the temporary raw file
    await deleteFile(tempStorageKey);

    // 5. Register in DB
    const supabase = await createServerSupabaseClient();
    const mediaData = {
      uploader_id: session.id,
      r2_object_key: finalKey,
      bucket_name: bucket,
      folder_path: `/${folder}`,
      original_filename: originalFilename,
      stored_filename: finalKey.split('/').pop() || finalFilename,
      mime_type: processed.mimeType,
      type: 'image',
      file_size: processed.optimizedSize,
      cdn_url: cdnUrl,
      width: processed.width,
      height: processed.height,
      created_by: session.id,
      updated_by: session.id,
    };

    const { data: mediaRow, error } = await (supabase.from('media_files' as any) as any)
      .insert(mediaData)
      .select('id')
      .single();

    if (error) {
      // If DB fails, we should ideally clean up the R2 object to prevent orphans.
      await deleteFile(finalKey).catch(() => {});
      throw new Error(`Database error: ${error.message}`);
    }

    // Revalidate media cache
    (revalidateTag as any)(CacheTags.media());

    return {
      id: mediaRow.id,
      cdnUrl,
      width: processed.width,
      height: processed.height,
      format: processed.format,
      originalSize: processed.originalSize,
      optimizedSize: processed.optimizedSize,
      compressionRatio: processed.compressionRatio,
    };
  });
}
