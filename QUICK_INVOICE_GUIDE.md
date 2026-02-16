# ⚡ QUICK INVOICE SENDING GUIDE

## Admin: How to Send an Invoice

### 1. Go to Admin Dashboard

- Login to http://localhost:8080/
- Click the big **"Admin Dashboard"** button

### 2. Click Invoices Tab

- Look for card labeled **"Invoices"**
- Click it

### 3. Fill Invoice Form

```
Client Email: [dropdown - select from list]
Due Date: [pick a date]

Line Items:
  - Click "Add Line Item"
  - Select service from dropdown (auto-fills price)
  - Adjust quantity if needed
  - Repeat for more services
```

### 4. Send Invoice

- Click **"Create & Send"** button
- Invoice HTML downloads (optional: save as PDF)
- Toast says "Invoice created and sent successfully!"

---

## Client: How to View & Download Invoice

### 1. Client Logs In

- Go to http://localhost:8080/
- Login with their email

### 2. Find Invoices

- Dashboard shows **"Billing Insights"** section
- Click **"View Invoices"** button

### 3. See All Invoices

- List shows all invoices sent to them
- Shows: Invoice #, Amount, Due Date, Status

### 4. Download as PDF

- Click **"Download PDF"** button on any invoice
- Browser print dialog appears
- Choose **"Save as PDF"** from printer dropdown
- Click **"Save"** button
- PDF downloads to Downloads folder

---

## What Should Happen

✅ Admin creates invoice
✅ Invoice saved to database
✅ Client auto-promoted to "client" role
✅ Client gets notification
✅ Invoice appears on client dashboard
✅ Client can download as PDF

---

## If Something Isn't Working

**Invoices not appearing on client dashboard?**

- Check browser console (F12) for errors
- Make sure client has 'client' role in database
- Make sure invoice has `user_id` field set

**Can't download PDF?**

- Try using Chrome or Firefox
- Check if print dialog appears
- Select "Save as PDF" printer

**Need help?**

- Check INVOICE_FLOW_GUIDE.md for detailed steps
- Check browser console (F12 → Console tab)
- Look for error messages in red

---

## Status Tracking

Invoices can have these statuses:

- **draft** - Not sent yet
- **sent** - Just sent to client ← (This is the default)
- **paid** - Client paid it
- **overdue** - Past due date
- **cancelled** - Voided

You can update status manually by editing invoice in admin dashboard.

---

Ready? Start by opening http://localhost:8080/ and trying to create an invoice! 🚀
