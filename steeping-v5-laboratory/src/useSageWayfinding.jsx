import { useState, useCallback, useRef, useEffect } from 'react';
import { useWayfinding, STEEP_LABELS, STEEP_INVOCATIONS, computeGravity } from './useWayfinding';
import { useCodex } from './useCodex';

// ==========================================
// THE SAGE WAYFINDING ENGINE
// ==========================================
// Replaces external API calls (Anthropic/Gemini)
// with local behavioral intelligence. The Sage reads
// the visitor's signals and surfaces relevant content
// from the codex based on their current steep.

// Wayfinding responses — authored, mode-aware reflections
// that the Sage offers based on the visitor's position.
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

// Transition messages — when the visitor crosses from one steep to another
const TRANSITION_MESSAGES = {
  essence: "The waters receive your arrival.",
  mosaic: "Fragments begin to gather around your attention.",
  summits: "A current rises beneath your expression.",
  mirror: "The surface stills. Something looks back.",
  labyrinth: "The winding deepens. Your surface tension holds the complexity.",
  conclave: "The familiar resonance returns. Your capacity has widened.",
  crown: "Something luminous has crystallized. The design is yours.",
};

// Vessel completion transitions — what the Sage offers when a vessel is poured.
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

// Vessel-to-steep affinity — which steeps resonate with each vessel's theme
const VESSEL_STEEP_AFFINITY = {
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

      // 1. If there was a steep transition, acknowledge it
      if (transitionNotedRef.current) {
        response += TRANSITION_MESSAGES[steep] + '\n\n';
        transitionNotedRef.current = false;
      }

      // 2. Surface a codex fragment if available
      const codexResults = surface(steep, query, 1);
      if (codexResults.length > 0) {
        const fragment = codexResults[0].fragment;
        response += fragment.text + '\n\n';
      }

      // 3. Add a steep-specific reflection
      const reflections = STEEP_REFLECTIONS[steep] || STEEP_REFLECTIONS.essence;
      response += pickRandom(reflections);

      // 4. If the visitor asked something specific, add the steep invocation
      if (query.trim().endsWith('?') || query.length > 40) {
        response += '\n\n' + STEEP_INVOCATIONS[steep];
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
