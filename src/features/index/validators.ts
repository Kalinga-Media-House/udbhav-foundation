import { z } from 'zod';

import { slugValidator } from '@/validators';

/** Zod schema for validating index initiative creation payload. */
export const createIndexInitiativeSchema = z.object({
  title: z.string().min(3, 'Title is required').max(200),
  slug: slugValidator.optional().or(z.literal('')),
  initiative_type: z.string().min(2, 'Category is required').max(100),
  cover_media_id: z.string().uuid().nullable().optional(),
  short_summary: z.string().min(5, 'Short summary is required').max(500),
  description: z.string().nullable().optional(),
  event_date: z.string().nullable().optional(),
  year: z.number().int().min(1980).max(2100),
  location: z.string().nullable().optional(),
  beneficiaries: z.string().nullable().optional(),
  volunteers: z.string().nullable().optional(),
  chief_guest: z.string().nullable().optional(),
  outcome: z.string().nullable().optional(),
  duration: z.string().nullable().optional(),
  partner_name: z.string().nullable().optional(),
  featured: z.boolean().default(false),
  display_order: z.number().int().min(0).default(0),
  seo_title: z.string().nullable().optional(),
  seo_description: z.string().nullable().optional(),
  seo_keywords: z.array(z.string()).default([]),
  status: z.enum(['Draft', 'Published', 'Archived']).default('Published'),
});

/** Zod schema for validating index initiative update payload. */
export const updateIndexInitiativeSchema = createIndexInitiativeSchema.partial();

/** Zod schema for managing gallery items of an initiative. */
export const manageInitiativeGallerySchema = z.object({
  media_ids: z.array(z.string().uuid()),
});

export type CreateIndexInitiativeDTO = z.infer<typeof createIndexInitiativeSchema>;
export type UpdateIndexInitiativeDTO = z.infer<typeof updateIndexInitiativeSchema>;
export type ManageInitiativeGalleryDTO = z.infer<typeof manageInitiativeGallerySchema>;
