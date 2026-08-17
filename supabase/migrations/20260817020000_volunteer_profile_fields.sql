-- Migration: Add profile fields to volunteer_applications
-- Description: Extends public volunteer applications with admin-managed profile fields

ALTER TABLE public.volunteer_applications
  ADD COLUMN IF NOT EXISTS profile_picture_url TEXT,
  ADD COLUMN IF NOT EXISTS blood_group TEXT,
  ADD COLUMN IF NOT EXISTS public_bio TEXT,
  ADD COLUMN IF NOT EXISTS volunteer_role TEXT,
  ADD COLUMN IF NOT EXISTS is_publicly_visible BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

-- Note: No RLS policies are needed for public reading because the public API
-- will use a server-side query with the admin client to select ONLY safe fields,
-- preventing direct access to sensitive information like blood_group.
