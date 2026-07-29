'use server';

/**
 * UDBHAV Foundation Enterprise Analytics — Server Actions
 * Exposes server actions for client widgets to independently load or filter
 * analytical data slices.
 */

import {
  handleAction,
  requireAuth,
  requirePermission,
  type ActionResult,
} from '@/contracts/actions';

import { AnalyticsService } from './service';
import type {
  TimeRange,
  ExecutiveKPIs,
  TimeSeriesPoint,
  ProgramPerformanceItem,
  EventParticipationItem,
  CRMHelpdeskMetric,
  VolunteerEngagementSummary,
  AnalyticsOverviewPayload,
} from './types';

const analyticsService = new AnalyticsService();

export async function refreshMaterializedViewsAction(): Promise<
  ActionResult<{ refreshed: boolean }>
> {
  return handleAction('refreshMaterializedViews', async () => {
    const session = await requireAuth();
    requirePermission(session, 'dashboard.admin');
    const res = await analyticsService.refreshMaterializedViews();
    if (!res.success) throw new Error(res.error || 'Failed');
    return res.data!;
  });
}

export async function fetchExecutiveKPIsAction(
  timeRange: TimeRange = 'all'
): Promise<ActionResult<ExecutiveKPIs>> {
  return handleAction('fetchExecutiveKPIs', async () => {
    const session = await requireAuth();
    requirePermission(session, 'dashboard.admin');
    const res = await analyticsService.getExecutiveKPIs(timeRange);
    if (!res.success) throw new Error(res.error || 'Failed');
    return res.data!;
  });
}

export async function fetchDonationTimeSeriesAction(
  timeRange: TimeRange = '1y'
): Promise<ActionResult<TimeSeriesPoint[]>> {
  return handleAction('fetchDonationTimeSeries', async () => {
    const session = await requireAuth();
    requirePermission(session, 'dashboard.admin');
    const res = await analyticsService.getDonationTimeSeries(timeRange);
    if (!res.success) throw new Error(res.error || 'Failed');
    return res.data!;
  });
}

export async function fetchUserGrowthTimeSeriesAction(
  timeRange: TimeRange = '1y'
): Promise<ActionResult<TimeSeriesPoint[]>> {
  return handleAction('fetchUserGrowthTimeSeries', async () => {
    const session = await requireAuth();
    requirePermission(session, 'dashboard.admin');
    const res = await analyticsService.getUserGrowthTimeSeries(timeRange);
    if (!res.success) throw new Error(res.error || 'Failed');
    return res.data!;
  });
}

export async function fetchProgramPerformanceAction(): Promise<
  ActionResult<ProgramPerformanceItem[]>
> {
  return handleAction('fetchProgramPerformance', async () => {
    const session = await requireAuth();
    requirePermission(session, 'dashboard.admin');
    const res = await analyticsService.getProgramPerformance();
    if (!res.success) throw new Error(res.error || 'Failed');
    return res.data!;
  });
}

export async function fetchEventParticipationAction(
  limit = 10
): Promise<ActionResult<EventParticipationItem[]>> {
  return handleAction('fetchEventParticipation', async () => {
    const session = await requireAuth();
    requirePermission(session, 'dashboard.admin');
    const res = await analyticsService.getEventParticipation(limit);
    if (!res.success) throw new Error(res.error || 'Failed');
    return res.data!;
  });
}

export async function fetchCRMHelpdeskMetricsAction(): Promise<ActionResult<CRMHelpdeskMetric[]>> {
  return handleAction('fetchCRMHelpdeskMetrics', async () => {
    const session = await requireAuth();
    requirePermission(session, 'dashboard.admin');
    const res = await analyticsService.getCRMHelpdeskMetrics();
    if (!res.success) throw new Error(res.error || 'Failed');
    return res.data!;
  });
}

export async function fetchVolunteerEngagementSummaryAction(): Promise<
  ActionResult<VolunteerEngagementSummary>
> {
  return handleAction('fetchVolunteerEngagementSummary', async () => {
    const session = await requireAuth();
    requirePermission(session, 'dashboard.admin');
    const res = await analyticsService.getVolunteerEngagementSummary();
    if (!res.success) throw new Error(res.error || 'Failed');
    return res.data!;
  });
}

export async function fetchAnalyticsOverviewAction(
  timeRange: TimeRange = '1y'
): Promise<ActionResult<AnalyticsOverviewPayload>> {
  return handleAction('fetchAnalyticsOverview', async () => {
    const session = await requireAuth();
    requirePermission(session, 'dashboard.admin');
    const res = await analyticsService.getAnalyticsOverview(timeRange);
    if (!res.success) throw new Error(res.error || 'Failed');
    return res.data!;
  });
}
