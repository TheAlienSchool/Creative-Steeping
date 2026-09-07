-- Phase 06 Expansion: Supabase Schema Upgrade
-- This schema supplements the previous foundational setup for Phase 04/05.

-- ==============================================================================
-- 1. PATHWAY 1: THE COLLECTIVE RESONANCE (Steeping Circles)
-- ==============================================================================

-- We are evolving the `cohort_matrix` into a more specialized concept: `steeping_circles`
-- This allows up to 3 active cohorts at once, with a max capacity of 14 each.
CREATE TABLE IF NOT EXISTS steeping_circles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    theme TEXT NOT NULL,                  -- E.g., 'The Distance Between Limiting Beliefs and Limitlessness'
    capacity INTEGER DEFAULT 14,          -- Hard cap at 14 Steepees per circle
    active_start_date DATE NOT NULL,
    active_end_date DATE NOT NULL,
    status TEXT DEFAULT 'enrolling'::text -- 'enrolling', 'active', 'completed'
);

ALTER TABLE steeping_circles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Steeping circles are universally readable" ON steeping_circles FOR SELECT USING (true);


-- 1.1 Steeping Circle Enrollments
-- Link a user's profile to a specific Steeping Circle
CREATE TABLE IF NOT EXISTS circle_enrollments (
    profile_id UUID REFERENCES public.steeper_profiles(id) on delete cascade not null,
    circle_id UUID REFERENCES public.steeping_circles(id) on delete cascade not null,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (profile_id, circle_id)
);

ALTER TABLE circle_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own enrollments" ON circle_enrollments FOR SELECT USING (auth.uid() = profile_id);


-- 1.2 Membrane Canvas PINGs (The 'Trace' of others in real-time)
-- This is a high-turnover table designed to log recent actions for the visual "PING" ripple effect
CREATE TABLE IF NOT EXISTS membrane_pings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    circle_id UUID REFERENCES public.steeping_circles(id) on delete cascade not null,
    profile_id UUID REFERENCES public.steeper_profiles(id) on delete cascade not null,
    action_type TEXT NOT NULL,            -- e.g., 'active_pause_completed', 'insight_added', 'SAGE_INQUIRY'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Realtime is live for this table (confirmed against pg_publication_tables, 2026-09-06) —
-- useSteepingCircles.jsx subscribes via .channel(...).on('postgres_changes', { table: 'membrane_pings', ... })
-- and depends on this publication membership to receive INSERTs. Idempotent: safe to re-run.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'membrane_pings'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE membrane_pings;
    END IF;
END $$;

-- Added by the Sage-as-Point-Guard work (2026-09-06, see supabase_membrane_pings_metadata.sql):
-- carries { query_text, matched_topic } for SAGE_INQUIRY pings; every other action_type
-- keeps inserting an empty object via the column default. Kept here too so this file stays
-- the single accurate record of membrane_pings' live shape, not split across two files.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='membrane_pings' AND column_name='metadata') THEN
        ALTER TABLE membrane_pings ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
    END IF;
END $$;

ALTER TABLE membrane_pings ENABLE ROW LEVEL SECURITY;
-- Users in the same circle can view the pings of their cohort members
CREATE POLICY "Circle members can view pings" ON membrane_pings FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM circle_enrollments ce 
            WHERE ce.circle_id = membrane_pings.circle_id AND ce.profile_id = auth.uid()
        )
    );
CREATE POLICY "Users can create their own pings" ON membrane_pings FOR INSERT
    WITH CHECK (auth.uid() = profile_id);


-- ==============================================================================
-- 2. PATHWAY 3: WHAT STEEPERS SAY (The Seeded Garden)
-- ==============================================================================

-- A curated garden of public insights and reviews.
CREATE TABLE IF NOT EXISTS what_steepers_say (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES public.steeper_profiles(id) on delete cascade, -- Optional, could be anonymous
    author_name TEXT DEFAULT 'Anonymous ÅLÏEN',
    author_title TEXT,
    insight_text TEXT NOT NULL,           -- The core review or creative insight
    source TEXT DEFAULT 'direct',         -- 'direct', 'imported_from_review'
    is_featured BOOLEAN DEFAULT true,     -- Approved to be shown in the editorial view
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE what_steepers_say ENABLE ROW LEVEL SECURITY;
-- Everyone can read the curated garden
CREATE POLICY "Curated garden is public" ON what_steepers_say FOR SELECT USING (is_featured = true);
-- Users can submit their own traces to the garden
CREATE POLICY "Users can submit insights" ON what_steepers_say FOR INSERT WITH CHECK (auth.uid() = profile_id OR profile_id IS NULL);


-- ==============================================================================
-- 3. ARCHETYPE CARDS (For Steeping Notes Interaction)
-- ==============================================================================
-- Adding a column to the existing 'steeping_ledgers' table to allow users to link a chosen Archetype to a specific insight.
-- This will be used to trigger dynamic, perspective-shifting Sage interactions.

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='steeping_ledgers' AND column_name='applied_archetype') THEN
        ALTER TABLE steeping_ledgers ADD COLUMN applied_archetype TEXT;
    END IF;
END $$;
