import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from './useAuth';

// A Visceral Text streaming component using Framer Motion staggered animations
const AnimatedText = ({ text, delayOffset = 0, speed = 0.05, className, style }) => {
    // Separate newlines into their own tokens so we can map them to <br />
    const tokens = text.replace(/\n/g, ' \n ').split(' ');
    return (
        <motion.div 
            className={className} 
            style={{ ...style, display: 'block', textAlign: 'left' }}
            initial="hidden"
            animate="visible"
            variants={{
                visible: { transition: { staggerChildren: speed, delayChildren: delayOffset } },
                hidden: {}
            }}
        >
            {tokens.map((token, i) => {
                if (token === '\n') return <br key={i} />;
                if (token === '') return null;
                return (
                    <motion.span 
                        key={i}
                        variants={{
                            hidden: { opacity: 0, filter: 'blur(4px)', y: 5 },
                            visible: { opacity: 1, filter: 'blur(0px)', y: 0 }
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{ display: 'inline-block', marginRight: '0.25em' }}
                    >
                        {token}
                    </motion.span>
                );
            })}
        </motion.div>
    );
};

export const VesselL2Detail = ({ vessel, modeString, playStrikingBowl, playHarmonicChord }) => {
    const { profile } = useAuth();
    const [progressionStage, setProgressionStage] = React.useState(0);
    const [ledgerActive, setLedgerActive] = React.useState(false);
    const spatialSeed = profile?.spatial_seed || 1;
    
    // Calculate ascendant frequency (higher pitch for later vessels)
    const vesselString = vessel.id.split('.')[1] || "0";
    const vesselNumber = vesselString.startsWith('W') ? 0 : parseInt(vesselString, 10);
    const ascendantPitch = 1 + (vesselNumber * 0.05);
    
    const m = {
        incandescent: { accent: "#d4922a", text1: "#fff0d9", text2: "#d4922a" },
        oceanic: { accent: "#38bdf8", text1: "#e0f2fe", text2: "#38bdf8" },
        emergent: { accent: "#e5e5e5", text1: "#ffffff", text2: "#a3a3a3" }
    }[modeString] || { accent: "#d4922a", text1: "#fff0d9", text2: "#d4922a" };

    const advanceProgression = () => {
        const nextStage = progressionStage + 1;
        setProgressionStage(nextStage);
        // The Chord Unfurling: 1 note for Root, 2 for Tend, 3 for final Ledger state
        if (playHarmonicChord) playHarmonicChord(ascendantPitch, 1, Math.min(nextStage, 3));
        else if (playStrikingBowl) playStrikingBowl(vesselNumber * 2 + 50);
    };

    const renderAffirmButton = (label) => (
        <motion.button 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.0 }}
            onClick={advanceProgression}
            style={{
                background: 'transparent', border: `1px solid ${m.accent}40`, 
                color: m.accent, fontFamily: 'var(--fMono)', fontSize: '0.75rem', 
                letterSpacing: '0.3em', padding: '0.5rem 1rem', marginTop: '1.5rem', 
                cursor: 'pointer', textTransform: 'uppercase'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = `${m.accent}20`; if(playStrikingBowl) playStrikingBowl(40); }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
            [ {label} ]
        </motion.button>
    );

    return (
        <div style={{ position: 'relative', width: '100%', minHeight: '60vh', display: 'flex', flexDirection: 'column' }}>
            {/* Title / Meta Bar (Removed coordinates HUD to avoid crowding) */}
            <div style={{ 
                fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.accent, 
                letterSpacing: '0.2em', marginBottom: 'var(--space-xl)',
                borderBottom: `1px solid ${m.accent}40`, paddingBottom: '0.5rem',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'
            }}>
                <span>{vessel.name.toUpperCase()}</span>
                <span style={{ opacity: 0.7 }}>SEED: 0{spatialSeed}</span>
            </div>

            {/* Stage 0: Visceral Invocation (Ember Illumination) */}
            <div style={{ minHeight: '6rem', marginBottom: 'var(--space-lg)' }}>
                <AnimatedText 
                    text={vessel.invocation} 
                    speed={0.1}
                    style={{ 
                        fontFamily: 'var(--fSerif)', fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', 
                        lineHeight: 1.2, fontStyle: 'italic', color: m.text1,
                        whiteSpace: 'pre-line',
                        textShadow: `0 0 15px ${m.accent}40, 0 0 30px ${m.accent}20`
                    }} 
                />
                {progressionStage === 0 && renderAffirmButton('BREATHE')}
            </div>

            {/* Stage 1: Visceral Body (Context/Reflection) */}
            {progressionStage >= 1 && (
                <motion.div 
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    style={{ minHeight: '10rem', marginBottom: 'var(--space-xl)' }}
                >
                    <AnimatedText 
                        text={vessel.body}
                        speed={0.02}
                        style={{ 
                            fontFamily: 'var(--fBody)', fontSize: '1.15rem', lineHeight: 1.8, color: m.text2,
                            fontStyle: 'normal'
                        }} 
                    />
                    {progressionStage === 1 && renderAffirmButton('LET IT ROOT')}
                </motion.div>
            )}

            {/* Stage 2: The Interaction (Ledger) */}
            {progressionStage >= 2 && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5 }}
                    style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}
                >
                    <h3 style={{ fontFamily: 'var(--fMono)', fontSize: '0.8rem', letterSpacing: '0.15em', color: m.accent, opacity: 0.8, marginBottom: 'var(--space-md)', textTransform: 'uppercase' }}>
                        The Steeping Ledger
                    </h3>
                    <AnimatedText 
                        text={vessel.interaction?.prompt}
                        speed={0.04}
                        style={{ fontFamily: 'var(--fBody)', fontSize: '1.1rem', color: m.text1, marginBottom: 'var(--space-md)' }}
                    />
                    {progressionStage === 2 && renderAffirmButton('TEND THE SOIL')}
                </motion.div>
            )}

            {/* Stage 3: Reflection Plume (Exercise concepts) */}
            {progressionStage >= 3 && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 2.0, ease: 'easeInOut' }}
                    style={{ marginBottom: 'var(--space-xl)', overflow: 'hidden' }}
                >
                    {vessel.reflection && vessel.reflection.length > 0 && (
                        <>
                            <h4 style={{ fontFamily: 'var(--fMono)', fontSize: '0.7rem', color: m.accent, opacity: 0.6, letterSpacing: '0.1em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                Exercise Concepts
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {vessel.reflection.map((ref, idx) => (
                                    <li key={idx} style={{ fontFamily: 'var(--fBody)', fontSize: '1.05rem', color: m.text2, marginBottom: 'var(--space-sm)', position: 'relative', paddingLeft: 'var(--space-md)' }}>
                                        <span style={{ position: 'absolute', left: 0, color: m.accent }}>•</span>
                                        {ref}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </motion.div>
            )}

            {/* Ledger Input Field (Always visible once Stage 2 is reached, but only fully interactive after) */}
            {progressionStage >= 2 && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    style={{ position: 'relative' }}
                >
                    <div style={{ position: 'absolute', top: '-20px', right: 0, fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.accent, opacity: ledgerActive ? 0.8 : 0, transition: 'opacity 0.5s', letterSpacing: '0.1em' }}>
                        [ STATE: CULTIVATION ]
                    </div>
                    <textarea
                        id={`ledger-${vessel.id}`}
                        placeholder={vessel.interaction?.placeholder}
                        className="steeping-textarea"
                        rows={1}
                        onFocus={() => { setLedgerActive(true); if (playHarmonicChord) playHarmonicChord(ascendantPitch); }}
                        onInput={(e) => {
                            e.target.style.height = "auto";
                            e.target.style.height = e.target.scrollHeight + "px";
                        }}
                        onKeyDown={(e) => {
                            if (e.key.length === 1 && playStrikingBowl) playStrikingBowl(e.keyCode);
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                document.getElementById(`plant-btn-${vessel.id}`)?.click();
                            }
                        }}
                        style={{
                            width: '100%', background: 'transparent', border: 'none',
                            borderBottom: `1px solid ${ledgerActive ? m.text1 : m.text2}`, paddingBottom: '1rem', outline: 'none',
                            color: m.text1, fontFamily: 'var(--fBody)', fontStyle: 'italic', fontSize: '1.4rem', fontWeight: 'bold',
                            resize: 'none', overflow: 'hidden', transition: 'border-color 0.5s'
                        }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-md)' }}>
                        <span style={{ fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.text2, opacity: ledgerActive ? 0.6 : 0, transition: 'opacity 0.5s' }}>
                            Press ENTER to root your reflection (Shift+Enter for new line)
                        </span>
                        <button 
                            id={`plant-btn-${vessel.id}`}
                            onClick={(e) => {
                                const val = document.getElementById(`ledger-${vessel.id}`).value;
                                if(val.trim() === '') return;
                                e.currentTarget.innerText = '[ REFLECTION ROOTED ]';
                                e.currentTarget.style.color = m.text1;
                                if (playStrikingBowl) playStrikingBowl(20);
                                setTimeout(() => {
                                    e.currentTarget.innerText = '[ ROOT REFLECTION ]';
                                    e.currentTarget.style.color = m.accent;
                                }, 3000);
                            }}
                            style={{
                                background: 'transparent', border: `1px solid ${m.accent}`, color: m.accent,
                                fontFamily: 'var(--fMono)', fontSize: '0.7rem', padding: '6px 14px', cursor: 'pointer',
                                opacity: ledgerActive ? 1 : 0.4, transition: 'all 0.5s', letterSpacing: '0.15em'
                            }}
                        >
                            [ ROOT REFLECTION ]
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};
