-- Migration: 002_auth_foundation.sql
-- Description: Establishes foundational reusable helper functions, triggers, and audit utilities.
-- Architecture: Functions are placed in the "public" schema to be easily callable by RLS policies.
-- Security: Functions accessing auth context use STABLE/VOLATILE correctly to prevent caching issues across different user contexts.

BEGIN;

-------------------------------------------------------------------------------
-- 1. AUTHENTICATION CONTEXT HELPERS
-------------------------------------------------------------------------------

-- Purpose: Safely retrieves the current user's UUID from the Supabase JWT.
-- Returns NULL if the user is not authenticated or the JWT is missing/invalid.
-- Volatility: STABLE (safe to use in RLS where context shouldn't change mid-query)
CREATE OR REPLACE FUNCTION public.current_user_id() 
RETURNS uuid
LANGUAGE sql 
STABLE
AS $$
  SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;
COMMENT ON FUNCTION public.current_user_id() IS 'Retrieves the authenticated user ID from the active JWT.';

-- Purpose: Safely retrieves the current user's email from the Supabase JWT.
-- Volatility: STABLE
CREATE OR REPLACE FUNCTION public.current_user_email() 
RETURNS text
LANGUAGE sql 
STABLE
AS $$
  SELECT NULLIF(current_setting('request.jwt.claim.email', true), '')::text;
$$;
COMMENT ON FUNCTION public.current_user_email() IS 'Retrieves the authenticated user email from the active JWT.';

-- Purpose: Boolean check if a user is currently authenticated.
-- Volatility: STABLE
CREATE OR REPLACE FUNCTION public.is_authenticated() 
RETURNS boolean
LANGUAGE sql 
STABLE
AS $$
  SELECT current_setting('request.jwt.claim.role', true) = 'authenticated';
$$;
COMMENT ON FUNCTION public.is_authenticated() IS 'Returns TRUE if the current session role is authenticated.';

-------------------------------------------------------------------------------
-- 2. SECURITY CONTEXT HELPERS
-------------------------------------------------------------------------------

-- Purpose: Boolean check to determine if the query is executed by the service_role (Admin API bypass).
-- Volatility: STABLE
CREATE OR REPLACE FUNCTION public.is_service_role() 
RETURNS boolean
LANGUAGE sql 
STABLE
AS $$
  SELECT current_setting('request.jwt.claim.role', true) = 'service_role';
$$;
COMMENT ON FUNCTION public.is_service_role() IS 'Returns TRUE if the current session role is service_role (bypass).';

-- Purpose: Stub for future RBAC context checking. Will be expanded in Migration 003.
-- Volatility: STABLE
CREATE OR REPLACE FUNCTION public.is_admin_context() 
RETURNS boolean
LANGUAGE sql 
STABLE
AS $$
  -- Future: Check JWT metadata or roles table. For now, just allow service_role.
  SELECT public.is_service_role();
$$;
COMMENT ON FUNCTION public.is_admin_context() IS 'Stub for RBAC admin check. Currently mimics service_role.';

-------------------------------------------------------------------------------
-- 3. TIMESTAMP / AUDIT TRIGGER FUNCTIONS
-------------------------------------------------------------------------------

-- Purpose: Generic trigger function to automatically update the 'updated_at' timestamp 
-- on row modification.
-- Volatility: VOLATILE (Modifies data)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only update if the row actually changed to prevent meaningless updates
  IF row_to_json(NEW) IS DISTINCT FROM row_to_json(OLD) THEN
    NEW.updated_at = now();
  END IF;
  RETURN NEW;
END;
$$;
COMMENT ON FUNCTION public.set_updated_at() IS 'Trigger function to set updated_at to the current transaction timestamp.';

-- Purpose: Generic trigger function to automatically set 'created_by' and 'updated_by' 
-- using the current authenticated user's ID.
-- Volatility: VOLATILE
CREATE OR REPLACE FUNCTION public.set_audit_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_uid uuid := public.current_user_id();
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.created_by = current_uid;
    NEW.updated_by = current_uid;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Preserve original creator, only modify updater
    NEW.created_by = OLD.created_by;
    
    IF row_to_json(NEW) IS DISTINCT FROM row_to_json(OLD) THEN
      NEW.updated_by = current_uid;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;
COMMENT ON FUNCTION public.set_audit_fields() IS 'Trigger function to automatically populate created_by and updated_by UUIDs.';

-------------------------------------------------------------------------------
-- 4. SOFT DELETE FOUNDATION
-------------------------------------------------------------------------------

-- Purpose: Generic trigger function to intercept DELETE statements and convert 
-- them to soft-deletes by updating 'deleted_at', 'deleted_by', and 'is_deleted'.
-- Volatility: VOLATILE
CREATE OR REPLACE FUNCTION public.handle_soft_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_uid uuid := public.current_user_id();
BEGIN
  -- Prevent actual deletion, convert to update via dynamic SQL based on the triggering table
  EXECUTE format(
    'UPDATE %I.%I SET is_deleted = true, deleted_at = now(), deleted_by = $1 WHERE id = $2',
    TG_TABLE_SCHEMA, TG_TABLE_NAME
  ) USING current_uid, OLD.id;
  
  -- We return NULL because we're cancelling the actual DELETE operation
  RETURN NULL;
END;
$$;
COMMENT ON FUNCTION public.handle_soft_delete() IS 'Trigger function to intercept DELETE and apply soft-delete audit fields.';

COMMIT;
