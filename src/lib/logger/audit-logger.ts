import { serverLogger } from './server-logger';

/**
 * Audit Logger.
 * Responsible for recording business-critical actions (e.g. user creation, money transfer).
 * In the future, this should insert directly into an `audit_logs` Supabase table.
 */
export const auditLogger = {
  logAction: (userId: string, action: string, resource: string, details?: Record<string, unknown>) => {
    // Fire-and-forget DB insertion goes here eventually.
    serverLogger.info(`[AUDIT] ${action} on ${resource} by ${userId}`, details);
  }
};
