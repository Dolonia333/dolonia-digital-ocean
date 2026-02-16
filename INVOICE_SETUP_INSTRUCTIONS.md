# Invoice System Setup - Next Steps

## Overview

The invoice system has been enhanced with database persistence and client viewing capabilities. Follow these steps to complete the setup.

## ✅ Completed

- Created `InvoiceCreator.tsx` with database save functionality
- Created `InvoiceViewer.tsx` for clients to view/download invoices
- Updated TypeScript types to include `invoice_line_items` table
- Added client selector dropdown to invoice creator
- Integrated notification system to alert clients when invoices are created
- Added InvoiceViewer to client dashboard in Account.tsx

## 🔴 Required: Database Migrations

You must run these SQL migrations in your Supabase SQL Editor to enable the invoice system:

### Step 1: Run Invoice User Link Migration

Location: `supabase-migration-invoice-user-link.sql`

This migration adds the following columns to the `invoices` table:

- `user_id` (links invoice to client profile)
- `client_name` (client's full name)
- `client_email` (client's email address)
- `client_address` (optional billing address)
- `invoice_number` (unique invoice identifier)
- `notes` (payment terms and additional info)
- `paid_date` (when invoice was paid)
- `tax_amount` (optional tax amount)

It also updates the RLS policy to allow users to view their own invoices.

**How to run:**

1. Open your Supabase dashboard: http://10.15.20.207:54321
2. Go to SQL Editor
3. Copy the contents of `supabase-migration-invoice-user-link.sql`
4. Paste and execute

### Step 2: Run Invoice Line Items Migration

Location: `supabase-migration-invoice-line-items.sql`

This migration creates the `invoice_line_items` table with:

- `id` (UUID primary key)
- `invoice_id` (foreign key to invoices)
- `description` (service/product description)
- `quantity` (number of items)
- `rate` (price per item)
- `amount` (total = quantity × rate)
- `created_at` (timestamp)

It also creates RLS policies allowing:

- Users to view line items for their own invoices
- Admins to view all line items

**How to run:**

1. Open your Supabase dashboard: http://10.15.20.207:54321
2. Go to SQL Editor
3. Copy the contents of `supabase-migration-invoice-line-items.sql`
4. Paste and execute

## 🔴 Critical: Re-enable RLS on Profiles Table

**SECURITY WARNING:** RLS was temporarily disabled on the profiles table for debugging. You MUST re-enable it.

Run this SQL in Supabase SQL Editor:

```sql
-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop the existing policy if it exists
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;

-- Create the correct policy
CREATE POLICY "profiles_select_policy"
ON profiles FOR SELECT
USING (
  auth.uid() = id OR public.is_admin(auth.uid())
);
```

This policy allows:

- Users to view their own profile
- Admins to view all profiles

## ✅ How to Test the Invoice System

Once migrations are complete:

### As Admin:

1. Log in to your dashboard
2. Navigate to "Invoice Creator" section
3. Select a client from the dropdown (populated from profiles table)
4. Fill in invoice details:
   - Due date
   - Line items (description, quantity, rate)
   - Notes (payment terms, etc.)
5. Click "Create Invoice"
6. Verify:
   - Invoice saves to database
   - Client receives notification
   - PDF downloads successfully

### As Client:

1. Log in with a client account
2. Navigate to dashboard
3. Check for notification about new invoice
4. View "My Invoices" section
5. Click "View" to see invoice details
6. Click "Download PDF" to get printable version

## 📊 Expected Workflow

1. Client fills out intake form
2. Admin reviews intake form
3. Admin creates invoice for client:
   - Selects client from dropdown
   - Adds line items for services
   - Sets due date and payment terms
4. Invoice is saved to database with line items
5. Client receives notification in their dashboard
6. Client views invoice in "My Invoices" section
7. Client downloads PDF for their records
8. Admin can update invoice status (draft → sent → paid)

## 🔍 Verification Checklist

After running migrations, verify in Supabase SQL Editor:

```sql
-- Check invoices table structure
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'invoices';

-- Check invoice_line_items table exists
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'invoice_line_items';

-- Check RLS policies on invoices
SELECT * FROM pg_policies WHERE tablename = 'invoices';

-- Check RLS policies on invoice_line_items
SELECT * FROM pg_policies WHERE tablename = 'invoice_line_items';

-- Check RLS is enabled on profiles
SELECT relrowsecurity
FROM pg_class
WHERE relname = 'profiles';
```

## 🎨 Features Included

### Invoice Creator (`InvoiceCreator.tsx`)

- Client selector (loads from profiles + intake_forms)
- Dynamic line item addition
- Automatic total calculation
- Database persistence
- PDF generation
- Client notification sending
- Professional letterhead design

### Invoice Viewer (`InvoiceViewer.tsx`)

- Summary cards (total invoices, outstanding balance, overdue count)
- Sortable invoice table
- Status badges (draft, sent, paid, overdue, cancelled)
- Invoice detail modal with line items
- PDF download functionality
- Responsive design with ocean theme

## 🔐 Security Notes

- RLS policies ensure clients only see their own invoices
- Admin role required to create/edit invoices
- All database operations require authentication
- Invoice numbers are unique per invoice
- User IDs link invoices to specific clients

## 🐛 Troubleshooting

**Issue:** Client dropdown is empty

- **Solution:** Ensure profiles table has users with role='client' or role='user'
- **Check:** Run `SELECT * FROM profiles WHERE role IN ('client', 'user');`

**Issue:** Invoice not saving to database

- **Solution:** Check browser console for errors
- **Verify:** Both migration files have been executed
- **Check:** RLS policies allow admin to insert into invoices table

**Issue:** Client can't see invoices

- **Solution:** Verify user_id matches the client's auth.uid()
- **Check:** RLS policy on invoices allows `auth.uid() = user_id`

**Issue:** Line items not showing

- **Solution:** Verify invoice_line_items table exists
- **Check:** Foreign key constraint links to invoices.id

## 📝 Next Enhancements (Optional)

Future improvements you could add:

- Email sending integration (SendGrid, AWS SES)
- Payment gateway integration (Stripe, PayPal)
- Recurring invoice automation
- Invoice templates with custom branding
- Multi-currency support
- Invoice history/audit trail
- Bulk invoice generation
- Export to accounting software (QuickBooks, Xero)

## Support

If you encounter issues:

1. Check Supabase logs for errors
2. Verify all migrations ran successfully
3. Check RLS policies are correctly configured
4. Review browser console for frontend errors
5. Ensure Supabase realtime is working (WebSocket connection)
