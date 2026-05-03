import React, { useState } from 'react';

export function Vessel05Detail({ modeString, playStrikingBowl }) {
    const [letter, setLetter] = useState('');

    const MODES = {
        incandescent: { accent: "#d4922a", text1: "#fff0d9", text2: "#a88b68", bg: "rgba(212,146,42,0.05)" },
        oceanic: { accent: "#38bdf8", text1: "#e0f2fe", text2: "#7dd3fc", bg: "rgba(56,189,248,0.05)" },
        emergent: { accent: "#e5e5e5", text1: "#ffffff", text2: "#a3a3a3", bg: "rgba(229,229,229,0.05)" }
    };
    const m = MODES[modeString] || MODES.incandescent;

    // Auto-resizing textarea
    const autoResize = (e) => {
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    return (
        <div style={{ marginTop: 'var(--space-xxl)', marginBottom: 'var(--space-xl)', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--fMono)', letterSpacing: '0.2em', color: m.accent, textTransform: 'uppercase', fontSize: '0.8rem', marginBottom: 'var(--space-lg)' }}>
                [ The Architect's Letter ]
            </h3>

            <div style={{
                position: 'relative', padding: 'clamp(1rem, 5vw, var(--space-xl))', background: 'rgba(0,0,0,0.5)',
                borderLeft: `2px solid ${m.accent}`, display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                width: '100%', maxWidth: '700px', margin: '0 auto', boxSizing: 'border-box'
            }}>
                <div style={{ fontFamily: 'var(--fSerif)', fontSize: '1.4rem', color: m.text1, marginBottom: '2rem', fontStyle: 'italic', opacity: 0.9 }}>
                    Dear...
                </div>

                <textarea
                    value={letter}
                    onChange={(e) => {
                        setLetter(e.target.value);
                        autoResize(e);
                    }}
                    onKeyDown={(e) => {
                        if (e.key.length === 1) playStrikingBowl(e.keyCode);
                    }}
                    placeholder="[ BEGIN TRANSMISSION ]"
                    style={{
                        background: 'transparent', border: 'none', color: m.text1, fontFamily: 'var(--fBody)',
                        fontSize: 'clamp(1rem, 4vw, 1.2rem)', lineHeight: 1.8, width: '100%', minHeight: '150px', outline: 'none',
                        resize: 'none', overflow: 'hidden'
                    }}
                />
            </div>
        </div>
    );
}
