
-- ============================================================
-- Security hardening migration
-- ============================================================

-- 1) profiles: hide email/phone from public reads via a safe view.
DROP POLICY IF EXISTS "Public can view profiles" ON public.profiles;
-- Admins keep full access via existing "Admins can manage profiles" ALL policy.

CREATE OR REPLACE VIEW public.public_profile AS
SELECT id, name, title, bio, short_bio, avatar_url, resume_url, location, education,
       experience_start_year, seo_title, seo_description, seo_keywords,
       created_at, updated_at
FROM public.profiles;

GRANT SELECT ON public.public_profile TO anon, authenticated;

-- 2) SECURITY DEFINER exposure: allow users to read own role, switch helpers to SECURITY INVOKER.
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='user_roles' AND policyname='Users can view their own roles'
  ) THEN
    CREATE POLICY "Users can view their own roles"
      ON public.user_roles FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$ SELECT public.has_role(auth.uid(), 'admin') $$;

-- 3) contact_messages: remove from Realtime publication so submissions can't be broadcast.
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime DROP TABLE public.contact_messages;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- 4) Tighten the "always true" INSERT policy on contact_messages with content validation.
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;
CREATE POLICY "Anyone can submit contact messages"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(name) BETWEEN 1 AND 200
    AND length(email) BETWEEN 3 AND 255
    AND email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
    AND length(message) BETWEEN 1 AND 10000
    AND (subject IS NULL OR length(subject) <= 300)
  );

-- 5) Storage: remove broad SELECT policy that lets clients enumerate/list all files.
--    Direct public URLs still work because the bucket remains public.
DROP POLICY IF EXISTS "Public can view media" ON storage.objects;
