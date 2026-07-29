-- Migration: 019_foundation_index.sql
-- Description: Dedicated Foundation Index domain (index_initiatives and index_initiative_gallery)
-- Separates operational Programs from historical booklet documentation archive.

CREATE TABLE IF NOT EXISTS public.index_initiatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  initiative_type TEXT NOT NULL,
  cover_media_id UUID REFERENCES public.media_files(id) ON DELETE SET NULL,
  short_summary TEXT NOT NULL,
  description TEXT,
  event_date DATE,
  year INTEGER NOT NULL,
  location TEXT,
  beneficiaries TEXT,
  volunteers TEXT,
  chief_guest TEXT,
  outcome TEXT,
  duration TEXT,
  partner_name TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'Published' CHECK (status IN ('Draft', 'Published', 'Archived')),
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_deleted BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS public.index_initiative_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  initiative_id UUID NOT NULL REFERENCES public.index_initiatives(id) ON DELETE CASCADE,
  media_id UUID NOT NULL REFERENCES public.media_files(id) ON DELETE CASCADE,
  caption TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT idx_init_gal_unique UNIQUE(initiative_id, media_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_index_initiatives_slug ON public.index_initiatives(slug) WHERE (is_deleted = false);
CREATE INDEX IF NOT EXISTS idx_index_initiatives_year ON public.index_initiatives(year) WHERE (is_deleted = false);
CREATE INDEX IF NOT EXISTS idx_index_initiatives_type ON public.index_initiatives(initiative_type) WHERE (is_deleted = false);
CREATE INDEX IF NOT EXISTS idx_index_initiatives_status ON public.index_initiatives(status) WHERE (is_deleted = false);
CREATE INDEX IF NOT EXISTS idx_index_initiatives_display_order ON public.index_initiatives(display_order ASC);
CREATE INDEX IF NOT EXISTS idx_index_initiative_gallery_init_id ON public.index_initiative_gallery(initiative_id);

-- Enable RLS
ALTER TABLE public.index_initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.index_initiative_gallery ENABLE ROW LEVEL SECURITY;

-- RLS Policies for index_initiatives
CREATE POLICY "Public can view published initiatives"
  ON public.index_initiatives
  FOR SELECT
  USING (status = 'Published' AND is_deleted = false);

CREATE POLICY "Admins can manage initiatives"
  ON public.index_initiatives
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.slug IN ('super-admin', 'admin')
    )
  );

-- RLS Policies for index_initiative_gallery
CREATE POLICY "Public can view published initiative gallery items"
  ON public.index_initiative_gallery
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.index_initiatives ii
      WHERE ii.id = index_initiative_gallery.initiative_id
        AND ii.status = 'Published'
        AND ii.is_deleted = false
    )
  );

CREATE POLICY "Admins can manage initiative gallery items"
  ON public.index_initiative_gallery
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.slug IN ('super-admin', 'admin')
    )
  );
