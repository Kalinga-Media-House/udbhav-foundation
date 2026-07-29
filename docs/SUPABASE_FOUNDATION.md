# UDBHAV Foundation - Supabase Foundation Architecture

This document outlines the usage of the central Supabase integration layer.

## Architecture

We employ **Supabase SSR** (Server-Side Rendering) to guarantee secure, cookie-based sessions across the Next.js App Router. 

### 1. The Browser Client (`client.ts`)
- **Usage:** Only in React Client Components (`"use client"`).
- **Purpose:** Used for real-time subscriptions, client-side mutations (rare), and fetching public buckets.
- **Security:** Relies strictly on Row Level Security (RLS) policies.

### 2. The Server Client (`server.ts`)
- **Usage:** Inside Server Components, Server Actions, and Route Handlers.
- **Purpose:** The primary method for data fetching and mutations. 
- **Security:** Safely manages `Set-Cookie` headers. Respects RLS.

### 3. The Middleware Client (`middleware.ts`)
- **Usage:** Only inside `src/middleware.ts`.
- **Purpose:** Refreshes the JWT session at the Edge to prevent random logouts on navigation.

### 4. The Admin Client (`admin.ts`)
- **Usage:** ONLY inside restricted Server Actions or background webhooks.
- **Purpose:** Bypasses RLS utilizing the `SERVICE_ROLE_KEY`. 
- **Security:** Will intentionally throw a fatal error if imported in the browser.

## Security Rules
- **DO NOT** construct `createClient()` manually anywhere in the codebase. Always import from `@/lib/supabase`.
- **DO NOT** catch raw Supabase errors and send them to the client. Always wrap them in custom `DatabaseError` or `AppError` classes using `AppError.serialize()`.
- Always use `requireUser()` or `requireRole()` inside Server Actions *before* executing database mutations.
