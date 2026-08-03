-- Migration: Gallery RLS Policies

-- Gallery Albums
DROP POLICY IF EXISTS "Public can view active gallery albums" ON public.gallery_albums;
DROP POLICY IF EXISTS "Admins can manage gallery albums" ON public.gallery_albums;

CREATE POLICY "Public can view active gallery albums"
  ON public.gallery_albums
  FOR SELECT
  USING (
    (status = 'Published' AND visibility = 'Public' AND is_deleted = false) OR
    public.has_any_role(ARRAY['super-admin', 'admin', 'editor', 'content-manager', 'media-manager'])
  );

CREATE POLICY "Admins can manage gallery albums"
  ON public.gallery_albums
  FOR ALL
  TO authenticated
  USING (
    public.has_any_role(ARRAY['super-admin', 'admin', 'editor', 'content-manager', 'media-manager'])
  );

-- Gallery Items
DROP POLICY IF EXISTS "Public can view active gallery items" ON public.gallery_items;
DROP POLICY IF EXISTS "Admins can manage gallery items" ON public.gallery_items;

CREATE POLICY "Public can view active gallery items"
  ON public.gallery_items
  FOR SELECT
  USING (
    true
  );

CREATE POLICY "Admins can manage gallery items"
  ON public.gallery_items
  FOR ALL
  TO authenticated
  USING (
    public.has_any_role(ARRAY['super-admin', 'admin', 'editor', 'content-manager', 'media-manager'])
  );
