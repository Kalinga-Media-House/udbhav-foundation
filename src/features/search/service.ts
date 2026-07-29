import { fail, fromRepo } from '@/contracts/services';
import type { ServiceResult } from '@/contracts/services';

import { searchRepository } from './repository';
import type { GlobalSearchResult } from './repository';

export class SearchService {
  async globalSearch(query: string, userRole: string): Promise<ServiceResult<GlobalSearchResult>> {
    // Enforce RBAC (must be admin)
    if (!['Admin', 'SuperAdmin', 'System Admin'].includes(userRole)) {
      return fail('Unauthorized: Admin access required');
    }
    return fromRepo(await searchRepository.globalSearch(query));
  }
}

export const searchService = new SearchService();
