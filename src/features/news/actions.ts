'use server';

import { revalidateTag } from 'next/cache';

import { handleAction, requireAuth, requirePermission, CacheTags } from '@/contracts/actions';
import type { ActionResult } from '@/contracts/actions';
import type { PaginatedResult } from '@/contracts/repositories';
import type { Pagination } from '@/types';

import type { ArticleRow, ArticleWithMedia } from './repository';
import { newsService } from './service';
import type { CreateArticleDTO, UpdateArticleDTO } from './validators';

/**
 * Server action to create a news article.
 * Requires `news.create` permission.
 */
export async function createArticle(dto: CreateArticleDTO): Promise<ActionResult<ArticleRow>> {
  return handleAction('createArticle', async () => {
    const session = await requireAuth();
    requirePermission(session, 'news.create');
    const result = await newsService.create(dto, session.id);
    if (!result.success) throw new Error(result.error ?? 'Creation failed');
    revalidateTag(CacheTags.news());
    return result.data!;
  });
}

/**
 * Server action to update an existing news article.
 * Requires `news.update` permission.
 */
export async function updateArticle(id: string, dto: UpdateArticleDTO): Promise<ActionResult<ArticleRow>> {
  return handleAction('updateArticle', async () => {
    const session = await requireAuth();
    requirePermission(session, 'news.update');
    const result = await newsService.update(id, dto, session.id);
    if (!result.success) throw new Error(result.error ?? 'Update failed');
    revalidateTag(CacheTags.news());
    revalidateTag(CacheTags.article(id));
    return result.data!;
  });
}

/**
 * Server action to publish a news article.
 * Requires `news.publish` permission.
 */
export async function publishArticle(id: string): Promise<ActionResult<ArticleWithMedia>> {
  return handleAction('publishArticle', async () => {
    const session = await requireAuth();
    requirePermission(session, 'news.publish');
    const result = await newsService.publish(id);
    if (!result.success) throw new Error(result.error ?? 'Publish failed');
    revalidateTag(CacheTags.news());
    revalidateTag(CacheTags.article(id));
    return result.data!;
  });
}

/**
 * Server action to archive a news article.
 * Requires `news.update` permission.
 */
export async function archiveArticle(id: string): Promise<ActionResult<ArticleWithMedia>> {
  return handleAction('archiveArticle', async () => {
    const session = await requireAuth();
    requirePermission(session, 'news.update');
    const result = await newsService.archive(id);
    if (!result.success) throw new Error(result.error ?? 'Archive failed');
    revalidateTag(CacheTags.news());
    revalidateTag(CacheTags.article(id));
    return result.data!;
  });
}

/**
 * Server action to feature or unfeature an article.
 * Requires `news.update` permission.
 */
export async function setFeaturedArticle(id: string, isFeatured: boolean): Promise<ActionResult<ArticleWithMedia>> {
  return handleAction('setFeaturedArticle', async () => {
    const session = await requireAuth();
    requirePermission(session, 'news.update');
    const result = await newsService.setFeatured(id, isFeatured);
    if (!result.success) throw new Error(result.error ?? 'Set featured failed');
    revalidateTag(CacheTags.news());
    revalidateTag(CacheTags.article(id));
    return result.data!;
  });
}

/**
 * Server action to soft-delete an article.
 * Requires `news.delete` permission.
 */
export async function deleteArticle(id: string): Promise<ActionResult<ArticleRow>> {
  return handleAction('deleteArticle', async () => {
    const session = await requireAuth();
    requirePermission(session, 'news.delete');
    const result = await newsService.remove(id, session.id);
    if (!result.success) throw new Error(result.error ?? 'Delete failed');
    revalidateTag(CacheTags.news());
    revalidateTag(CacheTags.article(id));
    return result.data!;
  });
}

/**
 * Server action to list news articles for admin/general use.
 */
export async function listArticles(pagination: Pagination, filters?: Record<string, unknown>): Promise<ActionResult<PaginatedResult<ArticleWithMedia>>> {
  return handleAction('listArticles', async () => {
    const result = await newsService.list(pagination, filters);
    if (!result.success) throw new Error(result.error ?? 'List failed');
    return result.data!;
  });
}

/**
 * Server action to list only published public articles for the website.
 */
export async function listPublicArticles(pagination: Pagination, filters?: Record<string, unknown>): Promise<ActionResult<PaginatedResult<ArticleWithMedia>>> {
  return handleAction('listPublicArticles', async () => {
    const result = await newsService.listPublic(pagination, filters);
    if (!result.success) throw new Error(result.error ?? 'List public articles failed');
    return result.data!;
  });
}

/**
 * Server action to fetch a single article by slug.
 */
export async function getArticleBySlug(slug: string): Promise<ActionResult<ArticleWithMedia>> {
  return handleAction('getArticleBySlug', async () => {
    const result = await newsService.getBySlug(slug);
    if (!result.success) throw new Error(result.error ?? 'Article not found');
    return result.data!;
  });
}

/**
 * Server action to fetch a single article by ID.
 */
export async function getArticleById(id: string): Promise<ActionResult<ArticleWithMedia>> {
  return handleAction('getArticleById', async () => {
    const result = await newsService.getById(id);
    if (!result.success) throw new Error(result.error ?? 'Article not found');
    return result.data!;
  });
}

/**
 * Server action to search articles by keyword.
 */
export async function searchArticles(query: string, pagination: Pagination): Promise<ActionResult<PaginatedResult<ArticleWithMedia>>> {
  return handleAction('searchArticles', async () => {
    const result = await newsService.search(query, pagination);
    if (!result.success) throw new Error(result.error ?? 'Search failed');
    return result.data!;
  });
}
