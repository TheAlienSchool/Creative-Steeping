import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Volume2, VolumeX, ExternalLink, Activity } from 'lucide-react';

export const SteamSansEngine = ({ m }) => {
    const [coords, setCoords] = useState({
        STBL: 95,
        PRSS: 10,
        COHR: 98,
        DRFT: 2
    });
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [mc, setMc] = useState(0); // Master Coordinate (0 = HARRIS, 1 = VAPOR)

    // Audio Refs
    const harrisRef = useRef(null);
    const hbaRef = useRef(null);
    const vaporRef = useRef(null);
    const engineRef = useRef(null);

    // Browser Geometry tracking
    useEffect(() => {
        const handleInteraction = (e) => {
            if (!engineRef.current) return;
            const rect = engineRef.current.getBoundingClientRect();
            // Calculate center of the engine box
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            
            // Client coordinates (mouse or touch)
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            const dx = Math.abs(clientX - cx);
            const dy = Math.abs(clientY - cy);
            
            // Normalize distance relative to browser size (responsive)
            const maxDx = window.innerWidth / 2;
            const maxDy = window.innerHeight / 2;
            
            const normX = Math.min(1, dx / maxDx);
            const normY = Math.min(1, dy / maxDy);
            
            // The further from center, the closer to VAPOR
            const distance = Math.min(1, Math.sqrt(normX * normX + normY * normY) * 1.2);
            
            setMc(distance);
            
            // Update visual telemetry readouts
            setCoords({
                STBL: Math.round(100 - (distance * 100)),
                PRSS: Math.round(distance * 100),
                COHR: Math.round(100 - (normX * 100)),
                DRFT: Math.round(normY * 100)
            });
        };

        window.addEventListener('mousemove', handleInteraction);
        window.addEventListener('touchmove', handleInteraction);
        return () => {
            window.removeEventListener('mousemove', handleInteraction);
            window.removeEventListener('touchmove', handleInteraction);
        };
    }, []);

    // Derived Typography Physics
    const currentWeight = 900 - (mc * 600); // 900 -> 300
    const currentOpacity = 1.0 - (mc * 0.55); // 1.0 -> 0.45
    const currentTracking = 0.05 + (mc * 0.1); // 0.05 -> 0.15
    const vaporGlow = mc > 0.5 ? `0 0 ${mc * 40}px rgba(10, 150, 255, ${mc * 0.8})` : 'none';

    // Determine current named register for the UI readout
    let registerName = "HARRIS";
    if (mc > 0.35 && mc < 0.65) registerName = "HBA";
    if (mc >= 0.65) registerName = "VAPOR";

    // Audio Crossfading Math
    useEffect(() => {
        if (!harrisRef.current || !hbaRef.current || !vaporRef.current) return;
        
        const harrisVol = Math.max(0, 1 - (mc * 2));
        const hbaVol = Math.max(0, 1 - Math.abs(mc - 0.5) * 2);
        const vaporVol = Math.max(0, (mc - 0.5) * 2);

        harrisRef.current.volume = isPlaying ? harrisVol : 0;
        hbaRef.current.volume = isPlaying ? hbaVol : 0;
        vaporRef.current.volume = isPlaying ? vaporVol : 0;
    }, [mc, isPlaying]);

    const toggleAudio = () => {
        if (!isPlaying) {
            harrisRef.current?.play().catch(e => console.log("Audio play blocked", e));
            hbaRef.current?.play().catch(e => console.log("Audio play blocked", e));
            vaporRef.current?.play().catch(e => console.log("Audio play blocked", e));
            setIsPlaying(true);
        } else {
            harrisRef.current?.pause();
            hbaRef.current?.pause();
            vaporRef.current?.pause();
            setIsPlaying(false);
        }
    };

    return (
        <div ref={engineRef} style={{
            width: '100%', 
            padding: 'var(--space-xl) clamp(1rem, 5vw, 4rem)',
            border: `1px solid ${m.accent}30`,
            background: `radial-gradient(circle at 50% 50%, transparent 0%, rgba(5, 20, 45, ${mc * 0.3}) 100%)`,
            position: 'relative',
            overflow: 'hidden',
            boxSizing: 'border-box',
            marginBottom: 'var(--space-xxl)',
            transition: 'background 0.5s ease'
        }}>
            {/* Hidden Audio Elements */}
            <audio ref={harrisRef} src={`${import.meta.env.BASE_URL}assets/audio/steamsans/LAYER_01_HARRIS_REGISTER.mp3`} loop />
            <audio ref={hbaRef} src={`${import.meta.env.BASE_URL}assets/audio/steamsans/LAYER_02_HBA_REGISTER.mp3`} loop />
            <audio ref={vaporRef} src={`${import.meta.env.BASE_URL}assets/audio/steamsans/LAYER_03_VAPOR_REGISTER.mp3`} loop />

            {/* Header */}
            <div style={{
                fontFamily: 'var(--fMono)', fontSize: '0.8rem', color: m.accent, 
                letterSpacing: '0.25em', marginBottom: 'var(--space-xl)',
                borderBottom: `1px dashed ${m.accent}40`, paddingBottom: '1rem',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap', gap: '1rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <Activity size={16} />
                    <span>[ GEOMETRIC ALGORAVE JUKEBOX ]</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <a href="https://steamsans.live" target="_blank" rel="noopener noreferrer" style={{
                        display: 'flex', alignItems: 'center', gap: '6px', color: m.text1,
                        textDecoration: 'none', borderBottom: `1px solid ${m.text1}`,
                        paddingBottom: '2px', transition: 'all 0.3s ease'
                    }} onMouseEnter={e => e.currentTarget.style.color = m.accent} onMouseLeave={e => e.currentTarget.style.color = m.text1}>
                        <ExternalLink size={12} /> ENTER THE PROTOTYPE
                    </a>
                    <button 
                        onClick={toggleAudio}
                        style={{
                            background: isPlaying ? m.accent : 'none', 
                            border: `1px solid ${m.accent}`,
                            color: isPlaying ? m.bg : m.accent, 
                            padding: '6px 12px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px',
                            fontFamily: 'var(--fMono)', fontSize: '0.7rem', letterSpacing: '0.15em',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {isPlaying ? <Volume2 size={14} /> : <VolumeX size={14} />}
                        {isPlaying ? 'MUTE SONNET' : 'ACTIVATE SONNET'}
                    </button>
                </div>
            </div>

            {/* The Live Text Area */}
            <div style={{
                height: '35vh', display: 'flex', flexDirection: 'column', 
                justifyContent: 'center', alignItems: 'center', position: 'relative'
            }}>
                <motion.div 
                    animate={{
                        fontWeight: currentWeight,
                        opacity: currentOpacity,
                        letterSpacing: `${currentTracking}em`,
                        textShadow: vaporGlow,
                        color: mc > 0.65 ? m.text2 : (mc > 0.35 ? m.accent : m.text1),
                        y: mc * 15 // Subtle vertical drift
                    }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.1 }}
                    style={{
                        fontFamily: 'var(--fSerif)',
                        fontSize: 'clamp(2rem, 4vw, 4rem)',
                        textTransform: 'uppercase',
                        textAlign: 'center',
                        lineHeight: 1.2,
                        cursor: 'crosshair'
                    }}
                >
                    A JOURNEY TO THE ESSENCE
                </motion.div>

                {/* Register Indicator & OWL Inquiry */}
                <div style={{
                    position: 'absolute', bottom: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textAlign: 'center'
                }}>
                    <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.7rem', color: m.accent, letterSpacing: '0.2em', opacity: 0.8 }}>
                        CURRENT STATE: {registerName}
                    </div>
                    <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.55rem', color: m.text2, letterSpacing: '0.15em', opacity: 0.6 }}>
                        WHY ARE WORDS CHANGING STATES? <br/>
                        <span style={{ fontStyle: 'italic', color: m.accent }}>// ÆQ·14: YOU ARE READING YOUR OWN COORDINATES.</span>
                    </div>
                </div>
            </div>

            {/* Read-Only Telemetry Panel */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '2rem', marginTop: 'var(--space-xl)', borderTop: `1px solid ${m.accent}20`,
                paddingTop: 'var(--space-xl)'
            }}>
                <TelemetryReadout label="STBL · STABILITY" value={coords.STBL} m={m} />
                <TelemetryReadout label="PRSS · PRESSURE" value={coords.PRSS} m={m} />
                <TelemetryReadout label="COHR · COHERENCE" value={coords.COHR} m={m} />
                <TelemetryReadout label="DRFT · DRIFT" value={coords.DRFT} m={m} />
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '2rem', fontFamily: 'var(--fMono)', fontSize: '0.6rem', color: m.text2, opacity: 0.5, letterSpacing: '0.2em' }}>
                HOVER TO EXPLORE THE SPATIAL GEOMETRY
            </div>
        </div>
    );
};

const TelemetryReadout = ({ label, value, m }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', borderLeft: `1px solid ${m.accent}30`, paddingLeft: '1rem' }}>
        <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.accent, letterSpacing: '0.15em', opacity: 0.8 }}>
            {label}
        </div>
        <div style={{ fontFamily: 'var(--fMono)', fontSize: '1.4rem', color: m.text1 }}>
            {value}<span style={{ fontSize: '0.8rem', opacity: 0.5 }}>%</span>
        </div>
        <div style={{
            width: '100%', height: '2px', background: `${m.accent}20`,
            position: 'relative'
        }}>
            <motion.div 
                animate={{ width: `${value}%` }}
                transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
                style={{ position: 'absolute', left: 0, top: 0, height: '100%', background: m.accent }}
            />
        </div>
    </div>
);
