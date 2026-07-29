'use server';

import { handleAction, requireAuth, requirePermission } from '@/contracts/actions';
import type { ActionResult } from '@/contracts/actions';

import { dashboardService } from './service';
import type { DashboardOverview } from './service';

/**
 * Protected action to fetch admin dashboard overview metrics.
 * Requires 'dashboard.admin' permission.
 *
 * @returns ActionResult wrapping admin DashboardOverview metrics.
 */
export async function getAdminDashboard(): Promise<ActionResult<DashboardOverview>> {
  return handleAction('getAdminDashboard', async () => {
    const session = await requireAuth();
    requirePermission(session, 'dashboard.admin');
    const result = await dashboardService.getAdminOverview();
    if (!result.success) throw new Error(result.error ?? 'Failed');
    return result.data!;
  });
}

/**
 * Protected action to fetch volunteer dashboard overview metrics.
 *
 * @returns ActionResult wrapping volunteer DashboardOverview metrics.
 */
export async function getVolunteerDashboard(): Promise<ActionResult<DashboardOverview>> {
  return handleAction('getVolunteerDashboard', async () => {
    const session = await requireAuth();
    const result = await dashboardService.getVolunteerDashboard(session.id);
    if (!result.success) throw new Error(result.error ?? 'Failed');
    return result.data!;
  });
}

/**
 * Protected action to fetch donor dashboard overview metrics.
 *
 * @returns ActionResult wrapping donor DashboardOverview metrics.
 */
export async function getDonorDashboard(): Promise<ActionResult<DashboardOverview>> {
  return handleAction('getDonorDashboard', async () => {
    const session = await requireAuth();
    const result = await dashboardService.getDonorDashboard(session.id);
    if (!result.success) throw new Error(result.error ?? 'Failed');
    return result.data!;
  });
}

/**
 * Protected action to fetch notification center metrics for current session.
 *
 * @returns ActionResult wrapping notification center DashboardOverview metrics.
 */
export async function getNotifications(): Promise<ActionResult<DashboardOverview>> {
  return handleAction('getNotifications', async () => {
    const session = await requireAuth();
    const result = await dashboardService.getNotificationCenter(session.id);
    if (!result.success) throw new Error(result.error ?? 'Failed');
    return result.data!;
  });
}
