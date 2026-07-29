import { z } from 'zod';

import { slugValidator } from '@/validators';

/** Zod validation schema for creating a new gallery album. */
export const createAlbumSchema = z.object({
  album_code: z.string().min(2).max(20).regex(/^[A-Z0-9-]+$/),
  slug: slugValidator,
  title: z.string().min(3).max(200),
  description: z.string().max(5000).nullable().optional(),
  visibility: z.enum(['public', 'members', 'private', 'hidden', 'Public', 'Members', 'Private', 'Internal']).default('public'),
  cover_image_id: z.string().uuid().nullable().optional(),
  program_id: z.string().uuid().nullable().optional(),
  event_id: z.string().uuid().nullable().optional(),
  is_featured: z.boolean().default(false),
  display_order: z.number().int().min(0).default(0),
});

/** Zod validation schema for updating an existing gallery album. */
export const updateAlbumSchema = createAlbumSchema.omit({ album_code: true }).partial();

/** Zod validation schema for adding an item to a gallery album. */
export const addGalleryItemSchema = z.object({
  album_id: z.string().uuid(),
  media_id: z.string().uuid(),
  title: z.string().max(200).nullable().optional(),
  caption: z.string().max(500).nullable().optional(),
  display_order: z.number().int().min(0).default(0),
  is_featured: z.boolean().default(false),
});

/** DTO type inferred from createAlbumSchema. */
export type CreateAlbumDTO = z.infer<typeof createAlbumSchema>;

/** DTO type inferred from updateAlbumSchema. */
export type UpdateAlbumDTO = z.infer<typeof updateAlbumSchema>;

/** DTO type inferred from addGalleryItemSchema. */
export type AddGalleryItemDTO = z.infer<typeof addGalleryItemSchema>;
