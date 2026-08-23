/* eslint-disable */
'use server';

import { STORAGE } from '@/constants';
import { handleAction, requireAuth } from '@/contracts/actions';
import type { ActionResult } from '@/contracts/actions';
import { getStorageConfig } from '@/lib/storage/config';
import { deleteFile } from '@/lib/storage/delete';
import { downloadFileInternal } from '@/lib/storage/download-internal';
import { generateUniqueFilename, sanitizePath } from '@/lib/storage/helpers';
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
    const tStart = Date.now();
    let tDownload = 0, tOptimize = 0, tUploadDb = 0;

    // 1. Download the raw file internally from R2
    const downloadRes = await downloadFileInternal(tempStorageKey);
    tDownload = Date.now() - tStart;

    if (!downloadRes.data) {
      throw new Error(
        'Failed to retrieve the uploaded file for processing. It may have expired or failed to upload.'
      );
    }
    const rawBuffer = downloadRes.data;

    // 2. Process with Sharp
    const tOptStart = Date.now();
    const processed = await processImage(rawBuffer, originalFilename);
    tOptimize = Date.now() - tOptStart;

    // 3. Pre-generate the final key
    const tUploadDbStart = Date.now();
    const baseName = originalFilename.substring(0, originalFilename.lastIndexOf('.'));
    const finalExtension = processed.format === 'gif' ? '.gif' : `.${processed.format}`;
    const safeFilename = generateUniqueFilename(`${baseName}${finalExtension}`);
    const finalKey = folder ? sanitizePath(folder, safeFilename) : safeFilename;
    const bucket = getStorageConfig().defaultBucket;
    const cdnUrl = `${getStorageConfig().publicUrl}/${finalKey}`;
    const supabase = await createServerSupabaseClient();

    const mediaData = {
      uploader_id: session.id,
      r2_object_key: finalKey,
      bucket_name: bucket,
      folder_path: `/${folder}`,
      original_filename: originalFilename,
      stored_filename: safeFilename,
      mime_type: processed.mimeType,
      type: 'image',
      file_size: processed.optimizedSize,
      cdn_url: cdnUrl,
      width: processed.width,
      height: processed.height,
      created_by: session.id,
      updated_by: session.id,
    };

    // Execute upload, DB insert, and temp file deletion concurrently
    const [uploadRes, dbRes] = await Promise.all([
      uploadFile(processed.buffer, safeFilename, {
        contentType: processed.mimeType,
        folder,
        bucket,
        key: finalKey,
      }),
      (supabase.from('media_files' as any) as any)
        .insert(mediaData)
        .select('id')
        .single(),
      deleteFile(tempStorageKey).catch(() => {})
    ]);

    if (!uploadRes.data) {
      // Rollback DB if upload failed
      if (dbRes.data?.id) {
        await (supabase.from('media_files' as any) as any).delete().eq('id', dbRes.data.id).catch(() => {});
      }
      throw new Error('Failed to save the optimized image.');
    }

    if (dbRes.error) {
      // Rollback R2 if DB failed
      await deleteFile(finalKey).catch(() => {});
      throw new Error(`Database error: ${dbRes.error.message}`);
    }

    tUploadDb = Date.now() - tUploadDbStart;
    const mediaRow = dbRes.data;

    // Don't revalidate media tag here unless necessary. It slows down the transaction.
    // (revalidateTag as any)(CacheTags.media());
    
    console.log(`[Perf] processUploadedImage - Download: ${tDownload}ms, Optimize: ${tOptimize}ms, Upload+DB: ${tUploadDb}ms, Total: ${Date.now() - tStart}ms`);

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
