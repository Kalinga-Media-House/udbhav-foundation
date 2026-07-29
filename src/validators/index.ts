import { z } from 'zod';

import { VALIDATION, PAGINATION } from '@/constants';

// -----------------------------------------------------------------------------
// CORE VALIDATORS
// -----------------------------------------------------------------------------

export const uuidValidator = z.string().uuid("Must be a valid UUID.");

export const emailValidator = z.string().email("Invalid email address.");

export const urlValidator = z.string().url("Invalid URL format.").optional();

export const nameValidator = z
  .string()
  .min(VALIDATION.NAME.MIN_LENGTH, `Name must be at least ${VALIDATION.NAME.MIN_LENGTH} characters.`)
  .max(VALIDATION.NAME.MAX_LENGTH, `Name must not exceed ${VALIDATION.NAME.MAX_LENGTH} characters.`);

export const slugValidator = z
  .string()
  .min(3, "Slug must be at least 3 characters.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug can only contain lowercase letters, numbers, and hyphens.");

export const phoneValidator = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format.")
  .optional();

export const passwordValidator = z
  .string()
  .min(VALIDATION.PASSWORD.MIN_LENGTH, `Password must be at least ${VALIDATION.PASSWORD.MIN_LENGTH} characters.`)
  .max(VALIDATION.PASSWORD.MAX_LENGTH, `Password must not exceed ${VALIDATION.PASSWORD.MAX_LENGTH} characters.`)
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
  .regex(/[0-9]/, "Password must contain at least one number.");

export const dateValidator = z.coerce.date().refine((date) => !isNaN(date.getTime()), {
  message: "Invalid date format.",
});

// -----------------------------------------------------------------------------
// COMPOSED SCHEMAS
// -----------------------------------------------------------------------------

export const paginationValidator = z.object({
  page: z.coerce.number().int().min(1).default(PAGINATION.DEFAULT_PAGE),
  limit: z.coerce.number().int().min(1).max(PAGINATION.MAX_LIMIT).default(PAGINATION.DEFAULT_LIMIT),
});

export const searchQueryValidator = z.string().max(100, "Search query is too long.").optional();

export const fileMetadataValidator = z.object({
  size: z.number().max(VALIDATION.FILE.MAX_SIZE_BYTES, `File size must not exceed ${VALIDATION.FILE.MAX_SIZE_BYTES / 1024 / 1024}MB.`),
  type: z.string().refine(
    (type) => 
      (VALIDATION.FILE.ALLOWED_IMAGE_TYPES as readonly string[]).includes(type) || 
      (VALIDATION.FILE.ALLOWED_DOCUMENT_TYPES as readonly string[]).includes(type),
    "Unsupported file type."
  ),
});

export * from './helpers';

