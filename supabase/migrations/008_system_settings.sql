-- Migration: 008_system_settings.sql
-- Description: Centralized enterprise configuration and key-value settings.
-- Dependencies: 001_extensions.sql, 002_auth_foundation.sql, 005_audit_logs.sql

BEGIN;

-------------------------------------------------------------------------------
-- 1. ENUMS
-------------------------------------------------------------------------------

CREATE TYPE public.setting_category AS ENUM (
    'General', 'Branding', 'Contact', 'SEO', 'Social Media', 'Homepage',
    'Programs', 'Events', 'Gallery', 'News', 'Volunteers', 'Donations',
    'Email', 'Authentication', 'Media', 'Security', 'Analytics',
    'Notifications', 'System'
);

CREATE TYPE public.setting_data_type AS ENUM (
    'string', 'boolean', 'integer', 'decimal', 'json', 'array',
    'date', 'datetime', 'color', 'url', 'email', 'phone',
    'file_reference', 'media_reference'
);

CREATE TYPE public.setting_visibility AS ENUM (
    'public',          -- Shipped to the frontend client without auth
    'authenticated',   -- Shipped to frontend client for logged-in users only
    'admin_only',      -- Visible in dashboard UI for admins
    'internal'         -- Only visible to backend services / edge functions
);

CREATE TYPE public.setting_env_scope AS ENUM (
    'global',      -- Applies everywhere
    'production',  -- Applies only in production
    'staging',     -- Applies only in staging
    'development', -- Applies only in development
    'test'         -- Applies only in testing
);

-------------------------------------------------------------------------------
-- 2. TABLES
-------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.system_settings (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    -- Identity
    key_name citext NOT NULL UNIQUE CHECK (key_name ~ '^[a-z0-9_]+$'),
    display_name text NOT NULL,
    description text,
    category public.setting_category NOT NULL DEFAULT 'System',
    
    -- Data Definition
    data_type public.setting_data_type NOT NULL DEFAULT 'string',
    value jsonb NOT NULL,
    default_value jsonb NOT NULL,
    validation_rules jsonb DEFAULT '{}'::jsonb, -- Regex, Min, Max, Options
    
    -- State & Behavior
    is_editable boolean NOT NULL DEFAULT true,  -- If false, admins cannot change it in UI
    is_encrypted boolean NOT NULL DEFAULT false,-- If true, marks payload for client-side/edge decryption (future)
    visibility public.setting_visibility NOT NULL DEFAULT 'admin_only',
    env_scope public.setting_env_scope NOT NULL DEFAULT 'global',
    version integer NOT NULL DEFAULT 1,
    metadata jsonb DEFAULT '{}'::jsonb,
    
    -- Audit fields
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    
    -- Soft Delete
    is_deleted boolean NOT NULL DEFAULT false,
    deleted_at timestamp with time zone,
    deleted_by uuid
);

COMMENT ON TABLE public.system_settings IS 'Central registry for all application configuration, feature flags, and UI content.';
COMMENT ON COLUMN public.system_settings.key_name IS 'The unique snake_case identifier used in code (e.g. site_name).';
COMMENT ON COLUMN public.system_settings.value IS 'JSONB storage regardless of true data type to allow polymorphic generic structure.';
COMMENT ON COLUMN public.system_settings.visibility IS 'Determines if this setting is exposed via the public API anonymously.';

-------------------------------------------------------------------------------
-- 3. INDEXES
-------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_system_settings_key ON public.system_settings(key_name);
CREATE INDEX IF NOT EXISTS idx_system_settings_category ON public.system_settings(category);
CREATE INDEX IF NOT EXISTS idx_system_settings_visibility ON public.system_settings(visibility);
CREATE INDEX IF NOT EXISTS idx_system_settings_env ON public.system_settings(env_scope);

-------------------------------------------------------------------------------
-- 4. TRIGGERS
-------------------------------------------------------------------------------

-- 4.1 Boilerplate Audit & Timestamps
CREATE TRIGGER trg_system_settings_updated_at BEFORE UPDATE ON public.system_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_system_settings_audit BEFORE INSERT OR UPDATE ON public.system_settings FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();
CREATE TRIGGER trg_system_settings_soft_delete BEFORE DELETE ON public.system_settings FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

-- 4.2 Centralized Activity Auditing
-- IMPORTANT: Modifying global settings is a high-risk security action. It MUST go to the audit ledger.
CREATE TRIGGER trg_system_settings_activity_log
AFTER INSERT OR UPDATE OR DELETE ON public.system_settings
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_handler();

-- 4.3 Version Bump
CREATE OR REPLACE FUNCTION public.bump_setting_version()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.value IS DISTINCT FROM OLD.value THEN
    NEW.version := OLD.version + 1;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_system_settings_version 
BEFORE UPDATE ON public.system_settings 
FOR EACH ROW EXECUTE FUNCTION public.bump_setting_version();

-------------------------------------------------------------------------------
-- 5. HELPER FUNCTIONS
-------------------------------------------------------------------------------

-- Purpose: Gets a specific setting value safely.
-- Volatility: STABLE
CREATE OR REPLACE FUNCTION public.get_setting(p_key_name text)
RETURNS jsonb
LANGUAGE sql
STABLE
AS $$
  SELECT value FROM public.system_settings 
  WHERE key_name = p_key_name AND is_deleted = false
  LIMIT 1;
$$;

-- Purpose: Upserts a setting value securely. Only admins should normally call this.
CREATE OR REPLACE FUNCTION public.set_setting(p_key_name text, p_value jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.system_settings 
  SET value = p_value 
  WHERE key_name = p_key_name 
    AND is_editable = true
    AND is_deleted = false;
    
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Setting % not found, or is not editable.', p_key_name;
  END IF;
END;
$$;

-- Purpose: Returns all settings marked as 'public', mapped as a flat JSON object for frontend hydration.
-- Volatility: STABLE
CREATE OR REPLACE FUNCTION public.get_public_settings()
RETURNS jsonb
LANGUAGE sql
STABLE
AS $$
  SELECT jsonb_object_agg(key_name, value)
  FROM public.system_settings
  WHERE visibility = 'public' 
    AND is_deleted = false
    AND env_scope IN ('global', 'production'); -- Default to production view
$$;

-- Purpose: Resets a setting to its factory default value.
CREATE OR REPLACE FUNCTION public.reset_setting(p_key_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.system_settings 
  SET value = default_value 
  WHERE key_name = p_key_name 
    AND is_editable = true
    AND is_deleted = false;
END;
$$;

-- Purpose: Checks if a key exists
CREATE OR REPLACE FUNCTION public.setting_exists(p_key_name text)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.system_settings 
    WHERE key_name = p_key_name AND is_deleted = false
  );
$$;

-------------------------------------------------------------------------------
-- 6. SEED DATA
-------------------------------------------------------------------------------

INSERT INTO public.system_settings 
(key_name, display_name, description, category, data_type, value, default_value, visibility, is_editable) 
VALUES
-- BRANDING & GENERAL
('foundation_name', 'Foundation Name', 'Official registered name', 'General', 'string', '"UDBHAV FOUNDATION"', '"UDBHAV FOUNDATION"', 'public', true),
('foundation_short_name', 'Short Name', 'Acronym or short form', 'General', 'string', '"UDBHAV"', '"UDBHAV"', 'public', true),
('logo_primary', 'Primary Logo', 'URL to main logo', 'Branding', 'media_reference', '""', '""', 'public', true),
('favicon', 'Favicon', 'URL to favicon', 'Branding', 'media_reference', '""', '""', 'public', true),
('default_language', 'Default Language', 'Primary language code', 'General', 'string', '"en"', '"en"', 'public', true),
('default_timezone', 'Default Timezone', 'Primary timezone', 'General', 'string', '"Asia/Kolkata"', '"Asia/Kolkata"', 'public', true),

-- CONTACT
('contact_email', 'Contact Email', 'Primary public support email', 'Contact', 'email', '"hello@udbhav.org"', '"hello@udbhav.org"', 'public', true),
('contact_phone', 'Contact Phone', 'Primary public phone number', 'Contact', 'phone', '""', '""', 'public', true),
('address_primary', 'Primary Address', 'Main headquarters address', 'Contact', 'string', '""', '""', 'public', true),
('website_url', 'Website URL', 'Main production URL', 'Contact', 'url', '"https://udbhav.org"', '"https://udbhav.org"', 'public', true),

-- SOCIAL
('social_facebook', 'Facebook URL', 'Link to Facebook page', 'Social Media', 'url', '""', '""', 'public', true),
('social_instagram', 'Instagram URL', 'Link to Instagram profile', 'Social Media', 'url', '""', '""', 'public', true),
('social_linkedin', 'LinkedIn URL', 'Link to LinkedIn company page', 'Social Media', 'url', '""', '""', 'public', true),
('social_youtube', 'YouTube Channel', 'Link to YouTube channel', 'Social Media', 'url', '""', '""', 'public', true),

-- SEO
('seo_default_title', 'Default SEO Title', 'Fallback title tag', 'SEO', 'string', '"UDBHAV Foundation - Empowering Communities"', '"UDBHAV Foundation - Empowering Communities"', 'public', true),
('seo_default_desc', 'Default SEO Description', 'Fallback meta description', 'SEO', 'string', '"UDBHAV is a non-profit organization focused on sustainable community development."', '"UDBHAV is a non-profit organization focused on sustainable community development."', 'public', true),
('google_analytics_id', 'Google Analytics ID', 'G-XXXXXX measurement ID', 'Analytics', 'string', '""', '""', 'public', true),

-- SYSTEM FLAGS
('maintenance_mode', 'Maintenance Mode', 'If true, blocks public access', 'System', 'boolean', 'false', 'false', 'public', true),
('registration_enabled', 'User Registration Enabled', 'Allow public signups', 'Authentication', 'boolean', 'true', 'true', 'public', true),
('donations_enabled', 'Donations Enabled', 'Toggle payment gateways globally', 'Donations', 'boolean', 'false', 'false', 'public', true),
('volunteer_registration_enabled', 'Volunteer Signups Enabled', 'Allow volunteer onboarding', 'Volunteers', 'boolean', 'true', 'true', 'public', true)
ON CONFLICT (key_name) DO NOTHING;

COMMIT;
