# Supabase Calendar Integration Guide

## Overview

This guide will help you migrate your calendar system from localStorage to Supabase for persistent, real-time tracking of room bookings and client appointments.

## What You Need to Do

### Step 1: Apply the Database Migration

Run this SQL in your Supabase SQL Editor:

```bash
# If using Supabase CLI locally
supabase migration up

# OR copy the contents of:
# supabase/migrations/20251030_create_calendar_tables.sql
# and run it in your Supabase Dashboard > SQL Editor
```

This creates two tables:

- `room_bookings` - For internal team room reservations
- `client_appointments` - For client-facing appointment bookings

### Step 2: Update RoomBookingDashboard Component

Replace the localStorage logic in `src/components/RoomBookingDashboard.tsx`:

#### A. Add imports at the top:

```typescript
import { calendarService, type Booking } from '@/services/calendarService'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
```

#### B. Replace the useEffect that loads from localStorage (around line 258):

**OLD CODE (Remove this):**

```typescript
useEffect(() => {
  const stored = localStorage.getItem('mock_bookings')
  const clientAppointmentsStored = localStorage.getItem('client_appointments')
  // ... all the localStorage logic
}, [userId])
```

**NEW CODE (Replace with this):**

```typescript
// Load bookings from Supabase
useEffect(() => {
  loadBookings()
}, [])

// Subscribe to real-time updates
useEffect(() => {
  const roomChannel = calendarService.subscribeToRoomBookings(() => {
    loadBookings()
  })

  const clientChannel = calendarService.subscribeToClientAppointments(() => {
    loadBookings()
  })

  return () => {
    supabase.removeChannel(roomChannel)
    supabase.removeChannel(clientChannel)
  }
}, [])

const loadBookings = async () => {
  try {
    const bookings = await calendarService.getAllBookings()
    setAllBookings(bookings)
  } catch (error) {
    console.error('Error loading bookings:', error)
    toast({
      title: 'Error',
      description: 'Failed to load bookings from database',
      variant: 'destructive',
    })
  }
}
```

#### C. Add the toast hook:

```typescript
const { toast } = useToast()
```

#### D. Update the booking creation function:

**FIND this function (around line 450):**

```typescript
const handleBooking = () => {
  // ... existing validation code

  const newBooking = {
    // ... booking object
  }

  const updatedBookings = [...allBookings, newBooking]
  setAllBookings(updatedBookings)
  localStorage.setItem('mock_bookings', JSON.stringify(updatedBookings))

  // ... rest of code
}
```

**REPLACE the localStorage.setItem part with:**

```typescript
const handleBooking = async () => {
  // ... existing validation code

  try {
    await calendarService.createRoomBooking({
      room: selectedRoom!.name,
      roomId: selectedRoomId!,
      date: formatDate(selectedDate),
      time: selectedTime!,
      dateObj: selectedDate,
      capacity: selectedRoom!.capacity,
      floor: selectedRoom!.floor,
      title: meetingTitle,
      bookedBy: userId,
      bookedByName: 'Current User', // You can get this from auth context
      attendees: attendees.split(',').map((a) => a.trim()),
    })

    // Reload bookings to get the new one
    await loadBookings()

    toast({
      title: 'Success!',
      description: 'Room booked successfully',
    })

    setShowBookingModal(false)
    setIsSuccess(true)
    setMeetingTitle('')
    setAttendees('')
    setTimeout(() => setIsSuccess(false), 3000)
  } catch (error) {
    console.error('Error booking room:', error)
    toast({
      title: 'Error',
      description: 'Failed to create booking',
      variant: 'destructive',
    })
  }
}
```

#### E. Update the delete booking function:

**FIND:**

```typescript
const handleDeleteBooking = (bookingId: string) => {
  const updatedBookings = allBookings.filter((b) => b.id !== bookingId)
  setAllBookings(updatedBookings)
  localStorage.setItem('mock_bookings', JSON.stringify(updatedBookings))
}
```

**REPLACE with:**

```typescript
const handleDeleteBooking = async (bookingId: string) => {
  const booking = allBookings.find((b) => b.id === bookingId)
  if (!booking) return

  try {
    if (booking.isClientAppointment) {
      // Extract the actual client appointment ID
      const clientId = bookingId.replace('client-', '')
      await calendarService.deleteClientAppointment(clientId)
    } else {
      await calendarService.deleteRoomBooking(bookingId)
    }

    await loadBookings()

    toast({
      title: 'Success',
      description: 'Booking deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting booking:', error)
    toast({
      title: 'Error',
      description: 'Failed to delete booking',
      variant: 'destructive',
    })
  }
}
```

#### F. Remove the polling useEffect:

**DELETE this (around line 330):**

```typescript
// Reload bookings when client appointments change
useEffect(() => {
  const reloadBookings = () => {
    // ... polling logic
  }

  // Poll for changes every 5 seconds
  const interval = setInterval(reloadBookings, 5000)

  return () => clearInterval(interval)
}, [])
```

**WHY:** Real-time subscriptions replace polling!

### Step 3: Update AppointmentBookingCalendar Component

In `src/components/AppointmentBookingCalendar.tsx`:

#### A. Add imports:

```typescript
import { calendarService } from '@/services/calendarService'
```

#### B. Update the booking submission function:

**FIND (around line 140):**

```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()

  const newAppointment = {
    id: Date.now().toString(),
    date: `${selectedDate.getMonth() + 1}/${selectedDate.getDate()}/${selectedDate.getFullYear()}`,
    time: selectedSlot!,
    clientName: formData.name,
    clientEmail: formData.email,
    purpose: formData.purpose,
  }

  const existingAppointments = JSON.parse(localStorage.getItem('client_appointments') || '[]')
  const updatedAppointments = [...existingAppointments, newAppointment]
  localStorage.setItem('client_appointments', JSON.stringify(updatedAppointments))

  onBookingSuccess?.()
}
```

**REPLACE with:**

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  try {
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`

    await calendarService.createClientAppointment({
      date: dateStr,
      time: selectedSlot!,
      clientName: formData.name,
      clientEmail: formData.email,
      purpose: formData.purpose,
    })

    onBookingSuccess?.()
    setShowSuccess(true)
    setSelectedSlot(null)
    setFormData({ name: '', email: '', purpose: '' })

    setTimeout(() => setShowSuccess(false), 3000)
  } catch (error) {
    console.error('Error creating appointment:', error)
    // Handle error (you might want to show an error message)
  }
}
```

#### C. Update the appointments loading:

**FIND:**

```typescript
useEffect(() => {
  const storedAppointments = JSON.parse(localStorage.getItem('client_appointments') || '[]')
  setAppointments(storedAppointments)
}, [])
```

**REPLACE with:**

```typescript
useEffect(() => {
  loadAppointments()
}, [])

const loadAppointments = async () => {
  try {
    const bookings = await calendarService.getClientAppointments()
    // Convert to the format expected by the component
    const appointments = bookings.map((b) => ({
      id: b.id.replace('client-', ''),
      date: b.date,
      time: b.time,
      clientName: b.bookedByName,
      clientEmail: b.attendees[0],
      purpose: b.title.replace('Client Appointment: ', ''),
    }))
    setAppointments(appointments)
  } catch (error) {
    console.error('Error loading appointments:', error)
  }
}
```

### Step 4: Benefits You'll Get

✅ **Real-time Updates**: When a client books, admin sees it instantly (no 5-second delay)
✅ **Data Persistence**: Data stored in Supabase database, not browser localStorage
✅ **Multi-device Sync**: Access bookings from any device
✅ **Row Level Security**: Automatic permission management
✅ **Audit Trail**: `created_at` and `updated_at` timestamps
✅ **Backup & Recovery**: Database backups included with Supabase
✅ **Scalability**: Handle thousands of bookings without performance issues

### Step 5: Testing

1. **Test Room Booking:**
   - Go to Admin Dashboard → Projects
   - Book a room
   - Check Supabase Dashboard → Table Editor → room_bookings
   - Should see the new booking

2. **Test Client Appointment:**
   - Go to Contact page
   - Book an appointment
   - Check Supabase Dashboard → Table Editor → client_appointments
   - Should see the new appointment

3. **Test Real-time Sync:**
   - Open two browser tabs
   - Book a room in one tab
   - Watch it appear instantly in the other tab (no refresh needed!)

4. **Test Admin View:**
   - Go to Admin Dashboard → Projects
   - Should see both room bookings AND client appointments merged together

### Step 6: Data Migration (Optional)

If you have existing bookings in localStorage that you want to keep:

```typescript
// Run this once in browser console on the Account page
async function migrateLocalStorageToSupabase() {
  // Migrate room bookings
  const stored = localStorage.getItem('mock_bookings')
  if (stored) {
    const bookings = JSON.parse(stored)
    for (const booking of bookings) {
      await calendarService.createRoomBooking({
        room: booking.room,
        roomId: booking.roomId,
        date: booking.date,
        time: booking.time,
        dateObj: new Date(booking.dateObj),
        capacity: booking.capacity,
        floor: booking.floor,
        title: booking.title,
        bookedBy: booking.bookedBy,
        bookedByName: booking.bookedByName,
        attendees: booking.attendees,
      })
    }
    console.log(`Migrated ${bookings.length} room bookings`)
  }

  // Migrate client appointments
  const clientStored = localStorage.getItem('client_appointments')
  if (clientStored) {
    const appointments = JSON.parse(clientStored)
    for (const apt of appointments) {
      const [month, day, year] = apt.date.split('/')
      const dateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`

      await calendarService.createClientAppointment({
        date: dateStr,
        time: apt.time,
        clientName: apt.clientName,
        clientEmail: apt.clientEmail,
        purpose: apt.purpose,
      })
    }
    console.log(`Migrated ${appointments.length} client appointments`)
  }

  console.log('Migration complete!')
}

// Run it
migrateLocalStorageToSupabase()
```

### Troubleshooting

**"Permission denied" errors:**

- Make sure you're logged in to your app
- Check that RLS policies are applied correctly
- Verify your Supabase auth is working

**Bookings not appearing:**

- Check browser console for errors
- Verify Supabase connection in Network tab
- Check Supabase Table Editor to see if data is being saved

**Real-time not working:**

- Ensure Supabase Realtime is enabled for your tables
- Check that subscriptions are set up correctly
- Verify no firewall blocking WebSocket connections

## Summary

You now have:

- ✅ Database tables created
- ✅ TypeScript types updated
- ✅ Calendar service layer for all operations
- ✅ Real-time subscriptions
- ✅ Row-level security
- ✅ Complete migration path

The calendar system is now production-ready with Supabase! 🎉
