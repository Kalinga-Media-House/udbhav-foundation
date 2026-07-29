# Enterprise Architecture

## Core Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v3
- **Database**: PostgreSQL (via Supabase)
- **Auth**: Supabase Auth (RLS & Edge Cookies)
- **Storage**: Cloudflare R2 (S3 API via Supabase Storage)
- **Deployment**: Vercel

## Server Components First
All data fetching happens exclusively on the server using Next.js Server Components. There are no client-side API calls to Supabase or internal APIs.

## Server Actions for Mutations
All form submissions and data mutations use Next.js Server Actions. They provide type-safe RPC endpoints that natively integrate with React's form lifecycle and Next.js's caching mechanism (`revalidateTag`).

## Clean Architecture Pattern
The backend is structured into domain-driven feature modules (`src/features/*`).

1. **Actions (`actions.ts`)**: The presentation controller layer. Validates authentication, enforces role-based permissions, handles `FormData`, and invalidates Next.js cache.
2. **Services (`service.ts`)**: The business logic layer. Implements business rules and orchestrates multiple repository calls.
3. **Repositories (`repository.ts`)**: The data access layer. Wraps Supabase client calls, handles SQL queries, and translates raw rows into domain entities.
4. **Validators (`validators.ts`)**: Zod schemas for runtime validation of all DTOs and payloads.

## State Management
- **URL as State**: All search, filtering, sorting, and pagination state is driven by the URL `searchParams`. This ensures shareable links and leverages server-side rendering for optimal SEO and performance.
- **No Global Client State**: There is no Redux, Zustand, or Context API for data fetching. Data is passed strictly top-down as props from Server Components.
