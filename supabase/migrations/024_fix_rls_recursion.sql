-- ============================================================
-- Migration 024: Fix RLS recursion in core policies & update is_crm_admin()
-- ============================================================
-- 1. Drops recursive policies created in 022 that queried user_roles directly.
-- 2. Replaces them with SECURITY DEFINER helper functions (has_role, has_any_role)
--    to prevent Postgres infinite recursion (42P17).
-- 3. Updates is_crm_admin() to check r.slug instead of legacy r.name.
-- ============================================================

-- Update is_crm_admin() to safely check role slugs without recursion
CREATE OR REPLACE FUNCTION public.is_crm_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
      AND ur.is_active = true
      AND r.slug IN ('super-admin', 'admin', 'editor', 'volunteer-manager', 'content-manager', 'media-manager', 'finance-manager')
  );
$function$;

-- ──────────────────────────────────────────────────────────
-- Fix profiles policies
-- ──────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

CREATE POLICY "Admins can read all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    public.has_any_role(ARRAY['super-admin', 'admin'])
  );

CREATE POLICY "Admins can update all profiles"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (
    public.has_any_role(ARRAY['super-admin', 'admin'])
  );

-- ──────────────────────────────────────────────────────────
-- Fix roles policies
-- ──────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Super admins can manage roles" ON public.roles;

CREATE POLICY "Super admins can manage roles"
  ON public.roles
  FOR ALL
  TO authenticated
  USING (
    public.has_role('super-admin')
  );

-- ──────────────────────────────────────────────────────────
-- Fix user_roles policies
-- ──────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Admins can read all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Super admins can manage user roles" ON public.user_roles;

CREATE POLICY "Admins can read all user roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (
    public.has_any_role(ARRAY['super-admin', 'admin'])
  );

CREATE POLICY "Super admins can manage user roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (
    public.has_role('super-admin')
  );
