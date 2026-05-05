import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

export const SteamSansEngine = ({ m }) => {
    const [coords, setCoords] = useState({
        STBL: 95,
        PRSS: 10,
        COHR: 98,
        DRFT: 2
    });
    
    const [isPlaying, setIsPlaying] = useState(false);

    // Audio Refs
    const harrisRef = useRef(null);
    const hbaRef = useRef(null);
    const vaporRef = useRef(null);

    // Master Coordinate (0 = HARRIS, 1 = VAPOR)
    const mc = Math.max(0, Math.min(1, ((100 - coords.STBL) + coords.DRFT) / 200));

    // Derived Typography Physics
    const currentWeight = 900 - (mc * 600); // 900 -> 300
    const currentOpacity = 1.0 - (mc * 0.55); // 1.0 -> 0.45
    const currentTracking = 0.05 + (mc * 0.1); // 0.05 -> 0.15
    const currentBlur = mc * 1.5; // 0 -> 1.5px

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

    const handleSlider = (e, key) => {
        setCoords(prev => ({ ...prev, [key]: parseInt(e.target.value) }));
    };

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
        <div style={{
            width: '100%', 
            padding: 'var(--space-xl) clamp(1rem, 5vw, 4rem)',
            border: `1px solid ${m.accent}30`,
            background: `linear-gradient(180deg, ${m.bg} 0%, ${m.accent}05 100%)`,
            position: 'relative',
            overflow: 'hidden',
            boxSizing: 'border-box',
            marginBottom: 'var(--space-xxl)'
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
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <span>[ STEAM SANS × SONNET ENGINE ]</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ opacity: 0.6 }}>LIVE BIOFEEDBACK INSTALLATION</span>
                    <button 
                        onClick={toggleAudio}
                        style={{
                            background: 'none', border: `1px solid ${m.accent}40`,
                            color: m.accent, padding: '4px 8px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '4px'
                        }}
                    >
                        {isPlaying ? <Volume2 size={14} /> : <VolumeX size={14} />}
                        {isPlaying ? 'MUTE SONNET' : 'ACTIVATE SONNET'}
                    </button>
                </div>
            </div>

            {/* The Live Text Area */}
            <div style={{
                height: '25vh', display: 'flex', flexDirection: 'column', 
                justifyContent: 'center', alignItems: 'center', position: 'relative'
            }}>
                <motion.div 
                    animate={{
                        fontWeight: currentWeight,
                        opacity: currentOpacity,
                        letterSpacing: `${currentTracking}em`,
                        filter: `blur(${currentBlur}px)`,
                        color: mc > 0.65 ? m.text2 : (mc > 0.35 ? m.accent : m.text1)
                    }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.8 }}
                    style={{
                        fontFamily: 'var(--fSerif)',
                        fontSize: 'clamp(2rem, 4vw, 4rem)',
                        textTransform: 'uppercase',
                        textAlign: 'center',
                        lineHeight: 1.2
                    }}
                >
                    SIGNAL ∴ BREATH ∴ SILENCE
                </motion.div>

                {/* Register Indicator & OWL Inquiry */}
                <div style={{
                    marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textAlign: 'center'
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

            {/* The Control Panel */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '2rem', marginTop: 'var(--space-xl)', borderTop: `1px solid ${m.accent}20`,
                paddingTop: 'var(--space-xl)'
            }}>
                <SliderControl 
                    label="STBL · STABILITY" question="How grounded do you feel right now?"
                    value={coords.STBL} m={m} onChange={(e) => handleSlider(e, 'STBL')} 
                />
                <SliderControl 
                    label="PRSS · PRESSURE" question="What are you holding that has weight?"
                    value={coords.PRSS} m={m} onChange={(e) => handleSlider(e, 'PRSS')} 
                />
                <SliderControl 
                    label="COHR · COHERENCE" question="How close to your own life?"
                    value={coords.COHR} m={m} onChange={(e) => handleSlider(e, 'COHR')} 
                />
                <SliderControl 
                    label="DRFT · DRIFT" question="How far are you from where you are going?"
                    value={coords.DRFT} m={m} onChange={(e) => handleSlider(e, 'DRFT')} 
                />
            </div>
        </div>
    );
};

const SliderControl = ({ label, question, value, m, onChange }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontFamily: 'var(--fMono)', fontSize: '0.75rem', color: m.accent, letterSpacing: '0.15em' }}>{label}</span>
            <span style={{ fontFamily: 'var(--fMono)', fontSize: '0.8rem', color: m.text1 }}>{value}</span>
        </div>
        <div style={{ fontFamily: 'var(--fBody)', fontSize: '0.8rem', color: m.text2, fontStyle: 'italic', opacity: 0.8 }}>
            {question}
        </div>
        <input 
            type="range" min="0" max="100" value={value} onChange={onChange}
            style={{
                width: '100%', cursor: 'pointer', appearance: 'none',
                height: '2px', background: `${m.accent}40`, outline: 'none',
                marginTop: '0.5rem'
            }}
        />
    </div>
);
