import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function SteepingCalendar({ m, onClose, playStrikingBowl, playAlgoraveSynth }) {
    const [echoes, setEchoes] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);

    // Initialize the Sonar Array (The Days of the Month)
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const radarNodes = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    useEffect(() => {
        if (playStrikingBowl) playStrikingBowl(100);
        
        // Fetch the user's historical PINGs (Sage interactions, vessel drifts, etc.)
        try {
            const history = JSON.parse(localStorage.getItem('steeping_historical_score') || '[]');
            setEchoes(history);
        } catch (e) {
            console.error("Failed to load sonar history", e);
        }
    }, [playStrikingBowl]);

    // Check if a specific day has an echo
    const getEchoForDay = (day) => {
        return echoes.filter(echo => {
            const echoDate = new Date(echo.timestamp);
            return echoDate.getDate() === day && echoDate.getMonth() === new Date().getMonth();
        });
    };

    const handleNodeClick = (day, dayEchoes) => {
        setSelectedNode({ day, echoes: dayEchoes });
        if (playAlgoraveSynth) {
            playAlgoraveSynth(dayEchoes.length > 0 ? 80 : 40, 'incandescent');
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100dvh',
                backgroundColor: m.bg, zIndex: 99999, display: 'flex', flexDirection: 'column',
                color: m.text1, overflow: 'hidden'
            }}
        >
            {/* The Sonar Sweeper Background */}
            <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: '150vw', height: '150vw', border: `1px solid ${m.text2}10`, borderRadius: '50%',
                pointerEvents: 'none', zIndex: 0, display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}>
                <div style={{
                    width: '100%', height: '100%', borderRadius: '50%',
                    background: `conic-gradient(from 0deg, transparent 0deg 340deg, ${m.accent}40 360deg)`,
                    animation: 'spin 12s linear infinite', opacity: 0.3
                }} />
                {/* Concentric Radar Rings */}
                {[1, 2, 3, 4].map(ring => (
                    <div key={ring} style={{
                        position: 'absolute', width: `${ring * 20}%`, height: `${ring * 20}%`,
                        border: `1px dashed ${m.accent}20`, borderRadius: '50%', opacity: 0.5
                    }} />
                ))}
            </div>

            <div className="compass-header" style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: 'var(--space-lg) var(--space-xl)', borderBottom: `1px solid ${m.text2}20`,
                fontFamily: 'var(--fMono)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.2em',
                position: 'relative', zIndex: 10
            }}>
                <div style={{ display: 'flex', gap: 'var(--space-xl)', opacity: 0.8 }}>
                    <span className="compass-brand-label">THE MEMBRANE CANVAS</span>
                    <span style={{ color: m.accent }}>SONAR LOG & ECHOLOCATION</span>
                </div>
                <button 
                    onClick={() => { if(playStrikingBowl) playStrikingBowl(40); onClose(); }}
                    style={{
                        background: 'none', border: `1px solid ${m.text2}40`, color: m.text1,
                        padding: '8px 16px', fontFamily: 'var(--fMono)', fontSize: '0.65rem', letterSpacing: '0.2em',
                        cursor: 'pointer', transition: 'all 0.4s ease'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = m.text1; e.currentTarget.style.color = m.bg; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = m.text1; }}
                >
                    [ DISCONNECT RADAR ]
                </button>
            </div>

            <div style={{ flex: 1, display: 'flex', position: 'relative', zIndex: 10 }}>
                
                {/* LEFT: The Sonar Grid */}
                <div style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-xl)' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: 'var(--space-md)',
                        width: '100%',
                        maxWidth: '800px'
                    }}>
                        {/* Days of week header */}
                        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                            <div key={day} style={{
                                textAlign: 'center', fontFamily: 'var(--fMono)', fontSize: '0.65rem',
                                color: m.text2, letterSpacing: '0.2em', opacity: 0.6, marginBottom: 'var(--space-md)'
                            }}>
                                {day}
                            </div>
                        ))}

                        {/* Calendar Pad (simplified start day for now) */}
                        {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay() }).map((_, i) => (
                            <div key={`empty-${i}`} />
                        ))}

                        {radarNodes.map(day => {
                            const dayEchoes = getEchoForDay(day);
                            const isPingActive = dayEchoes.length > 0;
                            const isSelected = selectedNode?.day === day;

                            return (
                                <button
                                    key={day}
                                    onClick={() => handleNodeClick(day, dayEchoes)}
                                    style={{
                                        aspectRatio: '1/1',
                                        background: isSelected ? m.accent : (isPingActive ? `${m.accent}20` : 'transparent'),
                                        border: `1px solid ${isSelected ? m.accent : (isPingActive ? m.accent : m.text2 + '20')}`,
                                        borderRadius: '50%', // Round nodes like radar blips
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        color: isSelected ? '#000' : (isPingActive ? m.accent : m.text2),
                                        fontFamily: 'var(--fMono)', fontSize: '1rem',
                                        cursor: 'pointer', transition: 'all 0.4s ease',
                                        boxShadow: isPingActive ? `0 0 15px ${m.accent}40` : 'none',
                                        position: 'relative'
                                    }}
                                    onMouseEnter={e => {
                                        if (!isSelected) {
                                            e.currentTarget.style.background = `${m.accent}40`;
                                            e.currentTarget.style.color = '#fff';
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (!isSelected) {
                                            e.currentTarget.style.background = isPingActive ? `${m.accent}20` : 'transparent';
                                            e.currentTarget.style.color = isPingActive ? m.accent : m.text2;
                                        }
                                    }}
                                >
                                    {day}
                                    {isPingActive && (
                                        <div style={{
                                            position: 'absolute', bottom: '15%',
                                            width: '4px', height: '4px', borderRadius: '50%',
                                            background: isSelected ? '#000' : m.accent,
                                            boxShadow: `0 0 8px ${isSelected ? '#000' : m.accent}`
                                        }} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT: The Diagnostics / Echo Details */}
                <div style={{
                    flex: 1, borderLeft: `1px solid ${m.text2}20`, background: `${m.bg}90`, backdropFilter: 'blur(10px)',
                    padding: 'var(--space-xxl) var(--space-xl)', overflowY: 'auto', display: 'flex', flexDirection: 'column'
                }}>
                    <h2 style={{ fontFamily: 'var(--fMono)', fontSize: '0.85rem', color: m.accent, letterSpacing: '0.3em', marginBottom: 'var(--space-xl)' }}>
                        [ ECHO DIAGNOSTICS ]
                    </h2>
                    
                    {!selectedNode ? (
                        <div style={{ fontFamily: 'var(--fSerif)', fontStyle: 'italic', color: m.text2, fontSize: '1.2rem', opacity: 0.7 }}>
                            Select a node on the radar to review the resonance of that cycle.
                        </div>
                    ) : (
                        <div>
                            <div style={{ fontFamily: 'var(--fSerif)', fontSize: '3rem', color: m.text1, lineHeight: 1, marginBottom: 'var(--space-md)' }}>
                                Cycle {selectedNode.day}
                            </div>
                            <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.75rem', color: m.accent, letterSpacing: '0.2em', marginBottom: 'var(--space-xxl)', opacity: 0.8 }}>
                                {selectedNode.echoes.length > 0 ? 'MEMBRANE ACTIVE' : 'MEMBRANE QUIET'}
                            </div>

                            {selectedNode.echoes.length === 0 ? (
                                <div style={{ fontFamily: 'var(--fBody)', color: m.text2, fontSize: '1.1rem', lineHeight: 1.6 }}>
                                    No outward pulse detected. The space was held in stillness.
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                                    {selectedNode.echoes.map((echo, idx) => (
                                        <div key={idx} style={{
                                            padding: 'var(--space-md)', border: `1px solid ${m.accent}40`,
                                            background: `${m.surface}80`, borderRadius: '4px'
                                        }}>
                                            <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.text2, letterSpacing: '0.15em', marginBottom: 'var(--space-sm)' }}>
                                                PULSE TIME: {new Date(echo.timestamp).toLocaleTimeString()}
                                            </div>
                                            <div style={{ fontFamily: 'var(--fSerif)', fontSize: '1.2rem', fontStyle: 'italic', color: m.text1, marginBottom: 'var(--space-sm)' }}>
                                                "{echo.query}"
                                            </div>
                                            {/* Look for SANscription badge in the response to display visually */}
                                            {echo.response && echo.response.includes('[ STBL') ? (
                                                <div style={{
                                                    marginTop: 'var(--space-sm)', display: 'inline-block',
                                                    padding: '4px 8px', background: `${m.accent}20`, color: m.accent,
                                                    fontFamily: 'var(--fMono)', fontSize: '0.65rem', letterSpacing: '0.1em'
                                                }}>
                                                    {echo.response.match(/\[ STBL(.*?)\]/)[0]}
                                                </div>
                                            ) : (
                                                <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.accent, letterSpacing: '0.1em' }}>
                                                    [ STRUCTURAL ECHO RECORDED ]
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            
            <style>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </motion.div>
    );
}
