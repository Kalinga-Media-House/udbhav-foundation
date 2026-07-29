/**
 * @file index.ts
 * @description Central export module for all database-related type definitions, schemas, tables, views, functions, and storage structures.
 */

export type { Json, Database } from './database.generated';
export type {
  Tables,
  TablesInsert,
  TablesUpdate,
  Enums,
} from './database';
export type {
  ProfileRow,
  ProgramRow,
  EventRow,
  VolunteerProfileRow,
  EventVolunteerRow,
  NewsArticleRow,
  GalleryAlbumRow,
  GalleryItemRow,
  MediaObjectRow,
  DonationRow,
  DonationCampaignRow,
  ContactRow,
  EnquiryRow,
  SystemSettingRow,
} from './tables';
export type {
  ActiveProgramsView,
  VolunteerSummaryView,
} from './views';
export type {
  ActiveCampaignsRpcArgs,
  AdminDashboardOverviewRpcReturn,
  VolunteerDashboardOverviewRpcArgs,
  DonorDashboardOverviewRpcArgs,
} from './functions';
export type {
  StorageBucket,
  StorageObject,
} from './storage';
