/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RepositoryResult } from '@/contracts/repositories';
import { serverLogger } from '@/lib/logger/server-logger';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export type GlobalSearchResult = {
  contacts: any[];
  organizations: any[];
  programs: any[];
  events: any[];
  volunteers: any[];
  donations: any[];
  campaigns: any[];
  media: any[];
};

export class SearchRepository {
  async globalSearch(query: string): Promise<RepositoryResult<GlobalSearchResult>> {
    try {
      const supabase = await createServerSupabaseClient();
      
      const searchTasks = [
        supabase.from('contacts').select('id, full_name, email').ilike('full_name', `%${query}%`).limit(5),
        supabase.from('organizations').select('id, name').ilike('name', `%${query}%`).limit(5),
        supabase.from('programs').select('id, title').ilike('title', `%${query}%`).limit(5),
        supabase.from('events').select('id, title').ilike('title', `%${query}%`).limit(5),
        // we'll just check if profiles or volunteers table has some fields, let's just use select('*')
        supabase.from('volunteers').select('*').limit(5), 
        supabase.from('donations').select('*').limit(5),
        supabase.from('donation_campaigns').select('id, title').ilike('title', `%${query}%`).limit(5),
        supabase.from('media_files').select('id, original_filename').ilike('original_filename', `%${query}%`).limit(5),
      ];

      const results = await Promise.allSettled(searchTasks);
      
      const getResult = (index: number) => {
        const res = results[index];
        if (res.status === 'fulfilled' && !res.value.error) {
          return res.value.data || [];
        }
        return [];
      };

      const data: GlobalSearchResult = {
        contacts: getResult(0),
        organizations: getResult(1),
        programs: getResult(2),
        events: getResult(3),
        volunteers: getResult(4),
        donations: getResult(5),
        campaigns: getResult(6),
        media: getResult(7),
      };

      return { data, error: null };
    } catch (error) {
      serverLogger.error('SearchRepository.globalSearch failed', error as Error);
      return { data: null, error: error as Error };
    }
  }
}

export const searchRepository = new SearchRepository();
