# Validation Foundation

This directory establishes the universal validation rules for the application using [Zod](https://zod.dev/).

## Conventions

- **File Naming:** Core schemas are exported from `index.ts`. Reusable helpers are in `helpers.ts`.
- **Export Naming:** Suffix all validation schemas with `Validator` (e.g., `emailValidator`, `uuidValidator`).
- **Composition:** Combine core validators using `z.object()` for specific use cases (e.g., `paginationValidator`).

## When to use `src/validators`

Use this directory for **universally applicable primitives**.
If a schema is used across multiple features (e.g., Email, Password, UUID, Pagination), it belongs here.

## When to use Feature-Local Validation

If a schema is specific to a single domain feature (e.g., `CreateVolunteerApplicationSchema` or `UpdateDonationSchema`), place it inside the feature module:
`src/features/volunteers/validators.ts`

## Validation Helpers

Always use `validateData` to process incoming API payloads or form submissions where a `ValidationError` (400 Bad Request) should be thrown automatically upon failure.

```ts
import { validateData, emailValidator } from '@/validators';

// Throws ValidationError if invalid
const email = validateData(emailValidator, "invalid-email");
```
