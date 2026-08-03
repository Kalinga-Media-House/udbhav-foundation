import { z } from 'zod';

import { slugValidator } from '@/validators';

/** Zod schema for validating program creation payload. */
export const createProgramSchema = z.object({
  title: z.string().min(3).max(200),
  short_description: z.string().max(300).nullable().optional(),
  full_description: z.string().max(10000).nullable().optional(),
  status: z
    .enum(['draft', 'upcoming', 'active', 'paused', 'completed', 'archived', 'cancelled'])
    .default('draft'),
  visibility: z.enum(['public', 'private', 'members', 'internal']).default('public'),
  cover_image_id: z.string().uuid().nullable().optional(),
  start_date: z.union([z.string().datetime(), z.date(), z.string()]).nullable().optional(),
  location: z.string().nullable().optional(),
  program_type: z.enum([
    'Education', 'Healthcare', 'Environment', 'Community', 'Youth',
    'Women', 'Research', 'Training', 'Campaign', 'Fundraising',
    'Emergency', 'General'
  ]).default('General'),
  is_featured: z.boolean().default(false),
  sort_order: z.number().int().min(0).default(0),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

/** Zod schema for validating program update payload. */
export const updateProgramSchema = createProgramSchema.partial();

export type CreateProgramDTO = z.infer<typeof createProgramSchema>;
export type UpdateProgramDTO = z.infer<typeof updateProgramSchema>;
