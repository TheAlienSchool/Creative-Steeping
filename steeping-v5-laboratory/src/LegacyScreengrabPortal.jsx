import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateAssets } from './assetsData';

// ==========================================
// THE LEGACY SCREENGRAB PORTAL
// A private CMS for generating Social Media Geometry
// ==========================================

// Helper to parse bold markdown-like syntax (**word**) and trailing punctuation
const parseBoldWord = (word) => {
    const match = word.match(/^(\*\*)(.+?)(\*\*)(\.|,|;|!|\?)*$/);
    if (match) {
        const clean = match[2];
        const punctuation = match[4] || '';
        return { clean, isBold: true, punctuation };
    }
    return { clean: word, isBold: false, punctuation: '' };
};

// Visceral Word-by-Word/Line-by-Line Animation Component
const AnimatedText = ({ text, delayOffset = 0, speed = 0.05, className, style, kineticState, triggerKey, m }) => {
    const [visibleCount, setVisibleCount] = useState(-1);
    
    // Parse lines to respect carriage returns and apply artful de-orphaning per line
    const lines = useMemo(() => {
        if (!text) return [];
        return text.split('\n').map(line => {
            const trimmed = line.trim();
            if (!trimmed) return "";
            const words = trimmed.split(' ');
            if (words.length > 1) {
                const last = words.pop();
                const secondLast = words.pop();
                // Keep the last two words bound together on the same line to prevent orphans
                return [...words, `${secondLast}\u00A0${last}`].join(' ');
            }
            return trimmed;
        });
    }, [text]);

    // Flat list of words to animate sequentially
    const allWords = useMemo(() => {
        return lines.flatMap(line => line ? line.split(' ') : []).filter(Boolean);
    }, [lines]);

    useEffect(() => {
        if (kineticState === 'idle') {
            setVisibleCount(-1);
            return;
        }

        if (kineticState === 'playing') {
            setVisibleCount(0); // Start hidden
            
            let count = 0;
            // Delay start based on delayOffset
            const delayTimer = setTimeout(() => {
                const interval = setInterval(() => {
                    count++;
                    setVisibleCount(count);
                    if (count >= allWords.length) {
                        clearInterval(interval);
                    }
                }, speed * 1000);
                
                return () => clearInterval(interval);
            }, delayOffset * 1000);
            
            return () => clearTimeout(delayTimer);
        }
        
        if (kineticState === 'done') {
            setVisibleCount(allWords.length);
        }
    }, [kineticState, triggerKey, delayOffset, speed, allWords.length]);

    let wordIndexOffset = 0;

    return (
        <div className={className} style={{ ...style, display: 'block', textAlign: style.textAlign || 'center' }}>
            {lines.map((line, lineIdx) => {
                if (!line) {
                    // Render empty line spacing
                    return <div key={`${triggerKey}-empty-${lineIdx}`} style={{ height: '0.8em' }} />;
                }
                
                const lineWords = line.split(' ').filter(Boolean);
                const lineRender = (
                    <div 
                        key={`${triggerKey}-line-${lineIdx}`} 
                        style={{ 
                            marginBottom: lineIdx < lines.length - 1 ? '0.35em' : 0,
                            display: 'block'
                        }}
                    >
                        {lineWords.map((word, wordIdx) => {
                            const overallIdx = wordIndexOffset + wordIdx;
                            const isVisible = kineticState === 'idle' || (visibleCount !== -1 && overallIdx < visibleCount);
                            const { clean, isBold, punctuation } = parseBoldWord(word);
                            
                            return (
                                <span 
                                    key={`${triggerKey}-w-${overallIdx}`} 
                                    style={{ 
                                        display: 'inline-block', 
                                        marginRight: '0.25em',
                                        opacity: isVisible ? 1 : 0,
                                        transform: isVisible ? 'translateY(0)' : 'translateY(5px)',
                                        filter: isVisible ? 'blur(0px)' : 'blur(4px)',
                                        transition: isVisible ? 'opacity 0.8s ease-out, transform 0.8s ease-out, filter 0.8s ease-out' : 'none',
                                        fontWeight: isBold ? 'bold' : style.fontWeight || 'inherit',
                                        color: isBold ? (m?.accent || '#d4922a') : style.color,
                                        fontStyle: isBold ? 'normal' : style.fontStyle || 'inherit'
                                    }}
                                >
                                    {clean}{punctuation}
                                </span>
                            );
                        })}
                    </div>
                );
                
                wordIndexOffset += lineWords.length;
                return lineRender;
            })}
        </div>
    );
};

const VisceralRenderer = ({ asset, kineticState, m, playTriggerId, mc = 0, graphicH = '280px' }) => {
    if (asset.graphicType === 'steamsans') {
        const text = asset.kicker || "CREÅTIVE STEEPING";
        const chars = [...text];
        const currentWeight = 900 - (mc * 600);
        const vaporGlow = mc > 0.5 ? `0 0 ${mc * 40}px ${m.accent}40` : 'none';
        return (
            <div style={{ position: 'relative', width: '100%', height: graphicH, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {chars.map((char, i) => (
                    <motion.div
                        key={`${playTriggerId}-${i}`}
                        initial={{ opacity: 0, y: 50, filter: 'blur(10px)', scale: 0.8 }}
                        animate={kineticState === 'playing' || kineticState === 'done' ? { opacity: 0.8, y: 0, filter: 'blur(0px)', scale: 1 } : {}}
                        transition={{ duration: 2, delay: i * 0.08, ease: "easeOut" }}
                        style={{
                            position: 'absolute', fontFamily: 'var(--fSerif)', fontSize: chars.length > 12 ? '2.4rem' : '4rem', fontStyle: 'italic',
                            color: i % 2 === 0 ? m.text1 : m.accent,
                            left: `${10 + (i * (80 / chars.length))}%`, zIndex: 10 - i, mixBlendMode: 'screen',
                            fontWeight: currentWeight,
                            textShadow: vaporGlow,
                            transform: `translateY(${mc * 20 * (i % 2 === 0 ? 1 : -1)}px) scale(${1 + (mc * 0.2)})`,
                            filter: `blur(${mc * 4}px)`,
                            whiteSpace: 'pre'
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
            <div style={{ position: 'relative', width: '100%', height: graphicH, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
            <div style={{ position: 'relative', width: '100%', height: graphicH, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
            <div style={{ position: 'relative', width: '100%', height: graphicH, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
            <div style={{ position: 'relative', width: '100%', height: graphicH, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                mechanism: 'STEEPING GEOMETRY :: WORD ART I',
                isGraphic: true, graphicType: 'steamsans',
                kicker: 'CREÅTIVE STEEPING', body: '',
                coords: '[ STBL: 99 | PRSS: 99 | COHR: 99 | DRFT: 99 ]'
            },
            {
                id: 'v2',
                mechanism: 'STEEPING GEOMETRY :: WORD ART II',
                isGraphic: true, graphicType: 'hexagong',
                kicker: 'CREÅTIVE STEEPING', body: '',
                coords: '[ STBL: 50 | PRSS: 50 | COHR: 90 | DRFT: 10 ]'
            },
            {
                id: 'v3',
                mechanism: 'STEEPING GEOMETRY :: WORD ART III',
                isGraphic: true, graphicType: 'pulse',
                kicker: 'CREÅTIVE STEEPING', body: '',
                coords: '[ STBL: 22 | PRSS: 88 | COHR: 77 | DRFT: 33 ]'
            },
            {
                id: 'v4',
                mechanism: 'STEEPING GEOMETRY :: THE FLAVOR PATH',
                isGraphic: true, graphicType: 'oscilloscope',
                kicker: 'CREÅTIVE STEEPING', body: 'A Journey To The Essence of Your Flavor',
                coords: '[ STBL: 95 | PRSS: 10 | COHR: 98 | DRFT: 02 ]'
            },
            {
                id: 'v5',
                mechanism: 'STEEPING GEOMETRY :: SOUND OF THE SOUL',
                isGraphic: true, graphicType: 'door',
                kicker: 'CREÅTIVE STEEPING', body: 'Journaling To The Sound of Your Soul',
                coords: '[ STBL: 80 | PRSS: 60 | COHR: 90 | DRFT: 05 ]'
            },
            {
                id: 'v6',
                mechanism: 'STEEPING GEOMETRY :: SONIC CEREMONY',
                isGraphic: true, graphicType: 'oscilloscope',
                kicker: 'CREÅTIVE STEEPING', body: 'A Sonic Ceremony For Your Thoughts',
                coords: '[ STBL: 77 | PRSS: 33 | COHR: 88 | DRFT: 12 ]'
            },
            {
                id: 'v7',
                mechanism: 'STEEPING GEOMETRY :: MELODY OF MOMENTUM',
                isGraphic: true, graphicType: 'pulse',
                kicker: 'CREÅTIVE STEEPING', body: 'An Invitation To The Melody of Momentum',
                coords: '[ STBL: 90 | PRSS: 40 | COHR: 95 | DRFT: 05 ]'
            }
        ]
    }), [baseAssets, m]);

    // Layout geometry state: 'story' (9:16), 'grid' (1:1), 'portrait' (4:5), 'landscape' (16:9)
    const [geometry, setGeometry] = useState('story');
    const geometries = ['story', 'portrait', 'grid', 'landscape'];
    
    const geoSpecs = {
        story:     { width: '390px',  height: '844px', fontKicker: '2.2rem',  fontBody: '1.15rem', cardPad: '32px 28px', graphicH: '260px', mechMargin: 'var(--space-xl)' },
        portrait:  { width: '480px',  height: '600px', fontKicker: '2.0rem',  fontBody: '1.1rem',  cardPad: '40px 36px', graphicH: '210px', mechMargin: 'var(--space-lg)' },
        grid:      { width: '500px',  height: '500px', fontKicker: '1.75rem', fontBody: '1.0rem',  cardPad: '28px 32px', graphicH: '175px', mechMargin: 'var(--space-md)' },
        landscape: { width: '800px',  height: '450px', fontKicker: '2.2rem',  fontBody: '1.1rem',  cardPad: '28px 48px', graphicH: '155px', mechMargin: 'var(--space-md)' }
    };
    const spec = geoSpecs[geometry];

    // Active asset category
    const categories = Object.keys(assets);
    const [activeCategory, setActiveCategory] = useState('notes'); // 'notes', 'offering', 'reviews', 'visceral'
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

                // Account for the floating top bar (~48px) and bottom control bar (~72px) + gaps
                const TOP_CHROME = 64;
                const BOTTOM_CHROME = 80;
                const HORIZ_PAD = 40;

                const scaleW = (containerW - HORIZ_PAD) / cw;
                const scaleH = (containerH - TOP_CHROME - BOTTOM_CHROME) / ch;
                setScale(Math.min(scaleW, scaleH, 1));
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
    const fadeIntervalRef = useRef(null); // Ref to hold fade-out interval ID
    const fadeInIntervalRef = useRef(null); // Ref to hold fade-in interval ID
    const fadeInScaleRef = useRef(1); // Ref for soft fade-in scaling
    const [loopMode, setLoopMode] = useState(false); // Toggle to play+loop recording assets
    const [isMuted, setIsMuted] = useState(false); // Toggle to mute spatial audio registers

    // Cleanup fade intervals on unmount
    useEffect(() => {
        return () => {
            if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
            if (fadeInIntervalRef.current) clearInterval(fadeInIntervalRef.current);
        };
    }, []);

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

    // UI panel state
    const [hotkeysOpen, setHotkeysOpen] = useState(false);

    // KINETIC ENGINE STATE
    const [kineticState, setKineticState] = useState('idle'); // 'idle', 'preroll', 'playing', 'done'
    const [prerollCount, setPrerollCount] = useState(3);
    const [playTriggerId, setPlayTriggerId] = useState(0); // Used to force framer-motion replay

    // Live Audio Spatial Mixing and Fade-Out during playback transitions
    useEffect(() => {
        if (!harrisRef.current || !hbaRef.current || !vaporRef.current) return;
        
        const harris = harrisRef.current;
        const hba = hbaRef.current;
        const vapor = vaporRef.current;
        
        if (kineticState === 'playing') {
            // Cancel any active fade-out intervals
            if (fadeIntervalRef.current) {
                clearInterval(fadeIntervalRef.current);
                fadeIntervalRef.current = null;
            }
            
            // Set up soft fade-in over 250ms
            if (!fadeInIntervalRef.current) {
                fadeInScaleRef.current = 0;
                const fadeInDuration = 250;
                const stepTime = 20;
                let elapsed = 0;
                
                fadeInIntervalRef.current = setInterval(() => {
                    elapsed += stepTime;
                    fadeInScaleRef.current = Math.min(1, elapsed / fadeInDuration);
                    
                    if (harrisRef.current && hbaRef.current && vaporRef.current) {
                        const mm = isMuted ? 0 : 1;
                        harrisRef.current.volume = Math.max(0, Math.pow(Math.cos(mc * Math.PI / 2), 3)) * mm * fadeInScaleRef.current;
                        hbaRef.current.volume = Math.max(0, Math.pow(Math.sin(mc * Math.PI), 3)) * mm * fadeInScaleRef.current;
                        vaporRef.current.volume = Math.max(0, Math.pow(Math.sin(mc * Math.PI / 2), 3)) * mm * fadeInScaleRef.current;
                    }
                    
                    if (elapsed >= fadeInDuration) {
                        clearInterval(fadeInIntervalRef.current);
                        fadeInIntervalRef.current = null;
                    }
                }, stepTime);
            }
            
            const mm = isMuted ? 0 : 1;
            const harrisVol = Math.max(0, Math.pow(Math.cos(mc * Math.PI / 2), 3)) * mm * fadeInScaleRef.current;
            const hbaVol = Math.max(0, Math.pow(Math.sin(mc * Math.PI), 3)) * mm * fadeInScaleRef.current;
            const vaporVol = Math.max(0, Math.pow(Math.sin(mc * Math.PI / 2), 3)) * mm * fadeInScaleRef.current;
            
            harris.volume = harrisVol;
            hba.volume = hbaVol;
            vapor.volume = vaporVol;
            
            harris.play().catch(e=>e);
            hba.play().catch(e=>e);
            vapor.play().catch(e=>e);
        } else if (kineticState === 'done' || kineticState === 'idle') {
            // Cancel active fade-in
            if (fadeInIntervalRef.current) {
                clearInterval(fadeInIntervalRef.current);
                fadeInIntervalRef.current = null;
            }
            
            // Fade out smoothly if they were playing
            if (fadeIntervalRef.current) {
                clearInterval(fadeIntervalRef.current);
            }
            
            const startHarris = harris.volume;
            const startHba = hba.volume;
            const startVapor = vapor.volume;
            const duration = 1500; // 1.5 seconds fade
            const intervalTime = 30; // 30ms steps
            let elapsed = 0;
            
            fadeIntervalRef.current = setInterval(() => {
                elapsed += intervalTime;
                const ratio = Math.max(0, 1 - (elapsed / duration));
                
                harris.volume = startHarris * ratio;
                hba.volume = startHba * ratio;
                vapor.volume = startVapor * ratio;
                
                if (elapsed >= duration) {
                    clearInterval(fadeIntervalRef.current);
                    fadeIntervalRef.current = null;
                    harris.pause();
                    hba.pause();
                    vapor.pause();
                    harris.volume = 0;
                    hba.volume = 0;
                    vapor.volume = 0;
                }
            }, intervalTime);
        } else {
            // preroll
            harris.pause();
            hba.pause();
            vapor.pause();
        }
    }, [mc, kineticState, isMuted]);

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
            8000 : // Extended from 5000 to 8000 to give the graphic more time to express itself
            (currentAsset.kicker.split(' ').length * 100) + (currentAsset.body.split(' ').length * 60) + 3000; // Increased padding from 1000 to 3000
        
        setTimeout(() => {
            if (playStrikingBowl) playStrikingBowl(72);
        }, currentAsset.isGraphic ? 1000 : (currentAsset.kicker.split(' ').length * 100) + 200);

        if (!loopMode) {
            setTimeout(() => {
                setKineticState(prev => prev === 'playing' ? 'done' : prev); // Prevents overriding if manually stopped
            }, totalTimeMs);
        }
    };

    // Reset when changing assets
    useEffect(() => {
        setKineticState('idle');
    }, [currentAsset.id]);

    // Unified Keyboard Shortcuts & Steamsans Cheat Code Listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key.toLowerCase();
            
            // Steamsans Cheat Code
            if (e.key.length === 1) {
                setCheatCodeBuffer(prev => {
                    const newBuffer = (prev + key).slice(-9);
                    if (newBuffer === 'steamsans') {
                        setSteamsansUnlocked(true);
                        if (playStrikingBowl) playStrikingBowl(36);
                    }
                    return newBuffer;
                });
            }

            // Prevent shortcut triggers in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            if (e.key === ' ') {
                e.preventDefault();
                if (kineticState === 'playing') {
                    setKineticState('done');
                } else if (kineticState === 'idle' || kineticState === 'done') {
                    triggerKineticMonument();
                }
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                setActiveAssetIndex(prev => (prev + 1) % assets[activeCategory].length);
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                setActiveAssetIndex(prev => (prev - 1 + assets[activeCategory].length) % assets[activeCategory].length);
            } else if (key === 'l') {
                setLoopMode(prev => !prev);
            } else if (key === 'g') {
                cycleGeometry();
            } else if (key === 'c') {
                cycleCategory();
            } else if (key === 'm') {
                setIsMuted(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [
        kineticState,
        loopMode,
        isMuted,
        activeCategory,
        activeAssetIndex,
        geometry,
        assets,
        playStrikingBowl
    ]);

    // The AnimatedText component is defined outside to prevent React from unmounting it on every render

    const uiVisible = kineticState === 'idle' || kineticState === 'done';
    const isPoem = !!(currentAsset.body && currentAsset.body.includes('\n'));

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
                <div style={{ position: 'absolute', top: 'var(--space-md)', left: 'var(--space-md)', right: 'var(--space-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', position: 'relative' }}>
                        <div onClick={handleTouchUnlock} style={{
                            fontFamily: 'var(--fMono)', fontSize: '0.7rem', color: m.accent,
                            letterSpacing: '0.15em', cursor: 'pointer', pointerEvents: 'auto',
                            background: `${m.bg}dd`, padding: '6px 10px', borderRadius: '4px', backdropFilter: 'blur(4px)'
                        }}>
                            [ /legacy ]
                        </div>

                        {/* Collapsible Hotkeys Toggle */}
                        <div
                            onClick={() => setHotkeysOpen(prev => !prev)}
                            style={{
                                fontFamily: 'var(--fMono)', fontSize: '0.7rem',
                                color: hotkeysOpen ? m.accent : m.text2,
                                border: `1px solid ${hotkeysOpen ? m.accent : m.text2 + '60'}`,
                                letterSpacing: '0.1em', cursor: 'pointer', pointerEvents: 'auto',
                                background: `${m.bg}dd`, padding: '6px 10px', borderRadius: '4px', backdropFilter: 'blur(4px)',
                                transition: 'color 0.2s ease, border-color 0.2s ease'
                            }}
                        >
                            [ ⌨ ]
                        </div>

                        {/* Glassmorphic Keyboard Hotkeys Panel :: anchored below the top bar */}
                        {hotkeysOpen && (
                            <div style={{
                                position: 'absolute', top: 'calc(100% + 8px)', left: 0,
                                background: `${m.bg}ee`, border: `1px solid ${m.accent}40`,
                                padding: '12px var(--space-lg)', borderRadius: '6px',
                                backdropFilter: 'blur(10px)', width: '220px',
                                fontFamily: 'var(--fMono)', fontSize: '0.6rem',
                                lineHeight: '1.6', color: m.text2,
                                pointerEvents: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                                display: 'flex', flexDirection: 'column', gap: '4px',
                                zIndex: 70
                            }}>
                                <div style={{ color: m.accent, fontWeight: 'bold', letterSpacing: '0.15em', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ fontSize: '0.8rem' }}>⌨</span> KEYBOARD HOTKEYS
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: m.text1, fontWeight: 'bold' }}>[Space]</span>
                                    <span>Play / Stop</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: m.text1, fontWeight: 'bold' }}>[→]</span>
                                    <span>Next Asset</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: m.text1, fontWeight: 'bold' }}>[←]</span>
                                    <span>Prev Asset</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: m.text1, fontWeight: 'bold' }}>[L]</span>
                                    <span>Toggle Loop</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: m.text1, fontWeight: 'bold' }}>[G]</span>
                                    <span>Geometry</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: m.text1, fontWeight: 'bold' }}>[C]</span>
                                    <span>Category</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: m.text1, fontWeight: 'bold' }}>[M]</span>
                                    <span>Toggle Mute</span>
                                </div>
                            </div>
                        )}
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
                <div style={{
                    position: 'absolute', bottom: 'var(--space-md)', left: 'var(--space-md)', right: 'var(--space-md)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px',
                    flexWrap: 'nowrap'
                }}>
                    <div onClick={cycleCategory} style={{
                        fontFamily: 'var(--fMono)', fontSize: '0.6rem', color: m.text2,
                        letterSpacing: '0.08em', cursor: 'pointer', pointerEvents: 'auto',
                        background: `${m.bg}dd`, padding: '6px 8px', borderRadius: '4px', backdropFilter: 'blur(4px)',
                        whiteSpace: 'nowrap', flexShrink: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis'
                    }}>
                        [ CAT: {activeCategory.toUpperCase()} ]
                    </div>

                    <div onClick={() => setLoopMode(prev => !prev)} style={{
                        fontFamily: 'var(--fMono)', fontSize: '0.6rem', color: loopMode ? m.accent : m.text2,
                        border: `1px dashed ${loopMode ? m.accent : 'transparent'}`,
                        letterSpacing: '0.08em', cursor: 'pointer', pointerEvents: 'auto',
                        background: `${m.bg}dd`, padding: '6px 8px', borderRadius: '4px', backdropFilter: 'blur(4px)',
                        transition: 'all 0.3s ease', whiteSpace: 'nowrap', flexShrink: 0
                    }}>
                        [ LOOP: {loopMode ? 'ON' : 'OFF'} ]
                    </div>

                    <div onClick={() => setIsMuted(prev => !prev)} style={{
                        fontFamily: 'var(--fMono)', fontSize: '0.6rem', color: isMuted ? m.accent : m.text2,
                        border: `1px dashed ${isMuted ? m.accent : 'transparent'}`,
                        letterSpacing: '0.08em', cursor: 'pointer', pointerEvents: 'auto',
                        background: `${m.bg}dd`, padding: '6px 8px', borderRadius: '4px', backdropFilter: 'blur(4px)',
                        transition: 'all 0.3s ease', whiteSpace: 'nowrap', flexShrink: 0
                    }}>
                        [ MUTE: {isMuted ? 'ON' : 'OFF'} ]
                    </div>

                    <div onClick={triggerKineticMonument} style={{
                        fontFamily: 'var(--fMono)', fontSize: '0.9rem', color: m.bg, fontWeight: 'bold',
                        letterSpacing: '0.1em', cursor: 'pointer', pointerEvents: 'auto',
                        background: m.accent, padding: '12px 20px', borderRadius: '4px',
                        boxShadow: `0 0 20px ${m.accent}40`, whiteSpace: 'nowrap', flexShrink: 0
                    }}>
                        {kineticState === 'preroll' ? `[ ${prerollCount} ]` : '[ PLAY ]'}
                    </div>

                    <div onClick={() => setActiveAssetIndex(prev => (prev + 1) % assets[activeCategory].length)} style={{
                        fontFamily: 'var(--fMono)', fontSize: '0.6rem', color: m.text2,
                        letterSpacing: '0.08em', cursor: 'pointer', pointerEvents: 'auto',
                        background: `${m.bg}dd`, padding: '6px 8px', borderRadius: '4px', backdropFilter: 'blur(4px)',
                        whiteSpace: 'nowrap', flexShrink: 0
                    }}>
                        [ NEXT ]
                    </div>
                </div>
            </div>

            {/* PREVIEW CANVAS CONTAINER (Click anywhere during playing to stop & fade out) */}
            <div 
                ref={containerRef} 
                onClick={() => {
                    if (kineticState === 'playing') {
                        setKineticState('done');
                    }
                }}
                style={{
                    flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center',
                    background: m.surface, overflow: 'hidden', position: 'relative',
                    cursor: kineticState === 'playing' ? 'pointer' : 'default'
                }}
            >
                {/* The Dynamic Canvas Frame */}
                <motion.div
                    layout
                    style={{
                        width: spec.width,
                        height: spec.height,
                        background: m.bg,
                        border: `1px solid ${m.accent}20`,
                        position: 'relative',
                        display: 'flex', flexDirection: 'column',
                        padding: spec.cardPad,
                        boxShadow: `0 20px 40px rgba(0,0,0,0.5)`,
                        overflow: 'hidden',
                        transform: `scale(${scale})`,
                        transformOrigin: 'center center'
                    }}
                >
                    {/* Loop Mode Stop Overlay */}
                    {kineticState === 'playing' && loopMode && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            transition={{ delay: 2, duration: 1.5 }}
                            style={{
                                position: 'absolute', bottom: 'var(--space-md)', left: 0, right: 0,
                                textAlign: 'center', fontFamily: 'var(--fMono)', fontSize: '0.5rem',
                                letterSpacing: '0.2em', color: m.accent, textTransform: 'uppercase',
                                pointerEvents: 'none', textShadow: `0 0 8px ${m.accent}40`, zIndex: 10
                            }}
                        >
                            Loop Active • Tap screen to transition
                        </motion.div>
                    )}

                    {/* The Rendered Monument */}
                    <div style={{
                        flex: 1, minHeight: 0, overflow: 'hidden',
                        display: 'flex', flexDirection: 'column',
                        justifyContent: isPoem ? 'flex-start' : 'center',
                        textAlign: 'center', zIndex: 2, width: '100%',
                        paddingTop: isPoem ? 'var(--space-sm)' : 0
                    }}>
                        <div style={{
                            fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.accent,
                            letterSpacing: '0.2em', marginBottom: spec.mechMargin,
                            opacity: kineticState === 'idle' || kineticState === 'done' || kineticState === 'preroll' ? 0.8 : 0,
                            transition: 'opacity 1s ease, font-weight 0.4s ease', flexShrink: 0,
                            fontWeight: Math.round(300 + (mc * 200))
                        }}>
                            {currentAsset.mechanism}
                        </div>
                        {currentAsset.isGraphic ? (
                            <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                                <VisceralRenderer asset={currentAsset} kineticState={kineticState} m={m} playTriggerId={playTriggerId} mc={mc} graphicH={spec.graphicH} />
                                {/* Artful Overlay Text for Graphic Assets (except Word Art) */}
                                {currentAsset.graphicType !== 'steamsans' && (
                                    <div style={{ marginTop: '1.5rem', zIndex: 10, width: '100%' }}>
                                        <AnimatedText 
                                            text={currentAsset.kicker} 
                                            speed={0.1}
                                            kineticState={kineticState}
                                            triggerKey={`kicker-${playTriggerId}`}
                                            m={m}
                                            style={{
                                                fontFamily: 'var(--fSerif)', fontSize: spec.fontKicker,
                                                lineHeight: 1.2, fontStyle: 'italic', color: m.text1,
                                                fontWeight: Math.max(400, Math.round(900 - (mc * 500))),
                                                transition: 'font-weight 0.3s ease',
                                                marginBottom: 'var(--space-md)'
                                            }}
                                        />
                                        {currentAsset.body && (
                                            <AnimatedText
                                                text={currentAsset.body}
                                                delayOffset={(currentAsset.kicker.split(' ').length * 0.1) + 0.4}
                                                speed={0.05}
                                                kineticState={kineticState}
                                                triggerKey={`body-${playTriggerId}`}
                                                m={m}
                                                style={{
                                                    fontFamily: "'Atkinson Hyperlegible', sans-serif",
                                                    fontSize: spec.fontBody, lineHeight: 1.7, color: m.text2,
                                                    fontStyle: 'normal', textAlign: 'center',
                                                    padding: '0 1rem', letterSpacing: '0.01em'
                                                }}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : activeCategory === 'reviews' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 1.5rem', width: '100%' }}>
                                {/* Big glowing gold quote mark */}
                                <div style={{ 
                                    fontFamily: 'var(--fSerif)', fontSize: '5.5rem', lineHeight: '1', color: m.accent, 
                                    opacity: 0.25, height: '2rem', marginBottom: '1rem',
                                    textShadow: `0 0 15px ${m.accent}40`
                                }}>“</div>
                                
                                {/* Testimonial Body Quote */}
                                <AnimatedText
                                    text={currentAsset.body}
                                    speed={0.04}
                                    kineticState={kineticState}
                                    triggerKey={`review-${playTriggerId}`}
                                    m={m}
                                    style={{
                                        fontFamily: "'Atkinson Hyperlegible', sans-serif",
                                        fontSize: spec.fontBody, lineHeight: 1.85, color: m.text1,
                                        fontStyle: 'normal', textAlign: 'center', marginBottom: '1.5rem',
                                        letterSpacing: '0.01em'
                                    }}
                                />
                                
                                {/* Five-Star Constellation */}
                                <div style={{ 
                                    fontFamily: 'var(--fMono)', fontSize: '0.75rem', letterSpacing: '0.4em', 
                                    color: m.accent, opacity: 0.85, marginBottom: '0.5rem',
                                    textShadow: `0 0 8px ${m.accent}30`
                                }}>
                                    ★ ★ ★ ★ ★
                                </div>
                                
                                {/* Elegant Kicker Attribution */}
                                <div style={{ 
                                    fontFamily: 'var(--fMono)', fontSize: '0.6rem', letterSpacing: '0.2em', 
                                    color: m.text2, textTransform: 'uppercase', opacity: 0.75
                                }}>
                                    :: {currentAsset.kicker}
                                </div>
                            </div>
                        ) : (
                            <>
                                <AnimatedText
                                    text={currentAsset.kicker}
                                    speed={0.1}
                                    kineticState={kineticState}
                                    triggerKey={`kicker-${playTriggerId}`}
                                    m={m}
                                    style={{
                                        fontFamily: 'var(--fSerif)', fontSize: spec.fontKicker,
                                        lineHeight: 1.2, fontStyle: 'italic', color: m.text1,
                                        fontWeight: Math.max(400, Math.round(900 - (mc * 500))),
                                        transition: 'font-weight 0.3s ease',
                                        marginBottom: currentAsset.body ? 'var(--space-lg)' : '0px'
                                    }}
                                />
                                {currentAsset.body && (
                                    <AnimatedText
                                        text={currentAsset.body}
                                        delayOffset={(currentAsset.kicker.split(' ').length * 0.1) + 0.4}
                                        speed={0.05}
                                        kineticState={kineticState}
                                        triggerKey={`body-${playTriggerId}`}
                                        m={m}
                                        style={{
                                            fontFamily: "'Atkinson Hyperlegible', sans-serif",
                                            fontSize: spec.fontBody,
                                            lineHeight: isPoem ? 1.9 : 1.75,
                                            color: m.text2, fontStyle: 'normal',
                                            textAlign: isPoem ? 'left' : 'center',
                                            padding: isPoem ? '0 0.5rem' : '0 1rem',
                                            letterSpacing: '0.015em'
                                        }}
                                    />
                                )}
                            </>
                        )}
                    </div>

                    {/* Artful Elevated Branding Footer (High-Prominence URL Priority) */}
                    <div style={{
                        flexShrink: 0, paddingTop: spec.mechMargin,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                        width: '100%', zIndex: 5
                    }}>
                        {/* Elegant Geometric/Organic Divider */}
                        <div style={{ display: 'flex', alignItems: 'center', width: '70%', gap: '12px', opacity: 0.75 }}>
                            <div style={{ flex: 1, height: '1px', background: `linear-gradient(to right, transparent, ${m.accent}, transparent)` }} />
                            <svg width="18" height="18" viewBox="0 0 100 100" style={{ fill: 'none', stroke: m.accent, strokeWidth: 8 }}>
                                <path d="M 50 85 C 20 70, 20 40, 60 20 C 80 40, 80 70, 50 85 Z" fill={`${m.accent}15`} stroke={m.accent} strokeWidth="6" />
                                <path d="M 50 80 Q 48 55 58 25" stroke={m.accent} strokeWidth="3" />
                            </svg>
                            <div style={{ flex: 1, height: '1px', background: `linear-gradient(to right, transparent, ${m.accent}, transparent)` }} />
                        </div>
                        
                        {/* High-Visibility Brand URL */}
                        <a 
                            href="https://creativesteeping.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                                fontFamily: 'var(--fMono)', fontSize: '0.75rem', letterSpacing: '0.35em',
                                color: '#ffffff', textDecoration: 'none', textTransform: 'uppercase',
                                textShadow: `0 0 12px ${m.accent}60`, transition: 'all 0.4s ease',
                                opacity: 0.95, fontWeight: 'bold'
                            }}
                            onMouseEnter={(e) => e.target.style.color = m.accent}
                            onMouseLeave={(e) => e.target.style.color = '#ffffff'}
                        >
                            CREATIVESTEEPING.COM
                        </a>
                        
                        {/* Subtle Diagnostic Coordinates & Audio Telemetry Overlay */}
                        <div style={{
                            fontFamily: 'var(--fMono)', fontSize: '0.45rem', letterSpacing: '0.15em',
                            color: m.accent, opacity: 0.45, textTransform: 'uppercase', marginTop: '2px',
                            display: 'flex', flexDirection: 'column', gap: '3px', alignItems: 'center'
                        }}>
                            <div>{coordsText}</div>
                            {kineticState === 'playing' && (
                                <div style={{ display: 'flex', gap: '8px', opacity: 0.8, fontSize: '0.4rem', letterSpacing: '0.1em' }}>
                                    <span>HARS: {Math.round(Math.max(0, Math.pow(Math.cos(mc * Math.PI / 2), 3)) * 100)}%</span>
                                    <span>HBA: {Math.round(Math.max(0, Math.pow(Math.sin(mc * Math.PI), 3)) * 100)}%</span>
                                    <span>VAPR: {Math.round(Math.max(0, Math.pow(Math.sin(mc * Math.PI / 2), 3)) * 100)}%</span>
                                </div>
                            )}
                        </div>
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
