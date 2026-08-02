import sharp from 'sharp';

import { serverLogger } from '@/lib/logger/server-logger';

import { UploadError } from './errors';

export interface ImageProcessingResult {
  buffer: Buffer;
  width: number;
  height: number;
  format: string;
  mimeType: string;
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
}

/**
 * Core image optimization pipeline using Sharp.
 * 
 * Responsibilities:
 * 1. Accept a Buffer of any supported format
 * 2. Auto-rotate using EXIF orientation
 * 3. Resize if > 1920px on either dimension (preserve aspect ratio)
 * 4. Convert to WebP (lossy q=82) or lossless WebP (if transparent)
 * 5. Strip EXIF metadata
 * 6. Return optimized Buffer + metadata
 * 
 * Handles edge cases like animated GIFs by passing them through.
 */
export const processImage = async (
  inputBuffer: Buffer,
  originalFilename: string
): Promise<ImageProcessingResult> => {
  const startTime = Date.now();
  const originalSize = inputBuffer.length;
  let pipeline = sharp(inputBuffer, { animated: true });

  try {
    const metadata = await pipeline.metadata();
    
    // Validate format
    if (!metadata.format) {
      throw new UploadError('Could not determine image format.');
    }

    // Pass through animated GIFs without processing (except calculating metadata)
    // Sharp detects animated GIFs/WebPs by setting `pages > 1`
    const isAnimated = metadata.pages ? metadata.pages > 1 : false;
    
    if (metadata.format === 'gif' && isAnimated) {
      serverLogger.info(`Animated GIF detected, passing through without optimization`, { 
        filename: originalFilename,
        size: originalSize
      });
      return {
        buffer: inputBuffer,
        width: metadata.width || 0,
        height: metadata.height || 0,
        format: 'gif',
        mimeType: 'image/gif',
        originalSize,
        optimizedSize: originalSize,
        compressionRatio: 1.0,
      };
    }

    // Basic pipeline: auto-rotate, strip metadata (Sharp strips EXIF by default unless withMetadata is called)
    pipeline = pipeline.rotate();

    // Resize if dimensions exceed 1920px
    const MAX_DIMENSION = 1920;
    if ((metadata.width && metadata.width > MAX_DIMENSION) || 
        (metadata.height && metadata.height > MAX_DIMENSION)) {
      pipeline = pipeline.resize({
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Detect transparency
    const hasAlpha = metadata.hasAlpha;

    // Convert to WebP
    // If it has alpha (transparency), use nearLossless to preserve quality of logos.
    pipeline = pipeline.webp({
      quality: 82,
      nearLossless: hasAlpha,
      smartSubsample: true,
    });

    const { data: optimizedBuffer, info } = await pipeline.toBuffer({ resolveWithObject: true });
    const optimizedSize = optimizedBuffer.length;
    const compressionRatio = Number((optimizedSize / originalSize).toFixed(3));

    serverLogger.info(`Image processed successfully`, {
      filename: originalFilename,
      originalSize,
      optimizedSize,
      ratio: compressionRatio,
      format: info.format,
      durationMs: Date.now() - startTime,
    });

    return {
      buffer: optimizedBuffer,
      width: info.width,
      height: info.height,
      format: info.format,
      mimeType: `image/${info.format}`,
      originalSize,
      optimizedSize,
      compressionRatio,
    };

  } catch (error) {
    serverLogger.error(`Image processing failed for ${originalFilename}`, error as Error);
    throw new UploadError(`Image processing failed: ${(error as Error).message}`);
  }
};
