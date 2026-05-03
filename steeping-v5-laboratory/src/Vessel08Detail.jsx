import React, { useState } from 'react';

export function Vessel08Detail({ modeString, playAlgoraveSynth, playStrikingBowl }) {
    const [signature, setSignature] = useState('');
    const [signed, setSigned] = useState(false);

    const MODES = {
        incandescent: { accent: "#d4922a", text1: "#fff0d9", text2: "#a88b68", bg: "rgba(212,146,42,0.05)" },
        oceanic: { accent: "#38bdf8", text1: "#e0f2fe", text2: "#7dd3fc", bg: "rgba(56,189,248,0.05)" },
        emergent: { accent: "#e5e5e5", text1: "#ffffff", text2: "#a3a3a3", bg: "rgba(229,229,229,0.05)" }
    };
    const m = MODES[modeString] || MODES.incandescent;

    const handleSign = () => {
        if (signature.trim() !== '') {
            setSigned(true);
            playAlgoraveSynth(72); // A high, celebratory closing chord
            playStrikingBowl(100);
        }
    };

    return (
        <div style={{ marginTop: 'var(--space-xxl)', marginBottom: 'var(--space-xl)', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--fMono)', letterSpacing: '0.2em', color: m.accent, textTransform: 'uppercase', fontSize: '0.8rem', marginBottom: 'var(--space-lg)' }}>
                [ The Co-Creator's Seal ]
            </h3>

            <div style={{
                position: 'relative', padding: 'clamp(1rem, 4vw, var(--space-xl))', background: 'transparent',
                borderBottom: `1px solid ${signed ? m.accent : m.text2}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                width: '100%', maxWidth: '600px', margin: '0 auto',
                transition: 'all 2s cubic-bezier(0.16, 1, 0.3, 1)', boxSizing: 'border-box'
            }}>

                <div style={{ fontFamily: 'var(--fSerif)', fontSize: '1.2rem', color: m.text1, fontStyle: 'italic', marginBottom: '2rem', opacity: signed ? 0.4 : 1 }}>
                    By...
                </div>

                {!signed ? (
                    <>
                        <textarea
                            className="steeping-textarea"
                            rows={1}
                            value={signature}
                            onChange={(e) => setSignature(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSign(); }
                                else if (e.key.length === 1 && playStrikingBowl) playStrikingBowl(e.keyCode);
                            }}
                            onInput={(e) => {
                                e.target.style.height = 'auto';
                                e.target.style.height = e.target.scrollHeight + 'px';
                            }}
                            placeholder="[ SIGN YOUR RESONANCE ]"
                            style={{
                                borderBottom: `2px solid ${m.text1}`,
                                color: m.text1, fontFamily: 'var(--fSerif)', fontStyle: 'italic', fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                                textAlign: 'center', width: '100%', paddingBottom: '0.5rem',
                                marginBottom: '2rem', textTransform: 'capitalize'
                            }}
                        />
                        <button
                            onClick={handleSign}
                            disabled={!signature}
                            style={{
                                padding: '0.6rem 1.5rem', background: m.accent, color: '#000',
                                border: 'none', fontFamily: 'var(--fMono)', textTransform: 'uppercase',
                                letterSpacing: '0.2em', cursor: signature ? 'pointer' : 'default', fontWeight: 'bold',
                                opacity: signature ? 1 : 0.3, transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}>
                            <b>[ SEAL STEEPING NOTE ]</b>
                        </button>
                    </>
                ) : (
                    <div style={{ animation: 'floatUp 1.8s cubic-bezier(0.16, 1, 0.3, 1)', position: 'relative' }}>
                        <div style={{ fontFamily: 'var(--fSerif)', fontSize: 'clamp(1.8rem, 6vw, 3rem)', color: m.text1, fontStyle: 'italic', marginBottom: '1rem', wordBreak: 'break-word' }}>
                            {signature}
                        </div>
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                            width: '4px', height: '150%', background: m.accent, opacity: 0.3, filter: 'blur(2px)'
                        }} />
                        <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.7rem', color: m.accent, letterSpacing: '0.5em', marginTop: '1rem' }}>
                            <b>[ THE AUTHOR IS WITNESSED ]</b>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
