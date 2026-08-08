export type BucketName = string;

export interface StorageObject {
  key: string;
  bucket: BucketName;
  url: string;
  size?: number;
  contentType?: string;
  createdAt?: string;
}

export interface UploadOptions {
  bucket?: BucketName;
  folder?: string;
  contentType: string;
  maxSizeMB?: number;
  allowedMimeTypes?: string[];
  key?: string; // Explicit key override
}

export interface DownloadOptions {
  bucket?: BucketName;
  expiresIn?: number; // seconds for presigned URLs
}

export interface DeleteOptions {
  bucket?: BucketName;
}

export interface PresignedUrl {
  url: string;
  expiresAt: string;
  key: string;
}

export interface StorageResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface ImageUploadMetadata {
  filename: string;
  size: number;
  contentType: string;
  folder: string;
}

export interface ImageUploadResult {
  id: string;
  cdnUrl: string;
  width: number;
  height: number;
  format: string;
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
}
