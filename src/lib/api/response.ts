import { NextResponse } from 'next/server';

import type { ApiResponse } from '@/types/api';

/**
 * Reusable HTTP Response Helpers
 * These ensure all Next.js API Routes return a standardized JSON structure.
 */

export const apiResponse = {
  success: <T>(data?: T, message = 'Success', meta?: Record<string, unknown>) => {
    return NextResponse.json(
      { success: true, message, data, meta } satisfies ApiResponse<T>,
      { status: 200 }
    );
  },

  created: <T>(data?: T, message = 'Created') => {
    return NextResponse.json(
      { success: true, message, data } satisfies ApiResponse<T>,
      { status: 201 }
    );
  },

  noContent: () => {
    return new NextResponse(null, { status: 204 });
  },

  badRequest: (message = 'Bad Request', errors?: unknown) => {
    return NextResponse.json(
      { success: false, message, errors } satisfies ApiResponse,
      { status: 400 }
    );
  },

  unauthorized: (message = 'Unauthorized') => {
    return NextResponse.json(
      { success: false, message } satisfies ApiResponse,
      { status: 401 }
    );
  },

  forbidden: (message = 'Forbidden') => {
    return NextResponse.json(
      { success: false, message } satisfies ApiResponse,
      { status: 403 }
    );
  },

  notFound: (message = 'Not Found') => {
    return NextResponse.json(
      { success: false, message } satisfies ApiResponse,
      { status: 404 }
    );
  },

  conflict: (message = 'Conflict', errors?: unknown) => {
    return NextResponse.json(
      { success: false, message, errors } satisfies ApiResponse,
      { status: 409 }
    );
  },

  validationError: (errors: unknown, message = 'Validation Failed') => {
    return NextResponse.json(
      { success: false, message, errors } satisfies ApiResponse,
      { status: 422 }
    );
  },

  internalServerError: (message = 'Internal Server Error', errors?: unknown) => {
    return NextResponse.json(
      { success: false, message, errors } satisfies ApiResponse,
      { status: 500 }
    );
  },
};
