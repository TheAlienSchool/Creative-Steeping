// ============================================================================
// useTier.jsx
// Tier awareness hook for the Steeperverse access architecture.
//
// Reads profile.access_tier from the auth context.
// Defaults gracefully to 'nomad' when no profile exists.
// Exposes computed booleans consumed by phase routing and
// feature-gating throughout the application.
//
// Normalizes both DB ('nomad' | 'guided_scholar' | 'cohort_initiate') and Stripe/Legacy
// values to canonical states.
// ============================================================================

import { useAuth } from './useAuth';

export const useTier = () => {
    const { profile, user } = useAuth();

    // The tier lives on the profile row. If no profile exists,
    // the practitioner defaults to L1 'nomad' :: open, ungated explorers.
    const rawTier = profile?.access_tier ?? 'nomad';

    // Normalize all various backend/legacy entries to our 3 structured tiers:
    // L1 (Nomad): 'nomad' | 'interactive'
    // L2 (Guided Scholar): 'guided_scholar' | 'journeyer' | 'single_steep' | 'engaged'
    // L3 (Cohort Initiate): 'cohort_initiate' | 'cohort' | 'depth_semester' | 'inneractive'
    
    const isInteractive = rawTier === 'nomad' || rawTier === 'interactive';
    const isEngaged     = ['guided_scholar', 'journeyer', 'single_steep', 'engaged', 'cohort_initiate', 'cohort', 'depth_semester', 'inneractive'].includes(rawTier);
    const isInneractive = ['cohort_initiate', 'cohort', 'depth_semester', 'inneractive'].includes(rawTier);

    // Canonical tier representation for state logic
    const tier = isInneractive ? 'cohort_initiate' : (isEngaged ? 'guided_scholar' : 'nomad');

    // Authenticated at any tier (magic link sent and confirmed)
    const isAuthenticated = !!user;

    // Engaged OR Inneractive :: the Historical Score persists
    const hasPersistentScore = isEngaged || isInneractive;

    // Inneractive :: direct session booking, group cohorts
    const hasInneractivePrivilege = isInneractive;

    return {
        tier,
        isInteractive,
        isEngaged,
        isInneractive,
        isAuthenticated,
        hasPersistentScore,
        hasInneractivePrivilege,
    };
};
