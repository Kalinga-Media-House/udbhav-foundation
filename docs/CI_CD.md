# UDBHAV Foundation - CI/CD Pipeline Architecture

This document explains our GitHub Actions continuous integration and continuous deployment strategy.

## 1. CI Pipeline (`.github/workflows/ci.yml`)
The CI pipeline executes on every Pull Request to `main` and every push to `main`. It guarantees that no broken code enters the repository.

### Jobs
1. **validate:** Checks ESLint (`pnpm lint`) and TypeScript compilation (`pnpm typecheck`). Fails instantly on any warning or error.
2. **test-unit:** Executes Vitest with coverage. Will fail if coverage drops below 80%.
3. **test-e2e:** Boots a local Next.js server and executes Playwright tests across Chromium, WebKit, and Firefox. Generates a trace report artifact on failure.
4. **build:** Executes `pnpm build` to guarantee the production Next.js bundler succeeds.

## 2. CD Pipeline (Vercel)
Deployment is handled automatically by Vercel integration upon a successful merge to `main`. 
Vercel is configured to ignore builds if the GitHub Actions CI pipeline fails.

## 3. Security Scanning
Dependabot and GitHub Advanced Security are enabled on the repository to scan for leaked secrets and vulnerable dependencies automatically.
