import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSteepingIssues } from './RegistrySteepingNotes';

const SongbookGlossaryItem = ({ term, definition, m }) => {
    const [isHovered, setIsHovered] = useState(false);
    const spanRef = useRef(null);

    useEffect(() => {
        if (!isHovered) return;
        const close = (e) => {
            if (spanRef.current && !spanRef.current.contains(e.target)) {
                setIsHovered(false);
            }
        };
        document.addEventListener('click', close);
        return () => document.removeEventListener('click', close);
    }, [isHovered]);

    return (
        <span
            ref={spanRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={(e) => { e.stopPropagation(); setIsHovered(h => !h); }}
            style={{
                position: 'relative', cursor: 'help',
                borderBottom: `1px dashed ${m.accent}80`,
                color: isHovered ? m.accent : 'inherit',
                transition: 'all 0.3s ease',
                display: 'inline-block', lineHeight: 1
            }}
        >
            {term}
            {isHovered && (
                <span className="glossary-tooltip" style={{
                    position: 'absolute', bottom: '130%', left: '50%', transform: 'translateX(-50%)',
                    width: 'max-content', maxWidth: 'min(300px, calc(100vw - 40px))',
                    backgroundColor: 'rgba(0,0,0,0.9)', border: `1px solid ${m.accent}60`,
                    padding: '0.8rem', zIndex: 1100,
                    fontFamily: 'var(--fMono)', fontSize: '0.7rem', color: m.accent,
                    lineHeight: 1.5, textAlign: 'left', letterSpacing: '0.05em',
                    boxShadow: `0 10px 30px rgba(0,0,0,0.8), 0 0 15px ${m.accent}40`,
                    animation: 'fadeIn 0.2s ease forwards'
                }}>
                    <b style={{ color: '#fff', display: 'block', marginBottom: '0.3em', fontSize: '0.75rem' }}>{term.toUpperCase()}</b>
                    {definition}
                    
                    {/* Subatomic Ping Indicator */}
                    <div style={{
                        position: 'absolute', bottom: '-4px', left: '50%', transform: 'translateX(-50%)',
                        width: '0', height: '0', borderLeft: '4px solid transparent',
                        borderRight: '4px solid transparent', borderTop: `4px solid ${m.accent}60`
                    }}></div>
                </span>
            )}
            <span style={{
                display: 'inline-block', width: '4px', height: '4px', borderRadius: '50%',
                backgroundColor: m.accent, marginLeft: '3px', verticalAlign: 'super',
                opacity: isHovered ? 1 : 0.3, boxShadow: isHovered ? `0 0 8px ${m.accent}` : 'none',
                transition: 'all 0.3s ease'
            }}></span>
        </span>
    );
};


// ── RIPPLE KEYFRAME ───────────────────────────────────────────────────────────
if (typeof document !== 'undefined' && !document.getElementById('sn-ripple-style')) {
    const s = document.createElement('style');
    s.id = 'sn-ripple-style';
    s.textContent = `
        @keyframes rippleOut {
            0%   { transform: translate(-50%,-50%) scale(0); opacity: 0.6; }
            100% { transform: translate(-50%,-50%) scale(3); opacity: 0; }
        }
    `;
    document.head.appendChild(s);
}

// ── SAGE CONTEXT MAP — rich study guide metadata per note ────────────────────
const SAGE_CONTEXT = {
    steam:       { series: 'COSMOLOGY', freq: 60, kicker: 'The Carrier Wave of Transformation', sage: 'Steam is the bridge between the inner and outer universe. TURAO receives it. Every act of steeping generates it. Key concepts: Steam, TURAO, Neutrino Stream, esse.' },
    dod:         { series: 'ARCHITECTURE', freq: 63, kicker: 'The Design of Being', sage: 'The Department of Ontological Design architects Capacity, not interfaces. Friction is source code. Key concepts: DOD, Capacity, Surface Tension, Ontological Design.' },
    pause:       { series: 'ARCHITECTURE', freq: 65, kicker: 'The Structure of Stillness', sage: 'The Pause is the most load-bearing pillar of any endeavor. Awareness Planning maps where not to act. Key concepts: Pause, Awareness Planning, a•i•Contemplation, Architecture.' },
    'night-sky': { series: 'CONSTELLATION', freq: 67, kicker: 'Grammar Written in Light', sage: 'Ten primary constellations map the phenomenology of the practice. The Cup, The Leaf, The Scribe. Each star is a teaching. Key concepts: Constellation Catalogue, Grammar, Celestial Navigation.' },
    flow:        { series: 'RHYTHM', freq: 69, kicker: 'The Pocket and the Algorithm of Å', sage: 'The Pocket is jazz. The Algorithm of Å is the Steeperverse. Both mark the moment Capacity and Intention align so completely that friction disappears. Key concepts: The Pocket, Flow, Algorithm of Å.' },
    neutrino:    { series: 'PHYSICS', freq: 71, kicker: 'The Signal That Passes Through Everything', sage: 'Neutrinos connect every practitioner in the Stream. The PING is the moment the Stream recognizes presence. Key concepts: Neutrino Stream, PING, Resonance, Connection.' },
    archive:     { series: 'MEMORY', freq: 72, kicker: 'The Nib Is Always Now', sage: 'The Archive of Presence maps the Scribe constellation — a chain of stars from first steep to now. History is summoned, not retrieved. Key concepts: Scribe, Archive, Memory Scrubber, The Nib.' },
    angles:      { series: 'GEOMETRY', freq: 74, kicker: 'Three Is The Magic Number', sage: 'The Trivium (Grammar-Logic-Rhetoric) is the architecture of knowing. Depth perception is triangulation. Bob Dorough + De La Soul + Pythagoras. Key concepts: Trivium, Triangle, Tetractys, Third Coordinate.' },
    decay:       { series: 'TIME', freq: 76, kicker: 'The Bell Always Knows', sage: 'Contemplation is the wine-aging model. The bell tone decays; the practitioner who mistakes the decay for depth has misread the score. Key concepts: Decay, a•i•Contemplation, Pause vs. Fear, Bell Envelope.' },
    rest:        { series: 'SILENCE', freq: 77, kicker: 'Notated, Held, Architectural', sage: 'John Cage. Miles Davis. The rest is a specific duration of held silence. The container must exist before the content arrives. Key concepts: Rest, 4′33″, Architectural Silence, Container.' },
    collabination: { series: 'SYNTHESIS', freq: 79, kicker: 'What None Could Generate Alone', sage: 'Three musicians. The Call and the Response. Awareness Planning holds the space between. The Merge phase of a•i•Contemplation is the Collabination moment. Key concepts: Collabination, Call & Response, Sequencer, Integration.' },
    trigram:     { series: 'GEOMETRY', freq: 81, kicker: 'The Desert Is a Horizontal Line', sage: 'The Triangle maps space. The Trigram (I Ching) maps change. Mars College 2026. Angle Awareness Day. 2³ = 8 trigrams = 8 energetic states. Key concepts: Trigram, Bagua, Triangle, Angle Awareness, Activity Theory.' },
    'arc-physics':     { series: 'THE ARC SERIES', freq: 82, kicker: 'Lean Into the Curve', sage: 'The arc is the angle of change. Rockets arc to escape gravity. Surface Tension is the atmosphere used to build velocity. The rim shot of physics. Key concepts: Arc, Surface Tension, Parabola, Resistance.' },
    'arc-temperature': { series: 'THE ARC SERIES', freq: 84, kicker: 'You Are Already On The Map', sage: 'Clarity is steeped, not consumed. Time + Temperature + Surrender. The Immanent Horizon is revealed by current coordinates. Key concepts: Immanent Horizon, Steeping, Temperature, Arrival.' },
    'arc-inbetween':   { series: 'THE ARC SERIES', freq: 86, kicker: 'The Change Is the Arc', sage: 'The in-between is not a waiting room — it is where Human Development Mathematics are written. Arriving fragile means rushing the arc. The bassline stops one note before resolution. Key concepts: In-Between, Intrepid Navigator, Arc, Fragile Arrival.' },
    'sound-of-becoming': { series: 'NEUROSCIENCE', freq: 88, kicker: 'Creative Steeping Is Already There', sage: 'Levitin\'s 7 mechanisms — full-brain activation, RAS, backdoor to memory, internal pharmacy, Swiss Army knife, Brodmann 47, ambiguity — all already operate inside every Steeping Space session. The Sonnet Engine is a phenomenological biofeedback loop, not physiological. Key concepts: Sonnet Engine, Music as Medicine, Dopamine Loop, Creative Aphasia, Preventative Architecture.' },
    turao:             { series: 'COSMOLOGY', freq: 90, kicker: 'The Universe Receiving All Offerings', sage: 'TURAO (Unified Nonidentical Intelligences Operating Naturally) is the exterior cosmos. Rock = stabilizing form, memory, structure. Ocean = flow, feeling, infinite emergence. Their union = the coastline where all creation happens at infinitesimal and cosmic scale simultaneously. Every offering steeped generates Steam that TURAO receives. Key concepts: TURAO, Steam, Tantra as loom, Rock-Ocean Union, Coastline Intelligence.' },
    anechoic:          { series: 'ARCHITECTURE', freq: 92, kicker: 'The Psychological Anechoic Chamber', sage: 'The Steeping Space is an anechoic chamber for the soul. It suspends the noise of external expectations so the subtle frequency of your own intuition becomes audible. Key concepts: Anechoic Chamber, Signal vs Noise, Steeping Space.' },
    knot:              { series: 'PHYSICS', freq: 94, kicker: 'The Anatomy of a Knot', sage: 'A knot forms when the fluid dance between intuition and ego loses its reversibility. Untying it requires resonance, not computation. It restores the feedback loop so identity can evolve. Key concepts: The Knot, Resonance, Fluidity, Reversibility.' },
    harmonic:          { series: 'GEOMETRY', freq: 96, kicker: 'Symbols of Harmonic Equivalence', sage: 'The :: = :: operator triangulates distinct languages describing the exact same physical mechanism. The Goosebump :: = :: The Score. You triangulate your intellect and your body. Key concepts: Harmonic Equivalence, The Score, Plural Now.' },
    watcher:           { series: 'COSMOLOGY', freq: 98, kicker: 'Consciousness is the ÅLïEN', sage: 'The silent watcher behind the eyes is the ÅLïEN, unchanged since childhood. It is the ground of being. Winning is the moment the field recognizes its own nature through you. Key concepts: ÅLïEN, The Watcher, Field Recognition.' },
    echosystem:        { series: 'ECOLOGY', freq: 100, kicker: 'An ECHO System for biodiversity', sage: 'An echosystem is an ECHO System for the biodiversity of opportunities life creates for Humanity. The echo is the sound of the future arriving to meet you. Key concepts: Echosystem, Biodiversity, Generative Feedback, TURAO.' },
    'three-states':    { series: 'TYPOGRAPHY', freq: 102, kicker: 'Three States. One Word.', sage: 'Every word in the instrument holds three simultaneous states (HARRIS, HBA, VAPOR). The reader\'s coordinate determines the state. The word does not change; the state changes. This is the foundation of Spacetime Linguistics.' }
};

// ── THE RESONANCE VAULT (Interactive Filtering Architecture) ───────────────
const ResonanceVault = ({ m, issues, activeIssue, setActiveIssue, playStrikingBowl, playAlgoraveSynth, onClose }) => {
    const [hoveredSeries, setHoveredSeries] = useState(null);

    // Group issues by series to extract the unique series names
    const seriesList = Array.from(new Set(issues.map(iss => SAGE_CONTEXT[iss.id]?.series || 'FIELD NOTES')));

    return (
        <div style={{ marginBottom: 'var(--space-xxl)', borderBottom: `1px solid ${m.accent}30`, paddingBottom: 'var(--space-xl)' }}>
            {/* Header row */}
            <div className="ledger-header" style={{ marginBottom: 'var(--space-lg)' }}>
                <div style={{ fontFamily: 'var(--fMono)', color: m.accent, letterSpacing: '0.3em', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <b>[ STEEPING NOTES LEDGER ]</b>
                    <span style={{ fontSize: '0.6rem', opacity: 0.5, padding: '2px 8px', border: `1px solid ${m.accent}40`, borderRadius: '12px' }}>
                        {issues.length} EXPLORATIONS
                    </span>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <button onClick={() => { try { document.getElementById('archive-of-presence').scrollIntoView({ behavior: 'smooth' }); } catch(e) {} }}
                        style={{ background: 'none', border: 'none', color: m.accent, fontFamily: 'var(--fMono)', fontSize: '0.75rem', letterSpacing: '0.15em', cursor: 'pointer', opacity: 0.8 }}>
                        <b>[ ARCHIVE ]</b>
                    </button>
                    <button onClick={onClose}
                        aria-label="Close Steeping Notes"
                        style={{ background: 'none', border: 'none', color: m.text1, fontFamily: 'var(--fMono)', fontSize: '0.75rem', letterSpacing: '0.15em', cursor: 'pointer', opacity: 0.5, transition: 'opacity 0.3s ease' }}
                        onMouseEnter={e => e.currentTarget.style.opacity = 1}
                        onMouseLeave={e => e.currentTarget.style.opacity = 0.5}>
                        <b>[ CLOSE ]</b>
                    </button>
                </div>
            </div>

            {/* The Lens Array (Filters) */}
            <div className="vault-optics" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: 'var(--space-xl)', borderBottom: `1px dashed ${m.accent}20`, paddingBottom: '1.2rem' }}
                 onMouseLeave={() => setHoveredSeries(null)}
            >
                <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.55rem', color: m.text2, letterSpacing: '0.2em', opacity: 0.6, alignSelf: 'center', marginRight: '1rem' }}>OPTICS:</div>
                {seriesList.map(series => (
                    <motion.div
                        key={series}
                        onMouseEnter={() => {
                            setHoveredSeries(series);
                            if (playAlgoraveSynth) {
                                // Optional subtle interaction on hover
                                // playAlgoraveSynth();
                            }
                        }}
                        style={{
                            fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.accent, letterSpacing: '0.15em',
                            cursor: 'crosshair', padding: '4px 8px', opacity: hoveredSeries === series ? 1 : 0.4,
                            borderBottom: hoveredSeries === series ? `1px solid ${m.accent}` : '1px solid transparent',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {series}
                    </motion.div>
                ))}
            </div>

            {/* The Vault Grid */}
            <motion.div 
                layout
                className="vault-grid"
                style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                    gap: '12px' 
                }}
            >
                <AnimatePresence>
                    {issues.map((iss, index) => {
                        const ctx = SAGE_CONTEXT[iss.id] || { series: 'FIELD NOTES', freq: 64, kicker: '', sage: '' };
                        const isHoveredFiltered = hoveredSeries && hoveredSeries !== ctx.series;
                        const isActive = activeIssue === iss.id;
                        
                        return (
                            <motion.button
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ 
                                    opacity: isHoveredFiltered ? 0.12 : 1, 
                                    y: 0,
                                    scale: isActive ? 1.02 : 1,
                                    filter: isHoveredFiltered ? 'grayscale(100%)' : 'grayscale(0%)'
                                }}
                                whileHover={{ scale: isHoveredFiltered ? 1 : 1.03, zIndex: 10 }}
                                onHoverStart={() => {
                                    if (playStrikingBowl) playStrikingBowl(ctx.freq);
                                }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                key={iss.id}
                                onClick={() => {
                                    setActiveIssue(iss.id);
                                    if (playStrikingBowl) playStrikingBowl(ctx.freq);
                                }}
                                style={{
                                    background: isActive ? `${m.accent}15` : 'rgba(0,0,0,0.4)',
                                    border: `1px solid ${isActive ? m.accent : m.accent + '25'}`,
                                    padding: '1.2rem',
                                    display: 'flex', flexDirection: 'column',
                                    position: 'relative', overflow: 'hidden',
                                    cursor: 'pointer', textAlign: 'left',
                                    minHeight: '120px',
                                    boxShadow: isActive ? `0 0 30px ${m.accent}30, inset 0 0 10px ${m.accent}10` : 'none',
                                }}
                            >
                                {/* Background glow for active */}
                                {isActive && <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at center, ${m.accent}20 0%, transparent 70%)` }} />}
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '1rem', position: 'relative', zIndex: 2 }}>
                                    <span style={{ fontFamily: 'var(--fMono)', fontSize: '0.55rem', color: m.accent, opacity: 0.7, letterSpacing: '0.15em' }}>NO. {String(index + 1).padStart(2, '0')}</span>
                                    <span style={{ fontFamily: 'var(--fMono)', fontSize: '0.55rem', color: m.text2, opacity: 0.6, letterSpacing: '0.1em' }}>{ctx.series}</span>
                                </div>

                                <div style={{ fontFamily: 'var(--fBody)', fontSize: '1.05rem', color: isActive ? m.accent : m.text1, lineHeight: 1.4, position: 'relative', zIndex: 2 }}>
                                    {iss.buttonLabel.replace(/\[|\]/g, '').trim()}
                                </div>
                                
                                {isActive && (
                                    <div style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', height: '2px', background: m.accent, animation: 'event-flash 4s infinite alternate' }} />
                                )}
                            </motion.button>
                        );
                    })}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export const SteepersLedger = ({ m, historicalScore = [], hasMoreHistory, loadMoreHistory, generateSonicSketch, onClose, playStrikingBowl, playAlgoraveSynth, askSage }) => {
    const [activeIssue, setActiveIssue] = useState('steam');

    // EH-04: Build a Sage context string from the active note
    // so any Sage inquiry from within the Ledger is note-aware
    const buildNoteContext = (issueId) => {
        const ctx = SAGE_CONTEXT[issueId];
        if (!ctx) return '';
        return `[STEEPING NOTE CONTEXT — ${ctx.series}: "${ctx.kicker}"] ${ctx.sage} Respond in full awareness of this note's themes.`;
    };

    const handleLedgerSage = (query, mode) => {
        if (!askSage) return;
        const notePrefix = buildNoteContext(activeIssue);
        const contextualQuery = notePrefix ? `${notePrefix}\n\nPractitioner inquiry: ${query}` : query;
        askSage(contextualQuery, mode);
    };

    const [selectionRect, setSelectionRect] = useState(null);
    const [selectedText, setSelectedText] = useState('');
    const [localReflections, setLocalReflections] = useState([]);
    const [turaoMode, setTuraoMode] = useState(false);
    const contentRef = useRef(null);   // ← scroll anchor for note top

    useEffect(() => {
        let timeout;
        const handleSelection = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const selection = window.getSelection();
                if (selection && !selection.isCollapsed && selection.toString().trim().length > 5 && selection.toString().trim().length < 400) {
                    const range = selection.getRangeAt(0);
                    const rect = range.getBoundingClientRect();
                    if (rect.width > 0) {
                        setSelectionRect({
                            top: rect.top - 40,
                            left: rect.left + (rect.width / 2)
                        });
                        setSelectedText(selection.toString().trim());
                    }
                } else if (selection && selection.isCollapsed) {
                    setSelectionRect(null);
                    setSelectedText('');
                }
            }, 100);
        };
        document.addEventListener('selectionchange', handleSelection);
        return () => {
            document.removeEventListener('selectionchange', handleSelection);
            clearTimeout(timeout);
        };
    }, []);

    const captureReflection = () => {
        if (!selectedText) return;
        const newEntry = {
            timestamp: new Date().toISOString(),
            query: `"${selectedText}"`,
            response: "This frequency was mirrored into the archive as a tended leaf.",
            mode: "reflection"
        };
        
        try {
            const history = JSON.parse(localStorage.getItem('steeping_historical_score') || '[]');
            localStorage.setItem('steeping_historical_score', JSON.stringify([newEntry, ...history]));
            setLocalReflections(prev => [newEntry, ...prev]);
        } catch(e) {}

        setSelectionRect(null);
        setSelectedText('');
        // Authentic ping
        if (playStrikingBowl) playStrikingBowl(72);
    };

    // ── Scroll to top of note content when issue changes ─────────────────────
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [activeIssue]);

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            backgroundColor: 'rgba(0,0,0,0.95)', // Darker, more immersive backdrop
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
            overflowY: 'auto', padding: '0',
            animation: 'fadeIn 1s ease forwards'
        }}>
            {turaoMode ? (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 2000, background: '#000',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                }}>
                    <video autoPlay loop muted playsInline style={{ position: 'absolute', width: '100vw', height: '100dvh', objectFit: 'cover', opacity: 0.6, filter: 'contrast(1.2)' }}>
                        <source src="/rock_ocean_animated.mp4" type="video/mp4" />
                    </video>
                    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 0%, #000 90%)' }}></div>
                    <div style={{
                        position: 'relative', zIndex: 10, fontFamily: 'var(--fMono)', color: m.accent,
                        fontSize: '3rem', letterSpacing: '0.4em', textTransform: 'uppercase',
                        textAlign: 'center', textShadow: `0 0 20px ${m.accent}`, animation: 'ontologicalBreathe 6s infinite'
                    }}>
                        T U R A O
                    </div>
                    <div style={{ position: 'relative', zIndex: 10, fontFamily: 'var(--fBody)', color: m.text1, fontSize: '1.2rem', marginTop: '1rem', fontStyle: 'italic' }}>
                        The Universe Receiving All Offerings.
                    </div>
                    
                    <button 
                        onClick={() => setTuraoMode(false)}
                        style={{
                            position: 'absolute', bottom: '3rem', right: '3rem', zIndex: 20,
                            background: 'none', border: `1px solid ${m.accent}50`, color: m.accent,
                            padding: '12px 24px', fontFamily: 'var(--fMono)', fontSize: '0.75rem',
                            letterSpacing: '0.15em', cursor: 'pointer', transition: 'all 0.4s ease',
                            backgroundColor: 'rgba(0,0,0,0.5)'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = m.accent; e.currentTarget.style.color = '#000'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.5)'; e.currentTarget.style.color = m.accent; }}
                    >
                        [ RETURN TO NOTES ]
                    </button>
                    {/* Algorave Reactive Grid Overlay */}
                    <div style={{
                        position: 'absolute', inset: 0, pointerEvents: 'none',
                        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
                        zIndex: 5
                    }}></div>
                </div>
            ) : (
            <div style={{
                position: 'relative', width: '100%', maxWidth: '1200px',
                minHeight: '100dvh', backgroundColor: m.bg,
                padding: 'var(--space-xxl) clamp(1.5rem, 6vw, 5rem)',
                boxShadow: `0 0 100px ${m.accent}15`
            }}>
                {selectionRect && (
                    <motion.button
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.05, boxShadow: `0 15px 40px rgba(0,0,0,0.9), 0 0 25px ${m.accent}80` }}
                        whileTap={{ scale: 0.95 }}
                        onHoverStart={() => { if (playAlgoraveSynth) playAlgoraveSynth(); }}
                        onClick={captureReflection}
                        style={{
                            position: 'fixed', top: selectionRect.top, left: selectionRect.left, transform: 'translateX(-50%)',
                            zIndex: 1500, background: m.accent, color: m.bg,
                            border: `1px solid ${m.bg}`, padding: '8px 20px', borderRadius: '2px',
                            fontFamily: 'var(--fMono)', fontSize: '0.75rem', fontWeight: 'bold',
                            letterSpacing: '0.15em', cursor: 'pointer', 
                            boxShadow: `0 10px 30px rgba(0,0,0,0.8), 0 0 15px ${m.accent}50`,
                            display: 'flex', alignItems: 'center', gap: '0.5rem'
                        }}
                    >
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: m.bg, animation: 'event-flash 2s infinite alternate' }} />
                        [ CAPTURE REFLECTION ]
                    </motion.button>
                )}
                {/* ── THE RESONANCE VAULT (Interactive Filtering Architecture) ─────────────────────────────── */}
                <ResonanceVault
                    m={m}
                    issues={getSteepingIssues(m, setTuraoMode, SongbookGlossaryItem, playAlgoraveSynth, playStrikingBowl, historicalScore)}
                    activeIssue={activeIssue}
                    setActiveIssue={setActiveIssue}
                    playStrikingBowl={playStrikingBowl}
                    playAlgoraveSynth={playAlgoraveSynth}
                    onClose={onClose}
                />

                {/* DYNAMIC EDITORIAL RENDER */}
                <div ref={contentRef} className="registry-container" style={{ scrollMarginTop: 'var(--space-lg)' }}>
                    {getSteepingIssues(m, setTuraoMode, SongbookGlossaryItem, playAlgoraveSynth, playStrikingBowl, historicalScore).find(iss => iss.id === activeIssue)?.render()}
                </div>

                {/* THEORETICAL ANCHORS & COLLABINATIVE CITATIONS (INFUSED WITH PING) */}
                <div style={{
                    display: 'flex', flexDirection: 'row', gap: '2rem', flexWrap: 'wrap',

                    fontFamily: 'var(--fMono)', fontSize: '0.7rem', color: m.text2,
                    borderBottom: `1px dashed ${m.accent}30`, paddingBottom: '2rem', marginBottom: 'var(--space-xxl)',
                    opacity: 0.8, lineHeight: 1.6
                }}>
                    <div style={{ flex: '1 1 300px', position: 'relative', paddingLeft: '1rem', borderLeft: `2px solid ${m.accent}40` }}>
                        <b style={{ color: m.accent, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: m.accent, boxShadow: `0 0 10px ${m.accent}` }}></span>
                            THE LOGOS (ZENO OF CITIUM)
                        </b>
                        <div style={{ marginTop: '0.4rem' }}>The active reason pervading the universe. To live well is to align internal reasoning with the cosmic rational flow.</div>
                    </div>
                    <div style={{ flex: '1 1 300px', position: 'relative', paddingLeft: '1rem', borderLeft: `2px solid ${m.accent}40` }}>
                        <b style={{ color: m.accent, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: m.accent, boxShadow: `0 0 10px ${m.accent}` }}></span>
                            SYNCHRONICITY (C.G. JUNG)
                        </b>
                        <div style={{ marginTop: '0.4rem' }}>An acausal connecting principle where the cosmos organizes external events to reflect internal archetypal realities.</div>
                    </div>
                    <div style={{ flex: '1 1 300px', position: 'relative', paddingLeft: '1rem', borderLeft: `2px solid ${m.accent}40` }}>
                        <b style={{ color: m.accent, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: m.accent, boxShadow: `0 0 10px ${m.accent}` }}></span>
                            IT FROM BIT (J.A. WHEELER)
                        </b>
                        <div style={{ marginTop: '0.4rem' }}>The universe is fundamentally participatory, an interplay of measurements and answers. It speaks purely as information.</div>
                    </div>
                </div>

                {/* PERSONAL NOTES GRID (THE LEDGER DATA) */}
                <div id="archive-of-presence" style={{
                    marginTop: '5rem', display: 'flex', flexDirection: 'column', gap: '2rem'
                }}>
                    {historicalScore && historicalScore.length > 0 ? (
                        <>
                            <div style={{ textAlign: 'center', fontFamily: 'var(--fMono)', letterSpacing: '0.2em', color: m.accent, padding: '2rem 0', borderTop: `1px solid ${m.accent}20` }}>
                                [ ARCHIVE OF PRESENCE ]
                            </div>
                            <div style={{
                                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem'
                            }}>
                                {[...localReflections, ...historicalScore].map((entry, idx) => {
                                    const glyphs = [
                                        "   /\\ \n  /  \\\n |    |\n  \\__/\n",
                                        " ≈≈≈≈≈\n ~_~_~\n ≈≈≈≈≈\n",
                                        "  / \\ \n ( ⊙ )\n  \\ / \n",
                                        "   ||\n __||__\n \\    /\n  \\__/\n"
                                    ];
                                    const activeGlyph = glyphs[idx % glyphs.length];

                                    return (
                                        <div key={idx} style={{
                                            padding: 'var(--space-lg)', background: `${m.accent}05`,
                                            border: `1px solid ${m.accent}20`, position: 'relative',
                                            transition: 'transform 0.4s ease, background 0.4s ease'
                                        }} onMouseEnter={e => e.currentTarget.style.background = `${m.accent}0a`}
                                            onMouseLeave={e => e.currentTarget.style.background = `${m.accent}05`}>

                                            <div style={{
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                                                borderBottom: `1px solid ${m.accent}30`, paddingBottom: '0.8rem', marginBottom: '1.2rem'
                                            }}>
                                                <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.7rem', color: m.accent, opacity: 0.8, letterSpacing: '0.1em' }}>
                                                    {new Date(entry.timestamp).toLocaleDateString()}
                                                </div>
                                                <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.text1, letterSpacing: '0.1em', padding: '2px 8px', background: `${m.accent}20`, borderRadius: '2px' }}>
                                                    {entry.mode.toUpperCase()}
                                                </div>
                                            </div>

                                            <div style={{
                                                fontFamily: 'var(--fSerif)', fontSize: '1.4rem', lineHeight: 1.3,
                                                color: m.text1, marginBottom: '1.2rem', fontStyle: 'italic'
                                            }}>
                                                "{entry.query}"
                                            </div>

                                            <div style={{
                                                fontFamily: 'var(--fMono)', fontSize: '0.6rem', color: m.accent, opacity: 0.5,
                                                whiteSpace: 'pre', lineHeight: 1.1, marginBottom: '1.2rem',
                                                textAlign: 'center', borderTop: `1px dashed ${m.accent}30`,
                                                borderBottom: `1px dashed ${m.accent}30`, padding: '0.5rem 0'
                                            }}>
                                                {activeGlyph}
                                            </div>

                                            <div style={{
                                                fontFamily: 'var(--fBody)', fontSize: '1rem', color: m.text2,
                                                lineHeight: 1.7, opacity: 0.9, whiteSpace: 'pre-wrap'
                                            }}>
                                                <span style={{
                                                    float: 'left', fontSize: '2.5rem', lineHeight: '2.2rem',
                                                    fontFamily: 'var(--fSerif)', color: m.accent,
                                                    paddingRight: '0.4rem', paddingTop: '0.2rem'
                                                }}>
                                                    {(entry.response || "•").charAt(0)}
                                                </span>
                                                {(entry.response || " Silence captured...").substring(1)}
                                            </div>

                                            <div style={{
                                                display: 'flex', justifyContent: 'center', marginTop: '1.5rem',
                                                paddingTop: '1rem', borderTop: `1px solid ${m.accent}15`
                                            }}>
                                                <button
                                                    onClick={() => generateSonicSketch && generateSonicSketch(entry)}
                                                    style={{
                                                        background: 'none', border: 'none', color: m.text1,
                                                        fontFamily: 'var(--fMono)', fontSize: '0.65rem', letterSpacing: '0.15em',
                                                        textTransform: 'uppercase', cursor: 'pointer', opacity: 0.5,
                                                        transition: 'all 0.4s ease', display: 'flex', alignItems: 'center', gap: '0.5rem'
                                                    }}
                                                    onMouseEnter={e => { e.currentTarget.style.opacity = 0.9; e.currentTarget.style.color = m.accent; }}
                                                    onMouseLeave={e => { e.currentTarget.style.opacity = 0.5; e.currentTarget.style.color = m.text1; }}
                                                >
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <circle cx="12" cy="12" r="10"></circle>
                                                        <circle cx="12" cy="12" r="3"></circle>
                                                    </svg>
                                                    <b>[ CAPTURE FREQUENCY ]</b>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {hasMoreHistory && (
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
                                    <button 
                                        onClick={() => { if (typeof loadMoreHistory === 'function') loadMoreHistory(); }}
                                        style={{
                                            padding: '12px 24px', background: `${m.accent}0a`, border: `1px dashed ${m.accent}60`,
                                            color: m.accent, fontFamily: 'var(--fMono)', fontSize: '0.8rem', letterSpacing: '0.15em',
                                            textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.4s ease'
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background = m.accent; e.currentTarget.style.color = m.bg; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = `${m.accent}0a`; e.currentTarget.style.color = m.accent; }}
                                    >
                                        [ SUMMON DEEPER ARCHIVES ]
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={{
                            padding: 'var(--space-xxl) 0', textAlign: 'center', border: `1px dashed ${m.accent}40`,
                            fontFamily: 'var(--fMono)', color: m.text2, letterSpacing: '0.15em', fontSize: '0.85rem'
                        }}>
                            THE WATER AWAITS THE LEAF. <br />
                            YOUR RESONANCE REMAINS IN THE ANTECHAMBER. <br /><br />
                            <span style={{ color: m.accent, opacity: 0.7 }}>[ THE SILENCE IS DEAFENINGLY PURE ]</span>
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <div style={{
                    marginTop: '8rem', paddingTop: '2.5rem', borderTop: `1px solid ${m.accent}30`,
                    display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--fMono)',
                    fontSize: '0.75rem', color: m.text2, letterSpacing: '0.15em', textTransform: 'uppercase'
                }}>
                    <span>© {new Date().getFullYear()} THE ÅLÏEN SCÖÕL</span>
                    <span>CREÅTIVE STEEPING : THE ECOSYSTEM</span>
                </div>
            </div>
            )}
        </div>
    );
};
