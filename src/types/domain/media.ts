import type { MediaId, UserId } from '../branded';
import type { MediaTypeEnum } from '../enums';
import type { ISODate } from '../utilities';

/**
 * Represents a media object database entity stored in cloud storage (e.g., R2).
 */
export interface MediaObjectEntity {
  id: string;
  filename: string;
  r2_key: string;
  bucket: string;
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  duration: number | null;
  public_url: string;
  title: string | null;
  alt_text: string | null;
  caption: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

/**
 * Domain model representing a media object with branded identifiers and typed enums.
 */
export interface MediaObject {
  id: MediaId;
  filename: string;
  r2Key: string;
  bucket: string;
  mimeType: MediaTypeEnum;
  sizeBytes: number;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
  publicUrl: string;
  title?: string | null;
  altText?: string | null;
  caption?: string | null;
  createdBy?: UserId | null;
  updatedBy?: UserId | null;
  createdAt: ISODate;
  updatedAt: ISODate;
  isDeleted: boolean;
}

/**
 * View model formatted for presentation layers displaying media objects.
 */
export interface MediaViewModel {
  id: string;
  filename: string;
  mimeType: string;
  formattedSize: string;
  publicUrl: string;
  thumbnailUrl: string;
  title?: string | null;
  altText?: string | null;
  caption?: string | null;
  dimensions?: string | null;
  duration?: string | null;
  uploadedAt: string;
}

/**
 * Data Transfer Object for creating a new media object entry.
 */
export interface MediaCreateDTO {
  filename: string;
  r2Key: string;
  bucket: string;
  mimeType: MediaTypeEnum;
  sizeBytes: number;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
  publicUrl: string;
  title?: string | null;
  altText?: string | null;
  caption?: string | null;
}

/**
 * Data Transfer Object for updating metadata of an existing media object.
 */
export interface MediaUpdateDTO {
  id: string;
  title?: string | null;
  altText?: string | null;
  caption?: string | null;
}

/**
 * Data Transfer Object for filtering and searching media objects.
 */
export interface MediaFilterDTO {
  mimeType?: string;
  bucket?: string;
  q?: string;
}
