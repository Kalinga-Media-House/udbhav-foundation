/**
 * Represents a successful API response payload.
 * @template T - The type of the returned data.
 */
export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
}

/**
 * Represents a failed API response payload.
 */
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Union type representing either a successful or failed API response.
 * @template T - The type of the data returned on success.
 */
export type ApiResult<T> = ApiSuccess<T> | ApiError;

/**
 * Represents a paginated API success response.
 * @template T - The type of individual items in the data array.
 */
export type PaginatedResponse<T> = ApiSuccess<T[]> & {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

/**
 * Represents a cursor-based paginated API success response.
 * @template T - The type of individual items in the data array.
 */
export type CursorResponse<T> = ApiSuccess<T[]> & {
  cursor: {
    nextCursor: string | null;
    prevCursor: string | null;
    hasMore: boolean;
  };
};

/**
 * Represents a search response with optional faceted results.
 * @template T - The type of individual items in the data array.
 */
export type SearchResponse<T> = PaginatedResponse<T> & {
  facets?: Record<string, { label: string; count: number }[]>;
};

/**
 * Represents the result of a bulk operation.
 * @template T - The type of individual items in the data array.
 */
export type BulkResponse<T> = ApiSuccess<T[]> & {
  summary: {
    total: number;
    succeeded: number;
    failed: number;
    errors?: { index: number; error: string }[];
  };
};

/**
 * Represents an API error specifically related to validation failures.
 */
export type ValidationResponse = ApiError & {
  validationIssues: { field: string; message: string }[];
};

/**
 * Represents an action execution result, typically for internal or RPC operations.
 * @template T - The type of optional data returned on success.
 */
export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

/**
 * Generic API response wrapper supporting optional data, error, and metadata.
 * @template T - The type of the returned data.
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: unknown;
  meta?: Record<string, unknown>;
}

/**
 * Standard Pagination Metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
