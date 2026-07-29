/**
 * Base Repository Contract.
 * All feature repositories implement this interface for standard CRUD.
 * Repositories are the ONLY layer that communicates directly with Supabase.
 */

import type { Pagination, SortOrder, ID } from '@/types';

/** Filters for list queries. Key is the column name, value is the filter criterion. */
export type FilterMap = Record<string, unknown>;

/** Standardized result from repository queries. */
export interface RepositoryResult<T> {
  data: T | null;
  error: Error | null;
}

/** Standardized paginated result. */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

/** Sort configuration for list queries. */
export interface SortConfig {
  column: string;
  order: SortOrder;
}

/**
 * Base read-only repository contract.
 * Used for public-facing features where writes are not permitted.
 */
export interface IReadRepository<T> {
  findById(id: ID): Promise<RepositoryResult<T>>;
  findMany(params: {
    pagination: Pagination;
    sort?: SortConfig;
    filters?: FilterMap;
  }): Promise<PaginatedResult<T>>;
}

/**
 * Base writable repository contract.
 * Extends read with create, update, soft-delete, and restore.
 */
export interface IWriteRepository<T, TCreate, TUpdate> extends IReadRepository<T> {
  create(data: TCreate): Promise<RepositoryResult<T>>;
  update(id: ID, data: TUpdate): Promise<RepositoryResult<T>>;
  softDelete(id: ID, deletedBy: ID): Promise<RepositoryResult<T>>;
  restore(id: ID): Promise<RepositoryResult<T>>;
}

/**
 * Base searchable repository contract.
 * Adds full-text search capability via tsvector.
 */
export interface ISearchableRepository<T> {
  search(query: string, pagination: Pagination): Promise<PaginatedResult<T>>;
}
