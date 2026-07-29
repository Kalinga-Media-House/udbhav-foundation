import type { PaginatedResult } from '@/contracts/repositories';
import { ok, fail } from '@/contracts/services';
import type { ServiceResult } from '@/contracts/services';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Pagination } from '@/types';

import { auditLogsRepository, type ActivityLogRow } from './repository';

export class AuditLogsService {
  async listLogs(pagination: Pagination, filters?: Record<string, unknown>): Promise<ServiceResult<PaginatedResult<ActivityLogRow>>> {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return fail('Unauthorized');
    }
    
    // RBAC check: Must be admin
    const { data: roleData } = await (supabase as any).from('user_roles').select('role').eq('user_id', user.id).single();
    if (roleData?.role !== 'admin' && roleData?.role !== 'superadmin' && roleData?.role !== 'super_admin') {
      return fail('Forbidden: Admin access required');
    }

    const result = await auditLogsRepository.listLogs({ pagination, filters });
    return ok(result);
  }
}

export const auditLogsService = new AuditLogsService();
