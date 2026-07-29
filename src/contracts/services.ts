/**
 * Base Service Contract.
 * Services contain ALL business logic and orchestrate repositories.
 * They never access Supabase directly — only through repositories.
 */

import type { Pagination, ID } from '@/types';

import type { PaginatedResult, RepositoryResult } from './repositories';

/**
 * Standard service response wrapper.
 * Adds a `success` boolean for ergonomic checks in server actions.
 */
export interface ServiceResult<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

/**
 * Creates a success ServiceResult from raw data.
 */
export function ok<T>(data: T): ServiceResult<T> {
  return { success: true, data, error: null };
}

/**
 * Creates a failure ServiceResult from an error message.
 */
export function fail<T = never>(error: string): ServiceResult<T> {
  return { success: false, data: null, error };
}

/**
 * Converts a RepositoryResult into a ServiceResult.
 * Centralizes the error-to-string conversion.
 */
export function fromRepo<T>(result: RepositoryResult<T>): ServiceResult<T> {
  if (result.error) {
    return fail(result.error.message);
  }
  if (!result.data) {
    return fail('Record not found.');
  }
  return ok(result.data);
}

/**
 * Base read-only service contract.
 */
export interface IReadService<T> {
  getById(id: ID): Promise<ServiceResult<T>>;
  list(pagination: Pagination): Promise<ServiceResult<PaginatedResult<T>>>;
}

/**
 * Base writable service contract.
 */
export interface IWriteService<T, TCreateDTO, TUpdateDTO> extends IReadService<T> {
  create(dto: TCreateDTO, userId: ID): Promise<ServiceResult<T>>;
  update(id: ID, dto: TUpdateDTO, userId: ID): Promise<ServiceResult<T>>;
  remove(id: ID, userId: ID): Promise<ServiceResult<T>>;
}
