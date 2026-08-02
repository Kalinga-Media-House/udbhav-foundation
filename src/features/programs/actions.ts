'use server';

import { revalidateTag } from 'next/cache';

import { handleAction, requireAuth, requirePermission, CacheTags } from '@/contracts/actions';
import type { ActionResult } from '@/contracts/actions';
import type { PaginatedResult } from '@/contracts/repositories';
import { uploadFile } from '@/lib/storage/upload';
import { createServerSupabaseClient } from '@/lib/supabase/server';
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

/** Uploads an image to R2 and registers it in media_files. */
export async function uploadProgramImage(formData: FormData): Promise<ActionResult<string>> {
  return handleAction('uploadProgramImage', async () => {
    const session = await requireAuth();
    requirePermission(session, 'programs.create'); // or update

    const file = formData.get('file') as File | null;
    if (!file) throw new Error('No file provided');

    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to R2
    const uploadResult = await uploadFile(buffer, file.name, {
      contentType: file.type,
      folder: 'programs',
    });

    if (!uploadResult.data) throw new Error(uploadResult.error?.message || 'Upload failed');

    // Register in DB
    const supabase = await createServerSupabaseClient();
    const mediaData = {
      uploader_id: session.id,
      r2_object_key: uploadResult.data.key,
      bucket_name: uploadResult.data.bucket,
      folder_path: '/programs',
      original_filename: file.name,
      stored_filename: uploadResult.data.key.split('/').pop() || file.name,
      mime_type: file.type,
      type: file.type.startsWith('image/') ? 'image' : 'document',
      file_size: file.size,
      cdn_url: uploadResult.data.url,
      created_by: session.id,
      updated_by: session.id,
    };

    const { data: mediaRow, error } = await (supabase.from('media_files' as any) as any)
      .insert(mediaData)
      .select('id')
      .single();

    if (error) throw new Error(`Database error: ${error.message}`);

    return mediaRow.id;
  });
}
