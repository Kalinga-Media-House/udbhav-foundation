-- Migration: 014_gallery_foundation.sql
-- Description: Enterprise Gallery Module for organizing media files into albums and collections.
-- Dependencies: 001_extensions, 002_auth, 004_profiles, 005_audit, 006_media, 007_taxonomy, 010_programs, 011_events, 012_volunteer_management, 013_news_stories

BEGIN;

-------------------------------------------------------------------------------
-- 1. ENUMS
-------------------------------------------------------------------------------

CREATE TYPE public.album_type AS ENUM (
    'General',
    'Program',
    'Event',
    'Volunteer',
    'News',
    'Campaign',
    'Press',
    'Annual Report',
    'Featured',
    'Video',
    'Photo',
    'Mixed'
);

CREATE TYPE public.album_status AS ENUM (
    'Draft',
    'Published',
    'Archived',
    'Hidden'
);

CREATE TYPE public.album_visibility AS ENUM (
    'Public',
    'Members',
    'Private',
    'Internal'
);

CREATE TYPE public.featured_gallery_type AS ENUM (
    'Homepage',
    'Programs',
    'Events',
    'News',
    'Volunteers',
    'Campaigns'
);

-------------------------------------------------------------------------------
-- 2. TABLES
-------------------------------------------------------------------------------

-- 2.1 GALLERY ALBUMS (Curated collections of media)
CREATE TABLE IF NOT EXISTS public.gallery_albums (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    -- Identity
    album_code extensions.citext NOT NULL UNIQUE CHECK (album_code ~ '^[A-Z0-9-]+$'),
    slug extensions.citext NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9_-]+$'),
    
    -- Content
    title text NOT NULL,
    subtitle text,
    description text,
    
    -- Classification & State
    album_type public.album_type NOT NULL DEFAULT 'General',
    status public.album_status NOT NULL DEFAULT 'Draft',
    visibility public.album_visibility NOT NULL DEFAULT 'Public',
    
    -- Media Defaults
    cover_image_id uuid REFERENCES public.media_files(id) ON DELETE SET NULL,
    thumbnail_id uuid REFERENCES public.media_files(id) ON DELETE SET NULL,
    
    -- High-Level Integration
    program_id uuid REFERENCES public.programs(id) ON DELETE SET NULL,
    event_id uuid REFERENCES public.events(id) ON DELETE SET NULL,
    news_id uuid REFERENCES public.news_articles(id) ON DELETE SET NULL,
    volunteer_id uuid REFERENCES public.volunteers(id) ON DELETE SET NULL,
    
    primary_taxonomy_id uuid REFERENCES public.taxonomy_terms(id) ON DELETE SET NULL,
    
    -- Display Flags
    is_featured boolean NOT NULL DEFAULT false,
    display_order integer NOT NULL DEFAULT 0,
    published_at timestamp with time zone,
    
    -- Search & Metadata
    search_vector tsvector,
    metadata jsonb DEFAULT '{}'::jsonb,
    
    -- Audit
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    
    -- Soft Delete
    is_deleted boolean NOT NULL DEFAULT false,
    deleted_at timestamp with time zone,
    deleted_by uuid
);

COMMENT ON TABLE public.gallery_albums IS 'Top-level albums used to organize media_files for public presentation.';

-- 2.2 GALLERY ITEMS (Mapping Media to Albums with Context)
CREATE TABLE IF NOT EXISTS public.gallery_items (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    album_id uuid NOT NULL REFERENCES public.gallery_albums(id) ON DELETE CASCADE,
    media_file_id uuid NOT NULL REFERENCES public.media_files(id) ON DELETE CASCADE,
    
    -- Item Specific Content
    caption text,
    description text,
    photographer text,
    credits text,
    
    location text,
    captured_at timestamp with time zone,
    
    -- Presentation
    display_order integer NOT NULL DEFAULT 0,
    is_featured boolean NOT NULL DEFAULT false, -- e.g. "Highlight this photo inside the album"
    metadata jsonb DEFAULT '{}'::jsonb,
    
    -- Search Vector (For searching photos directly)
    search_vector tsvector,
    
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    
    UNIQUE (album_id, media_file_id)
);

COMMENT ON TABLE public.gallery_items IS 'Links a specific media_file to an album, allowing album-specific captions and credits.';

-- 2.3 FEATURED GALLERIES (Curated Album lists for specific UI sections)
CREATE TABLE IF NOT EXISTS public.featured_galleries (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    album_id uuid NOT NULL REFERENCES public.gallery_albums(id) ON DELETE CASCADE,
    collection public.featured_gallery_type NOT NULL DEFAULT 'Homepage',
    
    priority integer NOT NULL DEFAULT 0,
    display_order integer NOT NULL DEFAULT 0,
    
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    
    UNIQUE (album_id, collection)
);

COMMENT ON TABLE public.featured_galleries IS 'Maps an entire album to a specific featured UI component (e.g. Homepage Carousel).';

-- 2.4 ALBUM RELATIONSHIPS (Hierarchies and Cross-linking)
CREATE TABLE IF NOT EXISTS public.gallery_relationships (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    parent_album_id uuid NOT NULL REFERENCES public.gallery_albums(id) ON DELETE CASCADE,
    child_album_id uuid NOT NULL REFERENCES public.gallery_albums(id) ON DELETE CASCADE,
    
    relationship_type text DEFAULT 'sub_album',
    display_order integer NOT NULL DEFAULT 0,
    
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    
    CHECK (parent_album_id != child_album_id),
    UNIQUE (parent_album_id, child_album_id)
);

COMMENT ON TABLE public.gallery_relationships IS 'Supports album hierarchies (e.g. "2026 Events" album contains "Blood Drive 2026" album).';

-------------------------------------------------------------------------------
-- 3. INDEXES
-------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_gallery_albums_code ON public.gallery_albums(album_code);
CREATE INDEX IF NOT EXISTS idx_gallery_albums_slug ON public.gallery_albums(slug);
CREATE INDEX IF NOT EXISTS idx_gallery_albums_status ON public.gallery_albums(status);
CREATE INDEX IF NOT EXISTS idx_gallery_albums_type ON public.gallery_albums(album_type);
CREATE INDEX IF NOT EXISTS idx_gallery_albums_search ON public.gallery_albums USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_gallery_albums_program ON public.gallery_albums(program_id);
CREATE INDEX IF NOT EXISTS idx_gallery_albums_event ON public.gallery_albums(event_id);

CREATE INDEX IF NOT EXISTS idx_gallery_items_album ON public.gallery_items(album_id);
CREATE INDEX IF NOT EXISTS idx_gallery_items_media ON public.gallery_items(media_file_id);
CREATE INDEX IF NOT EXISTS idx_gallery_items_search ON public.gallery_items USING GIN (search_vector);

CREATE INDEX IF NOT EXISTS idx_featured_galleries_collection ON public.featured_galleries(collection);

CREATE INDEX IF NOT EXISTS idx_gallery_relationships_parent ON public.gallery_relationships(parent_album_id);

-------------------------------------------------------------------------------
-- 4. TRIGGERS
-------------------------------------------------------------------------------

-- 4.1 Search Vector: Albums
CREATE OR REPLACE FUNCTION public.maintain_gallery_albums_search_vector()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.title, ''))), 'A') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.subtitle, ''))), 'B') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.album_code, ''))), 'B') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.description, ''))), 'C');
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_gallery_albums_search_vector 
BEFORE INSERT OR UPDATE OF title, subtitle, album_code, description 
ON public.gallery_albums 
FOR EACH ROW EXECUTE FUNCTION public.maintain_gallery_albums_search_vector();

-- 4.2 Search Vector: Items (Photos)
CREATE OR REPLACE FUNCTION public.maintain_gallery_items_search_vector()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.caption, ''))), 'A') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.photographer, ''))), 'B') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.location, ''))), 'C') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.description, ''))), 'D');
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_gallery_items_search_vector 
BEFORE INSERT OR UPDATE OF caption, photographer, location, description 
ON public.gallery_items 
FOR EACH ROW EXECUTE FUNCTION public.maintain_gallery_items_search_vector();

-- 4.3 Standard Timestamps & Audits
CREATE TRIGGER trg_gallery_albums_updated_at BEFORE UPDATE ON public.gallery_albums FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_gallery_albums_audit BEFORE INSERT OR UPDATE ON public.gallery_albums FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();
CREATE TRIGGER trg_gallery_albums_soft_delete BEFORE DELETE ON public.gallery_albums FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

CREATE TRIGGER trg_gallery_items_updated_at BEFORE UPDATE ON public.gallery_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_gallery_items_audit BEFORE INSERT OR UPDATE ON public.gallery_items FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();

CREATE TRIGGER trg_featured_galleries_updated_at BEFORE UPDATE ON public.featured_galleries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_featured_galleries_audit BEFORE INSERT OR UPDATE ON public.featured_galleries FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();

CREATE TRIGGER trg_gallery_relationships_updated_at BEFORE UPDATE ON public.gallery_relationships FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_gallery_relationships_audit BEFORE INSERT OR UPDATE ON public.gallery_relationships FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();

-- 4.4 Centralized Activity Logging
CREATE TRIGGER trg_gallery_albums_activity_log AFTER INSERT OR UPDATE OR DELETE ON public.gallery_albums FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_handler();
CREATE TRIGGER trg_gallery_items_activity_log AFTER INSERT OR UPDATE OR DELETE ON public.gallery_items FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_handler();


-------------------------------------------------------------------------------
-- 5. HELPER FUNCTIONS
-------------------------------------------------------------------------------

-- Purpose: Auto-generate a safe slug from a title if one isn't provided.
CREATE OR REPLACE FUNCTION public.generate_album_slug(p_title text)
RETURNS extensions.citext
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_slug extensions.citext;
  v_counter integer := 1;
BEGIN
  v_slug := lower(regexp_replace(regexp_replace(p_title, '[^a-zA-Z0-9]+', '-', 'g'), '^-+|-+$', '', 'g'));
  WHILE EXISTS (SELECT 1 FROM public.gallery_albums WHERE slug = v_slug AND is_deleted = false) LOOP
    v_slug := lower(regexp_replace(regexp_replace(p_title, '[^a-zA-Z0-9]+', '-', 'g'), '^-+|-+$', '', 'g')) || '-' || v_counter;
    v_counter := v_counter + 1;
  END LOOP;
  RETURN v_slug;
END;
$$;

-- Purpose: Get total count of media items in an album
CREATE OR REPLACE FUNCTION public.album_media_count(p_album_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
AS $$
  SELECT count(*)::integer 
  FROM public.gallery_items 
  WHERE album_id = p_album_id;
$$;

-- Purpose: Get total file size (in bytes) of all media in an album
CREATE OR REPLACE FUNCTION public.album_size(p_album_id uuid)
RETURNS bigint
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(SUM(mf.file_size), 0)::bigint
  FROM public.gallery_items gi
  JOIN public.media_files mf ON gi.media_file_id = mf.id
  WHERE gi.album_id = p_album_id;
$$;

-- Purpose: High-level album stats for admin dashboard
CREATE OR REPLACE FUNCTION public.album_statistics(p_album_id uuid)
RETURNS jsonb
LANGUAGE sql
STABLE
AS $$
  SELECT json_build_object(
    'media_count', public.album_media_count(p_album_id),
    'total_size_bytes', public.album_size(p_album_id)
  )::jsonb;
$$;

-- Purpose: Fetch a featured gallery mapped to a specific frontend section
CREATE OR REPLACE FUNCTION public.get_featured_gallery(p_collection public.featured_gallery_type, p_limit integer DEFAULT 5)
RETURNS TABLE (
    album_id uuid,
    title text,
    slug extensions.citext,
    cover_image_id uuid,
    media_count integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    ga.id, ga.title, ga.slug, ga.cover_image_id, public.album_media_count(ga.id)
  FROM public.featured_galleries fg
  JOIN public.gallery_albums ga ON fg.album_id = ga.id
  WHERE fg.collection = p_collection
    AND ga.status = 'Published'
    AND ga.is_deleted = false
  ORDER BY fg.priority DESC, fg.display_order ASC
  LIMIT p_limit;
$$;

COMMIT;
