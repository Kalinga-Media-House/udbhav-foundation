-- Migration 027: Content RLS Policies
-- Adds missing RLS policies for content tables (programs, media_assets, etc.)
-- which were locked down by 021 but never given policies.

-- ============================================================
-- Media Files
-- ============================================================
DROP POLICY IF EXISTS "Public can view media" ON public.media_files;
DROP POLICY IF EXISTS "Admins can manage media" ON public.media_files;

CREATE POLICY "Public can view media"
  ON public.media_files
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage media"
  ON public.media_files
  FOR ALL
  TO authenticated
  USING (
    public.has_any_role(ARRAY['super-admin', 'admin', 'editor', 'content-manager', 'media-manager'])
  );

-- ============================================================
-- Programs
-- ============================================================
DROP POLICY IF EXISTS "Public can view published programs" ON public.programs;
DROP POLICY IF EXISTS "Admins can manage programs" ON public.programs;

CREATE POLICY "Public can view published programs"
  ON public.programs
  FOR SELECT
  USING (
    status = 'active' OR
    public.has_any_role(ARRAY['super-admin', 'admin', 'editor', 'content-manager'])
  );

CREATE POLICY "Admins can manage programs"
  ON public.programs
  FOR ALL
  TO authenticated
  USING (
    public.has_any_role(ARRAY['super-admin', 'admin', 'editor', 'content-manager'])
  );

-- ============================================================
-- Program Members & Partners
-- ============================================================
DROP POLICY IF EXISTS "Public can view active program members" ON public.program_members;
DROP POLICY IF EXISTS "Admins can manage program members" ON public.program_members;

CREATE POLICY "Public can view active program members"
  ON public.program_members
  FOR SELECT
  USING (
    is_active = true OR
    public.has_any_role(ARRAY['super-admin', 'admin', 'editor', 'content-manager'])
  );

CREATE POLICY "Admins can manage program members"
  ON public.program_members
  FOR ALL
  TO authenticated
  USING (
    public.has_any_role(ARRAY['super-admin', 'admin', 'editor', 'content-manager'])
  );

DROP POLICY IF EXISTS "Public can view active program partners" ON public.program_partners;
DROP POLICY IF EXISTS "Admins can manage program partners" ON public.program_partners;

CREATE POLICY "Public can view active program partners"
  ON public.program_partners
  FOR SELECT
  USING (
    is_active = true OR
    public.has_any_role(ARRAY['super-admin', 'admin', 'editor', 'content-manager'])
  );

CREATE POLICY "Admins can manage program partners"
  ON public.program_partners
  FOR ALL
  TO authenticated
  USING (
    public.has_any_role(ARRAY['super-admin', 'admin', 'editor', 'content-manager'])
  );
