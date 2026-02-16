-- Add missing columns to leads table
-- Run this in your Supabase SQL Editor to fix the contact form

-- Add source column (tracks where the lead came from)
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'website_contact_form';

-- Add status column (tracks lead status: new, contacted, qualified, etc.)
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new';

-- Add assigned_to column (assigns leads to team members)
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES public.profiles(id);

-- Verify the columns were added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'leads'
ORDER BY ordinal_position;
