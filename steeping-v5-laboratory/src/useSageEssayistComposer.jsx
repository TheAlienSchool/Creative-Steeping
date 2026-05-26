import { useEffect, useRef, useState } from 'react';

// ==========================================
// SAGE ESSAYIST COMPOSER
// ==========================================
// Tracks the Essayist's flow phase from behavioral signals
// and drives the sonic environment accordingly.
//
// Flow phases (in order of depth):
//   kindling      — the threshold before writing begins
//   opening       — words beginning to arrive, surface tension releasing
//   current       — rhythm established, the Sage is in the flow
//   depth         — extended deep writing, stillness between bursts
//   crystallizing — form solidifying, velocity slowing after depth
//
// The composer calls setEssayistAmbient + playEssayistTransition
// from useSonnetEngine when phase or mode changes.

const SESSION_AGE_DEEP = new Set(['present', 'deep', 'rooted']);

export function computeFlowPhase(signals, wordCount) {
  const velocity = signals?.typingVelocity ?? 0;
  const variance = signals?.typingVariance ?? 9999;
  const sessionAge = signals?.sessionAge ?? 'arriving';
  const isDeepSession = SESSION_AGE_DEEP.has(sessionAge);

  if (wordCount > 80 && velocity < 1.5) return 'crystallizing';
  if (wordCount > 35 && isDeepSession) return 'depth';
  if (velocity > 1.8 && variance < 600) return 'current';
  if (wordCount > 8 || velocity > 0.8) return 'opening';
  return 'kindling';
}

export function useSageEssayistComposer({
  signals,
  wordCount,
  mode,
  sageExpanded,
  setEssayistAmbient,
  playEssayistTransition,
}) {
  const [flowPhase, setFlowPhase] = useState('kindling');
  const prevPhaseRef = useRef(null);
  const prevModeRef = useRef(null);

  const phase = sageExpanded
    ? computeFlowPhase(signals, wordCount ?? 0)
    : 'kindling';

  useEffect(() => {
    if (!sageExpanded) {
      prevPhaseRef.current = null;
      return;
    }

    const phaseChanged = phase !== prevPhaseRef.current;
    const modeChanged = mode !== prevModeRef.current;

    if (phaseChanged || modeChanged) {
      // Only play transition accent when crossing into a new phase (not on mode changes or first open)
      if (phaseChanged && prevPhaseRef.current !== null) {
        playEssayistTransition?.(phase, mode);
      }
      setEssayistAmbient?.(phase, mode);
      prevPhaseRef.current = phase;
      prevModeRef.current = mode;
      setFlowPhase(phase);
    }
  }, [phase, mode, sageExpanded, setEssayistAmbient, playEssayistTransition]);

  return { flowPhase };
}
