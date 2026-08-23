/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { handleAction, requireAuth, type ActionResult } from '@/contracts/actions';
import type { Pagination, ID } from '@/types';

import { notificationsService } from './service';

export async function listUserNotificationsAction(pagination: Pagination, filterUnread: boolean = false): Promise<ActionResult<any[]>> {
  return handleAction('listUserNotifications', async () => {
    const session = await requireAuth();
    const res = await notificationsService.listUserNotifications(session.id, pagination, filterUnread);
    if (!res.success) throw new Error(res.error || 'Failed');
    return res.data!;
  });
}

export async function markNotificationAsReadAction(notificationId: ID): Promise<ActionResult<boolean>> {
  return handleAction('markNotificationAsRead', async () => {
    const session = await requireAuth();
    const res = await notificationsService.markAsRead(notificationId, session.id);
    if (!res.success) throw new Error(res.error || 'Failed');
    return res.data!;
  });
}

export async function markAllNotificationsAsReadAction(): Promise<ActionResult<boolean>> {
  return handleAction('markAllNotificationsAsRead', async () => {
    const session = await requireAuth();
    const res = await notificationsService.markAllAsRead(session.id);
    if (!res.success) throw new Error(res.error || 'Failed');
    return res.data!;
  });
}
