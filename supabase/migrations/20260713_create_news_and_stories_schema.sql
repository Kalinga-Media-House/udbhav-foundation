-- ==============================================================================
-- NEWS & STORIES, EVENTS, IMPACT STORIES & PODCAST PLATFORM SCHEMA
-- UDBHAV FOUNDATION
-- Connects Index Programmes -> Events -> News Posts -> Photos & Podcasts
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  link_url TEXT,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('normal', 'high')),
  is_published BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.upcoming_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  programme_id UUID REFERENCES public.index_programmes(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  location TEXT NOT NULL,
  event_date DATE NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT,
  registration_status TEXT DEFAULT 'Registration Open' CHECK (
    registration_status IN (
      'Registration Open',
      'Coming Soon',
      'Registration Closing Soon',
      'Registration Closed',
      'Completed',
      'Cancelled'
    )
  ),
  registration_deadline DATE,
  registration_url TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.news_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  programme_id UUID REFERENCES public.index_programmes(id) ON DELETE SET NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image_url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (
    category IN (
      'Daily Updates',
      'Programme Activities',
      'Announcements',
      'Achievements',
      'Community Stories',
      'Media Coverage'
    )
  ),
  location TEXT NOT NULL,
  activity_date DATE NOT NULL,
  activity_time TEXT,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reading_time TEXT DEFAULT '3 min read',
  author TEXT DEFAULT 'UDBHAV Foundation',
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'under_review', 'scheduled', 'published', 'archived')),
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.impact_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  programme_id UUID REFERENCES public.index_programmes(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  person_name TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT NOT NULL,
  location TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'under_review', 'published', 'archived')),
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.podcast_guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  profile_photo_url TEXT NOT NULL,
  role TEXT NOT NULL,
  achievement TEXT NOT NULL,
  biography TEXT,
  social_impact TEXT,
  udbhav_contribution TEXT,
  consent_to_publish BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.podcast_episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  guest_id UUID REFERENCES public.podcast_guests(id) ON DELETE SET NULL,
  duration TEXT NOT NULL,
  release_date DATE NOT NULL,
  youtube_url TEXT, -- Primary video URL for YouTube-only podcast platform
  spotify_url TEXT, -- DEPRECATED: audio platform removed from UI
  apple_podcast_url TEXT, -- DEPRECATED: audio platform removed from UI
  topics TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'scheduled', 'published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upcoming_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.podcast_guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.podcast_episodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for published announcements"
  ON public.announcements FOR SELECT USING (is_published = true);

CREATE POLICY "Public read access for published upcoming events"
  ON public.upcoming_events FOR SELECT USING (is_published = true);

CREATE POLICY "Public read access for published news posts"
  ON public.news_posts FOR SELECT USING (status = 'published');

CREATE POLICY "Public read access for published impact stories"
  ON public.impact_stories FOR SELECT USING (status = 'published');

CREATE POLICY "Public read access for podcast guests with consent"
  ON public.podcast_guests FOR SELECT USING (consent_to_publish = true);

CREATE POLICY "Public read access for published podcast episodes"
  ON public.podcast_episodes FOR SELECT USING (status = 'published');
