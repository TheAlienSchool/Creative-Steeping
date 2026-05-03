import React, { useState } from 'react';

export function Vessel04Detail({ modeString, playHarmonicChord, playStrikingBowl }) {
    const [coherence, setCoherence] = useState(0);
    const [area, setArea] = useState('');

    const MODES = {
        incandescent: { accent: "#d4922a", text1: "#fff0d9", text2: "#a88b68", bg: "rgba(212,146,42,0.05)", bright: "rgba(212,146,42,0.8)" },
        oceanic: { accent: "#38bdf8", text1: "#e0f2fe", text2: "#7dd3fc", bg: "rgba(56,189,248,0.05)", bright: "rgba(56,189,248,0.8)" },
        emergent: { accent: "#e5e5e5", text1: "#ffffff", text2: "#a3a3a3", bg: "rgba(229,229,229,0.05)", bright: "rgba(229,229,229,0.8)" }
    };
    const m = MODES[modeString] || MODES.incandescent;

    return (
        <div style={{ marginTop: 'var(--space-xxl)', marginBottom: 'var(--space-xl)', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--fMono)', letterSpacing: '0.2em', color: m.accent, textTransform: 'uppercase', fontSize: '0.8rem', marginBottom: 'var(--space-lg)' }}>
                [ Tuning Coherence ]
            </h3>

            <div style={{
                position: 'relative', padding: 'var(--space-xl)', background: 'rgba(0,0,0,0.5)', border: `1px solid ${m.text2}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: coherence === 100 ? 0.9 : 1
            }}>
                <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.8rem', color: m.text1, marginBottom: '2rem', opacity: 0.8 }}>
                    Name the area of fragmentation:
                </div>

                <textarea
                    className="steeping-textarea"
                    rows={1}
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="E.g., My daily routine..."
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) { 
                            e.preventDefault(); 
                            e.target.blur(); // Dismiss soft keyboard gently on mobile
                        }
                        else if (e.key.length === 1 && playStrikingBowl) {
                            playStrikingBowl(e.keyCode);
                        }
                    }}
                    onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                    style={{
                        borderBottom: `2px solid ${m.accent}`,
                        color: m.text1, fontFamily: 'var(--fSerif)', fontStyle: 'italic', fontSize: '1.4rem',
                        textAlign: 'center', width: '80%', maxWidth: '400px', paddingBottom: '0.5rem',
                        marginBottom: '3rem'
                    }}
                />

                {area.length > 2 && (
                    <div style={{ width: '100%', maxWidth: '400px', animation: 'floatUp 1s ease' }}>
                        <div style={{
                            fontFamily: 'var(--fMono)', fontSize: '0.7rem', color: m.accent, marginBottom: '1rem',
                            letterSpacing: '0.2em', opacity: 0.8
                        }}>
                            <b>[ SLIDE TO ALIGN ]</b>
                        </div>
                        <input
                            type="range"
                            min="0" max="100" value={coherence}
                            onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                setCoherence(val);
                                if (val % 25 === 0 && val > 0) playHarmonicChord(val);
                            }}
                            style={{
                                width: '100%', cursor: 'pointer', appearance: 'none', background: 'rgba(255,255,255,0.1)',
                                height: '2px', outline: 'none'
                            }}
                        />
                        <div style={{
                            marginTop: '2rem',
                            width: '40px', height: '40px',
                            borderRadius: '50%',
                            background: m.bright,
                            margin: '2rem auto 0 auto',
                            boxShadow: `0 0 ${coherence * 1.5}px ${m.accent}`,
                            filter: `blur(${100 - coherence}px)`,
                            transition: 'all 1.8s cubic-bezier(0.16, 1, 0.3, 1)'
                        }} />

                        {coherence === 100 && (
                            <div style={{
                                marginTop: '2rem', fontFamily: 'var(--fMono)', fontSize: '0.9rem',
                                color: m.text1, letterSpacing: '0.3em', textTransform: 'uppercase'
                            }}>
                                <b>[ ALIGNMENT ANCHORED ]</b>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
