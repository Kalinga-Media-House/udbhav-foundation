import type { IWriteRepository, ISearchableRepository, PaginatedResult, RepositoryResult, SortConfig, FilterMap } from '@/contracts/repositories';
import { DatabaseError } from '@/errors';
import { serverLogger } from "@/lib/logger/server-logger";
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Pagination, ID } from '@/types';

export type ArticleRow = {
  id: string;
  article_code: string;
  slug: string;
  title: string;
  subtitle: string | null;
  content: string;
  summary: string | null;
  cover_image_id: string | null;
  author_profile_id: string | null;
  status: string;
  visibility: string;
  published_at: string | null;
  is_featured: boolean;
  view_count: number;
  metadata: Record<string, unknown>;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
};

export type ArticleWithMedia = ArticleRow & {
  cover_image?: {
    id: string;
    cdn_url: string | null;
    alt_text: string | null;
    caption: string | null;
    width: number | null;
    height: number | null;
  } | null;
  category?: string;
  tags?: string[];
  author_name?: string;
  author_role?: string;
  reading_time?: number;
  program_id?: string | null;
  event_id?: string | null;
};

export type ArticleCreate = Omit<ArticleRow, 'id' | 'created_at' | 'updated_at' | 'is_deleted' | 'view_count'>;
export type ArticleUpdate = Partial<Omit<ArticleCreate, 'article_code'>>;

function computeReadingTime(content: string): number {
  if (!content) return 1;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function enrichArticleMetadata(article: ArticleRow): ArticleWithMedia {
  const meta = (article.metadata || {}) as Record<string, unknown>;
  return {
    ...article,
    category: typeof meta.category === 'string' ? meta.category : 'News',
    tags: Array.isArray(meta.tags) ? (meta.tags as string[]) : [],
    author_name: typeof meta.author_name === 'string' ? meta.author_name : 'UDBHAV Foundation',
    author_role: typeof meta.author_role === 'string' ? meta.author_role : 'Editorial Team',
    reading_time: typeof meta.reading_time === 'number' ? meta.reading_time : computeReadingTime(article.content || ''),
    program_id: typeof meta.program_id === 'string' ? meta.program_id : null,
    event_id: typeof meta.event_id === 'string' ? meta.event_id : null,
  };
}

export class NewsRepository implements IWriteRepository<ArticleRow, ArticleCreate, ArticleUpdate>, ISearchableRepository<ArticleRow> {
  /**
   * Finds an article by ID and enriches it with metadata.
   */
  async findById(id: ID): Promise<RepositoryResult<ArticleWithMedia>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('id', id)
        .eq('is_deleted', false)
        .single();
      if (error) throw new DatabaseError(error.message);

      const enriched = enrichArticleMetadata(data as unknown as ArticleRow);
      if (enriched.cover_image_id) {
        const { data: rawMedia } = await supabase
          .from('media_files')
          .select('id, cdn_url, alt_text, caption, width, height')
          .eq('id', enriched.cover_image_id)
          .single();
        const media = rawMedia as { id: string; cdn_url: string | null; alt_text: string | null; caption: string | null; width: number | null; height: number | null } | null;
        if (media) {
          enriched.cover_image = media;
        }
      }

      return { data: enriched, error: null };
    } catch (error) {
      serverLogger.error('NewsRepository.findById failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Finds an article by unique URL slug.
   */
  async findBySlug(slug: string): Promise<RepositoryResult<ArticleWithMedia>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('slug', slug)
        .eq('is_deleted', false)
        .single();
      if (error) throw new DatabaseError(error.message);

      const enriched = enrichArticleMetadata(data as unknown as ArticleRow);
      if (enriched.cover_image_id) {
        const { data: rawMedia } = await supabase
          .from('media_files')
          .select('id, cdn_url, alt_text, caption, width, height')
          .eq('id', enriched.cover_image_id)
          .single();
        const media = rawMedia as { id: string; cdn_url: string | null; alt_text: string | null; caption: string | null; width: number | null; height: number | null } | null;
        if (media) {
          enriched.cover_image = media;
        }
      }

      return { data: enriched, error: null };
    } catch (error) {
      serverLogger.error('NewsRepository.findBySlug failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Retrieves a paginated list of news articles according to pagination, sort, and filters.
   */
  async findMany(params: { pagination: Pagination; sort?: SortConfig; filters?: FilterMap }): Promise<PaginatedResult<ArticleWithMedia>> {
    const { pagination, sort, filters } = params;
    
    // If we are strictly querying public articles, use the static client to avoid opting into dynamic rendering due to cookies()
    const isPublicQuery = filters?.visibility === 'public' && filters?.status === 'Published';
    let supabase;
    if (isPublicQuery) {
      const { createStaticSupabaseClient } = await import('@/lib/supabase/server');
      supabase = createStaticSupabaseClient();
    } else {
      supabase = await createServerSupabaseClient();
    }

    let query = supabase
      .from('news_articles')
      .select('*', { count: 'exact' })
      .eq('is_deleted', false);

    if (filters?.status) {
      query = query.eq('status', filters.status as any);
    }
    if (filters?.is_featured !== undefined) {
      query = query.eq('is_featured', Boolean(filters.is_featured));
    }
    if (filters?.visibility) {
      query = query.eq('visibility', filters.visibility as any);
    }
    if (filters?.category) {
      query = query.eq('metadata->>category', filters.category as string);
    }
    if (filters?.tag) {
      query = query.contains('metadata', { tags: [filters.tag as string] });
    }
    if (filters?.program_id) {
      query = query.eq('metadata->>program_id', filters.program_id as string);
    }
    if (filters?.event_id) {
      query = query.eq('metadata->>event_id', filters.event_id as string);
    }

    const sortCol = sort?.column ?? 'published_at';
    query = query.order(sortCol, { ascending: sort?.order === 'asc', nullsFirst: false });

    const from = (pagination.page - 1) * pagination.limit;
    query = query.range(from, from + pagination.limit - 1);

    const { data, count, error } = await query;
    if (error) {
      serverLogger.error('NewsRepository.findMany failed', new DatabaseError(error.message));
      return { data: [], total: 0, page: pagination.page, limit: pagination.limit };
    }

    const rawRows = (data ?? []) as unknown as ArticleRow[];
    const enrichedList = rawRows.map(enrichArticleMetadata);

    const coverIds = Array.from(new Set(enrichedList.map((a) => a.cover_image_id).filter(Boolean))) as string[];
    const mediaMap = new Map<string, { id: string; cdn_url: string | null; alt_text: string | null; caption: string | null; width: number | null; height: number | null }>();

    if (coverIds.length > 0) {
      const { data: rawMediaRows } = await supabase
        .from('media_files')
        .select('id, cdn_url, alt_text, caption, width, height')
        .in('id', coverIds);

      const mediaRows = (rawMediaRows as { id: string; cdn_url: string | null; alt_text: string | null; caption: string | null; width: number | null; height: number | null }[]) ?? [];
      mediaRows.forEach((m) => {
        mediaMap.set(m.id, m);
      });
    }

    const withMediaList = enrichedList.map((item) => ({
      ...item,
      cover_image: item.cover_image_id ? mediaMap.get(item.cover_image_id) || null : null,
    }));

    return {
      data: withMediaList,
      total: count ?? 0,
      page: pagination.page,
      limit: pagination.limit,
    };
  }

  /**
   * Creates a new news article.
   */
  async create(data: ArticleCreate): Promise<RepositoryResult<ArticleRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const meta = (data.metadata || {}) as Record<string, unknown>;
      if (typeof meta.reading_time !== 'number') {
        meta.reading_time = computeReadingTime(data.content || '');
      }

      // Map 'summary' to 'excerpt' for the database
      const { summary, ...restData } = data;
      const payload: Record<string, unknown> = {
        ...restData,
        excerpt: summary,
        metadata: meta,
      };

      if (payload.status === 'Published') {
        payload.published_at = new Date().toISOString();
      }

      // TD-003: Temporarily assert as any until Supabase DB types are regenerated
      const res = (await (supabase.from('news_articles') as any)
        .insert(payload)
        .select()
        .single()) as { data: any; error: any };

      if (res.error) throw new DatabaseError(res.error.message);
      
      // Map 'excerpt' back to 'summary' for the frontend
      const returnedData = res.data;
      if (returnedData && returnedData.excerpt !== undefined) {
        returnedData.summary = returnedData.excerpt;
        delete returnedData.excerpt;
      }
      
      return { data: returnedData as ArticleRow, error: null };
    } catch (error) {
      serverLogger.error('NewsRepository.create failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Updates an existing news article.
   */
  async update(id: ID, data: ArticleUpdate): Promise<RepositoryResult<ArticleRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      
      const { summary, ...restData } = data;
      const payload: Record<string, unknown> = { ...restData };
      if (summary !== undefined) {
        payload.excerpt = summary;
      }
      
      if (data.content && data.metadata) {
        const meta = { ...data.metadata } as Record<string, unknown>;
        if (typeof meta.reading_time !== 'number') {
          meta.reading_time = computeReadingTime(data.content);
        }
        payload.metadata = meta;
      }

      if (payload.status === 'Published') {
        // Only set published_at if not already published
        const { data: existing } = await (supabase.from('news_articles') as any).select('published_at').eq('id', id).single();
        if (!existing?.published_at) {
          payload.published_at = new Date().toISOString();
        }
      }

      // TD-003: Temporarily assert as any until Supabase DB types are regenerated
      const res = (await (supabase.from('news_articles') as any)
        .update(payload)
        .eq('id', id)
        .eq('is_deleted', false)
        .select()
        .single()) as { data: any; error: any };

      if (res.error) throw new DatabaseError(res.error.message);
      
      // Map 'excerpt' back to 'summary' for the frontend
      const returnedData = res.data;
      if (returnedData && returnedData.excerpt !== undefined) {
        returnedData.summary = returnedData.excerpt;
        delete returnedData.excerpt;
      }

      return { data: returnedData as ArticleRow, error: null };
    } catch (error) {
      serverLogger.error('NewsRepository.update failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Soft deletes a news article.
   */
  async softDelete(id: ID, deletedBy: ID): Promise<RepositoryResult<ArticleRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const res = (await (supabase.from('news_articles') as any)
        .update({
          is_deleted: true,
          updated_by: deletedBy,
          status: 'Archived',
        })
        .eq('id', id)
        .select()
        .single()) as { data: ArticleRow; error: any };

      if (res.error) throw new DatabaseError(res.error.message);
      return { data: res.data, error: null };
    } catch (error) {
      serverLogger.error('NewsRepository.softDelete failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Restores a soft-deleted news article.
   */
  async restore(id: ID): Promise<RepositoryResult<ArticleRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const res = (await (supabase.from('news_articles') as any)
        .update({
          is_deleted: false,
          status: 'Draft',
        })
        .eq('id', id)
        .select()
        .single()) as { data: ArticleRow; error: any };

      if (res.error) throw new DatabaseError(res.error.message);
      return { data: res.data, error: null };
    } catch (error) {
      serverLogger.error('NewsRepository.restore failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Performs search across title, summary, content, and category.
   */
  async search(query: string, pagination: Pagination): Promise<PaginatedResult<ArticleWithMedia>> {
    const supabase = await createServerSupabaseClient();
    const from = (pagination.page - 1) * pagination.limit;

    const { data, count, error } = await supabase
      .from('news_articles')
      .select('*', { count: 'exact' })
      .eq('is_deleted', false)
      .eq('status', 'Published')
      .or(`title.ilike.%${query}%,summary.ilike.%${query}%,content.ilike.%${query}%`)
      .order('published_at', { ascending: false })
      .range(from, from + pagination.limit - 1);

    if (error) {
      serverLogger.error('NewsRepository.search failed', new DatabaseError(error.message));
      return { data: [], total: 0, page: pagination.page, limit: pagination.limit };
    }

    const rawRows = (data ?? []) as unknown as ArticleRow[];
    const enrichedList = rawRows.map(enrichArticleMetadata);

    const coverIds = Array.from(new Set(enrichedList.map((a) => a.cover_image_id).filter(Boolean))) as string[];
    const mediaMap = new Map<string, { id: string; cdn_url: string | null; alt_text: string | null; caption: string | null; width: number | null; height: number | null }>();

    if (coverIds.length > 0) {
      const { data: rawMediaRows } = await supabase
        .from('media_files')
        .select('id, cdn_url, alt_text, caption, width, height')
        .in('id', coverIds);

      const mediaRows = (rawMediaRows as { id: string; cdn_url: string | null; alt_text: string | null; caption: string | null; width: number | null; height: number | null }[]) ?? [];
      mediaRows.forEach((m) => {
        mediaMap.set(m.id, m);
      });
    }

    const withMediaList = enrichedList.map((item) => ({
      ...item,
      cover_image: item.cover_image_id ? mediaMap.get(item.cover_image_id) || null : null,
    }));

    return {
      data: withMediaList,
      total: count ?? 0,
      page: pagination.page,
      limit: pagination.limit,
    };
  }

  /**
   * Publishes an article.
   */
  async publish(id: ID): Promise<RepositoryResult<ArticleWithMedia>> {
    try {
      const supabase = await createServerSupabaseClient();
      const res = (await (supabase.from('news_articles') as any)
        .update({
          status: 'Published',
          published_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()) as { data: ArticleRow; error: any };

      if (res.error) throw new DatabaseError(res.error.message);
      return this.findById(id);
    } catch (error) {
      serverLogger.error('NewsRepository.publish failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Archives an article.
   */
  async archive(id: ID): Promise<RepositoryResult<ArticleWithMedia>> {
    try {
      const supabase = await createServerSupabaseClient();
      const res = (await (supabase.from('news_articles') as any)
        .update({
          status: 'Archived',
        })
        .eq('id', id)
        .select()
        .single()) as { data: ArticleRow; error: any };

      if (res.error) throw new DatabaseError(res.error.message);
      return this.findById(id);
    } catch (error) {
      serverLogger.error('NewsRepository.archive failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Features or unfeatures an article.
   */
  async setFeatured(id: ID, isFeatured: boolean): Promise<RepositoryResult<ArticleWithMedia>> {
    try {
      const supabase = await createServerSupabaseClient();
      const res = (await (supabase.from('news_articles') as any)
        .update({
          is_featured: isFeatured,
        })
        .eq('id', id)
        .select()
        .single()) as { data: ArticleRow; error: any };

      if (res.error) throw new DatabaseError(res.error.message);
      return this.findById(id);
    } catch (error) {
      serverLogger.error('NewsRepository.setFeatured failed', error as Error);
      return { data: null, error: error as Error };
    }
  }
}

export const newsRepository = new NewsRepository();
