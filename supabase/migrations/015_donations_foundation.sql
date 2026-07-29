-- Migration: 015_donations_foundation.sql
-- Description: Enterprise Donations Module. Handles fundraising campaigns, payments, recurring giving, and tax receipts.
-- Dependencies: 001_extensions, 002_auth, 004_profiles, 005_audit, 006_media, 010_programs, 011_events

BEGIN;

-------------------------------------------------------------------------------
-- 1. ENUMS
-------------------------------------------------------------------------------

CREATE TYPE public.campaign_status AS ENUM (
    'Draft',
    'Active',
    'Paused',
    'Completed',
    'Cancelled',
    'Archived'
);

CREATE TYPE public.donation_type AS ENUM (
    'One Time',
    'Monthly',
    'Quarterly',
    'Half Yearly',
    'Yearly',
    'Campaign',
    'Program',
    'Emergency',
    'CSR',
    'Institutional',
    'Memorial',
    'Tribute'
);

CREATE TYPE public.payment_status AS ENUM (
    'Pending',
    'Authorized',
    'Captured',
    'Paid',
    'Failed',
    'Refund Pending',
    'Refunded',
    'Cancelled',
    'Expired'
);

CREATE TYPE public.payment_provider AS ENUM (
    'Razorpay',
    'Cashfree',
    'Stripe',
    'PayU',
    'Offline',
    'Bank Transfer',
    'Cheque',
    'UPI',
    'Cash'
);

CREATE TYPE public.recurring_frequency AS ENUM (
    'Monthly',
    'Quarterly',
    'Half Yearly',
    'Yearly'
);

-------------------------------------------------------------------------------
-- 2. TABLES
-------------------------------------------------------------------------------

-- 2.1 DONATION CAMPAIGNS
CREATE TABLE IF NOT EXISTS public.donation_campaigns (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    campaign_code extensions.citext NOT NULL UNIQUE CHECK (campaign_code ~ '^[A-Z0-9-]+$'),
    slug extensions.citext NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9_-]+$'),
    title text NOT NULL,
    subtitle text,
    description text,
    goal_amount numeric(15, 2) NOT NULL DEFAULT 0 CHECK (goal_amount >= 0),
    raised_amount numeric(15, 2) NOT NULL DEFAULT 0 CHECK (raised_amount >= 0),
    currency extensions.citext NOT NULL DEFAULT 'INR',
    cover_image_id uuid REFERENCES public.media_files(id) ON DELETE SET NULL,
    gallery_id uuid REFERENCES public.media_collections(id) ON DELETE SET NULL,
    program_id uuid REFERENCES public.programs(id) ON DELETE SET NULL,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    status public.campaign_status NOT NULL DEFAULT 'Draft',
    visibility public.program_visibility NOT NULL DEFAULT 'public',
    is_featured boolean NOT NULL DEFAULT false,
    priority integer NOT NULL DEFAULT 0,
    search_vector tsvector,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    is_deleted boolean NOT NULL DEFAULT false,
    deleted_at timestamp with time zone,
    deleted_by uuid
);

COMMENT ON TABLE public.donation_campaigns IS 'Time-bound or objective-bound fundraising campaigns.';

-- 2.2 RECURRING DONATIONS
CREATE TABLE IF NOT EXISTS public.recurring_donations (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    contact_id uuid NOT NULL, -- FK added in 020 to link to FRM
    campaign_id uuid REFERENCES public.donation_campaigns(id) ON DELETE SET NULL,
    program_id uuid REFERENCES public.programs(id) ON DELETE SET NULL,
    
    amount numeric(15, 2) NOT NULL CHECK (amount > 0),
    currency extensions.citext NOT NULL DEFAULT 'INR',
    frequency public.recurring_frequency NOT NULL DEFAULT 'Monthly',
    
    provider public.payment_provider NOT NULL,
    gateway_subscription_id text UNIQUE,
    
    start_date date NOT NULL DEFAULT CURRENT_DATE,
    end_date date,
    next_billing_date date,
    auto_renewal boolean NOT NULL DEFAULT true,
    
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled', 'completed', 'failed')),
    cancellation_reason text,
    
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.recurring_donations IS 'Master record for recurring mandates/subscriptions setup with payment gateways.';

-- 2.3 DONATIONS (The transactional ledger root)
CREATE TABLE IF NOT EXISTS public.donations (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    -- Identity & Linking
    donation_number extensions.citext NOT NULL UNIQUE, -- Human readable (e.g. D-2026-10492)
    contact_id uuid NOT NULL, -- FK added in 020 to link to FRM
    campaign_id uuid REFERENCES public.donation_campaigns(id) ON DELETE SET NULL,
    program_id uuid REFERENCES public.programs(id) ON DELETE SET NULL,
    event_id uuid REFERENCES public.events(id) ON DELETE SET NULL,
    recurring_donation_id uuid REFERENCES public.recurring_donations(id) ON DELETE SET NULL,
    
    -- Core Transaction
    donation_type public.donation_type NOT NULL DEFAULT 'One Time',
    amount numeric(15, 2) NOT NULL CHECK (amount > 0),
    currency extensions.citext NOT NULL DEFAULT 'INR',
    purpose text, 
    
    -- Payment Fulfillment
    payment_method text,
    provider public.payment_provider NOT NULL DEFAULT 'Razorpay',
    gateway_transaction_id text,
    gateway_order_id text,
    
    status public.payment_status NOT NULL DEFAULT 'Pending',
    paid_at timestamp with time zone,
    
    -- Tax Exemption
    is_80g_eligible boolean NOT NULL DEFAULT false,
    receipt_generated boolean NOT NULL DEFAULT false,
    
    metadata jsonb DEFAULT '{}'::jsonb,
    
    -- Audit
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    
    -- Soft Delete (Only allowed for Draft/Pending/Failed)
    is_deleted boolean NOT NULL DEFAULT false,
    deleted_at timestamp with time zone,
    deleted_by uuid
);

COMMENT ON TABLE public.donations IS 'Financial ledger of all donation transactions (successful and failed).';

-- 2.4 IMMUTABLE FINANCIAL LEDGER
CREATE TABLE IF NOT EXISTS public.financial_ledger (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    donation_id uuid NOT NULL REFERENCES public.donations(id) ON DELETE RESTRICT,
    event_type text NOT NULL, -- 'Donation Created', 'Payment Authorized', 'Payment Captured', 'Refund Requested', 'Refund Completed', 'Adjustment', 'Settlement'
    amount numeric(15, 2) NOT NULL,
    currency extensions.citext NOT NULL DEFAULT 'INR',
    gateway_reference text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.financial_ledger IS 'Immutable append-only ledger for all financial movements related to donations.';

-- 2.5 TAX RECEIPTS
CREATE TABLE IF NOT EXISTS public.tax_receipts (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    donation_id uuid NOT NULL UNIQUE REFERENCES public.donations(id) ON DELETE RESTRICT,
    receipt_number extensions.citext NOT NULL UNIQUE, -- e.g. UDF-2026-000001
    
    financial_year extensions.citext NOT NULL, -- e.g. "2026-2027"
    issue_date date NOT NULL DEFAULT CURRENT_DATE,
    
    pdf_file_id uuid REFERENCES public.media_files(id) ON DELETE SET NULL,
    downloaded_count integer NOT NULL DEFAULT 0,
    
    created_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.tax_receipts IS 'Immutable log of 80G tax receipts issued to donors.';

-- 2.6 REFUNDS
CREATE TABLE IF NOT EXISTS public.donation_refunds (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    donation_id uuid NOT NULL REFERENCES public.donations(id) ON DELETE RESTRICT,
    
    refund_amount numeric(15, 2) NOT NULL CHECK (refund_amount > 0),
    reason text NOT NULL,
    
    gateway_refund_id text,
    status text NOT NULL DEFAULT 'Refund Pending' CHECK (status IN ('Refund Pending', 'Refunded', 'Failed')),
    
    processed_by uuid,
    processed_at timestamp with time zone,
    
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.donation_refunds IS 'Ledger for donation chargebacks or manual refunds.';

-- 2.7 PAYMENT WEBHOOKS
CREATE TABLE IF NOT EXISTS public.payment_webhooks (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    provider public.payment_provider NOT NULL,
    event_type text NOT NULL, -- e.g. "payment.captured"
    gateway_event_id text UNIQUE NOT NULL, -- Idempotency Key
    
    payload jsonb NOT NULL,
    headers jsonb NOT NULL,
    signature text,
    
    is_verified boolean NOT NULL DEFAULT false,
    is_processed boolean NOT NULL DEFAULT false,
    
    retry_count integer NOT NULL DEFAULT 0,
    processing_response text,
    
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    processed_at timestamp with time zone
);

COMMENT ON TABLE public.payment_webhooks IS 'Raw webhook ingestion table to ensure idempotency and reliable webhook processing.';

-------------------------------------------------------------------------------
-- 3. INDEXES
-------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_campaigns_code ON public.donation_campaigns(campaign_code);
CREATE INDEX IF NOT EXISTS idx_campaigns_slug ON public.donation_campaigns(slug);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.donation_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_program ON public.donation_campaigns(program_id);

CREATE INDEX IF NOT EXISTS idx_donations_contact ON public.donations(contact_id);
CREATE INDEX IF NOT EXISTS idx_donations_campaign ON public.donations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_donations_program ON public.donations(program_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON public.donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_number ON public.donations(donation_number);
CREATE INDEX IF NOT EXISTS idx_donations_tx ON public.donations(gateway_transaction_id);

CREATE INDEX IF NOT EXISTS idx_recurring_donations_contact ON public.recurring_donations(contact_id);
CREATE INDEX IF NOT EXISTS idx_recurring_donations_status ON public.recurring_donations(status);

CREATE INDEX IF NOT EXISTS idx_fin_ledger_donation ON public.financial_ledger(donation_id);

CREATE INDEX IF NOT EXISTS idx_tax_receipts_donation ON public.tax_receipts(donation_id);
CREATE INDEX IF NOT EXISTS idx_tax_receipts_number ON public.tax_receipts(receipt_number);
CREATE INDEX IF NOT EXISTS idx_tax_receipts_fy ON public.tax_receipts(financial_year);

CREATE INDEX IF NOT EXISTS idx_payment_webhooks_processed ON public.payment_webhooks(is_processed) WHERE is_processed = false;
CREATE INDEX IF NOT EXISTS idx_payment_webhooks_event_id ON public.payment_webhooks(gateway_event_id);

-------------------------------------------------------------------------------
-- 4. TRIGGERS
-------------------------------------------------------------------------------

-- 4.1 Update Campaign Raised Amount automatically when donation succeeds
CREATE OR REPLACE FUNCTION public.update_campaign_raised_amount()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- If donation is marked Paid and belongs to a campaign
  IF NEW.status = 'Paid' AND OLD.status != 'Paid' AND NEW.campaign_id IS NOT NULL THEN
    UPDATE public.donation_campaigns
    SET raised_amount = raised_amount + NEW.amount
    WHERE id = NEW.campaign_id;
  END IF;
  
  -- If donation is Refunded
  IF NEW.status = 'Refunded' AND OLD.status != 'Refunded' AND NEW.campaign_id IS NOT NULL THEN
    UPDATE public.donation_campaigns
    SET raised_amount = GREATEST(0, raised_amount - NEW.amount)
    WHERE id = NEW.campaign_id;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_donations_update_campaign 
AFTER UPDATE OF status ON public.donations 
FOR EACH ROW EXECUTE FUNCTION public.update_campaign_raised_amount();

-- 4.2 Standard Timestamps & Audits
CREATE TRIGGER trg_campaigns_updated_at BEFORE UPDATE ON public.donation_campaigns FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_campaigns_audit BEFORE INSERT OR UPDATE ON public.donation_campaigns FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();
CREATE TRIGGER trg_campaigns_soft_delete BEFORE DELETE ON public.donation_campaigns FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

CREATE TRIGGER trg_donations_updated_at BEFORE UPDATE ON public.donations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_donations_audit BEFORE INSERT OR UPDATE ON public.donations FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();
CREATE TRIGGER trg_donations_soft_delete BEFORE DELETE ON public.donations FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

CREATE TRIGGER trg_recurring_updated_at BEFORE UPDATE ON public.recurring_donations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_refunds_updated_at BEFORE UPDATE ON public.donation_refunds FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4.3 Centralized Activity Logging (Audit Trail)
CREATE TRIGGER trg_campaigns_activity_log AFTER INSERT OR UPDATE OR DELETE ON public.donation_campaigns FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_handler();
CREATE TRIGGER trg_donations_activity_log AFTER INSERT OR UPDATE OR DELETE ON public.donations FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_handler();
CREATE TRIGGER trg_refunds_activity_log AFTER INSERT OR UPDATE OR DELETE ON public.donation_refunds FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_handler();
CREATE TRIGGER trg_fin_ledger_activity_log AFTER INSERT OR UPDATE OR DELETE ON public.financial_ledger FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_handler();

-------------------------------------------------------------------------------
-- 5. HELPER VIEWS
-------------------------------------------------------------------------------

CREATE OR REPLACE VIEW public.vw_campaign_progress AS
SELECT 
    id AS campaign_id,
    title,
    goal_amount,
    raised_amount,
    CASE WHEN goal_amount > 0 THEN ROUND((raised_amount / goal_amount) * 100, 2) ELSE 0 END AS percentage_completed,
    status,
    start_date,
    end_date
FROM public.donation_campaigns
WHERE is_deleted = false;

-------------------------------------------------------------------------------
-- 6. HELPER FUNCTIONS
-------------------------------------------------------------------------------

-- Purpose: Generate an immutable UDF-YYYY-XXXXXX receipt number
CREATE OR REPLACE FUNCTION public.generate_receipt_number()
RETURNS extensions.citext
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
AS $$
DECLARE
  v_year text;
  v_count integer;
  v_receipt extensions.citext;
BEGIN
  v_year := to_char(CURRENT_DATE, 'YYYY');
  SELECT count(*) + 1 INTO v_count FROM public.tax_receipts WHERE financial_year LIKE v_year || '%';
  v_receipt := 'UDF-' || v_year || '-' || LPAD(v_count::text, 6, '0');
  RETURN v_receipt;
END;
$$;

-- Purpose: Fetch active campaigns for the frontend
CREATE OR REPLACE FUNCTION public.active_campaigns(p_limit integer DEFAULT 10)
RETURNS TABLE (
    campaign_id uuid,
    title text,
    slug extensions.citext,
    goal_amount numeric,
    raised_amount numeric,
    cover_image_id uuid
)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    id, title, slug, goal_amount, raised_amount, cover_image_id
  FROM public.donation_campaigns
  WHERE status = 'Active' AND is_deleted = false
  ORDER BY priority DESC, created_at DESC
  LIMIT p_limit;
$$;

COMMIT;
