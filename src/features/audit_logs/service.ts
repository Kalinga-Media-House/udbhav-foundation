import type { PaginatedResult } from '@/contracts/repositories';
import { ok, fail } from '@/contracts/services';
import type { ServiceResult } from '@/contracts/services';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Pagination } from '@/types';

import { auditLogsRepository, type ActivityLogRow } from './repository';

export class AuditLogsService {
  async listLogs(
    pagination: Pagination,
    filters?: Record<string, unknown>
  ): Promise<ServiceResult<PaginatedResult<ActivityLogRow>>> {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return fail('Unauthorized');
    }

    // RBAC check: Must be admin
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('is_active, roles(slug)')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .limit(1)
      .single<{ is_active: boolean; roles: { slug: string } }>();
    const roleSlug = roleData?.roles?.slug;
    if (roleSlug !== 'super-admin' && roleSlug !== 'admin') {
      return fail('Forbidden: Admin access required');
    }

    const result = await auditLogsRepository.listLogs({ pagination, filters });
    return ok(result);
  }
}

export const auditLogsService = new AuditLogsService();
