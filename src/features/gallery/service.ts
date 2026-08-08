import type { PaginatedResult } from '@/contracts/repositories';
import { ok, fail, fromRepo } from '@/contracts/services';
import type { ServiceResult } from '@/contracts/services';
import type { Pagination, ID } from '@/types';

import { galleryRepository } from './repository';
import type { AlbumRow, GalleryItemRow, GalleryItemWithMedia, AlbumCreate, AdminPhotoItem } from './repository';
import { createAlbumSchema, updateAlbumSchema, addGalleryItemSchema, uploadPhotosSchema, updatePhotoSchema } from './validators';
import type { CreateAlbumDTO, UpdateAlbumDTO, AddGalleryItemDTO, UploadPhotosDTO, UpdatePhotoDTO } from './validators';

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
    const tStart = Date.now();
    const parsed = createAlbumSchema.safeParse(dto);
    if (!parsed.success)
      return fail(parsed.error.issues.map((e: { message: string }) => e.message).join(', '));
      
    const tVal = Date.now() - tStart;
    
    // Generate album code
    const tCodeStart = Date.now();
    const album_code = await galleryRepository.generateAlbumCode();
    const tCode = Date.now() - tCodeStart;
    
    // Generate slug using title + random string to guarantee uniqueness without DB queries
    const tSlugStart = Date.now();
    const baseSlug = parsed.data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const randomSuffix = crypto.randomUUID().split('-')[0];
    const slug = `${baseSlug}-${randomSuffix}`;
    const tSlug = Date.now() - tSlugStart;

    const tInsertStart = Date.now();
    const createdAlbum = await galleryRepository.create({
      ...(parsed.data as any),
      album_code,
      slug,
      created_by: userId,
      updated_by: userId,
    } as AlbumCreate);
    const tInsert = Date.now() - tInsertStart;
    
    console.log(`[Perf] GalleryService.create - Validation: ${tVal}ms, Code: ${tCode}ms, Slug: ${tSlug}ms, Insert: ${tInsert}ms, Total: ${Date.now() - tStart}ms`);

    return fromRepo(createdAlbum);
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

  /**
   * Lists all photos for the Admin CMS.
   */
  async listPhotos(
    pagination: Pagination,
    filters?: Record<string, unknown>
  ): Promise<ServiceResult<PaginatedResult<AdminPhotoItem>>> {
    return ok(await galleryRepository.listPhotos(pagination, filters));
  }

  /**
   * Uploads a batch of photos, grouping them into an existing album based on metadata matching priorities, or creating a new one.
   */
  async uploadPhotosBatch(dto: UploadPhotosDTO, userId: ID): Promise<ServiceResult<boolean>> {
    const parsed = uploadPhotosSchema.safeParse(dto);
    if (!parsed.success)
      return fail(parsed.error.issues.map((e: { message: string }) => e.message).join(', '));
    
    const { media_ids, ...albumData } = parsed.data;

    const supabase = await (await import('@/lib/supabase/server')).createServerSupabaseClient();
    
    // Find matching album based on priorities
    let matchedAlbumId: string | null = null;
    let query = supabase.from('gallery_albums').select('id').eq('is_deleted', false);

    // Priority 1: Same event
    if (!matchedAlbumId && albumData.event_id) {
      const { data } = await supabase.from('gallery_albums').select('id').eq('is_deleted', false).eq('event_id', albumData.event_id).limit(1).single();
      if (data) matchedAlbumId = data.id;
    }

    // Priority 2: Same programme AND same title
    if (!matchedAlbumId && albumData.program_id) {
      const { data } = await supabase.from('gallery_albums').select('id').eq('is_deleted', false).eq('program_id', albumData.program_id).eq('title', albumData.title).limit(1).single();
      if (data) matchedAlbumId = data.id;
    }

    // Priority 3: Same title AND same location
    if (!matchedAlbumId) {
      let q = supabase.from('gallery_albums').select('id').eq('is_deleted', false).eq('title', albumData.title);
      if (albumData.location) {
        q = q.eq('location' as any, albumData.location);
      } else {
        q = q.is('location' as any, null);
      }
      const { data } = await q.limit(1).single();
      if (data) matchedAlbumId = data.id;
    }

    let albumId = matchedAlbumId;

    if (!albumId) {
      // Create new album
      const album_code = await galleryRepository.generateAlbumCode();
      const baseSlug = albumData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const randomSuffix = crypto.randomUUID().split('-')[0];
      const slug = `${baseSlug}-${randomSuffix}`;

      const createdAlbum = await galleryRepository.create({
        ...albumData,
        album_code,
        slug,
        cover_image_id: media_ids[0], // set first image as cover
        created_by: userId,
        updated_by: userId,
        status: 'Published'
      } as AlbumCreate);
      
      if (createdAlbum.data) {
        albumId = createdAlbum.data.id;
      }
    }

    if (albumId) {
      // Insert all photos into this album
      for (const media_id of media_ids) {
        await galleryRepository.addItem({
          album_id: albumId,
          media_file_id: media_id,
          title: albumData.title,
          description: albumData.description,
          location: albumData.location,
          is_featured: albumData.is_featured,
          created_by: userId,
          updated_by: userId,
        } as any);
      }
      
      // Update cover image if it was missing
      if (matchedAlbumId) {
        const { data: currentAlbum } = await supabase.from('gallery_albums').select('cover_image_id').eq('id', albumId).single();
        if (currentAlbum && !currentAlbum.cover_image_id) {
          await galleryRepository.update(albumId, { cover_image_id: media_ids[0], updated_by: userId });
        }
      }
    }

    return ok(true);
  }

  /**
   * Hard deletes an album cascading to items and media.
   */
  async removeAlbumCascade(albumId: ID): Promise<ServiceResult<boolean>> {
    const result = await galleryRepository.hardDeleteAlbumCascade(albumId);
    if (result.error) return fail(result.error.message);
    return ok(true);
  }

  /**
   * Updates a specific photo (updates its parent album if it's the only item, or splits it).
   */
  async updatePhoto(itemId: ID, dto: UpdatePhotoDTO, userId: ID): Promise<ServiceResult<boolean>> {
    const parsed = updatePhotoSchema.safeParse(dto);
    if (!parsed.success)
      return fail(parsed.error.issues.map((e: { message: string }) => e.message).join(', '));
    
    // Get the item to find its album
    const supabase = await (await import('@/lib/supabase/server')).createServerSupabaseClient();
    const { data: item } = await supabase.from('gallery_items').select('*').eq('id', itemId).single();
    
    if (!item) return fail('Photo not found');

    // Let's just update using direct supabase for now since repository lacks updateItem
    await supabase.from('gallery_items').update({
      description: parsed.data.description,
      location: parsed.data.location,
      is_featured: parsed.data.is_featured,
      media_file_id: parsed.data.media_id || item.media_file_id,
      updated_by: userId
    }).eq('id', itemId);

    // Update parent album
    await galleryRepository.update(item.album_id, {
      title: parsed.data.title,
      description: parsed.data.description,
      location: parsed.data.location,
      visibility: parsed.data.visibility as any,
      program_id: parsed.data.program_id,
      event_id: parsed.data.event_id,
      is_featured: parsed.data.is_featured,
      updated_by: userId,
      ...(parsed.data.media_id ? { cover_image_id: parsed.data.media_id } : {})
    });

    return ok(true);
  }
}


export const galleryService = new GalleryService();
