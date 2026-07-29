'use server';

/**
 * UDBHAV Foundation Enterprise Analytics — Server Actions
 * Exposes server actions for client widgets to independently load or filter
 * analytical data slices.
 */

import type { ServiceResult } from '@/contracts/services';

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

/**
 * Refreshes analytical materialized views in Postgres.
 * READ-ONLY: Never modifies operational records.
 */
export async function refreshMaterializedViewsAction(): Promise<
  ServiceResult<{ refreshed: boolean }>
> {
  return analyticsService.refreshMaterializedViews();
}

/**
 * Fetches executive KPI summary metrics for a given time range.
 */
export async function fetchExecutiveKPIsAction(
  timeRange: TimeRange = 'all'
): Promise<ServiceResult<ExecutiveKPIs>> {
  return analyticsService.getExecutiveKPIs(timeRange);
}

/**
 * Fetches donation time-series data for chart rendering.
 */
export async function fetchDonationTimeSeriesAction(
  timeRange: TimeRange = '1y'
): Promise<ServiceResult<TimeSeriesPoint[]>> {
  return analyticsService.getDonationTimeSeries(timeRange);
}

/**
 * Fetches user registration growth time-series data.
 */
export async function fetchUserGrowthTimeSeriesAction(
  timeRange: TimeRange = '1y'
): Promise<ServiceResult<TimeSeriesPoint[]>> {
  return analyticsService.getUserGrowthTimeSeries(timeRange);
}

/**
 * Fetches program reach and fundraising impact metrics.
 */
export async function fetchProgramPerformanceAction(): Promise<
  ServiceResult<ProgramPerformanceItem[]>
> {
  return analyticsService.getProgramPerformance();
}

/**
 * Fetches event capacity utilization and volunteer attendance metrics.
 */
export async function fetchEventParticipationAction(
  limit = 10
): Promise<ServiceResult<EventParticipationItem[]>> {
  return analyticsService.getEventParticipation(limit);
}

/**
 * Fetches CRM helpdesk resolution efficiency and ticket SLA metrics.
 */
export async function fetchCRMHelpdeskMetricsAction(): Promise<ServiceResult<CRMHelpdeskMetric[]>> {
  return analyticsService.getCRMHelpdeskMetrics();
}

/**
 * Fetches volunteer engagement summary and top skills.
 */
export async function fetchVolunteerEngagementSummaryAction(): Promise<
  ServiceResult<VolunteerEngagementSummary>
> {
  return analyticsService.getVolunteerEngagementSummary();
}

/**
 * Fetches the unified executive analytics overview payload.
 */
export async function fetchAnalyticsOverviewAction(
  timeRange: TimeRange = '1y'
): Promise<ServiceResult<AnalyticsOverviewPayload>> {
  return analyticsService.getAnalyticsOverview(timeRange);
}
