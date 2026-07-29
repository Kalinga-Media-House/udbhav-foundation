-- Migration: 006_media_storage.sql
-- Description: Centralized enterprise media and asset management mapping to Cloudflare R2.
-- Dependencies: 001_extensions.sql, 002_auth_foundation.sql, 004_profiles.sql, 005_audit_logs.sql

BEGIN;

-------------------------------------------------------------------------------
-- 1. ENUMS
-------------------------------------------------------------------------------

CREATE TYPE public.media_type AS ENUM (
    'image',
    'video',
    'audio',
    'pdf',
    'document',
    'spreadsheet',
    'presentation',
    'archive',
    'other'
);

CREATE TYPE public.media_visibility AS ENUM (
    'public',
    'members',
    'private',
    'hidden'
);

CREATE TYPE public.media_status AS ENUM (
    'uploading',
    'processing',
    'ready',
    'archived',
    'deleted',
    'failed'
);

-------------------------------------------------------------------------------
-- 2. TABLES
-------------------------------------------------------------------------------

-- 2.1 MEDIA FILES
CREATE TABLE IF NOT EXISTS public.media_files (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    -- Ownership
    uploader_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Cloudflare R2 Mapping
    r2_object_key text NOT NULL UNIQUE,
    bucket_name text NOT NULL,
    folder_path text DEFAULT '/',
    
    -- File Properties
    original_filename text NOT NULL,
    stored_filename text NOT NULL,
    extension text,
    mime_type text NOT NULL,
    type public.media_type NOT NULL DEFAULT 'other',
    file_size bigint NOT NULL CHECK (file_size >= 0),
    checksum text, -- MD5 or SHA256 of the file for integrity
    
    -- URLs
    cdn_url text,      -- The permanent public URL (if public)
    preview_url text,  -- Watermarked or lower quality preview
    thumbnail_url text,-- Tiny representation (e.g. 150x150)
    
    -- Media Dimensions / Context
    width integer,
    height integer,
    duration numeric, -- For audio/video in seconds
    
    -- Presentation Metadata
    alt_text text,
    caption text,
    description text,
    tags jsonb DEFAULT '[]'::jsonb,
    metadata jsonb DEFAULT '{}'::jsonb, -- EXIF, Camera, Location, Language etc.
    
    -- System State
    status public.media_status NOT NULL DEFAULT 'ready',
    visibility public.media_visibility NOT NULL DEFAULT 'public',
    version integer NOT NULL DEFAULT 1,
    search_vector tsvector,
    
    -- Audit fields
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    
    -- Soft Delete
    is_deleted boolean NOT NULL DEFAULT false,
    deleted_at timestamp with time zone,
    deleted_by uuid
);

COMMENT ON TABLE public.media_files IS 'Metadata registry for physical assets stored in Cloudflare R2.';
COMMENT ON COLUMN public.media_files.r2_object_key IS 'The exact S3/R2 path key used to fetch the object.';

-- 2.2 MEDIA COLLECTIONS (Albums, Folders)
CREATE TABLE IF NOT EXISTS public.media_collections (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    parent_id uuid REFERENCES public.media_collections(id) ON DELETE CASCADE,
    name text NOT NULL,
    slug extensions.citext NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9_-]+$'),
    description text,
    
    cover_image_id uuid REFERENCES public.media_files(id) ON DELETE SET NULL,
    visibility public.media_visibility NOT NULL DEFAULT 'public',
    sort_order integer NOT NULL DEFAULT 0,
    
    -- Audit fields
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    
    -- Soft Delete
    is_deleted boolean NOT NULL DEFAULT false,
    deleted_at timestamp with time zone,
    deleted_by uuid
);

COMMENT ON TABLE public.media_collections IS 'Hierarchical albums or folders for organizing media assets.';

-- 2.3 COLLECTION ITEMS
CREATE TABLE IF NOT EXISTS public.media_collection_items (
    collection_id uuid NOT NULL REFERENCES public.media_collections(id) ON DELETE CASCADE,
    media_id uuid NOT NULL REFERENCES public.media_files(id) ON DELETE CASCADE,
    
    sort_order integer NOT NULL DEFAULT 0,
    is_primary boolean NOT NULL DEFAULT false,
    
    created_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    
    PRIMARY KEY (collection_id, media_id)
);

-- 2.4 GENERIC ENTITY ATTACHMENTS (Polymorphic Media mapping)
CREATE TABLE IF NOT EXISTS public.entity_media (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    entity_type text NOT NULL, -- e.g., 'event', 'program', 'news'
    entity_id uuid NOT NULL,
    media_id uuid NOT NULL REFERENCES public.media_files(id) ON DELETE CASCADE,
    
    purpose text, -- e.g., 'hero', 'gallery', 'document', 'logo'
    display_order integer NOT NULL DEFAULT 0,
    is_primary boolean NOT NULL DEFAULT false,
    
    created_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    
    -- Enforce uniqueness so an entity can't attach the exact same media with the exact same purpose twice
    UNIQUE (entity_type, entity_id, media_id, purpose)
);

COMMENT ON TABLE public.entity_media IS 'Generic attachment table allowing any domain entity (events, programs) to bind media without junction tables per feature.';

-------------------------------------------------------------------------------
-- 3. INDEXES
-------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_media_files_uploader ON public.media_files(uploader_id);
CREATE INDEX IF NOT EXISTS idx_media_files_status ON public.media_files(status);
CREATE INDEX IF NOT EXISTS idx_media_files_visibility ON public.media_files(visibility);
CREATE INDEX IF NOT EXISTS idx_media_files_folder ON public.media_files(folder_path);
CREATE INDEX IF NOT EXISTS idx_media_files_type ON public.media_files(type);

CREATE INDEX IF NOT EXISTS idx_media_collections_parent ON public.media_collections(parent_id);

CREATE INDEX IF NOT EXISTS idx_entity_media_entity ON public.entity_media(entity_type, entity_id);

-- GIN Indexes for metadata/tags/search
CREATE INDEX IF NOT EXISTS idx_media_files_tags ON public.media_files USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_media_files_metadata ON public.media_files USING GIN (metadata);
CREATE INDEX IF NOT EXISTS idx_media_files_search_vector ON public.media_files USING GIN (search_vector);

-------------------------------------------------------------------------------
-- 4. TRIGGERS & FUNCTIONS
-------------------------------------------------------------------------------

-- 4.1 Maintain Full-Text Search Vector
CREATE OR REPLACE FUNCTION public.maintain_media_search_vector()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.original_filename, ''))), 'A') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.caption, ''))), 'A') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.alt_text, ''))), 'B') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.description, ''))), 'C');
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_media_search_vector 
BEFORE INSERT OR UPDATE OF original_filename, caption, alt_text, description 
ON public.media_files 
FOR EACH ROW EXECUTE FUNCTION public.maintain_media_search_vector();


-- 4.2 Standard Timestamps & Auditing
CREATE TRIGGER trg_media_updated_at BEFORE UPDATE ON public.media_files FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_media_audit BEFORE INSERT OR UPDATE ON public.media_files FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();
CREATE TRIGGER trg_media_soft_delete BEFORE DELETE ON public.media_files FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

CREATE TRIGGER trg_media_collections_updated_at BEFORE UPDATE ON public.media_collections FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_media_collections_audit BEFORE INSERT OR UPDATE ON public.media_collections FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();
CREATE TRIGGER trg_media_collections_soft_delete BEFORE DELETE ON public.media_collections FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

-- 4.3 Activity Audit Logging (Migration 005 Integration)
CREATE TRIGGER trg_media_activity_log
AFTER INSERT OR UPDATE OR DELETE ON public.media_files
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_handler();

COMMIT;
