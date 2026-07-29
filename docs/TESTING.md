# UDBHAV Foundation - Testing Architecture

This document describes our testing strategy and how to write tests.

## 1. Testing Pyramid

### Unit & Integration (Vitest)
- **Location:** `tests/unit/`, `tests/integration/`
- **Tooling:** Vitest, React Testing Library, jsdom.
- **Goal:** Fast, isolated execution. Test logic, utilities, and individual UI components.
- **Execution:** `pnpm test` (watch mode) or `pnpm test:run` (CI mode).

### End-to-End (Playwright)
- **Location:** `tests/e2e/`
- **Tooling:** Playwright.
- **Goal:** Real browser testing, cross-browser support, critical user journeys (Login, Data Entry).
- **Execution:** `pnpm exec playwright test`

## 2. Mocking & Fixtures
- Use `tests/mocks/` for standardizing mocked responses from Supabase or external APIs.
- Use `tests/fixtures/` for dummy data objects (e.g., `dummyUser`, `dummyEvent`).
- Always use `tests/helpers/render.tsx` instead of `@testing-library/react` to ensure context providers are injected.

## 3. Code Coverage
We enforce a strict 80% coverage threshold for unit tests. UI components inside `src/components/ui/` are excluded from coverage drops because they are primarily structural (from shadcn).

Run coverage via: `pnpm test:coverage`.
