-- Create enums for roles and statuses
CREATE TYPE user_role AS ENUM ('admin', 'client');
CREATE TYPE project_status AS ENUM ('lead', 'active', 'paused', 'completed');
CREATE TYPE plan_enum AS ENUM ('starter', 'pro', 'enterprise');

-- Profiles table (extends auth.users with role)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  role user_role NOT NULL DEFAULT 'client',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Clients table
CREATE TABLE public.clients (
  id SERIAL PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Projects table
CREATE TABLE public.projects (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES public.clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status project_status NOT NULL DEFAULT 'lead',
  monthly_fee NUMERIC(10,2),
  next_invoice_on DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Leads table (public contact form submissions)
CREATE TABLE public.leads (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE public.subscriptions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan plan_enum NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit log table
CREATE TABLE public.audit_log (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id INTEGER,
  meta JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- API tokens table
CREATE TABLE public.api_tokens (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  token_hash TEXT NOT NULL,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_tokens ENABLE ROW LEVEL SECURITY;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'admin'
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- RLS Policies for clients
CREATE POLICY "Clients can view their own client record"
  ON public.clients FOR SELECT
  USING (owner_id = auth.uid());

CREATE POLICY "Admins can view all clients"
  ON public.clients FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert clients"
  ON public.clients FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update clients"
  ON public.clients FOR UPDATE
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete clients"
  ON public.clients FOR DELETE
  USING (public.is_admin(auth.uid()));

-- RLS Policies for projects
CREATE POLICY "Clients can view their own projects"
  ON public.projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = projects.client_id
      AND clients.owner_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all projects"
  ON public.projects FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert projects"
  ON public.projects FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update projects"
  ON public.projects FOR UPDATE
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete projects"
  ON public.projects FOR DELETE
  USING (public.is_admin(auth.uid()));

-- RLS Policies for leads (admins only)
CREATE POLICY "Admins can view all leads"
  ON public.leads FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone can insert leads"
  ON public.leads FOR INSERT
  WITH CHECK (true);

-- RLS Policies for subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all subscriptions"
  ON public.subscriptions FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage subscriptions"
  ON public.subscriptions FOR ALL
  USING (public.is_admin(auth.uid()));

-- RLS Policies for audit_log (admins only, read-only)
CREATE POLICY "Admins can view audit log"
  ON public.audit_log FOR SELECT
  USING (public.is_admin(auth.uid()));

-- RLS Policies for api_tokens
CREATE POLICY "Users can view their own tokens"
  ON public.api_tokens FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own tokens"
  ON public.api_tokens FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own tokens"
  ON public.api_tokens FOR DELETE
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all tokens"
  ON public.api_tokens FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Trigger function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    'client'
  );
  RETURN NEW;
END;
$$;

-- Trigger to auto-create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Indexes for performance
CREATE INDEX idx_clients_owner_id ON public.clients(owner_id);
CREATE INDEX idx_projects_client_id ON public.projects(client_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX idx_audit_log_created_at ON public.audit_log(created_at DESC);
CREATE INDEX idx_api_tokens_user_id ON public.api_tokens(user_id);