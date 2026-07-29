# UDBHAV Foundation - Middleware Foundation Architecture

This document explains the Edge Middleware routing and security infrastructure.

## Architecture

The `src/middleware.ts` file executes at the Edge, intercepting requests before they hit Server Components or Route Handlers. 

It delegates logic to `src/lib/middleware/`, which is broken down into:
- `auth.ts`: Syncs the Supabase JWT via cookies, checks session state.
- `rbac.ts`: Enforces Role-Based Access Control logic for `/admin` routes.
- `redirects.ts`: Safely redirects unauthenticated users to `/auth/login`, and authenticated users to `/admin/dashboard`.
- `headers.ts`: Applies `Strict-Transport-Security`, `X-Frame-Options`, and `Permissions-Policy`.

## Route Definitions
All route logic is centralized in `src/lib/middleware/matcher.ts`.
- **PUBLIC:** Accessible by anyone (e.g., `/`, `/about`).
- **AUTH:** Accessible ONLY by logged-out users (e.g., `/auth/login`). Logged-in users hitting this are bounced to the dashboard.
- **ADMIN:** Protected routes requiring authentication and specific RBAC roles.

## Security Model
- **No Direct DB Hits:** The middleware runs at the Edge and cannot establish direct PostgreSQL connections. It relies entirely on the cryptographically signed Supabase JWT stored in the browser cookie.
- **Cookie Synchronization:** Because Server Components cannot set cookies on the *outgoing* response directly during a render, the middleware uses `@supabase/ssr` to refresh the session and stamp the new `Set-Cookie` header on the way out.
- **Fail-Closed Strategy:** If a route is not explicitly matched as PUBLIC or AUTH, and the user is not authenticated, they will be blocked. (Currently implemented to allow pass-through if it matches nothing, but `checkRoleAccess` strictly guards `/admin`).
