/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from 'crypto';

import { slugify } from '@/utils';

/**
 * Generates a collision-resistant, sanitized filename.
 * Prepends a UUID to the slugified original filename.
 */
export const generateUniqueFilename = (originalName: string): string => {
  const ext = originalName.substring(originalName.lastIndexOf('.'));
  const name = originalName.substring(0, originalName.lastIndexOf('.'));
  
  const uuid = crypto.randomUUID();
  const safeName = slugify(name).substring(0, 50); // Limit length to avoid OS path length limits
  
  return `${uuid}-${safeName}${ext}`;
};

/**
 * Safely constructs a path strictly preventing directory traversal.
 */
export const sanitizePath = (folder: string, filename: string): string => {
  // Strip any dots or slashes that could escape the directory
  const safeFolder = folder.replace(/[^a-zA-Z0-9-_]/g, '');
  const safeFilename = filename.replace(/[^a-zA-Z0-9-_.]/g, '');
  
  return safeFolder ? `${safeFolder}/${safeFilename}` : safeFilename;
};
