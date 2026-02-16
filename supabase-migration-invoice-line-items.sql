-- Create invoice_line_items table to store individual line items for each invoice

CREATE TABLE IF NOT EXISTS public.invoice_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
  rate NUMERIC(10,2) NOT NULL DEFAULT 0,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster invoice lookups
CREATE INDEX IF NOT EXISTS idx_invoice_line_items_invoice_id
  ON public.invoice_line_items(invoice_id);

-- Enable RLS
ALTER TABLE public.invoice_line_items ENABLE ROW LEVEL SECURITY;

-- Users can view line items for their own invoices
CREATE POLICY "Users can view own invoice line items"
  ON public.invoice_line_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.invoices
      WHERE invoices.id = invoice_id
        AND (
          invoices.user_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM public.clients
            WHERE clients.id = invoices.client_id
              AND clients.owner_id = auth.uid()
          )
        )
    )
  );

-- Admins can manage all line items
CREATE POLICY "Admins can manage all invoice line items"
  ON public.invoice_line_items
  FOR ALL
  USING (public.is_admin(auth.uid()));

COMMENT ON TABLE public.invoice_line_items IS 'Line items for each invoice with description, quantity, rate';
