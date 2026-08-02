import { STORAGE } from '@/constants';

/**
 * Validates if the given MIME type is an allowed image format.
 */
export const isValidImageFormat = (mimeType: string): boolean => {
  return STORAGE.ALLOWED_IMAGE_TYPES.includes(mimeType as any);
};
