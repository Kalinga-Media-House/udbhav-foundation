-- Migration 028: Fix Audit Triggers JSON comparison
-- 
-- The previous trigger functions `set_audit_fields` and `set_updated_at` used:
--   `row_to_json(NEW) IS DISTINCT FROM row_to_json(OLD)`
-- 
-- PostgreSQL `json` type does not support the equality/distinct operator.
-- This caused runtime crashes (HTTP 500) whenever an UPDATE or DELETE occurred.
-- This migration fixes the issue by casting to `jsonb` instead.

BEGIN;

CREATE OR REPLACE FUNCTION public.set_audit_fields()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF to_jsonb(NEW) IS DISTINCT FROM to_jsonb(OLD) THEN
      NEW.updated_at = now();
      NEW.updated_by = current_user_id();
    END IF;
  ELSIF TG_OP = 'INSERT' THEN
    NEW.created_at = now();
    NEW.created_by = current_user_id();
    NEW.updated_at = now();
    NEW.updated_by = current_user_id();
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF to_jsonb(NEW) IS DISTINCT FROM to_jsonb(OLD) THEN
    NEW.updated_at = now();
  END IF;
  RETURN NEW;
END;
$function$;

COMMIT;
