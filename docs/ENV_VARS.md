# UDBHAV Foundation - Environment Variables Master Guide

This document defines the purpose, constraints, and security profile of every environment variable utilized in the UDBHAV Foundation platform.

## Application State

### `NODE_ENV`
- **Purpose:** Determines the runtime mode (optimizations, error masking).
- **Required:** Yes
- **Allowed Values:** `development`, `test`, `production`
- **Security:** Internal

### `NEXT_PUBLIC_APP_URL`
- **Purpose:** Absolute URL for constructing absolute paths (e.g., OG Images, authentication callbacks).
- **Required:** Yes
- **Allowed Values:** Valid HTTP/HTTPS URLs.
- **Security:** Public

## Supabase (Database & Auth)

### `NEXT_PUBLIC_SUPABASE_URL`
- **Purpose:** The REST endpoint for the Supabase instance.
- **Required:** Yes
- **Allowed Values:** Valid Supabase project URL.
- **Security:** Public

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Purpose:** The JWT utilized by the client to interact with Supabase REST and Auth endpoints. Safe because the database enforces Row Level Security (RLS).
- **Required:** Yes
- **Allowed Values:** Valid Supabase JWT.
- **Security:** Public

### `SUPABASE_SERVICE_ROLE_KEY`
- **Purpose:** Administrative key that entirely bypasses Postgres Row Level Security (RLS). Utilized strictly in Server Actions for background jobs, audit logging, and admin overrides.
- **Required:** Yes
- **Allowed Values:** Valid Supabase Service Role JWT.
- **Security:** **CRITICAL. NEVER EXPOSE TO CLIENT.**

## Cloudflare R2 (Media Storage)

### `R2_ACCOUNT_ID`
- **Purpose:** The Cloudflare Account hash required for generating S3-compatible endpoints.
- **Required:** Yes
- **Security:** Internal

### `R2_ACCESS_KEY_ID`
- **Purpose:** S3 API Access Key generated in Cloudflare.
- **Required:** Yes
- **Security:** Secret

### `R2_SECRET_ACCESS_KEY`
- **Purpose:** S3 API Secret Key generated in Cloudflare.
- **Required:** Yes
- **Security:** **CRITICAL. NEVER EXPOSE TO CLIENT.**

### `R2_BUCKET_NAME`
- **Purpose:** The precise string name of the target R2 bucket.
- **Required:** Yes
- **Security:** Internal

### `NEXT_PUBLIC_R2_PUBLIC_URL`
- **Purpose:** The custom domain mapped to the R2 bucket for serving optimized public assets via CDN (e.g., images for news/events).
- **Required:** Yes
- **Allowed Values:** Valid HTTP/HTTPS URL.
- **Security:** Public

---

## Fail-Fast Validation Architecture
The application employs Zod schemas (`src/config/server-env.ts` and `src/config/public-env.ts`) to validate all variables on application boot. If any variable is missing, empty, or incorrectly formatted (e.g., invalid URL string), the Next.js server will `throw new Error()` and instantly crash. This mathematically guarantees the platform cannot boot into an unstable or insecure state.
