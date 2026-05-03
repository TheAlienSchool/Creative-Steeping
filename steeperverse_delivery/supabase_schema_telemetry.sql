-- Phase 05 Telemetry & Enhanced Intelligence Upgrade
-- Run this script in your Supabase SQL Editor to elevate the data capabilities.

-- 1. Extend the Steeping Ledgers table to measure pace, depth, and completion.
ALTER TABLE public.steeping_ledgers
ADD COLUMN IF NOT EXISTS interaction_metrics JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT false;

-- 2. Ensure sage_resonances is fully functional (already exists from Phase 1, but safeguarding)
ALTER TABLE public.steeping_ledgers
ADD COLUMN IF NOT EXISTS sage_resonances JSONB DEFAULT '[]'::jsonb;
