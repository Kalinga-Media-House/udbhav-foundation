# Error Handling & Logging Framework

This directory contains the universal `AppError` hierarchy and integrates with the logging system.

## Error Hierarchy

All custom application errors extend the base `AppError` class.

**Available Errors:**
- `ValidationError` (400) - For invalid data/input.
- `AuthenticationError` (401) - For unauthenticated requests (missing/invalid tokens).
- `AuthorizationError` (403) - For authenticated users lacking permissions.
- `NotFoundError` (404) - For missing resources (DB records, routes).
- `ConflictError` (409) - For duplicate states (e.g., email already exists).
- `RateLimitError` (429) - For excessive requests.
- `ExternalServiceError` (502) - For failing third-party integrations.
- `InternalServerError` (500) - For generic/unknown server failures.
- `DatabaseError`, `StorageError`, `ConfigurationError` (500) - System failures (not safe to expose details to clients).

## When to throw `AppError`

- **Services and Repositories**: Throw specific `AppError` instances (e.g., `NotFoundError`) instead of returning null or generic errors.
- **Route Handlers**: Use the `withErrorHandler` wrapper (from `src/lib/api/handler.ts`) to automatically catch these errors and serialize them into the standard API Response format (`ApiResponse`).

```typescript
import { NotFoundError } from '@/errors';

async function getUser(id: string) {
  const user = await db.query(...);
  if (!user) throw new NotFoundError('User not found');
  return user;
}
```

## Logging Conventions

Import from `src/lib/logger/client-logger.ts` or `src/lib/logger/server-logger.ts` depending on your environment.

- **`debug`**: For local development tracing (silenced in production).
- **`info`**: For tracking standard operational flow (e.g., "User logged in", "Job completed").
- **`warn`**: For unexpected but recoverable states.
- **`error`**: For failing operations. Always pass the actual `Error` object as the second argument.

```typescript
import { serverLogger } from '@/lib/logger/server-logger';

serverLogger.info('Processing payment', { userId: '123' });
serverLogger.error('Payment failed', err, { userId: '123' });
```
