/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { revalidateTag } from 'next/cache';

import { handleAction, requireAuth, requirePermission, CacheTags } from '@/contracts/actions';
import type { ActionResult } from '@/contracts/actions';
import type { PaginatedResult } from '@/contracts/repositories';
import type { Pagination } from '@/types';

import type { AlbumRow, GalleryItemRow, AdminPhotoItem, PublicGalleryFilter, PublicGallerySort, PublicGalleryFilterOptions } from './repository';
import { galleryService } from './service';
import type { CreateAlbumDTO, UpdateAlbumDTO, AddGalleryItemDTO, UploadPhotosDTO, UpdatePhotoDTO } from './validators';

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
 * Server action to list all photos (items + parent album info) for the Admin CMS.
 */
export async function listAdminPhotos(
  pagination: Pagination,
  filters?: Record<string, unknown>
): Promise<ActionResult<PaginatedResult<AdminPhotoItem>>> {
  return handleAction('listAdminPhotos', async () => {
    const session = await requireAuth();
    // Assuming gallery.read or similar is checked, but we can check gallery.update
    requirePermission(session, 'gallery.update');
    const result = await galleryService.listPhotos(pagination, filters);
    if (!result.success) throw new Error(result.error ?? 'List photos failed');
    return result.data!;
  });
}

/**
 * Server action to list all public photos for the frontend Gallery.
 */
export async function listPublicPhotosAction(
  pagination: Pagination,
  filters?: PublicGalleryFilter,
  sort?: PublicGallerySort
): Promise<ActionResult<PaginatedResult<AdminPhotoItem>>> {
  return handleAction('listPublicPhotosAction', async () => {
    // Public action, no auth required
    const result = await import('./repository').then(m => m.galleryRepository.listPublicPhotos(pagination, filters, sort));
    return result;
  });
}

/**
 * Server action to get random public photos for the hero section.
 */
export async function getRandomPublicPhotosAction(limit: number = 21): Promise<ActionResult<AdminPhotoItem[]>> {
  return handleAction('getRandomPublicPhotosAction', async () => {
    // Public action, no auth required
    const result = await import('./repository').then(m => m.galleryRepository.getRandomPublicPhotos(limit));
    if (result.error) throw new Error(result.error.message || 'Get random photos failed');
    return result.data!;
  });
}

/**
 * Server action to get available public gallery programs and events filters.
 */
export async function getPublicGalleryFiltersAction(): Promise<ActionResult<PublicGalleryFilterOptions>> {
  return handleAction('getPublicGalleryFiltersAction', async () => {
    // Public action, no auth required
    const result = await import('./repository').then(m => m.galleryRepository.getPublicGalleryFilters());
    return result;
  });
}

/**
 * Server action to get gallery statistics.
 */
export async function getGalleryStatsAction(): Promise<ActionResult<{ totalPhotos: number, eventsCovered: number, programmesRepresented: number, locationsReached: number }>> {
  return handleAction('getGalleryStatsAction', async () => {
    // Public action, no auth required
    const result = await import('./repository').then(m => m.galleryRepository.getGalleryStatistics());
    if (result.error) throw new Error(result.error.message || 'Get stats failed');
    return result.data!;
  });
}

/**
 * Server action to upload a batch of photos for the Admin CMS.
 */
export async function uploadPhotosBatchAction(dto: UploadPhotosDTO): Promise<ActionResult<boolean>> {
  return handleAction('uploadPhotosBatchAction', async () => {
    const session = await requireAuth();
    requirePermission(session, 'gallery.create');
    const result = await galleryService.uploadPhotosBatch(dto, session.id);
    if (!result.success) throw new Error(result.error ?? 'Upload photos failed');
    revalidateTag(CacheTags.gallery());
    return result.data!;
  });
}

/**
 * Server action to update a specific photo.
 */
export async function updatePhotoAction(id: string, dto: UpdatePhotoDTO): Promise<ActionResult<boolean>> {
  return handleAction('updatePhotoAction', async () => {
    const session = await requireAuth();
    requirePermission(session, 'gallery.update');
    const result = await galleryService.updatePhoto(id, dto, session.id);
    if (!result.success) throw new Error(result.error ?? 'Update photo failed');
    revalidateTag(CacheTags.gallery());
    // Invalidate the specific album this photo belongs to if possible, 
    // but we can rely on gallery tag for list views
    return result.data!;
  });
}

/**
 * Server action to remove a photo and its hidden album.
 */
export async function removeGalleryItem(id: string, albumId: string): Promise<ActionResult<boolean>> {
  return handleAction('removeGalleryItem', async () => {
    const session = await requireAuth();
    requirePermission(session, 'gallery.delete');
    
    const supabase = await (await import('@/lib/supabase/server')).createServerSupabaseClient();
    
    // 1. Fetch item to find media_file_id
    const { data: item } = await supabase.from('gallery_items').select('media_file_id').eq('id', id).single();
    if (!item) throw new Error('Photo not found');
    
    // 2. Remove the item
    const removeResult = await galleryService.removeItem(id);
    if (!removeResult.success) throw new Error(removeResult.error ?? 'Delete photo failed');
    
    // 3. Delete physical media and media_file if orphaned
    if (item.media_file_id) {
       const { data: references } = await supabase.from('gallery_items').select('id').eq('media_file_id', item.media_file_id).limit(1);
       if (!references || references.length === 0) {
          // fetch media row to get storage key
          const { data: media } = await supabase.from('media_files').select('r2_object_key').eq('id', item.media_file_id).single();
          if (media && media.r2_object_key) {
             const { deleteFile } = await import('@/lib/storage/delete');
             await deleteFile(media.r2_object_key).catch((e) => {
               console.error('Failed to delete physical file from R2:', e);
             });
          }
          await supabase.from('media_files').delete().eq('id', item.media_file_id);
       }
    }

    // 4. Clean up album ONLY if it is completely empty now
    const { data: remainingItems } = await supabase.from('gallery_items').select('id').eq('album_id', albumId).limit(1);
    if (!remainingItems || remainingItems.length === 0) {
       await galleryService.remove(albumId, session.id); // Soft delete the album so it doesn't clutter
    }
    
    revalidateTag(CacheTags.gallery());
    return true;
  });
}

/**
 * Server action to list all albums for the Admin Album Management CMS.
 */
export async function listAdminAlbumsAction(
  pagination: Pagination,
  filters?: Record<string, unknown>
): Promise<ActionResult<PaginatedResult<import('./repository').AdminAlbumItem>>> {
  return handleAction('listAdminAlbumsAction', async () => {
    const session = await requireAuth();
    requirePermission(session, 'gallery.update'); // using update permission as they manage albums
    
    // We can fetch directly from repo since it's internal admin tool, or we can use service.
    // Let's use service if we had one, but we added listAdminAlbums to repo and didn't add it to service yet.
    // Wait, let's add it to service first, or just call repo.
    const result = await import('./repository').then(m => m.galleryRepository.listAdminAlbums(pagination, filters as any));
    return result;
  });
}

/**
 * Server action to hard delete an album cascading to items and media.
 */
export async function deleteAlbumCascadeAction(id: string): Promise<ActionResult<boolean>> {
  return handleAction('deleteAlbumCascadeAction', async () => {
    const session = await requireAuth();
    requirePermission(session, 'gallery.delete');
    
    const result = await galleryService.removeAlbumCascade(id);
    if (!result.success) throw new Error(result.error ?? 'Delete album failed');
    
    revalidateTag(CacheTags.gallery());
    return true;
  });
}
