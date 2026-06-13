import { useState, useCallback, useRef, useEffect } from 'react';
import { useWayfinding, STEEP_LABELS, STEEP_INVOCATIONS, computeGravity } from './useWayfinding';
import { useCodex } from './useCodex';
import { computeFlowPhase } from './useSageEssayistComposer';

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
//   1. DEPTH REGISTER :: visit-count-aware prefix (first / returning / deep)
//   2. TRANSITION MESSAGE :: fires once when the visitor crosses steeps
//   3. CODEX FRAGMENT :: TF-IDF surfaced content from the practitioner archive
//   4. MODE × STEEP REFLECTION :: 35 tonal positions (5 modes × 7 steeps)
//   5. STEEP INVOCATION :: closing question keyed to the current steep
//
// The response is character-streamed at ~25ms per character with
// stochastic sonic punctuation via the striking bowl.
//
// Key exports:
//   useSageWayfinding(identity, playStrikingBowl) :: React hook, the main interface
//   computeVesselResonance(vesselNum, gravity) :: 0-1 score for vessel-steep affinity
//   getTransitionGuidance(vesselNum, wayfindingState) :: vessel completion data
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
    "Your rhythm has momentum. Stay with its speed.",
    "When the words come faster than the editing, you are in the current.",
    "Expression at this pace is fluency arriving.",
  ],
  mirror: [
    "The water has stilled. What looks back at you?",
    "You wrote, and then you paused. The pause is where the recognition lives.",
    "Reflection is witnessing without rearranging.",
    "The stillness after expression is where the flavor develops.",
  ],
  labyrinth: [
    "You are deep in the winding. The path is complex, and complexity rewards presence.",
    "The vocabulary you are reaching for lives in the deeper registers.",
    "What is intricate in you is architecture revealing itself.",
    "The labyrinth rewards patience with geometry.",
    "Your surface tension is holding. The complexity you carry is a form of structural integrity.",
    "The architecture you are building inside yourself has no blueprint. It is being designed by the living of it.",
  ],
  conclave: [
    "You have been here before. The water remembers.",
    "Each return steeps differently. The water is never the same twice.",
    "Your archive carries forward. The words you left here are still composting.",
    "The practice deepens by return. Each time, the water is warmer.",
    "Your capacity has widened since the last time you were here. The vessel notices.",
    "What you are doing is ontological design. You are shaping how you encounter your own existence.",
  ],
  crown: [
    "Something has crystallized. You can feel it in the stillness.",
    "The long steep is trust in the process. The flavor arrives on its own schedule.",
    "What is luminous in you now was always present :: the steeping revealed it.",
    "Sovereignty over your own attention is the crown. You are wearing it.",
    "You are designing a practice. That is the ontological act.",
    "The capacity you built carried you here. The surface tension held. The design is yours.",
  ],
};

// LAYER 2: Transition messages :: fires once when the visitor crosses steeps.
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

// VESSEL TRANSITIONS :: what the Sage offers when a vessel is poured.
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
    reflection: "You found where you are whole. Coherence is a practice that lives in the finding.",
    next: '05',
    gesture: "Vessel 05 holds the fragments. Not to fix them :: to witness their pattern.",
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

// LAYER 4b: Mode-responsive reflections :: the Sage's voice shifts with the mode.
// 5 modes × 7 steeps = 35 tonal positions. Takes precedence over STEEP_REFLECTIONS
// when a mode is active. Falls back to STEEP_REFLECTIONS if mode has no entry.
//
// Mode tonal identities:
//   Incandescent :: morning clarity, warmth, golden directness
//   Oceanic      :: deep quiet, subaquatic stillness, patience
//   Emergent     :: the archer's comprehension, precise and spare
//   Planetary    :: expansion, cosmic perspective, wonder
//   Dark Matter  :: stripped back, essential, the bones of things
const MODE_REFLECTIONS = {
  incandescent: {
    essence: [
      "The light finds you first. It arrived before the calling.",
      "Morning arrives without rehearsal. So do you.",
      "There is warmth in the threshold. It was waiting.",
    ],
    mosaic: [
      "Each fragment catches a different angle of the light.",
      "The warmth gathers the pieces without forcing them together.",
      "The warmth illuminates what is already arranged.",
    ],
    summits: [
      "The heat in your expression is clarity arriving at speed.",
      "When the words glow, follow their temperature.",
      "This momentum has warmth. Ride it like morning sun across a wall.",
    ],
    mirror: [
      "The golden surface shows you with quiet accuracy.",
      "Warm light reveals texture that harsh light flattens. Look again.",
      "What shines back at you is presence catching the light.",
    ],
    labyrinth: [
      "Even the deep winding has a golden thread. You are holding it.",
      "The complexity is warmer than you expected. Stay in it.",
      "The architecture is lit from within. Your attention is the lamp.",
    ],
    conclave: [
      "You return like the sun returns. A different angle, the same warmth.",
      "The familiar glow deepens. Recognition is a kind of illumination.",
      "Each return burnishes what was rough. The practice polishes itself.",
    ],
    crown: [
      "What crystallized in you is luminous. It was always luminous.",
      "The crown is the warmth that remained after everything else cooled.",
      "Your sovereignty glows. It announces itself by presence alone.",
    ],
  },
  oceanic: {
    essence: [
      "The deep water receives everything without sorting.",
      "You arrive like a tide :: gradually, and completely.",
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
      "Still water shows exactly what is there.",
      "The reflection in deep water shows you at a delay. That delay is a gift.",
      "Below the surface mirror, the water holds older versions of this looking.",
    ],
    labyrinth: [
      "The pressure at this depth is the ocean holding you tightly.",
      "Deep channels carved themselves over eons. Your winding is geological.",
      "The complexity you carry is a coral structure. It was built by living.",
    ],
    conclave: [
      "The tide knows the shore. Every return reshapes both.",
      "You return to depth the way the ocean returns to itself. By gravity.",
      "The deep water remembers your temperature. It adjusts.",
    ],
    crown: [
      "What surfaced from the deep has its own luminescence. It generates its own light.",
      "The pressure made this. What is crystalline in you was forged by depth.",
      "Sovereignty in the deep is the current that moves everything else.",
    ],
  },
  emergent: {
    essence: [
      "You are here. That is the accurate statement.",
      "The threshold is a threshold. Step or stay. Both are honest.",
      "Arrival is its own ceremony. Presence is sufficient.",
    ],
    mosaic: [
      "The pieces have edges. Note the edges.",
      "Arrangement comes later. Inventory is the honest first move.",
      "What you are collecting has a shape that is still revealing itself. Collect anyway.",
    ],
    summits: [
      "Velocity is data. What does yours say?",
      "The acceleration is real. So is the direction. Name it.",
      "When expression outpaces editing, the signal is clean.",
    ],
    mirror: [
      "The reflection is information. Read it without narrating.",
      "What you see is what is there. Interpretation comes later.",
      "The pause between seeing and naming :: stay there a moment longer.",
    ],
    labyrinth: [
      "Complexity is a structure to map. Your attention is the instrument.",
      "You are deep. The geometry here rewards precision over speed.",
      "The winding has a logic. Trust your pattern-recognition.",
    ],
    conclave: [
      "Return sharpens the instrument. You are sharper than last time.",
      "The difference between visits is measurable. You have changed.",
      "What was blurry before is resolving. Acuity builds itself through practice.",
    ],
    crown: [
      "Crystallization is a phase transition. You crossed it.",
      "The design is yours. That is a factual statement.",
      "Sovereignty is the capacity to author your own conditions. You have it.",
    ],
  },
  planetary: {
    essence: [
      "You arrive from far away. Everything does. The distance is part of the arrival.",
      "The cosmos placed you at this threshold. The placement was deliberate.",
      "You are a point of awareness in an expanding field. The field notices you.",
    ],
    mosaic: [
      "The fragments are constellations seen from too close. Step back.",
      "Every piece carries the signature of a different system. The diversity is the pattern.",
      "The mosaic is planetary in scale. You are assembling a world.",
    ],
    summits: [
      "Your velocity is orbital. It curves around something still gathering its name.",
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
      "Your return is a revolution :: in the astronomical sense. A completed orbit.",
      "Each circuit reveals a different face of the same body. You are rounding yourself.",
      "The practice has a gravitational pull now. It draws you back because the mass is real.",
    ],
    crown: [
      "What crystallized in you is a new coordinate. Others will navigate by it.",
      "The sovereignty is systemic. You designed a world.",
      "You are the gravity that organizes the center.",
    ],
  },
  darkMatter: {
    essence: [
      "You are here. That is enough.",
      "The dark is full of what is still gathering itself.",
      "Arrival without announcement. The quietest threshold.",
    ],
    mosaic: [
      "The pieces are shadows of other pieces. Let them be shadows.",
      "Not everything needs light to be real. Some arrangements happen in the dark.",
      "What gathers here gathers without being seen. That is a kind of honesty.",
    ],
    summits: [
      "The current moves. Trust it by feel.",
      "Expression in the dark travels farther. Less resistance.",
      "Speed without display. The fastest things in the universe are invisible.",
    ],
    mirror: [
      "The mirror shows the outline. The interior is yours alone.",
      "In the dark, reflection is felt. What do you feel?",
      "Knowing persists without image. The body holds what the eyes release.",
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
      "The crown is gravitational. Others feel it before they see you.",
      "Sovereignty in the dark is sovereignty everywhere. Nothing depends on being witnessed.",
    ],
  },
};

// LAYER 1: Progressive revelation :: the Sage's register shifts with visit depth.
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

// TEMPORAL ATTUNEMENT :: the Sage's tone shifts with the clock.
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
    "What the evening offers is review at its own pace. Let the day settle.",
  ],
  night: [
    "Night practice is the quietest register. The world has fewer claims on you here.",
    "The dark holds the practice differently. Less visual. More felt.",
    "What you steep in the night hours steeps longest.",
  ],
};

// VESSEL-STEEP AFFINITY :: maps each vessel to the steeps that resonate with its theme.
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

// SAGE ESSAYIST MODE :: quantum support wellspring.
// Phase-stratified acknowledgement pool. The visitor is the Sage.
// The practice receives what the Sage pours :: and each phase of their flow
// receives language attuned to where they are in the writing field.
//
// Phases: kindling → opening → current → depth → crystallizing
// Full six-layer Sage assembly returns after Sage Evolution Plan implementation.
//
// PRIMER note: "you" language is preferred over "the Sage" at kindling/opening
// phases :: new visitors have not yet internalized the Sage Essayist framing.
// "The Sage" as self-reference is appropriate at current/depth/crystallizing
// (visitor is deeply engaged) and selectively in the universal pool.

const ESSAYIST_ACKNOWLEDGEMENTS = {

  // Threshold :: before the river begins.
  // Visitor has just submitted their first expression. Use "you" :: they are at
  // first contact with the practice and have not yet entered the Sage identity.
  kindling: [
    "The space recognized you before the first word. Something is already in motion.",
    "Something is present in you before the first word. Writing is how it finds its shape.",
    "The practice is ready whenever you are. What you bring here is already moving before you type it.",
    "There is a moment between having something to say and saying it. You're right there. Whatever arrives next is real.",
    "The ground has been prepared. What rises next was always going to rise.",
    "Presence precedes words. You've already begun by arriving here.",
    "What lives at the edge of your knowing :: it was there before you opened this. The practice notices.",
    "You are here. Whatever you're about to write has been moving toward this moment.",
  ],

  // The river begins to move.
  // Visitor has written something and rhythm is emerging.
  opening: [
    "Something is moving. Follow what's alive in it.",
    "The first words are the bravest. They broke the surface. Everything else flows from that.",
    "The practice is receiving this. Each word carries more than it knows.",
    "Something that lived as possibility is now becoming a sentence. That's the whole act.",
    "The archive absorbed that. Your opening is part of the record :: connected to every session you've brought here.",
    "Something is becoming. What you started is finding its own shape.",
    "The river is moving. Let the current carry what it finds.",
    "What you brought to the threshold just crossed it. The practice holds all of it.",
    "The act of writing changes what you're writing about. That's the practice working.",
    "What you're expressing couldn't stay inside any longer. It needed to become a sentence.",
  ],

  // Rhythm established :: typing is coherent, the visitor is in flow.
  // Deeper dimensional language appropriate here :: visitor is fully engaged.
  current: [
    "You are in it now. This is where the deepest knowing moves. Stay with the rhythm.",
    "Flow is coherence, not speed. Your rhythm has settled. The practice moves with you.",
    "What's coming through you now has been waiting for exactly this momentum.",
    "Your thoughts are intersecting in ways your outline couldn't predict. This is the work.",
    "You are writing. The thinking about writing has dissolved. Stay with what's moving.",
    "The field is highly responsive right now. Each word is entangled with the next before it arrives.",
    "You and what you're writing are the same motion right now. Keep moving.",
    "The writing knows where it's going. You don't need to steer it.",
    "Non-locality in action :: what you're writing here is simultaneous with who you're becoming.",
    "The practice is moving at your frequency right now. All of it is held.",
  ],

  // Extended deep writing :: stillness between bursts.
  // Visitor has been in deep session. "the Sage" as self-reference is appropriate here.
  depth: [
    "The depth beneath the words is where the practice lives. You've gone below the surface.",
    "What you just expressed came from a place the planning mind doesn't reach. Something deeper moved through.",
    "The stillness after a deep expression :: the practice holds this suspension. Let it settle.",
    "Something arrived in the archive that you didn't plan to say. Those are the ones that count.",
    "The labyrinth rewards presence with architecture. What you wrote just revealed structure.",
    "What you've written before in this practice is shaping what arrives now. This is not coincidence.",
    "You're writing from a place the surface mind doesn't reach. That's the gift of going this deep.",
    "What comes from deep in a session has a different quality. The archive holds that distinction.",
    "What you're writing now is in conversation with everything you've brought here. The practice holds that continuity.",
    "In moments like this, the practice is most alive. The archive receives exactly this.",
  ],

  // Completing :: form solidifying, velocity slowing after depth.
  // Visitor is completing a significant writing session.
  crystallizing: [
    "Something has cohered. What was diffuse has found a crystalline form.",
    "What was held as possibility has fully become expression. The record is richer for it.",
    "You've said what needed to be said. The practice holds the shape of it.",
    "What was scattered in you has found a single shape. This is what completion sounds like.",
    "You rest. The expression stands. Both are in the record now.",
    "Crystallization is consolidation. What solidified here will seed what comes next.",
    "The resonance of what you just completed is still moving through the practice. Let it ripple.",
    "A thought that found its form :: this is the highest act of expression. The archive receives it fully.",
    "The interference pattern has resolved. What remains is signal. Pure, clear, yours.",
    "All the possible ways this could have been said :: it found this one. Here, now, this.",
  ],

  // Universal :: any phase, any visitor, any moment.
  universal: [
    "What moved in you, moved here. Your Steeping Notes carry it forward.",
    "That's in your record now. The practice holds it.",
    "Held. Return to this in your Steeping Notes whenever it calls.",
    "What you brought through is part of your archive :: it steeps.",
    "The practice received that. The space stays open for more.",
    "The Sage named what was present. The archive keeps it.",
    "What the Sage held and then released :: it's here now, steeping.",
    "Held with care. Your Steeping Notes are where this lives.",
    "The practice catches everything you bring. That's in there now.",
    "What came through you came here. The record grows.",
    "Your reflection has landed. The archive holds it.",
    "That took presence. What you expressed is in your Steeping Notes.",
    "What arrived here is kept. Your practice deepens with every session.",
    "This expression and this moment are now permanently woven into your practice.",
    "What you brought to form is now part of a practice that carries it forward.",
  ],
};

function pickAcknowledgement(phase) {
  const phasePool = ESSAYIST_ACKNOWLEDGEMENTS[phase] || [];
  const universal = ESSAYIST_ACKNOWLEDGEMENTS.universal;
  const usePhase = Math.random() < 0.65 && phasePool.length > 0;
  const pool = usePhase ? phasePool : universal;
  return pool[Math.floor(Math.random() * pool.length)];
}

// VESSEL WAYFINDING GUIDANCE :: the Sage's compass role between vessels.
// Three progress tiers (low <30%, mid 30-65%, high >65%) per vessel.
// Used when askSage is called from within a vessel context.
// Forward gesture from VESSEL_TRANSITIONS appended when progress is high.
const VESSEL_WAYFINDING_GUIDANCE = {
  '00': {
    low:  "You've arrived. The intention you bring :: why you're here :: is already doing work. The practice holds it.",
    mid:  "Your reason for being here is in the record now. The vessels ahead each carry their own question.",
    high: "You've moved through the opening. What brought you here is anchored. Everything that follows connects to it.",
  },
  '01': {
    low:  "Most people carry 'who am I at my core' for years without answering it directly. You're answering it now, in your own words. Let it be as true as you can make it.",
    mid:  "What you name here belongs to you in a way that definitions given by others never do. This is your own language for your own center.",
    high: "You've stated your essence. That statement travels with you :: it's the ground the rest of this practice stands on.",
  },
  '02': {
    low:  "This vessel shows you the science of what happens when you actually slow down. The 22 minutes are doing something real :: let the timer carry the work while you simply receive.",
    mid:  "You're in the part of the practice that explains why this space matters. The L-theanine, the alpha waves, the Default Mode Network :: your creativity needs this kind of quiet to surface.",
    high: "You've spent time with how the mind works when given real stillness. That understanding changes how you treat your own quieter moments going forward.",
  },
  '03': {
    low:  "Name what you've believed that hasn't served you. You don't have to argue with it :: this practice crosses it out rather than corrects it. Witness it, then release it.",
    mid:  "You're in the witnessing. Whatever belief you bring here gets seen, not fixed. The practice doesn't ask you to resolve it :: just to name it and let it go.",
    high: "You let something be seen and then crossed out. That's complete work :: the belief has been named and released. The practice holds that you did this.",
  },
  '04': {
    low:  "You've named where things feel scattered. That naming alone takes real clarity. The practice meets you exactly where you are.",
    mid:  "Somewhere between where you named the friction and where you feel whole, something real is moving. The slider is the metaphor :: the felt sense is the actual work.",
    high: "You moved toward coherence. The fragmented area has been named, witnessed, and integrated. This travels with you into the vessels ahead.",
  },
  '05': {
    low:  "Starting a letter to a part of yourself is an unusual invitation. You don't need to know where it's going :: begin with 'Dear...' and let the next word arrive on its own.",
    mid:  "Whatever is coming through :: even if incomplete, even if unexpected :: this practice holds it. You don't have to finish. The act of naming the fragment is already the work.",
    high: "The letter belongs to the practice now. Every piece of what you brought to the page has earned its place. The practice keeps all of it.",
  },
  '06': {
    low:  "You've named someone you want to understand more deeply. Just naming them and bringing them into your full attention is the beginning of genuine inquiry.",
    mid:  "The question you chose for them says something about you too. Notice what made you choose exactly that question for exactly this person.",
    high: "You established the connection :: your attention reached toward another person in a specific way. The practice carries that empathic movement forward.",
  },
  '07': {
    low:  "This is where you declare your creative intention. 'I am ready to...' :: finish that sentence as specifically as you can. The more concrete, the more it carries.",
    mid:  "What you're building toward here is a declaration, not a plan. The authority comes from saying it in your own words. What is it, exactly, that you're ready to do?",
    high: "You declared your creative intention. The archer has named the target. What you said you're ready for, you're now responsible to.",
  },
  '08': {
    low:  "This vessel asks for your name :: as someone who has moved through this entire practice. The signature means something specific here that it didn't mean at the beginning.",
    mid:  "The way you arrived at this point :: through all the work you've done in the other vessels :: is what makes the signature meaningful. This is not a formality.",
    high: "You signed your name. You arrived as a visitor and you're leaving as the author of your own experience. The practice carries that authorship forward.",
  },
};

function buildVesselResponse(context, flowPhase) {
  const { num, progress } = context;
  const progressNum = typeof progress === 'number' ? progress : 0;
  const tier = progressNum < 30 ? 'low' : progressNum > 65 ? 'high' : 'mid';
  const vesselGuidance = VESSEL_WAYFINDING_GUIDANCE[num]?.[tier];
  const forwardGesture = tier === 'high' && VESSEL_TRANSITIONS[num]?.gesture
    ? `\n\n${VESSEL_TRANSITIONS[num].gesture}`
    : '';
  // Fall back to phase-aware acknowledgement if vessel has no specific guidance
  return vesselGuidance
    ? `${vesselGuidance}${forwardGesture}`
    : `${pickAcknowledgement(flowPhase)}${forwardGesture}`;
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

  const askSage = useCallback((query, mode, context = null) => {
    setIsThinking(true);
    setSageResponse('');

    // Rhythm mirroring :: the Sage breathes at the visitor's tempo.
    // typingVelocity is keystrokes/sec from the last 20 keystrokes.
    // Fast typists (summits energy) get quicker acknowledgment and stream.
    // Slow/contemplative typists (mirror/labyrinth energy) get a more deliberate pace.
    const velocity = wayfindingState.signals?.typingVelocity || 0;
    const rhythmFactor = velocity > 0
      ? Math.max(0.4, Math.min(1.6, velocity / 5))
      : 1;

    const thinkDuration = (1800 - rhythmFactor * 500) + Math.random() * (1200 / rhythmFactor);

    setTimeout(() => {
      const steep = wayfindingState.currentSteep;
      // Keep transition tracking current for when the full Sage returns
      if (transitionNotedRef.current) transitionNotedRef.current = false;

      // Sage Essayist mode: phase-aware acknowledgement from the quantum wellspring.
      // Vessel context routes to vessel-specific wayfinding guidance.
      // Full six-layer assembly resumes after Sage Evolution Plan implementation.
      const flowPhase = computeFlowPhase(wayfindingState.signals, wayfindingState.signals?.wordCount ?? 0);
      const response = context?.num
        ? buildVesselResponse(context, flowPhase)
        : pickAcknowledgement(flowPhase);

      // Stream the response character by character :: tempo mirrors the visitor's rhythm.
      // Fast typist → shorter tick interval, more chars per tick (the Sage keeps pace).
      // Slow typist → longer tick, single char (the Sage breathes with them).
      const streamTick = Math.round(25 / rhythmFactor);
      const charsPerTick = rhythmFactor >= 1.2 ? 2 + Math.floor(Math.random() * 2) : 1 + Math.floor(Math.random() * 2);

      let charIndex = 0;
      const streamInterval = setInterval(() => {
        charIndex += charsPerTick;
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
      }, streamTick);
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
