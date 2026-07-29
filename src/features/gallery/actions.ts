'use server';

import { revalidateTag } from 'next/cache';

import { handleAction, requireAuth, requirePermission, CacheTags } from '@/contracts/actions';
import type { ActionResult } from '@/contracts/actions';
import type { PaginatedResult } from '@/contracts/repositories';
import type { Pagination } from '@/types';

import type { AlbumRow, GalleryItemRow } from './repository';
import { galleryService } from './service';
import type { CreateAlbumDTO, UpdateAlbumDTO, AddGalleryItemDTO } from './validators';

/**
 * Server action to create a new gallery album.
 * Requires authentication and 'gallery.create' permission.
 * @param dto - Create album payload.
 * @returns ActionResult containing created AlbumRow.
 */
export async function createAlbum(dto: CreateAlbumDTO): Promise<ActionResult<AlbumRow>> {
  return handleAction('createAlbum', async () => {
    const session = await requireAuth();
    requirePermission(session, 'gallery.create');
    const result = await galleryService.create(dto, session.id);
    if (!result.success) throw new Error(result.error ?? 'Creation failed');
    revalidateTag(CacheTags.gallery());
    return result.data!;
  });
}

/**
 * Server action to update an existing gallery album.
 * Requires authentication and 'gallery.update' permission.
 * @param id - Album ID to update.
 * @param dto - Update album payload.
 * @returns ActionResult containing updated AlbumRow.
 */
export async function updateAlbum(id: string, dto: UpdateAlbumDTO): Promise<ActionResult<AlbumRow>> {
  return handleAction('updateAlbum', async () => {
    const session = await requireAuth();
    requirePermission(session, 'gallery.update');
    const result = await galleryService.update(id, dto, session.id);
    if (!result.success) throw new Error(result.error ?? 'Update failed');
    revalidateTag(CacheTags.gallery());
    revalidateTag(CacheTags.album(id));
    return result.data!;
  });
}

/**
 * Server action to soft-delete a gallery album.
 * Requires authentication and 'gallery.delete' permission.
 * @param id - Album ID to delete.
 * @returns ActionResult containing deleted AlbumRow.
 */
export async function deleteAlbum(id: string): Promise<ActionResult<AlbumRow>> {
  return handleAction('deleteAlbum', async () => {
    const session = await requireAuth();
    requirePermission(session, 'gallery.delete');
    const result = await galleryService.remove(id, session.id);
    if (!result.success) throw new Error(result.error ?? 'Delete failed');
    revalidateTag(CacheTags.gallery());
    return result.data!;
  });
}

/**
 * Server action to add a media item to a gallery album.
 * Requires authentication and 'gallery.update' permission.
 * @param dto - Add gallery item payload.
 * @returns ActionResult containing created GalleryItemRow.
 */
export async function addGalleryItem(dto: AddGalleryItemDTO): Promise<ActionResult<GalleryItemRow>> {
  return handleAction('addGalleryItem', async () => {
    const session = await requireAuth();
    requirePermission(session, 'gallery.update');
    const result = await galleryService.addItem(dto, session.id);
    if (!result.success) throw new Error(result.error ?? 'Add item failed');
    revalidateTag(CacheTags.gallery());
    revalidateTag(CacheTags.album(dto.album_id));
    return result.data!;
  });
}

/**
 * Server action to list gallery albums with pagination and filters.
 * Publicly accessible or configurable via permissions.
 * @param pagination - Pagination configuration.
 * @param filters - Optional query filters.
 * @returns ActionResult containing paginated AlbumRow results.
 */
export async function listAlbums(pagination: Pagination, filters?: Record<string, unknown>): Promise<ActionResult<PaginatedResult<AlbumRow>>> {
  return handleAction('listAlbums', async () => {
    const result = await galleryService.list(pagination, filters);
    if (!result.success) throw new Error(result.error ?? 'List failed');
    return result.data!;
  });
}

/**
 * Server action to get an album by ID.
 * @param id - Album ID.
 * @returns ActionResult containing AlbumRow.
 */
export async function getAlbumById(id: string): Promise<ActionResult<AlbumRow>> {
  return handleAction('getAlbumById', async () => {
    const result = await galleryService.getById(id);
    if (!result.success) throw new Error(result.error ?? 'Get album failed');
    return result.data!;
  });
}

/**
 * Server action to get an album by slug.
 * @param slug - Album slug.
 * @returns ActionResult containing AlbumRow.
 */
export async function getAlbumBySlug(slug: string): Promise<ActionResult<AlbumRow>> {
  return handleAction('getAlbumBySlug', async () => {
    const result = await galleryService.getBySlug(slug);
    if (!result.success) throw new Error(result.error ?? 'Get album by slug failed');
    return result.data!;
  });
}

/**
 * Server action to list items inside an album enriched with media data.
 * @param albumId - Album ID.
 * @param pagination - Pagination config.
 * @returns ActionResult containing paginated items with media.
 */
export async function listAlbumItems(
  albumId: string,
  pagination: Pagination
): Promise<ActionResult<PaginatedResult<import('./repository').GalleryItemWithMedia>>> {
  return handleAction('listAlbumItems', async () => {
    const result = await galleryService.listItemsWithMedia(albumId, pagination);
    if (!result.success) throw new Error(result.error ?? 'List album items failed');
    return result.data!;
  });
}

/**
 * Server action to remove an item from an album.
 * Requires authentication and 'gallery.update' permission.
 * @param id - Item ID to remove.
 * @param albumId - Parent album ID for revalidation.
 * @returns ActionResult containing deleted GalleryItemRow.
 */
export async function removeGalleryItem(id: string, albumId: string): Promise<ActionResult<GalleryItemRow>> {
  return handleAction('removeGalleryItem', async () => {
    const session = await requireAuth();
    requirePermission(session, 'gallery.update');
    const result = await galleryService.removeItem(id);
    if (!result.success) throw new Error(result.error ?? 'Remove item failed');
    revalidateTag(CacheTags.gallery());
    revalidateTag(CacheTags.album(albumId));
    return result.data!;
  });
}
