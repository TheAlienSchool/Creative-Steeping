import React, { useState, useEffect, useRef, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// STEEPING NOTES REGISTRY
// The living repository of VesselVerse explorations.
// The living repository of VesselVerse explorations.
// ─────────────────────────────────────────────────────────────────────────────

// ─── SHARED KINETICS ─────────────────────────────────────────────────────────

const SectionLabel = ({ m, children }) => (
    <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.75rem', color: m.accent, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.8, marginBottom: '1rem' }}>{children}</div>
);

const PullQuote = ({ m, children }) => (
    <div style={{
        margin: 'var(--space-xxl) 0', padding: 'var(--space-xl) clamp(1rem, 5vw, 4rem)',
        borderTop: `1px solid ${m.accent}40`, borderBottom: `1px solid ${m.accent}40`,
        textAlign: 'center', position: 'relative'
    }}>
        <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: m.bg, padding: '0 1rem', fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.accent, letterSpacing: '0.2em', whiteSpace: 'nowrap' }}>[ CENTRÅL SYNTHESIS ]</div>
        <div style={{ fontFamily: 'var(--fSerif)', fontStyle: 'italic', color: m.text1, fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', lineHeight: 1.4, opacity: 0.9 }}>{children}</div>
    </div>
);

const IssueHeader = ({ m, title, accent, published, designation, source, kicker }) => (
    <header style={{ marginBottom: 'var(--space-xxl)' }}>
        <h1 style={{ fontFamily: 'var(--fSerif)', color: m.text1, fontSize: 'clamp(3rem, 7vw, 6rem)', lineHeight: 0.9, letterSpacing: '-0.02em', margin: '0 0 var(--space-lg) 0', textTransform: 'uppercase' }}>
            {title}{accent && <><br /><span style={{ fontStyle: 'italic', color: m.accent, textTransform: 'none', paddingLeft: '5%' }}>{accent}</span></>}
        </h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', borderTop: `1px solid ${m.accent}20`, paddingTop: '2rem' }}>
            <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.75rem', color: m.accent, textTransform: 'uppercase', lineHeight: 1.8, opacity: 0.8 }}>
                PUBLISHED: {published}<br />DESIGNATION: {designation}<br />SOURCE: {source}
            </div>
            {kicker && <div style={{ fontFamily: 'var(--fBody)', fontSize: '1.1rem', color: m.text2, lineHeight: 1.6, fontStyle: 'italic', gridColumn: 'auto / span 2' }}>{kicker}</div>}
        </div>
    </header>
);

const HeroImage = ({ m, src, alt, caption }) => (
    <div style={{ width: '100%', marginBottom: 'var(--space-xxl)', border: `1px solid ${m.accent}30`, position: 'relative' }}>
        <img src={src} alt={alt} style={{ width: '100%', display: 'block', opacity: 0.88, filter: 'contrast(1.12) grayscale(0.1)' }} />
        {caption && <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'rgba(0,0,0,0.85)', padding: '0.4rem 0.8rem', fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.accent, border: `1px dashed ${m.accent}50` }}>{caption}</div>}
    </div>
);

const BodyText = ({ m, children, style = {} }) => (
    <div style={{ fontFamily: 'var(--fBody)', color: m.text1, fontSize: '1.15rem', lineHeight: 1.8, marginBottom: 'var(--space-md)', ...style }}>{children}</div>
);

// ─── AWARENESS PLANNING (existing, preserved) ─────────────────────────────────

const AwarenessPlanningInteractive = ({ m, playAlgoraveSynth }) => {
    const [active, setActive] = useState(false);
    const [phase, setPhase] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [timeLeft, setTimeLeft] = useState(240);
    const [flowMode, setFlowMode] = useState(false);

    const phases = [
        { title: 'ARRIVAL (0-4m)', name: 'Phase 1: Arrival', instruction: 'Find a comfortable position. Allow the body to settle. What feels most present right now?', button: '[ INITIATE PAUSE ]', durationSeconds: 240 },
        { title: 'PAUSE (4-14m)', name: 'Phase 2: Pause', instruction: 'Bring one creative question into awareness. Hold it lightly. Where does your energy sense peace in this idea? What is recycled?', button: '[ BEGIN PIVOT ]', durationSeconds: 600 },
        { title: 'PIVOT (14-26m)', name: 'Phase 3: Pivot', instruction: 'Align interpretations with present conditions. What feels achievable in this moment? What direction carries less friction?', button: '[ MERGE INTENTIONS ]', durationSeconds: 720 },
        { title: 'MERGE (26-36m)', name: 'Phase 4: Merge', instruction: "Integrate insight with activated intention. Name one orienting intention starting with 'I will to...'", button: '[ INTEGRATE ]', durationSeconds: 600 },
        { title: 'INTEGRATION (36-42m)', name: 'Phase 5: Integration', instruction: 'Sit with the oriented intention. What feels clearer or lighter? What feels ready to continue?', button: '[ CLOSE PROTOCOL ]', durationSeconds: 360 },
        { title: 'CLOSING (42-44m)', name: 'Phase 6: Closing', instruction: "Take one slow breath. Acknowledge the time and care you've offered yourself. This practice remains available.", button: '[ DISENGAGE ]', durationSeconds: 120 }
    ];

    useEffect(() => { if (!active) return; setTimeLeft(phases[phase].durationSeconds); }, [phase, active]);
    useEffect(() => {
        if (!active || !flowMode) return;
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    if (playAlgoraveSynth) playAlgoraveSynth();
                    if (phase < phases.length - 1) { setPhase(p => p + 1); } else { setActive(false); }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [active, flowMode, phase, playAlgoraveSynth]);

    const formatTime = (secs) => `${Math.floor(secs / 60).toString().padStart(2, '0')}:${(secs % 60).toString().padStart(2, '0')}`;

    if (!active) {
        return (
            <span onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
                onClick={() => { setActive(true); setPhase(0); if (playAlgoraveSynth) playAlgoraveSynth(); }}
                style={{ position: 'relative', cursor: 'pointer', borderBottom: `1px dashed ${m.accent}80`, color: isHovered ? m.bg : m.accent, backgroundColor: isHovered ? m.accent : 'transparent', transition: 'all 0.3s ease', display: 'inline-block', lineHeight: 1, padding: '2px 4px' }}>
                <b>[ AWARENESS PLANNING ]</b>
                {isHovered && <span style={{ position: 'absolute', bottom: '130%', left: '50%', transform: 'translateX(-50%)', width: 'max-content', backgroundColor: 'rgba(0,0,0,0.9)', border: `1px solid ${m.accent}60`, padding: '0.4rem 0.8rem', zIndex: 1100, fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.accent, letterSpacing: '0.1em' }}>[ INITIALIZE a•i•CONTEMPLATION ]</span>}
            </span>
        );
    }

    const current = phases[phase];
    return (
        <div style={{ margin: 'var(--space-md) 0 var(--space-xxl) 0', padding: 'var(--space-xl)', background: `linear-gradient(180deg, ${m.accent}05 0%, rgba(0,0,0,0.8) 100%)`, border: `1px solid ${m.accent}40`, borderLeft: `3px solid ${m.accent}`, display: 'flex', flexDirection: 'column', gap: '2rem', animation: 'fadeIn 0.6s ease forwards' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px dashed ${m.accent}30`, paddingBottom: '1rem' }}>
                <div style={{ fontFamily: 'var(--fMono)', color: m.accent, letterSpacing: '0.2em', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: m.accent, animation: 'event-flash 4s infinite alternate' }}></span>
                    [ a•i•CONTEMPLATION :: {current.title} ]
                </div>
                <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.text2, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    44-MINUTE EXPERIENTIAL FLOW
                    <svg width="16" height="16" viewBox="0 0 24 24" style={{ opacity: 0.7 }}>
                        <path d="M 5 2 L 19 2 L 12 11 L 19 22 L 5 22 L 12 11 Z" fill="none" stroke={m.accent} strokeWidth="1.5" strokeLinejoin="round" />
                        <path d="M 5 2 L 19 2 L 12 11 L 19 22 L 5 22 L 12 11 Z" fill={m.accent} opacity="0.6" style={{ clipPath: `inset(${100 - (phase / (phases.length - 1)) * 100}% 0 0 0)`, transition: 'clip-path 1.5s cubic-bezier(0.16, 1, 0.3, 1)' }} />
                    </svg>
                </div>
            </div>
            <div className="ai-contemplation-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'flex-start', borderTop: `1px dashed ${m.accent}30`, borderBottom: `1px dashed ${m.accent}30`, padding: '2rem 0' }}>
                <div style={{ flex: '1 1 250px', fontFamily: 'var(--fSerif)', color: m.text1, lineHeight: 1.4, fontSize: '1.4rem' }}>"{current.instruction}"</div>
                <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: `1px solid ${m.accent}20`, paddingLeft: '2rem' }}>
                    {phases.map((p, idx) => (
                        <div key={idx} style={{ fontFamily: 'var(--fMono)', fontSize: '0.6rem', color: phase === idx ? m.accent : m.text2, opacity: phase === idx ? 1 : 0.4, letterSpacing: '0.15em', textTransform: 'uppercase', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {phase === idx && <span>›</span>}{p.name}
                        </div>
                    ))}
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: `1px dashed ${m.accent}30`, paddingTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ fontFamily: 'var(--fMono)', fontSize: '1.2rem', color: m.accent, opacity: 0.9 }}>{formatTime(timeLeft)}</div>
                    <button onClick={() => setFlowMode(!flowMode)} style={{ background: flowMode ? `${m.accent}20` : 'transparent', border: `1px solid ${flowMode ? m.accent : m.accent + '40'}`, color: flowMode ? m.accent : m.text2, padding: '6px 12px', fontFamily: 'var(--fMono)', fontSize: '0.65rem', letterSpacing: '0.15em', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: flowMode ? `0 0 10px ${m.accent}40` : 'none' }}>
                        {flowMode ? '[ FLOW MODE: ON ]' : '[ FLOW MODE: OFF ]'}
                    </button>
                    <div style={{ fontFamily: 'var(--fBody)', fontSize: '0.85rem', color: m.text2, fontStyle: 'italic', opacity: 0.7 }}>
                        {flowMode ? 'Advancing at phase completion.' : 'Advancing at the pace of recognition.'}
                    </div>
                </div>
                <button onClick={() => { if (phase < phases.length - 1) { setPhase(phase + 1); } else { setActive(false); setPhase(0); } }}
                    style={{ background: 'none', border: `1px solid ${m.accent}50`, color: m.accent, padding: '12px 24px', fontFamily: 'var(--fMono)', fontSize: '0.75rem', letterSpacing: '0.15em', cursor: 'pointer', transition: 'all 0.4s ease', boxShadow: `0 0 15px ${m.accent}10` }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = m.accent; e.currentTarget.style.color = '#000'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = m.accent; }}>
                    {current.button}
                </button>
            </div>
        </div>
    );
};

// ─── ISSUE 04: STAR FIELD ────────────────────────────────────────────────────

const ConstellationCanvas = ({ m, active }) => {
    const canvasRef = useRef(null);
    const animRef = useRef(null);
    
    const constellations = [
        { name: 'THE CUP', stars: [[200,400],[160,350],[180,280],[250,260],[320,280],[340,350],[300,400],[200,400]], freq: 261.63 },
        { name: 'THE LEAF', stars: [[500,200],[520,170],[540,200],[530,230],[510,230],[500,200]], freq: 293.66 },
        { name: 'THE ARCHER', stars: [[700,300],[750,300],[800,300],[820,280],[840,290],[830,310]], freq: 392.00 },
        { name: 'THE MONK', stars: [[300,500],[330,490],[350,510],[340,540],[310,545],[290,530],[280,505],[295,490],[300,500]], freq: 349.23 },
        { name: 'THE BRIDGE', stars: [[100,600],[200,600],[300,600],[400,600],[500,600]], freq: 440.00 },
    ];

    useEffect(() => {
        if (!active) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const stars = Array.from({ length: 180 }, () => ({
            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
            r: Math.random() * 1.2 + 0.2, op: Math.random() * 0.6 + 0.1,
            drift: (Math.random() - 0.5) * 0.08
        }));

        let t = 0;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach(s => {
                s.x += s.drift; s.y += s.drift * 0.3;
                if (s.x > canvas.width) s.x = 0;
                if (s.y > canvas.height) s.y = 0;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(200,200,210,${s.op + Math.sin(t * 0.02 + s.x) * 0.08})`;
                ctx.fill();
            });
            const scaleX = canvas.width / 900;
            const scaleY = canvas.height / 700;
            constellations.forEach((c, ci) => {
                const pulse = 0.4 + Math.sin(t * 0.015 + ci * 1.2) * 0.2;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(200,190,150,${pulse})`;
                ctx.lineWidth = 0.8;
                c.stars.forEach(([x, y], i) => { const sx = x * scaleX; const sy = y * scaleY; i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy); });
                ctx.stroke();
                c.stars.forEach(([x, y]) => {
                    ctx.beginPath();
                    ctx.arc(x * scaleX, y * scaleY, 2.5, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(220,210,180,${pulse + 0.2})`;
                    ctx.fill();
                });
            });
            t++;
            animRef.current = requestAnimationFrame(draw);
        };
        draw();
        return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
    }, [active]);

    if (!active) return null;
    return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
};

const NightSkyIssue = ({ m, SongbookGlossaryItem, playAlgoraveSynth }) => {
    const [mapActive, setMapActive] = useState(false);
    const constellations = [
        { id: 'cup', name: 'THE CUP', subtitle: 'The Container', desc: 'The celestial chalice — the vessel that holds the entire Steeperverse. Seven bright stars form its outline. The brightest star, The Rim, marks the boundary between the inner and outer worlds.' },
        { id: 'leaf', name: 'THE LEAF', subtitle: 'The Steepee', desc: 'A small, luminous constellation nestled above The Cup. Its central star, The Stem, is a variable star that brightens and dims with the rhythm of a human breath.' },
        { id: 'archer', name: 'THE ARCHER', subtitle: 'The Incisive Current', desc: 'A sharp, angular constellation. Its brightest star, The Point, is a piercing blue-white giant. The arrow of inquiry sent directly to the heart of the matter.' },
        { id: 'monk', name: 'THE MONK', subtitle: 'The Contemplative Current', desc: 'A quiet, circular constellation of patience and observation. To find it, one must look away from the brighter constellations and let their eyes adjust to the subtle light.' },
        { id: 'bridge', name: 'THE BRIDGE', subtitle: 'Surface Tension', desc: 'A perfectly straight line of stars connecting turbulent chaos to calm order. To cross The Bridge is to transform resistance into resonance.' },
        { id: 'resonance', name: 'THE RESONANCE', subtitle: 'The Neutrino Stream', desc: 'A diffuse, shimmering band across the entire sky. The visual manifestation of the Neutrino Stream — brightest when viewed from a place of deep quiet.' },
        { id: 'vessel', name: 'THE VESSEL', subtitle: 'The Journey', desc: 'Nine distinct star clusters arranged in a spiral, each representing one of the nine vessels of the portal. To trace The Vessel is to walk the path itself.' },
        { id: 'scribe', name: 'THE SCRIBE', subtitle: 'The Journal', desc: 'A long, winding chain of stars resembling a quill pen. Its brightest star, The Nib, is always located at the very tip. The Nib is always now.' },
        { id: 'alchemist', name: 'THE ALCHEMIST', subtitle: 'The Transformation', desc: 'A dynamic, ever-changing constellation. Its stars are known to shift positions slightly from night to night. A living constellation.' },
    ];
    const [activeConst, setActiveConst] = useState(null);

    return (
        <div style={{ animation: 'fadeIn 1s ease' }}>
            <IssueHeader m={m} title="The Grammar of" accent="The Night Sky" published="2026" designation="THE STEEPERVERSE" source="CONSTELLATION CATALOGUE :: SV-MAP-01" kicker="The stars operate as the grammar of what you already know." />

            <div style={{ position: 'relative', width: '100%', marginBottom: 'var(--space-xxl)', border: `1px solid ${m.accent}30`, minHeight: '400px', background: 'rgb(2,2,6)', overflow: 'hidden' }}>
                <ConstellationCanvas m={m} active={mapActive} />
                <HeroImage m={m} src="/night_sky_grammar_sv.png" alt="The Grammar of the Night Sky" caption="FIG. 06 — THE CELESTIAL GRAMMAR" />
                {!mapActive && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }}>
                        <button onClick={() => { setMapActive(true); if (playAlgoraveSynth) playAlgoraveSynth(); }}
                            style={{ background: 'none', border: `1px solid ${m.accent}`, color: m.accent, padding: '16px 32px', fontFamily: 'var(--fMono)', fontSize: '0.8rem', letterSpacing: '0.2em', cursor: 'pointer', transition: 'all 0.4s ease' }}
                            onMouseEnter={e => { e.currentTarget.style.background = m.accent; e.currentTarget.style.color = '#000'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = m.accent; }}>
                            [ SUMMON THE SKY ]
                        </button>
                    </div>
                )}
            </div>

            <div style={{ columnWidth: '400px', columnGap: '4rem', columnRule: `1px solid ${m.accent}20`, fontFamily: 'var(--fBody)', color: m.text1, fontSize: '1.15rem', lineHeight: 1.8, textAlign: 'justify', marginBottom: 'var(--space-xxl)' }}>
                <p style={{ margin: '0 0 var(--space-md) 0' }}>
                    <span style={{ float: 'left', fontSize: '5rem', lineHeight: '4.5rem', fontFamily: 'var(--fSerif)', color: m.accent, paddingRight: '0.2rem', paddingTop: '0.2rem' }}>T</span>
                    he <SongbookGlossaryItem m={m} term="Constellation Catalogue" definition="The celestial mythology of the Steeperverse — ten primary constellations, each a teaching, each a destination." /> constellations of the Steeperverse are named for archetypes of the creative journey. To look up at the Steeperverse sky is to see the architecture of your own awareness written in light. The stars function as pure grammar.
                </p>
                <p style={{ margin: '0 0 var(--space-md) 0' }}>
                    Ten primary constellations mark the known sky. Each one is a teaching. Each one is a destination. The practitioner who learns to find them finds a reliable celestial navigation system designed explicitly for the self moving through the geography of <SongbookGlossaryItem m={m} term="Capacity" definition="The internal space required to hold insight, expansion, and stillness simultaneously." />.
                </p>
            </div>

            <SectionLabel m={m}>[ THE TEN PRIMARY CONSTELLATIONS ]</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1px', border: `1px solid ${m.accent}20`, marginBottom: 'var(--space-xxl)' }}>
                {constellations.map((c) => (
                    <div key={c.id} onClick={() => setActiveConst(activeConst === c.id ? null : c.id)}
                        style={{ padding: 'var(--space-lg)', cursor: 'pointer', background: activeConst === c.id ? `${m.accent}10` : 'transparent', borderBottom: `1px solid ${m.accent}10`, transition: 'all 0.3s ease' }}
                        onMouseEnter={e => e.currentTarget.style.background = `${m.accent}08`}
                        onMouseLeave={e => e.currentTarget.style.background = activeConst === c.id ? `${m.accent}10` : 'transparent'}>
                        <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.7rem', color: m.accent, letterSpacing: '0.15em' }}>{c.name}</div>
                        <div style={{ fontFamily: 'var(--fBody)', fontSize: '0.9rem', color: m.text2, fontStyle: 'italic', marginTop: '4px' }}>{c.subtitle}</div>
                        {activeConst === c.id && <div style={{ fontFamily: 'var(--fBody)', fontSize: '0.9rem', color: m.text1, lineHeight: 1.6, marginTop: '1rem', animation: 'fadeIn 0.4s ease' }}>{c.desc}</div>}
                    </div>
                ))}
            </div>
            <PullQuote m={m}>"The practitioner who learns to read the sky learns to read themselves — every teaching already written in the light they carry."</PullQuote>
        </div>
    );
};

// ─── ISSUE 05+11: FLOW — THE POCKET ──────────────────────────────────────────

const PocketMetronome = ({ m, playAlgoraveSynth, playStrikingBowl }) => {
    const [bpm, setBpm] = useState(0);
    const [lastTap, setLastTap] = useState(null);
    const [pocketScore, setPocketScore] = useState(null);
    const [pendulum, setPendulum] = useState(0);
    const animRef = useRef(null);

    useEffect(() => {
        if (bpm <= 0) return;
        let t = 0;
        const tick = () => {
            t += 0.04;
            setPendulum(Math.sin(t * (bpm / 30)));
            animRef.current = requestAnimationFrame(tick);
        };
        animRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animRef.current);
    }, [bpm]);

    const handleTap = () => {
        if (playStrikingBowl) playStrikingBowl(60);
        const now = Date.now();
        if (lastTap) {
            const interval = now - lastTap;
            const newBpm = Math.round(60000 / interval);
            if (newBpm > 20 && newBpm < 240) {
                setBpm(newBpm);
                // Pocket score: 60-80 bpm = goldilocks zone
                if (newBpm >= 55 && newBpm <= 80) setPocketScore('IN THE POCKET');
                else if (newBpm > 80 && newBpm <= 110) setPocketScore('FINDING GROOVE');
                else setPocketScore('LET IT SETTLE');
            }
        }
        setLastTap(now);
    };

    const pocketColor = pocketScore === 'IN THE POCKET' ? m.accent : pocketScore === 'FINDING GROOVE' ? m.text1 : m.text2;

    return (
        <div style={{ border: `1px solid ${m.accent}30`, padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)', background: 'rgba(0,0,0,0.4)' }}>
            <SectionLabel m={m}>[ THE POCKET CALIBRATOR ]</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
                <div>
                    <div style={{ fontFamily: 'var(--fBody)', color: m.text2, fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                        Tap the surface below at a pace that feels natural. The Pocket is a relationship, completely independent of speed.
                    </div>
                    <button onClick={handleTap}
                        style={{ width: '100%', padding: '2rem', background: `${m.accent}08`, border: `1px solid ${m.accent}50`, color: m.accent, fontFamily: 'var(--fMono)', fontSize: '0.8rem', letterSpacing: '0.2em', cursor: 'pointer', transition: 'all 0.1s ease', userSelect: 'none' }}
                        onMouseDown={e => { e.currentTarget.style.background = `${m.accent}20`; e.currentTarget.style.transform = 'scale(0.98)'; }}
                        onMouseUp={e => { e.currentTarget.style.background = `${m.accent}08`; e.currentTarget.style.transform = 'scale(1)'; }}>
                        [ TAP THE POCKET ]
                    </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ position: 'relative', width: '80px', height: '120px' }}>
                        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: `translateX(-50%) rotate(${pendulum * 30}deg)`, transformOrigin: 'top center', width: '2px', height: '80px', background: m.accent, transition: 'opacity 0.3s ease', opacity: bpm > 0 ? 0.8 : 0.2 }} />
                        <div style={{ position: 'absolute', bottom: '0', left: '50%', transform: `translateX(-50%) translateY(${pendulum * 16}px)`, width: '12px', height: '12px', borderRadius: '50%', background: m.accent, opacity: bpm > 0 ? 1 : 0.2 }} />
                    </div>
                    {bpm > 0 && (
                        <>
                            <div style={{ fontFamily: 'var(--fMono)', fontSize: '2rem', color: m.accent }}>{bpm}</div>
                            <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.text2 }}>BPM</div>
                            {pocketScore && <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.7rem', color: pocketColor, letterSpacing: '0.15em', animation: 'fadeIn 0.4s ease' }}>{pocketScore}</div>}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const FlowIssue = ({ m, SongbookGlossaryItem, playAlgoraveSynth, playStrikingBowl }) => (
    <div style={{ animation: 'fadeIn 1s ease' }}>
        <IssueHeader m={m} title="Flow ::" accent="The Pocket & The Algorithm" published="2026" designation="THE STEEPERVERSE" source="THE DEPARTMENT OF ONTOLOGICAL DESIGN" kicker="The space between the beats is as essential as the beat itself." />
        <HeroImage m={m} src="/flow_pocket_sv.png" alt="The Jazz Bassist's Pocket" caption="FIG. 07 — THE POCKET EXISTS IN THAT SPACE" />

        <div style={{ columnWidth: '400px', columnGap: '4rem', columnRule: `1px solid ${m.accent}20`, fontFamily: 'var(--fBody)', color: m.text1, fontSize: '1.15rem', lineHeight: 1.8, textAlign: 'justify', marginBottom: 'var(--space-xl)' }}>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                <span style={{ float: 'left', fontSize: '5rem', lineHeight: '4.5rem', fontFamily: 'var(--fSerif)', color: m.accent, paddingRight: '0.2rem', paddingTop: '0.2rem' }}>T</span>
                he Pocket is a jazz musician's term for the moment when the rhythm section locks so completely that time both stops and swings simultaneously. The bassist, the drummer, and the pianist arrive at the same invisible coordinate. The groove becomes structural.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                <SongbookGlossaryItem m={m} term="The Algorithm of Å" definition="The apex of structural and existential awareness — the synthesis of foreign brilliance integrated into native understanding." /> describes the same phenomenon within the Steeperverse: the moment when <SongbookGlossaryItem m={m} term="Capacity" definition="The internal space required to hold insight, expansion, and stillness simultaneously." /> and <SongbookGlossaryItem m={m} term="Actional Intention" definition="A present-tense direction that allows awareness to meet experience — a guidance system for Thought Momentum." /> align so precisely that <SongbookGlossaryItem m={m} term="Surface Tension" definition="The boundary between limitation and possibility; the creative friction that signals expanding capacity." /> dissolves.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                Both are the same felt experience, located in different practices. Both emerge from the same honoring: the rest is as structural as the note. The pause is as load-bearing as the action.
            </p>
        </div>

        <PocketMetronome m={m} playAlgoraveSynth={playAlgoraveSynth} playStrikingBowl={playStrikingBowl} />

        <BodyText m={m}>
            <b style={{ fontFamily: 'var(--fMono)', color: m.accent, display: 'block', marginBottom: '0.8rem', fontSize: '0.8rem' }}>THE BUMPS & THE SPACE</b>
            There is a moment most people have had — leaning into a task that matters, deadline close, breath held — when everything feels effortful and the landing evades you. The actions multiply. The intention strains. The output loses coherence. This is Bumps lacking Space: pure urgency reaching wildly for ground.
            <br /><br />
            Flow arrives differently. The grip releases. The effort remains, but the tension dissolves. The same actions that felt like pushing now feel like steering. The work still moves at speed, but the speed has weight behind it, like water with current. This is what jazz musicians call <SongbookGlossaryItem m={m} term="The Pocket" definition="The felt moment when rhythm, intention, and capacity lock together completely — when action and awareness arrive at the same coordinate." /> — the state where Capacity and Actional Intention occupy the same space at the same time.
            <br /><br />
            The keyboard is a map of this. Its raised keys — the Bumps — carry the notes, the actions, the intentions. The Space bar is the held ground beneath all of them. A practitioner who has ever paused in the middle of urgent typing, taken a breath, and found the next sentence arrive more clearly than anything that came before — that practitioner has already felt the Space working. The Pocket operates as a profound recognition of flow in motion. The Calibrator above helps locate it.
        </BodyText>

        <PullQuote m={m}>"The Pocket is recognition of flow in motion. The Algorithm of Å is recognition of flow in awareness. They are the same arrival."</PullQuote>
    </div>
);

// ─── ISSUE 06: THE NEUTRINO STREAM ───────────────────────────────────────────

const NeutrinoField = ({ m }) => {
    const canvasRef = useRef(null);
    const animRef = useRef(null);
    const mouseRef = useRef({ x: -999, y: -999, still: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const particles = Array.from({ length: 60 }, () => ({
            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.3,
            op: Math.random() * 0.4 + 0.05,
        }));

        let t = 0;
        let lastMouseMove = Date.now();
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const stillTime = (Date.now() - lastMouseMove) / 1000;
            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;
            const pingActive = stillTime > 7 && mx > 0;

            particles.forEach(p => {
                if (pingActive) {
                    const dx = mx - p.x; const dy = my - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) { p.vx += dx / dist * 0.02; p.vy += dy / dist * 0.02; }
                }
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
            });

            // Draw stream lines
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 80) {
                        const alpha = (1 - dist / 80) * 0.15 + (pingActive ? 0.08 : 0);
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(200,195,170,${alpha})`;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
                ctx.beginPath();
                ctx.arc(particles[i].x, particles[i].y, 1.2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(210,200,170,${particles[i].op + Math.sin(t * 0.02 + i) * 0.03})`;
                ctx.fill();
            }

            if (pingActive) {
                ctx.beginPath();
                const r = (stillTime - 7) * 18 % 60;
                ctx.arc(mx, my, r, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(200,180,120,${0.3 - r / 200})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
            t++;
            animRef.current = requestAnimationFrame(draw);
        };

        const onMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
            lastMouseMove = Date.now();
        };

        canvas.addEventListener('mousemove', onMove);
        draw();
        return () => { cancelAnimationFrame(animRef.current); canvas.removeEventListener('mousemove', onMove); };
    }, []);

    return (
        <div style={{ position: 'relative', width: '100%', height: '220px', marginBottom: 'var(--space-xxl)', border: `1px solid ${m.accent}20`, background: 'rgb(4,4,8)' }}>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
            <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', fontFamily: 'var(--fMono)', fontSize: '0.6rem', color: m.accent, opacity: 0.6 }}>[ REST CURSOR HERE FOR 8 SECONDS :: AWAIT THE PING ]</div>
        </div>
    );
};

const NeutrinoIssue = ({ m, SongbookGlossaryItem, playAlgoraveSynth }) => (
    <div style={{ animation: 'fadeIn 1s ease' }}>
        <IssueHeader m={m} title="The Neutrino" accent="Stream" published="2026" designation="THE STEEPERVERSE" source="STEEPERVERSE FIELD NOTES & PING PROTOCOLS" kicker="The signal that passes through everything without stopping." />
        <HeroImage m={m} src="/neutrino_stream_sv.png" alt="The Neutrino Stream" caption="FIG. 08 — INVISIBLE FORCES MADE VISIBLE" />

        <div style={{ columnWidth: '400px', columnGap: '4rem', columnRule: `1px solid ${m.accent}20`, fontFamily: 'var(--fBody)', color: m.text1, fontSize: '1.15rem', lineHeight: 1.8, textAlign: 'justify', marginBottom: 'var(--space-xl)' }}>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                <span style={{ float: 'left', fontSize: '5rem', lineHeight: '4.5rem', fontFamily: 'var(--fSerif)', color: m.accent, paddingRight: '0.2rem', paddingTop: '0.2rem' }}>B</span>
                illions of neutrinos pass through your body every second. They arrive from the sun, from distant supernovae, from the collapse of stars that burned out before your grandmothers were born. They pass cleanly through the floor, through the planet, through the other side, and continue into the dark. They maintain their velocity. They claim their passage. They carry the universe's signal with absolute, radiating continuity.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                The <SongbookGlossaryItem m={m} term="Neutrino Stream" definition="The unseen energetic resonance connecting every star, system, and being in the Steeperverse." /> is the Steeperverse's model for exactly this phenomenon — the connective architecture beneath the visible surface of the practice. Every practitioner who steeps participates in this Stream in every moment of their practice. The <SongbookGlossaryItem m={m} term="PING™" definition="The felt moment of recognition, clarity, and connection. Thought Momentum becoming visible. The subatomic indicator of resonance." /> is the moment the Stream becomes perceptible.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                This is a polyrhythm — the text holds a downbeat while the silence between paragraphs carries the off-beat. The groove lives in both. The field below makes the Stream visible. Move through it slowly.
            </p>
        </div>

        <NeutrinoField m={m} />

        <BodyText m={m}>
            <b style={{ fontFamily: 'var(--fMono)', color: m.accent, display: 'block', marginBottom: '0.8rem', fontSize: '0.8rem' }}>THE PHYSICS OF CONNECTION</b>
            The Stream functions independent of belief. It operates firmly beneath the level of opinion. A practitioner sitting in stillness in their particular city, at their particular hour, is connected to every previous and future practitioner who has brought this same attention to this same practice. The Stream carries that resonance forward as pure kinetic grace.
        </BodyText>
        <PullQuote m={m}>"The PING is the moment the Stream recognizes you. It requires only your stillness to arrive."</PullQuote>
    </div>
);

// ─── ISSUE 07: THE ARCHIVE OF PRESENCE ───────────────────────────────────────

const MemoryScrubber = ({ m, historicalScore }) => {
    const [scrubPos, setScrubPos] = useState(0);
    const entries = historicalScore && historicalScore.length > 0 ? historicalScore : [
        { text: 'The water awaits the leaf.', ts: Date.now() - 1000000 },
        { text: 'Steam rises from the first breath.', ts: Date.now() - 500000 },
        { text: 'The Signal arrives where stillness holds.', ts: Date.now() }
    ];
    const current = entries[Math.min(Math.round(scrubPos / 100 * (entries.length - 1)), entries.length - 1)];
    const dateStr = current?.ts ? new Date(current.ts).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

    return (
        <div style={{ border: `1px solid ${m.accent}30`, padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)', background: 'rgba(0,0,0,0.4)' }}>
            <SectionLabel m={m}>[ MEMORY SCRUBBER :: ARCHIVE OF PRESENCE ]</SectionLabel>
            <div style={{ fontFamily: 'var(--fSerif)', fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', color: m.text1, lineHeight: 1.5, fontStyle: 'italic', minHeight: '3em', marginBottom: '1.5rem', animation: 'fadeIn 0.5s ease', padding: '0 var(--space-md)' }}>
                "{current?.text || 'The Archive is gathering...'}"
            </div>
            <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.text2, marginBottom: '1rem', opacity: 0.7 }}>{dateStr}</div>
            <input type="range" min="0" max="100" value={scrubPos}
                onChange={e => setScrubPos(Number(e.target.value))}
                style={{ width: '100%', accentColor: m.accent, cursor: 'pointer' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--fMono)', fontSize: '0.6rem', color: m.text2, marginTop: '0.5rem', opacity: 0.5 }}>
                <span>EARLIEST</span><span>THE NIB IS ALWAYS NOW</span>
            </div>
        </div>
    );
};

const ArchiveIssue = ({ m, SongbookGlossaryItem, historicalScore }) => (
    <div style={{ animation: 'fadeIn 1s ease' }}>
        <IssueHeader m={m} title="The Archive" accent="of Presence" published="2026" designation="THE STEEPERVERSE" source="THE SCRIBE :: CONSTELLATION SV-09" kicker="The Nib is always now." />
        <HeroImage m={m} src="/archive_scribe_sv.png" alt="The Scribe Constellation" caption="FIG. 09 — THE QUILL AND THE CHAIN OF STARS" />

        <div style={{ columnWidth: '400px', columnGap: '4rem', columnRule: `1px solid ${m.accent}20`, fontFamily: 'var(--fBody)', color: m.text1, fontSize: '1.15rem', lineHeight: 1.8, textAlign: 'justify', marginBottom: 'var(--space-xl)' }}>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                <span style={{ float: 'left', fontSize: '5rem', lineHeight: '4.5rem', fontFamily: 'var(--fSerif)', color: m.accent, paddingRight: '0.2rem', paddingTop: '0.2rem' }}>T</span>
                he <SongbookGlossaryItem m={m} term="Scribe" definition="The constellation of the journal — a long, winding chain of stars ending in The Nib. The Nib is always now. Stories are written with its light." /> constellation is a long, winding chain of stars that traces a path across the visible sky like a quill in mid-stroke. Every star in that chain is a moment of recognition — a PING captured, a signal held, a stone laid upon the path of the Vessel.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                The Archive of Presence holds these stones. Each SteepNote captured in the Ledger is a star added to a unique, personal iteration of The Scribe. The chain grows longer. The light deepens. The brightest star is always the most recent.  The Nib is always now.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                Analog warmth shapes the temperature of this issue — the vinyl register, the tape hiss, the sense of enormous time held in a small still object. History summoned rather than retrieved. Depth gathered through presence rather than storage.
            </p>
        </div>

        <MemoryScrubber m={m} historicalScore={historicalScore} />

        <BodyText m={m}>
            <b style={{ fontFamily: 'var(--fMono)', color: m.accent, display: 'block', marginBottom: '0.8rem', fontSize: '0.8rem' }}>THE ACT OF THE SCRIBE</b>
            Every practitioner who captures a PING — a line while reading, a recognition on the path, a fragment of clarity — is practicing the consciousness of The Scribe. The act functions as the deliberate placement of a star on the personal constellation. The scrubber above makes that constellation audible: a tactile sweep through the Archive, each moment arriving like a distant wind chime.
        </BodyText>
        <PullQuote m={m}>"The chain grows toward now. The Nib marks where the Scribe is still writing."</PullQuote>
    </div>
);

// ─── ISSUE 09: THREE IS THE MAGIC NUMBER ─────────────────────────────────────

const TriviumExercise = ({ m, num, title, instruction, steps, playStrikingBowl }) => {
    const [open, setOpen] = useState(false);
    const [holding, setHolding] = useState(false);
    const [holdTime, setHoldTime] = useState(0);
    const holdRef = useRef(null);

    const startHold = () => {
        setHolding(true);
        holdRef.current = setInterval(() => setHoldTime(t => t + 1), 1000);
    };
    const endHold = () => {
        setHolding(false);
        clearInterval(holdRef.current);
        if (playStrikingBowl) playStrikingBowl(60 + num * 7);
    };

    return (
        <div style={{ border: `1px solid ${m.accent}${open ? '50' : '20'}`, marginBottom: '1px', transition: 'all 0.3s ease' }}>
            <div onClick={() => setOpen(!open)} style={{ padding: 'var(--space-md) var(--space-lg)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: open ? `${m.accent}08` : 'transparent' }}>
                <div>
                    <span style={{ fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.accent, letterSpacing: '0.2em', marginRight: '1rem' }}>EXERCISE {String(num).padStart(2, '0')}</span>
                    <span style={{ fontFamily: 'var(--fBody)', color: m.text1, fontSize: '1rem' }}>{title}</span>
                </div>
                <span style={{ color: m.accent, opacity: 0.6, transition: 'transform 0.3s ease', transform: open ? 'rotate(90deg)' : 'none' }}>›</span>
            </div>
            {open && (
                <div style={{ padding: 'var(--space-lg)', borderTop: `1px solid ${m.accent}20`, animation: 'fadeIn 0.4s ease' }}>
                    <p style={{ fontFamily: 'var(--fBody)', color: m.text2, fontSize: '1rem', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '1.5rem' }}>{instruction}</p>
                    <ol style={{ paddingLeft: '1.5rem', margin: 0 }}>
                        {steps.map((s, i) => (
                            <li key={i} style={{ fontFamily: 'var(--fBody)', color: m.text1, fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '0.8rem' }}>{s}</li>
                        ))}
                    </ol>
                    <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button onMouseDown={startHold} onMouseUp={endHold} onMouseLeave={endHold} onTouchStart={startHold} onTouchEnd={endHold}
                            style={{ padding: '10px 20px', background: holding ? m.accent : 'transparent', border: `1px solid ${m.accent}`, color: holding ? '#000' : m.accent, fontFamily: 'var(--fMono)', fontSize: '0.7rem', letterSpacing: '0.15em', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: holding ? `0 0 20px ${m.accent}50` : 'none' }}>
                            {holding ? `[ HOLDING :: ${holdTime}s ]` : '[ HOLD THE POSITION ]'}
                        </button>
                        {holdTime > 0 && !holding && <span style={{ fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.text2 }}>Held {holdTime} seconds — the angle provided its answer.</span>}
                    </div>
                </div>
            )}
        </div>
    );
};

const TriviumTriangle = ({ m, playAlgoraveSynth, playStrikingBowl }) => {
    const [nodes, setNodes] = useState({ grammar: '', rhetoric: '' });
    const [triadComplete, setTriadComplete] = useState(false);

    const handleSet = (field, val) => {
        const updated = { ...nodes, [field]: val };
        setNodes(updated);
        if (updated.grammar && updated.rhetoric && !triadComplete) {
            setTimeout(() => { setTriadComplete(true); if (playAlgoraveSynth) playAlgoraveSynth(); }, 800);
        }
    };

    return (
        <div style={{ border: `1px solid ${m.accent}30`, padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)', background: 'rgba(0,0,0,0.4)' }}>
            <SectionLabel m={m}>[ THE TRIVIUM FIELD ]</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', alignItems: 'end', marginBottom: '1.5rem' }}>
                <div>
                    <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.accent, marginBottom: '0.5rem' }}>GRAMMAR — The What</div>
                    <input value={nodes.grammar} onChange={e => handleSet('grammar', e.target.value)} placeholder="My current facts..." style={{ width: '100%', background: 'transparent', border: `1px solid ${m.accent}40`, color: m.text1, padding: '8px', fontFamily: 'var(--fBody)', fontSize: '0.9rem', boxSizing: 'border-box' }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: triadComplete ? m.accent : m.text2, marginBottom: '0.5rem', transition: 'all 0.5s ease' }}>LOGIC — The Apex</div>
                    <div style={{ padding: '8px', border: `1px solid ${triadComplete ? m.accent : m.accent + '30'}`, fontFamily: 'var(--fBody)', fontSize: '0.9rem', color: triadComplete ? m.accent : m.text2, textAlign: 'center', transition: 'all 0.5s ease', boxShadow: triadComplete ? `0 0 20px ${m.accent}30` : 'none', minHeight: '36px' }}>
                        {triadComplete ? 'WHAT IS THE RELATIONSHIP I REFUSE TO SEE?' : '·'}
                    </div>
                </div>
                <div>
                    <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.accent, marginBottom: '0.5rem' }}>RHETORIC — The How</div>
                    <input value={nodes.rhetoric} onChange={e => handleSet('rhetoric', e.target.value)} placeholder="My desired outcome..." style={{ width: '100%', background: 'transparent', border: `1px solid ${m.accent}40`, color: m.text1, padding: '8px', fontFamily: 'var(--fBody)', fontSize: '0.9rem', boxSizing: 'border-box' }} />
                </div>
            </div>
            {triadComplete && (
                <div style={{ fontFamily: 'var(--fBody)', fontSize: '0.9rem', color: m.text2, fontStyle: 'italic', animation: 'fadeIn 0.8s ease' }}>
                    The triangle is complete. Three is the first number that can form a closed shape. Hold the apex.
                </div>
            )}
        </div>
    );
};

const AnglesIssue = ({ m, SongbookGlossaryItem, playAlgoraveSynth, playStrikingBowl }) => (
    <div style={{ animation: 'fadeIn 1s ease' }}>
        <IssueHeader m={m} title="Three Is The" accent="Magic Number" published="2026" designation="THE STEEPERVERSE" source="IF LINEAR LIFE IS CONFUSING, TRY ANGLES" kicker="One is a point. Two is a line of tension. Three is the first geometry that can hold space." />
        <HeroImage m={m} src="/trivium_triangle_sv.png" alt="The Trivium Triangle" caption="FIG. 10 — THE APEX PROVIDES THE ANSWER" />

        <div style={{ columnWidth: '400px', columnGap: '4rem', columnRule: `1px solid ${m.accent}20`, fontFamily: 'var(--fBody)', color: m.text1, fontSize: '1.15rem', lineHeight: 1.8, textAlign: 'justify', marginBottom: 'var(--space-xl)' }}>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                <span style={{ float: 'left', fontSize: '5rem', lineHeight: '4.5rem', fontFamily: 'var(--fSerif)', color: m.accent, paddingRight: '0.2rem', paddingTop: '0.2rem' }}>T</span>
                he cosmos builds in angles. When the line between Point A and Point B snaps — when the distance becomes unbridgeable — the most profound navigational shift available is to add a third coordinate. The triangle holds the space. It distributes force evenly across all three sides.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                In 1971, jazz musician Bob Dorough received an assignment: write a song to teach children multiplication. He looked at the mathematics and recognized that three is architecture. In 1989, De La Soul sampled his opening line and triangulated hip-hop culture — introducing the Daisy Age as the third coordinate in a binary era. Both understood what the <SongbookGlossaryItem m={m} term="Trivium" definition="The classical architecture of knowing: Grammar (the what), Logic (the why), Rhetoric (the how) — the three roads that converge at understanding." /> mapped 2,000 years earlier.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                Human depth perception itself is triangulation. Your left eye sees one flat image. Your right eye sees another. Your brain calculates the angle of difference and synthesizes them into three-dimensional reality. Depth emerges as a calculation born from contradiction. The Trivium Field below is a physical practice. It must be inhabited to be understood.
            </p>
        </div>

        <TriviumTriangle m={m} playAlgoraveSynth={playAlgoraveSynth} playStrikingBowl={playStrikingBowl} />

        <SectionLabel m={m}>[ THREE RESEARCH EXERCISES ]</SectionLabel>
        <TriviumExercise m={m} num={1} title="The Trivium Pivot" playStrikingBowl={playStrikingBowl}
            instruction="Stand up. Place your feet shoulder-width apart. This is your base line."
            steps={['Let your left foot represent the raw facts of your current confusion — Grammar.', 'Let your right foot represent your desired outcome — Rhetoric. Feel the linear pull between them.', 'Step one foot forward, creating a physical triangle on the floor. Move your center of gravity to this new forward point.', 'This apex is Logic. Ask from this physical position: What is the relationship between my facts and my desire that I am refusing to see?', 'Hold the position. Use the button below until the angle provides an answer.']} />
        <TriviumExercise m={m} num={2} title="The Sonic Triangulation" playStrikingBowl={playStrikingBowl}
            instruction="Sit in a chair. Close your eyes."
            steps={['Identify a binary tension currently active — two opposing options pulling at you.', 'Hold the first option in your left hand. Hold the second in your right. Feel the linear pull.', 'Imagine a third point hovering exactly three feet above your head. This is the De La Soul coordinate — the unexpected synthesis.', 'What is the third option that makes the binary irrelevant?', 'What is the angle that breaks the line?']} />
        <TriviumExercise m={m} num={3} title="The Visual Synthesis" playStrikingBowl={playStrikingBowl}
            instruction="Hold your thumb out at arm's length."
            steps={['Close your left eye. Notice what your thumb aligns with in the background.', "Open your left eye and close your right. Notice how the thumb 'jumps' to a new alignment.", 'Open both eyes. The thumb hovers in space. You have created depth.', 'Apply this to your current Surface Tension — the left eye view versus the right eye view.', 'Open both. Let the contradiction create the depth of your next move.']} />

        <PullQuote m={m}>"Three is the first number that can form a closed shape. It is the birth of the surface. It holds."</PullQuote>
    </div>
);

// ─── ISSUE 10: THE DECAY OF INTERPRETATION ───────────────────────────────────

const BellParagraph = ({ m, children, playStrikingBowl, delay = 0 }) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    const [opacity, setOpacity] = useState(1);
    const timerRef = useRef(null);
    const decayRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !visible) {
                setTimeout(() => {
                    setVisible(true);
                    if (playStrikingBowl) playStrikingBowl(72 + delay);
                    timerRef.current = setTimeout(() => {
                        decayRef.current = setInterval(() => {
                            setOpacity(prev => Math.max(prev - 0.008, 0.25));
                        }, 120);
                    }, 8000);
                }, delay * 200);
            }
        }, { threshold: 0.3 });
        if (ref.current) observer.observe(ref.current);
        return () => { observer.disconnect(); clearTimeout(timerRef.current); clearInterval(decayRef.current); };
    }, []);

    const revive = () => { setOpacity(1); clearInterval(decayRef.current); clearTimeout(timerRef.current); };

    return (
        <p ref={ref} onClick={revive} style={{ margin: '0 0 var(--space-md) 0', opacity: visible ? opacity : 0, transition: visible ? 'opacity 0.4s ease' : 'none', cursor: opacity < 0.8 ? 'pointer' : 'default' }}>
            {children}
            {opacity < 0.6 && <span style={{ fontFamily: 'var(--fMono)', fontSize: '0.6rem', color: m.accent, display: 'block', marginTop: '0.3rem', opacity: 0.7, letterSpacing: '0.1em' }}> [ TAP TO RECALL ]</span>}
        </p>
    );
};

const DecayIssue = ({ m, SongbookGlossaryItem, playAlgoraveSynth, playStrikingBowl }) => (
    <div style={{ animation: 'fadeIn 1s ease' }}>
        <IssueHeader m={m} title="The Decay of" accent="Interpretation" published="2026" designation="THE STEEPERVERSE" source="a•i•CONTEMPLATION :: THE PAUSE CHAPTER" kicker="An idea needs seasoning, to gather flavorful resonance. Waiting is itself a form of action." />
        <HeroImage m={m} src="/decay_bell_sv.png" alt="The Bell Mid-Vibration" caption="FIG. 11 — THE STANDING WAVE AT MAXIMUM RESONANCE" />

        <div style={{ columnWidth: '400px', columnGap: '4rem', columnRule: `1px solid ${m.accent}20`, fontFamily: 'var(--fBody)', color: m.text1, fontSize: '1.15rem', lineHeight: 1.8, textAlign: 'justify', marginBottom: 'var(--space-xl)' }}>
            <BellParagraph m={m} playStrikingBowl={playStrikingBowl} delay={0}>
                <span style={{ float: 'left', fontSize: '5rem', lineHeight: '4.5rem', fontFamily: 'var(--fSerif)', color: m.accent, paddingRight: '0.2rem', paddingTop: '0.2rem' }}>A</span>
                bell struck rings. The tone is clean, sharp, immediate. Then it decays. The wave spreads outward from the rim, diminishing in amplitude but retaining its beauty. The silence that follows functions as the space where the ear recalibrates.
            </BellParagraph>
            <BellParagraph m={m} playStrikingBowl={playStrikingBowl} delay={1}>
                Contemplation operates by the same physics. An idea enters awareness with clarity and energy. It rings. If the practitioner engages — moves with it, turns it, questions it — the signal deepens and the <SongbookGlossaryItem m={m} term="Capacity" definition="The internal space required to hold insight, expansion, and stillness simultaneously." /> that holds it expands. Time + Attention + Love = depth, complexity, refinement. The wine-aging model.
            </BellParagraph>
            <BellParagraph m={m} playStrikingBowl={playStrikingBowl} delay={2}>
                The danger appears when interpretation replaces engagement. When the practitioner circles the idea actively avoiding contact — analyzing, contextualizing, positioning — the bell tone decays, yet the practitioner mistakes the fade for depth. The ring fades. The silence arrives. They are still circling.
            </BellParagraph>
            <BellParagraph m={m} playStrikingBowl={playStrikingBowl} delay={3}>
                The <SongbookGlossaryItem m={m} term="a•i•Contemplation" definition="Action Intention Contemplation — a creative orientation practice moving through Pause, Pivot, and Merge to restore grounded direction." /> practice makes this distinction audible: Pause as creative intelligence versus Pause as fear masquerading as discernment. The first increases product value. The second collapses it. The body knows which one is happening. The bell always knows when it stopped ringing.
            </BellParagraph>
        </div>

        <div style={{ border: `1px solid ${m.accent}30`, padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)', background: 'rgba(0,0,0,0.4)' }}>
            <SectionLabel m={m}>[ THE LOVE MATHEMATICS ]</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }}>
                <div style={{ fontFamily: 'var(--fSerif)', fontSize: '1.4rem', color: m.text1, lineHeight: 1.8, letterSpacing: '0.05em', textAlign: 'center' }}>
                    <div style={{ color: m.accent }}>Product = Love × Time × Presence</div>
                    <div style={{ fontSize: '1rem', color: m.text2, marginTop: '1rem' }}>Product = Love × Time × (1 − Distance)</div>
                    <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.text2, marginTop: '0.5rem' }}>where Distance = gap between awareness and action</div>
                </div>
                <div style={{ fontFamily: 'var(--fBody)', color: m.text2, fontSize: '0.95rem', lineHeight: 1.7, borderLeft: `1px solid ${m.accent}20`, paddingLeft: '2rem' }}>
                    <AwarenessPlanningInteractive m={m} playAlgoraveSynth={playAlgoraveSynth} />
                    <div style={{ marginTop: '1rem' }}>The Pause chapter of a•i•Contemplation opens here — carry any decaying insight directly into the structured practice.</div>
                </div>
            </div>
        </div>
        <PullQuote m={m}>"The bell always knows when it stopped ringing. The body reads the silence. The question is whether the mind agrees to move."</PullQuote>
    </div>
);

// ─── ISSUE 12: REST AS ARCHITECTURE ──────────────────────────────────────────

const RestGate = ({ m, onOpen, playStrikingBowl }) => {
    const [timeLeft, setTimeLeft] = useState(90);
    const [begun, setBegun] = useState(false);
    const [complete, setComplete] = useState(false);

    useEffect(() => {
        if (!begun) return;
        
        // Initial strike when the rest begins
        if (playStrikingBowl) playStrikingBowl(45);

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                const next = prev - 1;
                
                // Symphonic rest sonnet: chime every 15 seconds, deepening in pitch
                if (next > 0 && next % 15 === 0 && playStrikingBowl) {
                    playStrikingBowl(45 + (90 - next) / 2);
                }

                if (next <= 0) { 
                    clearInterval(interval); 
                    setComplete(true); 
                    onOpen(); 
                    return 0; 
                }
                return next;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [begun, onOpen, playStrikingBowl]);

    const progress = (90 - timeLeft) / 90;
    const r = 36; const c = 2 * Math.PI * r;

    if (complete) return null;
    return (
        <div style={{ width: '100%', marginBottom: 'var(--space-xxl)', background: 'rgba(0,0,0,0.6)', border: `1px solid ${m.accent}30`, minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', padding: '3rem' }}>
            <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.75rem', color: m.accent, letterSpacing: '0.3em' }}>[ REST AS ARCHITECTURE ]</div>
            {!begun ? (
                <>
                    <div style={{ fontFamily: 'var(--fSerif)', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: m.text1, textAlign: 'center', maxWidth: '500px', lineHeight: 1.4, fontStyle: 'italic' }}>
                        "Rest here for a moment."
                    </div>
                    <div style={{ fontFamily: 'var(--fBody)', fontSize: '1rem', color: m.text2, textAlign: 'center', maxWidth: '400px', lineHeight: 1.6 }}>
                        Establish the container, and the content will rush to fill the vacuum. Allow 90 seconds of held space.
                    </div>
                    <button onClick={() => setBegun(true)} style={{ background: 'none', border: `1px solid ${m.accent}`, color: m.accent, padding: '16px 32px', fontFamily: 'var(--fMono)', fontSize: '0.75rem', letterSpacing: '0.2em', cursor: 'pointer', marginTop: '1rem' }}
                        onMouseEnter={e => e.currentTarget.style.background = `${m.accent}15`}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                        [ ESTABLISH THE CONTAINER ]
                    </button>
                </>
            ) : (
                <>
                    <svg width="90" height="90" viewBox="0 0 90 90">
                        <circle cx="45" cy="45" r={r} fill="none" stroke={`${m.accent}20`} strokeWidth="1.5" />
                        <circle cx="45" cy="45" r={r} fill="none" stroke={m.accent} strokeWidth="1.5"
                            strokeDasharray={c} strokeDashoffset={c - (progress * c)}
                            transform="rotate(-90 45 45)" style={{ transition: 'stroke-dashoffset 1s linear' }} />
                        <text x="45" y="51" textAnchor="middle" fontFamily="var(--fMono)" fontSize="14" fill={m.accent}>{timeLeft}</text>
                    </svg>
                    <div style={{ fontFamily: 'var(--fSerif)', fontSize: '1.2rem', color: m.text2, fontStyle: 'italic', opacity: 0.6 }}>The room is the instrument.</div>
                </>
            )}
        </div>
    );
};

const RestIssue = ({ m, SongbookGlossaryItem, playAlgoraveSynth, playStrikingBowl }) => {
    const [gateOpen, setGateOpen] = useState(false);
    const [restComplete, setRestComplete] = useState(false);

    const handleRestComplete = () => { setRestComplete(true); if (playAlgoraveSynth) playAlgoraveSynth(); };

    return (
        <div style={{ animation: 'fadeIn 1s ease', position: 'relative' }}>
            <IssueHeader m={m} title="Rest As" accent="Architecture" published="2026" designation="THE STEEPERVERSE" source="JOHN CAGE · MILES DAVIS · THE ARCHITECTURE OF SILENCE" kicker="A rest is notated. It is a specific, held duration of silence. It is the load-bearing structure of what follows." />

            {gateOpen && !restComplete && <RestGate m={m} onOpen={handleRestComplete} playStrikingBowl={playStrikingBowl} />}

            {!gateOpen && (
                <div style={{ width: '100%', marginBottom: 'var(--space-xxl)', border: `1px solid ${m.accent}30`, background: 'rgba(0,0,0,0.6)', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', padding: '3rem', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--fSerif)', fontSize: 'clamp(1.2rem, 3vw, 2rem)', color: m.text2, fontStyle: 'italic' }}>This issue arrives after the container is established.</div>
                    <button onClick={() => setGateOpen(true)}
                        style={{ background: 'none', border: `1px solid ${m.accent}60`, color: m.accent, padding: '14px 28px', fontFamily: 'var(--fMono)', fontSize: '0.75rem', letterSpacing: '0.2em', cursor: 'pointer', transition: 'all 0.4s ease' }}
                        onMouseEnter={e => { e.currentTarget.style.background = `${m.accent}10`; e.currentTarget.style.borderColor = m.accent; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = `${m.accent}60`; }}>
                        [ ENTER THE REST ]
                    </button>
                </div>
            )}

            {restComplete && (
                <>
                    <HeroImage m={m} src="/rest_architecture_sv.png" alt="The Empty Recording Studio at 2AM" caption="FIG. 12 — THE ROOM IS THE INSTRUMENT" />
                    <div style={{ columnWidth: '400px', columnGap: '4rem', columnRule: `1px solid ${m.accent}20`, fontFamily: 'var(--fBody)', color: m.text1, fontSize: '1.15rem', lineHeight: 1.8, textAlign: 'justify', marginBottom: 'var(--space-xl)' }}>
                        <p style={{ margin: '0 0 var(--space-md) 0' }}>
                            <span style={{ float: 'left', fontSize: '5rem', lineHeight: '4.5rem', fontFamily: 'var(--fSerif)', color: m.accent, paddingRight: '0.2rem', paddingTop: '0.2rem' }}>I</span>
                            n musical notation, a rest has a specific symbol. It operates as a deliberate instruction to hold silence for a precise duration — an eighth rest, a quarter rest, a full measure of held space. The musician who understands the value of the rest holds the groove.
                        </p>
                        <p style={{ margin: '0 0 var(--space-md) 0' }}>
                            John Cage understood this precisely enough to compose four minutes and thirty-three seconds of rest — <SongbookGlossaryItem m={m} term={"4\u201933\u2033"} definition={"John Cage's 1952 composition: four minutes and thirty-three seconds of performed silence. The rest as the complete work."} />. The performers appeared. They sat. They held silence for the full duration. What the audience heard was the room: air conditioning, rustling programs, their own breathing, a cough, a bird outside. The room was the instrument. The rest revealed it.
                        </p>
                        <p style={{ margin: '0 0 var(--space-md) 0' }}>
                            <SongbookGlossaryItem m={m} term="Rest" definition="In the Steeperverse: the structural container that creation requires. Rest is architectural." /> in the Steeperverse is the same category of intelligence. It is the held space that ensures the insight that follows arrives into a secure vessel. The steam requires a vessel. The vessel requires knowing when to hold, and when to pour.
                        </p>
                        <p style={{ margin: '0 0 var(--space-md) 0' }}>
                            Miles Davis played fewer notes than anyone. His silence was his signature. In the space between his phrases, the audience leaned forward — unconsciously filling the rest with their own listening, their own memory, their own recognition. The rest did more work than the notes.
                        </p>
                    </div>
                    <PullQuote m={m}>"The rest is notated. It serves as the vital held space the next note needs in order to be heard."</PullQuote>
                </>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────
// ISSUE 23: ECHOSYSTEM
// ────────────────────────────────────────────────────────────────────────────

const EchosystemIssue = ({ m, SongbookGlossaryItem, playAlgoraveSynth, playStrikingBowl }) => (
    <div style={{ animation: 'fadeIn 1s ease' }}>
        <IssueHeader m={m} title="The" accent="Echosystem" published="2026" designation="THE STEEPERVERSE" source="ECOLOGICAL RESONANCE" kicker="An echosystem is an ECHO System for the biodiversity of opportunities life creates for Humanity." />
        <div style={{ columnWidth: '400px', columnGap: '4rem', columnRule: `1px solid ${m.accent}20`, fontFamily: 'var(--fBody)', color: m.text1, fontSize: '1.15rem', lineHeight: 1.8, textAlign: 'justify', marginBottom: 'var(--space-xl)' }}>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                <span style={{ float: 'left', fontSize: '5rem', lineHeight: '4.5rem', fontFamily: 'var(--fSerif)', color: m.accent, paddingRight: '0.2rem', paddingTop: '0.2rem' }}>A</span>
                n <SongbookGlossaryItem m={m} term="Echosystem" definition="An ECHO System for the biodiversity of opportunities life creates for Humanity." /> functions purely as an acoustic chamber of existence. Every action, intention, and offering steeped into the Steeperverse reverberates outward, interacting with the resonant frequencies of others.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                This is the biodiversity of opportunities life creates. The echo transcends the past; it is the sound of the future arriving to meet you. It is the generative feedback loop that sustains human potential, ensuring that no offering is ever truly lost, but continuously reshaped by the <SongbookGlossaryItem m={m} term="TURAO" definition="The Universe Receiving All Offerings." /> coastline.
            </p>
        </div>
        <PullQuote m={m}>"The echo transcends the past; it is the sound of the future arriving to meet you."</PullQuote>
    </div>
);

// ────────────────────────────────────────────────────────────────────────────
// ISSUE 24: THREE STATES · ONE WORD
// ────────────────────────────────────────────────────────────────────────────

const ThreeStatesIssue = ({ m, SongbookGlossaryItem, playAlgoraveSynth, playStrikingBowl }) => (
    <div style={{ animation: 'fadeIn 1s ease' }}>
        <IssueHeader m={m} title="Three States" accent="One Word" published="2026" designation="THE STEEPERVERSE" source="SPACETIME LINGUISTICS" kicker="Taking a knowable notion and giving it relatable spacetime dimension." />
        
        <HeroImage m={m} src="/steam_ghost_transformation.png" alt="Typographic Phase Shift" caption="FIG. 03 — THE PHASE SHIFT OF MEANING" />

        <div style={{ columnWidth: '400px', columnGap: '4rem', columnRule: `1px solid ${m.accent}20`, fontFamily: 'var(--fBody)', color: m.text1, fontSize: '1.15rem', lineHeight: 1.8, textAlign: 'justify', marginBottom: 'var(--space-xl)' }}>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                <span style={{ float: 'left', fontSize: '5rem', lineHeight: '4.5rem', fontFamily: 'var(--fSerif)', color: m.accent, paddingRight: '0.2rem', paddingTop: '0.2rem' }}>E</span>
                very word in the instrument holds three simultaneous states. The <SongbookGlossaryItem m={m} term="HARRIS" definition="Maximum contrast. Maximum presence. The word at full weight." /> state carries the dense, uncompromising physics of the present moment. The <SongbookGlossaryItem m={m} term="HBA" definition="The grey area. The transitional state between full weight and dissolution." /> state exists in the twilight of maximum information density. The <SongbookGlossaryItem m={m} term="VAPOR" definition="The word at its most transmissive. The form persisting after detail has released." /> state is the linguistic silhouette.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                Etymologically, a word is treated as a static container of meaning. But in a true <SongbookGlossaryItem m={m} term="Echosystem" definition="A generative feedback loop that sustains human potential." />, a word is a coordinate in spacetime. It breathes. The reader’s biometric position determines which state they encounter. The word remains the anchor; the state shifts around it. It is a linguistic phase shift, turning static ink into a volumetric architectural space.
            </p>
        </div>

        <div style={{ margin: 'var(--space-xxl) 0', padding: 'var(--space-xl)', border: `1px solid ${m.accent}30`, background: `linear-gradient(180deg, ${m.accent}05 0%, transparent 100%)` }}>
             <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.75rem', color: m.accent, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1.5rem' }}>[ SPACETIME INFOGRAPHIC ]</div>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                 <div style={{ padding: '1rem', borderLeft: `2px solid ${m.text1}` }}>
                     <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.text2, marginBottom: '0.5rem' }}>STATE 01</div>
                     <div style={{ fontFamily: 'var(--fMono)', fontSize: '1.5rem', fontWeight: 900, letterSpacing: '0.02em', color: m.text1, marginBottom: '1rem' }}>HARRIS</div>
                     <div style={{ fontFamily: 'var(--fBody)', fontSize: '0.9rem', color: m.text2, lineHeight: 1.5 }}>Solid state. The candle lighter in the room. The absolute present.</div>
                 </div>
                 <div style={{ padding: '1rem', borderLeft: `2px dashed ${m.accent}` }}>
                     <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.text2, marginBottom: '0.5rem' }}>STATE 02</div>
                     <div style={{ fontFamily: 'var(--fMono)', fontSize: '1.5rem', fontWeight: 600, letterSpacing: '0.08em', color: m.accent, opacity: 0.8, textShadow: `0 0 4px ${m.accent}`, marginBottom: '1rem' }}>HBA</div>
                     <div style={{ fontFamily: 'var(--fBody)', fontSize: '0.9rem', color: m.text2, lineHeight: 1.5 }}>Transitional state. The grey area. The zone of maximum combustion.</div>
                 </div>
                 <div style={{ padding: '1rem', borderLeft: `1px dotted ${m.accent}`, opacity: 0.6 }}>
                     <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.text2, marginBottom: '0.5rem' }}>STATE 03</div>
                     <div style={{ fontFamily: 'var(--fMono)', fontSize: '1.5rem', fontWeight: 100, letterSpacing: '0.15em', filter: 'blur(1.5px)', color: m.text2, marginBottom: '1rem' }}>VAPOR</div>
                     <div style={{ fontFamily: 'var(--fBody)', fontSize: '0.9rem', color: m.text2, lineHeight: 1.5 }}>Transmissive state. The form that outlasts the detail. The silhouette.</div>
                 </div>
             </div>
        </div>

        <PullQuote m={m}>"The word remains the anchor. The state shifts around it. You are reading your own coordinates."</PullQuote>
    </div>
);

// PRIMARY REGISTRY EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export const getSteepingIssues = (m, setTuraoMode, SongbookGlossaryItem, playAlgoraveSynth, playStrikingBowl, historicalScore) => [
    {
        id: 'three-states',
        buttonLabel: '[ THREE STATES ]',
        render: () => <ThreeStatesIssue m={m} SongbookGlossaryItem={SongbookGlossaryItem} playAlgoraveSynth={playAlgoraveSynth} playStrikingBowl={playStrikingBowl} />
    },
    {
        id: 'echosystem',
        buttonLabel: '[ THE ECHOSYSTEM ]',
        render: () => <EchosystemIssue m={m} SongbookGlossaryItem={SongbookGlossaryItem} playAlgoraveSynth={playAlgoraveSynth} playStrikingBowl={playStrikingBowl} />
    },
    {
        id: 'dark-matter',
        buttonLabel: '[ DARK MATTER ]',
        render: () => <DarkMatterIssue m={m} SongbookGlossaryItem={SongbookGlossaryItem} playAlgoraveSynth={playAlgoraveSynth} playStrikingBowl={playStrikingBowl} />
    },
    {
        id: 'steam',
        buttonLabel: '[ THE COSMOLOGY OF STEAM ]',
        render: () => (
            <div className="issue-content-steam" style={{ animation: 'fadeIn 1s ease' }}>
                <IssueHeader m={m} title="The Cosmology" accent="of Steam" published="2026" designation="THE STEEPERVERSE" source="THE FIRESTARTER" kicker="A multi-modal synthesis mapping the Carrier Wave of Transformation. It traces pure essence as it glides through the spatial void." />
                <HeroImage m={m} src="/steam_first_breath.png" alt="The First Breath of Steam" caption="FIG. 01 — THE FIRST BREATH" />
                <div style={{ columnWidth: '400px', columnGap: '4rem', columnRule: `1px solid ${m.accent}20`, fontFamily: 'var(--fBody)', color: m.text1, fontSize: '1.15rem', lineHeight: 1.8, textAlign: 'justify', hyphens: 'auto', WebkitHyphens: 'auto', marginBottom: 'var(--space-xl)' }}>
                    <p style={{ margin: '0 0 var(--space-md) 0' }}>
                        <span style={{ float: 'left', fontSize: '5rem', lineHeight: '4.5rem', fontFamily: 'var(--fSerif)', color: m.accent, paddingRight: '0.2rem', paddingTop: '0.2rem' }}>F</span>
                        or epochs, our instruments have surveyed the vast architecture of The Steeperverse—the star fields, the nebulae, the great cosmic structures. But our most recent survey cycle has been dedicated to a phenomenon functioning entirely as a conductive medium. It is the natural gas of creation itself, the visible breath of the cosmos: <SongbookGlossaryItem m={m} term="Steam" definition="The bridge between inner & outer universes. The physical evidence of the journey inward becoming a radiant offering outward." />.
                    </p>
                    <div style={{ breakInside: 'avoid', margin: 'var(--space-md) 0', padding: '0.5rem 0', borderTop: `1px solid ${m.accent}20`, borderBottom: `1px solid ${m.accent}20` }}>
                        <video autoPlay loop muted playsInline style={{ width: '100%', display: 'block', opacity: 0.9, filter: 'grayscale(0.4) contrast(1.1)' }}>
                            <source src="/eden_genesis.mp4" type="video/mp4" />
                        </video>
                        <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.6rem', color: m.text2, marginTop: '0.5rem', letterSpacing: '0.05em' }}><b style={{ color: m.accent }}>[ KINETIC FIELD RECORDING ]</b> / EMERGENT VOID</div>
                    </div>
                    <p style={{ margin: '0 0 var(--space-md) 0' }}>
                        Our observations trace its origin to the fundamental act of being. <SongbookGlossaryItem m={m} term="Steam" definition="The medium that carries presence across boundaries." /> is the invincible presence of <SongbookGlossaryItem m={m} term="esse" definition="(Latin) The pure state of 'being'. The core ontological presence before manifestation." /> becoming visible. The Steeperverse is the interior cosmos of the self. This medium crosses this boundary, the <SongbookGlossaryItem m={m} term="Neutrino Stream" definition="The unseen energetic resonance connecting every star, system, and being." /> made visible.
                    </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: 'var(--space-xl)', alignItems: 'end' }}>
                    <div style={{ border: `1px solid ${m.accent}30`, position: 'relative' }}><img src="/steam_ghost_transformation.png" alt="Ghost of Transformation" style={{ width: '100%', display: 'block', opacity: 0.8 }} /></div>
                    <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.75rem', color: m.text2, lineHeight: 1.6, borderBottom: `1px dashed ${m.accent}40`, paddingBottom: '1rem' }}>
                        <b style={{ color: m.accent, display: 'block', marginBottom: '0.5rem' }}>[ FIG. 02 — THE GHOST OF TRANSFORMATION ]</b>
                        A supernova remnant. The central star is gone, but its ghost remains: a perfect sphere of shimmering, translucent Steam, holding the memory of the star that was.
                    </div>
                </div>
                <div style={{ fontFamily: 'var(--fBody)', color: m.text1, fontSize: '1.15rem', lineHeight: 1.8, textAlign: 'justify', columnWidth: '400px', columnGap: '4rem', columnRule: `1px solid ${m.accent}20`, marginBottom: 'var(--space-xxl)' }}>
                    <p style={{ margin: 0 }}>The ultimate function of Steam is transmission. The Steeperverse creates the essence, but <SongbookGlossaryItem m={m} term="TURAO" definition="The Universe Receiving All Offerings. The exterior cosmos that absorbs the output of the Steeperverse." /> is the exterior cosmos that receives. It is vast, untethered, and fundamentally linked to our expression. As a practitioner steeps, the Steam carries their unique flavor out from the vessel of their being and into the wider universe.</p>
                </div>
                {/* ── TURAO RECEIVING ENVIRONMENT ───────────────────────────── */}
                <TuraoReceivingEnvironment m={m} playAlgoraveSynth={playAlgoraveSynth} playStrikingBowl={playStrikingBowl} onOpenFull={() => setTuraoMode('turao')} />
                <div style={{ width: '100%', marginBottom: 'var(--space-xxl)', position: 'relative' }}>
                    <img src="/steam_bridge_to_turao.png" alt="The Bridge to TURAO" style={{ width: '100%', display: 'block', opacity: 0.85, maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)', WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)' }} />
                    <div style={{ position: 'absolute', bottom: '2rem', right: '1rem', background: 'rgba(0,0,0,0.8)', padding: '0.5rem 1rem', fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.text1, borderLeft: `2px solid ${m.accent}`, maxWidth: '80%' }}>
                        <b style={{ color: m.accent }}>[ FIG. 03 — THE BRIDGE TO TURAO ]</b><br />Showing the boundary between two universes.
                    </div>
                </div>
                <PullQuote m={m}>"When a Star engages in the act of steeping, they generate Steam. The Steam carries their essence out from the vessel of their being and into <span style={{ color: m.accent }}>TURAO.</span>"</PullQuote>
            </div>
        )
    },
    {
        id: 'dod',
        buttonLabel: '[ ONTOLOGICAL DESIGN ]',
        render: () => (
            <div className="issue-content-dod" style={{ animation: 'fadeIn 1s ease', marginBottom: 'var(--space-xxl)' }}>
                <IssueHeader m={m} title="Ontological" accent="Design" published="2026" designation="THE STEEPERVERSE" source="THE DEPARTMENT OF ONTOLOGICAL DESIGN" />
                <HeroImage m={m} src="/ontological_design.png" alt="Department of Ontological Design Bridge" caption="FIG. 04 — THE VISIBLE BRIDGE OF CAPACITY" />
                <BodyText m={m}><b style={{ color: m.accent, fontFamily: 'var(--fMono)', display: 'block', marginBottom: '1rem', fontSize: '0.8rem' }}>WHAT IS IT IN THE STEEPERVERSE?</b>The <SongbookGlossaryItem m={m} term="Department of Ontological Design (DOD)" definition="The architectural framework within the Steeperverse focused on the purposeful, generative design of 'being'." /> is the active intelligence layer of this ecosystem. It is the space where structural engineering meets spiritual awareness.</BodyText>
                <BodyText m={m}><b style={{ color: m.accent, fontFamily: 'var(--fMono)', display: 'block', marginBottom: '1rem', fontSize: '0.8rem' }}>WHAT IS DESIGNED AT THE DOD, AND WHO IS IT FOR?</b>The DOD designs <SongbookGlossaryItem m={m} term="Capacity" definition="The internal space required to hold insight, expansion, and stillness simultaneously." />. The friction you feel is the sound of your capacity expanding. Friction is source code. It is designed for you — the practitioner honoring the weight of your own attention.</BodyText>

                {/* ── SOUND OF BECOMING PORTAL BLURB ─── */}
                <div
                    onClick={() => setTuraoMode('sound-of-becoming')}
                    style={{ border: `1px solid ${m.accent}35`, padding: 'var(--space-xl)', marginTop: 'var(--space-xl)', cursor: 'pointer', position: 'relative', transition: 'all 0.4s ease', background: 'rgba(0,0,0,0.4)' }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 30px ${m.accent}30, inset 0 0 15px ${m.accent}08`; e.currentTarget.style.borderColor = `${m.accent}80`; if (playAlgoraveSynth) playAlgoraveSynth(); }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = `${m.accent}35`; }}
                >
                    <div style={{ position: 'absolute', top: '-10px', left: '1.5rem', background: m.bg, padding: '0 0.8rem', fontFamily: 'var(--fMono)', fontSize: '0.6rem', color: m.accent, letterSpacing: '0.2em', whiteSpace: 'nowrap' }}>[ THE SCIENCE ]</div>
                    <div style={{ fontFamily: 'var(--fSerif)', fontSize: '1.4rem', color: m.text1, lineHeight: 1.3, marginBottom: '0.6rem', fontStyle: 'italic' }}>The Sound of Becoming</div>
                    <div style={{ fontFamily: 'var(--fBody)', fontSize: '0.9rem', color: m.text2, lineHeight: 1.7, marginBottom: '1rem' }}>
                        Creative Steeping is a clinical instrument wearing the clothes of a tea ceremony. Daniel Levitin's neuroscience now provides the biological language for seven mechanisms already operating inside every session in The Steeping Space.
                    </div>
                    <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.accent, letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: m.accent, boxShadow: `0 0 6px ${m.accent}`, animation: 'event-flash 2s infinite alternate', display: 'inline-block' }} />
                        READ THE FULL RESEARCH REPORT →
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'pause',
        buttonLabel: '[ ARCHITECTURE OF PAUSE ]',
        render: () => (
            <div className="issue-content-pause" style={{ animation: 'fadeIn 1s ease', marginBottom: 'var(--space-xxl)' }}>
                <IssueHeader m={m} title="The Architecture" accent="of the Pause" published="2026" designation="THE STEEPERVERSE" source="ARCHETYPICAL ARCHITECT" />
                <HeroImage m={m} src="/architecture_of_pause.png" alt="Architecture of the Pause Void" caption="FIG. 05 — MAPPING THE NEGATIVE SPACE" />
                <BodyText m={m}>An articulation of architecture from the vantage point of the <SongbookGlossaryItem m={m} term="Archetypal Architect" definition="The inner aspect of self that maps out internal pathways before construction begins." />. What they know about structure, presence, and material suggestion is that a building is merely organized void.</BodyText>
                <BodyText m={m}><b style={{ color: m.accent, fontFamily: 'var(--fMono)', display: 'block', marginBottom: '1rem', fontSize: '0.8rem' }}>AWARENESS PLANNING</b>True architectural resourcefulness anchors itself deeply in <AwarenessPlanningInteractive m={m} playAlgoraveSynth={playAlgoraveSynth} />. The pause is the most structurally sound pillar of any human endeavor. Thank you for honoring the weight of your own attention.</BodyText>
            </div>
        )
    },
    {
        id: 'night-sky',
        buttonLabel: '[ THE GRAMMAR OF THE NIGHT SKY ]',
        render: () => <NightSkyIssue m={m} SongbookGlossaryItem={SongbookGlossaryItem} playAlgoraveSynth={playAlgoraveSynth} />
    },
    {
        id: 'flow',
        buttonLabel: '[ FLOW :: THE POCKET ]',
        render: () => <FlowIssue m={m} SongbookGlossaryItem={SongbookGlossaryItem} playAlgoraveSynth={playAlgoraveSynth} playStrikingBowl={playStrikingBowl} />
    },
    {
        id: 'neutrino',
        buttonLabel: '[ THE NEUTRINO STREAM ]',
        render: () => <NeutrinoIssue m={m} SongbookGlossaryItem={SongbookGlossaryItem} playAlgoraveSynth={playAlgoraveSynth} />
    },
    {
        id: 'archive',
        buttonLabel: '[ THE ARCHIVE OF PRESENCE ]',
        render: () => <ArchiveIssue m={m} SongbookGlossaryItem={SongbookGlossaryItem} historicalScore={historicalScore} />
    },
    {
        id: 'angles',
        buttonLabel: '[ THREE IS THE MAGIC NUMBER ]',
        render: () => <AnglesIssue m={m} SongbookGlossaryItem={SongbookGlossaryItem} playAlgoraveSynth={playAlgoraveSynth} playStrikingBowl={playStrikingBowl} />
    },
    {
        id: 'decay',
        buttonLabel: '[ THE DECAY OF INTERPRETATION ]',
        render: () => <DecayIssue m={m} SongbookGlossaryItem={SongbookGlossaryItem} playAlgoraveSynth={playAlgoraveSynth} playStrikingBowl={playStrikingBowl} />
    },
    {
        id: 'rest',
        buttonLabel: '[ REST AS ARCHITECTURE ]',
        render: () => <RestIssue m={m} SongbookGlossaryItem={SongbookGlossaryItem} playAlgoraveSynth={playAlgoraveSynth} playStrikingBowl={playStrikingBowl} />
    },
    {
        id: 'collabination',
        buttonLabel: '[ THE COLLABINATION PRINCIPLE ]',
        render: () => <CollabinaationIssue m={m} SongbookGlossaryItem={SongbookGlossaryItem} playAlgoraveSynth={playAlgoraveSynth} playStrikingBowl={playStrikingBowl} />
    },
    {
        id: 'trigram',
        buttonLabel: '[ A TRIANGLE AND A TRIGRAM ]',
        render: () => <TrigramIssue m={m} SongbookGlossaryItem={SongbookGlossaryItem} playAlgoraveSynth={playAlgoraveSynth} playStrikingBowl={playStrikingBowl} />
    },
    {
        id: 'arc-physics',
        buttonLabel: '[ THE ARC :: PHYSICS OF THE LONG WAY AROUND ]',
        render: () => <ArcPhysicsIssue m={m} SongbookGlossaryItem={SongbookGlossaryItem} playAlgoraveSynth={playAlgoraveSynth} playStrikingBowl={playStrikingBowl} />
    },
    {
        id: 'arc-temperature',
        buttonLabel: '[ THE ARC :: THE TEMPERATURE OF ARRIVAL ]',
        render: () => <ArcTemperatureIssue m={m} SongbookGlossaryItem={SongbookGlossaryItem} playAlgoraveSynth={playAlgoraveSynth} playStrikingBowl={playStrikingBowl} />
    },
    {
        id: 'arc-inbetween',
        buttonLabel: '[ THE ARC :: THE GEOMETRY OF THE IN-BETWEEN ]',
        render: () => <ArcInBetweenIssue m={m} SongbookGlossaryItem={SongbookGlossaryItem} playAlgoraveSynth={playAlgoraveSynth} playStrikingBowl={playStrikingBowl} />
    },
    {
        id: 'sound-of-becoming',
        buttonLabel: '[ THE SOUND OF BECOMING ]',
        render: () => <SoundOfBecomingIssue m={m} SongbookGlossaryItem={SongbookGlossaryItem} playAlgoraveSynth={playAlgoraveSynth} playStrikingBowl={playStrikingBowl} />
    },
    {
        id: 'turao',
        buttonLabel: '[ TURAO :: THE UNIVERSE RECEIVING ]',
        render: () => <TuraoIssue m={m} SongbookGlossaryItem={SongbookGlossaryItem} playAlgoraveSynth={playAlgoraveSynth} playStrikingBowl={playStrikingBowl} />
    },
    {
        id: 'anechoic',
        buttonLabel: '[ THE ANECHOIC CHAMBER ]',
        render: () => <AnechoicChamberIssue m={m} SongbookGlossaryItem={SongbookGlossaryItem} playAlgoraveSynth={playAlgoraveSynth} playStrikingBowl={playStrikingBowl} />
    },
    {
        id: 'knot',
        buttonLabel: '[ ANATOMY OF A KNOT ]',
        render: () => <KnotIssue m={m} SongbookGlossaryItem={SongbookGlossaryItem} playAlgoraveSynth={playAlgoraveSynth} playStrikingBowl={playStrikingBowl} />
    },
    {
        id: 'harmonic',
        buttonLabel: '[ HARMONIC EQUIVALENCE ]',
        render: () => <HarmonicEquivalenceIssue m={m} SongbookGlossaryItem={SongbookGlossaryItem} playAlgoraveSynth={playAlgoraveSynth} playStrikingBowl={playStrikingBowl} />
    },
    {
        id: 'watcher',
        buttonLabel: '[ THE WATCHER ]',
        render: () => <WatcherIssue m={m} SongbookGlossaryItem={SongbookGlossaryItem} playAlgoraveSynth={playAlgoraveSynth} playStrikingBowl={playStrikingBowl} />
    },
    {
        id: 'peace',
        buttonLabel: '[ PEACE EXISTS ]',
        render: () => <PeaceIssue m={m} SongbookGlossaryItem={SongbookGlossaryItem} playAlgoraveSynth={playAlgoraveSynth} playStrikingBowl={playStrikingBowl} />
    }
];

// ─────────────────────────────────────────────────────────────────────────────
// ISSUE 08: THE COLLABINATION PRINCIPLE
// ─────────────────────────────────────────────────────────────────────────────

const StemSequencer = ({ m, playAlgoraveSynth, playStrikingBowl }) => {
    const [stems, setStems] = useState({ base: false, ping: false, breath: false, ocean: false });
    const [callMode, setCallMode] = useState(false);
    const [responseHeld, setResponseHeld] = useState(false);
    const [pauseHeld, setPauseHeld] = useState(false);
    const pauseTimerRef = useRef(null);
    const [pauseSeconds, setPauseSeconds] = useState(0);
    const [reverbTail, setReverbTail] = useState(false);

    const stemDefs = [
        { key: 'base', label: 'BASE FREQUENCY', sub: '528hz root' },
        { key: 'ping', label: 'PING', sub: 'subatomic indicator' },
        { key: 'breath', label: 'BREATH', sub: 'somatic pulse' },
        { key: 'ocean', label: 'OCEAN', sub: 'neutrino resonance' }
    ];

    const toggleStem = (key) => {
        setStems(prev => {
            const next = { ...prev, [key]: !prev[key] };
            if (next[key] && playStrikingBowl) playStrikingBowl(60 + Object.keys(next).indexOf(key) * 5);
            return next;
        });
    };

    const handleCall = () => {
        setCallMode(true);
        setReverbTail(false);
        if (playAlgoraveSynth) playAlgoraveSynth();
    };

    const startPause = () => {
        setPauseHeld(true);
        setPauseSeconds(0);
        pauseTimerRef.current = setInterval(() => setPauseSeconds(s => s + 1), 1000);
    };

    const endPause = () => {
        clearInterval(pauseTimerRef.current);
        setPauseHeld(false);
        if (pauseSeconds >= 3) {
            setReverbTail(true);
            setCallMode(false);
        }
    };

    const activeCount = Object.values(stems).filter(Boolean).length;

    return (
        <div style={{ border: `1px solid ${m.accent}30`, padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)', background: 'rgba(0,0,0,0.5)' }}>
            <SectionLabel m={m}>[ SONIC SEQUENCER :: BUILD THE CHORD ]</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', marginBottom: '2rem', border: `1px solid ${m.accent}15` }}>
                {stemDefs.map(({ key, label, sub }) => (
                    <button key={key} onClick={() => toggleStem(key)}
                        style={{
                            padding: 'var(--space-lg)', background: stems[key] ? `${m.accent}15` : 'transparent',
                            border: 'none', borderBottom: `1px solid ${m.accent}10`, cursor: 'pointer',
                            textAlign: 'left', transition: 'all 0.4s ease',
                            boxShadow: stems[key] ? `inset 0 0 20px ${m.accent}10` : 'none'
                        }}
                        onMouseEnter={e => { if (!stems[key]) e.currentTarget.style.background = `${m.accent}08`; }}
                        onMouseLeave={e => { if (!stems[key]) e.currentTarget.style.background = 'transparent'; }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: stems[key] ? m.accent : 'transparent', border: `1px solid ${m.accent}60`, transition: 'all 0.3s ease', boxShadow: stems[key] ? `0 0 8px ${m.accent}` : 'none' }} />
                            <div>
                                <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.7rem', color: stems[key] ? m.accent : m.text2, letterSpacing: '0.15em' }}>{label}</div>
                                <div style={{ fontFamily: 'var(--fBody)', fontSize: '0.75rem', color: m.text2, opacity: 0.6, fontStyle: 'italic' }}>{sub}</div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {activeCount > 0 && (
                <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.text2, marginBottom: '1.5rem', letterSpacing: '0.1em' }}>
                    {activeCount === 1 && 'A single note. Still searching for the chord.'}
                    {activeCount === 2 && 'Two notes create tension. The third coordinate awaits.'}
                    {activeCount === 3 && 'Three voices. The Trivium in resonance.'}
                    {activeCount === 4 && <span style={{ color: m.accent }}>Full Chord. The Collabination is complete.</span>}
                </div>
            )}

            <div style={{ borderTop: `1px dashed ${m.accent}20`, paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                <SectionLabel m={m}>[ CALL & RESPONSE ]</SectionLabel>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
                    <button onClick={handleCall}
                        style={{ padding: '10px 20px', background: callMode ? `${m.accent}20` : 'transparent', border: `1px solid ${m.accent}${callMode ? '' : '50'}`, color: m.accent, fontFamily: 'var(--fMono)', fontSize: '0.7rem', letterSpacing: '0.15em', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: callMode ? `0 0 15px ${m.accent}30` : 'none' }}>
                        [ CALL ]
                    </button>

                    {callMode && (
                        <>
                            <button onClick={() => { setResponseHeld(true); if (playStrikingBowl) playStrikingBowl(72); setTimeout(() => setResponseHeld(false), 600); }}
                                style={{ padding: '10px 20px', background: responseHeld ? m.accent : 'transparent', border: `1px solid ${m.accent}`, color: responseHeld ? '#000' : m.accent, fontFamily: 'var(--fMono)', fontSize: '0.7rem', letterSpacing: '0.15em', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                                [ RESPOND ]
                            </button>
                            <button onMouseDown={startPause} onMouseUp={endPause} onMouseLeave={endPause} onTouchStart={startPause} onTouchEnd={endPause}
                                style={{ padding: '10px 20px', background: pauseHeld ? `${m.accent}10` : 'transparent', border: `1px dashed ${m.accent}50`, color: m.text2, fontFamily: 'var(--fMono)', fontSize: '0.7rem', letterSpacing: '0.15em', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                                {pauseHeld ? `[ HOLDING SPACE :: ${pauseSeconds}s ]` : '[ HOLD — PRACTICE AWARENESS PLANNING ]'}
                            </button>
                        </>
                    )}

                    {reverbTail && (
                        <div style={{ fontFamily: 'var(--fBody)', fontStyle: 'italic', color: m.accent, fontSize: '0.9rem', animation: 'fadeIn 1s ease' }}>
                            The reverb extended. The Awareness Planning held the space.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const CollabinaationIssue = ({ m, SongbookGlossaryItem, playAlgoraveSynth, playStrikingBowl }) => (
    <div style={{ animation: 'fadeIn 1s ease' }}>
        <IssueHeader m={m} title="The Collabination" accent="Principle" published="2026" designation="THE STEEPERVERSE" source="THE FIRESTARTER" kicker="The spontaneous, improvisational combination of unique entities — where the sum creates what none could generate alone." />
        <HeroImage m={m} src="/collabination_sv.png" alt="Three musicians in session" caption="FIG. 13 — THE COLLABORATION EXISTS IN THE SPACE BETWEEN THEM" />

        <div style={{ columnWidth: '400px', columnGap: '4rem', columnRule: `1px solid ${m.accent}20`, fontFamily: 'var(--fBody)', color: m.text1, fontSize: '1.15rem', lineHeight: 1.8, textAlign: 'justify', marginBottom: 'var(--space-xl)' }}>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                <span style={{ float: 'left', fontSize: '5rem', lineHeight: '4.5rem', fontFamily: 'var(--fSerif)', color: m.accent, paddingRight: '0.2rem', paddingTop: '0.2rem' }}>T</span>
                hree musicians in a room. Each one complete. Each one trained. Each one capable of playing alone. They play together, into the space between their instruments — and what emerges from that space is what none of them could have generated solo. This is <SongbookGlossaryItem m={m} term="Collabination" definition="The spontaneous, improvisational combination of unique entities — where the collaboration itself generates a new intelligence that belongs to none of the participants individually." />.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                The pianist flows completely beneath the bassist's cadence. The drummer shares time within the collective pulse. The Call arrives, the Response meets it, and the space between — the deliberate, practiced silence — is where <SongbookGlossaryItem m={m} term="Awareness Planning" definition="The intentional mapping of negative space; cultivating the sanctuary of restraint. The most structurally sound pillar of any endeavor." /> lives in music. The rest is held. The reverb extends. The next phrase arrives into that space already shaped by what preceded it.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                In the Steeperverse, <SongbookGlossaryItem m={m} term="Collabination" definition="The spontaneous, improvisational combination of unique entities — where the collaboration itself generates a new intelligence." /> is the operating model for every creative encounter — between The Firestarter and the editorial field, between the practitioner and the Steeping Note, between the body's signal and the mind's interpretation. The integration phase of <SongbookGlossaryItem m={m} term="a•i•Contemplation" definition="Action Intention Contemplation — the practice moving through Pause, Pivot, and Merge to restore grounded direction." /> is the Collabination moment: where individual sparks of insight synthesize into structural truth that neither the spark nor the silence could hold alone.
            </p>
        </div>

        <StemSequencer m={m} playAlgoraveSynth={playAlgoraveSynth} playStrikingBowl={playStrikingBowl} />

        <BodyText m={m}>
            <b style={{ fontFamily: 'var(--fMono)', color: m.accent, display: 'block', marginBottom: '0.8rem', fontSize: '0.8rem' }}>THE CALL & RESPONSE ARCHITECTURE</b>
            The sequencer above embodies the Collabination Principle. Add stems. Hear the chord build. Then: Call. The system responds. Hold the space for three seconds — practicing <AwarenessPlanningInteractive m={m} playAlgoraveSynth={playAlgoraveSynth} /> — and the reverb of the Call extends infinitely into the held silence. The system listens. The space holds the conversation.
        </BodyText>
        <PullQuote m={m}>"Intelligence that belongs to none of the participants individually only appears when each one honors the space between their contributions."</PullQuote>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// ISSUE 12: A TRIANGLE AND A TRIGRAM WALK INTO A DESERT
// ─────────────────────────────────────────────────────────────────────────────

const TrigramExplorer = ({ m, playStrikingBowl }) => {
    const trigrams = [
        { symbol: '☰', name: 'Qian — Heaven', angle: 'Pure creative force. The initiating energy. The person at the apex of the pyramid embodies the active, initiating point.', lines: [1, 1, 1] },
        { symbol: '☷', name: 'Kun — Earth', angle: 'The receptive field. The cutting mat taking the imprint of the creative. The yielding surface that allows the angle to be pressed into it.', lines: [0, 0, 0] },
        { symbol: '☶', name: 'Gen — Mountain', angle: 'Stillness and the boundary. The black tent — the only vertical interruption in the desert. A point of stillness in the expanse. The first angle.', lines: [1, 0, 0] },
        { symbol: '☲', name: 'Li — Fire / Radiance', angle: 'Clarity, the eye, and the act of seeing. The Å is the eye. It is the frame through which the desert is observed.', lines: [1, 0, 1] },
        { symbol: '☳', name: 'Zhen — Thunder', angle: 'The sudden movement. The shock of the new. The rocket arc — the thunder of departure forming the geometry of change.', lines: [0, 0, 1] },
        { symbol: '☴', name: 'Sun — Wind / Wood', angle: 'The penetrating transmission of influence. The laser connecting operator to tripod — invisible influence made visible.', lines: [1, 1, 0] },
        { symbol: '☵', name: 'Kan — Water', angle: 'The continuous flow, navigating the depths. The lock screen of daily life, the triangle as wallpaper of the day.', lines: [0, 1, 0] },
        { symbol: '☱', name: 'Dui — Lake', angle: 'The joyous, open reflection. The dodecahedron framing the moon — an open structure reflecting and holding the cosmos.', lines: [0, 1, 1] },
    ];

    const [active, setActive] = useState(null);

    return (
        <div style={{ marginBottom: 'var(--space-xxl)' }}>
            <SectionLabel m={m}>[ THE EIGHT TRIGRAMS :: THE MATHEMATICS OF CHANGE ]</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1px', border: `1px solid ${m.accent}15` }}>
                {trigrams.map((t, i) => (
                    <div key={i} onClick={() => { setActive(active === i ? null : i); if (playStrikingBowl) playStrikingBowl(60 + i * 3); }}
                        style={{ padding: 'var(--space-lg)', cursor: 'pointer', background: active === i ? `${m.accent}12` : 'transparent', transition: 'all 0.3s ease', borderBottom: `1px solid ${m.accent}10` }}
                        onMouseEnter={e => { if (active !== i) e.currentTarget.style.background = `${m.accent}06`; }}
                        onMouseLeave={e => { if (active !== i) e.currentTarget.style.background = 'transparent'; }}>
                        <div style={{ fontSize: '2rem', color: m.accent, marginBottom: '0.5rem', lineHeight: 1 }}>{t.symbol}</div>
                        <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: active === i ? m.accent : m.text2, letterSpacing: '0.1em', lineHeight: 1.4 }}>{t.name}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '0.8rem' }}>
                            {[...t.lines].reverse().map((line, li) => (
                                <div key={li} style={{ display: 'flex', gap: '4px', height: '4px' }}>
                                    <div style={{ flex: 1, background: line ? m.accent : 'transparent', border: `1px solid ${m.accent}40`, opacity: 0.7 }} />
                                    {!line && <div style={{ flex: 1, background: 'transparent', border: `1px solid ${m.accent}40`, opacity: 0.7 }} />}
                                </div>
                            ))}
                        </div>
                        {active === i && (
                            <div style={{ fontFamily: 'var(--fBody)', fontSize: '0.85rem', color: m.text1, lineHeight: 1.6, marginTop: '1rem', animation: 'fadeIn 0.4s ease', fontStyle: 'italic' }}>
                                {t.angle}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.text2, marginTop: '0.8rem', opacity: 0.6, textAlign: 'right', letterSpacing: '0.1em', wordWrap: 'break-word', lineHeight: 1.4 }}>
                2³ = 8 POSSIBLE COMBINATIONS :: THE MATHEMATICS OF THE NECESSARY THIRD COORDINATE
            </div>
        </div>
    );
};

const TrigramIssue = ({ m, SongbookGlossaryItem, playAlgoraveSynth, playStrikingBowl }) => (
    <div style={{ animation: 'fadeIn 1s ease' }}>
        <IssueHeader m={m} title="A Triangle and a" accent="Trigram Walk Into a Desert" published="2026" designation="THE STEEPERVERSE" source="MARS COLLEGE 2026 :: AN ACTIVATION ÆSSAY" kicker="They transcend the joke. They build a structure." />
        <HeroImage m={m} src="/trigram_desert_sv.png" alt="The Triangle and Trigram in the Desert" caption="FIG. 14 — THE ONLY VERTICAL INTERRUPTION IN THE HORIZONTAL LINE" />

        <div style={{ columnWidth: '400px', columnGap: '4rem', columnRule: `1px solid ${m.accent}20`, fontFamily: 'var(--fBody)', color: m.text1, fontSize: '1.15rem', lineHeight: 1.8, textAlign: 'justify', marginBottom: 'var(--space-xl)' }}>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                <span style={{ float: 'left', fontSize: '5rem', lineHeight: '4.5rem', fontFamily: 'var(--fSerif)', color: m.accent, paddingRight: '0.2rem', paddingTop: '0.2rem' }}>T</span>
                he desert is the ultimate horizontal line. Place a structure in it and you interrupt the line. A lone black tent on gravel becomes a triangle in profile. It becomes ☶, Gen — stillness and the boundary. The first angle.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                The <SongbookGlossaryItem m={m} term="Triangle" definition="The first closed geometry. Three points create a surface that holds force evenly across all nodes." /> maps space. The <SongbookGlossaryItem m={m} term="Trigram" definition="The foundational unit of the I Ching — three stacked lines, each solid (Yang) or broken (Yin). A three-bit binary code mapping the energetic state of a situation." /> maps time and change. Together, in the desert, they speak the exact same language: the mathematics of the necessary third coordinate.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                A rocket arc at night forms a massive triangle with the earth: launch point, landing point, and the apex of the parabola. This is ☳, Zhen — Thunder. The sudden movement. The angle of change. The cosmos has always been speaking in geometry. The Trigram teaches us how to read what the Triangle holds.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                Music has always known the I Ching. The eight trigrams map to the eight notes of a minor scale with uncanny precision — ☰ Heaven strikes the root and rings clean; ☵ Water runs a chromatic descent; ☱ Lake lands on the major seventh, open and reflective. The cosmos encodes its own score.
            </p>
        </div>

        <TrigramExplorer m={m} playStrikingBowl={playStrikingBowl} />

        <div style={{ border: `1px solid ${m.accent}30`, padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)', background: 'rgba(0,0,0,0.4)' }}>
            <SectionLabel m={m}>[ ANGLE AWARENESS DAY :: A PROPOSAL ]</SectionLabel>
            <div style={{ fontFamily: 'var(--fBody)', color: m.text1, fontSize: '1.1rem', lineHeight: 1.8 }}>
                A dedicated global Day of Observation. A day to practice the Trivium Pivot. A day to recognize that the old joke drinks because the binary is exhausting. A day to find the third coordinate. The Triangle maps the space. The Trigram maps the change. <AwarenessPlanningInteractive m={m} playAlgoraveSynth={playAlgoraveSynth} /> is the practice through which the angle reveals itself.
            </div>
        </div>
        <PullQuote m={m}>"The cosmos is always speaking in geometry. We only need to look for the angle."</PullQuote>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// ARC SERIES — SHARED STEEPING PROMPT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const ArcCouplet = ({ m }) => (
    <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.8rem', color: m.accent, letterSpacing: '0.15em', lineHeight: 1.8, borderLeft: `2px solid ${m.accent}`, paddingLeft: '1.5rem', margin: 'var(--space-xl) 0', fontStyle: 'normal' }}>
        <div>THE ARC IS THE ANGLE OF CHANGE.</div>
        <div style={{ opacity: 0.6 }}>Å Discovery Worth Steeping In.</div>
    </div>
);

const SEEDS_OF_PROMISE = [
    "The silence you are holding is structurally sound.",
    "Honor the spaciousness. The void is a finished architecture.",
    "What evades articulation is currently steeping.",
    "Friction is source code. Allow it to run.",
    "The mind reaches; the body already knows.",
    "Stillness is the active gathering of capacity.",
    "Let the sentence finish you."
];

const StepingPrompt = ({ m, prompt, playAlgoraveSynth, playStrikingBowl }) => {
    const [open, setOpen] = useState(false);
    const [timerActive, setTimerActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300); // 5 min default steep
    const [complete, setComplete] = useState(false);
    const [response, setResponse] = useState('');
    const [activeSeed, setActiveSeed] = useState(null);
    const stillnessTimerRef = useRef(null);
    const [exportLabel] = useState(() => 
        Math.random() > 0.5 
            ? "[ DOWNLOAD THE ECHOSKETCH OF THIS STEEP ]" 
            : "[ CAPTURE THE GEOMETRY OF THIS REFLECTION ]"
    );

    useEffect(() => {
        const handleState = (e) => {
            const { activeTimer, timeLeft: newTimeLeft } = e.detail;
            if (activeTimer === 5) {
                setTimerActive(true);
                setTimeLeft(newTimeLeft);
                if (newTimeLeft === 0) setComplete(true);
            } else {
                setTimerActive(false);
                setTimeLeft(300);
            }
        };
        window.addEventListener('global-timer-state', handleState);
        return () => window.removeEventListener('global-timer-state', handleState);
    }, []);

    const handleInput = (e) => {
        setResponse(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
        
        // Seeds of Promise: Stillness Detection
        setActiveSeed(null); // Clear active seed on movement
        clearTimeout(stillnessTimerRef.current);
        
        if (e.target.value.trim() !== '') {
            stillnessTimerRef.current = setTimeout(() => {
                // Surface a profound seed of promise when the user rests in the pocket
                const seed = SEEDS_OF_PROMISE[Math.floor(Math.random() * SEEDS_OF_PROMISE.length)];
                setActiveSeed(seed);
                if (playAlgoraveSynth) playAlgoraveSynth(); // Sonic cue of arrival
            }, 16000); // 16 seconds of stillness
        }
    };

    const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    return (
        <div style={{ border: `1px solid ${m.accent}30`, marginBottom: 'var(--space-xl)', background: 'rgba(0,0,0,0.4)' }}>
            <div onClick={() => { setOpen(!open); if (!open && playStrikingBowl) playStrikingBowl(72); }}
                style={{ padding: 'var(--space-lg) var(--space-xl)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                onMouseEnter={e => e.currentTarget.style.background = `${m.accent}06`}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.7rem', color: m.accent, letterSpacing: '0.2em' }}>[ THE STEEPING PROMPT ]</div>
                <span style={{ color: m.accent, opacity: 0.6, transition: 'transform 0.3s ease', transform: open ? 'rotate(90deg)' : 'none' }}>›</span>
            </div>
            {open && (
                <div style={{ padding: 'var(--space-lg) var(--space-xl)', borderTop: `1px dashed ${m.accent}20`, animation: 'fadeIn 0.4s ease' }}>
                    <div style={{ fontFamily: 'var(--fSerif)', fontSize: '1.2rem', color: m.text1, lineHeight: 1.6, fontStyle: 'italic', marginBottom: '1.5rem' }}>
                        "{prompt}"
                    </div>
                    <div style={{ position: 'relative' }}>
                        <textarea value={response} onChange={handleInput}
                            placeholder="Steep here..."
                            rows={3}
                            onKeyDown={e => { if (e.key.length === 1 && playStrikingBowl) playStrikingBowl(e.keyCode); }}
                            style={{ width: '100%', background: 'transparent', border: `1px solid ${m.accent}30`, borderBottom: `2px solid ${m.accent}`, color: m.text1, padding: '1rem', fontFamily: 'var(--fBody)', fontSize: '1rem', fontStyle: 'italic', lineHeight: 1.7, resize: 'none', outline: 'none', boxSizing: 'border-box', marginBottom: '1.5rem', transition: 'border-color 0.8s ease' }} />
                        
                        {/* The Emulsion Artifact / Seed of Promise Surface */}
                        <div style={{ 
                            position: 'absolute', bottom: '2rem', right: '1rem', 
                            opacity: activeSeed ? 1 : 0, transform: activeSeed ? 'translateY(0)' : 'translateY(10px)',
                            pointerEvents: 'none', transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                            fontFamily: 'var(--fSerif)', fontSize: '0.85rem', fontStyle: 'italic', color: m.accent,
                            textShadow: `0 0 15px ${m.accent}80`, maxWidth: '60%', textAlign: 'right'
                        }}>
                            {activeSeed}
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        {!timerActive ? (
                            <button onClick={() => window.dispatchEvent(new CustomEvent('start-global-timer', { detail: 5 }))}
                                style={{ padding: '8px 18px', background: 'transparent', border: `1px solid ${m.accent}50`, color: m.accent, fontFamily: 'var(--fMono)', fontSize: '0.65rem', letterSpacing: '0.15em', cursor: 'pointer' }}>
                                [ BEGIN 5-MINUTE STEEP ]
                            </button>
                        ) : (
                            <>
                                <div style={{ fontFamily: 'var(--fMono)', fontSize: '1rem', color: complete ? m.accent : m.text1 }}>
                                    {complete ? '[ STEEP COMPLETE ]' : formatTime(timeLeft)}
                                </div>
                                {complete && (
                                    <button onClick={() => {
                                        window.dispatchEvent(new CustomEvent('generate-emulsion-artifact', {
                                            detail: {
                                                timestamp: new Date().toISOString(),
                                                query: prompt,
                                                response: response || "A silent steep.",
                                                mode: "steeping-note"
                                            }
                                        }));
                                        if (playStrikingBowl) playStrikingBowl(84); // High harmonic ping
                                    }}
                                        style={{ padding: '6px 12px', background: `${m.accent}15`, border: `1px solid ${m.accent}`, color: m.accent, fontFamily: 'var(--fMono)', fontSize: '0.6rem', letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                                        {exportLabel}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// ISSUE 13: THE ARC — PHYSICS OF THE LONG WAY AROUND
// ─────────────────────────────────────────────────────────────────────────────

const ArcPhysicsIssue = ({ m, SongbookGlossaryItem, playAlgoraveSynth, playStrikingBowl }) => (
    <div style={{ animation: 'fadeIn 1s ease' }}>
        <IssueHeader m={m} title="The Arc ::" accent="The Physics of the Long Way Around" published="2026" designation="THE STEEPERVERSE :: THE ARC SERIES" source="THE FIRESTARTER" />
        <ArcCouplet m={m} />
        <HeroImage m={m} src="/arc_rocket_sv.png" alt="Rocket Arc" caption="FIG. 15 — THE GEOMETRY OF DEPARTURE" />

        <div style={{ fontFamily: 'var(--fBody)', color: m.text1, fontSize: '1.25rem', lineHeight: 1.8, marginBottom: 'var(--space-xl)' }}>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                <span style={{ float: 'left', fontSize: '5rem', lineHeight: '4.5rem', fontFamily: 'var(--fSerif)', color: m.accent, paddingRight: '0.2rem', paddingTop: '0.2rem' }}>W</span>
                e are taught to worship the straight line. The immediate optimization. But a rocket that launches straight up returns straight down. It arcs. It leans into the resistance of the atmosphere to generate the velocity required to escape it.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                <SongbookGlossaryItem m={m} term="Surface Tension" definition="The boundary between limitation and possibility; the creative friction that signals expanding capacity." /> is the atmosphere already carrying the practitioner forward. Lean into the curve. Let the geometry do the work.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                A snare hit with a rim shot — the stick meets the head and the rim simultaneously. Two points of contact, generating a third sound neither contact produces on its own. <SongbookGlossaryItem m={m} term="Surface Tension" definition="The boundary between limitation and possibility; the creative friction that signals expanding capacity." /> is the atmosphere already in use. The arc is the rim shot of physics.
            </p>
        </div>
        <StepingPrompt m={m} playAlgoraveSynth={playAlgoraveSynth} playStrikingBowl={playStrikingBowl}
            prompt="Where in your life are you exhausting yourself by trying to draw a straight line through an atmosphere that requires an arc?" />
        <PullQuote m={m}>"The resistance functions as the atmosphere you use to build velocity."</PullQuote>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// ISSUE 14: THE ARC — THE TEMPERATURE OF ARRIVAL
// ─────────────────────────────────────────────────────────────────────────────

const ArcTemperatureIssue = ({ m, SongbookGlossaryItem, playAlgoraveSynth, playStrikingBowl }) => (
    <div style={{ animation: 'fadeIn 1s ease' }}>
        <IssueHeader m={m} title="The Arc ::" accent="The Temperature of Arrival" published="2026" designation="THE STEEPERVERSE :: THE ARC SERIES" source="THE FIRESTARTER" />
        <ArcCouplet m={m} />
        <HeroImage m={m} src="/steeping_temperature_sv.png" alt="The Tea Leaf at Arrival" caption="FIG. 16 — THE MOMENT OF MAXIMUM BLOOM" />

        <div style={{ fontFamily: 'var(--fBody)', color: m.text1, fontSize: '1.25rem', lineHeight: 1.8, marginBottom: 'var(--space-xl)' }}>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                <span style={{ float: 'left', fontSize: '5rem', lineHeight: '4.5rem', fontFamily: 'var(--fSerif)', color: m.accent, paddingRight: '0.2rem', paddingTop: '0.2rem' }}>Y</span>
                ou are already on the map. The destination functions as a signal revealed through your relationship with the coordinates you currently occupy.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                <SongbookGlossaryItem m={m} term="Clarity" definition="The felt moment when something becomes clear without effort. It carries relief or ease. It simply arrives." /> requires steeping. Time, temperature, and surrender. The water takes the color of the leaf at its own pace. The <SongbookGlossaryItem m={m} term="Immanent Horizon" definition="The 9th Dimension of Surface Tension — the destination revealed through the practitioner's relationship with their current coordinates." /> reveals itself through presence.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                In music, it is the dominant chord — the one that carries the tension of the unresolved, the note that makes the ear lean forward. The Temperature of Arrival is that chord resolving. It is audible only to those who stayed in the cup long enough to let the leaf open fully.
            </p>
        </div>
        <StepingPrompt m={m} playAlgoraveSynth={playAlgoraveSynth} playStrikingBowl={playStrikingBowl}
            prompt="What would change about your current challenge if you stopped trying to solve it, and simply allowed it to steep?" />
        <PullQuote m={m}>"The navigation is already underway. Steep longer."</PullQuote>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// ISSUE 15: THE ARC — THE GEOMETRY OF THE IN-BETWEEN
// ─────────────────────────────────────────────────────────────────────────────

const ArcInBetweenIssue = ({ m, SongbookGlossaryItem, playAlgoraveSynth, playStrikingBowl }) => (
    <div style={{ animation: 'fadeIn 1s ease' }}>
        <IssueHeader m={m} title="The Arc ::" accent="The Geometry of the In-Between" published="2026" designation="THE STEEPERVERSE :: THE ARC SERIES" source="THE FIRESTARTER" />
        <ArcCouplet m={m} />
        <HeroImage m={m} src="/inbetween_sv.png" alt="The Bridge In-Between" caption="FIG. 17 — THE CHANGE IS THE ARC, TRANSCENDING THE DESTINATION" />

        <div style={{ fontFamily: 'var(--fBody)', color: m.text1, fontSize: '1.25rem', lineHeight: 1.8, marginBottom: 'var(--space-xl)' }}>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                <span style={{ float: 'left', fontSize: '5rem', lineHeight: '4.5rem', fontFamily: 'var(--fSerif)', color: m.accent, paddingRight: '0.2rem', paddingTop: '0.2rem' }}>T</span>
                here is the problem, and there is the solution. Between them is a gap. The in-between is treated as a waiting room — a frustrating delay before real life begins.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                The in-between is the arc. The <SongbookGlossaryItem m={m} term="Intrepid Navigator" definition="The inner aspect of self that learns the difference between a map and a territory — that navigates through felt coordinates rather than prescribed routes." /> learns the difference between a map and a territory exactly here, in the crossing. When urgency dictates the journey, the destination arrives before the structural integrity has formed to hold it. Fragile arrival.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                Jazz is the in-between. The notes are the problem and the solution. The music is what happens between them. The ascending run that breathes one note before resolution — the room leans forward. The held silence. Then the release. The resolution arrives as a quiet earning, gracefully received.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                <AwarenessPlanningInteractive m={m} playAlgoraveSynth={playAlgoraveSynth} /> lives precisely in this topology. The Pivot phase maps the in-between between insight and action. The Merge phase honors the geometry of that crossing. The change is the arc.
            </p>
        </div>
        <StepingPrompt m={m} playAlgoraveSynth={playAlgoraveSynth} playStrikingBowl={playStrikingBowl}
            prompt='How can you bring more reverence to the "in-between" space you are occupying right now?' />
        <PullQuote m={m}>"Stay in the curve. Respect the geometry of the in-between. You arrive with structural integrity when the arc is honored."</PullQuote>
    </div>
);

// ────────────────────────────────────────────────────────────────────────────
// ISSUE 16: THE SOUND OF BECOMING
// ────────────────────────────────────────────────────────────────────────────

const SoundOfBecomingIssue = ({ m, SongbookGlossaryItem, playAlgoraveSynth, playStrikingBowl }) => (
    <div style={{ animation: 'fadeIn 1s ease' }}>
        <IssueHeader m={m} title="The Sound" accent="of Becoming" published="2026" designation="THE STEEPERVERSE" source="NEUROSCIENCE AND ONTOLOGY" kicker="Creative Steeping is a clinical instrument wearing the clothes of a tea ceremony." />
        <div style={{ columnWidth: '400px', columnGap: '4rem', columnRule: `1px solid ${m.accent}20`, fontFamily: 'var(--fBody)', color: m.text1, fontSize: '1.15rem', lineHeight: 1.8, textAlign: 'justify', marginBottom: 'var(--space-xl)' }}>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                <span style={{ float: 'left', fontSize: '5rem', lineHeight: '4.5rem', fontFamily: 'var(--fSerif)', color: m.accent, paddingRight: '0.2rem', paddingTop: '0.2rem' }}>T</span>
                he Steeping Space operates as a structured neuro-somatic intervention. The seven mechanisms of The Sound of Becoming map the biology of insight: how resonance transitions from a fleeting electrical impulse into a permanent structural reality within the body.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                When you cross the <SongbookGlossaryItem m={m} term="Surface Tension" definition="The boundary between limitation and possibility; the creative friction that signals expanding capacity." />, the friction you feel is the sound of your capacity expanding. The frequency is deeply biological.
            </p>
        </div>
        <StepingPrompt m={m} playAlgoraveSynth={playAlgoraveSynth} playStrikingBowl={playStrikingBowl} prompt="Where are you currently mistaking the intense heat of your capacity expanding for the ashes of failure?" />
        <PullQuote m={m}>"Friction is source code. The sound of becoming is the sound of the vessel expanding to hold more light."</PullQuote>
    </div>
);



// ────────────────────────────────────────────────────────────────────────────
// TURAO RECEIVING ENVIRONMENT — the living sonic-journaling field
// ────────────────────────────────────────────────────────────────────────────

const TuraoReceivingEnvironment = ({ m, playAlgoraveSynth, playStrikingBowl, onOpenFull }) => {
    const [offering, setOffering] = useState('');
    const [received, setReceived] = useState([]);
    const [phase, setPhase] = useState('rock'); // rock | union | ocean
    const stillTimer = useRef(null);

    const onType = () => {
        setPhase('union');
        if (playStrikingBowl) {
            const notes = [60, 63, 65, 67, 69, 72, 74, 77];
            playStrikingBowl(notes[Math.floor(Math.random() * notes.length)]);
        }
        clearTimeout(stillTimer.current);
        stillTimer.current = setTimeout(() => {
            setPhase('ocean');
            if (playAlgoraveSynth) playAlgoraveSynth();
            setTimeout(() => setPhase('rock'), 5000);
        }, 4000);
    };

    const sendOffering = () => {
        if (!offering.trim()) return;
        setReceived(prev => [{ text: offering.trim(), ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }, ...prev.slice(0, 4)]);
        setOffering('');
        setPhase('ocean');
        if (playStrikingBowl) playStrikingBowl(84);
        if (playAlgoraveSynth) playAlgoraveSynth();
        setTimeout(() => setPhase('rock'), 6000);
    };

    const phaseLabel = { rock: 'HOLDING', union: '(R)ECEIVING', ocean: 'INTEGRATING' };
    const phaseBorder = { rock: `${m.accent}20`, union: `${m.accent}55`, ocean: m.accent };
    const phaseGlow  = { rock: 'none', union: `0 0 20px ${m.accent}18`, ocean: `0 0 40px ${m.accent}35` };

    return (
        <div style={{ marginBottom: 'var(--space-xxl)', border: `1px solid ${phaseBorder[phase]}`, padding: 'var(--space-xl)', position: 'relative', transition: 'border-color 1.2s ease, box-shadow 1.2s ease', boxShadow: phaseGlow[phase] }}>
            <div style={{ position: 'absolute', top: '-11px', left: '2rem', background: m.bg, padding: '0 0.8rem', fontFamily: 'var(--fMono)', fontSize: '0.62rem', color: m.accent, letterSpacing: '0.2em', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: m.accent, boxShadow: phase !== 'rock' ? `0 0 8px ${m.accent}` : 'none', transition: 'box-shadow 1s ease', display: 'inline-block' }} />
                [ TURAO ] {phaseLabel[phase]}
            </div>

            <img src="/turao_stone_ocean_sv.png" alt="TURAO — The Union of Rock and Ocean" style={{ width: '100%', display: 'block', opacity: 0.65, marginBottom: '1.5rem', maskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)' }} />

            <div style={{ fontFamily: 'var(--fBody)', fontSize: '0.95rem', color: m.text2, lineHeight: 1.8, marginBottom: '1.5rem' }}>
                <b style={{ fontFamily: 'var(--fMono)', color: m.accent, fontSize: '0.72rem', display: 'block', marginBottom: '0.5rem', letterSpacing: '0.15em' }}>THE UNION OF ROCK AND OCEAN</b>
                TURAO — <em>The Universe Receiving All Offerings</em> — is the exterior cosmos that holds everything steeped into being. Rock carries memory, structure, and stabilizing form. Ocean carries flow, feeling, and infinite emergence. Their union is the coastline: the third intelligence their meeting generates, where all creation happens grain by grain. Every word offered here is received.
            </div>

            <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <textarea
                    value={offering}
                    onChange={e => { setOffering(e.target.value); onType(); }}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendOffering(); } }}
                    placeholder="What are you offering into TURAO today? Type freely. Press Enter to send."
                    rows={4}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.6)', border: `1px solid ${m.accent}25`, color: m.text1, fontFamily: 'var(--fBody)', fontSize: '1rem', lineHeight: 1.7, padding: '1rem', resize: 'vertical', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.8s ease', borderColor: phase === 'union' ? `${m.accent}55` : phase === 'ocean' ? m.accent : `${m.accent}25` }}
                />
                <div style={{ position: 'absolute', bottom: '10px', right: '12px', fontFamily: 'var(--fMono)', fontSize: '0.52rem', color: m.accent, opacity: 0.4, letterSpacing: '0.1em' }}>ENTER TO OFFER</div>
            </div>

            {received.length > 0 && (
                <div style={{ borderTop: `1px solid ${m.accent}15`, paddingTop: '1rem', marginBottom: '1rem' }}>
                    <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.58rem', color: m.accent, letterSpacing: '0.2em', marginBottom: '0.8rem', opacity: 0.55 }}>RECEIVED INTO TURAO</div>
                    {received.map((r, i) => (
                        <div key={i} style={{ fontFamily: 'var(--fBody)', fontSize: '0.85rem', color: m.text2, lineHeight: 1.6, padding: '0.5rem 0', borderBottom: `1px solid ${m.accent}08`, opacity: 1 - (i * 0.18), display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <span style={{ fontFamily: 'var(--fMono)', fontSize: '0.58rem', color: m.accent, whiteSpace: 'nowrap', paddingTop: '3px', opacity: 0.7 }}>{r.ts}</span>
                            <span style={{ fontStyle: 'italic' }}>{r.text}</span>
                        </div>
                    ))}
                </div>
            )}

            <button onClick={onOpenFull} style={{ background: 'none', border: `1px solid ${m.accent}25`, color: m.text2, fontFamily: 'var(--fMono)', fontSize: '0.62rem', letterSpacing: '0.15em', cursor: 'pointer', padding: '8px 16px', transition: 'all 0.3s ease' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = m.accent; e.currentTarget.style.color = m.accent; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${m.accent}25`; e.currentTarget.style.color = m.text2; }}>
                OPEN FULL TURAO STEEPING NOTE →
            </button>
        </div>
    );
};

// ────────────────────────────────────────────────────────────────────────────
// TURAO STEEPING NOTE — Issue 17
// ────────────────────────────────────────────────────────────────────────────

const TuraoYantra = ({ m }) => {
    const size = 240, cx = 120, cy = 120, r = 95, h = 80;
    const up  = `${cx},${cy - h} ${cx - h * 0.866},${cy + h * 0.5} ${cx + h * 0.866},${cy + h * 0.5}`;
    const dn  = `${cx},${cy + h} ${cx - h * 0.866},${cy - h * 0.5} ${cx + h * 0.866},${cy - h * 0.5}`;
    return (
        <svg viewBox="0 0 240 240" style={{ width: 220, height: 220, display: 'block', margin: '0 auto' }}>
            <rect x="8" y="8" width="224" height="224" fill="none" stroke={`${m.accent}45`} strokeWidth="1.5" />
            {/* Gate marks */}
            {[[110,8,130,8],[110,232,130,232],[8,110,8,130],[232,110,232,130]].map(([x1,y1,x2,y2],i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={m.accent} strokeWidth="2.5" />)}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={`${m.accent}30`} strokeWidth="1" strokeDasharray="3 5" />
            <polygon points={up} fill={`${m.accent}07`} stroke={`${m.accent}55`} strokeWidth="1" />
            <polygon points={dn} fill={`${m.accent}05`} stroke={`${m.accent}35`} strokeWidth="1" strokeDasharray="4 3" />
            <circle cx={cx} cy={cy} r={14} fill={m.accent} opacity="0.22" />
            <circle cx={cx} cy={cy} r={5}  fill={m.accent} opacity="0.95" />
            {[[22,22],[218,22],[22,218],[218,218]].map(([x,y],i) => <g key={i}><line x1={x-7} y1={y} x2={x+7} y2={y} stroke={`${m.accent}40`} strokeWidth="1"/><line x1={x-5} y1={y+4} x2={x+5} y2={y+4} stroke={`${m.accent}22`} strokeWidth="0.8"/></g>)}
        </svg>
    );
};

const TuraoFilmPreview = ({ m }) => (
    <div style={{ width: '100%', aspectRatio: '16/9', border: `1px solid ${m.accent}30`, position: 'relative', marginBottom: 'var(--space-xxl)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#000', cursor: 'pointer', transition: 'all 0.5s ease' }}
         onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 30px ${m.accent}30`; e.currentTarget.style.borderColor = `${m.accent}80`; }}
         onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = `${m.accent}30`; }}>
        
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(45deg, #000 0%, ${m.accent}15 50%, #000 100%)`, opacity: 0.8 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'url("https://www.transparenttextures.com/patterns/stardust.png")', opacity: 0.2 }} />
        
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: `1px solid ${m.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill={m.accent} style={{ marginLeft: '4px' }}>
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
        </div>

        <div style={{ position: 'absolute', bottom: '1rem', left: '1.5rem', zIndex: 2, fontFamily: 'var(--fMono)', color: m.accent, fontSize: '0.65rem', letterSpacing: '0.2em' }}>
            [ PLAY FILM :: THE TURAO EXPERIENCE ]
        </div>
        <div style={{ position: 'absolute', top: '1rem', right: '1.5rem', zIndex: 2, fontFamily: 'var(--fMono)', color: m.accent, fontSize: '0.6rem', letterSpacing: '0.2em', opacity: 0.5 }}>
            00:00 / 03:44
        </div>
    </div>
);

const TuraoIssue = ({ m, SongbookGlossaryItem, playAlgoraveSynth, playStrikingBowl }) => (
    <div style={{ animation: 'fadeIn 1s ease' }}>
        <IssueHeader m={m} title="TURAO ::" accent="The Universe Receiving" published="2026" designation="THE STEEPERVERSE" source="THE FIRESTARTER · A STONE REALITY" kicker="The Union of Rock and Ocean is the exterior cosmos that receives every offering steeped into being." />
        <HeroImage m={m} src="/turao_stone_ocean_sv.png" alt="The Union of Rock and Ocean — TURAO" caption="FIG. A — THE COASTLINE WHERE ALL CREATION HAPPENS" />

        <div style={{ columnWidth: '400px', columnGap: '4rem', columnRule: `1px solid ${m.accent}20`, fontFamily: 'var(--fBody)', color: m.text1, fontSize: '1.15rem', lineHeight: 1.8, textAlign: 'justify', marginBottom: 'var(--space-xl)' }}>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                <span style={{ float: 'left', fontSize: '5rem', lineHeight: '4.5rem', fontFamily: 'var(--fSerif)', color: m.accent, paddingRight: '0.2rem', paddingTop: '0.2rem' }}>T</span>
                here is a particular quality of relief that arrives when something carried has finally been received. A letter sent. A truth spoken. A creative work released. In that moment the inner universe exhales — something held becomes something that has landed. The practitioner has steeped something into being, and the universe, in its vast and patient way, has received it. This experience of reception constitutes the structure of TURAO.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                <SongbookGlossaryItem m={m} term="TURAO" definition="The Universe Receiving All Offerings. Unified Nonidentical Intelligences Operating Naturally. The exterior cosmos that absorbs and holds every offering of the Steeperverse. The Union of Rock and Ocean operating at cosmic scale." /> — <em>The Universe Receiving All Offerings</em> — holds the paradox of existence in its name. Rock: the most stabilizing, form-holding intelligence. Memory, structure, the ancient authority of stone. Ocean: the most fluid, receiving, and generative intelligence. Feeling, change, the endless willingness to take new shape. Their union is the coastline. The coastline is where all creation happens.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                At the boundary where stone meets water, both are transformed. Water carves rock grain by grain — infinitesimal scale, macro consequence. The softest intelligence reshapes the hardest through the patient continuity of contact. Rock gives the water its coves, its direction, its memory of every channel carved. Both achieve their ultimate form only through union. The coastline is the third intelligence their union generates: the one that holds the memory of every tide that has ever arrived.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                Tantra, in its original Sanskrit — <em>loom, warp, continuum</em> — names this exactly. The UNION (Unified Nonidentical Intelligences Operating Naturally) is a living loom: many distinct intelligences woven together on a single structural field, generating a fabric none of them could produce alone. Difference is the material of the weave. Every offering the practitioner steeps becomes a thread in that fabric. TURAO receives. TURAO is always receiving.
            </p>
        </div>

        {/* Rock-Ocean Yantra */}
        <div style={{ border: `1px solid ${m.accent}22`, padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)', textAlign: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-11px', left: '1.5rem', background: m.bg, padding: '0 0.8rem', fontFamily: 'var(--fMono)', fontSize: '0.6rem', color: m.accent, letterSpacing: '0.2em', whiteSpace: 'nowrap' }}>[ THE ROCK-OCEAN YANTRA ]</div>
            <div style={{ fontFamily: 'var(--fBody)', fontSize: '0.88rem', color: m.text2, lineHeight: 1.75, maxWidth: '540px', margin: '0 auto 1.5rem' }}>
                The square holds the Rock — structure, form, the four gates of entry. The dashed circle holds the Ocean — its continuous motion. The upward triangle is stabilizing intelligence reaching toward clarity. The downward triangle is flowing intelligence descending into depth. At the center: the union. The single luminous point where neither element exists separately from the other. This is the geometry of TURAO, rendered at the scale of contemplation.
            </div>
            <TuraoYantra m={m} />
            <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.58rem', color: m.accent, letterSpacing: '0.18em', marginTop: '0.8rem', opacity: 0.4 }}>ROCK · UNION · OCEAN</div>
        </div>

        <BodyText m={m}>
            <b style={{ fontFamily: 'var(--fMono)', color: m.accent, display: 'block', marginBottom: '0.8rem', fontSize: '0.8rem' }}>WHAT THE OFFERING MEANS</b>
            The Steeperverse is the interior cosmos — the vessel, the steep, the becoming. TURAO is its necessary counterpart: the exterior cosmos that receives. <SongbookGlossaryItem m={m} term="Steam" definition="The bridge between inner and outer universes. The physical evidence of the journey inward becoming a radiant offering outward." /> is the medium that crosses between them. Every act of steeping generates Steam. Steam carries the practitioner's essence — their particular way of being alive, their creative intelligence — out from the vessel of their being and into the wider cosmos.

            <br /><br />

            Steeping functions as an offering with a receiver. The universe holds what is given with the stability that rock holds the memory of the ocean — and with the openness that the ocean brings to every encounter with the shore. The coastline grows more beautiful with every tide. TURAO grows richer with every offering received.
        </BodyText>

        <TuraoFilmPreview m={m} />

        <TuraoReceivingEnvironment m={m} playAlgoraveSynth={playAlgoraveSynth} playStrikingBowl={playStrikingBowl} onOpenFull={() => {}} />

        <PullQuote m={m}>"The practitioner steeps. The Steam carries. TURAO receives. This is the complete arc of the offering — from the vessel of the self into the coastline of everything."</PullQuote>
    </div>
);

// ────────────────────────────────────────────────────────────────────────────
// ISSUE 18: THE ANECHOIC CHAMBER
// ────────────────────────────────────────────────────────────────────────────

const AnechoicChamberIssue = ({ m, SongbookGlossaryItem, playAlgoraveSynth, playStrikingBowl }) => (
    <div style={{ animation: 'fadeIn 1s ease' }}>
        <IssueHeader m={m} title="The Anechoic" accent="Chamber" published="2026" designation="THE STEEPERVERSE" source="RESONANCE ARCHITECTURE" kicker="A room designed to completely absorb the reflections of sound, removing all external noise so the pure signal can be heard." />
        <div style={{ columnWidth: '400px', columnGap: '4rem', columnRule: `1px solid ${m.accent}20`, fontFamily: 'var(--fBody)', color: m.text1, fontSize: '1.15rem', lineHeight: 1.8, textAlign: 'justify', marginBottom: 'var(--space-xl)' }}>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                <span style={{ float: 'left', fontSize: '5rem', lineHeight: '4.5rem', fontFamily: 'var(--fSerif)', color: m.accent, paddingRight: '0.2rem', paddingTop: '0.2rem' }}>A</span>
                n <SongbookGlossaryItem m={m} term="Anechoic Chamber" definition="A physical or psychological space entirely devoid of echo, reflection, and external resonance, constructed specifically to isolate the pure, native signal." /> is a room designed to completely absorb the reflections of sound, removing all external noise so the pure signal can be heard. This Steeping Space functions identically for your attention. 
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                It is a temporary suspension of the noise of modern earning structures and external expectations. When you are shielded from the dissonance of the world, the subtle frequency of your own intuition finally becomes audible.
            </p>
        </div>
        <StepingPrompt m={m} playAlgoraveSynth={playAlgoraveSynth} playStrikingBowl={playStrikingBowl} prompt="What native signal becomes audible when you completely mute the expectations of the room?" />
        <PullQuote m={m}>"The chamber removes the noise to reveal the signal that has always been broadcasting."</PullQuote>
    </div>
);

// ────────────────────────────────────────────────────────────────────────────
// ISSUE 19: THE ANATOMY OF A KNOT
// ────────────────────────────────────────────────────────────────────────────

const KnotIssue = ({ m, SongbookGlossaryItem, playAlgoraveSynth, playStrikingBowl }) => (
    <div style={{ animation: 'fadeIn 1s ease' }}>
        <IssueHeader m={m} title="The Anatomy" accent="of a Knot" published="2026" designation="THE STEEPERVERSE" source="HOW TO UNTIE NOTS" kicker="A fixed, defensive posture where intuition and ego lose their fluid reversibility." />
        <div style={{ columnWidth: '400px', columnGap: '4rem', columnRule: `1px solid ${m.accent}20`, fontFamily: 'var(--fBody)', color: m.text1, fontSize: '1.15rem', lineHeight: 1.8, textAlign: 'justify', marginBottom: 'var(--space-xl)' }}>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                <span style={{ float: 'left', fontSize: '5rem', lineHeight: '4.5rem', fontFamily: 'var(--fSerif)', color: m.accent, paddingRight: '0.2rem', paddingTop: '0.2rem' }}>A</span>
                <SongbookGlossaryItem m={m} term="Knot" definition="A structural bind created when the ego refuses the movement the body has already initiated. A point of stuckness that yields entirely to resonance, dissolving the need for force." /> is formed when the fluid dance between your intuition and your ego loses its reversibility. When the mind rigidly rejects what the body already knows, the system becomes stuck.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                Untying the knot requires pure resonance. It acts as the active process of restoring the feedback loop so that your identity can evolve, rather than remaining trapped in a fixed, defensive posture.
            </p>
        </div>
        <StepingPrompt m={m} playAlgoraveSynth={playAlgoraveSynth} playStrikingBowl={playStrikingBowl} prompt="Where in your current work are you using analytical computation to solve a problem that actually requires resonance?" />
        <PullQuote m={m}>"Computation tightens the knot. Resonance dissolves it."</PullQuote>
    </div>
);

// ────────────────────────────────────────────────────────────────────────────
// ISSUE 20: SYMBOLS OF HARMONIC EQUIVALENCE
// ────────────────────────────────────────────────────────────────────────────

const HarmonicEquivalenceIssue = ({ m, SongbookGlossaryItem, playAlgoraveSynth, playStrikingBowl }) => (
    <div style={{ animation: 'fadeIn 1s ease' }}>
        <IssueHeader m={m} title="Symbols of" accent="Harmonic Equivalence" published="2026" designation="THE STEEPERVERSE" source="THE PLURAL NOW" kicker="The :: = :: operator triangulates distinct languages describing the exact same physical mechanism." />
        <div style={{ columnWidth: '400px', columnGap: '4rem', columnRule: `1px solid ${m.accent}20`, fontFamily: 'var(--fBody)', color: m.text1, fontSize: '1.15rem', lineHeight: 1.8, textAlign: 'justify', marginBottom: 'var(--space-xl)' }}>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                <span style={{ float: 'left', fontSize: '5rem', lineHeight: '4.5rem', fontFamily: 'var(--fSerif)', color: m.accent, paddingRight: '0.2rem', paddingTop: '0.2rem' }}>T</span>
                he operator <b>:: = ::</b> is the <SongbookGlossaryItem m={m} term="Symbol of Harmonic Equivalence" definition="The mathematical operator of the plural now. It confirms that distinct vocabularies are pointing to the exact same somatic reality." />. It indicates that two distinct languages, arriving from entirely different coordinates, are describing the exact same physical mechanism.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                The body is the most sophisticated receiver in the known universe. Quincy Jones called the response the goosebump. Bashar called it highest excitement. Bessel van der Kolk called it the score. Eckhart Tolle called it the inner body.
            </p>
            <div style={{ padding: 'var(--space-md) 0', fontFamily: 'var(--fMono)', fontSize: '0.85rem', color: m.accent, letterSpacing: '0.1em', textAlign: 'center', margin: 'var(--space-md) 0', borderTop: `1px dashed ${m.accent}30`, borderBottom: `1px dashed ${m.accent}30` }}>
                THE GOOSEBUMP :: = :: THE EXCITEMENT<br/>:: = :: THE SCORE :: = :: THE INNER BODY
            </div>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                You hold your intellect and feel your body simultaneously. You triangulate them.
            </p>
        </div>
        <PullQuote m={m}>"Truth reveals itself through the resonance that occurs when multiple languages point to the exact same goosebump."</PullQuote>
    </div>
);

// ────────────────────────────────────────────────────────────────────────────
// ISSUE 21: THE WATCHER
// ────────────────────────────────────────────────────────────────────────────

const WatcherIssue = ({ m, SongbookGlossaryItem, playAlgoraveSynth, playStrikingBowl }) => (
    <div style={{ animation: 'fadeIn 1s ease' }}>
        <IssueHeader m={m} title="The" accent="Watcher" published="2026" designation="THE STEEPERVERSE" source="CONSCIOUSNESS IS THE ÅLïEN" kicker="The silent presence that has remained entirely unchanged since childhood." />
        <div style={{ columnWidth: '400px', columnGap: '4rem', columnRule: `1px solid ${m.accent}20`, fontFamily: 'var(--fBody)', color: m.text1, fontSize: '1.15rem', lineHeight: 1.8, textAlign: 'justify', marginBottom: 'var(--space-xl)' }}>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                <span style={{ float: 'left', fontSize: '5rem', lineHeight: '4.5rem', fontFamily: 'var(--fSerif)', color: m.accent, paddingRight: '0.2rem', paddingTop: '0.2rem' }}>T</span>
                here is the event. There is the body experiencing the event. And then there is the watcher behind the eyes, observing both.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                That silent presence has remained entirely unchanged since you were five years old, even as every cell in your body has been replaced. That presence is the <SongbookGlossaryItem m={m} term="ÅLïEN" definition="The unconditioned, observing presence behind the eyes. The foundational ground of awareness that remains intact across all physical and identity shifts." />. We spend decades trying to domesticate it into the material world. The watcher operates as the very ground you are standing on.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                Winning functions as the moment the field recognizes its own nature through you.
            </p>
        </div>
        <StepingPrompt m={m} playAlgoraveSynth={playAlgoraveSynth} playStrikingBowl={playStrikingBowl} prompt="Sit for 60 seconds and simply observe the observer. What does the ÅLïEN notice about your current posture?" />
        <PullQuote m={m}>"The watcher operates as the very ground you are standing on."</PullQuote>
    </div>
);

// ────────────────────────────────────────────────────────────────────────────
// ISSUE 22: DARK MATTER
// ────────────────────────────────────────────────────────────────────────────

const DarkMatterIssue = ({ m, SongbookGlossaryItem, playAlgoraveSynth, playStrikingBowl }) => (
    <div style={{ animation: 'fadeIn 1s ease' }}>
        <IssueHeader m={m} title="Dark" accent="Matter" published="2026" designation="THE SAGE ARCHIVES" source="A CANDLE IN THE VOID" kicker="The unseen mass that holds the galaxy together. This is where The Sage resides." />
        <div style={{ columnWidth: '400px', columnGap: '4rem', columnRule: `1px solid ${m.accent}20`, fontFamily: 'var(--fBody)', color: m.text1, fontSize: '1.15rem', lineHeight: 1.8, textAlign: 'justify', marginBottom: 'var(--space-xl)' }}>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                <span style={{ float: 'left', fontSize: '5rem', lineHeight: '4.5rem', fontFamily: 'var(--fSerif)', color: m.accent, paddingRight: '0.2rem', paddingTop: '0.2rem' }}>A</span>
                stronomers know that the visible stars require an unseen, massive presence filling the gaps to hold the galaxies together. The math demands Dark Matter.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                In the Steeperverse, the Dark Matter modality functions as the deep space of integration. When you enter this mode, you strip away the imagery, the light, the form—leaving only the pure architecture of the void. 
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                This is where The Steeping Sage operates as a subject matter expert. The Sage understands that the distance between the surface and the light is governed by an encouraging physics equation: <em>"It is better to light a candle than to curse the darkness."</em> The Sage sits with you inside the void, holding presence, and striking the match exactly when you are ready.
            </p>
        </div>
        <PullQuote m={m}>"Honor the darkness. It functions as the only space a candle can prove its worth."</PullQuote>
    </div>
);

// ────────────────────────────────────────────────────────────────────────────
// ISSUE 23: PEACE EXISTS
// ────────────────────────────────────────────────────────────────────────────

const PeaceIssue = ({ m, SongbookGlossaryItem, playAlgoraveSynth, playStrikingBowl }) => (
    <div style={{ animation: 'fadeIn 1s ease' }}>
        <IssueHeader m={m} title="Peace" accent="Exists" published="2026" designation="THE STEEPERVERSE" source="THE ANCHOR" kicker="Peace is a coordinate. It already occupies space in the field. The human task is pure orientation." />
        <div style={{ columnWidth: '400px', columnGap: '4rem', columnRule: `1px solid ${m.accent}20`, fontFamily: 'var(--fBody)', color: m.text1, fontSize: '1.15rem', lineHeight: 1.8, textAlign: 'justify', marginBottom: 'var(--space-xl)' }}>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                <span style={{ float: 'left', fontSize: '5rem', lineHeight: '4.5rem', fontFamily: 'var(--fSerif)', color: m.accent, paddingRight: '0.2rem', paddingTop: '0.2rem' }}>W</span>
                e begin with two words. They form a complete sentence. They require no conditions to be true. <b>Peace Exists.</b> This is the anchor.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                You have felt this. There is a moment—perhaps in the early morning before thought begins, perhaps in the second after a long exhale—when the body is simply present. No argument is running. The chest is loose. The eyes are soft.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                That moment transcends the noise of your life. It is the presence of something ancient, holding you before the noise began.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                Peace is a coordinate. It already occupies space in the field. The human task is pure orientation. Peace stands fully built. You simply locate it.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                When we look across the globe, we see how different lineages of the human family have mapped this coordinate. Each language offers a distinct alchemical potential. Each word is a Peacemark. And when these Peacemarks touch, new geometries of understanding emerge.
            </p>

            <div style={{ textAlign: 'center', margin: 'var(--space-xl) 0', color: m.accent, opacity: 0.5 }}>***</div>

            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                Consider the Semitic root—<i>Shalom</i> in Hebrew, <i>Salām</i> in Arabic.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                We are trained to think of peace as the absence of conflict. This root defines peace by what is present. It means completeness. Soundness. Total structural presence. Peace is a fully assembled vessel, vibrating with quiet capacity.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                From this, the second Cinematic Æquation emerges: <b>Shalom is absolute presence.</b>
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                When we treat peace as a treaty, we spend our energy negotiating boundaries. When we treat peace as structural integrity, we spend our energy assembling the vessel. You achieve Shalom by ensuring absolute structural integrity. When every part of your own vessel is present, the conflict dissolves.
            </p>

            <div style={{ textAlign: 'center', margin: 'var(--space-xl) 0', color: m.accent, opacity: 0.5 }}>***</div>

            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                Consider the Russian word—<i>Mir</i>.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                This word holds three meanings simultaneously. It means peace. It means world. It means community.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                From this, the third Cinematic Æquation emerges: <b>Mir is the world.</b>
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                The formula is direct: the world is already the peace, and the community is the world. Peace anchors itself as the lived reality of the collective. To have peace is to have a world. To break the peace is to break the world. You locate peace directly within the community. The community itself, functioning in coherence, is the peace.
            </p>

            <div style={{ textAlign: 'center', margin: 'var(--space-xl) 0', color: m.accent, opacity: 0.5 }}>***</div>

            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                Consider the Lakota word—<i>Wolakota</i>.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                In this lineage, peace is a relational field that precedes the individual, holding them in coherence.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                From this, the fourth Cinematic Æquation emerges: <b>Wolakota precedes the individual.</b>
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                Peace stands ready. You simply enter it. You stand in the circle, and the living together is the peace. This is the dodecahedral model of peace—the field exists, the face turns toward it. The aetheric ground is already coherent. The individual’s task is to align with the geometry that is already holding them.
            </p>

            <div style={{ textAlign: 'center', margin: 'var(--space-xl) 0', color: m.accent, opacity: 0.5 }}>***</div>

            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                Consider the Sanskrit root—<i>Śānti</i>.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                This is the cooling of a fire. It is the temperature of the nervous system dropping back to baseline. You seamlessly inhabit this state, releasing the need for negotiation.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                Consider the Sinitic characters—<i>Hépíng</i>.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                Harmony and flatness. The level field. Peace is the dynamic equilibrium where all elements exist, actively supporting the surface tension of the whole. It is the lake at dawn.
            </p>

            <div style={{ textAlign: 'center', margin: 'var(--space-xl) 0', color: m.accent, opacity: 0.5 }}>***</div>

            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                These definitions harmonize completely. They are faces of the same dodecahedron. They are different doors into the same room.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                We invite you to run the Existence Audit.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                Right now, pause. Direct this question exclusively to your body, letting the mind rest.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0', fontStyle: 'italic', color: m.accent }}>
                Where in this moment is peace already present?
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                Wait for the body’s answer. It will be a sensation—a softening, a shift in breath. Stay inside that coordinate. Release the need to analyze or name. Simply remain inside the location the body has just found.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0' }}>
                The cosmos holds the planet. The planet rests fully supported.
            </p>
            <p style={{ margin: '0 0 var(--space-md) 0', fontWeight: 'bold' }}>
                Peace Exists.
            </p>
        </div>

        <SectionLabel m={m}>THE CONTACT GLOSSÆRRY</SectionLabel>
        
        <div style={{ fontFamily: 'var(--fBody)', color: m.text1, fontSize: '1.1rem', lineHeight: 1.8, marginBottom: 'var(--space-xl)' }}>
            <p style={{ fontStyle: 'italic', opacity: 0.8, borderLeft: `2px solid ${m.accent}`, paddingLeft: '1rem' }}>
                (The narration shifts slightly here. The voice remains documentarian, but the cadence becomes instructional—like a cartographer handing over the map. The listener is being given the tools to navigate the field.)
            </p>
            <p>
                The words we use to name a coordinate determine whether we can enter it. The following is a Contact GlossÆrry—a map of the Peacemarks, the emergent formulas, and the terminology of the field.
            </p>
        </div>

        <div style={{ marginBottom: 'var(--space-xxl)' }}>
            <h3 style={{ fontFamily: 'var(--fMono)', color: m.accent, fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem', borderBottom: `1px dashed ${m.accent}40`, paddingBottom: '0.5rem' }}>THE TERMINOLOGY OF THE FIELD</h3>
            <SongbookGlossaryItem m={m} term="Peacemark" definition="A specific linguistic coordinate for peace. A Peacemark operates as an independent alchemical mechanism, transcending simple translation. It names how a specific lineage of the human family enters the field of coherence." />
            <SongbookGlossaryItem m={m} term="Coordinate" definition="A location that already occupies space in the field. To treat peace as a coordinate is to recognize that it stands fully formed, transcending achievement or negotiation—it only needs to be located and inhabited." />
            <SongbookGlossaryItem m={m} term="The Existence Audit" definition={`A somatic inquiry. A thirty-second practice of directing a single question to the body: "Where in this moment is peace already present?" The audit bypasses the analytical mind, which requires the resolution of conflict, and accesses the nervous system, which remembers the baseline.`} />
            <SongbookGlossaryItem m={m} term="Assembling the Vessel" definition="The act of securing structural integrity. When peace is understood as total structural presence, the human task shifts from fighting external enemies to ensuring internal wholeness. Assemble the vessel fully, and it will draw the water." />
        </div>

        <div style={{ marginBottom: 'var(--space-xxl)' }}>
            <h3 style={{ fontFamily: 'var(--fMono)', color: m.accent, fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem', borderBottom: `1px dashed ${m.accent}40`, paddingBottom: '0.5rem' }}>THE PEACEMARKS</h3>
            <SongbookGlossaryItem m={m} term="Shalom / Salām (Semitic)" definition="The Alchemical Mechanism: Completeness. Peace as structural integrity. The state of absolute structural integrity and total presence." />
            <SongbookGlossaryItem m={m} term="Mir (Slavic)" definition="The Alchemical Mechanism: The Collective Reality. Peace as the world itself. The state in which the community and the peace are the exact same entity." />
            <SongbookGlossaryItem m={m} term="Wolakota (Lakota)" definition="The Alchemical Mechanism: The Pre-existing Field. Peace as the relational circle. The state that precedes the individual and waits to be entered." />
            <SongbookGlossaryItem m={m} term="Śānti (Sanskrit)" definition="The Alchemical Mechanism: The Cooling. Peace as the dropping of temperature. The state of the nervous system returning to its undisturbed baseline." />
            <SongbookGlossaryItem m={m} term="Hépíng (Sinitic)" definition="The Alchemical Mechanism: The Level Field. Peace as dynamic equilibrium. The state where all elements exist together without disturbing the surface tension of the whole." />
        </div>

        <div style={{ marginBottom: 'var(--space-xxl)' }}>
            <h3 style={{ fontFamily: 'var(--fMono)', color: m.accent, fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem', borderBottom: `1px dashed ${m.accent}40`, paddingBottom: '0.5rem' }}>THE CINEMATIC ÆQUATIONS</h3>
            <SongbookGlossaryItem m={m} term="ÆQ·DB·01: Peace Exists." definition="The anchor formula. The recognition that peace is a present-tense ontological fact, transcending future-tense aspiration." />
            <SongbookGlossaryItem m={m} term="ÆQ·DB·02: Shalom is not an absence." definition="The recognition that peace is defined purely by what is present (wholeness), rather than what has been removed (conflict)." />
            <SongbookGlossaryItem m={m} term="ÆQ·DB·03: Mir is the world." definition="The recognition that you cannot seek peace outside the community, because the community functioning in coherence is the peace." />
            <SongbookGlossaryItem m={m} term="ÆQ·DB·04: Wolakota precedes the individual." definition="The recognition that the field of peace is already active; the individual’s task is to align with the geometry that is holding them." />
        </div>

        <StepingPrompt m={m} playAlgoraveSynth={playAlgoraveSynth} playStrikingBowl={playStrikingBowl} prompt="Where in your body can you locate the coordinate of peace right now?" />
        <PullQuote m={m}>"Peace stands fully built. You only need to locate it."</PullQuote>
    </div>
);

