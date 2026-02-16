# Supabase Calendar System - Data Flow Architecture

## 🔄 System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    YOUR APPLICATION                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐           ┌──────────────────┐            │
│  │  Contact Page    │           │  Admin Dashboard │            │
│  │  (Public)        │           │  (Authenticated) │            │
│  └────────┬─────────┘           └────────┬─────────┘            │
│           │                              │                       │
│           │ Client books                 │ Admin/Staff          │
│           │ appointment                  │ books room           │
│           │                              │                       │
│           ▼                              ▼                       │
│  ┌─────────────────────────────────────────────────┐            │
│  │   AppointmentBookingCalendar.tsx                │            │
│  │   - Monday-Friday 9-5                            │            │
│  │   - 30-min time slots                            │            │
│  │   - Client contact form                          │            │
│  └───────────────────┬──────────────────────────────┘            │
│                      │                                           │
│                      │                                           │
│  ┌───────────────────▼──────────────────────────────┐            │
│  │   RoomBookingDashboard.tsx                       │            │
│  │   - 6 meeting rooms                               │            │
│  │   - 12 time slots (8AM-7PM)                       │            │
│  │   - Day/Week views                                │            │
│  │   - Analytics & Tracker                           │            │
│  │   - Shows MERGED calendar (rooms + clients)       │            │
│  └───────────────────┬──────────────────────────────┘            │
│                      │                                           │
│                      ▼                                           │
│  ┌──────────────────────────────────────────────────┐            │
│  │        calendarService.ts                        │            │
│  │        (Service Layer)                           │            │
│  │  ┌─────────────────────────────────────────┐    │            │
│  │  │ • getAllBookings()                       │    │            │
│  │  │ • getRoomBookings()                      │    │            │
│  │  │ • getClientAppointments()                │    │            │
│  │  │ • createRoomBooking()                    │    │            │
│  │  │ • createClientAppointment()              │    │            │
│  │  │ • deleteRoomBooking()                    │    │            │
│  │  │ • deleteClientAppointment()              │    │            │
│  │  │ • subscribeToRoomBookings()              │    │            │
│  │  │ • subscribeToClientAppointments()        │    │            │
│  │  └─────────────────────────────────────────┘    │            │
│  └───────────────────┬──────────────────────────────┘            │
│                      │                                           │
└──────────────────────┼───────────────────────────────────────────┘
                       │
                       │ Supabase Client
                       │ (Real-time + Auth)
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE DATABASE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────┐  ┌──────────────────────────┐ │
│  │  room_bookings               │  │  client_appointments     │ │
│  ├──────────────────────────────┤  ├──────────────────────────┤ │
│  │ id (UUID)                    │  │ id (UUID)                │ │
│  │ room_id (int)                │  │ date (date)              │ │
│  │ room (text)                  │  │ time (text)              │ │
│  │ date (date)                  │  │ client_name (text)       │ │
│  │ time (text)                  │  │ client_email (text)      │ │
│  │ capacity (int)               │  │ purpose (text)           │ │
│  │ floor (text)                 │  │ status (text)            │ │
│  │ title (text)                 │  │ created_at (timestamp)   │ │
│  │ booked_by (UUID → auth)      │  │ updated_at (timestamp)   │ │
│  │ booked_by_name (text)        │  └──────────────────────────┘ │
│  │ booked_at (timestamp)        │                               │
│  │ attendees (text[])           │                               │
│  │ created_at (timestamp)       │                               │
│  │ updated_at (timestamp)       │                               │
│  └──────────────────────────────┘                               │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  ROW LEVEL SECURITY (RLS) POLICIES                        │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │  room_bookings:                                           │  │
│  │  ✓ All authenticated users can SELECT                     │  │
│  │  ✓ Users can INSERT their own bookings                    │  │
│  │  ✓ Users can UPDATE/DELETE their own                      │  │
│  │  ✓ Admins can UPDATE/DELETE any                           │  │
│  │                                                            │  │
│  │  client_appointments:                                     │  │
│  │  ✓ Anyone can INSERT (public contact form)               │  │
│  │  ✓ Authenticated users can SELECT                         │  │
│  │  ✓ Admins can UPDATE/DELETE                               │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  REAL-TIME SUBSCRIPTIONS                                  │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │  Channel: room_bookings_changes                           │  │
│  │  Listens to: INSERT, UPDATE, DELETE on room_bookings      │  │
│  │  Triggers: loadBookings() in all connected clients        │  │
│  │                                                            │  │
│  │  Channel: client_appointments_changes                     │  │
│  │  Listens to: INSERT, UPDATE, DELETE on client_appts       │  │
│  │  Triggers: loadBookings() in all connected clients        │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 📊 Data Flow Examples

### Example 1: Client Books Appointment

```
1. Client visits Contact page
   ↓
2. Selects date & time slot
   ↓
3. Fills form (name, email, purpose)
   ↓
4. Clicks "Book Appointment"
   ↓
5. AppointmentBookingCalendar calls:
   calendarService.createClientAppointment()
   ↓
6. Service inserts into Supabase:
   INSERT INTO client_appointments (...)
   ↓
7. Supabase saves to database
   ↓
8. Real-time subscription fires
   ↓
9. ALL connected browsers receive update
   ↓
10. RoomBookingDashboard in Admin view
    automatically refreshes and shows new appointment
```

### Example 2: Admin Books Room

```
1. Admin clicks "Projects" tab
   ↓
2. Sees RoomBookingDashboard
   ↓
3. Clicks time slot on calendar
   ↓
4. Fills meeting details
   ↓
5. Clicks "Book"
   ↓
6. RoomBookingDashboard calls:
   calendarService.createRoomBooking()
   ↓
7. Service inserts into Supabase:
   INSERT INTO room_bookings (...)
   ↓
8. Supabase saves to database
   ↓
9. Real-time subscription fires
   ↓
10. ALL admin/team dashboards
    automatically update with new booking
```

### Example 3: Real-time Sync

```
Browser Tab 1                  Supabase                Browser Tab 2
     │                             │                         │
     │  1. User books room         │                         │
     ├────────────────────────────►│                         │
     │                             │                         │
     │  2. Database INSERT         │                         │
     │                             │                         │
     │                             │  3. Broadcast change    │
     │◄────────────────────────────┼────────────────────────►│
     │                             │                         │
     │  4. loadBookings()          │  4. loadBookings()      │
     │     fetches new data        │     fetches new data    │
     │                             │                         │
     │  5. UI updates instantly    │  5. UI updates instantly│
     │                             │                         │
```

## 🔑 Key Components

### Frontend Components

```
AppointmentBookingCalendar.tsx
├── Renders public contact calendar
├── Handles client appointment bookings
└── Calls calendarService.createClientAppointment()

RoomBookingDashboard.tsx
├── Renders admin/team calendar
├── Handles room bookings
├── Displays merged view (rooms + client appointments)
├── Calls calendarService.createRoomBooking()
└── Subscribes to real-time updates
```

### Service Layer

```
calendarService.ts
├── Abstracts all Supabase operations
├── Provides typed interfaces
├── Handles data transformation
├── Manages real-time subscriptions
└── Error handling
```

### Database Tables

```
room_bookings
├── Stores internal team room reservations
├── Links to auth.users via booked_by
└── RLS: Auth users can view, users can manage own, admins manage all

client_appointments
├── Stores client-facing appointment bookings
├── No auth linkage (public can create)
└── RLS: Anyone can insert, auth users can view, admins manage
```

## 🌟 Benefits of This Architecture

### 1. Separation of Concerns

- **Components**: Handle UI and user interaction
- **Service Layer**: Manages all data operations
- **Database**: Stores and secures data

### 2. Real-time Collaboration

- Multiple admins can work simultaneously
- Changes appear instantly across all devices
- No polling or manual refresh needed

### 3. Security

- Row Level Security enforces permissions
- Admins can manage all bookings
- Users can only modify their own
- Public can only create client appointments

### 4. Scalability

- Handles thousands of concurrent users
- Database indexes optimize queries
- Real-time subscriptions use WebSockets
- Automatic backups and replication

### 5. Maintainability

- Single source of truth (calendarService)
- TypeScript ensures type safety
- Clear data flow
- Easy to test and debug

## 📈 Performance Characteristics

**Initial Load:**

```
Component Mount
    ↓
loadBookings() called
    ↓
Parallel fetch:
  - getRoomBookings()
  - getClientAppointments()
    ↓
Data merged and displayed
Time: ~200-500ms
```

**Real-time Updates:**

```
Database Change
    ↓
Supabase broadcasts via WebSocket
    ↓
Component receives event
    ↓
loadBookings() fetches fresh data
    ↓
UI re-renders
Time: ~50-150ms
```

## 🔒 Security Flow

```
User Action
    ↓
Frontend validates input
    ↓
calendarService sends request
    ↓
Supabase checks authentication
    ↓
RLS policies evaluate:
  - Is user authenticated?
  - Does user own this record?
  - Is user an admin?
    ↓
Action allowed/denied
    ↓
Response returned to frontend
```

## 🎯 Migration Path

```
OLD (localStorage)           NEW (Supabase)
─────────────────────────────────────────────────────
Local storage only     →     Cloud database
No multi-device sync   →     Sync across all devices
Manual polling         →     Real-time WebSocket updates
No security            →     Row Level Security
Browser-only           →     Accessible from anywhere
Limited capacity       →     Unlimited scalability
No backups             →     Automatic backups
No audit trail         →     created_at/updated_at timestamps
```

---

This architecture provides a production-ready calendar system with real-time collaboration, security, and scalability! 🚀
