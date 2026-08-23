/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PaginatedResult } from '@/contracts/repositories';
import { ok, fail, fromRepo } from '@/contracts/services';
import type { ServiceResult } from '@/contracts/services';
import type { Pagination, ID } from '@/types';

import { eventsRepository } from './repository';
import type { EventRow, EventCreate } from './repository';
import { createEventSchema, updateEventSchema } from './validators';
import type { CreateEventDTO, UpdateEventDTO } from './validators';

export class EventsService {
  /** Fetch a single event by UUID. */
  async getById(id: ID): Promise<ServiceResult<EventRow>> {
    return fromRepo(await eventsRepository.findById(id));
  }

  /** Fetch a single event by slug (for public pages). */
  async getBySlug(slug: string): Promise<ServiceResult<EventRow>> {
    return fromRepo(await eventsRepository.findBySlug(slug));
  }

  /** List events with pagination and optional filters. */
  async list(pagination: Pagination, filters?: Record<string, unknown>): Promise<ServiceResult<PaginatedResult<EventRow>>> {
    return ok(await eventsRepository.findMany({ pagination, filters }));
  }

  /** List events belonging to a specific program. */
  async listByProgram(programId: ID, pagination: Pagination): Promise<ServiceResult<PaginatedResult<EventRow>>> {
    return ok(await eventsRepository.findByProgram(programId, pagination));
  }

  /** Create a new event after validating the DTO. */
  async create(dto: CreateEventDTO, userId: ID): Promise<ServiceResult<EventRow>> {
    const parsed = createEventSchema.safeParse(dto);
    if (!parsed.success) return fail(parsed.error.issues.map((e: { message: string }) => e.message).join(', '));
    const eventData: EventCreate = {
      event_code: parsed.data.event_code,
      slug: parsed.data.slug,
      title: parsed.data.title,
      subtitle: parsed.data.subtitle ?? null,
      description: parsed.data.description ?? null,
      program_id: parsed.data.program_id,
      status: parsed.data.status,
      visibility: parsed.data.visibility,
      event_type: parsed.data.event_type,
      start_time: parsed.data.start_time ?? null,
      end_time: parsed.data.end_time ?? null,
      venue_name: parsed.data.venue_name ?? null,
      address_line1: parsed.data.address_line1 ?? null,
      address_line2: parsed.data.address_line2 ?? null,
      city: parsed.data.city ?? null,
      state: parsed.data.state ?? null,
      postal_code: parsed.data.postal_code ?? null,
      country: parsed.data.country ?? null,
      latitude: parsed.data.latitude ?? null,
      longitude: parsed.data.longitude ?? null,
      max_attendees: parsed.data.max_attendees ?? null,
      registered_count: 0,
      cover_image_id: parsed.data.cover_image_id ?? null,
      is_featured: parsed.data.is_featured,
      metadata: {
        ...parsed.data.metadata,
        is_virtual: parsed.data.is_virtual,
        virtual_link: parsed.data.virtual_link ?? null,
        registration_deadline: parsed.data.registration_deadline ?? null,
      },
      created_by: userId,
      updated_by: userId,
    };
    return fromRepo(await eventsRepository.create(eventData));
  }

  /** Update an existing event. */
  async update(id: ID, dto: UpdateEventDTO, userId: ID): Promise<ServiceResult<EventRow>> {
    const parsed = updateEventSchema.safeParse(dto);
    if (!parsed.success) return fail(parsed.error.issues.map((e: { message: string }) => e.message).join(', '));
    
    // We must merge metadata fields carefully if they are present in the update
    const existing = await eventsRepository.findById(id);
    if (existing.error || !existing.data) return fail('Event not found');

    const mergedMetadata = {
      ...(existing.data.metadata || {}),
      ...(parsed.data.metadata || {}),
    };
    if (parsed.data.is_virtual !== undefined) mergedMetadata.is_virtual = parsed.data.is_virtual;
    if (parsed.data.virtual_link !== undefined) mergedMetadata.virtual_link = parsed.data.virtual_link;
    if (parsed.data.registration_deadline !== undefined) mergedMetadata.registration_deadline = parsed.data.registration_deadline;

    // Filter out DTO-only fields from the update object
    const updateData: any = { ...parsed.data, updated_by: userId, metadata: mergedMetadata };
    delete updateData.is_virtual;
    delete updateData.virtual_link;
    delete updateData.registration_deadline;
    delete updateData.capacity;

    return fromRepo(await eventsRepository.update(id, updateData));
  }

  /** Soft-delete an event. */
  async remove(id: ID, userId: ID): Promise<ServiceResult<EventRow>> {
    return fromRepo(await eventsRepository.softDelete(id, userId));
  }

  /** Full-text search across events. */
  async search(query: string, pagination: Pagination): Promise<ServiceResult<PaginatedResult<EventRow>>> {
    return ok(await eventsRepository.search(query, pagination));
  }
}

export const eventsService = new EventsService();
