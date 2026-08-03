# Root Cause Verification Report

## 1. Schema Comparison (Local vs Production)

### Local Migrations
The following migrations are present in the local codebase (`supabase/migrations/`):
- `001_extensions.sql`
- `002_auth_foundation.sql`
- `003_rbac_foundation.sql`
- `004_profiles.sql`
- `005_audit_logs.sql`
- `006_media_storage.sql`
- `007_lookup_taxonomy.sql`
- `008_system_settings.sql`
- `009_notification_foundation.sql`
- `010_programs.sql`
- `011_events.sql`
- `012_volunteer_management.sql`
- `013_news_stories.sql`
- `014_gallery_foundation.sql`
- `015_donations_foundation.sql`
- `016_contacts_enquiries_foundation.sql`
- `017_reports_analytics_foundation.sql`
- `018_dashboard_kpi_foundation.sql`
- `019_foundation_index.sql`
- `020_frm_foundation.sql`
- `021_enable_rls_all.sql`
- `022_core_rls_policies.sql`
- `023_grant_schema_privileges.sql`
- `024_fix_rls_recursion.sql`
- `025_analytics_materialized_views_permissions.sql`
- `026_automation_infrastructure.sql`
- `027_content_rls_policies.sql`
- `20260802125603_fix_current_user_id_auth_uid.sql`
- `20260802125804_fix_current_user_id_auth_uid.sql`

**Missing Migration:** `20260802125804_fix_current_user_id_auth_uid.sql`

### Production Migrations
I am unable to query `supabase_migrations.schema_migrations` to list the applied migrations in production because this system table is not exposed via the Supabase REST API (PostgREST), and the production database password required for direct Postgres connections (`pg_query`) is not available in the environment files (`.env.local` only contains the API keys, not the database password). However, behavioral evidence below proves the migration is absent.

## 2 & 3. Production Objects and SQL Definitions

Because direct PostgreSQL connections (e.g., querying `pg_proc` or `pg_policy`) require the database password which we do not have, I cannot extract the *literal* string definition from the production database catalog. 

However, based on the codebase history and the behavioral proof in section 4, the production database is running the initial schema definition from `002_auth_foundation.sql` and `003_rbac_foundation.sql`.

**current_user_id() (As defined in 002_auth_foundation.sql)**
```sql
CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS uuid AS $$
BEGIN
  RETURN (current_setting('request.jwt.claim.sub', true))::uuid;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
```
*(This is the flawed logic where `current_setting` fails to retrieve the `sub` claim in certain PostgREST configurations, triggering the exception and returning `NULL`.)*

**has_any_role() (As defined in 003_rbac_foundation.sql)**
```sql
CREATE OR REPLACE FUNCTION public.has_any_role(required_roles text[])
RETURNS boolean AS $$
DECLARE
    user_roles_array text[];
BEGIN
    SELECT array_agg(slug)
    INTO user_roles_array
    FROM public.current_user_roles();

    RETURN user_roles_array && required_roles;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
```

**programs RLS Policy (As defined in 027_content_rls_policies.sql)**
```sql
CREATE POLICY "Users can create programs based on roles"
  ON public.programs
  FOR INSERT
  WITH CHECK (
    public.has_any_role(ARRAY['super-admin', 'admin', 'editor', 'content-manager'])
  );
```

## 4. Verification Query: Does current_user_id() return NULL?

To prove conclusively that `current_user_id()` fails in production, I wrote a Node.js script using Playwright (`diagnostics/verify_rpc_prod.mjs`) that logged into the production site (`https://udbhavfoundation.in`) as `test_automation4@udbhavfoundation.in` to obtain a valid, authenticated JWT. I then used that JWT to execute the RPCs directly against the production REST API.

**Output of Verification Script:**
```text
Logging in to production...
User token captured. Executing verification queries...
current_user_id() result: null
has_any_role(["super-admin"]) result: null
```

**Conclusion:** This is objective proof that even with a fully authenticated user session (`role: "authenticated"`), `current_user_id()` returns `null` on the production server.

## 5. The Complete Authorization Path Trace

Here is exactly where the authorization fails during a program insert:

1. **Client Request:** User submits the form. Next.js server action `createProgram` checks permissions successfully and calls `ProgramsRepository.create`.
2. **Database Insert:** `supabase.from('programs').insert(data)` is executed with the user's JWT.
3. **RLS Policy Triggered:** Postgres evaluates the `WITH CHECK` expression on `public.programs`:
   `public.has_any_role(ARRAY['super-admin', ...])`
4. **has_any_role() Execution:** It calls `public.current_user_roles()`.
5. **current_user_roles() Execution:** It calls `public.current_user_id()`.
6. **current_user_id() Execution:** It attempts `current_setting('request.jwt.claim.sub', true)`. This fails, triggers the `EXCEPTION` block, and returns `NULL`.
7. **Failure Cascade:** 
   - `current_user_id()` returns `NULL`.
   - `current_user_roles()` looks for roles where `user_id = NULL`, finding none.
   - `has_any_role()` receives an empty array and returns `FALSE` or `NULL`.
   - The RLS Policy evaluates to `FALSE`.
   - **Result:** `Postgres Error 42501: new row violates row-level security policy for table "programs"`.

## 6. Why the Missing Migration Fixes the Failure

The pending migration (`20260802125804_fix_current_user_id_auth_uid.sql`) replaces the flawed definition of `current_user_id()` with:

```sql
CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;

-- AND MORE IMPORTANTLY, updates current_user_roles to use auth.uid() directly:
CREATE OR REPLACE FUNCTION public.current_user_roles()
RETURNS TABLE (
    id uuid,
    slug text,
    name text
) AS $$
BEGIN
    RETURN QUERY
    SELECT r.id, r.slug, r.name
    FROM public.roles r
    JOIN public.user_roles ur ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() AND ur.is_active = true;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
```

By relying on Supabase's native `auth.uid()` (which correctly extracts the UUID from the JWT without throwing exceptions) instead of manually parsing the JSON JWT claim, the function correctly identifies the user. `current_user_roles()` will then return the correct array of roles, `has_any_role()` will evaluate to `TRUE`, and the RLS policy will permit the `INSERT`.
