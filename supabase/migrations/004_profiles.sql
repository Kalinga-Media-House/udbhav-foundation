-- Migration: 004_profiles.sql
-- Description: Establishes the enterprise Profiles system for all identity types.
-- Dependencies: 001_extensions.sql (extensions.citext, unaccent, pg_trgm), 002_auth_foundation.sql

BEGIN;

-------------------------------------------------------------------------------
-- 1. TABLES
-------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Core Identity
    slug extensions.citext NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9_-]+$'),
    first_name text NOT NULL,
    middle_name text,
    last_name text,
    preferred_name text,
    display_name text GENERATED ALWAYS AS (
        COALESCE(preferred_name, first_name || ' ' || COALESCE(last_name, ''))
    ) STORED,
    
    -- Demographics
    date_of_birth date,
    gender text, -- Freeform text or enum application-side, future-proofed
    
    -- Media & Bio
    profile_photo_url text,
    cover_photo_url text,
    short_bio text CHECK (char_length(short_bio) <= 255),
    about text,
    
    -- Contact & Web
    primary_email extensions.citext,
    alternate_email extensions.citext,
    phone text CHECK (phone ~ '^\+?[0-9\s\-()]+$'), -- Basic E.164-ish validation
    alternate_phone text CHECK (alternate_phone ~ '^\+?[0-9\s\-()]+$'),
    website text CHECK (website ~ '^https?://.*'),
    social_links jsonb DEFAULT '{}'::jsonb,
    
    -- Location & Localization
    location text,
    timezone text DEFAULT 'UTC',
    language text DEFAULT 'en',
    
    -- System & Status
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'archived')),
    verification_status text NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
    visibility text NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'members_only', 'private', 'hidden')),
    profile_completeness integer NOT NULL DEFAULT 0 CHECK (profile_completeness >= 0 AND profile_completeness <= 100),
    
    -- Extensibility & Search
    search_vector tsvector,
    metadata jsonb DEFAULT '{}'::jsonb,
    
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

COMMENT ON TABLE public.profiles IS 'Master profile records spanning all user types (volunteers, staff, members, etc).';
COMMENT ON COLUMN public.profiles.slug IS 'Unique URL-friendly string for public profile routing.';
COMMENT ON COLUMN public.profiles.primary_email IS 'Main contact email, may differ from auth.users email.';
COMMENT ON COLUMN public.profiles.search_vector IS 'Pre-computed trigram/tsvector for global fuzzy searching.';

-------------------------------------------------------------------------------
-- 2. INDEXES
-------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_profiles_slug ON public.profiles(slug);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_verification ON public.profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_profiles_visibility ON public.profiles(visibility);
CREATE INDEX IF NOT EXISTS idx_profiles_active ON public.profiles(is_deleted) WHERE is_deleted = false;

-- GIN Index for fast Full-Text Search
CREATE INDEX IF NOT EXISTS idx_profiles_search_vector ON public.profiles USING GIN (search_vector);

-------------------------------------------------------------------------------
-- 3. TRIGGERS & FUNCTIONS
-------------------------------------------------------------------------------

-- 3.1 Calculate Profile Completeness
-- Purpose: Dynamically updates the profile_completeness percentage before INSERT/UPDATE
CREATE OR REPLACE FUNCTION public.calculate_profile_completeness()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  score integer := 0;
  max_score integer := 5; -- Base required fields
BEGIN
  IF NEW.first_name IS NOT NULL THEN score := score + 1; END IF;
  IF NEW.last_name IS NOT NULL THEN score := score + 1; END IF;
  IF NEW.primary_email IS NOT NULL THEN score := score + 1; END IF;
  IF NEW.profile_photo_url IS NOT NULL THEN score := score + 1; END IF;
  IF NEW.short_bio IS NOT NULL THEN score := score + 1; END IF;
  
  NEW.profile_completeness := (score::numeric / max_score::numeric * 100)::integer;
  RETURN NEW;
END;
$$;
COMMENT ON FUNCTION public.calculate_profile_completeness() IS 'Calculates 0-100% completion score for a profile.';

CREATE TRIGGER trg_profiles_completeness 
BEFORE INSERT OR UPDATE ON public.profiles 
FOR EACH ROW EXECUTE FUNCTION public.calculate_profile_completeness();


-- 3.2 Maintain Full-Text Search Vector
-- Purpose: Automatically concatenates key fields into a tsvector whenever they change.
CREATE OR REPLACE FUNCTION public.maintain_profile_search_vector()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- We use unaccent to strip diacritics for cleaner matching
  NEW.search_vector := 
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.first_name, ''))), 'A') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.last_name, ''))), 'A') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.preferred_name, ''))), 'B') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.primary_email, ''))), 'B') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.slug, ''))), 'C');
  RETURN NEW;
END;
$$;
COMMENT ON FUNCTION public.maintain_profile_search_vector() IS 'Maintains the GIN search vector for fast profile lookups.';

CREATE TRIGGER trg_profiles_search_vector 
BEFORE INSERT OR UPDATE OF first_name, last_name, preferred_name, primary_email, slug 
ON public.profiles 
FOR EACH ROW EXECUTE FUNCTION public.maintain_profile_search_vector();


-- 3.3 Normalize Slug
-- Purpose: Ensure slugs are always lowercase and trimmed
CREATE OR REPLACE FUNCTION public.normalize_profile_slug()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.slug IS NOT NULL THEN
    NEW.slug := lower(trim(NEW.slug));
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_normalize_slug 
BEFORE INSERT OR UPDATE OF slug 
ON public.profiles 
FOR EACH ROW EXECUTE FUNCTION public.normalize_profile_slug();


-- 3.4 Standard Audit & Timestamp Triggers (from Migration 002)
CREATE TRIGGER trg_profiles_updated_at 
BEFORE UPDATE ON public.profiles 
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_profiles_audit 
BEFORE INSERT OR UPDATE ON public.profiles 
FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();

-- 3.5 Soft Delete (from Migration 002)
CREATE TRIGGER trg_profiles_soft_delete 
BEFORE DELETE ON public.profiles 
FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

-------------------------------------------------------------------------------
-- 4. RLS & HELPER STUBS
-------------------------------------------------------------------------------

-- Purpose: Helper function to get the current user's profile completeness
-- Volatility: STABLE
CREATE OR REPLACE FUNCTION public.current_user_profile_completeness()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT profile_completeness FROM public.profiles WHERE id = public.current_user_id();
$$;

COMMIT;
