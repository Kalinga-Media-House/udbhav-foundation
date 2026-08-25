-- Migration: Add gallery_hero_background_image setting

INSERT INTO public.system_settings (key_name, display_name, value, default_value, description, data_type, category, visibility, is_editable) 
VALUES ('gallery_hero_background_image', 'Gallery Hero Background Image', '""', '""', 'Background image for the Gallery page Hero section', 'string', 'Branding', 'public', true) 
ON CONFLICT (key_name) DO NOTHING;
