import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateAssets } from './assetsData';

// ==========================================
// THE LEGACY SCREENGRAB PORTAL
// A private CMS for generating Social Media Geometry
// ==========================================

// Visceral Word-by-Word Animation Component
const AnimatedText = ({ text, delayOffset = 0, speed = 0.05, className, style, kineticState, triggerKey }) => {
    const [visibleCount, setVisibleCount] = useState(-1);
    const words = text.split(' ');

    useEffect(() => {
        if (kineticState === 'idle') {
            setVisibleCount(-1);
            return;
        }

        if (kineticState === 'playing') {
            setVisibleCount(0); // Start hidden
            
            let count = 0;
            // Delay start based on delayOffset (which is in seconds, convert to ms)
            const delayTimer = setTimeout(() => {
                const interval = setInterval(() => {
                    count++;
                    setVisibleCount(count);
                    if (count >= words.length) {
                        clearInterval(interval);
                    }
                }, speed * 1000); // speed is in seconds, convert to ms
                
                return () => clearInterval(interval);
            }, delayOffset * 1000);
            
            return () => clearTimeout(delayTimer);
        }
        
        if (kineticState === 'done') {
            setVisibleCount(words.length);
        }
    }, [kineticState, triggerKey, delayOffset, speed, words.length]);

    return (
        <div className={className} style={{ ...style, display: 'inline-block' }}>
            {words.map((word, i) => {
                const isVisible = kineticState === 'idle' || (visibleCount !== -1 && i < visibleCount);
                return (
                    <span 
                        key={`${triggerKey}-${i}`} 
                        style={{ 
                            display: 'inline-block', 
                            marginRight: '0.25em',
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? 'translateY(0)' : 'translateY(5px)',
                            filter: isVisible ? 'blur(0px)' : 'blur(4px)',
                            transition: isVisible ? 'opacity 0.8s ease-out, transform 0.8s ease-out, filter 0.8s ease-out' : 'none'
                        }}
                    >
                        {word}
                    </span>
                );
            })}
        </div>
    );
};

const VisceralRenderer = ({ asset, kineticState, m, playTriggerId }) => {
    if (asset.graphicType === 'steamsans') {
        return (
            <div style={{ position: 'relative', width: '100%', height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {['S', 'T', 'E', 'A', 'M', 'S', 'A', 'N', 'S'].map((char, i) => (
                    <motion.div
                        key={`${playTriggerId}-${i}`}
                        initial={{ opacity: 0, y: 50, filter: 'blur(10px)', scale: 0.8 }}
                        animate={kineticState === 'playing' || kineticState === 'done' ? { opacity: 0.8, y: 0, filter: 'blur(0px)', scale: 1 } : {}}
                        transition={{ duration: 2, delay: i * 0.15, ease: "easeOut" }}
                        style={{
                            position: 'absolute', fontFamily: 'var(--fSerif)', fontSize: '5rem', fontStyle: 'italic',
                            color: i % 2 === 0 ? m.text1 : m.accent,
                            left: `${5 + (i * 10)}%`, zIndex: 10 - i, mixBlendMode: 'screen',
                            textShadow: `0 0 20px ${m.accent}40`
                        }}
                    >
                        {char}
                    </motion.div>
                ))}
            </div>
        );
    }
    
    if (asset.graphicType === 'hexagong') {
        return (
            <div style={{ position: 'relative', width: '100%', height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {[1, 2, 3, 4, 5].map((ring) => (
                    <motion.div
                        key={`${playTriggerId}-${ring}`}
                        initial={{ opacity: 0, rotate: -45, scale: 0 }}
                        animate={kineticState === 'playing' || kineticState === 'done' ? { opacity: 1 / ring, rotate: ring % 2 === 0 ? 360 : -360, scale: 1 + (ring * 0.2) } : {}}
                        transition={{ duration: 5 + ring, ease: "easeOut", delay: ring * 0.2 }}
                        style={{
                            position: 'absolute',
                            width: `${100 + (ring * 40)}px`, height: `${115 + (ring * 46)}px`,
                            border: `1px solid ${ring % 2 === 0 ? m.text1 : m.accent}`,
                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                            boxShadow: `inset 0 0 10px ${m.accent}20`
                        }}
                    />
                ))}
            </div>
        );
    }
    
    if (asset.graphicType === 'pulse') {
        return (
            <div style={{ position: 'relative', width: '100%', height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={`${playTriggerId}-${i}`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={kineticState === 'playing' || kineticState === 'done' ? { opacity: [0, 0.4, 0], scale: [0, 1.5, 3] } : {}}
                        transition={{ duration: 4, repeat: Infinity, delay: i * 0.6, ease: "linear" }}
                        style={{
                            position: 'absolute', width: '100px', height: '100px',
                            borderRadius: '50%', border: `2px solid ${m.text2}`
                        }}
                    />
                ))}
            </div>
        );
    }

    if (asset.graphicType === 'oscilloscope') {
        return (
            <div style={{ position: 'relative', width: '100%', height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="none">
                    <motion.path
                        key={`${playTriggerId}-path`}
                        initial={{ d: "M 0 100 Q 125 100 250 100 T 500 100", stroke: m.text2, strokeWidth: 1 }}
                        animate={kineticState === 'playing' || kineticState === 'done' ? {
                            d: [
                                "M 0 100 Q 125 100 250 100 T 500 100",
                                "M 0 100 Q 50 10 125 100 T 250 100 T 375 100 T 500 100",
                                "M 0 100 Q 40 10 100 100 T 200 100 T 300 100 T 400 100 T 500 100",
                                "M 0 100 Q 20 10 60 100 T 140 100 T 220 100 T 300 100 T 380 100 T 460 100 T 500 100"
                            ],
                            stroke: m.accent,
                            strokeWidth: 2,
                            filter: "drop-shadow(0px 0px 8px rgba(230,170,100,0.6))"
                        } : {}}
                        transition={{ duration: 6, ease: "easeInOut" }}
                        fill="transparent"
                    />
                </svg>
            </div>
        );
    }

    if (asset.graphicType === 'door') {
        return (
            <div style={{ position: 'relative', width: '100%', height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {/* Glowing Interior */}
                <motion.div
                    key={`${playTriggerId}-glow`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={kineticState === 'playing' || kineticState === 'done' ? { opacity: 1, scale: 1.2 } : {}}
                    transition={{ duration: 3, delay: 2.5, ease: "easeOut" }}
                    style={{
                        position: 'absolute', width: '80px', height: '80px',
                        background: m.accent, filter: 'blur(30px)', borderRadius: '50%', zIndex: 1
                    }}
                />
                
                {/* Left Door */}
                <motion.div
                    key={`${playTriggerId}-left`}
                    initial={{ x: 0 }}
                    animate={kineticState === 'playing' || kineticState === 'done' ? { x: -60 } : {}}
                    transition={{ duration: 2, delay: 2, ease: "easeInOut" }}
                    style={{
                        position: 'absolute', width: '60px', height: '120px', background: m.surface,
                        border: `1px solid ${m.text2}`, borderRight: `1px solid ${m.accent}`,
                        clipPath: 'polygon(0% 25%, 100% 0%, 100% 100%, 0% 75%)',
                        zIndex: 2, left: 'calc(50% - 60px)'
                    }}
                />

                {/* Right Door */}
                <motion.div
                    key={`${playTriggerId}-right`}
                    initial={{ x: 0 }}
                    animate={kineticState === 'playing' || kineticState === 'done' ? { x: 60 } : {}}
                    transition={{ duration: 2, delay: 2, ease: "easeInOut" }}
                    style={{
                        position: 'absolute', width: '60px', height: '120px', background: m.surface,
                        border: `1px solid ${m.text2}`, borderLeft: `1px solid ${m.accent}`,
                        clipPath: 'polygon(0% 0%, 100% 25%, 100% 75%, 0% 100%)',
                        zIndex: 2, right: 'calc(50% - 60px)'
                    }}
                />

                {/* Pulses on the closed door */}
                {[...Array(2)].map((_, i) => (
                    <motion.div
                        key={`${playTriggerId}-pulse-${i}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={kineticState === 'playing' || kineticState === 'done' ? { opacity: [0, 0.5, 0], scale: 1.1 } : {}}
                        transition={{ duration: 1, delay: i * 1, ease: "easeOut" }}
                        style={{
                            position: 'absolute', width: '120px', height: '135px',
                            border: `2px solid ${m.accent}`, zIndex: 3,
                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                        }}
                    />
                ))}
            </div>
        );
    }
    return null;
};

export const LegacyScreengrabPortal = ({ m, onClose, playStrikingBowl, playAlgoraveSynth }) => {
    // Generate all 41 assets from the CSV data
    const baseAssets = useMemo(() => generateAssets(m), [m]);
    const assets = useMemo(() => ({
        ...baseAssets,
        visceral: [
            {
                id: 'v1',
                mechanism: 'STEEPING GEOMETRY :: STEAMSANS',
                isGraphic: true, graphicType: 'steamsans',
                kicker: 'steamsans timeout fake', body: 'fake body',
                coords: '[ STBL: 99 | PRSS: 99 | COHR: 99 | DRFT: 99 ]'
            },
            {
                id: 'v2',
                mechanism: 'STEEPING GEOMETRY :: HEX-KINTSUGI',
                isGraphic: true, graphicType: 'hexagong',
                kicker: 'hex timeout fake', body: 'fake body',
                coords: '[ STBL: 50 | PRSS: 50 | COHR: 90 | DRFT: 10 ]'
            },
            {
                id: 'v3',
                mechanism: 'STEEPING GEOMETRY :: THE SONIC ENGINE',
                isGraphic: true, graphicType: 'pulse',
                kicker: 'pulse timeout fake', body: 'fake body',
                coords: '[ STBL: 22 | PRSS: 88 | COHR: 77 | DRFT: 33 ]'
            },
            {
                id: 'v4',
                mechanism: 'STEEPING GEOMETRY :: RESONANCE TRACE',
                isGraphic: true, graphicType: 'oscilloscope',
                kicker: 'osc timeout fake', body: 'fake body',
                coords: '[ STBL: 45 | PRSS: 95 | COHR: 85 | DRFT: 10 ]'
            },
            {
                id: 'v5',
                mechanism: 'STEEPING GEOMETRY :: THE THRESHOLD',
                isGraphic: true, graphicType: 'door',
                kicker: 'door timeout fake', body: 'fake body',
                coords: '[ STBL: 80 | PRSS: 60 | COHR: 90 | DRFT: 05 ]'
            }
        ]
    }), [baseAssets, m]);

    // Layout geometry state: 'story' (9:16), 'grid' (1:1), 'portrait' (4:5), 'landscape' (16:9)
    const [geometry, setGeometry] = useState('story');
    
    const geoSpecs = {
        story: { width: '390px', height: '844px', fontKicker: '2.2rem', fontBody: '1.15rem' },
        portrait: { width: '480px', height: '600px', fontKicker: '2.0rem', fontBody: '1.05rem' },
        grid: { width: '500px', height: '500px', fontKicker: '1.8rem', fontBody: '0.95rem' },
        landscape: { width: '800px', height: '450px', fontKicker: '2.2rem', fontBody: '1.10rem' }
    };
    const spec = geoSpecs[geometry];

    // Active asset category
    const [activeCategory, setActiveCategory] = useState('note'); // 'note', 'inquiry', 'exercise', 'science'
    const [activeAssetIndex, setActiveAssetIndex] = useState(0);
    const currentAsset = assets[activeCategory][activeAssetIndex];

    // STEAMSANS Cheat Code Logic
    const [cheatCodeBuffer, setCheatCodeBuffer] = useState('');
    const [steamsansUnlocked, setSteamsansUnlocked] = useState(false);

    // Audio player state for STEAMSANS
    const [playingLayer, setPlayingLayer] = useState(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key.length === 1) { // capture character keys
                setCheatCodeBuffer(prev => {
                    const newBuffer = (prev + e.key.toLowerCase()).slice(-9);
                    if (newBuffer === 'steamsans') {
                        setSteamsansUnlocked(true);
                        if (playStrikingBowl) playStrikingBowl(36); // Deep confirmation tone
                    }
                    return newBuffer;
                });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [playStrikingBowl]);

    const playSteamsansLayer = (layer) => {
        if (playingLayer) {
            const audio = document.getElementById(`steamsans-audio-${playingLayer}`);
            if (audio) { audio.pause(); audio.currentTime = 0; }
        }
        
        if (playingLayer === layer) {
            setPlayingLayer(null); // Just toggle off
        } else {
            const audio = document.getElementById(`steamsans-audio-${layer}`);
            if (audio) { audio.play(); setPlayingLayer(layer); }
        }
    };

    // KINETIC ENGINE STATE
    const [kineticState, setKineticState] = useState('idle'); // 'idle', 'preroll', 'playing', 'done'
    const [prerollCount, setPrerollCount] = useState(3);
    const [playTriggerId, setPlayTriggerId] = useState(0); // Used to force framer-motion replay

    const triggerKineticMonument = () => {
        if (kineticState === 'playing' || kineticState === 'preroll') return;
        
        // 1. Start the Preroll Countdown for screen recording
        setKineticState('preroll');
        setPrerollCount(3);
        
        let count = 3;
        const interval = setInterval(() => {
            count--;
            setPrerollCount(count);
            if (count <= 0) {
                clearInterval(interval);
                startAnimation();
            }
        }, 1000);
    };

    const startAnimation = () => {
        setKineticState('playing');
        setPlayTriggerId(prev => prev + 1); // Increment to force a new animation cycle
        
        // Initial Grounding Strike
        if (playStrikingBowl) playStrikingBowl(45);
        if (playAlgoraveSynth) playAlgoraveSynth();

        const totalTimeMs = currentAsset.isGraphic ? 
            5000 : 
            (currentAsset.kicker.split(' ').length * 100) + (currentAsset.body.split(' ').length * 60) + 1000;
        
        setTimeout(() => {
            if (playStrikingBowl) playStrikingBowl(72);
        }, currentAsset.isGraphic ? 1000 : (currentAsset.kicker.split(' ').length * 100) + 200);

        setTimeout(() => {
            setKineticState('done');
        }, totalTimeMs);
    };

    // Reset when changing assets
    useEffect(() => {
        setKineticState('idle');
    }, [currentAsset.id]);

    // The AnimatedText component is defined outside to prevent React from unmounting it on every render

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: m.bg, color: m.text1,
            display: 'flex', flexDirection: 'column',
            fontFamily: 'var(--fBody)', overflow: 'hidden'
        }}>
            
            {/* PORTAL CONTROL DECK (Not for export, just controls) */}
            <div style={{
                padding: 'var(--space-md)', background: m.cardBg, borderBottom: `1px solid ${m.accent}30`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.75rem', color: m.accent, letterSpacing: '0.15em' }}>
                    [ /legacy :: SCREENGRAB PORTAL ]
                </div>
                
                <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <div style={{ display: 'flex', gap: '8px', borderRight: `1px solid ${m.text2}40`, paddingRight: '16px', marginRight: '8px' }}>
                        {Object.keys(assets).map(cat => (
                            <button key={cat} onClick={() => { setActiveCategory(cat); setActiveAssetIndex(0); }} style={{
                                background: activeCategory === cat ? m.text1 : 'transparent',
                                color: activeCategory === cat ? m.bg : m.text2,
                                border: `1px solid ${activeCategory === cat ? m.text1 : m.text2}`, padding: '4px 8px',
                                fontFamily: 'var(--fMono)', fontSize: '0.65rem', cursor: 'pointer', textTransform: 'uppercase'
                            }}>{cat}</button>
                        ))}
                    </div>

                    <button onClick={() => setGeometry('story')} style={{
                        background: geometry === 'story' ? m.accent : 'transparent',
                        color: geometry === 'story' ? m.bg : m.accent,
                        border: `1px solid ${m.accent}`, padding: '4px 12px',
                        fontFamily: 'var(--fMono)', fontSize: '0.65rem', cursor: 'pointer'
                    }}>9:16 TIKTOK</button>
                    
                    <button onClick={() => setGeometry('portrait')} style={{
                        background: geometry === 'portrait' ? m.accent : 'transparent',
                        color: geometry === 'portrait' ? m.bg : m.accent,
                        border: `1px solid ${m.accent}`, padding: '4px 12px',
                        fontFamily: 'var(--fMono)', fontSize: '0.65rem', cursor: 'pointer'
                    }}>4:5 IG FEED</button>

                    <button onClick={() => setGeometry('grid')} style={{
                        background: geometry === 'grid' ? m.accent : 'transparent',
                        color: geometry === 'grid' ? m.bg : m.accent,
                        border: `1px solid ${m.accent}`, padding: '4px 12px',
                        fontFamily: 'var(--fMono)', fontSize: '0.65rem', cursor: 'pointer'
                    }}>1:1 LINKEDIN</button>

                    <button onClick={() => setGeometry('landscape')} style={{
                        background: geometry === 'landscape' ? m.accent : 'transparent',
                        color: geometry === 'landscape' ? m.bg : m.accent,
                        border: `1px solid ${m.accent}`, padding: '4px 12px',
                        fontFamily: 'var(--fMono)', fontSize: '0.65rem', cursor: 'pointer'
                    }}>16:9 BLUESKY</button>
                    
                    <button onClick={onClose} style={{
                        background: 'transparent', color: m.text2, border: 'none',
                        fontFamily: 'var(--fMono)', fontSize: '0.65rem', cursor: 'pointer', marginLeft: 'var(--space-lg)'
                    }}>[ CLOSE ]</button>
                </div>
            </div>

            {/* THE VIEWFINDER (The Export Area) */}
            <div style={{
                flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center',
                background: m.surface, padding: 'var(--space-lg)', overflowY: 'auto'
            }}>
                {/* The Dynamic Canvas Frame */}
                <motion.div 
                    layout
                    style={{
                        width: spec.width, // Strict Spatial Geometry per platform
                        height: spec.height,
                        background: m.bg,
                        border: `1px solid ${m.accent}20`,
                        position: 'relative',
                        display: 'flex', flexDirection: 'column', 
                        padding: 'var(--space-xl)',
                        boxShadow: `0 20px 40px rgba(0,0,0,0.5)`,
                        overflow: 'hidden'
                    }}
                >
                    {/* The Rendered Monument */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', zIndex: 2, width: '100%' }}>
                        <div style={{ 
                            fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.accent, 
                            letterSpacing: '0.2em', marginBottom: 'var(--space-xl)',
                            opacity: kineticState === 'idle' || kineticState === 'done' || kineticState === 'preroll' ? 0.8 : 0,
                            transition: 'opacity 1s ease'
                        }}>
                            {currentAsset.mechanism}
                        </div>
                        {currentAsset.isGraphic ? (
                            <VisceralRenderer asset={currentAsset} kineticState={kineticState} m={m} playTriggerId={playTriggerId} />
                        ) : (
                            <>
                                <AnimatedText 
                                    text={currentAsset.kicker} 
                                    speed={0.1}
                                    kineticState={kineticState}
                                    triggerKey={`kicker-${playTriggerId}`}
                                    style={{ 
                                        fontFamily: 'var(--fSerif)', fontSize: spec.fontKicker, 
                                        lineHeight: 1.2, fontStyle: 'italic', color: m.text1,
                                        marginBottom: 'var(--space-xl)', minHeight: '3rem'
                                    }} 
                                />
                                {/* BASELINE ITALIC DISCIPLINE: Multi-sentence paragraphs MUST be font-style: normal */}
                                <AnimatedText 
                                    text={currentAsset.body}
                                    delayOffset={(currentAsset.kicker.split(' ').length * 0.1) + 0.4}
                                    speed={0.05}
                                    kineticState={kineticState}
                                    triggerKey={`body-${playTriggerId}`}
                                    style={{ 
                                        fontFamily: 'var(--fBody)', fontSize: spec.fontBody, lineHeight: 1.6, color: m.text2,
                                        fontStyle: 'normal', textAlign: 'left', padding: '0 1rem', minHeight: '6rem'
                                    }} 
                                />
                            </>
                        )}
                    </div>

                    {/* The Built-in Watermark and Coordinate Diagnostics (Pushed to bottom) */}
                    <div style={{
                        marginTop: 'auto', paddingTop: 'var(--space-xl)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                        fontFamily: 'var(--fMono)', fontSize: '0.55rem', letterSpacing: '0.25em',
                        color: m.accent, opacity: 0.6, textTransform: 'uppercase'
                    }}>
                        <div>{currentAsset.coords}</div>
                        <div style={{ opacity: 0.5 }}>CREÅTIVESTEEPING.COM</div>
                    </div>
                    
                </motion.div>

                {/* Director's Controls (Not captured in screenshot) */}
                <div style={{ position: 'absolute', bottom: 'var(--space-md)', right: 'var(--space-md)', display: 'flex', gap: 'var(--space-sm)' }}>
                    <button onClick={() => setActiveAssetIndex(prev => (prev + 1) % assets[activeCategory].length)} style={{
                        background: m.surface, border: `1px solid ${m.text2}40`, color: m.text2,
                        padding: '8px 16px', fontFamily: 'var(--fMono)', fontSize: '0.7rem', cursor: 'pointer',
                        letterSpacing: '0.15em'
                    }}>
                        [ NEXT ASSET ]
                    </button>
                    <button onClick={triggerKineticMonument} style={{
                        background: kineticState === 'preroll' ? m.text1 : m.accent, border: 'none', 
                        color: kineticState === 'preroll' ? m.bg : m.bg,
                        padding: '8px 16px', fontFamily: 'var(--fMono)', fontSize: '0.7rem', cursor: 'pointer',
                        letterSpacing: '0.15em', fontWeight: 'bold'
                    }}>
                        {kineticState === 'preroll' ? `[ RECORDING IN ${prerollCount}... ]` : 
                         kineticState === 'playing' ? '[ CAPTURING... ]' : '[ KINETIC PLAY ]'}
                    </button>
                </div>
            </div>

            {/* THE SECRET STEAMSANS PORTAL */}
            <AnimatePresence>
                {steamsansUnlocked && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        style={{
                            position: 'absolute', inset: 0, zIndex: 100,
                            background: '#050505', color: '#e5e5e5', // Hardcoded Emergent/Vapor palette
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            fontFamily: 'var(--fMono)', padding: 'var(--space-xxl)'
                        }}
                    >
                        <button 
                            onClick={() => {
                                setSteamsansUnlocked(false);
                                if (playingLayer) {
                                    const audio = document.getElementById(`steamsans-audio-${playingLayer}`);
                                    if (audio) { audio.pause(); audio.currentTime = 0; }
                                }
                            }}
                            style={{
                                position: 'absolute', top: 'var(--space-lg)', right: 'var(--space-lg)',
                                background: 'transparent', color: '#e5e5e5', border: '1px solid #e5e5e5',
                                padding: '4px 12px', fontSize: '0.65rem', cursor: 'pointer', opacity: 0.5
                            }}
                        >[ RETURN ]</button>

                        <div style={{ opacity: 0.4, letterSpacing: '0.4em', fontSize: '0.7rem', marginBottom: 'var(--space-md)' }}>
                            THE ENTRY COORDINATE
                        </div>
                        
                        <h1 style={{ 
                            fontFamily: 'var(--fSerif)', fontSize: '3rem', fontStyle: 'italic',
                            color: '#ffffff', marginBottom: 'var(--space-xxl)', textAlign: 'center',
                            textShadow: '0 0 20px rgba(255,255,255,0.2)'
                        }}>
                            STEAMSANS × SONNET ENGINE
                        </h1>

                        <div style={{ maxWidth: '600px', textAlign: 'center', fontFamily: 'var(--fBody)', fontSize: '1.2rem', lineHeight: 1.6, color: '#a3a3a3', marginBottom: 'var(--space-xxl)' }}>
                            "The mathematics were always there. The instrument gives the knowledge a name, not a new existence."
                        </div>

                        {/* Hidden Audio Elements */}
                        <audio id="steamsans-audio-harris" src={`${import.meta.env.BASE_URL}assets/audio/steamsans/LAYER_01_HARRIS_REGISTER.mp3`} loop />
                        <audio id="steamsans-audio-hba" src={`${import.meta.env.BASE_URL}assets/audio/steamsans/LAYER_02_HBA_REGISTER.mp3`} loop />
                        <audio id="steamsans-audio-vapor" src={`${import.meta.env.BASE_URL}assets/audio/steamsans/LAYER_03_VAPOR_REGISTER.mp3`} loop />
                        <audio id="steamsans-audio-composite" src={`${import.meta.env.BASE_URL}assets/audio/steamsans/LAYER_04_COMPOSITE_ALL_REGISTERS.mp3`} loop />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', width: '100%', maxWidth: '400px' }}>
                            {[
                                { id: 'harris', label: '01. HARRIS REGISTER', desc: 'The grounded, weighted tone.' },
                                { id: 'hba', label: '02. HBA REGISTER', desc: 'The transitional tone.' },
                                { id: 'vapor', label: '03. VAPOR REGISTER', desc: 'The dissolved, transmissive tone.' },
                                { id: 'composite', label: '04. THE COMPOSITE', desc: 'All three simultaneously.' }
                            ].map(layer => (
                                <button 
                                    key={layer.id}
                                    onClick={() => playSteamsansLayer(layer.id)}
                                    style={{
                                        background: playingLayer === layer.id ? '#e5e5e5' : 'transparent',
                                        color: playingLayer === layer.id ? '#050505' : '#e5e5e5',
                                        border: '1px solid #e5e5e5',
                                        padding: 'var(--space-lg)', textAlign: 'left',
                                        cursor: 'pointer', transition: 'all 0.4s ease'
                                    }}
                                >
                                    <div style={{ fontWeight: 'bold', letterSpacing: '0.15em', marginBottom: '4px' }}>{layer.label}</div>
                                    <div style={{ fontFamily: 'var(--fBody)', fontSize: '0.9rem', opacity: playingLayer === layer.id ? 0.8 : 0.6 }}>{layer.desc}</div>
                                </button>
                            ))}
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
            
        </div>
    );
};
