import React, { useState } from 'react';

export function Vessel00Detail({ modeString, playStrikingBowl }) {
    const [reason, setReason] = useState('');
    const [anchored, setAnchored] = useState(false);

    const MODES = {
        incandescent: { accent: "#d4922a", text1: "#fff0d9", text2: "#a88b68", bg: "rgba(212,146,42,0.05)" },
        oceanic: { accent: "#38bdf8", text1: "#e0f2fe", text2: "#7dd3fc", bg: "rgba(56,189,248,0.05)" },
        emergent: { accent: "#e5e5e5", text1: "#ffffff", text2: "#a3a3a3", bg: "rgba(229,229,229,0.05)" }
    };
    const m = MODES[modeString] || MODES.incandescent;

    const handleAnchor = () => {
        if (reason.trim() !== '') {
            setAnchored(true);
            playStrikingBowl(50); // Deep grounding bowl strike
        }
    };

    return (
        <div style={{ marginTop: 'var(--space-xxl)', marginBottom: 'var(--space-xl)', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--fMono)', letterSpacing: '0.2em', color: m.accent, textTransform: 'uppercase', fontSize: '0.8rem', marginBottom: 'var(--space-lg)' }}>
                [ The Initial Anchor ]
            </h3>

            <div style={{
                position: 'relative', padding: 'var(--space-xl)', background: anchored ? m.bg : 'rgba(0,0,0,0.5)',
                border: anchored ? `1px solid ${m.accent}` : `1px dashed ${m.text2}`,
                transition: 'all 1.8s cubic-bezier(0.16, 1, 0.3, 1)', display: 'flex', flexDirection: 'column', alignItems: 'center',
                width: '100%', maxWidth: '700px', margin: '0 auto'
            }}>

                <div style={{ fontFamily: 'var(--fSerif)', fontSize: '1.6rem', color: m.text1, fontStyle: 'italic', marginBottom: '1.5rem', opacity: anchored ? 0.4 : 1 }}>
                    I am here because...
                </div>

                {!anchored ? (
                    <>
                        <input
                            type="text"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAnchor();
                                else if (e.key.length === 1) playStrikingBowl(e.keyCode);
                            }}
                            placeholder="[ STATE YOUR REASON ]"
                            style={{
                                background: 'transparent', border: 'none', borderBottom: `1px solid ${m.text1}`,
                                color: m.text1, fontFamily: 'var(--fBody)', fontSize: '1.4rem',
                                textAlign: 'center', width: '90%', outline: 'none', paddingBottom: '0.8rem',
                                marginBottom: '2rem'
                            }}
                        />
                        <button
                            onClick={handleAnchor}
                            disabled={!reason}
                            style={{
                                padding: '0.8rem 2rem', background: 'transparent',
                                border: `1px solid ${m.accent}`, color: m.accent,
                                fontFamily: 'var(--fMono)', textTransform: 'uppercase', letterSpacing: '0.2em',
                                cursor: reason ? 'pointer' : 'default', opacity: reason ? 1 : 0.4,
                                transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}>
                            <b>[ ACKNOWLEDGE ]</b>
                        </button>
                    </>
                ) : (
                    <div style={{ animation: 'floatUp 1.8s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                        <div style={{ fontFamily: 'var(--fBody)', fontSize: '1.4rem', color: m.text1, lineHeight: 1.6, marginBottom: '1.5rem' }}>
                            "{reason}"
                        </div>
                        <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.7rem', color: m.accent, letterSpacing: '0.4em' }}>
                            <b>[ THE ANCHOR IS SET ]</b>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
