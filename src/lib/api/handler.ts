import { NextRequest, NextResponse } from 'next/server';

import { AppError, InternalServerError } from '@/errors';
import { serverLogger } from '@/lib/logger/server-logger';

export type RouteHandler = (
  req: NextRequest,
  context: { params: Record<string, string | string[]> }
) => Promise<NextResponse> | NextResponse;

/**
 * Global Error Handler Wrapper for Next.js Route Handlers (App Router).
 * Ensures that all uncaught exceptions are mapped to the Standard API Response format.
 */
export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest, context: { params: Record<string, string | string[]> }) => {
    try {
      return await handler(req, context);
    } catch (error) {
      if (error instanceof AppError) {
        // Operational errors (e.g. Validation, NotFound, etc.)
        if (!error.isOperational) {
          serverLogger.error(`[Non-Operational] ${error.name}: ${error.message}`, error, { path: req.nextUrl.pathname });
        } else {
          serverLogger.info(`[Operational] ${error.name}: ${error.message}`, { path: req.nextUrl.pathname, code: error.code });
        }
        
        const serialized = error.serialize();
        return NextResponse.json(
          {
            success: serialized.success,
            message: serialized.message,
            errors: serialized.errors,
          },
          { status: error.statusCode }
        );
      }

      // Unhandled / Unknown errors
      const internalError = new InternalServerError('An unexpected error occurred');
      serverLogger.error(`[Unhandled Exception] ${error instanceof Error ? error.message : String(error)}`, error instanceof Error ? error : undefined, { path: req.nextUrl.pathname });

      const serialized = internalError.serialize();
      return NextResponse.json(
        {
          success: serialized.success,
          message: serialized.message,
          errors: serialized.errors,
        },
        { status: internalError.statusCode }
      );
    }
  };
}
