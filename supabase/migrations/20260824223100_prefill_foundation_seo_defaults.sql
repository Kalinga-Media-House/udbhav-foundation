-- Migration: prefill_foundation_seo_defaults.sql
-- Description: Populates empty/outdated Foundation Identity & SEO settings
-- with the current official UDBHAV Foundation details.
-- Idempotent: only updates rows where the value is still empty or contains
-- the original placeholder. Existing non-empty values are never overwritten.

-- 1. Foundation Identity — populate only if empty or placeholder
UPDATE public.system_settings
SET value = '"UDBHAV Foundation"', default_value = '"UDBHAV Foundation"'
WHERE key_name = 'foundation_name'
  AND (value = '""' OR value = '"UDBHAV FOUNDATION"')
  AND is_deleted = false;

UPDATE public.system_settings
SET value = '"Growing Together for an Inclusive Future"', default_value = '"Growing Together for an Inclusive Future"'
WHERE key_name = 'foundation_tagline'
  AND (value = '""' OR value IS NULL)
  AND is_deleted = false;

UPDATE public.system_settings
SET value = '"admin@udbhavfoundation.in"', default_value = '"admin@udbhavfoundation.in"'
WHERE key_name = 'contact_email'
  AND (value = '""' OR value = '"hello@udbhav.org"')
  AND is_deleted = false;

UPDATE public.system_settings
SET value = '"+91 63705 08606"', default_value = '"+91 63705 08606"'
WHERE key_name = 'contact_phone'
  AND (value = '""' OR value IS NULL)
  AND is_deleted = false;

UPDATE public.system_settings
SET value = '"Plot No. 1519, Bharat Petroleum, 4269/4967, Besides/Above Bandhan Bank, Soubhagya Nagar, Baramunda, Bhubaneswar, Odisha – 751003"',
    default_value = '"Plot No. 1519, Bharat Petroleum, 4269/4967, Besides/Above Bandhan Bank, Soubhagya Nagar, Baramunda, Bhubaneswar, Odisha – 751003"'
WHERE key_name = 'address_primary'
  AND (value = '""' OR value IS NULL)
  AND is_deleted = false;

-- website_url: fix any .org leftover
UPDATE public.system_settings
SET value = '"https://udbhavfoundation.in"', default_value = '"https://udbhavfoundation.in"'
WHERE key_name = 'website_url'
  AND (value = '""' OR value = '"https://udbhav.org"')
  AND is_deleted = false;

-- 2. SEO settings — populate only if empty or placeholder
UPDATE public.system_settings
SET value = '"UDBHAV Foundation | Growing Together for an Inclusive Future"',
    default_value = '"UDBHAV Foundation | Growing Together for an Inclusive Future"'
WHERE key_name = 'seo_default_title'
  AND (value = '""'
    OR value = '"UDBHAV Foundation - Empowering Communities"'
    OR value = '"UDBHAV Foundation | Empowering Communities for an Inclusive Future"')
  AND is_deleted = false;

UPDATE public.system_settings
SET value = '"UDBHAV Foundation is a nonprofit organization working to empower communities through education, inclusion, environmental responsibility and collective action."',
    default_value = '"UDBHAV Foundation is a nonprofit organization working to empower communities through education, inclusion, environmental responsibility and collective action."'
WHERE key_name = 'seo_default_desc'
  AND (value = '""'
    OR value = '"UDBHAV is a non-profit organization focused on sustainable community development."'
    OR value = '"UDBHAV Foundation is a nonprofit organization working to empower communities through education, environmental initiatives, social development and inclusive community action."')
  AND is_deleted = false;

UPDATE public.system_settings
SET value = '["UDBHAV Foundation", "nonprofit organization Odisha", "community development Odisha", "education", "environmental responsibility", "inclusion", "youth empowerment", "volunteering Odisha", "social impact Odisha"]',
    default_value = '["UDBHAV Foundation", "nonprofit organization Odisha", "community development Odisha", "education", "environmental responsibility", "inclusion", "youth empowerment", "volunteering Odisha", "social impact Odisha"]'
WHERE key_name = 'seo_search_topics'
  AND is_deleted = false;

-- 3. Open Graph / Social Sharing — populate only if empty or placeholder
UPDATE public.system_settings
SET value = '"UDBHAV Foundation | Growing Together for an Inclusive Future"',
    default_value = '"UDBHAV Foundation | Growing Together for an Inclusive Future"'
WHERE key_name = 'og_title'
  AND (value = '""'
    OR value = '"UDBHAV Foundation | Empowering Communities for an Inclusive Future"')
  AND is_deleted = false;

UPDATE public.system_settings
SET value = '"UDBHAV Foundation works to empower communities through education, inclusion, environmental responsibility and collective action for a more inclusive and sustainable future."',
    default_value = '"UDBHAV Foundation works to empower communities through education, inclusion, environmental responsibility and collective action for a more inclusive and sustainable future."'
WHERE key_name = 'og_desc'
  AND (value = '""'
    OR value = '"UDBHAV Foundation is a nonprofit organization working to empower communities through education, environmental initiatives, social development and inclusive community action."')
  AND is_deleted = false;
