import React, { useState, useEffect, useMemo, useRef } from 'react';
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

const VisceralRenderer = ({ asset, kineticState, m, playTriggerId, mc = 0 }) => {
    if (asset.graphicType === 'steamsans') {
        const currentWeight = 900 - (mc * 600);
        const vaporGlow = mc > 0.5 ? `0 0 ${mc * 40}px ${m.accent}40` : 'none';
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
                            fontWeight: currentWeight,
                            textShadow: vaporGlow,
                            transform: `translateY(${mc * 20 * (i % 2 === 0 ? 1 : -1)}px) scale(${1 + (mc * 0.2)})`,
                            filter: `blur(${mc * 4}px)`
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
                        animate={kineticState === 'playing' || kineticState === 'done' ? { opacity: (1 / ring) * (1 - mc*0.5), rotate: (ring % 2 === 0 ? 360 : -360) * (1 + mc*2), scale: (1 + (ring * 0.2)) * (1 + mc*0.5) } : {}}
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
                                `M 0 100 Q 50 ${10 - (mc * 100)} 125 100 T 250 100 T 375 100 T 500 100`,
                                `M 0 100 Q 40 ${10 - (mc * 150)} 100 100 T 200 100 T 300 100 T 400 100 T 500 100`,
                                `M 0 100 Q 20 ${10 - (mc * 200)} 60 100 T 140 100 T 220 100 T 300 100 T 380 100 T 460 100 T 500 100`
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
    const geometries = ['story', 'portrait', 'grid', 'landscape'];
    
    const geoSpecs = {
        story: { width: '390px', height: '844px', fontKicker: '2.2rem', fontBody: '1.15rem' },
        portrait: { width: '480px', height: '600px', fontKicker: '2.0rem', fontBody: '1.05rem' },
        grid: { width: '500px', height: '500px', fontKicker: '1.8rem', fontBody: '0.95rem' },
        landscape: { width: '800px', height: '450px', fontKicker: '2.2rem', fontBody: '1.10rem' }
    };
    const spec = geoSpecs[geometry];

    // Active asset category
    const categories = Object.keys(assets);
    const [activeCategory, setActiveCategory] = useState('note'); // 'note', 'inquiry', 'exercise', 'science'
    const [activeAssetIndex, setActiveAssetIndex] = useState(0);
    const currentAsset = assets[activeCategory][activeAssetIndex];

    const cycleGeometry = () => setGeometry(geometries[(geometries.indexOf(geometry) + 1) % geometries.length]);
    const cycleCategory = () => {
        setActiveCategory(categories[(categories.indexOf(activeCategory) + 1) % categories.length]);
        setActiveAssetIndex(0);
    };

    // Auto-Scaling logic to fit the monument perfectly on any screen
    const containerRef = useRef(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const containerW = containerRef.current.clientWidth;
                const containerH = containerRef.current.clientHeight;
                const cw = parseInt(spec.width);
                const ch = parseInt(spec.height);
                
                // Allow a tiny bit of padding (20px) so it doesn't touch the edges completely
                const scaleW = (containerW - 20) / cw; 
                const scaleH = (containerH - 40) / ch;
                setScale(Math.min(scaleW, scaleH, 1)); // Scale down if needed, but don't scale up past 1x
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [spec.width, spec.height]);

    // STEAMSANS Cheat Code Logic
    const [cheatCodeBuffer, setCheatCodeBuffer] = useState('');
    const [steamsansUnlocked, setSteamsansUnlocked] = useState(false);
    
    // Geometry & Audio Integration
    const [mc, setMc] = useState(0);
    const [coordsText, setCoordsText] = useState('[ STBL: 95 | PRSS: 10 | COHR: 98 | DRFT: 2 ]');
    const harrisRef = useRef(null);
    const hbaRef = useRef(null);
    const vaporRef = useRef(null);

    useEffect(() => {
        const handleInteraction = (e) => {
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            const dx = Math.abs(clientX - cx);
            const dy = Math.abs(clientY - cy);
            const normX = Math.min(1, dx / cx);
            const normY = Math.min(1, dy / cy);
            const distance = Math.min(1, Math.sqrt(normX * normX + normY * normY) * 1.2);
            setMc(distance);
            
            const STBL = Math.round(100 - (distance * 100));
            const PRSS = Math.round(distance * 100);
            const COHR = Math.round(100 - (normX * 100));
            const DRFT = Math.round(normY * 100);
            setCoordsText(`[ STBL: ${STBL} | PRSS: ${PRSS} | COHR: ${COHR} | DRFT: ${DRFT} ]`);
        };
        window.addEventListener('mousemove', handleInteraction);
        window.addEventListener('touchmove', handleInteraction);
        return () => {
            window.removeEventListener('mousemove', handleInteraction);
            window.removeEventListener('touchmove', handleInteraction);
        };
    }, []);

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

    // Touch Unlock Logic (5 taps on the header)
    const [touchCount, setTouchCount] = useState(0);
    const handleTouchUnlock = () => {
        setTouchCount(prev => {
            const count = prev + 1;
            if (count >= 5) {
                setSteamsansUnlocked(true);
                if (playStrikingBowl) playStrikingBowl(36);
                return 0;
            }
            return count;
        });
        setTimeout(() => setTouchCount(0), 2000); // reset if taps are too slow
    };

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

    // Live Audio Spatial Mixing during playback
    useEffect(() => {
        if (!harrisRef.current || !hbaRef.current || !vaporRef.current) return;
        const harrisVol = Math.max(0, 1 - (mc * 2));
        const hbaVol = Math.max(0, 1 - Math.abs(mc - 0.5) * 2);
        const vaporVol = Math.max(0, (mc - 0.5) * 2);
        
        const isPlaying = kineticState === 'playing';
        harrisRef.current.volume = isPlaying ? harrisVol : 0;
        hbaRef.current.volume = isPlaying ? hbaVol : 0;
        vaporRef.current.volume = isPlaying ? vaporVol : 0;
        
        if (isPlaying) {
            harrisRef.current.play().catch(e=>e);
            hbaRef.current.play().catch(e=>e);
            vaporRef.current.play().catch(e=>e);
        } else {
            harrisRef.current.pause();
            hbaRef.current.pause();
            vaporRef.current.pause();
        }
    }, [mc, kineticState]);

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

    const uiVisible = kineticState === 'idle' || kineticState === 'done';

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: m.bg, color: m.text1,
            display: 'flex', flexDirection: 'column',
            fontFamily: 'var(--fBody)', overflow: 'hidden'
        }}>
            {/* Hidden Sonnet Jukebox Engine for recording */}
            <audio ref={harrisRef} src={`${import.meta.env.BASE_URL}assets/audio/steamsans/LAYER_01_HARRIS_REGISTER.mp3`} loop />
            <audio ref={hbaRef} src={`${import.meta.env.BASE_URL}assets/audio/steamsans/LAYER_02_HBA_REGISTER.mp3`} loop />
            <audio ref={vaporRef} src={`${import.meta.env.BASE_URL}assets/audio/steamsans/LAYER_03_VAPOR_REGISTER.mp3`} loop />
            
            {/* FLOATING SOCIAL CONTROL DECK (Disappears during recording) */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 50,
                opacity: uiVisible ? 1 : 0, transition: 'opacity 0.4s ease'
            }}>
                {/* Top Bar */}
                <div style={{ position: 'absolute', top: 'var(--space-md)', left: 'var(--space-md)', right: 'var(--space-md)', display: 'flex', justifyContent: 'space-between' }}>
                    <div onClick={handleTouchUnlock} style={{ 
                        fontFamily: 'var(--fMono)', fontSize: '0.7rem', color: m.accent, 
                        letterSpacing: '0.15em', cursor: 'pointer', pointerEvents: 'auto',
                        background: `${m.bg}dd`, padding: '6px 10px', borderRadius: '4px', backdropFilter: 'blur(4px)'
                    }}>
                        [ /legacy ]
                    </div>
                    
                    <div onClick={cycleGeometry} style={{ 
                        fontFamily: 'var(--fMono)', fontSize: '0.7rem', color: m.text1, border: `1px solid ${m.text1}`,
                        letterSpacing: '0.1em', cursor: 'pointer', pointerEvents: 'auto',
                        background: `${m.bg}dd`, padding: '6px 10px', borderRadius: '4px', backdropFilter: 'blur(4px)'
                    }}>
                        [ {geometry.toUpperCase()} ]
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{ position: 'absolute', bottom: 'var(--space-md)', left: 'var(--space-md)', right: 'var(--space-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div onClick={cycleCategory} style={{ 
                        fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.text2, 
                        letterSpacing: '0.1em', cursor: 'pointer', pointerEvents: 'auto',
                        background: `${m.bg}dd`, padding: '6px 10px', borderRadius: '4px', backdropFilter: 'blur(4px)'
                    }}>
                        [ CAT: {activeCategory.toUpperCase()} ]
                    </div>

                    <div onClick={triggerKineticMonument} style={{ 
                        fontFamily: 'var(--fMono)', fontSize: '0.9rem', color: m.bg, fontWeight: 'bold',
                        letterSpacing: '0.1em', cursor: 'pointer', pointerEvents: 'auto',
                        background: m.accent, padding: '12px 24px', borderRadius: '4px',
                        boxShadow: `0 0 20px ${m.accent}40`, transform: 'translateX(-25%)'
                    }}>
                        {kineticState === 'preroll' ? `[ ${prerollCount} ]` : '[ PLAY ]'}
                    </div>

                    <div onClick={() => setActiveAssetIndex(prev => (prev + 1) % assets[activeCategory].length)} style={{ 
                        fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.text2, 
                        letterSpacing: '0.1em', cursor: 'pointer', pointerEvents: 'auto',
                        background: `${m.bg}dd`, padding: '6px 10px', borderRadius: '4px', backdropFilter: 'blur(4px)'
                    }}>
                        [ NEXT ]
                    </div>
                </div>
            </div>

            {/* PREVIEW CANVAS CONTAINER */}
            <div ref={containerRef} style={{
                flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center',
                background: m.surface, overflow: 'hidden', position: 'relative'
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
                        overflow: 'hidden',
                        transform: `scale(${scale})`, // CSS Scale to fit the viewport perfectly
                        transformOrigin: 'center center'
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
                            <div style={{ marginBottom: '2rem' }}>
                                <VisceralRenderer asset={currentAsset} kineticState={kineticState} m={m} playTriggerId={playTriggerId} mc={mc} />
                            </div>
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
                        <div>{coordsText}</div>
                        <div style={{ opacity: 0.5 }}>CREÅTIVESTEEPING.COM</div>
                    </div>
                    
                </motion.div>
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
