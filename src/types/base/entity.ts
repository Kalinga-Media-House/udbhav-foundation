import { ISODate } from '../utilities';

/**
 * Base interface for an entity containing an ID.
 * @template T - The type of the ID, defaults to string.
 */
export interface EntityId<T = string> {
  id: T;
}

/**
 * Interface representing creation and last modification timestamps.
 */
export interface Timestamped {
  created_at: ISODate;
  updated_at: ISODate;
}

/**
 * Interface representing soft deletion capabilities.
 */
export interface SoftDelete {
  is_deleted: boolean;
  deleted_at?: ISODate | null;
}

/**
 * Interface representing audit trails for creator and updater.
 */
export interface Auditable {
  created_by: string | null;
  updated_by: string | null;
}

/**
 * Interface representing version concurrency control.
 */
export interface Versioned {
  version: number;
}

/**
 * Interface representing publishing status and timestamps.
 */
export interface Publishable {
  is_published: boolean;
  published_at?: ISODate | null;
}

/**
 * Interface representing creation audit user reference.
 */
export interface CreatedBy {
  created_by: string | null;
}

/**
 * Interface representing modification audit user reference.
 */
export interface UpdatedBy {
  updated_by: string | null;
}

/**
 * Interface representing ownership reference.
 */
export interface Owner {
  owner_id: string;
}
