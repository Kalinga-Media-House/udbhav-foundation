-- ==============================================================================
-- IMPACT GALLERY & INDEX PROGRAMMES SCHEMA FOR UDBHAV FOUNDATION
-- Connects 11 Index Programmes -> Events -> Event Photos -> Gallery
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.index_programmes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('Education', 'Environment', 'Health', 'Community')),
  icon TEXT,
  accent_color TEXT DEFAULT '#439B25',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  programme_id UUID NOT NULL REFERENCES public.index_programmes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  location TEXT NOT NULL,
  event_date DATE NOT NULL,
  start_time TEXT,
  end_time TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.event_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  title TEXT NOT NULL,
  caption TEXT,
  alt_text TEXT NOT NULL,
  photographer_name TEXT,
  display_order INTEGER DEFAULT 0,
  aspect_ratio TEXT DEFAULT 'landscape' CHECK (aspect_ratio IN ('landscape', 'portrait', 'square')),
  is_cover BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  is_approved BOOLEAN DEFAULT true,
  show_in_gallery BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for fast gallery relational queries
CREATE INDEX IF NOT EXISTS idx_events_programme_id ON public.events(programme_id);
CREATE INDEX IF NOT EXISTS idx_event_photos_event_id ON public.event_photos(event_id);
CREATE INDEX IF NOT EXISTS idx_event_photos_gallery_visible ON public.event_photos(is_published, is_approved, show_in_gallery);

-- Enable Row Level Security
ALTER TABLE public.index_programmes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_photos ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public read access for index_programmes"
  ON public.index_programmes FOR SELECT
  USING (true);

CREATE POLICY "Public read access for events"
  ON public.events FOR SELECT
  USING (true);

CREATE POLICY "Public read access for published approved event_photos"
  ON public.event_photos FOR SELECT
  USING (is_published = true AND is_approved = true AND show_in_gallery = true);
