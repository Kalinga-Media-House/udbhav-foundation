import type { AlbumId, EventId, MediaId, ProgramId, UserId } from '../branded';
import type { GalleryVisibilityEnum } from '../enums';
import type { ISODate } from '../utilities';

/**
 * Represents a gallery album database entity.
 */
export interface GalleryAlbumEntity {
  id: string;
  album_code: string;
  slug: string;
  title: string;
  description: string | null;
  cover_image_id: string | null;
  program_id: string | null;
  event_id: string | null;
  visibility: string;
  display_order: number;
  is_featured: boolean;
  item_count: number;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

/**
 * Represents an individual media item database entity within a gallery album.
 */
export interface GalleryItemEntity {
  id: string;
  album_id: string;
  media_id: string;
  title: string | null;
  caption: string | null;
  display_order: number;
  is_featured: boolean;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

/**
 * Domain model representing a gallery album with branded identifiers and typed enums.
 */
export interface GalleryAlbum {
  id: AlbumId;
  albumCode: string;
  slug: string;
  title: string;
  description?: string | null;
  coverImageId?: MediaId | null;
  programId?: ProgramId | null;
  eventId?: EventId | null;
  visibility: GalleryVisibilityEnum;
  displayOrder: number;
  isFeatured: boolean;
  itemCount: number;
  createdBy?: UserId | null;
  updatedBy?: UserId | null;
  createdAt: ISODate;
  updatedAt: ISODate;
  isDeleted: boolean;
}

/**
 * Domain model representing an item in a gallery album with branded identifiers.
 */
export interface GalleryItem {
  id: string;
  albumId: AlbumId;
  mediaId: MediaId;
  title?: string | null;
  caption?: string | null;
  displayOrder: number;
  isFeatured: boolean;
  createdBy?: UserId | null;
  updatedBy?: UserId | null;
  createdAt: ISODate;
  updatedAt: ISODate;
  isDeleted: boolean;
}

/**
 * View model formatted for presentation layers displaying gallery albums.
 */
export interface GalleryAlbumViewModel {
  id: string;
  albumCode: string;
  slug: string;
  title: string;
  description?: string | null;
  coverImageUrl?: string | null;
  visibilityLabel: string;
  isFeatured: boolean;
  itemCount: number;
  programTitle?: string | null;
  eventTitle?: string | null;
  formattedCreatedAt: string;
}

/**
 * View model formatted for presentation layers displaying gallery media items.
 */
export interface GalleryItemViewModel {
  id: string;
  albumId: string;
  mediaId: string;
  mediaUrl: string;
  thumbnailUrl?: string | null;
  title?: string | null;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
  isFeatured: boolean;
}

/**
 * Data Transfer Object for creating a new gallery album.
 */
export interface GalleryAlbumCreateDTO {
  title: string;
  description?: string | null;
  coverImageId?: string | null;
  programId?: string | null;
  eventId?: string | null;
  visibility?: GalleryVisibilityEnum;
  displayOrder?: number;
  isFeatured?: boolean;
}

/**
 * Data Transfer Object for updating an existing gallery album.
 */
export interface GalleryAlbumUpdateDTO extends Partial<GalleryAlbumCreateDTO> {
  id: string;
}

/**
 * Data Transfer Object for adding a new item to a gallery album.
 */
export interface GalleryItemCreateDTO {
  albumId: string;
  mediaId: string;
  title?: string | null;
  caption?: string | null;
  displayOrder?: number;
  isFeatured?: boolean;
}

/**
 * Data Transfer Object for updating an existing gallery item.
 */
export interface GalleryItemUpdateDTO extends Partial<GalleryItemCreateDTO> {
  id: string;
}

/**
 * Data Transfer Object for filtering and searching gallery albums or items.
 */
export interface GalleryFilterDTO {
  programId?: string;
  eventId?: string;
  visibility?: string;
  isFeatured?: boolean;
  q?: string;
}
