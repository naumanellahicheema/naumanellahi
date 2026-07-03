ALTER TABLE public.services ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS is_replied boolean NOT NULL DEFAULT false;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS replied_at timestamp with time zone;