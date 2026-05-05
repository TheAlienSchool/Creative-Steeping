import React, { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from './supabaseClient';
import { useSteepingCircles } from './useSteepingCircles';
import { formatDistanceToNow } from 'date-fns';
import { Activity, Clock, PenTool, Hash, BookOpen, Users, Radio } from 'lucide-react';
import { SteamSansEngine } from './SteamSansEngine';

export const SteepingSpaceDashboard = ({ m, onEnterPortal, onSignOut }) => {
    const { user, profile } = useAuth();
    // Hook up the new backend architecture
    const { activeCircles, myCircle, membranePings, enrollInCircle } = useSteepingCircles();
    
    const [ledgers, setLedgers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalTime: 0, totalKeystrokes: 0, totalInk: 0, completed: 0 });

    useEffect(() => {
        // ... (existing ledger code) ...
        const fetchLedgers = async () => {
            if (!user) return;
            try {
                const { data, error } = await supabase
                    .from('steeping_ledgers')
                    .select('*')
                    .eq('profile_id', user.id)
                    .order('updated_at', { ascending: false });

                if (!error && data) {
                    setLedgers(data);
                    
                    let tTime = 0, tKeys = 0, tInk = 0, tComp = 0;
                    data.forEach(l => {
                        if (l.is_completed) tComp += 1;
                        if (l.interaction_metrics) {
                            tTime += l.interaction_metrics.time_spent_seconds || 0;
                            tKeys += l.interaction_metrics.keystrokes_played || 0;
                            tInk += l.interaction_metrics.ink_strokes || 0;
                        }
                    });
                    setStats({ totalTime: tTime, totalKeystrokes: tKeys, totalInk: tInk, completed: tComp });
                }
            } catch (e) {
                console.error("Ledger retrieval fractured.", e);
            } finally {
                setLoading(false);
            }
        };
        fetchLedgers();
    }, [user]);

    const formatDuration = (secs) => {
        const min = Math.floor(secs / 60);
        return min > 0 ? `${min}m ${secs % 60}s` : `${secs}s`;
    };

    return (
        <div style={{
            minHeight: '100vh', width: '100vw', backgroundColor: m.bg, color: m.text1,
            position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center',
            paddingTop: 'calc(var(--navH) + var(--space-xl))', overflowX: 'hidden', overflowY: 'auto',
            animation: 'fadeIn 2s ease forwards'
        }}>
            {/* Ambient Background Glow & Video matching the active Mode */}
            <div style={{
                position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: '120vw', height: '120vh',
                background: `radial-gradient(circle at center, ${m.accent}08 0%, transparent 60%)`,
                zIndex: 0, pointerEvents: 'none', overflow: 'hidden'
            }}>
                {m.name !== "Dark Matter" && (
                    <video autoPlay loop muted playsInline style={{ 
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: '100%', height: '100%', objectFit: 'cover', 
                        opacity: 0.15, mixBlendMode: 'screen', filter: 'contrast(1.2)' 
                    }}>
                        <source src={`${import.meta.env.BASE_URL}assets/videos/rock_ocean.mp4`} type="video/mp4" />
                    </video>
                )}
            </div>

            {/* Top Navigation */}
            <header style={{
                width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: 'var(--space-md) clamp(1rem, 5vw, var(--space-xl))', zIndex: 10, position: 'relative'
            }}>
                <div style={{ fontFamily: 'var(--fMono)', color: m.accent, letterSpacing: '0.4rem', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    <b>THE DEPARTMENT OF ONTOLOGICAL DESIGN</b>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-xl)', alignItems: 'center' }}>
                    <button
                        onClick={onEnterPortal}
                        style={{
                            background: 'none', border: 'none', color: m.text1, borderBottom: `1px solid ${m.accent}`,
                            fontFamily: 'var(--fMono)', fontSize: '0.65rem', letterSpacing: '0.2em',
                            cursor: 'pointer', transition: 'all 0.4s ease', textTransform: 'uppercase'
                        }}
                    >
                        [ RESUME JOURNEY ]
                    </button>
                    <button
                        onClick={onSignOut}
                        style={{
                            background: 'none', border: 'none', color: m.text2,
                            fontFamily: 'var(--fMono)', fontSize: '0.65rem', letterSpacing: '0.2em',
                            cursor: 'pointer', transition: 'color 0.4s ease', textTransform: 'uppercase'
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = m.accent}
                        onMouseLeave={e => e.currentTarget.style.color = m.text2}
                    >
                        [ DEPART ]
                    </button>
                </div>
            </header>

            {/* Core Instrument Gateway */}
            <div style={{
                flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                width: '100%', maxWidth: '1200px', zIndex: 1, padding: 'var(--space-xxl) clamp(1rem, 5vw, 2rem)', textAlign: 'center', boxSizing: 'border-box'
            }}>
                
                <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.8rem', color: m.accent, letterSpacing: '0.25em', marginBottom: 'var(--space-lg)', opacity: 0.8 }}>
                    YOUR STEEP CONTINUES
                </div>

                <h1 style={{
                    fontFamily: 'var(--fSerif)', fontSize: 'clamp(4rem, 8vw, 8rem)',
                    color: m.text1, fontWeight: 300, margin: '0 0 var(--space-md) 0', lineHeight: 0.9,
                    letterSpacing: '-0.02em', fontStyle: 'italic'
                }}>
                    The Architecture <br />
                    <span style={{ color: m.accent, opacity: 0.9 }}>of the Pause.</span>
                </h1>

                <div style={{
                    fontFamily: 'var(--fBody)', fontSize: 'clamp(1rem, 2vw, 1.3rem)', color: m.text2,
                    lineHeight: 1.8, maxWidth: '600px', margin: 'var(--space-xl) auto var(--space-xl)',
                    borderLeft: `1px solid ${m.accent}40`, borderRight: `1px solid ${m.accent}40`,
                    padding: '0 clamp(1rem, 5vw, var(--space-lg))'
                }}>
                    You are back. The instrument is ready. Your reflection picks up where it left you.
                </div>

                {/* Telemetry Dashboard Layer */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 'var(--space-lg)', width: '100%', marginBottom: 'var(--space-xxl)'
                }}>
                    <StatBox title="ACTIVE PAUSES" value={formatDuration(stats.totalTime)} icon={<Clock size={16} />} m={m} />
                    <StatBox title="VESSELS DECODED" value={`${stats.completed} / 21`} icon={<BookOpen size={16} />} m={m} />
                    <StatBox title="TYPOGRAPHIC RESONANCE" value={`${stats.totalKeystrokes} Keys`} icon={<Hash size={16} />} m={m} />
                    <StatBox title="SOMATIC INK STROKES" value={stats.totalInk} icon={<PenTool size={16} />} m={m} />
                </div>

                {/* THE STEAM SANS BIOFEEDBACK INSTALLATION */}
                <SteamSansEngine m={m} />

                {/* THE COLLECTIVE RESONANCE (STEEPING CIRCLES UI) */}
                <div style={{ width: '100%', textAlign: 'left', marginBottom: 'var(--space-xxl)', border: `1px solid ${m.accent}40`, padding: 'clamp(1rem, 5vw, var(--space-xl))', background: `linear-gradient(45deg, ${m.accent}05 0%, transparent 100%)`, boxSizing: 'border-box' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontFamily: 'var(--fMono)', fontSize: '0.8rem', color: m.accent, letterSpacing: '0.25em', marginBottom: '1.5rem', borderBottom: `1px dashed ${m.accent}40`, paddingBottom: '0.8rem', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={16} /> [ THE COLLECTIVE ]</div>
                        <div style={{ fontSize: '0.55rem', color: m.text2, opacity: 0.6, letterSpacing: '0.15em' }}>// ÆQ·06 THE INCOMPLETE PICTURE THEOREM: YOUR IMAGE + THEIR IMAGE = COMPLETE HISTORY</div>
                    </div>
                    
                    {myCircle ? (
                         <div>
                            <div style={{ fontFamily: 'var(--fSerif)', fontSize: '2rem', fontStyle: 'italic', color: m.text1, marginBottom: '0.5rem' }}>
                                Cohort: {myCircle.theme}
                            </div>
                            <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.7rem', color: m.text2, letterSpacing: '0.1em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Radio size={14} style={{ color: m.accent, animation: membranePings.length > 0 ? 'event-flash 2s infinite' : 'none' }} />
                                MEMBRANE CONNECTION SECURED
                            </div>
                            {/* Live Membrane Pings Preview */}
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {membranePings.slice(-10).map((ping, i) => (
                                    <span key={i} title={`${ping.action_type} - ${new Date(ping.created_at).toLocaleTimeString()}`} style={{
                                        width: '8px', height: '8px', borderRadius: '50%', background: m.accent,
                                        opacity: 0.2 + (0.8 * (i / 10)), /* Fade elder pings */
                                        boxShadow: `0 0 8px ${m.accent}`
                                    }} />
                                ))}
                            </div>
                         </div>
                    ) : (
                         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                            {activeCircles.length > 0 ? activeCircles.map(circle => (
                                <div key={circle.id} style={{ border: `1px solid ${m.accent}20`, padding: '1rem' }}>
                                    <div style={{ fontFamily: 'var(--fSerif)', fontSize: '1.4rem', color: m.text1, fontStyle: 'italic', marginBottom: '0.5rem' }}>{circle.theme}</div>
                                    <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.text2, letterSpacing: '0.1em', marginBottom: '1rem' }}>Initiated: {circle.active_start_date}</div>
                                    <button 
                                        onClick={() => enrollInCircle(circle.id)}
                                        style={{ background: m.accent, color: m.bg, border: 'none', padding: '8px 16px', fontFamily: 'var(--fMono)', fontSize: '0.7rem', letterSpacing: '0.15em', cursor: 'pointer' }}
                                    >
                                        [ JOIN COHORT ]
                                    </button>
                                </div>
                            )) : (
                                <div style={{ fontFamily: 'var(--fBody)', color: m.text2, fontStyle: 'italic' }}>
                                    The waters are still. No public cohorts are currently gathering.
                                </div>
                            )}
                         </div>
                    )}
                </div>

                {/* Ledger Roll / The Writer's Room */}
                <div style={{ width: '100%', textAlign: 'left', marginTop: 'var(--space-xl)' }}>
                    <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.8rem', color: m.accent, letterSpacing: '0.25em', marginBottom: 'var(--space-lg)', borderBottom: `1px solid ${m.accent}40`, paddingBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap'}}>
                        <span>[ THE WRITER'S ROOM ]</span>
                        <span style={{ fontSize: '0.55rem', color: m.text2, opacity: 0.6, letterSpacing: '0.15em' }}>// ÆQ·16 THE PRESENT CREATION THEOREM: PRESENT → CREATES → PAST</span>
                    </div>

                    {loading ? (
                        <div style={{ color: m.text2, fontFamily: 'var(--fMono)' }}>Extracting records...</div>
                    ) : ledgers.length === 0 ? (
                        <div style={{ color: m.text2, fontFamily: 'var(--fBody)', fontStyle: 'italic' }}>
                            The ledger is blank. Step into the matrix to leave a trace.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                            {ledgers.map(ledger => (
                                <div key={ledger.id} style={{ 
                                    border: `1px solid ${m.accent}20`, padding: 'clamp(1rem, 5vw, var(--space-xl))', 
                                    background: `linear-gradient(135deg, ${m.accent}05 0%, transparent 100%)`,
                                    position: 'relative', overflow: 'hidden', boxSizing: 'border-box'
                                }}>
                                    {ledger.is_completed && (
                                        <div style={{ position: 'absolute', top: 0, right: 0, background: m.accent, color: m.bg, fontFamily: 'var(--fMono)', fontSize: '0.6rem', padding: '4px 8px', letterSpacing: '0.1em' }}>
                                            INTEGRATED
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-md)' }}>
                                        <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.9rem', color: m.accent, letterSpacing: '0.2em' }}>
                                            VESSEL {ledger.hexagong_num}
                                        </div>
                                        <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.7rem', color: m.text2, opacity: 0.6 }}>
                                            {formatDistanceToNow(new Date(ledger.updated_at), { addSuffix: true })}
                                        </div>
                                    </div>

                                    <div style={{ fontFamily: 'var(--fBody)', fontSize: '1.2rem', color: m.text1, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                                        {ledger.interaction_text}
                                    </div>

                                    {/* Embedded Telemetry for the individual log */}
                                    {ledger.interaction_metrics && (
                                        <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-lg)', paddingTop: 'var(--space-md)', borderTop: `1px dashed ${m.accent}20`, fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.text2, opacity: 0.8 }}>
                                            <span>TIME: {formatDuration(ledger.interaction_metrics.time_spent_seconds || 0)}</span>
                                            <span>•</span>
                                            <span>KEYS: {ledger.interaction_metrics.keystrokes_played || 0}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Elemental Science of Encouragement & Gratitude */}
                <div style={{
                    marginTop: '15vh', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-md)'
                }}>
                    <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.text2, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.6 }}>
                        The friction you feel is the sound of your capacity expanding.
                    </div>
                    <div style={{ fontFamily: 'var(--fSerif)', fontStyle: 'italic', fontSize: '1.5rem', color: m.accent, opacity: 0.9 }}>
                        Thank you for honoring the weight of your own attention.
                    </div>
                </div>

                {/* Technical Diagnostic Anchor */}
                <div style={{
                    marginTop: '10vh', fontFamily: 'var(--fMono)', fontSize: '0.6rem', color: m.accent,
                    letterSpacing: '0.3em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.4
                }}>
                    <span style={{ width: '30px', height: '1px', background: m.accent }}></span>
                    COGNITIVE LATTICE: SYNCHRONIZED
                    <span style={{ width: '30px', height: '1px', background: m.accent }}></span>
                </div>
            </div>
        </div>
    );
};

// Sub-component for clean telemetry rendering
const StatBox = ({ title, value, icon, m }) => (
    <div style={{ 
        border: `1px solid ${m.accent}30`, 
        padding: 'clamp(1rem, 4vw, var(--space-lg))', 
        display: 'flex', flexDirection: 'column', gap: '8px',
        background: `linear-gradient(180deg, ${m.accent}05 0%, transparent 100%)`, boxSizing: 'border-box'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: m.accent, fontFamily: 'var(--fMono)', fontSize: '0.65rem', letterSpacing: '0.15em' }}>
            <span style={{ opacity: 0.8 }}>{icon}</span>
            <span>{title}</span>
        </div>
        <div style={{ fontFamily: 'var(--fSerif)', fontSize: '1.8rem', color: m.text1, fontStyle: 'italic' }}>
            {value}
        </div>
    </div>
);
