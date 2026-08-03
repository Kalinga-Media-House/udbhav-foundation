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
    const parsed = createProgramSchema.safeParse(dto);
    if (!parsed.success) {
      return fail(parsed.error.issues.map((e: { message: string }) => e.message).join(', '));
    }
    
    // Generate Program Code
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

    // Generate Unique Slug
    let baseSlug = slugify(parsed.data.title);
    let slug = baseSlug;
    let slugExists = await programsRepository.findBySlug(slug);
    let counter = 2;
    while (slugExists.data) {
      slug = `${baseSlug}-${counter}`;
      slugExists = await programsRepository.findBySlug(slug);
      counter++;
    }

    const programData: ProgramCreate = {
      program_code,
      slug,
      title: parsed.data.title,
      short_description: parsed.data.subtitle ?? null,
      full_description: parsed.data.description ?? null,
      status: parsed.data.status,
      visibility: parsed.data.visibility,
      program_type: parsed.data.program_type as any,
      cover_image_id: parsed.data.cover_image_id ?? null,
      program_date: parsed.data.program_date instanceof Date ? parsed.data.program_date.toISOString() : parsed.data.program_date,
      location: parsed.data.location,
      is_featured: parsed.data.is_featured,
      sort_order: parsed.data.display_order,
      metadata: parsed.data.metadata as any,
      created_by: userId,
      updated_by: userId,
    } as any;
    return fromRepo(await programsRepository.create(programData));
  }

  /** Update an existing program. */
  async update(id: ID, dto: UpdateProgramDTO, userId: ID): Promise<ServiceResult<ProgramRow>> {
    const parsed = updateProgramSchema.safeParse(dto);
    if (!parsed.success) {
      return fail(parsed.error.issues.map((e: { message: string }) => e.message).join(', '));
    }
    const { subtitle, description, display_order, ...restParsed } = parsed.data as any;
    const updateData: Record<string, unknown> = { ...restParsed, updated_by: userId };

    // Remap DTO field names → DB column names
    if (subtitle !== undefined) {
      updateData.short_description = subtitle;
      delete updateData.subtitle;
    }
    if (description !== undefined) {
      updateData.full_description = description;
      delete updateData.description;
    }
    if (display_order !== undefined) {
      updateData.sort_order = display_order;
      delete updateData.display_order;
    }
    if (updateData.program_date instanceof Date) {
      updateData.program_date = updateData.program_date.toISOString();
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
