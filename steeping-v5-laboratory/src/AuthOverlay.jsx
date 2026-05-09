import React, { useState } from 'react';
import { useAuth } from './useAuth';
import { supabase } from './supabaseClient';

export const AuthOverlay = ({ m, onClose }) => {
    const { user, signInWithMagicLink } = useAuth();
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
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

        if (!showConfirm) {
            setShowConfirm(true);
            setMessage("Please confirm your coordinates to ensure precise arrival.");
            return;
        }

        if (email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
            setMessage("The coordinates do not match. Please verify.");
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            await signInWithMagicLink(email);
            setMessage('A resonant link has been sent to your presence.');
            setShowConfirm(false);
            setConfirmEmail('');
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

                <h2 style={{ fontFamily: 'var(--fSerif)', color: m.accent, letterSpacing: '0.15em', marginBottom: '1.5rem', fontWeight: 400, textAlign: 'center', textTransform: 'uppercase' }}>
                    YOUR STEEPING SEQUENCE
                </h2>
                
                <div style={{ fontFamily: 'var(--fBody)', fontSize: '1rem', color: m.text2, fontStyle: 'italic', marginBottom: '2.5rem', textAlign: 'center', maxWidth: '500px', margin: '0 auto 3rem auto' }}>
                    A step-by-step architecture for navigating the Steeperverse and painting your insight into existence.
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '1rem', position: 'relative' }}>
                    {/* The Connecting Line */}
                    <div style={{ position: 'absolute', left: '24px', top: '24px', bottom: '24px', width: '2px', background: `${m.accent}30`, zIndex: 0 }} />

                    {/* Step 1 */}
                    <div style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: m.surface, border: `2px solid ${m.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--fMono)', color: m.accent, fontWeight: 'bold', flexShrink: 0 }}>01</div>
                        <div style={{ padding: '1.5rem', border: `1px solid ${m.accent}20`, background: `${m.accent}05`, flexGrow: 1, borderRadius: 'var(--curve)' }}>
                            <h3 style={{ fontFamily: 'var(--fMono)', color: m.accent, letterSpacing: '0.1em', fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>THE FOUNDATION</h3>
                            <p style={{ fontFamily: 'var(--fBody)', color: m.text1, fontSize: '0.95rem', lineHeight: '1.6', margin: '0 0 1.5rem 0' }}>
                                <b>Establish Presence.</b> Navigate freely, generate sound with your movements, and converse with The Sage. Set your first anchor by entering your email below to save your initial resonance.
                            </p>
                            
                            {user ? (
                                <div style={{ borderTop: `1px dashed ${m.accent}50`, paddingTop: '1rem' }}>
                                    <span style={{ fontFamily: 'var(--fMono)', fontSize: '0.8rem', color: m.accent }}>[ PRESENCE ESTABLISHED: {user.email} ]</span>
                                </div>
                            ) : (
                                <form id="auth-login-form" onSubmit={handleLogin} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value); if (showConfirm) setShowConfirm(false); }}
                                        placeholder="YOUR@EMAIL.COM"
                                        disabled={showConfirm}
                                        style={{
                                            background: 'transparent', border: 'none', borderBottom: `1px solid ${m.accent}60`,
                                            color: showConfirm ? m.text2 : m.accent, fontFamily: 'var(--fMono)', fontSize: '0.9rem', padding: '0.5rem',
                                            letterSpacing: '0.1em', outline: 'none', flexGrow: 1, minWidth: '200px',
                                            opacity: showConfirm ? 0.5 : 1
                                        }}
                                    />
                                    {showConfirm && (
                                        <>
                                            <input
                                                type="email"
                                                value={confirmEmail}
                                                onChange={(e) => setConfirmEmail(e.target.value)}
                                                placeholder="CONFIRM YOUR@EMAIL.COM"
                                                style={{
                                                    background: 'transparent', border: 'none', borderBottom: `1px solid ${m.accent}60`,
                                                    color: m.accent, fontFamily: 'var(--fMono)', fontSize: '0.9rem', padding: '0.5rem',
                                                    letterSpacing: '0.1em', outline: 'none', flexGrow: 1, minWidth: '200px'
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => { setShowConfirm(false); setConfirmEmail(''); setMessage(''); }}
                                                style={{
                                                    background: 'transparent', border: 'none', color: m.text2, fontFamily: 'var(--fMono)', fontSize: '0.75rem',
                                                    cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em', textDecoration: 'underline'
                                                }}
                                            >
                                                [ REVISE ]
                                            </button>
                                        </>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        style={{
                                            background: 'transparent', border: `1px solid ${m.accent}60`,
                                            color: m.accent, fontFamily: 'var(--fMono)', fontSize: '0.8rem',
                                            padding: '0.5rem 1rem', cursor: 'pointer', textTransform: 'uppercase',
                                            letterSpacing: '0.15em', transition: 'all 0.3s ease', opacity: loading ? 0.5 : 1,
                                            whiteSpace: 'nowrap'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = `${m.accent}15`}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        {loading ? '[ TRANSMITTING ]' : (showConfirm ? '[ VERIFY ]' : '[ ESTABLISH ]')}
                                    </button>
                                </form>
                            )}
                            {message && (
                                <div style={{ marginTop: '1rem', fontFamily: 'var(--fMono)', fontSize: '0.8rem', color: m.accent }}>
                                    {message}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: m.surface, border: `2px solid ${m.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--fMono)', color: m.accent, fontWeight: 'bold', flexShrink: 0 }}>02</div>
                        <div style={{ padding: '1.5rem', border: `1px solid ${m.accent}40`, background: `${m.accent}10`, flexGrow: 1, borderRadius: 'var(--curve)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                <h3 style={{ fontFamily: 'var(--fMono)', color: m.accent, letterSpacing: '0.1em', fontSize: '1.1rem', margin: 0 }}>THE VESSEL MATRIX</h3>
                                <span style={{ fontFamily: 'var(--fMono)', fontSize: '0.8rem', color: m.text2, textTransform: 'uppercase' }}>$44</span>
                            </div>
                            <p style={{ fontFamily: 'var(--fBody)', color: m.text1, fontSize: '0.95rem', lineHeight: '1.6', margin: '0 0 1.5rem 0' }}>
                                <b>Construct Your Insight.</b> Secure your coordinates to unlock the 9-part Guided Journey. Here you will track your biometric resonance, map your discoveries, and build your persistent Steeping Space.
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
                    </div>

                    {/* Step 3 */}
                    <div style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: m.surface, border: `2px solid ${m.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--fMono)', color: m.accent, fontWeight: 'bold', flexShrink: 0, boxShadow: `0 0 15px ${m.accent}60` }}>03</div>
                        <div style={{ padding: '1.5rem', border: `1px solid ${m.accent}80`, background: `${m.accent}18`, flexGrow: 1, borderRadius: 'var(--curve)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                <h3 style={{ fontFamily: 'var(--fMono)', color: m.accent, letterSpacing: '0.1em', fontSize: '1.1rem', margin: 0, textShadow: `0 0 10px ${m.accent}80` }}>THE INNERACTIVE COHORT</h3>
                                <span style={{ fontFamily: 'var(--fMono)', fontSize: '0.8rem', color: m.text2, textTransform: 'uppercase' }}>$777</span>
                            </div>
                            <p style={{ fontFamily: 'var(--fBody)', color: m.text1, fontSize: '0.95rem', lineHeight: '1.6', margin: '0 0 1.5rem 0' }}>
                                <b>Commune & Synthesize.</b> When you require the reflection of others, join the cohort. Direct one-on-one sessions, deep architectural work, and a shared environment with the architects of the practice.
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
                </div>
            </div>
        </div>
    );
};
