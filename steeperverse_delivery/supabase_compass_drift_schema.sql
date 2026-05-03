-- Phase 06: The Steeping Compass & Drift Telemetry Upgrade
-- Run this script in your Supabase SQL Editor to anchor the qualitative telemetry events.

-- 1. Create the Steeping Drift Events Table
-- This table captures the 5-dimensional qualitative assessment of the Steepee's experience
CREATE TABLE IF NOT EXISTS steeping_drift_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES public.steeper_profiles(id) ON DELETE CASCADE, -- Nullable for anonymous or unplugged drifts
    vessel_context TEXT NOT NULL, -- e.g., '00', '01'-'08', or 'matrix'/'observatory'
    metrics JSONB NOT NULL,       -- { resonance, stillness, clarity, depth, alignment }
    geolocated_depth INTEGER,     -- Number of historical ledgers created at the time of this drift
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Protect the table with Row Level Security (RLS)
ALTER TABLE steeping_drift_events ENABLE ROW LEVEL SECURITY;

-- 2. Define Interaction Policies
-- Allow anyone (even unauthenticated, if needed) to insert drift events so the quantitative telemetry is always flowing
CREATE POLICY "Anyone can insert drift events"
    ON steeping_drift_events FOR INSERT
    WITH CHECK (true);

-- Allow users to read only their own drift events
CREATE POLICY "Users can read own drift events"
    ON steeping_drift_events FOR SELECT
    USING (auth.uid() = profile_id);

-- Optional: If the Architect/Admin needs to analyze the total macro-environment drift, 
-- you might create an overriding read-policy below for specific admin emails/roles.
-- CREATE POLICY "Admins can read all drift events"
--     ON steeping_drift_events FOR SELECT USING (auth.email() = 'thealienscool@gmail.com');
