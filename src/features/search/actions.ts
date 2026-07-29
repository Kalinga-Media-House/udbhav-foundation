'use server';

import { handleAction, requireAuth } from '@/contracts/actions';
import type { ActionResult } from '@/contracts/actions';

import type { GlobalSearchResult } from './repository';
import { searchService } from './service';

export async function globalSearch(query: string): Promise<ActionResult<GlobalSearchResult>> {
  return handleAction('globalSearch', async () => {
    const session = await requireAuth();
    
    const result = await searchService.globalSearch(query, session.role);
    if (!result.success) throw new Error(result.error ?? 'Global search failed');
    return result.data!;
  });
}
