import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ==========================================
// THE LEGACY SCREENGRAB PORTAL
// A private CMS for generating Social Media Geometry
// ==========================================

export const LegacyScreengrabPortal = ({ m, onClose, playStrikingBowl, playAlgoraveSynth }) => {
    // Layout geometry state: 'story' (9:16) or 'grid' (1:1 / 4:5)
    const [geometry, setGeometry] = useState('story');
    
    // Active asset category
    const [activeCategory, setActiveCategory] = useState('clinical'); // 'clinical', 'primer', 'somatic'

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

    // The Content Manifest (Distilled from The Primer & Sound of Becoming)
    const assets = {
        clinical: [
            {
                id: 'c1',
                kicker: 'THE SOUND OF BECOMING',
                body: 'When you write and hear your writing as music simultaneously, you are engaging more neural territory than any other single human activity. This is not poetry. This is what fMRI shows.',
                mechanism: 'MECHANISM 01 :: FULL-BRAIN ACTIVATION',
                color: m.accent
            },
            {
                id: 'c2',
                kicker: 'CREATIVE APHASIA',
                body: 'For practitioners who feel creatively blocked, The Steeping Space offers a Swiss Army knife route — the music circuit opened when the writing circuit feels frozen. Sound before language. Hearing before knowing.',
                mechanism: 'MECHANISM 05 :: NEURAL REDUNDANCY',
                color: m.text1
            }
        ],
        primer: [
            {
                id: 'p1',
                kicker: 'AFFIRMATIVE ARCHITECTURE',
                body: 'Structure precedes visibility. Speak the architecture you wish the practitioner to inhabit.',
                mechanism: 'THE EDITORIAL PROTOCOL',
                color: m.accent
            },
            {
                id: 'p2',
                kicker: 'THE COUPLET',
                body: 'The arc is the angle of change.\nÅ Discovery Worth Steeping In.',
                mechanism: 'PHYSICS × PRESENCE',
                color: m.text1
            }
        ]
    };

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
                
                <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                    <button onClick={() => setGeometry('story')} style={{
                        background: geometry === 'story' ? m.accent : 'transparent',
                        color: geometry === 'story' ? m.bg : m.accent,
                        border: `1px solid ${m.accent}`, padding: '4px 12px',
                        fontFamily: 'var(--fMono)', fontSize: '0.65rem', cursor: 'pointer'
                    }}>9:16 STORY</button>
                    
                    <button onClick={() => setGeometry('grid')} style={{
                        background: geometry === 'grid' ? m.accent : 'transparent',
                        color: geometry === 'grid' ? m.bg : m.accent,
                        border: `1px solid ${m.accent}`, padding: '4px 12px',
                        fontFamily: 'var(--fMono)', fontSize: '0.65rem', cursor: 'pointer'
                    }}>1:1 GRID</button>
                    
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
                        width: geometry === 'story' ? '390px' : '500px', // iPhone dimensions vs Grid
                        height: geometry === 'story' ? '844px' : '500px',
                        background: m.bg,
                        border: `1px solid ${m.accent}20`,
                        position: 'relative',
                        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                        padding: 'var(--space-xl)',
                        boxShadow: `0 20px 40px rgba(0,0,0,0.5)`,
                        overflow: 'hidden'
                    }}
                >
                    {/* The Built-in Watermark */}
                    <div style={{
                        position: 'absolute', bottom: 'var(--space-lg)',
                        fontFamily: 'var(--fMono)', fontSize: '0.55rem', letterSpacing: '0.25em',
                        color: m.accent, opacity: 0.6, textTransform: 'uppercase'
                    }}>
                        CREÅTIVESTEEPING.COM
                    </div>

                    {/* Temporary Asset Display for architecture test */}
                    <div style={{ textAlign: 'center', zIndex: 2 }}>
                        <div style={{ 
                            fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.accent, 
                            letterSpacing: '0.2em', marginBottom: 'var(--space-lg)' 
                        }}>
                            {assets.clinical[0].mechanism}
                        </div>
                        <h2 style={{ 
                            fontFamily: 'var(--fSerif)', fontSize: geometry === 'story' ? '2.2rem' : '2.5rem', 
                            lineHeight: 1.3, fontStyle: 'italic', color: m.text1,
                            marginBottom: 'var(--space-xl)'
                        }}>
                            {assets.clinical[0].kicker}
                        </h2>
                        <div style={{ 
                            fontFamily: 'var(--fBody)', fontSize: '1.2rem', lineHeight: 1.6, color: m.text2 
                        }}>
                            {assets.clinical[0].body}
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
