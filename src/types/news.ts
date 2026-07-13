import { IndexProgrammeSlug } from "./gallery";

export type NewsCategory =
  | "Daily Updates"
  | "Programme Activities"
  | "Announcements"
  | "Achievements"
  | "Community Stories"
  | "Media Coverage";

export type EventStatus =
  | "Registration Open"
  | "Coming Soon"
  | "Registration Closing Soon"
  | "Registration Closed"
  | "Completed"
  | "Cancelled";

export interface AnnouncementItem {
  id: string;
  text: string;
  linkUrl?: string;
  priority: "high" | "normal";
  publishedAt: string;
  expiresAt?: string;
}

export interface UpcomingEventItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  programmeSlug?: IndexProgrammeSlug;
  description: string;
  imageUrl: string;
  location: string;
  eventDate: string; // e.g. "20 July 2026"
  dayMonthBadge: { day: string; month: string };
  startTime: string; // e.g. "7:00 AM"
  endTime?: string;
  registrationStatus: EventStatus;
  registrationDeadline?: string;
  registrationUrl?: string;
}

export interface NewsPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  category: NewsCategory;
  programmeSlug?: IndexProgrammeSlug;
  programmeTitle?: string;
  location: string;
  activityDate: string; // e.g. "12 July 2026"
  activityTime?: string;
  publishedAt: string;
  readingTime: string; // e.g. "3 min read"
  author: string;
  isFeatured?: boolean;
  viewCount?: number;
}

export interface ProgrammeUpdateSummary {
  programmeSlug: IndexProgrammeSlug;
  programmeTitle: string;
  iconName: string;
  coverImageUrl: string;
  publishedUpdatesCount: number;
  latestUpdateTitle: string;
  latestActivityDate: string;
}

export interface ImpactStoryItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  personName: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  programmeSlug?: IndexProgrammeSlug;
  programmeTitle?: string;
  location: string;
  publishedAt: string;
  isFeatured?: boolean;
}

export interface PodcastGuest {
  id: string;
  fullName: string;
  profilePhotoUrl: string;
  role: string;
  achievement: string;
  biography?: string;
  socialImpact?: string;
  udbhavContribution?: string;
}

export interface PodcastEpisodeItem {
  id: string;
  episodeNumber: string; // e.g. "EPISODE 01"
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  thumbnailUrl: string;
  guest: PodcastGuest;
  duration: string; // e.g. "42:15"
  releaseDate: string;
  /** Separate direct YouTube video URL for this episode */
  youtubeUrl?: string;
  /** @deprecated Spotify URL is deprecated as podcast is YouTube-only */
  spotifyUrl?: string;
  /** @deprecated Apple Podcast URL is deprecated as podcast is YouTube-only */
  applePodcastUrl?: string;
  topics: string[];
  isFeatured?: boolean;
}
