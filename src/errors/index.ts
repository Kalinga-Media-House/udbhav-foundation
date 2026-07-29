/**
 * Base application error that all custom errors extend.
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(message: string, code = 'APP_ERROR', statusCode = 500, isOperational = true, details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Serializes the error for safe public consumption according to Phase 1.4 standards.
   * Strips stack traces and internal messaging for non-operational errors.
   */
  public serialize() {
    return {
      success: false as const,
      message: this.isOperational ? this.message : 'An internal server error occurred.',
      errors: this.isOperational ? this.details : undefined,
    };
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, true, details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 'UNAUTHENTICATED', 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 'UNAUTHORIZED', 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 'NOT_FOUND', 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict', details?: unknown) {
    super(message, 'CONFLICT', 409, true, details);
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, 'RATE_LIMIT_EXCEEDED', 429);
  }
}

export class ExternalServiceError extends AppError {
  constructor(message = 'External service failed', details?: unknown) {
    super(message, 'EXTERNAL_SERVICE_ERROR', 502, true, details);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal server error', details?: unknown) {
    super(message, 'INTERNAL_SERVER_ERROR', 500, false, details);
  }
}

export class DatabaseError extends AppError {
  constructor(message = 'Database operation failed', details?: unknown) {
    // Database errors are rarely safe to expose to the client.
    super(message, 'DATABASE_ERROR', 500, false, details);
  }
}

export class StorageError extends AppError {
  constructor(message = 'Storage operation failed', details?: unknown) {
    super(message, 'STORAGE_ERROR', 500, false, details);
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Network request failed', details?: unknown) {
    super(message, 'NETWORK_ERROR', 502, true, details);
  }
}

export class ConfigurationError extends AppError {
  constructor(message: string) {
    // Immediate fatal error, usually on boot.
    super(message, 'CONFIGURATION_ERROR', 500, false);
  }
}
