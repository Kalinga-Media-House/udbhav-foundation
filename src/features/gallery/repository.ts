import type { IWriteRepository, ISearchableRepository, PaginatedResult, RepositoryResult, SortConfig, FilterMap } from '@/contracts/repositories';
import { DatabaseError } from '@/errors';
import { serverLogger } from "@/lib/logger/server-logger";
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Pagination, ID } from '@/types';
import type { Database } from '@/types/database/database.generated';

/**
 * Database row shape for gallery albums.
 */
export type AlbumRow = Database['public']['Tables']['gallery_albums']['Row'] & {
  item_count?: number;
  location?: string | null;
};

/** Payload for creating a gallery album. */
export type AlbumCreate = Omit<AlbumRow, 'id' | 'created_at' | 'updated_at' | 'is_deleted' | 'item_count'> & {
  item_count?: number;
};

/** Payload for updating a gallery album. */
export type AlbumUpdate = Partial<Omit<AlbumCreate, 'album_code'>>;

/**
 * Database row shape for gallery items.
 */
export type GalleryItemRow = Database['public']['Tables']['gallery_items']['Row'];

export type GalleryItemWithMedia = GalleryItemRow & {
  media?: {
    id: string;
    cdn_url: string | null;
    alt_text: string | null;
    caption: string | null;
    
    width: number | null;
    height: number | null;
  } | null;
};

export type AdminPhotoItem = GalleryItemWithMedia & {
  album?: {
    id: string;
    title: string;
    visibility: string;
    program_id: string | null;
    event_id: string | null;
    location: string | null;
    is_featured: boolean;
  } | null;
};

/** Payload for adding a gallery item. */
export type GalleryItemCreate = Omit<GalleryItemRow, 'id' | 'created_at' | 'updated_at' | 'is_deleted'>;

/**
 * Gallery Repository managing database queries for gallery albums and items.
 */
export class GalleryRepository implements IWriteRepository<AlbumRow, AlbumCreate, AlbumUpdate>, ISearchableRepository<AlbumRow> {
  /**
   * Finds a gallery album by unique ID.
   * @param id - Album ID.
   * @returns Repository result containing album row or error.
   */
  async findById(id: ID): Promise<RepositoryResult<AlbumRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.from('gallery_albums').select('*').eq('id', id).eq('is_deleted', false).single();
      if (error) throw new DatabaseError(error.message);
      return { data, error: null };
    } catch (error) {
      serverLogger.error('GalleryRepository.findById failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Generates the next available album code for the current year (e.g. GAL-2026-0001)
   */
  async generateAlbumCode(): Promise<string> {
    try {
      const supabase = await createServerSupabaseClient();
      const year = new Date().getFullYear();
      const prefix = `GAL-${year}-`;
      const { data, error } = await supabase
        .from('gallery_albums')
        .select('album_code')
        .like('album_code', `${prefix}%`)
        .order('album_code', { ascending: false })
        .limit(1)
        .single();

      let nextNumber = 1;
      if (data && data.album_code) {
        const parts = data.album_code.split('-');
        if (parts.length === 3) {
          const lastNumber = parseInt(parts[2], 10);
          if (!isNaN(lastNumber)) {
            nextNumber = lastNumber + 1;
          }
        }
      }

      return `${prefix}${nextNumber.toString().padStart(4, '0')}`;
    } catch (error) {
      serverLogger.error('GalleryRepository.generateAlbumCode failed', error as Error);
      const year = new Date().getFullYear();
      // fallback if error
      return `GAL-${year}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    }
  }

  /**
   * Finds a gallery album by URL slug.
   * @param slug - Album slug.
   * @returns Repository result containing album row or error.
   */
  async findBySlug(slug: string): Promise<RepositoryResult<AlbumRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.from('gallery_albums').select('*').eq('slug', slug).eq('is_deleted', false).single();
      if (error) throw new DatabaseError(error.message);
      return { data, error: null };
    } catch (error) {
      serverLogger.error('GalleryRepository.findBySlug failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Retrieves a paginated list of gallery albums filtered by parameters.
   * @param params - Object containing pagination, sorting, and filters.
   * @returns Paginated result of album rows.
   */
  async findMany(params: { pagination: Pagination; sort?: SortConfig; filters?: FilterMap }): Promise<PaginatedResult<AlbumRow>> {
    const { pagination, sort, filters } = params;
    const supabase = await createServerSupabaseClient();
    let query = supabase.from('gallery_albums').select('*', { count: 'exact' }).eq('is_deleted', false);
    if (filters?.status) query = query.eq('status', filters.status as any);
    if (filters?.album_type) query = query.eq('album_type', filters.album_type as any);
    if (filters?.visibility) query = query.eq('visibility', filters.visibility as any);
    if (filters?.is_featured) query = query.eq('is_featured', true);
    query = query.order(sort?.column ?? 'created_at', { ascending: sort?.order === 'asc' });
    const from = (pagination.page - 1) * pagination.limit;
    query = query.range(from, from + pagination.limit - 1);
    const { data, count, error } = await query;
    if (error) serverLogger.error('GalleryRepository.findMany failed', new DatabaseError(error.message));
    return { data: data ?? [], total: count ?? 0, page: pagination.page, limit: pagination.limit };
  }

  /**
   * Inserts a new gallery album into the database.
   * @param data - Album creation payload.
   * @returns Repository result with created album row or error.
   */
  async create(data: AlbumCreate): Promise<RepositoryResult<AlbumRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await (supabase.from('gallery_albums') as any).insert(data as any).select().single();
      if (error) throw new DatabaseError(error.message);
      return { data: row, error: null };
    } catch (error) {
      serverLogger.error('GalleryRepository.create failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Updates an existing gallery album.
   * @param id - Album ID.
   * @param data - Partial update payload.
   * @returns Repository result with updated album row or error.
   */
  async update(id: ID, data: AlbumUpdate): Promise<RepositoryResult<AlbumRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await (supabase.from('gallery_albums') as any).update(data as any).eq('id', id).select().single();
      if (error) throw new DatabaseError(error.message);
      return { data: row, error: null };
    } catch (error) {
      serverLogger.error('GalleryRepository.update failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Soft-deletes a gallery album by setting is_deleted flag.
   * @param id - Album ID.
   * @param deletedBy - User ID performing deletion.
   * @returns Repository result with deleted album row or error.
   */
  async softDelete(id: ID, deletedBy: ID): Promise<RepositoryResult<AlbumRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await (supabase.from('gallery_albums') as any).update({ is_deleted: true, deleted_by: deletedBy, deleted_at: new Date().toISOString() } as any).eq('id', id).select().single();
      if (error) throw new DatabaseError(error.message);
      return { data: row, error: null };
    } catch (error) {
      serverLogger.error('GalleryRepository.softDelete failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Restores a soft-deleted gallery album.
   * @param id - Album ID.
   * @returns Repository result with restored album row or error.
   */
  async restore(id: ID): Promise<RepositoryResult<AlbumRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await (supabase.from('gallery_albums') as any).update({ is_deleted: false, deleted_at: null, deleted_by: null } as any).eq('id', id).select().single();
      if (error) throw new DatabaseError(error.message);
      return { data: row, error: null };
    } catch (error) {
      serverLogger.error('GalleryRepository.restore failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Searches gallery albums using full-text search vector.
   * @param query - Text query string.
   * @param pagination - Pagination options.
   * @returns Paginated result of matching album rows.
   */
  async search(query: string, pagination: Pagination): Promise<PaginatedResult<AlbumRow>> {
    const supabase = await createServerSupabaseClient();
    const from = (pagination.page - 1) * pagination.limit;
    const { data, count, error } = await supabase.from('gallery_albums').select('*', { count: 'exact' }).eq('is_deleted', false).textSearch('search_vector', query, { type: 'websearch' }).range(from, from + pagination.limit - 1);
    if (error) serverLogger.error('GalleryRepository.search failed', new DatabaseError(error.message));
    return { data: data ?? [], total: count ?? 0, page: pagination.page, limit: pagination.limit };
  }

  /**
   * Adds an item to a gallery album.
   * @param data - Gallery item creation payload.
   * @returns Repository result with created item row or error.
   */
  async addItem(data: GalleryItemCreate): Promise<RepositoryResult<GalleryItemRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await (supabase.from('gallery_items') as any).insert(data as any).select().single();
      if (error) throw new DatabaseError(error.message);
      return { data: row, error: null };
    } catch (error) {
      serverLogger.error('GalleryRepository.addItem failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Removes an item from a gallery album.
   * @param itemId - Gallery item ID.
   * @returns Repository result with deleted item row or error.
   */
  async removeItem(itemId: ID): Promise<RepositoryResult<GalleryItemRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await supabase.from('gallery_items').delete().eq('id', itemId).select().single();
      if (error) throw new DatabaseError(error.message);
      return { data: row, error: null };
    } catch (error) {
      serverLogger.error('GalleryRepository.removeItem failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Lists items for a gallery album with pagination.
   * @param albumId - Album ID.
   * @param pagination - Pagination parameters.
   * @returns Paginated result of gallery item rows.
   */
  async listItems(albumId: ID, pagination: Pagination): Promise<PaginatedResult<GalleryItemRow>> {
    const supabase = await createServerSupabaseClient();
    const from = (pagination.page - 1) * pagination.limit;
    const { data, count, error } = await supabase.from('gallery_items').select('*', { count: 'exact' }).eq('album_id', albumId).order('display_order', { ascending: true }).range(from, from + pagination.limit - 1);
    if (error) serverLogger.error('GalleryRepository.listItems failed', new DatabaseError(error.message));
    return { data: (data as GalleryItemRow[]) ?? [], total: count ?? 0, page: pagination.page, limit: pagination.limit };
  }

  /**
   * Lists items for a gallery album enriched with media_files data.
   * @param albumId - Album ID.
   * @param pagination - Pagination parameters.
   * @returns Paginated result of gallery items enriched with media info.
   */
  async listItemsWithMedia(albumId: ID, pagination: Pagination): Promise<PaginatedResult<GalleryItemWithMedia>> {
    const supabase = await createServerSupabaseClient();
    const from = (pagination.page - 1) * pagination.limit;
    const { data: rawItems, count, error } = await supabase
      .from('gallery_items')
      .select('*', { count: 'exact' })
      .eq('album_id', albumId)
      .order('display_order', { ascending: true })
      .range(from, from + pagination.limit - 1);

    if (error) {
      serverLogger.error('GalleryRepository.listItemsWithMedia failed', new DatabaseError(error.message));
      return { data: [], total: 0, page: pagination.page, limit: pagination.limit };
    }

    const items = (rawItems as GalleryItemRow[]) ?? [];

    if (items.length === 0) {
      return { data: [], total: 0, page: pagination.page, limit: pagination.limit };
    }

    const mediaIds = items.map((item) => item.media_file_id);
    const { data: rawMediaList } = await supabase
      .from('media_files')
      .select('id, cdn_url, alt_text, caption, width, height')
      .in('id', mediaIds);

    const mediaList = (rawMediaList as { id: string; cdn_url: string | null; alt_text: string | null; caption: string | null;  width: number | null; height: number | null }[]) ?? [];
    const mediaMap = new Map(mediaList.map((m) => [m.id, m]));

    const enrichedItems: GalleryItemWithMedia[] = items.map((item) => ({
      ...item,
      media: mediaMap.get(item.media_file_id) || null,
    }));

    return {
      data: enrichedItems,
      total: count ?? 0,
      page: pagination.page,
      limit: pagination.limit,
    };
  }

  /**
   * Lists all photos across all albums for the Admin CMS.
   */
  async listPhotos(pagination: Pagination, filters?: FilterMap): Promise<PaginatedResult<AdminPhotoItem>> {
    const supabase = await createServerSupabaseClient();
    const from = (pagination.page - 1) * pagination.limit;
    
    // Step 1: Query items with their parent albums
    let query = supabase
      .from('gallery_items')
      .select(`
        *,
        album:gallery_albums!inner(id, title, visibility, program_id, event_id, location, is_featured, is_deleted)
      `, { count: 'exact' })
      .eq('gallery_albums.is_deleted', false)
      .order('created_at', { ascending: false });

    // Note: since PostgREST doesn't easily filter on nested properties dynamically if not simple,
    // we assume filters are limited for now or handle them simply.
    
    query = query.range(from, from + pagination.limit - 1);
    
    const { data: rawItems, count, error } = await query;

    if (error) {
      serverLogger.error('GalleryRepository.listPhotos failed', new DatabaseError(error.message));
      return { data: [], total: 0, page: pagination.page, limit: pagination.limit };
    }

    const items = (rawItems as any[]) ?? [];

    if (items.length === 0) {
      return { data: [], total: 0, page: pagination.page, limit: pagination.limit };
    }

    // Step 2: Fetch media
    const mediaIds = items.map((item) => item.media_file_id);
    const { data: rawMediaList } = await supabase
      .from('media_files')
      .select('id, cdn_url, alt_text, caption, width, height')
      .in('id', mediaIds);

    const mediaList = (rawMediaList as any[]) ?? [];
    const mediaMap = new Map(mediaList.map((m) => [m.id, m]));

    const enrichedItems: AdminPhotoItem[] = items.map((item) => ({
      ...item,
      media: mediaMap.get(item.media_file_id) || null,
      album: item.album || null
    }));

    return {
      data: enrichedItems,
      total: count ?? 0,
      page: pagination.page,
      limit: pagination.limit,
    };
  }
}


export const galleryRepository = new GalleryRepository();
