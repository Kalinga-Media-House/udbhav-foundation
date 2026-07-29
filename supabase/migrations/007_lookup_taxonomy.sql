-- Migration: 007_lookup_taxonomy.sql
-- Description: Centralized enterprise taxonomy and lookup foundation.
-- Dependencies: 001_extensions.sql, 002_auth_foundation.sql, 005_audit_logs.sql

BEGIN;

-------------------------------------------------------------------------------
-- 1. TABLES
-------------------------------------------------------------------------------

-- 1.1 TAXONOMIES (The root classification dictionaries)
CREATE TABLE IF NOT EXISTS public.taxonomies (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    slug extensions.citext NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9_-]+$'),
    display_name text NOT NULL,
    description text,
    
    type text NOT NULL DEFAULT 'flat' CHECK (type IN ('flat', 'hierarchical')),
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'deprecated')),
    visibility text NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'internal', 'system')),
    
    icon text,
    color text,
    sort_order integer NOT NULL DEFAULT 0,
    metadata jsonb DEFAULT '{}'::jsonb,
    
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    
    is_deleted boolean NOT NULL DEFAULT false,
    deleted_at timestamp with time zone,
    deleted_by uuid
);

COMMENT ON TABLE public.taxonomies IS 'Root registries for system-wide classifications (e.g., Tags, Categories, Skills).';

-- 1.2 TAXONOMY TERMS (The actual values inside a taxonomy)
CREATE TABLE IF NOT EXISTS public.taxonomy_terms (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    taxonomy_id uuid NOT NULL REFERENCES public.taxonomies(id) ON DELETE CASCADE,
    parent_id uuid REFERENCES public.taxonomy_terms(id) ON DELETE CASCADE,
    
    slug extensions.citext NOT NULL CHECK (slug ~ '^[a-z0-9_-]+$'),
    display_name text NOT NULL,
    description text,
    code text, -- Optional strict code for backend integrations
    
    icon text,
    color text,
    sort_order integer NOT NULL DEFAULT 0,
    
    search_vector tsvector,
    metadata jsonb DEFAULT '{}'::jsonb,
    
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    
    -- Term slugs must be unique within a taxonomy
    UNIQUE (taxonomy_id, slug)
);

COMMENT ON TABLE public.taxonomy_terms IS 'The terms belonging to a taxonomy. Supports infinite hierarchical nesting via parent_id.';

-- 1.3 ENTITY TAXONOMIES (Polymorphic Mapping)
CREATE TABLE IF NOT EXISTS public.entity_taxonomies (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    entity_type text NOT NULL,
    entity_id uuid NOT NULL,
    term_id uuid NOT NULL REFERENCES public.taxonomy_terms(id) ON DELETE CASCADE,
    
    relationship_type text DEFAULT 'primary', -- e.g., 'primary_category', 'tag'
    is_primary boolean NOT NULL DEFAULT false,
    sort_order integer NOT NULL DEFAULT 0,
    
    created_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    
    -- Prevent duplicate assignments of the same term to the same entity for the same relationship
    UNIQUE (entity_type, entity_id, term_id, relationship_type)
);

COMMENT ON TABLE public.entity_taxonomies IS 'Polymorphic mapping allowing ANY entity to be tagged or categorized.';

-------------------------------------------------------------------------------
-- 2. INDEXES
-------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_taxonomies_status ON public.taxonomies(status);
CREATE INDEX IF NOT EXISTS idx_taxonomies_visibility ON public.taxonomies(visibility);

CREATE INDEX IF NOT EXISTS idx_taxonomy_terms_parent ON public.taxonomy_terms(parent_id);
CREATE INDEX IF NOT EXISTS idx_taxonomy_terms_code ON public.taxonomy_terms(code);
CREATE INDEX IF NOT EXISTS idx_taxonomy_terms_search ON public.taxonomy_terms USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_taxonomy_terms_metadata ON public.taxonomy_terms USING GIN (metadata);

CREATE INDEX IF NOT EXISTS idx_entity_taxonomies_entity ON public.entity_taxonomies(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_entity_taxonomies_term ON public.entity_taxonomies(term_id);

-------------------------------------------------------------------------------
-- 3. TRIGGERS
-------------------------------------------------------------------------------

-- 3.1 Maintain Full-Text Search Vector
CREATE OR REPLACE FUNCTION public.maintain_taxonomy_term_search_vector()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.display_name, ''))), 'A') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.slug, ''))), 'A') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.code, ''))), 'B') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.description, ''))), 'C');
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_taxonomy_terms_search_vector 
BEFORE INSERT OR UPDATE OF display_name, slug, code, description 
ON public.taxonomy_terms 
FOR EACH ROW EXECUTE FUNCTION public.maintain_taxonomy_term_search_vector();


-- 3.2 Audit & Timestamp Boilerplate
CREATE TRIGGER trg_taxonomies_updated_at BEFORE UPDATE ON public.taxonomies FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_taxonomies_audit BEFORE INSERT OR UPDATE ON public.taxonomies FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();
CREATE TRIGGER trg_taxonomies_soft_delete BEFORE DELETE ON public.taxonomies FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

CREATE TRIGGER trg_taxonomy_terms_updated_at BEFORE UPDATE ON public.taxonomy_terms FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_taxonomy_terms_audit BEFORE INSERT OR UPDATE ON public.taxonomy_terms FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();

-- 3.3 Activity Logs Integration
CREATE TRIGGER trg_taxonomies_activity_log AFTER INSERT OR UPDATE OR DELETE ON public.taxonomies FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_handler();
CREATE TRIGGER trg_taxonomy_terms_activity_log AFTER INSERT OR UPDATE OR DELETE ON public.taxonomy_terms FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_handler();

-------------------------------------------------------------------------------
-- 4. SEED DATA (Built-in Core Taxonomies)
-------------------------------------------------------------------------------

INSERT INTO public.taxonomies (slug, display_name, description, type, visibility) VALUES
('categories', 'Categories', 'Generic hierarchical categories.', 'hierarchical', 'public'),
('tags', 'Tags', 'Generic flat tags.', 'flat', 'public'),
('skills', 'Skills', 'Volunteer and staff skills/expertise.', 'flat', 'public'),
('languages', 'Languages', 'Spoken and written languages.', 'flat', 'public'),
('departments', 'Departments', 'Organizational departments.', 'hierarchical', 'internal'),
('regions', 'Regions', 'Geographic operating regions.', 'hierarchical', 'public'),
('volunteer-interests', 'Volunteer Interests', 'Areas of interest for volunteers.', 'flat', 'public'),
('program-types', 'Program Types', 'Classification of foundation programs.', 'flat', 'public'),
('event-types', 'Event Types', 'Classification of events.', 'flat', 'public'),
('news-categories', 'News Categories', 'Categories for news and articles.', 'hierarchical', 'public'),
('media-categories', 'Media Categories', 'Classification for media assets.', 'hierarchical', 'internal')
ON CONFLICT (slug) DO NOTHING;

-------------------------------------------------------------------------------
-- 5. HELPER FUNCTIONS
-------------------------------------------------------------------------------

-- Purpose: Fetches the entire tree of terms for a given taxonomy ID.
-- Uses recursive CTE to build paths and nesting levels.
CREATE OR REPLACE FUNCTION public.get_taxonomy_tree(p_taxonomy_id uuid)
RETURNS TABLE (
    id uuid,
    parent_id uuid,
    slug extensions.citext,
    display_name text,
    level integer,
    path text[]
) 
LANGUAGE sql
STABLE
AS $$
  WITH RECURSIVE term_tree AS (
      -- Base cases: root terms (no parent)
      SELECT 
          t.id, t.parent_id, t.slug, t.display_name,
          1 AS level,
          ARRAY[t.slug::text] AS path,
          t.sort_order
      FROM public.taxonomy_terms t
      WHERE t.taxonomy_id = p_taxonomy_id AND t.parent_id IS NULL
      
      UNION ALL
      
      -- Recursive step: find children
      SELECT 
          c.id, c.parent_id, c.slug, c.display_name,
          p.level + 1 AS level,
          p.path || c.slug::text AS path,
          c.sort_order
      FROM public.taxonomy_terms c
      INNER JOIN term_tree p ON c.parent_id = p.id
  )
  SELECT id, parent_id, slug, display_name, level, path
  FROM term_tree
  ORDER BY path, sort_order;
$$;
COMMENT ON FUNCTION public.get_taxonomy_tree IS 'Returns the complete hierarchical tree for a taxonomy using recursive CTEs.';


-- Purpose: Gets the direct children of a specific term.
CREATE OR REPLACE FUNCTION public.get_term_children(p_term_id uuid)
RETURNS SETOF public.taxonomy_terms
LANGUAGE sql
STABLE
AS $$
  SELECT * FROM public.taxonomy_terms 
  WHERE parent_id = p_term_id
  ORDER BY sort_order, display_name;
$$;


-- Purpose: Fetches the breadcrumb path from the root down to a specific term.
CREATE OR REPLACE FUNCTION public.get_term_path(p_term_id uuid)
RETURNS TABLE (
    id uuid,
    slug extensions.citext,
    display_name text,
    level integer
)
LANGUAGE sql
STABLE
AS $$
  WITH RECURSIVE term_path AS (
      SELECT t.id, t.parent_id, t.slug, t.display_name, 1 AS level
      FROM public.taxonomy_terms t
      WHERE t.id = p_term_id
      
      UNION ALL
      
      SELECT p.id, p.parent_id, p.slug, p.display_name, c.level + 1 AS level
      FROM public.taxonomy_terms p
      INNER JOIN term_path c ON c.parent_id = p.id
  )
  SELECT id, slug, display_name, level
  FROM term_path
  ORDER BY level DESC; -- Output root to leaf
$$;


-- Purpose: Easily assigns a taxonomy term to an entity.
CREATE OR REPLACE FUNCTION public.assign_taxonomy(
    p_entity_type text,
    p_entity_id uuid,
    p_term_id uuid,
    p_relationship_type text DEFAULT 'primary',
    p_is_primary boolean DEFAULT false
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_mapping_id uuid;
BEGIN
  INSERT INTO public.entity_taxonomies (
    entity_type, entity_id, term_id, relationship_type, is_primary, created_by
  ) VALUES (
    p_entity_type, p_entity_id, p_term_id, p_relationship_type, p_is_primary, public.current_user_id()
  )
  ON CONFLICT (entity_type, entity_id, term_id, relationship_type) 
  DO UPDATE SET is_primary = EXCLUDED.is_primary, sort_order = EXCLUDED.sort_order
  RETURNING id INTO v_mapping_id;
  
  RETURN v_mapping_id;
END;
$$;


-- Purpose: Removes a taxonomy assignment.
CREATE OR REPLACE FUNCTION public.remove_taxonomy(
    p_entity_type text,
    p_entity_id uuid,
    p_term_id uuid,
    p_relationship_type text DEFAULT 'primary'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.entity_taxonomies
  WHERE entity_type = p_entity_type 
    AND entity_id = p_entity_id 
    AND term_id = p_term_id 
    AND relationship_type = p_relationship_type;
END;
$$;

COMMIT;
