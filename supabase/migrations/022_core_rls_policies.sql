-- ============================================================
-- Migration 022: Add RLS policies for core auth/RBAC tables
-- ============================================================
-- Migration 021 enabled RLS on ALL public tables, but the core
-- tables (profiles, roles, user_roles) never had policies created.
-- Without policies, RLS defaults to deny-all for authenticated users,
-- which blocks the login authorization flow.
-- ============================================================

-- ──────────────────────────────────────────────────────────
-- profiles: Users can read their own profile. Admins can read all.
-- ──────────────────────────────────────────────────────────

-- Authenticated users can read their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Authenticated users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
        AND ur.is_active = true
        AND r.slug IN ('super-admin', 'admin')
    )
  );

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
        AND ur.is_active = true
        AND r.slug IN ('super-admin', 'admin')
    )
  );

-- ──────────────────────────────────────────────────────────
-- roles: All authenticated users can read roles (needed for
-- the FK join in user_roles queries).
-- Only super-admins can modify roles.
-- ──────────────────────────────────────────────────────────

CREATE POLICY "Authenticated users can read roles"
  ON public.roles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Super admins can manage roles"
  ON public.roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
        AND ur.is_active = true
        AND r.slug = 'super-admin'
    )
  );

-- ──────────────────────────────────────────────────────────
-- user_roles: Users can read their own role assignments.
-- Admins can read and manage all role assignments.
-- ──────────────────────────────────────────────────────────

-- Users can read their own role assignments (critical for login flow)
CREATE POLICY "Users can read own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admins can read all role assignments
CREATE POLICY "Admins can read all user roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
        AND ur.is_active = true
        AND r.slug IN ('super-admin', 'admin')
    )
  );

-- Super admins can manage role assignments
CREATE POLICY "Super admins can manage user roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
        AND ur.is_active = true
        AND r.slug = 'super-admin'
    )
  );
