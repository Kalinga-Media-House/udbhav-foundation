-- Migration: Add application_id to volunteers table
-- Description: Allows public applicants to have a volunteer record without requiring an auth.users profile.

BEGIN;

ALTER TABLE public.volunteers ALTER COLUMN profile_id DROP NOT NULL;
ALTER TABLE public.volunteers ADD COLUMN application_id uuid REFERENCES public.volunteer_applications(id) ON DELETE CASCADE;

-- Ensure a volunteer has AT LEAST one of profile_id or application_id
ALTER TABLE public.volunteers ADD CONSTRAINT volunteer_identity_check CHECK (profile_id IS NOT NULL OR application_id IS NOT NULL);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_volunteers_application_id ON public.volunteers(application_id);

COMMIT;
