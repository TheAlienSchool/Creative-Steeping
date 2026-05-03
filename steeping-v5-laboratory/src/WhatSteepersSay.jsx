import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Quote, Sparkles } from 'lucide-react';

// Hardcoded initial seeds (from the Reviews document)
const SEEDED_REVIEWS = [
    {
        id: "seed-1",
        author_name: "Sallomé Hralima",
        author_title: "writer, filmmaker, mother, partner, friend",
        insight_text: "As a life-long journaler, I valued the invitation to sip tea and commune with my worth. Epiphanies unfolded, and the mythic narrative of my own genius brought me to tears. I experienced myself as a reliable source for wisdom and observed myself in the mirror of self-perception.",
        source: "seed"
    },
    {
        id: "seed-2",
        author_name: "Lisa Heinsdale",
        author_title: "Creative Synthesizer",
        insight_text: "What sets THE ÅLÏEN SCÖÕL and Creative Steeping apart is its emphasis on self-discovery and sustained growth. Kamau’s guidance is invaluable, and the process empowers you to take charge of your journey. The only thing standing between you and your next big idea is the courage to do the deep work.",
        source: "seed"
    },
    {
        id: "seed-3",
        author_name: "Anonymous ÅLÏEN",
        author_title: "Leader in Transition",
        insight_text: "Your guidance and support have had a profound impact on me, and I find myself reflecting on our conversations frequently. These insights continue to inspire me day to day as I orient myself towards growth, development, and love.",
        source: "seed"
    },
    {
        id: "seed-4",
        author_name: "Sylvia Baffour",
        author_title: "Emotional Intelligence Expert",
        insight_text: "The notion that 'what sets you apart does not set you apart from others….' is so beautifully said. Creative Steeping most certainly does guide folks to the 'heart of being'. This is really well written and easy to follow. Bravo to you!",
        source: "seed"
    }
];

export const WhatSteepersSay = ({ m }) => {
    const [gardenInsights, setGardenInsights] = useState(SEEDED_REVIEWS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGarden = async () => {
            try {
                // In a production environment with proper RLS, we'd fetch live insights here
                const { data, error } = await supabase
                    .from('what_steepers_say')
                    .select('*')
                    .eq('is_featured', true)
                    .order('created_at', { ascending: false })
                    .limit(10);
                
                if (!error && data && data.length > 0) {
                    // Prepend live db data to seeds (deduplicating if needed)
                    setGardenInsights([...data, ...SEEDED_REVIEWS]);
                }
            } catch(e) {
                console.log("Supabase connection not yet fully established for garden table. Falling back to seeds.");
            } finally {
                setLoading(false);
            }
        };

        fetchGarden();
    }, []);

    return (
        <div style={{
            width: '100%', maxWidth: '1200px', margin: 'clamp(4vh, 8vw, 15vh) auto', position: 'relative', zIndex: 10,
            animation: 'fadeIn 2s ease forwards', padding: '0 clamp(1rem, 5vw, 2rem)',
            paddingBottom: '120px', boxSizing: 'border-box'
        }}>
            
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem',
                marginBottom: 'var(--space-xxl)'
            }}>
                <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, transparent, ${m.accent}60)` }}></div>
                <h2 style={{
                    fontFamily: 'var(--fMono)', color: m.accent, letterSpacing: '0.4em',
                    fontSize: '1rem', textTransform: 'uppercase', margin: 0, display: 'flex', alignItems: 'center', gap: '0.8rem'
                }}>
                    <Sparkles size={16} /> What the Practice Returned <Sparkles size={16} />
                </h2>
                <div style={{ flex: 1, height: '1px', background: `linear-gradient(-90deg, transparent, ${m.accent}60)` }}></div>
            </div>

            <div style={{
                columnCount: 'auto', columnWidth: 'min(100%, 350px)', columnGap: '2.5rem', boxSizing: 'border-box'
            }}>
                {gardenInsights.map((insight, idx) => {
                    
                    // Dynamic styling variations to give it an organic, "grown" editorial look
                    const isHero = idx % 4 === 0;
                    const styleVariation = idx % 3;

                    return (
                        <div key={insight.id || idx} style={{
                            breakInside: 'avoid-column',
                            marginBottom: '2.5rem',
                            display: 'flex', flexDirection: 'column', gap: '1.2rem',
                            padding: isHero ? 'clamp(1.5rem, 5vw, var(--space-xl))' : '0',
                            background: isHero ? `linear-gradient(135deg, ${m.accent}10 0%, transparent 100%)` : 'transparent',
                            border: isHero ? `1px solid ${m.accent}20` : 'none',
                            borderLeft: !isHero && styleVariation === 1 ? `1px solid ${m.accent}` : 'none',
                            paddingLeft: !isHero && styleVariation === 1 ? '1.5rem' : (isHero ? 'clamp(1.5rem, 5vw, var(--space-xl))' : '0'),
                            boxSizing: 'border-box'
                        }}>
                            
                            <Quote size={24} style={{ color: m.accent, opacity: 0.4 }} />

                            <div style={{
                                fontFamily: isHero ? 'var(--fSerif)' : 'var(--fBody)',
                                fontSize: isHero ? 'clamp(1.2rem, 5vw, 1.8rem)' : 'clamp(1rem, 4vw, 1.2rem)',
                                fontStyle: 'italic', color: m.text1, lineHeight: isHero ? 1.4 : 1.7,
                                position: 'relative', wordBreak: 'break-word'
                            }}>
                                {insight.insight_text}
                            </div>

                            <div style={{
                                marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.2rem',
                                borderTop: isHero ? 'none' : `1px dashed ${m.accent}30`, paddingTop: isHero ? '0' : '1rem'
                            }}>
                                <span style={{ fontFamily: 'var(--fMono)', color: m.accent, fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                                    {insight.author_name}
                                </span>
                                {insight.author_title && (
                                    <span style={{ fontFamily: 'var(--fMono)', color: m.text2, fontSize: '0.65rem', letterSpacing: '0.1em', opacity: 0.8, textTransform: 'uppercase' }}>
                                        {insight.author_title}
                                    </span>
                                )}
                            </div>

                        </div>
                    );
                })}
            </div>

            <div style={{
                textAlign: 'center', marginTop: 'var(--space-xxl)', fontFamily: 'var(--fBody)',
                color: m.text2, fontStyle: 'italic', fontSize: '1.2rem', opacity: 0.8
            }}>
                Your reflection belongs here too.
            </div>

        </div>
    );
};
