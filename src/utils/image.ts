/**
 * Helper to determine if a URL points to an image.
 * Useful for rendering preview components.
 */
export const isImageUrl = (url: string): boolean => {
  return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url.toLowerCase());
};
