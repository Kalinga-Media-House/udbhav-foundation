import { env } from '@/config/env'; // Need to import carefully in actual app.

import { LogLevel, LogPayload, maskSensitiveData } from './logger';

/**
 * Server-side structured logger. 
 * Formats logs as JSON for Vercel/Datadog ingestion.
 */
class ServerLogger {
  private log(level: LogLevel, payload: LogPayload) {
    // In test environments, suppress logs unless strictly needed
    if (env.NODE_ENV === 'test' && level !== 'error') return;

    const formattedLog = {
      timestamp: new Date().toISOString(),
      level,
      message: payload.message,
      context: payload.context ? maskSensitiveData(payload.context) : undefined,
      error: payload.error ? {
        name: payload.error.name,
        message: payload.error.message,
        stack: env.NODE_ENV === 'development' ? payload.error.stack : undefined,
      } : undefined,
    };

    // Use standard stdout/stderr for serverless platforms
    if (level === 'error') {
      // eslint-disable-next-line no-console
      console.error(JSON.stringify(formattedLog));
    } else if (level === 'warn') {
      // eslint-disable-next-line no-console
      console.warn(JSON.stringify(formattedLog));
    } else {
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(formattedLog));
    }
  }

  info(message: string, context?: Record<string, unknown>) { this.log('info', { message, context }); }
  warn(message: string, context?: Record<string, unknown>) { this.log('warn', { message, context }); }
  error(message: string, error?: Error, context?: Record<string, unknown>) { this.log('error', { message, error, context }); }
  debug(message: string, context?: Record<string, unknown>) { 
    if (env.NODE_ENV === 'development') this.log('debug', { message, context }); 
  }
}

export const serverLogger = new ServerLogger();
