-- Migration: 20260816170000_podcasts_foundation.sql
-- Description: Podcast episodes management

BEGIN;

CREATE TABLE IF NOT EXISTS public.podcast_episodes (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    
    title text NOT NULL,
    slug extensions.citext NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9_-]+$'),
    episode_number text,
    
    excerpt text,
    description text,
    
    thumbnail_id uuid REFERENCES public.media_files(id) ON DELETE SET NULL,
    
    youtube_url text,
    audio_url text,
    
    duration text,
    
    guest_name text,
    guest_role text,
    guest_profile_photo_url text,
    
    topics text[],
    
    status public.article_status NOT NULL DEFAULT 'Draft',
    visibility public.program_visibility NOT NULL DEFAULT 'public',
    
    release_date date,
    
    is_featured boolean NOT NULL DEFAULT false,
    
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    
    is_deleted boolean NOT NULL DEFAULT false,
    deleted_at timestamp with time zone,
    deleted_by uuid
);

CREATE INDEX idx_podcast_episodes_slug ON public.podcast_episodes(slug);
CREATE INDEX idx_podcast_episodes_status ON public.podcast_episodes(status);
CREATE INDEX idx_podcast_episodes_release ON public.podcast_episodes(release_date DESC);

-- Triggers for updated_at, audit, soft delete
CREATE TRIGGER trg_podcast_episodes_updated_at BEFORE UPDATE ON public.podcast_episodes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_podcast_episodes_audit BEFORE INSERT OR UPDATE ON public.podcast_episodes FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();
CREATE TRIGGER trg_podcast_episodes_soft_delete BEFORE DELETE ON public.podcast_episodes FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

-- RLS policies
ALTER TABLE public.podcast_episodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published and public podcasts"
ON public.podcast_episodes
FOR SELECT
USING (
    is_deleted = false 
    AND (
        (status = 'Published' AND visibility = 'public') OR
        public.has_any_role(ARRAY['super-admin', 'admin', 'editor', 'content-manager'])
    )
);

CREATE POLICY "Admins can manage podcasts"
ON public.podcast_episodes
FOR ALL
TO authenticated
USING (
    public.has_any_role(ARRAY['super-admin', 'admin', 'editor', 'content-manager'])
);

COMMIT;
