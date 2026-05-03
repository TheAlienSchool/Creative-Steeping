import React, { useState } from 'react';

export function Vessel07Detail({ modeString, playAlgoraveSynth, playStrikingBowl, playCompletionCue }) {
    const [intention, setIntention] = useState('');
    const [activated, setActivated] = useState(false);

    const MODES = {
        incandescent: { accent: "#d4922a", text1: "#fff0d9", text2: "#a88b68", bg: "rgba(212,146,42,0.05)" },
        oceanic: { accent: "#38bdf8", text1: "#e0f2fe", text2: "#7dd3fc", bg: "rgba(56,189,248,0.05)" },
        emergent: { accent: "#e5e5e5", text1: "#ffffff", text2: "#a3a3a3", bg: "rgba(229,229,229,0.05)" }
    };
    const m = MODES[modeString] || MODES.incandescent;

    const handleActivate = () => {
        if (intention) {
            setActivated(true);
            if (playCompletionCue) playCompletionCue(); // Oracle's 7-note ascending mystical arpeggio
            setTimeout(() => playStrikingBowl(100), 800);
        }
    };

    return (
        <div style={{ marginTop: 'var(--space-xxl)', marginBottom: 'var(--space-xl)', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--fMono)', letterSpacing: '0.2em', color: m.accent, textTransform: 'uppercase', fontSize: '0.8rem', marginBottom: 'var(--space-lg)' }}>
                [ Point of Activation ]
            </h3>

            <div style={{
                position: 'relative', padding: 'clamp(1rem, 4vw, var(--space-xl))', background: activated ? m.bg : 'rgba(0,0,0,0.5)',
                border: activated ? `2px solid ${m.text1}` : `1px solid ${m.text2}`,
                transition: 'all 2s cubic-bezier(0.16, 1, 0.3, 1)', display: 'flex', flexDirection: 'column', alignItems: 'center',
                width: '100%', maxWidth: '700px', margin: '0 auto', boxShadow: activated ? `0 0 40px ${m.accent}` : 'none', boxSizing: 'border-box'
            }}>

                <div style={{ fontFamily: 'var(--fSerif)', fontSize: '1.8rem', fontStyle: 'italic', color: m.text1, marginBottom: '2rem', opacity: activated ? 0.4 : 1 }}>
                    I am ready to...
                </div>

                {!activated ? (
                    <>
                        <textarea
                            className="steeping-textarea"
                            rows={1}
                            value={intention}
                            onChange={(e) => setIntention(e.target.value)}
                            onInput={(e) => {
                                e.target.style.height = "auto";
                                e.target.style.height = e.target.scrollHeight + "px";
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey && intention) {
                                    e.preventDefault();
                                    handleActivate();
                                }
                            }}
                            placeholder="[ DECLARE YOUR ACTION ]"
                            style={{
                                borderBottom: `2px solid ${m.accent}`,
                                color: m.accent, fontFamily: 'var(--fSerif)', fontStyle: 'italic', fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                                textAlign: 'center', paddingBottom: '1rem', width: '100%', boxSizing: 'border-box',
                                marginBottom: '2rem'
                            }}
                        />
                        <button
                            onClick={handleActivate}
                            disabled={!intention}
                            style={{
                                padding: '1rem 3rem', background: intention ? m.accent : 'transparent',
                                border: `1px solid ${m.accent}`, color: intention ? '#000' : m.accent,
                                fontFamily: 'var(--fMono)', textTransform: 'uppercase', letterSpacing: '0.3em',
                                cursor: intention ? 'pointer' : 'default', transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)', fontWeight: 'bold'
                            }}>
                            <b>[ RELEASE ARROW ]</b>
                        </button>
                    </>
                ) : (
                    <div style={{ animation: 'floatUp 1.8s cubic-bezier(0.16, 1, 0.3, 1)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ fontFamily: 'var(--fSerif)', fontSize: 'clamp(1.8rem, 6vw, 2.5rem)', color: m.text1, fontStyle: 'italic', marginBottom: '2rem', lineHeight: 1.4, wordBreak: 'break-word' }}>
                            I am ready to {intention}.
                        </div>
                        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: m.accent, opacity: 0.1, animation: 'pulse 2s infinite alternate', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                        <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.9rem', color: m.accent, letterSpacing: '0.4em' }}>
                            <b>[ THE ARCHER HAS FIRED ]</b>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
