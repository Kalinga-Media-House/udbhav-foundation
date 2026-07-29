-- Migration: 017_reports_analytics_foundation.sql
-- Description: Enterprise Reports & Analytics Module (BI, Materialized Views, Dashboards).
-- Dependencies: 001-016 (Relies on all previous foundation modules)

BEGIN;

-------------------------------------------------------------------------------
-- 1. ENUMS
-------------------------------------------------------------------------------

CREATE TYPE public.report_type AS ENUM (
    'Financial',
    'Program',
    'Event',
    'Volunteer',
    'CRM',
    'System',
    'Custom'
);

CREATE TYPE public.report_status AS ENUM (
    'Pending',
    'Processing',
    'Completed',
    'Failed'
);

CREATE TYPE public.export_format AS ENUM (
    'CSV',
    'Excel',
    'PDF',
    'JSON'
);

CREATE TYPE public.kpi_category AS ENUM (
    'Finance',
    'Programs',
    'Events',
    'Volunteers',
    'CRM',
    'Platform',
    'Marketing'
);

CREATE TYPE public.kpi_trend AS ENUM (
    'Up',
    'Down',
    'Flat'
);

-------------------------------------------------------------------------------
-- 2. TABLES
-------------------------------------------------------------------------------

-- 2.1 REPORT SNAPSHOTS (Exported files and cached reports)
CREATE TABLE IF NOT EXISTS public.report_snapshots (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    report_name text NOT NULL,
    report_type public.report_type NOT NULL DEFAULT 'Custom',
    
    period_start timestamp with time zone,
    period_end timestamp with time zone,
    
    status public.report_status NOT NULL DEFAULT 'Pending',
    export_format public.export_format NOT NULL DEFAULT 'CSV',
    
    -- If stored in media/R2
    media_file_id uuid REFERENCES public.media_files(id) ON DELETE SET NULL,
    storage_url text, -- Fallback direct link
    checksum text,
    
    metadata jsonb DEFAULT '{}'::jsonb,
    
    generated_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    generated_at timestamp with time zone,
    
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    is_deleted boolean NOT NULL DEFAULT false
);

COMMENT ON TABLE public.report_snapshots IS 'Stores metadata and links to exported/generated offline reports.';

-- 2.2 KPI METRICS (Historical snapshot of specific KPIs)
CREATE TABLE IF NOT EXISTS public.kpi_metrics (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    metric_name text NOT NULL,
    category public.kpi_category NOT NULL,
    
    value numeric(15, 2) NOT NULL DEFAULT 0,
    previous_value numeric(15, 2) NOT NULL DEFAULT 0,
    growth_percentage numeric(10, 2) NOT NULL DEFAULT 0,
    trend public.kpi_trend NOT NULL DEFAULT 'Flat',
    
    calculation_date date NOT NULL DEFAULT CURRENT_DATE,
    visibility text[] DEFAULT ARRAY['SuperAdmin', 'Director']::text[],
    
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.kpi_metrics IS 'Daily/Weekly snapshots of key performance indicators.';

-- 2.3 DASHBOARD WIDGETS (Config for dynamic user dashboards)
CREATE TABLE IF NOT EXISTS public.dashboard_widgets (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    widget_name text NOT NULL UNIQUE,
    widget_type text NOT NULL, -- e.g., 'Chart', 'Metric', 'Table'
    category public.kpi_category NOT NULL,
    
    layout jsonb DEFAULT '{}'::jsonb,
    configuration jsonb DEFAULT '{}'::jsonb,
    
    refresh_interval_seconds integer DEFAULT 3600,
    permissions text[] DEFAULT ARRAY['SuperAdmin']::text[],
    
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    is_active boolean NOT NULL DEFAULT true
);

COMMENT ON TABLE public.dashboard_widgets IS 'Configuration for dynamic BI dashboard widgets.';

-------------------------------------------------------------------------------
-- 3. INDEXES
-------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_report_snapshots_type ON public.report_snapshots(report_type);
CREATE INDEX IF NOT EXISTS idx_report_snapshots_status ON public.report_snapshots(status);

CREATE INDEX IF NOT EXISTS idx_kpi_metrics_category ON public.kpi_metrics(category);
CREATE INDEX IF NOT EXISTS idx_kpi_metrics_date ON public.kpi_metrics(calculation_date);

CREATE INDEX IF NOT EXISTS idx_dashboard_widgets_active ON public.dashboard_widgets(is_active);

-------------------------------------------------------------------------------
-- 4. MATERIALIZED VIEWS (The BI Analytics Layer)
-------------------------------------------------------------------------------

-- 4.1 FINANCE: Donation Summary
CREATE MATERIALIZED VIEW public.mvw_donation_summary AS
SELECT 
    DATE_TRUNC('month', paid_at) AS month,
    donation_type,
    COUNT(id) AS donation_count,
    SUM(amount) AS total_amount,
    currency
FROM public.donations
WHERE status = 'Paid' AND is_deleted = false
GROUP BY DATE_TRUNC('month', paid_at), donation_type, currency
ORDER BY month DESC;

CREATE UNIQUE INDEX idx_mvw_donation_summary_unique ON public.mvw_donation_summary(month, donation_type, currency);

-- 4.2 PROGRAMS: Program Reach & Impact
CREATE MATERIALIZED VIEW public.mvw_program_statistics AS
SELECT 
    p.id AS program_id,
    p.title,
    p.status,
    COUNT(DISTINCT e.id) AS total_events,
    COUNT(DISTINCT v.volunteer_id) AS total_volunteers,
    COALESCE(SUM(tx.amount), 0) AS total_funds_raised
FROM public.programs p
LEFT JOIN public.events e ON p.id = e.program_id AND e.is_deleted = false
LEFT JOIN public.event_volunteers v ON e.id = v.event_id AND v.attendance_status = 'present'
LEFT JOIN public.donations tx ON (tx.program_id = p.id OR tx.campaign_id IN (SELECT id FROM public.donation_campaigns WHERE program_id = p.id)) AND tx.status = 'Paid' AND tx.is_deleted = false
WHERE p.is_deleted = false
GROUP BY p.id, p.title, p.status;

CREATE UNIQUE INDEX idx_mvw_program_statistics_unique ON public.mvw_program_statistics(program_id);

-- 4.3 EVENTS: Participation Summary
CREATE MATERIALIZED VIEW public.mvw_event_participation AS
SELECT 
    e.id AS event_id,
    e.title,
    e.start_datetime,
    e.status,
    e.registration_limit,
    COUNT(DISTINCT er.id) AS registrations,
    COUNT(DISTINCT ev.id) AS attended_volunteers,
    CASE WHEN e.registration_limit > 0 THEN ROUND((COUNT(DISTINCT er.id)::numeric / e.registration_limit) * 100, 2) ELSE 0 END AS capacity_utilization
FROM public.events e
LEFT JOIN public.event_registrations er ON e.id = er.event_id AND er.status = 'approved'
LEFT JOIN public.event_volunteers ev ON e.id = ev.event_id AND ev.attendance_status = 'present'
WHERE e.is_deleted = false
GROUP BY e.id, e.title, e.start_datetime, e.status, e.registration_limit;

CREATE UNIQUE INDEX idx_mvw_event_participation_unique ON public.mvw_event_participation(event_id);

-- 4.4 VOLUNTEERS: Activity Summary
CREATE MATERIALIZED VIEW public.mvw_active_volunteers AS
SELECT 
    v.id AS volunteer_id,
    v.status,
    vs.total_hours,
    vs.events_participated AS event_count,
    COUNT(sk.id) AS mapped_skills
FROM public.volunteers v
LEFT JOIN public.volunteer_statistics vs ON v.id = vs.volunteer_id
LEFT JOIN public.volunteer_skill_map sk ON v.id = sk.volunteer_id
WHERE v.is_deleted = false
GROUP BY v.id, v.status, vs.total_hours, vs.events_participated;

CREATE UNIQUE INDEX idx_mvw_active_volunteers_unique ON public.mvw_active_volunteers(volunteer_id);

-- 4.5 CRM: Helpdesk Performance
CREATE MATERIALIZED VIEW public.mvw_crm_performance AS
SELECT 
    department,
    category,
    COUNT(id) AS total_tickets,
    COUNT(id) FILTER (WHERE status = 'Resolved' OR status = 'Closed') AS resolved_tickets,
    COUNT(id) FILTER (WHERE escalation_level > 0) AS escalated_tickets,
    AVG(EXTRACT(EPOCH FROM (resolved_at - created_at))/3600)::numeric(10,2) AS avg_resolution_hours
FROM public.enquiries
WHERE is_deleted = false
GROUP BY department, category;

CREATE UNIQUE INDEX idx_mvw_crm_performance_unique ON public.mvw_crm_performance(department, category);

-- 4.6 PLATFORM: User Growth
CREATE MATERIALIZED VIEW public.mvw_user_growth AS
SELECT 
    DATE_TRUNC('month', created_at) AS month,
    COUNT(id) AS new_users
FROM public.profiles
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

CREATE UNIQUE INDEX idx_mvw_user_growth_unique ON public.mvw_user_growth(month);

-------------------------------------------------------------------------------
-- 5. TRIGGERS
-------------------------------------------------------------------------------
CREATE TRIGGER trg_report_snapshots_updated_at BEFORE UPDATE ON public.report_snapshots FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_dashboard_widgets_updated_at BEFORE UPDATE ON public.dashboard_widgets FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-------------------------------------------------------------------------------
-- 6. HELPER PROCEDURES & FUNCTIONS
-------------------------------------------------------------------------------

-- Purpose: Refresh all materialized views. Should be run via pg_cron or external worker nightly.
CREATE OR REPLACE FUNCTION public.refresh_reports()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Use CONCURRENTLY to avoid locking reads during refresh.
  -- Requires unique indexes on the materialized views (created above).
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.mvw_donation_summary;
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.mvw_program_statistics;
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.mvw_event_participation;
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.mvw_active_volunteers;
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.mvw_crm_performance;
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.mvw_user_growth;
END;
$$;
COMMENT ON FUNCTION public.refresh_reports() IS 'Refreshes all analytics materialized views concurrently.';

-- Purpose: Fetch a high level executive dashboard KPI summary
CREATE OR REPLACE FUNCTION public.dashboard_kpis()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT json_build_object(
    'total_users', (SELECT SUM(new_users) FROM public.mvw_user_growth),
    'total_active_volunteers', (SELECT COUNT(*) FROM public.mvw_active_volunteers WHERE status = 'Active'),
    'total_donations_collected', (SELECT COALESCE(SUM(total_amount), 0) FROM public.mvw_donation_summary),
    'total_programs', (SELECT COUNT(*) FROM public.mvw_program_statistics WHERE status = 'active')
  )::jsonb;
$$;

-- Purpose: Schedule a report generation task
CREATE OR REPLACE FUNCTION public.generate_snapshot(
    p_report_name text, 
    p_report_type public.report_type, 
    p_user_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO public.report_snapshots (report_name, report_type, generated_by, status)
  VALUES (p_report_name, p_report_type, p_user_id, 'Pending')
  RETURNING id INTO v_id;
  
  -- In a real environment, this insert would be picked up by a worker queue (e.g. Supabase Edge Functions or pg_net)
  
  RETURN v_id;
END;
$$;

COMMIT;
