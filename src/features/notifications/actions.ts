'use server';

import type { Pagination, ID } from '@/types';

import { notificationsService } from './service';

export async function listUserNotificationsAction(pagination: Pagination, filterUnread: boolean = false) {
  return await notificationsService.listUserNotifications(pagination, filterUnread);
}

export async function markNotificationAsReadAction(notificationId: ID) {
  return await notificationsService.markAsRead(notificationId);
}

export async function markAllNotificationsAsReadAction() {
  return await notificationsService.markAllAsRead();
}
