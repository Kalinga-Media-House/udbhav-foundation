import { serverLogger } from './server-logger';

/**
 * Security Logger.
 * Records failed logins, RLS violations, CSRF failures, etc.
 */
export const securityLogger = {
  logViolation: (type: 'AUTH_FAILURE' | 'RLS_VIOLATION' | 'RATE_LIMIT', ip: string, details?: Record<string, unknown>) => {
    // These should ideally trigger Datadog/Sentry alerts
    serverLogger.warn(`[SECURITY] ${type} from IP: ${ip}`, details);
  }
};
