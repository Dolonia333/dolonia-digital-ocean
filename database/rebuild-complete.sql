-- =====================================================
-- DOLONIA DATA TECH - COMPLETE DATABASE REBUILD
-- Run this in Supabase SQL Editor to recreate all tables
-- =====================================================
-- ORDER: Types → Tables → Indexes → Triggers → RLS → Views → Grants
-- =====================================================

-- =====================================================
-- 1. CREATE CUSTOM TYPES/ENUMS
-- =====================================================

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'client');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE project_status AS ENUM ('lead', 'active', 'paused', 'completed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE plan_enum AS ENUM ('starter', 'pro', 'enterprise');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =====================================================
-- 2. HELPER FUNCTIONS (needed before tables/policies)
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Check if user is admin (used by RLS policies)
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = check_user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Shorthand: check if current auth user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.is_admin(auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-generate invoice numbers
CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 1000;

CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'DOL-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('invoice_number_seq')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invoice_number IS NULL THEN
    NEW.invoice_number := generate_invoice_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-create profile on new auth user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data ->> 'full_name',
      split_part(NEW.email, '@', 1)
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 3. CREATE TABLES
-- =====================================================

-- 3a. PROFILES (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'client',
  avatar_url TEXT,
  phone TEXT,
  company TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT profiles_role_check CHECK (role IN ('admin', 'team_member', 'client', 'user'))
);

-- 3b. LEADS (contact form submissions)
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  message TEXT,
  source TEXT DEFAULT 'website_contact_form',
  status TEXT DEFAULT 'new',
  assigned_to UUID REFERENCES public.profiles(id),
  archive_reason TEXT,
  archive_category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3c. CLIENTS (business customer records)
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  message TEXT,
  notes TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3d. PROJECTS (service delivery tracking)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status project_status NOT NULL DEFAULT 'lead',
  monthly_fee NUMERIC(10,2),
  total_budget NUMERIC(10,2),
  start_date DATE,
  end_date DATE,
  next_invoice_on DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3e. INVOICES (billing)
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  invoice_number TEXT UNIQUE,
  amount NUMERIC(10,2) NOT NULL,
  tax_amount NUMERIC(10,2) DEFAULT 0,
  total_amount NUMERIC(10,2) NOT NULL,
  status invoice_status NOT NULL DEFAULT 'draft',
  due_date DATE NOT NULL,
  paid_date DATE,
  client_name TEXT,
  client_email TEXT,
  client_address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3f. INVOICE LINE ITEMS
CREATE TABLE IF NOT EXISTS public.invoice_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
  rate NUMERIC(10,2) NOT NULL DEFAULT 0,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3g. SUBSCRIPTIONS (plan management)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  plan plan_enum NOT NULL DEFAULT 'starter',
  status TEXT NOT NULL DEFAULT 'active',
  price NUMERIC(10,2),
  billing_cycle TEXT DEFAULT 'monthly',
  current_period_start DATE,
  current_period_end DATE,
  trial_end DATE,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3h. INTAKE FORMS (detailed submissions)
CREATE TABLE IF NOT EXISTS public.intake_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  company_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  preferred_contact TEXT CHECK (preferred_contact IN ('email', 'text', 'call')),
  division TEXT NOT NULL CHECK (division IN ('dolonia_data_tech', 'royal_society', '1921_holding')),
  service_category TEXT NOT NULL,
  service_focus TEXT[],
  budget_range TEXT CHECK (budget_range IN ('under_1k', '1k_3k', '3k_10k', '10k_plus', 'custom')),
  custom_budget TEXT,
  timeline TEXT CHECK (timeline IN ('asap', 'this_month', '1_3_months', 'long_term')),
  referral_source TEXT,
  tech_details JSONB,
  media_details JSONB,
  business_details JSONB,
  recommended_tier TEXT,
  estimated_cost NUMERIC(10,2),
  priority_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'quoted', 'converted', 'archived')),
  assigned_to UUID REFERENCES public.profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  followed_up_at TIMESTAMPTZ
);

-- 3i. NEWSLETTER SUBSCRIBERS
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  unsubscribed_at TIMESTAMPTZ,
  source TEXT DEFAULT 'website',
  ip_address INET,
  user_agent TEXT
);

-- 3j. NOTIFICATIONS (admin-to-client alerts)
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  recipients UUID[] NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3k. ROOM BOOKINGS (internal reservations)
CREATE TABLE IF NOT EXISTS public.room_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id INTEGER NOT NULL,
  room TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  floor TEXT NOT NULL,
  title TEXT NOT NULL,
  booked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  booked_by_name TEXT NOT NULL,
  booked_at TIMESTAMPTZ DEFAULT NOW(),
  attendees TEXT[] DEFAULT '{}',
  booking_type TEXT DEFAULT 'room' CHECK (booking_type IN ('room', 'team_meeting', 'consultation')),
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending', 'cancelled')),
  source TEXT DEFAULT 'admin_dashboard' CHECK (source IN ('contact_page', 'admin_dashboard', 'team_dashboard')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3l. CLIENT APPOINTMENTS (public booking)
CREATE TABLE IF NOT EXISTS public.client_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  time TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  purpose TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3m. TICKETS (support tickets)
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  category TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ
);

-- 3n. TICKET RESPONSES
CREATE TABLE IF NOT EXISTS public.ticket_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_internal_note BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3o. AUDIT LOG
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  meta JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3p. API TOKENS
CREATE TABLE IF NOT EXISTS public.api_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  permissions JSONB DEFAULT '{}',
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 4. CREATE INDEXES
-- =====================================================

-- Leads
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);

-- Clients
CREATE INDEX IF NOT EXISTS idx_clients_owner_id ON public.clients(owner_id);

-- Projects
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON public.projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);

-- Invoices
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON public.invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON public.invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices(user_id);

-- Invoice Line Items
CREATE INDEX IF NOT EXISTS idx_invoice_line_items_invoice_id ON public.invoice_line_items(invoice_id);

-- Subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);

-- Intake Forms
CREATE INDEX IF NOT EXISTS idx_intake_forms_division ON public.intake_forms(division);
CREATE INDEX IF NOT EXISTS idx_intake_forms_status ON public.intake_forms(status);
CREATE INDEX IF NOT EXISTS idx_intake_forms_created_at ON public.intake_forms(created_at DESC);

-- Newsletter
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_subscribed_at ON public.newsletter_subscribers(subscribed_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_is_active ON public.newsletter_subscribers(is_active);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_recipients ON public.notifications USING GIN (recipients);

-- Room Bookings
CREATE INDEX IF NOT EXISTS idx_room_bookings_date ON public.room_bookings(date);
CREATE INDEX IF NOT EXISTS idx_room_bookings_booked_by ON public.room_bookings(booked_by);
CREATE INDEX IF NOT EXISTS idx_room_bookings_room_id ON public.room_bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_room_bookings_status ON public.room_bookings(status);
CREATE INDEX IF NOT EXISTS idx_room_bookings_date_time ON public.room_bookings(date, time);

-- Client Appointments
CREATE INDEX IF NOT EXISTS idx_client_appointments_date ON public.client_appointments(date);
CREATE INDEX IF NOT EXISTS idx_client_appointments_email ON public.client_appointments(client_email);
CREATE INDEX IF NOT EXISTS idx_client_appointments_status ON public.client_appointments(status);

-- Tickets
CREATE INDEX IF NOT EXISTS idx_tickets_created_by ON public.tickets(created_by);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned_to ON public.tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets(status);
CREATE INDEX IF NOT EXISTS idx_ticket_responses_ticket_id ON public.ticket_responses(ticket_id);

-- Audit Log
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON public.audit_log(created_at DESC);

-- =====================================================
-- 5. CREATE TRIGGERS
-- =====================================================

-- Auth trigger: auto-create profile on signup
DROP TRIGGER IF EXISTS trigger_handle_new_user ON auth.users;
CREATE TRIGGER trigger_handle_new_user
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Invoice number auto-generation
DROP TRIGGER IF EXISTS trigger_set_invoice_number ON public.invoices;
CREATE TRIGGER trigger_set_invoice_number
  BEFORE INSERT ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION set_invoice_number();

-- Updated_at auto-update triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_clients_updated_at ON public.clients;
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_invoices_updated_at ON public.invoices;
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_intake_forms_updated_at ON public.intake_forms;
CREATE TRIGGER update_intake_forms_updated_at
  BEFORE UPDATE ON public.intake_forms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_room_bookings_updated_at ON public.room_bookings;
CREATE TRIGGER update_room_bookings_updated_at
  BEFORE UPDATE ON public.room_bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_client_appointments_updated_at ON public.client_appointments;
CREATE TRIGGER update_client_appointments_updated_at
  BEFORE UPDATE ON public.client_appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tickets_updated_at ON public.tickets;
CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intake_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_tokens ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 7. RLS POLICIES
-- =====================================================

-- ---- PROFILES ----
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- ---- LEADS ----
CREATE POLICY "Anyone can insert leads" ON public.leads
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view leads" ON public.leads
  FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage all leads" ON public.leads
  FOR ALL USING (public.is_admin(auth.uid()));

-- ---- CLIENTS ----
CREATE POLICY "Users can view own clients" ON public.clients
  FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can manage own clients" ON public.clients
  FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Admins can manage all clients" ON public.clients
  FOR ALL USING (public.is_admin(auth.uid()));

-- ---- PROJECTS ----
CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.clients WHERE id = client_id AND owner_id = auth.uid())
  );
CREATE POLICY "Admins can manage all projects" ON public.projects
  FOR ALL USING (public.is_admin(auth.uid()));

-- ---- INVOICES ----
CREATE POLICY "Users can view own invoices" ON public.invoices
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.clients WHERE id = client_id AND owner_id = auth.uid())
  );
CREATE POLICY "Admins can manage all invoices" ON public.invoices
  FOR ALL USING (public.is_admin(auth.uid()));

-- ---- INVOICE LINE ITEMS ----
CREATE POLICY "Users can view own invoice line items" ON public.invoice_line_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.invoices
      WHERE invoices.id = invoice_id AND (
        invoices.user_id = auth.uid()
        OR EXISTS (SELECT 1 FROM public.clients WHERE clients.id = invoices.client_id AND clients.owner_id = auth.uid())
      )
    )
  );
CREATE POLICY "Admins can manage all invoice line items" ON public.invoice_line_items
  FOR ALL USING (public.is_admin(auth.uid()));

-- ---- SUBSCRIPTIONS ----
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own subscriptions" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all subscriptions" ON public.subscriptions
  FOR ALL USING (public.is_admin(auth.uid()));

-- ---- INTAKE FORMS ----
CREATE POLICY "Anyone can insert intake forms" ON public.intake_forms
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own intake forms" ON public.intake_forms
  FOR SELECT USING (email = auth.jwt()->>'email' OR public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage all intake forms" ON public.intake_forms
  FOR ALL USING (public.is_admin(auth.uid()));

-- ---- NEWSLETTER ----
CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all newsletter subscribers" ON public.newsletter_subscribers
  FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage newsletter subscribers" ON public.newsletter_subscribers
  FOR ALL USING (public.is_admin(auth.uid()));

-- ---- NOTIFICATIONS ----
CREATE POLICY "Admins can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Users can view their notifications" ON public.notifications
  FOR SELECT USING (
    auth.uid() = ANY(recipients)
    OR recipients = '{}'
    OR public.is_admin(auth.uid())
  );

-- ---- ROOM BOOKINGS ----
CREATE POLICY "Authenticated can view room bookings" ON public.room_bookings
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can create room bookings" ON public.room_bookings
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own bookings or admins all" ON public.room_bookings
  FOR UPDATE USING (
    auth.uid() = booked_by OR public.is_admin(auth.uid())
  );
CREATE POLICY "Users can delete own bookings or admins all" ON public.room_bookings
  FOR DELETE USING (
    auth.uid() = booked_by OR public.is_admin(auth.uid())
  );

-- ---- CLIENT APPOINTMENTS ----
CREATE POLICY "Anyone can create client appointments" ON public.client_appointments
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can view client appointments" ON public.client_appointments
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can update client appointments" ON public.client_appointments
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'team_member'))
  );
CREATE POLICY "Admins can delete client appointments" ON public.client_appointments
  FOR DELETE USING (public.is_admin(auth.uid()));

-- ---- TICKETS ----
CREATE POLICY "Users can create tickets" ON public.tickets
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view own tickets" ON public.tickets
  FOR SELECT USING (created_by = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "Users can update own tickets" ON public.tickets
  FOR UPDATE USING (created_by = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage all tickets" ON public.tickets
  FOR ALL USING (public.is_admin(auth.uid()));

-- ---- TICKET RESPONSES ----
CREATE POLICY "Users can view responses to their tickets" ON public.ticket_responses
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.tickets WHERE tickets.id = ticket_id AND (tickets.created_by = auth.uid() OR public.is_admin(auth.uid())))
  );
CREATE POLICY "Users can reply to own tickets" ON public.ticket_responses
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.tickets WHERE tickets.id = ticket_id AND (tickets.created_by = auth.uid() OR public.is_admin(auth.uid())))
  );
CREATE POLICY "Admins can manage all ticket responses" ON public.ticket_responses
  FOR ALL USING (public.is_admin(auth.uid()));

-- ---- AUDIT LOG ----
CREATE POLICY "Users can view own audit logs" ON public.audit_log
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all audit logs" ON public.audit_log
  FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "System can insert audit logs" ON public.audit_log
  FOR INSERT WITH CHECK (true);

-- ---- API TOKENS ----
CREATE POLICY "Users can manage own tokens" ON public.api_tokens
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all tokens" ON public.api_tokens
  FOR ALL USING (public.is_admin(auth.uid()));

-- =====================================================
-- 8. VIEWS
-- =====================================================

CREATE OR REPLACE VIEW public.upcoming_calendar_events AS
SELECT
  'room_booking' as event_type,
  id, room as location, title as event_title,
  booked_by_name as organizer, date, time, status, source, created_at
FROM public.room_bookings WHERE date >= CURRENT_DATE
UNION ALL
SELECT
  'client_appointment' as event_type,
  id, 'Client Meeting Room' as location, purpose as event_title,
  client_name as organizer, date, time, status, 'contact_page' as source, created_at
FROM public.client_appointments WHERE date >= CURRENT_DATE
ORDER BY date, time;

-- =====================================================
-- 9. GRANTS
-- =====================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON public.room_bookings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_appointments TO authenticated;
GRANT ALL ON public.room_bookings TO service_role;
GRANT ALL ON public.client_appointments TO service_role;

-- =====================================================
-- 10. TABLE COMMENTS
-- =====================================================

COMMENT ON TABLE public.profiles IS 'User profiles extending auth.users with roles';
COMMENT ON TABLE public.leads IS 'Contact form submissions and sales leads';
COMMENT ON TABLE public.clients IS 'Business customer records';
COMMENT ON TABLE public.projects IS 'Service delivery and project tracking';
COMMENT ON TABLE public.invoices IS 'Billing and invoice management';
COMMENT ON TABLE public.invoice_line_items IS 'Itemized line items for invoices';
COMMENT ON TABLE public.subscriptions IS 'Subscription plan management';
COMMENT ON TABLE public.intake_forms IS 'Detailed intake form submissions by division';
COMMENT ON TABLE public.newsletter_subscribers IS 'Newsletter email list';
COMMENT ON TABLE public.notifications IS 'Admin-to-client notification messages';
COMMENT ON TABLE public.room_bookings IS 'Internal team room reservations';
COMMENT ON TABLE public.client_appointments IS 'Client-facing appointment bookings';
COMMENT ON TABLE public.tickets IS 'Support ticket tracking';
COMMENT ON TABLE public.ticket_responses IS 'Responses and notes on support tickets';
COMMENT ON TABLE public.audit_log IS 'Activity and change audit trail';
COMMENT ON TABLE public.api_tokens IS 'API authentication tokens';

-- =====================================================
-- DONE! Verify with:
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public' ORDER BY table_name;
-- =====================================================
