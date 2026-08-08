-- Add location to gallery_albums
ALTER TABLE public.gallery_albums
ADD COLUMN location text;

-- Update search vector trigger to include location
CREATE OR REPLACE FUNCTION public.maintain_gallery_albums_search_vector()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.title, ''))), 'A') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.subtitle, ''))), 'B') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.album_code, ''))), 'B') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.location, ''))), 'C') ||
    setweight(to_tsvector('english', extensions.unaccent(COALESCE(NEW.description, ''))), 'D');
  RETURN NEW;
END;
$$;
