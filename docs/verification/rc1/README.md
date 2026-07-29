# RC1 Empirical Production Verification Archive

This directory archives the permanent empirical runtime verification evidence collected during the Release Candidate 1 (`v1.0.0-rc1`) authentication sign-off audit.

## Verification Baseline
- **Release Candidate:** `v1.0.0-rc1`
- **Git Commit SHA:** `64b198f1e3a6ca70876bd17e21147f050f763f4e`
- **Production Domain:** `https://udbhavfoundation.in`
- **Vercel Edge Deployment:** `https://udbhav-foundation.vercel.app`
- **Sign-off Date:** July 29, 2026
- **Sign-off Status:** **APPROVED**

---

## Archived Empirical Artifacts

1. **`admin_dashboard.png`**
   - Full-page headless Microsoft Edge Playwright screenshot of the authenticated UDBHAV Foundation Admin Portal dashboard (`https://udbhavfoundation.in/admin/dashboard`) rendered in production after login as `banamalikanhar7@gmail.com` (`super-admin`).
2. **`production_auth_flow.har`**
   - Complete HTTP Network HAR Trace recording session creation, cookie syncing (`sb-ljtjfthgaqnkltugiiuy-auth-token`), server component (`_rsc`) payloads, and zero-redirect-loop navigation to `/admin/dashboard`.

---

## Playwright Browser Automation Log
```
===========================================================
PLAYWRIGHT EMPIRICAL PRODUCTION RUNTIME VERIFICATION
===========================================================

[1] Generating OTP session for banamalikanhar7@gmail.com...
    ✓ Session issued successfully. User ID: f51cf64f-0649-4e11-958c-102bfcb5ab28
[2] Launching Playwright Chromium (msedge channel)...
[3] Testing unauthenticated browser access to /admin...
    [UNAUTH GET /admin] Final URL navigated to: https://udbhavfoundation.in/login
    [UNAUTH REDIRECT LOGS] [
      {
        "url": "https://udbhavfoundation.in/admin",
        "status": 307,
        "location": "/login"
      }
    ]
[4] Opening authenticated browser context with HAR recording: docs/verification/rc1/production_auth_flow.har
[5] Navigating authenticated browser to https://udbhavfoundation.in/admin/dashboard...
    [AUTH GET /admin/dashboard] Response Status: 200
    [AUTH GET /admin/dashboard] Final Browser URL: https://udbhavfoundation.in/admin/dashboard
    [BROWSER PAGE TITLE] Admin Dashboard | UDBHAV Foundation | UDBHAV Foundation
    [PAGE HEADING/TEXT] Enterprise Dashboard  Drag and drop widgets to customize your overview.  Key Performance Indicators 
    ✓ NO REDIRECT LOOPS: Safely arrived and remained on /admin/dashboard
[6] Capturing screenshot of Admin Dashboard -> docs/verification/rc1/admin_dashboard.png
```

---

## PostgREST & RLS Verification Matrix
- `GET /rest/v1/profiles?id=eq.f51cf64f...` $\rightarrow$ `HTTP 200 OK` (status: `active`)
- `GET /rest/v1/user_roles?user_id=eq.f51cf64f...&is_active=eq.true` $\rightarrow$ `HTTP 200 OK` (role: `super-admin`)
- `RPC is_crm_admin()` $\rightarrow$ `true`
- Errors observed:
  - `0` HTTP 401 Unauthorized responses
  - `0` HTTP 403 Forbidden responses
  - `0` PostgreSQL `42P17` infinite recursion errors
