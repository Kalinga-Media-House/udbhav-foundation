# UDBHAV Foundation Platform

This is the enterprise repository for the UDBHAV Foundation platform.

## Architecture & Documentation

Please see the `/docs` directory for the comprehensive Enterprise Architecture Documents, including:
- [`APPLICATION_SERVICES.md`](./docs/APPLICATION_SERVICES.md) — Backend service layer, repository pattern, and domain contracts
- [`APPLICATION_SHELL.md`](./docs/APPLICATION_SHELL.md) — UI shell, layouts, and component composition
- [`DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md) — Design tokens, Tailwind styling, and UI primitives
- [`MIDDLEWARE_FOUNDATION.md`](./docs/MIDDLEWARE_FOUNDATION.md) — Edge middleware routing and security headers
- [`SUPABASE_FOUNDATION.md`](./docs/SUPABASE_FOUNDATION.md) — Database schema, Row-Level Security (RLS), and authentication
- [`STORAGE_FOUNDATION.md`](./docs/STORAGE_FOUNDATION.md) — Cloudflare R2 media storage architecture
- [`TYPE_SYSTEM.md`](./docs/TYPE_SYSTEM.md) — Strict TypeScript type definitions and contracts
- [`ENV_VARS.md`](./docs/ENV_VARS.md) — Environment variable management and validation
- [`TESTING.md`](./docs/TESTING.md) — Vitest and Playwright quality assurance specifications
- [`CI_CD.md`](./docs/CI_CD.md) — Continuous integration and deployment workflows
- [`RC1 Verification Archive`](./docs/verification/rc1/README.md) — Empirical production runtime verification artifacts (HAR, screenshot, automation logs)

## Current Status
**✅ Phase 1–3 Completed and Baselined as Release Candidate 2 (RC2).**
The repository is at version `v1.0.0-rc2`. All core enterprise modules (DB, Auth, CMS, FRM Contacts, Donations, Events), RBAC security policies, and enterprise analytics dashboards have been empirically runtime verified in production. We have achieved strict Type Safety, standardized Server Action error handling, and hardended all storage/upload services.

## Local Development

Please refer to [`ENV_VARS.md`](./docs/ENV_VARS.md) and [`SUPABASE_FOUNDATION.md`](./docs/SUPABASE_FOUNDATION.md) for complete setup instructions.

Quickstart:
```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env.local
# (Fill in your secrets from the secure vault)

# 3. Start local Supabase
npx supabase start

# 4. Start Next.js Development Server
npm run dev
```

## Quality Gates

Before opening a PR, ensure you pass the local checks:
```bash
npm run lint
npm run typecheck
npm run build
```

