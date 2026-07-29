# UDBHAV Foundation - Application Shell Architecture

This document explains the root layout and provider hierarchy that envelops every page in the platform.

## Architecture

We use a strictly hierarchical layout system based on Next.js 15 App Router. 

### 1. The Root Layout (`src/app/layout.tsx`)
- Enforces HTML language and base font styling (`Inter`).
- Implements the "Skip to main content" accessibility link.
- Injects the `RootProviders` wrapping all server components.
- Manages global SEO Metadata mapping from `src/constants/metadata.ts`.

### 2. Root Providers (`src/providers/index.tsx`)
This is a centralized wrapper combining:
1. **ThemeProvider:** Handles dark/light/system modes via `next-themes` by injecting `.dark` classes onto `<html>`.
2. **AuthProvider:** Syncs the Supabase session into React Context. Provides a realtime listener (`onAuthStateChange`) so client components re-render immediately on login/logout.

### 3. Structural Layouts (`src/components/layout/*`)
Instead of rewriting `<Header />` and `<Footer />` inside every `page.tsx`, pages should wrap themselves in a structural layout.

- **`PublicLayout`:** Injects the top-level marketing Header and Footer.
- **`DashboardLayout`:** Injects the administrative Sidebar and Topbar.
- **`AuthLayout`:** Centers content vertically and horizontally on a muted background for Login/Register forms.
- **`MinimalLayout`:** A completely blank canvas for print views or edge-case UIs.

## Accessibility (a11y)
- Every layout must wrap its primary content in `<main>`.
- The root layout injects `suppressHydrationWarning` on `<html>` to prevent `next-themes` from throwing hydration errors.
- Global loading states (`loading.tsx`) include `aria-label` and `role="status"`.

## Error Boundaries
- `error.tsx`: Catches standard React runtime errors and logs them to `clientLogger`.
- `not-found.tsx`: Clean 404 UI.
- `global-error.tsx`: The absolute fallback catching errors inside `layout.tsx` itself. It must return its own `<html>` and `<body>` tags.
