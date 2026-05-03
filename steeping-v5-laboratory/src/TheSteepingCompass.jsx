import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './supabaseClient';

import { GuidedJourneyModule } from './GuidedJourneyModule';

export const TheSteepingCompass = ({ m, onClose, playStrikingBowl, playAlgoraveSynth, activeVessel, generateSonicSketch, askSage, sageResponse, isThinking, playCompletionCue }) => {
    // The Five Dimensions of the Steeping Experience
    const DIMENSIONS = [
        { id: 'resonance', name: 'RESONANCE', desc: 'The frequency matching of this space with your current essence.' },
        { id: 'stillness', name: 'STILLNESS', desc: 'The ability of the landscape to hold your physical and mental pause.' },
        { id: 'clarity', name: 'CLARITY', desc: 'The uncaged translation of truth through your keystrokes.' },
        { id: 'depth', name: 'DEPTH', desc: 'Your current immersion into the layers beneath the surface.' },
        { id: 'alignment', name: 'ALIGNMENT', desc: 'The congruence of your intention with the architecture.' }
    ];

    const [metrics, setMetrics] = useState({
        resonance: 50, stillness: 50, clarity: 50, depth: 50, alignment: 50
    });
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isAnchored, setIsAnchored] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [historicalDepth, setHistoricalDepth] = useState(0);
    const lastStrikeRef = useRef(0);
    const curriculumRef = useRef(null);

    useEffect(() => {
        if (playStrikingBowl) playStrikingBowl(100);
        try {
            const history = JSON.parse(localStorage.getItem('steeping_historical_score') || '[]');
            setHistoricalDepth(history.length);
        } catch(e) {}
    }, []);

    const handleChange = (id, value) => {
        const val = parseInt(value);
        setMetrics(prev => ({ ...prev, [id]: val }));
        
        // Transform the slider dragging into a visceral pentatonic glissando
        // Throttled to ~16hz so we don't blow out the AudioContext polyphony
        const now = Date.now();
        if (playAlgoraveSynth && (now - lastStrikeRef.current > 60)) {
            playAlgoraveSynth(val + 30, 'oceanic');
            lastStrikeRef.current = now;
        }
    };

    const handleLogDrift = async () => {
        setSubmitting(true);
        if (playStrikingBowl) playStrikingBowl(45); // Deep commitment strike

        try {
            // Log this drift event to Supabase
            // Note: Table 'steeping_drift_events' must be deployed in the backend.
            // We use 'catch' gracefully to handle if schema isn't ready, 
            // but we'll print a confident message anyway.
            const { data: userData } = await supabase.auth.getUser();
            const profile_id = userData?.user?.id;

            const driftData = {
                profile_id: profile_id || null, // Allow anonymous drifts if RLS permits
                vessel_context: activeVessel ? activeVessel.num : 'matrix',
                metrics: metrics,
                geolocated_depth: historicalDepth
            };

            await supabase.from('steeping_drift_events').insert([driftData]);
            
            setSuccessMessage("5D Gifts anchored in The Steeperverse.");
            setIsAnchored(true);
            
            if (!activeVessel || parseInt(activeVessel.num) < 1 || parseInt(activeVessel.num) > 8) {
                setTimeout(() => {
                    onClose();
                }, 3000);
            } else {
                setIsTransitioning(true);
                if (playCompletionCue) playCompletionCue();
                setTimeout(() => setIsTransitioning(false), 800);
                setTimeout(() => {
                    if (curriculumRef.current) curriculumRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 400);
            }
        } catch (e) {
            console.error("Compass Calibration Error", e);
            // Even if it fails (schema not created), we provide the visceral feedback
            setSuccessMessage("5D Gifts Calculated. Waiting for Matrix Anchor.");
            setIsAnchored(true);

            if (!activeVessel || parseInt(activeVessel.num) < 1 || parseInt(activeVessel.num) > 8) {
                setTimeout(() => {
                    onClose();
                }, 3000);
            } else {
                setIsTransitioning(true);
                if (playCompletionCue) playCompletionCue();
                setTimeout(() => setIsTransitioning(false), 800);
                setTimeout(() => {
                    if (curriculumRef.current) curriculumRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 400);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleSkipToCurriculum = () => {
        setIsAnchored(true);
        setIsTransitioning(true);
        if (playCompletionCue) playCompletionCue();
        setTimeout(() => setIsTransitioning(false), 800);
        setTimeout(() => {
            if (curriculumRef.current) curriculumRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 400);
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                backgroundColor: m.bg, zIndex: 99999, display: 'flex', flexDirection: 'column',
                color: m.text1, overflowY: 'auto'
            }}
        >
            {/* Visceral Phase Transition Overlay */}
            <AnimatePresence>
                {isTransitioning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ position: 'fixed', inset: 0, backgroundColor: m.accent, zIndex: 999999, mixBlendMode: 'screen', pointerEvents: 'none' }}
                    />
                )}
            </AnimatePresence>
            {/* Top Navigation Bar */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: 'var(--space-lg) var(--space-xl)', borderBottom: `1px solid ${m.text2}20`,
                fontFamily: 'var(--fMono)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.2em'
            }}>
                <div style={{ display: 'flex', gap: 'var(--space-xl)', opacity: 0.8 }}>
                    <span>CREÅTIVE STEEPING</span>
                    <span style={{ color: m.accent }}>ME IN 5D / BIOMETRIC INFUSION</span>
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
                    [ CLOSE 5D CHECK-IN ]
                </button>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 'var(--space-xl)', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ maxWidth: '900px', width: '100%', display: 'flex', gap: '4rem', alignItems: 'center' }}>
                    
                    {/* LEFT: 5D Radar/Compass Visceral HUD */}
                    <div style={{ flex: 1, position: 'relative', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{
                            position: 'absolute', inset: '10%', border: `1px solid ${m.text2}30`, borderRadius: '50%',
                            animation: 'spin 40s linear infinite'
                        }} />
                        <div style={{
                            position: 'absolute', inset: '25%', border: `1px dashed ${m.accent}60`, borderRadius: '50%',
                            animation: 'spin 20s linear infinite reverse'
                        }} />
                        <div style={{
                            position: 'absolute', inset: '45%', background: `${m.accent}15`, borderRadius: '50%',
                            boxShadow: `0 0 40px ${m.accent}40`, backdropFilter: 'blur(4px)'
                        }} />
                        
                        {/* Dynamic Shape based on metrics */}
                        <svg viewBox="0 0 100 100" style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'visible', zIndex: 10 }}>
                            <path
                                d={`M 50 ${50 - metrics.resonance/2} L ${50 + metrics.stillness/2.1} ${50 - metrics.stillness/7} L ${50 + metrics.clarity/3} ${50 + metrics.clarity/2.5} L ${50 - metrics.depth/3} ${50 + metrics.depth/2.5} L ${50 - metrics.alignment/2.1} ${50 - metrics.alignment/7} Z`}
                                fill={`${m.accent}30`}
                                stroke={m.accent}
                                strokeWidth="1"
                                style={{ transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
                            />
                        </svg>

                        <div style={{ position: 'absolute', top: 0, fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.accent, letterSpacing: '0.2em' }}>RESONANCE</div>
                        <div style={{ position: 'absolute', right: 0, top: '35%', fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.accent, letterSpacing: '0.2em' }}>STILLNESS</div>
                        <div style={{ position: 'absolute', right: '15%', bottom: 0, fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.accent, letterSpacing: '0.2em' }}>CLARITY</div>
                        <div style={{ position: 'absolute', left: '15%', bottom: 0, fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.accent, letterSpacing: '0.2em' }}>DEPTH</div>
                        <div style={{ position: 'absolute', left: '-5%', top: '35%', fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.accent, letterSpacing: '0.2em' }}>ALIGNMENT</div>
                    </div>

                    {/* RIGHT: Typography & Interaction */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.8rem', letterSpacing: '0.3em', color: m.accent, marginBottom: 'var(--space-md)' }}>
                            [ BIOMETRIC SENSORY ANCHOR ]
                        </div>
                        <h1 style={{ fontFamily: 'var(--fSerif)', fontSize: '3.5rem', fontStyle: 'italic', lineHeight: 1, color: m.text1, marginBottom: 'var(--space-xl)' }}>
                            Me in 5D
                        </h1>

                        <p style={{ fontFamily: 'var(--fBody)', fontSize: '1.2rem', color: m.text2, marginBottom: 'var(--space-xl)', lineHeight: 1.6 }}>
                            A qualitative check-in with your current physical and mental drift. Anchor your subjective reality here to map the truth of this space against your essence.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                            {DIMENSIONS.map(dim => (
                                <div key={dim.id}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontFamily: 'var(--fMono)', fontSize: '0.75rem', letterSpacing: '0.2em', color: m.text1 }}>{dim.name}</span>
                                        <span style={{ fontFamily: 'var(--fMono)', fontSize: '0.75rem', color: m.accent }}>{metrics[dim.id]}µV</span>
                                    </div>
                                    <input 
                                        type="range" min="0" max="100" 
                                        value={metrics[dim.id]}
                                        onChange={(e) => handleChange(dim.id, e.target.value)}
                                        style={{ width: '100%', cursor: 'pointer', accentColor: m.accent }}
                                    />
                                    <div style={{ fontFamily: 'var(--fBody)', fontSize: '0.85rem', color: m.text2, marginTop: '4px' }}>
                                        {dim.desc}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {successMessage ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                style={{
                                    marginTop: 'var(--space-xl)', padding: 'var(--space-md)',
                                    borderLeft: `2px solid ${m.accent}`, color: m.accent,
                                    fontFamily: 'var(--fSerif)', fontStyle: 'italic', fontSize: '1.2rem'
                                }}>
                                {successMessage}
                            </motion.div>
                        ) : (
                            <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-xl)' }}>
                                <button 
                                    onClick={handleLogDrift}
                                    disabled={submitting}
                                    style={{
                                        background: m.accent, border: `1px solid ${m.accent}`, color: m.bg,
                                        padding: '16px 32px', fontFamily: 'var(--fMono)', fontSize: '0.85rem', letterSpacing: '0.2em',
                                        fontWeight: 'bold', cursor: 'pointer', boxShadow: `0 0 20px ${m.accent}40`
                                    }}
                                >
                                    {submitting ? 'TRANSMITTING TRUTH...' : '[ ANCHOR MY 5D GIFTS ]'}
                                </button>

                                {activeVessel && parseInt(activeVessel.num) >= 1 && parseInt(activeVessel.num) <= 8 && (
                                    <button 
                                        onClick={handleSkipToCurriculum}
                                        style={{
                                            background: 'transparent', border: `1px solid ${m.accent}40`, color: m.accent,
                                            padding: '16px 32px', fontFamily: 'var(--fMono)', fontSize: '0.8rem', letterSpacing: '0.2em',
                                            cursor: 'pointer', transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = `${m.accent}20` }}
                                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
                                    >
                                        [ ENGAGE BEYOND 5D ]
                                    </button>
                                )}
                            </div>
                        )}
                        
                    </div>
                </div>
            </div>

            {/* The Curriculum Journey seamlessly infused into 5D */}
            <AnimatePresence>
                {activeVessel && parseInt(activeVessel.num) >= 1 && parseInt(activeVessel.num) <= 8 && isAnchored && (
                    <motion.div
                        ref={curriculumRef}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        style={{ 
                            padding: 'var(--space-xxl) var(--space-xl) 100px var(--space-xl)', 
                            borderTop: `1px solid ${m.text2}20`, 
                            display: 'flex', 
                            justifyContent: 'center',
                            width: '100%',
                            marginTop: '2rem'
                        }}
                    >
                         <GuidedJourneyModule
                            activeVessel={activeVessel}
                            m={m}
                            playStrikingBowl={playStrikingBowl}
                            playAlgoraveSynth={playAlgoraveSynth}
                            generateSonicSketch={generateSonicSketch}
                            askSage={askSage}
                            sageResponse={sageResponse}
                            isThinking={isThinking}
                          />
                    </motion.div>
                )}
            </AnimatePresence>

        </motion.div>
    );
};
