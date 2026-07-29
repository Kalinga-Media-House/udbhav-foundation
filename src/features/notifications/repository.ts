import { SupabaseClient } from '@supabase/supabase-js';

import type { ID } from '@/types';

export class NotificationsRepository {
  constructor(private supabase: SupabaseClient) {}

  async listNotifications(userId: ID, pagination: any, filterUnread: boolean = false): Promise<any> {
    try {
      let query = this.supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('recipient_id', userId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (filterUnread) {
        query = query.is('read_at', null);
      }

      if (pagination.limit) {
        query = query.limit(pagination.limit);
      }
      if (pagination.offset !== undefined) {
        query = query.range(pagination.offset, pagination.offset + (pagination.limit || 15) - 1);
      }

      const { data, error, count } = await query;
      if (error) return { data: null, error: error.message };
      return { data, error: null, metadata: { totalCount: count || 0 } };
    } catch (e: any) {
      return { data: null, error: e.message };
    }
  }

  async markAsRead(notificationId: ID, userId: ID): Promise<any> {
    try {
      const { error } = await this.supabase
        .from('notifications')
        .update({ status: 'read', read_at: new Date().toISOString() })
        .eq('id', notificationId)
        .eq('recipient_id', userId);

      if (error) return { data: null, error: error.message };
      return { data: true, error: null };
    } catch (e: any) {
      return { data: null, error: e.message };
    }
  }

  async markAllAsRead(_userId: ID): Promise<any> {
    try {
      const { error } = await this.supabase.rpc('mark_all_read');
      if (error) return { data: null, error: error.message };
      return { data: true, error: null };
    } catch (e: any) {
      return { data: null, error: e.message };
    }
  }
}
