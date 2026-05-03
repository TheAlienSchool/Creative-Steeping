// ============================================================
// useTier.jsx
// Tier awareness hook for the Steeperverse access architecture.
//
// Reads profile.access_tier from the auth context.
// Defaults gracefully to 'interactive' when no profile exists.
// Exposes computed booleans consumed by phase routing and
// feature-gating throughout the application.
//
// Tier values: 'interactive' | 'engaged' | 'inneractive'
// ============================================================

import { useAuth } from './useAuth';

export const useTier = () => {
    const { profile, user } = useAuth();

    // The tier lives on the profile row. If no profile exists,
    // the practitioner is Interactive (L1) — open, ungated.
    const tier = profile?.access_tier ?? 'interactive';

    const isInteractive  = tier === 'interactive';
    const isEngaged      = tier === 'engaged' || tier === 'inneractive';
    const isInneractive  = tier === 'inneractive';

    // Authenticated at any tier (magic link sent and confirmed)
    const isAuthenticated = !!user;

    // Engaged OR Inneractive — the Historical Score persists
    const hasPersistentScore = isEngaged || isInneractive;

    // Inneractive — direct session booking, group cohorts
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
