import React, { useState } from 'react';
import { useAuth } from './useAuth';
import { supabase } from './supabaseClient';

export const AuthOverlay = ({ m, onClose }) => {
    const { user, signInWithMagicLink } = useAuth();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleCheckout = async (tier) => {
        if (!user) {
            setMessage("Please establish presence (login) before deepening your steep.");
            // Scroll to the bottom login form
            const authForm = document.getElementById('auth-login-form');
            if (authForm) authForm.scrollIntoView({ behavior: 'smooth' });
            return;
        }
        setLoading(true);
        setMessage("Summoning secure gateway...");
        try {
            const { data, error } = await supabase.functions.invoke('create-checkout-session', {
                body: { tier, user_id: user.id, return_url: window.location.origin + '/steeping' }
            });
            if (error) throw error;
            if (data?.url) {
                window.location.href = data.url;
            } else {
                throw new Error("No URL returned from gateway.");
            }
        } catch (err) {
            console.error(err);
            setMessage("The gateway failed to open. Please try again.");
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email.trim() || !email.includes('@')) {
            setMessage("An email address opens the door.");
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            await signInWithMagicLink(email);
            setMessage('A resonant link has been sent to your presence.');
        } catch (err) {
            console.error(err);
            setMessage('The connection wavered. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex',
            alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)',
            animation: 'fadeIn 0.5s ease forwards'
        }}>
            <div style={{
                background: m.surface, border: `1px solid ${m.accent}30`,
                padding: '3rem', maxWidth: '750px', width: '90%',
                textAlign: 'left', position: 'relative', boxShadow: `0 0 60px ${m.accent}15`,
                maxHeight: '90vh', overflowY: 'auto'
            }}>
                <button onClick={onClose} style={{
                    position: 'absolute', top: '15px', right: '20px', background: 'transparent',
                    border: 'none', color: m.accent, fontSize: '1.2rem', cursor: 'pointer', fontFamily: 'var(--fMono)'
                }}>X</button>

                <h2 style={{ fontFamily: 'var(--fSerif)', color: m.accent, letterSpacing: '0.15em', marginBottom: '2.5rem', fontWeight: 400, textAlign: 'center', textTransform: 'uppercase' }}>
                    THE INVITATION
                </h2>
                
                <div style={{ fontFamily: 'var(--fBody)', fontSize: '0.9rem', color: m.text2, fontStyle: 'italic', marginBottom: '2.5rem', textAlign: 'center' }}>
                    The depth of The Steeping Space responds to the depth of exchange you bring forth.
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
                    {/* Layer 1 */}
                    <div style={{ padding: '1.5rem', border: `1px solid ${m.accent}20`, background: `${m.accent}05` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <h3 style={{ fontFamily: 'var(--fMono)', color: m.accent, letterSpacing: '0.15em', fontSize: '1.1rem', margin: 0 }}>[ THE FOUNDATION ]</h3>
                            <span style={{ fontFamily: 'var(--fMono)', fontSize: '0.8rem', color: m.text2, textTransform: 'uppercase' }}>Surface</span>
                        </div>
                        <p style={{ fontFamily: 'var(--fBody)', color: m.text1, fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
                            <i>The Steeperverse</i> opens here. Navigate freely, generate sound with your movements, and begin a conversation with The Steeping Sage. This layer offers introduction, wayfinding, and encouragements born of the CREATIVE STEEPING ethos.
                        </p>
                    </div>

                    {/* Layer 2 */}
                    <div style={{ padding: '1.5rem', border: `1px solid ${m.accent}40`, background: `${m.accent}10` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <h3 style={{ fontFamily: 'var(--fMono)', color: m.accent, letterSpacing: '0.15em', fontSize: '1.1rem', margin: 0 }}>[ THE VESSEL MATRIX ]</h3>
                            <span style={{ fontFamily: 'var(--fMono)', fontSize: '0.8rem', color: m.text2, textTransform: 'uppercase' }}>$44</span>
                        </div>
                        <p style={{ fontFamily: 'var(--fBody)', color: m.text1, fontSize: '1rem', lineHeight: '1.6', margin: 0, marginBottom: '1.5rem' }}>
                            Your steep deepens when it has somewhere to land. The deeper waters require your conscious decision to invest. This layer holds the full record of your presence, your vessel reflections, and your Steeping Notes across every session. A persistent practice.
                        </p>
                        <button
                            disabled={loading}
                            onClick={() => handleCheckout('journeyer')}
                            style={{
                                background: 'transparent', border: `1px solid ${m.accent}`, color: m.accent,
                                padding: '0.6rem 1.2rem', fontFamily: 'var(--fMono)', fontSize: '0.8rem',
                                letterSpacing: '0.15em', cursor: 'pointer', transition: 'all 0.3s ease',
                                opacity: loading ? 0.5 : 1
                            }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = m.accent; e.currentTarget.style.color = m.bg; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = m.accent; }}
                        >
                            [ SECURE YOUR COORDINATES ]
                        </button>
                    </div>

                    {/* Layer 3 */}
                    <div style={{ padding: '1.5rem', border: `1px solid ${m.accent}80`, background: `${m.accent}18` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <h3 style={{ fontFamily: 'var(--fMono)', color: m.accent, letterSpacing: '0.15em', fontSize: '1.1rem', margin: 0, textShadow: `0 0 10px ${m.accent}80` }}>[ THE INNERACTIVE COHORT ]</h3>
                            <span style={{ fontFamily: 'var(--fMono)', fontSize: '0.8rem', color: m.text2, textTransform: 'uppercase' }}>$777</span>
                        </div>
                        <p style={{ fontFamily: 'var(--fBody)', color: m.text1, fontSize: '1rem', lineHeight: '1.6', margin: 0, marginBottom: '1.5rem' }}>
                            The practitioner community. Direct one-on-one Steeping Sessions. Group cohorts with the architects of the practice. The full depth, held with others who are already doing the work. This architecture awaits your reciprocal presence.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <button
                                disabled={loading}
                                onClick={() => handleCheckout('cohort')}
                                style={{
                                    background: m.accent, border: `1px solid ${m.accent}`, color: m.bg,
                                    padding: '0.6rem 1.2rem', fontFamily: 'var(--fMono)', fontSize: '0.8rem',
                                    letterSpacing: '0.15em', cursor: 'pointer', transition: 'all 0.3s ease',
                                    opacity: loading ? 0.5 : 1
                                }}
                                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 20px ${m.accent}80`; }}
                                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                [ COHORT SESSIONS ]
                            </button>
                            <button
                                disabled={loading}
                                onClick={() => handleCheckout('depth_semester')}
                                style={{
                                    background: 'transparent', border: `1px solid ${m.accent}60`, color: m.accent,
                                    padding: '0.6rem 1.2rem', fontFamily: 'var(--fMono)', fontSize: '0.8rem',
                                    letterSpacing: '0.15em', cursor: 'pointer', transition: 'all 0.3s ease',
                                    opacity: loading ? 0.5 : 1
                                }}
                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = `${m.accent}20`; }}
                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                            >
                                [ DEPTH SEMESTER ]
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{ borderTop: `1px solid ${m.accent}30`, paddingTop: '2.5rem', textAlign: 'center' }}>
                    {user ? (
                        <div style={{ padding: '1.5rem' }}>
                            <p style={{ fontFamily: 'var(--fBody)', color: m.accent, fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                                Your Steeping session is active:
                            </p>
                            <div style={{ fontFamily: 'var(--fMono)', color: m.text1, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                {user.email}
                            </div>
                            <p style={{ fontFamily: 'var(--fBody)', color: m.text2, fontSize: '1rem' }}>
                                The Inneractive layer — group cohorts, direct sessions with the architects — opens by invitation. Let me know you're here.
                            </p>
                        </div>
                    ) : (
                        <>
                            <p style={{ fontFamily: 'var(--fBody)', color: m.text2, fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                            Your practice holds when you give it a home.
                            </p>

                            <form id="auth-login-form" onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="YOUR@EMAIL.COM"
                                    style={{
                                        background: 'transparent', border: 'none', borderBottom: `1px solid ${m.accent}60`,
                                        color: m.accent, fontFamily: 'var(--fMono)', fontSize: '1.1rem', padding: '0.5rem',
                                        textAlign: 'center', letterSpacing: '0.1em', outline: 'none', width: '80%', maxWidth: '300px'
                                    }}
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        background: 'transparent', border: `1px solid ${m.accent}60`,
                                        color: m.accent, fontFamily: 'var(--fMono)', fontSize: '0.9rem',
                                        padding: '0.75rem 1.5rem', marginTop: '1rem', cursor: 'pointer',
                                        textTransform: 'uppercase', letterSpacing: '0.15em',
                                        transition: 'all 0.3s ease',
                                        opacity: loading ? 0.5 : 1
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = `${m.accent}15`}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    {loading ? '[ TRANSMITTING ]' : '[ ESTABLISH PRESENCE ]'}
                                </button>
                            </form>

                            {message && (
                                <div style={{ marginTop: '1.5rem', fontFamily: 'var(--fMono)', fontSize: '0.85rem', color: m.text2 }}>
                                    {message}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
