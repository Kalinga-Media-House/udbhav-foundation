import { LogLevel, LogPayload } from './logger';

/**
 * Client-side logger.
 * Strips verbose logs in production to save bandwidth and console noise.
 */
class ClientLogger {
  private log(level: LogLevel, payload: LogPayload) {
    const isProd = process.env.NODE_ENV === 'production';
    
    // Silence info/debug in production
    if (isProd && (level === 'info' || level === 'debug')) {
      return;
    }

    // eslint-disable-next-line no-console
    const consoleMethod = console[level] || console.log;
    
    if (payload.error) {
      consoleMethod(`[${level.toUpperCase()}] ${payload.message}`, payload.context || '', payload.error);
    } else {
      consoleMethod(`[${level.toUpperCase()}] ${payload.message}`, payload.context || '');
    }
  }

  info(message: string, context?: Record<string, unknown>) { this.log('info', { message, context }); }
  warn(message: string, context?: Record<string, unknown>) { this.log('warn', { message, context }); }
  error(message: string, error?: Error, context?: Record<string, unknown>) { this.log('error', { message, error, context }); }
  debug(message: string, context?: Record<string, unknown>) { this.log('debug', { message, context }); }
}

export const clientLogger = new ClientLogger();
