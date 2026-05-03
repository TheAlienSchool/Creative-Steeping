import React, { useState } from 'react';

export function Vessel01Detail({ modeString, playStrikingBowl }) {
    const [iam, setIam] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const MODES = {
        incandescent: { accent: "#d4922a", text1: "#fff0d9", text2: "#a88b68", bg: "rgba(212,146,42,0.05)" },
        oceanic: { accent: "#38bdf8", text1: "#e0f2fe", text2: "#7dd3fc", bg: "rgba(56,189,248,0.05)" },
        emergent: { accent: "#e5e5e5", text1: "#ffffff", text2: "#a3a3a3", bg: "rgba(229,229,229,0.05)" }
    };
    const m = MODES[modeString] || MODES.incandescent;

    const handleSubmit = (e) => {
        if (e.key === 'Enter' && iam.trim() !== '') {
            setSubmitted(true);
            playStrikingBowl(100);
        }
    };

    return (
        <div style={{ marginTop: 'var(--space-xxl)', marginBottom: 'var(--space-xl)', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--fMono)', letterSpacing: '0.2em', color: m.accent, textTransform: 'uppercase', fontSize: '0.8rem', marginBottom: 'var(--space-lg)' }}>
                [ The Core Assertion ]
            </h3>

            {!submitted ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontFamily: 'var(--fSerif)', fontSize: '2rem', fontStyle: 'italic', color: m.text1 }}>
                        I am
                    </div>
                    <textarea
                        className="steeping-textarea"
                        rows={1}
                        value={iam}
                        onChange={(e) => setIam(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) { 
                                e.preventDefault(); 
                                if (iam.trim() !== '') {
                                    handleSubmit(e);
                                    e.target.blur();
                                }
                            }
                            else if (e.key.length === 1 && playStrikingBowl) playStrikingBowl(e.keyCode);
                        }}
                        onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                        autoFocus
                        style={{
                            borderBottom: `2px solid ${m.accent}`,
                            color: m.accent,
                            fontFamily: 'var(--fSerif)',
                            fontSize: '2rem',
                            fontStyle: 'italic',
                            textAlign: 'center',
                            width: '100%',
                            maxWidth: '500px',
                            paddingBottom: '0.5rem'
                        }}
                    />
                    <div style={{ fontSize: '0.7rem', color: m.accent, fontFamily: 'var(--fMono)', marginTop: '2rem', opacity: 0.6, letterSpacing: '0.15em' }}>
                        <b>[ PRESS ENTER TO CAST YOUR ASSERTION ]</b>
                    </div>
                </div>
            ) : (
                <div style={{
                    padding: 'clamp(1rem, 4vw, var(--space-xl))',
                    border: `1px solid ${m.accent}`,
                    background: m.bg,
                    animation: 'floatUp 1.2s ease-out',
                    boxSizing: 'border-box'
                }}>
                    <div style={{ fontFamily: 'var(--fSerif)', fontSize: 'clamp(1.5rem, 6vw, 2.5rem)', fontStyle: 'italic', color: m.text1, marginBottom: '1rem', wordBreak: 'break-word' }}>
                        I am {iam}.
                    </div>
                    <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.8rem', color: m.accent, letterSpacing: '0.2em' }}>
                        <b>[ ASSERTION ANCHORED ]</b>
                    </div>
                </div>
            )}
        </div>
    );
}
