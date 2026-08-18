-- Migration: governing_body_members
-- Description: Dynamic Governing Body member management for Core Team page.
-- Dependencies: 001_extensions.sql, 002_auth_foundation.sql, 003_rbac_foundation.sql

BEGIN;

CREATE TABLE IF NOT EXISTS public.governing_body_members (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    full_name text NOT NULL,
    designation text NOT NULL,
    bio text,
    photo_url text,
    display_order integer NOT NULL DEFAULT 0,
    is_active boolean NOT NULL DEFAULT true,

    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.governing_body_members IS 'Governing Body members displayed on the Core Team and Home pages.';

CREATE INDEX IF NOT EXISTS idx_governing_body_members_active ON public.governing_body_members(is_active);
CREATE INDEX IF NOT EXISTS idx_governing_body_members_order ON public.governing_body_members(display_order);

-- Timestamps & Audit triggers (reuse existing foundation functions)
CREATE TRIGGER trg_governing_body_members_updated_at
  BEFORE UPDATE ON public.governing_body_members
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_governing_body_members_audit
  BEFORE INSERT OR UPDATE ON public.governing_body_members
  FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();

-- RLS
ALTER TABLE public.governing_body_members ENABLE ROW LEVEL SECURITY;

-- Public users can only view active members
CREATE POLICY "Public can view active governing body members"
    ON public.governing_body_members FOR SELECT
    USING (is_active = true OR public.has_any_role(ARRAY['super-admin', 'admin']));

-- Admins can fully manage governing body members
CREATE POLICY "Admins can manage governing body members"
    ON public.governing_body_members FOR ALL
    TO authenticated
    USING (public.has_any_role(ARRAY['super-admin', 'admin']));

-- Seed existing hardcoded members
INSERT INTO public.governing_body_members (full_name, designation, display_order, is_active) VALUES
  ('JAYSURAJ PATTANAYAK', 'Visionary Founder', 1, true),
  ('SUJIT MOHARANA', 'Co-Founder', 2, true),
  ('ARCHITA JENA', 'Project Coordinator', 3, true),
  ('SANJAY PATTANAYAK', 'Executive Director cum CSR & Collaboration Lead', 4, true),
  ('JANAKI ROUT', 'Volunteer Coordinator', 5, true),
  ('PRASANJIT HOTA', 'Operation Lead', 6, true),
  ('SANJIB MANDAL', 'Creative Lead', 7, true),
  ('RAJASHREE KAR', 'Research and Innovation & Communication and Media Lead', 8, true),
  ('SUJATA BEHERA', 'Field Coordinator', 9, true),
  ('LIPU BEHERA', 'Event Coordinator & Monitoring and Evaluation Lead', 10, true),
  ('SAKTI SWAGAT PATTANAYAK', 'Finance & Compliance Lead', 11, true);

COMMIT;
