-- Intake Form Database Schema
-- Add a new table to store comprehensive intake form submissions

CREATE TABLE public.intake_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic Contact Info
  full_name TEXT NOT NULL,
  company_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  preferred_contact TEXT CHECK (preferred_contact IN ('email', 'text', 'call')),

  -- Division & Service Selection
  division TEXT NOT NULL CHECK (division IN ('dolonia_data_tech', 'royal_society', '1921_holding')),
  service_category TEXT NOT NULL,
  service_focus TEXT[],

  -- Project Details
  budget_range TEXT CHECK (budget_range IN ('under_1k', '1k_3k', '3k_10k', '10k_plus', 'custom')),
  custom_budget TEXT, -- For custom budget amounts when budget_range = 'custom'
  timeline TEXT CHECK (timeline IN ('asap', 'this_month', '1_3_months', 'long_term')),
  referral_source TEXT,

  -- Division-Specific Responses (stored as JSONB for flexibility)
  tech_details JSONB,
  media_details JSONB,
  business_details JSONB,

  -- Automation & Recommendations
  recommended_tier TEXT,
  estimated_cost NUMERIC(10,2),
  priority_score INTEGER DEFAULT 0,

  -- Status Tracking
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'quoted', 'converted', 'archived')),
  assigned_to UUID REFERENCES public.profiles(id),
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  followed_up_at TIMESTAMPTZ
);

-- Create index for faster queries
CREATE INDEX idx_intake_forms_division ON public.intake_forms(division);
CREATE INDEX idx_intake_forms_status ON public.intake_forms(status);
CREATE INDEX idx_intake_forms_created_at ON public.intake_forms(created_at DESC);

-- Auto-update timestamp
CREATE OR REPLACE FUNCTION update_intake_forms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_intake_forms_timestamp
  BEFORE UPDATE ON public.intake_forms
  FOR EACH ROW
  EXECUTE FUNCTION update_intake_forms_updated_at();

-- RLS Policies
ALTER TABLE public.intake_forms ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an intake form
CREATE POLICY "Anyone can insert intake forms" ON public.intake_forms
  FOR INSERT WITH CHECK (true);

-- Authenticated users can view their own submissions
CREATE POLICY "Users can view own intake forms" ON public.intake_forms
  FOR SELECT USING (email = auth.jwt()->>'email' OR auth.uid() IS NOT NULL);

-- Admins can manage all intake forms
CREATE POLICY "Admins can manage all intake forms" ON public.intake_forms
  FOR ALL USING (public.is_admin(auth.uid()));
