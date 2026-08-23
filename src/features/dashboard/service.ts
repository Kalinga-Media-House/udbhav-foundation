/* eslint-disable @typescript-eslint/no-explicit-any */
import { ok, fail } from '@/contracts/services';
import type { ServiceResult } from '@/contracts/services';
import { serverLogger } from "@/lib/logger/server-logger";
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { ID } from '@/types';

export type DashboardOverview = Record<string, unknown>;

/**
 * Service layer for aggregating and retrieving dashboard metrics and views.
 */
export class DashboardService {
  /**
   * Retrieves high-level administrative dashboard metrics using database RPC.
   *
   * @returns ServiceResult wrapping the administrative overview data object.
   */
  async getAdminOverview(): Promise<ServiceResult<DashboardOverview>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await (supabase.rpc as any)('admin_dashboard_overview');
      if (error) return fail(error.message);
      return ok(data as DashboardOverview);
    } catch (error) {
      serverLogger.error('DashboardService.getAdminOverview failed', error as Error);
      return fail('Dashboard fetch failed.');
    }
  }

  /**
   * Retrieves dashboard overview metrics specific to a volunteer user profile.
   *
   * @param profileId - Profile ID of the volunteer.
   * @returns ServiceResult wrapping the volunteer overview data object.
   */
  async getVolunteerDashboard(profileId: ID): Promise<ServiceResult<DashboardOverview>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await (supabase.rpc as any)('volunteer_dashboard_overview', {
        p_profile_id: profileId,
      });
      if (error) return fail(error.message);
      return ok(data as DashboardOverview);
    } catch (error) {
      serverLogger.error('DashboardService.getVolunteerDashboard failed', error as Error);
      return fail('Dashboard fetch failed.');
    }
  }

  /**
   * Retrieves dashboard overview metrics specific to a donor user profile.
   *
   * @param profileId - Profile ID of the donor.
   * @returns ServiceResult wrapping the donor overview data object.
   */
  async getDonorDashboard(profileId: ID): Promise<ServiceResult<DashboardOverview>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await (supabase.rpc as any)('donor_dashboard_overview', {
        p_profile_id: profileId,
      });
      if (error) return fail(error.message);
      return ok(data as DashboardOverview);
    } catch (error) {
      serverLogger.error('DashboardService.getDonorDashboard failed', error as Error);
      return fail('Dashboard fetch failed.');
    }
  }

  /**
   * Retrieves summary notification center data for a specified user.
   *
   * @param userId - Target user ID.
   * @returns ServiceResult wrapping notification center data object.
   */
  async getNotificationCenter(userId: ID): Promise<ServiceResult<DashboardOverview>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await (supabase.rpc as any)('get_notification_center', {
        p_user_id: userId,
      });
      if (error) return fail(error.message);
      return ok(data as DashboardOverview);
    } catch (error) {
      serverLogger.error('DashboardService.getNotificationCenter failed', error as Error);
      return fail('Notification fetch failed.');
    }
  }

  /**
   * Retrieves overall organizational Key Performance Indicators (KPIs).
   *
   * @returns ServiceResult wrapping KPI data object.
   */
  async getKPIs(): Promise<ServiceResult<DashboardOverview>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await (supabase.rpc as any)('dashboard_kpis');
      if (error) return fail(error.message);
      return ok(data as DashboardOverview);
    } catch (error) {
      serverLogger.error('DashboardService.getKPIs failed', error as Error);
      return fail('KPI fetch failed.');
    }
  }
}

export const dashboardService = new DashboardService();
