-- =====================================================
-- DOLONIA DIGITAL OCEAN - CALENDAR SYSTEM
-- Supabase SQL Migration for Calendar Tracking
-- =====================================================

-- 1. CREATE ROOM BOOKINGS TABLE
-- Tracks internal team room reservations
-- =====================================================

CREATE TABLE IF NOT EXISTS public.room_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id INTEGER NOT NULL,
  room TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  floor TEXT NOT NULL,
  title TEXT NOT NULL,
  booked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  booked_by_name TEXT NOT NULL,
  booked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  attendees TEXT[] DEFAULT '{}',
  booking_type TEXT DEFAULT 'room' CHECK (booking_type IN ('room', 'team_meeting', 'consultation')),
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending', 'cancelled')),
  source TEXT DEFAULT 'admin_dashboard' CHECK (source IN ('contact_page', 'admin_dashboard', 'team_dashboard')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CREATE CLIENT APPOINTMENTS TABLE
-- Tracks client-facing appointment bookings from contact page
-- =====================================================

CREATE TABLE IF NOT EXISTS public.client_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  time TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  purpose TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Room bookings indexes
CREATE INDEX IF NOT EXISTS idx_room_bookings_date ON public.room_bookings(date);
CREATE INDEX IF NOT EXISTS idx_room_bookings_booked_by ON public.room_bookings(booked_by);
CREATE INDEX IF NOT EXISTS idx_room_bookings_room_id ON public.room_bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_room_bookings_status ON public.room_bookings(status);
CREATE INDEX IF NOT EXISTS idx_room_bookings_source ON public.room_bookings(source);
CREATE INDEX IF NOT EXISTS idx_room_bookings_type ON public.room_bookings(booking_type);
CREATE INDEX IF NOT EXISTS idx_room_bookings_date_time ON public.room_bookings(date, time);

-- Client appointments indexes
CREATE INDEX IF NOT EXISTS idx_client_appointments_date ON public.client_appointments(date);
CREATE INDEX IF NOT EXISTS idx_client_appointments_email ON public.client_appointments(client_email);
CREATE INDEX IF NOT EXISTS idx_client_appointments_status ON public.client_appointments(status);
CREATE INDEX IF NOT EXISTS idx_client_appointments_date_time ON public.client_appointments(date, time);

-- 4. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE public.room_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_appointments ENABLE ROW LEVEL SECURITY;

-- 5. RLS POLICIES FOR ROOM BOOKINGS
-- =====================================================

-- Policy: Anyone authenticated can view all room bookings
CREATE POLICY "Anyone authenticated can view room bookings"
  ON public.room_bookings
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Policy: Authenticated users can create room bookings
CREATE POLICY "Authenticated users can create room bookings"
  ON public.room_bookings
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Policy: Users can update their own bookings, admins can update all
CREATE POLICY "Users can update their own bookings or admins can update all"
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

-- Policy: Users can delete their own bookings, admins can delete all
CREATE POLICY "Users can delete their own bookings or admins can delete all"
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

-- 6. RLS POLICIES FOR CLIENT APPOINTMENTS
-- =====================================================

-- Policy: Anyone can create a client appointment (for public contact form)
CREATE POLICY "Anyone can create client appointments"
  ON public.client_appointments
  FOR INSERT
  WITH CHECK (true);

-- Policy: Only authenticated users (staff/admin) can view client appointments
CREATE POLICY "Authenticated users can view client appointments"
  ON public.client_appointments
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Policy: Only admins and team members can update client appointments
CREATE POLICY "Staff can update client appointments"
  ON public.client_appointments
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'team_member')
    )
  );

-- Policy: Only admins can delete client appointments
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

-- 7. CREATE UPDATED_AT TRIGGER FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. ADD TRIGGERS TO AUTO-UPDATE TIMESTAMPS
-- =====================================================

-- Trigger for room_bookings
DROP TRIGGER IF EXISTS update_room_bookings_updated_at ON public.room_bookings;
CREATE TRIGGER update_room_bookings_updated_at
  BEFORE UPDATE ON public.room_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for client_appointments
DROP TRIGGER IF EXISTS update_client_appointments_updated_at ON public.client_appointments;
CREATE TRIGGER update_client_appointments_updated_at
  BEFORE UPDATE ON public.client_appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 9. CREATE HELPFUL VIEWS (OPTIONAL)
-- =====================================================

-- View: All upcoming bookings (combined room bookings and client appointments)
CREATE OR REPLACE VIEW public.upcoming_calendar_events AS
SELECT
  'room_booking' as event_type,
  id,
  room as location,
  title as event_title,
  booked_by_name as organizer,
  date,
  time,
  status,
  source,
  created_at
FROM public.room_bookings
WHERE date >= CURRENT_DATE
UNION ALL
SELECT
  'client_appointment' as event_type,
  id,
  'Client Meeting Room' as location,
  purpose as event_title,
  client_name as organizer,
  date,
  time,
  status,
  'contact_page' as source,
  created_at
FROM public.client_appointments
WHERE date >= CURRENT_DATE
ORDER BY date, time;

-- 10. GRANT PERMISSIONS
-- =====================================================

-- Grant access to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.room_bookings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_appointments TO authenticated;

-- Grant access to service role (for server-side operations)
GRANT ALL ON public.room_bookings TO service_role;
GRANT ALL ON public.client_appointments TO service_role;

-- 11. ADD COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE public.room_bookings IS 'Stores internal team room reservations and meetings';
COMMENT ON TABLE public.client_appointments IS 'Stores client-facing appointment bookings from contact page';

COMMENT ON COLUMN public.room_bookings.booking_type IS 'Type of booking: room, team_meeting, or consultation';
COMMENT ON COLUMN public.room_bookings.status IS 'Booking status: confirmed, pending, or cancelled';
COMMENT ON COLUMN public.room_bookings.source IS 'Where booking was created: contact_page, admin_dashboard, or team_dashboard';

COMMENT ON COLUMN public.client_appointments.status IS 'Appointment status: pending, confirmed, cancelled, or completed';

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- To verify tables were created, run:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('room_bookings', 'client_appointments');

-- To verify indexes were created, run:
-- SELECT indexname FROM pg_indexes WHERE tablename IN ('room_bookings', 'client_appointments');

-- To verify RLS is enabled, run:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('room_bookings', 'client_appointments');
