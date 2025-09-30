-- Add invoices table for client billing
create table invoices (
  id serial primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  amount numeric(10,2) not null,
  status text not null default 'open',
  due_date date not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table invoices enable row level security;

-- RLS Policies for invoices
create policy "Users can view their own invoices"
  on invoices for select
  using (user_id = auth.uid());

create policy "Admins can view all invoices"
  on invoices for select
  using (is_admin(auth.uid()));

create policy "Admins can insert invoices"
  on invoices for insert
  with check (is_admin(auth.uid()));

create policy "Admins can update invoices"
  on invoices for update
  using (is_admin(auth.uid()));

-- Index for performance
create index invoices_user_id_idx on invoices(user_id);
create index invoices_due_date_idx on invoices(due_date);