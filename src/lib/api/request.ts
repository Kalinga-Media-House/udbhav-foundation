import { NextRequest } from 'next/server';

import { PAGINATION } from '@/constants';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface SearchParams extends PaginationParams {
  query?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Reusable HTTP Request Helpers
 */
export const apiRequest = {
  /**
   * Extracts standard pagination parameters from a NextRequest URL.
   */
  getPaginationParams: (request: NextRequest): PaginationParams => {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || String(PAGINATION.DEFAULT_PAGE), 10);
    const limit = parseInt(searchParams.get('limit') || String(PAGINATION.DEFAULT_LIMIT), 10);

    return {
      page: isNaN(page) || page < 1 ? PAGINATION.DEFAULT_PAGE : page,
      limit: isNaN(limit) || limit < 1 || limit > PAGINATION.MAX_LIMIT ? PAGINATION.DEFAULT_LIMIT : limit,
    };
  },

  /**
   * Extracts search and sort parameters along with pagination.
   */
  getSearchParams: (request: NextRequest): SearchParams => {
    const searchParams = request.nextUrl.searchParams;
    const pagination = apiRequest.getPaginationParams(request);
    const query = searchParams.get('q') || searchParams.get('query') || undefined;
    const sortBy = searchParams.get('sortBy') || undefined;
    const sortOrder = searchParams.get('sortOrder') === 'desc' ? 'desc' : 'asc';

    return {
      ...pagination,
      query,
      sortBy,
      sortOrder,
    };
  },
};
