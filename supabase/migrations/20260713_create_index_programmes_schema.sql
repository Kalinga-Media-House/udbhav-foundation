-- Migration: Create UDBHAV Foundation Index Programmes Schema
-- Note: Prepared for review. Do not execute automatically.

CREATE TABLE IF NOT EXISTS public.programmes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  programme_number TEXT NOT NULL UNIQUE, -- e.g. '01', '02', ...
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT,
  category TEXT NOT NULL CHECK (category IN ('Education', 'Environment', 'Health & Well-being', 'Awareness & Safety', 'Community Support')),
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  cover_image_url TEXT NOT NULL,
  accent_color TEXT DEFAULT '#202B78',
  partner_text TEXT,
  impact_preview TEXT,
  purpose TEXT,
  community_need TEXT,
  approach TEXT,
  target_beneficiaries TEXT[] DEFAULT '{}',
  major_activities TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.programme_impacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  programme_id UUID NOT NULL REFERENCES public.programmes(id) ON DELETE CASCADE,
  impact_label TEXT NOT NULL,
  impact_value TEXT NOT NULL,
  impact_icon TEXT,
  display_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.programme_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  programme_id UUID NOT NULL REFERENCES public.programmes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  full_description TEXT,
  cover_image_url TEXT NOT NULL,
  location TEXT NOT NULL,
  venue TEXT,
  event_date DATE NOT NULL,
  start_time TEXT,
  end_time TEXT,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('upcoming', 'completed')),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.programme_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  programme_id UUID NOT NULL REFERENCES public.programmes(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.programme_events(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  location TEXT,
  photo_date DATE,
  photo_time TEXT,
  photographer_name TEXT,
  alt_text TEXT NOT NULL,
  display_order INTEGER DEFAULT 1,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance and automatic Gallery joins
CREATE INDEX IF NOT EXISTS idx_programmes_slug ON public.programmes(slug);
CREATE INDEX IF NOT EXISTS idx_programmes_category ON public.programmes(category);
CREATE INDEX IF NOT EXISTS idx_programme_events_programme_id ON public.programme_events(programme_id);
CREATE INDEX IF NOT EXISTS idx_programme_photos_programme_id ON public.programme_photos(programme_id);
CREATE INDEX IF NOT EXISTS idx_programme_photos_event_id ON public.programme_photos(event_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.programmes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programme_impacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programme_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programme_photos ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Allow public read access to published programmes" ON public.programmes FOR SELECT USING (status = 'published');
CREATE POLICY "Allow public read access to programme impacts" ON public.programme_impacts FOR SELECT USING (true);
CREATE POLICY "Allow public read access to programme events" ON public.programme_events FOR SELECT USING (true);
CREATE POLICY "Allow public read access to programme photos" ON public.programme_photos FOR SELECT USING (true);
