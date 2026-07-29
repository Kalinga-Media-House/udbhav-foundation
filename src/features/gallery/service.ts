import type { PaginatedResult } from '@/contracts/repositories';
import { ok, fail, fromRepo } from '@/contracts/services';
import type { ServiceResult } from '@/contracts/services';
import type { Pagination, ID } from '@/types';

import { galleryRepository } from './repository';
import type { AlbumRow, GalleryItemRow, GalleryItemWithMedia } from './repository';
import { createAlbumSchema, updateAlbumSchema, addGalleryItemSchema } from './validators';
import type { CreateAlbumDTO, UpdateAlbumDTO, AddGalleryItemDTO } from './validators';

/**
 * Gallery service encapsulating business logic for gallery albums and items.
 */
export class GalleryService {
  /**
   * Retrieves an album by ID.
   * @param id - Album ID.
   * @returns Service result containing the album row.
   */
  async getById(id: ID): Promise<ServiceResult<AlbumRow>> {
    return fromRepo(await galleryRepository.findById(id));
  }

  /**
   * Retrieves an album by slug.
   * @param slug - Album slug.
   * @returns Service result containing the album row.
   */
  async getBySlug(slug: string): Promise<ServiceResult<AlbumRow>> {
    return fromRepo(await galleryRepository.findBySlug(slug));
  }

  /**
   * Lists albums with pagination and optional filtering.
   * @param pagination - Pagination settings.
   * @param filters - Optional criteria filters.
   * @returns Service result containing paginated album rows.
   */
  async list(
    pagination: Pagination,
    filters?: Record<string, unknown>
  ): Promise<ServiceResult<PaginatedResult<AlbumRow>>> {
    return ok(await galleryRepository.findMany({ pagination, filters }));
  }

  /**
   * Creates a new album after validating user DTO.
   * @param dto - Album creation parameters.
   * @param userId - ID of user creating the album.
   * @returns Service result containing created album.
   */
  async create(dto: CreateAlbumDTO, userId: ID): Promise<ServiceResult<AlbumRow>> {
    const parsed = createAlbumSchema.safeParse(dto);
    if (!parsed.success)
      return fail(parsed.error.issues.map((e: { message: string }) => e.message).join(', '));
    return fromRepo(
      await galleryRepository.create({
        ...(parsed.data as any),
        created_by: userId,
        updated_by: userId,
      } as AlbumCreate)
    );
  }

  /**
   * Updates an existing album after validating DTO.
   * @param id - Album ID.
   * @param dto - Album update parameters.
   * @param userId - ID of user updating the album.
   * @returns Service result containing updated album.
   */
  async update(id: ID, dto: UpdateAlbumDTO, userId: ID): Promise<ServiceResult<AlbumRow>> {
    const parsed = updateAlbumSchema.safeParse(dto);
    if (!parsed.success)
      return fail(parsed.error.issues.map((e: { message: string }) => e.message).join(', '));
    return fromRepo(
      await galleryRepository.update(id, { ...(parsed.data as any), updated_by: userId })
    );
  }

  /**
   * Soft deletes an album.
   * @param id - Album ID.
   * @param userId - ID of user deleting the album.
   * @returns Service result containing deleted album row.
   */
  async remove(id: ID, userId: ID): Promise<ServiceResult<AlbumRow>> {
    return fromRepo(await galleryRepository.softDelete(id, userId));
  }

  /**
   * Searches albums matching search query.
   * @param query - Full-text search term.
   * @param pagination - Pagination configuration.
   * @returns Service result with paginated album matches.
   */
  async search(
    query: string,
    pagination: Pagination
  ): Promise<ServiceResult<PaginatedResult<AlbumRow>>> {
    return ok(await galleryRepository.search(query, pagination));
  }

  /**
   * Adds an item to a gallery album after validation.
   * @param dto - Gallery item creation parameters.
   * @param userId - ID of user adding item.
   * @returns Service result with added gallery item.
   */
  async addItem(dto: AddGalleryItemDTO, userId: ID): Promise<ServiceResult<GalleryItemRow>> {
    const parsed = addGalleryItemSchema.safeParse(dto);
    if (!parsed.success)
      return fail(parsed.error.issues.map((e: { message: string }) => e.message).join(', '));
    return fromRepo(
      await galleryRepository.addItem({
        ...(parsed.data as any),
        created_by: userId,
        updated_by: userId,
      } as any)
    );
  }

  /**
   * Removes a item from a gallery album.
   * @param itemId - Gallery item ID.
   * @returns Service result with removed item.
   */
  async removeItem(itemId: ID): Promise<ServiceResult<GalleryItemRow>> {
    return fromRepo(await galleryRepository.removeItem(itemId));
  }

  /**
   * Lists items for a specified album.
   * @param albumId - Target album ID.
   * @param pagination - Pagination options.
   * @returns Service result with paginated album items.
   */
  async listItems(
    albumId: ID,
    pagination: Pagination
  ): Promise<ServiceResult<PaginatedResult<GalleryItemRow>>> {
    return ok(await galleryRepository.listItems(albumId, pagination));
  }

  /**
   * Lists items for an album enriched with media_objects data.
   * @param albumId - Target album ID.
   * @param pagination - Pagination options.
   * @returns Service result with paginated album items and media.
   */
  async listItemsWithMedia(
    albumId: ID,
    pagination: Pagination
  ): Promise<ServiceResult<PaginatedResult<GalleryItemWithMedia>>> {
    return ok(await galleryRepository.listItemsWithMedia(albumId, pagination));
  }
}

export const galleryService = new GalleryService();
