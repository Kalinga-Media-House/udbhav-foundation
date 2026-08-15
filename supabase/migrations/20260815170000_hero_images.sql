-- Migration: 029_hero_images.sql
-- Description: Dynamic hero image management for Home and Programmes Index pages.
-- Dependencies: 001_extensions.sql, 002_auth_foundation.sql

BEGIN;

CREATE TABLE IF NOT EXISTS public.hero_images (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    section text NOT NULL CHECK (section IN ('home_hero', 'programmes_hero')),
    image_url text NOT NULL,
    display_order integer NOT NULL DEFAULT 0,
    is_active boolean NOT NULL DEFAULT true,
    
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.hero_images IS 'Dynamic hero image management for different sections of the website.';

CREATE INDEX IF NOT EXISTS idx_hero_images_section ON public.hero_images(section);
CREATE INDEX IF NOT EXISTS idx_hero_images_active ON public.hero_images(is_active);

-- Timestamps
CREATE TRIGGER trg_hero_images_updated_at BEFORE UPDATE ON public.hero_images FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_hero_images_audit BEFORE INSERT OR UPDATE ON public.hero_images FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();

-- RLS
ALTER TABLE public.hero_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hero images are viewable by everyone"
    ON public.hero_images FOR SELECT
    USING (true);

CREATE POLICY "Only admins can manage hero images"
    ON public.hero_images FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.slug IN ('super-admin', 'admin')
        )
    );

COMMIT;
