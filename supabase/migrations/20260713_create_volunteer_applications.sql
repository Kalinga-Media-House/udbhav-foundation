-- Production-ready migration for UDBHAV Foundation Volunteer Applications
-- Stores volunteer application submissions from /volunteers page

CREATE TABLE IF NOT EXISTS public.volunteer_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    mobile_number TEXT NOT NULL,
    age INTEGER,
    occupation TEXT NOT NULL,
    city_district TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'Odisha',
    preferred_areas TEXT[] NOT NULL DEFAULT '{}',
    skills TEXT,
    availability TEXT NOT NULL,
    motivation TEXT NOT NULL,
    consent BOOLEAN NOT NULL DEFAULT true,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'contacted', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for faster admin queries by status and created_at
CREATE INDEX IF NOT EXISTS idx_volunteer_applications_status ON public.volunteer_applications(status);
CREATE INDEX IF NOT EXISTS idx_volunteer_applications_created_at ON public.volunteer_applications(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous/authenticated users to insert applications securely
CREATE POLICY "Allow public insert to volunteer_applications"
    ON public.volunteer_applications
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Only authenticated authorized administrators can view volunteer applications
CREATE POLICY "Allow admin read access to volunteer_applications"
    ON public.volunteer_applications
    FOR SELECT
    TO authenticated
    USING (
        auth.jwt() ->> 'role' = 'admin'
    );
