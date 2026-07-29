/**
 * @file views.ts
 * @description Interface definitions for common database SQL views in the UDBHAV Foundation platform.
 */

/**
 * Interface representing the active programs database view.
 */
export interface ActiveProgramsView {
  /** Unique program identifier. */
  id: string;
  /** Display title of the program. */
  title: string;
  /** URL-friendly slug for the program. */
  slug: string;
  /** Current active lifecycle status of the program. */
  status: string;
}

/**
 * Interface representing summary statistics for a volunteer profile view.
 */
export interface VolunteerSummaryView {
  /** Unique identifier of the volunteer profile. */
  profile_id: string;
  /** Cumulative hours served across all events. */
  total_hours: number;
  /** Total count of events attended by the volunteer. */
  events_attended: number;
}
