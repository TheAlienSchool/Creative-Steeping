import React, { useState, useEffect } from 'react';

// The slides configuration for the Wayfinding/Ikea-style manual
const SLIDES = [
    {
        layer: "LAYER 01",
        title: "The Architecture of the Pause",
        subtitle: "The Cognitive Lattice",
        description: "This is a private, resonant instrument for thought. Your depth of attention grows the longer you inhabit these spaces. The more fully you arrive in each vessel, the more your Resonance Imprint accumulates across the practice.",
        diagram: (m) => (
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ position: 'absolute', width: '80%', height: '80%', border: `1px solid ${m.text2}40`, borderStyle: 'dashed' }} />
                <div style={{ position: 'absolute', width: '60%', height: '60%', border: `1px solid ${m.text2}60`, borderRadius: '50%' }} />
                <div style={{ width: '20%', height: '20%', background: m.accent, borderRadius: '50%', boxShadow: `0 0 40px ${m.accent}` }} />
                
                <div style={{ position: 'absolute', left: '10%', top: '20%', fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.accent }}>[01.A] SANCTUARY</div>
                <div style={{ position: 'absolute', right: '10%', bottom: '20%', fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.text2 }}>[01.B] RESONANCE</div>
                
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                    <line x1="20%" y1="20%" x2="50%" y2="50%" stroke={`${m.accent}60`} strokeWidth="1" />
                    <line x1="80%" y1="80%" x2="50%" y2="50%" stroke={`${m.text2}60`} strokeWidth="1" />
                </svg>
            </div>
        )
    },
    {
        layer: "LAYER 02",
        title: "Engaging the Hexagong",
        subtitle: "The Two-Column Architecture",
        description: "When you open a vessel, the screen opens into two spaces. On the left: The Compass — context, coordinates, and The Sage. On the right: your Reflection Field. Read the inquiry. Let the questions land. Write in the space below. When something is ready to be held, it finds its way in.",
        diagram: (m) => (
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10%' }}>
                <div style={{ display: 'flex', width: '100%', height: '100%', gap: '16px' }}>
                    {/* Left Column: Compass & Sage */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ height: '30%', border: `1px solid ${m.text2}40`, borderLeft: `2px solid ${m.text2}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontFamily: 'var(--fMono)', fontSize: '0.5rem', color: m.text2 }}>COMPASS</span>
                        </div>
                        <div style={{ height: '30%', border: `1px dashed ${m.accent}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontFamily: 'var(--fMono)', fontSize: '0.5rem', color: m.accent }}>ASCII ART</span>
                        </div>
                        <div style={{ flex: 1, border: `1px solid ${m.text2}20`, background: `${m.accent}05`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontFamily: 'var(--fMono)', fontSize: '0.5rem', color: m.text2 }}>THE SAGE</span>
                        </div>
                    </div>
                    {/* Right Column: Workbook */}
                    <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ height: '15%', borderBottom: `1px solid ${m.text2}20`, display: 'flex', alignItems: 'center', paddingLeft: '8px' }}>
                            <span style={{ fontFamily: 'var(--fMono)', fontSize: '0.5rem', color: m.accent }}>HERO INVOCATION</span>
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '8px' }}>
                            <div style={{ width: '80%', height: '10px', background: `${m.text2}40` }} />
                            <div style={{ width: '60%', height: '10px', background: `${m.text2}40` }} />
                            <div style={{ width: '90%', height: '24px', background: `${m.text1}80`, marginTop: '8px' }} />
                        </div>
                        <div style={{ height: '35%', borderBottom: `2px solid ${m.text2}40`, background: `${m.surface}40`, position: 'relative' }}>
                            <span style={{ position: 'absolute', bottom: '8px', left: '8px', fontFamily: 'var(--fMono)', fontSize: '0.5rem', color: m.text2 }}>YOUR REFLECTION FIELD</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    {
        layer: "LAYER 03",
        title: "Sonic Awareness",
        subtitle: "Using Sound & Time",
        description: "The space responds to you. Sound and cursor move together — a scored, biometric field. The striking bowl marks recognition, not completion. The global timers (5m, 15m, 22m) open an Active Pause whenever you need one. The Sage's eye opens when it's calculating. You'll feel the difference.",
        diagram: (m) => (
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                    <path d="M 0 50 Q 25 20 50 50 T 100 50 M 0 60 Q 30 80 60 60 T 100 60" vectorEffect="non-scaling-stroke" fill="none" stroke={`${m.text2}40`} strokeWidth="1" />
                    <path d="M 0 40 Q 40 10 70 40 T 100 40" vectorEffect="non-scaling-stroke" fill="none" stroke={`${m.accent}80`} strokeWidth="1.5" />
                </svg>
                <div style={{ position: 'absolute', width: '40px', height: '40px', top: '30%', left: '45%', border: `1px solid ${m.accent}`, borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                <div style={{ position: 'absolute', width: '8px', height: '8px', top: 'calc(30% + 16px)', left: 'calc(45% + 16px)', background: m.accent, borderRadius: '50%' }} />
                
                <div style={{ position: 'absolute', left: '10%', bottom: '10%', fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.accent }}>[03.A] 528HZ TUNING</div>
                <div style={{ position: 'absolute', right: '10%', top: '10%', fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.text2 }}>[03.B] THE EYE OF THE SAGE</div>
            </div>
        )
    }
];

export const WayfindingOverlay = ({ m, onClose, playStrikingBowl, activeVessel }) => {
    // 1. Calculate Historical Depth
    let historicalDepth = 0;
    try {
        historicalDepth = JSON.parse(localStorage.getItem('steeping_historical_score') || '[]').length;
    } catch(e) {}

    // 2. Generate Context-Aware Cartographic Slide
    const contextSlide = {
        layer: "LAYER 00",
        title: "Here is Where You Are",
        subtitle: activeVessel ? `Inside Hexagong ${activeVessel.num}` : "The Matrix Overview",
        description: activeVessel 
            ? `You are inside ${activeVessel.name}. The Steeping Sage on the left holds full context for this vessel. Your reflection field is on the right. Take your time here — the space is patient.`
            : `The Hexagong Matrix. Eight vessels, each a distinct steep. You have held ${historicalDepth} moments so far. The practice builds where you bring your attention.`,
        diagram: (m) => (
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {/* The Radar / Compass */}
                <div style={{ position: 'absolute', width: '70%', height: '70%', border: `1px dashed ${m.text2}40`, borderRadius: '50%', animation: 'spin 30s linear infinite' }}>
                    <div style={{ position: 'absolute', top: '-10px', left: '50%', width: '20px', height: '20px', background: m.accent, borderRadius: '50%', transform: 'translateX(-50%)', boxShadow: `0 0 20px ${m.accent}` }} />
                </div>
                <div style={{ position: 'absolute', width: '50%', height: '50%', border: `1px solid ${m.text2}30`, borderRadius: '50%', animation: 'spin 20s linear infinite reverse' }} />
                
                {/* Crosshairs */}
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                    <line x1="50%" y1="10%" x2="50%" y2="90%" stroke={`${m.accent}60`} strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="10%" y1="50%" x2="90%" y2="50%" stroke={`${m.text2}60`} strokeWidth="1" />
                </svg>
                
                {/* You Are Here Data */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
                    <div style={{ fontFamily: 'var(--fMono)', fontSize: '2.5rem', color: m.accent, textShadow: `0 0 15px ${m.bg}` }}>
                        {activeVessel ? `V.${activeVessel.num}` : `L.${historicalDepth}`}
                    </div>
                </div>
                
                {/* Infographic Labels */}
                <div style={{ position: 'absolute', left: '10%', top: '15%', fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.accent, textTransform: 'uppercase' }}>[00.A] LAT / LONG</div>
                <div style={{ position: 'absolute', right: '10%', bottom: '15%', fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.text2, textTransform: 'uppercase' }}>[00.B] DEPTH = {historicalDepth}</div>
            </div>
        )
    };

    // 3. Ensure the dynamic slide is the first one users see
    const dynamicSlides = [contextSlide, ...SLIDES];

    const [currentSlide, setCurrentSlide] = useState(0);
    const [animating, setAnimating] = useState(false);

    // Initial mount animation
    useEffect(() => {
        if (playStrikingBowl) playStrikingBowl(100); // Grand entrance sound
    }, []);

    const handleNext = () => {
        if (animating) return;
        setAnimating(true);
        if (playStrikingBowl) playStrikingBowl(60);
        setTimeout(() => {
            setCurrentSlide(prev => (prev + 1) % dynamicSlides.length);
            setAnimating(false);
        }, 600);
    };

    const handlePrev = () => {
        if (animating) return;
        setAnimating(true);
        if (playStrikingBowl) playStrikingBowl(50);
        setTimeout(() => {
            setCurrentSlide(prev => (prev - 1 + dynamicSlides.length) % dynamicSlides.length);
            setAnimating(false);
        }, 600);
    };

    const slide = dynamicSlides[currentSlide];

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: m.bg, zIndex: 99999,
            display: 'flex', flexDirection: 'column',
            animation: 'fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            color: m.text1
        }}>
            {/* Top Navigation Bar Component */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: 'var(--space-lg) var(--space-xl)', borderBottom: `1px solid ${m.text2}20`,
                fontFamily: 'var(--fMono)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.2em'
            }}>
                <div style={{ display: 'flex', gap: 'var(--space-xl)', opacity: 0.8 }}>
                    <span>CREÅTIVE STEEPING</span>
                    <span style={{ color: m.accent }}>STRUCTURAL MANUAL / v5.0</span>
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
                    [ CLOSE MANUAL ]
                </button>
            </div>

            {/* Main Content Area: Split 50/50 Diagram and Text */}
            <div style={{
                flex: 1, display: 'flex', minHeight: 0,
                opacity: animating ? 0 : 1, transform: animating ? 'translateY(20px)' : 'translateY(0)',
                transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                
                {/* LEFT: Infographic Diagram */}
                <div style={{
                    flex: 1, borderRight: `1px solid ${m.text2}20`,
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    padding: 'var(--space-xxl)', position: 'relative'
                }}>
                    {/* Architectural Grid Background */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        backgroundImage: `linear-gradient(${m.text2}08 1px, transparent 1px), linear-gradient(90deg, ${m.text2}08 1px, transparent 1px)`,
                        backgroundSize: '40px 40px', zIndex: 0
                    }} />

                    {/* The Diagram rendering for this slide */}
                    <div style={{ width: '100%', maxWidth: '600px', height: '600px', zIndex: 1, border: `1px solid ${m.text2}20`, background: `${m.surface}80`, backdropFilter: 'blur(4px)' }}>
                        {slide.diagram(m)}
                    </div>
                </div>

                {/* RIGHT: Typography and Pedagogy */}
                <div style={{
                    flex: 1, padding: '10%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', overflowY: 'auto'
                }}>
                    <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.8rem', letterSpacing: '0.3em', color: m.accent, marginBottom: 'var(--space-lg)' }}>
                        [ {slide.layer} ]
                    </div>
                    
                    <h1 style={{
                        fontFamily: 'var(--fSerif)', fontSize: 'clamp(3rem, 5vw, 5rem)', fontStyle: 'italic',
                        lineHeight: 1, letterSpacing: '-0.02em', margin: '0 0 var(--space-md) 0', color: m.text1
                    }}>
                        {slide.title}
                    </h1>
                    
                    <div style={{
                        fontFamily: 'var(--fMono)', fontSize: '1rem', letterSpacing: '0.1em',
                        color: m.text1, opacity: 0.8, marginBottom: 'var(--space-xl)', textTransform: 'uppercase',
                        borderBottom: `2px solid ${m.accent}`, paddingBottom: 'var(--space-lg)', display: 'inline-block'
                    }}>
                        {slide.subtitle}
                    </div>
                    
                    <p style={{
                        fontFamily: 'var(--fBody)', fontSize: '1.5rem', lineHeight: 1.8, color: m.text2, maxWidth: '80%'
                    }}>
                        {slide.description}
                    </p>

                </div>
            </div>

            {/* Bottom Navigation / Pagination */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: 'var(--space-xl)', borderTop: `1px solid ${m.text2}20`
            }}>
                <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                    {dynamicSlides.map((_, idx) => (
                        <div key={idx} style={{
                            width: '40px', height: '2px',
                            background: idx === currentSlide ? m.accent : `${m.text2}30`,
                            transition: 'background 0.4s ease'
                        }} />
                    ))}
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                    <button 
                        onClick={handlePrev}
                        style={{
                            background: 'none', border: `1px solid ${m.text2}40`, color: m.text1,
                            width: '50px', height: '50px', borderRadius: '50%',
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            cursor: 'pointer', transition: 'all 0.4s ease'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = m.accent; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = `${m.text2}40`; }}
                    >
                        ←
                    </button>
                    <button 
                        onClick={handleNext}
                        style={{
                            background: 'none', border: `1px solid ${m.text2}40`, color: m.text1,
                            width: '50px', height: '50px', borderRadius: '50%',
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            cursor: 'pointer', transition: 'all 0.4s ease'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = m.accent; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = `${m.text2}40`; }}
                    >
                        →
                    </button>
                </div>
            </div>
        </div>
    );
};
