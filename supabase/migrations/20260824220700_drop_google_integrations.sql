-- Migration: drop_google_integrations.sql
-- Description: Removes the google_integrations table and all related database
-- objects (enums, indexes, triggers, RLS policies, grants).
-- This cleanup migration is safe and idempotent.

-- 1. Drop the table (CASCADE removes indexes, triggers, RLS policies, grants)
DROP TABLE IF EXISTS public.google_integrations CASCADE;

-- 2. Drop the custom enum types created for this feature
DROP TYPE IF EXISTS public.google_service_type;
DROP TYPE IF EXISTS public.integration_status_type;
