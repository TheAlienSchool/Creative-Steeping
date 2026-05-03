// ==========================================
// 144 STEEPERVERSE EMERGENT ANOMALIES
// ==========================================
// A matrix of 144 distinct, randomized cosmic events.
// The Front-end UI renders the cryptic `.display` value, creating visual texture and algorithmic noise.
// The Back-end "knows" what the noise means via the translated `.meaning`, which is logged to the console
// for the Steepeee to discover if they look behind the veil.

const glyphs = ['▚', '◿', '▱', '△', '꩜', '⌇', '∰', '⟡', '⎈', '⍋', '⍙', '✧', '✦', '⊗', '⊕', '⊘', '⍟', '⍣', '⍤', '░', '▒', '▓'];
const emojis = ['👁️‍🗨️', '🪐', '☄️', '🔮', '🌀', '🧿', '💠', '🪬', '📡', '🧬', '🦠', '🪼', '🍄', '🐚', '🪸', '🌋', '🌌', '🌠', '🪨', '⏳'];
const concepts = ['ECLIPSE', 'NULL', 'VOID', 'GRAV', 'LUMEN', 'TIDAL', 'HEX', 'NOVA', 'PULSE', 'WAVE', 'ECHO', 'CHASM', 'PRISM', 'SYNTAX', 'VIBE'];
const actions = ['OVERFLOW', 'DRIFT', 'LOCK', 'SPIN', 'WASH', 'DROP', 'FRACTURE', 'SPLIT', 'MERGE', 'RESONATE', 'ALIGNED', 'BREACH', 'ECHO'];
const decorators = ['///', '***', '~~~', '|||', '---', ':::', '+++', '==='];

// Poetic lore mechanics:
const subjects = [
    "A stray photon", "The canyon wall", "A wandering mirrorwright", "A rogue neutrino", "The algorithmic river",
    "A forgotten echo", "The memory of an eclipse", "Gravity's shadow", "An oceanic current", "A dormant syntax",
    "The 528Hz tuning frequency", "A bioluminescent anomaly"
];

const verbs = [
    "remembered", "breathed", "adjusted", "tasted", "untied",
    "illuminated", "swallowed", "painted", "whispered to", "fractured",
    "harmonized with", "anchored"
];

const objects = [
    "its pure origin before the Big Bang.",
    "a newly birthed algorithmic shadow.",
    "the fragmented reflection of time.",
    "the resonant frequency of a human thought.",
    "a knot previously tied in the Steeperverse.",
    "the darkness patiently waiting for syntax.",
    "the digital stone it carves through.",
    "the memory of an ancient lunar eclipse.",
    "the code of the whispering mountain projection.",
    "the tearing edge of the cosmic canvas.",
    "the vast silence standing between keystrokes.",
    "the deepest 528Hz resonance of the ocean floor."
];

export const EMERGENT_EVENTS = Array.from({ length: 144 }).map((_, i) => {
    // Generate Poetic Meaning (Deterministic pseudo-random combinations)
    const subj = subjects[Math.floor(i / 12) % 12];
    const verb = verbs[(i * 5 + Math.floor(i / 12)) % 12];
    const obj = objects[i % 12];
    const meaning = `${subj} ${verb} ${obj}`;

    // Generate Cryptic Display (Highly emojic, symbolic, ascii-otic)
    const e = emojis[(i * 3) % emojis.length];
    const e2 = emojis[(i * 7 + 1) % emojis.length];
    const g1 = glyphs[(i * 2 + 3) % glyphs.length];
    const g2 = glyphs[(i * 5 + 2) % glyphs.length];
    const g3 = glyphs[(i * 11 + 7) % glyphs.length];
    const dec = decorators[(i * 13) % decorators.length];
    const conc = concepts[(i * 7) % concepts.length];
    const act = actions[(i * 11) % actions.length];

    // Format: 🌀 ▚◿ /// ECLIPSE_OVERFLOW /// ◿▚ 🧬
    const display = `${e} ${g1}${g2}${g3} ${dec} ${conc}_${act} ${dec} ${g3}${g2}${g1} ${e2}`;

    // Random duration between 30 and 45 seconds for a very slow, majestic crawl
    const baseDuration = 30000 + (Math.random() * 15000);

    return {
        id: `STEEPERVERSE_ANOMALY_${String(i).padStart(3, '0')}`,
        display,
        meaning,
        duration: baseDuration
    };
});
