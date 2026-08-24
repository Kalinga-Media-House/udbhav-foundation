-- Migration: google_integrations.sql
-- Description: Creates the google_integrations table for secure OAuth credential storage
-- and Google service connections (Analytics, Search Console, Ads).

-- 1. Create the service enum
DO $$ BEGIN
  CREATE TYPE public.google_service_type AS ENUM ('analytics', 'search_console', 'ads');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.integration_status_type AS ENUM ('connected', 'disconnected', 'error', 'partially_configured');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2. Create the google_integrations table
CREATE TABLE IF NOT EXISTS public.google_integrations (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),

  -- Service identifier (one row per service)
  service public.google_service_type NOT NULL UNIQUE,

  -- Google account email used for the connection
  google_account_email text,

  -- Encrypted OAuth refresh token (AES-256-GCM encrypted at the application layer)
  -- Access tokens are NEVER stored; they are generated on-demand server-side.
  encrypted_refresh_token text,

  -- OAuth scopes granted during authorization
  scopes text,

  -- Connection status
  status public.integration_status_type NOT NULL DEFAULT 'disconnected',

  -- Service-specific metadata (property IDs, measurement IDs, customer IDs, etc.)
  -- Analytics: { ga_property_id, ga_measurement_id, ga_property_name, ga_account_id }
  -- Search Console: { site_url, permission_level, sitemap_url, sitemap_status }
  -- Ads: { customer_id, customer_name, manager_customer_id }
  meta_data jsonb NOT NULL DEFAULT '{}'::jsonb,

  -- Timestamps
  last_connected_at timestamptz,
  last_synced_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  -- Audit
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id)
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_google_integrations_service ON public.google_integrations (service);
CREATE INDEX IF NOT EXISTS idx_google_integrations_status ON public.google_integrations (status);

-- 4. Updated-at trigger (reuse existing foundation trigger function)
CREATE TRIGGER trg_google_integrations_updated_at
  BEFORE UPDATE ON public.google_integrations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- 5. Audit trigger (reuse existing audit_trigger_handler)
CREATE TRIGGER trg_google_integrations_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.google_integrations
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger_handler();

-- 6. Enable RLS
ALTER TABLE public.google_integrations ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies — Super Admin only (defense in depth)
-- Super Admin can read all integration rows
CREATE POLICY google_integrations_select_super_admin
  ON public.google_integrations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
        AND ur.is_active = true
        AND r.slug = 'super-admin'
    )
  );

-- Super Admin can insert integration rows
CREATE POLICY google_integrations_insert_super_admin
  ON public.google_integrations
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
        AND ur.is_active = true
        AND r.slug = 'super-admin'
    )
  );

-- Super Admin can update integration rows
CREATE POLICY google_integrations_update_super_admin
  ON public.google_integrations
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
        AND ur.is_active = true
        AND r.slug = 'super-admin'
    )
  );

-- Super Admin can delete integration rows
CREATE POLICY google_integrations_delete_super_admin
  ON public.google_integrations
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
        AND ur.is_active = true
        AND r.slug = 'super-admin'
    )
  );

-- 8. Grant necessary table permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.google_integrations TO authenticated;

COMMENT ON TABLE public.google_integrations IS
  'Stores Google service integration state and encrypted OAuth credentials. '
  'Access tokens are NEVER persisted; only encrypted refresh tokens are stored. '
  'RLS restricts all operations to super-admin users only.';

COMMENT ON COLUMN public.google_integrations.encrypted_refresh_token IS
  'AES-256-GCM encrypted OAuth refresh token. Decrypted server-side only using INTEGRATION_SECRET_KEY.';
