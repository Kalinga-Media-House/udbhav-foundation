-- Migration: 016_contacts_enquiries_foundation.sql
-- Description: Enterprise Contacts & Enquiries Module (CRM & Helpdesk).
-- Dependencies: 001_extensions, 002_auth, 004_profiles, 005_audit, 006_media

BEGIN;

-------------------------------------------------------------------------------
-- 1. ENUMS
-------------------------------------------------------------------------------

CREATE TYPE public.enquiry_department AS ENUM (
    'Administration',
    'Programs',
    'Volunteers',
    'Finance',
    'Media',
    'CSR',
    'Partnership',
    'HR',
    'IT',
    'Legal',
    'General'
);

CREATE TYPE public.enquiry_category AS ENUM (
    'Contact',
    'Complaint',
    'Feedback',
    'Grievance',
    'Donation',
    'Volunteer',
    'Media',
    'Partnership',
    'Career',
    'CSR',
    'Event',
    'Program',
    'Gallery',
    'Technical',
    'Other'
);

CREATE TYPE public.enquiry_priority AS ENUM (
    'Low',
    'Normal',
    'High',
    'Urgent',
    'Critical'
);

CREATE TYPE public.enquiry_status AS ENUM (
    'Open',
    'Assigned',
    'Pending',
    'Waiting for User',
    'Resolved',
    'Closed',
    'Rejected',
    'Spam'
);

CREATE TYPE public.enquiry_source AS ENUM (
    'Website',
    'Landing Page',
    'Mobile App',
    'Email',
    'Phone',
    'Walk-in',
    'Social Media',
    'Referral'
);

CREATE TYPE public.message_visibility AS ENUM (
    'Public',
    'Internal'
);

-------------------------------------------------------------------------------
-- 2. TABLES
-------------------------------------------------------------------------------

-- 2.1 CONTACTS (The CRM Entity for all incoming communications)
CREATE TABLE IF NOT EXISTS public.contacts (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    -- Authenticated Link (Nullable for guest submissions)
    profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    
    -- Identity
    full_name text NOT NULL,
    organization text,
    email citext,
    phone text CHECK (phone ~ '^\+?[0-9\s\-()]+$'),
    
    -- Location
    address text,
    city text,
    state text,
    country text DEFAULT 'India',
    
    -- Digital Identity
    website text,
    social_links jsonb DEFAULT '{}'::jsonb,
    
    -- Preferences
    preferred_contact_method text DEFAULT 'Email',
    preferred_language text DEFAULT 'en',
    
    -- Admin Notes
    notes text,
    
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.contacts IS 'Unified CRM identity for anyone who contacts the organization.';

-- 2.2 ENQUIRIES (The Ticket / Helpdesk Record)
CREATE TABLE IF NOT EXISTS public.enquiries (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    -- Identity
    enquiry_number citext NOT NULL UNIQUE, -- e.g. TKT-26-00100
    contact_id uuid NOT NULL REFERENCES public.contacts(id) ON DELETE RESTRICT,
    
    -- Content
    subject text NOT NULL,
    message text NOT NULL,
    
    -- Classification
    department public.enquiry_department NOT NULL DEFAULT 'General',
    category public.enquiry_category NOT NULL DEFAULT 'Other',
    priority public.enquiry_priority NOT NULL DEFAULT 'Normal',
    status public.enquiry_status NOT NULL DEFAULT 'Open',
    source public.enquiry_source NOT NULL DEFAULT 'Website',
    channel text DEFAULT 'Web Form',
    
    -- Routing & Assignment
    assigned_to uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    assigned_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    assignment_time timestamp with time zone,
    
    -- Resolution
    resolved_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    resolved_at timestamp with time zone,
    
    -- SLAs (Service Level Agreements)
    first_response_time timestamp with time zone,
    expected_resolution timestamp with time zone,
    escalation_level integer NOT NULL DEFAULT 0,
    
    -- Telemetry
    ip_address text,
    user_agent text,
    metadata jsonb DEFAULT '{}'::jsonb,
    
    -- Search
    search_vector tsvector,
    
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

COMMENT ON TABLE public.enquiries IS 'The core ticketing and helpdesk entity.';
COMMENT ON COLUMN public.enquiries.escalation_level IS '0 = Normal, 1 = Manager, 2 = Director.';

-- 2.3 ENQUIRY ATTACHMENTS
CREATE TABLE IF NOT EXISTS public.enquiry_attachments (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    enquiry_id uuid NOT NULL REFERENCES public.enquiries(id) ON DELETE CASCADE,
    media_file_id uuid NOT NULL REFERENCES public.media_files(id) ON DELETE CASCADE,
    
    original_name text NOT NULL,
    file_size bigint,
    mime_type text,
    
    uploaded_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.enquiry_attachments IS 'Files attached to a ticket by the user or agent.';

-- 2.4 ENQUIRY MESSAGES (Conversation Threading)
CREATE TABLE IF NOT EXISTS public.enquiry_messages (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    enquiry_id uuid NOT NULL REFERENCES public.enquiries(id) ON DELETE CASCADE,
    author_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL, -- Null implies system/customer (if unauth)
    
    message text NOT NULL,
    visibility public.message_visibility NOT NULL DEFAULT 'Public',
    
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.enquiry_messages IS 'Threaded replies. Internal notes are hidden from the submitter.';

-------------------------------------------------------------------------------
-- 3. INDEXES
-------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_contacts_email ON public.contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_phone ON public.contacts(phone);
CREATE INDEX IF NOT EXISTS idx_contacts_profile ON public.contacts(profile_id);

CREATE INDEX IF NOT EXISTS idx_enquiries_number ON public.enquiries(enquiry_number);
CREATE INDEX IF NOT EXISTS idx_enquiries_contact ON public.enquiries(contact_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_department ON public.enquiries(department);
CREATE INDEX IF NOT EXISTS idx_enquiries_assigned ON public.enquiries(assigned_to);
CREATE INDEX IF NOT EXISTS idx_enquiries_search ON public.enquiries USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_enquiries_escalation ON public.enquiries(escalation_level);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON public.enquiries(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_enquiry_msgs_enquiry ON public.enquiry_messages(enquiry_id);
CREATE INDEX IF NOT EXISTS idx_enquiry_msgs_visibility ON public.enquiry_messages(visibility);

-------------------------------------------------------------------------------
-- 4. TRIGGERS
-------------------------------------------------------------------------------

-- 4.1 Search Vector
CREATE OR REPLACE FUNCTION public.maintain_enquiries_search_vector()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.enquiry_number, ''))), 'A') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.subject, ''))), 'A') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.message, ''))), 'B');
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_enquiries_search_vector 
BEFORE INSERT OR UPDATE OF enquiry_number, subject, message 
ON public.enquiries 
FOR EACH ROW EXECUTE FUNCTION public.maintain_enquiries_search_vector();

-- 4.2 Auto-Calculate SLAs (On Insert)
CREATE OR REPLACE FUNCTION public.set_enquiry_sla()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Simple SLA logic: Critical = 4 hrs, High = 24 hrs, Normal = 72 hrs, Low = 1 week
  IF NEW.priority = 'Critical' THEN
    NEW.expected_resolution := now() + interval '4 hours';
  ELSIF NEW.priority = 'Urgent' THEN
    NEW.expected_resolution := now() + interval '12 hours';
  ELSIF NEW.priority = 'High' THEN
    NEW.expected_resolution := now() + interval '24 hours';
  ELSIF NEW.priority = 'Normal' THEN
    NEW.expected_resolution := now() + interval '3 days';
  ELSE
    NEW.expected_resolution := now() + interval '7 days';
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_enquiries_sla BEFORE INSERT ON public.enquiries FOR EACH ROW EXECUTE FUNCTION public.set_enquiry_sla();

-- 4.3 Standard Timestamps & Audits
CREATE TRIGGER trg_contacts_updated_at BEFORE UPDATE ON public.contacts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_enquiries_updated_at BEFORE UPDATE ON public.enquiries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_enquiries_audit BEFORE INSERT OR UPDATE ON public.enquiries FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();
CREATE TRIGGER trg_enquiries_soft_delete BEFORE DELETE ON public.enquiries FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

CREATE TRIGGER trg_enquiry_messages_updated_at BEFORE UPDATE ON public.enquiry_messages FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4.4 Centralized Activity Logging (Audit Trail)
CREATE TRIGGER trg_enquiries_activity_log AFTER INSERT OR UPDATE OR DELETE ON public.enquiries FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_handler();
CREATE TRIGGER trg_enquiry_messages_activity_log AFTER INSERT OR UPDATE OR DELETE ON public.enquiry_messages FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_handler();

-------------------------------------------------------------------------------
-- 5. HELPER VIEWS (For Dashboard Analytics)
-------------------------------------------------------------------------------

CREATE OR REPLACE VIEW public.vw_open_tickets AS
SELECT id, enquiry_number, subject, department, priority, created_at, expected_resolution, escalation_level
FROM public.enquiries
WHERE status IN ('Open', 'Assigned', 'Pending', 'Waiting for User') AND is_deleted = false
ORDER BY priority DESC, created_at ASC;

CREATE OR REPLACE VIEW public.vw_department_workload AS
SELECT department, COUNT(id) AS active_tickets, 
       COUNT(id) FILTER (WHERE priority IN ('High', 'Urgent', 'Critical')) AS high_priority
FROM public.enquiries
WHERE status IN ('Open', 'Assigned', 'Pending') AND is_deleted = false
GROUP BY department;

CREATE OR REPLACE VIEW public.vw_average_resolution_time AS
SELECT department,
       AVG(EXTRACT(EPOCH FROM (resolved_at - created_at))/3600)::numeric(10,2) AS avg_hours_to_resolve
FROM public.enquiries
WHERE status IN ('Resolved', 'Closed') AND is_deleted = false AND resolved_at IS NOT NULL
GROUP BY department;

CREATE OR REPLACE VIEW public.vw_daily_enquiries AS
SELECT DATE(created_at) AS report_date, COUNT(id) AS ticket_count
FROM public.enquiries
WHERE is_deleted = false
GROUP BY DATE(created_at)
ORDER BY DATE(created_at) DESC;

CREATE OR REPLACE VIEW public.vw_monthly_trends AS
SELECT to_char(created_at, 'YYYY-MM') AS month, COUNT(id) AS ticket_count
FROM public.enquiries
WHERE is_deleted = false
GROUP BY to_char(created_at, 'YYYY-MM')
ORDER BY month DESC;

CREATE OR REPLACE VIEW public.vw_category_distribution AS
SELECT category, COUNT(id) AS ticket_count
FROM public.enquiries
WHERE is_deleted = false
GROUP BY category
ORDER BY ticket_count DESC;

CREATE OR REPLACE VIEW public.vw_top_sources AS
SELECT source, COUNT(id) AS ticket_count
FROM public.enquiries
WHERE is_deleted = false
GROUP BY source
ORDER BY ticket_count DESC;

-------------------------------------------------------------------------------
-- 6. HELPER FUNCTIONS
-------------------------------------------------------------------------------

-- Purpose: Generates sequential TKT-YY-XXXXX
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS citext
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
AS $$
DECLARE
  v_year text;
  v_count integer;
BEGIN
  v_year := to_char(CURRENT_DATE, 'YY');
  -- In high load, use a sequence. For now, rely on count.
  SELECT count(*) + 1 INTO v_count FROM public.enquiries WHERE enquiry_number LIKE 'TKT-' || v_year || '-%';
  RETURN 'TKT-' || v_year || '-' || LPAD(v_count::text, 5, '0');
END;
$$;

-- Purpose: Fetch pending tickets for a specific department
CREATE OR REPLACE FUNCTION public.department_queue(p_dept public.enquiry_department, p_limit integer DEFAULT 50)
RETURNS SETOF public.vw_open_tickets
LANGUAGE sql
STABLE
AS $$
  SELECT * FROM public.vw_open_tickets 
  WHERE department = p_dept
  LIMIT p_limit;
$$;

-- Purpose: Safely resolve a ticket, stamping the resolution time.
CREATE OR REPLACE FUNCTION public.resolve_ticket(p_enquiry_id uuid, p_resolved_by uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.enquiries
  SET 
    status = 'Resolved',
    resolved_by = p_resolved_by,
    resolved_at = COALESCE(resolved_at, now())
  WHERE id = p_enquiry_id AND is_deleted = false;
END;
$$;

-- Purpose: Escalate a ticket if SLA breached.
CREATE OR REPLACE FUNCTION public.escalate_ticket(p_enquiry_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.enquiries
  SET escalation_level = escalation_level + 1
  WHERE id = p_enquiry_id AND is_deleted = false;
END;
$$;

COMMIT;
