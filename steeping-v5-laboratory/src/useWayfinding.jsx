import { useEffect, useRef, useCallback, useState } from "react";

// ==========================================
// THE WAYFINDING ENGINE
// ==========================================
// Reads behavioral signals and maps the visitor
// to their position within the Seven Steeps.
// No external API calls. The intelligence is here.

export const PRIMARY_INVOCATION = "Where Do You Find Your Self?";

export const SEVEN_STEEPS = [
  "essence", "mosaic", "summits", "mirror",
  "labyrinth", "conclave", "crown",
];

export const STEEP_LABELS = {
  essence: "Essence of My Being",
  mosaic: "Mosaic",
  summits: "Summits",
  mirror: "Mirror",
  labyrinth: "Labyrinth",
  conclave: "Conclave",
  crown: "Crown Jewels",
};

export const STEEP_INVOCATIONS = {
  essence: "Who arrives?",
  mosaic: "What fragments are gathering?",
  summits: "What is rising in you?",
  mirror: "What do you see when the water stills?",
  labyrinth: "What lives in the winding?",
  conclave: "What converges now?",
  crown: "What has crystallized?",
};

// --- Signal Collection ---

const VISIT_KEY = "steeping-space:visits";
const ARCHIVE_KEY = "steeping_historical_score";

const SESSION_SETTLING = 60_000;
const SESSION_PRESENT = 180_000;
const SESSION_DEEP = 480_000;
const SESSION_ROOTED = 900_000;
const FLOW_VELOCITY_THRESHOLD = 3;
const REFLECTION_STILLNESS_RATIO = 0.6;
const PRESENCE_TICK = 1000;

function resolveTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 5) return "predawn";
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  if (hour < 21) return "evening";
  return "night";
}

function getVisitCount() {
  try {
    const raw = localStorage.getItem(VISIT_KEY);
    return raw ? parseInt(raw, 10) : 0;
  } catch { return 0; }
}

function getArchiveWordCount() {
  try {
    const raw = localStorage.getItem(ARCHIVE_KEY);
    if (!raw) return 0;
    const archive = JSON.parse(raw);
    if (!Array.isArray(archive)) return 0;
    let total = 0;
    for (const entry of archive) {
      if (entry.query) total += entry.query.split(/\s+/).length;
    }
    return total;
  } catch { return 0; }
}

function incrementVisitCount() {
  try {
    const count = getVisitCount();
    localStorage.setItem(VISIT_KEY, String(count + 1));
  } catch { /* Storage unavailable */ }
}

function createInitialSignals() {
  return {
    presenceDuration: 0,
    stillnessDuration: 0,
    totalActivityDuration: 0,
    textContent: "",
    wordCount: 0,
    keystrokeCount: 0,
    keystrokeTimestamps: [],
    lastActivityTimestamp: Date.now(),
    archiveWordCount: getArchiveWordCount(),
    visitCount: getVisitCount(),
    timeOfDay: resolveTimeOfDay(),
  };
}

function updateTextSignals(signals, text) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const now = Date.now();
  const timestamps = [...signals.keystrokeTimestamps, now];
  if (timestamps.length > 60) timestamps.shift();

  return {
    ...signals,
    textContent: text,
    wordCount: words.length,
    keystrokeCount: signals.keystrokeCount + 1,
    keystrokeTimestamps: timestamps,
    lastActivityTimestamp: now,
    totalActivityDuration: signals.totalActivityDuration + 1,
  };
}

function updatePresenceSignals(signals, elapsed) {
  const now = Date.now();
  const timeSinceActivity = now - signals.lastActivityTimestamp;
  const isStill = timeSinceActivity > 3000;

  return {
    ...signals,
    presenceDuration: signals.presenceDuration + elapsed,
    stillnessDuration: signals.stillnessDuration + (isStill ? elapsed : 0),
  };
}

function updateActivitySignal(signals) {
  return { ...signals, lastActivityTimestamp: Date.now() };
}

// --- Signal Interpretation ---

function deriveSessionAge(duration) {
  if (duration < SESSION_SETTLING) return "arriving";
  if (duration < SESSION_PRESENT) return "settling";
  if (duration < SESSION_DEEP) return "present";
  if (duration < SESSION_ROOTED) return "deep";
  return "rooted";
}

function computeTypingVelocity(timestamps) {
  if (timestamps.length < 2) return 0;
  const recent = timestamps.slice(-20);
  const span = recent[recent.length - 1] - recent[0];
  if (span === 0) return 0;
  return ((recent.length - 1) / span) * 1000;
}

function computeTypingVariance(timestamps) {
  if (timestamps.length < 3) return 0;
  const recent = timestamps.slice(-20);
  const intervals = [];
  for (let i = 1; i < recent.length; i++) {
    intervals.push(recent[i] - recent[i - 1]);
  }
  const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const variance = intervals.reduce((sum, v) => sum + (v - mean) ** 2, 0) / intervals.length;
  return Math.sqrt(variance);
}

function computeVocabularyRichness(text) {
  if (!text.trim()) return 0;
  const words = text.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 0;
  const unique = new Set(words);
  return unique.size / words.length;
}

function computeExpressionDensity(wordCount, duration) {
  if (duration === 0) return 0;
  return wordCount / (duration / 60_000);
}

function interpretSignals(raw) {
  const stillnessRatio = raw.presenceDuration > 0
    ? raw.stillnessDuration / raw.presenceDuration : 0;

  const typingVelocity = computeTypingVelocity(raw.keystrokeTimestamps);
  const typingVariance = computeTypingVariance(raw.keystrokeTimestamps);
  const vocabularyRichness = computeVocabularyRichness(raw.textContent);
  const expressionDensity = computeExpressionDensity(raw.wordCount, raw.presenceDuration);
  const textDepth = Math.min(raw.wordCount / 50, 1);
  const isInFlow = typingVelocity > FLOW_VELOCITY_THRESHOLD && typingVariance < 300;
  const isInReflection = stillnessRatio > REFLECTION_STILLNESS_RATIO && raw.wordCount > 0;

  return {
    stillnessRatio,
    textDepth,
    typingVelocity,
    typingVariance,
    vocabularyRichness,
    expressionDensity,
    isReturning: raw.visitCount > 0,
    isDeepSession: raw.presenceDuration > SESSION_DEEP,
    isInFlow,
    isInReflection,
    sessionAge: deriveSessionAge(raw.presenceDuration),
  };
}

// --- Gravity Model ---

export function computeGravity(raw, interpreted) {
  const weights = {
    essence: 0, mosaic: 0, summits: 0, mirror: 0,
    labyrinth: 0, conclave: 0, crown: 0,
  };

  // ESSENCE: arrival, first presence, no text yet
  if (interpreted.sessionAge === "arriving") weights.essence += 0.8;
  if (raw.wordCount === 0 && raw.presenceDuration < SESSION_SETTLING) weights.essence += 0.5;
  if (!interpreted.isReturning) weights.essence += 0.2;

  // MOSAIC: fragments gathering, early exploration
  if (raw.wordCount > 0 && raw.wordCount < 15) weights.mosaic += 0.6;
  if (interpreted.sessionAge === "settling") weights.mosaic += 0.4;
  if (interpreted.typingVariance > 400) weights.mosaic += 0.3;

  // SUMMITS: sustained expression, flow state
  if (interpreted.isInFlow) weights.summits += 0.7;
  if (raw.wordCount >= 15 && raw.wordCount < 40) weights.summits += 0.5;
  if (interpreted.expressionDensity > 8) weights.summits += 0.3;

  // MIRROR: pause after expression, reflection
  if (interpreted.isInReflection) weights.mirror += 0.7;
  if (raw.wordCount > 10 && interpreted.stillnessRatio > 0.4) weights.mirror += 0.4;
  if (interpreted.sessionAge === "present") weights.mirror += 0.2;

  // LABYRINTH: deep session, complexity, revision
  if (interpreted.isDeepSession) weights.labyrinth += 0.5;
  if (interpreted.vocabularyRichness > 0.7 && raw.wordCount > 20) weights.labyrinth += 0.4;
  if (interpreted.sessionAge === "deep") weights.labyrinth += 0.4;

  // CONCLAVE: returning visitor, archive integration
  if (interpreted.isReturning) weights.conclave += 0.4;
  if (raw.archiveWordCount > 0) weights.conclave += 0.4;
  if (raw.visitCount > 3) weights.conclave += 0.3;

  // CROWN: crystallization, long session + stillness + archive
  if (interpreted.sessionAge === "rooted") weights.crown += 0.5;
  if (raw.archiveWordCount > 0 && interpreted.isDeepSession && interpreted.stillnessRatio > 0.3) {
    weights.crown += 0.4;
  }
  if (interpreted.vocabularyRichness > 0.75 && raw.wordCount > 30) weights.crown += 0.3;

  return Object.entries(weights)
    .map(([steep, weight]) => ({ steep, weight }))
    .sort((a, b) => b.weight - a.weight);
}

function resolveSteep(gravity) {
  if (gravity.length === 0) return "essence";
  return gravity[0].steep;
}

function deriveState(raw) {
  const signals = interpretSignals(raw);
  const gravity = computeGravity(raw, signals);
  const currentSteep = resolveSteep(gravity);
  return { currentSteep, gravity, signals, raw, transitionMoment: Date.now() };
}

// --- React Hook ---

export function useWayfinding() {
  const rawRef = useRef(createInitialSignals());
  const [state, setState] = useState(() => deriveState(rawRef.current));
  const prevSteepRef = useRef(state.currentSteep);

  useEffect(() => { incrementVisitCount(); }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      rawRef.current = updatePresenceSignals(rawRef.current, PRESENCE_TICK);
      const next = deriveState(rawRef.current);

      if (next.currentSteep !== prevSteepRef.current) {
        prevSteepRef.current = next.currentSteep;
        next.transitionMoment = Date.now();
      }
      setState(next);
    }, PRESENCE_TICK);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleActivity = () => {
      rawRef.current = updateActivitySignal(rawRef.current);
    };
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("scroll", handleActivity);
    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("scroll", handleActivity);
    };
  }, []);

  const onTextChange = useCallback((text) => {
    rawRef.current = updateTextSignals(rawRef.current, text);
    setState(deriveState(rawRef.current));
  }, []);

  return { state, onTextChange };
}
