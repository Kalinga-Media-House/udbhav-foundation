import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database/database.generated';

type AuditLogInsert = Database['public']['Tables']['automation_audit_logs']['Insert'];
type AuditLogRow = Database['public']['Tables']['automation_audit_logs']['Row'];
type AuditLogUpdate = Database['public']['Tables']['automation_audit_logs']['Update'];

export const AutomationAuditRepository = {
  async createLog(log: AuditLogInsert): Promise<AuditLogRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('automation_audit_logs')
      .insert(log)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateLog(id: string, updates: AuditLogUpdate): Promise<AuditLogRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('automation_audit_logs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
