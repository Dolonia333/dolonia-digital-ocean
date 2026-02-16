-- Create room_bookings table for internal room reservations
CREATE TABLE IF NOT EXISTS public.room_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id INTEGER NOT NULL,
  room TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  floor TEXT NOT NULL,
  title TEXT NOT NULL,
  booked_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  booked_by_name TEXT NOT NULL,
  booked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  attendees TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create client_appointments table for client-facing bookings
CREATE TABLE IF NOT EXISTS public.client_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  time TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  purpose TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_room_bookings_date ON public.room_bookings(date);
CREATE INDEX IF NOT EXISTS idx_room_bookings_booked_by ON public.room_bookings(booked_by);
CREATE INDEX IF NOT EXISTS idx_room_bookings_room_id ON public.room_bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_client_appointments_date ON public.client_appointments(date);
CREATE INDEX IF NOT EXISTS idx_client_appointments_email ON public.client_appointments(client_email);

-- Enable Row Level Security
ALTER TABLE public.room_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_appointments ENABLE ROW LEVEL SECURITY;

-- Room Bookings Policies
-- Admins and team members can view all bookings
CREATE POLICY "Users can view room bookings"
  ON public.room_bookings
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL
  );

-- Users can create their own bookings
CREATE POLICY "Users can create room bookings"
  ON public.room_bookings
  FOR INSERT
  WITH CHECK (
    auth.uid() = booked_by
  );

-- Users can update their own bookings, admins can update all
CREATE POLICY "Users can update their own bookings"
  ON public.room_bookings
  FOR UPDATE
  USING (
    auth.uid() = booked_by OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Users can delete their own bookings, admins can delete all
CREATE POLICY "Users can delete their own bookings"
  ON public.room_bookings
  FOR DELETE
  USING (
    auth.uid() = booked_by OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Client Appointments Policies
-- Anyone can create a client appointment (for contact form)
CREATE POLICY "Anyone can create client appointments"
  ON public.client_appointments
  FOR INSERT
  WITH CHECK (true);

-- Only authenticated users (admins/staff) can view client appointments
CREATE POLICY "Authenticated users can view client appointments"
  ON public.client_appointments
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL
  );

-- Only admins can update client appointments
CREATE POLICY "Admins can update client appointments"
  ON public.client_appointments
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Only admins can delete client appointments
CREATE POLICY "Admins can delete client appointments"
  ON public.client_appointments
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to auto-update updated_at
CREATE TRIGGER update_room_bookings_updated_at
  BEFORE UPDATE ON public.room_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_appointments_updated_at
  BEFORE UPDATE ON public.client_appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
