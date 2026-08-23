/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { revalidateTag } from 'next/cache';

import { handleAction, requireAuth, requirePermission, CacheTags } from '@/contracts/actions';
import type { ActionResult } from '@/contracts/actions';
import type { PaginatedResult } from '@/contracts/repositories';
import type { Pagination } from '@/types';

import type { ProgramRow } from './repository';
import { programsService } from './service';
import type { CreateProgramDTO, UpdateProgramDTO } from './validators';

/** Server action to create a new program. Requires programs.create permission. */
export async function createProgram(dto: CreateProgramDTO): Promise<ActionResult<ProgramRow>> {
  return handleAction('createProgram', async () => {
    const session = await requireAuth();
    requirePermission(session, 'programs.create');

    const result = await programsService.create(dto, session.id);
    if (!result.success) throw new Error(result.error ?? 'Creation failed');
    (revalidateTag as any)(CacheTags.programs());
    return result.data!;
  });
}

/** Server action to update an existing program. Requires programs.update permission. */
export async function updateProgram(
  id: string,
  dto: UpdateProgramDTO
): Promise<ActionResult<ProgramRow>> {
  return handleAction('updateProgram', async () => {
    const session = await requireAuth();
    requirePermission(session, 'programs.update');
    const result = await programsService.update(id, dto, session.id);
    if (!result.success) throw new Error(result.error ?? 'Update failed');
    (revalidateTag as any)(CacheTags.programs());
    (revalidateTag as any)(CacheTags.program(id));
    return result.data!;
  });
}

/** Server action to delete a program. Requires programs.delete permission. */
export async function deleteProgram(id: string): Promise<ActionResult<ProgramRow>> {
  return handleAction('deleteProgram', async () => {
    const session = await requireAuth();
    requirePermission(session, 'programs.delete');
    const result = await programsService.remove(id, session.id);
    if (!result.success) throw new Error(result.error ?? 'Delete failed');
    (revalidateTag as any)(CacheTags.programs());
    (revalidateTag as any)(CacheTags.program(id));
    return result.data!;
  });
}

/** Server action to list programs with pagination and filtering. */
export async function listPrograms(
  pagination: Pagination,
  filters?: Record<string, unknown>
): Promise<ActionResult<PaginatedResult<ProgramRow>>> {
  return handleAction('listPrograms', async () => {
    const result = await programsService.list(pagination, filters);
    if (!result.success) throw new Error(result.error ?? 'List failed');
    return result.data!;
  });
}

/** Server action to search programs using full-text search. */
export async function searchPrograms(
  query: string,
  pagination: Pagination
): Promise<ActionResult<PaginatedResult<ProgramRow>>> {
  return handleAction('searchPrograms', async () => {
    const result = await programsService.search(query, pagination);
    if (!result.success) throw new Error(result.error ?? 'Search failed');
    return result.data!;
  });
}

/** Server action to get a program by ID. */
export async function getProgramById(id: string): Promise<ActionResult<ProgramRow>> {
  return handleAction('getProgramById', async () => {
    const result = await programsService.getById(id);
    if (!result.success) throw new Error(result.error ?? 'Not found');
    return result.data!;
  });
}

/** Server action to get a program by slug. */
export async function getProgramBySlug(slug: string): Promise<ActionResult<ProgramRow>> {
  return handleAction('getProgramBySlug', async () => {
    const result = await programsService.getBySlug(slug);
    if (!result.success) throw new Error(result.error ?? 'Not found');
    return result.data!;
  });
}

// Legacy uploadProgramImage removed in favor of 2-phase ImageUploader
