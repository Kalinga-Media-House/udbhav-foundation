import { fail, fromRepo } from '@/contracts/services';
import type { ServiceResult } from '@/contracts/services';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { ID } from '@/types';

import { lookupsRepository, type TaxonomyRow, type TaxonomyTermRow } from './repository';

export class LookupsService {
  private async ensureAdmin(): Promise<boolean> {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('is_active, roles(slug)')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .limit(1)
      .single<{ is_active: boolean; roles: { slug: string } }>();
    const roleSlug = roleData?.roles?.slug;
    return roleSlug === 'super-admin' || roleSlug === 'admin';
  }

  async getTaxonomies(): Promise<ServiceResult<TaxonomyRow[]>> {
    if (!(await this.ensureAdmin())) return fail('Forbidden: Admin access required');
    return fromRepo(await lookupsRepository.getTaxonomies());
  }

  async createTaxonomy(data: Partial<TaxonomyRow>): Promise<ServiceResult<TaxonomyRow>> {
    if (!(await this.ensureAdmin())) return fail('Forbidden: Admin access required');
    return fromRepo(await lookupsRepository.createTaxonomy(data));
  }

  async getTaxonomyTerms(taxonomyId: ID): Promise<ServiceResult<TaxonomyTermRow[]>> {
    if (!(await this.ensureAdmin())) return fail('Forbidden: Admin access required');
    return fromRepo(await lookupsRepository.getTaxonomyTerms(taxonomyId));
  }

  async createTaxonomyTerm(
    data: Partial<TaxonomyTermRow>
  ): Promise<ServiceResult<TaxonomyTermRow>> {
    if (!(await this.ensureAdmin())) return fail('Forbidden: Admin access required');
    return fromRepo(await lookupsRepository.createTaxonomyTerm(data));
  }

  async updateTaxonomyTerm(
    id: ID,
    data: Partial<TaxonomyTermRow>
  ): Promise<ServiceResult<TaxonomyTermRow>> {
    if (!(await this.ensureAdmin())) return fail('Forbidden: Admin access required');
    return fromRepo(await lookupsRepository.updateTaxonomyTerm(id, data));
  }

  async deleteTaxonomyTerm(id: ID): Promise<ServiceResult<boolean>> {
    if (!(await this.ensureAdmin())) return fail('Forbidden: Admin access required');
    return fromRepo(await lookupsRepository.deleteTaxonomyTerm(id));
  }
}

export const lookupsService = new LookupsService();
