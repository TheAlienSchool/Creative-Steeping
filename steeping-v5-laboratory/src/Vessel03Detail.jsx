import React, { useState } from 'react';

export function Vessel03Detail({ modeString, playStrikingBowl }) {
    const [belief, setBelief] = useState('');
    const [crossedOut, setCrossedOut] = useState(false);

    const MODES = {
        incandescent: { accent: "#d4922a", text1: "#fff0d9", text2: "#a88b68", bg: "rgba(212,146,42,0.05)" },
        oceanic: { accent: "#38bdf8", text1: "#e0f2fe", text2: "#7dd3fc", bg: "rgba(56,189,248,0.05)" },
        emergent: { accent: "#e5e5e5", text1: "#ffffff", text2: "#a3a3a3", bg: "rgba(229,229,229,0.05)" }
    };
    const m = MODES[modeString] || MODES.incandescent;

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && belief.trim() !== '') {
            setCrossedOut(true);
            playStrikingBowl(45); // Deep gong sound
        } else if (e.key.length === 1 && !crossedOut) {
            playStrikingBowl(e.keyCode);
        }
    };

    return (
        <div style={{ marginTop: 'var(--space-xxl)', marginBottom: 'var(--space-xl)', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--fMono)', letterSpacing: '0.2em', color: m.accent, textTransform: 'uppercase', fontSize: '0.8rem', marginBottom: 'var(--space-lg)' }}>
                [ The Mirror Gazing Ceremony ]
            </h3>

            <div style={{
                position: 'relative',
                padding: 'var(--space-xl)',
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                overflow: 'hidden'
            }}>
                {/* Simulated Water Reflection */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: 'radial-gradient(circle at 50% 120%, rgba(255,255,255,0.05), transparent 70%)',
                    pointerEvents: 'none',
                    opacity: 0.8
                }} />

                <div style={{ zIndex: 2, width: '100%', maxWidth: '600px' }}>
                    <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.8rem', color: m.text2, marginBottom: '2rem', opacity: 0.7 }}>
                        <b>[ IDENTIFY THE BELIEF CLOUDING YOUR WATER. STRIKE ENTER TO SHATTER IT. ]</b>
                    </div>

                    <input
                        type="text"
                        value={belief}
                        onChange={(e) => setBelief(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={crossedOut}
                        placeholder="I have always believed..."
                        style={{
                            background: 'transparent', border: 'none', borderBottom: `1px solid ${crossedOut ? 'transparent' : m.text2}`,
                            color: crossedOut ? m.text2 : m.text1, fontFamily: 'var(--fSerif)', fontStyle: 'italic', fontSize: '1.8rem',
                            textAlign: 'center', width: '100%', outline: 'none', paddingBottom: '0.5rem',
                            textDecoration: crossedOut ? 'line-through' : 'none',
                            textDecorationColor: m.accent, textDecorationThickness: '3px',
                            transition: 'all 1.8s cubic-bezier(0.16, 1, 0.3, 1)',
                            opacity: crossedOut ? 0.3 : 1
                        }}
                    />

                    {crossedOut && (
                        <div style={{
                            marginTop: '2rem', fontFamily: 'var(--fMono)', fontSize: '0.9rem', color: m.accent,
                            letterSpacing: '0.2em', textTransform: 'uppercase', animation: 'floatUp 2s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}>
                            <b>[ THE BELIEF IS DISSOLVED ]</b>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
