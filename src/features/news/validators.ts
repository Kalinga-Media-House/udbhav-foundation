import { z } from 'zod';

import { slugValidator } from '@/validators';

export const articleStatusSchema = z.enum(['Draft', 'In Review', 'Published', 'Archived']);
export type ArticleStatus = z.infer<typeof articleStatusSchema>;

export const articleCategorySchema = z.enum([
  'News',
  'Story',
  'Event',
  'Press Release',
  'Announcement',
  'Blog',
  'Report',
  'Update',
]);
export type ArticleCategory = z.infer<typeof articleCategorySchema>;

export const articleMetadataSchema = z.object({
  category: articleCategorySchema.default('News'),
  tags: z.array(z.string()).default([]),
  author_name: z.string().optional(),
  author_role: z.string().optional(),
  program_id: z.string().uuid().nullable().optional(),
  event_id: z.string().uuid().nullable().optional(),
  seo_title: z.string().max(70).nullable().optional(),
  seo_description: z.string().max(160).nullable().optional(),
  seo_keywords: z.array(z.string()).nullable().optional(),
  canonical_url: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val))
    .refine((val) => val === null || z.string().url().safeParse(val).success, {
      message: 'Invalid URL format',
    }),
  open_graph_image_id: z.string().uuid().nullable().optional(),
  gallery_image_ids: z.array(z.string()).nullable().optional(),
  reading_time: z.number().int().nonnegative().optional(),
}).passthrough();

export const createArticleBaseSchema = z.object({
  article_code: z.string().min(2).max(30).regex(/^[A-Z0-9-]+$/, 'Article code must be uppercase alphanumeric and hyphens'),
  slug: slugValidator,
  title: z.string().min(3, 'Title must be at least 3 characters').max(300, 'Title cannot exceed 300 characters'),
  subtitle: z.string().max(500).nullable().optional(),
  summary: z.string().max(1000).nullable().optional(),
  content: z.string().min(1, 'Article content is required'),
  cover_image_id: z.string().uuid().nullable().optional(),
  author_profile_id: z.string().uuid().nullable().optional(),
  status: articleStatusSchema.default('Draft'),
  visibility: z.enum(['public', 'private']).default('public'),
  published_at: z.string().datetime().nullable().optional(),
  is_featured: z.boolean().default(false),
  metadata: articleMetadataSchema.default({}),
  
  event_date: z.string().nullable().optional(),
  event_start_time: z.string().nullable().optional(),
  event_end_time: z.string().nullable().optional(),
  event_location: z.string().nullable().optional(),
  event_address: z.string().nullable().optional(),
  registration_url: z.string().trim().optional().nullable().transform(val => val === '' ? null : val).refine(val => val === null || z.string().url().safeParse(val).success, { message: 'Invalid URL format' }),
});

const validateEventFields = (data: any, ctx: z.RefinementCtx) => {
  if (data.metadata?.category === 'Event' && !data.event_date) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Event date is required for events',
      path: ['event_date'],
    });
  }
  if (data.event_start_time && data.event_end_time) {
    if (data.event_end_time < data.event_start_time) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End time cannot be before start time',
        path: ['event_end_time'],
      });
    }
  }
};

export const createArticleSchema = createArticleBaseSchema.superRefine(validateEventFields);
export const updateArticleSchema = createArticleBaseSchema.omit({ article_code: true }).partial().superRefine(validateEventFields);

export type CreateArticleDTO = z.infer<typeof createArticleSchema>;
export type UpdateArticleDTO = z.infer<typeof updateArticleSchema>;
