import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'

type RoomBooking = Database['public']['Tables']['room_bookings']['Row']
type RoomBookingInsert = Database['public']['Tables']['room_bookings']['Insert']
type ClientAppointment = Database['public']['Tables']['client_appointments']['Row']
type ClientAppointmentInsert = Database['public']['Tables']['client_appointments']['Insert']

export interface Booking {
  id: string
  room: string
  roomId: number
  date: string
  time: string
  dateObj: Date
  capacity: number
  floor: string
  title: string
  bookedBy: string | null
  bookedByName: string
  bookedAt: Date
  attendees: string[]
  isClientAppointment?: boolean
}

/**
 * Calendar service for managing room bookings and client appointments via Supabase
 */
export const calendarService = {
  /**
   * Fetch all room bookings
   */
  async getRoomBookings(): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('room_bookings')
      .select('*')
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching room bookings:', error)
      throw error
    }

    return (data || []).map(this.convertRoomBookingToBooking)
  },

  /**
   * Fetch all client appointments
   */
  async getClientAppointments(): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('client_appointments')
      .select('*')
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching client appointments:', error)
      throw error
    }

    return (data || []).map(this.convertClientAppointmentToBooking)
  },

  /**
   * Fetch all bookings (room bookings + client appointments merged)
   */
  async getAllBookings(): Promise<Booking[]> {
    const [roomBookings, clientAppointments] = await Promise.all([
      this.getRoomBookings(),
      this.getClientAppointments(),
    ])

    return [...roomBookings, ...clientAppointments]
  },

  /**
   * Create a new room booking
   */
  async createRoomBooking(
    booking: Omit<Booking, 'id' | 'bookedAt' | 'isClientAppointment'>,
  ): Promise<Booking> {
    const { data: userData } = await supabase.auth.getUser()

    const insert: RoomBookingInsert = {
      room_id: booking.roomId,
      room: booking.room,
      date: booking.date,
      time: booking.time,
      capacity: booking.capacity,
      floor: booking.floor,
      title: booking.title,
      booked_by: userData.user?.id || null,
      booked_by_name: booking.bookedByName,
      attendees: booking.attendees,
    }

    const { data, error } = await supabase.from('room_bookings').insert(insert).select().single()

    if (error) {
      console.error('Error creating room booking:', error)
      throw error
    }

    return this.convertRoomBookingToBooking(data)
  },

  /**
   * Create a new client appointment
   */
  async createClientAppointment(appointment: {
    date: string
    time: string
    clientName: string
    clientEmail: string
    purpose: string
  }): Promise<Booking> {
    const insert: ClientAppointmentInsert = {
      date: appointment.date,
      time: appointment.time,
      client_name: appointment.clientName,
      client_email: appointment.clientEmail,
      purpose: appointment.purpose,
      status: 'pending',
    }

    const { data, error } = await supabase
      .from('client_appointments')
      .insert(insert)
      .select()
      .single()

    if (error) {
      console.error('Error creating client appointment:', error)
      throw error
    }

    return this.convertClientAppointmentToBooking(data)
  },

  /**
   * Update a room booking
   */
  async updateRoomBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
    const { data, error } = await supabase
      .from('room_bookings')
      .update({
        room_id: updates.roomId,
        room: updates.room,
        date: updates.date,
        time: updates.time,
        capacity: updates.capacity,
        floor: updates.floor,
        title: updates.title,
        attendees: updates.attendees,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating room booking:', error)
      throw error
    }

    return this.convertRoomBookingToBooking(data)
  },

  /**
   * Delete a room booking
   */
  async deleteRoomBooking(id: string): Promise<void> {
    const { error } = await supabase.from('room_bookings').delete().eq('id', id)

    if (error) {
      console.error('Error deleting room booking:', error)
      throw error
    }
  },

  /**
   * Delete a client appointment
   */
  async deleteClientAppointment(id: string): Promise<void> {
    const { error } = await supabase.from('client_appointments').delete().eq('id', id)

    if (error) {
      console.error('Error deleting client appointment:', error)
      throw error
    }
  },

  /**
   * Subscribe to real-time room booking changes
   */
  subscribeToRoomBookings(callback: () => void) {
    return supabase
      .channel('room_bookings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'room_bookings',
        },
        callback,
      )
      .subscribe()
  },

  /**
   * Subscribe to real-time client appointment changes
   */
  subscribeToClientAppointments(callback: () => void) {
    return supabase
      .channel('client_appointments_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'client_appointments',
        },
        callback,
      )
      .subscribe()
  },

  /**
   * Convert RoomBooking from Supabase to Booking format
   */
  convertRoomBookingToBooking(rb: RoomBooking): Booking {
    return {
      id: rb.id,
      room: rb.room,
      roomId: rb.room_id,
      date: rb.date,
      time: rb.time,
      dateObj: new Date(rb.date),
      capacity: rb.capacity,
      floor: rb.floor,
      title: rb.title,
      bookedBy: rb.booked_by,
      bookedByName: rb.booked_by_name,
      bookedAt: new Date(rb.booked_at),
      attendees: rb.attendees,
      isClientAppointment: false,
    }
  },

  /**
   * Convert ClientAppointment from Supabase to Booking format
   */
  convertClientAppointmentToBooking(ca: ClientAppointment): Booking {
    return {
      id: `client-${ca.id}`,
      room: 'Client Meeting Room',
      roomId: 99,
      date: ca.date,
      time: ca.time,
      dateObj: new Date(ca.date),
      capacity: 2,
      floor: 'Client Services',
      title: `Client Appointment: ${ca.purpose}`,
      bookedBy: 'client',
      bookedByName: ca.client_name,
      bookedAt: new Date(ca.created_at),
      attendees: [ca.client_email],
      isClientAppointment: true,
    }
  },
}
