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
    });
    if (uploadResult.error || !uploadResult.data) {
      return fail(uploadResult.error?.message ?? 'Upload failed');
    }
    const storageObj = uploadResult.data;
    const dbResult = await mediaRepository.create({
      file_name: storageObj.key.split('/').pop() ?? originalFilename,
      original_name: originalFilename,
      file_path: storageObj.key,
      bucket_name: storageObj.bucket,
      public_url: storageObj.url,
      file_size: storageObj.size ?? 0,
      mime_type: contentType,
      file_type: contentType.startsWith('image')
        ? 'Image'
        : contentType.startsWith('video')
        ? 'Video'
        : 'Document',
      entity_type: entityType,
      entity_id: entityId,
      alt_text: null,
      title: null,
      description: null,
      metadata: {},
      created_by: userId,
    });
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
