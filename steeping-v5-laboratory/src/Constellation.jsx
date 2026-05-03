import React, { useMemo } from 'react';

// Simple pseudo-random number generator for deterministic rendering
const random = (seed) => {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
};

export function Constellation({ seedString }) {
    const stars = useMemo(() => {
        const seedVal = parseInt(seedString, 10) || 1;
        const pts = [];
        let rSeed = seedVal * 13.37;

        // Generate a unique field of 40-80 stars based on the vessel number
        const numStars = 40 + Math.floor(random(rSeed++) * 40);

        for (let i = 0; i < numStars; i++) {
            pts.push({
                x: random(rSeed++) * 100,
                y: random(rSeed++) * 100,
                r: random(rSeed++) * 1.5 + 0.5,
                opacity: random(rSeed++) * 0.7 + 0.1,
                delay: random(rSeed++) * -10 // Randomize animation phase
            });
        }

        return {
            points: pts,
            // Unique nebula color hue range depending on vessel
            hue: Math.floor(random(rSeed++) * 360),
            center: {
                x: random(rSeed++) * 50 + 25,
                y: random(rSeed++) * 50 + 25
            }
        };
    }, [seedString]);

    return (
        <svg
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -1,
                pointerEvents: 'none',
                mixBlendMode: 'screen'
            }}
        >
            <defs>
                <radialGradient id={`nebula-${seedString}`} cx={`${stars.center.x}%`} cy={`${stars.center.y}%`} r="60%">
                    <stop offset="0%" stopColor={`hsla(${stars.hue}, 60%, 40%, 0.12)`} />
                    <stop offset="100%" stopColor="transparent" />
                </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill={`url(#nebula-${seedString})`} />

            {stars.points.map((s, i) => (
                <circle
                    key={i}
                    cx={`${s.x}%`}
                    cy={`${s.y}%`}
                    r={s.r}
                    fill="var(--t1)"
                    opacity={s.opacity}
                    style={{
                        animation: `floatUp ${4 + s.opacity * 4}s infinite alternate ease-in-out`,
                        animationDelay: `${s.delay}s`
                    }}
                />
            ))}
        </svg>
    );
}
