-- Migration: 011_events.sql
-- Description: Enterprise Events Foundation. Events are point-in-time initiatives under a Program.
-- Dependencies: 001_extensions, 002_auth, 004_profiles, 005_audit, 006_media, 007_taxonomy, 009_notifications, 010_programs

BEGIN;

-------------------------------------------------------------------------------
-- 1. ENUMS
-------------------------------------------------------------------------------

CREATE TYPE public.event_status AS ENUM (
    'draft',
    'upcoming',
    'registration_open',
    'registration_closed',
    'ongoing',
    'completed',
    'cancelled',
    'archived'
);

CREATE TYPE public.event_type AS ENUM (
    'Workshop',
    'Seminar',
    'Training',
    'Camp',
    'Awareness',
    'Competition',
    'Volunteer',
    'Meeting',
    'Fundraiser',
    'Celebration',
    'Community',
    'General'
);

CREATE TYPE public.event_mode AS ENUM (
    'Offline',
    'Online',
    'Hybrid'
);

CREATE TYPE public.event_role AS ENUM (
    'Organizer',
    'Coordinator',
    'Volunteer',
    'Speaker',
    'Trainer',
    'Guest',
    'Judge',
    'Moderator',
    'Support Staff'
);

CREATE TYPE public.registration_role AS ENUM (
    'Participant',
    'Volunteer',
    'Guest',
    'Speaker',
    'Staff'
);

CREATE TYPE public.registration_status AS ENUM (
    'pending',
    'approved',
    'waitlisted',
    'rejected',
    'cancelled'
);

CREATE TYPE public.attendance_status AS ENUM (
    'present',
    'absent',
    'late',
    'excused'
);

-------------------------------------------------------------------------------
-- 2. TABLES
-------------------------------------------------------------------------------

-- 2.1 EVENTS (Core domain entity)
CREATE TABLE IF NOT EXISTS public.events (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    -- Hierarchy
    program_id uuid REFERENCES public.programs(id) ON DELETE CASCADE,
    
    -- Identity
    event_code extensions.citext NOT NULL UNIQUE CHECK (event_code ~ '^[A-Z0-9-]+$'),
    slug extensions.citext NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9_-]+$'),
    
    -- Content
    title text NOT NULL,
    short_title text,
    short_description text CHECK (char_length(short_description) <= 500),
    description text,
    objectives jsonb DEFAULT '[]'::jsonb,
    
    -- State & Classification
    status public.event_status NOT NULL DEFAULT 'draft',
    visibility public.program_visibility NOT NULL DEFAULT 'public', -- Reusing program_visibility
    event_type public.event_type NOT NULL DEFAULT 'General',
    mode public.event_mode NOT NULL DEFAULT 'Offline',
    
    -- Timing
    start_datetime timestamp with time zone NOT NULL,
    end_datetime timestamp with time zone NOT NULL,
    timezone text DEFAULT 'Asia/Kolkata',
    
    -- Location
    venue text,
    address text,
    city text,
    state text,
    country text,
    latitude numeric(10, 8),
    longitude numeric(11, 8),
    
    -- Registration Rules
    registration_open timestamp with time zone,
    registration_close timestamp with time zone,
    registration_limit integer, -- Null = unlimited
    minimum_age integer,
    maximum_age integer,
    requires_approval boolean NOT NULL DEFAULT false,
    allow_waitlist boolean NOT NULL DEFAULT false,
    
    -- Media Integration
    cover_image_id uuid REFERENCES public.media_files(id) ON DELETE SET NULL,
    banner_image_id uuid REFERENCES public.media_files(id) ON DELETE SET NULL,
    gallery_id uuid REFERENCES public.media_collections(id) ON DELETE SET NULL,
    
    -- Taxonomy Integration
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
    deleted_by uuid,
    
    CONSTRAINT check_event_dates CHECK (start_datetime <= end_datetime),
    CONSTRAINT check_registration_dates CHECK (registration_open IS NULL OR registration_close IS NULL OR registration_open <= registration_close)
);

COMMENT ON TABLE public.events IS 'Master record for specific, time-bound UDBHAV Foundation activities.';
COMMENT ON COLUMN public.events.program_id IS 'Optional link to a parent program. Standalone events are null.';

-- 2.2 EVENT TEAM (Internal organization)
CREATE TABLE IF NOT EXISTS public.event_members (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    role public.event_role NOT NULL DEFAULT 'Support Staff',
    custom_title text,
    
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    
    UNIQUE (event_id, profile_id, role)
);

COMMENT ON TABLE public.event_members IS 'Tracks the staff, volunteers, and speakers running the event.';

-- 2.3 EVENT REGISTRATIONS (External & Internal participants)
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    role public.registration_role NOT NULL DEFAULT 'Participant',
    status public.registration_status NOT NULL DEFAULT 'pending',
    
    certificate_eligible boolean NOT NULL DEFAULT false,
    
    registration_timestamp timestamp with time zone NOT NULL DEFAULT now(),
    metadata jsonb DEFAULT '{}'::jsonb, -- e.g., diet constraints, T-shirt size
    
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    
    -- A profile can only register once per role for an event
    UNIQUE (event_id, profile_id, role)
);

COMMENT ON TABLE public.event_registrations IS 'Tracks users who signed up to attend or participate in an event.';

-- 2.4 EVENT ATTENDANCE (Physical/Virtual Presence)
CREATE TABLE IF NOT EXISTS public.event_attendance (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    registration_id uuid NOT NULL REFERENCES public.event_registrations(id) ON DELETE CASCADE,
    
    check_in_timestamp timestamp with time zone NOT NULL DEFAULT now(),
    check_out_timestamp timestamp with time zone,
    
    status public.attendance_status NOT NULL DEFAULT 'present',
    verified_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL, -- Who scanned the QR code
    
    metadata jsonb DEFAULT '{}'::jsonb, -- QR code used, location of scan
    
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.event_attendance IS 'Logs actual presence at the event, supporting check-in/out workflows.';

-- 2.5 EVENT CERTIFICATES (Digital accomplishments)
CREATE TABLE IF NOT EXISTS public.event_certificates (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    registration_id uuid NOT NULL UNIQUE REFERENCES public.event_registrations(id) ON DELETE CASCADE,
    
    certificate_number extensions.citext NOT NULL UNIQUE,
    template_name text NOT NULL, -- Which design to use
    verification_code extensions.citext NOT NULL UNIQUE, -- Short code for public validation
    
    issue_date date NOT NULL DEFAULT CURRENT_DATE,
    issued_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    
    media_file_id uuid REFERENCES public.media_files(id) ON DELETE SET NULL, -- PDF generated and stored in R2
    
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.event_certificates IS 'Immutable record of certificates awarded to participants or volunteers.';

-------------------------------------------------------------------------------
-- 3. INDEXES
-------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_events_program ON public.events(program_id);
CREATE INDEX IF NOT EXISTS idx_events_slug ON public.events(slug);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_dates ON public.events(start_datetime, end_datetime);
CREATE INDEX IF NOT EXISTS idx_events_search ON public.events USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_events_location ON public.events(city, state, country);

CREATE INDEX IF NOT EXISTS idx_event_members_event ON public.event_members(event_id);
CREATE INDEX IF NOT EXISTS idx_event_members_profile ON public.event_members(profile_id);

CREATE INDEX IF NOT EXISTS idx_event_registrations_event ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_profile ON public.event_registrations(profile_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_status ON public.event_registrations(status);

CREATE INDEX IF NOT EXISTS idx_event_attendance_reg ON public.event_attendance(registration_id);

CREATE INDEX IF NOT EXISTS idx_event_certificates_code ON public.event_certificates(verification_code);

-------------------------------------------------------------------------------
-- 4. TRIGGERS
-------------------------------------------------------------------------------

-- 4.1 Maintain Full-Text Search Vector
CREATE OR REPLACE FUNCTION public.maintain_events_search_vector()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.title, ''))), 'A') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.short_title, ''))), 'A') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.event_code, ''))), 'B') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.venue, ''))), 'B') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.city, ''))), 'C') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.description, ''))), 'D');
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_events_search_vector 
BEFORE INSERT OR UPDATE OF title, short_title, event_code, venue, city, description 
ON public.events 
FOR EACH ROW EXECUTE FUNCTION public.maintain_events_search_vector();

-- 4.2 Standard Timestamps & Audit
CREATE TRIGGER trg_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_events_audit BEFORE INSERT OR UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();
CREATE TRIGGER trg_events_soft_delete BEFORE DELETE ON public.events FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

CREATE TRIGGER trg_event_members_updated_at BEFORE UPDATE ON public.event_members FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_event_members_audit BEFORE INSERT OR UPDATE ON public.event_members FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();

CREATE TRIGGER trg_event_registrations_updated_at BEFORE UPDATE ON public.event_registrations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_event_registrations_audit BEFORE INSERT OR UPDATE ON public.event_registrations FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();

CREATE TRIGGER trg_event_attendance_updated_at BEFORE UPDATE ON public.event_attendance FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_event_certificates_updated_at BEFORE UPDATE ON public.event_certificates FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4.3 Centralized Activity Logging (Migration 005 Integration)
CREATE TRIGGER trg_events_activity_log AFTER INSERT OR UPDATE OR DELETE ON public.events FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_handler();
CREATE TRIGGER trg_event_registrations_activity_log AFTER INSERT OR UPDATE OR DELETE ON public.event_registrations FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_handler();
CREATE TRIGGER trg_event_attendance_activity_log AFTER INSERT OR UPDATE OR DELETE ON public.event_attendance FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_handler();
CREATE TRIGGER trg_event_certificates_activity_log AFTER INSERT OR UPDATE OR DELETE ON public.event_certificates FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_handler();

-------------------------------------------------------------------------------
-- 5. HELPER FUNCTIONS
-------------------------------------------------------------------------------

-- Purpose: Auto-generate a safe slug from a title if one isn't provided.
CREATE OR REPLACE FUNCTION public.generate_event_slug(p_title text)
RETURNS extensions.citext
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_slug extensions.citext;
  v_counter integer := 1;
BEGIN
  v_slug := lower(regexp_replace(regexp_replace(p_title, '[^a-zA-Z0-9]+', '-', 'g'), '^-+|-+$', '', 'g'));
  WHILE EXISTS (SELECT 1 FROM public.events WHERE slug = v_slug AND is_deleted = false) LOOP
    v_slug := lower(regexp_replace(regexp_replace(p_title, '[^a-zA-Z0-9]+', '-', 'g'), '^-+|-+$', '', 'g')) || '-' || v_counter;
    v_counter := v_counter + 1;
  END LOOP;
  RETURN v_slug;
END;
$$;

-- Purpose: Check if registration is currently open for an event.
CREATE OR REPLACE FUNCTION public.is_registration_open(p_event_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT 
    status IN ('upcoming', 'registration_open') AND
    (registration_open IS NULL OR now() >= registration_open) AND
    (registration_close IS NULL OR now() <= registration_close)
  FROM public.events
  WHERE id = p_event_id AND is_deleted = false;
$$;

-- Purpose: Calculate current capacity and availability.
CREATE OR REPLACE FUNCTION public.event_capacity(p_event_id uuid)
RETURNS jsonb
LANGUAGE sql
STABLE
AS $$
  WITH stats AS (
    SELECT 
      e.registration_limit,
      COUNT(r.id) FILTER (WHERE r.status = 'approved') AS approved_count,
      COUNT(r.id) FILTER (WHERE r.status = 'waitlisted') AS waitlist_count
    FROM public.events e
    LEFT JOIN public.event_registrations r ON e.id = r.event_id
    WHERE e.id = p_event_id AND e.is_deleted = false
    GROUP BY e.registration_limit
  )
  SELECT jsonb_build_object(
    'limit', registration_limit,
    'approved', approved_count,
    'waitlisted', waitlist_count,
    'available', CASE WHEN registration_limit IS NULL THEN -1 ELSE GREATEST(0, registration_limit - approved_count) END,
    'is_full', CASE WHEN registration_limit IS NULL THEN false ELSE approved_count >= registration_limit END
  )
  FROM stats;
$$;

-- Purpose: Calculate the attendance percentage (Check-ins / Approved Registrations).
CREATE OR REPLACE FUNCTION public.event_attendance_percentage(p_event_id uuid)
RETURNS numeric
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_approved integer;
  v_attended integer;
BEGIN
  SELECT count(*) INTO v_approved 
  FROM public.event_registrations 
  WHERE event_id = p_event_id AND status = 'approved';
  
  IF v_approved = 0 THEN RETURN 0; END IF;
  
  SELECT count(*) INTO v_attended 
  FROM public.event_attendance a
  JOIN public.event_registrations r ON a.registration_id = r.id
  WHERE r.event_id = p_event_id AND a.status = 'present';
  
  RETURN ROUND((v_attended::numeric / v_approved::numeric) * 100, 2);
END;
$$;

COMMIT;
