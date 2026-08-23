/* eslint-disable @typescript-eslint/no-explicit-any */
import { fail, fromRepo } from '@/contracts/services';
import type { ServiceResult } from '@/contracts/services';
import { serverLogger } from '@/lib/logger/server-logger';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Pagination, ID } from '@/types';

import { NotificationsRepository } from './repository';

export class NotificationsService {
  async listUserNotifications(userId: ID, pagination: Pagination, filterUnread: boolean = false): Promise<ServiceResult<any[]>> {
    try {
      const supabase = await createServerSupabaseClient() as any;
      const repo = new NotificationsRepository(supabase);
      return fromRepo(await repo.listNotifications(userId, pagination, filterUnread));
    } catch (e: any) {
      serverLogger.error('NotificationsService.listUserNotifications', e);
      return fail('Internal server error');
    }
  }

  async markAsRead(notificationId: ID, userId: ID): Promise<ServiceResult<boolean>> {
    try {
      const supabase = await createServerSupabaseClient() as any;
      const repo = new NotificationsRepository(supabase);
      return fromRepo(await repo.markAsRead(notificationId, userId));
    } catch (e: any) {
      serverLogger.error('NotificationsService.markAsRead', e);
      return fail('Internal server error');
    }
  }

  async markAllAsRead(userId: ID): Promise<ServiceResult<boolean>> {
    try {
      const supabase = await createServerSupabaseClient() as any;
      const repo = new NotificationsRepository(supabase);
      return fromRepo(await repo.markAllAsRead(userId));
    } catch (e: any) {
      serverLogger.error('NotificationsService.markAllAsRead', e);
      return fail('Internal server error');
    }
  }
}

export const notificationsService = new NotificationsService();
