/**
 * @file news.ts
 * @description Re-export of domain news types and view model types for news and story displays.
 */

export * from './domain/news';

export type NewsCategory = "All" | "Achievements" | "Announcements" | "Programme Activities" | "Community Stories" | "Daily Updates" | string;
export type EventStatus = "All" | "Upcoming" | "Registration Open" | "Completed" | "Coming Soon" | string;

export interface AnnouncementItem {
  id: string;
  text: string;
  linkUrl: string;
  priority: 'high' | 'normal' | 'low' | string;
  publishedAt: string;
}

export interface UpcomingEventItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  programmeSlug?: string;
  description: string;
  imageUrl: string;
  location: string;
  eventDate: string;
  dayMonthBadge: { day: string; month: string };
  startTime?: string;
  endTime?: string;
  registrationStatus: string;
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
  category: string;
  programmeSlug?: string;
  programmeTitle?: string;
  location: string;
  activityDate: string;
  activityTime: string;
  publishedAt: string;
  readingTime: string;
  author: string;
  isFeatured?: boolean;
}

export interface ProgrammeUpdateSummary {
  programmeSlug: string;
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
  programmeSlug?: string;
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
  episodeNumber: string;
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  thumbnailUrl: string;
  guest: PodcastGuest;
  duration: string;
  releaseDate: string;
  youtubeUrl: string;
  topics: string[];
  isFeatured?: boolean;
}
