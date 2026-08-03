-- Migration: 030_add_program_date_location.sql
-- Description: Adds NOT NULL constraints to program_date (formerly start_date) and location in programs table

BEGIN;

-- 1. Rename start_date to program_date
ALTER TABLE public.programs RENAME COLUMN start_date TO program_date;

-- 2. Backfill existing rows with sensible defaults
UPDATE public.programs 
SET program_date = CURRENT_DATE 
WHERE program_date IS NULL;

UPDATE public.programs 
SET location = 'Bhubaneswar, Odisha' 
WHERE location IS NULL OR location = '';

-- 3. Apply NOT NULL constraints
ALTER TABLE public.programs ALTER COLUMN program_date SET NOT NULL;
ALTER TABLE public.programs ALTER COLUMN location SET NOT NULL;

COMMIT;
