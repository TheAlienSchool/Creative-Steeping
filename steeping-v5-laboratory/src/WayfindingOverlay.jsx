import React, { useState, useEffect, useLayoutEffect, useMemo, useRef } from 'react';

const MOBILE_BREAKPOINT = 768;

const SEEN_KEY = 'steeping-space:orientation-seen';

function getSeenSlideIds() {
    try { return JSON.parse(localStorage.getItem(SEEN_KEY) || '[]'); } catch (e) { return []; }
}
function markSlideSeen(id) {
    if (!id) return;
    try {
        const seen = new Set(getSeenSlideIds());
        seen.add(id);
        localStorage.setItem(SEEN_KEY, JSON.stringify([...seen]));
    } catch (e) {}
}

// Shared diagram for icon-based slides — a glowing disc with a slow rotating ring,
// scaled to genuinely fill the 600x600 frame rather than sit small at its center.
const makeIconDiagram = (icon, label, noteValue) => (m, playStrikingBowl) => (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '32px' }}>
        <div style={{ position: 'relative', width: '68%', maxWidth: '260px', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', width: '140%', height: '140%', borderRadius: '50%', background: `radial-gradient(circle, ${m.glow} 0%, transparent 70%)` }} />
            <div
                style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: `1px dashed ${m.accent}45`, animation: 'wayfindingSpin 26s linear infinite' }}
                onAnimationIteration={() => playStrikingBowl && playStrikingBowl(noteValue)}
            />
            <div style={{
                position: 'relative', width: '72%', height: '72%', borderRadius: '50%',
                border: `1px solid ${m.accent}70`, background: `${m.cardBg}90`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 60px ${m.glow}`
            }}>
                <span style={{ fontFamily: 'var(--fSerif)', fontSize: '3.4rem', fontStyle: 'italic', color: m.accent }}>{icon}</span>
            </div>
        </div>
        <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.65rem', letterSpacing: '0.25em', color: m.text2, textTransform: 'uppercase' }}>{label}</div>
    </div>
);

// The three original static slides — content bug-fixed (vessel count, "Your Architecture" naming)
const STATIC_SLIDES = [
    {
        id: 'pause-architecture',
        layer: "LAYER 01",
        title: "The Architecture of the Pause",
        subtitle: "The Cognitive Lattice",
        description: "This portal is a private instrument for thought in progress. The longer you reflect, engage, and connect, the more your attention deepens, and the more your Resonance Imprint grows across the practice.",
        diagram: (m, playStrikingBowl) => (
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ position: 'absolute', width: '96%', height: '96%', borderRadius: '50%', background: `radial-gradient(circle, ${m.glow} 0%, transparent 72%)` }} />
                <div style={{ position: 'absolute', width: '86%', height: '86%', border: `1px solid ${m.text2}25`, borderRadius: '50%' }} />
                <div style={{ position: 'absolute', width: '64%', height: '64%', border: `1px solid ${m.text2}45`, borderRadius: '50%' }} />
                <div style={{ position: 'absolute', width: '42%', height: '42%', border: `1px solid ${m.accent}55`, borderRadius: '50%' }} />
                <div
                    style={{
                        width: '20%', height: '20%', borderRadius: '50%',
                        background: `radial-gradient(circle, ${m.accent} 0%, ${m.accent}00 75%)`,
                        animation: 'wayfindingPulse 5s ease-in-out infinite'
                    }}
                    onAnimationIteration={() => playStrikingBowl && playStrikingBowl(10)}
                />

                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                    <line x1="18%" y1="22%" x2="50%" y2="50%" stroke={`${m.accent}30`} strokeWidth="1" />
                    <line x1="82%" y1="78%" x2="50%" y2="50%" stroke={`${m.text2}30`} strokeWidth="1" />
                </svg>

                <div style={{ position: 'absolute', left: '8%', top: '12%', fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.accent }}>[01.A] SANCTUARY</div>
                <div style={{ position: 'absolute', right: '8%', bottom: '12%', fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.text2 }}>[01.B] RESONANCE</div>
            </div>
        )
    },
    {
        id: 'engaging-hexagong',
        layer: "LAYER 02",
        title: "Engaging the Hexagong",
        subtitle: "The Two-Column Architecture",
        description: "The Hexagong is a chapter in the Creative Steeping journey which holds your reflections like a teapot holds the tea leaf's potent flavors. Each one you open holds progressive guidance, insight prompts, and the song of who you are as you share the flavor of your being.",
        diagram: (m, playStrikingBowl) => (
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ position: 'absolute', width: '82%', height: '82%', borderRadius: '50%', background: `radial-gradient(circle, ${m.glow} 0%, transparent 72%)` }} />
                <svg viewBox="0 0 200 200" style={{ width: '82%', height: '82%', overflow: 'visible' }}>
                    {/* Handle */}
                    <path d="M 42 92 C 14 90, 12 134, 42 131" fill="none" stroke={m.text2} strokeWidth="2" strokeLinecap="round" opacity="0.75" />
                    {/* Body */}
                    <ellipse cx="82" cy="114" rx="46" ry="35" fill={`${m.accent}0d`} stroke={m.accent} strokeWidth="2" />
                    {/* Lid */}
                    <ellipse cx="82" cy="76" rx="18" ry="7" fill="none" stroke={m.accent} strokeWidth="2" />
                    <circle cx="82" cy="66" r="4" fill={m.accent} />
                    {/* Spout */}
                    <path d="M 122 102 C 150 96, 160 74, 153 57" fill="none" stroke={m.accent} strokeWidth="2" strokeLinecap="round" />
                    {/* Pour stream */}
                    <path d="M 153 59 C 155 88, 149 118, 151 146" fill="none" stroke={`${m.accent}90`} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1 5" />
                    {/* Cup */}
                    <path d="M 135 150 L 168 150 L 161 180 L 141 180 Z" fill="none" stroke={m.text2} strokeWidth="2" />
                    {/* Rising steam — the resonance wisps */}
                    <path
                        d="M 145 147 C 138 126, 152 110, 144 86" fill="none" stroke={m.text2} strokeWidth="1.5" strokeLinecap="round" opacity="0.55"
                        style={{ animation: 'wayfindingFade 4.5s ease-in-out infinite' }}
                        onAnimationIteration={() => playStrikingBowl && playStrikingBowl(25)}
                    />
                    <path d="M 158 147 C 165 128, 153 108, 160 84" fill="none" stroke={m.text2} strokeWidth="1.5" strokeLinecap="round" opacity="0.35"
                        style={{ animation: 'wayfindingFade 4.5s ease-in-out infinite 1.4s' }} />
                </svg>
                <div style={{ position: 'absolute', left: '8%', top: '10%', fontFamily: 'var(--fMono)', fontSize: '0.6rem', color: m.accent }}>[02.A] THE VESSEL</div>
                <div style={{ position: 'absolute', right: '8%', bottom: '10%', fontFamily: 'var(--fMono)', fontSize: '0.6rem', color: m.text2 }}>[02.B] WHAT STEEPS</div>
            </div>
        )
    },
    {
        id: 'sonic-awareness',
        layer: "LAYER 03",
        title: "Sonic Awareness",
        subtitle: "Using Sound & Time",
        description: "The entire portal responds to you :: each keystroke and click creates a vibrational map of your most notable reflections, and your movements interact with surfaces that sing. Your words become gong strikes in this signature sound bath.",
        diagram: (m, playStrikingBowl) => (
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ position: 'absolute', width: '92%', height: '92%', borderRadius: '50%', background: `radial-gradient(circle, ${m.glow} 0%, transparent 70%)` }} />
                <svg style={{ position: 'absolute', width: '94%', height: '94%' }} viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M 0 58 Q 25 30 50 58 T 100 58" fill="none" stroke={`${m.text2}30`} strokeWidth="1" />
                    <path d="M 0 68 Q 30 88 60 68 T 100 68" fill="none" stroke={`${m.text2}22`} strokeWidth="1" />
                    <path d="M 0 46 Q 40 16 70 46 T 100 46" fill="none" stroke={`${m.accent}85`} strokeWidth="1.5" />
                    {[14, 38, 62, 86].map((x, i) => (
                        <circle key={i} cx={x} cy={46 - Math.sin(i * 1.4) * 10} r="1.3" fill={m.accent}
                            style={{ animation: `wayfindingFade ${3 + i * 0.5}s ease-in-out infinite ${i * 0.3}s` }} />
                    ))}
                </svg>
                <div
                    style={{ position: 'absolute', top: '40%', left: '40%', width: '20%', height: '20%', borderRadius: '50%', border: `1px solid ${m.accent}`, boxShadow: `0 0 40px ${m.glow}`, animation: 'wayfindingPulse 4s ease-in-out infinite' }}
                    onAnimationIteration={() => playStrikingBowl && playStrikingBowl(40)}
                />
                <div style={{ position: 'absolute', top: '46.5%', left: '46.5%', width: '5%', height: '5%', background: m.accent, borderRadius: '50%' }} />

                <div style={{ position: 'absolute', left: '8%', bottom: '10%', fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.accent }}>[03.A] 528HZ TUNING</div>
                <div style={{ position: 'absolute', right: '8%', top: '10%', fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.text2 }}>[03.B] THE EYE OF THE SAGE</div>
            </div>
        )
    }
];

// Breadth slides — the "reasons to stay" content, added for the expanded orientation
const BREADTH_SLIDES = [
    {
        id: 'compass',
        layer: "LAYER 04",
        title: "Me in 5D",
        subtitle: "Your Biometric Compass",
        description: "You may be a multidimensional being, and Creative Steeping appreciates your many sides, shapes, and moods. Me in 5D is a personal diagnostic, and each dimension you share creates a tone of truth for you to experience as yours.",
        diagram: (m, playStrikingBowl) => (
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div
                    style={{ position: 'absolute', width: '92%', height: '92%', borderRadius: '50%', background: `radial-gradient(circle, ${m.glow} 0%, transparent 68%)`, animation: 'wayfindingPulse 6s ease-in-out infinite' }}
                    onAnimationIteration={() => playStrikingBowl && playStrikingBowl(55)}
                />
                <svg style={{ position: 'absolute', width: '84%', height: '84%' }} viewBox="0 0 100 100">
                    <defs>
                        <radialGradient id="compassFill" cx="50%" cy="45%" r="60%">
                            <stop offset="0%" stopColor={m.accent} stopOpacity="0.35" />
                            <stop offset="100%" stopColor={m.accent} stopOpacity="0.05" />
                        </radialGradient>
                    </defs>
                    {[0, 1, 2, 3, 4].map(i => {
                        const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                        const x = 50 + 42 * Math.cos(angle);
                        const y = 50 + 42 * Math.sin(angle);
                        return <line key={i} x1="50" y1="50" x2={x} y2={y} stroke={`${m.text2}35`} strokeWidth="0.5" strokeDasharray="2 2" />;
                    })}
                    <polygon points="50,10 82,36 70,76 30,76 18,36" fill="none" stroke={`${m.text2}55`} strokeWidth="0.6" />
                    <polygon points="50,24 68,42 60,68 40,68 32,42" fill="url(#compassFill)" stroke={m.accent} strokeWidth="1.2" />
                </svg>
                <div style={{ position: 'absolute', left: '8%', top: '10%', fontFamily: 'var(--fMono)', fontSize: '0.6rem', color: m.accent }}>[04.A] FIVE AXES</div>
                <div style={{ position: 'absolute', right: '8%', bottom: '10%', fontFamily: 'var(--fMono)', fontSize: '0.6rem', color: m.text2 }}>[04.B] YOUR SHAPE</div>
            </div>
        )
    },
    {
        id: 'ledger',
        layer: "LAYER 05",
        title: "Steeping Notes",
        subtitle: "The Archive of Insight",
        description: "This is the thinking inspired by steeping. The ongoing notes of Kamau Zuberi Akabueze — Creative Steeping's founder — transformed into interactive editorials with practices, concepts, inquiries, and ideas from the grounded to the mystic.",
        diagram: (m, playStrikingBowl) => (
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ position: 'absolute', width: '80%', height: '80%', borderRadius: '50%', background: `radial-gradient(circle, ${m.glow} 0%, transparent 72%)` }} />
                {/* Stacked pages, receding depth */}
                <div style={{ position: 'relative', width: '58%', height: '68%' }}>
                    {[3, 2, 1].map(depth => (
                        <div key={depth} style={{
                            position: 'absolute', inset: 0,
                            transform: `translate(${depth * 6}px, ${depth * -6}px)`,
                            border: `1px solid ${m.text2}${depth === 1 ? '50' : '25'}`,
                            background: `${m.cardBg}${depth === 1 ? 'e0' : '80'}`
                        }} />
                    ))}
                    <div
                        style={{ position: 'absolute', inset: 0, border: `1px solid ${m.accent}80`, background: `${m.surface}f0`, boxShadow: `0 0 40px ${m.glow}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '14px', padding: '18%', animation: 'wayfindingFade 6s ease-in-out infinite' }}
                        onAnimationIteration={() => playStrikingBowl && playStrikingBowl(15)}
                    >
                        {[92, 68, 80, 50].map((w, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: i === 0 ? m.accent : `${m.text2}70` }} />
                                <div style={{ width: `${w}%`, height: '6px', background: i === 0 ? `${m.accent}60` : `${m.text2}30` }} />
                            </div>
                        ))}
                    </div>
                    {/* Dog-eared corner */}
                    <div style={{ position: 'absolute', top: 0, right: `-6px`, width: '18px', height: '18px', background: m.bg, borderLeft: `1px solid ${m.accent}80`, borderBottom: `1px solid ${m.accent}80`, transform: 'rotate(0deg)', clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
                </div>
                <div style={{ position: 'absolute', right: '8%', bottom: '9%', fontFamily: 'var(--fMono)', fontSize: '0.6rem', color: m.text2 }}>[05.A] THE REGISTRY</div>
            </div>
        )
    },
    {
        id: 'sound-of-becoming',
        layer: "LAYER 06",
        title: "The Sound of Becoming",
        subtitle: "The Mechanism Behind the Metaphor",
        description: "There's a neuroscience essay and experience within the sounds of this practice portal :: take a moment to learn why writing and hearing your own words simultaneously — especially in curated frequency — is a uniquely healthy disengagement from the modern noise factories of daily life.",
        cta: { label: 'OPEN THE ESSAY', noteId: 'sound-of-becoming' },
        diagram: (m, playStrikingBowl) => (
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ position: 'absolute', width: '96%', height: '96%', borderRadius: '50%', background: `radial-gradient(circle, ${m.glow} 0%, transparent 68%)` }} />
                <svg style={{ position: 'absolute', width: '90%', height: '90%' }} viewBox="0 0 100 100">
                    {/* Frequency dial ticks */}
                    {Array.from({ length: 24 }).map((_, i) => {
                        const angle = (Math.PI * 2 * i) / 24;
                        const inner = 44, outer = i % 6 === 0 ? 48 : 46.5;
                        return (
                            <line key={i}
                                x1={50 + inner * Math.cos(angle)} y1={50 + inner * Math.sin(angle)}
                                x2={50 + outer * Math.cos(angle)} y2={50 + outer * Math.sin(angle)}
                                stroke={`${m.text2}${i % 6 === 0 ? '70' : '35'}`} strokeWidth="0.6"
                            />
                        );
                    })}
                </svg>
                {[1, 2, 3].map(i => (
                    <div key={i} style={{
                        position: 'absolute', width: `${i * 26}%`, height: `${i * 26}%`,
                        borderRadius: '50%',
                        border: `1px solid ${m.accent}${i === 1 ? '90' : '35'}`,
                        opacity: i === 1 ? 1 : 0.6 / i,
                        animation: `wayfindingPulse ${4 + i}s ease-in-out infinite`
                    }}
                        onAnimationIteration={i === 1 ? () => playStrikingBowl && playStrikingBowl(60) : undefined}
                    />
                ))}
                <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.75rem', color: m.accent, letterSpacing: '0.15em' }}>528HZ</div>
                <div style={{ position: 'absolute', left: '9%', bottom: '9%', fontFamily: 'var(--fMono)', fontSize: '0.6rem', color: m.text2 }}>[06.A] RESONANCE, NAMED</div>
            </div>
        )
    },
    {
        id: 'nav-menu',
        layer: "LAYER 07",
        title: "Everything, One Click Away",
        subtitle: "The Hamburger Menu",
        description: "Steeping Notes. Me in 5D. Your Program Details. Your Guide to the Steeperverse. About Creative Steeping. Every door opens from the same small icon, top right corner, everpresent and one click away.",
        diagram: makeIconDiagram('☰', 'ALWAYS PRESENT', 5)
    },
    {
        id: 'timer',
        layer: "LAYER 08",
        title: "Permission to Pause",
        subtitle: "5, 15, 22 Minutes",
        description: "Set a timer at the lower left (5, 15, or 22 minutes) for an Active Pause whenever you need one. Omnipresent pauses are available in life, and these steeping timers offer your original frequencies for your pause in motion.",
        diagram: makeIconDiagram('◐', 'ACTIVE PAUSE', 35)
    },
    {
        id: 'hexagong-depth',
        layer: "LAYER 09",
        title: "More Than the Prompts",
        subtitle: "Nine Vessels, Nine Depths",
        description: "Each of the nine Hexagongs you encounter holds its own inquiry, its own tone, its own sonic signature :: what waits in Hexagong 00 differs entirely from what waits in Hexagong 08. The depth of one's practice unlocks the depth of one's experience.",
        diagram: (m, playStrikingBowl) => {
            const hexPoints = (cx, cy, r) => Array.from({ length: 6 }, (_, i) => {
                const a = (Math.PI / 3) * i - Math.PI / 2;
                return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
            }).join(' ');
            const cluster = [
                { cx: 38, cy: 58, r: 20, op: '30' },
                { cx: 66, cy: 34, r: 15, op: '35' },
                { cx: 70, cy: 68, r: 17, op: '40' },
                { cx: 30, cy: 28, r: 13, op: '30' },
            ];
            return (
                <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ position: 'absolute', width: '94%', height: '94%', borderRadius: '50%', background: `radial-gradient(circle, ${m.glow} 0%, transparent 70%)` }} />
                    <svg style={{ position: 'absolute', width: '88%', height: '88%' }} viewBox="0 0 100 100">
                        {cluster.map((h, i) => (
                            <polygon key={i} points={hexPoints(h.cx, h.cy, h.r)} fill="none" stroke={`${m.text2}${h.op}`} strokeWidth="0.8" />
                        ))}
                        <polygon
                            points={hexPoints(52, 50, 24)} fill={`${m.accent}12`} stroke={m.accent} strokeWidth="1.4"
                            style={{ animation: 'wayfindingFade 5s ease-in-out infinite' }}
                            onAnimationIteration={() => playStrikingBowl && playStrikingBowl(70)}
                        />
                    </svg>
                    <div style={{ position: 'absolute', left: '8%', top: '10%', fontFamily: 'var(--fMono)', fontSize: '0.6rem', color: m.accent }}>[09.A] THE CLUSTER</div>
                    <div style={{ position: 'absolute', right: '8%', bottom: '10%', fontFamily: 'var(--fMono)', fontSize: '0.6rem', color: m.text2 }}>[09.B] NINE, EACH ITS OWN</div>
                </div>
            );
        }
    }
];

const CORE_TEASER_ORDER = ['compass', 'ledger', 'sound-of-becoming', 'hexagong-depth'];

const FULL_SLIDES = [...STATIC_SLIDES, ...BREADTH_SLIDES];

export const WayfindingOverlay = ({ m, onClose, playStrikingBowl, activeVessel, mode = 'core', onOpenNote }) => {
    // 1. Calculate Historical Depth
    let historicalDepth = 0;
    try {
        historicalDepth = JSON.parse(localStorage.getItem('steeping_historical_score') || '[]').length;
    } catch(e) {}

    // 2. Generate Context-Aware Cartographic Slide
    const contextSlide = {
        id: 'you-are-here',
        layer: "LAYER 00",
        title: "Here is Where You Are",
        subtitle: activeVessel ? `Inside Hexagong ${activeVessel.num}` : "The Matrix Overview",
        description: activeVessel
            ? `You are inside ${activeVessel.name}. The Steeping Sage on the left holds full context for this vessel. Your Architecture is on the right. Take your time here :: the space is patient.`
            : `Welcome to a new relationship with your words as they become song with every keystroke of your inner narrative. Creative Steeping is an immersive dialogue with the self and the symphony of our becoming.`,
        diagram: (m, playStrikingBowl) => (
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {/* Ambient field */}
                <div style={{ position: 'absolute', width: '96%', height: '96%', borderRadius: '50%', background: `radial-gradient(circle, ${m.glow} 0%, transparent 68%)` }} />

                {/* The Radar / Compass */}
                <div
                    style={{ position: 'absolute', width: '78%', height: '78%', border: `1px dashed ${m.text2}40`, borderRadius: '50%', animation: 'wayfindingSpin 30s linear infinite' }}
                    onAnimationIteration={() => playStrikingBowl && playStrikingBowl(20)}
                >
                    <div style={{
                        position: 'absolute', top: '-2px', left: '50%', width: '22px', height: '22px', borderRadius: '50%',
                        transform: 'translateX(-50%)',
                        background: `radial-gradient(circle, ${m.accent} 0%, ${m.accent}00 75%)`
                    }} />
                </div>
                <div style={{ position: 'absolute', width: '58%', height: '58%', border: `1px solid ${m.text2}30`, borderRadius: '50%', animation: 'wayfindingSpin 20s linear infinite reverse' }} />
                <div style={{ position: 'absolute', width: '38%', height: '38%', border: `1px solid ${m.accent}35`, borderRadius: '50%' }} />

                {/* Crosshairs */}
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                    <line x1="50%" y1="12%" x2="50%" y2="88%" stroke={`${m.accent}45`} strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="12%" y1="50%" x2="88%" y2="50%" stroke={`${m.text2}40`} strokeWidth="1" />
                </svg>

                {/* You Are Here Data */}
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
                    <div style={{ position: 'absolute', inset: '-30%', borderRadius: '50%', background: `radial-gradient(circle, ${m.glow} 0%, transparent 70%)`, zIndex: -1 }} />
                    <div style={{ fontFamily: 'var(--fMono)', fontSize: '2.6rem', color: m.accent, textShadow: `0 0 20px ${m.bg}` }}>
                        {activeVessel ? `V.${activeVessel.num}` : `L.${historicalDepth}`}
                    </div>
                </div>

                {/* Infographic Labels */}
                <div style={{ position: 'absolute', left: '9%', top: '13%', fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.accent, textTransform: 'uppercase' }}>[00.A] LAT / LONG</div>
                <div style={{ position: 'absolute', right: '9%', bottom: '13%', fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.text2, textTransform: 'uppercase' }}>[00.B] DEPTH = {historicalDepth}</div>
            </div>
        )
    };

    // 3. Assemble the deck for this mode
    const coreTeaser = BREADTH_SLIDES.find(s => s.id === CORE_TEASER_ORDER[historicalDepth % CORE_TEASER_ORDER.length]);
    const CORE_SLIDES = [...STATIC_SLIDES, coreTeaser];

    const orderedFullSlides = useMemo(() => {
        if (mode !== 'full') return FULL_SLIDES;
        const seenIds = new Set(getSeenSlideIds());
        const unseen = FULL_SLIDES.filter(s => !seenIds.has(s.id));
        const seen = FULL_SLIDES.filter(s => seenIds.has(s.id));
        return [...unseen, ...seen];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    const dynamicSlides = [contextSlide, ...(mode === 'full' ? orderedFullSlides : CORE_SLIDES)];

    const [currentSlide, setCurrentSlide] = useState(0);
    const [animating, setAnimating] = useState(false);
    const textColRef = useRef(null);
    const [showScrollHint, setShowScrollHint] = useState(false);

    // Initial mount animation
    useEffect(() => {
        if (playStrikingBowl) playStrikingBowl(100); // Grand entrance sound
    }, []);

    // Mobile only: the text column keeps its scrollable fallback (App.css:665-669),
    // unlike the desktop no-scroll layout above, so give it a hint there's more below.
    useLayoutEffect(() => {
        const checkOverflow = () => {
            const col = textColRef.current;
            if (!col || window.innerWidth > MOBILE_BREAKPOINT) { setShowScrollHint(false); return; }
            setShowScrollHint(col.scrollHeight - col.scrollTop - col.clientHeight > 12);
        };
        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [currentSlide]);

    const advance = (nextIndex) => {
        if (animating) return;
        setAnimating(true);
        const leaving = dynamicSlides[currentSlide];
        if (leaving && leaving.id !== 'you-are-here') markSlideSeen(leaving.id);
        setTimeout(() => {
            setCurrentSlide(nextIndex);
            setAnimating(false);
        }, 600);
    };

    const handleNext = () => {
        if (playStrikingBowl) playStrikingBowl(60);
        advance((currentSlide + 1) % dynamicSlides.length);
    };

    const handlePrev = () => {
        if (playStrikingBowl) playStrikingBowl(50);
        advance((currentSlide - 1 + dynamicSlides.length) % dynamicSlides.length);
    };

    const slide = dynamicSlides[currentSlide];

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100dvh',
            backgroundColor: m.bg, zIndex: 99999,
            display: 'flex', flexDirection: 'column',
            animation: 'fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            color: m.text1
        }}>
            <style>{`
                @keyframes wayfindingScrollHintBounce {
                    0%, 100% { transform: translateY(0); opacity: 0.85; }
                    50% { transform: translateY(6px); opacity: 1; }
                }
                @keyframes wayfindingPulse {
                    0%, 100% { transform: scale(1); opacity: 0.55; }
                    50% { transform: scale(1.15); opacity: 1; }
                }
                @keyframes wayfindingSpin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes wayfindingFade {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.75; }
                }
            `}</style>
            {/* Top Navigation Bar Component */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: 'var(--space-lg) var(--space-xl)', borderBottom: `1px solid ${m.text2}20`,
                fontFamily: 'var(--fMono)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.2em'
            }}>
                <div style={{ display: 'flex', gap: 'var(--space-xl)', opacity: 0.8 }}>
                    <span>CREÅTIVE STEEPING</span>
                    <span style={{ color: m.accent }}>{mode === 'full' ? 'STRUCTURAL MANUAL / FULL' : 'STRUCTURAL MANUAL / CORE'}</span>
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
            <div className="wayfinding-split" style={{
                flex: 1, display: 'flex', minHeight: 0,
                opacity: animating ? 0 : 1, transform: animating ? 'translateY(20px)' : 'translateY(0)',
                transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>

                {/* LEFT: Infographic Diagram */}
                <div className="wayfinding-diagram" style={{
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
                        {slide.diagram(m, playStrikingBowl)}
                    </div>
                </div>

                {/* RIGHT: Typography and Pedagogy — sized to fit without scrolling on desktop; see ORIENT-ME-EDITORIAL-DRAFT.md for the word-count analysis behind these sizes. Mobile keeps its scrollable fallback (App.css) with a scroll hint below. */}
                <div className="wayfinding-text" style={{ flex: 1, padding: '5% 9%', position: 'relative', display: 'flex', minHeight: 0 }}>
                    <div
                        className="wayfinding-text-inner"
                        ref={textColRef}
                        onScroll={() => {
                            const col = textColRef.current;
                            if (!col) return;
                            setShowScrollHint(window.innerWidth <= MOBILE_BREAKPOINT && (col.scrollHeight - col.scrollTop - col.clientHeight > 12));
                        }}
                        style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', overflow: 'hidden', minHeight: 0 }}
                    >
                        <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.75rem', letterSpacing: '0.3em', color: m.accent, marginBottom: '10px', flexShrink: 0 }}>
                            [ {slide.layer} ]
                        </div>

                        <h1 style={{
                            fontFamily: 'var(--fSerif)', fontSize: 'clamp(2.1rem, 3.6vw, 3.2rem)', fontStyle: 'italic',
                            lineHeight: 1.05, letterSpacing: '-0.02em', margin: '0 0 10px 0', color: m.text1, flexShrink: 0
                        }}>
                            {slide.title}
                        </h1>

                        <div style={{
                            fontFamily: 'var(--fMono)', fontSize: '0.85rem', letterSpacing: '0.1em',
                            color: m.text1, opacity: 0.8, marginBottom: '18px', textTransform: 'uppercase',
                            borderBottom: `2px solid ${m.accent}`, paddingBottom: '10px', display: 'inline-block', flexShrink: 0
                        }}>
                            {slide.subtitle}
                        </div>

                        <p style={{
                            fontFamily: 'var(--fBody)', fontSize: 'clamp(1.05rem, 1.5vw, 1.25rem)', lineHeight: 1.55, color: m.text2, maxWidth: '94%', margin: 0
                        }}>
                            {slide.description}
                        </p>

                        {slide.cta && onOpenNote && (
                            <button
                                onClick={() => { if (playStrikingBowl) playStrikingBowl(70); onOpenNote(slide.cta.noteId); }}
                                style={{
                                    alignSelf: 'flex-start', marginTop: '18px', flexShrink: 0,
                                    background: 'none', border: `1px solid ${m.accent}`, color: m.accent,
                                    padding: '9px 18px', fontFamily: 'var(--fMono)', fontSize: '0.68rem', letterSpacing: '0.2em',
                                    cursor: 'pointer', transition: 'all 0.4s ease'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = m.accent; e.currentTarget.style.color = m.bg; }}
                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = m.accent; }}
                            >
                                [ {slide.cta.label} ]
                            </button>
                        )}
                    </div>

                    {showScrollHint && (
                        <div style={{
                            position: 'absolute', left: 0, right: 0, bottom: '4%',
                            display: 'flex', justifyContent: 'center', pointerEvents: 'none'
                        }}>
                            <div style={{
                                width: '34px', height: '34px', borderRadius: '50%',
                                background: `${m.bg}cc`, border: `1px solid ${m.accent}80`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: m.accent, fontSize: '1rem', animation: 'wayfindingScrollHintBounce 1.6s ease-in-out infinite'
                            }}>
                                ↓
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Navigation / Pagination */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: 'var(--space-xl)', borderTop: `1px solid ${m.text2}20`
            }}>
                <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', maxWidth: '60%' }}>
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
