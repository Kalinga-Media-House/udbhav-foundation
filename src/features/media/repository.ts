import type { PaginatedResult, RepositoryResult } from '@/contracts/repositories';
import { DatabaseError } from '@/errors';
import { serverLogger } from "@/lib/logger/server-logger";
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Pagination, ID } from '@/types';
import type { Database } from '@/types/database/database.generated';

export type MediaFileRow = Database['public']['Tables']['media_files']['Row'];

export type MediaFileCreate = Omit<
  MediaFileRow,
  'id' | 'created_at' | 'updated_at' | 'is_deleted'
>;

/**
 * Repository layer for media files table operations in Supabase.
 */
export class MediaRepository {
  /**
   * Retrieves a non-deleted media file by its unique ID.
   *
   * @param id - Unique media file ID.
   * @returns RepositoryResult wrapping the MediaFileRow.
   */
  async findById(id: ID): Promise<RepositoryResult<MediaFileRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from('media_files')
        .select('*')
        .eq('id', id)
        .eq('is_deleted', false)
        .single();
      if (error) throw new DatabaseError(error.message);
      return { data, error: null };
    } catch (error) {
      serverLogger.error('MediaRepository.findById failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Lists active media files attached to a specific entity with pagination.
   *
   * @param entityType - Entity discriminator string.
   * @param entityId - Entity identifier.
   * @param pagination - Pagination options.
   * @returns PaginatedResult wrapping matching MediaFileRow items.
   */
  async listByEntity(
    entityType: string,
    entityId: ID,
    pagination: Pagination
  ): Promise<PaginatedResult<MediaFileRow>> {
    const supabase = await createServerSupabaseClient();
    const from = (pagination.page - 1) * pagination.limit;
    const { data, count, error } = await supabase
      .from('media_files')
      .select('*', { count: 'exact' })
      .eq('entity_type' as any, entityType)
      .eq('entity_id' as any, entityId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .range(from, from + pagination.limit - 1);
    if (error) {
      serverLogger.error(
        'MediaRepository.listByEntity failed',
        new DatabaseError(error.message)
      );
    }
    return {
      data: data ?? [],
      total: count ?? 0,
      page: pagination.page,
      limit: pagination.limit,
    };
  }

  /**
   * Inserts a new media file record into the database.
   *
   * @param data - Media file creation payload.
   * @returns RepositoryResult wrapping created MediaFileRow.
   */
  async create(data: MediaFileCreate): Promise<RepositoryResult<MediaFileRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await (supabase.from('media_files') as any)
        .insert(data)
        .select()
        .single();
      if (error) throw new DatabaseError(error.message);
      return { data: row, error: null };
    } catch (error) {
      serverLogger.error('MediaRepository.create failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Soft deletes a media file record.
   *
   * @param id - Media file ID.
   * @param deletedBy - User ID deleting the record.
   * @returns RepositoryResult wrapping updated MediaFileRow.
   */
  async softDelete(id: ID, deletedBy: ID): Promise<RepositoryResult<MediaFileRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await (supabase.from('media_files') as any)
        .update({
          is_deleted: true,
          deleted_by: deletedBy,
          deleted_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new DatabaseError(error.message);
      return { data: row, error: null };
    } catch (error) {
      serverLogger.error('MediaRepository.softDelete failed', error as Error);
      return { data: null, error: error as Error };
    }
  }
}

export const mediaRepository = new MediaRepository();
