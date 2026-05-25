/**
 * BUILD-CODEX
 *
 * Reads all markdown documentation in the Creative Steeping repository,
 * chunks it into retrievable fragments, computes TF-IDF term weights
 * and steep affinity scores, then writes a static JSON codex to public/.
 *
 * Run: node scripts/build-codex.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, relative, extname, basename, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = import.meta.dirname ?? dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..");
const OUTPUT = join(__dirname, "..", "public", "codex.json");

// Directories to skip entirely
const SKIP_DIRS = new Set([
  "node_modules", ".git", ".next", "dist", "chrome", "For Amtrak",
  "supabase", "scripts", ".claude", "TheBackstory", "docs",
]);

// Only index these extensions
const INDEX_EXTENSIONS = new Set([".md"]);

// Skip files that are clearly not content
const SKIP_FILES = new Set([
  "README.md", "CHANGELOG.md", "LICENSE.md", "CLAUDE.md",
]);

// Internal/strategy docs that should NOT surface to practitioners.
// The Primer calls this anti-pattern "Internal Architecture Exposure."
const EXCLUDE_FILES = new Set([
  "creative_steeping_pricing_forecast.md",
  "creative_steeping_mvp_strategy_shifts.md",
  "creative_steeping_strategy_v2.md",
  "creative_steeping_strategy_enhanced.md",
  "creative_steeping_timeline.md",
  "QWP_Team_Structure.md",
  "QWP_Quality_Assurance_Department.md",
  "beacons_creative_steeping_page_recommendations.md",
  "Technical Recommendations for The Steeping Space.md",
  "Technical Specification_ Threshold Commerce Architecture.md",
  "CREÅTIVE STEEPING — UI Implementation Guide & Fixes.md",
  "Hierarchical Review & Addendums_ CREÅTIVE STEEPING Master Portal Brief V1.md",
  "BRIEF_TO_BUILD_ASSESSMENT.md",
  "STEEPERVERSE_GO_LIVE_ROADMAP.md",
  "google_calendar_deployment_guide.md",
  "ENHANCEMENT_ROADMAP.md",
  "IMPLEMENTATION_COMPLETE.md",
  "PHASE_1_COMPLETE.md",
  "ENVIRONMENTAL_OVERHAUL_PLAN.md",
  "ENVIRONMENTAL_OVERHAUL_COMPLETE.md",
  "NOVEL_TOOLS_ASSESSMENT.md",
  "AGENTIC_ADVISOR_METHOD.md",
  "ADVISOR_REPORT_JESKO_JETS.md",
  "DIRECTION_C_SUMMARY.md",
  "ROADMAP_PHASE_05.md",
  "ROADMAP_PHASE_06.md",
  "ROADMAP_PHASE_07.md",
  "SAGE-PROMPTS-v2.md",
  "SONNET_ENGINE_CARTRIDGE.md",
  "PING_CARTRIDGE.md",
  "AUDIO_ARCHITECTURE_ROADMAP.md",
  "PHASE_07_SPATIAL_RESONANCE.md",
  "research_notes.md",
  "THE_SUCCESSION_BRIEF.md",
  "VESSELVERSE_EDITORIAL_PROTOCOL.md",
  "VESSELVERSE_EDITORIAL_PROTOCOL3.1.md",
  "VESSELVERSE SESSION PRIMER",
  "The Steeperverse_ UI_UX Styleguide & Mythology (1).md",
  "SANCTUARY_VISION.md",
  "EXPERIENTIAL_GUIDEBOOK.md",
  "DM-RR_Design_Guidebook_Notes.md",
  "CONTEMPLATIVE_ADVISOR.md",
  "SITE_COPY_DOCUMENT.md",
  "Welcome to Creative Steeping.md",
]);

// --- Steep vocabulary for affinity scoring ---
const STEEP_VOCABULARY = {
  essence: [
    "arrival", "presence", "being", "identity", "who", "exist", "appear",
    "threshold", "enter", "begin", "origin", "core", "self", "aware",
    "first", "birth", "emerge", "recognize", "authenticity", "observe",
  ],
  mosaic: [
    "fragment", "piece", "gather", "collect", "mosaic", "pattern",
    "scatter", "assemble", "explore", "diverse", "multitude", "variety",
    "combination", "texture", "weave", "thread", "tapestry", "layer",
    "dimension", "composite", "arrange",
  ],
  summits: [
    "rise", "summit", "peak", "flow", "ascend", "elevate", "climb",
    "momentum", "velocity", "current", "expression", "voice", "surge",
    "crescendo", "ambition", "aspire", "courage", "bold", "dare",
    "unveil", "arrow", "archer", "incisive",
  ],
  mirror: [
    "mirror", "reflect", "still", "stillness", "quiet", "silence",
    "pause", "contemplate", "observe", "water", "surface", "depth",
    "clarity", "recognition", "see", "gaze", "witness", "meditation",
    "monk", "patience", "listen", "ocean", "oceanic",
  ],
  labyrinth: [
    "labyrinth", "maze", "winding", "complex", "deep", "interior",
    "navigate", "journey", "path", "explore", "thorough", "architect",
    "structure", "geometry", "dimension", "arc", "curve", "spiral",
    "intricate", "dense", "rich", "discover",
  ],
  conclave: [
    "converge", "conclave", "gather", "community", "return", "reunion",
    "collective", "together", "integrate", "synthesize", "commune",
    "collaborate", "collabination", "connect", "bridge", "relationship",
    "chord", "harmony", "resonance", "dialogue",
  ],
  crown: [
    "crown", "jewel", "crystal", "crystallize", "illuminate", "radiant",
    "gold", "alchemist", "alchemy", "transmute", "transform", "mastery",
    "wisdom", "clarity", "revelation", "essence", "offering", "complete",
    "sovereignty", "luminous", "incandescent",
  ],
};

// --- Theme vocabulary ---
const THEME_VOCABULARY = {
  steeping: ["steep", "steeping", "steepee", "steeperverse", "infuse", "infusion", "brew", "tea", "cup", "vessel", "leaf", "leaves", "pot"],
  resonance: ["resonance", "resonant", "frequency", "vibration", "harmonic", "signal", "ping", "echo", "neutrino", "wave"],
  time: ["time", "patience", "procrastination", "pause", "breath", "duration", "interval", "rhythm", "tempo", "cadence", "wait"],
  alchemy: ["alchemy", "alchemist", "transmute", "transform", "gold", "incandescent", "biophoton", "superradiance", "light", "fire"],
  navigation: ["navigate", "wayfinding", "compass", "map", "territory", "coordinate", "horizon", "direction", "arc", "angle"],
  cosmos: ["cosmos", "universe", "star", "constellation", "galaxy", "nebula", "planet", "celestial", "cosmic", "steeperverse"],
  body: ["body", "somatic", "physical", "breath", "sensation", "temperature", "embodiment", "tactile", "muscle", "bone"],
  sound: ["sound", "music", "sonnet", "chord", "note", "tone", "melody", "harmony", "instrument", "acoustic", "sonic"],
  surface_tension: ["surface", "tension", "boundary", "threshold", "edge", "limit", "resistance", "membrane", "barrier", "interface"],
};

// --- Helpers ---

function walkDir(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walkDir(full, files);
    } else if (INDEX_EXTENSIONS.has(extname(entry).toLowerCase())) {
      const name = basename(entry);
      if (!SKIP_FILES.has(name) && !EXCLUDE_FILES.has(name)) {
        files.push(full);
      }
    }
  }
  return files;
}

function findExtensionlessContent(dir) {
  const results = [];
  try {
    for (const entry of readdirSync(dir)) {
      if (SKIP_DIRS.has(entry)) continue;
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isFile() && !extname(entry)) {
        try {
          const content = readFileSync(full, "utf-8");
          if (content.startsWith("#") || content.includes("\n## ")) {
            results.push(full);
          }
        } catch { /* skip */ }
      }
    }
  } catch { /* directory may not exist */ }
  return results;
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 2);
}

function computeTermFrequency(tokens) {
  const tf = {};
  for (const t of tokens) {
    tf[t] = (tf[t] || 0) + 1;
  }
  const max = Math.max(...Object.values(tf), 1);
  for (const t in tf) {
    tf[t] = tf[t] / max;
  }
  return tf;
}

function chunkMarkdown(content, source) {
  const lines = content.split("\n");
  const chunks = [];
  let currentSection = basename(source).replace(/\.md$/, "");
  let currentText = [];

  function flush() {
    const text = currentText.join("\n").trim();
    if (text.length > 40) {
      chunks.push({ section: currentSection, text });
    }
    currentText = [];
  }

  for (const line of lines) {
    const headingMatch = line.match(/^#{1,4}\s+(.+)/);
    if (headingMatch) {
      flush();
      currentSection = headingMatch[1]
        .replace(/[*_`]/g, "")
        .replace(/\[.*?\]\(.*?\)/g, "")
        .trim();
    } else {
      currentText.push(line);
    }
  }
  flush();

  const MAX_CHUNK_LENGTH = 600;
  const refined = [];
  for (const chunk of chunks) {
    if (chunk.text.length <= MAX_CHUNK_LENGTH) {
      refined.push(chunk);
    } else {
      const paragraphs = chunk.text.split(/\n\n+/);
      let acc = [];
      let accLen = 0;
      for (const p of paragraphs) {
        if (accLen + p.length > MAX_CHUNK_LENGTH && acc.length > 0) {
          refined.push({ section: chunk.section, text: acc.join("\n\n") });
          acc = [];
          accLen = 0;
        }
        acc.push(p);
        accLen += p.length;
      }
      if (acc.length > 0) {
        refined.push({ section: chunk.section, text: acc.join("\n\n") });
      }
    }
  }

  return refined;
}

function computeSteepAffinity(tokens) {
  const affinity = {};
  const tokenSet = new Set(tokens);

  for (const [steep, vocab] of Object.entries(STEEP_VOCABULARY)) {
    let score = 0;
    for (const term of vocab) {
      if (tokenSet.has(term)) {
        score += tokens.filter(t => t === term).length;
      }
    }
    if (score > 0) {
      affinity[steep] = Math.min(score / 10, 1);
    }
  }
  return affinity;
}

function detectThemes(tokens) {
  const tokenSet = new Set(tokens);
  const themes = [];
  for (const [theme, vocab] of Object.entries(THEME_VOCABULARY)) {
    let hits = 0;
    for (const term of vocab) {
      if (tokenSet.has(term)) hits++;
    }
    if (hits >= 2) themes.push(theme);
  }
  return themes;
}

// --- Main ---

console.log("Building Codex...");
console.log(`Repository root: ${REPO_ROOT}`);

const mdFiles = walkDir(REPO_ROOT);
const primerFiles = [
  ...findExtensionlessContent(REPO_ROOT),
  ...findExtensionlessContent(join(REPO_ROOT, "steeperverse_delivery")),
];
const allFiles = [...new Set([...mdFiles, ...primerFiles])];

console.log(`Found ${allFiles.length} documents to index`);

const allFragments = [];
let docCount = 0;

for (const filePath of allFiles) {
  try {
    const content = readFileSync(filePath, "utf-8");
    if (content.length < 50) continue;

    const source = relative(REPO_ROOT, filePath).replace(/\\/g, "/");
    const chunks = chunkMarkdown(content, source);

    for (let i = 0; i < chunks.length; i++) {
      const { section, text } = chunks[i];
      const tokens = tokenize(text);
      if (tokens.length < 5) continue;

      allFragments.push({
        id: `${source}::${i}`,
        source,
        section,
        text,
        terms: computeTermFrequency(tokens),
        steepAffinity: computeSteepAffinity(tokens),
        themes: detectThemes(tokens),
      });
    }
    docCount++;
  } catch (err) {
    console.warn(`  Skipping ${filePath}: ${err.message}`);
  }
}

// Compute IDF across all fragments
const docFrequency = {};
for (const frag of allFragments) {
  const seen = new Set(Object.keys(frag.terms));
  for (const term of seen) {
    docFrequency[term] = (docFrequency[term] || 0) + 1;
  }
}

const idfFull = {};
const N = allFragments.length;
for (const [term, df] of Object.entries(docFrequency)) {
  idfFull[term] = Math.log(N / (1 + df));
}

// Trim: keep only top 20 terms per fragment (by TF-IDF weight)
const usedTerms = new Set();
for (const frag of allFragments) {
  const scored = Object.entries(frag.terms)
    .map(([t, tf]) => [t, tf * (idfFull[t] ?? 1)])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);
  const trimmed = {};
  for (const [t, _] of scored) {
    trimmed[t] = frag.terms[t];
    usedTerms.add(t);
  }
  frag.terms = trimmed;
}

// Only include IDF entries for terms that survived trimming
const idf = {};
for (const term of usedTerms) {
  idf[term] = idfFull[term];
}

const codex = {
  version: 1,
  builtAt: new Date().toISOString(),
  fragmentCount: allFragments.length,
  documentCount: docCount,
  idf,
  fragments: allFragments,
};

writeFileSync(OUTPUT, JSON.stringify(codex));

const sizeKB = (Buffer.byteLength(JSON.stringify(codex)) / 1024).toFixed(1);
console.log(`\nCodex built:`);
console.log(`  Documents: ${docCount}`);
console.log(`  Fragments: ${allFragments.length}`);
console.log(`  Terms in IDF index: ${Object.keys(idf).length}`);
console.log(`  Output: ${OUTPUT} (${sizeKB} KB)`);
