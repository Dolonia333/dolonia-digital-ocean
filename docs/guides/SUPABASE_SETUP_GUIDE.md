# 📋 Supabase Calendar Setup Guide

## Quick Setup Steps

### Option 1: Using Supabase Dashboard (Easiest)

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Paste**
   - Open: `supabase/migrations/create_calendar_tables.sql`
   - Copy ALL the SQL code
   - Paste into the SQL Editor

4. **Run the Migration**
   - Click "Run" button (bottom right)
   - Wait for success message

5. **Verify**
   - Go to "Table Editor" in left sidebar
   - You should see two new tables:
     - ✅ `room_bookings`
     - ✅ `client_appointments`

### Option 2: Using Supabase CLI (Advanced)

```bash
# If you have Supabase CLI installed
cd c:\Users\zionv\OneDrive\Desktop\dolonia-digital-ocean
supabase db push
```

---

## 📊 What Gets Created

### 1. Tables

#### `room_bookings`

Stores internal team room reservations:

- Room details (name, floor, capacity)
- Meeting info (title, time, date)
- Organizer details
- Attendees list
- Booking type (room, team_meeting, consultation)
- Status (confirmed, pending, cancelled)
- Source (admin_dashboard, team_dashboard, contact_page)

#### `client_appointments`

Stores client-facing appointments:

- Client information (name, email)
- Appointment details (date, time, purpose)
- Status (pending, confirmed, cancelled, completed)
- Notes field

### 2. Indexes (for fast queries)

- Date indexes for quick calendar lookups
- Email indexes for client search
- Status indexes for filtering
- Combined date+time indexes

### 3. Row Level Security (RLS)

**Room Bookings:**

- ✅ All authenticated users can VIEW
- ✅ All authenticated users can CREATE
- ✅ Users can UPDATE/DELETE their own
- ✅ Admins can UPDATE/DELETE any

**Client Appointments:**

- ✅ Anyone can CREATE (public contact form)
- ✅ Only authenticated users can VIEW
- ✅ Staff and admins can UPDATE
- ✅ Only admins can DELETE

### 4. Auto-Update Triggers

- `updated_at` automatically updates on any change

### 5. Helpful View

- `upcoming_calendar_events` - Combined view of all upcoming events

---

## 🧪 Testing After Setup

### Test 1: Verify Tables Exist

Run this in SQL Editor:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('room_bookings', 'client_appointments');
```

Should return 2 rows.

### Test 2: Check RLS is Enabled

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('room_bookings', 'client_appointments');
```

Both should show `rowsecurity = true`.

### Test 3: Insert Sample Data

```sql
-- Insert a sample room booking
INSERT INTO room_bookings (
  room_id, room, date, time, capacity, floor,
  title, booked_by_name, booking_type, status, source
) VALUES (
  1, 'Conference Room A', CURRENT_DATE + 1, '2:00 PM',
  12, '2nd Floor', 'Team Meeting', 'Admin User',
  'team_meeting', 'confirmed', 'admin_dashboard'
);

-- Insert a sample client appointment
INSERT INTO client_appointments (
  date, time, client_name, client_email, purpose, status
) VALUES (
  CURRENT_DATE + 2, '10:00 AM', 'John Doe',
  'john@example.com', 'Initial Consultation', 'pending'
);
```

### Test 4: View Combined Events

```sql
SELECT * FROM upcoming_calendar_events
ORDER BY date, time
LIMIT 10;
```

---

## 🔧 Troubleshooting

### Error: "relation already exists"

- Tables already exist. Either:
  - Drop them first: `DROP TABLE IF EXISTS room_bookings, client_appointments CASCADE;`
  - Or skip to verification steps

### Error: "permission denied"

- Make sure you're logged into Supabase
- Check your project permissions

### Error: "syntax error"

- Make sure you copied the ENTIRE SQL file
- Check for any missing semicolons

### RLS blocks all access

- Make sure you have a `profiles` table with a `role` column
- Or temporarily disable RLS for testing:
  ```sql
  ALTER TABLE room_bookings DISABLE ROW LEVEL SECURITY;
  ALTER TABLE client_appointments DISABLE ROW LEVEL SECURITY;
  ```

---

## 📈 Next Steps

After creating the tables:

1. **Update your app** to use Supabase (see `QUICK_START_SUPABASE.md`)
2. **Migrate existing data** from localStorage (optional)
3. **Test bookings** in your app
4. **Monitor in Supabase** - Go to Table Editor to see live data

---

## 🎯 Table Structure Reference

### room_bookings columns:

- `id` - UUID primary key
- `room_id` - Integer (1-6 for your rooms)
- `room` - Room name
- `date` - Date of booking
- `time` - Time slot (e.g., "2:00 PM")
- `capacity` - Number of people
- `floor` - Floor location
- `title` - Meeting title
- `booked_by` - UUID reference to auth.users
- `booked_by_name` - User's display name
- `booked_at` - Timestamp of booking
- `attendees` - Array of attendee names/emails
- `booking_type` - 'room' | 'team_meeting' | 'consultation'
- `status` - 'confirmed' | 'pending' | 'cancelled'
- `source` - 'contact_page' | 'admin_dashboard' | 'team_dashboard'
- `created_at` - Auto timestamp
- `updated_at` - Auto timestamp

### client_appointments columns:

- `id` - UUID primary key
- `date` - Appointment date
- `time` - Appointment time
- `client_name` - Client's name
- `client_email` - Client's email
- `purpose` - Reason for appointment
- `status` - 'pending' | 'confirmed' | 'cancelled' | 'completed'
- `notes` - Optional notes
- `created_at` - Auto timestamp
- `updated_at` - Auto timestamp

---

## ✅ Success Checklist

- [ ] SQL migration executed successfully
- [ ] Both tables appear in Table Editor
- [ ] RLS is enabled on both tables
- [ ] Sample data inserts work
- [ ] View query returns results
- [ ] Ready to update app code

Once all checked, you're ready to connect your app to Supabase! 🚀
