import { fail, fromRepo } from '@/contracts/services';
import type { ServiceResult } from '@/contracts/services';
import { serverLogger } from '@/lib/logger/server-logger';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Pagination, ID } from '@/types';

import { NotificationsRepository } from './repository';

export class NotificationsService {
  async listUserNotifications(pagination: Pagination, filterUnread: boolean = false): Promise<ServiceResult<any[]>> {
    try {
      const supabase = await createServerSupabaseClient() as any;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return fail('Unauthorized');

      const repo = new NotificationsRepository(supabase);
      return fromRepo(await repo.listNotifications(user.id, pagination, filterUnread));
    } catch (e: any) {
      serverLogger.error('NotificationsService.listUserNotifications', e);
      return fail('Internal server error');
    }
  }

  async markAsRead(notificationId: ID): Promise<ServiceResult<boolean>> {
    try {
      const supabase = await createServerSupabaseClient() as any;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return fail('Unauthorized');

      const repo = new NotificationsRepository(supabase);
      return fromRepo(await repo.markAsRead(notificationId, user.id));
    } catch (e: any) {
      serverLogger.error('NotificationsService.markAsRead', e);
      return fail('Internal server error');
    }
  }

  async markAllAsRead(): Promise<ServiceResult<boolean>> {
    try {
      const supabase = await createServerSupabaseClient() as any;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return fail('Unauthorized');

      const repo = new NotificationsRepository(supabase);
      return fromRepo(await repo.markAllAsRead(user.id));
    } catch (e: any) {
      serverLogger.error('NotificationsService.markAllAsRead', e);
      return fail('Internal server error');
    }
  }
}

export const notificationsService = new NotificationsService();
