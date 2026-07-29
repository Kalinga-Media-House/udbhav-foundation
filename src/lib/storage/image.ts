import { STORAGE } from '@/constants';

/**
 * Validates if the given MIME type is an allowed image format.
 */
export const isValidImageFormat = (mimeType: string): boolean => {
  return STORAGE.ALLOWED_IMAGE_TYPES.includes(mimeType as any);
};

/**
 * Future hook: WebP conversion placeholder.
 * If we add 'sharp', we would process buffers here before uploading.
 */
export const optimizeImageBuffer = async (buffer: Buffer): Promise<Buffer> => {
  // Pass-through for now until sharp/squoosh is added.
  return buffer;
};
