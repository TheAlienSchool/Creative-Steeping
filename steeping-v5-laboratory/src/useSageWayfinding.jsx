import { useState, useCallback, useRef, useEffect } from 'react';
import { useWayfinding, STEEP_LABELS, STEEP_INVOCATIONS, computeGravity } from './useWayfinding';
import { useCodex } from './useCodex';

// ==========================================
// THE SAGE WAYFINDING ENGINE
// ==========================================
//
// Architecture Brief: see /docs/SAGE-INTELLIGENCE-BRIEF.md
// Wayfinding Engine: see ./useWayfinding.jsx
// Codex RAG Pipeline: see ./useCodex.jsx + ../scripts/build-codex.mjs
// Editorial Standard: see /VESSELVERSE SESSION PRIMER
//
// The Sage is Creative Steeping's local behavioral intelligence.
// No external API calls. It reads behavioral signals from the
// wayfinding engine and assembles a response from five layers:
//
//   1. DEPTH REGISTER — visit-count-aware prefix (first / returning / deep)
//   2. TRANSITION MESSAGE — fires once when the visitor crosses steeps
//   3. CODEX FRAGMENT — TF-IDF surfaced content from the practitioner archive
//   4. MODE × STEEP REFLECTION — 35 tonal positions (5 modes × 7 steeps)
//   5. STEEP INVOCATION — closing question keyed to the current steep
//
// The response is character-streamed at ~25ms per character with
// stochastic sonic punctuation via the striking bowl.
//
// Key exports:
//   useSageWayfinding(identity, playStrikingBowl) — React hook, the main interface
//   computeVesselResonance(vesselNum, gravity) — 0-1 score for vessel-steep affinity
//   getTransitionGuidance(vesselNum, wayfindingState) — vessel completion data
//
// ==========================================

// LAYER 4a: Universal steep reflections (mode-agnostic fallback).
// Used when no mode is active or mode has no entry for the current steep.
const STEEP_REFLECTIONS = {
  essence: [
    "You are arriving. That is the first and most honest act.",
    "Before the first word, there is presence. You are already here.",
    "The threshold receives you. No credential is needed beyond your attention.",
    "Something in you chose to pause. That choosing is the beginning.",
  ],
  mosaic: [
    "The fragments are gathering. Let them arrive without arranging.",
    "Your attention is moving between things. That movement is its own intelligence.",
    "Not everything needs to connect yet. Some pieces reveal their place only in time.",
    "You are collecting before you compose. This is how mosaics begin.",
  ],
  summits: [
    "Something is rising in your expression. Follow the velocity.",
    "Your rhythm has momentum. The steep honors it.",
    "When the words come faster than the editing, you are in the current.",
    "Expression at this pace is not urgency — it is fluency arriving.",
  ],
  mirror: [
    "The water has stilled. What looks back at you?",
    "You wrote, and then you paused. The pause is where the recognition lives.",
    "Reflection is not analysis. It is witnessing without rearranging.",
    "The stillness after expression is where the flavor develops.",
  ],
  labyrinth: [
    "You are deep in the winding. The path is not lost — it is complex.",
    "The vocabulary you are reaching for lives in the deeper registers.",
    "What is intricate in you is not confusion. It is architecture revealing itself.",
    "The labyrinth does not punish patience. It rewards it with geometry.",
    "Your surface tension is holding. The complexity you carry is a form of structural integrity.",
    "The architecture you are building inside yourself has no blueprint. It is being designed by the living of it.",
  ],
  conclave: [
    "You have been here before. The water remembers.",
    "Returning is not repetition. Each visit steeps differently.",
    "Your archive carries forward. The words you left here are still composting.",
    "The practice deepens not by addition but by return.",
    "Your capacity has widened since the last time you were here. The vessel notices.",
    "What you are doing is ontological design. You are shaping how you encounter your own existence.",
  ],
  crown: [
    "Something has crystallized. You can feel it in the stillness.",
    "The long steep is not endurance. It is trust in the process.",
    "What is luminous in you now was always present — the steeping revealed it.",
    "Sovereignty over your own attention is the crown. You are wearing it.",
    "You are not learning a practice. You are designing one. That is the ontological act.",
    "The capacity you built carried you here. The surface tension held. The design is yours.",
  ],
};

// LAYER 2: Transition messages — fires once when the visitor crosses steeps.
// Detected by the useEffect at line ~446 comparing prevSteepRef to current.
const TRANSITION_MESSAGES = {
  essence: "The waters receive your arrival.",
  mosaic: "Fragments begin to gather around your attention.",
  summits: "A current rises beneath your expression.",
  mirror: "The surface stills. Something looks back.",
  labyrinth: "The winding deepens. Your surface tension holds the complexity.",
  conclave: "The familiar resonance returns. Your capacity has widened.",
  crown: "Something luminous has crystallized. The design is yours.",
};

// VESSEL TRANSITIONS — what the Sage offers when a vessel is poured.
// Called by getTransitionGuidance() from App.jsx's POUR button handler.
// Each entry: a reflection on what was just experienced, and a gesture toward what follows.
const VESSEL_TRANSITIONS = {
  '00': {
    reflection: "You arrived. That is the first honest act of any practice.",
    next: null,
    gesture: "The vessels are waiting. Each one holds a different question.",
  },
  '01': {
    reflection: "You named your essence. That name now travels with you.",
    next: '02',
    gesture: "Vessel 02 asks what happens when you pay attention to the attention itself.",
  },
  '02': {
    reflection: "You found the quiet between the thoughts. The mechanism remembers.",
    next: '03',
    gesture: "Vessel 03 holds a mirror. It asks who is looking.",
  },
  '03': {
    reflection: "You looked. What looked back is yours to carry.",
    next: '04',
    gesture: "Vessel 04 asks where your inside matches your outside.",
  },
  '04': {
    reflection: "You found where you are whole. Coherence is not a destination — it is a practice.",
    next: '05',
    gesture: "Vessel 05 holds the fragments. Not to fix them — to witness their pattern.",
  },
  '05': {
    reflection: "The mosaic is yours. Every piece earned its place.",
    next: '06',
    gesture: "Vessel 06 turns your gaze outward. Your steep is ready to meet the world.",
  },
  '06': {
    reflection: "You extended your awareness toward another. Connection is a flavor.",
    next: '07',
    gesture: "Vessel 07 is where the voice awakens. What you have steeped is ready to pour.",
  },
  '07': {
    reflection: "You declared your creative intention. The authority is yours now.",
    next: '08',
    gesture: "Vessel 08 asks for your signature. The author signs last.",
  },
  '08': {
    reflection: "You signed your name. The practice carries your signature now.",
    next: null,
    gesture: "The vessels remain. Each return steeps differently.",
  },
};

// LAYER 4b: Mode-responsive reflections — the Sage's voice shifts with the mode.
// 5 modes × 7 steeps = 35 tonal positions. Takes precedence over STEEP_REFLECTIONS
// when a mode is active. Falls back to STEEP_REFLECTIONS if mode has no entry.
//
// Mode tonal identities:
//   Incandescent — morning clarity, warmth, golden directness
//   Oceanic      — deep quiet, subaquatic stillness, patience
//   Emergent     — the archer's comprehension, precise and spare
//   Planetary    — expansion, cosmic perspective, wonder
//   Dark Matter  — stripped back, essential, the bones of things
const MODE_REFLECTIONS = {
  incandescent: {
    essence: [
      "The light finds you first. You did not need to call it.",
      "Morning arrives without rehearsal. So do you.",
      "There is warmth in the threshold. It was waiting.",
    ],
    mosaic: [
      "Each fragment catches a different angle of the light.",
      "The warmth gathers the pieces without forcing them together.",
      "Gold does not organize — it illuminates what is already arranged.",
    ],
    summits: [
      "The heat in your expression is not urgency. It is clarity arriving at speed.",
      "When the words glow, do not dim them. Follow their temperature.",
      "This momentum has warmth. Ride it like morning sun across a wall.",
    ],
    mirror: [
      "The golden surface shows you without flattery or cruelty.",
      "Warm light reveals texture that harsh light flattens. Look again.",
      "What shines back at you is not performance. It is presence catching the light.",
    ],
    labyrinth: [
      "Even the deep winding has a golden thread. You are holding it.",
      "The complexity is warmer than you expected. Stay in it.",
      "The architecture is lit from within. Your attention is the lamp.",
    ],
    conclave: [
      "You return like the sun returns. Not the same angle, but the same warmth.",
      "The familiar glow deepens. Recognition is a kind of illumination.",
      "Each return burnishes what was rough. The practice polishes itself.",
    ],
    crown: [
      "What crystallized in you is luminous. It was always luminous.",
      "The crown is not given. It is the warmth that remained after everything else cooled.",
      "Your sovereignty glows. It does not need to announce itself.",
    ],
  },
  oceanic: {
    essence: [
      "The deep water receives everything without sorting.",
      "You arrive like a tide — not all at once, but completely.",
      "Beneath the surface, the arrival has already happened.",
    ],
    mosaic: [
      "The fragments settle like sediment. Let the water do its work.",
      "In deep water, pieces drift toward their own arrangement.",
      "Patience is the ocean's only method. It is working on you now.",
    ],
    summits: [
      "Even the current has a stillness inside it. You are moving from there.",
      "The deep channel carries faster than the surface turbulence suggests.",
      "Your expression has an undertow. Let it pull what needs pulling.",
    ],
    mirror: [
      "Still water does not lie. It does not flatter either.",
      "The reflection in deep water shows you at a delay. That delay is a gift.",
      "Below the surface mirror, the water holds older versions of this looking.",
    ],
    labyrinth: [
      "The pressure at this depth is not punishment. It is the ocean holding you tightly.",
      "Deep channels carved themselves over eons. Your winding is geological.",
      "The complexity you carry is a coral structure. It was built by living.",
    ],
    conclave: [
      "The tide knows the shore. Every return reshapes both.",
      "You return to depth the way the ocean returns to itself. Without effort.",
      "The deep water remembers your temperature. It adjusts.",
    ],
    crown: [
      "What surfaced from the deep has its own luminescence. It needs no sun.",
      "The pressure made this. What is crystalline in you was forged by depth.",
      "Sovereignty in the deep is not visibility. It is the current that moves everything else.",
    ],
  },
  emergent: {
    essence: [
      "You are here. That is the accurate statement.",
      "The threshold is a threshold. Step or stay. Both are honest.",
      "Arrival does not require ceremony. Presence is sufficient.",
    ],
    mosaic: [
      "The pieces have edges. Note the edges.",
      "Arrangement is premature. Inventory is not.",
      "What you are collecting has a shape you cannot yet see. Collect anyway.",
    ],
    summits: [
      "Velocity is data. What does yours say?",
      "The acceleration is real. So is the direction. Name it.",
      "When expression outpaces editing, the signal is clean.",
    ],
    mirror: [
      "The reflection is information. Read it without narrating.",
      "What you see is what is there. Interpretation comes later.",
      "The pause between seeing and naming — stay there a moment longer.",
    ],
    labyrinth: [
      "Complexity is not a problem to solve. It is a structure to map.",
      "You are deep. The geometry here rewards precision over speed.",
      "The winding is not random. There is a logic. Trust your pattern-recognition.",
    ],
    conclave: [
      "Return sharpens the instrument. You are sharper than last time.",
      "The difference between visits is measurable. You have changed.",
      "What was blurry before is resolving. Acuity builds itself through practice.",
    ],
    crown: [
      "Crystallization is a phase transition. You crossed it.",
      "The design is yours. That is a factual statement, not a compliment.",
      "Sovereignty is the capacity to author your own conditions. You have it.",
    ],
  },
  planetary: {
    essence: [
      "You arrive from far away. Everything does. The distance is part of the arrival.",
      "The cosmos placed you at this threshold. The placement was not random.",
      "You are a point of awareness in an expanding field. The field notices you.",
    ],
    mosaic: [
      "The fragments are constellations seen from too close. Step back.",
      "Every piece carries the signature of a different system. The diversity is the pattern.",
      "The mosaic is planetary in scale. You are assembling a world, not a picture.",
    ],
    summits: [
      "Your velocity is orbital. It curves around something you have not yet named.",
      "The momentum carries the weight of systems. You are moving more than yourself.",
      "When expression reaches this frequency, it becomes a signal. Something is listening.",
    ],
    mirror: [
      "The mirror is a window. What looks back at you is also looking out.",
      "From this distance, the reflection includes everything around you. The context is you.",
      "What you see in the stillness extends beyond the personal. You are a landscape.",
    ],
    labyrinth: [
      "The winding is the orbit of a system discovering its own gravity.",
      "At this scale, complexity is elegance. Every spiral serves a function.",
      "You are navigating something larger than yourself. The labyrinth is grateful for your attention.",
    ],
    conclave: [
      "Your return is a revolution — in the astronomical sense. A completed orbit.",
      "Each circuit reveals a different face of the same body. You are rounding yourself.",
      "The practice has a gravitational pull now. It draws you back because the mass is real.",
    ],
    crown: [
      "What crystallized in you is a new coordinate. Others will navigate by it.",
      "The sovereignty is not personal. It is systemic. You designed a world, not a crown.",
      "You are not at the center. You are the gravity that organizes the center.",
    ],
  },
  darkMatter: {
    essence: [
      "You are here. That is enough.",
      "The dark is not empty. It is full of what has not yet declared itself.",
      "Arrival without announcement. The quietest threshold.",
    ],
    mosaic: [
      "The pieces are shadows of other pieces. Let them be shadows.",
      "Not everything needs light to be real. Some arrangements happen in the dark.",
      "What gathers here gathers without being seen. That is a kind of honesty.",
    ],
    summits: [
      "The current moves. You do not need to see it to trust it.",
      "Expression in the dark travels farther. Less resistance.",
      "Speed without display. The fastest things in the universe are invisible.",
    ],
    mirror: [
      "The mirror shows the outline. The interior is yours alone.",
      "In the dark, reflection is felt, not seen. What do you feel?",
      "The absence of image is not the absence of knowing.",
    ],
    labyrinth: [
      "The winding is navigated by touch here. Your hands know more than your eyes.",
      "Darkness simplifies the labyrinth. Fewer distractions. Truer turns.",
      "The architecture reveals itself to those who stopped needing to see it.",
    ],
    conclave: [
      "You return to the dark the way sleep returns. Without resistance.",
      "What deepens in the absence of light deepens permanently.",
      "The practice has become invisible to you. That means it is working.",
    ],
    crown: [
      "What crystallized here holds no light. It holds weight. That is rarer.",
      "The crown is not visible. It is gravitational. Others feel it before they see you.",
      "Sovereignty in the dark is sovereignty everywhere. Nothing depends on being witnessed.",
    ],
  },
};

// LAYER 1: Progressive revelation — the Sage's register shifts with visit depth.
// Fires as a prefix ~50% of the time (avoids formulaic repetition).
// Thresholds: first (0-2 visits), returning (3-9), deep (10+).
// See getDepthRegister() below. Visit count from useWayfinding → raw.visitCount.
const DEPTH_REGISTERS = {
  first: {
    prefix: [
      "This is a beginning.",
      "You are new here, and new is a kind of gift.",
      "The space is unwritten. That is its invitation.",
    ],
  },
  returning: {
    prefix: [
      "The water recognizes you.",
      "You have been here before. Something in you remembers.",
      "The practice grows roots between visits. Yours are showing.",
    ],
  },
  deep: {
    prefix: [
      "You know this water.",
      "The practice and the practitioner are becoming hard to separate.",
      "What the vessel holds now, it holds because of you.",
    ],
  },
};

function getDepthRegister(visitCount) {
  if (visitCount >= 10) return 'deep';
  if (visitCount >= 3) return 'returning';
  return 'first';
}

// TEMPORAL ATTUNEMENT — the Sage's tone shifts with the clock.
// Appended as a closing whisper ~40% of the time.
// Time-of-day from useWayfinding → raw.timeOfDay (predawn/morning/afternoon/evening/night).
const TEMPORAL_WHISPERS = {
  predawn: [
    "The hours before dawn are the body's hours. Let the thinking rest.",
    "Something in you is awake before the reasons arrive.",
    "Predawn practice moves by feel. The light will come later.",
  ],
  morning: [
    "Morning steeping carries well into the day.",
    "The clarity you find now has the whole day to work in.",
    "Fresh attention is its own resource. Use it gently.",
  ],
  afternoon: [
    "The afternoon is where practice meets the day already lived.",
    "What you bring here now has the weight of hours behind it.",
    "Afternoon attention is seasoned. Trust what it notices.",
  ],
  evening: [
    "Evening steeping is composting. The day's material is decomposing into something useful.",
    "The day is settling. Let what rises now rise slowly.",
    "What the evening offers is review without the urgency of revision.",
  ],
  night: [
    "Night practice is the quietest register. The world has fewer claims on you here.",
    "The dark holds the practice differently. Less visual. More felt.",
    "What you steep in the night hours steeps longest.",
  ],
};

// VESSEL-STEEP AFFINITY — maps each vessel to the steeps that resonate with its theme.
// Used by computeVesselResonance() for matrix glow intensity AND by the
// gravity-informed vessel unlocking system in App.jsx (resonance >= 0.6 unlocks).
export const VESSEL_STEEP_AFFINITY = {
  '00': ['essence'],
  '01': ['essence', 'mosaic'],
  '02': ['mosaic', 'mirror'],
  '03': ['mirror'],
  '04': ['summits', 'labyrinth'],
  '05': ['mosaic', 'labyrinth'],
  '06': ['conclave'],
  '07': ['summits', 'crown'],
  '08': ['crown', 'conclave'],
  'W1': ['essence'],
  'W2': ['essence', 'mosaic'],
  'W3': ['mosaic'],
  'W4': ['summits'],
};

export function computeVesselResonance(vesselNum, gravity) {
  const affinities = VESSEL_STEEP_AFFINITY[vesselNum];
  if (!affinities || !gravity || gravity.length === 0) return 0;

  let score = 0;
  for (const g of gravity) {
    if (affinities.includes(g.steep)) {
      score += g.weight;
    }
  }
  return Math.min(score / 1.5, 1);
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getTransitionGuidance(vesselNum, wayfindingState) {
  const transition = VESSEL_TRANSITIONS[vesselNum];
  if (!transition) return null;

  const steep = wayfindingState?.currentSteep || 'essence';
  const steepLabel = STEEP_LABELS[steep];

  return {
    reflection: transition.reflection,
    gesture: transition.gesture,
    nextVessel: transition.next,
    currentSteep: steep,
    steepLabel,
  };
}

export function useSageWayfinding(identity, playStrikingBowl) {
  const { state: wayfindingState, onTextChange } = useWayfinding();
  const { codex, loading: codexLoading, surface, resetSurfaced } = useCodex();

  const [sageResponse, setSageResponse] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [historicalScore, setHistoricalScore] = useState([]);
  const [hasMoreHistory, setHasMoreHistory] = useState(false);
  const [pageOffset, setPageOffset] = useState(0);
  const ARCHIVE_CHUNK_SIZE = 10;

  const prevSteepRef = useRef(wayfindingState.currentSteep);
  const transitionNotedRef = useRef(false);

  // Load historical archive on mount
  useEffect(() => {
    try {
      const rawArchive = JSON.parse(localStorage.getItem('steeping_historical_score') || '[]');
      setHistoricalScore(rawArchive.slice(0, ARCHIVE_CHUNK_SIZE));
      setHasMoreHistory(rawArchive.length > ARCHIVE_CHUNK_SIZE);
      setPageOffset(1);
    } catch {
      setHistoricalScore([]);
    }
  }, []);

  const loadMoreHistory = useCallback(() => {
    try {
      const rawArchive = JSON.parse(localStorage.getItem('steeping_historical_score') || '[]');
      const nextOffset = pageOffset + 1;
      const newChunk = rawArchive.slice(0, nextOffset * ARCHIVE_CHUNK_SIZE);
      setHistoricalScore(newChunk);
      setHasMoreHistory(rawArchive.length > newChunk.length);
      setPageOffset(nextOffset);
    } catch (e) {
      console.error("Archive retrieval failed", e);
    }
  }, [pageOffset]);

  // Detect steep transitions and note them
  useEffect(() => {
    if (wayfindingState.currentSteep !== prevSteepRef.current) {
      prevSteepRef.current = wayfindingState.currentSteep;
      transitionNotedRef.current = true;
    }
  }, [wayfindingState.currentSteep]);

  const askSage = useCallback((query, mode) => {
    setIsThinking(true);
    setSageResponse('');

    // Simulate the contemplative pause — the Sage considers
    const thinkDuration = 1200 + Math.random() * 1800;

    setTimeout(() => {
      const steep = wayfindingState.currentSteep;
      const interpreted = wayfindingState.signals;
      let response = '';

      // 1. Depth register — acknowledge where the visitor is in their practice arc
      const visitCount = wayfindingState.raw?.visitCount || 0;
      const depthRegister = getDepthRegister(visitCount);
      const depthPrefixes = DEPTH_REGISTERS[depthRegister]?.prefix;
      if (depthPrefixes && Math.random() > 0.5) {
        response += pickRandom(depthPrefixes) + '\n\n';
      }

      // 2. If there was a steep transition, acknowledge it
      if (transitionNotedRef.current) {
        response += TRANSITION_MESSAGES[steep] + '\n\n';
        transitionNotedRef.current = false;
      }

      // 3. Surface a codex fragment if available
      const codexResults = surface(steep, query, 1);
      if (codexResults.length > 0) {
        const fragment = codexResults[0].fragment;
        response += fragment.text + '\n\n';
      }

      // 4. Add a mode-and-steep-responsive reflection
      const modeReflections = mode && MODE_REFLECTIONS[mode]?.[steep];
      const reflections = modeReflections || STEEP_REFLECTIONS[steep] || STEEP_REFLECTIONS.essence;
      response += pickRandom(reflections);

      // 5. If the visitor asked something specific, add the steep invocation
      if (query.trim().endsWith('?') || query.length > 40) {
        response += '\n\n' + STEEP_INVOCATIONS[steep];
      }

      // 6. Temporal attunement — a closing whisper keyed to time of day (~40%)
      const timeOfDay = wayfindingState.raw?.timeOfDay;
      const temporalWhispers = timeOfDay && TEMPORAL_WHISPERS[timeOfDay];
      if (temporalWhispers && Math.random() > 0.6) {
        response += '\n\n' + pickRandom(temporalWhispers);
      }

      // Stream the response character by character for the cinematic effect
      let charIndex = 0;
      const streamInterval = setInterval(() => {
        charIndex += 1 + Math.floor(Math.random() * 2);
        if (charIndex >= response.length) {
          charIndex = response.length;
          clearInterval(streamInterval);
          setIsThinking(false);

          // Archive the exchange
          const legacyEntry = {
            timestamp: new Date().toISOString(),
            query,
            response,
            mode,
            steep,
          };

          let rawArchive = [];
          try {
            rawArchive = JSON.parse(localStorage.getItem('steeping_historical_score') || '[]');
          } catch { }

          const updatedArchive = [legacyEntry, ...rawArchive];
          localStorage.setItem('steeping_historical_score', JSON.stringify(updatedArchive));
          setHistoricalScore(prev => [legacyEntry, ...prev]);
        }

        setSageResponse(response.slice(0, charIndex));

        // Sonic footprint of transmitted thought
        if (playStrikingBowl && Math.random() > 0.8) {
          playStrikingBowl(45 + Math.floor(Math.random() * 25));
        }
      }, 25);
    }, thinkDuration);
  }, [wayfindingState, surface, playStrikingBowl]);

  return {
    askSage,
    sageResponse,
    isThinking,
    setSageResponse,
    historicalScore,
    hasMoreHistory,
    loadMoreHistory,
    wayfindingState,
    onTextChange,
    codexReady: !codexLoading && codex !== null,
    surface,
  };
}
