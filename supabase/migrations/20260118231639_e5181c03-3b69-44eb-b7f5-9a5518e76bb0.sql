-- Fix function search_path warning for update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- The WARN for RLS Policy Always True is acceptable for contact_messages INSERT
-- since we intentionally want anyone to be able to submit contact forms.
-- This is the expected behavior for a public contact form.