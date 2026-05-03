import React, { useRef, useState, useEffect, useCallback } from 'react';

// ==========================================
// THE HEXAGONG : INSTRUMENTAL VESSEL
// ==========================================
// A parallel dimension inside the Steeperverse.
// When a Steepee types, the keystrokes trigger the Algorave Synth.
// fire based on the kinetic energy of their input.

import { motion, AnimatePresence, useMotionValue, useTransform, useMotionTemplate } from 'framer-motion';
import { EMERGENT_EVENTS } from './SteeperverseAnomalies.js';

const QUANTUM_INQUIRIES = [
    "What obsolete version of yourself is begging for a final verdict?",
    "Hold your heaviest criticism to the light. Does it cast a shadow, or dissolve?",
    "The gavel falls on your past. Are you ready to pardon the prisoner?",
    "Before we step into the expanse, what weight must be buried here?",
    "Judge yourself not by your failures, but by the courage it took to survive them.",
    "The court of your own mind is adjourning. What is the final ruling on your worth?",
    "Lay bare the architecture of your regret, and then watch it shatter.",
    "A final criticism: were you too cruel to the vessel that carried you here?",
    "Leave the ghosts of your former selves on the witness stand.",
    "The sentence is served. The cage is open. Why do you linger inside?",
    "Measure the distance between who you were and the light you are becoming.",
    "What armor have you worn so long that it began to judge your skin?",
    "Examine your darkest flaw. Now, forgive it completely.",
    "The final judgement asks only one question: Did you learn how to love?",
    "Burn the ledger of your mistakes. The math of the future relies on empty pages.",
    "What version of your ego must be dismantled before the real journey begins?",
    "Stand before your own reflection and decree a final, radical amnesty.",
    "If this is the last judgement, let the verdict be terrifyingly merciful.",
    "Shed the skin of your critics. Only your barest frequency can pass through.",
    "The past is a closed case. The future is an unwritten law of light and space."
];

const VIDEO_LAYERS = [
    `${import.meta.env.BASE_URL}assets/videos/creation_2.mp4`,
    `${import.meta.env.BASE_URL}assets/videos/archetypes.mp4`,
    `${import.meta.env.BASE_URL}assets/videos/creation_1.mp4`,
    `${import.meta.env.BASE_URL}assets/videos/creation_3.mp4`
];

// ----------------------------------------------------
// THE SILHOUETTE FLUID PARTICLE (Pure Canvas Engine)
// ----------------------------------------------------
class SilhouetteLetter {
    constructor(char, x, y) {
        // Fold in Bauhausian/Brutalist all-caps probability
        this.char = Math.random() > 0.4 ? char.toUpperCase() : char;
        this.x = x;
        this.y = y;
        
        this.life = 1.0; 
        this.decay = 0.003 + Math.random() * 0.002; // Faster decay for less crowding
        
        this.size = 14 + Math.random() * 20; // Drastically smaller, elegant typography 
        this.angle = (Math.random() - 0.5) * Math.PI;
        this.spin = (Math.random() - 0.5) * 0.02; 
        
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        
        const fonts = [
            '"Playfair Display", serif',              // Classic Serif
            '"DM Mono", monospace',                   // Technical Mono
            'Impact, "Arial Black", sans-serif',      // Brutalist Heavy
            '"Futura", "Helvetica", sans-serif'       // Bauhausian Geometric
        ];
        this.font = fonts[Math.floor(Math.random() * fonts.length)];
        this.weight = Math.random() > 0.5 ? '900' : '400';
    }

    update(time, canvasWidth, canvasHeight) {
        const scale = 0.002; 
        const timeScale = 0.0003; 
        
        const fieldAngle = Math.sin(this.x * scale + time * timeScale) * 
                           Math.cos(this.y * scale + time * timeScale) * 
                           Math.PI * 4;

        this.vx += Math.cos(fieldAngle) * 0.06;
        this.vy += Math.sin(fieldAngle) * 0.06;

        this.vx *= 0.97;
        this.vy *= 0.97;
        this.vy -= 0.015;

        this.x += this.vx;
        this.y += this.vy;
        
        this.angle += (this.vx + this.vy) * 0.005 + this.spin;
        this.life -= this.decay;
        this.size += Math.sin(this.life * Math.PI) * 0.05; // Minor optical bloom rather than huge growth
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        ctx.font = `italic ${this.weight} ${this.size}px ${this.font}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const alpha = Math.max(0, this.life);
        
        ctx.globalCompositeOperation = 'source-over';
        ctx.shadowBlur = 12;
        ctx.shadowColor = `rgba(255, 255, 255, ${alpha * 0.4})`;
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.9})`;
        ctx.fillText(this.char, 0, 0);

        ctx.shadowBlur = 0; 
        ctx.globalCompositeOperation = 'screen';
        ctx.lineWidth = 0.5 + Math.sin(this.life * Math.PI) * 1.5; 
        ctx.strokeStyle = `rgba(220, 230, 255, ${alpha * 0.65})`; 
        ctx.strokeText(this.char, 0, 0);

        ctx.restore();
    }
}

export function Hexagong({ vesselData, modeString, playAlgoraveSynth, onExit }) {
    const inputRef = useRef(null);
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const typeLogRef = useRef(null);
    const typedBufferRef = useRef("");
    
    const [cosmicEvent, setCosmicEvent] = useState(null);
    const lunar = useMotionValue(0); 
    const [inquiryIndex, setInquiryIndex] = useState(0);
    const kineticEnergyRef = useRef(0);
    const [yieldText, setYieldText] = useState(0);

    const MODES = {
        incandescent: { accent: "#d4922a", text1: "#fff0d9" },
        oceanic: { accent: "#38bdf8", text1: "#e0f2fe" },
        emergent: { accent: "#e5e5e5", text1: "#ffffff" },
        planetary: { accent: "#ff00ff", text1: "#ffffff" } // Proper neon magenta for Planetary
    };
    const m = MODES[modeString] || MODES.incandescent;

    // Cycle quantum inquiries (30 seconds per prompt)
    useEffect(() => {
        const interval = setInterval(() => {
            setInquiryIndex(prev => (prev + 1) % QUANTUM_INQUIRIES.length);
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    // Canvas Rendering Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        let time = 0;
        let animationFrameId;

        let width = canvas.offsetWidth;
        let height = canvas.offsetHeight;

        const resize = () => {
            width = canvas.offsetWidth;
            height = canvas.offsetHeight;
            canvas.width = width * window.devicePixelRatio;
            canvas.height = height * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };
        
        window.addEventListener('resize', resize);
        resize();

        const render = () => {
            // Fade the trails over a perfectly transparent background
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'; // 8% fade per frame (faster clean up of trails)
            ctx.fillRect(0, 0, width, height);

            for (let i = particlesRef.current.length - 1; i >= 0; i--) {
                const p = particlesRef.current[i];
                p.update(time, width, height);
                p.draw(ctx);
                if (p.life <= 0) particlesRef.current.splice(i, 1);
            }

            time += 16;
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // Decay the kinetic energy over time & drive Lunar Eclipse on the GPU layer
    useEffect(() => {
        let lastTextUpdate = 0;
        const interval = setInterval(() => {
            const currentEnergy = kineticEnergyRef.current;
            const targetIllumination = Math.min(100, (currentEnergy / 150) * 100);

            const currentLunar = lunar.get();
            const newLunar = currentLunar + (targetIllumination - currentLunar) * 0.05;
            lunar.set(newLunar);
            
            const now = Date.now();
            if (now - lastTextUpdate > 500) {
                setYieldText(Math.floor(newLunar));
                lastTextUpdate = now;
            }

            kineticEnergyRef.current = Math.max(0, currentEnergy - 2);
        }, 100);
        return () => clearInterval(interval);
    }, [lunar]);

    // Container Transform Templates
    const scaleZ2 = useTransform(lunar, [0, 100], [1, 1.016]);
    const glowRad1 = useTransform(lunar, [0, 100], [0, 150]);
    const glowAlpha1 = useTransform(lunar, [0, 100], [0, 0.5]);
    const glowRad2 = useTransform(lunar, [0, 100], [0, 250]);
    const glowAlpha2 = useTransform(lunar, [0, 100], [0, 0.33]);
    const boxSZ2 = useMotionTemplate`0 0 ${glowRad1}px rgba(50, 200, 255, ${glowAlpha1}), inset 0 0 ${glowRad2}px rgba(20, 150, 255, ${glowAlpha2})`;

    const warpOpacity = useTransform(lunar, [0, 100], [0.35, 0.95]);
    const warpScale = useTransform(lunar, [0, 100], [1, 2.5]);
    const warpRotate = useTransform(lunar, [0, 100], [0, 20]);
    const warpTransform = useMotionTemplate`scale(${warpScale}) rotate(${warpRotate}deg)`;

    const crucScale = useTransform(lunar, [0, 100], [1, 1.166]);
    const crucY = useTransform(lunar, [0, 100], [50, 83.3]);
    const crucAlpha1 = useTransform(lunar, [0, 100], [0.1, 0.7]);
    const crucAlpha2 = useTransform(lunar, [0, 100], [1, 0]);
    const crucGrad = useMotionTemplate`radial-gradient(circle at 50% ${crucY}%, rgba(255, 200, 100, ${crucAlpha1}), rgba(20, 150, 200, ${crucAlpha2}) 45%, rgba(5, 30, 40, 1) 100%)`;
    
    const subY = useTransform(lunar, [0, 100], [0, -25]);
    const subRot = useTransform(lunar, [0, 100], [0, 100]);
    const subAlpha = useTransform(lunar, [0, 100], [1, 0]);
    const subTransform = useMotionTemplate`translateY(${subY}%) rotate(${subRot}deg)`;

    const yieldBarWidth = useMotionTemplate`${lunar}%`;

    const activeVideo = VIDEO_LAYERS[inquiryIndex % VIDEO_LAYERS.length];

    const triggerCosmicEvent = useCallback(() => {
        const selected = EMERGENT_EVENTS[Math.floor(Math.random() * EMERGENT_EVENTS.length)];
        console.log(`%c[ STEEPERVERSE ] Anomaly Detected: %c${selected.meaning}`, "color: #ff00ff; font-weight: bold;", "color: #00ffff; font-style: italic;");
        setCosmicEvent(selected);
        setTimeout(() => {
            setCosmicEvent(null);
        }, selected.duration);
    }, []);

    const handleKeyDown = useCallback((e) => {
        const keyChar = e.key;

        if (keyChar === 'Escape') {
            onExit();
            return;
        }

        // --- Typing Record Logic for BBB ---
        if (e.key === 'Backspace') {
            typedBufferRef.current = typedBufferRef.current.slice(0, -1);
        } else if (keyChar.length === 1 || e.key === ' ') {
            const char = e.key === ' ' ? '\u00A0' : keyChar;
            typedBufferRef.current += char;
            // Keep it to a clean single line tracking the last ~60 characters smoothly
            if (typedBufferRef.current.length > 70) typedBufferRef.current = typedBufferRef.current.substring(typedBufferRef.current.length - 70);
        } else if (e.key === 'Enter') {
            typedBufferRef.current += ' \u00A0 ';
            if (typedBufferRef.current.length > 70) typedBufferRef.current = typedBufferRef.current.substring(typedBufferRef.current.length - 70);
        }

        if (typeLogRef.current) {
            typeLogRef.current.innerText = typedBufferRef.current;
        }
        // ------------------------------------

        if (keyChar.length !== 1) return;

        if (playAlgoraveSynth) playAlgoraveSynth(e.keyCode, modeString);

        kineticEnergyRef.current += 8;

        // Spawn a new pure-canvas Vector Particle
        if (canvasRef.current) {
            const width = canvasRef.current.offsetWidth;
            const height = canvasRef.current.offsetHeight;
            // Spawn broadly across the screen to avoid tight clustering rings
            const startX = width * 0.1 + Math.random() * width * 0.8;
            const startY = height * 0.1 + Math.random() * height * 0.8;
            particlesRef.current.push(new SilhouetteLetter(keyChar, startX, startY));
        }

        if (kineticEnergyRef.current > 150 && Math.random() > 0.95) {
            triggerCosmicEvent();
            kineticEnergyRef.current = 20;
        }
    }, [playAlgoraveSynth, onExit, triggerCosmicEvent, modeString]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="hexagong-instrument"
            onClick={() => {
                if (inputRef.current) inputRef.current.focus();
            }}
            style={{
                position: 'relative', width: '100%', height: '60vh',
                minHeight: '400px', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                border: `4px dashed ${m.accent}`, padding: '3rem',
                background: 'rgba(0,0,0,0.6)', cursor: 'crosshair',
                boxShadow: boxSZ2,
                scale: scaleZ2,
                perspective: '1000px'
            }}>

            <motion.div style={{
                position: 'fixed', top: '-10%', left: '-10%', width: '120vw', height: '120vh',
                opacity: warpOpacity,
                transformOrigin: 'center center',
                transform: warpTransform,
                pointerEvents: 'none', zIndex: -2,
                willChange: 'transform, opacity',
                overflow: 'hidden'
            }}>
                {modeString !== 'darkMatter' && (
                    <video 
                        key={activeVideo}
                        autoPlay loop muted playsInline 
                        style={{
                            position: 'absolute', top: '50%', left: '50%',
                            width: '100%', height: '100%',
                            objectFit: 'cover',
                            transform: 'translate(-50%, -50%)',
                            filter: 'contrast(1.1) brightness(0.9) saturate(1.2)'
                        }}
                    >
                        <source src={activeVideo} type="video/mp4" />
                    </video>
                )}
            </motion.div>

            {/* <canvas> replaces the Framer Motion array map for rendering performance traces */}
            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    pointerEvents: 'none', zIndex: 5
                }}
            />

            {/* BBB Live Typing Trace has been moved inside the bottom footer ticker */}

            <div style={{ position: 'absolute', top: '2rem', left: '2rem', fontFamily: 'var(--fMono)', fontSize: '1rem', fontWeight: 'bold', color: 'var(--t1)', letterSpacing: '0.2em', zIndex: 10, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span>[ THE HEXAGONG IS LIVE ]</span>
                {cosmicEvent?.type === 'neutrino' && (
                    <span style={{ color: m.accent, fontSize: '0.8rem', animation: 'event-flash 0.5s infinite alternate' }}>⚠ NEUTRINO FLUX ⚠</span>
                )}
            </div>

            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', fontFamily: 'var(--fMono)', fontSize: '0.8rem', color: 'var(--t2)', letterSpacing: '0.2em', zIndex: 10, textAlign: 'right' }}>
                ALCHEMICAL YIELD: {yieldText}µV
                <div style={{ width: '120px', height: '4px', background: 'rgba(255,255,255,0.1)', marginTop: '6px' }}>
                    <motion.div style={{ width: yieldBarWidth, height: '100%', background: m.accent, boxShadow: `0 0 8px ${m.accent}` }} />
                </div>
            </div>

            <input
                ref={inputRef}
                autoFocus
                onKeyDown={handleKeyDown}
                onChange={(e) => { e.target.value = ''; }}
                onBlur={() => {
                    setTimeout(() => { if (inputRef.current) inputRef.current.focus(); }, 10);
                }}
                style={{ position: 'absolute', top: '-100px', left: '-100px', opacity: 0, width: '1px', height: '1px' }}
            />

            <motion.div style={{
                position: 'fixed',
                top: '50%', left: '50%',
                x: '-50%', y: '-50%',
                scale: crucScale,
                width: '100vw', height: '100vh',
                background: crucGrad,
                boxShadow: `inset 0 0 100px rgba(0, 50, 80, 0.9)`,
                zIndex: -1, pointerEvents: 'none',
                opacity: 0.9,
                willChange: 'transform'
            }}>
                <motion.div style={{
                    position: 'absolute', width: '100%', height: '100%',
                    background: 'radial-gradient(circle at center, rgba(0, 20, 40, 0.1) 0%, transparent 100%)',
                    transform: subTransform,
                    opacity: subAlpha,
                }} />
            </motion.div>

            {/* 🌿 THE READING MEMBRANE (Algorave): Ocular protection for poetry over chaotic WebGL */}
            <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: '100%', height: '100%', background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 50%, transparent 80%)',
                pointerEvents: 'none', zIndex: 9, mixBlendMode: 'multiply'
            }} />

            <AnimatePresence mode="wait">
                <motion.h2 
                    key={inquiryIndex} 
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 1.05 }}
                    transition={{ duration: 3, ease: 'easeInOut' }}
                    style={{
                        fontFamily: 'var(--fSerif)', fontSize: 'clamp(1.2rem, 3.2vw, 2.5rem)', fontWeight: 'bold', fontStyle: 'italic', color: m.accent,
                        textShadow: `0 0 24px ${m.accent}80, 0 4px 12px rgba(0,0,0,0.8)`, zIndex: 10, textAlign: 'center',
                        width: '100%', maxWidth: '85%', lineHeight: 1.3, padding: '0 2rem', letterSpacing: '0.05em',
                        pointerEvents: 'none',
                    }}
                >
                    {QUANTUM_INQUIRIES[inquiryIndex]} <br />
                    <span style={{ fontSize: 'clamp(0.8rem, 1.5vw, 1.2rem)', fontWeight: 'bold', fontFamily: 'var(--fMono)', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--t1)', display: 'block', marginTop: '2.5rem', textShadow: 'none' }}>
                        THE LAST JUDGEMENT
                    </span>
                </motion.h2>
            </AnimatePresence>

            <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: '4rem', background: 'rgba(0,0,0,0.85)',
                borderTop: `4px solid ${m.accent}`,
                display: 'flex', alignItems: 'center', overflow: 'hidden',
                zIndex: 20
            }}>
                <div style={{
                    padding: '0 2rem', background: m.accent, color: '#000',
                    height: '100%', display: 'flex', alignItems: 'center',
                    fontFamily: 'var(--fMono)', fontSize: '1rem', fontWeight: 'bold', letterSpacing: '0.15em',
                    position: 'relative', zIndex: 2
                }}>
                    STEEPERVERSE
                </div>
                <div style={{
                    flex: 1, position: 'relative', height: '100%',
                    fontFamily: 'var(--fMono)', fontSize: '0.9rem', color: m.text1, letterSpacing: '0.15em',
                    whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute', left: '100%',
                        animation: cosmicEvent ? `ticker-slide ${cosmicEvent.duration}ms linear forwards` : 'none',
                        display: 'flex', gap: '5rem', alignItems: 'center', minWidth: 'max-content'
                    }}>
                        {cosmicEvent && (
                            <>
                                <span style={{ color: m.accent, fontWeight: 'bold' }}>► {cosmicEvent.display} </span>
                                <span style={{ color: '#ff0f60', opacity: 0.8, letterSpacing: '0.4em' }}>[ DECRYPTING ]</span>
                                <span style={{ color: m.text1, opacity: 0.7 }}>...LAST JUDGEMENT PROTOCOL...</span>
                                <span style={{ color: m.accent, fontWeight: 'bold' }}>► {cosmicEvent.display} </span>
                            </>
                        )}
                    </div>
                    {!cosmicEvent && modeString !== 'planetary' && (
                        <div style={{ paddingLeft: '2rem', opacity: 0.4, animation: 'event-flash 4s infinite alternate' }}>
                            AWAITING COSMIC ANOMALY...
                        </div>
                    )}
                    {!cosmicEvent && modeString === 'planetary' && (
                        <div style={{ paddingLeft: '2rem', color: '#fff', textShadow: `0 0 8px ${m.accent}`, opacity: 0.9, display: 'flex', alignItems: 'center' }}>
                            <span style={{ color: m.accent, marginRight: '1rem', fontWeight: 'bold' }}>► TRANSMIT:</span>
                            <span ref={typeLogRef} style={{ whiteSpace: 'nowrap', letterSpacing: '0.15em' }}></span>
                            <span style={{ animation: 'event-flash 1s infinite', marginLeft: '4px' }}>_</span>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes hexagong-awaken {
                    0% { opacity: 0; transform: scale(0.95); }
                    100% { opacity: 1; transform: scale(1); }
                }
                @keyframes ticker-slide {
                    0% { transform: translateX(50%); }
                    100% { transform: translateX(-350%); }
                }
                @keyframes event-flash {
                    from { opacity: 0.2; }
                    to { opacity: 0.8; }
                }
            `}</style>
        </motion.div>
    );
}

