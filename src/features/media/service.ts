/* eslint-disable @typescript-eslint/no-explicit-any */
import { fail, fromRepo } from '@/contracts/services';
import type { ServiceResult } from '@/contracts/services';
import { uploadFile } from '@/lib/storage';
import type { ID } from '@/types';

import type { MediaFileRow } from './repository';
import { mediaRepository } from './repository';

/**
 * Service layer for media upload and storage operations.
 */
export class MediaService {
  /**
   * Fetches media file details by ID.
   *
   * @param id - Media file ID.
   * @returns ServiceResult wrapping MediaFileRow.
   */
  async getById(id: ID): Promise<ServiceResult<MediaFileRow>> {
    return fromRepo(await mediaRepository.findById(id));
  }

  /**
   * Uploads file buffer to R2 storage and records entry in database.
   *
   * @param file - File buffer content.
   * @param originalFilename - Original name of uploaded file.
   * @param contentType - MIME type string.
   * @param folder - Folder path prefix in storage.
   * @param entityType - Optional associated entity type.
   * @param entityId - Optional associated entity ID.
   * @param userId - Uploader user ID.
   * @returns ServiceResult wrapping created MediaFileRow.
   */
  async upload(
    file: Buffer,
    originalFilename: string,
    contentType: string,
    folder: string,
    entityType: string | null,
    entityId: string | null,
    userId: ID
  ): Promise<ServiceResult<MediaFileRow>> {
    const uploadResult = await uploadFile(file, originalFilename, {
      contentType,
      folder,
      maxSizeMB: 10,
      allowedMimeTypes: [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'image/svg+xml',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/csv',
      ],
    });
    if (uploadResult.error || !uploadResult.data) {
      return fail(uploadResult.error?.message ?? 'Upload failed');
    }
    const storageObj = uploadResult.data;
    const dbResult = await mediaRepository.create({
      original_filename: originalFilename,
      r2_object_key: storageObj.key,
      bucket_name: storageObj.bucket,
      cdn_url: storageObj.url,
      file_size: storageObj.size ?? 0,
      mime_type: contentType,
      status: 'Ready',
      created_by: userId,
    } as any);
    return fromRepo(dbResult);
  }

  /**
   * Soft deletes a media file entry from the database.
   *
   * @param id - Media file ID.
   * @param userId - User performing deletion.
   * @returns ServiceResult wrapping updated MediaFileRow.
   */
  async remove(id: ID, userId: ID): Promise<ServiceResult<MediaFileRow>> {
    return fromRepo(await mediaRepository.softDelete(id, userId));
  }
}

export const mediaService = new MediaService();
