-- Migration: 20260816180000_news_events_rls.sql
-- Description: Adds missing RLS policies for news_articles, events, and related tables

BEGIN;

-- ============================================================
-- News Articles
-- ============================================================

DROP POLICY IF EXISTS "Public can view published and public news_articles" ON public.news_articles;
DROP POLICY IF EXISTS "Admins can manage news_articles" ON public.news_articles;

CREATE POLICY "Public can view published and public news_articles"
  ON public.news_articles
  FOR SELECT
  USING (
    is_deleted = false 
    AND (
        (status = 'Published' AND visibility = 'public') OR
        public.has_any_role(ARRAY['super-admin', 'admin', 'editor', 'content-manager'])
    )
  );

CREATE POLICY "Admins can manage news_articles"
  ON public.news_articles
  FOR ALL
  TO authenticated
  USING (
    public.has_any_role(ARRAY['super-admin', 'admin', 'editor', 'content-manager'])
  )
  WITH CHECK (
    public.has_any_role(ARRAY['super-admin', 'admin', 'editor', 'content-manager'])
  );


-- ============================================================
-- Article Authors
-- ============================================================

DROP POLICY IF EXISTS "Public can view article_authors" ON public.article_authors;
DROP POLICY IF EXISTS "Admins can manage article_authors" ON public.article_authors;

CREATE POLICY "Public can view article_authors"
  ON public.article_authors
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage article_authors"
  ON public.article_authors
  FOR ALL
  TO authenticated
  USING (
    public.has_any_role(ARRAY['super-admin', 'admin', 'editor', 'content-manager'])
  )
  WITH CHECK (
    public.has_any_role(ARRAY['super-admin', 'admin', 'editor', 'content-manager'])
  );


-- ============================================================
-- Featured Articles
-- ============================================================

DROP POLICY IF EXISTS "Public can view featured_articles" ON public.featured_articles;
DROP POLICY IF EXISTS "Admins can manage featured_articles" ON public.featured_articles;

CREATE POLICY "Public can view featured_articles"
  ON public.featured_articles
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage featured_articles"
  ON public.featured_articles
  FOR ALL
  TO authenticated
  USING (
    public.has_any_role(ARRAY['super-admin', 'admin', 'editor', 'content-manager'])
  )
  WITH CHECK (
    public.has_any_role(ARRAY['super-admin', 'admin', 'editor', 'content-manager'])
  );


-- ============================================================
-- Related Articles
-- ============================================================

DROP POLICY IF EXISTS "Public can view related_articles" ON public.related_articles;
DROP POLICY IF EXISTS "Admins can manage related_articles" ON public.related_articles;

CREATE POLICY "Public can view related_articles"
  ON public.related_articles
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage related_articles"
  ON public.related_articles
  FOR ALL
  TO authenticated
  USING (
    public.has_any_role(ARRAY['super-admin', 'admin', 'editor', 'content-manager'])
  )
  WITH CHECK (
    public.has_any_role(ARRAY['super-admin', 'admin', 'editor', 'content-manager'])
  );


-- ============================================================
-- Events
-- ============================================================

DROP POLICY IF EXISTS "Public can view active public events" ON public.events;
DROP POLICY IF EXISTS "Admins can manage events" ON public.events;

CREATE POLICY "Public can view active public events"
  ON public.events
  FOR SELECT
  USING (
    is_deleted = false 
    AND (
      (visibility = 'public' AND status != 'draft') OR
      public.has_any_role(ARRAY['super-admin', 'admin', 'editor', 'content-manager'])
    )
  );

CREATE POLICY "Admins can manage events"
  ON public.events
  FOR ALL
  TO authenticated
  USING (
    public.has_any_role(ARRAY['super-admin', 'admin', 'editor', 'content-manager'])
  )
  WITH CHECK (
    public.has_any_role(ARRAY['super-admin', 'admin', 'editor', 'content-manager'])
  );


-- ============================================================
-- Event Members
-- ============================================================

DROP POLICY IF EXISTS "Public can view event_members" ON public.event_members;
DROP POLICY IF EXISTS "Admins can manage event_members" ON public.event_members;

CREATE POLICY "Public can view event_members"
  ON public.event_members
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage event_members"
  ON public.event_members
  FOR ALL
  TO authenticated
  USING (
    public.has_any_role(ARRAY['super-admin', 'admin', 'editor', 'content-manager'])
  )
  WITH CHECK (
    public.has_any_role(ARRAY['super-admin', 'admin', 'editor', 'content-manager'])
  );

COMMIT;
