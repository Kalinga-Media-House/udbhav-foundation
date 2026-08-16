import { z } from 'zod';

import { slugValidator } from '@/validators';

export const articleStatusSchema = z.enum(['Draft', 'In Review', 'Published', 'Archived']);
export type ArticleStatus = z.infer<typeof articleStatusSchema>;

export const articleCategorySchema = z.enum([
  'News',
  'Story',
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

export const createArticleSchema = z.object({
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
});

export const updateArticleSchema = createArticleSchema.omit({ article_code: true }).partial();

export type CreateArticleDTO = z.infer<typeof createArticleSchema>;
export type UpdateArticleDTO = z.infer<typeof updateArticleSchema>;
