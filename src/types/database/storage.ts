/**
 * @file storage.ts
 * @description Type definitions for cloud object storage buckets and objects.
 */

/**
 * Interface representing a cloud storage bucket.
 */
export interface StorageBucket {
  /** Unique bucket identifier. */
  id: string;
  /** Unique bucket name. */
  name: string;
  /** Whether the bucket contents are publicly accessible. */
  public: boolean;
  /** Timestamp when the bucket was created. */
  created_at: string;
}

/**
 * Interface representing an stored file or object within a storage bucket.
 */
export interface StorageObject {
  /** File or object path name within the bucket. */
  name: string;
  /** Identifier of the bucket containing this object. */
  bucket_id: string;
  /** Identifier of the user or entity that owns the object. */
  owner: string | null;
  /** Unique object identifier. */
  id: string;
  /** Timestamp when the object was last modified or updated. */
  updated_at: string;
  /** Timestamp when the object was originally created. */
  created_at: string;
  /** Timestamp when the object was last accessed, if tracked. */
  last_accessed_at: string | null;
  /** Arbitrary metadata key-value pairs associated with the storage object. */
  metadata: Record<string, unknown>;
}
