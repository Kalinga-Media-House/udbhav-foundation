/**
 * UDBHAV Foundation Enterprise Analytics — Domain Contracts & Types
 * Defines read-only data structures for time-series aggregation, KPI metrics,
 * and executive BI dashboard reporting.
 */

import type { ID } from '@/types';

/**
 * Standardized time range filters supported across all analytics widgets.
 */
export type TimeRange = '7d' | '30d' | '90d' | '1y' | 'all';

/**
 * Executive KPI summary metrics aggregated across foundation modules.
 */
export interface ExecutiveKPIs {
  totalUsers: number;
  newUsersPeriod: number;
  userGrowthPercentage: number;
  totalFundsCollected: number;
  fundsPeriod: number;
  fundsGrowthPercentage: number;
  activeVolunteers: number;
  volunteerHours: number;
  activePrograms: number;
  openEnquiries: number;
  currency: string;
}

/**
 * Standard time-series data point for charting widgets.
 */
export interface TimeSeriesPoint {
  period: string; // ISO period string (e.g., '2026-07' or '2026-07-29')
  label: string; // Human-readable label (e.g., 'Jul 2026')
  value: number; // Primary numeric value
  secondaryValue?: number; // Optional secondary metric (e.g., transaction count)
}

/**
 * Program reach and financial impact summary.
 */
export interface ProgramPerformanceItem {
  programId: ID;
  title: string;
  status: string;
  totalEvents: number;
  totalVolunteers: number;
  totalFundsRaised: number;
}

/**
 * Event capacity and volunteer participation metrics.
 */
export interface EventParticipationItem {
  eventId: ID;
  title: string;
  startDatetime: string;
  status: string;
  registrationLimit: number;
  registrations: number;
  attendedVolunteers: number;
  capacityUtilization: number;
}

/**
 * CRM helpdesk resolution efficiency and SLA breakdown.
 */
export interface CRMHelpdeskMetric {
  department: string;
  category: string;
  totalTickets: number;
  resolvedTickets: number;
  escalatedTickets: number;
  avgResolutionHours: number;
}

/**
 * Volunteer activity and hours summary.
 */
export interface VolunteerEngagementSummary {
  totalVolunteers: number;
  activeVolunteers: number;
  totalHoursContributed: number;
  avgEventsPerVolunteer: number;
  topSkills: Array<{ skill: string; count: number }>;
}

/**
 * Unified Analytics Overview payload containing independent widget data slices.
 */
export interface AnalyticsOverviewPayload {
  kpis: ExecutiveKPIs;
  donationTrend: TimeSeriesPoint[];
  userGrowthTrend: TimeSeriesPoint[];
  programs: ProgramPerformanceItem[];
  events: EventParticipationItem[];
  crmMetrics: CRMHelpdeskMetric[];
  volunteers: VolunteerEngagementSummary;
  lastRefreshedAt: string;
}
