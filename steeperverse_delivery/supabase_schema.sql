-- Phase 1 Foundation: The Secure Ledger SQL Schema

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Steeper Profiles Table
-- Holds the authentic identity and tier access of the creative scholar
CREATE TABLE IF NOT EXISTS steeper_profiles (
    id UUID REFERENCES auth.users(id) on delete cascade not null PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    email TEXT UNIQUE NOT NULL,
    access_tier TEXT DEFAULT 'nomad'::text, -- 'nomad' ($0), 'guided_scholar' ($44), 'cohort_initiate' ($777)
    creative_vibration TEXT DEFAULT 'incandescent'::text
);

-- Protect the table with Row Level Security (RLS)
ALTER TABLE steeper_profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can view own profile" 
    ON steeper_profiles FOR SELECT 
    USING (auth.uid() = id);

-- Allow users to update their own profile (like changing vibration)
CREATE POLICY "Users can update own profile" 
    ON steeper_profiles FOR UPDATE 
    USING (auth.uid() = id);

-- Function to handle new user signups securely
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.steeper_profiles (id, email, access_tier)
  VALUES (new.id, new.email, 'nomad');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. Steeping Ledgers Table
-- Holds the persistent historical scores and scratchpad writings
CREATE TABLE IF NOT EXISTS steeping_ledgers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES public.steeper_profiles(id) on delete cascade not null,
    hexagong_num TEXT NOT NULL, -- '00', '01'..., '08'
    interaction_text TEXT, -- The interactive scratchpad content
    sage_resonances JSONB DEFAULT '[]'::jsonb, -- The artifacts/conversations saved
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(profile_id, hexagong_num) -- One ledger per hexagong per user
);

ALTER TABLE steeping_ledgers ENABLE ROW LEVEL SECURITY;

-- Users can only see and edit their own ledgers
CREATE POLICY "Users can view own ledgers" 
    ON steeping_ledgers FOR SELECT 
    USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert own ledgers" 
    ON steeping_ledgers FOR INSERT 
    WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own ledgers" 
    ON steeping_ledgers FOR UPDATE 
    USING (auth.uid() = profile_id);


-- 3. Cohort Matrix Table (For Phase 3)
CREATE TABLE IF NOT EXISTS cohort_matrix (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cohort_name TEXT NOT NULL,
    active_start_date DATE NOT NULL,
    active_end_date DATE NOT NULL,
    status TEXT DEFAULT 'upcoming'::text
);

-- Users can enroll in cohorts
CREATE TABLE IF NOT EXISTS cohort_enrollments (
    profile_id UUID REFERENCES public.steeper_profiles(id) on delete cascade not null,
    cohort_id UUID REFERENCES public.cohort_matrix(id) on delete cascade not null,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (profile_id, cohort_id)
);

ALTER TABLE cohort_matrix ENABLE ROW LEVEL SECURITY;
ALTER TABLE cohort_enrollments ENABLE ROW LEVEL SECURITY;

-- Cohorts are readable by everyone
CREATE POLICY "Cohorts are public"
    ON cohort_matrix FOR SELECT
    USING (true);

-- Enrollments readable only by the user
CREATE POLICY "Users can view own enrollments"
    ON cohort_enrollments FOR SELECT
    USING (auth.uid() = profile_id);
