/**
 * Pagination parameters for search queries.
 */
export interface Pagination {
  page: number;
  limit: number;
}

/**
 * Cursor-based pagination parameters for search queries.
 */
export interface Cursor {
  cursor: string | null;
  limit: number;
}

/**
 * Sort order direction.
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Sorting configuration for search queries.
 * @template T - The type representing valid sortable column names.
 */
export interface Sorting<T = string> {
  column: T;
  order: SortOrder;
}

/**
 * Key-value mapping for arbitrary query filtering.
 */
export type Filtering = Record<string, unknown>;

/**
 * Generalized search query parameters.
 */
export interface SearchQuery {
  q?: string;
  pagination?: Pagination;
  sort?: Sorting;
  filters?: Filtering;
}

/**
 * Advanced filtering options for detailed search refinement.
 */
export interface AdvancedFilters {
  dateRange?: {
    from: string;
    to: string;
  };
  status?: string[];
  tags?: string[];
  categories?: string[];
}

/**
 * Configuration for faceted search execution.
 */
export interface FacetedSearch {
  query: SearchQuery;
  facets: string[];
}

/**
 * Parameters for GIN index or full-text vector search in PostgreSQL.
 */
export interface GINSearch {
  searchTerm: string;
  vectorColumn?: string;
}

/**
 * Parameters for hierarchical taxonomy search.
 */
export interface TaxonomySearch {
  taxonomyType?: string;
  parentId?: string | null;
  isEnabled?: boolean;
}

/**
 * Parameters for searching media assets.
 */
export interface MediaSearch {
  mimeType?: string;
  uploadedBy?: string;
  isPublic?: boolean;
}
