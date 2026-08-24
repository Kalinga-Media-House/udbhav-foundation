-- Migration: Add about_hero_background_image setting

INSERT INTO public.system_settings (key_name, display_name, value, default_value, description, data_type, category, visibility, is_editable) 
VALUES ('about_hero_background_image', 'About Page Hero Background Image', '""', '""', 'Background image for the About page Hero section', 'string', 'Branding', 'public', true) 
ON CONFLICT (key_name) DO NOTHING;
