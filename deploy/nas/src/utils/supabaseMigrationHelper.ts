/**
 * Run this migration helper to update your components to use Supabase
 * This is a reference for the changes needed - apply them manually or use as a guide
 */

// ===========================================
// 1. RoomBookingDashboard.tsx Updates
// ===========================================

export const roomBookingDashboardUpdates = {
  // Add to imports (line ~1-70)
  imports: `
import { calendarService, type Booking } from '@/services/calendarService'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
`,

  // Add after state declarations (line ~250)
  hookSetup: `
const { toast } = useToast()

// Load bookings from Supabase
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
`,

  // Replace the localStorage useEffect
  loadBookingsEffect: `
// Load bookings from Supabase on mount
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
`,

  // Update handleBooking function
  handleBookingAsync: `
const handleBooking = async () => {
  if (!selectedRoomId || !selectedTime || !meetingTitle.trim()) {
    toast({
      title: 'Error',
      description: 'Please fill in all required fields',
      variant: 'destructive',
    })
    return
  }

  const selectedRoom = ROOMS.find((r) => r.id === selectedRoomId)
  if (!selectedRoom) return

  try {
    await calendarService.createRoomBooking({
      room: selectedRoom.name,
      roomId: selectedRoomId,
      date: formatDate(selectedDate),
      time: selectedTime,
      dateObj: selectedDate,
      capacity: selectedRoom.capacity,
      floor: selectedRoom.floor,
      title: meetingTitle,
      bookedBy: userId,
      bookedByName: 'Current User', // Get from auth context
      attendees: attendees.split(',').map((a) => a.trim()).filter(Boolean),
    })

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
`,

  // Update handleDeleteBooking
  handleDeleteAsync: `
const handleDeleteBooking = async (bookingId: string) => {
  const booking = allBookings.find((b) => b.id === bookingId)
  if (!booking) return

  try {
    if (booking.isClientAppointment) {
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
`,
}

// ===========================================
// 2. AppointmentBookingCalendar.tsx Updates
// ===========================================

export const appointmentBookingCalendarUpdates = {
  // Add to imports
  imports: `
import { calendarService } from '@/services/calendarService'
`,

  // Add helper function
  loadAppointmentsFunction: `
const loadAppointments = async () => {
  try {
    const bookings = await calendarService.getClientAppointments()
    const appointments = bookings.map(b => ({
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
`,

  // Replace useEffect
  loadEffect: `
useEffect(() => {
  loadAppointments()
}, [])
`,

  // Update handleSubmit
  handleSubmitAsync: `
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!selectedSlot || !formData.name || !formData.email || !formData.purpose) {
    return
  }

  try {
    const dateStr = \`\${selectedDate.getFullYear()}-\${String(selectedDate.getMonth() + 1).padStart(2, '0')}-\${String(selectedDate.getDate()).padStart(2, '0')}\`

    await calendarService.createClientAppointment({
      date: dateStr,
      time: selectedSlot,
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
    // Optionally show error to user
  }
}
`,
}

// ===========================================
// 3. Data Migration Script
// ===========================================

export const migrationScript = `
// Run this in browser console on your app to migrate existing localStorage data
import { calendarService } from '@/services/calendarService'

async function migrateLocalStorageToSupabase() {
  console.log('Starting migration...')

  try {
    // Migrate room bookings
    const stored = localStorage.getItem('mock_bookings')
    if (stored) {
      const bookings = JSON.parse(stored)
      console.log(\`Found \${bookings.length} room bookings to migrate\`)

      for (const booking of bookings) {
        try {
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
            attendees: booking.attendees || [],
          })
          console.log(\`✓ Migrated booking: \${booking.title}\`)
        } catch (err) {
          console.error(\`✗ Failed to migrate booking \${booking.id}:\`, err)
        }
      }
    }

    // Migrate client appointments
    const clientStored = localStorage.getItem('client_appointments')
    if (clientStored) {
      const appointments = JSON.parse(clientStored)
      console.log(\`Found \${appointments.length} client appointments to migrate\`)

      for (const apt of appointments) {
        try {
          const [month, day, year] = apt.date.split('/')
          const dateStr = \`\${year}-\${month.padStart(2, '0')}-\${day.padStart(2, '0')}\`

          await calendarService.createClientAppointment({
            date: dateStr,
            time: apt.time,
            clientName: apt.clientName,
            clientEmail: apt.clientEmail,
            purpose: apt.purpose,
          })
          console.log(\`✓ Migrated appointment: \${apt.purpose}\`)
        } catch (err) {
          console.error(\`✗ Failed to migrate appointment \${apt.id}:\`, err)
        }
      }
    }

    console.log('✅ Migration complete!')
    console.log('You can now safely clear localStorage if you want:')
    console.log('  localStorage.removeItem("mock_bookings")')
    console.log('  localStorage.removeItem("client_appointments")')
  } catch (error) {
    console.error('❌ Migration failed:', error)
  }
}

// Uncomment to run:
// migrateLocalStorageToSupabase()
`

console.log('Migration helper loaded. See SUPABASE_CALENDAR_MIGRATION.md for full guide.')
