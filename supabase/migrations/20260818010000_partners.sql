-- Migration: partners
-- Description: Dynamic Partners management for the Home page.
-- Dependencies: 001_extensions.sql, 002_auth_foundation.sql, 003_rbac_foundation.sql

BEGIN;

CREATE TABLE IF NOT EXISTS public.partners (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    name text NOT NULL,
    logo_url text,
    website_url text,
    display_order integer NOT NULL DEFAULT 0,
    is_active boolean NOT NULL DEFAULT true,

    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.partners IS 'UDBHAV Foundation partners displayed on the Home page.';

CREATE INDEX IF NOT EXISTS idx_partners_active ON public.partners(is_active);
CREATE INDEX IF NOT EXISTS idx_partners_order ON public.partners(display_order);

-- Timestamps & Audit triggers
CREATE TRIGGER trg_partners_updated_at
  BEFORE UPDATE ON public.partners
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_partners_audit
  BEFORE INSERT OR UPDATE ON public.partners
  FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();

-- RLS
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Public users can only view active partners
CREATE POLICY "Public can view active partners"
    ON public.partners FOR SELECT
    USING (is_active = true OR public.has_any_role(ARRAY['super-admin', 'admin']));

-- Admins can fully manage partners
CREATE POLICY "Admins can manage partners"
    ON public.partners FOR ALL
    TO authenticated
    USING (public.has_any_role(ARRAY['super-admin', 'admin']));

-- Seed existing hardcoded partners (Order matters!)
-- Upper Row (1-17)
INSERT INTO public.partners (name, logo_url, display_order, is_active) VALUES
  ('Queens Club', '/images/partners/queens-club.png', 1, true),
  ('Round Table India', '/images/partners/round-table-india.png', 2, true),
  ('Ladies Circle India', '/images/partners/ladies-circle-india.png', 3, true),
  ('Knight Round Table 230', '/images/partners/knight-round-table-230.png', 4, true),
  ('ShreeHari', '/images/partners/shreehari.png', 5, true),
  ('Bank of Baroda', '/images/partners/bank-of-baroda.png', 6, true),
  ('State Bank of India', '/images/partners/state-bank-of-india.png', 7, true),
  ('IDBI Bank', '/images/partners/idbi-bank.png', 8, true),
  ('Nirvana Eye Hospital', '/images/partners/nirvana-eye-hospital.png', 9, true),
  ('Centre for Sight', '/images/partners/centre-for-sight.png', 10, true),
  ('NALCO', '/images/partners/nalco.png', 11, true),
  ('IMFA', '/images/partners/imfa.png', 12, true),
  ('Utkal Pratidin', '/images/partners/utkal-pratidin.png', 13, true),
  ('Odisha IAS & Banking Academy', '/images/partners/odisha-ias-banking-academy.png', 14, true),
  ('Threatsys', '/images/partners/threatsys.png', 15, true),
  ('Duramix', '/images/partners/duramix.png', 16, true),
  ('Apollo Hospitals', '/images/partners/apollo-hospitals.png', 17, true);

-- Lower Row (18-33)
INSERT INTO public.partners (name, logo_url, display_order, is_active) VALUES
  ('IBL Beauty Academy', '/images/partners/ibl-beauty-academy.png', 18, true),
  ('SPARC', '/images/partners/sparc.png', 19, true),
  ('Decathlon', '/images/partners/decathlon.png', 20, true),
  ('Ajanta Advertisers', '/images/partners/ajanta-advertisers.png', 21, true),
  ('Eco Saathi', '/images/partners/eco-saathi.png', 22, true),
  ('Niswa', '/images/partners/niswa.png', 23, true),
  ('Koustuv Group', '/images/partners/koustuv-group.png', 24, true),
  ('SDG Partner', '/images/partners/sdg-partner.png', 25, true),
  ('Dr. Lal PathLabs', '/images/partners/dr-lal-pathlabs.png', 26, true),
  ('UCMAS', '/images/partners/ucmas.png', 27, true),
  ('Kidzee', '/images/partners/kidzee.png', 28, true),
  ('Gurukulam India School', '/images/partners/gurukulam-india-school.png', 29, true),
  ('Radha Govind Homes', '/images/partners/radha-govind-homes.png', 30, true),
  ('Reach Digitally', '/images/partners/reach-digitally.png', 31, true),
  ('Digital Ratha', '/images/partners/digital-ratha.png', 32, true),
  ('Suravi Milk', '/images/partners/suravi-milk.png', 33, true);

COMMIT;
