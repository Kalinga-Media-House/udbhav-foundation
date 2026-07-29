import type { IWriteRepository, ISearchableRepository, PaginatedResult, RepositoryResult, SortConfig } from '@/contracts/repositories';
import { DatabaseError } from '@/errors';
import { serverLogger } from "@/lib/logger/server-logger";
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Pagination, ID } from '@/types';

export type IndexInitiativeRow = {
  id: string;
  title: string;
  slug: string;
  initiative_type: string;
  cover_media_id: string | null;
  short_summary: string;
  description: string | null;
  event_date: string | null;
  year: number;
  location: string | null;
  beneficiaries: string | null;
  volunteers: string | null;
  chief_guest: string | null;
  outcome: string | null;
  duration: string | null;
  partner_name: string | null;
  featured: boolean;
  display_order: number;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[];
  status: 'Draft' | 'Published' | 'Archived';
  published_at: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
};

export type IndexInitiativeGalleryRow = {
  id: string;
  initiative_id: string;
  media_id: string;
  caption: string | null;
  display_order: number;
  created_at: string;
};

export type IndexInitiativeWithMedia = IndexInitiativeRow & {
  cover_image_url?: string | null;
  gallery?: Array<{
    id: string;
    media_id: string;
    caption: string | null;
    display_order: number;
    cdn_url: string | null;
    alt_text: string | null;
  }>;
};

export type IndexInitiativeCreate = Omit<IndexInitiativeRow, 'id' | 'created_at' | 'updated_at' | 'is_deleted' | 'published_at'> & {
  published_at?: string | null;
};

export type IndexInitiativeUpdate = Partial<IndexInitiativeCreate>;

export class IndexInitiativesRepository
  implements
    IWriteRepository<IndexInitiativeRow, IndexInitiativeCreate, IndexInitiativeUpdate>,
    ISearchableRepository<IndexInitiativeRow>
{
  async findById(id: ID): Promise<RepositoryResult<IndexInitiativeWithMedia>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await supabase
        .from('index_initiatives')
        .select('*')
        .eq('id', id)
        .eq('is_deleted', false)
        .single();
      if (error) throw new DatabaseError(error.message);
      if (!row) return { data: null, error: null };

      const enriched = await this.enrichWithMedia([row as IndexInitiativeRow]);
      return { data: enriched[0] ?? null, error: null };
    } catch (error) {
      serverLogger.error('IndexInitiativesRepository.findById failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async findBySlug(slug: string): Promise<RepositoryResult<IndexInitiativeWithMedia>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await supabase
        .from('index_initiatives')
        .select('*')
        .eq('slug', slug)
        .eq('is_deleted', false)
        .single();
      if (error) throw new DatabaseError(error.message);
      if (!row) return { data: null, error: null };

      const enriched = await this.enrichWithMedia([row as IndexInitiativeRow]);
      return { data: enriched[0] ?? null, error: null };
    } catch (error) {
      serverLogger.error('IndexInitiativesRepository.findBySlug failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async findMany(params: {
    pagination: Pagination;
    sort?: SortConfig;
    filters?: Record<string, unknown>;
    search?: string;
  }): Promise<PaginatedResult<IndexInitiativeWithMedia>> {
    const { pagination, sort, filters, search } = params;
    const supabase = await createServerSupabaseClient();
    let query = supabase.from('index_initiatives').select('*', { count: 'exact' }).eq('is_deleted', false);

    if (filters?.status) query = query.eq('status', filters.status as string);
    if (filters?.initiative_type) query = query.eq('initiative_type', filters.initiative_type as string);
    if (filters?.year) query = query.eq('year', Number(filters.year));
    if (filters?.featured !== undefined) query = query.eq('featured', Boolean(filters.featured));

    if (search && search.trim().length > 0) {
      const q = search.trim();
      if (!isNaN(Number(q)) && Number(q) > 1900 && Number(q) < 2100) {
        query = query.or(`title.ilike.%${q}%,year.eq.${Number(q)}`);
      } else {
        query = query.ilike('title', `%${q}%`);
      }
    }

    const sortCol = sort?.column ?? 'display_order';
    const sortOrder = sort?.order === 'asc';
    query = query.order(sortCol, { ascending: sortOrder }).order('year', { ascending: false });

    const from = (pagination.page - 1) * pagination.limit;
    const to = from + pagination.limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;
    if (error) {
      serverLogger.error('IndexInitiativesRepository.findMany failed', new DatabaseError(error.message));
      return { data: [], total: 0, page: pagination.page, limit: pagination.limit };
    }

    const enriched = await this.enrichWithMedia((data as IndexInitiativeRow[]) ?? []);
    return { data: enriched, total: count ?? 0, page: pagination.page, limit: pagination.limit };
  }

  async findAdjacent(
    currentId: string,
    _currentOrder: number
  ): Promise<{
    prev: IndexInitiativeWithMedia | null;
    next: IndexInitiativeWithMedia | null;
  }> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: allRows, error } = await supabase
        .from('index_initiatives')
        .select('*')
        .eq('status', 'Published')
        .eq('is_deleted', false)
        .order('display_order', { ascending: true })
        .order('year', { ascending: false });
      if (error || !allRows || allRows.length === 0) return { prev: null, next: null };

      const idx = allRows.findIndex((r: { id: string }) => r.id === currentId);
      if (idx === -1) return { prev: null, next: null };

      const prevRow = idx > 0 ? (allRows[idx - 1] as IndexInitiativeRow) : null;
      const nextRow = idx < allRows.length - 1 ? (allRows[idx + 1] as IndexInitiativeRow) : null;

      const itemsToEnrich = [prevRow, nextRow].filter((r): r is IndexInitiativeRow => r !== null);
      const enriched = await this.enrichWithMedia(itemsToEnrich);

      const prev = prevRow ? enriched.find((e) => e.id === prevRow.id) ?? null : null;
      const next = nextRow ? enriched.find((e) => e.id === nextRow.id) ?? null : null;
      return { prev, next };
    } catch (error) {
      serverLogger.error('IndexInitiativesRepository.findAdjacent failed', error as Error);
      return { prev: null, next: null };
    }
  }

  async create(data: IndexInitiativeCreate): Promise<RepositoryResult<IndexInitiativeRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await (supabase.from('index_initiatives' as any) as any).insert(data).select().single();
      if (error) throw new DatabaseError(error.message);
      return { data: row as IndexInitiativeRow, error: null };
    } catch (error) {
      serverLogger.error('IndexInitiativesRepository.create failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async update(id: ID, data: IndexInitiativeUpdate): Promise<RepositoryResult<IndexInitiativeRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await (supabase.from('index_initiatives' as any) as any)
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('is_deleted', false)
        .select()
        .single();
      if (error) throw new DatabaseError(error.message);
      return { data: row as IndexInitiativeRow, error: null };
    } catch (error) {
      serverLogger.error('IndexInitiativesRepository.update failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async softDelete(id: ID, deletedBy: ID): Promise<RepositoryResult<IndexInitiativeRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await (supabase.from('index_initiatives' as any) as any)
        .update({ is_deleted: true, updated_by: deletedBy, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new DatabaseError(error.message);
      return { data: row as IndexInitiativeRow, error: null };
    } catch (error) {
      serverLogger.error('IndexInitiativesRepository.softDelete failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async restore(id: ID): Promise<RepositoryResult<IndexInitiativeRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await (supabase.from('index_initiatives' as any) as any)
        .update({ is_deleted: false, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new DatabaseError(error.message);
      return { data: row as IndexInitiativeRow, error: null };
    } catch (error) {
      serverLogger.error('IndexInitiativesRepository.restore failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async search(query: string, pagination: Pagination): Promise<PaginatedResult<IndexInitiativeRow>> {
    return this.findMany({ pagination, search: query });
  }

  async syncGallery(initiativeId: ID, mediaIds: string[]): Promise<void> {
    try {
      const supabase = await createServerSupabaseClient();
      await (supabase.from('index_initiative_gallery' as any) as any).delete().eq('initiative_id', initiativeId);

      if (mediaIds.length > 0) {
        const payload = mediaIds.map((media_id, idx) => ({
          initiative_id: initiativeId,
          media_id,
          display_order: idx + 1,
        }));
        const { error } = await (supabase.from('index_initiative_gallery' as any) as any).insert(payload);
        if (error) throw new DatabaseError(error.message);
      }
    } catch (error) {
      serverLogger.error('IndexInitiativesRepository.syncGallery failed', error as Error);
      throw error;
    }
  }

  private async enrichWithMedia(rows: IndexInitiativeRow[]): Promise<IndexInitiativeWithMedia[]> {
    if (rows.length === 0) return [];

    try {
      const supabase = await createServerSupabaseClient();
      const initiativeIds = rows.map((r) => r.id);
      const coverMediaIds = rows.map((r) => r.cover_media_id).filter((id): id is string => Boolean(id));

      const mediaMap = new Map<string, { cdn_url: string | null; alt_text: string | null }>();

      if (coverMediaIds.length > 0) {
        const { data: coverMedia } = await supabase
          .from('media_files')
          .select('id, cdn_url, alt_text')
          .in('id', coverMediaIds);
        if (coverMedia) {
          coverMedia.forEach((m: { id: string; cdn_url: string | null; alt_text: string | null }) => {
            mediaMap.set(m.id, { cdn_url: m.cdn_url, alt_text: m.alt_text });
          });
        }
      }

      const { data: galleryItems } = await supabase
        .from('index_initiative_gallery')
        .select('id, initiative_id, media_id, caption, display_order')
        .in('initiative_id', initiativeIds)
        .order('display_order', { ascending: true });

      const galleryMediaIds = (galleryItems || []).map((g: { media_id: string }) => g.media_id);
      if (galleryMediaIds.length > 0) {
        const { data: galMedia } = await supabase
          .from('media_files')
          .select('id, cdn_url, alt_text')
          .in('id', galleryMediaIds);
        if (galMedia) {
          galMedia.forEach((m: { id: string; cdn_url: string | null; alt_text: string | null }) => {
            mediaMap.set(m.id, { cdn_url: m.cdn_url, alt_text: m.alt_text });
          });
        }
      }

      const galleryMap = new Map<string, Array<{ id: string; media_id: string; caption: string | null; display_order: number; cdn_url: string | null; alt_text: string | null }>>();
      (galleryItems || []).forEach((item: { id: string; initiative_id: string; media_id: string; caption: string | null; display_order: number }) => {
        const media = mediaMap.get(item.media_id);
        const entry = {
          id: item.id,
          media_id: item.media_id,
          caption: item.caption,
          display_order: item.display_order,
          cdn_url: media?.cdn_url || null,
          alt_text: media?.alt_text || null,
        };
        const list = galleryMap.get(item.initiative_id) || [];
        list.push(entry);
        galleryMap.set(item.initiative_id, list);
      });

      return rows.map((row) => {
        const coverObj = row.cover_media_id ? mediaMap.get(row.cover_media_id) : undefined;
        return {
          ...row,
          cover_image_url: coverObj?.cdn_url || null,
          gallery: galleryMap.get(row.id) || [],
        };
      });
    } catch (error) {
      serverLogger.error('IndexInitiativesRepository.enrichWithMedia failed', error as Error);
      return rows.map((row) => ({ ...row, cover_image_url: null, gallery: [] }));
    }
  }
}

export const indexInitiativesRepository = new IndexInitiativesRepository();
