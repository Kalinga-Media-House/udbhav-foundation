'use server';

import {
  handleAction,
  requireAuth,
  requirePermission,
  type ActionResult,
} from '@/contracts/actions';
import type { PaginatedResult } from '@/contracts/repositories';
import type { Pagination } from '@/types';

import type { ActivityLogRow } from './repository';
import { auditLogsService } from './service';

export async function listAuditLogsAction(
  pagination: Pagination,
  filters?: Record<string, unknown>
): Promise<ActionResult<PaginatedResult<ActivityLogRow>>> {
  return handleAction('listAuditLogs', async () => {
    const session = await requireAuth();
    // Audit logs usually require system.read or admin
    requirePermission(session, 'audit.read');

    // We unwrap the ServiceResult here since handleAction handles it
    const res = await auditLogsService.listLogs(pagination, filters);
    if (!res.success) throw new Error(res.error || 'Failed to fetch audit logs');
    return res.data!;
  });
}
