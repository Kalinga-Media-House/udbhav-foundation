import type { IWriteRepository, ISearchableRepository, PaginatedResult, RepositoryResult, SortConfig, FilterMap } from '@/contracts/repositories';
import { DatabaseError } from '@/errors';
import { serverLogger } from "@/lib/logger/server-logger";
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Pagination, ID } from '@/types';
import type { Database } from '@/types/database/database.generated';

export type ProgramRow = Database['public']['Tables']['programs']['Row'] & {
  subtitle?: string | null;
  description?: string | null;
  display_order?: number;
  cover_image?: { r2_object_key: string | null } | null;
};

export type ProgramCreate = Omit<ProgramRow, 'id' | 'created_at' | 'updated_at' | 'is_deleted'>;
export type ProgramUpdate = Partial<Omit<ProgramCreate, 'program_code'>>;

export class ProgramsRepository implements IWriteRepository<ProgramRow, ProgramCreate, ProgramUpdate>, ISearchableRepository<ProgramRow> {
  /** Fetch a single program by UUID. */
  async findById(id: ID): Promise<RepositoryResult<ProgramRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from('programs')
        .select('*, cover_image:media_files!programs_cover_image_id_fkey(r2_object_key)')
        .eq('id', id)
        .eq('is_deleted', false)
        .single();
      if (error) throw new DatabaseError(error.message);
      return { data: data as ProgramRow, error: null };
    } catch (error) {
      serverLogger.error('ProgramsRepository.findById failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /** Fetch a single program by unique slug. */
  async findBySlug(slug: string): Promise<RepositoryResult<ProgramRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from('programs')
        .select('*, cover_image:media_files!programs_cover_image_id_fkey(r2_object_key)')
        .eq('slug', slug)
        .eq('is_deleted', false)
        .single();
      if (error) throw new DatabaseError(error.message);
      return { data: data as ProgramRow, error: null };
    } catch (error) {
      serverLogger.error('ProgramsRepository.findBySlug failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /** Fetch paginated programs matching criteria. */
  async findMany(params: { pagination: Pagination; sort?: SortConfig; filters?: FilterMap }): Promise<PaginatedResult<ProgramRow>> {
    const { pagination, sort, filters } = params;
    const supabase = await createServerSupabaseClient();
    let query = supabase.from('programs').select('*, cover_image:media_files!programs_cover_image_id_fkey(r2_object_key)', { count: 'exact' }).eq('is_deleted', false);

    if (filters?.status) query = query.eq('status', filters.status as Database['public']['Enums']['program_status']);
    if (filters?.visibility) query = query.eq('visibility', filters.visibility as Database['public']['Enums']['program_visibility']);
    if (filters?.is_featured) query = query.eq('is_featured', true);

    const sortCol = sort?.column ?? 'created_at';
    const sortOrder = sort?.order === 'asc' ? true : false;
    query = query.order(sortCol, { ascending: sortOrder });

    const from = (pagination.page - 1) * pagination.limit;
    const to = from + pagination.limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;
    if (error) serverLogger.error('ProgramsRepository.findMany failed', new DatabaseError(error.message));

    return { data: (data as ProgramRow[]) ?? [], total: count ?? 0, page: pagination.page, limit: pagination.limit };
  }

  /** Create a new program record. */
  async create(data: ProgramCreate): Promise<RepositoryResult<ProgramRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await (supabase.from('programs' as any) as any).insert(data).select().single();
      if (error) throw new DatabaseError(error.message);
      return { data: row as ProgramRow, error: null };
    } catch (error) {
      serverLogger.error('ProgramsRepository.create failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /** Update an existing program record. */
  async update(id: ID, data: ProgramUpdate): Promise<RepositoryResult<ProgramRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await (supabase.from('programs' as any) as any).update(data).eq('id', id).eq('is_deleted', false).select().single();
      if (error) throw new DatabaseError(error.message);
      return { data: row as ProgramRow, error: null };
    } catch (error) {
      serverLogger.error('ProgramsRepository.update failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /** Soft-delete a program record. */
  async softDelete(id: ID, deletedBy: ID): Promise<RepositoryResult<ProgramRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await (supabase.from('programs' as any) as any).update({ is_deleted: true, deleted_by: deletedBy, deleted_at: new Date().toISOString() }).eq('id', id).select().single();
      if (error) throw new DatabaseError(error.message);
      return { data: row as ProgramRow, error: null };
    } catch (error) {
      serverLogger.error('ProgramsRepository.softDelete failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /** Restore a soft-deleted program record. */
  async restore(id: ID): Promise<RepositoryResult<ProgramRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await (supabase.from('programs' as any) as any).update({ is_deleted: false, deleted_at: null, deleted_by: null }).eq('id', id).select().single();
      if (error) throw new DatabaseError(error.message);
      return { data: row as ProgramRow, error: null };
    } catch (error) {
      serverLogger.error('ProgramsRepository.restore failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /** Perform full-text search across program records. */
  async search(query: string, pagination: Pagination): Promise<PaginatedResult<ProgramRow>> {
    const supabase = await createServerSupabaseClient();
    const from = (pagination.page - 1) * pagination.limit;
    const to = from + pagination.limit - 1;
    const { data, count, error } = await supabase.from('programs').select('*, cover_image:media_files!programs_cover_image_id_fkey(r2_object_key)', { count: 'exact' }).eq('is_deleted', false).textSearch('search_vector', query, { type: 'websearch' }).range(from, to);
    if (error) serverLogger.error('ProgramsRepository.search failed', new DatabaseError(error.message));
    return { data: (data as ProgramRow[]) ?? [], total: count ?? 0, page: pagination.page, limit: pagination.limit };
  }
}

export const programsRepository = new ProgramsRepository();
