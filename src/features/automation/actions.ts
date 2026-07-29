'use server';

import { requireAuth } from '@/lib/api/handler';

import { EmailLogRepository } from './email/repository';
import { NotificationRepository } from './notifications/repository';
import { QueueWorker } from './queue/worker';

/**
 * Triggered by a cron job or manual admin action to process the queue.
 * In a real-world scenario, this would loop until no jobs are left or a time limit is reached.
 */
export async function processQueue() {
  await requireAuth(['admin', 'super-admin']);
  
  let processed = 0;
  let hasMore = true;
  
  while (hasMore && processed < 10) { // Limit to 10 per invocation to avoid timeouts
    hasMore = await QueueWorker.processNextJob();
    if (hasMore) {
      processed++;
    }
  }

  return { processed };
}

export async function getFailedEmails() {
  await requireAuth(['admin', 'super-admin']);
  return EmailLogRepository.getFailedLogs();
}

export async function getUnreadNotifications() {
  const { user } = await requireAuth();
  return NotificationRepository.getUnreadNotificationsForUser(user.id);
}

export async function markNotificationAsRead(notificationId: string) {
  const { user } = await requireAuth();
  await NotificationRepository.markAsRead(notificationId, user.id);
  return { success: true };
}

export async function markAllNotificationsAsRead() {
  const { user } = await requireAuth();
  await NotificationRepository.markAllAsRead(user.id);
  return { success: true };
}
