import React, { useState, useEffect } from 'react';

// A sophisticated Tetrahedron Modular Synth UI mapping to 4 Steeperverse elements
export function SubterraneanBay({ onClose, eqParams, setEqParams }) {
    // Sliders: 0.0 to 1.0
    const handleParamChange = (key, value) => {
        setEqParams(prev => ({ ...prev, [key]: parseFloat(value) }));
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: '#020005', zIndex: 9999, overflow: 'hidden',
            display: 'flex', flexDirection: 'column', color: '#fff',
            fontFamily: 'var(--fMono, monospace)'
        }}>
            {/* Cinematic Seascape Modular Background */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: 'radial-gradient(circle at 50% 120%, rgba(20,5,30,1) 0%, rgba(2,0,5,1) 100%)',
                opacity: 0.8, pointerEvents: 'none', zIndex: 0
            }}>
                {/* Simulated Glowing Patch Cables */}
                <svg width="100%" height="100%" style={{ filter: 'blur(2px) drop-shadow(0 0 10px rgba(255,0,255,0.4))' }}>
                    <path d="M 10 900 C 300 100, 600 600, 1900 200" fill="none" stroke="rgba(0, 255, 200, 0.15)" strokeWidth="3" />
                    <path d="M -100 500 C 400 900, 800 200, 1500 800" fill="none" stroke="rgba(255, 0, 100, 0.15)" strokeWidth="2" />
                    <path d="M 200 100 C 600 800, 1200 100, 2000 600" fill="none" stroke="rgba(255, 200, 0, 0.1)" strokeWidth="4" />
                </svg>
            </div>

            <div style={{ position: 'relative', zIndex: 10, padding: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '2rem', letterSpacing: '0.4em', color: '#fff', textShadow: '0 0 20px rgba(255,255,255,0.5)' }}>[ NODE 07: SUBTERRANEAN EQ ]</h1>
                    <div style={{ marginTop: '0.5rem', opacity: 0.5, fontSize: '0.8rem', letterSpacing: '0.1em' }}>TETRAHEDRAL TEXTURE AMPLIFIER // EURORACK C-7</div>
                </div>
                <button 
                    onClick={onClose}
                    style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '0.5rem 1.5rem', cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.2em' }}
                >
                    [ DISCONNECT ]
                </button>
            </div>

            <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3vw' }}>
                <ModularNode title="ENDOGEN SOIL" sub="Friction / Brown Noise" value={eqParams.friction} onChange={(v) => handleParamChange('friction', v)} color="#ff3366" />
                <ModularNode title="TOWHEE AVIAN" sub="Minute Trill Complexity" value={eqParams.avian} onChange={(v) => handleParamChange('avian', v)} color="#33ffcc" />
                <ModularNode title="KINETIC SNAP" sub="Keystroke Microsound" value={eqParams.crackle} onChange={(v) => handleParamChange('crackle', v)} color="#ffcc00" />
                <ModularNode title="SUB-DRONE" sub="Foundation Weight" value={eqParams.drone} onChange={(v) => handleParamChange('drone', v)} color="#9933ff" />
            </div>
            
            <div style={{ position: 'absolute', bottom: '2rem', width: '100%', textAlign: 'center', opacity: 0.3, letterSpacing: '0.2em', fontSize: '0.7rem' }}>
                ROUTING ESTABLISHED: OMNIDIRECTIONAL SEASCAPE HARMONICS CAPTURED
            </div>
        </div>
    );
}

function ModularNode({ title, sub, value, onChange, color }) {
    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: '16vw', minWidth: '180px', height: '50vh', background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', padding: '2rem 1rem',
            boxShadow: `inset 0 0 40px ${color}10, 0 8px 32px rgba(0,0,0,0.5)`, position: 'relative'
        }}>
            {/* Top LED Indicator */}
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: value > 0.05 ? color : '#333', boxShadow: value > 0.05 ? `0 0 15px ${color}, 0 0 5px ${color}` : 'none', marginBottom: '2rem', transition: 'all 0.1s' }} />

            <div style={{ flex: 1, display: 'flex', position: 'relative', width: '4px', background: '#222', borderRadius: '2px', alignItems: 'center', justifyContent: 'center' }}>
                {/* The Track Fill */}
                <div style={{ position: 'absolute', bottom: 0, width: '100%', height: `${value * 100}%`, background: color, boxShadow: `0 0 20px ${color}` }} />
                
                {/* The Slider Input */}
                <input 
                    type="range" min="0" max="1" step="0.01" value={value}
                    onChange={(e) => onChange(e.target.value)}
                    style={{
                        WebkitAppearance: 'slider-vertical',
                        width: '40px', height: '100%', position: 'absolute', cursor: 'grab',
                        background: 'transparent', outline: 'none'
                    }}
                />
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold', letterSpacing: '0.2em', fontSize: '0.9rem', color: '#fff', textShadow: `0 0 10px ${color}` }}>{title}</div>
                <div style={{ fontSize: '0.65rem', opacity: 0.5, marginTop: '0.5rem', letterSpacing: '0.05em' }}>{sub}</div>
                <div style={{ fontSize: '0.8rem', color: color, marginTop: '1rem', fontFamily: 'monospace' }}>{(value * 100).toFixed(0)}%</div>
            </div>
        </div>
    );
}
