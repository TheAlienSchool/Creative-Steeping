import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// ==========================================
// VESSEL 02: THE SCIENTIFIC & HISTORICAL CASE
// ==========================================

const TIMELINE_NODES = [
    { year: "2737 BCE", text: "Emperor Shennong writes the first lines of history as the wind carries a single leaf into his boiling water." },
    { year: "350 CE", text: "The ancient Chinese dictionary Erh Ya makes the first written record of 'cha'." },
    { year: "780 CE", text: "Lu Yu publishes The Classic of Tea (Cha Jing), the definitive code of cultivation and spiritual practice." },
    { year: "805 CE", text: "Monks Saicho and Kukai bring the first seeds to Japan, where a new lineage of contemplative focus takes root." },
    { year: "1191 CE", text: "Eisai writes Kissa Yojoki, elevating the leaf beyond agriculture into medicine for the mind." },
    { year: "1391 CE", text: "The Ming Dynasty abolishes compressed cakes; loose-leaf tea is born, allowing the leaf to truly breathe and unfurl." },
    { year: "1500s", text: "Sen no Rikyu formalizes the Japanese tea ceremony (Chanoyu) around harmony, respect, purity, and tranquility." },
    { year: "1559 CE", text: "Venetian writer Giambattista Ramusio introduces tea to Europe, the beginning of a global transformation." },
    { year: "1662 CE", text: "Catherine of Braganza brings the tea habit to the English court. The ceremony morphs into an institution." },
    { year: "1839 CE", text: "Discovery of indigenous Camellia in India permanently reshapes global trade routes and access." },
    { year: "1949 CE", text: "Science identifies L-theanine, the unique amino acid responsible for the leaf's signature relaxed alertness." },
    { year: "2001 CE", text: "The Default Mode Network is named, mapping the exact neurological state that steeping has induced for millennia." },
    { year: "2024 CE", text: "CREÅTIVE STEEPING is codified. The ancient technology of the cup is weaponized for original thought." }
];

const L_THEANINE_STEPS = [
    "Camellia sinensis",
    "L-theanine extraction",
    "Alpha wave promotion",
    "Relaxed alertness",
    "Creative insight"
];

export function Vessel02Detail({ modeString, playStrikingBowl, playHarmonicChord }) {
    // 1. Theme Configuration
    const MODES = {
        incandescent: { accent: "#d4922a", text1: "#fff0d9", text2: "#a88b68", bg: "rgba(212,146,42,0.05)" },
        oceanic: { accent: "#38bdf8", text1: "#e0f2fe", text2: "#7dd3fc", bg: "rgba(56,189,248,0.05)" },
        emergent: { accent: "#e5e5e5", text1: "#ffffff", text2: "#a3a3a3", bg: "rgba(229,229,229,0.05)" }
    };
    const m = MODES[modeString] || MODES.incandescent;

    // 2. Transcendent Timeline logic handled by <TimelineNode>

    // 3. 22-Minute Timer Logic
    const [timerActive, setTimerActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(22 * 60);

    useEffect(() => {
        const handleState = (e) => {
            const { activeTimer, timeLeft: newTimeLeft } = e.detail;
            if (activeTimer === 22) {
                setTimerActive(true);
                setTimeLeft(newTimeLeft);
            } else {
                setTimerActive(false);
                setTimeLeft(22 * 60);
            }
        };
        window.addEventListener('global-timer-state', handleState);
        return () => window.removeEventListener('global-timer-state', handleState);
    }, []);

    const handleTimerClick = () => {
        window.dispatchEvent(new CustomEvent('start-global-timer', { detail: 22 }));
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <div className="vessel-02-expanded" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 'var(--space-xl)', paddingTop: 'var(--space-xl)' }}>

            {/* 1. TIMELINE DESCENT (VERTICAL SCROLL) */}
            <h3 style={{ fontFamily: 'var(--fMono)', fontSize: '0.8rem', letterSpacing: '0.15em', color: m.accent, textTransform: 'uppercase', marginBottom: 'var(--space-xxl)' }}>
                5,000 Years in the Cup: A Descent
            </h3>

            <div className="timeline-vertical-descent" style={{ position: 'relative', paddingLeft: 'clamp(1rem, 3vw, 2rem)', paddingBottom: '10vh' }}>
                {/* The central spine */}
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: 'clamp(1rem, 3vw, 2rem)', width: '1px', background: `linear-gradient(to bottom, transparent, ${m.accent}60, transparent)` }} />

                {TIMELINE_NODES.map((node, i) => (
                    <TimelineNode
                        key={i}
                        node={node}
                        index={i}
                        m={m}
                        playHarmonicChord={playHarmonicChord}
                    />
                ))}
            </div>

            {/* 2. INFOGRAPHIC 01: L-THEANINE MECHANISM */}
            <div style={{ marginTop: 'var(--space-xl)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={m.accent} strokeWidth="1.5">
                        <path d="M12 2v20 M2 12h20 M5 5l14 14 M5 19L19 5" strokeOpacity="0.3" />
                        <circle cx="12" cy="12" r="7" stroke={m.accent} strokeWidth="1" />
                        <circle cx="12" cy="12" r="2" fill={m.accent} />
                        <path d="M12 5 A 7 7 0 0 1 19 12" stroke={m.text1} strokeWidth="1.5" />
                    </svg>
                    <h3 style={{ fontFamily: 'var(--fMono)', fontSize: '0.8rem', letterSpacing: '0.15em', color: m.accent, textTransform: 'uppercase', margin: 0 }}>
                        The Mechanism of Alertness
                    </h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                    {L_THEANINE_STEPS.map((step, i) => (
                        <React.Fragment key={i}>
                            <div
                                style={{
                                    background: m.bg, border: `1px solid ${m.accent}`,
                                    padding: 'var(--space-sm) var(--space-md)', borderRadius: '4px',
                                    fontFamily: 'var(--fBody)', color: m.text1, textAlign: 'center', flex: '1 1 auto',
                                    cursor: 'pointer', transition: 'all 1.8s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}
                                onMouseEnter={(e) => {
                                    if (playStrikingBowl) playStrikingBowl(60 + (i * 4)); // Ascending harmonic pattern
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                    e.currentTarget.style.boxShadow = `0 0 25px ${m.accent}60, inset 0 0 15px ${m.accent}30`;
                                    e.currentTarget.style.borderColor = m.text1;
                                    e.currentTarget.style.textShadow = `0 0 10px ${m.text1}`;
                                    e.currentTarget.style.color = '#fff';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'none';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.borderColor = m.accent;
                                    e.currentTarget.style.textShadow = 'none';
                                    e.currentTarget.style.color = m.text1;
                                }}
                            >
                                {step}
                            </div>
                            {i < L_THEANINE_STEPS.length - 1 && (
                                <div style={{ color: m.accent, opacity: 0.5, flex: '0 0 auto' }}>→</div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* 3. INFOGRAPHIC 02: THE 22-MINUTE INTERVAL */}
            <div style={{ marginTop: 'var(--space-xxl)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-lg)', alignItems: 'center' }}>
                <div>
                    <h3 style={{ fontFamily: 'var(--fMono)', fontSize: '0.8rem', letterSpacing: '0.15em', color: m.accent, textTransform: 'uppercase', marginBottom: 'var(--space-md)' }}>
                        The 22-Minute Interval
                    </h3>
                    <p style={{ fontFamily: 'var(--fBody)', color: m.text1, lineHeight: 1.7, fontSize: '1.1rem' }}>
                        Why 22 minutes? It is the minimum viable steeping duration required to cross neurological thresholds.
                        When task-positive focus ceases, the brain switches to the <b>Default Mode Network (DMN)</b>.
                        This is the seat of daydreaming, memory sorting, and non-linear dot connecting.
                        By occupying your hands with tea, and removing external input, you effectively hot-wire the DMN.
                    </p>
                </div>
                <div
                    onClick={handleTimerClick}
                    style={{
                        position: 'relative', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: m.bg, borderRadius: '8px', border: `1px dashed ${timerActive ? m.accent : m.accent + '80'}`, cursor: 'pointer',
                        boxShadow: timerActive ? `0 0 40px ${m.accent}30, inset 0 0 20px ${m.accent}20` : 'none',
                        transition: 'all 1.8s cubic-bezier(0.16, 1, 0.3, 1)',
                        overflow: 'hidden'
                    }}
                    onMouseEnter={e => { if (!timerActive) e.currentTarget.style.borderColor = m.accent }}
                    onMouseLeave={e => { if (!timerActive) e.currentTarget.style.borderColor = `${m.accent}80` }}
                >
                    {/* Geometric Temporal Mandala */}
                    <svg viewBox="0 0 100 100" style={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: `translate(-50%, -50%) rotate(${timerActive ? (22 * 60 - timeLeft) * 0.5 : 0}deg)`,
                        width: '180%', height: '180%', opacity: timerActive ? 0.3 : 0.08, pointerEvents: 'none',
                        transition: 'transform 1.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.8s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                        <circle cx="50" cy="50" r="45" fill="none" stroke={m.accent} strokeWidth="0.2" strokeDasharray="1 3" />
                        <circle cx="50" cy="50" r="35" fill="none" stroke={m.accent} strokeWidth="0.5" />
                        <circle cx="50" cy="50" r="20" fill="none" stroke={m.text1} strokeWidth="0.2" />
                        <path d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M18 82 L82 18" stroke={m.accent} strokeWidth="0.15" />
                        <polygon points="50,10 84.6,30 84.6,70 50,90 15.4,70 15.4,30" fill="none" stroke={m.accent} strokeWidth="0.3" />
                    </svg>

                    <div style={{ textAlign: 'center', zIndex: 2 }}>
                        <div style={{ fontFamily: 'var(--fMono)', fontSize: '3rem', color: m.accent, lineHeight: 1, textShadow: timerActive ? `0 0 20px ${m.accent}` : 'none', transition: 'text-shadow 0.6s' }}>
                            {formatTime(timeLeft)}
                        </div>
                        <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.8rem', color: m.text2, letterSpacing: '0.2em', marginTop: '4px', textShadow: timerActive ? `0 0 12px ${m.text2}` : 'none', transition: 'text-shadow 0.6s' }}>
                            {timerActive ? <b>[ STEEPING... ]</b> : <b>[ COMMENCE ]</b>}
                        </div>
                    </div>
                    {/* A soft glowing pulse to represent the DMN, active when timer is running */}
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: '120px', height: '120px', borderRadius: '50%', background: m.accent, filter: 'blur(40px)',
                        opacity: timerActive ? 0.4 : 0.1,
                        animation: timerActive ? 'pulse 2s infinite alternate' : 'none',
                        transition: 'opacity 1s'
                    }} />
                </div>
            </div>

            {/* 4. INFOGRAPHIC 03: WHY NOW */}
            <div style={{ marginTop: 'var(--space-xxl)', background: m.bg, padding: 'var(--space-xl)', borderLeft: `2px solid ${m.accent}` }}>
                <h3 style={{ fontFamily: 'var(--fMono)', fontSize: '0.8rem', letterSpacing: '0.15em', color: m.accent, textTransform: 'uppercase', marginBottom: 'var(--space-md)' }}>
                    Why Now? The Necessity of the Practice
                </h3>
                <p style={{ fontFamily: 'var(--fBody)', color: m.text1, fontSize: '1.2rem', lineHeight: 1.6 }}>
                    We are entering an era saturated by <b>automated content infused with accelerated efficiency</b>.
                    When execution approaches zero-cost and creative pace is hyperactive, original thought becomes the only remaining competitive advantage because <b>original thought operates at the pace of life</b>.
                    Steeping is the analog technology required to <b>cultivate and protect your unique resonant signature</b> against the noise, to <b>ease the impact of burnout</b>, and to <b>upgrade time with the self</b> into a conscious creative practice.
                </p>
            </div>

            {/* 5. KzA VOICE PARAGRAPH (Authored by KzA) */}
            <div style={{ marginTop: 'var(--space-xxl)', textAlign: 'center', maxWidth: '700px', margin: 'var(--space-xxl) auto 0 auto' }}>
                <div style={{ fontFamily: 'var(--fSerif)', fontStyle: 'italic', fontSize: '1.4rem', color: m.text1, lineHeight: 1.8 }}>
                    "<b>I taught my self to steep</b> because my behavior was moving faster than my clarity. I was making decisions based on <b>unconscious desires for emotional safety</b>. I learned to understand that I can only offer this kind of safety to my self. Contemplating <b>the patience of awakening</b> to my flavor — <b>the transference of my essence</b> and the practice of <b>steeping in union</b> — changed the way I see tea, and uplifted the way I see me."
                </div>
                <div style={{ fontFamily: 'var(--fMono)', color: m.accent, opacity: 0.8, fontSize: '0.8rem', letterSpacing: '0.15em', marginTop: 'var(--space-md)' }}>
                    — KAMAU ZUBERI AKABUEZE
                </div>
            </div>

            <style>{`
        @keyframes pulse {
          0% { opacity: 0.1; transform: translate(-50%, -50%) scale(0.9); }
          100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1.1); }
        }
      `}</style>
        </div>
    );
}

// ----------------------------------------------------
// THE OMNIPRESENT TIMELINE NODE (INTERACTIVE WAYPOINT)
// ----------------------------------------------------
const TimelineNode = ({ node, index, m, playHarmonicChord }) => {
    return (
        <div
            className="timeline-node"
            onMouseEnter={() => {
                if (playHarmonicChord) playHarmonicChord(index);
            }}
            style={{
                position: 'relative',
                marginBottom: '10vh',
                marginLeft: 'clamp(1.5rem, 5vw, 3rem)',
                opacity: 0.6,
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'default'
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateX(12px)';
                e.currentTarget.children[0].style.width = '14px';
                e.currentTarget.children[0].style.height = '14px';
                e.currentTarget.children[0].style.boxShadow = `0 0 20px ${m.accent}, 0 0 10px #fff`;
                e.currentTarget.children[1].style.color = m.accent;
                e.currentTarget.children[1].style.textShadow = `0 0 12px ${m.accent}80`;
                e.currentTarget.children[2].style.textShadow = `0 0 16px ${m.text1}50`;
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.opacity = '0.6';
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.children[0].style.width = '8px';
                e.currentTarget.children[0].style.height = '8px';
                e.currentTarget.children[0].style.boxShadow = 'none';
                e.currentTarget.children[1].style.color = m.text1;
                e.currentTarget.children[1].style.textShadow = 'none';
                e.currentTarget.children[2].style.textShadow = 'none';
            }}
        >
            {/* The structural glyph marker on the line */}
            <div style={{
                position: 'absolute', top: '12px', left: 'clamp(-3rem, -5vw, -1.5rem)',
                width: '8px', height: '8px',
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%', backgroundColor: m.accent,
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
            }} />

            <div style={{
                fontFamily: 'var(--fMono)', color: m.text1,
                fontWeight: 'bold', marginBottom: 'var(--space-sm)',
                fontSize: '1.1rem', letterSpacing: '0.05em',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                ✥ {node.year}
            </div>

            <div className="timeline-text" style={{
                fontFamily: 'var(--fBody)', color: m.text1, lineHeight: 1.6,
                fontSize: 'clamp(1rem, 4vw, 1.25rem)',
                maxWidth: '600px',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                {node.text}
            </div>
        </div>
    );
};
