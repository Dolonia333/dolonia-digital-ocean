-- Sample data for Dolonia Digital Ocean
-- Run this AFTER schema and RLS setup to test your database

-- Insert a sample admin profile (you'll need to create a user first via Supabase Auth)
-- Replace the UUID below with your actual user ID after signup
INSERT INTO public.profiles (id, name, role, company, phone) VALUES
  ('00000000-0000-0000-0000-000000000000', 'Admin User', 'admin', 'Dolonia Digital Ocean', '+1-555-0100');
-- Note: Replace the UUID above with your actual auth.users.id after creating an account

-- Sample leads (contact form submissions)
INSERT INTO public.leads (name, email, company, phone, message, status) VALUES
  ('John Smith', 'john@techcorp.com', 'TechCorp Solutions', '+1-555-0101', 'Interested in cybersecurity consulting for our startup. We have about 50 employees and need help with our security infrastructure.', 'new'),
  ('Sarah Johnson', 'sarah@retailplus.com', 'RetailPlus Inc', '+1-555-0102', 'We need help migrating our e-commerce platform to a more secure cloud solution. Can you help with digital transformation?', 'contacted'),
  ('Mike Chen', 'mike.chen@healthtech.io', 'HealthTech Innovations', '+1-555-0103', 'Looking for HIPAA-compliant hosting solutions for our medical software. Need consultation on compliance requirements.', 'new'),
  ('Lisa Rodriguez', 'lisa@financeflow.com', 'FinanceFlow LLC', '+1-555-0104', 'Our financial services company needs a security audit and penetration testing. When can we schedule a consultation?', 'qualified'),
  ('David Kim', 'david@startupx.com', 'StartupX', '+1-555-0105', 'Small team looking for managed security services. What packages do you offer for companies under 20 people?', 'new');

-- Sample clients (converted from leads)
INSERT INTO public.clients (name, company, email, phone, status, notes) VALUES
  ('John Smith', 'TechCorp Solutions', 'john@techcorp.com', '+1-555-0101', 'active', 'Converted from lead. 50 employees, growing fast.'),
  ('Sarah Johnson', 'RetailPlus Inc', 'sarah@retailplus.com', '+1-555-0102', 'active', 'E-commerce platform migration project.'),
  ('Lisa Rodriguez', 'FinanceFlow LLC', 'lisa@financeflow.com', '+1-555-0104', 'active', 'Financial services, needs compliance focus.');

-- Sample projects
INSERT INTO public.projects (client_id, name, description, status, monthly_fee, total_budget, start_date, next_invoice_on) VALUES
  (
    (SELECT id FROM public.clients WHERE email = 'john@techcorp.com'),
    'TechCorp Security Infrastructure',
    'Complete security infrastructure setup including firewall configuration, VPN setup, and employee security training.',
    'active',
    2500.00,
    15000.00,
    '2025-09-01',
    '2025-11-01'
  ),
  (
    (SELECT id FROM public.clients WHERE email = 'sarah@retailplus.com'),
    'E-commerce Platform Migration',
    'Migrate existing e-commerce platform to secure cloud infrastructure with enhanced security measures.',
    'active',
    3200.00,
    25000.00,
    '2025-08-15',
    '2025-10-15'
  ),
  (
    (SELECT id FROM public.clients WHERE email = 'lisa@financeflow.com'),
    'Financial Services Security Audit',
    'Comprehensive security audit and compliance review for financial services company.',
    'lead',
    NULL,
    8000.00,
    NULL,
    NULL
  );

-- Sample invoices
INSERT INTO public.invoices (client_id, project_id, amount, tax_amount, total_amount, status, due_date, notes) VALUES
  (
    (SELECT id FROM public.clients WHERE email = 'john@techcorp.com'),
    (SELECT id FROM public.projects WHERE name = 'TechCorp Security Infrastructure'),
    2500.00,
    250.00,
    2750.00,
    'sent',
    '2025-11-01',
    'Monthly retainer for October 2025'
  ),
  (
    (SELECT id FROM public.clients WHERE email = 'sarah@retailplus.com'),
    (SELECT id FROM public.projects WHERE name = 'E-commerce Platform Migration'),
    3200.00,
    320.00,
    3520.00,
    'paid',
    '2025-10-15',
    'Monthly retainer for September 2025'
  ),
  (
    (SELECT id FROM public.clients WHERE email = 'john@techcorp.com'),
    (SELECT id FROM public.projects WHERE name = 'TechCorp Security Infrastructure'),
    2500.00,
    250.00,
    2750.00,
    'paid',
    '2025-10-01',
    'Monthly retainer for September 2025'
  );

-- Sample subscriptions
INSERT INTO public.subscriptions (client_id, plan, status, price, billing_cycle, current_period_start, current_period_end) VALUES
  (
    (SELECT id FROM public.clients WHERE email = 'john@techcorp.com'),
    'pro',
    'active',
    2500.00,
    'monthly',
    '2025-10-01',
    '2025-10-31'
  ),
  (
    (SELECT id FROM public.clients WHERE email = 'sarah@retailplus.com'),
    'enterprise',
    'active',
    3200.00,
    'monthly',
    '2025-09-15',
    '2025-10-14'
  );

-- Sample audit log entries
INSERT INTO public.audit_log (action, entity, entity_id, meta) VALUES
  ('create', 'lead', (SELECT id FROM public.leads WHERE email = 'john@techcorp.com'), '{"source": "contact_form", "ip": "192.168.1.100"}'),
  ('update', 'lead', (SELECT id FROM public.leads WHERE email = 'john@techcorp.com'), '{"field": "status", "old_value": "new", "new_value": "contacted"}'),
  ('create', 'client', (SELECT id FROM public.clients WHERE email = 'john@techcorp.com'), '{"converted_from_lead": true}'),
  ('create', 'project', (SELECT id FROM public.projects WHERE name = 'TechCorp Security Infrastructure'), '{"client": "TechCorp Solutions"}'),
  ('create', 'invoice', (SELECT id FROM public.invoices WHERE notes LIKE '%September 2025%' LIMIT 1), '{"amount": 2750.00, "auto_generated": true}');

-- Display summary
DO $$
BEGIN
  RAISE NOTICE 'Sample data inserted successfully!';
  RAISE NOTICE 'Leads: %', (SELECT COUNT(*) FROM public.leads);
  RAISE NOTICE 'Clients: %', (SELECT COUNT(*) FROM public.clients);
  RAISE NOTICE 'Projects: %', (SELECT COUNT(*) FROM public.projects);
  RAISE NOTICE 'Invoices: %', (SELECT COUNT(*) FROM public.invoices);
  RAISE NOTICE 'Subscriptions: %', (SELECT COUNT(*) FROM public.subscriptions);
  RAISE NOTICE 'Audit logs: %', (SELECT COUNT(*) FROM public.audit_log);
END $$;