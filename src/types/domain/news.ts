import type {
  EventId,
  MediaId,
  NewsId,
  ProfileId,
  ProgramId,
  UserId,
} from '../branded';
import type { ArticleStatusEnum, VisibilityEnum } from '../enums';
import type { ISODate } from '../utilities';

/**
 * Represents a news article database entity.
 */
export interface NewsArticleEntity {
  id: string;
  article_code: string;
  slug: string;
  title: string;
  subtitle: string | null;
  content: string;
  summary: string | null;
  cover_image_id: string | null;
  author_profile_id: string | null;
  status: string;
  visibility: string;
  published_at: string | null;
  is_featured: boolean;
  view_count: number;
  metadata: Record<string, unknown>;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

/**
 * Represents a success story database entity.
 */
export interface SuccessStoryEntity {
  id: string;
  story_code: string;
  slug: string;
  title: string;
  subtitle: string | null;
  content: string;
  beneficiary_name: string | null;
  program_id: string | null;
  event_id: string | null;
  cover_image_id: string | null;
  status: string;
  visibility: string;
  published_at: string | null;
  is_featured: boolean;
  metadata: Record<string, unknown>;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

/**
 * Domain model representing a news article with branded identifiers and typed enums.
 */
export interface NewsArticle {
  id: NewsId;
  articleCode: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  content: string;
  summary?: string | null;
  coverImageId?: MediaId | null;
  authorProfileId?: ProfileId | null;
  status: ArticleStatusEnum;
  visibility: VisibilityEnum;
  publishedAt?: ISODate | null;
  isFeatured: boolean;
  viewCount: number;
  metadata: Record<string, unknown>;
  createdBy?: UserId | null;
  updatedBy?: UserId | null;
  createdAt: ISODate;
  updatedAt: ISODate;
  isDeleted: boolean;
}

/**
 * Domain model representing a success story with branded identifiers and typed enums.
 */
export interface SuccessStory {
  id: string;
  storyCode: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  content: string;
  beneficiaryName?: string | null;
  programId?: ProgramId | null;
  eventId?: EventId | null;
  coverImageId?: MediaId | null;
  status: ArticleStatusEnum;
  visibility: VisibilityEnum;
  publishedAt?: ISODate | null;
  isFeatured: boolean;
  metadata: Record<string, unknown>;
  createdBy?: UserId | null;
  updatedBy?: UserId | null;
  createdAt: ISODate;
  updatedAt: ISODate;
  isDeleted: boolean;
}

/**
 * View model formatted for presentation layers displaying news articles.
 */
export interface NewsArticleViewModel {
  id: string;
  articleCode: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  summary?: string | null;
  contentHtml: string;
  coverImageUrl?: string | null;
  authorName: string;
  authorAvatarUrl?: string | null;
  statusLabel: string;
  formattedPublishedAt?: string;
  readTimeMinutes: number;
  viewCount: number;
  isFeatured: boolean;
}

/**
 * View model formatted for presentation layers displaying success stories.
 */
export interface SuccessStoryViewModel {
  id: string;
  storyCode: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  contentHtml: string;
  beneficiaryName?: string | null;
  programTitle?: string | null;
  eventTitle?: string | null;
  coverImageUrl?: string | null;
  statusLabel: string;
  formattedPublishedAt?: string;
  isFeatured: boolean;
}

/**
 * Data Transfer Object for creating a new news article.
 */
export interface NewsArticleCreateDTO {
  title: string;
  subtitle?: string | null;
  content: string;
  summary?: string | null;
  coverImageId?: string | null;
  authorProfileId?: string | null;
  status?: ArticleStatusEnum;
  visibility?: VisibilityEnum;
  publishedAt?: string | null;
  isFeatured?: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Data Transfer Object for updating an existing news article.
 */
export interface NewsArticleUpdateDTO extends Partial<NewsArticleCreateDTO> {
  id: string;
}

/**
 * Data Transfer Object for creating a new success story.
 */
export interface SuccessStoryCreateDTO {
  title: string;
  subtitle?: string | null;
  content: string;
  beneficiaryName?: string | null;
  programId?: string | null;
  eventId?: string | null;
  coverImageId?: string | null;
  status?: ArticleStatusEnum;
  visibility?: VisibilityEnum;
  publishedAt?: string | null;
  isFeatured?: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Data Transfer Object for updating an existing success story.
 */
export interface SuccessStoryUpdateDTO extends Partial<SuccessStoryCreateDTO> {
  id: string;
}

/**
 * Data Transfer Object for filtering and searching news articles or success stories.
 */
export interface NewsFilterDTO {
  status?: string;
  isFeatured?: boolean;
  authorId?: string;
  q?: string;
}
