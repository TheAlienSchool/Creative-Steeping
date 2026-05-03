-- Phase 06: The Collective Resonance & Steeping Circles
-- Run this script in your Supabase SQL Editor to activate the Community elements in the Dashboard.

-- 1. Create the Steeping Circles Table (The Cohorts)
CREATE TABLE IF NOT EXISTS steeping_circles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    theme TEXT NOT NULL,                         -- E.g., 'The March Incandescent Cohort'
    status TEXT DEFAULT 'enrolling' NOT NULL,    -- 'enrolling', 'active', 'archived'
    active_start_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE steeping_circles ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read active circles so they can see what cohorts exist
CREATE POLICY "Circles are readable by everyone" 
    ON steeping_circles FOR SELECT USING (true);


-- 2. Create the Circle Enrollments Table (Connecting Users to Cohorts)
CREATE TABLE IF NOT EXISTS circle_enrollments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES public.steeper_profiles(id) ON DELETE CASCADE,
    circle_id UUID REFERENCES public.steeping_circles(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(profile_id, circle_id) -- A user can only enroll in a specific circle once
);

ALTER TABLE circle_enrollments ENABLE ROW LEVEL SECURITY;

-- Allow users to enroll themselves
CREATE POLICY "Users can enroll themselves" 
    ON circle_enrollments FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- Allow users to read their own enrollments
CREATE POLICY "Users can read own enrollments" 
    ON circle_enrollments FOR SELECT USING (auth.uid() = profile_id);


-- 3. Create the Membrane Pings Table (Live Telemetry from the Cohort)
CREATE TABLE IF NOT EXISTS membrane_pings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES public.steeper_profiles(id) ON DELETE CASCADE,
    circle_id UUID REFERENCES public.steeping_circles(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL, -- e.g., 'VESSEL_OPENED', 'SAGE_INQUIRY', 'DRIFT_ANCHORED', 'TIMER_COMPLETED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE membrane_pings ENABLE ROW LEVEL SECURITY;

-- Allow enrolled users to broadcast pings to their circle
CREATE POLICY "Users can broadcast pings" 
    ON membrane_pings FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- Allow enrolled users to read pings belonging to their circle
CREATE POLICY "Users can hear pings from their circle" 
    ON membrane_pings FOR SELECT 
    USING (
        circle_id IN (
            SELECT circle_id FROM circle_enrollments WHERE profile_id = auth.uid()
        )
    );

-- Enable Realtime for Membrane Pings so the Websockets function properly
ALTER PUBLICATION supabase_realtime ADD TABLE membrane_pings;
