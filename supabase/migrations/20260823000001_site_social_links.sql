-- Migration: 20260823000001_site_social_links.sql
-- Description: Table for managing dynamic social media links

CREATE TABLE IF NOT EXISTS public.site_social_links (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    platform text NOT NULL UNIQUE,
    url text NOT NULL,
    is_visible boolean NOT NULL DEFAULT true,
    display_order integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Trigger for updated_at
CREATE TRIGGER trg_site_social_links_updated_at 
BEFORE UPDATE ON public.site_social_links 
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.site_social_links ENABLE ROW LEVEL SECURITY;

-- Public can read active links
CREATE POLICY "Public can view active social links" 
ON public.site_social_links FOR SELECT 
USING (is_visible = true);

-- Admins can do everything
CREATE POLICY "Admins have full access to social links" 
ON public.site_social_links FOR ALL 
TO authenticated 
USING (
    public.has_role('admin') OR public.has_role('super-admin')
);

-- Seed initial data
INSERT INTO public.site_social_links (platform, url, is_visible, display_order)
VALUES 
  ('facebook', '', false, 1),
  ('instagram', '', false, 2),
  ('youtube', '', false, 3)
ON CONFLICT (platform) DO NOTHING;
