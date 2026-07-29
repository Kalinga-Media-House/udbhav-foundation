export const STORAGE = {
  BUCKETS: {
    PUBLIC_MEDIA: 'udbhav-public-media',
    PRIVATE_DOCUMENTS: 'udbhav-private-docs',
  },
  LIMITS: {
    MAX_IMAGE_SIZE_MB: 5,
    MAX_DOCUMENT_SIZE_MB: 20,
    MAX_AVATAR_SIZE_MB: 2,
  },
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'] as const,
  ALLOWED_DOCUMENT_TYPES: ['application/pdf'] as const,
} as const;
