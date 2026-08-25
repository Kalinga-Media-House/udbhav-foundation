'use server';

import { revalidatePath } from 'next/cache';

import { handleAction, requireAuth, requirePermission } from '@/contracts/actions';
import type { ActionResult } from '@/contracts/actions';

import { adminDashboardRepository } from './admin.repository';
import type { AdminDashboardKPIs, RevenueDataPoint, PendingApproval } from './admin.repository';
import { dashboardService } from './service';
import type { DashboardOverview } from './service';
import { volunteersRepository } from '@/features/volunteers/repository';

export async function getAdminDashboard(): Promise<ActionResult<DashboardOverview>> {
  return handleAction('getAdminDashboard', async () => {
    const session = await requireAuth();
    requirePermission(session, 'dashboard.admin');
    const result = await dashboardService.getAdminOverview();
    if (!result.success) throw new Error(result.error ?? 'Failed');
    return result.data!;
  });
}

export async function getVolunteerDashboard(): Promise<ActionResult<DashboardOverview>> {
  return handleAction('getVolunteerDashboard', async () => {
    const session = await requireAuth();
    const result = await dashboardService.getVolunteerDashboard(session.id);
    if (!result.success) throw new Error(result.error ?? 'Failed');
    return result.data!;
  });
}

export async function getDonorDashboard(): Promise<ActionResult<DashboardOverview>> {
  return handleAction('getDonorDashboard', async () => {
    const session = await requireAuth();
    const result = await dashboardService.getDonorDashboard(session.id);
    if (!result.success) throw new Error(result.error ?? 'Failed');
    return result.data!;
  });
}

export async function getNotifications(): Promise<ActionResult<DashboardOverview>> {
  return handleAction('getNotifications', async () => {
    const session = await requireAuth();
    const result = await dashboardService.getNotificationCenter(session.id);
    if (!result.success) throw new Error(result.error ?? 'Failed');
    return result.data!;
  });
}

// --- New specific Admin Dashboard Actions ---

export async function getAdminKPIsAction(): Promise<ActionResult<AdminDashboardKPIs>> {
  return handleAction('getAdminKPIs', async () => {
    const session = await requireAuth();
    requirePermission(session, 'dashboard.admin');
    return await adminDashboardRepository.getKPIs();
  });
}

export async function getAdminRevenueChartAction(months: number = 7): Promise<ActionResult<RevenueDataPoint[]>> {
  return handleAction('getAdminRevenueChart', async () => {
    const session = await requireAuth();
    requirePermission(session, 'dashboard.admin');
    return await adminDashboardRepository.getRevenueChart(months);
  });
}

export async function getAdminPendingApprovalsAction(): Promise<ActionResult<PendingApproval[]>> {
  return handleAction('getAdminPendingApprovals', async () => {
    const session = await requireAuth();
    requirePermission(session, 'dashboard.admin');
    return await adminDashboardRepository.getPendingApprovals();
  });
}

export async function getAdminRecentActivityAction(): Promise<ActionResult<any>> {
  return handleAction('getAdminRecentActivity', async () => {
    const session = await requireAuth();
    requirePermission(session, 'dashboard.admin');
    return await adminDashboardRepository.getRecentActivity();
  });
}

export async function approveVolunteerApplicationAction(appId: string): Promise<ActionResult<void>> {
  return handleAction('approveVolunteerApplication', async () => {
    const session = await requireAuth();
    requirePermission(session, 'dashboard.admin');
    // Use the existing volunteersRepository to accept the application
    const result = await volunteersRepository.updateApplicationStatus(appId, 'accepted');
    if (result.error) throw result.error;
    
    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/volunteers');
  });
}
