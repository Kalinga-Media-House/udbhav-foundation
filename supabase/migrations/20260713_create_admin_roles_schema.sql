-- Migration: Create UDBHAV Foundation Admin Roles Schema
-- Note: Prepared for review. Do not execute automatically.

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (
    role IN (
      'super_admin',
      'admin',
      'content_admin',
      'programme_admin'
    )
  ),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Index for quick role lookups during authentication
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security Policies
-- Important: We do not expose this table to anonymous public read.
-- Only authenticated users can read their own role.
-- Only super_admins can read all roles.

CREATE POLICY "Users can read own role"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Optionally, you can add a policy for super_admins to manage roles, but 
-- that is outside the scope of basic auth integration right now.
-- In production, the initial super_admin role can be set manually via SQL or a secure edge function.
