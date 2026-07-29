-- Migration: 010_programs.sql
-- Description: Enterprise Programs Foundation. Programs represent long-running UDBHAV initiatives.
-- Dependencies: 001_extensions, 002_auth, 004_profiles, 005_audit, 006_media, 007_taxonomy

BEGIN;

-------------------------------------------------------------------------------
-- 1. ENUMS
-------------------------------------------------------------------------------

CREATE TYPE public.program_status AS ENUM (
    'draft',
    'upcoming',
    'active',
    'paused',
    'completed',
    'archived',
    'cancelled'
);

CREATE TYPE public.program_visibility AS ENUM (
    'public',
    'private',
    'members',
    'internal'
);

CREATE TYPE public.program_type AS ENUM (
    'Education',
    'Healthcare',
    'Environment',
    'Community',
    'Youth',
    'Women',
    'Research',
    'Training',
    'Campaign',
    'Fundraising',
    'Emergency',
    'General'
);

CREATE TYPE public.program_role AS ENUM (
    'Program Lead',
    'Coordinator',
    'Volunteer',
    'Member',
    'Advisor',
    'Partner'
);

CREATE TYPE public.partner_type AS ENUM (
    'NGO',
    'Government',
    'Corporate',
    'Educational Institution',
    'Individual',
    'Sponsor'
);

-------------------------------------------------------------------------------
-- 2. TABLES
-------------------------------------------------------------------------------

-- 2.1 PROGRAMS (Core domain entity)
CREATE TABLE IF NOT EXISTS public.programs (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    -- Identity
    program_code extensions.citext NOT NULL UNIQUE CHECK (program_code ~ '^[A-Z0-9-]+$'),
    slug extensions.citext NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9_-]+$'),
    
    -- Content
    title text NOT NULL,
    short_title text,
    short_description text CHECK (char_length(short_description) <= 500),
    full_description text,
    mission text,
    objectives jsonb DEFAULT '[]'::jsonb, -- Array of objective strings
    
    -- State & Classification
    status public.program_status NOT NULL DEFAULT 'draft',
    visibility public.program_visibility NOT NULL DEFAULT 'public',
    program_type public.program_type NOT NULL DEFAULT 'General',
    
    -- Timeline & Geography
    start_date date,
    end_date date,
    location text,
    
    -- Media Integration (Foreign keys to media_files and media_collections)
    cover_image_id uuid REFERENCES public.media_files(id) ON DELETE SET NULL,
    banner_image_id uuid REFERENCES public.media_files(id) ON DELETE SET NULL,
    gallery_id uuid REFERENCES public.media_collections(id) ON DELETE SET NULL,
    
    -- Taxonomy Integration
    -- Note: Many-to-many taxonomy mapping is handled by entity_taxonomies, 
    -- but storing the primary taxonomy term directly helps optimize listing queries.
    primary_taxonomy_id uuid REFERENCES public.taxonomy_terms(id) ON DELETE SET NULL,
    
    -- SEO & Display
    seo_title text,
    seo_description text,
    is_featured boolean NOT NULL DEFAULT false,
    sort_order integer NOT NULL DEFAULT 0,
    
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

COMMENT ON TABLE public.programs IS 'Master record for long-running UDBHAV Foundation initiatives.';
COMMENT ON COLUMN public.programs.program_code IS 'Internal organizational code (e.g., EDU-2026-01).';
COMMENT ON COLUMN public.programs.slug IS 'URL-friendly identifier for public routing.';
COMMENT ON COLUMN public.programs.objectives IS 'Array of strategic objectives for the program.';

-- 2.2 PROGRAM MEMBERS (Internal team tracking)
CREATE TABLE IF NOT EXISTS public.program_members (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    program_id uuid NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    role public.program_role NOT NULL DEFAULT 'Member',
    custom_title text, -- e.g. "Senior Field Coordinator"
    
    start_date date NOT NULL DEFAULT CURRENT_DATE,
    end_date date,
    is_active boolean NOT NULL DEFAULT true,
    
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    
    -- A profile shouldn't hold the exact same role in the exact same program twice
    UNIQUE (program_id, profile_id, role)
);

COMMENT ON TABLE public.program_members IS 'Tracks the staff, volunteers, and advisors running the program.';

-- 2.3 PROGRAM PARTNERS (External entities involved)
CREATE TABLE IF NOT EXISTS public.program_partners (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    program_id uuid NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
    partner_type public.partner_type NOT NULL DEFAULT 'NGO',
    
    name text NOT NULL,
    website text CHECK (website ~ '^https?://.*'),
    contact_email extensions.citext,
    contact_phone text,
    
    logo_id uuid REFERENCES public.media_files(id) ON DELETE SET NULL,
    description text,
    
    contribution_details text,
    is_active boolean NOT NULL DEFAULT true,
    sort_order integer NOT NULL DEFAULT 0,
    
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.program_partners IS 'Tracks external organizations or sponsors affiliated with a program.';

-------------------------------------------------------------------------------
-- 3. INDEXES
-------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_programs_code ON public.programs(program_code);
CREATE INDEX IF NOT EXISTS idx_programs_slug ON public.programs(slug);
CREATE INDEX IF NOT EXISTS idx_programs_status ON public.programs(status);
CREATE INDEX IF NOT EXISTS idx_programs_type ON public.programs(program_type);
CREATE INDEX IF NOT EXISTS idx_programs_featured ON public.programs(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_programs_search ON public.programs USING GIN (search_vector);

CREATE INDEX IF NOT EXISTS idx_program_members_program ON public.program_members(program_id);
CREATE INDEX IF NOT EXISTS idx_program_members_profile ON public.program_members(profile_id);
CREATE INDEX IF NOT EXISTS idx_program_members_active ON public.program_members(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_program_partners_program ON public.program_partners(program_id);

-------------------------------------------------------------------------------
-- 4. TRIGGERS
-------------------------------------------------------------------------------

-- 4.1 Maintain Full-Text Search Vector
CREATE OR REPLACE FUNCTION public.maintain_programs_search_vector()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.title, ''))), 'A') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.short_title, ''))), 'A') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.program_code, ''))), 'B') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.short_description, ''))), 'B') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.mission, ''))), 'C') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.location, ''))), 'C');
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_programs_search_vector 
BEFORE INSERT OR UPDATE OF title, short_title, program_code, short_description, mission, location 
ON public.programs 
FOR EACH ROW EXECUTE FUNCTION public.maintain_programs_search_vector();

-- 4.2 Standard Timestamps & Audit
CREATE TRIGGER trg_programs_updated_at BEFORE UPDATE ON public.programs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_programs_audit BEFORE INSERT OR UPDATE ON public.programs FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();
CREATE TRIGGER trg_programs_soft_delete BEFORE DELETE ON public.programs FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

CREATE TRIGGER trg_program_members_updated_at BEFORE UPDATE ON public.program_members FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_program_members_audit BEFORE INSERT OR UPDATE ON public.program_members FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();

CREATE TRIGGER trg_program_partners_updated_at BEFORE UPDATE ON public.program_partners FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_program_partners_audit BEFORE INSERT OR UPDATE ON public.program_partners FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();

-- 4.3 Centralized Activity Logging (Migration 005 Integration)
CREATE TRIGGER trg_programs_activity_log AFTER INSERT OR UPDATE OR DELETE ON public.programs FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_handler();
CREATE TRIGGER trg_program_members_activity_log AFTER INSERT OR UPDATE OR DELETE ON public.program_members FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_handler();
CREATE TRIGGER trg_program_partners_activity_log AFTER INSERT OR UPDATE OR DELETE ON public.program_partners FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_handler();

-------------------------------------------------------------------------------
-- 5. HELPER FUNCTIONS
-------------------------------------------------------------------------------

-- Purpose: Check if a program exists by slug (excluding deleted).
-- Volatility: STABLE
CREATE OR REPLACE FUNCTION public.program_exists(p_slug extensions.citext)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.programs 
    WHERE slug = p_slug AND is_deleted = false
  );
$$;

-- Purpose: Auto-generate a safe slug from a title if one isn't provided.
-- Usage: Called from application tier during insert if slug is empty.
CREATE OR REPLACE FUNCTION public.generate_program_slug(p_title text)
RETURNS extensions.citext
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_slug extensions.citext;
  v_counter integer := 1;
BEGIN
  -- Convert to lowercase, replace non-alphanumeric with hyphens, trim multiple hyphens
  v_slug := lower(regexp_replace(regexp_replace(p_title, '[^a-zA-Z0-9]+', '-', 'g'), '^-+|-+$', '', 'g'));
  
  -- Handle collisions
  WHILE public.program_exists(v_slug) LOOP
    v_slug := lower(regexp_replace(regexp_replace(p_title, '[^a-zA-Z0-9]+', '-', 'g'), '^-+|-+$', '', 'g')) || '-' || v_counter;
    v_counter := v_counter + 1;
  END LOOP;
  
  RETURN v_slug;
END;
$$;

-- Purpose: Return basic high-level stats about a program (members, partners count).
-- Extensible for later when Events and Volunteers are mapped to Programs.
CREATE OR REPLACE FUNCTION public.program_statistics(p_program_id uuid)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT json_build_object(
    'total_members', (SELECT count(*) FROM public.program_members WHERE program_id = p_program_id AND is_active = true),
    'total_partners', (SELECT count(*) FROM public.program_partners WHERE program_id = p_program_id AND is_active = true)
  )::jsonb;
$$;

-- Purpose: Simple transition helper to safely update program status and ensure audit triggers fire.
CREATE OR REPLACE FUNCTION public.update_program_status(p_program_id uuid, p_new_status public.program_status)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.programs
  SET status = p_new_status
  WHERE id = p_program_id AND is_deleted = false;
END;
$$;

COMMIT;
