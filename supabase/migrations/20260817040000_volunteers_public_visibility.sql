-- Migration: Add is_publicly_visible to volunteers table
-- Description: Move the source of truth for public visibility to the volunteers table.

BEGIN;

ALTER TABLE public.volunteers 
  ADD COLUMN IF NOT EXISTS is_publicly_visible BOOLEAN NOT NULL DEFAULT false;

COMMIT;
