'use server';

import { revalidateTag } from 'next/cache';

import { handleAction, requireAuth, requirePermission, CacheTags } from '@/contracts/actions';
import type { ActionResult } from '@/contracts/actions';
import type { PaginatedResult } from '@/contracts/repositories';
import type { Pagination } from '@/types';

import type { EventRow } from './repository';
import { eventsService } from './service';
import type { CreateEventDTO, UpdateEventDTO } from './validators';

/** Server action to create a new event. Requires events.create permission. */
export async function createEvent(dto: CreateEventDTO): Promise<ActionResult<EventRow>> {
  return handleAction('createEvent', async () => {
    const session = await requireAuth();
    requirePermission(session, 'events.create');
    const result = await eventsService.create(dto, session.id);
    if (!result.success) throw new Error(result.error ?? 'Creation failed');
    (revalidateTag as any)(CacheTags.events());
    return result.data!;
  });
}

/** Server action to update an existing event. Requires events.update permission. */
export async function updateEvent(id: string, dto: UpdateEventDTO): Promise<ActionResult<EventRow>> {
  return handleAction('updateEvent', async () => {
    const session = await requireAuth();
    requirePermission(session, 'events.update');
    const result = await eventsService.update(id, dto, session.id);
    if (!result.success) throw new Error(result.error ?? 'Update failed');
    (revalidateTag as any)(CacheTags.events());
    (revalidateTag as any)(CacheTags.event(id));
    return result.data!;
  });
}

/** Server action to delete an event. Requires events.delete permission. */
export async function deleteEvent(id: string): Promise<ActionResult<EventRow>> {
  return handleAction('deleteEvent', async () => {
    const session = await requireAuth();
    requirePermission(session, 'events.delete');
    const result = await eventsService.remove(id, session.id);
    if (!result.success) throw new Error(result.error ?? 'Delete failed');
    (revalidateTag as any)(CacheTags.events());
    (revalidateTag as any)(CacheTags.event(id));
    return result.data!;
  });
}

/** Server action to list events with pagination and filtering. */
export async function listEvents(pagination: Pagination, filters?: Record<string, unknown>): Promise<ActionResult<PaginatedResult<EventRow>>> {
  return handleAction('listEvents', async () => {
    const result = await eventsService.list(pagination, filters);
    if (!result.success) throw new Error(result.error ?? 'List failed');
    return result.data!;
  });
}

/** Server action to search events using full-text search. */
export async function searchEvents(query: string, pagination: Pagination): Promise<ActionResult<PaginatedResult<EventRow>>> {
  return handleAction('searchEvents', async () => {
    const result = await eventsService.search(query, pagination);
    if (!result.success) throw new Error(result.error ?? 'Search failed');
    return result.data!;
  });
}

/** Server action to get an event by ID. */
export async function getEventById(id: string): Promise<ActionResult<EventRow>> {
  return handleAction('getEventById', async () => {
    const result = await eventsService.getById(id);
    if (!result.success) throw new Error(result.error ?? 'Not found');
    return result.data!;
  });
}

/** Server action to get an event by slug. */
export async function getEventBySlug(slug: string): Promise<ActionResult<EventRow>> {
  return handleAction('getEventBySlug', async () => {
    const result = await eventsService.getBySlug(slug);
    if (!result.success) throw new Error(result.error ?? 'Not found');
    return result.data!;
  });
}

/** Uploads an image to R2 and registers it in media_files. */
export async function uploadEventImage(formData: FormData): Promise<ActionResult<string>> {
  return handleAction('uploadEventImage', async () => {
    const session = await requireAuth();
    requirePermission(session, 'events.create'); // or update

    const file = formData.get('file') as File | null;
    if (!file) throw new Error('No file provided');

    const { uploadFile } = await import('@/lib/storage/upload');
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Upload to R2
    const uploadResult = await uploadFile(buffer, file.name, {
      contentType: file.type,
      folder: 'events',
    });

    if (!uploadResult.data) throw new Error(uploadResult.error?.message || 'Upload failed');

    // Register in DB
    const { createServerSupabaseClient } = await import('@/lib/supabase/server');
    const supabase = await createServerSupabaseClient();
    const mediaData = {
      uploader_id: session.id,
      r2_object_key: uploadResult.data.key,
      bucket_name: uploadResult.data.bucket,
      folder_path: '/events',
      original_filename: file.name,
      stored_filename: uploadResult.data.key.split('/').pop() || file.name,
      mime_type: file.type,
      type: file.type.startsWith('image/') ? 'image' : 'other',
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
