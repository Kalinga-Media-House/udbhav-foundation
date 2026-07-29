import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database/database.generated';

type EmailLogInsert = Database['public']['Tables']['email_logs']['Insert'];
type EmailLogRow = Database['public']['Tables']['email_logs']['Row'];
type EmailLogUpdate = Database['public']['Tables']['email_logs']['Update'];

export const EmailLogRepository = {
  async createLog(log: EmailLogInsert): Promise<EmailLogRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('email_logs')
      .insert(log)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateLog(id: string, updates: EmailLogUpdate): Promise<EmailLogRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('email_logs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
  
  async getFailedLogs(): Promise<EmailLogRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('email_logs')
      .select('*')
      .eq('status', 'failed');

    if (error) throw error;
    return data;
  }
};
