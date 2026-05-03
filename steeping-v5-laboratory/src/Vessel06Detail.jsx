import React, { useState } from 'react';

export function Vessel06Detail({ modeString, playHarmonicChord, playStrikingBowl }) {
    const [name, setName] = useState('');
    const [question, setQuestion] = useState('');
    const [connected, setConnected] = useState(false);

    const MODES = {
        incandescent: { accent: "#d4922a", text1: "#fff0d9", text2: "#a88b68", bg: "rgba(212,146,42,0.05)" },
        oceanic: { accent: "#38bdf8", text1: "#e0f2fe", text2: "#7dd3fc", bg: "rgba(56,189,248,0.05)" },
        emergent: { accent: "#e5e5e5", text1: "#ffffff", text2: "#a3a3a3", bg: "rgba(229,229,229,0.05)" }
    };
    const m = MODES[modeString] || MODES.incandescent;

    const handleConnect = () => {
        if (name && question) {
            setConnected(true);
            playHarmonicChord(4); // Strike a bright chord connecting the nodes
        }
    };

    return (
        <div style={{ marginTop: 'var(--space-xxl)', marginBottom: 'var(--space-xl)', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--fMono)', letterSpacing: '0.2em', color: m.accent, textTransform: 'uppercase', fontSize: '0.8rem', marginBottom: 'var(--space-lg)' }}>
                [ The Echolocation Matrix ]
            </h3>

            <div style={{
                position: 'relative', padding: 'var(--space-xl)', background: 'rgba(0,0,0,0.5)',
                borderTop: `1px solid ${m.text2}`, borderBottom: `1px solid ${m.text2}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '700px', margin: '0 auto'
            }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '40%', textAlign: 'center' }}>
                        <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.7rem', color: m.text2, marginBottom: '0.5rem', opacity: 0.7 }}>
                            THE OBSERVER (YOU)
                        </div>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: m.accent, margin: '0 auto' }} />
                    </div>

                    <div style={{
                        flex: 1, height: '2px', background: connected ? m.text1 : 'rgba(255,255,255,0.1)',
                        transition: 'background 1.5s cubic-bezier(0.16, 1, 0.3, 1)', position: 'relative'
                    }}>
                        {connected && (
                            <div style={{
                                position: 'absolute', top: '-4px', left: '50%', width: '10px', height: '10px',
                                background: '#fff', borderRadius: '50%', animation: 'pingPong 3s infinite ease-in-out'
                            }} />
                        )}
                    </div>

                    <div style={{ width: '40%', textAlign: 'center' }}>
                        <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.7rem', color: m.text2, marginBottom: '0.5rem', opacity: 0.7 }}>
                            THE OBSERVED
                        </div>
                        <textarea
                            className="steeping-textarea"
                            rows={1}
                            disabled={connected}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); }
                                else if (e.key.length === 1 && playStrikingBowl) playStrikingBowl(e.keyCode);
                            }}
                            onInput={(e) => {
                                e.target.style.height = 'auto';
                                e.target.style.height = e.target.scrollHeight + 'px';
                            }}
                            placeholder="Their name..."
                            style={{
                                borderBottom: `1px solid ${m.accent}`,
                                color: m.text1, fontFamily: 'var(--fSerif)', fontStyle: 'italic', fontSize: '1.2rem',
                                textAlign: 'center', width: '80%'
                            }}
                        />
                    </div>
                </div>

                <div style={{ width: '100%', marginTop: '2rem' }}>
                    <textarea
                        className="steeping-textarea"
                        rows={3}
                        value={question}
                        disabled={connected}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleConnect(); }
                            else if (e.key.length === 1 && playStrikingBowl) playStrikingBowl(e.keyCode);
                        }}
                        onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                        placeholder="The question you wish to ask them..."
                        style={{
                            background: 'none', border: `1px dashed ${m.text2}`, color: m.text1,
                            fontFamily: 'var(--fBody)', fontSize: '1.1rem', padding: '1rem', width: '100%', minHeight: '80px',
                            opacity: connected ? 0.5 : 1
                        }}
                    />
                </div>

                {!connected ? (
                    <button
                        onClick={handleConnect}
                        style={{
                            marginTop: '2rem', padding: '0.8rem 2rem', background: 'transparent', border: `1px solid ${m.accent}`,
                            color: m.accent, fontFamily: 'var(--fMono)', textTransform: 'uppercase', letterSpacing: '0.2em',
                            cursor: 'pointer', opacity: name && question ? 1 : 0.4
                        }}>
                        <b>[ ESTABLISH LINK ]</b>
                    </button>
                ) : (
                    <div style={{ marginTop: '2rem', fontFamily: 'var(--fMono)', color: m.accent, letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: '0.8rem', animation: 'floatUp 1s ease' }}>
                        <b>[ CONNECTION SYNTHESIZED ]</b>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes pingPong {
                    0% { transform: translateX(-150px); opacity: 0.2; }
                    50% { transform: translateX(150px); opacity: 1; filter: blur(2px); }
                    100% { transform: translateX(-150px); opacity: 0.2; }
                }
            `}</style>
        </div>
    );
}
