import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './useAuth';

export const useSteepingCircles = () => {
    const { user } = useAuth();
    const [activeCircles, setActiveCircles] = useState([]);
    const [myCircle, setMyCircle] = useState(null);
    const [membranePings, setMembranePings] = useState([]);
    const [loading, setLoading] = useState(true);

    // ==========================================
    // 1. FETCH CIRCLES & ENROLLMENT
    // ==========================================
    const fetchContext = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            // A. Fetch all globally active cohorts
            const { data: circles, error: cError } = await supabase
                .from('steeping_circles')
                .select('*')
                .in('status', ['enrolling', 'active']);

            if (!cError && circles) {
                setActiveCircles(circles);
            }

            // B. Fetch the user's current circle enrollment
            const { data: enrollment, error: eError } = await supabase
                .from('circle_enrollments')
                .select('circle_id, enrolled_at, steeping_circles(*)')
                .eq('profile_id', user.id)
                .single();

            if (!eError && enrollment) {
                setMyCircle(enrollment.steeping_circles);
                // C. Fetch recent historical pings to populate the canvas instantly
                fetchRecentPings(enrollment.circle_id);
            }

        } catch (err) {
            console.error("Steeping Circles architecture not yet synchronized.", err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const fetchRecentPings = async (circleId) => {
        const { data, error } = await supabase
            .from('membrane_pings')
            .select('*')
            .eq('circle_id', circleId)
            .order('created_at', { ascending: false })
            .limit(20);
            
        if (!error && data) {
            setMembranePings(data.reverse()); // Chronological order for rendering
        }
    };

    useEffect(() => {
        fetchContext();
    }, [fetchContext]);

    // ==========================================
    // 2. REALTIME MEMBRANE (WEBSOCKETS)
    // ==========================================
    useEffect(() => {
        if (!myCircle) return;

        // Establish an anonymous websocket subscription to the user's active circle
        const pingChannel = supabase.channel(`circle_channel_${myCircle.id}`)
            .on(
                'postgres_changes',
                { 
                    event: 'INSERT', 
                    schema: 'public', 
                    table: 'membrane_pings', 
                    filter: `circle_id=eq.${myCircle.id}` 
                },
                (payload) => {
                    // Inject the new PING into local state dynamically
                    setMembranePings(current => {
                        const updated = [...current, payload.new];
                        // Keep a rolling window of max 50 visual pings to prevent memory bloat
                        return updated.length > 50 ? updated.slice(updated.length - 50) : updated;
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(pingChannel);
        };
    }, [myCircle]);

    // ==========================================
    // 3. ACTION INTENTIONS
    // ==========================================
    const enrollInCircle = async (circleId) => {
        if (!user) return false;
        const { error } = await supabase
            .from('circle_enrollments')
            .insert({ profile_id: user.id, circle_id: circleId });
            
        if (!error) {
            // Re-sync context upon successful entry
            fetchContext();
            return true;
        }
        return false;
    };

    const broadcastPing = async (actionType) => {
        if (!user || !myCircle) return;
        // Allows user components (timers, notes) to echo their trace anonymously
        await supabase
            .from('membrane_pings')
            .insert({
                profile_id: user.id,
                circle_id: myCircle.id,
                action_type: actionType
            });
    };

    return {
        activeCircles,
        myCircle,
        membranePings,
        enrollInCircle,
        broadcastPing,
        loading
    };
};
