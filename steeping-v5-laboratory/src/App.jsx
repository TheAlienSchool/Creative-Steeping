import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useResonanceCanvas } from './useResonanceCanvas';
import { useSonnetEngine } from './useSonnetEngine';
import { useSageIntelligence } from './useSageIntelligence';
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
import { motion, AnimatePresence } from 'framer-motion';

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
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
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
        <div style={{ color: 'red', padding: '2rem', background: '#222', zIndex: 99999, position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', whiteSpace: 'pre-wrap' }}>
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
          if (t === 1) {
            setActiveTimer(null);
            if (playStrikingBowl) playStrikingBowl(60); // Deep bowl finish
            if (activeTimer === 15 && setSymphonyTuning) setSymphonyTuning(false); 
            if (activeTimer === 15 && setSonicVolumeState) setSonicVolumeState(0.5);
            return 0;
          }
          if (playSandSonnet) playSandSonnet(); // The echotastic sand flowing sonnet

          if (t % 60 === 0 && playConsideringHarmonic && t !== 1) {
            playConsideringHarmonic(); // Subtle prompt passing minutes
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer, timeLeft, playStrikingBowl, playConsideringHarmonic, playSandSonnet]);

  const toggleTimer = (minutes) => {
    if (activeTimer === minutes) {
      setActiveTimer(null);
      setTimeLeft(0);
      // Revert volume and tuning if leaving Time Symphony
      if (minutes === 15 && setSonicVolumeState) setSonicVolumeState(0.5);
      if (minutes === 15 && setSymphonyTuning) setSymphonyTuning(false);
    } else {
      if (playStrikingBowl) playStrikingBowl(72);
      setActiveTimer(minutes);
      setTimeLeft(minutes * 60);
      // Time Symphony overdrive & tuning (Only applies aggressively in 15M mode if requested)
      if (minutes === 15 && instrumentMode) {
          if (setSonicVolumeState) setSonicVolumeState(3.3); 
          if (setSymphonyTuning) setSymphonyTuning(true); 
      } else {
          if (setSymphonyTuning) setSymphonyTuning(false); 
      }
    }
  };

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
function AppInner() {
  const [mode, setMode] = useState("incandescent");
  const [phase, setPhase] = useState("entrance"); // entrance, dashboard, portal
  const [identity, setIdentity] = useState("");
  const [sageTestingBusy, setSageTestingBusy] = useState(false); // To test the Vesica Piscis animation
  
  // State for Navigation Overlays
  const [showCompass, setShowCompass] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showObservatory, setShowObservatory] = useState(false); // The Double-Secret Backend
  const [activeVessel, setActiveVessel] = useState(null); // The currently open vessel
  const [instrumentMode, setInstrumentMode] = useState(false); // Secrets: The Hexagong
  const [sageExpanded, setSageExpanded] = useState(false); // Sage interaction visibility
  const [ledgerOpen, setLedgerOpen] = useState(false); // Sub-overlay for editorial deep dives
  const [authOpen, setAuthOpen] = useState(false); // Authentication popup state
  const [navMenuOpen, setNavMenuOpen] = useState(false); // Hamburger menu state
  const [isClosingVessel, setIsClosingVessel] = useState(false);
  const [hasEngaged5D, setHasEngaged5D] = useState(() => localStorage.getItem('steeping_5d_engaged') === 'true');

  // Accessibility: Reading Lens Mode (dyslexia-supportive typography)
  const [readingMode, setReadingMode] = useState(() => localStorage.getItem('steeping_reading_mode') === 'true');

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
  const { isEngaged, isInneractive, hasPersistentScore } = useTier();
  
  // Immersive Matrix Collective Resonance
  const { broadcastPing } = useSteepingCircles();

  // EH-01: Vessel completion ceremony state
  const [vesselCompletionActive, setVesselCompletionActive] = useState(false);
  const [completedVesselName, setCompletedVesselName] = useState('');

  // EH-02: L1 → L2 contextual upgrade invitation
  const [showUpgradeInvite, setShowUpgradeInvite] = useState(false);

  // Tier-aware phase routing:
  // — Engaged / Inneractive practitioners → Space Dashboard
  // — Interactive (L1) practitioners → portal directly (no dashboard)
  useEffect(() => {
    if (user && phase === "entrance") {
      setPhase(isEngaged ? "dashboard" : "portal");
    }
  }, [user, phase, isEngaged]);

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
    minHeight: "100vh",
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

  // Initialize the Sonnet Audio Engine
  const { initEngine, updateBinauralTracking, playStrikingBowl, playHarmonicChord, playAlgoraveSynth, playConsideringHarmonic, playSandSonnet, playCompletionCue, setMasterVolume, setAmbientActive, setSymphonyTuning } = useSonnetEngine(mode, eqParams);

  // Initialize The Steeping Sage Intelligence
  const { askSage, sageResponse, isThinking, historicalScore, hasMoreHistory, loadMoreHistory, setSageResponse } = useSageIntelligence(identity, playStrikingBowl);

  // Phase 05 Bugfix: Ensure Sage context resets when crossing vessel boundaries
  useEffect(() => {
    setSageResponse('');
  }, [activeVessel?.num, instrumentMode, setSageResponse]);

  const handleAskSage = (query, sageMode) => {
    if (broadcastPing) broadcastPing('SAGE_INQUIRY');
    askSage(query, sageMode);
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
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }}
      />

      {/* GLOBAL NAVIGATION */}
      <nav className="top-nav">
        <div onClick={() => setPhase(user ? 'portal' : 'entrance')} className="nav-brand" style={{ cursor: 'pointer', color: "var(--acc)", fontFamily: "var(--fSerif)", textTransform: "uppercase", letterSpacing: "0.15em", fontSize: "0.9rem", fontWeight: 600 }}>
          CREÅTIVE STEEPING
        </div>
        <div className="mode-toggles" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 'var(--space-md)' }}>
          {Object.keys(MODES).map(k => (
            <button key={k} onClick={() => setMode(k)}
              className={mode === k ? "mode-btn active" : "mode-btn"}
              style={{ color: mode === k ? "var(--acc)" : "var(--t2)", whiteSpace: 'nowrap' }}>
              {MODES[k].name}
            </button>
          ))}
        </div>
        <div className="nav-school"
          style={{ position: 'relative', fontFamily: "var(--fMono)", textTransform: "uppercase", letterSpacing: "0.15em", fontSize: "0.8rem", color: "var(--t2)", display: 'flex', flexDirection: 'column', alignItems: 'flex-end', zIndex: 1000 }}
          onMouseEnter={() => setNavMenuOpen(true)}
          onMouseLeave={() => setNavMenuOpen(false)}>

          <a href="https://thealienschool.com" target="_blank" rel="noopener noreferrer"
            style={{
              color: 'var(--t2)', textDecoration: 'none', opacity: navMenuOpen ? 1 : 0.6,
              whiteSpace: 'nowrap', cursor: 'pointer', borderBottom: '1px solid transparent',
              transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '8px'
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.borderBottom = '1px solid var(--t2)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = navMenuOpen ? 1 : 0.6; e.currentTarget.style.borderBottom = '1px solid transparent'; }}>
            THE ÅLÏEN SCÖÕL
            <span style={{ fontSize: '1rem', lineHeight: 1 }}>☰</span>
          </a>

          <div style={{
            position: 'absolute', top: '100%', right: 0, paddingTop: '20px',
            opacity: navMenuOpen ? 1 : 0,
            visibility: navMenuOpen ? 'visible' : 'hidden', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: navMenuOpen ? 'translateY(0)' : 'translateY(-10px)'
          }}>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-md)',
              background: 'var(--bg)', border: `1px solid var(--acc)`, padding: 'var(--space-lg)',
              boxShadow: `0 10px 40px rgba(0,0,0,0.8)`
            }}>
              <button onClick={() => { setLedgerOpen(true); setNavMenuOpen(false); }} style={{
                background: 'none', border: 'none',
                color: 'var(--acc)', textDecoration: 'none', borderBottom: '1px solid transparent',
                transition: 'border-bottom 1.2s ease', cursor: 'pointer', fontFamily: 'var(--fMono)',
                fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap'
              }} onMouseEnter={e => e.currentTarget.style.borderBottom = '1px solid var(--acc)'}
                onMouseLeave={e => e.currentTarget.style.borderBottom = '1px solid transparent'}>
                <b>[ STEEPING NOTES ]</b>
              </button>

              <button onClick={() => setShowGuide(true)} style={{
                background: 'none', border: 'none',
                color: 'var(--acc)', textDecoration: 'none', borderBottom: '1px solid transparent',
                transition: 'border-bottom 1.2s ease', cursor: 'pointer', fontFamily: 'var(--fMono)',
                fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap'
              }} onMouseEnter={e => e.currentTarget.style.borderBottom = '1px solid var(--acc)'}
                onMouseLeave={e => e.currentTarget.style.borderBottom = '1px solid transparent'}
                title="View the Guide to the Steeperverse">
                <b>[ GUIDE TO THE STEEPERVERSE ]</b>
              </button>

              <button onClick={() => { setShowCompass(true); setNavMenuOpen(false); }} style={{
                background: 'none', border: 'none',
                color: 'var(--acc)', textDecoration: 'none', borderBottom: '1px solid transparent',
                transition: 'border-bottom 1.2s ease', cursor: 'pointer', fontFamily: 'var(--fMono)',
                fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap'
              }} onMouseEnter={e => e.currentTarget.style.borderBottom = '1px solid var(--acc)'}
                onMouseLeave={e => e.currentTarget.style.borderBottom = '1px solid transparent'}
                title="5D Biometric Resonance Anchor">
                <b>[ ME IN 5D ]</b>
              </button>

              {!user ? (
                <button onClick={() => setAuthOpen(true)} style={{
                  background: 'none', border: 'none',
                  color: 'var(--acc)', textDecoration: 'none', borderBottom: '1px solid transparent',
                  transition: 'border-bottom 1.2s ease', cursor: 'pointer', fontFamily: 'var(--fMono)',
                  fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap'
                }} onMouseEnter={e => e.currentTarget.style.borderBottom = '1px solid var(--acc)'}
                  onMouseLeave={e => e.currentTarget.style.borderBottom = '1px solid transparent'}>
                  <b>[ BEGIN YOUR STEEP ]</b>
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <button onClick={() => setPhase('dashboard')} style={{
                    background: 'none', border: 'none',
                    color: 'var(--t1)', textDecoration: 'none', borderBottom: '1px solid transparent',
                    transition: 'border-bottom 1.2s ease', cursor: 'pointer', fontFamily: 'var(--fMono)',
                    fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap'
                  }} onMouseEnter={e => e.currentTarget.style.borderBottom = '1px solid var(--t1)'}
                    onMouseLeave={e => e.currentTarget.style.borderBottom = '1px solid transparent'}
                    title="Return to your Space">
                    <b>[ MY SANCTUARY ]</b>
                  </button>
                  <button onClick={() => setAuthOpen(true)} style={{
                    background: 'none', border: 'none',
                    color: 'var(--acc)', textDecoration: 'none', borderBottom: '1px solid transparent',
                    transition: 'border-bottom 1.2s ease', cursor: 'pointer', fontFamily: 'var(--fMono)',
                    fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap'
                  }} onMouseEnter={e => e.currentTarget.style.borderBottom = '1px solid var(--acc)'}
                    onMouseLeave={e => e.currentTarget.style.borderBottom = '1px solid transparent'}
                    title="View Steeperverse Layers">
                    <b>[ YOUR LAYERS ]</b>
                  </button>
                  <button onClick={() => signOut()} style={{
                    background: 'none', border: 'none',
                    color: 'var(--t2)', textDecoration: 'none', borderBottom: '1px solid transparent',
                    transition: 'border-bottom 1.2s ease, opacity 0.3s ease', cursor: 'pointer', fontFamily: 'var(--fMono)',
                    fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                    opacity: 0.6
                  }} onMouseEnter={e => { e.currentTarget.style.borderBottom = '1px solid var(--t2)'; e.currentTarget.style.opacity = 0.9; }}
                    onMouseLeave={e => { e.currentTarget.style.borderBottom = '1px solid transparent'; e.currentTarget.style.opacity = 0.6; }}
                    title={`Departing presence: ${user.email}`}>
                    <b>( DEPART )</b>
                  </button>
                  {user?.email === 'thealienscool@gmail.com' && (
                    <button onClick={() => { setShowObservatory(true); setNavMenuOpen(false); }} style={{
                      background: 'none', border: 'none',
                      color: 'var(--acc)', textDecoration: 'none', borderBottom: '1px solid transparent',
                      transition: 'border-bottom 1.2s ease, opacity 0.3s ease, filter 0.8s ease', cursor: 'pointer', fontFamily: 'var(--fMono)',
                      fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                      opacity: 0.8
                    }} onMouseEnter={e => { e.currentTarget.style.borderBottom = '1px solid var(--acc)'; e.currentTarget.style.opacity = 1; e.currentTarget.style.filter = 'drop-shadow(0 0 8px var(--acc))'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderBottom = '1px solid transparent'; e.currentTarget.style.opacity = 0.8; e.currentTarget.style.filter = 'none'; }}
                      title="Double-Secret Backend">
                      <b>[ OBSERVATORY ]</b>
                    </button>
                  )}
                </div>
              )}

              <a href="https://discord.gg/creativesteeping" target="_blank" rel="noopener noreferrer" style={{
                color: 'var(--acc)', textDecoration: 'none', borderBottom: '1px solid transparent',
                transition: 'border-bottom 1.2s ease', cursor: 'pointer', whiteSpace: 'nowrap'
              }} onMouseEnter={e => e.currentTarget.style.borderBottom = '1px solid var(--acc)'}
                onMouseLeave={e => e.currentTarget.style.borderBottom = '1px solid transparent'}>
                <b>[ DISCORD PORTAL ]</b>
              </a>
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
            <div className="entrance-eyebrow">A JOURNEY TO THE ESSENCE OF YOUR FLAVOR</div>
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
                aria-label="Commence Steeping — begin your journey"
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
            <span style={{ cursor: 'pointer', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color=m.accent} onMouseLeave={e => e.currentTarget.style.color=m.text2}>[ PRIVACY POLICY ]</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color=m.accent} onMouseLeave={e => e.currentTarget.style.color=m.text2}>[ PRESS ]</span>
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

                <div style={{ fontFamily: 'var(--fBody)', fontSize: '1.2rem', color: 'var(--t2)', marginBottom: 'var(--space-xl)' }}>
                  {mode === 'incandescent' && "What is ready to be transmuted within me?"}
                  {mode === 'oceanic' && "In the quiet, what wisdom whispers?"}
                  {mode === 'emergent' && "What truth is shimmering just beneath the surface?"}
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
                    <b>[ OFFER AN INQUIRY ]</b>
                  </button>
                ) : (
                  <div style={{ width: '100%', position: 'relative' }}>
                    <textarea
                      placeholder="Offer your resonance..."
                      onFocus={() => setSageTestingBusy(true)}
                      onBlur={() => setSageTestingBusy(false)}
                      onKeyDown={(e) => {
                        if (e.key.length === 1 || e.key === 'Enter' || e.key === 'Backspace') {
                          playStrikingBowl(e.keyCode || 50);
                        }
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          const query = e.target.value.trim();
                          if (query !== '') {
                            handleAskSage(query, mode);
                          }
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
                          [ The Sage Considers ]
                        </div>
                      </div>
                    ) : (
                      <div style={{
                        fontFamily: 'var(--fMono)', fontSize: '0.75rem', letterSpacing: '0.2em',
                        color: 'var(--acc)', opacity: 0.6, textTransform: 'uppercase', marginTop: 'var(--space-md)'
                      }}>
                        Awaiting Resonance...
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Hex-Kintsugi Grid OR Active Vessel Detail */}
            {!activeVessel ? (
              <div className="vessel-matrix">
                {VESSELS.map((vessel, i) => {
                  // Elegant gamification: Lock levels 3-8 until historical depth is achieved
                  let historicalDepth = 0;
                  try {
                      historicalDepth = JSON.parse(localStorage.getItem('steeping_historical_score') || '[]').length;
                  } catch(e) {}
                  
                  // Unlock logic: Need at least 1 historical entry to pass 02, then scaling up.
                  // For the sake of the sanctuary, inneractive tier or enough history unlocks it.
                  const requiredDepth = (parseInt(vessel.num) - 2) * 2; 
                  const isLocked = parseInt(vessel.num) >= 3 && historicalDepth < requiredDepth && profile?.access_tier !== 'inneractive';

                  return (
                  <motion.div 
                    key={vessel.num} 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: i * 0.1, ease: "easeOut" }}
                    style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
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
                          filter: isLocked ? 'grayscale(100%) opacity(0.5)' : 'none'
                      }}
                      onClick={() => {
                        if (isLocked) {
                            // Provide a dull "locked" feedback frequency
                            playStrikingBowl(40);
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
                        if (isLocked) return;
                        playStrikingBowl(vessel.num.charCodeAt(1));
                        const wrapper = e.currentTarget.parentElement.children[0];
                        if (wrapper) wrapper.style.opacity = '0.45';
                      }}
                      onMouseLeave={(e) => {
                        if (isLocked) return;
                        const wrapper = e.currentTarget.parentElement.children[0];
                        if (wrapper) wrapper.style.opacity = '0';
                      }}
                    >

                      {/* Locked Overlay Gamification */}
                      {isLocked && (
                          <div style={{
                              position: 'absolute', inset: 0, zIndex: 10,
                              background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)',
                              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                          }}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--acc)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px', opacity: 0.8 }}>
                                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                              </svg>
                              <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.6rem', color: 'var(--acc)', letterSpacing: '0.2em', textTransform: 'uppercase', background: 'rgba(0,0,0,0.8)', padding: '4px 8px', border: '1px solid var(--acc)' }}>
                                  SYNTHESIS REQUIRED
                              </div>
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

                      {/* 2. The Kintsugi Lattice SVG */}
                      <svg className="hex-kintsugi-lattice" viewBox="0 0 280 320" style={{ zIndex: 2 }}>
                        <path
                          d="M 140 0 L 280 80 L 280 240 L 140 320 L 0 240 L 0 80 Z 
                         M 140 0 L 140 160 L 280 80 M 140 160 L 0 80 M 140 160 L 140 320"
                          fill="none"
                          stroke="var(--acc)"
                          strokeWidth="4"
                          className="kintsugi-fractures"
                        />
                      </svg>

                      {/* 3. Typography Content */}
                      <div style={{ zIndex: 3, textAlign: 'center', padding: '0 20px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                        <div style={{ fontFamily: 'var(--fMono)', fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '0.1em', opacity: 0.9, marginBottom: '12px' }}>
                          {vessel.num}
                        </div>
                        <div style={{ fontFamily: 'var(--fSerif)', fontSize: '2rem', fontWeight: 'bold', fontStyle: 'italic', letterSpacing: '0.04em', lineHeight: 1.2, whiteSpace: 'pre-line' }}>
                          {vessel.name}
                        </div>
                      </div>
                    </div>
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
                  key={activeVessel.num}
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

                  {/* The Secret Entry to the Algorave and Vessel Hopper */}
                  <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-md)', zIndex: 30 }}>
                    <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                        <button
                          onClick={() => setInstrumentMode(!instrumentMode)}
                          style={{
                            background: 'none', border: 'none', color: 'var(--acc)',
                            fontFamily: 'var(--fMono)', fontSize: '0.85rem', letterSpacing: '0.15em',
                            cursor: 'pointer', textTransform: 'uppercase', opacity: instrumentMode ? 1 : 0.6,
                            transition: 'opacity 1.2s ease'
                          }}
                        >
                          <b>{instrumentMode ? `[ EXHALE ${mode === 'l1' ? 'HEXAGONG' : 'VESSEL'} ]` : `[ INHALE ${mode === 'l1' ? 'HEXAGONG' : 'VESSEL'} ]`}</b>
                        </button>
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
                    
                    {/* V5 VESSEL HOPPER: Gentler Cognitive Load */}
                    {!instrumentMode && (
                        <div style={{ display: 'flex', gap: '6px', opacity: 0.8, marginTop: '4px' }}>
                            {VESSELS.map((v, i) => {
                                let histDepth = 0;
                                try { histDepth = JSON.parse(localStorage.getItem('steeping_historical_score') || '[]').length; } catch(e){}
                                const requiredDepth = (parseInt(v.num) - 2) * 2;
                                const isLocked = parseInt(v.num) >= 3 && histDepth < requiredDepth && profile?.access_tier !== 'inneractive';
                                const isActive = activeVessel.num === v.num;
                                return (
                                    <button
                                        key={v.num}
                                        onClick={() => {
                                            if(isLocked) { playStrikingBowl && playStrikingBowl(40); return; }
                                            if(!isActive) {
                                                playHarmonicChord(i);
                                                setActiveVessel(v);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }
                                        }}
                                        style={{
                                            width: '24px', height: '24px',
                                            borderRadius: '50%', border: `1px solid ${isActive ? 'var(--bg)' : 'var(--acc)'}`,
                                            background: isActive ? 'var(--acc)' : 'transparent',
                                            color: isActive ? 'var(--bg)' : 'var(--acc)',
                                            fontFamily: 'var(--fMono)', fontSize: '0.65rem',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: isLocked ? 'not-allowed' : (isActive ? 'default' : 'pointer'),
                                            opacity: isLocked ? 0.15 : (isActive ? 1 : 0.4),
                                            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                                        }}
                                        onMouseEnter={e => { if(!isLocked && !isActive) e.currentTarget.style.opacity = '1'; }}
                                        onMouseLeave={e => { if(!isLocked && !isActive) e.currentTarget.style.opacity = '0.4'; }}
                                        title={isLocked ? "Vessel Locked" : `Hop to Vessel ${v.num}`}
                                    >
                                        {parseInt(v.num)}
                                    </button>
                                );
                            })}
                        </div>
                    )}
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

                          {parseInt(activeVessel.num) >= 1 && parseInt(activeVessel.num) <= 8 && (
                              <div style={{ marginTop: 'var(--space-xxl)', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', borderTop: '1px dashed var(--acc)', paddingTop: 'var(--space-xl)' }}>
                                  <button onClick={() => {
                                      if (playCompletionCue) playCompletionCue();
                                      setCompletedVesselName(activeVessel.name);
                                      setVesselCompletionActive(true);
                                      // L1 practitioners see the upgrade invitation after their first completion
                                      if (!isEngaged) setShowUpgradeInvite(true);
                                      setTimeout(() => {
                                          setVesselCompletionActive(false);
                                          setShowCompass(true);
                                      }, 3200);
                                  }} style={{
                                      background: 'var(--acc)', color: 'var(--bg)', border: 'none', padding: '16px 32px',
                                      fontFamily: 'var(--fMono)', fontSize: '0.85rem', letterSpacing: '0.2em', cursor: 'pointer',
                                      fontWeight: 'bold', textTransform: 'uppercase', boxShadow: '0 4px 20px rgba(212, 146, 42, 0.4)',
                                      transition: 'all 0.4s ease'
                                  }}
                                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; }}
                                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
                                      [ POUR — COMPLETE THIS STEEP ]
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

      {ledgerOpen && <SteepersLedger m={m} historicalScore={historicalScore} hasMoreHistory={hasMoreHistory} loadMoreHistory={loadMoreHistory} generateSonicSketch={generateSonicSketch} onClose={() => setLedgerOpen(false)} playStrikingBowl={playStrikingBowl} playAlgoraveSynth={playAlgoraveSynth} askSage={handleAskSage} />}

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

      {showObservatory && <OntologicalObservatory m={m} onClose={() => setShowObservatory(false)} playStrikingBowl={playStrikingBowl} playAlgoraveSynth={playAlgoraveSynth} />}
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





      {/* DYNAMIC STILLNESS CATALYSTS (Phase 07) */}
      <StillnessCatalyst m={m} />

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
              <span style={{ opacity: 0.7 }}>THEREMIN</span>
              <button
                className={`sonic-toggle ${sonicAmbient ? 'active' : ''}`}
                aria-label={`Theremin ambient sound: ${sonicAmbient ? 'On' : 'Off'}. Click to toggle.`}
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
    </div >
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppInner />
    </ErrorBoundary>
  );
}
