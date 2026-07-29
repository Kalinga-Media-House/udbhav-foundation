-- Migration: 012_volunteer_management.sql
-- Description: Enterprise Volunteer Management Module. Handles onboarding, skills, assignments, and tracking.
-- Dependencies: 001_extensions, 002_auth, 004_profiles, 005_audit, 006_media, 010_programs, 011_events

BEGIN;

-------------------------------------------------------------------------------
-- 1. ENUMS
-------------------------------------------------------------------------------

CREATE TYPE public.volunteer_status AS ENUM (
    'Applied',
    'Pending Verification',
    'Verified',
    'Active',
    'Inactive',
    'Suspended',
    'Archived'
);

CREATE TYPE public.volunteer_verification_status AS ENUM (
    'Unverified',
    'Document Submitted',
    'In Progress',
    'Verified',
    'Rejected'
);

CREATE TYPE public.skill_level AS ENUM (
    'Beginner',
    'Intermediate',
    'Advanced',
    'Expert'
);

CREATE TYPE public.volunteer_document_type AS ENUM (
    'Identity Proof',
    'Address Proof',
    'Certificate',
    'Medical Document',
    'Consent Form',
    'Police Verification',
    'Other'
);

CREATE TYPE public.availability_shift AS ENUM (
    'Morning',
    'Afternoon',
    'Evening',
    'Night',
    'Flexible'
);

-------------------------------------------------------------------------------
-- 2. TABLES
-------------------------------------------------------------------------------

-- 2.1 VOLUNTEERS (Extension of Profiles)
CREATE TABLE IF NOT EXISTS public.volunteers (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    -- Identity binding
    profile_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    volunteer_code citext NOT NULL UNIQUE CHECK (volunteer_code ~ '^[A-Z0-9-]+$'),
    
    -- Status & Lifecycle
    status public.volunteer_status NOT NULL DEFAULT 'Applied',
    verification_status public.volunteer_verification_status NOT NULL DEFAULT 'Unverified',
    onboarding_date date,
    background_verification_date date,
    
    -- Personal / Demographics
    blood_group text,
    emergency_contact_name text,
    emergency_contact_phone text CHECK (emergency_contact_phone ~ '^\+?[0-9\s\-()]+$'),
    emergency_contact_relation text,
    
    -- Competency Summary
    skills_summary text,
    languages text[], -- e.g., ['English', 'Hindi', 'Odia']
    experience_years numeric,
    biography text,
    preferred_locations text[],
    
    photo_id uuid REFERENCES public.media_files(id) ON DELETE SET NULL,
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

COMMENT ON TABLE public.volunteers IS 'Volunteer-specific domain data tied 1:1 with public.profiles.';
COMMENT ON COLUMN public.volunteers.volunteer_code IS 'Internal organizational ID (e.g., VOL-2026-001).';

-- 2.2 VOLUNTEER SKILLS (Master Dictionary)
CREATE TABLE IF NOT EXISTS public.volunteer_skills (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    skill_name citext NOT NULL UNIQUE,
    category text NOT NULL, -- e.g., 'Medical', 'IT', 'Teaching'
    description text,
    is_active boolean NOT NULL DEFAULT true,
    
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.volunteer_skills IS 'Master catalog of skills volunteers can possess.';

-- 2.3 VOLUNTEER SKILL MAP (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.volunteer_skill_map (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    volunteer_id uuid NOT NULL REFERENCES public.volunteers(id) ON DELETE CASCADE,
    skill_id uuid NOT NULL REFERENCES public.volunteer_skills(id) ON DELETE CASCADE,
    
    experience_level public.skill_level NOT NULL DEFAULT 'Beginner',
    years_of_experience numeric,
    certification_details text,
    is_verified boolean NOT NULL DEFAULT false,
    
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    
    UNIQUE (volunteer_id, skill_id)
);

-- 2.4 VOLUNTEER AVAILABILITY (Schedule preferences)
CREATE TABLE IF NOT EXISTS public.volunteer_availability (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    volunteer_id uuid NOT NULL REFERENCES public.volunteers(id) ON DELETE CASCADE,
    
    is_remote boolean NOT NULL DEFAULT false,
    is_onsite boolean NOT NULL DEFAULT true,
    
    -- Arrays of integers representing DOW (0 = Sunday, 6 = Saturday)
    available_weekdays integer[],
    available_weekends integer[],
    
    preferred_shifts public.availability_shift[],
    
    valid_from date NOT NULL DEFAULT CURRENT_DATE,
    valid_until date, -- Null = indefinitely
    
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 2.5 PROGRAM VOLUNTEERS (Long-term assignments)
CREATE TABLE IF NOT EXISTS public.program_volunteers (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    program_id uuid NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
    volunteer_id uuid NOT NULL REFERENCES public.volunteers(id) ON DELETE CASCADE,
    
    role text NOT NULL DEFAULT 'Volunteer',
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'withdrawn')),
    
    start_date date NOT NULL DEFAULT CURRENT_DATE,
    end_date date,
    hours_contributed numeric NOT NULL DEFAULT 0 CHECK (hours_contributed >= 0),
    
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    
    UNIQUE (program_id, volunteer_id, role)
);

-- 2.6 EVENT VOLUNTEERS (Short-term assignments / shifts)
CREATE TABLE IF NOT EXISTS public.event_volunteers (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    volunteer_id uuid NOT NULL REFERENCES public.volunteers(id) ON DELETE CASCADE,
    
    role text NOT NULL DEFAULT 'Event Staff',
    assigned_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    
    check_in_timestamp timestamp with time zone,
    check_out_timestamp timestamp with time zone,
    
    hours_logged numeric DEFAULT 0 CHECK (hours_logged >= 0),
    attendance_status text NOT NULL DEFAULT 'scheduled' CHECK (attendance_status IN ('scheduled', 'present', 'absent', 'excused')),
    
    performance_rating integer CHECK (performance_rating >= 1 AND performance_rating <= 5),
    feedback_notes text,
    
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    
    UNIQUE (event_id, volunteer_id, role)
);

-- 2.7 VOLUNTEER DOCUMENTS (Compliance & Vetting)
CREATE TABLE IF NOT EXISTS public.volunteer_documents (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    volunteer_id uuid NOT NULL REFERENCES public.volunteers(id) ON DELETE CASCADE,
    document_type public.volunteer_document_type NOT NULL,
    
    media_file_id uuid NOT NULL REFERENCES public.media_files(id) ON DELETE CASCADE,
    
    issue_date date,
    expiry_date date,
    verification_status text NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    verified_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 2.8 VOLUNTEER STATISTICS (Materialized / Maintained Performance Tracking)
CREATE TABLE IF NOT EXISTS public.volunteer_statistics (
    volunteer_id uuid PRIMARY KEY REFERENCES public.volunteers(id) ON DELETE CASCADE,
    
    programs_participated integer NOT NULL DEFAULT 0,
    events_participated integer NOT NULL DEFAULT 0,
    
    total_hours numeric NOT NULL DEFAULT 0,
    certificates_earned integer NOT NULL DEFAULT 0,
    
    average_rating numeric(3, 2), -- 1.00 to 5.00
    leaderboard_score integer NOT NULL DEFAULT 0,
    
    last_activity_date date,
    
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-------------------------------------------------------------------------------
-- 3. INDEXES
-------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_volunteers_profile ON public.volunteers(profile_id);
CREATE INDEX IF NOT EXISTS idx_volunteers_code ON public.volunteers(volunteer_code);
CREATE INDEX IF NOT EXISTS idx_volunteers_status ON public.volunteers(status);
CREATE INDEX IF NOT EXISTS idx_volunteers_verification ON public.volunteers(verification_status);

CREATE INDEX IF NOT EXISTS idx_volunteer_skills_cat ON public.volunteer_skills(category);
CREATE INDEX IF NOT EXISTS idx_volunteer_skill_map_vol ON public.volunteer_skill_map(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_skill_map_skill ON public.volunteer_skill_map(skill_id);

CREATE INDEX IF NOT EXISTS idx_program_volunteers_prog ON public.program_volunteers(program_id);
CREATE INDEX IF NOT EXISTS idx_program_volunteers_vol ON public.program_volunteers(volunteer_id);

CREATE INDEX IF NOT EXISTS idx_event_volunteers_event ON public.event_volunteers(event_id);
CREATE INDEX IF NOT EXISTS idx_event_volunteers_vol ON public.event_volunteers(volunteer_id);

CREATE INDEX IF NOT EXISTS idx_volunteer_docs_vol ON public.volunteer_documents(volunteer_id);

CREATE INDEX IF NOT EXISTS idx_volunteer_stats_hours ON public.volunteer_statistics(total_hours DESC);
CREATE INDEX IF NOT EXISTS idx_volunteer_stats_score ON public.volunteer_statistics(leaderboard_score DESC);

-------------------------------------------------------------------------------
-- 4. TRIGGERS
-------------------------------------------------------------------------------

-- 4.1 Auto-Initialize Statistics Record
CREATE OR REPLACE FUNCTION public.initialize_volunteer_statistics()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.volunteer_statistics (volunteer_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_init_volunteer_stats AFTER INSERT ON public.volunteers FOR EACH ROW EXECUTE FUNCTION public.initialize_volunteer_statistics();

-- 4.2 Standard Timestamps & Audits
CREATE TRIGGER trg_volunteers_updated_at BEFORE UPDATE ON public.volunteers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_volunteers_audit BEFORE INSERT OR UPDATE ON public.volunteers FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();
CREATE TRIGGER trg_volunteers_soft_delete BEFORE DELETE ON public.volunteers FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

CREATE TRIGGER trg_volunteer_skills_updated_at BEFORE UPDATE ON public.volunteer_skills FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_volunteer_skill_map_updated_at BEFORE UPDATE ON public.volunteer_skill_map FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_volunteer_skill_map_audit BEFORE INSERT OR UPDATE ON public.volunteer_skill_map FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();

CREATE TRIGGER trg_volunteer_avail_updated_at BEFORE UPDATE ON public.volunteer_availability FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_program_volunteers_updated_at BEFORE UPDATE ON public.program_volunteers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_program_volunteers_audit BEFORE INSERT OR UPDATE ON public.program_volunteers FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();

CREATE TRIGGER trg_event_volunteers_updated_at BEFORE UPDATE ON public.event_volunteers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_event_volunteers_audit BEFORE INSERT OR UPDATE ON public.event_volunteers FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();

CREATE TRIGGER trg_volunteer_docs_updated_at BEFORE UPDATE ON public.volunteer_documents FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_volunteer_docs_audit BEFORE INSERT OR UPDATE ON public.volunteer_documents FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();

CREATE TRIGGER trg_volunteer_stats_updated_at BEFORE UPDATE ON public.volunteer_statistics FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4.3 Centralized Activity Logging
CREATE TRIGGER trg_volunteers_activity_log AFTER INSERT OR UPDATE OR DELETE ON public.volunteers FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_handler();
CREATE TRIGGER trg_volunteer_skill_map_activity_log AFTER INSERT OR UPDATE OR DELETE ON public.volunteer_skill_map FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_handler();
CREATE TRIGGER trg_program_volunteers_activity_log AFTER INSERT OR UPDATE OR DELETE ON public.program_volunteers FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_handler();
CREATE TRIGGER trg_event_volunteers_activity_log AFTER INSERT OR UPDATE OR DELETE ON public.event_volunteers FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_handler();
CREATE TRIGGER trg_volunteer_docs_activity_log AFTER INSERT OR UPDATE OR DELETE ON public.volunteer_documents FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_handler();


-------------------------------------------------------------------------------
-- 5. HELPER FUNCTIONS
-------------------------------------------------------------------------------

-- Purpose: Quick check if a volunteer is fully verified and active
CREATE OR REPLACE FUNCTION public.is_verified_volunteer(p_volunteer_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.volunteers 
    WHERE id = p_volunteer_id 
      AND status = 'Active' 
      AND verification_status = 'Verified' 
      AND is_deleted = false
  );
$$;

-- Purpose: Re-calculates and caches volunteer statistics (hours, events, programs)
CREATE OR REPLACE FUNCTION public.refresh_volunteer_statistics(p_volunteer_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_program_count integer;
  v_event_count integer;
  v_prog_hours numeric;
  v_event_hours numeric;
  v_avg_rating numeric;
BEGIN
  -- Program stats
  SELECT COUNT(DISTINCT program_id), COALESCE(SUM(hours_contributed), 0)
  INTO v_program_count, v_prog_hours
  FROM public.program_volunteers WHERE volunteer_id = p_volunteer_id;
  
  -- Event stats
  SELECT COUNT(DISTINCT event_id), COALESCE(SUM(hours_logged), 0), COALESCE(AVG(performance_rating), 0)
  INTO v_event_count, v_event_hours, v_avg_rating
  FROM public.event_volunteers WHERE volunteer_id = p_volunteer_id AND attendance_status = 'present';
  
  -- Update stats table
  UPDATE public.volunteer_statistics
  SET 
    programs_participated = v_program_count,
    events_participated = v_event_count,
    total_hours = v_prog_hours + v_event_hours,
    average_rating = CASE WHEN v_avg_rating > 0 THEN v_avg_rating ELSE NULL END,
    leaderboard_score = (v_program_count * 10) + (v_event_count * 5) + ((v_prog_hours + v_event_hours) * 2)
  WHERE volunteer_id = p_volunteer_id;
END;
$$;

-- Purpose: Find available, verified volunteers with a specific skill
CREATE OR REPLACE FUNCTION public.available_volunteers_by_skill(p_skill_name citext)
RETURNS TABLE (
    volunteer_id uuid,
    volunteer_name text,
    experience_level public.skill_level
)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    v.id, p.display_name, vsm.experience_level
  FROM public.volunteers v
  JOIN public.profiles p ON v.profile_id = p.id
  JOIN public.volunteer_skill_map vsm ON vsm.volunteer_id = v.id
  JOIN public.volunteer_skills vs ON vs.id = vsm.skill_id
  WHERE vs.skill_name = p_skill_name
    AND v.status = 'Active'
    AND v.verification_status = 'Verified'
    AND v.is_deleted = false
  ORDER BY 
    CASE vsm.experience_level
      WHEN 'Expert' THEN 1
      WHEN 'Advanced' THEN 2
      WHEN 'Intermediate' THEN 3
      WHEN 'Beginner' THEN 4
    END, p.display_name;
$$;

COMMIT;
