-- Migration: 009_notification_foundation.sql
-- Description: Centralized enterprise notification, messaging, and broadcast infrastructure.
-- Dependencies: 001_extensions.sql, 002_auth_foundation.sql, 003_rbac_foundation.sql, 004_profiles.sql, 007_lookup_taxonomy.sql

BEGIN;

-------------------------------------------------------------------------------
-- 1. ENUMS
-------------------------------------------------------------------------------

CREATE TYPE public.notification_channel AS ENUM (
    'in_app',
    'email',
    'push',
    'sms',
    'webhook'
);

CREATE TYPE public.notification_status AS ENUM (
    'draft',
    'queued',
    'sending',
    'sent',
    'delivered',
    'read',
    'failed',
    'cancelled',
    'expired'
);

CREATE TYPE public.notification_priority AS ENUM (
    'low',
    'normal',
    'high',
    'critical'
);

CREATE TYPE public.notification_category AS ENUM (
    'marketing',
    'announcements',
    'system',
    'transactional',
    'social',
    'alerts'
);

-------------------------------------------------------------------------------
-- 2. TABLES
-------------------------------------------------------------------------------

-- 2.1 NOTIFICATIONS (The actual messages sent to users)
CREATE TABLE IF NOT EXISTS public.notifications (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    -- Routing
    recipient_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sender_id uuid REFERENCES auth.users(id) ON DELETE SET NULL, -- Null implies system-generated
    
    -- Classification
    category public.notification_category NOT NULL DEFAULT 'system',
    channel public.notification_channel NOT NULL DEFAULT 'in_app',
    priority public.notification_priority NOT NULL DEFAULT 'normal',
    
    -- Content
    title text NOT NULL,
    summary text, -- Short preview text
    message text NOT NULL, -- Full body (could be HTML depending on channel)
    action_url text, -- Where the user goes when they click it
    
    -- Polymorphic Entity Reference (e.g. "Event ID 123 was updated")
    entity_type text,
    entity_id uuid,
    
    -- Status & Lifecycle
    status public.notification_status NOT NULL DEFAULT 'queued',
    scheduled_at timestamp with time zone,
    sent_at timestamp with time zone,
    delivered_at timestamp with time zone,
    read_at timestamp with time zone,
    expires_at timestamp with time zone,
    
    metadata jsonb DEFAULT '{}'::jsonb, -- Store error logs, third-party message IDs (SendGrid/Twilio), etc.
    
    -- Standard Audit (we omit updated_by because system workers usually update this)
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    is_deleted boolean NOT NULL DEFAULT false -- Allows user to "delete" from their inbox
);

COMMENT ON TABLE public.notifications IS 'Core notification ledger for in-app alerts, emails, and pushes.';
COMMENT ON COLUMN public.notifications.action_url IS 'The deep-link or relative path the user is taken to upon interaction.';

-- 2.2 NOTIFICATION TEMPLATES (For standardized transactional emails / messages)
CREATE TABLE IF NOT EXISTS public.notification_templates (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    template_code citext NOT NULL UNIQUE CHECK (template_code ~ '^[a-z0-9_]+$'),
    display_name text NOT NULL,
    description text,
    
    channel public.notification_channel NOT NULL,
    language text NOT NULL DEFAULT 'en',
    
    -- Template Content (Handles Mustache or similar interpolations)
    subject text,
    body text NOT NULL,
    html_body text,
    
    variables jsonb DEFAULT '[]'::jsonb, -- Array of expected variable names
    
    is_active boolean NOT NULL DEFAULT true,
    version integer NOT NULL DEFAULT 1,
    
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.notification_templates IS 'Reusable templates for standardizing outbound communications.';

-- 2.3 NOTIFICATION PREFERENCES (User opt-in/opt-out settings)
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Global Channel Toggles
    email_enabled boolean NOT NULL DEFAULT true,
    in_app_enabled boolean NOT NULL DEFAULT true,
    push_enabled boolean NOT NULL DEFAULT false,
    sms_enabled boolean NOT NULL DEFAULT false,
    
    -- Category Toggles (Granular)
    marketing_enabled boolean NOT NULL DEFAULT false,
    announcements_enabled boolean NOT NULL DEFAULT true,
    social_enabled boolean NOT NULL DEFAULT true,
    
    -- Frequency
    digest_frequency text NOT NULL DEFAULT 'instant' CHECK (digest_frequency IN ('instant', 'daily', 'weekly', 'never')),
    
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.notification_preferences IS 'User opt-in and delivery frequency settings.';

-- 2.4 NOTIFICATION BROADCASTS (Bulk Messaging)
CREATE TABLE IF NOT EXISTS public.notification_broadcasts (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    -- Targeting Rules
    target_all_users boolean NOT NULL DEFAULT false,
    target_roles text[], -- Array of role slugs (e.g. ['admin', 'volunteer'])
    target_taxonomies uuid[], -- Array of taxonomy_term IDs
    target_users uuid[], -- Explicit list of user UUIDs
    
    -- Configuration
    template_id uuid REFERENCES public.notification_templates(id),
    channel public.notification_channel NOT NULL DEFAULT 'in_app',
    priority public.notification_priority NOT NULL DEFAULT 'normal',
    
    -- Content Overrides (If not using a template)
    custom_title text,
    custom_message text,
    custom_action_url text,
    
    -- Lifecycle
    scheduled_for timestamp with time zone,
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'processing', 'completed', 'cancelled')),
    
    -- Stats
    total_recipients integer DEFAULT 0,
    successful_deliveries integer DEFAULT 0,
    failed_deliveries integer DEFAULT 0,
    
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.notification_broadcasts IS 'Configurations for bulk sending messages to segmented audiences.';

-------------------------------------------------------------------------------
-- 3. INDEXES
-------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON public.notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(recipient_id) WHERE status IN ('delivered', 'sent', 'queued') AND read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_entity ON public.notifications(entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_notification_broadcasts_status ON public.notification_broadcasts(status);
CREATE INDEX IF NOT EXISTS idx_notification_broadcasts_schedule ON public.notification_broadcasts(scheduled_for);

-------------------------------------------------------------------------------
-- 4. TRIGGERS
-------------------------------------------------------------------------------

CREATE TRIGGER trg_notifications_updated_at BEFORE UPDATE ON public.notifications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_notification_templates_updated_at BEFORE UPDATE ON public.notification_templates FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_notification_templates_audit BEFORE INSERT OR UPDATE ON public.notification_templates FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();

CREATE TRIGGER trg_notification_preferences_updated_at BEFORE UPDATE ON public.notification_preferences FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_notification_broadcasts_updated_at BEFORE UPDATE ON public.notification_broadcasts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_notification_broadcasts_audit BEFORE INSERT OR UPDATE ON public.notification_broadcasts FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();


-- Enforce Default Preferences on New User Registration
CREATE OR REPLACE FUNCTION public.create_default_notification_preferences()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Note: In Supabase, auth.users is protected. If you run migrations as postgres (superuser), 
-- you can attach triggers to auth.users. Alternatively, you attach it to public.profiles.
CREATE TRIGGER trg_on_profile_created_prefs
AFTER INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.create_default_notification_preferences();

-------------------------------------------------------------------------------
-- 5. HELPER FUNCTIONS (For Application Backend)
-------------------------------------------------------------------------------

-- Purpose: Queue a new notification. Checks user preferences before queuing if it's not a system/critical alert.
-- Volatility: VOLATILE
CREATE OR REPLACE FUNCTION public.queue_notification(
    p_recipient_id uuid,
    p_title text,
    p_message text,
    p_category public.notification_category DEFAULT 'system',
    p_channel public.notification_channel DEFAULT 'in_app',
    p_priority public.notification_priority DEFAULT 'normal',
    p_action_url text DEFAULT NULL,
    p_entity_type text DEFAULT NULL,
    p_entity_id uuid DEFAULT NULL,
    p_sender_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_prefs public.notification_preferences;
  v_notification_id uuid;
  v_is_enabled boolean := true;
BEGIN
  -- 1. Fetch User Preferences
  SELECT * INTO v_prefs FROM public.notification_preferences WHERE user_id = p_recipient_id;
  
  -- 2. Respect Preferences (Unless Critical or System alert)
  IF p_priority != 'critical' AND p_category != 'system' AND v_prefs IS NOT NULL THEN
    IF p_channel = 'email' AND v_prefs.email_enabled = false THEN v_is_enabled := false; END IF;
    IF p_channel = 'in_app' AND v_prefs.in_app_enabled = false THEN v_is_enabled := false; END IF;
    IF p_channel = 'push' AND v_prefs.push_enabled = false THEN v_is_enabled := false; END IF;
    IF p_category = 'marketing' AND v_prefs.marketing_enabled = false THEN v_is_enabled := false; END IF;
  END IF;

  -- 3. Queue Notification
  IF v_is_enabled THEN
    INSERT INTO public.notifications (
      recipient_id, sender_id, category, channel, priority, 
      title, message, action_url, entity_type, entity_id, status
    ) VALUES (
      p_recipient_id, p_sender_id, p_category, p_channel, p_priority,
      p_title, p_message, p_action_url, p_entity_type, p_entity_id, 'queued'
    )
    RETURNING id INTO v_notification_id;
    
    RETURN v_notification_id;
  END IF;
  
  RETURN NULL; -- Denotes suppressed by preferences
END;
$$;
COMMENT ON FUNCTION public.queue_notification IS 'Safely queues a notification, automatically respecting the users opt-in preferences.';

-- Purpose: Mark a specific notification as read for the current user.
CREATE OR REPLACE FUNCTION public.mark_notification_read(p_notification_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.notifications
  SET status = 'read', read_at = now()
  WHERE id = p_notification_id
    AND recipient_id = public.current_user_id()
    AND read_at IS NULL;
END;
$$;

-- Purpose: Mark all notifications as read for the current user.
CREATE OR REPLACE FUNCTION public.mark_all_read()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.notifications
  SET status = 'read', read_at = now()
  WHERE recipient_id = public.current_user_id()
    AND status IN ('delivered', 'sent', 'queued')
    AND read_at IS NULL;
END;
$$;

-- Purpose: Cancel a queued or scheduled notification before it sends.
CREATE OR REPLACE FUNCTION public.cancel_notification(p_notification_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.notifications
  SET status = 'cancelled'
  WHERE id = p_notification_id 
    AND status IN ('draft', 'queued');
END;
$$;

COMMIT;
