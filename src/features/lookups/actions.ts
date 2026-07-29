'use server';

import type { ID } from '@/types';

import type { TaxonomyRow, TaxonomyTermRow } from './repository';
import { lookupsService } from './service';

export async function getTaxonomiesAction() {
  return await lookupsService.getTaxonomies();
}

export async function createTaxonomyAction(data: Partial<TaxonomyRow>) {
  return await lookupsService.createTaxonomy(data);
}

export async function getTaxonomyTermsAction(taxonomyId: ID) {
  return await lookupsService.getTaxonomyTerms(taxonomyId);
}

export async function createTaxonomyTermAction(data: Partial<TaxonomyTermRow>) {
  return await lookupsService.createTaxonomyTerm(data);
}

export async function updateTaxonomyTermAction(id: ID, data: Partial<TaxonomyTermRow>) {
  return await lookupsService.updateTaxonomyTerm(id, data);
}

export async function deleteTaxonomyTermAction(id: ID) {
  return await lookupsService.deleteTaxonomyTerm(id);
}
