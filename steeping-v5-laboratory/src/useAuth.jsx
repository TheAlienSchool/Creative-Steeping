import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const AuthContext = createContext({
    session: null,
    user: null,
    profile: null,
    signInWithMagicLink: () => { },
    signOut: () => { },
    loading: true
});

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Intercept local mock sessions for testing so they persist across page reloads
        const mockS = localStorage.getItem('mock_steeping_session');
        if (mockS) {
            try {
                const s = JSON.parse(mockS);
                setSession(s);
                setUser(s.user);

                const TEST_EMAILS = {
                    'thealienscool@gmail.com': { id: 'test-1', email: 'thealienscool@gmail.com', access_tier: 'inneractive' },
                    'test@noemail.steep': { id: 'test-2', email: 'test@noemail.steep', access_tier: 'engaged' },
                    'qdubbya@yahoo.com': { id: 'test-3', email: 'qdubbya@yahoo.com', access_tier: 'inneractive' }
                };

                if (s.user?.email && TEST_EMAILS[s.user.email]) {
                    setProfile(TEST_EMAILS[s.user.email]);
                }
                setLoading(false);
                return;
            } catch (e) { }
        }

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) fetchProfile(session.user.id);
            else setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (localStorage.getItem('mock_steeping_session')) return; // Ignore Supabase updates if testing locally

            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) fetchProfile(session.user.id);
            else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('steeper_profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (!error && data) {
                setProfile(data);
            }
        } catch (err) {
            console.error("Error fetching steeper profile", err);
        } finally {
            setLoading(false);
        }
    };

    const signInWithMagicLink = async (email) => {
        // Testing Bypass: Eternally Approved Email IDs
        const TEST_EMAILS = {
            'thealienscool@gmail.com': { id: 'test-1', email: 'thealienscool@gmail.com', access_tier: 'inneractive' },
            'test@noemail.steep': { id: 'test-2', email: 'test@noemail.steep', access_tier: 'engaged' },
            'qdubbya@yahoo.com': { id: 'test-3', email: 'qdubbya@yahoo.com', access_tier: 'inneractive' }
        };

        if (TEST_EMAILS[email.toLowerCase()]) {
            const mockUser = TEST_EMAILS[email.toLowerCase()];
            const s = { user: { id: mockUser.id, email: mockUser.email }, access_token: 'mock-token' };
            localStorage.setItem('mock_steeping_session', JSON.stringify(s));
            setSession(s);
            setUser(s.user);
            setProfile(mockUser);
            return;
        }

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin
            }
        });
        if (error) throw error;
    };

    const signOut = async () => {
        if (session && session.access_token === 'mock-token') {
            localStorage.removeItem('mock_steeping_session');
            setUser(null);
            setProfile(null);
            setSession(null);
            return;
        }
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ session, user, profile, signInWithMagicLink, signOut, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
