/**
 * @file index-programme.ts
 * @description Domain and view model types for public website programme displays and ADHYAYA flagship data.
 */

export type ProgrammeCategory = "All" | "Education" | "Environment" | "Health" | "Community" | "Flagship" | string;

export interface IndexProgrammeStat {
  id: string;
  label: string;
  value: string;
}

export interface IndexProgrammeDetail {
  id: string;
  programmeNumber: string;
  title: string;
  tagline: string;
  category: string;
  slug: string;
  partnerText?: string;
  shortDescription: string;
  fullDescription: string;
  coverImageUrl: string;
  accentColor: string;
  programDate?: string;
  location?: string;
  impactPreview: string;
  impactStats: IndexProgrammeStat[];
  purpose: string;
  communityNeed: string;
  approach: string;
  targetBeneficiaries: string[];
  majorActivities: string[];
  photoCount: number;
  eventCount: number;
}

export interface AdhyayaFlagshipData {
  badge: string;
  title: string;
  subtitle: string;
  slug: string;
  description: string;
  coverImageUrl: string;
  secondaryImageUrls: string[];
  ctaText: string;
  ctaHref: string;
}

export interface ProgrammeEventItem {
  id: string;
  programmeId: string;
  programmeSlug: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  coverImageUrl: string;
  location: string;
  venue: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  status: string;
  photoCount: number;
}

export interface ProgrammePhotoItem {
  id: string;
  programmeId: string;
  programmeSlug: string;
  eventId?: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  location: string;
  photoDate: string;
  photoTime: string;
  photographerName?: string;
  altText: string;
  isFeatured?: boolean;
}
