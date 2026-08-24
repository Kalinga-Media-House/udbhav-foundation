-- Migration: foundation_seo_settings.sql
-- Description: Adds Foundation Identity, SEO, and Social Sharing settings to system_settings.

INSERT INTO public.system_settings 
(key_name, display_name, description, category, data_type, value, default_value, visibility, is_editable) 
VALUES
('foundation_tagline', 'Short Tagline', 'Short tagline for the foundation', 'General', 'string', '""', '""', 'public', true),
('website_url', 'Website URL', 'Main production URL', 'Contact', 'url', '"https://udbhavfoundation.in"', '"https://udbhavfoundation.in"', 'public', true),
('logo_primary', 'Primary Logo', 'URL to main logo', 'Branding', 'media_reference', '""', '""', 'public', true),
('favicon', 'Favicon', 'URL to favicon', 'Branding', 'media_reference', '""', '""', 'public', true),
('seo_search_topics', 'SEO Search Topics', 'List of search topics', 'SEO', 'json', '["UDBHAV Foundation", "Udbhav Foundation", "nonprofit organization", "NGO in Odisha", "social development", "community development", "education initiatives", "environmental initiatives", "volunteer opportunities", "Odisha NGO", "Bhubaneswar NGO", "community empowerment", "inclusive development"]', '["UDBHAV Foundation", "Udbhav Foundation", "nonprofit organization", "NGO in Odisha", "social development", "community development", "education initiatives", "environmental initiatives", "volunteer opportunities", "Odisha NGO", "Bhubaneswar NGO", "community empowerment", "inclusive development"]', 'public', true),
('og_title', 'Open Graph Title', 'Default social sharing title', 'SEO', 'string', '"UDBHAV Foundation | Empowering Communities for an Inclusive Future"', '"UDBHAV Foundation | Empowering Communities for an Inclusive Future"', 'public', true),
('og_desc', 'Open Graph Description', 'Default social sharing description', 'SEO', 'string', '"UDBHAV Foundation is a nonprofit organization working to empower communities through education, environmental initiatives, social development and inclusive community action."', '"UDBHAV Foundation is a nonprofit organization working to empower communities through education, environmental initiatives, social development and inclusive community action."', 'public', true),
('og_image', 'Social Sharing Image', 'Default Open Graph image (1200x630)', 'SEO', 'media_reference', '""', '""', 'public', true)
ON CONFLICT (key_name) DO UPDATE SET 
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  data_type = EXCLUDED.data_type;

UPDATE public.system_settings 
SET 
  value = '"UDBHAV Foundation | Empowering Communities for an Inclusive Future"', 
  default_value = '"UDBHAV Foundation | Empowering Communities for an Inclusive Future"' 
WHERE key_name = 'seo_default_title' AND (value = '""' OR value = '"UDBHAV Foundation - Empowering Communities"');

UPDATE public.system_settings 
SET 
  value = '"UDBHAV Foundation is a nonprofit organization working to empower communities through education, environmental initiatives, social development and inclusive community action."', 
  default_value = '"UDBHAV Foundation is a nonprofit organization working to empower communities through education, environmental initiatives, social development and inclusive community action."'
WHERE key_name = 'seo_default_desc' AND (value = '""' OR value = '"UDBHAV is a non-profit organization focused on sustainable community development."');

COMMIT;
