'use server';

import {
  handleAction,
  requireAuth,
  requirePermission,
  type ActionResult,
} from '@/contracts/actions';

import * as service from './service';

export async function fetchDonationsAction(): Promise<ActionResult<any>> {
  return handleAction('fetchDonations', async () => {
    const session = await requireAuth();
    requirePermission(session, 'reports_view');
    return service.getDonationsReport();
  });
}

export async function fetchContactsAction(): Promise<ActionResult<any>> {
  return handleAction('fetchContacts', async () => {
    const session = await requireAuth();
    requirePermission(session, 'reports_view');
    return service.getContactsReport();
  });
}

export async function fetchVolunteersAction(): Promise<ActionResult<any>> {
  return handleAction('fetchVolunteers', async () => {
    const session = await requireAuth();
    requirePermission(session, 'reports_view');
    return service.getVolunteersReport();
  });
}

export async function fetchUsersAction(): Promise<ActionResult<any>> {
  return handleAction('fetchUsers', async () => {
    const session = await requireAuth();
    requirePermission(session, 'reports_view');
    return service.getUsersReport();
  });
}
