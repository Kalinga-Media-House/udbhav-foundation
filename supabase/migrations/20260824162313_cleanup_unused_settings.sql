-- Migration: cleanup_unused_settings.sql
-- Description: Removes completely unused placeholder settings from the system_settings table.

DELETE FROM public.system_settings
WHERE key_name IN (
  'google_analytics_id',
  'donations_enabled',
  'foundation_short_name',
  'website_url',
  'maintenance_mode',
  'registration_enabled',
  'volunteer_registration_enabled',
  'logo_primary',
  'favicon',
  'default_language',
  'default_timezone',
  'social_facebook',
  'social_instagram',
  'social_linkedin',
  'social_youtube'
);

COMMIT;
