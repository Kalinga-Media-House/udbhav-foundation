# UDBHAV Foundation - Core Libraries Architecture

This document dictates the rules for utilizing the foundational libraries in `src/`.

## 1. Utilities (`src/utils`)
- **When to use:** For pure, stateless data transformations (e.g., formatting dates, currencies, strings).
- **When NOT to use:** Never place React Hooks, API calls, or business logic here.
- **Dependencies:** Should have ZERO dependencies on React, Next.js, or Supabase.

## 2. Constants (`src/constants`)
- **When to use:** To eliminate magic strings. Use `ROUTES.ADMIN.DASHBOARD` instead of `'/admin/dashboard'`.
- **Architecture Rule:** Must be `as const` to enforce TypeScript immutability.

## 3. Errors (`src/errors`)
- **When to use:** When throwing custom exceptions inside Server Actions or API Routes.
- **Why:** The `AppError.serialize()` method guarantees that internal stack traces are wiped before the error crosses the network boundary to the client.

## 4. Types (`src/types`)
- **When to use:** For globally shared interfaces like `ApiResponse` or generic utility types like `DeepPartial`.
- **When NOT to use:** Do NOT place feature-specific types here (e.g., `EventFormType`). Put those in `src/features/events/types.ts`.

## 5. Validators (`src/validators`)
- **When to use:** For reusable Zod schemas (e.g., `emailValidator`, `passwordValidator`) to ensure both the frontend forms and backend API routes validate data identically.

## 6. Logger (`src/lib/logger`)
- **When to use:** Always use `serverLogger` or `clientLogger` instead of `console.log`.
- **Why:** `serverLogger` structures outputs as JSON for ingestion tools and automatically masks PII based on key heuristics.
