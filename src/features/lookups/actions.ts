'use server';

import { handleAction, requireAuth, requirePermission, type ActionResult } from '@/contracts/actions';
import type { ID } from '@/types';

import type { TaxonomyRow, TaxonomyTermRow } from './repository';
import { lookupsService } from './service';

export async function getTaxonomiesAction(): Promise<ActionResult<TaxonomyRow[]>> {
  return handleAction('getTaxonomies', async () => {
    const session = await requireAuth();
    requirePermission(session, 'settings.manage');
    const res = await lookupsService.getTaxonomies();
    if (!res.success) throw new Error(res.error || 'Failed');
    return res.data!;
  });
}

export async function createTaxonomyAction(data: Partial<TaxonomyRow>): Promise<ActionResult<TaxonomyRow>> {
  return handleAction('createTaxonomy', async () => {
    const session = await requireAuth();
    requirePermission(session, 'settings.manage');
    const res = await lookupsService.createTaxonomy(data);
    if (!res.success) throw new Error(res.error || 'Failed');
    return res.data!;
  });
}

export async function getTaxonomyTermsAction(taxonomyId: ID): Promise<ActionResult<TaxonomyTermRow[]>> {
  return handleAction('getTaxonomyTerms', async () => {
    const session = await requireAuth();
    requirePermission(session, 'settings.manage');
    const res = await lookupsService.getTaxonomyTerms(taxonomyId);
    if (!res.success) throw new Error(res.error || 'Failed');
    return res.data!;
  });
}

export async function createTaxonomyTermAction(data: Partial<TaxonomyTermRow>): Promise<ActionResult<TaxonomyTermRow>> {
  return handleAction('createTaxonomyTerm', async () => {
    const session = await requireAuth();
    requirePermission(session, 'settings.manage');
    const res = await lookupsService.createTaxonomyTerm(data);
    if (!res.success) throw new Error(res.error || 'Failed');
    return res.data!;
  });
}

export async function updateTaxonomyTermAction(id: ID, data: Partial<TaxonomyTermRow>): Promise<ActionResult<TaxonomyTermRow>> {
  return handleAction('updateTaxonomyTerm', async () => {
    const session = await requireAuth();
    requirePermission(session, 'settings.manage');
    const res = await lookupsService.updateTaxonomyTerm(id, data);
    if (!res.success) throw new Error(res.error || 'Failed');
    return res.data!;
  });
}

export async function deleteTaxonomyTermAction(id: ID): Promise<ActionResult<boolean>> {
  return handleAction('deleteTaxonomyTerm', async () => {
    const session = await requireAuth();
    requirePermission(session, 'settings.manage');
    const res = await lookupsService.deleteTaxonomyTerm(id);
    if (!res.success) throw new Error(res.error || 'Failed');
    return res.data!;
  });
}
