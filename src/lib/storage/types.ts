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
