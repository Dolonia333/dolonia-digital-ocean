-- Migration: Add notifications table for admin-to-client alerts
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  recipients UUID[] NOT NULL, -- Array of profile IDs (empty array means all clients)
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for querying notifications by recipient
CREATE INDEX idx_notifications_recipients ON public.notifications USING GIN (recipients);
