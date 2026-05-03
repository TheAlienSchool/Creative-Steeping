import React, { useState, useEffect } from 'react';

const CATALYSTS = [
    "Efficiency accelerates fatigue. Steeping cultivates resonance.",
    "Thoughts moving at the speed of the algorithm belong to the machine. Reclaim your rhythm.",
    "The water receives you as the leaf. What flavor are you infusing into the hour?",
    "Procrastination is avoidance. Steeping is active preparation.",
    "You are the space you have been rushing toward.",
    "Your behavior is moving faster than your clarity. Let the water boil.",
    "Original thought operates at the pace of life. Allow the water its natural flow.",
    "Original thought requires incubation.",
    "Safety through the speed of our output."
];

export const StillnessCatalyst = ({ m }) => {
    const [idleTime, setIdleTime] = useState(0);
    const [activeNote, setActiveNote] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Reset idle timer on any movement or key press
        const resetIdle = () => {
            setIdleTime(0);
            setIsVisible(false); // Fade out the note if they move
        };

        window.addEventListener('mousemove', resetIdle);
        window.addEventListener('keydown', resetIdle);
        window.addEventListener('click', resetIdle);

        const interval = setInterval(() => {
            setIdleTime(prev => {
                const nextTime = prev + 1;
                // Trigger a note after exactly 75 seconds of stillness
                if (nextTime === 75) {
                    const randomIndex = Math.floor(Math.random() * CATALYSTS.length);
                    setActiveNote(CATALYSTS[randomIndex]);
                    setIsVisible(true);
                }
                return nextTime;
            });
        }, 1000);

        return () => {
            window.removeEventListener('mousemove', resetIdle);
            window.removeEventListener('keydown', resetIdle);
            window.removeEventListener('click', resetIdle);
            clearInterval(interval);
        };
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: '4.5rem', // Emerge beneath the upper-left crest
            left: '2rem',
            width: '260px', // Constrain width tighter to avoid Hexagong collision
            textAlign: 'left',
            pointerEvents: 'none',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 3.6s cubic-bezier(0.16, 1, 0.3, 1)',
            zIndex: 50,
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start'
        }}>
            {/* The Breathing Fog Layer */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '20%', // Shifted to match left-align anchor
                width: '400px',
                height: '15rem',
                background: m ? `radial-gradient(ellipse at center, ${m.bg.replace('0.05', '0.95')} 0%, ${m.bg.replace('0.05', '0.7')} 30%, transparent 70%)` : 'radial-gradient(ellipse at center, rgba(0,0,0,0.9) 0%, transparent 70%)',
                animation: isVisible ? 'breathe-fog 10s ease-in-out infinite alternate' : 'none',
                zIndex: -1,
                pointerEvents: 'none',
            }} />

            {/* The Floating Text Layer */}
            <div style={{
                fontFamily: 'var(--fBody)',
                fontSize: '1.05rem', // Rescaled from 1.4rem
                fontStyle: 'italic',
                color: m ? m.text1 : '#fff',
                textShadow: m ? `0 0 10px ${m.accent}60, 0 0 16px rgba(0,0,0,1)` : '0 0 16px rgba(0,0,0,1)',
                letterSpacing: '0.04em',
                lineHeight: 1.6,
                padding: '0.5rem',
                display: 'inline-block',
                maxWidth: '250px',
                animation: isVisible ? 'float-catalyst 6s ease-in-out infinite alternate' : 'none',
            }}>
                {activeNote}
            </div>

            <style>{`
                @keyframes breathe-fog {
                    0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
                    100% { transform: translate(-50%, -50%) scale(1.3); opacity: 1; filter: contrast(1.1); }
                }
                @keyframes float-catalyst {
                    0% { transform: translateY(6px); }
                    100% { transform: translateY(-6px); }
                }
            `}</style>
        </div>
    );
};
