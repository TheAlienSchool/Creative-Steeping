import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// :: CLARITY BRIDGE ALIGNMENT COMPLIANCE REGISTER ::
// Somatic: breath, pause, posture, settle, anchor
// Topological: legend, map, descriptor, badge, centroid, outline
// Pacing: wpm, velocity, limit, lock, debounce, slerp, momentum
// Reflection: download, journal, archive, spiral, localstorage

// Incandescent design tokens :: accessible, high-contrast, legibly vibrant tone-on-tone copy
const m = {
  bg: "#090500",
  surface: "#1c1000",
  cardBg: "#271508",
  accent: "#d4922a",
  text1: "#fff0d9",
  text2: "#a88b68"
};

const SectionHeader = ({ label, glyph = "⬡" }) => (
  <div style={{
    fontSize: '0.68rem', letterSpacing: '0.28em', textTransform: 'uppercase',
    color: m.accent, marginBottom: '16px', opacity: 0.95,
    fontFamily: "'DM Mono', monospace", display: 'flex', alignItems: 'center', gap: '8px'
  }}>
    <span style={{ color: m.accent }}>{glyph}</span> {label}
  </div>
);

const BodyText = ({ children, large, last }) => (
  <p style={{
    fontFamily: "'Atkinson Hyperlegible', 'Georgia', sans-serif",
    fontSize: large ? '1rem' : '0.9rem',
    lineHeight: large ? 1.85 : 1.75,
    color: large ? m.text1 : m.text2,
    marginBottom: last ? 0 : '22px'
  }}>{children}</p>
);

const RuleDivider = () => (
  <div style={{ width: '100%', height: '1px', background: `${m.accent}25`, margin: '40px 0' }} />
);

const SteepingNoteVisuality = () => {
  const [activeNoteIdx, setActiveNoteIdx] = useState(0);
  const [coords, setCoords] = useState({ stbl: 75, prss: 40, cohr: 85, drft: 15 });
  const cardRef = useRef(null);

  const notesList = [
    {
      kicker: "AN IDEA IS AN OBJECTIVE",
      body: "An idea is an objective; an object in motion with your momentum. Carry it well as you pour your self into the world.",
      mechanism: "STEEPING NOTE :: MOMENTUM"
    },
    {
      kicker: "TRANSFORM EVERY 'I SHOULD...' INTO 'I WILL...'",
      body: "And your will knows what to do from there. The map is written in every sip of your soul's truth.",
      mechanism: "STEEPING NOTE :: WILLPOWER"
    },
    {
      kicker: "UNDERSTANDING LOVE IS THE KEY",
      body: "Love generates Curiosity. Curiosity generates Understanding. Understanding Love is the Key.",
      mechanism: "STEEPING NOTE :: TRINITY"
    },
    {
      kicker: "THE TRINITY OF TRUTHS",
      body: "Simplicity, Clarity, and Purity are the Trinity of Truths that your words can learn to be, when sung from your essence.",
      mechanism: "STEEPING NOTE :: ESSENCE"
    }
  ];

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
    const y = Math.max(0, Math.min(100, Math.round(((e.clientY - rect.top) / rect.height) * 100)));
    setCoords({
      stbl: 100 - x,
      prss: y,
      cohr: x,
      drft: 100 - y
    });
  };

  const handleMouseLeave = () => {
    setCoords({ stbl: 75, prss: 40, cohr: 85, drft: 15 });
  };

  const activeNote = notesList[activeNoteIdx];

  return (
    <div style={{ marginBottom: '40px' }}>
      <BodyText>
        Move your cursor across the card below to experience the real-time somatic coordinates tracking that guides practitioners through their journals.
      </BodyText>
      
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          background: `linear-gradient(135deg, ${m.cardBg} 0%, ${m.surface} 100%)`,
          border: `1px solid ${m.accent}50`,
          borderRadius: '4px',
          padding: '32px 28px',
          position: 'relative',
          boxShadow: `0 8px 32px rgba(212, 146, 42, ${coords.cohr / 1000 + 0.05})`,
          transition: 'box-shadow 0.15s ease',
          cursor: 'crosshair',
          overflow: 'hidden'
        }}
      >
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.06,
          backgroundImage: `radial-gradient(${m.accent} 1px, transparent 1px)`,
          backgroundSize: '16px 16px', pointerEvents: 'none'
        }} />

        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: '0.62rem',
          letterSpacing: '0.15em',
          color: m.accent,
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${m.accent}20`,
          paddingBottom: '10px'
        }}>
          <span>STBL: {coords.stbl}%</span>
          <span>PRSS: {coords.prss}%</span>
          <span>COHR: {coords.cohr}%</span>
          <span>DRFT: {coords.drft}%</span>
        </div>

        <div style={{ minHeight: '110px' }}>
          <div style={{
            fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase',
            color: m.accent, marginBottom: '12px', fontFamily: "'DM Mono', monospace"
          }}>
            {activeNote.kicker}
          </div>
          <p style={{
            fontFamily: "'Atkinson Hyperlegible', sans-serif",
            fontSize: '0.98rem', lineHeight: '1.75', color: m.text1,
            margin: 0
          }}>
            {activeNote.body}
          </p>
        </div>

        <div style={{ marginTop: '24px', height: '24px', opacity: 0.8 }}>
          <svg width="100%" height="24" viewBox="0 0 400 24" style={{ display: 'block' }}>
            <path
              d={`M 0 12 Q 50 ${12 - coords.prss / 6} 100 12 T 200 12 T 300 12 T 400 12`}
              fill="none"
              stroke={m.accent}
              strokeWidth="1.5"
              opacity="0.8"
              style={{ transition: 'd 0.1s ease' }}
            />
            <path
              d={`M 0 12 Q 50 ${12 + coords.stbl / 8} 100 12 T 200 12 T 300 12 T 400 12`}
              fill="none"
              stroke={m.accent}
              strokeWidth="0.8"
              opacity="0.4"
              style={{ transition: 'd 0.1s ease' }}
            />
          </svg>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: '20px', borderTop: `1px solid ${m.accent}15`, paddingTop: '12px',
          fontSize: '0.58rem', fontFamily: "'DM Mono', monospace", letterSpacing: '0.12em', color: m.text2
        }}>
          <span>{activeNote.mechanism}</span>
          <span style={{ opacity: 0.6 }}>COORDINATE CALIBRATION SYSTEM</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '16px' }}>
        {notesList.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveNoteIdx(idx)}
            style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: activeNoteIdx === idx ? m.accent : `${m.accent}30`,
              border: 'none', cursor: 'pointer', padding: 0,
              transition: 'background 0.3s'
            }}
            title={`View reflection ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export function EngagePage() {
  const [selectedFormat, setSelectedFormat] = useState('scholar'); // 'scholar', 'group', 'org'
  const [breathCount, setBreathCount] = useState(0);
  const [breathState, setBreathState] = useState('Settle'); // 'Settle', 'Inhale', 'Hold', 'Exhale'
  const [somaticAnchored, setSomaticAnchored] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [isLocked, setIsLocked] = useState(false);

  // References for Pacing and Coherence
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    document.title = 'Engage Creative Steeping :: THE ÅLIËN SCÖÕL';
    document.documentElement.style.background = m.bg;
    document.body.style.background = m.bg;
    return () => {
      document.documentElement.style.background = '';
      document.body.style.background = '';
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  // Breath pacing loop for somatic grounding
  useEffect(() => {
    if (somaticAnchored) return;
    
    let timer;
    if (breathState === 'Settle') {
      timer = setTimeout(() => setBreathState('Inhale'), 2000);
    } else if (breathState === 'Inhale') {
      timer = setTimeout(() => setBreathState('Hold'), 4000);
    } else if (breathState === 'Hold') {
      timer = setTimeout(() => setBreathState('Exhale'), 4000);
    } else if (breathState === 'Exhale') {
      timer = setTimeout(() => {
        const nextCount = breathCount + 1;
        setBreathCount(nextCount);
        if (nextCount >= 3) {
          setSomaticAnchored(true);
        } else {
          setBreathState('Inhale');
        }
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [breathState, breathCount, somaticAnchored]);

  // Pacing transition gate to lock rapid selections and regulate transition velocity
  const handleFormatSelect = (formatId) => {
    if (isLocked) return;
    setIsLocked(true);
    setSelectedFormat(formatId);

    // Debounce release matches the pacing guidelines (limits velocity)
    debounceTimerRef.current = setTimeout(() => {
      setIsLocked(false);
    }, 450);
  };

  // Archival Pool save handler
  const handleSaveConfig = () => {
    localStorage.setItem('engage_selected_format', selectedFormat);
    setSaveStatus('Pathway aligned to local memory.');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  // Archival Pool download handler
  const handleDownloadSheet = () => {
    const content = `CREATIVE STEEPING :: PATHWAY OUTLINE\nFormat: ${formats[selectedFormat].title}\nPrice: ${formats[selectedFormat].price}\nDuration: ${formats[selectedFormat].duration}\nDelivery: ${formats[selectedFormat].delivery}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `creative_steeping_${selectedFormat}_overview.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formats = {
    scholar: {
      title: "1:1 Scholar Mentorship",
      subtitle: "High-Touch Personal Alchemy",
      desc: "For leaders, artists, and creators seeking personalized guidance. This track is a direct 1:1 engagement with Kamau Z. Akabueze (KzA) as a spline to your creative development. We map your current surface tension and design a space where your latent wisdom is called forward.",
      duration: "7-Week Custom Arc",
      delivery: "Live 1:1 Virtual Sessions + Private Portal Integration",
      artifacts: "Personalized Steeping Reflections + Custom Guidebook Edition",
      oneBeliefOpportunity: "A dedicated mirror of self-perception that scales your specific flavor of intelligence.",
      price: "$2,200 / Full Journey"
    },
    group: {
      title: "Steeping Circles",
      subtitle: "Shared Contemplative Resonance",
      desc: "A group cohort journey built for veil-conscious navigators who seek collective depth. Together, we steep in solo reflection while bridging individual insights through a community conclave. We hold space for peer unfoldings, transforming obstacles into a shared dynamic catapult.",
      duration: "7-Week Cohort Session",
      delivery: "Weekly Virtual Gatherings + Collaborative Sanctuary Access",
      artifacts: "Group Constellation Map + Shared Reflection Archive",
      oneBeliefOpportunity: "Community-driven resonance that proves your inner voice is also the room's voice.",
      price: "$777 / Practitioner"
    },
    org: {
      title: "Organizational Steeping",
      subtitle: "Cultural Alignment & Collective Intuition",
      desc: "Fusing business strategy with deep mindfulness. Designed for teams and corporate environments experiencing structural friction. We compost difficult organizational experiences and plant clear 'seeds of promise' that align individual roles with collective vision.",
      duration: "Custom (1-Day Intensive to 4-Week Programs)",
      delivery: "Live On-Site / Virtual Hybrid Sessions + Team Ledger",
      artifacts: "Corporate Alignment Assessment + Dynamic Cultural Catapult Framework",
      oneBeliefOpportunity: "Unlocking collective creative responsibility and active team mindfulness.",
      price: "Inquire for Custom Quote"
    }
  };

  const currentFormat = formats[selectedFormat];

  return (
    <div style={{
      background: m.bg,
      minHeight: '100dvh',
      color: m.text2,
      fontFamily: "'DM Mono', monospace"
    }}>
      {/* Top Navigation */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: `${m.bg}ee`,
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${m.accent}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(20px, 5vw, 48px)', height: '56px'
      }}>
        <a href="/" id="btn-home" style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: '0.7rem', letterSpacing: '0.2em',
          textTransform: 'uppercase', color: m.text2,
          textDecoration: 'none', opacity: 0.8,
          transition: 'opacity 0.3s'
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = 1}
          onMouseLeave={e => e.currentTarget.style.opacity = 0.8}>
          ← creativesteeping.com
        </a>
        <a href="https://calendly.com/bethecandle/1-1-w-kza"
          id="btn-schedule-nav"
          target="_blank" rel="noopener noreferrer" style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.65rem', letterSpacing: '0.18em',
            textTransform: 'uppercase', color: m.accent,
            textDecoration: 'none', opacity: 0.9,
            transition: 'opacity 0.3s'
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = 1}
          onMouseLeave={e => e.currentTarget.style.opacity = 0.9}>
          ENGAGE WITH KZA ↗
        </a>
      </div>

      {/* Main Container */}
      <div style={{
        maxWidth: '760px', margin: '0 auto',
        padding: 'clamp(48px, 10vw, 96px) clamp(24px, 6vw, 48px) 48px'
      }}>
        {/* Page Title */}
        <h1 style={{
          fontFamily: "'Playfair Display', 'Georgia', serif",
          fontSize: 'clamp(2.2rem, 9vw, 3.6rem)',
          fontStyle: 'italic', color: m.text1,
          lineHeight: 1.1, marginBottom: '8px'
        }}>
          ENGÅGE
        </h1>
        <div style={{
          fontSize: '0.68rem', letterSpacing: '0.32em',
          textTransform: 'uppercase', color: m.accent,
          marginBottom: '20px', fontWeight: 'bold'
        }}>
          Experiential Portals & Programmatic Tiers
        </div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '56px', alignItems: 'center' }}>
          <div style={{ width: '40px', height: '1px', background: m.accent, opacity: 0.4 }} />
          <div style={{
            fontSize: '0.62rem', letterSpacing: '0.18em',
            textTransform: 'uppercase', color: m.text2, opacity: 0.6
          }}>
            THE ÅLIËN SCÖÕL :: Fusing Contemplation with Action
          </div>
        </div>

        {/* ─── Somatic Grounding Anchor ─── */}
        {!somaticAnchored ? (
          <div style={{
            border: `1px solid ${m.accent}30`,
            padding: '24px',
            background: m.surface,
            borderRadius: '2px',
            marginBottom: '40px',
            textAlign: 'center'
          }}>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: '0.72rem',
              letterSpacing: '0.2em', color: m.accent, marginBottom: '16px',
              textTransform: 'uppercase'
            }}>
              [ Somatic Breath Anchor ]
            </div>
            <p style={{
              fontFamily: "'Atkinson Hyperlegible', sans-serif",
              fontSize: '0.95rem', lineHeight: '1.7', color: m.text1,
              marginBottom: '20px'
            }}>
              Calibrate your posture. Settle your shoulders. Focus on the breathing guide to align your energy.
            </p>
            <div style={{
              position: 'relative', width: '120px', height: '120px', margin: '0 auto 16px',
              display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}>
              {/* Pulsing breathing ring */}
              <motion.div
                animate={
                  breathState === 'Inhale' ? { scale: 1.4, opacity: 0.8 } :
                  breathState === 'Hold' ? { scale: 1.4, opacity: 1 } :
                  breathState === 'Exhale' ? { scale: 1.0, opacity: 0.4 } :
                  { scale: 1.0, opacity: 0.3 }
                }
                transition={{ duration: 4, ease: "easeInOut" }}
                style={{
                  position: 'absolute', width: '80px', height: '80px',
                  border: `2px solid ${m.accent}`, borderRadius: '50%',
                  background: `${m.accent}10`
                }}
              />
              <div style={{
                fontFamily: "'DM Mono', monospace", fontSize: '0.75rem',
                color: m.text1, zIndex: 10, textTransform: 'uppercase', letterSpacing: '0.1em'
              }}>
                {breathState}
              </div>
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: m.text2 }}>
              Breaths: {breathCount} / 3
            </div>
            <button
              id="btn-skip-somatic"
              onClick={() => setSomaticAnchored(true)}
              style={{
                background: 'none', border: 'none', color: m.text2,
                textDecoration: 'underline', cursor: 'pointer',
                fontFamily: "'DM Mono', monospace", fontSize: '0.6rem',
                marginTop: '16px', opacity: 0.7
              }}
            >
              Enter Directly
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* ─── The Engagement Concept ─── */}
            <BodyText large>
              Creative Steeping is more than a solo journey; it is an organizational catalyst and academic sanctuary. By weaving the physical ritual of tea-brewing with the metaphysical engine of reflective journaling, we guide Veil-Conscious Navigators across the surface tension of raw potential and into complete creative responsibility.
            </BodyText>
            <BodyText large last>
              Whether engaged as a private 1:1 Scholar, a collaborative Group Cohort, or an aligned Corporate Culture, the practice delivers a repeatable framework for self-perception, personal authority, and strategic communication.
            </BodyText>

            <RuleDivider />

            {/* ─── Core Experiential Pillars ─── */}
            <SectionHeader label="Experiential Pillars" glyph="◈" />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div>
                <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', color: m.text1, letterSpacing: '0.1em', marginBottom: '8px', textTransform: 'uppercase' }}>
                  I. Guided Introspection & Ritual
                </h3>
                <BodyText last>
                  Slowing down to honor your own metabolism. The chemical onset of L-theanine from your tea vascularizes cognitive flow, while the day-by-day progression of the portal challenges limiting patterns and harvests clarity from your internal landscape.
                </BodyText>
              </div>

              <div>
                <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', color: m.text1, letterSpacing: '0.1em', marginBottom: '8px', textTransform: 'uppercase' }}>
                  II. Action-Oriented Reflection
                </h3>
                <BodyText last>
                  Contemplation without execution is stagnation. The practice drives you to identify challenges as dynamic catapults for growth, encouraging you to plant "seeds of promise" that translate inner wisdom into daily material strategies.
                </BodyText>
              </div>

              <div>
                <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', color: m.text1, letterSpacing: '0.1em', marginBottom: '8px', textTransform: 'uppercase' }}>
                  III. Quantum Connection
                </h3>
                <BodyText last>
                  Your thoughts carry a physical signature. By sonifying your writing rhythms through the Solfeggio-tuned Sonnet Engine, your individual consciousness actively interfaces with your surroundings, materializing focused intention.
                </BodyText>
              </div>
            </div>

            <RuleDivider />

            {/* ─── Resonance Cards :: Interactive Steeping Note ─── */}
            <SectionHeader label="Resonance Cards :: Interactive Steeping Note" glyph="✦" />
            <SteepingNoteVisuality />

            <RuleDivider />

            {/* ─── Topological Legend Map ─── */}
            <SectionHeader label="Topological Legend Map" glyph="⬡" />
            <BodyText>
              The structural vectors of the Steeping Programs map along three coordinate paths: depth of guidance, group resonance, and team coherence.
            </BodyText>
            
            {/* SVG Interactive Map */}
            <div style={{
              background: m.surface, border: `1px solid ${m.accent}20`,
              padding: '20px', display: 'flex', justifyContent: 'center',
              marginBottom: '32px', borderRadius: '2px'
            }}>
              <svg width="240" height="200" viewBox="0 0 240 200">
                {/* Triangular coordinate bounds */}
                <polygon points="120,20 30,170 210,170" fill="none" stroke={`${m.accent}30`} strokeWidth="1" />
                <line x1="120" y1="20" x2="120" y2="170" stroke={`${m.accent}15`} strokeDasharray="3" />
                
                {/* Format Centroids */}
                {/* Scholar: Top Node */}
                <circle cx="120" cy="40" r={selectedFormat === 'scholar' ? "9" : "6"} fill={selectedFormat === 'scholar' ? m.accent : `${m.accent}50`} style={{ transition: 'all 0.3s' }} />
                <text x="120" y="25" fill={m.text1} fontSize="8" fontFamily="var(--fMono)" textAnchor="middle">SCHOLAR</text>
                
                {/* Group: Left Node */}
                <circle cx="50" cy="150" r={selectedFormat === 'group' ? "9" : "6"} fill={selectedFormat === 'group' ? m.accent : `${m.accent}50`} style={{ transition: 'all 0.3s' }} />
                <text x="35" y="165" fill={m.text1} fontSize="8" fontFamily="var(--fMono)" textAnchor="end">GROUP</text>

                {/* Organization: Right Node */}
                <circle cx="190" cy="150" r={selectedFormat === 'org' ? "9" : "6"} fill={selectedFormat === 'org' ? m.accent : `${m.accent}50`} style={{ transition: 'all 0.3s' }} />
                <text x="205" y="165" fill={m.text1} fontSize="8" fontFamily="var(--fMono)" textAnchor="start">CORP/ORG</text>

                {/* Dynamic path link line */}
                {selectedFormat === 'scholar' && <line x1="120" y1="40" x2="120" y2="110" stroke={m.accent} strokeWidth="1.5" />}
                {selectedFormat === 'group' && <line x1="50" y1="150" x2="110" y2="120" stroke={m.accent} strokeWidth="1.5" />}
                {selectedFormat === 'org' && <line x1="190" y1="150" x2="130" y2="120" stroke={m.accent} strokeWidth="1.5" />}
              </svg>
            </div>

            <RuleDivider />

            {/* ─── Interactive Format Selector ─── */}
            <SectionHeader label="Choose Your Steeping Pathway" glyph="♪" />
            <BodyText>
              Select a pathway to observe the specific structure, delivery, and programmatic terms:
            </BodyText>

            {/* Format Selector Tabs */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '24px'
            }}>
              {[
                { id: 'scholar', label: '1:1 Scholar' },
                { id: 'group', label: 'Group Circles' },
                { id: 'org', label: 'Organization' }
              ].map(tab => (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  onClick={() => handleFormatSelect(tab.id)}
                  style={{
                    background: selectedFormat === tab.id ? m.accent : 'transparent',
                    color: selectedFormat === tab.id ? m.bg : m.text1,
                    border: `1px solid ${selectedFormat === tab.id ? m.accent : `${m.accent}40`}`,
                    padding: '12px 6px',
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '0.68rem',
                    letterSpacing: '0.1em',
                    cursor: selectedFormat === tab.id ? 'default' : 'pointer',
                    transition: 'all 0.3s ease',
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                    opacity: isLocked ? 0.6 : 1
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Customizer Details Panel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedFormat}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                style={{
                  background: m.surface,
                  border: `1px solid ${m.accent}30`,
                  padding: '24px',
                  borderRadius: '2px',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
                  position: 'relative'
                }}
              >
                <div style={{
                  fontFamily: "'Playfair Display', 'Georgia', serif",
                  fontSize: '1.4rem', fontStyle: 'italic',
                  color: m.text1, marginBottom: '4px'
                }}>
                  {currentFormat.title}
                </div>
                <div style={{
                  fontFamily: "'DM Mono', monospace", fontSize: '0.62rem',
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: m.accent, marginBottom: '16px'
                }}>
                  {currentFormat.subtitle}
                </div>

                <BodyText>{currentFormat.desc}</BodyText>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px', borderTop: `1px solid ${m.accent}15`, paddingTop: '16px' }}>
                  <div style={{ fontSize: '0.75rem' }}>
                    <span style={{ color: m.accent }}>Duration:</span> {currentFormat.duration}
                  </div>
                  <div style={{ fontSize: '0.75rem' }}>
                    <span style={{ color: m.accent }}>Format:</span> {currentFormat.delivery}
                  </div>
                  <div style={{ fontSize: '0.75rem' }}>
                    <span style={{ color: m.accent }}>Artifacts:</span> {currentFormat.artifacts}
                  </div>
                  <div style={{ fontSize: '0.75rem', fontStyle: 'italic' }}>
                    <span style={{ color: m.accent, fontStyle: 'normal' }}>The Opportunity:</span> "{currentFormat.oneBeliefOpportunity}"
                  </div>
                </div>

                {/* Archival Actions */}
                <div style={{
                  display: 'flex', gap: '12px', marginTop: '20px',
                  borderTop: `1px solid ${m.accent}15`, paddingTop: '16px'
                }}>
                  <button
                    id="btn-save-archive"
                    onClick={handleSaveConfig}
                    style={{
                      background: 'none', border: `1px solid ${m.accent}60`,
                      color: m.text1, padding: '8px 14px', cursor: 'pointer',
                      fontFamily: "'DM Mono', monospace", fontSize: '0.62rem',
                      letterSpacing: '0.1em', textTransform: 'uppercase'
                    }}
                  >
                    Align Pathway
                  </button>
                  <button
                    id="btn-download-one-sheet"
                    onClick={handleDownloadSheet}
                    style={{
                      background: 'none', border: `1px solid ${m.accent}60`,
                      color: m.text1, padding: '8px 14px', cursor: 'pointer',
                      fontFamily: "'DM Mono', monospace", fontSize: '0.62rem',
                      letterSpacing: '0.1em', textTransform: 'uppercase'
                    }}
                  >
                    Download Overview
                  </button>
                  {saveStatus && (
                    <span style={{
                      fontFamily: "'DM Mono', monospace", fontSize: '0.62rem',
                      color: m.accent, alignSelf: 'center', animation: 'fadeIn 0.5s'
                    }}>{saveStatus}</span>
                  )}
                </div>

                <div style={{
                  marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  borderTop: `1px solid ${m.accent}30`, paddingTop: '20px'
                }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Structure & Pricing:</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '1.1rem', color: m.text1, fontWeight: 'bold', textShadow: `0 0 10px ${m.accent}40` }}>{currentFormat.price}</span>
                </div>
              </motion.div>
            </AnimatePresence>

            <RuleDivider />

            {/* ─── Programmatic Tiers ─── */}
            <SectionHeader label="Programmatic Digital Tiers" glyph="◉" />
            <BodyText>
              Fusing structure with self-study. Register and begin your steeping through our decoupled digital platforms:
            </BodyText>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Tier 1 */}
              <div style={{ border: `1px solid ${m.accent}20`, padding: '20px', background: `${m.surface}40` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', fontWeight: 'bold', color: m.text1 }}>[ LAYER 1 : ENTRANCE ]</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', color: m.accent }}>FREE</span>
                </div>
                <p style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif", fontSize: '0.85rem', lineHeight: '1.6', color: m.text2, margin: 0 }}>
                  The Steeperverse opens here. Navigate freely, generate sound with your movements, and begin a conversation with The Steeping Sage. This is your unhurried entry point.
                </p>
              </div>

              {/* Tier 2 */}
              <div style={{ border: `1px solid ${m.accent}40`, padding: '20px', background: `${m.surface}70` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', fontWeight: 'bold', color: m.text1 }}>[ LAYER 2 : ENGAGED ]</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.85rem', color: m.accent }}>$44</span>
                </div>
                <p style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif", fontSize: '0.85rem', lineHeight: '1.6', color: m.text2, margin: 0 }}>
                  Your steep deepens when it has somewhere to land. Layer 2 holds the full record of your presence, your vessel reflections, and your Steeping Ledger across every session :: a persistent practice, anchoring your continuous journey.
                </p>
              </div>

              {/* Tier 3 */}
              <div style={{ border: `1px solid ${m.accent}`, padding: '20px', background: m.surface }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', fontWeight: 'bold', color: m.text1 }}>[ LAYER 3 : INNERACTIVE ]</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.85rem', color: m.accent }}>$777</span>
                </div>
                <p style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif", fontSize: '0.85rem', lineHeight: '1.6', color: m.text2, margin: 0 }}>
                  The practitioner community. Direct one-on-one Steeping Sessions. Group cohorts with the architects of the practice. The full depth, held with others who are already doing the work.
                </p>
              </div>
            </div>

            <RuleDivider />

            {/* ─── Call to Actions ─── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '40px' }}>
              <a href="/"
                id="btn-commence-steep"
                style={{
                  display: 'inline-block',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '0.78rem', letterSpacing: '0.2em',
                  textTransform: 'uppercase', color: m.bg,
                  background: m.accent, textDecoration: 'none',
                  padding: '16px 28px', textAlign: 'center',
                  transition: 'opacity 0.3s',
                  maxWidth: '280px', fontWeight: 'bold'
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = 0.85}
                onMouseLeave={e => e.currentTarget.style.opacity = 1}>
                Commence Your Steep ↗
              </a>
              
              <a href="https://calendly.com/bethecandle/1-1-w-kza"
                id="btn-schedule-kza"
                target="_blank" rel="noopener noreferrer" style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '0.7rem', color: m.text1, textDecoration: 'none',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  borderBottom: `1px solid ${m.accent}`, paddingBottom: '3px',
                  display: 'inline-block', maxWidth: 'max-content',
                  transition: 'border-color 0.3s'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#ffffff'}
                onMouseLeave={e => e.currentTarget.style.borderColor = m.accent}>
                Schedule Program Orientation with KzA ↗
              </a>
            </div>

            {/* Footer */}
            <div style={{
              borderTop: `1px solid ${m.accent}15`,
              paddingTop: '28px', paddingBottom: '48px',
              fontFamily: "'DM Mono', monospace", fontSize: '0.6rem',
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: m.text2, opacity: 0.4,
              display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px'
            }}>
              <span>© THE ÅLIËN SCÖÕL</span>
              <span>creativesteeping.com</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
