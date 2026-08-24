-- Migration: Add about_hero_background_image setting

INSERT INTO public.system_settings (key, value, description, type, category, visibility, is_editable, created_at, updated_at) VALUES ('about_hero_background_image', '', 'Background image for the About page Hero section', 'string', 'branding', 'public', true, now(), now()) ON CONFLICT (key) DO NOTHING;
