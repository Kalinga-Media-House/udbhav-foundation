-- Migration: 013_news_stories.sql
-- Description: Enterprise News, Stories, and Content Management Module.
-- Dependencies: 001_extensions, 002_auth, 004_profiles, 005_audit, 006_media, 007_taxonomy, 009_notifications, 010_programs, 011_events

BEGIN;

-------------------------------------------------------------------------------
-- 1. ENUMS
-------------------------------------------------------------------------------

CREATE TYPE public.article_type AS ENUM (
    'News',
    'Story',
    'Success Story',
    'Press Release',
    'Announcement',
    'Blog',
    'Interview',
    'Opinion',
    'Campaign',
    'Report',
    'General'
);

CREATE TYPE public.article_status AS ENUM (
    'Draft',
    'In Review',
    'Approved',
    'Scheduled',
    'Published',
    'Archived',
    'Rejected'
);

CREATE TYPE public.article_role AS ENUM (
    'Primary Author',
    'Co-author',
    'Editor',
    'Reviewer',
    'Photographer',
    'Contributor'
);

CREATE TYPE public.featured_collection_type AS ENUM (
    'Homepage',
    'Programs',
    'Events',
    'Volunteers',
    'Campaigns'
);

-------------------------------------------------------------------------------
-- 2. TABLES
-------------------------------------------------------------------------------

-- 2.1 NEWS & STORIES (Core Content Entity)
CREATE TABLE IF NOT EXISTS public.news_articles (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    -- Identity
    article_code citext NOT NULL UNIQUE CHECK (article_code ~ '^[A-Z0-9-]+$'),
    slug citext NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9_-]+$'),
    
    -- Content
    title text NOT NULL,
    subtitle text,
    excerpt text CHECK (char_length(excerpt) <= 1000),
    content text NOT NULL, -- Rich Text / Markdown
    content_html text,     -- Optional pre-rendered HTML for performance
    
    -- State & Classification
    article_type public.article_type NOT NULL DEFAULT 'News',
    status public.article_status NOT NULL DEFAULT 'Draft',
    visibility public.program_visibility NOT NULL DEFAULT 'public', -- Reusing program_visibility from 010
    
    -- Flags
    is_featured boolean NOT NULL DEFAULT false,
    is_pinned boolean NOT NULL DEFAULT false,
    allow_comments boolean NOT NULL DEFAULT false,
    
    -- Lifecycle
    reading_time integer DEFAULT 0, -- In minutes
    published_at timestamp with time zone,
    scheduled_at timestamp with time zone,
    expires_at timestamp with time zone,
    
    -- Relationships
    program_id uuid REFERENCES public.programs(id) ON DELETE SET NULL,
    event_id uuid REFERENCES public.events(id) ON DELETE SET NULL,
    
    -- Core Workflow Links (Detailed authors in article_authors)
    author_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    editor_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewer_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    
    -- Media Integration
    cover_image_id uuid REFERENCES public.media_files(id) ON DELETE SET NULL,
    banner_image_id uuid REFERENCES public.media_files(id) ON DELETE SET NULL,
    gallery_id uuid REFERENCES public.media_collections(id) ON DELETE SET NULL,
    
    -- SEO & Social
    seo_title text,
    seo_description text,
    seo_keywords text[],
    canonical_url text CHECK (canonical_url ~ '^https?://.*' OR canonical_url IS NULL),
    open_graph_image_id uuid REFERENCES public.media_files(id) ON DELETE SET NULL,
    
    -- Search & Extensibility
    search_vector tsvector,
    metadata jsonb DEFAULT '{}'::jsonb,
    
    -- Audit & Timestamps
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    
    -- Soft Delete
    is_deleted boolean NOT NULL DEFAULT false,
    deleted_at timestamp with time zone,
    deleted_by uuid
);

COMMENT ON TABLE public.news_articles IS 'Master record for news, blogs, press releases, and stories.';
COMMENT ON COLUMN public.news_articles.article_code IS 'Internal tracking code (e.g. NWS-2026-1042).';
COMMENT ON COLUMN public.news_articles.reading_time IS 'Estimated reading time in minutes.';

-- 2.2 ARTICLE AUTHORS (M:N for Collaborative Articles)
CREATE TABLE IF NOT EXISTS public.article_authors (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    article_id uuid NOT NULL REFERENCES public.news_articles(id) ON DELETE CASCADE,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    role public.article_role NOT NULL DEFAULT 'Contributor',
    sort_order integer NOT NULL DEFAULT 0,
    
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    
    UNIQUE (article_id, profile_id, role)
);

COMMENT ON TABLE public.article_authors IS 'Allows multiple profiles to be credited for a single article.';

-- 2.3 FEATURED COLLECTIONS (Curated lists for specific UI sections)
CREATE TABLE IF NOT EXISTS public.featured_articles (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    article_id uuid NOT NULL REFERENCES public.news_articles(id) ON DELETE CASCADE,
    collection public.featured_collection_type NOT NULL DEFAULT 'Homepage',
    
    display_order integer NOT NULL DEFAULT 0,
    priority integer NOT NULL DEFAULT 0,
    
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    
    UNIQUE (article_id, collection)
);

COMMENT ON TABLE public.featured_articles IS 'Curated mapping of articles to specific featured blocks in the frontend.';

-- 2.4 RELATED ARTICLES (Manual / Override linking)
CREATE TABLE IF NOT EXISTS public.related_articles (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    source_article_id uuid NOT NULL REFERENCES public.news_articles(id) ON DELETE CASCADE,
    target_article_id uuid NOT NULL REFERENCES public.news_articles(id) ON DELETE CASCADE,
    
    relationship_type text DEFAULT 'Manual',
    sort_order integer NOT NULL DEFAULT 0,
    
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    
    CHECK (source_article_id != target_article_id),
    UNIQUE (source_article_id, target_article_id)
);

COMMENT ON TABLE public.related_articles IS 'Explicit links between articles to form "Read Next" or series lists.';

-------------------------------------------------------------------------------
-- 3. INDEXES
-------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_news_articles_code ON public.news_articles(article_code);
CREATE INDEX IF NOT EXISTS idx_news_articles_slug ON public.news_articles(slug);
CREATE INDEX IF NOT EXISTS idx_news_articles_status ON public.news_articles(status);
CREATE INDEX IF NOT EXISTS idx_news_articles_type ON public.news_articles(article_type);
CREATE INDEX IF NOT EXISTS idx_news_articles_published ON public.news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_search ON public.news_articles USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_news_articles_program ON public.news_articles(program_id);
CREATE INDEX IF NOT EXISTS idx_news_articles_event ON public.news_articles(event_id);

CREATE INDEX IF NOT EXISTS idx_article_authors_article ON public.article_authors(article_id);
CREATE INDEX IF NOT EXISTS idx_article_authors_profile ON public.article_authors(profile_id);

CREATE INDEX IF NOT EXISTS idx_featured_articles_collection ON public.featured_articles(collection);

CREATE INDEX IF NOT EXISTS idx_related_articles_source ON public.related_articles(source_article_id);

-------------------------------------------------------------------------------
-- 4. TRIGGERS
-------------------------------------------------------------------------------

-- 4.1 Auto-Calculate Reading Time
CREATE OR REPLACE FUNCTION public.calculate_reading_time()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_word_count integer;
  v_wpm integer := 200; -- Standard words per minute
BEGIN
  IF NEW.content IS NOT NULL THEN
    -- Very rough word count estimation
    v_word_count := array_length(regexp_split_to_array(trim(regexp_replace(NEW.content, E'\\s+', ' ', 'g')), E'\\s+'), 1);
    NEW.reading_time := GREATEST(1, CEIL(v_word_count::numeric / v_wpm::numeric));
  ELSE
    NEW.reading_time := 0;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_news_articles_reading_time 
BEFORE INSERT OR UPDATE OF content ON public.news_articles 
FOR EACH ROW EXECUTE FUNCTION public.calculate_reading_time();

-- 4.2 Maintain Full-Text Search Vector
CREATE OR REPLACE FUNCTION public.maintain_news_articles_search_vector()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.title, ''))), 'A') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.subtitle, ''))), 'B') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.seo_keywords::text, ''))), 'B') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.excerpt, ''))), 'C') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.content, ''))), 'D');
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_news_articles_search_vector 
BEFORE INSERT OR UPDATE OF title, subtitle, seo_keywords, excerpt, content 
ON public.news_articles 
FOR EACH ROW EXECUTE FUNCTION public.maintain_news_articles_search_vector();

-- 4.3 Standard Timestamps & Audits
CREATE TRIGGER trg_news_articles_updated_at BEFORE UPDATE ON public.news_articles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_news_articles_audit BEFORE INSERT OR UPDATE ON public.news_articles FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();
CREATE TRIGGER trg_news_articles_soft_delete BEFORE DELETE ON public.news_articles FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

CREATE TRIGGER trg_article_authors_updated_at BEFORE UPDATE ON public.article_authors FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_article_authors_audit BEFORE INSERT OR UPDATE ON public.article_authors FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();

CREATE TRIGGER trg_featured_articles_updated_at BEFORE UPDATE ON public.featured_articles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_featured_articles_audit BEFORE INSERT OR UPDATE ON public.featured_articles FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();

CREATE TRIGGER trg_related_articles_updated_at BEFORE UPDATE ON public.related_articles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_related_articles_audit BEFORE INSERT OR UPDATE ON public.related_articles FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();

-- 4.4 Centralized Activity Logging
CREATE TRIGGER trg_news_articles_activity_log AFTER INSERT OR UPDATE OR DELETE ON public.news_articles FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_handler();
CREATE TRIGGER trg_article_authors_activity_log AFTER INSERT OR UPDATE OR DELETE ON public.article_authors FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_handler();


-------------------------------------------------------------------------------
-- 5. HELPER FUNCTIONS
-------------------------------------------------------------------------------

-- Purpose: Auto-generate a safe slug from a title if one isn't provided.
CREATE OR REPLACE FUNCTION public.generate_article_slug(p_title text)
RETURNS citext
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_slug citext;
  v_counter integer := 1;
BEGIN
  v_slug := lower(regexp_replace(regexp_replace(p_title, '[^a-zA-Z0-9]+', '-', 'g'), '^-+|-+$', '', 'g'));
  WHILE EXISTS (SELECT 1 FROM public.news_articles WHERE slug = v_slug AND is_deleted = false) LOOP
    v_slug := lower(regexp_replace(regexp_replace(p_title, '[^a-zA-Z0-9]+', '-', 'g'), '^-+|-+$', '', 'g')) || '-' || v_counter;
    v_counter := v_counter + 1;
  END LOOP;
  RETURN v_slug;
END;
$$;

-- Purpose: Safe transition to 'Published' state, handling timestamps.
CREATE OR REPLACE FUNCTION public.publish_article(p_article_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.news_articles
  SET 
    status = 'Published',
    published_at = COALESCE(published_at, now())
  WHERE id = p_article_id AND is_deleted = false;
END;
$$;

-- Purpose: Fetch related articles (combining Manual links + Taxonomy matches).
-- Used to render "Read Next" on article pages.
CREATE OR REPLACE FUNCTION public.get_related_articles(p_article_id uuid, p_limit integer DEFAULT 3)
RETURNS TABLE (
    article_id uuid,
    title text,
    slug citext,
    cover_image_id uuid,
    published_at timestamp with time zone,
    match_reason text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  -- 1. Explicit Manual Links
  SELECT 
    na.id AS article_id, na.title, na.slug, na.cover_image_id, na.published_at, 'Manual' AS match_reason
  FROM public.related_articles ra
  JOIN public.news_articles na ON ra.target_article_id = na.id
  WHERE ra.source_article_id = p_article_id 
    AND na.status = 'Published' 
    AND na.is_deleted = false
  
  UNION ALL
  
  -- 2. Same Program matches
  SELECT 
    na.id AS article_id, na.title, na.slug, na.cover_image_id, na.published_at, 'Program' AS match_reason
  FROM public.news_articles source
  JOIN public.news_articles na ON source.program_id = na.program_id
  WHERE source.id = p_article_id
    AND na.id != p_article_id
    AND na.status = 'Published'
    AND na.is_deleted = false
    AND source.program_id IS NOT NULL
  
  ORDER BY match_reason ASC, published_at DESC
  LIMIT p_limit;
$$;

-- Purpose: Basic statistics for an author's dashboard.
CREATE OR REPLACE FUNCTION public.author_statistics(p_author_id uuid)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT jsonb_build_object(
    'total_published', (SELECT count(*) FROM public.news_articles WHERE author_id = p_author_id AND status = 'Published' AND is_deleted = false),
    'in_review', (SELECT count(*) FROM public.news_articles WHERE author_id = p_author_id AND status = 'In Review' AND is_deleted = false)
  );
$$;

COMMIT;
