/**
 * @file tables.ts
 * @description Convenient row type aliases for all 18 tables in the UDBHAV Foundation database schema.
 */

import type { Tables } from './database';

/**
 * Row type alias for the `profiles` table.
 */
export type ProfileRow = Tables<'profiles'>;

/**
 * Row type alias for the `programs` table.
 */
export type ProgramRow = Tables<'programs'>;

/**
 * Row type alias for the `events` table.
 */
export type EventRow = Tables<'events'>;

/**
 * Row type alias for the `volunteers` table.
 */
export type VolunteerProfileRow = Tables<'volunteers'>;

/**
 * Row type alias for the `event_volunteers` table.
 */
export type EventVolunteerRow = Tables<'event_volunteers'>;

/**
 * Row type alias for the `news_articles` table.
 */
export type NewsArticleRow = Tables<'news_articles'>;

/**
 * Row type alias for the `success_stories` table (legacy).
 */
// export type SuccessStoryRow = Tables<'success_stories'>;

/**
 * Row type alias for the `gallery_albums` table.
 */
export type GalleryAlbumRow = Tables<'gallery_albums'>;

/**
 * Row type alias for the `gallery_items` table.
 */
export type GalleryItemRow = Tables<'gallery_items'>;

/**
 * Row type alias for the `media_files` table.
 */
export type MediaObjectRow = Tables<'media_files'>;

/**
 * Row type alias for the `donations` table.
 */
export type DonationRow = Tables<'donations'>;

/**
 * Row type alias for the `donation_campaigns` table.
 */
export type DonationCampaignRow = Tables<'donation_campaigns'>;

/**
 * Row type alias for the `donors` table (legacy).
 */
// export type DonorRow = Tables<'donors'>;

/**
 * Row type alias for the `contacts` table.
 */
export type ContactRow = Tables<'contacts'>;

/**
 * Row type alias for the `organizations` table.
 */
export type OrganizationRow = Tables<'organizations'>;

/**
 * Row type alias for the `enquiries` table.
 */
export type EnquiryRow = Tables<'enquiries'>;

/**
 * Row type alias for the `audit_logs` table (legacy).
 */
// export type AuditLogRow = Tables<'audit_logs'>;

/**
 * Row type alias for the `lookup_taxonomy` table (legacy).
 */
// export type LookupTaxonomyRow = Tables<'lookup_taxonomy'>;

/**
 * Row type alias for the `system_settings` table.
 */
export type SystemSettingRow = Tables<'system_settings'>;
