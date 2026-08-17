-- Migration: Create volunteer_applications table
-- Description: Public volunteer application submissions from the /volunteers form.
-- The table stores pending applications for admin review via the Admin Dashboard.

BEGIN;

-------------------------------------------------------------------------------
-- 1. CREATE TABLE
-------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.volunteer_applications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name       TEXT NOT NULL,
    email           TEXT NOT NULL,
    mobile_number   TEXT NOT NULL,
    age             INTEGER,
    occupation      TEXT NOT NULL,
    city_district   TEXT NOT NULL,
    state           TEXT NOT NULL,
    preferred_areas JSONB NOT NULL DEFAULT '[]'::jsonb,
    skills          TEXT,
    availability    TEXT NOT NULL,
    motivation      TEXT NOT NULL,
    consent         BOOLEAN NOT NULL DEFAULT false,
    status          TEXT NOT NULL DEFAULT 'pending',
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for admin dashboard queries (filter by status, order by created_at)
CREATE INDEX IF NOT EXISTS idx_volunteer_applications_status
    ON public.volunteer_applications (status);

CREATE INDEX IF NOT EXISTS idx_volunteer_applications_created_at
    ON public.volunteer_applications (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_volunteer_applications_email
    ON public.volunteer_applications (email);

-------------------------------------------------------------------------------
-- 2. AUTO-UPDATE updated_at TRIGGER
-------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.update_volunteer_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_volunteer_applications_updated_at
    ON public.volunteer_applications;

CREATE TRIGGER trigger_update_volunteer_applications_updated_at
    BEFORE UPDATE ON public.volunteer_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_volunteer_applications_updated_at();

-------------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY
-------------------------------------------------------------------------------

ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous/public users to INSERT their own application.
-- This is required because the volunteer form is public (no login required).
CREATE POLICY volunteer_applications_public_insert
    ON public.volunteer_applications
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Policy: Allow authenticated admin users to SELECT all applications.
-- Uses the existing RBAC pattern: roles.slug column with hyphenated slugs.
CREATE POLICY volunteer_applications_admin_select
    ON public.volunteer_applications
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.slug IN ('super-admin', 'admin', 'moderator')
        )
    );

-- Policy: Allow authenticated admin users to UPDATE applications (review/approve/reject).
CREATE POLICY volunteer_applications_admin_update
    ON public.volunteer_applications
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.slug IN ('super-admin', 'admin', 'moderator')
        )
    );

-- Policy: Allow authenticated admin users to DELETE applications if needed.
CREATE POLICY volunteer_applications_admin_delete
    ON public.volunteer_applications
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.slug IN ('super-admin', 'admin')
        )
    );

COMMIT;
