-- Create storage bucket for media uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media', 
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'video/mp4', 'video/webm', 'application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "Public can view media" ON storage.objects
FOR SELECT USING (bucket_id = 'media');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload media" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update media" ON storage.objects
FOR UPDATE USING (bucket_id = 'media' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete media" ON storage.objects
FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');

-- Add menu_visible column to site_settings for menu item visibility
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS menu_items JSONB DEFAULT '{"home": true, "about": true, "portfolio": true, "services": true, "experience": true, "blog": true, "contact": true}'::jsonb;