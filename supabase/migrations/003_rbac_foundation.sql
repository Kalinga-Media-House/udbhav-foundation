-- Migration: 003_rbac_foundation.sql
-- Description: Establishes enterprise Role-Based Access Control (RBAC) foundation.
-- Dependencies: 002_auth_foundation.sql (Requires public.set_audit_fields and public.set_updated_at triggers)

BEGIN;

-------------------------------------------------------------------------------
-- 1. TABLES
-------------------------------------------------------------------------------

-- 1.1 ROLES TABLE
CREATE TABLE IF NOT EXISTS public.roles (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9_-]+$'),
    display_name text NOT NULL,
    description text,
    is_system_role boolean NOT NULL DEFAULT false, -- Prevents accidental deletion of core roles
    priority integer NOT NULL DEFAULT 100,         -- Lower number = higher priority/privilege
    is_active boolean NOT NULL DEFAULT true,
    
    -- Audit fields
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    
    -- Soft Delete preparation
    is_deleted boolean NOT NULL DEFAULT false,
    deleted_at timestamp with time zone,
    deleted_by uuid
);

COMMENT ON TABLE public.roles IS 'Enterprise application roles.';
COMMENT ON COLUMN public.roles.slug IS 'Unique identifier for code reference (e.g., super-admin).';
COMMENT ON COLUMN public.roles.priority IS 'Determines role hierarchy. 1 is highest.';

-- 1.2 PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.permissions (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    code text NOT NULL UNIQUE CHECK (code ~ '^[a-z0-9_:\.]+$'), -- e.g., users:create
    display_name text NOT NULL,
    description text,
    category text NOT NULL, -- e.g., Dashboard, Users, Programs
    module text NOT NULL,   -- e.g., core, gallery, finance
    is_system_permission boolean NOT NULL DEFAULT false,
    
    -- Audit fields
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.permissions IS 'Granular permissions that can be assigned to roles.';
COMMENT ON COLUMN public.permissions.code IS 'Unique code used in application logic (e.g., users:read).';

-- 1.3 ROLE PERMISSIONS (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_id uuid NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id uuid NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    
    created_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    
    PRIMARY KEY (role_id, permission_id)
);

COMMENT ON TABLE public.role_permissions IS 'Mapping of permissions to roles.';

-- 1.4 USER ROLES
-- Note: auth.users is maintained by Supabase. We map to it without strict FK to allow local flexibility, 
-- but in production we treat auth.users.id as the definitive reference.
CREATE TABLE IF NOT EXISTS public.user_roles (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    user_id uuid NOT NULL, -- References auth.users(id)
    role_id uuid NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    is_primary boolean NOT NULL DEFAULT false,
    is_active boolean NOT NULL DEFAULT true,
    assigned_by uuid,
    assigned_at timestamp with time zone NOT NULL DEFAULT now(),
    expires_at timestamp with time zone, -- Future-proof for temporary access
    
    -- A user can only have a specific role assigned once
    UNIQUE (user_id, role_id)
);

COMMENT ON TABLE public.user_roles IS 'Assignment of roles to individual users.';

-------------------------------------------------------------------------------
-- 2. INDEXES
-------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_roles_slug ON public.roles(slug);
CREATE INDEX IF NOT EXISTS idx_roles_active ON public.roles(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_permissions_code ON public.permissions(code);
CREATE INDEX IF NOT EXISTS idx_permissions_category ON public.permissions(category);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_primary ON public.user_roles(user_id) WHERE is_primary = true;
CREATE INDEX IF NOT EXISTS idx_user_roles_active ON public.user_roles(is_active) WHERE is_active = true;

-------------------------------------------------------------------------------
-- 3. TRIGGERS
-------------------------------------------------------------------------------

-- Attach timestamp triggers
CREATE TRIGGER trg_roles_updated_at BEFORE UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_permissions_updated_at BEFORE UPDATE ON public.permissions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Attach audit triggers
CREATE TRIGGER trg_roles_audit BEFORE INSERT OR UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();
CREATE TRIGGER trg_permissions_audit BEFORE INSERT OR UPDATE ON public.permissions FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();

-- Attach soft delete to roles
CREATE TRIGGER trg_roles_soft_delete BEFORE DELETE ON public.roles FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();


-------------------------------------------------------------------------------
-- 4. SEED DATA
-------------------------------------------------------------------------------

-- 4.1 Seed Roles
INSERT INTO public.roles (slug, display_name, description, is_system_role, priority) VALUES
('super-admin', 'Super Admin', 'Full access to all system features and settings.', true, 1),
('admin', 'Administrator', 'Administrative access to manage content and users.', true, 10),
('editor', 'Editor', 'Can create and manage content but not system settings.', true, 20),
('volunteer-manager', 'Volunteer Manager', 'Manages volunteers and volunteer events.', true, 30),
('volunteer', 'Volunteer', 'Registered volunteer.', true, 50),
('content-manager', 'Content Manager', 'Manages news and general content.', true, 40),
('media-manager', 'Media Manager', 'Manages galleries and uploads.', true, 40),
('finance-manager', 'Finance Manager', 'Views and manages donation records.', true, 30),
('member', 'Member', 'Standard registered member of the foundation.', true, 100),
('guest', 'Guest', 'Limited access registered user.', true, 200)
ON CONFLICT (slug) DO NOTHING;

-- 4.2 Seed Permissions (Examples of Extensible Seed)
INSERT INTO public.permissions (code, display_name, category, module, is_system_permission) VALUES
-- System / Settings
('system:manage', 'Manage System', 'Settings', 'core', true),
('users:read', 'View Users', 'Users', 'core', true),
('users:write', 'Manage Users', 'Users', 'core', true),
('roles:assign', 'Assign Roles', 'Settings', 'core', true),

-- Content / Modules
('content:publish', 'Publish Content', 'News', 'content', true),
('content:write', 'Create/Edit Content', 'News', 'content', true),
('media:upload', 'Upload Media', 'Gallery', 'media', true),
('media:delete', 'Delete Media', 'Gallery', 'media', true),

-- Donations
('donations:read', 'View Donations', 'Donations', 'finance', true),
('donations:export', 'Export Donations', 'Donations', 'finance', true),

-- Volunteers
('volunteers:manage', 'Manage Volunteers', 'Volunteers', 'core', true),
('events:manage', 'Manage Events', 'Events', 'core', true)
ON CONFLICT (code) DO NOTHING;

-- Note: We do not bind all permissions to roles here. The application layer or a separate 
-- initialization script will handle mapping specific permissions to specific roles. 
-- However, we could bind 'system:manage' to 'super-admin' as a base.

INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r, public.permissions p
WHERE r.slug = 'super-admin' 
ON CONFLICT DO NOTHING;


-------------------------------------------------------------------------------
-- 5. RBAC HELPER FUNCTIONS (For RLS & Application Use)
-------------------------------------------------------------------------------

-- Purpose: Returns an array of role slugs assigned to the current user.
-- Volatility: STABLE
CREATE OR REPLACE FUNCTION public.current_user_roles()
RETURNS text[]
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT array_agg(r.slug)
  FROM public.user_roles ur
  JOIN public.roles r ON ur.role_id = r.id
  WHERE ur.user_id = public.current_user_id()
    AND ur.is_active = true
    AND r.is_active = true
    AND r.is_deleted = false
    AND (ur.expires_at IS NULL OR ur.expires_at > now());
$$;
COMMENT ON FUNCTION public.current_user_roles() IS 'Returns active role slugs for the authenticated user.';

-- Purpose: Returns an array of permission codes assigned to the current user via their roles.
-- Volatility: STABLE
CREATE OR REPLACE FUNCTION public.current_user_permissions()
RETURNS text[]
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT array_agg(DISTINCT p.code)
  FROM public.user_roles ur
  JOIN public.roles r ON ur.role_id = r.id
  JOIN public.role_permissions rp ON rp.role_id = r.id
  JOIN public.permissions p ON p.id = rp.permission_id
  WHERE ur.user_id = public.current_user_id()
    AND ur.is_active = true
    AND r.is_active = true
    AND r.is_deleted = false
    AND (ur.expires_at IS NULL OR ur.expires_at > now());
$$;
COMMENT ON FUNCTION public.current_user_permissions() IS 'Returns all active permission codes for the authenticated user.';

-- Purpose: Boolean check if the current user has a specific role.
-- Volatility: STABLE
CREATE OR REPLACE FUNCTION public.has_role(required_role text)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT required_role = ANY(public.current_user_roles());
$$;
COMMENT ON FUNCTION public.has_role(text) IS 'Checks if the user possesses the exact role slug.';

-- Purpose: Boolean check if the current user has ANY of the specified roles.
-- Volatility: STABLE
CREATE OR REPLACE FUNCTION public.has_any_role(required_roles text[])
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT required_roles && public.current_user_roles();
$$;

-- Purpose: Boolean check if the current user has a specific permission.
-- Super-admins bypass this check and always return true.
-- Volatility: STABLE
CREATE OR REPLACE FUNCTION public.has_permission(required_permission text)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT 
    'super-admin' = ANY(public.current_user_roles()) OR
    required_permission = ANY(public.current_user_permissions());
$$;
COMMENT ON FUNCTION public.has_permission(text) IS 'Checks if the user possesses a permission code. Super Admins bypass.';

-- Purpose: Boolean check if the current user has ALL of the specified permissions.
-- Volatility: STABLE
CREATE OR REPLACE FUNCTION public.has_all_permissions(required_permissions text[])
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT 
    'super-admin' = ANY(public.current_user_roles()) OR
    required_permissions <@ public.current_user_permissions();
$$;

COMMIT;
