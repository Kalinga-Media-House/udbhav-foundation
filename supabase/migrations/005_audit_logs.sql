-- Migration: 005_audit_logs.sql
-- Description: Centralized enterprise audit logging and activity tracking.
-- Dependencies: 001_extensions.sql, 002_auth_foundation.sql

BEGIN;

-------------------------------------------------------------------------------
-- 1. TABLES & TYPES
-------------------------------------------------------------------------------

-- 1.1 ENUMS
-- Creating ENUMs for severity and categories to enforce strict typing and save space.
CREATE TYPE public.activity_severity AS ENUM ('info', 'success', 'warning', 'error', 'critical');

CREATE TYPE public.activity_category AS ENUM (
    'Authentication',
    'Authorization',
    'Users',
    'Programs',
    'Events',
    'Gallery',
    'News',
    'Volunteers',
    'Donations',
    'Settings',
    'Media',
    'System'
);

-- 1.2 ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    -- Actor (Who did it)
    actor_id uuid, -- Can reference auth.users/profiles, nullable for system actions
    
    -- Action (What was done)
    action text NOT NULL, -- e.g., 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'PUBLISH'
    category public.activity_category NOT NULL,
    module text NOT NULL, -- Logical grouping within the category
    severity public.activity_severity NOT NULL DEFAULT 'info',
    description text,
    
    -- Entity (What it was done to)
    -- Loosely coupled polymorphic relationship instead of strict FKs
    entity_type text, -- e.g., 'event', 'profile', 'role'
    entity_id uuid,   -- ID of the affected record
    
    -- Data Payloads
    old_values jsonb,
    new_values jsonb,
    metadata jsonb DEFAULT '{}'::jsonb, -- Additional context (browser, request ID, etc.)
    
    -- Network Context
    ip_address inet,
    user_agent text,
    
    -- Timestamps
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.activity_logs IS 'Append-only ledger of all enterprise activity and security events.';
COMMENT ON COLUMN public.activity_logs.actor_id IS 'UUID of the user performing the action. Null for system actions.';
COMMENT ON COLUMN public.activity_logs.entity_type IS 'Generic string representing the target table/domain (polymorphic).';
COMMENT ON COLUMN public.activity_logs.old_values IS 'State of the entity before the action (for UPDATE/DELETE).';
COMMENT ON COLUMN public.activity_logs.new_values IS 'State of the entity after the action (for INSERT/UPDATE).';

-------------------------------------------------------------------------------
-- 2. INDEXES
-------------------------------------------------------------------------------

-- 2.1 Time-series Index (Crucial for a log table)
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs (created_at DESC);

-- 2.2 Lookup Indexes
CREATE INDEX IF NOT EXISTS idx_activity_logs_actor_id ON public.activity_logs (actor_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON public.activity_logs (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_category ON public.activity_logs (category);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON public.activity_logs (action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_severity ON public.activity_logs (severity);

-- 2.3 GIN Indexes for fast JSON searching
CREATE INDEX IF NOT EXISTS idx_activity_logs_metadata ON public.activity_logs USING GIN (metadata);
CREATE INDEX IF NOT EXISTS idx_activity_logs_new_values ON public.activity_logs USING GIN (new_values);
CREATE INDEX IF NOT EXISTS idx_activity_logs_old_values ON public.activity_logs USING GIN (old_values);

-------------------------------------------------------------------------------
-- 3. SECURITY CONSTRAINTS (APPEND-ONLY)
-------------------------------------------------------------------------------

-- Purpose: Prevent modification or deletion of audit logs once written.
CREATE OR REPLACE FUNCTION public.prevent_audit_modification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'UPDATE' OR TG_OP = 'DELETE' THEN
    RAISE EXCEPTION 'Audit logs are immutable. % operations are prohibited on activity_logs.', TG_OP;
  END IF;
  RETURN NULL;
END;
$$;
COMMENT ON FUNCTION public.prevent_audit_modification() IS 'Enforces append-only behavior for the activity_logs table.';

CREATE TRIGGER trg_prevent_audit_mod
BEFORE UPDATE OR DELETE ON public.activity_logs
FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_modification();

-------------------------------------------------------------------------------
-- 4. HELPER FUNCTIONS
-------------------------------------------------------------------------------

-- Purpose: Generic logging function that can be called from the application backend (Supabase Edge Functions / Next.js API).
-- Volatility: VOLATILE
CREATE OR REPLACE FUNCTION public.log_activity(
    p_action text,
    p_category public.activity_category,
    p_module text,
    p_description text,
    p_entity_type text DEFAULT NULL,
    p_entity_id uuid DEFAULT NULL,
    p_old_values jsonb DEFAULT NULL,
    p_new_values jsonb DEFAULT NULL,
    p_severity public.activity_severity DEFAULT 'info',
    p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_actor_id uuid := public.current_user_id();
  v_log_id uuid;
BEGIN
  INSERT INTO public.activity_logs (
    actor_id, action, category, module, severity, description,
    entity_type, entity_id, old_values, new_values, metadata
  ) VALUES (
    v_actor_id, p_action, p_category, p_module, p_severity, p_description,
    p_entity_type, p_entity_id, p_old_values, p_new_values, p_metadata
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;
COMMENT ON FUNCTION public.log_activity IS 'Core function for application-level activity logging.';


-- Purpose: Specific helper for critical security events (logins, permission changes).
-- Volatility: VOLATILE
CREATE OR REPLACE FUNCTION public.log_security_event(
    p_action text,
    p_description text,
    p_metadata jsonb DEFAULT '{}'::jsonb,
    p_severity public.activity_severity DEFAULT 'warning'
)
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT public.log_activity(
    p_action, 
    'Authorization'::public.activity_category, 
    'security', 
    p_description, 
    NULL, NULL, NULL, NULL, 
    p_severity, 
    p_metadata
  );
$$;

-- Purpose: Specific helper for system-level automated events (cron jobs, system migrations).
-- Volatility: VOLATILE
CREATE OR REPLACE FUNCTION public.log_system_event(
    p_action text,
    p_description text,
    p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_log_id uuid;
BEGIN
  INSERT INTO public.activity_logs (
    actor_id, action, category, module, severity, description, metadata
  ) VALUES (
    NULL, -- Explicitly NULL for system actions
    p_action, 'System', 'core', 'info', p_description, p_metadata
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

-------------------------------------------------------------------------------
-- 5. REUSABLE TRIGGER TEMPLATES
-------------------------------------------------------------------------------

-- Purpose: A reusable trigger function to automatically log INSERT/UPDATE/DELETE 
-- on any table it is attached to. 
-- Note: It is NOT attached globally. Developers will attach this to high-value tables.
CREATE OR REPLACE FUNCTION public.audit_trigger_handler()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_old_data jsonb;
  v_new_data jsonb;
  v_action text;
  v_entity_id uuid;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_new_data = row_to_json(NEW);
    v_action = 'CREATE';
    v_entity_id = NEW.id;
  ELSIF TG_OP = 'UPDATE' THEN
    v_old_data = row_to_json(OLD);
    v_new_data = row_to_json(NEW);
    v_action = 'UPDATE';
    v_entity_id = NEW.id;
  ELSIF TG_OP = 'DELETE' THEN
    v_old_data = row_to_json(OLD);
    v_action = 'DELETE';
    v_entity_id = OLD.id;
  END IF;

  -- Only log if data actually changed (preventing noisy UPDATE logs)
  IF TG_OP = 'UPDATE' AND v_old_data = v_new_data THEN
    RETURN NULL;
  END IF;

  PERFORM public.log_activity(
    v_action,
    'System'::public.activity_category, -- Calling table should define this in trigger args ideally
    TG_TABLE_NAME::text,
    format('%s record on %s', v_action, TG_TABLE_NAME),
    TG_TABLE_NAME::text,
    v_entity_id,
    v_old_data,
    v_new_data,
    'info'::public.activity_severity
  );

  RETURN NULL; -- AFTER trigger
END;
$$;
COMMENT ON FUNCTION public.audit_trigger_handler() IS 'Generic trigger function to automatically pipe table changes into activity_logs.';

COMMIT;
