import { z } from 'zod';

import { slugValidator } from '@/validators';

/** Zod schema for validating program creation payload. */
export const createProgramSchema = z.object({
  program_code: z
    .string()
    .min(2)
    .max(20)
    .regex(/^[A-Z0-9-]+$/, 'Must be uppercase alphanumeric with hyphens'),
  slug: slugValidator.optional().or(z.literal('')),
  title: z.string().min(3).max(200),
  subtitle: z.string().max(300).nullable().optional(),
  description: z.string().max(10000).nullable().optional(),
  status: z
    .enum(['draft', 'upcoming', 'active', 'paused', 'completed', 'archived', 'cancelled'])
    .default('draft'),
  visibility: z.enum(['public', 'private', 'members', 'internal']).default('public'),
  cover_image_id: z.string().uuid().nullable().optional(),
  start_date: z.string().datetime().nullable().optional(),
  end_date: z.string().datetime().nullable().optional(),
  is_featured: z.boolean().default(false),
  display_order: z.number().int().min(0).default(0),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

/** Zod schema for validating program update payload. */
export const updateProgramSchema = createProgramSchema
  .partial()
  .omit({ program_code: true as const });

export type CreateProgramDTO = z.infer<typeof createProgramSchema>;
export type UpdateProgramDTO = z.infer<typeof updateProgramSchema>;
