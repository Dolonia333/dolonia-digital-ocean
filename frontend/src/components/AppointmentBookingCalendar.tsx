import React, { useState, useMemo, useEffect } from 'react'
import { generateUUID } from '@/lib/uuid'
import { Calendar, Clock, Check, X, ChevronLeft, ChevronRight } from 'lucide-react'

interface TimeSlot {
  time: string
  available: boolean
}

interface Appointment {
  id: string
  date: string
  time: string
  clientName: string
  clientEmail: string
  purpose: string
}

interface AppointmentBookingCalendarProps {
  onBookingSuccess?: () => void
}

const AppointmentBookingCalendar: React.FC<AppointmentBookingCalendarProps> = ({
  onBookingSuccess,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [purpose, setPurpose] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>([])

  // Load appointments from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('client_appointments')
    if (stored) {
      try {
        setAppointments(JSON.parse(stored))
      } catch (error) {
        console.error('Error loading appointments:', error)
      }
    }
  }, [])

  // Business hours: Monday-Friday, 9 AM - 5 PM
  const availableTimeSlots = useMemo(
    () => [
      '09:00 AM',
      '09:30 AM',
      '10:00 AM',
      '10:30 AM',
      '11:00 AM',
      '11:30 AM',
      '12:00 PM',
      '12:30 PM',
      '01:00 PM',
      '01:30 PM',
      '02:00 PM',
      '02:30 PM',
      '03:00 PM',
      '03:30 PM',
      '04:00 PM',
      '04:30 PM',
    ],
    [],
  )

  const formatDate = (date: Date): string => {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  }

  const isWeekday = (date: Date): boolean => {
    const day = date.getDay()
    return day !== 0 && day !== 6 // Not Sunday (0) or Saturday (6)
  }

  const isToday = (date: Date): boolean => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isPast = (date: Date): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const isFullyBooked = (date: Date): boolean => {
    const dateStr = formatDate(date)
    const bookedCount = appointments.filter((apt) => apt.date === dateStr).length
    return bookedCount >= availableTimeSlots.length // All time slots are booked
  }

  const hasAvailableSlots = (date: Date): boolean => {
    if (!isWeekday(date) || isPast(date)) return false
    return !isFullyBooked(date)
  }

  const getAvailableSlotsCount = (date: Date): number => {
    const dateStr = formatDate(date)
    const bookedCount = appointments.filter((apt) => apt.date === dateStr).length
    return availableTimeSlots.length - bookedCount
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    return days
  }

  const changeMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1))
      return newDate
    })
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setShowBookingForm(true)
  }

  const handleBooking = () => {
    if (!clientName || !clientEmail || !purpose || !selectedTime) return

    const newAppointment: Appointment = {
      id: generateUUID(),
      date: formatDate(selectedDate),
      time: selectedTime,
      clientName,
      clientEmail,
      purpose,
    }

    const updatedAppointments = [...appointments, newAppointment]
    setAppointments(updatedAppointments)
    localStorage.setItem('client_appointments', JSON.stringify(updatedAppointments))

    setIsSuccess(true)
    setShowBookingForm(false)
    setClientName('')
    setClientEmail('')
    setPurpose('')
    setSelectedTime(null)

    // Notify parent component of successful booking
    if (onBookingSuccess) {
      onBookingSuccess()
    }

    setTimeout(() => setIsSuccess(false), 3000)
  }

  const timeSlots = useMemo(() => {
    if (!selectedDate || !isWeekday(selectedDate) || isPast(selectedDate)) {
      return []
    }
    const dateStr = formatDate(selectedDate)
    return availableTimeSlots.map((time) => ({
      time,
      available: !appointments.some((apt) => apt.date === dateStr && apt.time === time),
    }))
  }, [selectedDate, appointments, availableTimeSlots])

  return (
    <div className="w-full">
      {/* Month Calendar */}
      <div className="bg-ocean-surface/50 border border-ocean-surface rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-foreground">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => changeMonth('prev')}
              className="p-2 rounded-lg bg-ocean-deep/50 text-cyan-bright hover:bg-ocean-deep transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => changeMonth('next')}
              className="p-2 rounded-lg bg-ocean-deep/50 text-cyan-bright hover:bg-ocean-deep transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-semibold py-2 text-cyan-soft">
              {day}
            </div>
          ))}
          {getDaysInMonth(currentMonth).map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square"></div>
            }
            const isSelected = date.toDateString() === selectedDate.toDateString()
            const isTodayDate = isToday(date)
            const isPastDate = isPast(date)
            const isWeekdayDate = isWeekday(date)
            const fullyBooked = isFullyBooked(date)
            const isDisabled = isPastDate || !isWeekdayDate || fullyBooked

            return (
              <button
                key={index}
                onClick={() => !isDisabled && setSelectedDate(date)}
                disabled={isDisabled}
                className={`aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                  isDisabled
                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-40'
                    : isSelected
                      ? 'bg-gradient-to-br from-cyan-bright to-cyan-glow text-ocean-deep font-bold shadow-lg scale-105'
                      : isTodayDate
                        ? 'bg-ocean-deep text-cyan-bright border-2 border-cyan-bright'
                        : 'bg-ocean-deep/50 text-cyan-soft hover:bg-ocean-deep hover:text-cyan-bright'
                }`}
              >
                {date.getDate()}
              </button>
            )
          })}
        </div>

        <div className="mt-4 text-sm text-cyan-soft space-y-1">
          <p>📅 Available: Monday - Friday</p>
          <p>🕐 Hours: 9:00 AM - 5:00 PM CST</p>
          <p>💡 Click any available day to see time slots</p>
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && isWeekday(selectedDate) && !isPast(selectedDate) && (
        <div className="bg-ocean-surface/50 border border-ocean-surface rounded-2xl p-6 mb-6">
          {/* Header with Date and Availability Summary */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div>
              <h3 className="text-xl font-bold text-foreground">
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </h3>
              <p className="text-sm text-cyan-soft mt-1">Select your preferred time slot</p>
            </div>

            {/* Availability Stats Card */}
            <div className="bg-ocean-deep/50 rounded-xl px-5 py-3 border border-cyan-bright/20 inline-block">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-bright">
                    {getAvailableSlotsCount(selectedDate)}
                  </div>
                  <div className="text-xs text-cyan-soft uppercase tracking-wide">Available</div>
                </div>
                <div className="h-10 w-px bg-cyan-bright/20"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {appointments.filter((apt) => apt.date === formatDate(selectedDate)).length}
                  </div>
                  <div className="text-xs text-cyan-soft uppercase tracking-wide">Booked</div>
                </div>
              </div>
            </div>
          </div>

          {/* Availability Status Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <div className="bg-gradient-to-r from-cyan-bright/10 to-cyan-glow/10 rounded-lg p-4 border border-cyan-bright/20">
              <div className="flex items-center gap-3">
                <div className="bg-cyan-bright/20 rounded-full p-2">
                  <svg
                    className="w-5 h-5 text-cyan-bright"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-cyan-bright">Total Hours</div>
                  <div className="text-lg font-bold text-foreground">
                    {availableTimeSlots.length} slots
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500/10 to-green-400/10 rounded-lg p-4 border border-green-400/20">
              <div className="flex items-center gap-3">
                <div className="bg-green-500/20 rounded-full p-2">
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-green-400">Available Times</div>
                  <div className="text-lg font-bold text-foreground">
                    {getAvailableSlotsCount(selectedDate)} open
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-500/10 to-red-400/10 rounded-lg p-4 border border-red-400/20">
              <div className="flex items-center gap-3">
                <div className="bg-red-500/20 rounded-full p-2">
                  <svg
                    className="w-5 h-5 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-red-400">Booked Times</div>
                  <div className="text-lg font-bold text-foreground">
                    {appointments.filter((apt) => apt.date === formatDate(selectedDate)).length}{' '}
                    taken
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Message */}
          {isFullyBooked(selectedDate) ? (
            <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-red-400 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-red-400">All Time Slots Fully Booked</p>
                  <p className="text-sm text-cyan-soft mt-1">
                    Please select a different date to see available times.
                  </p>
                </div>
              </div>
            </div>
          ) : getAvailableSlotsCount(selectedDate) <= 3 ? (
            <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-yellow-400 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-yellow-400">Limited Availability</p>
                  <p className="text-sm text-cyan-soft mt-1">
                    Only {getAvailableSlotsCount(selectedDate)} time slots remaining. Book soon!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-green-400 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-green-400">Good Availability</p>
                  <p className="text-sm text-cyan-soft mt-1">
                    Multiple time slots available for booking.
                  </p>
                </div>
              </div>
            </div>
          )}

          {timeSlots.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => slot.available && handleTimeSelect(slot.time)}
                  disabled={!slot.available}
                  className={`p-3 rounded-xl text-sm font-semibold transition-all ${
                    !slot.available
                      ? 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-50'
                      : 'bg-ocean-deep border-2 border-cyan-bright/30 text-cyan-bright hover:bg-cyan-bright hover:text-ocean-deep hover:scale-105'
                  }`}
                >
                  <Clock size={16} className="inline mr-1" />
                  {slot.time}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-cyan-soft">No available time slots for this date.</p>
          )}
        </div>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-ocean-surface border border-cyan-bright/30 rounded-3xl shadow-2xl w-full max-w-md relative">
            <button
              onClick={() => setShowBookingForm(false)}
              className="absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center bg-ocean-deep border border-cyan-bright shadow-lg hover:bg-cyan-bright hover:text-ocean-deep transition-colors"
            >
              <X size={20} />
            </button>

            <div className="p-6 border-b border-cyan-bright/30">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Calendar size={24} className="text-cyan-bright" />
                Book Appointment
              </h2>
              <p className="text-sm mt-1 text-cyan-soft">
                {selectedDate.toLocaleDateString()} at {selectedTime}
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 rounded-xl border-0 bg-ocean-deep text-foreground focus:ring-2 focus:ring-cyan-bright"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border-0 bg-ocean-deep text-foreground focus:ring-2 focus:ring-cyan-bright"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Purpose of Meeting *
                </label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="What would you like to discuss?"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border-0 bg-ocean-deep text-foreground focus:ring-2 focus:ring-cyan-bright resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-cyan-bright/30 flex gap-3">
              <button
                onClick={() => setShowBookingForm(false)}
                className="px-5 py-2.5 rounded-full font-medium bg-ocean-deep text-cyan-soft hover:bg-ocean-deep/80"
              >
                Cancel
              </button>
              <button
                onClick={handleBooking}
                disabled={!clientName || !clientEmail || !purpose}
                className="flex-1 bg-gradient-to-r from-cyan-bright to-cyan-glow text-ocean-deep px-5 py-2.5 rounded-full font-bold hover:opacity-90 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      <div
        className={`fixed top-6 right-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 transition-all z-50 ${isSuccess ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <Check size={20} />
        <div>
          <div className="font-bold">Appointment Confirmed!</div>
          <div className="text-sm">You'll receive a confirmation email shortly.</div>
        </div>
      </div>
    </div>
  )
}

export default AppointmentBookingCalendar
