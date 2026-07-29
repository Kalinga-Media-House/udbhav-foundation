import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database/database.generated';

type NotificationInsert = Database['public']['Tables']['notifications']['Insert'];
type NotificationRow = Database['public']['Tables']['notifications']['Row'];

export const NotificationRepository = {
  async createNotification(notification: NotificationInsert): Promise<NotificationRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUnreadNotificationsForUser(userId: string): Promise<NotificationRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('recipient_id', userId)
      .is('read_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('notifications')
      .update({ status: 'read', read_at: new Date().toISOString() })
      .eq('id', notificationId)
      .eq('recipient_id', userId);

    if (error) throw error;
  },

  async markAllAsRead(userId: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('notifications')
      .update({ status: 'read', read_at: new Date().toISOString() })
      .eq('recipient_id', userId)
      .is('read_at', null);

    if (error) throw error;
  }
};
