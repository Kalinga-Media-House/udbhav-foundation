import { z } from 'zod';

import { slugValidator } from '@/validators';

/** Zod schema for validating event creation payload. */
export const createEventSchema = z.object({
  event_code: z.string().min(2).max(20).regex(/^[A-Z0-9-]+$/),
  slug: slugValidator,
  title: z.string().min(3).max(200),
  subtitle: z.string().max(300).nullable().optional(),
  description: z.string().max(10000).nullable().optional(),
  program_id: z.string().uuid(),
  status: z.enum(['Draft', 'Published', 'Registration Open', 'Registration Closed', 'Completed', 'Cancelled', 'Archived']).default('Draft'),
  visibility: z.enum(['public', 'private', 'internal']).default('public'),
  event_type: z.string().min(2).max(50),
  start_time: z.string().datetime().nullable().optional(),
  end_time: z.string().datetime().nullable().optional(),
  venue_name: z.string().max(200).nullable().optional(),
  address_line1: z.string().max(200).nullable().optional(),
  address_line2: z.string().max(200).nullable().optional(),
  city: z.string().max(100).nullable().optional(),
  state: z.string().max(100).nullable().optional(),
  postal_code: z.string().max(20).nullable().optional(),
  country: z.string().max(100).nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  is_virtual: z.boolean().default(false),
  virtual_link: z.string().url().or(z.literal('')).nullable().optional(),
  max_attendees: z.number().int().min(0).nullable().optional(),
  registration_deadline: z.string().datetime().nullable().optional(),
  cover_image_id: z.string().uuid().nullable().optional(),
  is_featured: z.boolean().default(false),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

/** Zod schema for validating event update payload. */
export const updateEventSchema = createEventSchema.omit({ event_code: true as const }).partial();

export type CreateEventDTO = z.infer<typeof createEventSchema>;
export type UpdateEventDTO = z.infer<typeof updateEventSchema>;
