-- Migration: Fix Volunteers RLS and Backfill
-- Description: Adds missing RLS policies for volunteers table and backfills missing active volunteers.

BEGIN;

-- 1. Enable RLS (Should already be enabled by 021, but ensuring it)
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;

-- 2. Drop any potentially misnamed policies just in case
DROP POLICY IF EXISTS "Public can view public volunteers" ON public.volunteers;
DROP POLICY IF EXISTS "Admins can manage volunteers" ON public.volunteers;
DROP POLICY IF EXISTS "Volunteers can view own profile" ON public.volunteers;

-- 3. Create RLS Policies
-- Public SELECT policy: Only allows viewing if publicly visible and status is Active
CREATE POLICY "Public can view public volunteers"
  ON public.volunteers
  FOR SELECT
  USING (
    (is_publicly_visible = true AND status = 'Active') OR
    public.has_any_role(ARRAY['super-admin', 'admin', 'editor', 'content-manager'])
  );

-- Admin ALL policy: Manage everything
CREATE POLICY "Admins can manage volunteers"
  ON public.volunteers
  FOR ALL
  TO authenticated
  USING (
    public.has_any_role(ARRAY['super-admin', 'admin', 'editor', 'content-manager'])
  );

-- Owner SELECT/UPDATE policy (if auth.users exists)
CREATE POLICY "Volunteers can view own profile"
  ON public.volunteers
  FOR SELECT
  TO authenticated
  USING (
    profile_id = auth.uid() OR
    public.has_any_role(ARRAY['super-admin', 'admin', 'editor', 'content-manager'])
  );

-- 4. Backfill Missing Volunteer Records from Accepted Applications
INSERT INTO public.volunteers (
    application_id,
    volunteer_code,
    status,
    biography,
    metadata,
    is_publicly_visible
)
SELECT 
    va.id,
    'VOL-' || upper(substr(md5(random()::text), 1, 8)),
    'Active'::public.volunteer_status,
    va.motivation,
    jsonb_build_object(
      'skills', va.skills,
      'preferred_areas', va.preferred_areas,
      'city_district', va.city_district,
      'state', va.state,
      'application_id', va.id
    ),
    va.is_publicly_visible
FROM public.volunteer_applications va
LEFT JOIN public.volunteers v ON va.id = v.application_id
WHERE va.status = 'accepted' AND v.id IS NULL;

COMMIT;
