/**
 * @file Dashboard and overview analytics domain type definitions.
 * @module types/domain/dashboard
 */

import type { ISODate } from '../utilities';

/**
 * Raw database entity representing a recorded dashboard metric snapshot.
 */
export interface DashboardMetricEntity {
  id: string;
  metric_key: string;
  metric_value: number;
  previous_value: number | null;
  change_percentage: number | null;
  recorded_at: string;
}

/**
 * Domain model representing a dashboard metric with formatted timestamps.
 */
export interface DashboardMetric {
  id: string;
  metricKey: string;
  metricValue: number;
  previousValue?: number | null;
  changePercentage?: number | null;
  recordedAt: ISODate;
}

/**
 * High-level overview summary numbers across all core foundation domains.
 */
export interface OverviewSummary {
  totalPrograms: number;
  totalEvents: number;
  totalVolunteers: number;
  totalDonations: number;
  totalHoursServed: number;
  totalFundsRaised: number;
}

/**
 * ViewModel for rendering the main administrative dashboard.
 */
export interface DashboardViewModel {
  overview: OverviewSummary;
  recentDonations: Array<{
    id: string;
    amount: string;
    donorName: string;
    timeAgo: string;
  }>;
  upcomingEvents: Array<{
    id: string;
    title: string;
    date: string;
    spotsRemaining: number;
  }>;
  activeProgramsCount: number;
}

/**
 * Filter options for querying dashboard metrics and analytics.
 */
export interface DashboardFilterDTO {
  timeRange?: 'today' | 'week' | 'month' | 'year' | 'all';
  programId?: string;
}
