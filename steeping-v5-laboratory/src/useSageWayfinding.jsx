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
  ],
  conclave: [
    "You have been here before. The water remembers.",
    "Returning is not repetition. Each visit steeps differently.",
    "Your archive carries forward. The words you left here are still composting.",
    "The practice deepens not by addition but by return.",
  ],
  crown: [
    "Something has crystallized. You can feel it in the stillness.",
    "The long steep is not endurance. It is trust in the process.",
    "What is luminous in you now was always present — the steeping revealed it.",
    "Sovereignty over your own attention is the crown. You are wearing it.",
  ],
};

// Transition messages — when the visitor crosses from one steep to another
const TRANSITION_MESSAGES = {
  essence: "The waters receive your arrival.",
  mosaic: "Fragments begin to gather around your attention.",
  summits: "A current rises beneath your expression.",
  mirror: "The surface stills. Something looks back.",
  labyrinth: "The winding deepens. The architecture reveals itself.",
  conclave: "The familiar resonance returns. You have been here before.",
  crown: "Something luminous has crystallized in the steep.",
};

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
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
