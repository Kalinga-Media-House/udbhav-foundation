import type { PaginatedResult } from '@/contracts/repositories';
import { ok, fail, fromRepo } from '@/contracts/services';
import type { ServiceResult } from '@/contracts/services';
import type { Pagination, ID } from '@/types';
import { slugify } from '@/utils/string';

import { programsRepository } from './repository';
import type { ProgramRow, ProgramCreate } from './repository';
import { createProgramSchema, updateProgramSchema } from './validators';
import type { CreateProgramDTO, UpdateProgramDTO } from './validators';

export class ProgramsService {
  /** Fetch a single program by UUID. */
  async getById(id: ID): Promise<ServiceResult<ProgramRow>> {
    return fromRepo(await programsRepository.findById(id));
  }

  /** Fetch a single program by slug (for public pages). */
  async getBySlug(slug: string): Promise<ServiceResult<ProgramRow>> {
    return fromRepo(await programsRepository.findBySlug(slug));
  }

  /** List programs with pagination and optional filters. */
  async list(
    pagination: Pagination,
    filters?: Record<string, unknown>
  ): Promise<ServiceResult<PaginatedResult<ProgramRow>>> {
    const result = await programsRepository.findMany({ pagination, filters });
    return ok(result);
  }

  /** Create a new program after validating the DTO. */
  async create(dto: CreateProgramDTO, userId: ID): Promise<ServiceResult<ProgramRow>> {
    const tStart = Date.now();
    const parsed = createProgramSchema.safeParse(dto);
    if (!parsed.success) {
      return fail(parsed.error.issues.map((e: { message: string }) => e.message).join(', '));
    }
    const tVal = Date.now() - tStart;
    
    // Generate Program Code
    const tCodeStart = Date.now();
    const year = new Date().getFullYear();
    const prefix = `PRG-${year}-`;
    const { data: latestPrograms } = await programsRepository.findMany({ 
      pagination: { page: 1, limit: 1 }, 
      sort: { column: 'created_at', order: 'desc' }
    });
    
    let nextNum = 1;
    if (latestPrograms && latestPrograms.length > 0) {
      const latestCode = latestPrograms[0].program_code;
      if (latestCode && latestCode.startsWith(prefix)) {
        const numPart = parseInt(latestCode.replace(prefix, ''), 10);
        if (!isNaN(numPart)) nextNum = numPart + 1;
      }
    }
    const program_code = `${prefix}${nextNum.toString().padStart(4, '0')}`;
    const tCode = Date.now() - tCodeStart;

    // Generate Unique Slug
    const tSlugStart = Date.now();
    const baseSlug = slugify(parsed.data.title);
    const randomSuffix = crypto.randomUUID().split('-')[0];
    const slug = `${baseSlug}-${randomSuffix}`;
    const tSlug = Date.now() - tSlugStart;

    const tInsertStart = Date.now();
    const programData: ProgramCreate = {
      program_code,
      slug,
      title: parsed.data.title,
      short_description: parsed.data.short_description ?? null,
      full_description: parsed.data.full_description ?? null,
      status: parsed.data.status,
      visibility: parsed.data.visibility,
      program_type: parsed.data.program_type as any,
      cover_image_id: parsed.data.cover_image_id ?? null,
      start_date: parsed.data.start_date instanceof Date ? parsed.data.start_date.toISOString() : (parsed.data.start_date ?? null),
      location: parsed.data.location ?? null,
      is_featured: parsed.data.is_featured,
      sort_order: parsed.data.sort_order,
      metadata: parsed.data.metadata as any,
      created_by: userId,
      updated_by: userId,
    } as any;
    const createdProgram = await programsRepository.create(programData);
    const tInsert = Date.now() - tInsertStart;
    
    console.log(`[Perf] ProgramsService.create - Validation: ${tVal}ms, Code: ${tCode}ms, Slug: ${tSlug}ms, Insert: ${tInsert}ms, Total: ${Date.now() - tStart}ms`);

    return fromRepo(createdProgram);
  }

  /** Update an existing program. */
  async update(id: ID, dto: UpdateProgramDTO, userId: ID): Promise<ServiceResult<ProgramRow>> {
    const parsed = updateProgramSchema.safeParse(dto);
    if (!parsed.success) {
      return fail(parsed.error.issues.map((e: { message: string }) => e.message).join(', '));
    }
    const updateData: Record<string, unknown> = { ...parsed.data, updated_by: userId };

    if (updateData.start_date instanceof Date) {
      updateData.start_date = updateData.start_date.toISOString();
    }

    return fromRepo(await programsRepository.update(id, updateData as any));
  }

  /** Soft-delete a program. */
  async remove(id: ID, userId: ID): Promise<ServiceResult<ProgramRow>> {
    return fromRepo(await programsRepository.softDelete(id, userId));
  }

  /** Restore a soft-deleted program. */
  async restore(id: ID): Promise<ServiceResult<ProgramRow>> {
    return fromRepo(await programsRepository.restore(id));
  }

  /** Full-text search across programs. */
  async search(
    query: string,
    pagination: Pagination
  ): Promise<ServiceResult<PaginatedResult<ProgramRow>>> {
    const result = await programsRepository.search(query, pagination);
    return ok(result);
  }
}

export const programsService = new ProgramsService();
