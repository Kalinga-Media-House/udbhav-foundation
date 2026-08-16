import { createServerSupabaseClient } from '@/lib/supabase/server';
import { DatabaseError } from '@/errors';
import { serverLogger } from '@/lib/logger/server-logger';
import { PaginatedResult, RepositoryResult } from '@/contracts/repositories';
import type { Pagination } from '@/types';

export type ID = string;

export interface PodcastRow {
  id: string;
  title: string;
  slug: string;
  episode_number: string | null;
  excerpt: string | null;
  description: string | null;
  thumbnail_id: string | null;
  youtube_url: string | null;
  audio_url: string | null;
  duration: string | null;
  guest_name: string | null;
  guest_role: string | null;
  guest_profile_photo_url: string | null;
  topics: string[] | null;
  status: string;
  visibility: string;
  release_date: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface PodcastWithMedia extends PodcastRow {
  thumbnail: {
    id: string;
    cdn_url: string | null;
    alt_text: string | null;
  } | null;
}

export type PodcastCreate = Omit<PodcastRow, 'id' | 'created_at' | 'updated_at'>;
export type PodcastUpdate = Partial<PodcastCreate>;

export class PodcastRepository {
  async findById(id: ID): Promise<RepositoryResult<PodcastWithMedia>> {
    const supabase = await createServerSupabaseClient() as any;
    const { data, error } = await supabase.from('podcast_episodes')
      .select('*')
      .eq('id', id)
      .eq('is_deleted', false)
      .single();

    if (error || !data) return { data: null, error: new DatabaseError(error?.message || 'Not found') };

    const podcast = data as PodcastRow;
    let thumbnail = null;

    if (podcast.thumbnail_id) {
      const { data: media } = await supabase
        .from('media_files')
        .select('id, cdn_url, alt_text')
        .eq('id', podcast.thumbnail_id)
        .single();
      thumbnail = media || null;
    }

    return { data: { ...podcast, thumbnail }, error: null };
  }

  async findBySlug(slug: string): Promise<RepositoryResult<PodcastWithMedia>> {
    const supabase = await createServerSupabaseClient() as any;
    const { data, error } = await supabase.from('podcast_episodes')
      .select('*')
      .eq('slug', slug)
      .eq('is_deleted', false)
      .single();

    if (error || !data) return { data: null, error: new DatabaseError(error?.message || 'Not found') };

    const podcast = data as PodcastRow;
    let thumbnail = null;

    if (podcast.thumbnail_id) {
      const { data: media } = await supabase
        .from('media_files')
        .select('id, cdn_url, alt_text')
        .eq('id', podcast.thumbnail_id)
        .single();
      thumbnail = media || null;
    }

    return { data: { ...podcast, thumbnail }, error: null };
  }

  async list(pagination: Pagination, filters?: Record<string, unknown>): Promise<PaginatedResult<PodcastWithMedia>> {
    const supabase = await createServerSupabaseClient() as any;
    const from = (pagination.page - 1) * pagination.limit;
    
    let query = supabase.from('podcast_episodes')
      .select('*', { count: 'exact' })
      .eq('is_deleted', false);

    if (filters?.status && filters.status !== 'ALL') {
      query = query.eq('status', filters.status);
    }
    if (filters?.visibility) {
      query = query.eq('visibility', filters.visibility);
    }
    if (filters?.is_featured !== undefined) {
      query = query.eq('is_featured', filters.is_featured);
    }

    const { data, count, error } = await query
      .order('release_date', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, from + pagination.limit - 1);

    if (error) {
      serverLogger.error('PodcastRepository.list failed', new DatabaseError(error.message));
      return { data: [], total: 0, page: pagination.page, limit: pagination.limit };
    }

    const rawRows = (data ?? []) as PodcastRow[];
    
    const thumbnailIds = Array.from(new Set(rawRows.map(p => p.thumbnail_id).filter(Boolean))) as string[];
    const mediaMap = new Map();
    
    if (thumbnailIds.length > 0) {
      const { data: mediaRows } = await supabase
        .from('media_files')
        .select('id, cdn_url, alt_text')
        .in('id', thumbnailIds);
        
      (mediaRows || []).forEach((m: any) => mediaMap.set(m.id, m));
    }

    const withMediaList = rawRows.map(item => ({
      ...item,
      thumbnail: item.thumbnail_id ? mediaMap.get(item.thumbnail_id) || null : null,
    }));

    return {
      data: withMediaList,
      total: count ?? 0,
      page: pagination.page,
      limit: pagination.limit,
    };
  }

  async create(data: PodcastCreate): Promise<RepositoryResult<PodcastRow>> {
    try {
      const supabase = await createServerSupabaseClient() as any;
      const payload: Record<string, unknown> = { ...data };
      
      const { data: resData, error } = await supabase.from('podcast_episodes')
        .insert(payload)
        .select()
        .single();
        
      if (error) throw new DatabaseError(error.message);
      return { data: resData as PodcastRow, error: null };
    } catch (error) {
      serverLogger.error('PodcastRepository.create failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async update(id: ID, data: PodcastUpdate): Promise<RepositoryResult<PodcastRow>> {
    try {
      const supabase = await createServerSupabaseClient() as any;
      const payload: Record<string, unknown> = { ...data };
      
      const { data: resData, error } = await supabase.from('podcast_episodes')
        .update(payload)
        .eq('id', id)
        .eq('is_deleted', false)
        .select()
        .single();
        
      if (error) throw new DatabaseError(error.message);
      return { data: resData as PodcastRow, error: null };
    } catch (error) {
      serverLogger.error('PodcastRepository.update failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async softDelete(id: ID, deletedBy: ID): Promise<RepositoryResult<PodcastRow>> {
    try {
      const supabase = await createServerSupabaseClient() as any;
      const { data, error } = await supabase.from('podcast_episodes')
        .update({
          is_deleted: true,
          deleted_by: deletedBy,
          deleted_at: new Date().toISOString(),
          status: 'Draft',
        })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw new DatabaseError(error.message);
      return { data: data as PodcastRow, error: null };
    } catch (error) {
      serverLogger.error('PodcastRepository.softDelete failed', error as Error);
      return { data: null, error: error as Error };
    }
  }
}

export const podcastRepository = new PodcastRepository();
