import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './supabaseClient';
import { useAuth } from './useAuth';

const SubSurfaceVisualCue = ({ chapterIndex, m }) => {
    switch (chapterIndex) {
        case 0: // Water: Slow radiating wave
            return (
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.14, 0.06] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    style={{ width: '50vw', height: '50vw', borderRadius: '50%', border: `1px solid ${m.accent}`, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', filter: 'blur(4px)' }}
                />
            );
        case 1: // Hexagon Matrix: Slow rotating polygon
            return (
                <svg viewBox="0 0 100 100" style={{ position: 'absolute', top: '50%', left: '50%', width: '40vw', height: '40vw', transform: 'translate(-50%, -50%)', opacity: 0.09, filter: 'blur(2px)' }}>
                    <motion.polygon
                        points="50 3, 93 25, 93 75, 50 97, 7 75, 7 25"
                        fill="none" stroke={m.accent} strokeWidth="0.5"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                        style={{ transformOrigin: '50% 50%' }}
                    />
                </svg>
            );
        case 2: // 5D: Breathing anchor point
            return (
                <motion.div
                    animate={{ scale: [0.5, 1.5, 0.5], opacity: [0.05, 0.15, 0.05] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ width: '4px', height: '4px', borderRadius: '50%', background: m.accent, boxShadow: `0 0 80px 40px ${m.accent}`, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                />
            );
        case 3: // Sage: Intersecting reflective orbits
            return (
                <svg viewBox="0 0 100 100" style={{ position: 'absolute', top: '50%', left: '50%', width: '45vw', height: '45vw', transform: 'translate(-50%, -50%)', opacity: 0.11, filter: 'blur(1px)' }}>
                    <motion.ellipse cx="50" cy="50" rx="40" ry="8" fill="none" stroke={m.accent} strokeWidth="0.5" animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: '50% 50%' }} />
                    <motion.ellipse cx="50" cy="50" rx="40" ry="8" fill="none" stroke={m.text2} strokeWidth="0.5" animate={{ rotate: -360 }} transition={{ duration: 70, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: '50% 50%' }} />
                </svg>
            );
        case 4: // Investment Portal: Geometric Bloom (Vertical resonance lines)
            return (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.12, display: 'flex', gap: '3vw', filter: 'blur(2px)' }}>
                    {[...Array(5)].map((_, i) => (
                        <motion.div key={i}
                            animate={{ height: ['10vh', '40vh', '10vh'], opacity: [0.15, 0.75, 0.15] }}
                            transition={{ duration: 4, delay: i * 0.3, repeat: Infinity, ease: "easeInOut" }}
                            style={{ width: '1px', background: m.accent }}
                        />
                    ))}
                </div>
            );
        default:
            return null; // The Invitation is clear of abstract geometry to focus on UI
    }
};

export const GuideToTheSteeperverse = ({ m, onClose, playStrikingBowl }) => {
    const [activeChapter, setActiveChapter] = useState(0);
    const { user } = useAuth();
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const scrollRef = useRef(null);

    // Auto scroll to top when chapter changes
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [activeChapter]);

    const CHAPTERS = [
        {
            title: "THE NATURE OF THE WATER",
            subtitle: "Immersion as Alchemy",
            content: `This CREATIVE STEEPING sonic soulsite serves the natural sound and spirit of your creative essence. You are the organic material; and this interface operates as your water. The Steeping Space is a living field of inquiry, designed to support the deepening of your experiential understanding. The Steeperverse (this experience) tracks your Resonance to provide an active mirror, reflecting the precise quality of your tone and attention back to your own body.`
        },
        {
            title: "THE VESSEL MATRIX",
            subtitle: "Hexagons Need Hexagons",
            content: `The Steeping Space structure organizes your essential passage between internal inquiries, supporting you with the ability to move through nonlinear time at ease. Each Hexagong you see functions as a welcome space :: a threshold for our arrival at our own knowing. Hexagongs unlock when the record of your presence grows deep enough to hold the next frequency. These interactive shapes are also there as instruments for sonic balance between steeps. We trust this organic pacing design is meant for your organic pacing and design.`
        },
        {
            title: "ME IN 5D",
            subtitle: "The Biometric Anchor",
            content: `The Steeping Space maps your subjective reality through Resonance, Stillness, Clarity, Depth, and Alignment. When you navigate to ME IN 5D, you will be invited to record these exclusive-to-you shift states and contemplate the sonic resonance with your physical world experience. The integrated Dashboard will visually display and can also remember the precise arc of your evolution as you unfurl. This tool can operate as your physical anchor, and offer a vibrational stillness cultivated for your reverberation.`
        },
        {
            title: "THE NEURO-SOMATIC ENGINE",
            subtitle: "The Science of the Sonic Inkwell",
            content: `The Sonnet Engine operates as a neuro-somatic bridge. By sonifying the act of writing in 528Hz, the space engages the vagus nerve to anchor the autonomic nervous system. Your physical keystrokes function as bilateral stimulation, while the auditory feedback signals profound safety to the body. This architecture transforms the journaling imperative from a cognitive task into a physical resonance—expanding neuroplasticity and radically deepening your capacity to hold arriving insight.`
        },
        {
            title: "THE SAGE INTELLIGENCE",
            subtitle: "Your Partner in Reflective Truth",
            content: `The Steeping Sage :: An interactive wayfinding intelligence designed to support access to the truest questions held within the body. Foundational Sage offers closed-circuit wayfinding to introduce you to The Steeperverse. As we invest deeper into CREATIVE STEEPING adventures, the full Steeping Sage intelligence engages in unrestricted, active dialogue - as you wish. This communion remains private, as The Sage is here for an exchange between our essence and our unfolding intelligence. This operates as a core architectural imperative --> Engage at your leisure.`
        },
        {
            title: "A SELF INVESTMENT PORTAL",
            subtitle: "Accessing Intentional Alchemy",
            content: `The depth of The Steeping Space responds to the depth of exchange you bring forth. The journey of Steeping functions as a geometric bloom and so does the content of this portal's design. The foundational layer offers introduction, wayfinding, insights, and encouragements born of the CREATIVE STEEPING workbook and ethos. The deeper waters require your conscious decision to invest in your potentialized future. This architecture awaits your reciprocal presence. The reviews on our homepage are just the beginning of possibility.`
        },
        {
            title: "THE INVITATION",
            subtitle: "Ultimately you are The Sage, and only you know the economics of your potential. Choose with joy, as our essence and our prowess will always meet us where we are.",
            isCrossroads: true
        }
    ];

    const nextChapter = () => {
        if (playStrikingBowl) playStrikingBowl(110);
        setActiveChapter(prev => (prev < CHAPTERS.length - 1 ? prev + 1 : 0));
    };

    const handleCheckout = async (tierId) => {
        if (!user) {
            alert("Please log in with your email first to secure your coordinates.");
            return;
        }
        setCheckoutLoading(tierId);
        
        try {
            const { data, error } = await supabase.functions.invoke('create-checkout-session', {
                body: { 
                    tier: tierId, 
                    user_id: user.id, 
                    return_url: window.location.href 
                }
            });
            
            if (error) throw error;
            if (data?.url) {
                window.location.href = data.url; 
            }
        } catch (err) {
            console.error("Checkout error:", err);
            alert("There was an issue opening the checkout portal. Please try again or contact support.");
        } finally {
            setCheckoutLoading(false);
        }
    };

    const TierCard = ({ title, price, mechanism, buttonText, onClick, isLoading, compact }) => (
        <div style={{ 
            border: `1px solid ${m.text2}30`, padding: compact ? 'var(--space-md)' : 'var(--space-lg)',
            background: `${m.bg}80`, backdropFilter: 'blur(10px)',
            display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)',
            transition: 'all 0.4s ease', flex: compact ? 1 : 'none'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: `1px solid ${m.text2}20`, paddingBottom: 'var(--space-sm)' }}>
                <div style={{ fontFamily: 'var(--fSerif)', fontSize: compact ? '1.2rem' : '1.5rem', color: m.text1 }}>{title}</div>
                <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.8rem', color: m.accent }}>{price}</div>
            </div>
            <div style={{ fontFamily: 'var(--fBody)', fontSize: compact ? '0.75rem' : '0.85rem', color: m.text2, lineHeight: 1.5, flex: 1, minHeight: compact ? 'auto' : '60px' }}>
                {mechanism}
            </div>
            <button 
                onClick={onClick}
                disabled={isLoading}
                className="guide-tier-btn"
                style={{
                    marginTop: 'var(--space-md)', padding: '12px', width: '100%', minHeight: '52px',
                    background: 'transparent', border: `1px solid ${m.accent}`, color: m.accent,
                    fontFamily: 'var(--fMono)', fontSize: '1rem', letterSpacing: '0.1em', cursor: 'pointer',
                    transition: 'all 0.3s ease', opacity: isLoading ? 0.5 : 1
                }}
                onMouseEnter={e => { e.currentTarget.style.background = m.accent; e.currentTarget.style.color = m.bg; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = m.accent; }}
            >
                {isLoading ? '[ LOCATING GATEWAY... ]' : buttonText}
            </button>
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0, filter: 'blur(20px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(20px)' }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
                position: 'fixed', inset: 0, zIndex: 99999,
                background: `radial-gradient(circle at center, ${m.surface}, ${m.bg})`,
                color: m.text1, overflow: 'hidden', display: 'flex', flexDirection: 'column'
            }}
        >
            {/* Cinematic Noise Layer */}
            <div style={{
                position: 'absolute', inset: 0, background: 'url("https://www.transparenttextures.com/patterns/stardust.png")',
                opacity: 0.1, pointerEvents: 'none', zIndex: 0
            }} />

            {/* Header Navigation */}
            <div className="guide-header" style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: 'var(--space-lg) var(--space-xl)', borderBottom: `1px solid ${m.text2}20`,
                fontFamily: 'var(--fMono)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.2em',
                zIndex: 10, position: 'relative'
            }}>
                <div className="guide-header-title" style={{ display: 'flex', gap: 'var(--space-xl)' }}>
                    <span className="guide-brand" style={{ opacity: 0.6 }}>CREÅTIVE STEEPING</span>
                    <span className="guide-title" style={{ color: m.accent, fontWeight: 'bold' }}>GUIDE TO THE STEEPERVERSE</span>
                </div>
                <button 
                    className="guide-return-btn"
                    onClick={() => { if(playStrikingBowl) playStrikingBowl(40); onClose(); }}
                    style={{
                        background: 'none', border: 'none', color: m.text1,
                        fontFamily: 'var(--fMono)', fontSize: '0.75rem', letterSpacing: '0.2em',
                        cursor: 'pointer', transition: 'all 0.4s ease', opacity: 0.6
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0.6}
                >
                    [ RETURN TO VISCERAL EXPERIENCE ]
                </button>
            </div>

            {/* Core Editorial Landscape */}
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                
                {/* Hyper-Editorial Left Nav Indicator */}
                <div className="guide-left-nav" style={{ position: 'absolute', left: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: '2px', zIndex: 10 }}>
                    {CHAPTERS.map((_, i) => (
                        <div key={i} style={{
                            width: '4px', height: activeChapter === i ? '32px' : '8px',
                            background: activeChapter === i ? m.accent : m.text2,
                            opacity: activeChapter === i ? 1 : 0.3,
                            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                            cursor: 'pointer'
                        }} onClick={() => { if(playStrikingBowl) playStrikingBowl(100); setActiveChapter(i); }} />
                    ))}
                </div>

                {/* Sub-Surface Tactile Geometry */}
                <SubSurfaceVisualCue chapterIndex={activeChapter} m={m} />

                {/* Sub-surface typographic echo */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`echo-${activeChapter}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.03, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ duration: 2 }}
                        style={{
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                            fontFamily: 'var(--fSerif)', fontSize: '25vw', fontStyle: 'italic', fontWeight: 700,
                            whiteSpace: 'nowrap', pointerEvents: 'none', color: m.accent, zIndex: 1,
                            letterSpacing: '-0.02em', lineHeight: 0.8
                        }}
                    >
                        {CHAPTERS[activeChapter].title.split(' ')[0]}
                    </motion.div>
                </AnimatePresence>

                {/* The Content Frame */}
                <div className="guide-scroll-area" ref={scrollRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', alignItems: 'center', height: '100%', width: '100%' }}>
                    <div className="guide-container" style={{ maxWidth: '1000px', width: '100%', padding: 'var(--space-xxl)', zIndex: 10, margin: 'auto' }}>
                        <AnimatePresence mode="wait">
                        <motion.div
                            key={activeChapter}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div style={{ fontFamily: 'var(--fMono)', color: m.accent, fontSize: '0.8rem', letterSpacing: '0.3em', marginBottom: 'var(--space-md)' }}>
                                {CHAPTERS[activeChapter].isCrossroads ? 'THE CROSSROADS' : `LORE CAPTURE // ${String(activeChapter + 1).padStart(2, '0')}`}
                            </div>
                            <h1 style={{ fontFamily: 'var(--fSerif)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontStyle: 'italic', lineHeight: 1.1, marginBottom: 'var(--space-sm)', color: m.text1 }}>
                                {CHAPTERS[activeChapter].title}
                            </h1>
                            <div style={{ fontFamily: 'var(--fMono)', fontSize: 'clamp(0.85rem, 3.5vw, 1.1rem)', color: m.text2, letterSpacing: '0.1em', marginBottom: 'var(--space-xl)', maxWidth: '90%' }}>
                                {CHAPTERS[activeChapter].subtitle}
                            </div>
                            
                            {!CHAPTERS[activeChapter].isCrossroads ? (
                                <p style={{ fontFamily: 'var(--fBody)', fontSize: 'clamp(1rem, 4vw, 1.15rem)', lineHeight: 1.7, letterSpacing: '0.01em', color: m.text1, opacity: 0.9, maxWidth: '680px', margin: '0 auto' }}>
                                    {CHAPTERS[activeChapter].content}
                                </p>
                            ) : (
                                <div className="guide-tier-grid" style={{ 
                                    display: 'flex', gap: 'var(--space-xl)', marginTop: 'var(--space-xl)', 
                                    paddingBottom: 'var(--space-xxl)'
                                }}>
                                    {/* Scrollbar styling injected via a simple style block or relying on global if they have one */}
                                    <style>{`
                                        ::-webkit-scrollbar { width: 4px; }
                                        ::-webkit-scrollbar-track { background: transparent; }
                                        ::-webkit-scrollbar-thumb { background: ${m.text2}40; border-radius: 4px; }
                                    `}</style>
                                    
                                    {/* Pathway A */}
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                                        <div style={{ fontFamily: 'var(--fMono)', color: m.accent, fontSize: '0.8rem', letterSpacing: '0.2em' }}>PATHWAY A: SELF-GUIDED</div>
                                        <div style={{ fontSize: '0.85rem', color: m.text2, fontStyle: 'italic', marginBottom: 'var(--space-sm)' }}>For the navigator ready to narrate the frequency of their own voice.</div>
                                        
                                        <TierCard 
                                            title="The Interactive Threshold" price="Free" 
                                            mechanism="Continued access to The Steeping Space. The Steeping Sage is here to offer wayfinding and CREATIVE STEEPING insights."
                                            buttonText="[ Begin the Practice ]"
                                            onClick={() => { if(playStrikingBowl) playStrikingBowl(40); onClose(); }}
                                        />
                                        <TierCard 
                                            title="The Journeyer" price="$44 / yr"
                                            mechanism="The complete immersive CREATIVE STEEPING course. Unrestricted access to Steeping Space tools, intelligent memories, placekeeping. Your pace and Session Notes are fully preserved."
                                            buttonText="[ Invest in the Arc ]"
                                            isLoading={checkoutLoading === 'journeyer'}
                                            onClick={() => handleCheckout('journeyer')}
                                        />
                                    </div>

                                    {/* Divider */}
                                    <div style={{ width: '1px', background: `linear-gradient(to bottom, transparent, ${m.text2}30, transparent)` }} />

                                    {/* Pathway B */}
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                                        <div style={{ fontFamily: 'var(--fMono)', color: m.accent, fontSize: '0.8rem', letterSpacing: '0.2em' }}>PATHWAY B: THE GUIDED DEEP WORK</div>
                                        <div style={{ fontSize: '0.85rem', color: m.text2, fontStyle: 'italic', marginBottom: 'var(--space-sm)' }}>For the navigator who knows that deep work requires witness.</div>
                                        
                                        <TierCard 
                                            title="Cohort Sessions" price="$777"
                                            mechanism="Seven essential steeps over nine weeks in virtual and Live containers with calendar access for scheduling and reminders. One live session per steep with Kamau's guidance along with up to twelve navigators."
                                            buttonText="[ Secure Your Seat ]"
                                            isLoading={checkoutLoading === 'cohort'}
                                            onClick={() => handleCheckout('cohort')}
                                        />
                                        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                                            <TierCard 
                                                title="Single Steep" price="$222"
                                                mechanism="A focused Bring Your Own Tea hour with CREATIVE STEEPING author and guide Kamau Zuberi Akabueze."
                                                buttonText="[ Schedule 1 ]"
                                                isLoading={checkoutLoading === 'single_steep_1'}
                                                onClick={() => handleCheckout('single_steep_1')}
                                                compact
                                            />
                                            <TierCard 
                                                title="Three-Part Arc" price="$600"
                                                mechanism="Available as a three-part arc. A focused Bring Your Own Tea hour with CREATIVE STEEPING author."
                                                buttonText="[ Schedule 3 ]"
                                                isLoading={checkoutLoading === 'single_steep_3'}
                                                onClick={() => handleCheckout('single_steep_3')}
                                                compact
                                            />
                                        </div>
                                        <TierCard 
                                            title="The Depth Semester" price="$2,222"
                                            mechanism="Full Steeping Space access and a three-month explorative Steeping Semester closing with your exclusive Creative Growth Brief :: a living document naming your essence, direction, and next move."
                                            buttonText="[ Secure Your Semester ]"
                                            isLoading={checkoutLoading === 'depth_semester'}
                                            onClick={() => handleCheckout('depth_semester')}
                                        />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
                </div>

                {/* Right Interactive Arrow - Hidden on last frame */}
                {activeChapter < CHAPTERS.length - 1 && (
                    <button 
                        className="guide-next-btn"
                        onClick={nextChapter}
                        style={{
                            position: 'absolute', right: 'var(--space-xl)', top: '50%', transform: 'translateY(-50%)',
                            background: 'none', border: 'none', color: m.accent, cursor: 'pointer', zIndex: 10,
                            padding: 'var(--space-md)', opacity: 0.6, transition: 'all 0.4s ease'
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = 1}
                        onMouseLeave={e => e.currentTarget.style.opacity = 0.6}
                    >
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </button>
                )}
            </div>
            
            <div className="guide-scrolling-defunct" style={{ position: 'absolute', bottom: 'var(--space-lg)', left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.text2, letterSpacing: '0.4em', opacity: 0.4, width: '100%', textAlign: 'center' }}>
                {CHAPTERS[activeChapter].isCrossroads ? 'CHOOSE YOUR ESSENCE. THE ARCHITECTURE AWAITS.' : 'SCROLLING DEFUNCT. USE ARCHITECTURE TO BREATHE.'}
            </div>
        </motion.div>
    );
};

