-- Migration: 018_dashboard_kpi_foundation.sql
-- Description: Enterprise Dashboard & KPI Foundation. Integration layer providing optimized RPCs for the frontend.
-- Dependencies: 001-017 (Relies on ALL previous foundation modules)

BEGIN;

-------------------------------------------------------------------------------
-- 1. VIEWS: USER-SPECIFIC DASHBOARDS
-------------------------------------------------------------------------------

-- 1.1 VOLUNTEER DASHBOARD
CREATE OR REPLACE VIEW public.vw_volunteer_dashboard_stats AS
SELECT 
    v.id AS volunteer_id,
    v.profile_id,
    v.status,
    vs.total_hours,
    vs.events_participated AS event_count,
    COUNT(ev.id) FILTER (WHERE ev.attendance_status = 'scheduled') AS upcoming_events,
    COUNT(ev.id) FILTER (WHERE ev.attendance_status = 'present') AS attended_events
FROM public.volunteers v
LEFT JOIN public.event_volunteers ev ON v.id = ev.volunteer_id
LEFT JOIN public.volunteer_statistics vs ON v.id = vs.volunteer_id
WHERE v.is_deleted = false
GROUP BY v.id, v.profile_id, v.status, vs.total_hours, vs.events_participated;

COMMENT ON VIEW public.vw_volunteer_dashboard_stats IS 'Aggregated stats for the personal volunteer dashboard.';

-- 1.2 DONOR DASHBOARD
CREATE OR REPLACE VIEW public.vw_donor_dashboard_stats AS
SELECT 
    d.id AS contact_id,
    d.profile_id,
    COALESCE(SUM(tx.amount), 0) AS lifetime_donated,
    COUNT(tx.id) AS total_donations,
    COUNT(rd.id) FILTER (WHERE rd.status = 'active') AS active_subscriptions,
    MAX(tx.paid_at) AS last_donation_date
FROM public.contacts d
LEFT JOIN public.donations tx ON d.id = tx.contact_id AND tx.status = 'Paid' AND tx.is_deleted = false
LEFT JOIN public.recurring_donations rd ON d.id = rd.contact_id
GROUP BY d.id, d.profile_id;

COMMENT ON VIEW public.vw_donor_dashboard_stats IS 'Aggregated stats for the personal donor dashboard.';

-------------------------------------------------------------------------------
-- 2. VIEWS: ADMIN KPI DASHBOARDS
-------------------------------------------------------------------------------

-- 2.1 PENDING APPROVALS KIOSK
CREATE OR REPLACE VIEW public.vw_admin_pending_tasks AS
SELECT
    'Volunteer Approvals' AS task_type,
    COUNT(id) AS pending_count
FROM public.volunteers WHERE status = 'Pending Verification' AND is_deleted = false
UNION ALL
SELECT
    'Open Enquiries',
    COUNT(id)
FROM public.enquiries WHERE status = 'Open' AND is_deleted = false
UNION ALL
SELECT
    'Draft Articles',
    COUNT(id)
FROM public.news_articles WHERE status = 'Draft' AND is_deleted = false;

COMMENT ON VIEW public.vw_admin_pending_tasks IS 'Centralized to-do list for administrators.';

-------------------------------------------------------------------------------
-- 3. RPC FUNCTIONS: FRONTEND INTEGRATION
-------------------------------------------------------------------------------

-- 3.1 EXECUTIVE DASHBOARD (SuperAdmin overview combining 017's materialized views)
CREATE OR REPLACE FUNCTION public.admin_dashboard_overview()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT json_build_object(
    'kpis', (
      SELECT json_build_object(
        'total_users', (SELECT COALESCE(SUM(new_users), 0) FROM public.mvw_user_growth),
        'total_funds', (SELECT COALESCE(SUM(total_amount), 0) FROM public.mvw_donation_summary),
        'total_volunteers', (SELECT COUNT(*) FROM public.mvw_active_volunteers),
        'open_tickets', (SELECT COUNT(*) FROM public.enquiries WHERE status IN ('Open', 'Pending') AND is_deleted = false)
      )
    ),
    'pending_tasks', (
      SELECT json_agg(json_build_object('task', task_type, 'count', pending_count))
      FROM public.vw_admin_pending_tasks
    ),
    'recent_activity', (
      SELECT json_agg(row_to_json(a))
      FROM (
        SELECT entity_type, action, created_at, actor_id AS created_by 
        FROM public.activity_logs 
        ORDER BY created_at DESC 
        LIMIT 10
      ) a
    )
  )::jsonb;
$$;
COMMENT ON FUNCTION public.admin_dashboard_overview() IS 'Fetches the complete Executive Dashboard payload in one call.';

-- 3.2 VOLUNTEER DASHBOARD (For authenticated volunteer)
CREATE OR REPLACE FUNCTION public.volunteer_dashboard_overview(p_profile_id uuid)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT json_build_object(
    'stats', (
      SELECT row_to_json(v) 
      FROM public.vw_volunteer_dashboard_stats v 
      WHERE profile_id = p_profile_id
    ),
    'upcoming_events', (
      SELECT json_agg(row_to_json(e))
      FROM (
        SELECT ev.event_id, e.title, e.start_datetime AS start_time, ev.attendance_status AS status
        FROM public.event_volunteers ev
        JOIN public.events e ON ev.event_id = e.id
        JOIN public.volunteers v ON ev.volunteer_id = v.id
        WHERE v.profile_id = p_profile_id AND e.start_datetime >= now() AND e.is_deleted = false
        ORDER BY e.start_datetime ASC
        LIMIT 5
      ) e
    ),
    'recent_certificates', (
      SELECT json_agg(row_to_json(c))
      FROM (
        SELECT c.id, c.issue_date, c.certificate_number 
        FROM public.event_certificates c
        JOIN public.event_registrations r ON c.registration_id = r.id
        WHERE r.profile_id = p_profile_id
        ORDER BY c.issue_date DESC 
        LIMIT 5
      ) c
    )
  )::jsonb;
$$;
COMMENT ON FUNCTION public.volunteer_dashboard_overview(uuid) IS 'Fetches the personal Volunteer Dashboard payload in one call.';

-- 3.3 DONOR DASHBOARD (For authenticated donor)
CREATE OR REPLACE FUNCTION public.donor_dashboard_overview(p_profile_id uuid)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT json_build_object(
    'stats', (
      SELECT row_to_json(d) 
      FROM public.vw_donor_dashboard_stats d 
      WHERE profile_id = p_profile_id
    ),
    'recent_donations', (
      SELECT json_agg(row_to_json(tx))
      FROM (
        SELECT donation_number, amount, currency, status, paid_at, receipt_generated 
        FROM public.donations tx
        JOIN public.contacts d ON tx.contact_id = d.id
        WHERE d.profile_id = p_profile_id AND tx.is_deleted = false
        ORDER BY tx.created_at DESC 
        LIMIT 5
      ) tx
    ),
    'tax_receipts', (
      SELECT json_agg(row_to_json(tr))
      FROM (
        SELECT tr.receipt_number, tr.financial_year, tr.issue_date
        FROM public.tax_receipts tr
        JOIN public.donations tx ON tr.donation_id = tx.id
        JOIN public.contacts d ON tx.contact_id = d.id
        WHERE d.profile_id = p_profile_id
        ORDER BY tr.issue_date DESC 
        LIMIT 5
      ) tr
    )
  )::jsonb;
$$;
COMMENT ON FUNCTION public.donor_dashboard_overview(uuid) IS 'Fetches the personal Donor Dashboard payload in one call.';

-- 3.4 NOTIFICATION CENTER (Global Bell Icon)
CREATE OR REPLACE FUNCTION public.get_notification_center(p_user_id uuid)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT json_build_object(
    'unread_count', (
      SELECT count(*) 
      FROM public.notifications
      WHERE recipient_id = p_user_id AND read_at IS NULL
      AND is_deleted = false
    ),
    'latest', (
      SELECT json_agg(row_to_json(n))
      FROM (
        SELECT id, category AS type, title, message, action_url, created_at, read_at
        FROM public.notifications
        WHERE recipient_id = p_user_id AND is_deleted = false
        ORDER BY created_at DESC
        LIMIT 10
      ) n
    )
  )::jsonb;
$$;
COMMENT ON FUNCTION public.get_notification_center(uuid) IS 'Fetches unread count and latest 10 notifications for the UI bell icon.';

-------------------------------------------------------------------------------
-- 4. PROGRAM & EVENT DASHBOARDS (Detail Views)
-------------------------------------------------------------------------------

-- 4.1 PROGRAM DETAILS (For public and admin)
CREATE OR REPLACE FUNCTION public.program_dashboard_details(p_program_id uuid)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT json_build_object(
    'program', (SELECT row_to_json(p) FROM public.programs p WHERE id = p_program_id),
    'stats', (SELECT row_to_json(s) FROM public.mvw_program_statistics s WHERE program_id = p_program_id),
    'active_events', (
      SELECT json_agg(row_to_json(e))
      FROM (
        SELECT id, title, start_datetime AS start_time, status, registration_limit AS capacity
        FROM public.events 
        WHERE program_id = p_program_id AND is_deleted = false AND status IN ('draft', 'upcoming', 'registration_open', 'ongoing')
        ORDER BY start_datetime ASC
        LIMIT 5
      ) e
    )
  )::jsonb;
$$;

-------------------------------------------------------------------------------
-- 5. FINAL COMMIT
-------------------------------------------------------------------------------

COMMIT;
