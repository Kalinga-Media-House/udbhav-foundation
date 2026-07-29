import type { IWriteRepository, ISearchableRepository, PaginatedResult, RepositoryResult, SortConfig, FilterMap } from '@/contracts/repositories';
import { DatabaseError } from '@/errors';
import { serverLogger } from "@/lib/logger/server-logger";
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Pagination, ID } from '@/types';

export type EventRow = {
  id: string;
  program_id: string;
  event_code: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  status: string;
  visibility: string;
  event_type: string;
  venue_name: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  start_time: string | null;
  end_time: string | null;
  max_attendees: number | null;
  registered_count: number;
  is_featured: boolean;
  cover_image_id: string | null;
  metadata: Record<string, unknown>;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
};

export type EventCreate = Omit<EventRow, 'id' | 'created_at' | 'updated_at' | 'is_deleted'>;
export type EventUpdate = Partial<Omit<EventCreate, 'event_code'>>;

export class EventsRepository implements IWriteRepository<EventRow, EventCreate, EventUpdate>, ISearchableRepository<EventRow> {
  /** Fetch a single event by ID. */
  async findById(id: ID): Promise<RepositoryResult<EventRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await (supabase.from('events' as any) as any).select('*').eq('id', id).eq('is_deleted', false).single();
      if (error) throw new DatabaseError(error.message);
      return { data: data as EventRow, error: null };
    } catch (error) {
      serverLogger.error('EventsRepository.findById failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /** Fetch a single event by slug. */
  async findBySlug(slug: string): Promise<RepositoryResult<EventRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await (supabase.from('events' as any) as any).select('*').eq('slug', slug).eq('is_deleted', false).single();
      if (error) throw new DatabaseError(error.message);
      return { data: data as EventRow, error: null };
    } catch (error) {
      serverLogger.error('EventsRepository.findBySlug failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /** Fetch events by associated program ID with pagination. */
  async findByProgram(programId: ID, pagination: Pagination): Promise<PaginatedResult<EventRow>> {
    const supabase = await createServerSupabaseClient();
    const from = (pagination.page - 1) * pagination.limit;
    const to = from + pagination.limit - 1;
    const { data, count, error } = await (supabase.from('events' as any) as any).select('*', { count: 'exact' }).eq('program_id', programId).eq('is_deleted', false).order('start_time', { ascending: false }).range(from, to);
    if (error) serverLogger.error('EventsRepository.findByProgram failed', new DatabaseError(error.message));
    return { data: (data as EventRow[]) ?? [], total: count ?? 0, page: pagination.page, limit: pagination.limit };
  }

  /** Fetch paginated events with optional sorting and filtering. */
  async findMany(params: { pagination: Pagination; sort?: SortConfig; filters?: FilterMap }): Promise<PaginatedResult<EventRow>> {
    const { pagination, sort, filters } = params;
    const supabase = await createServerSupabaseClient();
    let query = (supabase.from('events' as any) as any).select('*', { count: 'exact' }).eq('is_deleted', false);
    if (filters?.status) query = query.eq('status', filters.status as string);
    if (filters?.program_id) query = query.eq('program_id', filters.program_id as string);
    if (filters?.is_featured) query = query.eq('is_featured', true);
    const sortCol = sort?.column ?? 'start_time';
    query = query.order(sortCol, { ascending: sort?.order === 'asc' });
    const from = (pagination.page - 1) * pagination.limit;
    query = query.range(from, from + pagination.limit - 1);
    const { data, count, error } = await query;
    if (error) serverLogger.error('EventsRepository.findMany failed', new DatabaseError(error.message));
    return { data: (data as EventRow[]) ?? [], total: count ?? 0, page: pagination.page, limit: pagination.limit };
  }

  /** Create a new event. */
  async create(data: EventCreate): Promise<RepositoryResult<EventRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await (supabase.from('events' as any) as any).insert(data).select().single();
      if (error) throw new DatabaseError(error.message);
      return { data: row as EventRow, error: null };
    } catch (error) {
      serverLogger.error('EventsRepository.create failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /** Update an existing event. */
  async update(id: ID, data: EventUpdate): Promise<RepositoryResult<EventRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await (supabase.from('events' as any) as any).update(data).eq('id', id).eq('is_deleted', false).select().single();
      if (error) throw new DatabaseError(error.message);
      return { data: row as EventRow, error: null };
    } catch (error) {
      serverLogger.error('EventsRepository.update failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /** Soft-delete an event. */
  async softDelete(id: ID, deletedBy: ID): Promise<RepositoryResult<EventRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await (supabase.from('events' as any) as any).update({ is_deleted: true, deleted_by: deletedBy, deleted_at: new Date().toISOString() }).eq('id', id).select().single();
      if (error) throw new DatabaseError(error.message);
      return { data: row as EventRow, error: null };
    } catch (error) {
      serverLogger.error('EventsRepository.softDelete failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /** Restore a soft-deleted event. */
  async restore(id: ID): Promise<RepositoryResult<EventRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await (supabase.from('events' as any) as any).update({ is_deleted: false, deleted_at: null, deleted_by: null }).eq('id', id).select().single();
      if (error) throw new DatabaseError(error.message);
      return { data: row as EventRow, error: null };
    } catch (error) {
      serverLogger.error('EventsRepository.restore failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /** Full-text search across events. */
  async search(query: string, pagination: Pagination): Promise<PaginatedResult<EventRow>> {
    const supabase = await createServerSupabaseClient();
    const from = (pagination.page - 1) * pagination.limit;
    const { data, count, error } = await (supabase.from('events' as any) as any).select('*', { count: 'exact' }).eq('is_deleted', false).textSearch('search_vector', query, { type: 'websearch' }).range(from, from + pagination.limit - 1);
    if (error) serverLogger.error('EventsRepository.search failed', new DatabaseError(error.message));
    return { data: (data as EventRow[]) ?? [], total: count ?? 0, page: pagination.page, limit: pagination.limit };
  }
}

export const eventsRepository = new EventsRepository();
