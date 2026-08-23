-- Migration: site_links for managing external URLs like YouTube

CREATE TABLE IF NOT EXISTS public.site_links (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    slug text NOT NULL UNIQUE,
    label text NOT NULL,
    url text NOT NULL,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Trigger for updated_at
CREATE TRIGGER trg_site_links_updated_at 
BEFORE UPDATE ON public.site_links 
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.site_links ENABLE ROW LEVEL SECURITY;

-- Public can read active links
CREATE POLICY "Public can view active site links" 
ON public.site_links FOR SELECT 
USING (is_active = true);

-- Admins can do everything
CREATE POLICY "Admins have full access to site links" 
ON public.site_links FOR ALL 
TO authenticated 
USING (
    public.has_role('admin') OR public.has_role('super-admin')
);

-- Seed initial data
INSERT INTO public.site_links (slug, label, url, is_active)
VALUES ('youtube_channel', 'YouTube Channel', '', false)
ON CONFLICT (slug) DO NOTHING;
