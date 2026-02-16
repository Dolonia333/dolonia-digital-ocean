-- Add user_id column to invoices table to link directly to profiles
-- This allows invoices to be sent to users who don't have a client record yet

ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Add client info fields for invoices created from admin
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS client_name TEXT,
  ADD COLUMN IF NOT EXISTS client_email TEXT,
  ADD COLUMN IF NOT EXISTS client_address TEXT;

-- Create index for faster user invoice lookups
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices(user_id);

-- Update RLS policies to allow users to see their own invoices
DROP POLICY IF EXISTS "Users can view own invoices" ON public.invoices;

CREATE POLICY "Users can view own invoices"
  ON public.invoices
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE id = client_id AND owner_id = auth.uid()
    )
  );

COMMENT ON COLUMN public.invoices.user_id IS 'Direct link to user profile for invoices sent to individuals';
COMMENT ON COLUMN public.invoices.client_name IS 'Client name stored on invoice for display';
COMMENT ON COLUMN public.invoices.client_email IS 'Client email for sending invoice notifications';
