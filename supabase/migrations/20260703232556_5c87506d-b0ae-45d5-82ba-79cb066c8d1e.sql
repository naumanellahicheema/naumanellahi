
-- Copy any profile email/phone into site_settings if empty (preserve data)
UPDATE public.site_settings ss
SET contact_email = COALESCE(NULLIF(ss.contact_email, ''), p.email),
    contact_phone = COALESCE(NULLIF(ss.contact_phone, ''), p.phone)
FROM public.profiles p
WHERE ss.contact_email IS NULL OR ss.contact_email = ''
   OR ss.contact_phone IS NULL OR ss.contact_phone = '';

-- Drop the public_profile view; no longer needed.
DROP VIEW IF EXISTS public.public_profile;

-- Remove PII columns from profiles entirely.
ALTER TABLE public.profiles DROP COLUMN IF EXISTS email;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS phone;

-- Restore public read on profiles (safe now — no PII).
CREATE POLICY "Public can view profiles"
  ON public.profiles FOR SELECT
  TO anon, authenticated
  USING (true);
