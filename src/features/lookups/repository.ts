import type { RepositoryResult } from '@/contracts/repositories';
import { DatabaseError } from '@/errors';
import { serverLogger } from "@/lib/logger/server-logger";
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { ID } from '@/types';
import type { Database } from '@/types/database/database.generated';

export type TaxonomyRow = Database['public']['Tables']['taxonomies']['Row'];
export type TaxonomyTermRow = Database['public']['Tables']['taxonomy_terms']['Row'];

export class LookupsRepository {
  async getTaxonomies(): Promise<RepositoryResult<TaxonomyRow[]>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.from('taxonomies').select('*').eq('is_deleted', false).order('sort_order', { ascending: true });
      if (error) throw new DatabaseError(error.message);
      return { data, error: null };
    } catch (error) {
      serverLogger.error('LookupsRepository.getTaxonomies failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async createTaxonomy(data: Partial<TaxonomyRow>): Promise<RepositoryResult<TaxonomyRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await supabase.from('taxonomies').insert(data as any).select().single();
      if (error) throw new DatabaseError(error.message);
      return { data: row, error: null };
    } catch (error) {
      serverLogger.error('LookupsRepository.createTaxonomy failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async getTaxonomyTerms(taxonomyId: ID): Promise<RepositoryResult<TaxonomyTermRow[]>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.from('taxonomy_terms').select('*').eq('taxonomy_id', taxonomyId).order('sort_order', { ascending: true });
      if (error) throw new DatabaseError(error.message);
      return { data, error: null };
    } catch (error) {
      serverLogger.error('LookupsRepository.getTaxonomyTerms failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async createTaxonomyTerm(data: Partial<TaxonomyTermRow>): Promise<RepositoryResult<TaxonomyTermRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await supabase.from('taxonomy_terms').insert(data as any).select().single();
      if (error) throw new DatabaseError(error.message);
      return { data: row, error: null };
    } catch (error) {
      serverLogger.error('LookupsRepository.createTaxonomyTerm failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async updateTaxonomyTerm(id: ID, data: Partial<TaxonomyTermRow>): Promise<RepositoryResult<TaxonomyTermRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: row, error } = await supabase.from('taxonomy_terms').update(data as never).eq('id', id).select().single();
      if (error) throw new DatabaseError(error.message);
      return { data: row, error: null };
    } catch (error) {
      serverLogger.error('LookupsRepository.updateTaxonomyTerm failed', error as Error);
      return { data: null, error: error as Error };
    }
  }

  async deleteTaxonomyTerm(id: ID): Promise<RepositoryResult<boolean>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { error } = await supabase.from('taxonomy_terms').delete().eq('id', id);
      if (error) throw new DatabaseError(error.message);
      return { data: true, error: null };
    } catch (error) {
      serverLogger.error('LookupsRepository.deleteTaxonomyTerm failed', error as Error);
      return { data: null, error: error as Error };
    }
  }
}

export const lookupsRepository = new LookupsRepository();
