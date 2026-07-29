/**
 * UDBHAV Foundation Enterprise Analytics — Service Layer
 * Enforces strict Role-Based Access Control (RBAC), wraps repository calls in
 * ServiceResult contracts, and handles cache revalidation.
 */

import { revalidatePath } from 'next/cache';

import { ROLES } from '@/constants';
import { ok, fail } from '@/contracts/services';
import type { ServiceResult } from '@/contracts/services';
import { AuthorizationError } from '@/errors';
import { securityLogger } from '@/lib/logger/security-logger';
import { serverLogger } from '@/lib/logger/server-logger';
import { requireUser } from '@/lib/supabase/helpers';
import { createServerSupabaseClient } from '@/lib/supabase/server';

import { AnalyticsRepository } from './repository';
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

const ALLOWED_ANALYTICS_ROLES = [ROLES.SUPER_ADMIN, ROLES.ADMIN, 'finance-manager', 'director'];

/**
 * Asserts that the authenticated user holds an authorized administrative role.
 */
async function assertAnalyticsAccess(): Promise<void> {
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();

  let userRole = user.app_metadata?.role || user.user_metadata?.role;
  if (!userRole) {
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('is_active, roles(slug)')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .limit(1)
      .single<{ is_active: boolean; roles: { slug: string } }>();
    userRole = roleData?.roles?.slug;
  }

  if (!userRole || !ALLOWED_ANALYTICS_ROLES.includes(userRole as any)) {
    securityLogger.logViolation('RLS_VIOLATION', 'unknown', {
      userId: user.id,
      requiredRoles: ALLOWED_ANALYTICS_ROLES,
      actualRole: userRole || 'none',
    });
    throw new AuthorizationError('Insufficient permissions to access enterprise analytics.');
  }
}

export class AnalyticsService {
  private repository = new AnalyticsRepository();

  /**
   * Refreshes all materialized views and revalidates dashboard cache paths.
   * READ-ONLY: Only triggers DB refresh procedure; never modifies operational rows.
   */
  async refreshMaterializedViews(): Promise<ServiceResult<{ refreshed: boolean }>> {
    try {
      await assertAnalyticsAccess();
      await this.repository.refreshMaterializedViews();
      revalidatePath('/admin/dashboard');
      revalidatePath('/admin/analytics');
      return ok({ refreshed: true });
    } catch (error) {
      serverLogger.error('AnalyticsService.refreshMaterializedViews failed', error as Error);
      return fail('Failed to refresh analytical views.');
    }
  }

  /**
   * Retrieves executive KPI summary metrics.
   */
  async getExecutiveKPIs(timeRange: TimeRange = 'all'): Promise<ServiceResult<ExecutiveKPIs>> {
    try {
      await assertAnalyticsAccess();
      const kpis = await this.repository.getExecutiveKPIs(timeRange);
      return ok(kpis);
    } catch (error) {
      serverLogger.error('AnalyticsService.getExecutiveKPIs failed', error as Error);
      return fail('Failed to retrieve executive KPIs.');
    }
  }

  /**
   * Retrieves monthly donation inflows time-series.
   */
  async getDonationTimeSeries(
    timeRange: TimeRange = '1y'
  ): Promise<ServiceResult<TimeSeriesPoint[]>> {
    try {
      await assertAnalyticsAccess();
      const points = await this.repository.getDonationTimeSeries(timeRange);
      return ok(points);
    } catch (error) {
      serverLogger.error('AnalyticsService.getDonationTimeSeries failed', error as Error);
      return ok([]); // Return empty array gracefully so widget displays empty state
    }
  }

  /**
   * Retrieves monthly new user growth time-series.
   */
  async getUserGrowthTimeSeries(
    timeRange: TimeRange = '1y'
  ): Promise<ServiceResult<TimeSeriesPoint[]>> {
    try {
      await assertAnalyticsAccess();
      const points = await this.repository.getUserGrowthTimeSeries(timeRange);
      return ok(points);
    } catch (error) {
      serverLogger.error('AnalyticsService.getUserGrowthTimeSeries failed', error as Error);
      return ok([]);
    }
  }

  /**
   * Retrieves program reach and financial impact metrics.
   */
  async getProgramPerformance(): Promise<ServiceResult<ProgramPerformanceItem[]>> {
    try {
      await assertAnalyticsAccess();
      const items = await this.repository.getProgramPerformance();
      return ok(items);
    } catch (error) {
      serverLogger.error('AnalyticsService.getProgramPerformance failed', error as Error);
      return ok([]);
    }
  }

  /**
   * Retrieves event capacity and volunteer participation metrics.
   */
  async getEventParticipation(limit = 10): Promise<ServiceResult<EventParticipationItem[]>> {
    try {
      await assertAnalyticsAccess();
      const items = await this.repository.getEventParticipation(limit);
      return ok(items);
    } catch (error) {
      serverLogger.error('AnalyticsService.getEventParticipation failed', error as Error);
      return ok([]);
    }
  }

  /**
   * Retrieves CRM helpdesk resolution efficiency and SLA breakdown.
   */
  async getCRMHelpdeskMetrics(): Promise<ServiceResult<CRMHelpdeskMetric[]>> {
    try {
      await assertAnalyticsAccess();
      const metrics = await this.repository.getCRMHelpdeskMetrics();
      return ok(metrics);
    } catch (error) {
      serverLogger.error('AnalyticsService.getCRMHelpdeskMetrics failed', error as Error);
      return ok([]);
    }
  }

  /**
   * Retrieves volunteer activity and hours summary.
   */
  async getVolunteerEngagementSummary(): Promise<ServiceResult<VolunteerEngagementSummary>> {
    try {
      await assertAnalyticsAccess();
      const summary = await this.repository.getVolunteerEngagementSummary();
      return ok(summary);
    } catch (error) {
      serverLogger.error('AnalyticsService.getVolunteerEngagementSummary failed', error as Error);
      return ok({
        totalVolunteers: 0,
        activeVolunteers: 0,
        totalHoursContributed: 0,
        avgEventsPerVolunteer: 0,
        topSkills: [],
      });
    }
  }

  /**
   * Retrieves unified executive overview payload.
   */
  async getAnalyticsOverview(
    timeRange: TimeRange = '1y'
  ): Promise<ServiceResult<AnalyticsOverviewPayload>> {
    try {
      await assertAnalyticsAccess();
      const overview = await this.repository.getAnalyticsOverview(timeRange);
      return ok(overview);
    } catch (error) {
      serverLogger.error('AnalyticsService.getAnalyticsOverview failed', error as Error);
      return fail('Failed to load enterprise analytics overview.');
    }
  }
}
