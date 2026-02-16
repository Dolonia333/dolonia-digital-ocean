import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { generateUUID } from '@/lib/uuid'
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Check,
  X,
  Search,
  Filter,
  Wifi,
  Monitor,
  Coffee,
  Video,
  ChevronLeft,
  ChevronRight,
  Star,
  Sun,
  Moon,
  Loader,
  Book,
  XCircle,
  LayoutGrid,
  List,
  BarChart,
  View,
  RefreshCw,
  AlertCircle,
  History,
  Move,
  TrendingUp,
  UsersRound,
  Play,
  Bell,
  Zap,
  ImageOff,
  Pencil,
} from 'lucide-react'

// --- Static Data ---
const ROOMS = [
  {
    id: 1,
    name: 'Conference Room A',
    capacity: 12,
    floor: '2nd Floor',
    amenities: ['Wifi', 'Monitor', 'Video', 'Coffee'],
    image: '🏢',
    rating: 4.8,
    photoUrl: 'https://placehold.co/300x200/a2d2ff/ffffff?text=Room+A',
    layoutDesc: 'Large table, U-shape seating',
  },
  {
    id: 2,
    name: 'Meeting Room B',
    capacity: 6,
    floor: '3rd Floor',
    amenities: ['Wifi', 'Monitor', 'Video'],
    image: '💼',
    rating: 4.6,
    photoUrl: 'https://placehold.co/300x200/bde0fe/ffffff?text=Room+B',
    layoutDesc: 'Round table, casual seating',
  },
  {
    id: 3,
    name: 'Executive Suite',
    capacity: 8,
    floor: '4th Floor',
    amenities: ['Wifi', 'Monitor', 'Video', 'Coffee'],
    image: '👔',
    rating: 4.9,
    photoUrl: 'https://placehold.co/300x200/ffafcc/ffffff?text=Exec+Suite',
    layoutDesc: 'Boardroom table, formal seating',
  },
  {
    id: 4,
    name: 'Collaboration Space',
    capacity: 10,
    floor: '2nd Floor',
    amenities: ['Wifi', 'Monitor'],
    image: '🤝',
    rating: 4.7,
    photoUrl: 'https://placehold.co/300x200/ffc8dd/ffffff?text=Collab+Space',
    layoutDesc: 'Flexible layout, whiteboard walls',
  },
  {
    id: 5,
    name: 'Innovation Lab',
    capacity: 15,
    floor: '1st Floor',
    amenities: ['Wifi', 'Monitor', 'Video', 'Coffee'],
    image: '💡',
    rating: 4.5,
    photoUrl: 'https://placehold.co/300x200/cdb4db/ffffff?text=Lab',
    layoutDesc: 'Open space, project stations',
  },
  {
    id: 6,
    name: 'Focus Room',
    capacity: 4,
    floor: '3rd Floor',
    amenities: ['Wifi', 'Monitor'],
    image: '🎯',
    rating: 4.4,
    photoUrl: 'https://placehold.co/300x200/f8edeb/ffffff?text=Focus+Room',
    layoutDesc: 'Small desk setup, quiet zone',
  },
]

const TIME_SLOTS = [
  '08:00 AM',
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
  '07:00 PM',
]

const TIME_PREFERENCES = [
  { value: 'any', label: 'Any Time' },
  { value: 'morning', label: 'Morning (8AM-12PM)' },
  { value: 'afternoon', label: 'Afternoon (12PM-5PM)' },
  { value: 'evening', label: 'Evening (5PM-8PM)' },
]

const AMENITY_ICONS: Record<string, JSX.Element> = {
  Wifi: <Wifi size={16} />,
  Monitor: <Monitor size={16} />,
  Coffee: <Coffee size={16} />,
  Video: <Video size={16} />,
}

const allAmenities = ['Wifi', 'Monitor', 'Video', 'Coffee']
const capacityOptions = [
  { value: 0, label: 'Any Capacity' },
  { value: 6, label: '6+ People' },
  { value: 10, label: '10+ People' },
  { value: 15, label: '15+ People' },
]

// --- Date Helper Functions ---
const formatDate = (date: Date | null): string => {
  if (!date || !(date instanceof Date)) return ''
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const formatTimestamp = (timestamp: Date | string | null): string => {
  if (!timestamp) return 'N/A'
  if (timestamp instanceof Date) {
    return timestamp.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }
  try {
    const date = new Date(timestamp)
    if (!isNaN(date.getTime())) {
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    }
    return 'Invalid Date'
  } catch {
    return 'Invalid Date'
  }
}

const getWeekDays = (date: Date): Date[] => {
  const startOfWeek = new Date(date)
  startOfWeek.setDate(date.getDate() - date.getDay())

  const week: Date[] = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek)
    day.setDate(startOfWeek.getDate() + i)
    week.push(day)
  }
  return week
}

const shortWeekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Type definitions
interface Room {
  id: number
  name: string
  capacity: number
  floor: string
  amenities: string[]
  image: string
  rating: number
  photoUrl: string
  layoutDesc: string
}

interface Booking {
  id: string
  room: string
  roomId: number
  date: string
  time: string
  dateObj: Date
  capacity: number
  floor: string
  title: string
  bookedBy: string
  bookedByName: string
  bookedAt: Date
  attendees: string[]
  isClientAppointment?: boolean
  bookingType?: 'room' | 'client_appointment' | 'team_meeting' | 'consultation'
  status?: 'confirmed' | 'pending' | 'cancelled'
  source?: 'contact_page' | 'admin_dashboard' | 'team_dashboard'
}

interface ClientAppointment {
  id: string
  date: string
  time: string
  clientName: string
  clientEmail: string
  purpose: string
}

// This is a placeholder component - you'll need to integrate this into your app
const RoomBookingDashboard: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState<'book' | 'mybookings' | 'analytics' | 'tracker'>('book')
  const [calendarView, setCalendarView] = useState<'day' | 'week'>('day')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null)
  const [meetingTitle, setMeetingTitle] = useState('')
  const [attendees, setAttendees] = useState('')
  const [allBookings, setAllBookings] = useState<Booking[]>([])
  const [userId] = useState(() => {
    let id = localStorage.getItem('local_user_id')
    if (!id) {
      id = generateUUID()
      localStorage.setItem('local_user_id', id)
    }
    return id
  })
  const [isSuccess, setIsSuccess] = useState(false)

  // Initialize mock bookings and load client appointments
  useEffect(() => {
    const stored = localStorage.getItem('mock_bookings')
    const clientAppointmentsStored = localStorage.getItem('client_appointments')

    let roomBookings: Booking[] = []

    // Load room bookings
    if (stored) {
      roomBookings = JSON.parse(stored).map((b: Booking) => ({
        ...b,
        dateObj: new Date(b.dateObj),
        bookedAt: new Date(b.bookedAt),
      }))
    } else {
      const today = new Date()
      roomBookings = [
        {
          id: 'm1',
          room: 'Conference Room A',
          roomId: 1,
          date: formatDate(today),
          time: '10:00 AM',
          dateObj: today,
          capacity: 12,
          floor: '2nd Floor',
          title: 'Team Standup',
          bookedBy: userId,
          bookedByName: 'You',
          bookedAt: today,
          attendees: ['Alice', 'Bob'],
          bookingType: 'team_meeting',
          status: 'confirmed',
          source: 'admin_dashboard',
        },
      ]
      localStorage.setItem('mock_bookings', JSON.stringify(roomBookings))
    }

    // Load and convert client appointments to bookings
    if (clientAppointmentsStored) {
      try {
        const clientAppointments: ClientAppointment[] = JSON.parse(clientAppointmentsStored)
        const appointmentBookings: Booking[] = clientAppointments.map((apt) => {
          const [month, day, year] = apt.date.split('/')
          const appointmentDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))

          return {
            id: `client-${apt.id}`,
            room: 'Client Meeting Room', // Virtual room for client appointments
            roomId: 99, // Special ID for client meetings
            date: formatDate(appointmentDate),
            time: apt.time,
            dateObj: appointmentDate,
            capacity: 2,
            floor: 'Client Services',
            title: `Client Appointment: ${apt.purpose}`,
            bookedBy: 'client',
            bookedByName: apt.clientName,
            bookedAt: new Date(),
            attendees: [apt.clientEmail],
            isClientAppointment: true,
            bookingType: 'client_appointment',
            status: 'pending',
            source: 'contact_page',
          }
        })

        // Merge room bookings with client appointment bookings
        roomBookings = [...roomBookings, ...appointmentBookings]
      } catch (error) {
        console.error('Error loading client appointments:', error)
      }
    }

    setAllBookings(roomBookings)
  }, [userId])

  // Reload bookings when client appointments change
  useEffect(() => {
    const reloadBookings = () => {
      const stored = localStorage.getItem('mock_bookings')
      const clientAppointmentsStored = localStorage.getItem('client_appointments')

      let roomBookings: Booking[] = []

      if (stored) {
        roomBookings = JSON.parse(stored).map((b: Booking) => ({
          ...b,
          dateObj: new Date(b.dateObj),
          bookedAt: new Date(b.bookedAt),
        }))
      }

      if (clientAppointmentsStored) {
        try {
          const clientAppointments: ClientAppointment[] = JSON.parse(clientAppointmentsStored)
          const appointmentBookings: Booking[] = clientAppointments.map((apt) => {
            const [month, day, year] = apt.date.split('/')
            const appointmentDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))

            return {
              id: `client-${apt.id}`,
              room: 'Client Meeting Room',
              roomId: 99,
              date: formatDate(appointmentDate),
              time: apt.time,
              dateObj: appointmentDate,
              capacity: 2,
              floor: 'Client Services',
              title: `Client Appointment: ${apt.purpose}`,
              bookedBy: 'client',
              bookedByName: apt.clientName,
              bookedAt: new Date(),
              attendees: [apt.clientEmail],
              isClientAppointment: true,
            }
          })

          roomBookings = [...roomBookings, ...appointmentBookings]
        } catch (error) {
          console.error('Error loading client appointments:', error)
        }
      }

      setAllBookings(roomBookings)
    }

    // Poll for changes every 5 seconds
    const interval = setInterval(reloadBookings, 5000)

    return () => clearInterval(interval)
  }, [])

  // Cleanup body overflow on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const bookingsMap = useMemo(() => {
    const map: Record<string, Record<number, Record<string, Booking>>> = {}
    allBookings.forEach((b) => {
      if (!map[b.date]) map[b.date] = {}
      if (!map[b.date][b.roomId]) map[b.date][b.roomId] = {}
      map[b.date][b.roomId][b.time] = b
    })
    return map
  }, [allBookings])

  const myBookings = useMemo(
    () => allBookings.filter((b) => b.bookedBy === userId),
    [allBookings, userId],
  )

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    // Add all days in month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    return days
  }

  const getBookingCountForDate = (date: Date) => {
    const dateStr = formatDate(date)
    return allBookings.filter((b) => b.date === dateStr).length
  }

  const isDayFullyBooked = (date: Date) => {
    const dateStr = formatDate(date)
    const totalSlotsAvailable = ROOMS.length * TIME_SLOTS.length // 6 rooms × 12 slots = 72 total slots
    const bookedSlots = allBookings.filter((b) => b.date === dateStr).length
    return bookedSlots >= totalSlotsAvailable * 0.9 // 90% or more booked = grayed out
  }

  const analytics = useMemo(() => {
    const totalBookings = allBookings.length
    const myBookingsCount = myBookings.length
    const upcomingBookings = allBookings.filter((b) => new Date(b.dateObj) >= new Date()).length

    // Admin tracking: Separate counts by booking type
    const clientAppointments = allBookings.filter(
      (b) => b.isClientAppointment || b.bookingType === 'client_appointment',
    )
    const roomBookings = allBookings.filter(
      (b) => !b.isClientAppointment && b.bookingType !== 'client_appointment',
    )
    const teamMeetings = allBookings.filter((b) => b.bookingType === 'team_meeting')

    // Count by source
    const contactPageBookings = allBookings.filter((b) => b.source === 'contact_page').length
    const adminDashboardBookings = allBookings.filter((b) => b.source === 'admin_dashboard').length
    const teamDashboardBookings = allBookings.filter((b) => b.source === 'team_dashboard').length

    // Count by status
    const confirmedBookings = allBookings.filter((b) => b.status === 'confirmed').length
    const pendingBookings = allBookings.filter((b) => b.status === 'pending').length
    const cancelledBookings = allBookings.filter((b) => b.status === 'cancelled').length

    // Most popular room
    const roomCounts: Record<number, number> = {}
    allBookings.forEach((b) => {
      roomCounts[b.roomId] = (roomCounts[b.roomId] || 0) + 1
    })
    const mostPopularRoomId = Object.entries(roomCounts).sort(([, a], [, b]) => b - a)[0]?.[0]
    const mostPopularRoom = ROOMS.find((r) => r.id === Number(mostPopularRoomId))

    // Peak time
    const timeCounts: Record<string, number> = {}
    allBookings.forEach((b) => {
      timeCounts[b.time] = (timeCounts[b.time] || 0) + 1
    })
    const peakTime = Object.entries(timeCounts).sort(([, a], [, b]) => b - a)[0]?.[0]

    // Utilization rate
    const today = new Date()
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    const daysInMonth = endOfMonth.getDate()
    const totalPossibleSlots = ROOMS.length * TIME_SLOTS.length * daysInMonth
    const bookedThisMonth = allBookings.filter((b) => {
      const bookingDate = new Date(b.dateObj)
      return bookingDate >= startOfMonth && bookingDate <= endOfMonth
    }).length
    const utilizationRate = Math.round((bookedThisMonth / totalPossibleSlots) * 100)

    return {
      totalBookings,
      myBookingsCount,
      upcomingBookings,
      mostPopularRoom,
      peakTime,
      utilizationRate,
      bookedThisMonth,
      // Admin-specific tracking
      clientAppointmentsCount: clientAppointments.length,
      roomBookingsCount: roomBookings.length,
      teamMeetingsCount: teamMeetings.length,
      contactPageBookings,
      adminDashboardBookings,
      teamDashboardBookings,
      confirmedBookings,
      pendingBookings,
      cancelledBookings,
    }
  }, [allBookings, myBookings])

  const changeMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1))
      return newDate
    })
  }

  const handleOpenBookingModal = (time: string, roomId: number) => {
    setSelectedTime(time)
    setSelectedRoomId(roomId)
    setShowBookingModal(true)
    setMeetingTitle('')
    setAttendees('')
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
  }

  const handleCloseBookingModal = () => {
    setShowBookingModal(false)
    // Re-enable body scroll when modal closes
    document.body.style.overflow = 'unset'
  }

  const handleConfirmBooking = () => {
    if (!selectedRoomId || !selectedTime) return

    const room = ROOMS.find((r) => r.id === selectedRoomId)
    if (!room) return

    const newBooking: Booking = {
      id: generateUUID(),
      room: room.name,
      roomId: selectedRoomId,
      date: formatDate(selectedDate),
      time: selectedTime,
      dateObj: selectedDate,
      capacity: room.capacity,
      floor: room.floor,
      title: meetingTitle || 'Meeting',
      bookedBy: userId,
      bookedByName: 'You',
      bookedAt: new Date(),
      attendees: attendees
        .split(',')
        .map((a) => a.trim())
        .filter((a) => a),
      bookingType: 'room',
      status: 'confirmed',
      source: 'admin_dashboard',
    }

    const updated = [...allBookings, newBooking]
    setAllBookings(updated)
    localStorage.setItem('mock_bookings', JSON.stringify(updated))

    handleCloseBookingModal()
    setIsSuccess(true)
    setTimeout(() => setIsSuccess(false), 2000)
  }

  const cancelBooking = (booking: Booking) => {
    const updated = allBookings.filter((b) => b.id !== booking.id)
    setAllBookings(updated)
    localStorage.setItem('mock_bookings', JSON.stringify(updated))
    setIsSuccess(true)
    setTimeout(() => setIsSuccess(false), 2000)
  }

  return (
    <div
      className={`admin-calendar min-h-screen p-3 sm:p-4 transition-colors duration-300 font-sans overflow-x-hidden ${
        darkMode
          ? 'bg-gradient-to-br from-[#222222] to-[#2a2a2a]'
          : 'bg-gradient-to-br from-[#d5cdcb] to-[#e0dcdb]'
      }`}
    >
      <div className="calendar-container max-w-7xl mx-auto overflow-x-hidden w-full min-w-0">
        {/* Header */}
        <div className="calendar-header mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1
              className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r ${
                darkMode ? 'from-white to-[#06fff2]' : 'from-[#222222] to-black'
              } bg-clip-text text-transparent mb-2`}
            >
              Admin Calendar Manager
            </h1>
            <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Track all website bookings and appointments in one place
            </p>
          </div>
          <div className="calendar-controls flex gap-2 items-center flex-wrap">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-xl transition-all ${
                darkMode
                  ? 'bg-[#79698c]/50 text-[#06fff2] hover:bg-[#79698c]/80'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              } shadow-lg`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setView('book')}
              className={`px-6 py-2.5 rounded-full font-bold ${
                view === 'book'
                  ? 'bg-gradient-to-r from-[#06fff2] to-[#05ded5] text-black shadow-lg'
                  : darkMode
                    ? 'bg-[#79698c]/50 text-gray-300'
                    : 'bg-white text-gray-600'
              }`}
            >
              Book Room
            </button>
            <button
              onClick={() => setView('mybookings')}
              className={`px-6 py-2.5 rounded-full font-bold relative ${
                view === 'mybookings'
                  ? 'bg-gradient-to-r from-[#06fff2] to-[#05ded5] text-black shadow-lg'
                  : darkMode
                    ? 'bg-[#79698c]/50 text-gray-300'
                    : 'bg-white text-gray-600'
              }`}
            >
              My Bookings
              {myBookings.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {myBookings.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setView('analytics')}
              className={`px-6 py-2.5 rounded-full font-bold ${
                view === 'analytics'
                  ? 'bg-gradient-to-r from-[#06fff2] to-[#05ded5] text-black shadow-lg'
                  : darkMode
                    ? 'bg-[#79698c]/50 text-gray-300'
                    : 'bg-white text-gray-600'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setView('tracker')}
              className={`px-6 py-2.5 rounded-full font-bold ${
                view === 'tracker'
                  ? 'bg-gradient-to-r from-[#06fff2] to-[#05ded5] text-black shadow-lg'
                  : darkMode
                    ? 'bg-[#79698c]/50 text-gray-300'
                    : 'bg-white text-gray-600'
              }`}
            >
              Tracker
            </button>
          </div>
        </div>

        {/* Content */}
        {view === 'book' && (
          <>
            {/* Month Calendar Picker */}
            <div
              className={`calendar-card rounded-3xl shadow-xl p-4 sm:p-6 mb-6 overflow-x-hidden max-w-full ${darkMode ? 'bg-[#2d2d2d]/90 border border-[#79698c]' : 'bg-[#f8f6f5]/80 border border-white/20'}`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-[#222222]'}`}
                >
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => changeMonth('prev')}
                    className={`p-2 rounded-lg ${darkMode ? 'bg-[#79698c]/50 text-white hover:bg-[#79698c]/80' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => changeMonth('next')}
                    className={`p-2 rounded-lg ${darkMode ? 'bg-[#79698c]/50 text-white hover:bg-[#79698c]/80' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div
                    key={day}
                    className={`text-center text-sm font-semibold py-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    {day}
                  </div>
                ))}
                {getDaysInMonth(currentMonth).map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="aspect-square"></div>
                  }
                  const isSelected = date.toDateString() === selectedDate.toDateString()
                  const isToday = date.toDateString() === new Date().toDateString()
                  const bookingCount = getBookingCountForDate(date)
                  const isFullyBooked = isDayFullyBooked(date)

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      disabled={isFullyBooked}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all ${
                        isFullyBooked
                          ? darkMode
                            ? 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-50'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                          : isSelected
                            ? 'bg-gradient-to-br from-[#06fff2] to-[#05ded5] text-black font-bold shadow-lg scale-105'
                            : isToday
                              ? darkMode
                                ? 'bg-[#79698c]/50 text-white border-2 border-[#06fff2]'
                                : 'bg-[#ffb8b8]/50 text-[#222222] border-2 border-[#06fff2]'
                              : darkMode
                                ? 'bg-[#222222] text-gray-300 hover:bg-[#79698c]/30'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-sm">{date.getDate()}</span>
                      {bookingCount > 0 && (
                        <span
                          className={`text-xs mt-1 px-1.5 py-0.5 rounded-full ${
                            isFullyBooked
                              ? 'bg-gray-600/30 text-gray-500'
                              : isSelected
                                ? 'bg-black/20'
                                : 'bg-[#06fff2]/30'
                          }`}
                        >
                          {bookingCount}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Day/Week View Toggle and Timeline */}
            <div
              className={`calendar-card rounded-3xl shadow-xl p-4 sm:p-6 overflow-x-hidden max-w-full ${darkMode ? 'bg-[#2d2d2d]/90 border border-[#79698c]' : 'bg-[#f8f6f5]/80 border border-white/20'}`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-[#222222]'}`}
                >
                  {calendarView === 'day'
                    ? selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })
                    : `Week of ${selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCalendarView('day')}
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      calendarView === 'day'
                        ? 'bg-gradient-to-r from-[#06fff2] to-[#05ded5] text-black'
                        : darkMode
                          ? 'bg-[#79698c]/50 text-gray-300'
                          : 'bg-white text-gray-600'
                    }`}
                  >
                    Day
                  </button>
                  <button
                    onClick={() => setCalendarView('week')}
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      calendarView === 'week'
                        ? 'bg-gradient-to-r from-[#06fff2] to-[#05ded5] text-black'
                        : darkMode
                          ? 'bg-[#79698c]/50 text-gray-300'
                          : 'bg-white text-gray-600'
                    }`}
                  >
                    Week
                  </button>
                </div>
              </div>

              {calendarView === 'day' ? (
                // Day View - Timeline Grid
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div
                    className="grid min-w-[600px] sm:min-w-[800px] lg:min-w-[1000px]"
                    style={{
                      gridTemplateColumns: `minmax(120px, 150px) repeat(${TIME_SLOTS.length}, minmax(80px, 1fr))`,
                    }}
                  >
                    <div className="p-3"></div>
                    {TIME_SLOTS.map((time) => (
                      <div
                        key={time}
                        className={`p-3 text-center font-semibold text-sm ${darkMode ? 'text-[#79698c]' : 'text-gray-500'}`}
                      >
                        {time}
                      </div>
                    ))}

                    {ROOMS.map((room) => (
                      <React.Fragment key={room.id}>
                        <div
                          className={`p-3 font-bold ${darkMode ? 'text-white' : 'text-[#222222]'} border-t ${darkMode ? 'border-[#79698c]' : 'border-gray-200'}`}
                        >
                          <span className="mr-2">{room.image}</span> {room.name}
                        </div>
                        {TIME_SLOTS.map((time) => {
                          const booking = bookingsMap[formatDate(selectedDate)]?.[room.id]?.[time]
                          return (
                            <div
                              key={`${room.id}-${time}`}
                              className={`p-1.5 border-t ${darkMode ? 'border-[#79698c]' : 'border-gray-200'}`}
                            >
                              {booking ? (
                                <div
                                  className={`rounded-lg p-2 h-full flex flex-col ${darkMode ? 'bg-[#79698c]/30 border-t-2 border-[#06fff2]/50' : 'bg-[#ffb8b8]/50 border-t-2 border-[#06fff2]'}`}
                                >
                                  <span
                                    className={`font-semibold text-xs ${darkMode ? 'text-white' : 'text-[#222222]'}`}
                                  >
                                    {booking.title}
                                  </span>
                                  <span
                                    className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                                  >
                                    {booking.bookedByName}
                                  </span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleOpenBookingModal(time, room.id)}
                                  className={`w-full h-full rounded-lg text-sm font-semibold bg-[#06fff2]/10 ${darkMode ? 'text-[#06fff2]/80 hover:bg-[#79698c]/40' : 'text-[#222222]/60 hover:bg-[#ffb8b8]/70'}`}
                                >
                                  Book
                                </button>
                              )}
                            </div>
                          )
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ) : (
                // Week View - Grid by Room
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div
                    className="grid min-w-[600px] sm:min-w-[800px] lg:min-w-[1000px]"
                    style={{
                      gridTemplateColumns: `minmax(120px, 150px) repeat(7, minmax(100px, 1fr))`,
                    }}
                  >
                    <div className="p-3"></div>
                    {getWeekDays(selectedDate).map((day, i) => {
                      const isToday = day.toDateString() === new Date().toDateString()
                      return (
                        <div
                          key={i}
                          className={`p-3 text-center ${darkMode ? 'text-white' : 'text-[#222222]'}`}
                        >
                          <div className={`font-semibold ${isToday ? 'text-[#06fff2]' : ''}`}>
                            {day.toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                          <div
                            className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                          >
                            {day.getDate()}
                          </div>
                        </div>
                      )
                    })}

                    {ROOMS.map((room) => (
                      <React.Fragment key={room.id}>
                        <div
                          className={`p-3 font-bold ${darkMode ? 'text-white' : 'text-[#222222]'} border-t ${darkMode ? 'border-[#79698c]' : 'border-gray-200'}`}
                        >
                          <span className="mr-2">{room.image}</span> {room.name}
                        </div>
                        {getWeekDays(selectedDate).map((day, dayIndex) => {
                          const dayBookings = allBookings.filter(
                            (b) => b.date === formatDate(day) && b.roomId === room.id,
                          )
                          return (
                            <div
                              key={`${room.id}-${dayIndex}`}
                              className={`p-2 border-t ${darkMode ? 'border-[#79698c]' : 'border-gray-200'} min-h-[80px]`}
                            >
                              {dayBookings.length > 0 ? (
                                <div className="space-y-1">
                                  {dayBookings.slice(0, 3).map((booking) => (
                                    <div
                                      key={booking.id}
                                      className={`rounded p-1.5 text-xs ${darkMode ? 'bg-[#79698c]/30 border-l-2 border-[#06fff2]' : 'bg-[#ffb8b8]/50 border-l-2 border-[#06fff2]'}`}
                                    >
                                      <div
                                        className={`font-semibold ${darkMode ? 'text-white' : 'text-[#222222]'}`}
                                      >
                                        {booking.time}
                                      </div>
                                      <div
                                        className={`truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                                      >
                                        {booking.title}
                                      </div>
                                    </div>
                                  ))}
                                  {dayBookings.length > 3 && (
                                    <div
                                      className={`text-xs text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                                    >
                                      +{dayBookings.length - 3} more
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div
                                  className={`h-full flex items-center justify-center text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}
                                >
                                  Available
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {view === 'mybookings' && (
          <div
            className={`rounded-3xl shadow-xl p-6 sm:p-8 ${darkMode ? 'bg-[#2d2d2d]/90 border border-[#79698c]' : 'bg-[#f8f6f5]/80 border border-white/20'}`}
          >
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-[#222222]'}`}>
              My Bookings
            </h2>
            {myBookings.length === 0 ? (
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>No bookings yet</p>
            ) : (
              <div className="space-y-3">
                {myBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 ${darkMode ? 'bg-[#79698c]/30 border-[#06fff2]' : 'bg-[#ffb8b8]/30 border-[#06fff2]'}`}
                  >
                    <div>
                      <div className={`font-bold ${darkMode ? 'text-white' : 'text-[#222222]'}`}>
                        {booking.title}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {booking.room}
                      </div>
                      <div
                        className={`text-sm flex gap-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                      >
                        <span className="flex items-center gap-1">
                          <Calendar size={14} /> {booking.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} /> {booking.time}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => cancelBooking(booking)}
                      className={`p-2 rounded-full ${darkMode ? 'bg-red-900/50 text-red-400 hover:bg-red-900' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'analytics' && (
          <div
            className={`calendar-card rounded-3xl shadow-xl p-4 sm:p-6 overflow-x-hidden max-w-full ${darkMode ? 'bg-[#2d2d2d]/90 border border-[#79698c]' : 'bg-[#f8f6f5]/80 border border-white/20'}`}
          >
            <h2
              className={`text-xl sm:text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-[#222222]'}`}
            >
              Analytics Dashboard
            </h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div
                className={`p-5 rounded-2xl ${darkMode ? 'bg-[#222222] border border-[#79698c]' : 'bg-white border border-gray-200'}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="text-[#06fff2]" size={24} />
                  <h3 className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Total Bookings
                  </h3>
                </div>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-[#222222]'}`}>
                  {analytics.totalBookings}
                </p>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  All time
                </p>
              </div>

              <div
                className={`p-5 rounded-2xl ${darkMode ? 'bg-[#222222] border border-[#79698c]' : 'bg-white border border-gray-200'}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <UsersRound className="text-[#06fff2]" size={24} />
                  <h3 className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Client Appointments
                  </h3>
                </div>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-[#222222]'}`}>
                  {analytics.clientAppointmentsCount}
                </p>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  From contact page
                </p>
              </div>

              <div
                className={`p-5 rounded-2xl ${darkMode ? 'bg-[#222222] border border-[#79698c]' : 'bg-white border border-gray-200'}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="text-[#06fff2]" size={24} />
                  <h3 className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Upcoming
                  </h3>
                </div>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-[#222222]'}`}>
                  {analytics.upcomingBookings}
                </p>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Future meetings
                </p>
              </div>

              <div
                className={`p-5 rounded-2xl ${darkMode ? 'bg-[#222222] border border-[#79698c]' : 'bg-white border border-gray-200'}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <BarChart className="text-[#06fff2]" size={24} />
                  <h3 className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Utilization
                  </h3>
                </div>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-[#222222]'}`}>
                  {analytics.utilizationRate}%
                </p>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  This month
                </p>
              </div>
            </div>

            {/* Admin Tracking Stats - NEW */}
            <div className="mb-8">
              <h3
                className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-[#222222]'}`}
              >
                📊 Admin Tracking Overview
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Booking Sources */}
                <div
                  className={`p-5 rounded-2xl ${darkMode ? 'bg-[#222222] border border-[#79698c]' : 'bg-white border border-gray-200'}`}
                >
                  <h4
                    className={`font-semibold mb-3 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    <MapPin size={18} className="text-[#06fff2]" />
                    Booking Sources
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Contact Page
                      </span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-[#222222]'}`}>
                        {analytics.contactPageBookings}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Admin Dashboard
                      </span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-[#222222]'}`}>
                        {analytics.adminDashboardBookings}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Team Dashboard
                      </span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-[#222222]'}`}>
                        {analytics.teamDashboardBookings}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Booking Types */}
                <div
                  className={`p-5 rounded-2xl ${darkMode ? 'bg-[#222222] border border-[#79698c]' : 'bg-white border border-gray-200'}`}
                >
                  <h4
                    className={`font-semibold mb-3 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    <Book size={18} className="text-[#06fff2]" />
                    Booking Types
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Room Bookings
                      </span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-[#222222]'}`}>
                        {analytics.roomBookingsCount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Client Appointments
                      </span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-[#222222]'}`}>
                        {analytics.clientAppointmentsCount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Team Meetings
                      </span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-[#222222]'}`}>
                        {analytics.teamMeetingsCount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Booking Status */}
                <div
                  className={`p-5 rounded-2xl ${darkMode ? 'bg-[#222222] border border-[#79698c]' : 'bg-white border border-gray-200'}`}
                >
                  <h4
                    className={`font-semibold mb-3 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    <AlertCircle size={18} className="text-[#06fff2]" />
                    Booking Status
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Confirmed
                      </span>
                      <span className={`font-bold text-green-500`}>
                        {analytics.confirmedBookings}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Pending
                      </span>
                      <span className={`font-bold text-yellow-500`}>
                        {analytics.pendingBookings}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Cancelled
                      </span>
                      <span className={`font-bold text-red-500`}>
                        {analytics.cancelledBookings}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div
                className={`p-6 rounded-2xl ${darkMode ? 'bg-[#222222] border border-[#79698c]' : 'bg-white border border-gray-200'}`}
              >
                <h3
                  className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-[#222222]'}`}
                >
                  <Star className="text-[#06fff2]" size={20} />
                  Most Popular Room
                </h3>
                {analytics.mostPopularRoom ? (
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{analytics.mostPopularRoom.image}</span>
                      <div>
                        <p className={`font-bold ${darkMode ? 'text-white' : 'text-[#222222]'}`}>
                          {analytics.mostPopularRoom.name}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {analytics.mostPopularRoom.floor}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-[#79698c]/30 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
                      >
                        Capacity: {analytics.mostPopularRoom.capacity}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-[#79698c]/30 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
                      >
                        Rating: {analytics.mostPopularRoom.rating}★
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>No data yet</p>
                )}
              </div>

              <div
                className={`p-6 rounded-2xl ${darkMode ? 'bg-[#222222] border border-[#79698c]' : 'bg-white border border-gray-200'}`}
              >
                <h3
                  className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-[#222222]'}`}
                >
                  <Clock className="text-[#06fff2]" size={20} />
                  Peak Booking Time
                </h3>
                {analytics.peakTime ? (
                  <div>
                    <p
                      className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-[#222222]'}`}
                    >
                      {analytics.peakTime}
                    </p>
                    <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Most bookings happen at this time
                    </p>
                  </div>
                ) : (
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>No data yet</p>
                )}
              </div>
            </div>

            {/* Room Breakdown */}
            <div
              className={`p-6 rounded-2xl ${darkMode ? 'bg-[#222222] border border-[#79698c]' : 'bg-white border border-gray-200'}`}
            >
              <h3
                className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-[#222222]'}`}
              >
                Room Booking Breakdown
              </h3>
              <div className="space-y-3">
                {ROOMS.map((room) => {
                  const roomBookings = allBookings.filter((b) => b.roomId === room.id).length
                  const percentage =
                    analytics.totalBookings > 0
                      ? Math.round((roomBookings / analytics.totalBookings) * 100)
                      : 0
                  return (
                    <div key={room.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          {room.image} {room.name}
                        </span>
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {roomBookings} bookings ({percentage}%)
                        </span>
                      </div>
                      <div
                        className={`w-full h-2 rounded-full ${darkMode ? 'bg-[#79698c]/30' : 'bg-gray-200'}`}
                      >
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#06fff2] to-[#05ded5]"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {view === 'tracker' && (
          <div
            className={`calendar-card rounded-3xl shadow-xl p-4 sm:p-6 overflow-x-hidden max-w-full ${darkMode ? 'bg-[#2d2d2d]/90 border border-[#79698c]' : 'bg-[#f8f6f5]/80 border border-white/20'}`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-[#222222]'}`}
              >
                Booking Tracker
              </h2>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total: {allBookings.length} bookings
              </div>
            </div>

            {allBookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar
                  className={`mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}
                  size={48}
                />
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  No bookings to track yet
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr
                      className={`border-b-2 ${darkMode ? 'border-[#79698c]' : 'border-gray-200'}`}
                    >
                      <th
                        className={`text-left p-3 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        Room
                      </th>
                      <th
                        className={`text-left p-3 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        Meeting Title
                      </th>
                      <th
                        className={`text-left p-3 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        Booked By
                      </th>
                      <th
                        className={`text-left p-3 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        Date
                      </th>
                      <th
                        className={`text-left p-3 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        Time Slot
                      </th>
                      <th
                        className={`text-left p-3 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        Duration
                      </th>
                      <th
                        className={`text-left p-3 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        Booked At
                      </th>
                      <th
                        className={`text-left p-3 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        Attendees
                      </th>
                      <th
                        className={`text-left p-3 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        Type
                      </th>
                      <th
                        className={`text-left p-3 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        Source
                      </th>
                      <th
                        className={`text-left p-3 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...allBookings]
                      .sort(
                        (a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime(),
                      )
                      .map((booking, index) => {
                        const isPast = new Date(booking.dateObj) < new Date()
                        const isToday =
                          new Date(booking.dateObj).toDateString() === new Date().toDateString()
                        const isFuture = new Date(booking.dateObj) > new Date()

                        return (
                          <tr
                            key={booking.id}
                            className={`border-b ${darkMode ? 'border-[#79698c]/30' : 'border-gray-100'} ${
                              index % 2 === 0
                                ? darkMode
                                  ? 'bg-[#222222]/50'
                                  : 'bg-gray-50/50'
                                : ''
                            } hover:${darkMode ? 'bg-[#79698c]/20' : 'bg-[#06fff2]/5'} transition-colors`}
                          >
                            <td className={`p-3 ${darkMode ? 'text-white' : 'text-[#222222]'}`}>
                              <div className="flex items-center gap-2">
                                <span className="text-xl">
                                  {ROOMS.find((r) => r.id === booking.roomId)?.image}
                                </span>
                                <div>
                                  <div className="font-medium text-sm">{booking.room}</div>
                                  <div
                                    className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                                  >
                                    {booking.floor}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className={`p-3 ${darkMode ? 'text-white' : 'text-[#222222]'}`}>
                              <div className="font-medium">{booking.title}</div>
                            </td>
                            <td className={`p-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              <div className="flex items-center gap-2">
                                <Users size={14} className="text-[#06fff2]" />
                                {booking.bookedByName}
                              </div>
                            </td>
                            <td className={`p-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              <div className="flex items-center gap-1">
                                <Calendar size={14} className="text-[#06fff2]" />
                                {booking.date}
                              </div>
                            </td>
                            <td className={`p-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              <div className="flex items-center gap-1">
                                <Clock size={14} className="text-[#06fff2]" />
                                {booking.time}
                              </div>
                            </td>
                            <td className={`p-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-[#79698c]/30' : 'bg-gray-200'}`}
                              >
                                1 hour
                              </span>
                            </td>
                            <td
                              className={`p-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-xs`}
                            >
                              {new Date(booking.bookedAt).toLocaleDateString()}
                              <br />
                              {new Date(booking.bookedAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </td>
                            <td className={`p-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {booking.attendees && booking.attendees.length > 0 ? (
                                <div className="flex items-center gap-1">
                                  <UsersRound size={14} className="text-[#06fff2]" />
                                  <span className="text-sm">{booking.attendees.length}</span>
                                </div>
                              ) : (
                                <span
                                  className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
                                >
                                  None
                                </span>
                              )}
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  booking.bookingType === 'client_appointment'
                                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                    : booking.bookingType === 'team_meeting'
                                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                      : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                }`}
                              >
                                {booking.bookingType === 'client_appointment'
                                  ? '👤 Client'
                                  : booking.bookingType === 'team_meeting'
                                    ? '👥 Team'
                                    : '🏢 Room'}
                              </span>
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  booking.source === 'contact_page'
                                    ? darkMode
                                      ? 'bg-green-900/30 text-green-400'
                                      : 'bg-green-100 text-green-700'
                                    : booking.source === 'admin_dashboard'
                                      ? darkMode
                                        ? 'bg-orange-900/30 text-orange-400'
                                        : 'bg-orange-100 text-orange-700'
                                      : darkMode
                                        ? 'bg-blue-900/30 text-blue-400'
                                        : 'bg-blue-100 text-blue-700'
                                }`}
                              >
                                {booking.source === 'contact_page'
                                  ? '📧 Contact'
                                  : booking.source === 'admin_dashboard'
                                    ? '⚙️ Admin'
                                    : '👥 Team'}
                              </span>
                            </td>
                            <td className="p-3">
                              {booking.status === 'confirmed' ? (
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'}`}
                                >
                                  ✓ Confirmed
                                </span>
                              ) : booking.status === 'pending' ? (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-500 border border-yellow-500/30">
                                  ⏳ Pending
                                </span>
                              ) : booking.status === 'cancelled' ? (
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'}`}
                                >
                                  ✕ Cancelled
                                </span>
                              ) : isPast && !isToday ? (
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'}`}
                                >
                                  Completed
                                </span>
                              ) : isToday ? (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#06fff2]/20 text-[#06fff2] border border-[#06fff2]/30">
                                  Today
                                </span>
                              ) : isFuture ? (
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'}`}
                                >
                                  Upcoming
                                </span>
                              ) : null}
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Summary Stats */}
            {allBookings.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                <div
                  className={`p-4 rounded-xl ${darkMode ? 'bg-[#222222] border border-[#79698c]' : 'bg-white border border-gray-200'}`}
                >
                  <div className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Completed
                  </div>
                  <div
                    className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-[#222222]'}`}
                  >
                    {
                      allBookings.filter(
                        (b) =>
                          new Date(b.dateObj) < new Date() &&
                          new Date(b.dateObj).toDateString() !== new Date().toDateString(),
                      ).length
                    }
                  </div>
                </div>
                <div
                  className={`p-4 rounded-xl ${darkMode ? 'bg-[#222222] border border-[#79698c]' : 'bg-white border border-gray-200'}`}
                >
                  <div className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Today
                  </div>
                  <div className={`text-2xl font-bold text-[#06fff2]`}>
                    {
                      allBookings.filter(
                        (b) => new Date(b.dateObj).toDateString() === new Date().toDateString(),
                      ).length
                    }
                  </div>
                </div>
                <div
                  className={`p-4 rounded-xl ${darkMode ? 'bg-[#222222] border border-[#79698c]' : 'bg-white border border-gray-200'}`}
                >
                  <div className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Upcoming
                  </div>
                  <div
                    className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-[#222222]'}`}
                  >
                    {allBookings.filter((b) => new Date(b.dateObj) > new Date()).length}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Success Message */}
        <div
          className={`fixed top-6 right-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 transition-all ${isSuccess ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <Check size={20} />
          <div className="font-bold">Success!</div>
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div
              className={`rounded-3xl shadow-2xl border relative w-full max-w-md my-8 ${darkMode ? 'bg-[#2d2d2d] border-[#79698c]' : 'bg-[#f8f6f5] border-white/20'}`}
            >
              <button
                onClick={handleCloseBookingModal}
                className="absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="p-6 border-b border-[#79698c]/30">
                <h2
                  className={`text-2xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-[#222222]'}`}
                >
                  <Book size={24} className="text-[#06fff2]" />
                  Confirm Booking
                </h2>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {ROOMS.find((r) => r.id === selectedRoomId)?.name}
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-[#222222]' : 'bg-[#d5cdcb]'}`}>
                  <div
                    className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-300' : 'text-[#222222]'}`}
                  >
                    <Calendar size={16} className="text-[#06fff2]" />
                    {selectedDate.toLocaleDateString()}
                  </div>
                  <div
                    className={`flex items-center gap-2 text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-[#222222]'}`}
                  >
                    <Clock size={16} className="text-[#06fff2]" />
                    {selectedTime}
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-[#222222]'}`}
                  >
                    Meeting Title
                  </label>
                  <input
                    type="text"
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                    placeholder="e.g., 'Weekly Team Sync'"
                    className={`w-full px-4 py-2.5 rounded-xl border-0 focus:ring-2 focus:ring-[#06fff2] ${darkMode ? 'bg-[#222222] text-white' : 'bg-white text-[#222222]'}`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-[#222222]'}`}
                  >
                    Attendees (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={attendees}
                    onChange={(e) => setAttendees(e.target.value)}
                    placeholder="e.g., John, Jane"
                    className={`w-full px-4 py-2.5 rounded-xl border-0 focus:ring-2 focus:ring-[#06fff2] ${darkMode ? 'bg-[#222222] text-white' : 'bg-white text-[#222222]'}`}
                  />
                </div>
              </div>

              <div className="p-6 border-t border-[#79698c]/30 flex gap-3">
                <button
                  onClick={handleCloseBookingModal}
                  className={`px-5 py-2.5 rounded-full font-medium hover:opacity-80 transition-opacity ${darkMode ? 'bg-[#79698c]/50 text-gray-300' : 'bg-[#ffb8b8]/50 text-gray-600'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBooking}
                  className="flex-1 bg-gradient-to-r from-[#06fff2] to-[#05ded5] text-black px-5 py-2.5 rounded-full font-bold hover:opacity-90 shadow-lg transition-opacity"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RoomBookingDashboard
