/**
 * @file functions.ts
 * @description Interface definitions for database stored procedures and RPC functions.
 */

/**
 * Arguments for querying active campaigns via RPC.
 */
export interface ActiveCampaignsRpcArgs {
  /** Maximum number of active campaigns to return. */
  p_limit: number;
}

/**
 * Return structure for the admin dashboard overview RPC function.
 */
export interface AdminDashboardOverviewRpcReturn {
  /** Total count of programs in the platform. */
  total_programs: number;
  /** Total count of events scheduled or completed. */
  total_events: number;
  /** Total count of registered volunteer profiles. */
  total_volunteers: number;
  /** Cumulative count of all donation transactions. */
  total_donations: number;
}

/**
 * Arguments for fetching overview metrics for a volunteer dashboard via RPC.
 */
export interface VolunteerDashboardOverviewRpcArgs {
  /** Unique profile identifier of the volunteer. */
  p_profile_id: string;
}

/**
 * Arguments for fetching overview metrics for a donor dashboard via RPC.
 */
export interface DonorDashboardOverviewRpcArgs {
  /** Unique profile identifier of the donor. */
  p_profile_id: string;
}
