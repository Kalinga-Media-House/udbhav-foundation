/**
 * Represents an image media asset.
 */
export interface Image {
  id: string;
  url: string;
  width: number;
  height: number;
  format: string;
  alt?: string | null;
}

/**
 * Represents a video media asset.
 */
export interface Video {
  id: string;
  url: string;
  duration: number;
  format: string;
  thumbnail_url?: string | null;
}

/**
 * Represents a document media asset such as PDF or Word file.
 */
export interface Document {
  id: string;
  url: string;
  filename: string;
  size: number;
  mime_type: string;
}

/**
 * Represents image thumbnail dimensions and location.
 */
export interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

/**
 * Responsive image URLs across standard viewport breakpoints.
 */
export interface ResponsiveImage {
  small: string;
  medium: string;
  large: string;
  original: string;
}

/**
 * Metadata required when uploading a new asset to cloud storage.
 */
export interface UploadMetadata {
  filename: string;
  size: number;
  mime_type: string;
  bucket: string;
}

/**
 * Represents an object stored in Cloudflare R2 bucket storage.
 */
export interface CloudflareR2Object {
  key: string;
  bucket: string;
  size: number;
  etag: string;
  uploaded_at: string;
}

/**
 * Represents a time-limited signed URL for secure file upload or access.
 */
export interface SignedURL {
  url: string;
  expires_at: string;
}

/**
 * Represents a virtual or real directory within object storage.
 */
export interface StorageFolder {
  name: string;
  path: string;
  file_count: number;
}

/**
 * Represents an alternate variant of a media asset (e.g., optimized, webp, compressed).
 */
export interface MediaVariant {
  variant_name: string;
  url: string;
  size?: number;
}

/**
 * Generic file metadata record stored in the database.
 */
export interface FileMetadata {
  id: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  createdAt: string;
}
