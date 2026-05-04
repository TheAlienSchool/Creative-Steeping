import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { GUIDED_JOURNEY_DATA } from './GuidedJourneyData';
import { supabase } from './supabaseClient';
import { useAuth } from './useAuth';
import { EyeOfTheSage } from './EyeOfTheSage';

// Environmental ASCII elements that unlock and glow for each specific vessel
const ASCIIS = {
    '01': "        /\\\n       /  \\\n      /    \\\n     /______\\\n    /\\      /\\\n   /  \\    /  \\\n  /____\\  /____\\\n /      \\/      \\\n/________\\________\\",
    '02': "  ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈\n ≈               ≈\n≈  ~_~_~_~_~_~_~  ≈\n ≈               ≈\n  ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈",
    '03': "     \\   |   /\n      \\  |  /\n       \\ | /\n  -------◎-------\n       / | \\\n      /  |  \\\n     /   |   \\",
    '04': "   _____________ \n  /             \\\n /   ◎   ◎   ◎   \\\n |               |\n \\   ◎   ◎   ◎   /\n  \\_____________/",
    '05': "      /\\ /\\\n     /  |  \\\n    /___|___\\\n   /\\   |   /\\\n  /  \\  |  /  \\\n /____\\_|_/____\\",
    '06': " |\\/|\\/|\\/|\\/|\n | | | | | | |\n |/\\|/\\|/\\|/\\|\n |\\/|\\/|\\/|\\/|\n | | | | | | |\n |/\\|/\\|/\\|/\\|",
    '07': "    _.-'''''-._\n  .'  _     _  '.\n /   (o)   (o)   \\\n|                 |\n|  \\           /  |\n \\  '.       .'  /\n  '.  `'---'`  .'\n    '-._____.-'",
    '08': "    ∞∞∞∞∞∞∞∞∞\n  ∞∞         ∞∞\n ∞∞   ∞∞∞∞∞   ∞∞\n ∞∞   ∞∞∞∞∞   ∞∞\n  ∞∞         ∞∞\n    ∞∞∞∞∞∞∞∞∞"
};

const AdvancedVectorIcon = ({ num, color, opacity }) => {
    const sColor = color || '#fff';
    const sOpacity = opacity || 1;
    const baseStyle = { filter: `drop-shadow(0 0 32px ${sColor}) drop-shadow(0 0 16px ${sColor}80)`, opacity: sOpacity, transition: 'all 2s ease' };

    switch (num) {
        case '01':
            return (
                <svg width="120" height="120" viewBox="0 0 100 100" style={baseStyle}>
                    <polygon points="50,15 90,85 10,85" fill="none" stroke={sColor} strokeWidth="1" />
                    <polygon points="50,85 10,15 90,15" fill="none" stroke={sColor} strokeWidth="0.5" opacity="0.6" style={{ animation: 'pulse 5s infinite alternate' }} />
                    <circle cx="50" cy="50" r="15" fill="none" stroke={sColor} strokeWidth="1" strokeDasharray="4 4" style={{ animation: 'spin 20s linear infinite' }} />
                    <circle cx="50" cy="50" r="3" fill={sColor} />
                </svg>
            );
        case '02':
            return (
                <svg width="120" height="120" viewBox="0 0 100 100" style={baseStyle}>
                    <circle cx="50" cy="50" r="45" fill="none" stroke={sColor} strokeWidth="0.5" strokeDasharray="2 6" style={{ animation: 'spin 60s linear infinite' }} />
                    <path d="M 0 50 Q 25 30 50 50 T 100 50" fill="none" stroke={sColor} strokeWidth="1" />
                    <path d="M 0 60 Q 25 40 50 60 T 100 60" fill="none" stroke={sColor} strokeWidth="1" opacity="0.5" />
                    <circle cx="50" cy="50" r="12" fill="none" stroke={sColor} strokeWidth="1.5" style={{ animation: 'pulse 4s infinite alternate' }} />
                    <circle cx="50" cy="50" r="2" fill={sColor} />
                </svg>
            );
        case '03':
            return (
                <svg width="120" height="120" viewBox="0 0 100 100" style={baseStyle}>
                    <circle cx="50" cy="35" r="30" fill="none" stroke={sColor} strokeWidth="1" />
                    <circle cx="50" cy="65" r="30" fill="none" stroke={sColor} strokeWidth="1" />
                    <path d="M 50 50 L 50 95 M 50 50 L 15 70 M 50 50 L 85 70" stroke={sColor} strokeWidth="0.5" strokeDasharray="2 4" />
                    <circle cx="50" cy="20" r="6" fill={sColor} style={{ animation: 'pulse 3s infinite alternate' }} />
                    <circle cx="50" cy="80" r="2" fill={sColor} />
                </svg>
            );
        case '04':
            return (
                <svg width="120" height="120" viewBox="0 0 100 100" style={baseStyle}>
                    <rect x="25" y="25" width="50" height="50" fill="none" stroke={sColor} strokeWidth="1" style={{ animation: 'spin 40s linear infinite' }} />
                    <circle cx="50" cy="50" r="35" fill="none" stroke={sColor} strokeWidth="0.5" strokeDasharray="1 8" />
                    <path d="M 25 25 L 75 75 M 25 75 L 75 25" stroke={sColor} strokeWidth="0.5" opacity="0.4" />
                    <circle cx="50" cy="50" r="5" fill={sColor} style={{ animation: 'pulse 2s infinite alternate' }} />
                </svg>
            );
        case '05':
            return (
                <svg width="120" height="120" viewBox="0 0 100 100" style={baseStyle}>
                    <polygon points="50,10 90,90 10,90" fill="none" stroke={sColor} strokeWidth="1.5" />
                    <polygon points="50,30 75,80 25,80" fill="none" stroke={sColor} strokeWidth="0.5" />
                    <line x1="50" y1="10" x2="50" y2="90" stroke={sColor} strokeWidth="1" strokeDasharray="4 4" />
                    <circle cx="50" cy="65" r="8" fill="none" stroke={sColor} strokeWidth="1" style={{ animation: 'pulse 3s infinite alternate' }} />
                </svg>
            );
        case '06':
            return (
                <svg width="120" height="120" viewBox="0 0 100 100" style={baseStyle}>
                    <path d="M 10 50 Q 30 10 50 50 T 90 50" fill="none" stroke={sColor} strokeWidth="1" />
                    <path d="M 10 50 Q 30 90 50 50 T 90 50" fill="none" stroke={sColor} strokeWidth="1" opacity="0.5" />
                    <circle cx="50" cy="50" r="25" fill="none" stroke={sColor} strokeWidth="0.5" strokeDasharray="3 3" style={{ animation: 'spin 30s linear infinite' }} />
                    <circle cx="50" cy="50" r="4" fill={sColor} />
                </svg>
            );
        case '07':
            return (
                <svg width="120" height="120" viewBox="0 0 100 100" style={baseStyle}>
                    <circle cx="50" cy="50" r="40" fill="none" stroke={sColor} strokeWidth="1" />
                    <path d="M 50 10 L 50 90 M 10 50 L 90 50" stroke={sColor} strokeWidth="0.5" opacity="0.5" />
                    <circle cx="50" cy="50" r="15" fill="none" stroke={sColor} strokeWidth="1.5" strokeDasharray="2 6" style={{ animation: 'spin 20s reverse infinite' }} />
                    <circle cx="70" cy="30" r="3" fill={sColor} style={{ animation: 'pulse 1.5s infinite alternate' }} />
                </svg>
            );
        case '08':
            return (
                <svg width="120" height="120" viewBox="0 0 100 100" style={baseStyle}>
                    <path d="M 25 50 C 25 20, 75 20, 75 50 C 75 80, 25 80, 25 50 Z" fill="none" stroke={sColor} strokeWidth="1" />
                    <circle cx="35" cy="50" r="10" fill="none" stroke={sColor} strokeWidth="0.5" style={{ animation: 'pulse 3s infinite alternate' }} />
                    <circle cx="65" cy="50" r="10" fill="none" stroke={sColor} strokeWidth="0.5" style={{ animation: 'pulse 3s infinite alternate-reverse' }} />
                    <circle cx="50" cy="50" r="2" fill={sColor} />
                </svg>
            );
        default:
            return null;
    }
};

// Creates a profound sense of gravity: content must be scrolled to / earned, rather than presented all at once.
const ParallaxBlock = ({ children, delay = 0, onEarned }) => {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (onEarned) onEarned();
                    observer.unobserve(entry.target); // Once earned, it remains locked in the lattice
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
        
        const currentRef = domRef.current;
        if (currentRef) observer.observe(currentRef);
        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, []);

    return (
        <div 
            ref={domRef}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                transition: `all 1.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
                width: '100%',
                willChange: 'opacity, transform'
            }}
        >
            {children}
        </div>
    );
};

export const GuidedJourneyModule = ({ activeVessel, m, playStrikingBowl, playAlgoraveSynth, generateSonicSketch, askSage, sageResponse, isThinking }) => {
    const { user, profile } = useAuth();
    const [scratchpadText, setScratchpadText] = useState("");
    const [saveStatus, setSaveStatus] = useState("SYNCED");
    const [insightCaptured, setInsightCaptured] = useState(false);
    const [earnedBlocks, setEarnedBlocks] = useState(0);
    const [sageQuery, setSageQuery] = useState("");
    
    // Feature Layer: Hand-drawn Arts Toggle
    const [isDrawingMode, setIsDrawingMode] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const canvasRef = useRef(null);

    // Feature Layer: Engagement Telemetry & Back-end Analytics
    const timeSpent = useRef(0);
    const keystrokes = useRef(0);
    const inkStrokes = useRef(0);

    // Track self guidance pace (seconds active)
    useEffect(() => {
        const paceTimer = setInterval(() => {
            if (document.hasFocus()) timeSpent.current += 1;
        }, 1000);
        return () => clearInterval(paceTimer);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                const canvas = canvasRef.current;
                const parent = canvas.parentElement;
                
                if (canvas.width !== parent.clientWidth || canvas.height !== parent.clientHeight) {
                    const tempImageData = canvas.toDataURL();
                    canvas.width = parent.clientWidth;
                    canvas.height = parent.clientHeight;
                    
                    if (tempImageData !== "data:,") { 
                        const ctx = canvas.getContext('2d');
                        const img = new Image();
                        img.onload = () => ctx.drawImage(img, 0, 0);
                        img.src = tempImageData;
                    }
                }
            }
        };

        handleResize(); // Initial load matrix layout
        
        // Retrieve visual memory if activated
        if (isDrawingMode && canvasRef.current && user) {
            const savedDrawing = localStorage.getItem(`steeping_ink_${user.id}_${activeVessel.num}`);
            if (savedDrawing) {
                const ctx = canvasRef.current.getContext('2d');
                const img = new Image();
                img.onload = () => ctx.drawImage(img, 0, 0);
                img.src = savedDrawing;
            }
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isDrawingMode, user, activeVessel.num]);

    const startDrawing = (e) => {
        setIsDrawing(true);
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        ctx.moveTo(clientX - rect.left, clientY - rect.top);
    };

    const draw = (e) => {
        if (!isDrawing || !canvasRef.current) return;
        if (e.cancelable) e.preventDefault();
        const rect = canvasRef.current.getBoundingClientRect();
        const ctx = canvasRef.current.getContext('2d');
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        ctx.lineTo(clientX - rect.left, clientY - rect.top);
        
        // Aesthetic enhancement: Bioluminescent glowing ink
        ctx.strokeStyle = m.accent || '#fff';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = m.accent;
        ctx.shadowBlur = 8; 
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        if (playStrikingBowl && Math.random() > 0.94) {
            playStrikingBowl(100 + Math.random() * 80); // Light, fluid friction sound
        }
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        inkStrokes.current += 1; // Log telemetry
        // Persist interpretation automatically to memory cache
        if (canvasRef.current && isDrawingMode && user) {
            localStorage.setItem(`steeping_ink_${user.id}_${activeVessel.num}`, canvasRef.current.toDataURL());
        }
    };

    const num = activeVessel.num; 
    const data = GUIDED_JOURNEY_DATA[num];
    const asciiArt = ASCIIS[num] || ASCIIS['01'];

    // Fetch existing ledger data
    useEffect(() => {
        if (!user || profile?.access_tier === 'nomad') return;
        const fetchLedger = async () => {
            try {
                const { data: ledgerData } = await supabase
                    .from('steeping_ledgers')
                    .select('interaction_text')
                    .eq('profile_id', user.id)
                    .eq('hexagong_num', num)
                    .single();

                if (ledgerData && ledgerData.interaction_text) {
                    setScratchpadText(ledgerData.interaction_text);
                    if (ledgerData.interaction_text.length > 5) setInsightCaptured(true);
                }
            } catch (err) {}
        };
        fetchLedger();
    }, [user, profile, num]);

    // Auto-save logic
    useEffect(() => {
        if (!user || profile?.access_tier === 'nomad') return;
        setSaveStatus("UNSAVED");
        const handler = setTimeout(async () => {
            if (!scratchpadText) return;
            setSaveStatus("SAVING...");
            
            const payload = {
                profile_id: user.id,
                hexagong_num: num,
                interaction_text: scratchpadText,
                interaction_metrics: {
                    time_spent_seconds: timeSpent.current,
                    keystrokes_played: keystrokes.current,
                    ink_strokes: inkStrokes.current,
                    engagement_depth: earnedBlocks * 33 // approximation depending on vessel
                },
                is_completed: insightCaptured,
                updated_at: new Date()
            };

            try {
                let { error } = await supabase.from('steeping_ledgers').upsert(payload, { onConflict: 'profile_id, hexagong_num' });
                
                // Graceful fallback: If interaction_metrics or is_completed columns don't exist yet in Supabase (SQL not run)
                if (error && error.code === '42703') {
                    const fallbackPayload = {
                        profile_id: user.id,
                        hexagong_num: num,
                        interaction_text: scratchpadText,
                        updated_at: new Date()
                    };
                    const fallbackRes = await supabase.from('steeping_ledgers').upsert(fallbackPayload, { onConflict: 'profile_id, hexagong_num' });
                    error = fallbackRes.error;
                }

                if (!error) setSaveStatus("SYNCED");
            } catch (e) {}
        }, 1500); 
        return () => clearTimeout(handler);
    }, [scratchpadText, user, profile, num, insightCaptured, earnedBlocks]);

    const handleCaptureInsight = async () => {
        setInsightCaptured(true);
        if (generateSonicSketch && scratchpadText.length > 5) {
            playStrikingBowl(100);
            generateSonicSketch({
                query: `Hexagong ${num} Insight`,
                response: scratchpadText
            });
        }
    };

    if (!data) return <div>Data not found.</div>;

    const stanzas = data.interaction.split('\n\n').filter(s => s.trim());
    const questions = stanzas.filter(s => s.trim().endsWith('?'));
    const totalBlocks = 2 + stanzas.length; // 1 Hero + N stanzas + 1 Scratchpad
    const progressPercent = Math.min(100, Math.floor((earnedBlocks / totalBlocks) * 100));

    const handleBlockEarned = () => setEarnedBlocks(prev => prev + 1);

    return (
        <div className="guided-journey-grid" style={{
            marginTop: 'var(--space-xxl)',
            animation: 'fadeIn 1.2s ease forwards'
        }}>
            <style>{`
                @keyframes fluidic-scratchpad-idle {
                    0% {
                        box-shadow: inset 0 0 40px var(--fluid-bg), 0 0 20px var(--fluid-text-dim);
                        background-color: var(--fluid-surface-dim);
                    }
                    100% {
                        box-shadow: inset 0 0 60px var(--fluid-bg), 0 0 35px var(--fluid-text-dim);
                        background-color: var(--fluid-surface-bright);
                    }
                }
                @keyframes fluidic-scratchpad-captured {
                    0% {
                        box-shadow: inset 0 0 40px var(--fluid-bg), 0 0 40px var(--fluid-accent-glow);
                        background-color: var(--fluid-surface-dim);
                    }
                    100% {
                        box-shadow: inset 0 0 60px var(--fluid-bg), 0 0 60px var(--fluid-accent-glow);
                        background-color: var(--fluid-surface-bright);
                    }
                }
                @keyframes sage-manifest {
                    0% {
                        opacity: 0;
                        transform: translateY(10px);
                        filter: blur(10px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0px);
                        filter: blur(0px);
                    }
                }
                @keyframes sage-border-pulse {
                    0% { border-color: var(--fluid-text-dim); box-shadow: -10px 0 20px transparent; }
                    50% { border-color: var(--fluid-accent-glow); box-shadow: -10px 0 20px var(--fluid-accent-glow); }
                    100% { border-color: var(--fluid-text-dim); box-shadow: -10px 0 20px transparent; }
                }
            `}</style>
            
            {/* LEFT COLUMN: THE COMPASS (Sticky Reflection & ASCII Checkpoint) */}
            <div style={{ position: 'relative' }}>
                <div className="guided-compass-sticky" style={{
                    borderLeft: `2px solid ${insightCaptured ? m.accent : m.text2 + '60'}`,
                    paddingLeft: 'var(--space-xl)', // Increased padding
                    transition: 'border-color 1.5s ease'
                }}>
                    <h3 style={{ fontFamily: 'var(--fMono)', fontSize: '0.8rem', letterSpacing: '0.25em', color: m.accent, opacity: 0.8, marginBottom: 'var(--space-md)', textTransform: 'uppercase' }}>
                        [ THE COMPASS ]
                    </h3>
                    
                    <div style={{ fontFamily: 'var(--fSerif)', fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', fontStyle: 'italic', letterSpacing: '0.02em', color: m.text1, lineHeight: 1.8, WebkitFontSmoothing: 'antialiased' }}>
                        {data.reflection}
                    </div>

                    {/* Elegant Gamification: The Environmental Bonus */}
                    <div style={{
                        marginTop: 'var(--space-xxl)', // Increased margin
                        display: 'flex', flexDirection: 'column', alignItems: 'flex-start'
                    }}>
                        <div style={{
                            fontFamily: 'var(--fMono)', fontSize: '0.7rem', color: m.accent, opacity: 0.6,
                            letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 'var(--space-md)'
                        }}>
                            {insightCaptured ? 'SYSTEM INTEGRATED' : 'AWAITING RESONANCE'}
                        </div>
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
                            color: insightCaptured ? m.accent : m.text2,
                            opacity: insightCaptured ? 1 : 0.9,
                            textShadow: insightCaptured ? `0 0 42px ${m.accent}, 0 0 21px ${m.accent}` : `0 0 26px ${m.text2}80`,
                            transform: insightCaptured ? 'scale(1.15)' : 'scale(1)',
                            transition: 'all 2s cubic-bezier(0.16, 1, 0.3, 1)',
                            lineHeight: 1.2
                        }}>
                            <AdvancedVectorIcon num={num} color={insightCaptured ? m.accent : m.text1} opacity={insightCaptured ? 1 : 0.95} />
                        </div>
                    </div>

                    {/* Gamified Engagement Progress Bar */}
                    <div style={{ marginTop: 'var(--space-xxl)', width: '80%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.accent, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>Engagement Depth</span>
                            <span style={{ fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.text1 }}>{progressPercent}%</span>
                        </div>
                        <div style={{ width: '100%', height: '2px', background: `${m.text2}20`, position: 'relative' }}>
                            <div style={{ 
                                position: 'absolute', top: 0, left: 0, height: '100%', 
                                background: m.accent, width: `${progressPercent}%`,
                                transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                boxShadow: `0 0 10px ${m.accent}40`
                            }} />
                        </div>
                    </div>

                    {/* The Steeping Sage Accessibility (Macrobiotic Guidance) */}
                    <div style={{
                        marginTop: 'var(--space-xxl)',
                        display: 'flex', flexDirection: 'column', alignItems: 'flex-start'
                    }}>
                        <h3 style={{ fontFamily: 'var(--fMono)', fontSize: '0.8rem', letterSpacing: '0.25em', color: m.accent, opacity: 0.8, marginBottom: 'var(--space-sm)', textTransform: 'uppercase' }}>
                            [ EXTERNAL GUIDANCE ]
                        </h3>
                        <p style={{ fontFamily: 'var(--fBody)', fontSize: '1rem', color: m.text2, lineHeight: 1.5, marginBottom: 'var(--space-md)', fontStyle: 'italic', opacity: 0.8 }}>
                            Every inquiry holds weight. The Sage awaits your exchange.
                        </p>
                        
                        {(isThinking || sageResponse) && (
                            <div style={{ marginBottom: 'var(--space-md)', width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <EyeOfTheSage sageBusy={isThinking} accentColor={m.accent} />
                            </div>
                        )}

                        {sageResponse && (() => {
                            let mainResponse = sageResponse;
                            let sanscription = null;
                            
                            // Extract the 4-vector SANscription geometry
                            const sansMatch = sageResponse.match(/\[\s*STBL:\s*\d+\s*\|\s*PRSS:\s*\d+\s*\|\s*COHR:\s*\d+\s*\|\s*DRFT:\s*\d+\s*\]/);
                            if (sansMatch) {
                                sanscription = sansMatch[0];
                                mainResponse = sageResponse.replace(sansMatch[0], '').trim();
                            }

                            return (
                                <div style={{
                                    fontFamily: 'var(--fSerif)', fontSize: '1.2rem', fontStyle: 'italic', 
                                    color: m.text1, lineHeight: 1.7, marginBottom: 'var(--space-md)',
                                    padding: 'var(--space-md) var(--space-xl)', paddingRight: 0,
                                    borderLeft: `2px solid ${m.accent}`, 
                                    background: `linear-gradient(90deg, ${m.accent}10 0%, transparent 100%)`,
                                    animation: 'sage-manifest 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards, sage-border-pulse 4s ease-in-out infinite alternate',
                                    '--fluid-accent-glow': m.accent,
                                    '--fluid-text-dim': m.accent + '40',
                                    position: 'relative',
                                    display: 'flex', flexDirection: 'column'
                                }}>
                                    <ReactMarkdown
                                        components={{
                                            p: ({node, ...props}) => <p style={{ margin: '0 0 var(--space-md) 0' }} {...props} />,
                                            strong: ({node, ...props}) => <strong style={{ color: m.accent, fontWeight: 600, fontStyle: 'normal', letterSpacing: '0.05em' }} {...props} />,
                                            em: ({node, ...props}) => <em style={{ opacity: 0.8 }} {...props} />,
                                            ul: ({node, ...props}) => <ul style={{ margin: 'var(--space-md) 0', paddingLeft: '2rem', listStyleType: 'square', color: m.accent }} {...props} />,
                                            li: ({node, ...props}) => <li style={{ margin: 'var(--space-sm) 0', color: m.text1 }} {...props} />,
                                            blockquote: ({node, ...props}) => <blockquote style={{ borderLeft: `2px solid ${m.accent}`, paddingLeft: '1.5rem', margin: '1.5rem 0', fontStyle: 'italic', opacity: 0.9, color: m.accent }} {...props} />,
                                            h1: ({node, ...props}) => <h1 style={{ fontFamily: 'var(--fMono)', fontSize: '1.2rem', color: m.accent, textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: '2rem', marginBottom: '1rem' }} {...props} />,
                                            h2: ({node, ...props}) => <h2 style={{ fontFamily: 'var(--fMono)', fontSize: '1rem', color: m.accent, textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '1.5rem', marginBottom: '0.8rem', opacity: 0.9 }} {...props} />,
                                            h3: ({node, ...props}) => <h3 style={{ fontFamily: 'var(--fMono)', fontSize: '0.8rem', color: m.accent, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '1rem', marginBottom: '0.5rem', opacity: 0.8 }} {...props} />
                                        }}
                                    >
                                        {mainResponse}
                                    </ReactMarkdown>

                                    {/* The Social Geometric Badge */}
                                    {sanscription && (
                                        <div style={{
                                            marginTop: 'var(--space-lg)', alignSelf: 'flex-start',
                                            padding: '8px 16px', border: `1px solid ${m.accent}60`,
                                            background: m.surface, color: m.accent,
                                            fontFamily: 'var(--fMono)', fontSize: '0.75rem',
                                            letterSpacing: '0.2em', textTransform: 'uppercase',
                                            boxShadow: `0 0 15px ${m.accent}20`,
                                            animation: 'sage-manifest 2s ease forwards'
                                        }}>
                                            <span style={{ opacity: 0.5, marginRight: '8px' }}>DIAGNOSTIC //</span>
                                            <span style={{ fontWeight: 'bold' }}>{sanscription}</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })()}

                        <input 
                            type="text" 
                            value={sageQuery}
                            onChange={(e) => setSageQuery(e.target.value)}
                            placeholder="Consult the Steeping Sage..." 
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && sageQuery.trim()) {
                                    if(askSage) askSage(sageQuery, undefined, { progress: progressPercent, num: activeVessel.num, name: activeVessel.name });
                                    setSageQuery('');
                                } else if (e.key.length === 1 && playStrikingBowl) {
                                    playStrikingBowl(150); // High ping for query
                                }
                            }}
                            style={{
                                width: '100%', background: 'transparent', border: 'none', 
                                borderBottom: `1px solid ${m.accent}40`, color: m.text1,
                                fontFamily: 'var(--fBody)', fontSize: '1.2rem', padding: 'var(--space-xs) 0',
                                outline: 'none', transition: 'border-color 0.4s ease'
                            }}
                            onFocus={e => e.target.style.borderBottom = `1px solid ${m.accent}`}
                            onBlur={e => e.target.style.borderBottom = `1px solid ${m.accent}40`}
                        />
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: THE WORKBOOK CONTENT */}
            <div>
                {/* 1. INVOCATION HERO - Editorial Drop Cap */}
                <ParallaxBlock delay={0} onEarned={handleBlockEarned}>
                    <div style={{ marginBottom: 'var(--space-xxl)', paddingLeft: 'var(--space-md)', borderLeft: `2px solid ${m.accent}60`, position: 'relative' }}>
                        {/* Vertical Baseline Folio Tag */}
                        <div style={{ position: 'absolute', left: '-50px', top: '10px', transform: 'rotate(-90deg)', transformOrigin: 'top left', fontFamily: 'var(--fMono)', fontSize: '0.65rem', letterSpacing: '0.4em', color: m.accent, opacity: 0.5, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                            [ VESSEL {num} • CREÅTIVE INTENT ]
                        </div>
                        
                        <div style={{ fontFamily: 'var(--fSerif)', fontSize: 'clamp(1.5rem, 2vw, 2.2rem)', fontStyle: 'italic', color: m.text1, whiteSpace: 'pre-line', lineHeight: 1.5, fontWeight: 300, opacity: 0.9 }}>
                            <span style={{
                                float: 'left',
                                fontSize: '6rem',
                                lineHeight: '0.8',
                                paddingTop: '4px',
                                paddingRight: '12px',
                                color: m.accent,
                                fontFamily: 'var(--fSerif)',
                                fontStyle: 'normal'
                            }}>
                                {data.invocation.charAt(0)}
                            </span>
                            {data.invocation.slice(1)}
                            <div style={{ clear: 'both' }}></div>
                        </div>
                    </div>
                </ParallaxBlock>

                {/* 2. THE PROMPT / INQUIRY */}
                <div style={{ marginBottom: 'var(--space-xxl)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                        {stanzas.map((stanza, idx) => {
                            const isQuestion = stanza.trim().endsWith('?');
                            const isDirective = stanza.trim().endsWith(':');

                            if (isDirective) {
                                return (
                                    <ParallaxBlock key={idx} delay={0.1} onEarned={handleBlockEarned}>
                                        <div style={{
                                            fontFamily: 'var(--fMono)', fontSize: '0.85rem', letterSpacing: '0.3em',
                                            color: m.accent, textTransform: 'uppercase', opacity: 0.9,
                                            marginTop: 'var(--space-md)', paddingLeft: 'var(--space-md)', borderLeft: `2px solid ${m.accent}80`
                                        }}>
                                            {stanza}
                                        </div>
                                    </ParallaxBlock>
                                );
                            }

                            if (isQuestion) {
                                return (
                                    <ParallaxBlock key={idx} delay={0.1} onEarned={handleBlockEarned}>
                                        <div style={{
                                            fontFamily: 'var(--fSerif)', fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                                            color: m.text1, lineHeight: 1.25, letterSpacing: '0.01em', fontStyle: 'italic',
                                            margin: 'var(--space-xxl) 0', fontWeight: 300, opacity: 0.95,
                                            maxWidth: '100%',
                                            marginLeft: '-3rem', // Editorial Bleed left
                                            paddingLeft: '3rem',
                                            borderLeft: `4px solid ${m.accent}`,
                                            background: `linear-gradient(90deg, ${m.accent}15 0%, transparent 100%)`
                                        }}>
                                            {stanza}
                                        </div>
                                    </ParallaxBlock>
                                );
                            }

                            return (
                                <ParallaxBlock key={idx} delay={0.1} onEarned={handleBlockEarned}>
                                    <div className="guided-body-text" style={{
                                        fontFamily: 'var(--fBody)', color: m.text2,
                                        marginBottom: 'var(--space-md)'
                                    }}>
                                        {stanza}
                                    </div>
                                </ParallaxBlock>
                            );
                        })}
                    </div>
                </div>

                {/* 3. THE ARCHITECTURAL SCRATCHPAD & INTEGRATION */}
                <ParallaxBlock delay={0.2} onEarned={handleBlockEarned}>
                    <div style={{ position: 'relative', marginTop: '4rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                            <h3 style={{ fontFamily: 'var(--fMono)', fontSize: '0.8rem', letterSpacing: '0.25em', color: m.accent, textTransform: 'uppercase', margin: 0 }}>
                                [ YOUR ARCHITECTURE ]
                            </h3>
                            <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
                                <button
                                    onClick={() => setIsDrawingMode(!isDrawingMode)}
                                    style={{
                                        background: isDrawingMode ? `${m.accent}30` : 'transparent',
                                        color: isDrawingMode ? m.text1 : m.text2,
                                        border: `1px solid ${isDrawingMode ? m.accent : m.text2 + '40'}`,
                                        fontFamily: 'var(--fMono)', fontSize: '0.65rem',
                                        letterSpacing: '0.15em', padding: '4px 8px', borderRadius: '4px',
                                        cursor: 'pointer', opacity: 0.8, textTransform: 'uppercase',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {isDrawingMode ? '[ INK MODE ]' : '[ PEN MODE ]'}
                                </button>
                                <span style={{ fontFamily: 'var(--fMono)', fontSize: '0.7rem', color: saveStatus === 'SYNCED' ? m.accent : m.text2, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                                    {saveStatus === 'SYNCED' ? 'SYNCHRONIZED' : saveStatus}
                                </span>
                            </div>
                        </div>

                        {/* Recalled Prompts Overlay */}
                        {questions.length > 0 && (
                            <div style={{ 
                                marginBottom: 'var(--space-lg)', padding: 'var(--space-lg)', 
                                borderLeft: `1px dashed ${m.accent}40`, background: `${m.surface}40`
                            }}>
                                <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.accent, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 'var(--space-md)' }}>
                                    [ ACTIVE INQUIRIES ]
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {questions.map((q, i) => (
                                        <div key={i} style={{ fontFamily: 'var(--fSerif)', fontSize: '1.2rem', fontStyle: 'italic', lineHeight: 1.4, color: m.text2, opacity: 0.9 }}>
                                            {q}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div style={{ position: 'relative' }}>
                            {/* Editor Guidelines overlay (aesthetic) */}
                            <div style={{ position: 'absolute', top: 0, bottom: 0, left: '3.5rem', width: '1px', background: `${m.accent}20`, pointerEvents: 'none', zIndex: 1 }} />
                            <div style={{ position: 'absolute', top: '2rem', left: 0, right: 0, height: '1px', background: `${m.accent}20`, pointerEvents: 'none', zIndex: 1 }} />

                            <textarea
                                value={scratchpadText}
                                onChange={(e) => setScratchpadText(e.target.value)}
                                onKeyDown={(e) => {
                                    keystrokes.current += 1; // Log telemetry
                                    
                                    if (!playStrikingBowl) return;
                                    
                                    const signatureSounds = {
                                        'Enter': 40,
                                        '?': 120,
                                        '!': 140,
                                        '.': 80, // Pausing or grounded closure
                                        ',': 90, 
                                        '"': 85,
                                        "'": 75,
                                        ':': 160,
                                        ';': 150,
                                        'Tab': 180,
                                        'Backspace': 30,
                                        'Delete': 25,
                                        '+': 110,
                                        '&': 95,
                                        ' ': 220 
                                    };

                                    if (signatureSounds[e.key]) {
                                        playStrikingBowl(signatureSounds[e.key]);
                                    } else if (e.key.length === 1) {
                                        // Prevents every key from playing a low subsonic thud (e.keyCode causes rumble)
                                        // Transforms standard typable keys into a recognizable, softly drifting melodic scale based on char value
                                        const charCode = e.key.charCodeAt(0);
                                        const harmonicFreq = 150 + (charCode % 25) * 8; 
                                        playStrikingBowl(harmonicFreq);
                                    }
                                }}
                                placeholder="Begin constructing the pause..."
                                className="guided-textarea"
                                style={{
                                    width: '100%', minHeight: '350px', 
                                    border: `1px solid ${insightCaptured ? m.accent : m.text2 + '80'}`,
                                    borderTop: `4px solid ${insightCaptured ? m.accent : m.text2}`,
                                    color: m.text1, fontFamily: 'var(--fSerif)', fontStyle: 'italic',
                                    outline: 'none', resize: 'vertical', position: 'relative', zIndex: 2,
                                    transition: 'all 1s ease',
                                    '--fluid-bg': m.bg,
                                    '--fluid-text-dim': m.text2 + '40',
                                    '--fluid-surface-dim': m.surface + '60',
                                    '--fluid-surface-bright': m.surface + 'A0', // Brighter alpha for the breath
                                    '--fluid-accent-glow': m.accent + '50',
                                    animation: insightCaptured ? 'fluidic-scratchpad-captured 6s ease-in-out infinite alternate' : 'fluidic-scratchpad-idle 6s ease-in-out infinite alternate',
                                    opacity: isDrawingMode ? 0.2 : 1, // Phase into the background when drawing
                                }}
                            />
                            
                            <canvas
                                ref={canvasRef}
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                                onTouchStart={startDrawing}
                                onTouchMove={draw}
                                onTouchEnd={stopDrawing}
                                style={{
                                    position: 'absolute', top: 0, left: 0,
                                    width: '100%', height: '100%',
                                    pointerEvents: isDrawingMode ? 'auto' : 'none',
                                    zIndex: 3, cursor: isDrawingMode ? 'crosshair' : 'default',
                                    background: isDrawingMode ? `${m.surface}40` : 'transparent',
                                    transition: 'background 0.5s ease',
                                    touchAction: 'none' // CRITICAL: prevents scroll when drawing on mobile
                                }}
                            />
                        </div>

                        {/* The Integration Threshold */}
                        <div style={{ marginTop: 'var(--space-xl)', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={handleCaptureInsight}
                                disabled={insightCaptured || scratchpadText.length < 5}
                                style={{
                                    background: insightCaptured ? 'transparent' : `${m.accent}10`,
                                    color: insightCaptured ? m.text2 : m.accent,
                                    border: `1px solid ${insightCaptured ? m.text2 + '40' : m.accent}`,
                                    fontFamily: 'var(--fMono)', fontSize: '0.75rem',
                                    padding: '12px 24px', cursor: insightCaptured || scratchpadText.length < 5 ? 'default' : 'pointer',
                                    textTransform: 'uppercase', letterSpacing: '0.2em',
                                    transition: 'all 0.6s ease', opacity: scratchpadText.length < 5 ? 0.3 : 1
                                }}
                                onMouseEnter={e => {
                                    if (!insightCaptured && scratchpadText.length >= 5) {
                                        e.currentTarget.style.background = m.accent;
                                        e.currentTarget.style.color = '#000';
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (!insightCaptured && scratchpadText.length >= 5) {
                                        e.currentTarget.style.background = `${m.accent}10`;
                                        e.currentTarget.style.color = m.accent;
                                    }
                                }}
                            >
                                {insightCaptured ? '[ INSIGHT INTEGRATED ]' : '[ CAPTURE TO LATTICE ]'}
                            </button>
                        </div>
                    </div>
                </ParallaxBlock>

            </div>
        </div>
    );
};
