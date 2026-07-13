export type ProgrammeCategory =
  | "Education"
  | "Environment"
  | "Health & Well-being"
  | "Awareness & Safety"
  | "Community Support";

export interface ProgrammeImpactStat {
  id: string;
  label: string;
  value: string;
  iconName?: string;
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
  photoTime?: string;
  photographerName?: string;
  altText: string;
  isFeatured?: boolean;
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
  venue?: string;
  eventDate: string;
  startTime?: string;
  endTime?: string;
  status: "upcoming" | "completed";
  photoCount: number;
}

export interface IndexProgrammeDetail {
  id: string;
  programmeNumber: string; // e.g., "01", "02", ...
  title: string;
  tagline: string;
  slug: string;
  category: ProgrammeCategory;
  shortDescription: string;
  fullDescription: string;
  coverImageUrl: string;
  accentColor?: string;
  partnerText?: string;
  impactPreview: string; // e.g., "30 Students Supported Annually"
  impactStats: ProgrammeImpactStat[];
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
