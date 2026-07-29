/**
 * Shared logger utility types.
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogPayload {
  message: string;
  context?: Record<string, unknown>;
  error?: Error;
}

/**
 * Strips PII and sensitive data before logging.
 */
export const maskSensitiveData = (data: Record<string, unknown>): Record<string, unknown> => {
  const masked = { ...data };
  const sensitiveKeys = ['password', 'token', 'secret', 'key', 'credit_card'];
  
  Object.keys(masked).forEach((key) => {
    if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
      masked[key] = '[REDACTED]';
    } else if (typeof masked[key] === 'object' && masked[key] !== null) {
      masked[key] = maskSensitiveData(masked[key] as Record<string, unknown>);
    }
  });
  
  return masked;
};
