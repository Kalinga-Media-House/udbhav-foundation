import { z, ZodError } from 'zod';

import { ValidationError } from '@/errors';

/**
 * Formats a ZodError into a human-readable string.
 */
export const formatZodError = (error: ZodError): string => {
  return error.errors
    .map((e) => {
      const path = e.path.join('.');
      return path ? `${path}: ${e.message}` : e.message;
    })
    .join(' | ');
};

/**
 * Safely parses data against a Zod schema.
 * Throws a domain-specific ValidationError if parsing fails.
 * Use this in API routes or Services to guarantee type safety and standard error responses.
 */
export const validateData = <T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): z.infer<T> => {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(formatZodError(result.error));
  }
  return result.data;
};

/**
 * Validates a subset of a schema (Partial validation).
 * Useful for PATCH requests.
 */
export const validatePartialData = <T extends z.AnyZodObject>(
  schema: T,
  data: unknown
): Partial<z.infer<T>> => {
  const partialSchema = schema.partial();
  return validateData(partialSchema, data);
};
