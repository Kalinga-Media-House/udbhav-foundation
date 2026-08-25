-- Migration: advisory_board_members
-- Description: Dynamic Advisory Board member management for Core Team page.
-- Dependencies: 001_extensions.sql, 002_auth_foundation.sql, 003_rbac_foundation.sql

BEGIN;

CREATE TABLE IF NOT EXISTS public.advisory_board_members (
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

COMMENT ON TABLE public.advisory_board_members IS 'Advisory Board members displayed on the Core Team page.';

CREATE INDEX IF NOT EXISTS idx_advisory_board_members_active ON public.advisory_board_members(is_active);
CREATE INDEX IF NOT EXISTS idx_advisory_board_members_order ON public.advisory_board_members(display_order);

-- Timestamps and Audit triggers (reuse existing foundation functions)
CREATE TRIGGER trg_advisory_board_members_updated_at
  BEFORE UPDATE ON public.advisory_board_members
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_advisory_board_members_audit
  BEFORE INSERT OR UPDATE ON public.advisory_board_members
  FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();

-- RLS
ALTER TABLE public.advisory_board_members ENABLE ROW LEVEL SECURITY;

-- Public users can only view active members
CREATE POLICY "Public can view active advisory board members"
    ON public.advisory_board_members FOR SELECT
    USING (is_active = true OR public.has_any_role(ARRAY['super-admin', 'admin']));

-- Admins can fully manage advisory board members
CREATE POLICY "Admins can manage advisory board members"
    ON public.advisory_board_members FOR ALL
    TO authenticated
    USING (public.has_any_role(ARRAY['super-admin', 'admin']));

-- Seed existing hardcoded Advisory Board members (preserving exact order)
INSERT INTO public.advisory_board_members (full_name, designation, display_order, is_active) VALUES
  ('Mr. Prabhas Singh', 'Former MP, Bargarh', 1, true),
  ('Mr. Dasarathi Satpathy', 'Former Secretary, Odisha Legislative Assembly', 2, true),
  ('Ms. Subhra Subhadarshi', 'Head \u2013 Corporate Affairs, Sparc Pvt. Ltd.', 3, true),
  ('Mr. Deepak Nath', 'Managing Director, Threatsys Technology Pvt. Ltd.', 4, true),
  ('Mr. Sushant Mohanty', 'Managing Director, Shri Hari Enterprises', 5, true),
  ('Ms. Jagruti Rath', 'Eminent Actress', 6, true),
  ('Mr. Subhojit Panda', 'TV Anchor & Emcee', 7, true),
  ('Mr. Amitesh Gugnani', 'Founder \u2013 Mango Hotel by Prangan; Co-founder \u2013 Rahat Hospital', 8, true),
  ('Mr. Ratul Manek', 'Chief Financial Officer, Jyoti Construction', 9, true),
  ('Ms. Chidatmika Khatua', 'Social Activist; Founder & CEO, Sushruta Hospital and Trauma Care; Managing Director, Odisha Cosmetic Surgery Clinic', 10, true),
  ('Mr. Raju Das', 'Renowned Actor', 11, true),
  ('Ms. Nandini Sahoo', 'Managing Director, IBL Beauty Academy', 12, true),
  ('Mr. Subham Mohanty', 'Managing Director, Radha Govind Homes', 13, true),
  ('Mr. Mihir Das', 'Managing Director, Suravi Milk', 14, true),
  ('Mr. Arijit Pariksha', 'Founder \u2013 Utkal Pratidin; MD \u2013 Heronex Media Ltd.', 15, true),
  ('Mr. Biswajeet Panigrahi', 'Director, Odisha IAS Academy', 16, true),
  ('Mr. Kamala Kanta Rath', 'President, Para Sports Association, Odisha', 17, true);

COMMIT;
