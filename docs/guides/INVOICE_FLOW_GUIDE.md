# Invoice Flow: Admin Send → Client View & Download

## Current System Status

✅ **Implemented**:

- Invoice creation in InvoiceCreator.tsx
- Invoice storage in database
- Line items saved
- PDF download functionality exists
- InvoiceViewer component displays invoices
- Client role auto-upgrade on invoice send
- Notification to client

## How It Works (Current)

### Step 1: Admin Creates Invoice

1. Admin goes to **Dashboard** → **Invoices** tab
2. Clicks **"Create Invoice"**
3. Selects client email
4. Adds line items (services)
5. Sets due date
6. Clicks **"Create & Send"**

**What happens**:

- Invoice saved to database with `status = 'sent'`
- Line items saved
- Client auto-upgraded to 'client' role
- Client receives notification
- Invoice HTML downloaded to admin's computer

### Step 2: Client Receives Invoice

1. Client logs into their dashboard
2. Goes to **Billing Insights** section
3. Sees **"View Invoices"** button
4. Clicks it
5. Sees list of all their invoices

**What they see**:

- Invoice number
- Amount
- Due date
- Status (sent/paid/overdue)
- Download PDF button

### Step 3: Client Downloads PDF

1. Client clicks **"Download PDF"** button
2. Browser opens print dialog
3. Client chooses "Save as PDF" from print menu
4. PDF saved to their computer

---

## Potential Issues & Fixes

### Issue 1: Invoices Not Appearing on Client Dashboard

**Cause**: Client doesn't have proper role or invoice isn't linked to their user_id

**Fix**:

```sql
-- Check if invoice has user_id
SELECT id, invoice_number, user_id, client_email, status FROM invoices LIMIT 10;

-- If user_id is NULL, update it:
UPDATE invoices
SET user_id = (SELECT id FROM profiles WHERE name = 'ClientName')
WHERE user_id IS NULL AND client_email = 'client@email.com';
```

### Issue 2: Client Can't See PDF Download Button

**Cause**: InvoiceViewer component isn't loading properly

**Fix**: Check browser console (F12) for errors

### Issue 3: PDF Opens But Looks Weird

**Cause**: CSS not loading in print view

**Fix**: The HTML invoice has inline CSS, should work fine

---

## Complete Invoice Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ ADMIN DASHBOARD                                              │
├─────────────────────────────────────────────────────────────┤
│ 1. Click "Invoices" tab                                      │
│ 2. Click "Create Invoice"                                    │
│ 3. Select client email                                       │
│ 4. Add services/line items                                   │
│ 5. Set due date                                              │
│ 6. Click "Create & Send"                                     │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ DATABASE                                                     │
├─────────────────────────────────────────────────────────────┤
│ ✅ Insert to invoices table                                  │
│    - invoice_number: generated                               │
│    - client_email: from form                                 │
│    - amount: calculated                                      │
│    - status: 'sent'                                          │
│    - user_id: from client profile                            │
│                                                               │
│ ✅ Insert to invoice_line_items table                        │
│    - description: service name                               │
│    - quantity: 1                                             │
│    - rate: service price                                     │
│    - amount: calculated                                      │
│                                                               │
│ ✅ Update profiles table                                     │
│    - Set role = 'client' if not already                      │
│                                                               │
│ ✅ Insert to notifications table                             │
│    - Message with invoice number and amount                  │
│    - Recipients: client user_id                              │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ CLIENT DASHBOARD                                             │
├─────────────────────────────────────────────────────────────┤
│ 1. Client logs in                                            │
│ 2. Dashboard loads InvoiceViewer component                   │
│ 3. InvoiceViewer queries:                                    │
│    SELECT * FROM invoices WHERE user_id = <client_id>       │
│ 4. Lists all invoices for this client                        │
│ 5. Shows:                                                    │
│    - Invoice number                                          │
│    - Amount                                                  │
│    - Due date                                                │
│    - Status badge                                            │
│    - View & Download buttons                                 │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ CLIENT CLICKS DOWNLOAD PDF                                   │
├─────────────────────────────────────────────────────────────┤
│ 1. Frontend calls downloadInvoicePDF(invoice)               │
│ 2. Fetches invoice_line_items for this invoice              │
│ 3. Generates HTML with invoice details + logo               │
│ 4. Opens new browser window                                  │
│ 5. Browser print dialog appears                              │
│ 6. Client selects "Save as PDF"                              │
│ 7. PDF downloaded to client's computer                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Tables Involved

### invoices table

```sql
id                VARCHAR
invoice_number    VARCHAR (unique)
user_id          UUID (FK to profiles)
client_name      VARCHAR
client_email     VARCHAR
amount           NUMERIC
total_amount     NUMERIC
tax_amount       NUMERIC
status           invoice_status ('draft', 'sent', 'paid', 'overdue', 'cancelled')
due_date         DATE
paid_date        DATE (nullable)
notes            TEXT
created_at       TIMESTAMP
```

### invoice_line_items table

```sql
id              VARCHAR
invoice_id      VARCHAR (FK to invoices)
description     VARCHAR
quantity        NUMERIC
rate            NUMERIC
amount          NUMERIC
created_at      TIMESTAMP
```

### profiles table (relevant fields)

```sql
id              UUID
name            TEXT
role            user_role ('admin', 'client', 'team_member', 'user')
email          TEXT (from auth.users)
```

---

## Step-by-Step to Send Invoice

### From Admin Side:

1. **Login as admin** to http://localhost:8080/
2. **Click "Admin Dashboard"** button
3. **Click "Invoices"** tab (shows InvoiceCreator form)
4. **Fill in the form**:
   - Select client from dropdown (shows clients from intake forms + profiles)
   - Click "Add Line Item" button
   - Select service from catalog (auto-fills rate)
   - Adjust quantity if needed
   - Add more line items as needed
5. **Set Due Date** (required)
6. **Click "Create & Send"** button
7. **Invoice HTML downloads** (you can save as PDF from browser print menu)
8. Check **Developer Console** (F12) for success messages

### From Client Side:

1. **Client receives notification** (if system is working)
2. **Client logs in** to http://localhost:8080/
3. **Invoices appear automatically** in "Billing Insights" section
4. **Click "View Invoices"** button
5. **See invoice list** with all invoices sent to them
6. **Click "Download PDF"** button on any invoice
7. **Browser print dialog opens**
8. **Choose "Save as PDF"** option
9. **PDF downloads**

---

## Troubleshooting Checklist

- [ ] Dev server running? (`npm run dev`)
- [ ] Admin can access Invoices tab?
- [ ] Can see client list dropdown?
- [ ] Can add line items?
- [ ] Can set due date?
- [ ] Can click "Create & Send"?
- [ ] Does success toast appear?
- [ ] HTML invoice downloads?
- [ ] Client sees invoice notification?
- [ ] Client can see invoices in dashboard?
- [ ] Download PDF button works?
- [ ] PDF opens in print dialog?

If ANY of these fail, let me know which step and I'll add debugging!
