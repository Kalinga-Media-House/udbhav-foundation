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
  async list(pagination: Pagination, filters?: Record<string, unknown>): Promise<ServiceResult<PaginatedResult<ProgramRow>>> {
    const result = await programsRepository.findMany({ pagination, filters });
    return ok(result);
  }

  /** Create a new program after validating the DTO. */
  async create(dto: CreateProgramDTO, userId: ID): Promise<ServiceResult<ProgramRow>> {
    const parsed = createProgramSchema.safeParse(dto);
    if (!parsed.success) {
      return fail(parsed.error.issues.map((e: { message: string }) => e.message).join(', '));
    }
    const programData: ProgramCreate = {
      program_code: parsed.data.program_code,
      slug: parsed.data.slug ? slugify(parsed.data.slug) : slugify(parsed.data.title),
      title: parsed.data.title,
      subtitle: parsed.data.subtitle ?? null,
      description: parsed.data.description ?? null,
      status: parsed.data.status,
      visibility: parsed.data.visibility,
      cover_image_id: parsed.data.cover_image_id ?? null,
      start_date: parsed.data.start_date ?? null,
      end_date: parsed.data.end_date ?? null,
      is_featured: parsed.data.is_featured,
      display_order: parsed.data.display_order,
      metadata: parsed.data.metadata,
      created_by: userId,
      updated_by: userId,
    };
    return fromRepo(await programsRepository.create(programData));
  }

  /** Update an existing program. */
  async update(id: ID, dto: UpdateProgramDTO, userId: ID): Promise<ServiceResult<ProgramRow>> {
    const parsed = updateProgramSchema.safeParse(dto);
    if (!parsed.success) {
      return fail(parsed.error.issues.map((e: { message: string }) => e.message).join(', '));
    }
    return fromRepo(await programsRepository.update(id, { ...parsed.data, updated_by: userId }));
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
  async search(query: string, pagination: Pagination): Promise<ServiceResult<PaginatedResult<ProgramRow>>> {
    const result = await programsRepository.search(query, pagination);
    return ok(result);
  }
}

export const programsService = new ProgramsService();
