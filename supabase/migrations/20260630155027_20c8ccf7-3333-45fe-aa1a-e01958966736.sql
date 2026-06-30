
CREATE TABLE public.homenagens (
  slug TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid')),
  plan TEXT,
  email TEXT,
  session_id TEXT,
  paid_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  edit_token UUID NOT NULL DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.homenagens TO anon, authenticated;
GRANT ALL ON public.homenagens TO service_role;

ALTER TABLE public.homenagens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read paid homenagens"
ON public.homenagens FOR SELECT
USING (status = 'paid');

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER homenagens_touch BEFORE UPDATE ON public.homenagens
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
