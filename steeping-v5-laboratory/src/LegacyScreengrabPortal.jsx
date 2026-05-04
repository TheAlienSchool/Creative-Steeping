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
            
        </div>
    );
};
