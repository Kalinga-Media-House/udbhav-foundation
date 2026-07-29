-- Migration 025: Grant SELECT permissions on Phase 3.1 BI Materialized Views and Auth RBAC tables
-- Ensures service_role and authenticated roles can read analytical materialized views and RBAC roles via PostgREST

BEGIN;

GRANT SELECT ON public.mvw_donation_summary TO service_role, authenticated;
GRANT SELECT ON public.mvw_user_growth TO service_role, authenticated;
GRANT SELECT ON public.mvw_program_statistics TO service_role, authenticated;
GRANT SELECT ON public.mvw_event_participation TO service_role, authenticated;
GRANT SELECT ON public.mvw_active_volunteers TO service_role, authenticated;
GRANT SELECT ON public.mvw_crm_performance TO service_role, authenticated;

-- Ensure authenticated users can query roles and user_roles for RBAC authorization
GRANT SELECT ON public.user_roles TO service_role, authenticated;
GRANT SELECT ON public.roles TO service_role, authenticated;
GRANT SELECT ON public.profiles TO service_role, authenticated;

-- Ensure execute permission on public.refresh_reports() for service_role and authenticated
GRANT EXECUTE ON FUNCTION public.refresh_reports() TO service_role, authenticated;

COMMIT;
