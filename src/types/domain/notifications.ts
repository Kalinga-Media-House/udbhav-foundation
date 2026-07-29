/**
 * @file Notification domain type definitions.
 * @module types/domain/notifications
 */

import type { NotificationId, ProfileId } from '../branded';
import type { NotificationTypeEnum } from '../enums';
import type { ISODate } from '../utilities';

/**
 * Raw database entity representing a notification sent to a profile.
 */
export interface NotificationEntity {
  id: string;
  recipient_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  read_at: string | null;
  action_url: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

/**
 * Domain model representing a notification with branded identifiers and typed enums.
 */
export interface Notification {
  id: NotificationId;
  recipientId: ProfileId;
  type: NotificationTypeEnum;
  title: string;
  message: string;
  isRead: boolean;
  readAt?: ISODate | null;
  actionUrl?: string | null;
  metadata: Record<string, unknown>;
  createdAt: ISODate;
}

/**
 * ViewModel for displaying notifications in the UI.
 */
export interface NotificationViewModel {
  id: string;
  typeLabel: string;
  title: string;
  message: string;
  isRead: boolean;
  formattedReadAt?: string | null;
  actionUrl?: string | null;
  formattedCreatedAt: string;
  timeAgo: string;
}

/**
 * Data Transfer Object for creating a new notification.
 */
export interface NotificationCreateDTO {
  recipientId: string;
  type: NotificationTypeEnum;
  title: string;
  message: string;
  actionUrl?: string | null;
  metadata?: Record<string, unknown>;
}

/**
 * Filter options for querying notifications.
 */
export interface NotificationFilterDTO {
  isRead?: boolean;
  type?: string;
}
