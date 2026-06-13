import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useResonanceCanvas } from './useResonanceCanvas';
import { useSonnetEngine } from './useSonnetEngine';
import { useSageWayfinding, getTransitionGuidance, computeVesselResonance, VESSEL_STEEP_AFFINITY } from './useSageWayfinding';
import { useSageEssayistComposer } from './useSageEssayistComposer';
import { STEEP_LABELS } from './useWayfinding';
import { EyeOfTheSage } from './EyeOfTheSage';
import { VESSELS } from './VesselContent';
import { Vessel00Detail } from './Vessel00Detail';
import { Vessel01Detail } from './Vessel01Detail';
import { Vessel02Detail } from './Vessel02Detail';
import { Vessel03Detail } from './Vessel03Detail';
import { Vessel04Detail } from './Vessel04Detail';
import { Vessel05Detail } from './Vessel05Detail';
import { Vessel06Detail } from './Vessel06Detail';
import { Vessel07Detail } from './Vessel07Detail';
import { Vessel08Detail } from './Vessel08Detail';
import { SubterraneanBay } from './SubterraneanBay';
import { Hexagong } from './Hexagong';
import { Constellation } from './Constellation';
import { SteeperverseBackground } from './SteeperverseBackground';
import { StillnessCatalyst } from './StillnessCatalyst';
import { SteepersLedger } from './SteepersLedger';
import { useAuth } from './useAuth';
import { useTier } from './useTier';
import { AuthOverlay } from './AuthOverlay';
import { GuidedJourneyModule } from './GuidedJourneyModule';
import { SteepingSpaceDashboard } from './SteepingSpaceDashboard';
import { TheSteepingCompass } from './TheSteepingCompass';
import { useSteepingCircles } from './useSteepingCircles';
import { GuideToTheSteeperverse } from './GuideToTheSteeperverse';
import { WhatSteepersSay } from './WhatSteepersSay';
import { OntologicalObservatory } from './OntologicalObservatory';
import { LegacyScreengrabPortal } from './LegacyScreengrabPortal';
import { SteepingCalendar } from './SteepingCalendar';
import { motion, AnimatePresence } from 'framer-motion';
import { VESSELS_L2 } from './VesselsL2';
import { VesselL2Detail } from './VesselL2Detail';
import { AboutPage } from './AboutPage';

import './App.css';

// ... (other imports stay exactly the same) ...

// ==========================================
// THE DESIGN TOKENS & MODES
// ==========================================
const T = {
  navH: "56px",
  tabH: "72px",
  curve: "cubic-bezier(0.16, 1, 0.3, 1)",
  space: { xs: "4px", sm: "8px", md: "16px", lg: "24px", xl: "48px", xxl: "96px" },
};

const F = {
  serif: "'Playfair Display', serif",
  mono: "'DM Mono', monospace",
  body: "'EB Garamond', serif"
};

const MODES = {
  incandescent: {
    name: "Incandescent",
    bg: "#090500", surface: "#1c1000", cardBg: "#271508",
    accent: "#d4922a", glow: "rgba(212,146,42,0.16)",
    text1: "#fff0d9", text2: "#a88b68"
  },
  oceanic: {
    name: "Oceanic",
    bg: "#00080a", surface: "#001a22", cardBg: "#052833",
    accent: "#38bdf8", glow: "rgba(56,189,248,0.16)",
    text1: "#e0f2fe", text2: "#7dd3fc"
  },
  emergent: {
    name: "Emergent",
    bg: "#050505", surface: "#1a1a1a", cardBg: "#262626",
    accent: "#e5e5e5", glow: "rgba(229,229,229,0.16)",
    text1: "#ffffff", text2: "#a3a3a3"
  },
  planetary: {
    name: "Planetary",
    bg: "#050008", surface: "#0a0010", cardBg: "#12001c",
    accent: "#ff00ff", glow: "rgba(255,0,255,0.20)",
    text1: "#ffffff", text2: "#e0b3ff"
  },
  darkMatter: {
    name: "Dark Matter",
    bg: "#000000", surface: "#050505", cardBg: "#0a0a0a",
    accent: "#6b7280", glow: "rgba(107,114,128,0.05)",
    text1: "#f3f4f6", text2: "#9ca3af"
  }
};

// ==========================================
// COMPONENT: BUOYANT GRAIN (SVG FILTER)
// ==========================================
const BuoyantGrain = () => (
  <>
    <svg style={{ position: 'fixed', top: 0, left: 0, width: 0, height: 0, pointerEvents: 'none' }}>
      <filter id="buoyant-grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.04 0" />
      </filter>
    </svg>
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100dvh',
      pointerEvents: 'none', zIndex: 9999,
      mixBlendMode: 'overlay',
      opacity: 0.4,
      background: 'url(#buoyant-grain)'
    }} />
  </>
);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMsg: '', errorStack: '' };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, errorMsg: error.message, errorStack: error.stack };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'red', padding: '2rem', background: '#222', zIndex: 99999, position: 'fixed', top: 0, left: 0, width: '100vw', height: '100dvh', whiteSpace: 'pre-wrap' }}>
          <h2>React Crash!</h2>
          <p>{this.state.errorMsg}</p>
          <pre>{this.state.errorStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// ==========================================
// COMPONENT: GLOBAL STEEPING TIMER
// ==========================================
const GlobalSteepingTimer = ({ m, playStrikingBowl, playConsideringHarmonic, playSandSonnet, instrumentMode, setSonicVolumeState, setSymphonyTuning }) => {
  const [activeTimer, setActiveTimer] = useState(null); // '5', '15', '22', '9'
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    let interval = null;
    if (activeTimer && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => {
          const newTime = t - 1;
          window.dispatchEvent(new CustomEvent('global-timer-state', { detail: { activeTimer, timeLeft: newTime } }));
          if (newTime === 0) {
            setActiveTimer(null);
            if (playStrikingBowl) playStrikingBowl(60); // Deep bowl finish
            if (activeTimer === 15 && setSymphonyTuning) setSymphonyTuning(false);
            if (activeTimer === 15 && setSonicVolumeState) setSonicVolumeState(0.5);
            return 0;
          }
          if (playSandSonnet) playSandSonnet(); // The echotastic sand flowing sonnet

          if (newTime % 60 === 0 && playConsideringHarmonic && newTime !== 0) {
            playConsideringHarmonic(); // Subtle prompt passing minutes
          }
          return newTime;
        });
      }, 1000);
    } else {
      window.dispatchEvent(new CustomEvent('global-timer-state', { detail: { activeTimer, timeLeft } }));
    }
    return () => clearInterval(interval);
  }, [activeTimer, timeLeft, playStrikingBowl, playConsideringHarmonic, playSandSonnet, setSonicVolumeState, setSymphonyTuning]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--bottom-bar-height',
      activeTimer ? '150px' : '80px'
    );
  }, [activeTimer]);

  const toggleTimer = useCallback((minutes) => {
    if (activeTimer === minutes) {
      setActiveTimer(null);
      setTimeLeft(0);
      window.dispatchEvent(new CustomEvent('global-timer-state', { detail: { activeTimer: null, timeLeft: 0 } }));
      // Revert volume and tuning if leaving Time Symphony
      if (minutes === 15 && setSonicVolumeState) setSonicVolumeState(0.5);
      if (minutes === 15 && setSymphonyTuning) setSymphonyTuning(false);
    } else {
      if (playStrikingBowl) playStrikingBowl(72);
      setActiveTimer(minutes);
      setTimeLeft(minutes * 60);
      window.dispatchEvent(new CustomEvent('global-timer-state', { detail: { activeTimer: minutes, timeLeft: minutes * 60 } }));
      // Time Symphony overdrive & tuning (Only applies aggressively in 15M mode if requested)
      if (minutes === 15 && instrumentMode) {
        if (setSonicVolumeState) setSonicVolumeState(3.3);
        if (setSymphonyTuning) setSymphonyTuning(true);
      } else {
        if (setSymphonyTuning) setSymphonyTuning(false);
      }
    }
  }, [activeTimer, instrumentMode, playStrikingBowl, setSonicVolumeState, setSymphonyTuning]);

  useEffect(() => {
    const handleCommand = (e) => toggleTimer(e.detail);
    window.addEventListener('start-global-timer', handleCommand);
    return () => window.removeEventListener('start-global-timer', handleCommand);
  }, [toggleTimer]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  const totalTime = activeTimer ? activeTimer * 60 : 1;
  const progress = activeTimer ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="global-timer-controls" style={{
      position: 'fixed', bottom: 'var(--space-md)', left: 'var(--space-md)',
      zIndex: 100, display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)',
      backgroundColor: activeTimer ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.4)',
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      padding: 'var(--space-md) var(--space-lg)', borderRadius: '2px',
      border: `1px solid ${activeTimer ? m.accent : 'rgba(255,255,255,0.05)'}`,
      transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
      boxShadow: activeTimer ? `0 0 40px ${m.accent}20` : 'none',
      opacity: 0.8
    }}
      onMouseEnter={e => e.currentTarget.style.opacity = 1}
      onMouseLeave={e => e.currentTarget.style.opacity = activeTimer ? 1 : 0.8}
      onClick={e => e.stopPropagation()}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.65rem', letterSpacing: '0.25em', color: m.accent, textTransform: 'uppercase', opacity: 0.7 }}>
          <b>[ ACTIVE PAUSE ]</b>
        </div>

        {/* Supersonic Sand Clock SVG */}
        {activeTimer && (
          <svg width="24" height="24" viewBox="0 0 24 24">
            {/* The Outer Frame of the Sand Clock */}
            <path d="M 5 2 L 19 2 L 12 11 L 19 22 L 5 22 L 12 11 Z" fill="none" stroke={`${m.accent}30`} strokeWidth="1.5" strokeLinejoin="round" />

            {/* Filling Sand "Flowing Upwards" (Progress builds from bottom) */}
            <path d="M 5 2 L 19 2 L 12 11 L 19 22 L 5 22 L 12 11 Z" fill={m.accent} opacity="0.9"
              style={{
                clipPath: 'url(#sand-clip)',
                transition: 'clip-path 1s linear, -webkit-clip-path 1s linear'
              }} />

            <defs>
              <clipPath id="sand-clip">
                {/* This rectangle grows from y=24 upwards depending on progress */}
                <rect x="0" y={22 - (20 * (progress / 100))} width="24" height={20 * (progress / 100)} />
              </clipPath>
            </defs>
          </svg>
        )}
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: '4px' }}>
        {(instrumentMode ? [15] : [5, 15, 22]).map(min => (
          <button
            key={min}
            onClick={() => toggleTimer(min)}
            style={{
              background: 'transparent',
              border: 'none', borderBottom: `1px solid ${activeTimer === min ? m.accent : 'transparent'}`,
              color: activeTimer === min ? m.accent : m.text1,
              fontFamily: 'var(--fMono)', fontSize: '0.85rem', padding: '0 0 4px 0',
              cursor: 'pointer', transition: 'all 0.4s ease',
              opacity: (activeTimer && activeTimer !== min) ? 0.3 : 1
            }}
            onMouseEnter={e => { if (activeTimer !== min) e.currentTarget.style.color = m.accent }}
            onMouseLeave={e => { if (activeTimer !== min) e.currentTarget.style.color = m.text1 }}
          >
            {instrumentMode && min === 15 ? '[ 15M SYMPHONY ]' : `${min}M`}
          </button>
        ))}
      </div>

      {activeTimer && (
        <div style={{
          fontFamily: 'var(--fSerif)', fontSize: '2.5rem', color: m.text1, textAlign: 'left',
          marginTop: 'var(--space-sm)', fontStyle: 'italic', letterSpacing: '0.05em', lineHeight: 1
        }}>
          {formatTime(timeLeft)}
        </div>
      )}
    </div>
  );
};

// ==========================================
// MAIN APP COMPONENT
// ==========================================
// ==========================================
// COMPONENT: LENTICULAR BRANDMARK (STEAM SANS SHOWCASE)
// ==========================================
const LenticularBrandmark = ({ onClick, user }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(p => (p + 1) % 4);
    }, 5500); // 5.5 seconds per phase
    return () => clearInterval(interval);
  }, []);

  return (
    <div onClick={onClick} className="nav-brand lenticular-brandmark" style={{
      position: 'relative',
      cursor: 'pointer',
      color: "var(--acc)",
      height: '1.4rem',
      width: 'auto', // Removed hard constraint to prevent "ncandescent" clipping
      minWidth: 'clamp(240px, 28vw, 300px)',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start', // Anchored left so it doesn't wander or clip centrally
      overflow: 'visible'
    }}>
      <AnimatePresence mode="wait">
        {phase === 0 && (
          <motion.div
            key="creative"
            initial={{ opacity: 0, filter: 'blur(8px)', fontVariationSettings: '"wght" 100' }}
            animate={{ opacity: 1, filter: 'blur(0px)', fontVariationSettings: '"wght" 600' }}
            exit={{ opacity: 0, filter: 'blur(8px)', fontVariationSettings: '"wght" 100' }}
            transition={{ duration: 2.0, ease: 'easeInOut' }}
            style={{ position: 'absolute', left: 0, fontFamily: "var(--fSerif)", textTransform: "uppercase", letterSpacing: "0.15em", fontSize: "clamp(0.7rem, 1.5vw, 0.9rem)", fontWeight: 600, whiteSpace: 'nowrap' }}
          >
            CREÅTIVE STEEPING
          </motion.div>
        )}

        {/* Phase 1: HARRIS Rendition (Solid, High Contrast) */}
        {phase === 1 && (
          <motion.div
            key="harris"
            initial={{ opacity: 0, filter: 'blur(8px)', fontVariationSettings: '"wght" 100', letterSpacing: '0.15em' }}
            animate={{ opacity: 1, filter: 'blur(0px)', fontVariationSettings: '"wght" 900', letterSpacing: '0.02em' }}
            exit={{ opacity: 0, filter: 'blur(8px)', fontVariationSettings: '"wght" 100', letterSpacing: '0.15em' }}
            transition={{ duration: 2.0, ease: 'easeInOut' }}
            style={{ position: 'absolute', left: 0, fontFamily: "var(--fMono)", textTransform: "uppercase", fontSize: "clamp(0.35rem, 0.75vw, 0.45rem)", whiteSpace: 'nowrap', color: 'var(--t1)' }}
          >
            A JOURNEY TO THE ESSENCE OF YOUR FLAVOR
          </motion.div>
        )}

        {/* Phase 2: HBA Stacking (The Echo Effect / Word Art) */}
        {phase === 2 && (
          <motion.div
            key="stacking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.0 }}
            style={{ position: 'absolute', left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
          >
            {/* The VAPOR Base */}
            <motion.div
              animate={{ opacity: 0.3, filter: 'blur(2px)', fontVariationSettings: '"wght" 300', letterSpacing: '0.10em', y: 6 }}
              style={{ position: 'absolute', left: 0, fontFamily: "var(--fMono)", textTransform: "uppercase", fontSize: "clamp(0.35rem, 0.75vw, 0.45rem)", whiteSpace: 'nowrap', color: 'var(--acc)' }}
            >
              A JOURNEY TO THE ESSENCE OF YOUR FLAVOR
            </motion.div>
            {/* The HBA Middle */}
            <motion.div
              animate={{ opacity: 0.6, filter: 'blur(0.5px)', fontVariationSettings: '"wght" 600', letterSpacing: '0.06em', y: 3 }}
              style={{ position: 'absolute', left: 0, fontFamily: "var(--fMono)", textTransform: "uppercase", fontSize: "clamp(0.35rem, 0.75vw, 0.45rem)", whiteSpace: 'nowrap', color: 'var(--t2)' }}
            >
              A JOURNEY TO THE ESSENCE OF YOUR FLAVOR
            </motion.div>
            {/* The HARRIS Peak */}
            <motion.div
              animate={{ opacity: 1, filter: 'blur(0px)', fontVariationSettings: '"wght" 900', letterSpacing: '0.02em', y: 0 }}
              style={{ position: 'absolute', left: 0, fontFamily: "var(--fMono)", textTransform: "uppercase", fontSize: "clamp(0.35rem, 0.75vw, 0.45rem)", whiteSpace: 'nowrap', color: 'var(--t1)' }}
            >
              A JOURNEY TO THE ESSENCE OF YOUR FLAVOR
            </motion.div>
          </motion.div>
        )}

        {/* Phase 3: VAPOR Rendition (Dissolving, Wide) */}
        {phase === 3 && (
          <motion.div
            key="vapor"
            initial={{ opacity: 0, filter: 'blur(0px)', fontVariationSettings: '"wght" 600', letterSpacing: '0.02em' }}
            animate={{ opacity: 0.45, filter: 'blur(2px)', fontVariationSettings: '"wght" 100', letterSpacing: '0.15em' }}
            exit={{ opacity: 0, filter: 'blur(10px)', fontVariationSettings: '"wght" 100', letterSpacing: '0.2em' }}
            transition={{ duration: 3.0, ease: 'easeOut' }}
            style={{ position: 'absolute', left: 0, fontFamily: "var(--fMono)", textTransform: "uppercase", fontSize: "clamp(0.3rem, 0.65vw, 0.4rem)", whiteSpace: 'nowrap', color: 'var(--acc)' }}
          >
            A JOURNEY TO THE ESSENCE OF YOUR FLAVOR
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function AppInner() {
  const [mode, setMode] = useState("incandescent");
  const [phase, setPhase] = useState("entrance"); // entrance, dashboard, portal
  const [identity, setIdentity] = useState("");
  const [sageTestingBusy, setSageTestingBusy] = useState(false); // To test the Vesica Piscis animation

  // State for Navigation Overlays
  const [showCompass, setShowCompass] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showObservatory, setShowObservatory] = useState(false); // The Double-Secret Backend
  const [showLegacyPortal, setShowLegacyPortal] = useState(false); // The Social Geometry Generator
  const [showCalendar, setShowCalendar] = useState(false); // The Echolocation Sonar Map
  const [activeVessel, setActiveVessel] = useState(null); // The currently open vessel
  const [instrumentMode, setInstrumentMode] = useState(false); // Secrets: The Hexagong
  const [sageExpanded, setSageExpanded] = useState(false); // Sage interaction visibility
  const [ledgerOpen, setLedgerOpen] = useState(false); // Sub-overlay for editorial deep dives
  const [authOpen, setAuthOpen] = useState(false); // Authentication popup state
  const [navMenuOpen, setNavMenuOpen] = useState(false); // Hamburger menu state
  const [aboutOpen, setAboutOpen] = useState(false); // About Creative Steeping panel
  const [privacyOpen, setPrivacyOpen] = useState(false); // Privacy Policy panel
  const [pressOpen, setPressOpen] = useState(false); // Press panel
  const [isClosingVessel, setIsClosingVessel] = useState(false);
  const [hasEngaged5D, setHasEngaged5D] = useState(() => localStorage.getItem('steeping_5d_engaged') === 'true');
  const [lockedTooltipOpen, setLockedTooltipOpen] = useState(null); // vessel.num of locked tooltip showing
  const urlDirectedPhase = useRef(false); // prevents tier-aware routing from overriding URL-set phase

  // Accessibility: Reading Lens Mode (dyslexia-supportive typography)
  const [readingMode, setReadingMode] = useState(() => localStorage.getItem('steeping_reading_mode') === 'true');

  // Native URL Routing for independent portals
  useEffect(() => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/legacy')) {
      setShowLegacyPortal(true);
    } else if (path.includes('/calendar')) {
      setShowCalendar(true);
    } else if (path.includes('/dashboard')) {
      urlDirectedPhase.current = true;
      setPhase('dashboard');
    } else if (path.includes('/nightlight')) {
      urlDirectedPhase.current = true;
      setPhase('portal');
      const v08 = VESSELS.find(v => v.num === '08') || VESSELS[7] || null;
      if (v08) setActiveVessel(v08);
      setInstrumentMode(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-reading-mode', readingMode ? 'open' : 'closed');
    localStorage.setItem('steeping_reading_mode', readingMode);
  }, [readingMode]);

  // Subterranean Bay State (Eurorack Tapping Sequence)
  const [eqParams, setEqParams] = useState({ friction: 0, avian: 0, crackle: 0, drone: 0 });
  const [vessel07Clicks, setVessel07Clicks] = useState(0);
  const [showSubterraneanBay, setShowSubterraneanBay] = useState(false);

  useEffect(() => {
    if (isClosingVessel) {
      const timer = setTimeout(() => {
        setActiveVessel(null);
        setIsClosingVessel(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isClosingVessel]);

  // Supabase Auth Integration
  const { user, profile, signOut } = useAuth();

  // Spatial Seed Derivation (Numerology 1-9 based on ID)
  const spatialSeed = useMemo(() => {
    if (!user?.id) return 1;
    let sum = 0;
    for (let i = 0; i < user.id.length; i++) sum += user.id.charCodeAt(i);
    return (sum % 9) + 1;
  }, [user]);

  // Apply Seed-Based Attunements
  useEffect(() => {
    if (spatialSeed <= 3) {
        // Rooted: Heavier grain
        document.documentElement.style.setProperty('--grain-opacity', '0.08');
        document.documentElement.style.setProperty('--grain-blend', 'overlay');
    } else if (spatialSeed <= 6) {
        // Atmospheric: Lighter stardust
        document.documentElement.style.setProperty('--grain-opacity', '0.04');
        document.documentElement.style.setProperty('--grain-blend', 'color-dodge');
    } else {
        // Ascendant: Warmer copper tone
        document.documentElement.style.setProperty('--grain-opacity', '0.05');
        document.documentElement.style.setProperty('--grain-blend', 'overlay');
        document.documentElement.style.setProperty('--acc', '#e69f35'); // Warmer Gold/Copper
    }
  }, [spatialSeed]);
  const { isEngaged, isInneractive, hasPersistentScore } = useTier();

  // Immersive Matrix Collective Resonance
  const { broadcastPing } = useSteepingCircles();

  // EH-01: Vessel completion ceremony state
  const [vesselCompletionActive, setVesselCompletionActive] = useState(false);
  const [completedVesselName, setCompletedVesselName] = useState('');
  const [vesselTransition, setVesselTransition] = useState(null);

  // EH-02: L1 → L2 contextual upgrade invitation
  const [showUpgradeInvite, setShowUpgradeInvite] = useState(false);

  // Tier-aware phase routing:
  // :: Engaged / Inneractive practitioners → Space Dashboard
  // :: Interactive (L1) practitioners → portal directly (no dashboard)
  // :: URL-directed phases (urlDirectedPhase.current) are never overridden
  useEffect(() => {
    if (user && phase === "entrance" && !urlDirectedPhase.current) {
      setPhase(isEngaged ? "dashboard" : "portal");
    }
  }, [user, phase, isEngaged]);

  // Mode toggles: scroll active button into view on mobile when mode changes
  const modeButtonRefs = useRef({});
  useEffect(() => {
    modeButtonRefs.current[mode]?.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
  }, [mode]);

  // VISUAL REFINEMENT: Parallax Hexagong Matrix
  // Captures normalized screen coordinates (-1 to 1) for UI parallax shifts.
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      document.documentElement.style.setProperty('--mouse-x', x);
      document.documentElement.style.setProperty('--mouse-y', y);
    };
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  // Sonic Awareness State
  const [sonicVolume, setSonicVolumeState] = useState(0.5);
  const [sonicAmbient, setSonicAmbient] = useState(false); // Starts OFF
  const [audioEngineMode, setAudioEngineMode] = useState('soul_sonnet'); // 'soul_sonnet' or 'immersive'
  const [sonicExpanded, setSonicExpanded] = useState(false); // Collapsible z-axis respect

  const m = MODES[mode];

  // The CSS variables for the current mode
  const styleVars = {
    "--bg": m.bg,
    "--surf": m.surface,
    "--card": m.cardBg,
    "--acc": m.accent,
    "--g": m.glow,
    "--t1": m.text1,
    "--t2": m.text2,
    "--navH": T.navH,
    "--fSerif": F.serif,
    "--fMono": F.mono,
    "--fBody": F.body,
    "--space-xs": T.space.xs,
    "--space-sm": T.space.sm,
    "--space-md": T.space.md,
    "--space-lg": T.space.lg,
    "--space-xl": T.space.xl,
    "--space-xxl": T.space.xxl,
    "--curve": T.curve,
    background: "var(--bg)",
    color: "var(--t1)",
    fontFamily: "var(--fBody)",
    minHeight: "100dvh",
    transition: "background 1.2s ease, color 1.2s ease"
  };

  // Initialize the Subatomic Resonance Canvas
  const canvasRef = useResonanceCanvas(m.accentRGB || [212, 146, 42]); // Default incandescent gold if RGB not explicitly mapped

  // Provide RGB values to MODES for the canvas
  useEffect(() => {
    MODES.incandescent.accentRGB = [212, 146, 42];
    MODES.oceanic.accentRGB = [56, 189, 248];
    MODES.emergent.accentRGB = [229, 229, 229];
    MODES.planetary.accentRGB = [255, 0, 255];
  }, []);

  // Sonic Wayfinding bridge: steep state feeds into the sonic engine, updated
  // from wayfindingState after both hooks have initialized. See useSonnetEngine.jsx.
  const [steepForSonic, setSteepForSonic] = useState('essence');

  // Initialize the Sonnet Audio Engine (receives steep for harmonic modulation)
  const { initEngine, updateBinauralTracking, playStrikingBowl, playHarmonicChord, playAlgoraveSynth, playConsideringHarmonic, playSandSonnet, playCompletionCue, playRootForagingFrequency, setMasterVolume, setAmbientActive, setSymphonyTuning, setEssayistAmbient, playEssayistTransition } = useSonnetEngine(mode, eqParams, steepForSonic);

  // Initialize The Steeping Sage :: Innerverse Wayfinding Engine
  const { askSage, sageResponse, isThinking, historicalScore, hasMoreHistory, loadMoreHistory, setSageResponse, wayfindingState, onTextChange: wayfindingTextChange, codexReady, surface } = useSageWayfinding(identity, playStrikingBowl);

  // Bridge: pipe wayfinding steep to the sonic engine on each position change
  useEffect(() => {
    if (wayfindingState?.currentSteep && wayfindingState.currentSteep !== steepForSonic) {
      setSteepForSonic(wayfindingState.currentSteep);
    }
  }, [wayfindingState?.currentSteep, steepForSonic]);

  // Sage Essayist Composer :: drives sonic environment through flow phases
  useSageEssayistComposer({
    signals: wayfindingState?.signals,
    wordCount: wayfindingState?.signals?.wordCount ?? 0,
    mode,
    sageExpanded,
    setEssayistAmbient,
    playEssayistTransition,
  });

  // Phase 05 Bugfix: Ensure Sage context resets when crossing vessel boundaries
  useEffect(() => {
    setSageResponse('');
  }, [activeVessel?.num, instrumentMode, setSageResponse]);

  const handleAskSage = (query, sageMode) => {
    if (broadcastPing) broadcastPing('SAGE_INQUIRY');
    askSage(query, sageMode);
    const textarea = document.getElementById('sage-textarea-input');
    if (textarea) textarea.value = '';
  };

  // Sync React State to Audio Engine
  useEffect(() => {
    setMasterVolume(sonicVolume);
  }, [sonicVolume, setMasterVolume]);

  useEffect(() => {
    setAmbientActive(sonicAmbient);
  }, [sonicAmbient, setAmbientActive]);

  // Phase 05: Faint Harmonic Signatures while The Sage Considers
  useEffect(() => {
    if (!isThinking) return;

    // Play immediately upon thinking
    playConsideringHarmonic();

    // Trigger random crystalline swells while waiting
    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        playConsideringHarmonic();
      }
    }, 2500); // Check every 2.5 seconds to see if it should chime

    return () => clearInterval(interval);
  }, [isThinking, playConsideringHarmonic]);

  // Phase 06: The Sonic Sketch (Gallery-Ready Artifact Generator)
  const generateSonicSketch = (score) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920; // Gallery/Mobile-Wallpaper Aspect Ratio
    const ctx = canvas.getContext('2d');

    // 1. ZUBERI-styled monochromatic backdrop
    ctx.fillStyle = m.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. The Algorithmic 'Sonic Imprint' (Cymatics/Mandala generation)
    // We seed the visual frequency using the ASCII values of their query
    const seedString = score.query + score.response;
    let organicSeed = 0;
    for (let i = 0; i < seedString.length; i++) {
      organicSeed += seedString.charCodeAt(i);
    }

    const rings = 12 + (organicSeed % 24); // Between 12 and 36 rings
    const centerX = canvas.width / 2;
    const centerY = canvas.height * 0.4; // Slightly above center

    ctx.lineWidth = 1;
    for (let r = 0; r < rings; r++) {
      const radius = 50 + r * (800 / rings);
      const waveCount = 3 + (organicSeed % 9); // Number of peaks in the wave
      const waveAmplitude = 10 + ((organicSeed * r) % 60);

      ctx.beginPath();
      for (let angle = 0; angle < Math.PI * 2; angle += 0.05) {
        // Modulate the radius with a sine wave to create a sound-wave distortion
        const rOffset = radius + Math.sin(angle * waveCount + (r * 0.5)) * waveAmplitude;
        const x = centerX + Math.cos(angle) * rOffset;
        const y = centerY + Math.sin(angle) * rOffset;
        if (angle === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      ctx.strokeStyle = m.accent;
      // The rings fade out organically toward the edges
      ctx.globalAlpha = Math.max(0.05, 0.4 - (r / rings));
      ctx.stroke();
    }

    // 3. The Grid / Architecture Lines
    ctx.globalAlpha = 0.15;
    ctx.beginPath();
    ctx.moveTo(centerX, 0); ctx.lineTo(centerX, canvas.height);
    ctx.moveTo(0, centerY); ctx.lineTo(canvas.width, centerY);
    ctx.stroke();

    // 4. Reset Alpha for Typography
    ctx.globalAlpha = 1.0;

    // 5. Header: The Date and Frequency Map
    ctx.font = '24px "DM Mono", monospace';
    ctx.fillStyle = m.accent;
    ctx.textAlign = 'center';
    ctx.fillText(`[ KINEMATICS: ${organicSeed}Hz / ${new Date(score.timestamp).toLocaleDateString()} / ${score.mode.toUpperCase()} ]`, centerX, 120);

    // 6. The Original Query / Prompt
    ctx.font = 'italic 48px "Playfair Display", serif';
    ctx.fillStyle = m.text1 || '#fff';

    // Wrapper for multi-line elegant text for the prompt
    const wrapText = (context, text, x, y, maxWidth, lineHeight, isCenter = true) => {
      const words = text.split(/( |\\n)/);
      let line = '';
      let currentY = y;

      for (let n = 0; n < words.length; n++) {
        if (words[n] === '\\n') {
          context.fillText(line, x, currentY);
          line = '';
          currentY += lineHeight;
          continue;
        }
        let testLine = line + words[n];
        let testWidth = context.measureText(testLine).width;
        if (testWidth > maxWidth && n > 0 && words[n] !== ' ') {
          context.fillText(line, x, currentY);
          line = words[n];
          currentY += lineHeight;
        } else {
          line = testLine;
        }
      }
      if (line.trim() !== '') context.fillText(line, x, currentY);
      return currentY; // Return where the text specifically ended
    };

    const queryEndY = wrapText(ctx, `"${score.query}"`, centerX, canvas.height * 0.75, 800, 64, true) + 80;

    // 7. The Transmission (Sage Response)
    ctx.font = '28px "EB Garamond", serif';
    ctx.fillStyle = m.text2 || '#ddd';
    ctx.globalAlpha = 0.8;
    ctx.textAlign = 'left';
    // Truncate the response for the visual poster if it's too long, ending artfully
    let truncatedResponse = score.response.replace(/\\n/g, '  ');
    if (truncatedResponse.length > 350) truncatedResponse = truncatedResponse.substring(0, 350) + "...";

    wrapText(ctx, truncatedResponse, 140, queryEndY, 800, 42, false);

    // 8. Bottom Branding & Signature
    ctx.globalAlpha = 1.0;
    ctx.font = '20px "DM Mono", monospace';
    ctx.fillStyle = m.accent;
    ctx.textAlign = 'center';
    ctx.fillText('CREÅTIVE STEEPING : THE ÅLÏEN SCÖÕL', centerX, canvas.height - 80);

    // 9. Frame the Canvas
    ctx.strokeStyle = m.accent;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;
    ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

    // Trigger Download
    const dataURL = canvas.toDataURL('image/jpeg', 0.95);
    const link = document.createElement('a');
    link.download = `sonic_sketch_${Date.now()}.jpg`;
    link.href = dataURL;
    link.click();

    // Play subtle chime on export confirming resonance captured
    playStrikingBowl(80);
  };

  useEffect(() => {
    const handler = (e) => generateSonicSketch(e.detail);
    window.addEventListener('generate-emulsion-artifact', handler);
    return () => window.removeEventListener('generate-emulsion-artifact', handler);
  }, []);


  return (
    <div
      style={styleVars}
      className="app-container"
      onClick={() => initEngine()}
      onMouseMove={(e) => {
        updateBinauralTracking(e.clientX, e.clientY, audioEngineMode);
      }}
    >
      <BuoyantGrain />

      {/* V5 Resonance Canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100dvh', zIndex: 0, pointerEvents: 'none' }}
      />

      {/* GLOBAL NAVIGATION */}
      <nav className="top-nav">
        <LenticularBrandmark onClick={() => setPhase(user ? 'portal' : 'entrance')} user={user} />
        {phase === 'portal' && (
          <div className="mode-toggles">
            {Object.keys(MODES).map(k => (
              <button key={k} onClick={() => setMode(k)}
                ref={el => { modeButtonRefs.current[k] = el; }}
                className={mode === k ? "mode-btn active" : "mode-btn"}
                style={{ color: mode === k ? "var(--acc)" : "var(--t2)", whiteSpace: 'nowrap' }}>
                {MODES[k].name}
              </button>
            ))}
          </div>
        )}
        {/* Click-outside handler to close nav menu */}
        {navMenuOpen && (
          <div onClick={() => setNavMenuOpen(false)} style={{
            position: 'fixed', inset: 0, zIndex: 999
          }} aria-hidden="true" />
        )}

        <div className="nav-school"
          style={{ position: 'relative', fontFamily: "var(--fMono)", textTransform: "uppercase", letterSpacing: "0.15em", fontSize: "0.8rem", color: "var(--t2)", display: 'flex', flexDirection: 'column', alignItems: 'flex-end', zIndex: 1000 }}>

          {/* Trigger: click-to-toggle, no hover navigation */}
          <button
            onClick={() => setNavMenuOpen(prev => !prev)}
            aria-expanded={navMenuOpen}
            aria-label="Toggle navigation menu"
            style={{
              background: 'none', border: 'none', padding: 0,
              color: navMenuOpen ? 'var(--t1)' : 'var(--t2)',
              opacity: navMenuOpen ? 1 : 0.7,
              whiteSpace: 'nowrap', cursor: 'pointer',
              fontFamily: 'var(--fMono)', fontSize: '0.8rem',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', gap: '8px',
              transition: 'all 0.3s ease'
            }}>
            BEGIN YOUR STEEP
            <span style={{ fontSize: '1rem', lineHeight: 1 }}>{navMenuOpen ? '✕' : '☰'}</span>
          </button>

          <div className="nav-dropdown-container" style={{
            position: 'absolute', top: '100%', right: 0, paddingTop: '12px',
            opacity: navMenuOpen ? 1 : 0,
            visibility: navMenuOpen ? 'visible' : 'hidden', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: navMenuOpen ? 'translateY(0)' : 'translateY(-10px)'
          }}>
            <div className="nav-dropdown-inner" style={{
              display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-md)',
              background: 'var(--bg)', border: `1px solid var(--acc)`, padding: 'var(--space-lg)',
              boxShadow: `0 10px 40px rgba(0,0,0,0.8)`, minWidth: '220px'
            }}>

              {/* ① BEGIN YOUR STEEP :: top position, subtle hierarchical glow */}
              {!user ? (
                <button onClick={() => { setAuthOpen(true); setNavMenuOpen(false); }} style={{
                  background: 'none', border: 'none',
                  color: 'var(--acc)', borderBottom: '1px solid transparent',
                  transition: 'border-bottom 1.2s ease, text-shadow 0.6s ease', cursor: 'pointer',
                  fontFamily: 'var(--fMono)', fontSize: '0.85rem', letterSpacing: '0.15em',
                  textTransform: 'uppercase', whiteSpace: 'nowrap',
                  textShadow: `0 0 8px var(--acc)`
                }} onMouseEnter={e => { e.currentTarget.style.borderBottom = '1px solid var(--acc)'; e.currentTarget.style.textShadow = '0 0 14px var(--acc)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderBottom = '1px solid transparent'; e.currentTarget.style.textShadow = '0 0 8px var(--acc)'; }}>
                  <b>[ BEGIN YOUR STEEP ]</b>
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <button onClick={() => { setPhase('dashboard'); setNavMenuOpen(false); }} style={{
                    background: 'none', border: 'none',
                    color: 'var(--t1)', borderBottom: '1px solid transparent',
                    transition: 'border-bottom 1.2s ease, text-shadow 0.6s ease', cursor: 'pointer',
                    fontFamily: 'var(--fMono)', fontSize: '0.85rem', letterSpacing: '0.15em',
                    textTransform: 'uppercase', whiteSpace: 'nowrap',
                    textShadow: `0 0 8px var(--t1)`
                  }} onMouseEnter={e => { e.currentTarget.style.borderBottom = '1px solid var(--t1)'; e.currentTarget.style.textShadow = '0 0 14px var(--t1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderBottom = '1px solid transparent'; e.currentTarget.style.textShadow = '0 0 8px var(--t1)'; }}
                    title="Return to your Space">
                    <b>[ MY SANCTUARY ]</b>
                  </button>
                  <button onClick={() => { setAuthOpen(true); setNavMenuOpen(false); }} style={{
                    background: 'none', border: 'none',
                    color: 'var(--acc)', borderBottom: '1px solid transparent',
                    transition: 'border-bottom 1.2s ease', cursor: 'pointer', fontFamily: 'var(--fMono)',
                    fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap'
                  }} onMouseEnter={e => e.currentTarget.style.borderBottom = '1px solid var(--acc)'}
                    onMouseLeave={e => e.currentTarget.style.borderBottom = '1px solid transparent'}
                    title="View Steeperverse Layers">
                    <b>[ YOUR LAYERS ]</b>
                  </button>
                  <button onClick={() => signOut()} style={{
                    background: 'none', border: 'none',
                    color: 'var(--t2)', borderBottom: '1px solid transparent',
                    transition: 'border-bottom 1.2s ease, opacity 0.3s ease', cursor: 'pointer',
                    fontFamily: 'var(--fMono)', fontSize: '0.7rem', letterSpacing: '0.15em',
                    textTransform: 'uppercase', whiteSpace: 'nowrap', opacity: 0.6
                  }} onMouseEnter={e => { e.currentTarget.style.borderBottom = '1px solid var(--t2)'; e.currentTarget.style.opacity = 0.9; }}
                    onMouseLeave={e => { e.currentTarget.style.borderBottom = '1px solid transparent'; e.currentTarget.style.opacity = 0.6; }}
                    title={`Departing presence: ${user.email}`}>
                    <b>( DEPART )</b>
                  </button>
                  {user?.email === 'thealienscool@gmail.com' && (
                    <>
                    <button onClick={() => { setShowObservatory(true); setNavMenuOpen(false); }} style={{
                      background: 'none', border: 'none',
                      color: 'var(--acc)', borderBottom: '1px solid transparent',
                      transition: 'border-bottom 1.2s ease, opacity 0.3s ease, filter 0.8s ease', cursor: 'pointer',
                      fontFamily: 'var(--fMono)', fontSize: '0.7rem', letterSpacing: '0.15em',
                      textTransform: 'uppercase', whiteSpace: 'nowrap', opacity: 0.8
                    }} onMouseEnter={e => { e.currentTarget.style.borderBottom = '1px solid var(--acc)'; e.currentTarget.style.opacity = 1; e.currentTarget.style.filter = 'drop-shadow(0 0 8px var(--acc))'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderBottom = '1px solid transparent'; e.currentTarget.style.opacity = 0.8; e.currentTarget.style.filter = 'none'; }}
                      title="Double-Secret Backend">
                      <b>[ OBSERVATORY ]</b>
                    </button>
                    <button onClick={() => { setShowLegacyPortal(true); setNavMenuOpen(false); }} style={{
                      background: 'none', border: 'none',
                      color: 'var(--acc)', borderBottom: '1px solid transparent',
                      transition: 'border-bottom 1.2s ease, opacity 0.3s ease, filter 0.8s ease', cursor: 'pointer',
                      fontFamily: 'var(--fMono)', fontSize: '0.7rem', letterSpacing: '0.15em',
                      textTransform: 'uppercase', whiteSpace: 'nowrap', opacity: 0.8
                    }} onMouseEnter={e => { e.currentTarget.style.borderBottom = '1px solid var(--acc)'; e.currentTarget.style.opacity = 1; e.currentTarget.style.filter = 'drop-shadow(0 0 8px var(--acc))'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderBottom = '1px solid transparent'; e.currentTarget.style.opacity = 0.8; e.currentTarget.style.filter = 'none'; }}
                      title="Legacy Assets Generator">
                      <b>[ /LEGACY PORTAL ]</b>
                    </button>
                    </>
                  )}
                </div>
              )}

              {/* Divider */}
              <div style={{ width: '100%', height: '1px', background: `var(--acc)`, opacity: 0.2 }} />

              {/* ② Secondary navigation items */}
              <button onClick={() => { setLedgerOpen(true); setNavMenuOpen(false); }} style={{
                background: 'none', border: 'none',
                color: 'var(--acc)', borderBottom: '1px solid transparent',
                transition: 'border-bottom 1.2s ease', cursor: 'pointer', fontFamily: 'var(--fMono)',
                fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap'
              }} onMouseEnter={e => e.currentTarget.style.borderBottom = '1px solid var(--acc)'}
                onMouseLeave={e => e.currentTarget.style.borderBottom = '1px solid transparent'}>
                <b>[ STEEPING NOTES ]</b>
              </button>

              <button onClick={() => { setShowGuide(true); setNavMenuOpen(false); }} style={{
                background: 'none', border: 'none',
                color: 'var(--acc)', borderBottom: '1px solid transparent',
                transition: 'border-bottom 1.2s ease', cursor: 'pointer', fontFamily: 'var(--fMono)',
                fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                textAlign: 'right'
              }} onMouseEnter={e => e.currentTarget.style.borderBottom = '1px solid var(--acc)'}
                onMouseLeave={e => e.currentTarget.style.borderBottom = '1px solid transparent'}
                title="View the Guide to the Steeperverse">
                <b>[ GUIDE TO THE STEEPERVERSE ]</b>
              </button>

              <button onClick={() => { setShowCompass(true); setNavMenuOpen(false); }} style={{
                background: 'none', border: 'none',
                color: 'var(--acc)', borderBottom: '1px solid transparent',
                transition: 'border-bottom 1.2s ease', cursor: 'pointer', fontFamily: 'var(--fMono)',
                fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap'
              }} onMouseEnter={e => e.currentTarget.style.borderBottom = '1px solid var(--acc)'}
                onMouseLeave={e => e.currentTarget.style.borderBottom = '1px solid transparent'}
                title="5D Biometric Resonance Anchor">
                <b>[ ME IN 5D ]</b>
              </button>

              {/* Divider before About */}
              <div style={{ width: '100%', height: '1px', background: `var(--acc)`, opacity: 0.2 }} />

              {/* ③ ABOUT CREÅTIVE STEEPING :: bottom of menu */}
              <button onClick={() => { setAboutOpen(true); setNavMenuOpen(false); }} style={{
                background: 'none', border: 'none',
                color: 'var(--t2)', borderBottom: '1px solid transparent',
                transition: 'border-bottom 1.2s ease, color 0.3s ease', cursor: 'pointer', fontFamily: 'var(--fMono)',
                fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                opacity: 0.8
              }} onMouseEnter={e => { e.currentTarget.style.borderBottom = '1px solid var(--t2)'; e.currentTarget.style.opacity = 1; }}
                onMouseLeave={e => { e.currentTarget.style.borderBottom = '1px solid transparent'; e.currentTarget.style.opacity = 0.8; }}>
                [ ABOUT CREÅTIVE STEEPING ]
              </button>

            </div>
          </div>
        </div>
      </nav>

      {phase === "entrance" ? (
        <div className="entrance-screen"
          onMouseMove={(e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            e.currentTarget.style.setProperty('--mouseX', `${(x - 0.5) * 100}px`);
            e.currentTarget.style.setProperty('--mouseY', `${(y - 0.5) * 100}px`);
          }}
          style={{ position: 'relative', overflow: 'hidden' }}>

          {/* Parallax Layer 1: The Deep Field (Video) */}
          <div style={{
            position: 'absolute', top: '-10%', left: '-10%', width: '120%', height: '120%',
            zIndex: 0,
            transform: 'translate(calc(var(--mouseX, 0px) * -0.15), calc(var(--mouseY, 0px) * -0.15))',
            pointerEvents: 'none'
          }}>
            {mode !== 'darkMatter' && (
              <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) contrast(1.2) brightness(0.2)' }}>
                <source src={`${import.meta.env.BASE_URL}assets/videos/opening_void.mp4`} type="video/mp4" />
              </video>
            )}
          </div>

          {/* Parallax Layer 3: The Breath Path (Mid-ground overlay) */}
          <div style={{
            position: 'absolute', top: '-10%', left: '-10%', width: '120%', height: '120%',
            zIndex: 1, mixBlendMode: 'screen', opacity: 0.1,
            transform: 'translate(calc(var(--mouseX, 0px) * -0.35), calc(var(--mouseY, 0px) * -0.35))',
            pointerEvents: 'none'
          }}>
            {mode !== 'darkMatter' && (
              <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) contrast(1.4) brightness(0.2)' }}>
                <source src={`${import.meta.env.BASE_URL}assets/videos/boundary.mp4`} type="video/mp4" />
              </video>
            )}
          </div>

          <div className="entrance-content" style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ fontFamily: 'var(--fMono)', color: 'var(--acc)', opacity: 1, fontWeight: 'bold', letterSpacing: '0.15em', marginTop: '4px', marginBottom: 'clamp(1rem, 3vh, 2.5rem)', fontSize: '0.9rem', textAlign: 'center', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
              PATIENCE × PROCRASTINATION = STEEPING
            </div>

            <h1 className="entrance-headline">
              <span className="accent-text" style={{ color: "var(--acc)" }}>Who</span> do I<br />
              Think I Am?
            </h1>

            <div className="entrance-subtext">
              <p>Your answer opens the steep.</p>
              <p>These waters receive you as the leaf.</p>
            </div>

            <div className="entrance-input-group">
              <input
                className="entrance-input"
                id="identity-input"
                aria-label="Enter your name or identity to begin your steep"
                aria-required="true"
                value={identity}
                onChange={e => setIdentity(e.target.value)}
                placeholder="I am..."
                onKeyDown={e => {
                  initEngine();
                  // Avoid sonifying non-character keys like Shift/Backspace endlessly
                  if (e.key.length === 1 || e.key === 'Enter') {
                    playStrikingBowl(e.keyCode);
                    if (canvasRef.current && canvasRef.current.triggerResonance) {
                      // Trigger visual wave from roughly center-bottom screen
                      canvasRef.current.triggerResonance(window.innerWidth / 2, window.innerHeight * 0.65);
                    }
                  }

                  if (e.key === "Enter" && identity.trim().length > 2) {
                    setPhase("portal");
                  }
                }}
              />
              <button
                className="enter-button"
                aria-label="Commence Steeping :: begin your journey"
                onClick={() => {
                  if (identity.trim().length > 2) setPhase("portal");
                }}
              >
                <b>[ COMMENCE STEEPING ]</b>
              </button>
            </div>

            <div className="entrance-covenant">
              <p><span style={{ borderBottom: "1px solid var(--acc)", color: "var(--acc)", paddingBottom: "2px" }}>YOUR RESONANCE.</span> THIS IS HOW WE STEEP TOGETHER ACROSS OCEANS.</p>
            </div>
          </div>

          <WhatSteepersSay m={m} />

          {/* Steeperverse Footer */}
          <div style={{
            position: 'absolute', bottom: 'var(--space-md)', width: '100%',
            display: 'flex', justifyContent: 'center', gap: 'var(--space-xl)',
            fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: m.text2, letterSpacing: '0.15em',
            zIndex: 10, opacity: 0.6
          }}>
            <span style={{ cursor: 'pointer', transition: 'color 0.3s' }} onClick={() => setPrivacyOpen(true)} onMouseEnter={e => e.currentTarget.style.color = m.accent} onMouseLeave={e => e.currentTarget.style.color = m.text2}>[ PRIVACY POLICY ]</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.3s' }} onClick={() => setPressOpen(true)} onMouseEnter={e => e.currentTarget.style.color = m.accent} onMouseLeave={e => e.currentTarget.style.color = m.text2}>[ PRESS ]</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.3s' }} onClick={() => setAboutOpen(true)} onMouseEnter={e => e.currentTarget.style.color = m.accent} onMouseLeave={e => e.currentTarget.style.color = m.text2}>[ ABOUT ]</span>
            <span>CREÅTIVE STEEPING © {new Date().getFullYear()}</span>
          </div>
        </div>
      ) : phase === "dashboard" ? (
        <SteepingSpaceDashboard
          m={m}
          onEnterPortal={() => { initEngine(); setPhase("portal"); }}
          onSignOut={() => { signOut(); setPhase("entrance"); }}
        />
      ) : (
        <div className="portal-screen">
          <SteeperverseBackground accentColor={m.accent} />
          <main style={{ marginTop: '0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* THE SAGE ENCOUNTER (CINEMATIC MOCKUP) */}
            {!activeVessel && (
              <div className="sage-encounter" style={{
                width: '100%', maxWidth: '700px', margin: '10vh auto 15vh auto',
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
              }}>
                <EyeOfTheSage sageBusy={sageTestingBusy} accentColor="var(--acc)" />

                <h2 style={{
                  fontFamily: 'var(--fSerif)', fontSize: 'clamp(24px, 4vw, 36px)',
                  fontWeight: 400, fontStyle: 'italic', color: 'var(--t1)',
                  marginTop: 'var(--space-xl)', marginBottom: 'var(--space-md)'
                }}>
                  <span style={{ color: 'var(--acc)' }}>{identity || "Traveler"}</span>.
                </h2>

                <div style={{ fontFamily: 'var(--fBody)', fontSize: '1.2rem', color: 'var(--t2)', marginBottom: 'var(--space-md)' }}>
                  Where Do You Find Your Self?
                </div>

                <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--acc)', opacity: 0.5, marginBottom: 'var(--space-xl)', textTransform: 'uppercase' }}>
                  [ sage essayist ]
                </div>

                {!sageExpanded ? (
                  <button
                    onClick={() => setSageExpanded(true)}
                    style={{
                      background: 'none', border: 'none',
                      color: 'var(--acc)', fontFamily: 'var(--fMono)',
                      fontSize: '0.9rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                      cursor: 'pointer', borderBottom: '1px solid transparent',
                      paddingBottom: '4px', marginBottom: 'var(--space-xl)',
                      opacity: 0.8, transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.borderBottom = '1px solid var(--acc)' }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = 0.8; e.currentTarget.style.borderBottom = '1px solid transparent' }}
                  >
                    <b>[ LOCATE YOUR SELF ]</b>
                  </button>
                ) : (
                  <div style={{ width: '100%', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-15px', right: '0', fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: 'var(--acc)', opacity: sageTestingBusy ? 0.8 : 0, transition: 'opacity 0.5s', letterSpacing: '0.1em' }}>
                        [ something is arriving ]
                    </div>
                    <textarea
                      id="sage-textarea-input"
                      placeholder="What is alive in you right now?"
                      onFocus={() => setSageTestingBusy(true)}
                      onBlur={() => setSageTestingBusy(false)}
                      onInput={(e) => wayfindingTextChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key.length === 1 || e.key === 'Enter' || e.key === 'Backspace') {
                          playStrikingBowl(e.keyCode || 50);
                        }
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          document.getElementById('sage-transmit-btn')?.click();
                        }
                      }}
                      style={{
                        width: '100%', minHeight: '80px', background: 'transparent',
                        border: 'none', borderBottom: `1px solid ${sageTestingBusy ? '#fff' : 'var(--acc)'}`,
                        color: sageTestingBusy ? '#fff' : 'var(--t1)',
                        fontFamily: 'var(--fBody)', fontSize: '1.3rem',
                        padding: 'var(--space-md) 0', outline: 'none', resize: 'none', textAlign: 'center',
                        textShadow: sageTestingBusy ? '0 0 16px var(--acc)' : 'none',
                        boxShadow: sageTestingBusy ? '0px 10px 20px -10px var(--acc)' : 'none',
                        transition: 'all 0.4s'
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-sm)' }}>
                        <span style={{ fontFamily: 'var(--fMono)', fontSize: '0.65rem', color: 'var(--t2)', opacity: sageTestingBusy ? 0.6 : 0, transition: 'opacity 0.5s' }}>
                            when it's ready :: ENTER
                        </span>
                        <button 
                            id="sage-transmit-btn"
                            onClick={() => {
                                const query = document.getElementById('sage-textarea-input').value.trim();
                                if (query !== '') {
                                    handleAskSage(query, mode);
                                }
                            }}
                            style={{
                                background: 'transparent', border: '1px solid var(--acc)', color: 'var(--acc)',
                                fontFamily: 'var(--fMono)', fontSize: '0.7rem', padding: '6px 14px', cursor: 'pointer',
                                opacity: sageTestingBusy ? 1 : 0.4, transition: 'all 0.5s', letterSpacing: '0.15em'
                            }}
                        >
                            [ steep this ]
                        </button>
                    </div>
                    {sageResponse ? (
                      <div style={{
                        fontFamily: 'var(--fBody)', fontSize: '1.2rem', lineHeight: 1.6,
                        color: 'var(--t1)', marginTop: 'var(--space-lg)', textAlign: 'left',
                        padding: 'var(--space-md)', borderLeft: '1px solid var(--acc)',
                        opacity: 0.9, whiteSpace: 'pre-wrap'
                      }}>
                        {sageResponse.split(/(https?:\/\/[^\s]+)/g).map((part, i) => {
                          if (part.match(/(https?:\/\/[^\s]+)/g)) {
                            return <a key={i} href={part} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--acc)', textDecoration: 'underline', textUnderlineOffset: '4px' }}>{part}</a>;
                          }
                          return part;
                        })}
                        {/* Transcribing cursor for instant gratification feedback during stream */}
                        {isThinking && <span style={{ animation: 'event-flash 1s infinite alternate', marginLeft: '8px', color: 'var(--acc)' }}>▐</span>}
                      </div>
                    ) : isThinking ? (
                      <div style={{
                        marginTop: 'var(--space-xxl)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem',
                        transition: 'opacity 0.4s'
                      }}>
                        {/* High Art geometric contemplation visualization */}
                        <div style={{
                          position: 'relative', width: '40px', height: '40px'
                        }}>
                          <div style={{
                            position: 'absolute', inset: 0, border: '1px dashed var(--acc)', borderRadius: '50%',
                            animation: 'spin 8s linear infinite'
                          }} />
                          <div style={{
                            position: 'absolute', top: '10%', left: '10%', right: '10%', bottom: '10%',
                            borderLeft: '2px solid var(--acc)', borderRight: '2px solid var(--acc)', borderRadius: '50%',
                            animation: 'spin 2s cubic-bezier(0.16, 1, 0.3, 1) infinite',
                            opacity: 0.7
                          }} />
                        </div>
                        <div style={{
                          fontFamily: 'var(--fMono)', fontSize: '0.8rem', letterSpacing: '0.4em',
                          color: 'var(--acc)', textTransform: 'uppercase',
                          animation: 'pulse 1.5s infinite alternate'
                        }}>
                          [ holding this ]
                        </div>
                      </div>
                    ) : (
                      <div style={{
                        fontFamily: 'var(--fMono)', fontSize: '0.75rem', letterSpacing: '0.2em',
                        color: 'var(--acc)', opacity: 0.6, textTransform: 'uppercase', marginTop: 'var(--space-md)'
                      }}>
                        Anything alive in the Sage :: a thought, a question, a fragment :: steeps in your Steeping Notes.
                      </div>
                    )}
                  </div>
                )}

                {/* Wayfinding position :: reveals after the visitor settles */}
                {wayfindingState.signals.sessionAge !== 'arriving' && (
                  <div style={{
                    marginTop: 'var(--space-lg)',
                    fontFamily: 'var(--fMono)', fontSize: '0.6rem',
                    letterSpacing: '0.35em', textTransform: 'uppercase',
                    color: 'var(--acc)', opacity: 0.3,
                    transition: 'opacity 3s ease'
                  }}>
                    {STEEP_LABELS[wayfindingState.currentSteep]}
                  </div>
                )}
              </div>
            )}

            {/* Hex-Kintsugi Grid OR Active Vessel Detail */}
            {!activeVessel ? (
              <div className="vessel-matrix">
                {(['inneractive', 'journeyer', 'cohort', 'depth_semester'].includes(profile?.access_tier) ? VESSELS_L2 : VESSELS).map((vessel, i) => {
                  // VESSEL UNLOCKING :: Dual-path: archive depth OR behavioral readiness.
                  // Path 1 (archiveReady): 5+ historical score entries (the original Cryo-Lock).
                  // Path 2 (behaviorallyReady): gravity resonance >= 0.6 from the wayfinding engine.
                  // W1-W4 and 01 always unlocked. Vessels 02+ require at least one path.
                  // justUnlocked triggers the bioluminescent-bloom CSS animation.
                  // See VESSEL_STEEP_AFFINITY + computeVesselResonance() in useSageWayfinding.jsx.
                  let historicalDepth = 0;
                  try {
                    historicalDepth = JSON.parse(localStorage.getItem('steeping_historical_score') || '[]').length;
                  } catch (e) { }

                  const vesselString = vessel.id?.split('.')[1] || "0";
                  const vesselNumber = vesselString.startsWith('W') ? 0 : parseInt(vesselString, 10);
                  const gravityResonance = computeVesselResonance(vessel.num, wayfindingState.gravity);
                  const behaviorallyReady = gravityResonance >= 0.6;
                  const archiveReady = historicalDepth >= 5;
                  const isLocked = vesselNumber >= 2 && !archiveReady && !behaviorallyReady;
                  const justUnlocked = vesselNumber >= 2 && (historicalDepth === 5 || (behaviorallyReady && !archiveReady));
                  const resonance = !isLocked ? gravityResonance : 0;

                  return (
                    <motion.div
                      key={vessel.num}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1.2, delay: i * 0.1, ease: "easeOut" }}
                      style={{
                        position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center',
                        transform: `translate3d(calc(var(--mouse-x, 0) * ${isLocked ? '10px' : '25px'}), calc(var(--mouse-y, 0) * ${isLocked ? '10px' : '25px'}), 0)`,
                        transition: 'transform 0.4s ease-out, opacity 1.2s ease-out, top 1.2s ease-out' // Note y transition is handled by framer but we smooth out parallax
                      }}
                    >
                      {/* Cinematic Eclipse Backlighting (Universe behind the vessel) */}
                      <div style={{
                        position: 'absolute', top: '-30px', left: '-30px', bottom: '-30px', right: '-30px',
                        background: `radial-gradient(circle 140px at var(--mouseX, 50%) var(--mouseY, 50%), var(--acc), transparent 70%)`,
                        opacity: 0, filter: 'blur(15px)', zIndex: 0, pointerEvents: 'none', mixBlendMode: 'screen',
                        transition: 'opacity 1s ease-out'
                      }} />

                      <div
                        className="hex-vessel"
                        style={{
                          cursor: isLocked ? 'not-allowed' : 'pointer',
                          filter: isLocked ? 'grayscale(100%) opacity(0.5)' : 'none',
                          animation: justUnlocked ? 'bioluminescent-bloom 4s ease-out forwards' : 'none'
                        }}
                        onClick={(e) => {
                          if (isLocked) {
                            playStrikingBowl(40);
                            setLockedTooltipOpen(prev => prev === vessel.num ? null : vessel.num);
                            const targetEl = e.currentTarget;
                            setTimeout(() => {
                              targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }, 50);
                            return;
                          }

                          // Triplicate Resonance gracefully aligned to the Vessel's sequence in Pentatonic harmony
                          playConsideringHarmonic(vessel.num.charCodeAt(1));

                          if (broadcastPing) broadcastPing('VESSEL_OPENED');
                          setActiveVessel(vessel);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        onMouseMove={(e) => {
                          if (isLocked) return;
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = e.clientX - rect.left;
                          const y = e.clientY - rect.top;
                          e.currentTarget.style.setProperty('--mouseX', `${x}px`);
                          e.currentTarget.style.setProperty('--mouseY', `${y}px`);

                          // Pass coordinates to the cinematic backlighting wrapper
                          const wrapper = e.currentTarget.parentElement.children[0];
                          if (wrapper) {
                            wrapper.style.setProperty('--mouseX', `${x + 30}px`);
                            wrapper.style.setProperty('--mouseY', `${y + 30}px`);
                          }
                        }}
                        onMouseEnter={(e) => {
                          if (isLocked) {
                            if (window.matchMedia("(hover: hover)").matches) {
                              setLockedTooltipOpen(vessel.num);
                            }
                            return;
                          }
                          playStrikingBowl(vessel.num.charCodeAt(1));
                          const wrapper = e.currentTarget.parentElement.children[0];
                          if (wrapper) wrapper.style.opacity = '0.45';
                        }}
                        onMouseLeave={(e) => {
                          if (isLocked) {
                            setLockedTooltipOpen(null);
                            return;
                          }
                          const wrapper = e.currentTarget.parentElement.children[0];
                          if (wrapper) wrapper.style.opacity = '0';
                        }}
                      >

                        {/* Microbotanical Dormant Overlay Gamification */}
                        {isLocked && (
                          <div className="locked-vessel-overlay" style={{
                            position: 'absolute', inset: 0, zIndex: 10,
                            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)',
                            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                            opacity: 0.9, transition: 'all 0.5s ease', cursor: 'not-allowed'
                          }}>
                            {/* Microbotanical Seed/Leaf Icon */}
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--acc)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.85, marginBottom: '10px', filter: 'drop-shadow(0 0 8px var(--acc))' }}>
                              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 1 8.3C19.2 15.6 15.5 20 11 20z"></path>
                              <line x1="11" y1="20" x2="15" y2="10"></line>
                            </svg>
                          </div>
                        )}

                        {/* Bioluminescent Reactive Surface Light */}
                        <div className="vessel-bioluminescence" style={{
                          position: 'absolute', inset: 0,
                          background: `radial-gradient(circle 100px at var(--mouseX, 50%) var(--mouseY, 50%), var(--acc), transparent 80%)`,
                          opacity: 0.25, mixBlendMode: 'color-dodge', zIndex: 1.5, pointerEvents: 'none',
                          transition: 'opacity 0.3s'
                        }} />

                        {/* 1. Contemplative Parallax Background (The Landscape) */}
                        <div
                          className="vessel-lens-bg"
                          style={{
                            position: 'absolute', top: '-10%', left: '-10%', width: '120%', height: '120%',
                            backgroundImage: mode !== 'darkMatter' ? `url('${vessel.bgUrl}')` : 'none',
                            backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(100%) contrast(1.4) brightness(0.45)',
                            opacity: 0.85, zIndex: 1,
                            animation: 'ontologicalBreathe 18s ease-in-out infinite',
                            transform: 'translate(calc(var(--mouseX, 50%) * -0.05), calc(var(--mouseY, 50%) * -0.05))',
                            transition: 'transform 0.1s'
                          }}
                        />
                        {/* 🌿 THE READING MEMBRANE (Hexagong Cell): Ocular Protection */}
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.85) 100%)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', mixBlendMode: 'multiply', zIndex: 1.5, pointerEvents: 'none' }} />

                        {/* Wayfinding resonance glow :: vessels aligned with the visitor's gravity breathe */}
                        {resonance > 0.15 && (
                          <div style={{
                            position: 'absolute', inset: '-8px', zIndex: 1.8, pointerEvents: 'none',
                            background: `radial-gradient(ellipse at center, var(--acc), transparent 70%)`,
                            opacity: resonance * 0.18,
                            animation: 'ontologicalBreathe 6s ease-in-out infinite',
                            mixBlendMode: 'screen'
                          }} />
                        )}

                        {/* 2. The Kintsugi Lattice SVG */}
                        <svg className="hex-kintsugi-lattice" viewBox="0 0 280 320" style={{ zIndex: 2 }}>
                          <path
                            d="M 140 0 L 280 80 L 280 240 L 140 320 L 0 240 L 0 80 Z
                         M 140 0 L 140 160 L 280 80 M 140 160 L 0 80 M 140 160 L 140 320"
                            fill="none"
                            stroke="var(--acc)"
                            strokeWidth={resonance > 0.3 ? '5' : '4'}
                            className="kintsugi-fractures"
                            style={{ filter: resonance > 0.3 ? `drop-shadow(0 0 ${resonance * 6}px var(--acc))` : 'none', transition: 'all 2s ease' }}
                          />
                        </svg>

                        {/* 3. Typography Content */}
                        <div style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 clamp(0.5rem, 4vw, var(--space-xl))', boxSizing: 'border-box' }}>
                          <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.9rem', color: 'var(--acc)', letterSpacing: '0.15em', marginBottom: '8px' }}>
                            {vessel.num}
                          </div>
                          <div style={{ fontFamily: 'var(--fSerif)', fontSize: 'clamp(1.2rem, 5vw, 1.6rem)', color: 'var(--t1)', fontStyle: 'italic', fontWeight: 600, lineHeight: 1.1, wordBreak: 'break-word' }}>
                            {vessel.name}
                          </div>
                        </div>
                      </div>

                      {/* Guidance note :: outside hex-vessel so clip-path/overflow don't hide it */}
                      {isLocked && lockedTooltipOpen === vessel.num && (
                        <div style={{
                          position: 'absolute', top: 'calc(100% + 16px)', left: '50%',
                          transform: 'translateX(-50%)',
                          width: '300px', background: 'rgba(0,0,0,0.98)',
                          border: `1px solid var(--acc)`, padding: '24px',
                          fontFamily: 'var(--fBody)', fontSize: '1.05rem', color: 'var(--t1)',
                          lineHeight: 1.6, textAlign: 'center', zIndex: 30,
                          boxShadow: '0 15px 40px rgba(0,0,0,0.95)',
                          pointerEvents: 'none', animation: 'fadeIn 0.3s ease forwards'
                        }}>
                          <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.75rem', color: 'var(--acc)', letterSpacing: '0.25em', marginBottom: '14px', borderBottom: '1px dashed var(--acc)', paddingBottom: '10px' }}>
                            <b>AWAITING BLOOM</b>
                          </div>
                          <div style={{ fontStyle: 'italic', color: 'var(--t1)', letterSpacing: '0.03em' }}>
                            {vessel.lockedMessage || "This seed requires more depth before it opens. Continue steeping."}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
                <div
                  style={{ position: 'fixed', inset: 0, zIndex: 0, cursor: 'pointer' }}
                  onClick={() => setIsClosingVessel(true)}
                  title="Return to Center"
                />
                <motion.div
                  key={`detail-${activeVessel.num}`}
                  className="vessel-detail-view"
                  initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                  animate={{
                    opacity: isClosingVessel ? 0 : 1,
                    scale: isClosingVessel ? 0.95 : 1,
                    filter: isClosingVessel ? 'blur(10px)' : 'blur(0px)'
                  }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    width: '100%', maxWidth: '900px', margin: '5vh auto 15vh',
                    padding: 'var(--space-xxl)', background: 'rgba(0,0,0,0.45)',
                    border: '3px solid var(--acc)', backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)', position: 'relative', overflow: 'hidden', zIndex: 1
                  }}
                  onMouseMove={(e) => {
                    const x = e.clientX / window.innerWidth;
                    const y = e.clientY / window.innerHeight;
                    e.currentTarget.style.setProperty('--mouseX', `${(x - 0.5) * 100}px`);
                    e.currentTarget.style.setProperty('--mouseY', `${(y - 0.5) * 100}px`);
                  }}>

                  <div className="vessel-telescope-lens" style={{
                    position: 'absolute', top: '-10%', left: '-10%', width: '120%', height: '120%',
                    backgroundImage: `url('${activeVessel.bgUrl}')`,
                    backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(100%) contrast(1.4) brightness(0.35)',
                    opacity: 0.65, zIndex: 0,
                    animation: 'ontologicalBreathe 18s ease-in-out infinite',
                    transform: 'translate(calc(var(--mouseX, 0px) * -0.4), calc(var(--mouseY, 0px) * -0.4))',
                    pointerEvents: 'none'
                  }} />

                  {/* 🌿 THE READING MEMBRANE: Universal Ocular Protection */}
                  <div style={{
                    position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
                    background: `linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.85) 100%)`,
                    backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
                    mixBlendMode: 'multiply'
                  }} />

                  <Constellation seedString={activeVessel.num} />

                  {/* The Vessel Hopper */}
                  <div className="vessel-hopper-container" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-md)', zIndex: 30 }}>
                    <div className="vessel-hopper-actions" style={{ display: 'flex', gap: 'var(--space-md)' }}>
                      <button
                        onClick={() => {
                          setIsClosingVessel(true);
                          setInstrumentMode(false);
                        }}
                        style={{
                          background: 'none', border: 'none', color: 'var(--t1)',
                          fontFamily: 'var(--fMono)', fontSize: '0.85rem', letterSpacing: '0.15em',
                          cursor: 'pointer', textTransform: 'uppercase', opacity: 0.6,
                          transition: 'opacity 1.2s ease'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = 1 }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = 0.6 }}
                      >
                        <b>[ SURFACE ]</b>
                      </button>
                    </div>

                    {/* V5 VESSEL HOPPER: Eliminated to preserve spatial matrix navigation */}
                  </div>

                  <div style={{ position: 'relative', zIndex: 2 }}>

                    {instrumentMode ? (
                      <Hexagong
                        vesselData={activeVessel}
                        modeString={mode}
                        playAlgoraveSynth={playAlgoraveSynth}
                        onExit={() => setInstrumentMode(false)}
                      />
                    ) : (
                      <>
                        {activeVessel.id?.startsWith('L2') ? (
                          <VesselL2Detail vessel={activeVessel} modeString={mode} playStrikingBowl={playStrikingBowl} playHarmonicChord={playHarmonicChord} />
                        ) : (
                        <>
                        <div
                          style={{ cursor: activeVessel.num === '07' ? 'pointer' : 'default', userSelect: 'none' }}
                          onClick={() => {
                            if (activeVessel.num === '07') {
                              const newClicks = vessel07Clicks + 1;
                              setVessel07Clicks(newClicks);
                              if (newClicks >= 6) {
                                setShowSubterraneanBay(true);
                                setVessel07Clicks(0);
                                if (playStrikingBowl) playStrikingBowl(36);
                              } else {
                                setTimeout(() => setVessel07Clicks(c => Math.max(0, c - 1)), 4000);
                              }
                            }
                          }}
                        >
                          <div style={{ fontFamily: 'var(--fMono)', color: 'var(--acc)', fontWeight: 'bold', opacity: 0.8, letterSpacing: '0.2em', marginBottom: 'var(--space-sm)' }}>
                            {mode === 'l1' ? `HEXAGONG ${activeVessel.num}` : (activeVessel.num === '00' ? `CREÅTIVE STEEPING Intro` : `CREÅTIVE STEEPING Day ${activeVessel.num}`)}
                          </div>
                          <h2 style={{ fontFamily: 'var(--fSerif)', fontSize: 'clamp(48px, 6vw, 64px)', fontWeight: 700, fontStyle: 'italic', marginBottom: 'var(--space-xl)', color: 'var(--t1)', whiteSpace: 'pre-line', textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>
                            {activeVessel.name}
                          </h2>
                        </div>

                        <>
                          <div style={{
                            fontFamily: 'var(--fSerif)', fontStyle: 'italic', color: 'var(--acc)',
                            fontSize: '1.2rem', lineHeight: 1.8, marginBottom: 'var(--space-xl)',
                            whiteSpace: 'pre-line', borderLeft: '1px solid var(--acc)', paddingLeft: 'var(--space-md)'
                          }}>
                            {activeVessel.invocation}
                          </div>

                          <div style={{ fontFamily: 'var(--fBody)', fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--t1)', marginBottom: 'var(--space-xl)' }}>
                            {activeVessel.body}
                          </div>

                          {activeVessel.num === "02" && <Vessel02Detail modeString={mode} playStrikingBowl={playStrikingBowl} playHarmonicChord={playHarmonicChord} />}

                          {/* CODEX AS LIVING CURRICULUM :: ambient fragments from the practitioner archive.
                              Surfaces 1-2 codex entries matched to the vessel's steep affinity.
                              See VESSEL_STEEP_AFFINITY in useSageWayfinding.jsx. */}
                          {codexReady && (() => {
                            const affinities = VESSEL_STEEP_AFFINITY[activeVessel.num] || ['essence'];
                            const primarySteep = affinities[0];
                            const fragments = surface(primarySteep, activeVessel.name, 2);
                            if (fragments.length === 0) return null;
                            return (
                              <div style={{
                                marginBottom: 'var(--space-xl)', padding: 'var(--space-lg)',
                                borderLeft: `2px solid var(--acc)`, opacity: 0.7,
                                background: 'rgba(255,255,255,0.02)'
                              }}>
                                <div style={{
                                  fontFamily: 'var(--fMono)', fontSize: '0.7rem',
                                  letterSpacing: '0.2em', color: 'var(--acc)', opacity: 0.6,
                                  marginBottom: 'var(--space-sm)', textTransform: 'uppercase'
                                }}>
                                  From the Archive
                                </div>
                                {fragments.map((r, idx) => (
                                  <div key={idx} style={{
                                    fontFamily: 'var(--fSerif)', fontStyle: 'italic',
                                    fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--t2)',
                                    marginBottom: idx < fragments.length - 1 ? 'var(--space-md)' : 0
                                  }}>
                                    {r.fragment.text}
                                  </div>
                                ))}
                              </div>
                            );
                          })()}

                          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
                            <h3 style={{ fontFamily: 'var(--fMono)', fontSize: '0.8rem', letterSpacing: '0.15em', color: 'var(--acc)', opacity: 0.8, marginBottom: 'var(--space-md)', textTransform: 'uppercase' }}>
                              Reflections
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                              {activeVessel.reflection.map((ref, idx) => (
                                <li key={idx} style={{ fontFamily: 'var(--fBody)', fontSize: '1.1rem', color: 'var(--t2)', marginBottom: 'var(--space-sm)', position: 'relative', paddingLeft: 'var(--space-md)' }}>
                                  <span style={{ position: 'absolute', left: 0, color: 'var(--acc)' }}>•</span>
                                  {ref}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {activeVessel.num === "00" && <Vessel00Detail modeString={mode} playStrikingBowl={playStrikingBowl} />}
                          {activeVessel.num === "01" && <Vessel01Detail modeString={mode} playStrikingBowl={playStrikingBowl} playHarmonicChord={playHarmonicChord} />}
                          {activeVessel.num === "03" && <Vessel03Detail modeString={mode} playStrikingBowl={playStrikingBowl} playHarmonicChord={playHarmonicChord} />}
                          {activeVessel.num === "04" && <Vessel04Detail modeString={mode} playStrikingBowl={playStrikingBowl} playHarmonicChord={playHarmonicChord} />}
                          {activeVessel.num === "05" && <Vessel05Detail modeString={mode} playStrikingBowl={playStrikingBowl} playHarmonicChord={playHarmonicChord} />}
                          {activeVessel.num === "06" && <Vessel06Detail modeString={mode} playStrikingBowl={playStrikingBowl} playHarmonicChord={playHarmonicChord} />}
                          {activeVessel.num === "07" && <Vessel07Detail modeString={mode} playStrikingBowl={playStrikingBowl} playAlgoraveSynth={playAlgoraveSynth} playCompletionCue={playCompletionCue} />}
                          {activeVessel.num === "08" && <Vessel08Detail modeString={mode} playAlgoraveSynth={playAlgoraveSynth} playStrikingBowl={playStrikingBowl} />}

                          {activeVessel.num === "02" && (
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 'var(--space-lg)' }}>
                              <h3 style={{ fontFamily: 'var(--fMono)', fontSize: '0.8rem', letterSpacing: '0.15em', color: 'var(--acc)', opacity: 0.8, marginBottom: 'var(--space-md)', textTransform: 'uppercase' }}>
                                Interaction
                              </h3>
                              <div style={{ fontFamily: 'var(--fBody)', fontSize: '1.1rem', color: 'var(--t1)', marginBottom: 'var(--space-md)' }}>
                                {activeVessel.interaction.prompt}
                              </div>
                              <textarea
                                placeholder={activeVessel.interaction.placeholder}
                                className="steeping-textarea"
                                rows={1}
                                onInput={(e) => {
                                  e.target.style.height = "auto";
                                  e.target.style.height = e.target.scrollHeight + "px";
                                }}
                                onKeyDown={(e) => {
                                  if (e.key.length === 1) playStrikingBowl(e.keyCode);
                                }}
                                style={{
                                  borderBottom: '3px solid var(--t2)', paddingBottom: '1rem',
                                  color: 'var(--t1)', fontFamily: 'var(--fBody)', fontStyle: 'italic', fontSize: '1.4rem', fontWeight: 'bold'
                                }}
                              />
                            </div>
                          )}

                          {/* Vessel 00: Soft completion :: the welcoming needs a gentle closure */}
                          {activeVessel.num === "00" && (
                            <div style={{
                              marginTop: 'var(--space-xxl)', display: 'flex', flexDirection: 'column',
                              alignItems: 'center', width: '100%',
                              borderTop: '1px dashed var(--acc)', paddingTop: 'var(--space-xl)'
                            }}>
                              <div style={{
                                fontFamily: 'var(--fSerif)', fontStyle: 'italic',
                                fontSize: '1.1rem', color: m.text2, lineHeight: 1.7,
                                textAlign: 'center', maxWidth: '440px', marginBottom: 'var(--space-xl)'
                              }}>
                                You arrived. That is the first honest act of any practice.
                              </div>
                              <button onClick={() => {
                                if (playStrikingBowl) playStrikingBowl(55);
                                setIsClosingVessel(true);
                                setTimeout(() => {
                                  setActiveVessel(null);
                                  setIsClosingVessel(false);
                                }, 800);
                              }} style={{
                                background: 'transparent', border: `1px solid ${m.accent}`,
                                color: m.accent, padding: '14px 28px',
                                fontFamily: 'var(--fMono)', fontSize: '0.8rem',
                                letterSpacing: '0.2em', textTransform: 'uppercase',
                                cursor: 'pointer', transition: 'all 0.5s ease'
                              }}
                                onMouseEnter={e => { e.currentTarget.style.background = m.accent; e.currentTarget.style.color = m.bg; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = m.accent; }}
                              >
                                [ The Vessels Are Waiting ]
                              </button>
                            </div>
                          )}

                          {parseInt(activeVessel.num) >= 1 && parseInt(activeVessel.num) <= 8 && (
                            <div style={{ marginTop: 'var(--space-xxl)', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', borderTop: '1px dashed var(--acc)', paddingTop: 'var(--space-xl)' }}>
                              <button onClick={() => {
                                if (playCompletionCue) playCompletionCue();
                                setCompletedVesselName(activeVessel.name);
                                setVesselCompletionActive(true);
                                if (!isEngaged) setShowUpgradeInvite(true);
                                const guidance = getTransitionGuidance(activeVessel.num, wayfindingState);
                                setTimeout(() => {
                                  setVesselCompletionActive(false);
                                  setVesselTransition(guidance);
                                }, 3200);
                              }} style={{
                                background: 'var(--acc)', color: 'var(--bg)', border: 'none', padding: '16px 32px',
                                fontFamily: 'var(--fMono)', fontSize: '0.85rem', letterSpacing: '0.2em', cursor: 'pointer',
                                fontWeight: 'bold', textTransform: 'uppercase', boxShadow: '0 4px 20px rgba(212, 146, 42, 0.4)',
                                transition: 'all 0.4s ease'
                              }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
                                [ POUR :: COMPLETE THIS STEEP ]
                              </button>

                              {/* EH-02: L1 Contextual Upgrade Invitation */}
                              {showUpgradeInvite && !isEngaged && (
                                <div style={{
                                  marginTop: 'var(--space-lg)', textAlign: 'center',
                                  fontFamily: 'var(--fBody)', fontStyle: 'italic',
                                  fontSize: '1rem', color: m.text2, lineHeight: 1.7,
                                  animation: 'fadeIn 1.5s ease forwards'
                                }}>
                                  Your reflection is here. To carry it forward,
                                  <span
                                    onClick={() => setAuthOpen(true)}
                                    style={{ color: m.accent, cursor: 'pointer', marginLeft: '4px', borderBottom: `1px solid ${m.accent}60` }}
                                    role="button"
                                    aria-label="Open access layer selection to continue your steep"
                                  >
                                    your steep deepens at Layer 2.
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                        </>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              </div>
            )}

            {/* The Historical Score (Previously Phase 05) has been fully migrated directly into the Steeping Notes (SteepersLedger) and removed from the core App sequence to maintain a pristine, unbroken cinematic view. */}

            <div style={{ height: '80px' }} />
          </main>
        </div>
      )
      }

      {/* EH-01: Vessel Completion Ceremony */}
      {vesselCompletionActive && (
        <div role="status" aria-live="polite" style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: `rgba(0,0,0,0.88)`, backdropFilter: 'blur(20px)',
          animation: 'fadeIn 0.6s ease forwards',
          pointerEvents: 'none'
        }}>
          <div style={{
            fontFamily: 'var(--fSerif)', fontStyle: 'italic',
            fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', color: m.accent,
            textAlign: 'center', maxWidth: '600px', lineHeight: 1.5,
            textShadow: `0 0 40px ${m.accent}60`
          }}>
            The steep is complete.
          </div>
          <div style={{
            marginTop: '1.5rem',
            fontFamily: 'var(--fMono)', fontSize: '0.75rem', letterSpacing: '0.3em',
            color: m.text2, textTransform: 'uppercase', opacity: 0.7
          }}>
            The flavor is yours.
          </div>
        </div>
      )}

      {/* VESSEL TRANSITION :: The Sage's hand between completion and what's next */}
      {vesselTransition && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: `rgba(0,0,0,0.92)`, backdropFilter: 'blur(24px)',
          animation: 'fadeIn 0.8s ease forwards',
          padding: 'var(--space-xl)'
        }}>
          <div style={{ maxWidth: '520px', textAlign: 'center' }}>
            {/* The Sage's reflection on what was just completed */}
            <div style={{
              fontFamily: 'var(--fSerif)', fontStyle: 'italic',
              fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', color: m.text1,
              lineHeight: 1.8, marginBottom: 'var(--space-xxl)',
              animation: 'fadeIn 1.5s ease forwards'
            }}>
              {vesselTransition.reflection}
            </div>

            {/* The gesture toward what follows */}
            <div style={{
              fontFamily: 'var(--fBody)', fontSize: '1.05rem',
              color: m.text2, lineHeight: 1.7,
              marginBottom: 'var(--space-xxl)',
              animation: 'fadeIn 2.5s ease forwards'
            }}>
              {vesselTransition.gesture}
            </div>

            {/* Navigation options :: stunningly simple */}
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 'var(--space-lg)', animation: 'fadeIn 3.5s ease forwards'
            }}>
              {vesselTransition.nextVessel && (
                <button
                  onClick={() => {
                    if (playStrikingBowl) playStrikingBowl(60);
                    const nextNum = vesselTransition.nextVessel;
                    setVesselTransition(null);
                    const allVessels = ['inneractive', 'journeyer', 'cohort', 'depth_semester'].includes(profile?.access_tier) ? VESSELS_L2 : VESSELS;
                    const next = allVessels.find(v => v.num === nextNum);
                    if (next) {
                      setIsClosingVessel(true);
                      setTimeout(() => {
                        setActiveVessel(next);
                        setIsClosingVessel(false);
                      }, 400);
                    }
                  }}
                  style={{
                    background: 'transparent', border: `1px solid ${m.accent}`,
                    color: m.accent, padding: '14px 28px',
                    fontFamily: 'var(--fMono)', fontSize: '0.8rem',
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    cursor: 'pointer', transition: 'all 0.5s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = m.accent; e.currentTarget.style.color = m.bg; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = m.accent; }}
                >
                  [ Continue to Vessel {vesselTransition.nextVessel} ]
                </button>
              )}

              <button
                onClick={() => {
                  if (playStrikingBowl) playStrikingBowl(45);
                  setVesselTransition(null);
                  setShowCompass(true);
                }}
                style={{
                  background: 'transparent', border: `1px solid ${m.text2}40`,
                  color: m.text2, padding: '12px 24px',
                  fontFamily: 'var(--fMono)', fontSize: '0.75rem',
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  cursor: 'pointer', opacity: 0.7,
                  transition: 'all 0.5s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '0.7'; }}
              >
                [ Me in 5D ]
              </button>

              <button
                onClick={() => {
                  if (playStrikingBowl) playStrikingBowl(35);
                  setVesselTransition(null);
                  setIsClosingVessel(true);
                  setTimeout(() => {
                    setActiveVessel(null);
                    setIsClosingVessel(false);
                  }, 400);
                }}
                style={{
                  background: 'none', border: 'none',
                  color: m.text2, padding: '8px',
                  fontFamily: 'var(--fMono)', fontSize: '0.7rem',
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  cursor: 'pointer', opacity: 0.4,
                  transition: 'opacity 0.5s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.8'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '0.4'; }}
              >
                Return to the Matrix
              </button>
            </div>

            {/* Current steep position :: whispered */}
            {vesselTransition.steepLabel && (
              <div style={{
                marginTop: 'var(--space-xxl)',
                fontFamily: 'var(--fMono)', fontSize: '0.55rem',
                letterSpacing: '0.4em', textTransform: 'uppercase',
                color: m.accent, opacity: 0.2
              }}>
                {vesselTransition.steepLabel}
              </div>
            )}
          </div>
        </div>
      )}

      {ledgerOpen && <SteepersLedger m={m} historicalScore={historicalScore} hasMoreHistory={hasMoreHistory} loadMoreHistory={loadMoreHistory} generateSonicSketch={generateSonicSketch} onClose={() => setLedgerOpen(false)} playStrikingBowl={playStrikingBowl} playAlgoraveSynth={playAlgoraveSynth} playRootForagingFrequency={playRootForagingFrequency} askSage={handleAskSage} />}

      {showCompass && (
        <TheSteepingCompass
          m={m}
          onClose={() => setShowCompass(false)}
          playStrikingBowl={playStrikingBowl}
          playAlgoraveSynth={playAlgoraveSynth}
          activeVessel={activeVessel}
          generateSonicSketch={generateSonicSketch}
          askSage={handleAskSage}
          sageResponse={sageResponse}
          isThinking={isThinking}
          playCompletionCue={playCompletionCue}
        />
      )}

      {showGuide && (
        <GuideToTheSteeperverse
          m={m}
          onClose={() => setShowGuide(false)}
          playStrikingBowl={playStrikingBowl}
        />
      )}
      {authOpen && <AuthOverlay m={m} onClose={() => setAuthOpen(false)} />}

      {showObservatory && <OntologicalObservatory m={m} onClose={() => setShowObservatory(false)} playStrikingBowl={playStrikingBowl} playAlgoraveSynth={playAlgoraveSynth} wayfindingState={wayfindingState} />}
      {showLegacyPortal && <LegacyScreengrabPortal m={m} onClose={() => setShowLegacyPortal(false)} playStrikingBowl={playStrikingBowl} playAlgoraveSynth={playAlgoraveSynth} />}
      {showCalendar && <SteepingCalendar m={m} onClose={() => setShowCalendar(false)} playStrikingBowl={playStrikingBowl} playAlgoraveSynth={playAlgoraveSynth} />}
      {/* RITUAL TIMERS (Phase 06 Container) */}
      <GlobalSteepingTimer
        m={m}
        playStrikingBowl={playStrikingBowl}
        playConsideringHarmonic={playConsideringHarmonic}
        playSandSonnet={playSandSonnet}
        instrumentMode={instrumentMode}
        setSonicVolumeState={setSonicVolumeState}
        setSymphonyTuning={setSymphonyTuning}
      />





      {/* DYNAMIC STILLNESS CATALYSTS (Phase 07) :: portal only */}
      {phase === 'portal' && <StillnessCatalyst m={m} wayfindingState={wayfindingState} codexSurface={codexReady && surface ? surface : null} />}

      {/* SONIC AWARENESS CONTROLS */}
      <div
        className="sonic-controls"
        onClick={(e) => { e.stopPropagation(); setSonicExpanded(!sonicExpanded); }}
        style={{ cursor: 'pointer' }}
      >
        <div className="sonic-label" style={{ marginBottom: sonicExpanded ? 'var(--space-md)' : '0', transition: 'margin 0.4s ease' }}>
          {sonicExpanded ? '[ SONIC AWARENESS ]' : 'SONIC AWARENESS'}
        </div>

        {sonicExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}
          >
            <div className="sonic-row">
              <span style={{ opacity: 0.7 }}>ENGINE</span>
              <button
                className={`sonic-toggle`}
                aria-label={`Switch audio engine mode. Current: ${audioEngineMode === 'soul_sonnet' ? 'Soul Sonnet' : 'Immersive'}`}
                onClick={(e) => { e.stopPropagation(); setAudioEngineMode(prev => prev === 'soul_sonnet' ? 'immersive' : 'soul_sonnet'); }}
              >
                {audioEngineMode === 'soul_sonnet' ? 'SOUL SONNET' : 'IMMERSIVE'}
              </button>
            </div>
            <div style={{ fontSize: '0.55rem', color: m.accent, opacity: 0.7, marginTop: '-6px', marginBottom: '8px', lineHeight: 1.3, letterSpacing: '0.05em', maxWidth: '140px', whiteSpace: 'normal' }}>
              A tight space forces the truth out. Let the rhythm catch the feeling before your mind tries to explain it.
            </div>

            <div className="sonic-row">
              <span style={{ opacity: 0.7 }}>AMBIANCE</span>
              <button
                className={`sonic-toggle ${sonicAmbient ? 'active' : ''}`}
                aria-label={`Ambient soundscape: ${sonicAmbient ? 'On' : 'Off'}. Click to toggle ocean and wind.`}
                aria-pressed={sonicAmbient}
                onClick={(e) => { e.stopPropagation(); setSonicAmbient(!sonicAmbient); }}
                style={{
                  animation: !sonicAmbient ? 'event-flash 4s infinite alternate' : 'none',
                  boxShadow: !sonicAmbient ? '0 0 15px var(--acc)' : 'none'
                }}
              >
                {sonicAmbient ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="sonic-row">
              <span style={{ opacity: 0.7 }}>VOLUME</span>
              <input
                type="range"
                min="0" max="1" step="0.05"
                value={sonicVolume}
                onChange={(e) => setSonicVolumeState(parseFloat(e.target.value))}
                onClick={(e) => e.stopPropagation()}
                className="sonic-slider"
                aria-label="Master volume"
                aria-valuemin={0}
                aria-valuemax={1}
                aria-valuenow={sonicVolume}
              />
            </div>

            {/* Reading Lens Toggle */}
            <div className="sonic-row" style={{ marginTop: '4px', borderTop: `1px solid ${m.accent}20`, paddingTop: '8px' }}>
              <span style={{ opacity: 0.7 }}>READING LENS</span>
              <button
                className={`a11y-reading-toggle sonic-toggle ${readingMode ? 'active' : ''}`}
                aria-label={`Reading Lens mode: ${readingMode ? 'On' : 'Off'}. Optimises typography for dyslexic reading.`}
                aria-pressed={readingMode}
                onClick={(e) => { e.stopPropagation(); setReadingMode(prev => !prev); }}
              >
                {readingMode ? 'ON' : 'OFF'}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* The Underworld UI Layer */}
      {showSubterraneanBay && (
        <SubterraneanBay onClose={() => setShowSubterraneanBay(false)} eqParams={eqParams} setEqParams={setEqParams} />
      )}

      {/* ABOUT CREÅTIVE STEEPING :: full orientation panel */}
      {aboutOpen && (
        <div onClick={() => setAboutOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          zIndex: 9000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          padding: '20px', overflowY: 'auto'
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: m.bg, border: `1px solid ${m.accent}50`,
            maxWidth: '640px', width: '100%', margin: '20px 0',
            padding: 'clamp(32px, 6vw, 56px) clamp(24px, 5vw, 48px)',
            boxShadow: `0 20px 80px rgba(0,0,0,0.9), 0 0 40px ${m.accent}10`,
            position: 'relative', fontFamily: 'var(--fMono)',
            color: m.text2, letterSpacing: '0.04em'
          }}>
            {/* Close */}
            <button onClick={() => setAboutOpen(false)} style={{
              position: 'absolute', top: '20px', right: '20px',
              background: 'none', border: 'none', color: m.text2,
              cursor: 'pointer', fontSize: '0.9rem', opacity: 0.5,
              fontFamily: 'var(--fMono)', letterSpacing: '0.1em',
              transition: 'opacity 0.3s'
            }} onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = 0.5}>[ ✕ ]</button>

            {/* ─── Header ─── */}
            <div style={{ fontFamily: 'var(--fSerif)', fontSize: 'clamp(1.4rem, 5vw, 1.8rem)', fontStyle: 'italic', color: m.text1, marginBottom: '6px', lineHeight: 1.1 }}>
              CREÅTIVE STEEPING
            </div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: m.accent, marginBottom: '8px', opacity: 0.8 }}>
              A Journey to the Essence of Your Flavor
            </div>
            <div style={{ width: '40px', height: '1px', background: m.accent, opacity: 0.4, marginBottom: '32px' }} />

            {/* ─── The Practice ─── */}
            <p style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif", fontSize: '0.95rem', lineHeight: 1.85, color: m.text1, marginBottom: '32px' }}>
              Creative Steeping is an immersive, experiential in-venture :: a hyper-connective journaling practice designed for the fierce creative nature within you. It is a ritual, a journey, and a veneration of your human spirit in pursuit of self-awareness, creative expression, and identity.
            </p>

            {/* ─── The Seven Steeps ─── */}
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: m.accent, marginBottom: '14px', opacity: 0.8 }}>
              The Seven Steeps
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '36px' }}>
              {[
                ['01', 'Essence of My Being', 'Your Core Essence'],
                ['02', 'Mosaic of Experience', 'Your Creative Journey to Now'],
                ['03', 'Summits of Aspiration', 'Your Goals and Aspirations'],
                ['04', 'Mirror of Self-Perception', 'Your Perception of Self'],
                ['05', 'Labyrinth of Challenges', 'Your Current Challenges'],
                ['06', 'Conclave of Voices', 'Your Audience and Your Echo'],
                ['07', 'Crown Jewels of Individuality', 'Your Unique Offerings to The World'],
              ].map(([num, title, sub]) => (
                <div key={num} style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                  <span style={{ color: m.accent, fontSize: '0.65rem', flexShrink: 0, opacity: 0.6, minWidth: '20px' }}>{num}</span>
                  <span style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif", fontSize: '0.85rem', color: m.text1, lineHeight: 1.4 }}>
                    {title}<span style={{ color: m.text2, opacity: 0.55, fontSize: '0.75rem' }}> :: {sub}</span>
                  </span>
                </div>
              ))}
            </div>

            {/* ─── How the Portal Works ─── */}
            <div style={{ width: '100%', height: '1px', background: `${m.accent}25`, marginBottom: '32px' }} />
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: m.accent, marginBottom: '20px', opacity: 0.8 }}>
              How the Portal Works
            </div>

            {[
              {
                name: 'The Hexagong',
                icon: '⬡',
                body: 'The six-sided vessel at the center of the experience. Each face of the Hexagong is a Steep :: a day, a dimension, a door. As you steep, it illuminates. Vessels unlock through depth of practice, not passage of time.'
              },
              {
                name: 'The Sage',
                icon: '◈',
                body: 'The portal\'s behavioral intelligence. The Sage reads stillness, typing rhythm, and the depth of what you write :: then reflects back a response tuned to exactly where you are in your journey. A practicing witness to your unfolding.'
              },
              {
                name: 'The Sonnet Engine',
                icon: '♪',
                body: 'As you write, each keystroke finds its frequency :: a tone tuned to your current Steep. Every tone arises from your writing and returns to you as vibration. In acoustics, a vibration only matters when it transfers energy to something else. This one transfers yours back.'
              },
            ].map(({ name, icon, body }) => (
              <div key={name} style={{ display: 'flex', gap: '16px', marginBottom: '22px', alignItems: 'flex-start' }}>
                <span style={{ color: m.accent, fontSize: '1rem', flexShrink: 0, opacity: 0.7, marginTop: '1px' }}>{icon}</span>
                <div>
                  <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: m.text1, marginBottom: '6px' }}>{name}</div>
                  <p style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif", fontSize: '0.85rem', lineHeight: 1.75, color: m.text2, margin: 0 }}>{body}</p>
                </div>
              </div>
            ))}

            {/* ─── The Sonic Layer (Science) ─── */}
            <div style={{ width: '100%', height: '1px', background: `${m.accent}25`, marginBottom: '32px', marginTop: '10px' }} />
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: m.accent, marginBottom: '14px', opacity: 0.8 }}>
              The Sound of Becoming
            </div>
            <div style={{
              borderLeft: `2px solid ${m.accent}50`, paddingLeft: '16px', marginBottom: '24px'
            }}>
              <p style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif", fontSize: '0.9rem', lineHeight: 1.85, color: m.text1, margin: 0, fontStyle: 'italic' }}>
                "When you write and hear your writing as music simultaneously, you are engaging more neural territory than any other single human activity."
              </p>
            </div>
            <p style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif", fontSize: '0.85rem', lineHeight: 1.8, color: m.text2, marginBottom: '16px' }}>
              The Sonnet Engine generates music <em>from</em> you, not for you. Research in music neuroscience confirms that when the music is yours :: generated from your own behavioral and emotional signature :: the brain releases its own natural opioids and the immune system responds. There is no closer relationship to individual musical preference than music that emerges from your own creative state, in real time.
            </p>
            <p style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif", fontSize: '0.85rem', lineHeight: 1.8, color: m.text2, marginBottom: '32px' }}>
              For practitioners who feel creatively blocked, the portal holds another entrance: when the written word stills, the sonic current moves. Sound before language. Hearing before knowing. The practice creates the conditions its own content requires.
            </p>

            {/* ─── Community Steeping ─── */}
            <div style={{ width: '100%', height: '1px', background: `${m.accent}25`, marginBottom: '32px' }} />
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: m.accent, marginBottom: '14px', opacity: 0.8 }}>
              The Steeperverse
            </div>
            <p style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif", fontSize: '0.85rem', lineHeight: 1.8, color: m.text2, marginBottom: '16px' }}>
              Creative Steeping is a solo practice that becomes richer in community. The Steeperverse is the gathering place :: where Steepers share reflections, hold space for each other's unfolding, and witness the mythic narratives of their peers.
            </p>
            <p style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif", fontSize: '0.85rem', lineHeight: 1.8, color: m.text2, marginBottom: '32px' }}>
              Community Steeping unlocks something the solo practice cannot :: the recognition that your inner landscape, when shared, resonates. What you thought was yours alone turns out to be the room's. This is the deepest offer of the Conclave of Voices: not that your audience finds you, but that you find each other.
            </p>

            {/* ─── Voices from the Practice ─── */}
            <div style={{ width: '100%', height: '1px', background: `${m.accent}25`, marginBottom: '32px' }} />
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: m.accent, marginBottom: '20px', opacity: 0.8 }}>
              Voices from the Practice
            </div>
            {[
              {
                text: "Epiphanies unfolded, and the mythic narrative of my own genius brought me to tears. I experienced myself as a reliable source for wisdom.",
                name: "Sallomé Hralima",
                role: "Writer, Filmmaker"
              },
              {
                text: "The only thing standing between you and your next big idea is the courage to do the deep work. Creative Steeping gives you a framework for that courage.",
                name: "Lisa Heinsdale",
                role: "Creative Synthesizer"
              },
              {
                text: "What sets you apart does not set you apart from others :: it magnetizes others to the unique fragrance of your song.",
                name: "Sylvia Baffour",
                role: "Emotional Intelligence Expert"
              },
            ].map(({ text, name, role }, i) => (
              <div key={i} style={{
                borderLeft: `1px solid ${m.accent}40`, paddingLeft: '16px', marginBottom: '20px'
              }}>
                <p style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif", fontSize: '0.85rem', lineHeight: 1.75, color: m.text2, margin: '0 0 8px 0', fontStyle: 'italic' }}>
                  "{text}"
                </p>
                <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: m.accent, opacity: 0.8 }}>
                  {name} <span style={{ opacity: 0.5 }}>:: {role}</span>
                </div>
              </div>
            ))}

            {/* ─── KzA + Links ─── */}
            <div style={{ width: '100%', height: '1px', background: `${m.accent}25`, marginBottom: '32px' }} />
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: m.accent, marginBottom: '14px', opacity: 0.8 }}>
              The Architect
            </div>
            <p style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif", fontSize: '0.85rem', lineHeight: 1.8, color: m.text2, marginBottom: '32px' }}>
              Kamau Zuberi Akabueze (KzA) :: founder of THE ÅLIËN SCÖÕL for Creative Thinking. Over 25 years fusing creativity and strategy, he has dedicated his life to uplifting the creative spirit in everyone he encounters. Creative Steeping is the living distillation of that practice.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="https://thealienschool.com" target="_blank" rel="noopener noreferrer" style={{
                fontFamily: 'var(--fMono)', fontSize: '0.8rem', color: m.text1, textDecoration: 'none',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                borderBottom: `1px solid ${m.accent}40`, paddingBottom: '4px',
                transition: 'border-color 0.3s ease', display: 'inline-block'
              }} onMouseEnter={e => e.currentTarget.style.borderColor = m.accent}
                onMouseLeave={e => e.currentTarget.style.borderColor = `${m.accent}40`}>
                THE ÅLIËN SCÖÕL for Creative Thinking ↗
              </a>
              <a href="https://calendly.com/bethecandle/1-1-w-kza" target="_blank" rel="noopener noreferrer" style={{
                fontFamily: 'var(--fMono)', fontSize: '0.75rem', color: m.text2, textDecoration: 'none',
                letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.7,
                borderBottom: `1px solid ${m.accent}20`, paddingBottom: '4px',
                transition: 'all 0.3s ease', display: 'inline-block'
              }} onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.borderColor = `${m.accent}60`; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = 0.7; e.currentTarget.style.borderColor = `${m.accent}20`; }}>
                Schedule a Steeping with Kamau ↗
              </a>
            </div>
          </div>
        </div>
      )}

      {/* PRIVACY POLICY */}
      {privacyOpen && (() => {
        const Section = ({ label }) => (
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: m.accent, marginBottom: '14px', opacity: 0.8 }}>{label}</div>
        );
        const Body = ({ children, last }) => (
          <p style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif", fontSize: '0.85rem', lineHeight: 1.8, color: m.text2, marginBottom: last ? '0' : '28px' }}>{children}</p>
        );
        const Rule = () => <div style={{ width: '100%', height: '1px', background: `${m.accent}20`, marginBottom: '28px' }} />;
        return (
          <div onClick={() => setPrivacyOpen(false)} style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)',
            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            zIndex: 9000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            padding: '20px', overflowY: 'auto'
          }}>
            <div onClick={e => e.stopPropagation()} style={{
              background: m.bg, border: `1px solid ${m.accent}50`,
              maxWidth: '640px', width: '100%', margin: '20px 0',
              padding: 'clamp(32px, 6vw, 56px) clamp(24px, 5vw, 48px)',
              boxShadow: `0 20px 80px rgba(0,0,0,0.9)`,
              position: 'relative', fontFamily: 'var(--fMono)', color: m.text2, letterSpacing: '0.04em'
            }}>
              <button onClick={() => setPrivacyOpen(false)} style={{
                position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none',
                color: m.text2, cursor: 'pointer', fontSize: '0.9rem', opacity: 0.5,
                fontFamily: 'var(--fMono)', transition: 'opacity 0.3s'
              }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.5}>[ ✕ ]</button>

              <div style={{ fontFamily: 'var(--fSerif)', fontSize: 'clamp(1.3rem, 4vw, 1.6rem)', fontStyle: 'italic', color: m.text1, marginBottom: '6px' }}>Privacy Policy</div>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: m.accent, marginBottom: '8px', opacity: 0.7 }}>Effective: January 2025 · creativesteeping.com</div>
              <div style={{ width: '40px', height: '1px', background: m.accent, opacity: 0.4, marginBottom: '32px' }} />

              <Section label="The Practice Stays With You" />
              <Body>The Steeping Space is designed around a foundational principle: your practice belongs to you. The reflections you write, the scores your sessions generate, and the patterns of your creative movement are stored on your own device :: in your browser's local storage :: and are never transmitted to our servers, sold, or shared with third parties.</Body>

              <Rule />
              <Section label="What We Collect" />
              <Body>If you create an account, we collect your email address and a secure password hash through Supabase, our authentication provider. This is the only information that leaves your device. We do not collect your name, location, payment information, or any other personal identifiers. We do not run advertising. We do not use tracking pixels or third-party analytics.</Body>

              <Rule />
              <Section label="What Lives on Your Device" />
              <Body>Your browser's local storage holds: your visit count, practice archive and steep scores, ink drawings made within vessels, reading lens preference, and 5D compass engagement state. This data is yours. It does not leave your browser. Clearing your browser's local storage removes it entirely.</Body>

              <Rule />
              <Section label="Authentication" />
              <Body>Account creation and sign-in are handled by Supabase (supabase.com), a third-party infrastructure provider. When you create an account, your email and encrypted password are stored on Supabase's servers subject to their privacy policy. We use this data solely to authenticate your session :: we do not use it for marketing, profiling, or any other purpose.</Body>

              <Rule />
              <Section label="Hosting" />
              <Body>The Steeping Space is hosted on Vercel (vercel.com). Vercel may collect standard server logs (IP address, browser type, request timestamps) as part of normal infrastructure operations. These logs are governed by Vercel's privacy policy and are not accessible to or used by THE ÅLIËN SCÖÕL.</Body>

              <Rule />
              <Section label="Your Rights" />
              <Body>You may request deletion of your account and any associated authentication data at any time by contacting us at the address below. Local practice data can be cleared directly through your browser settings. We will respond to all data requests within 30 days.</Body>

              <Rule />
              <Section label="Contact" />
              <Body last>For privacy-related requests or questions: <a href="mailto:thoughts@thealienschool.com" style={{ color: m.accent, textDecoration: 'none', borderBottom: `1px solid ${m.accent}40` }}>thoughts@thealienschool.com</a><br />THE ÅLIËN SCÖÕL for Creative Thinking</Body>
            </div>
          </div>
        );
      })()}

      {/* PRESS */}
      {pressOpen && (() => {
        const Section = ({ label }) => (
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: m.accent, marginBottom: '14px', opacity: 0.8 }}>{label}</div>
        );
        const Body = ({ children, last }) => (
          <p style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif", fontSize: '0.85rem', lineHeight: 1.8, color: m.text2, marginBottom: last ? '0' : '28px' }}>{children}</p>
        );
        const Rule = () => <div style={{ width: '100%', height: '1px', background: `${m.accent}20`, marginBottom: '28px' }} />;
        return (
          <div onClick={() => setPressOpen(false)} style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)',
            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            zIndex: 9000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            padding: '20px', overflowY: 'auto'
          }}>
            <div onClick={e => e.stopPropagation()} style={{
              background: m.bg, border: `1px solid ${m.accent}50`,
              maxWidth: '640px', width: '100%', margin: '20px 0',
              padding: 'clamp(32px, 6vw, 56px) clamp(24px, 5vw, 48px)',
              boxShadow: `0 20px 80px rgba(0,0,0,0.9)`,
              position: 'relative', fontFamily: 'var(--fMono)', color: m.text2, letterSpacing: '0.04em'
            }}>
              <button onClick={() => setPressOpen(false)} style={{
                position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none',
                color: m.text2, cursor: 'pointer', fontSize: '0.9rem', opacity: 0.5,
                fontFamily: 'var(--fMono)', transition: 'opacity 0.3s'
              }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.5}>[ ✕ ]</button>

              <div style={{ fontFamily: 'var(--fSerif)', fontSize: 'clamp(1.3rem, 4vw, 1.6rem)', fontStyle: 'italic', color: m.text1, marginBottom: '6px' }}>Press</div>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: m.accent, marginBottom: '8px', opacity: 0.7 }}>THE ÅLIËN SCÖÕL for Creative Thinking</div>
              <div style={{ width: '40px', height: '1px', background: m.accent, opacity: 0.4, marginBottom: '32px' }} />

              <Section label="About Creative Steeping" />
              <Body>Creative Steeping is an immersive digital practice for creative self-inquiry :: a seven-day guided journaling ritual that fuses introspection, tea ceremony, and a generative sonic layer into a single contemplative experience. Visitors engage The Steeping Space through text, sound, and behavioral intelligence to move through seven dimensions of creative identity: Essence, Mosaic, Summits, Mirror, Labyrinth, Conclave, and Crown Jewels.</Body>

              <Rule />
              <Section label="The Science" />
              <div style={{ borderLeft: `2px solid ${m.accent}50`, paddingLeft: '16px', marginBottom: '24px' }}>
                <p style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif", fontSize: '0.9rem', lineHeight: 1.85, color: m.text1, margin: 0, fontStyle: 'italic' }}>
                  "The Steeping Space may be the most sophisticated non-clinical implementation of music-medicine principles currently available to general audiences :: not because it was designed with neuroscience in mind, but because it was designed from a deep understanding of what the human creative system actually needs."
                </p>
                <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.65rem', letterSpacing: '0.12em', color: m.accent, opacity: 0.7, marginTop: '10px', textTransform: 'uppercase' }}>The Sound of Becoming :: Research Report, 2026</div>
              </div>
              <Body>The Steeping Space's sonic layer :: the Sonnet Engine :: generates music in real time from the practitioner's own keystrokes, tuned to their current position in the practice. Research mapping the portal's architecture to Daniel Levitin's <em>Music as Medicine</em> (W.W. Norton, 2025) identifies it as a first-of-its-kind preventative music-medicine intervention: full-brain activation through simultaneous writing and musical creation, bidirectional rhythmic entrainment, and an individual-preference music mechanism that may trigger the brain's natural opioid response.</Body>

              <Rule />
              <Section label="About the Founder" />
              <Body>Kamau Zuberi Akabueze (KzA) is the founder of THE ÅLIËN SCÖÕL for Creative Thinking :: a creative education practice spanning 25 years of work at the intersection of creativity, strategy, and human development. Creative Steeping is the living distillation of that practice: a methodology, a guidebook, and now a digital portal.</Body>

              <Rule />
              <Section label="Key Facts" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                {[
                  ['Practice', 'Seven-steep creative journaling ritual'],
                  ['Format', 'Digital portal · creativesteeping.com'],
                  ['Sonic Layer', 'The Sonnet Engine :: generative music from keystroke behavior'],
                  ['Intelligence', 'The Sage :: behavioral wayfinding, fully local'],
                  ['Data', 'Practice data stays on the visitor\'s device. No tracking.'],
                  ['Guidebook', 'Creative Steeping: A Journey to the Essence of Your Flavor'],
                  ['Founded', 'THE ÅLIËN SCÖÕL · thealienschool.com'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', gap: '16px' }}>
                    <span style={{ fontFamily: 'var(--fMono)', fontSize: '0.7rem', letterSpacing: '0.1em', color: m.accent, textTransform: 'uppercase', flexShrink: 0, minWidth: '90px', opacity: 0.7 }}>{k}</span>
                    <span style={{ fontFamily: "'Atkinson Hyperlegible', sans-serif", fontSize: '0.82rem', color: m.text2, lineHeight: 1.5 }}>{v}</span>
                  </div>
                ))}
              </div>

              <Rule />
              <Section label="Media Contact" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a href="mailto:kza@thealienschool.com" style={{
                  fontFamily: 'var(--fMono)', fontSize: '0.8rem', color: m.text1, textDecoration: 'none',
                  letterSpacing: '0.1em', borderBottom: `1px solid ${m.accent}40`, paddingBottom: '4px',
                  transition: 'border-color 0.3s', display: 'inline-block'
                }} onMouseEnter={e => e.currentTarget.style.borderColor = m.accent}
                  onMouseLeave={e => e.currentTarget.style.borderColor = `${m.accent}40`}>
                  kza@thealienschool.com
                </a>
                <a href="https://calendly.com/bethecandle/1-1-w-kza" target="_blank" rel="noopener noreferrer" style={{
                  fontFamily: 'var(--fMono)', fontSize: '0.75rem', color: m.text2, textDecoration: 'none',
                  letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.7,
                  borderBottom: `1px solid ${m.accent}20`, paddingBottom: '4px',
                  transition: 'all 0.3s', display: 'inline-block'
                }} onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.borderColor = `${m.accent}60`; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = 0.7; e.currentTarget.style.borderColor = `${m.accent}20`; }}>
                  Schedule a media conversation with Kamau ↗
                </a>
                <a href="https://thealienschool.com" target="_blank" rel="noopener noreferrer" style={{
                  fontFamily: 'var(--fMono)', fontSize: '0.75rem', color: m.text2, textDecoration: 'none',
                  letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.7,
                  borderBottom: `1px solid ${m.accent}20`, paddingBottom: '4px',
                  transition: 'all 0.3s', display: 'inline-block'
                }} onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.borderColor = `${m.accent}60`; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = 0.7; e.currentTarget.style.borderColor = `${m.accent}20`; }}>
                  THE ÅLIËN SCÖÕL ↗
                </a>
              </div>
            </div>
          </div>
        );
      })()}
    </div >
  );
}

export default function App() {
  const path = window.location.pathname.toLowerCase();
  if (path.includes('/about')) return <AboutPage />;
  return (
    <ErrorBoundary>
      <AppInner />
    </ErrorBoundary>
  );
}
