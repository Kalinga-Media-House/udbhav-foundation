'use server';

import { requireAuth } from '@/contracts/actions';

import { EmailLogRepository } from './email/repository';
import { NotificationRepository } from './notifications/repository';
import { QueueWorker } from './queue/worker';

/**
 * Triggered by a cron job or manual admin action to process the queue.
 * In a real-world scenario, this would loop until no jobs are left or a time limit is reached.
 */
export async function processQueue() {
  await requireAuth();
  
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
  await requireAuth();
  return EmailLogRepository.getFailedLogs();
}

export async function getUnreadNotifications() {
  const session = await requireAuth();
  return NotificationRepository.getUnreadNotificationsForUser(session.id);
}

export async function markNotificationAsRead(notificationId: string) {
  const session = await requireAuth();
  await NotificationRepository.markAsRead(notificationId, session.id);
  return { success: true };
}

export async function markAllNotificationsAsRead() {
  const session = await requireAuth();
  await NotificationRepository.markAllAsRead(session.id);
  return { success: true };
}
