-- Migration: 020_frm_foundation.sql
-- Description: Foundation Relationship Management (FRM) Module
-- Upgrades existing contacts to the FRM Single Source of Truth architecture.

BEGIN;

-------------------------------------------------------------------------------
-- 1. IDENTIFIER GENERATORS
-------------------------------------------------------------------------------

CREATE SEQUENCE IF NOT EXISTS seq_frm_contacts START 1;
CREATE SEQUENCE IF NOT EXISTS seq_frm_orgs START 1;

CREATE OR REPLACE FUNCTION public.generate_contact_number()
RETURNS extensions.citext
LANGUAGE sql
VOLATILE
AS $$
  SELECT 'FRM-' || LPAD(nextval('seq_frm_contacts')::text, 6, '0');
$$;

CREATE OR REPLACE FUNCTION public.generate_org_number()
RETURNS extensions.citext
LANGUAGE sql
VOLATILE
AS $$
  SELECT 'ORG-' || LPAD(nextval('seq_frm_orgs')::text, 6, '0');
$$;

-------------------------------------------------------------------------------
-- 2. CORE MASTER TABLES (Dynamic Types & Tags)
-------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.contact_types (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    name text NOT NULL,
    slug extensions.citext NOT NULL UNIQUE,
    icon text,
    color text,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tags (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    name text NOT NULL,
    slug extensions.citext NOT NULL UNIQUE,
    color text,
    icon text,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-------------------------------------------------------------------------------
-- 3. ORGANIZATIONS
-------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.organizations (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    org_number extensions.citext NOT NULL UNIQUE DEFAULT public.generate_org_number(),
    parent_organization_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
    name text NOT NULL,
    organization_type text DEFAULT 'Corporate',
    website extensions.citext,
    email extensions.citext,
    phone text,
    address text,
    district text,
    state text,
    country text DEFAULT 'India',
    logo_media_id uuid REFERENCES public.media_files(id) ON DELETE SET NULL,
    status text NOT NULL DEFAULT 'Active',
    is_deleted boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Organization Search Vector
ALTER TABLE public.organizations ADD COLUMN search_vector tsvector;
CREATE INDEX idx_organizations_search ON public.organizations USING GIN (search_vector);

CREATE OR REPLACE FUNCTION public.maintain_organizations_search_vector()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.org_number, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.district, '')), 'B');
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_organizations_search BEFORE INSERT OR UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.maintain_organizations_search_vector();

-------------------------------------------------------------------------------
-- 4. CONTACTS EXTENSION (FRM CORE)
-------------------------------------------------------------------------------

-- 4.1 Add new columns to existing contacts table
ALTER TABLE public.contacts 
    ADD COLUMN IF NOT EXISTS contact_number extensions.citext UNIQUE,
    ADD COLUMN IF NOT EXISTS photo_media_id uuid REFERENCES public.media_files(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS designation text,
    ADD COLUMN IF NOT EXISTS district text,
    ADD COLUMN IF NOT EXISTS alternate_phone text,
    ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'Active',
    ADD COLUMN IF NOT EXISTS is_deleted boolean NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL;

-- 4.2 Data Migration: Assign contact_number to existing records safely
UPDATE public.contacts SET contact_number = public.generate_contact_number() WHERE contact_number IS NULL;
ALTER TABLE public.contacts ALTER COLUMN contact_number SET NOT NULL;

-- 4.3 Data Migration: Convert Text Organizations to Relational Organizations
DO $$
DECLARE
    r RECORD;
    new_org_id uuid;
BEGIN
    FOR r IN (SELECT DISTINCT organization FROM public.contacts WHERE organization IS NOT NULL AND organization != '')
    LOOP
        INSERT INTO public.organizations (name, status) 
        VALUES (r.organization, 'Active')
        RETURNING id INTO new_org_id;
        
        UPDATE public.contacts 
        SET organization_id = new_org_id 
        WHERE organization = r.organization;
    END LOOP;
END;
$$;

-- 4.4 Drop the old text column now that data is migrated
ALTER TABLE public.contacts DROP COLUMN IF EXISTS organization;

-- 4.5 Contact Search Vector
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS search_vector tsvector;
CREATE INDEX IF NOT EXISTS idx_contacts_search ON public.contacts USING GIN (search_vector);

CREATE OR REPLACE FUNCTION public.maintain_contacts_search_vector()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', coalesce(NEW.full_name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.contact_number, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.email, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.phone, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.district, '')), 'C');
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_contacts_search BEFORE INSERT OR UPDATE ON public.contacts FOR EACH ROW EXECUTE FUNCTION public.maintain_contacts_search_vector();

-------------------------------------------------------------------------------
-- 5. RELATIONAL CRM TABLES
-------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.contact_relationships (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    contact_id uuid NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
    contact_type_id uuid NOT NULL REFERENCES public.contact_types(id) ON DELETE RESTRICT,
    started_at timestamp with time zone NOT NULL DEFAULT now(),
    ended_at timestamp with time zone,
    status text NOT NULL DEFAULT 'Active',
    created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.contact_tag_assignments (
    contact_id uuid NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
    tag_id uuid NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (contact_id, tag_id)
);

CREATE TABLE IF NOT EXISTS public.contact_notes (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    contact_id uuid NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
    author_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    note_text text NOT NULL,
    is_deleted boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.contact_documents (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    contact_id uuid NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
    media_id uuid NOT NULL REFERENCES public.media_files(id) ON DELETE RESTRICT,
    document_category text NOT NULL, -- 'Identity', 'Agreement', 'Certificate', etc.
    title text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.contact_interactions (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    contact_id uuid NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
    interaction_type text NOT NULL, 
    description text NOT NULL,
    interaction_date timestamp with time zone NOT NULL DEFAULT now(),
    created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.contact_interactions IS 'Immutable timeline of interactions.';

CREATE TABLE IF NOT EXISTS public.linked_records (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    contact_id uuid NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
    module_name text NOT NULL,
    record_type text NOT NULL,
    record_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX idx_linked_records_lookup ON public.linked_records(module_name, record_type, record_id);

CREATE TABLE IF NOT EXISTS public.contact_merge_history (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    primary_contact_id uuid NOT NULL REFERENCES public.contacts(id) ON DELETE RESTRICT,
    merged_contact_id uuid NOT NULL REFERENCES public.contacts(id) ON DELETE RESTRICT,
    merge_data jsonb NOT NULL,
    merged_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-------------------------------------------------------------------------------
-- 6. TRIGGERS (Updated_at & Audits)
-------------------------------------------------------------------------------

CREATE TRIGGER trg_contact_types_updated_at BEFORE UPDATE ON public.contact_types FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_tags_updated_at BEFORE UPDATE ON public.tags FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_contact_relationships_updated_at BEFORE UPDATE ON public.contact_relationships FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_contact_notes_updated_at BEFORE UPDATE ON public.contact_notes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Standard audit tracking
CREATE TRIGGER trg_organizations_audit BEFORE INSERT OR UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();
CREATE TRIGGER trg_organizations_activity_log AFTER INSERT OR UPDATE OR DELETE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_handler();

-- Contacts already had trg_contacts_updated_at. Let's add standard audit fields to contacts if they don't exist.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='contacts' AND column_name='created_by') THEN
        ALTER TABLE public.contacts ADD COLUMN created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL;
        ALTER TABLE public.contacts ADD COLUMN updated_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL;
    END IF;
END
$$;

DROP TRIGGER IF EXISTS trg_contacts_audit ON public.contacts;
CREATE TRIGGER trg_contacts_audit BEFORE INSERT OR UPDATE ON public.contacts FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();

DROP TRIGGER IF EXISTS trg_contacts_activity_log ON public.contacts;
CREATE TRIGGER trg_contacts_activity_log AFTER INSERT OR UPDATE OR DELETE ON public.contacts FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_handler();

-------------------------------------------------------------------------------
-- 7. INITIAL SEED DATA
-------------------------------------------------------------------------------

INSERT INTO public.contact_types (name, slug, color) VALUES 
('Volunteer', 'volunteer', 'blue'),
('Donor', 'donor', 'green'),
('Beneficiary', 'beneficiary', 'purple'),
('Partner', 'partner', 'orange'),
('Sponsor', 'sponsor', 'yellow'),
('CSR', 'csr', 'teal'),
('Government', 'government', 'slate'),
('NGO', 'ngo', 'indigo'),
('Media', 'media', 'pink'),
('Employee', 'employee', 'gray'),
('Other', 'other', 'neutral')
ON CONFLICT (slug) DO NOTHING;

-------------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (Strictly internal)
-------------------------------------------------------------------------------

ALTER TABLE public.contact_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_tag_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.linked_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_merge_history ENABLE ROW LEVEL SECURITY;

-- Note: The contacts table RLS might already be enabled, we will ensure it is.
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Create generic CRM Admin policy
CREATE OR REPLACE FUNCTION public.is_crm_admin() RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() AND (r.name = 'Super Admin' OR r.name = 'Admin' OR r.name = 'Manager')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Applies to all new tables
CREATE POLICY "Admin Full Access on contact_types" ON public.contact_types FOR ALL USING (public.is_crm_admin());
CREATE POLICY "Admin Full Access on tags" ON public.tags FOR ALL USING (public.is_crm_admin());
CREATE POLICY "Admin Full Access on organizations" ON public.organizations FOR ALL USING (public.is_crm_admin());
CREATE POLICY "Admin Full Access on contacts" ON public.contacts FOR ALL USING (public.is_crm_admin());
CREATE POLICY "Admin Full Access on contact_relationships" ON public.contact_relationships FOR ALL USING (public.is_crm_admin());
CREATE POLICY "Admin Full Access on contact_tag_assignments" ON public.contact_tag_assignments FOR ALL USING (public.is_crm_admin());
CREATE POLICY "Admin Full Access on contact_notes" ON public.contact_notes FOR ALL USING (public.is_crm_admin());
CREATE POLICY "Admin Full Access on contact_documents" ON public.contact_documents FOR ALL USING (public.is_crm_admin());
CREATE POLICY "Admin Full Access on contact_interactions" ON public.contact_interactions FOR ALL USING (public.is_crm_admin());
CREATE POLICY "Admin Full Access on linked_records" ON public.linked_records FOR ALL USING (public.is_crm_admin());
CREATE POLICY "Admin Full Access on contact_merge_history" ON public.contact_merge_history FOR ALL USING (public.is_crm_admin());

-- Read-only access for types and tags for authenticated users (to display dropdowns in other forms if needed)
CREATE POLICY "Auth Read Access on contact_types" ON public.contact_types FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth Read Access on tags" ON public.tags FOR SELECT USING (auth.role() = 'authenticated');

-- We also need to ensure that the user can read/write their own profile in `contacts` if it's linked via `profile_id`.
CREATE POLICY "User Own Contact Access" ON public.contacts FOR ALL USING (profile_id = auth.uid());

-------------------------------------------------------------------------------
-- 9. CROSS-MODULE FOREIGN KEY RESOLUTION (DONATIONS)
-------------------------------------------------------------------------------

-- Since Donations (015) was designed correctly with contact_id but executes before Contacts (016),
-- we attach the foreign keys here in 020 once FRM is fully instantiated.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='donations') THEN
        -- Check if constraint doesn't already exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='fk_donations_contact' AND table_name='donations') THEN
            ALTER TABLE public.donations ADD CONSTRAINT fk_donations_contact FOREIGN KEY (contact_id) REFERENCES public.contacts(id) ON DELETE RESTRICT;
        END IF;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='recurring_donations') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='fk_recurring_donations_contact' AND table_name='recurring_donations') THEN
            ALTER TABLE public.recurring_donations ADD CONSTRAINT fk_recurring_donations_contact FOREIGN KEY (contact_id) REFERENCES public.contacts(id) ON DELETE CASCADE;
        END IF;
    END IF;
END
$$;

COMMIT;
