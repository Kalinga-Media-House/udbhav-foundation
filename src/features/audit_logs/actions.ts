'use server';

import type { Pagination } from '@/types';

import { auditLogsService } from './service';

export async function listAuditLogsAction(pagination: Pagination, filters?: Record<string, unknown>) {
  return await auditLogsService.listLogs(pagination, filters);
}
