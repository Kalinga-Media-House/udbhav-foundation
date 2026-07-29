import type { PaginatedResult, FilterMap } from '@/contracts/repositories';
import { DatabaseError } from '@/errors';
import { serverLogger } from "@/lib/logger/server-logger";
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Pagination } from '@/types';
import type { Database } from '@/types/database/database.generated';

export type ActivitySeverity = 'info' | 'success' | 'warning' | 'error' | 'critical';
export type ActivityCategory = 'Authentication' | 'Authorization' | 'Users' | 'Programs' | 'Events' | 'Gallery' | 'News' | 'Volunteers' | 'Donations' | 'Settings' | 'Media' | 'System';

export type ActivityLogRow = Database['public']['Tables']['activity_logs']['Row'];

export class AuditLogsRepository {
  async listLogs(params: { pagination: Pagination; filters?: FilterMap }): Promise<PaginatedResult<ActivityLogRow>> {
    const { pagination, filters } = params;
    const supabase = await createServerSupabaseClient();
    let query = supabase.from('activity_logs').select('*', { count: 'exact' });

    if (filters?.actor_id) query = query.eq('actor_id', filters.actor_id as string);
    if (filters?.module) query = query.eq('module', filters.module as string);
    if (filters?.entity_type) query = query.eq('entity_type', filters.entity_type as string);
    if (filters?.entity_id) query = query.eq('entity_id', filters.entity_id as string);
    if (filters?.category) query = query.eq('category', filters.category as any);
    if (filters?.severity) query = query.eq('severity', filters.severity as any);

    query = query.order('created_at', { ascending: false });

    const from = (pagination.page - 1) * pagination.limit;
    query = query.range(from, from + pagination.limit - 1);

    const { data, count, error } = await query;
    if (error) {
      serverLogger.error('AuditLogsRepository.listLogs failed', new DatabaseError(error.message));
    }

    return { 
      data: data ?? [], 
      total: count ?? 0, 
      page: pagination.page, 
      limit: pagination.limit 
    };
  }
}

export const auditLogsRepository = new AuditLogsRepository();
