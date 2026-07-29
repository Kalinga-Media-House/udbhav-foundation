-- Migration: 026_automation_infrastructure.sql
-- Description: Automation schema for Phase 3.2 including email logs, automation audit trail, background jobs, tax receipts, and extended notifications.

BEGIN;

-------------------------------------------------------------------------------
-- 1. EXTEND EXISTING NOTIFICATIONS
-------------------------------------------------------------------------------

-- 1.1 Add new Categories
ALTER TYPE public.notification_category ADD VALUE IF NOT EXISTS 'info';
ALTER TYPE public.notification_category ADD VALUE IF NOT EXISTS 'success';
ALTER TYPE public.notification_category ADD VALUE IF NOT EXISTS 'warning';
ALTER TYPE public.notification_category ADD VALUE IF NOT EXISTS 'error';
ALTER TYPE public.notification_category ADD VALUE IF NOT EXISTS 'approval';
ALTER TYPE public.notification_category ADD VALUE IF NOT EXISTS 'reminder';

-- 1.2 Add new columns to notifications
ALTER TABLE public.notifications
    ADD COLUMN IF NOT EXISTS severity text DEFAULT 'info' CHECK (severity IN ('info', 'success', 'warning', 'error', 'critical')),
    ADD COLUMN IF NOT EXISTS icon text,
    ADD COLUMN IF NOT EXISTS source_module text;

-- Replace read_at with an is_read computed view or just add the boolean for strict compliance.
ALTER TABLE public.notifications
    ADD COLUMN IF NOT EXISTS is_read boolean GENERATED ALWAYS AS (read_at IS NOT NULL) STORED;

-------------------------------------------------------------------------------
-- 2. EXTEND NOTIFICATION PREFERENCES
-------------------------------------------------------------------------------

ALTER TABLE public.notification_preferences
    ADD COLUMN IF NOT EXISTS webhook_enabled boolean NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS realtime_enabled boolean NOT NULL DEFAULT true;

-------------------------------------------------------------------------------
-- 3. EMAIL LOGS
-------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.email_logs (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    recipient text NOT NULL,
    template text NOT NULL,
    provider text NOT NULL DEFAULT 'resend',
    provider_message_id text,
    status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'delivered', 'failed')),
    sent_at timestamp with time zone,
    error_message text,
    retry_count integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_email_logs_recipient ON public.email_logs(recipient);
CREATE INDEX idx_email_logs_status ON public.email_logs(status);

CREATE TRIGGER trg_email_logs_updated_at BEFORE UPDATE ON public.email_logs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-------------------------------------------------------------------------------
-- 4. AUTOMATION AUDIT TRAIL
-------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.automation_audit_logs (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    event_name text NOT NULL,
    triggered_by uuid REFERENCES auth.users(id) ON DELETE SET NULL, -- Null if system
    handler text NOT NULL,
    status text NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'success', 'failed', 'retrying')),
    started_at timestamp with time zone NOT NULL DEFAULT now(),
    completed_at timestamp with time zone,
    execution_time_ms integer,
    error text,
    metadata jsonb DEFAULT '{}'::jsonb
);

CREATE INDEX idx_automation_audit_event ON public.automation_audit_logs(event_name);
CREATE INDEX idx_automation_audit_status ON public.automation_audit_logs(status);

-------------------------------------------------------------------------------
-- 5. BACKGROUND JOBS (QUEUE)
-------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.background_jobs (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    job_type text NOT NULL,
    payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed', 'cancelled')),
    attempt integer NOT NULL DEFAULT 0,
    max_attempts integer NOT NULL DEFAULT 3,
    next_retry_at timestamp with time zone,
    last_error text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_background_jobs_status ON public.background_jobs(status);
CREATE INDEX idx_background_jobs_retry ON public.background_jobs(next_retry_at) WHERE status = 'failed' AND attempt < max_attempts;

CREATE TRIGGER trg_background_jobs_updated_at BEFORE UPDATE ON public.background_jobs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-------------------------------------------------------------------------------
-- 6. TAX RECEIPTS (ALTER EXISTING TABLE)
-------------------------------------------------------------------------------

ALTER TABLE public.tax_receipts
    ADD COLUMN IF NOT EXISTS r2_url text,
    ADD COLUMN IF NOT EXISTS checksum text,
    ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1;

-- Update existing trigger or it might already exist.
-- 015_donations_foundation.sql didn't have an updated_at column on tax_receipts, let's add it.
ALTER TABLE public.tax_receipts
    ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone NOT NULL DEFAULT now();

DROP TRIGGER IF EXISTS trg_tax_receipts_updated_at ON public.tax_receipts;
CREATE TRIGGER trg_tax_receipts_updated_at BEFORE UPDATE ON public.tax_receipts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-------------------------------------------------------------------------------
-- 7. ENABLE RLS
-------------------------------------------------------------------------------
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.background_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_receipts ENABLE ROW LEVEL SECURITY;

-- Admins can view everything.
CREATE POLICY "Admins can view email logs" ON public.email_logs FOR SELECT TO authenticated USING (public.has_any_role(ARRAY['super-admin', 'admin']));
CREATE POLICY "Admins can view automation audit" ON public.automation_audit_logs FOR SELECT TO authenticated USING (public.has_any_role(ARRAY['super-admin', 'admin']));
CREATE POLICY "Admins can view background jobs" ON public.background_jobs FOR SELECT TO authenticated USING (public.has_any_role(ARRAY['super-admin', 'admin']));

-- Donors can view their own tax receipts, Admins can view all
CREATE POLICY "Donors can view own tax receipts" ON public.tax_receipts FOR SELECT TO authenticated 
USING (
    public.has_any_role(ARRAY['super-admin', 'admin', 'finance-manager']) OR
    donation_id IN (
        SELECT d.id FROM public.donations d
        JOIN public.contacts c ON d.contact_id = c.id
        WHERE c.profile_id = public.current_user_id()
    )
);

COMMIT;
