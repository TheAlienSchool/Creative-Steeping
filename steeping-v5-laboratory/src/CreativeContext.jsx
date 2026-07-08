import React, { useEffect, useState } from 'react';
import { creativeContextData } from './creativeContextData';

// Incandescent gold palette for the welcome mode and administrative alignment
const m = {
  bg: "#090500",
  surface: "#1c1000",
  cardBg: "#271508",
  accent: "#d4922a",
  text1: "#fff0d9",
  text2: "#a88b68"
};

const Section = ({ label }) => (
  <div style={{
    fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase',
    color: m.accent, marginBottom: '14px', opacity: 0.9,
    fontFamily: "'DM Mono', monospace"
  }}>{label}</div>
);

const Rule = () => (
  <div style={{ width: '100%', height: '1px', background: `${m.accent}22`, margin: '32px 0' }} />
);

export function CreativeContext() {
  const [activeTab, setActiveTab] = useState('overview');
  const [coCopied, setCopied] = useState(false);

  useEffect(() => {
    document.title = 'Creative Context Portal :: THE ÅLIËN SCÖÕL';
    document.documentElement.style.background = m.bg;
    document.body.style.background = m.bg;
    return () => {
      document.documentElement.style.background = '';
      document.body.style.background = '';
    };
  }, []);

  const handleCopyClipboard = () => {
    const rawJson = JSON.stringify(creativeContextData, null, 2);
    navigator.clipboard.writeText(rawJson)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error("Could not co-copy context schema ::", err);
      });
  };

  const handleDownloadJson = () => {
    const rawJson = JSON.stringify(creativeContextData, null, 2);
    const element = document.createElement("a");
    const file = new Blob([rawJson], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = "creative-context.json";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div style={{
      background: m.bg,
      minHeight: '100dvh',
      color: m.text2,
      fontFamily: "'DM Mono', monospace",
      paddingBottom: '80px'
    }}>
      {/* Top sticky path controller */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: `${m.bg}ee`,
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${m.accent}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(20px, 5vw, 48px)', height: '56px'
      }}>
        <a href="/" style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: '0.7rem', letterSpacing: '0.2em',
          textTransform: 'uppercase', color: m.text2,
          textDecoration: 'none', opacity: 0.7,
          transition: 'opacity 0.3s'
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = 1}
          onMouseLeave={e => e.currentTarget.style.opacity = 0.7}>
          ← Return to Live Portal
        </a>
        <div style={{
          fontSize: '0.62rem', letterSpacing: '0.15em',
          color: m.accent, textTransform: 'uppercase', opacity: 0.8
        }}>
          Active System :: v{creativeContextData.meta.currentVersion}
        </div>
      </div>

      {/* Main Container */}
      <div style={{
        maxWidth: '960px',
        margin: '0 auto',
        padding: 'clamp(24px, 6vw, 64px) clamp(20px, 5vw, 48px)'
      }}>
        
        {/* Header Block */}
        <div style={{ marginBottom: '40px' }}>
          <Section label="The Agentic Room" />
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            color: m.text1,
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 400,
            lineHeight: 1.15,
            margin: '12px 0 24px 0',
            letterSpacing: '-0.02em'
          }}>
            Creative Context Portal
          </h1>
          <p style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: '1.2rem',
            lineHeight: 1.7,
            color: m.text1,
            maxWidth: '720px',
            margin: '0 0 24px 0'
          }}>
            We maintain our shared alignment within this dynamic context room. It maps our identity, sitemap routes, design tokens, terminology parameters, and voice rules into a unified source of truth.
          </p>
          <p style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: '1.05rem',
            lineHeight: 1.6,
            color: m.text2,
            maxWidth: '720px',
            margin: 0
          }}>
            This dashboard reads natively from <code>src/creativeContextData.js</code>. We utilize this workspace to synchronize human, system, and agentic workflows :: preventing conceptual drift across our digital footprint.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '40px'
        }}>
          <button 
            onClick={handleCopyClipboard}
            style={{
              background: m.surface,
              border: `1px solid ${m.accent}60`,
              color: m.text1,
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '12px 24px',
              cursor: 'pointer',
              borderRadius: '2px',
              transition: 'all 0.3s ease',
              outline: 'none'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = m.cardBg;
              e.currentTarget.style.borderColor = m.accent;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = m.surface;
              e.currentTarget.style.borderColor = `${m.accent}60`;
            }}>
            {coCopied ? "✓ Context Co-Copied" : "Copy Database to Clipboard"}
          </button>

          <button 
            onClick={handleDownloadJson}
            style={{
              background: 'transparent',
              border: `1px solid ${m.accent}30`,
              color: m.text2,
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '12px 24px',
              cursor: 'pointer',
              borderRadius: '2px',
              transition: 'all 0.3s ease',
              outline: 'none'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = m.accent;
              e.currentTarget.style.color = m.text1;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = `${m.accent}30`;
              e.currentTarget.style.color = m.text2;
            }}>
            Download context.json
          </button>
        </div>

        <Rule />

        {/* Seven Pillars Exploration Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: `1px solid ${m.accent}15`,
          gap: ' clamp(10px, 2vw, 24px)',
          overflowX: 'auto',
          paddingBottom: '1px',
          marginBottom: '36px',
          scrollbarWidth: 'none'
        }}>
          {['overview', 'sitemap', 'design', 'philosophy', 'glossary', 'voice', 'funnel'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? `2px solid ${m.accent}` : '2px solid transparent',
                color: activeTab === tab ? m.text1 : m.text2,
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.72rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                padding: '10px 4px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
                fontWeight: activeTab === tab ? 'bold' : 'normal'
              }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Dynamic Pillar Panels */}
        <div style={{
          background: m.surface,
          border: `1px solid ${m.accent}12`,
          borderRadius: '4px',
          padding: 'clamp(20px, 5vw, 40px)'
        }}>
          {activeTab === 'overview' && (
            <div>
              <Section label="Pillar 1 :: Metadata & Agent Instructions" />
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: m.text1, fontSize: '1.4rem', fontWeight: 400, margin: '0 0 16px 0' }}>
                Single Source of Truth Coordination
              </h3>
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '1.1rem', lineHeight: 1.65, color: m.text2, margin: '0 0 24px 0' }}>
                We structure our metadata precisely so that any visiting agent, language model, or developer knows exactly how to attune their language and parameters.
              </p>
              
              <div style={{ background: m.cardBg, border: `1px solid ${m.accent}18`, padding: '20px', borderRadius: '2px', marginBottom: '32px' }}>
                <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: m.accent, letterSpacing: '0.1em', marginBottom: '8px', fontFamily: "'DM Mono', monospace" }}>
                  Active Agent Protocol Instruction
                </div>
                <div style={{ fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: '1.1rem', color: m.text1, lineHeight: 1.6 }}>
                  "{creativeContextData.meta.agentDirections}"
                </div>
              </div>

              <Section label="Latest System Intersections" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {creativeContextData.meta.activeReleaseLog.map((log, index) => (
                  <div key={index} style={{ borderLeft: `2px solid ${m.accent}40`, paddingLeft: '16px' }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: m.text1, fontWeight: 'bold' }}>
                      Version {log.version} <span style={{ color: m.accent, opacity: 0.8, fontWeight: 'normal' }}>({log.date})</span>
                    </div>
                    <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', color: m.text2, fontFamily: "'EB Garamond', serif", fontSize: '1rem', lineHeight: 1.6 }}>
                      {log.highlights.map((item, id) => (
                        <li key={id} style={{ marginBottom: '6px' }}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sitemap' && (
            <div>
              <Section label="Pillar 2 :: The Structural Map" />
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: m.text1, fontSize: '1.4rem', fontWeight: 400, margin: '0 0 16px 0' }}>
                Complete Site Mapping Index
              </h3>
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '1.1rem', lineHeight: 1.65, color: m.text2, margin: '0 0 24px 0' }}>
                Defining coordinate limits ensures that our AI never constructs duplicate pathways or misaligns the routes.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {creativeContextData.pagesIndex.sitemap.map((route, idx) => (
                  <div key={idx} style={{
                    background: m.cardBg,
                    border: `1px solid ${m.accent}12`,
                    padding: '20px',
                    borderRadius: '2px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ fontFamily: "'DM Mono', monospace", color: m.accent, fontSize: '0.88rem', fontWeight: 'bold' }}>
                        {route.route}
                      </span>
                      <span style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: '0.6rem',
                        letterSpacing: '0.1em',
                        color: route.gated ? m.accent : m.text2,
                        border: `1px solid ${route.gated ? m.accent : m.accent + '30'}`,
                        padding: '2px 8px',
                        borderRadius: '2px',
                        textTransform: 'uppercase'
                      }}>
                        {route.gated ? "Gated State" : "Ungated Gateway"}
                      </span>
                    </div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', color: m.text1, marginBottom: '6px' }}>
                      {route.label}
                    </div>
                    <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '1rem', lineHeight: 1.5, color: m.text2, margin: 0 }}>
                      {route.purpose}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'design' && (
            <div>
              <Section label="Pillar 3 :: Visual Design Alignment" />
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: m.text1, fontSize: '1.4rem', fontWeight: 400, margin: '0 0 16px 0' }}>
                Typography & Color Physics
              </h3>
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '1.1rem', lineHeight: 1.65, color: m.text2, margin: '0 0 24px 0' }}>
                We structure visual continuity through carefully constrained options. Easing vectors and theme modes are defined mathematically.
              </p>

              <div style={{ marginBottom: '32px' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", color: m.text1, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.1em' }}>
                  Typography fallbacks
                </div>
                {Object.entries(creativeContextData.designTokens.typography).map(([key, val]) => (
                  <div key={key} style={{ display: 'flex', gap: '16px', marginBottom: '10px', alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.72rem', color: m.accent, textTransform: 'uppercase', width: '80px', flexShrink: 0 }}>
                      {key}
                    </span>
                    <span style={{ fontFamily: "'EB Garamond', serif", fontSize: '1rem', color: m.text1 }}>
                      {val}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '32px' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", color: m.text1, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.1em' }}>
                  Atmospheric Mode Schemes
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                  {Object.entries(creativeContextData.designTokens.modes).map(([id, val]) => (
                    <div key={id} style={{
                      background: val.bg,
                      border: `1px solid ${val.accent}25`,
                      color: val.text2,
                      padding: '16px',
                      borderRadius: '4px',
                      boxShadow: `0 4px 20px ${val.accent}05`
                    }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: val.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
                        {id}
                      </div>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: val.text1, marginBottom: '8px' }}>
                        {val.name}
                      </div>
                      <div style={{ fontSize: '0.9rem', fontFamily: "'EB Garamond', serif", color: val.text2, fontStyle: 'italic' }}>
                        Carrier of the {val.colorFocus} frequency.
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'philosophy' && (
            <div>
              <Section label="Pillar 4 :: Philosophy & System Physics" />
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: m.text1, fontSize: '1.4rem', fontWeight: 400, margin: '0 0 16px 0' }}>
                System Physics & Contour Limits
              </h3>
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '1.1rem', lineHeight: 1.65, color: m.text2, margin: '0 0 24px 0' }}>
                Every transformation traces a path. These foundational axioms form the bedrock of the live portal encounters.
              </p>

              <div style={{ background: m.cardBg, border: `1px solid ${m.accent}12`, padding: '24px', borderRadius: '2px', marginBottom: '32px' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: m.accent, marginBottom: '8px' }}>
                  THE OPERATING SYSTEM (THE COUPLET)
                </div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.35rem', color: m.text1, fontStyle: 'italic', marginBottom: '8px', lineHeight: 1.4 }}>
                  {creativeContextData.philosophyModel.physics}
                </div>
                <div style={{ fontFamily: "'EB Garamond', serif", fontSize: '1.15rem', color: m.text2 }}>
                  {creativeContextData.philosophyModel.state}
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", color: m.text1, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.1em' }}>
                  The Seven Contemplative Steeps
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {creativeContextData.philosophyModel.theSevenSteeps.map((steep, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.72rem', color: m.accent, minWidth: '40px' }}>
                        L0{idx + 1}
                      </span>
                      <span style={{ fontFamily: "'EB Garamond', serif", fontSize: '1.05rem', color: m.text1 }}>
                        {steep}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", color: m.text1, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.1em' }}>
                  Client-side Wayfinding Input Signals
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {creativeContextData.philosophyModel.wayfindingSignals.map((signal, idx) => (
                    <span key={idx} style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '0.7rem',
                      background: m.cardBg,
                      border: `1px solid ${m.accent}20`,
                      padding: '6px 14px',
                      color: m.text1,
                      borderRadius: '2px'
                    }}>
                      ✦ {signal}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'glossary' && (
            <div>
              <Section label="Pillar 5 :: Universal Language Glossary" />
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: m.text1, fontSize: '1.4rem', fontWeight: 400, margin: '0 0 16px 0' }}>
                Glossary Coordinates
              </h3>
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '1.1rem', lineHeight: 1.65, color: m.text2, margin: '0 0 24px 0' }}>
                Avoiding common abbreviations and beautiful fog :: we coordinate our collective knowledge with explicit mappings.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
                {Object.entries(creativeContextData.glossaryMapping).map(([term, desc]) => (
                  <div key={term} style={{
                    background: m.cardBg,
                    borderLeft: `2px solid ${m.accent}50`,
                    padding: '14px 18px'
                  }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontWeight: 'bold', fontSize: '0.78rem', color: m.text1, textTransform: 'none', marginBottom: '4px' }}>
                      {term}
                    </div>
                    <div style={{ fontFamily: "'EB Garamond', serif", fontSize: '1rem', color: m.text2, lineHeight: 1.45 }}>
                      {desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'voice' && (
            <div>
              <Section label="Pillar 6 :: Semantic Safeguards" />
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: m.text1, fontSize: '1.4rem', fontWeight: 400, margin: '0 0 16px 0' }}>
                Tone Architecture & The Negative Filter
              </h3>
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '1.1rem', lineHeight: 1.65, color: m.text2, margin: '0 0 24px 0' }}>
                Our system values the Potentialized Present. We choose structural clarity over deficit apology, grounding statements in positive outlook vectors.
              </p>

              <div style={{ marginBottom: '32px' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", color: m.text1, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.1em' }}>
                  The Three Tone Registers
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {Object.entries(creativeContextData.voiceAndToneRules.toneRegisters).map(([reg, description]) => (
                    <div key={reg} style={{ background: m.cardBg, border: `1px solid ${m.accent}12`, padding: '16px', borderRadius: '2px' }}>
                      <span style={{ fontFamily: "'DM Mono', monospace", color: m.accent, fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.72rem', display: 'block', marginBottom: '6px' }}>
                        {reg} Register
                      </span>
                      <span style={{ fontFamily: "'EB Garamond', serif", fontSize: '1rem', color: m.text1 }}>
                        {description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", color: m.text1, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.1em' }}>
                  Systemic Semantic Guidelines
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {creativeContextData.voiceAndToneRules.semanticRules.map((rule, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <span style={{ color: m.accent }}>⚡</span>
                      <span style={{ fontFamily: "'EB Garamond', serif", fontSize: '1.05rem', color: m.text1, lineHeight: 1.5 }}>
                        {rule}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'funnel' && (
            <div>
              <Section label="Pillar 7 :: Progression Funnel & Supabase Tiers" />
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: m.text1, fontSize: '1.4rem', fontWeight: 400, margin: '0 0 16px 0' }}>
                Supabase Soil & access_tier Definitions
              </h3>
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '1.1rem', lineHeight: 1.65, color: m.text2, margin: '0 0 24px 0' }}>
                Individual profiles live within our Supabase database under table <code>steeper_profiles</code>. The <code>access_tier</code> property determines gate limits.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {creativeContextData.progressionFunnel.accessTiers.map((tierObj, idx) => (
                  <div key={idx} style={{
                    background: m.cardBg,
                    border: `1px solid ${m.accent}12`,
                    padding: '20px',
                    borderRadius: '2px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ fontFamily: "'DM Mono', monospace", color: m.accent, fontSize: '0.75rem', fontWeight: 'bold', background: `${m.accent}12`, padding: '4px 10px', borderRadius: '12px' }}>
                        {tierObj.level} :: {tierObj.label}
                      </span>
                      <span style={{ fontFamily: "'DM Mono', monospace", color: m.text1, fontSize: '0.75rem' }}>
                        access_tier: <code>'{tierObj.tier}'</code>
                      </span>
                    </div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', color: m.text1, marginBottom: '6px' }}>
                      System Gate Boundaries
                    </div>
                    <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '1rem', lineHeight: 1.5, color: m.text2, margin: '0 0 12px 0' }}>
                      {tierObj.access}
                    </p>
                    <div style={{ borderTop: `1px solid ${m.accent}10`, paddingTop: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.62rem', color: m.accent, textTransform: 'uppercase' }}>
                        Retention mechanics:
                      </span>
                      <span style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.95rem', color: m.text1, fontStyle: 'italic' }}>
                        {tierObj.retentionMechanism}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
