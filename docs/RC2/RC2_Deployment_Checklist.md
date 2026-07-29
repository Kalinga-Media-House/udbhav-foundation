# RC2 Deployment Checklist

## Pre-Deployment Verification
- [x] All automated tests pass (`npm run test` if applicable)
- [x] Typechecking completes with 0 errors (`npm run typecheck`)
- [x] ESLint passes with 0 errors (`npm run lint`)
- [x] Production build completes successfully without missing assets (`npm run build`)
- [x] GitHub `origin/main` branch reflects the intended commit state
- [x] Temporary/scratch files have been permanently removed
- [x] `console.log` statements are purged from production API routes and services

## Environment & Secrets
- [x] `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are verified.
- [x] `SUPABASE_SERVICE_ROLE_KEY` is securely injected.
- [x] `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME` verified for Media Uploads.
- [x] External integrations (Razorpay, Resend) contain valid API keys in the host environment.
- [x] `.env.local` accurately mimics the shape of the production environment variables.

## Deployment Execution
- [x] Ensure Vercel or target host pulls the correct `v1.0.0-rc2` tag or `main` HEAD.
- [x] Monitor build logs for SSR anomalies or bundle size spikes.
- [x] Verify Edge Functions compile and deploy correctly without size limit errors.
- [x] Smoke-test the homepage (`/`) after deployment goes green.

## Post-Deployment Validation
- [x] Access `/admin/dashboard` to verify Supabase session state persists.
- [x] Verify API payload formats haven't regressed (HTTP 200 on basic lookups).
- [x] Test role-based rendering (verify non-admins are blocked from `/admin`).
- [x] Validate production data sources reflect expected Supabase remote databases.
