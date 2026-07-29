import { fromRepo } from '@/contracts/services';
import type { ServiceResult } from '@/contracts/services';
import type { ID } from '@/types';

import { lookupsRepository, type TaxonomyRow, type TaxonomyTermRow } from './repository';

export class LookupsService {
  async getTaxonomies(): Promise<ServiceResult<TaxonomyRow[]>> {
    return fromRepo(await lookupsRepository.getTaxonomies());
  }

  async createTaxonomy(data: Partial<TaxonomyRow>): Promise<ServiceResult<TaxonomyRow>> {
    return fromRepo(await lookupsRepository.createTaxonomy(data));
  }

  async getTaxonomyTerms(taxonomyId: ID): Promise<ServiceResult<TaxonomyTermRow[]>> {
    return fromRepo(await lookupsRepository.getTaxonomyTerms(taxonomyId));
  }

  async createTaxonomyTerm(
    data: Partial<TaxonomyTermRow>
  ): Promise<ServiceResult<TaxonomyTermRow>> {
    return fromRepo(await lookupsRepository.createTaxonomyTerm(data));
  }

  async updateTaxonomyTerm(
    id: ID,
    data: Partial<TaxonomyTermRow>
  ): Promise<ServiceResult<TaxonomyTermRow>> {
    return fromRepo(await lookupsRepository.updateTaxonomyTerm(id, data));
  }

  async deleteTaxonomyTerm(id: ID): Promise<ServiceResult<boolean>> {
    return fromRepo(await lookupsRepository.deleteTaxonomyTerm(id));
  }
}

export const lookupsService = new LookupsService();
