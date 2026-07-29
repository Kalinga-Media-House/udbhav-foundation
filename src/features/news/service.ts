import type { PaginatedResult } from '@/contracts/repositories';
import { ok, fail, fromRepo } from '@/contracts/services';
import type { ServiceResult } from '@/contracts/services';
import type { Pagination, ID } from '@/types';

import { newsRepository } from './repository';
import type { ArticleRow, ArticleWithMedia, ArticleCreate } from './repository';
import { createArticleSchema, updateArticleSchema } from './validators';
import type { CreateArticleDTO, UpdateArticleDTO } from './validators';

export class NewsService {
  /**
   * Retrieves an article by ID.
   */
  async getById(id: ID): Promise<ServiceResult<ArticleWithMedia>> {
    return fromRepo(await newsRepository.findById(id));
  }

  /**
   * Retrieves an article by its unique slug.
   */
  async getBySlug(slug: string): Promise<ServiceResult<ArticleWithMedia>> {
    return fromRepo(await newsRepository.findBySlug(slug));
  }

  /**
   * Lists news articles with pagination and filtering for admin/general use.
   */
  async list(pagination: Pagination, filters?: Record<string, unknown>): Promise<ServiceResult<PaginatedResult<ArticleWithMedia>>> {
    return ok(await newsRepository.findMany({ pagination, filters }));
  }

  /**
   * Lists only published public articles for the website.
   */
  async listPublic(pagination: Pagination, filters?: Record<string, unknown>): Promise<ServiceResult<PaginatedResult<ArticleWithMedia>>> {
    const publicFilters = {
      ...(filters || {}),
      status: 'Published',
      visibility: 'public',
    };
    return ok(await newsRepository.findMany({ pagination, filters: publicFilters }));
  }

  /**
   * Creates a new news article after validating payload.
   */
  async create(dto: CreateArticleDTO, userId: ID): Promise<ServiceResult<ArticleRow>> {
    const parsed = createArticleSchema.safeParse(dto);
    if (!parsed.success) {
      return fail(parsed.error.issues.map((e: { message: string }) => e.message).join(', '));
    }
    const payload = {
      ...parsed.data,
      created_by: userId,
      updated_by: userId,
    } as unknown as ArticleCreate;
    return fromRepo(await newsRepository.create(payload));
  }

  /**
   * Updates an existing news article.
   */
  async update(id: ID, dto: UpdateArticleDTO, userId: ID): Promise<ServiceResult<ArticleRow>> {
    const parsed = updateArticleSchema.safeParse(dto);
    if (!parsed.success) {
      return fail(parsed.error.issues.map((e: { message: string }) => e.message).join(', '));
    }
    return fromRepo(await newsRepository.update(id, { ...parsed.data, updated_by: userId }));
  }

  /**
   * Publishes an article.
   */
  async publish(id: ID): Promise<ServiceResult<ArticleWithMedia>> {
    return fromRepo(await newsRepository.publish(id));
  }

  /**
   * Archives an article.
   */
  async archive(id: ID): Promise<ServiceResult<ArticleWithMedia>> {
    return fromRepo(await newsRepository.archive(id));
  }

  /**
   * Sets the featured flag on an article.
   */
  async setFeatured(id: ID, isFeatured: boolean): Promise<ServiceResult<ArticleWithMedia>> {
    return fromRepo(await newsRepository.setFeatured(id, isFeatured));
  }

  /**
   * Soft deletes an article.
   */
  async remove(id: ID, userId: ID): Promise<ServiceResult<ArticleRow>> {
    return fromRepo(await newsRepository.softDelete(id, userId));
  }

  /**
   * Searches news articles using full-text search across title, summary, and content.
   */
  async search(query: string, pagination: Pagination): Promise<ServiceResult<PaginatedResult<ArticleWithMedia>>> {
    return ok(await newsRepository.search(query, pagination));
  }
}

export const newsService = new NewsService();
