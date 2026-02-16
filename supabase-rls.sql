-- Row Level Security (RLS) Policies for Dolonia Digital Ocean
-- Run this AFTER creating the main schema

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_tokens ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- Leads policies (MOST IMPORTANT - Contact forms need this)
CREATE POLICY "Anyone can insert leads" ON public.leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view leads" ON public.leads
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage all leads" ON public.leads
  FOR ALL USING (public.is_admin(auth.uid()));

-- Clients policies
CREATE POLICY "Users can view own clients" ON public.clients
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can manage own clients" ON public.clients
  FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Admins can manage all clients" ON public.clients
  FOR ALL USING (public.is_admin(auth.uid()));

-- Projects policies
CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE id = client_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own projects" ON public.projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE id = client_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all projects" ON public.projects
  FOR ALL USING (public.is_admin(auth.uid()));

-- Invoices policies
CREATE POLICY "Users can view own invoices" ON public.invoices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE id = client_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own invoices" ON public.invoices
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE id = client_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all invoices" ON public.invoices
  FOR ALL USING (public.is_admin(auth.uid()));

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all subscriptions" ON public.subscriptions
  FOR ALL USING (public.is_admin(auth.uid()));

-- Audit log policies (read-only for users)
CREATE POLICY "Users can view own audit logs" ON public.audit_log
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all audit logs" ON public.audit_log
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "System can insert audit logs" ON public.audit_log
  FOR INSERT WITH CHECK (true);

-- API tokens policies
CREATE POLICY "Users can manage own tokens" ON public.api_tokens
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all tokens" ON public.api_tokens
  FOR ALL USING (public.is_admin(auth.uid()));

-- Create admin function for frontend
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.is_admin(auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
