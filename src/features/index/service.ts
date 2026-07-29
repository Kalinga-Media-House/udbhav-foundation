import type { PaginatedResult } from '@/contracts/repositories';
import { ok, fail, fromRepo } from '@/contracts/services';
import type { ServiceResult } from '@/contracts/services';
import type { Pagination, ID } from '@/types';
import { slugify } from '@/utils/string';

import { indexInitiativesRepository } from './repository';
import type { IndexInitiativeWithMedia, IndexInitiativeRow, IndexInitiativeCreate } from './repository';
import { createIndexInitiativeSchema, updateIndexInitiativeSchema, manageInitiativeGallerySchema } from './validators';
import type { CreateIndexInitiativeDTO, UpdateIndexInitiativeDTO, ManageInitiativeGalleryDTO } from './validators';

export class IndexService {
  async getById(id: ID): Promise<ServiceResult<IndexInitiativeWithMedia>> {
    return fromRepo(await indexInitiativesRepository.findById(id));
  }

  async getBySlug(slug: string): Promise<ServiceResult<IndexInitiativeWithMedia>> {
    return fromRepo(await indexInitiativesRepository.findBySlug(slug));
  }

  async list(
    pagination: Pagination,
    filters?: Record<string, unknown>,
    search?: string,
    sort?: { column: string; order: 'asc' | 'desc' }
  ): Promise<ServiceResult<PaginatedResult<IndexInitiativeWithMedia>>> {
    const result = await indexInitiativesRepository.findMany({ pagination, filters, search, sort });
    return ok(result);
  }

  async getAdjacent(
    id: string,
    displayOrder: number
  ): Promise<ServiceResult<{ prev: IndexInitiativeWithMedia | null; next: IndexInitiativeWithMedia | null }>> {
    const adj = await indexInitiativesRepository.findAdjacent(id, displayOrder);
    return ok(adj);
  }

  async getRelated(
    currentId: string,
    initiativeType: string,
    year: number
  ): Promise<ServiceResult<IndexInitiativeWithMedia[]>> {
    const result = await indexInitiativesRepository.findMany({
      pagination: { page: 1, limit: 10 },
      filters: { status: 'Published' },
    });
    const all = result.data.filter((r) => r.id !== currentId);

    // Prioritize same type first, then same year, then anything
    const byType = all.filter((r) => r.initiative_type === initiativeType);
    const byYear = all.filter((r) => r.initiative_type !== initiativeType && r.year === year);
    const others = all.filter((r) => r.initiative_type !== initiativeType && r.year !== year);

    const combined = [...byType, ...byYear, ...others].slice(0, 3);
    return ok(combined);
  }

  async create(dto: CreateIndexInitiativeDTO, userId: ID): Promise<ServiceResult<IndexInitiativeRow>> {
    const parsed = createIndexInitiativeSchema.safeParse(dto);
    if (!parsed.success) {
      return fail(parsed.error.issues.map((e) => e.message).join(', '));
    }

    const payload: IndexInitiativeCreate = {
      title: parsed.data.title,
      slug: parsed.data.slug ? slugify(parsed.data.slug) : slugify(parsed.data.title),
      initiative_type: parsed.data.initiative_type,
      cover_media_id: parsed.data.cover_media_id ?? null,
      short_summary: parsed.data.short_summary,
      description: parsed.data.description ?? null,
      event_date: parsed.data.event_date ?? null,
      year: parsed.data.year,
      location: parsed.data.location ?? null,
      beneficiaries: parsed.data.beneficiaries ?? null,
      volunteers: parsed.data.volunteers ?? null,
      chief_guest: parsed.data.chief_guest ?? null,
      outcome: parsed.data.outcome ?? null,
      duration: parsed.data.duration ?? null,
      partner_name: parsed.data.partner_name ?? null,
      featured: parsed.data.featured,
      display_order: parsed.data.display_order,
      seo_title: parsed.data.seo_title ?? parsed.data.title,
      seo_description: parsed.data.seo_description ?? parsed.data.short_summary,
      seo_keywords: parsed.data.seo_keywords,
      status: parsed.data.status,
      published_at: parsed.data.status === 'Published' ? new Date().toISOString() : null,
      created_by: userId,
      updated_by: userId,
    };

    return fromRepo(await indexInitiativesRepository.create(payload));
  }

  async update(id: ID, dto: UpdateIndexInitiativeDTO, userId: ID): Promise<ServiceResult<IndexInitiativeRow>> {
    const parsed = updateIndexInitiativeSchema.safeParse(dto);
    if (!parsed.success) {
      return fail(parsed.error.issues.map((e) => e.message).join(', '));
    }

    const updatePayload = {
      ...parsed.data,
      ...(parsed.data.slug ? { slug: slugify(parsed.data.slug) } : {}),
      updated_by: userId,
    };

    return fromRepo(await indexInitiativesRepository.update(id, updatePayload));
  }

  async delete(id: ID, userId: ID): Promise<ServiceResult<IndexInitiativeRow>> {
    return fromRepo(await indexInitiativesRepository.softDelete(id, userId));
  }

  async manageGallery(initiativeId: ID, dto: ManageInitiativeGalleryDTO): Promise<ServiceResult<boolean>> {
    const parsed = manageInitiativeGallerySchema.safeParse(dto);
    if (!parsed.success) {
      return fail(parsed.error.issues.map((e) => e.message).join(', '));
    }
    await indexInitiativesRepository.syncGallery(initiativeId, parsed.data.media_ids);
    return ok(true);
  }
}

export const indexService = new IndexService();
