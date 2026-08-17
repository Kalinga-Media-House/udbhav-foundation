-- Migration: Add unique constraints for duplicate prevention on volunteer_applications
-- Description: Prevents duplicate volunteer applications by adding unique indexes
-- on normalized mobile_number and lowercase email.
-- First deduplicates existing rows by keeping the earliest application per mobile/email.

BEGIN;

-- Step 1: Normalize existing mobile numbers (strip non-digit, remove leading +91/91)
UPDATE public.volunteer_applications
SET mobile_number = regexp_replace(
    regexp_replace(mobile_number, '[^0-9]', '', 'g'),
    '^(91)(\d{10})$', '\2'
);

-- Step 2: Normalize existing emails (trim + lowercase)
UPDATE public.volunteer_applications
SET email = lower(trim(email));

-- Step 3: Remove duplicate mobile_number rows, keeping the earliest (smallest created_at)
DELETE FROM public.volunteer_applications a
USING public.volunteer_applications b
WHERE a.mobile_number = b.mobile_number
  AND a.created_at > b.created_at;

-- Step 4: Remove duplicate email rows, keeping the earliest
DELETE FROM public.volunteer_applications a
USING public.volunteer_applications b
WHERE a.email = b.email
  AND a.created_at > b.created_at;

-- Step 5: Unique index on mobile_number (already normalized to 10 digits)
CREATE UNIQUE INDEX IF NOT EXISTS idx_volunteer_applications_unique_mobile
    ON public.volunteer_applications (mobile_number);

-- Step 6: Unique index on normalized email
CREATE UNIQUE INDEX IF NOT EXISTS idx_volunteer_applications_unique_email
    ON public.volunteer_applications (lower(trim(email)));

COMMIT;
