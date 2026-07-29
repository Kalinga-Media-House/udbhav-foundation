# RC2 Rollback Plan

## Purpose
This document outlines the procedure to revert the application to the previous stable state (RC1 or earlier) in the event of a catastrophic failure during the RC2 deployment.

## Triggers for Rollback
A rollback should be immediately initiated if any of the following occur:
1. **Critical Application Failure:** The homepage or major user flows (like authentication) throw unhandled 500 exceptions.
2. **Security Vulnerability:** A new critical exposure is detected bypassing the RC2 RBAC patches.
3. **Severe Performance Degradation:** Vercel monitoring shows significant memory leaks or timeout errors failing >10% of requests.
4. **Data Corruption:** Database writes are failing or recording malformed structures due to mismatched `Service` layer payloads.

## Rollback Procedure

### 1. Codebase Reversion
1. Access the Vercel Project Dashboard.
2. Navigate to the **Deployments** tab.
3. Locate the last known good deployment (prior to RC2).
4. Click the options menu (...) and select **Promote to Production** or **Rollback**.
5. Wait for Vercel to instantly swap the aliases to the older deployment.

### 2. Database State Reversion
*Note: RC2 does not introduce destructive schema migrations. However, if data anomalies occurred:*
1. Assess if new rows inserted during the RC2 window are corrupted.
2. If corrupted, execute manual Supabase SQL queries to sanitize or soft-delete the affected `created_at` timestamp range.
3. If structural corruption occurred (highly unlikely given no schema changes), utilize Supabase PITR (Point-in-Time Recovery) to restore the database to the exact minute before deployment.

### 3. Traffic Routing
- Vercel automatically handles traffic redirection upon rollback. Ensure Cloudflare proxy caches (if any) are purged to reflect the reverted frontend assets immediately.

### 4. Post-Rollback Analysis
- Lock the `main` branch to prevent automated redeployments.
- Extract all Vercel runtime logs and Supabase Postgres logs from the failure window.
- Identify the root cause and prepare a hotfix patch.
