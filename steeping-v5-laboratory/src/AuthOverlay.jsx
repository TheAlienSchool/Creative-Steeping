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
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100dvh',
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
                                This is the free account, enhanced by providing an email which activates the ability to save your Steeping Notes (any typed reflection into The Steeping Space) locally to your profile so they aren't lost upon closing the browser. You also have access to the Steeping guidance in the Hexagongs, the full interactive bioacoustic soundscape, and basic conversation with The Sage (our interactive library of Steeping wisdom and intelligence).
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
                                <h3 style={{ fontFamily: 'var(--fMono)', color: m.accent, letterSpacing: '0.1em', fontSize: '1.1rem', margin: 0 }}>CREÅTIVE STEEPING :: THE JOURNEYER</h3>
                                <span style={{ fontFamily: 'var(--fMono)', fontSize: '0.8rem', color: m.text2, textTransform: 'uppercase' }}>$44</span>
                            </div>
                            <p style={{ fontFamily: 'var(--fBody)', color: m.text1, fontSize: '0.95rem', lineHeight: '1.6', margin: '0 0 1.5rem 0' }}>
                                This annual subscription unlocks the core CREATIVE STEEPING curriculum designed from the <a href="https://www.thealienschool.com/theshoppe/p/cretive-steeping-journal-the-unfurling-of-your-essence" target="_blank" rel="noopener noreferrer" style={{ color: m.accent, textDecoration: 'underline' }}>original workbook</a> authored by Kamau Zuberi Akabueze. You gain full access to all 9 Hexagongs (as they become the full guided journey), allowing you to permanently map your progress, complete the full narrative arc, and use the entire Steeping Laboratory toolkit without restriction.
                            </p>
                            <button
                                disabled={loading || !user}
                                onClick={() => handleCheckout('journeyer')}
                                style={{
                                    background: 'transparent', border: `1px solid ${!user ? m.accent + '40' : m.accent}`, color: !user ? m.text2 : m.accent,
                                    padding: '0.6rem 1.2rem', fontFamily: 'var(--fMono)', fontSize: '0.8rem',
                                    letterSpacing: '0.15em', cursor: !user ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease',
                                    opacity: loading ? 0.5 : 1
                                }}
                                onMouseEnter={e => { if (user) { e.currentTarget.style.backgroundColor = m.accent; e.currentTarget.style.color = m.bg; } }}
                                onMouseLeave={e => { if (user) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = m.accent; } }}
                            >
                                {!user ? '[ ESTABLISH PRESENCE FIRST ]' : '[ SECURE YOUR COORDINATES ]'}
                            </button>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: m.surface, border: `2px solid ${m.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--fMono)', color: m.accent, fontWeight: 'bold', flexShrink: 0, boxShadow: `0 0 15px ${m.accent}60` }}>03</div>
                        <div style={{ padding: '1.5rem', border: `1px solid ${m.accent}80`, background: `${m.accent}18`, flexGrow: 1, borderRadius: 'var(--curve)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                <h3 style={{ fontFamily: 'var(--fMono)', color: m.accent, letterSpacing: '0.1em', fontSize: '1.1rem', margin: 0, textShadow: `0 0 10px ${m.accent}80` }}>THE INNERACTIVE MENTORSHIPS</h3>
                            </div>
                            <p style={{ fontFamily: 'var(--fBody)', color: m.text1, fontSize: '0.95rem', lineHeight: '1.6', margin: '0 0 1.5rem 0' }}>
                                The Cohort Calendar gives you access to scheduling live human mentorship, including Cohorts, Single Steeps, and the Depth Semester. This is for the navigator ready for sustained company in the work.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {/* Cohort Sessions */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: `1px dashed ${m.accent}30`, paddingBottom: '1.25rem' }}>
                                    <div style={{ flex: '1 1 200px' }}>
                                        <div style={{ fontFamily: 'var(--fMono)', color: m.accent, fontSize: '0.9rem', marginBottom: '0.25rem' }}>CREÅTIVE STEEPING :: Cohort Sessions</div>
                                        <div style={{ fontFamily: 'var(--fBody)', color: m.text2, fontSize: '0.85rem' }}>The Seven Essential steeps over nine weeks. Individual or In community. A fully guided Steeping experience.</div>
                                    </div>
                                    <button
                                        disabled={loading || !user}
                                        onClick={() => handleCheckout('cohort')}
                                        style={{ background: !user ? 'transparent' : m.accent, border: !user ? `1px solid ${m.accent}40` : 'none', color: !user ? m.text2 : m.bg, padding: '0.5rem 1rem', fontFamily: 'var(--fMono)', fontSize: '0.75rem', cursor: !user ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
                                    >
                                        {!user ? '[ ESTABLISH FIRST ]' : '[ SECURE $777 ]'}
                                    </button>
                                </div>
                                {/* Single Steeps */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: `1px dashed ${m.accent}30`, paddingBottom: '1.25rem' }}>
                                    <div style={{ flex: '1 1 200px' }}>
                                        <div style={{ fontFamily: 'var(--fMono)', color: m.accent, fontSize: '0.9rem', marginBottom: '0.25rem' }}>CREÅTIVE STEEPING :: Single Steeps</div>
                                        <div style={{ fontFamily: 'var(--fBody)', color: m.text2, fontSize: '0.85rem' }}>One prompt chosen for you in a <i>Bring Your Own Tea</i> hour with author and guide Kamau Zuberi Akabueze.</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            disabled={loading || !user}
                                            onClick={() => handleCheckout('single_steep_1')}
                                            style={{ background: 'transparent', border: `1px solid ${!user ? m.accent + '40' : m.accent}`, color: !user ? m.text2 : m.accent, padding: '0.5rem 1rem', fontFamily: 'var(--fMono)', fontSize: '0.75rem', cursor: !user ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
                                        >
                                            {!user ? '[ ESTABLISH FIRST ]' : '[ 1X $222 ]'}
                                        </button>
                                        <button
                                            disabled={loading || !user}
                                            onClick={() => handleCheckout('single_steep_3')}
                                            style={{ background: 'transparent', border: `1px solid ${!user ? m.accent + '40' : m.accent}`, color: !user ? m.text2 : m.accent, padding: '0.5rem 1rem', fontFamily: 'var(--fMono)', fontSize: '0.75rem', cursor: !user ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
                                        >
                                            {!user ? '[ ESTABLISH FIRST ]' : '[ 3X $600 ]'}
                                        </button>
                                    </div>
                                </div>
                                {/* Depth Semester */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div style={{ flex: '1 1 200px' }}>
                                        <div style={{ fontFamily: 'var(--fMono)', color: m.accent, fontSize: '0.9rem', marginBottom: '0.25rem' }}>CREÅTIVE STEEPING :: The Depth Semester</div>
                                        <div style={{ fontFamily: 'var(--fBody)', color: m.text2, fontSize: '0.85rem' }}>A three month exploration into the essence of your being, closing with your Creative Brief.</div>
                                    </div>
                                    <button
                                        disabled={loading || !user}
                                        onClick={() => handleCheckout('depth_semester')}
                                        style={{ background: 'transparent', border: `1px solid ${!user ? m.accent + '40' : m.accent}`, color: !user ? m.text2 : m.accent, padding: '0.5rem 1rem', fontFamily: 'var(--fMono)', fontSize: '0.75rem', cursor: !user ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
                                    >
                                        {!user ? '[ ESTABLISH FIRST ]' : '[ SECURE $2,222 ]'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
