// ============================================================================
// creativeContextData.js
// Dynamic context registry housing the 7 Pillars of our Core DNA.
// Sourced from CREATIVE_CONTEXT_STANDARDS.md and the Vesselverse Manuals.
//
// Enriched 2026-09-07 against a sibling project's creative-context (The Stone
// Forger's Way) as a thoroughness benchmark, and against this repo's own
// shipped state — several fields below had drifted from what's actually live;
// this pass re-grounds them rather than just adding volume.
// ============================================================================

export const creativeContextData = {
  meta: {
    systemName: "Creative Steeping Portal",
    currentVersion: "5.1.0",
    lastUpdated: "2026-09-07",
    environment: "production",
    activeReleaseLog: [
      {
        version: "5.1.0",
        date: "2026-09-07",
        highlights: [
          "Shipped Orient Me — a two-tier orientation system: an auto-opening, deck-position-aware overlay (WayfindingOverlay.jsx) plus hover-glossary terms (OrientationTerm.jsx / OrientationGlossary.js) across the nav and vessel views",
          "Elevated Orient Me's ten diagrams from wireframe geometry to gradient/glow generative art, fixed dead 'pulse'/'spin' CSS keyframes that had been no-ops since the file was written, added a cinematic 'Welcome to Creative Steeping' opening frame",
          "Gave the five visual Modes a sonic soul in Orient Me: deck position maps onto the Sage Essayist composer's own flowPhase vocabulary (kindling → opening → current → depth → crystallizing), coloring the shared ambient drone as the visitor pages deeper in",
          "Sage as Point Guard: askSage() now actually reads what a visitor types (src/SageSiteKnowledge.js) before falling into its prior behavioral-signal-only response pool — the first time Sage's response has ever related to the words asked of it, not just the pacing they were typed with",
          "Corrected the in-app Privacy Policy to disclose the Hexagong 'Your Architecture' field's Supabase sync (previously claimed nothing left the device, which wasn't true for that one field)",
          "Confirmed and documented: no external AI pathway exists anywhere in the shipped app — useSageIntelligence.jsx (claimed 'done' in steeperverse_delivery/BRIEF_TO_BUILD_ASSESSMENT.md) does not exist as a file; Sage is, and remains, fully local"
        ]
      },
      {
        version: "5.0.0",
        date: "2026-04-12",
        highlights: [
          "Integrated local wayfinding engine bypassing external APIs",
          "Engineered Web Audio API-driven Sonnet Engine",
          "Scaffolded Supabase authenticated staterooms with Tier-gated access rights",
          "Implemented local TF-IDF builder mapping curate-on-the-fly editorial fragments in real-time"
        ]
      },
      {
        version: "4.0.0",
        date: "2025-10-15",
        highlights: [
          "Deployed responsive interactive matrices within the Hexagong compass",
          "Hardened spatial visual sound system parameters",
          "Constructed client-side local storage vaulting for personal reflection metrics"
        ]
      },
      {
        version: "1.0.0",
        date: "2024-03-01",
        highlights: [
          "Initialized original vessel structures and basic sonic strikes",
          "Codified original Vesselverse session primer guidelines"
        ]
      }
    ],
    agentDirections: "Please locate and ingest this metadata when performing workspace modifications or text editing tasks. This file acts as our repo's Single Source of Truth. Where this file and a ROADMAP_PHASE_*.md document disagree about what's actually built, trust this file and the running code — the roadmaps describe intent at the time they were written, some of which (the multi-API useSageIntelligence engine, in particular) was never built as described. Verify against source before asserting a roadmap claim is true."
  },

  pagesIndex: {
    sitemap: [
      {
        route: "/",
        label: "The Living Portal",
        purpose: "The main contemplative space where visitors steep in guided self-inquiry, interact with Hexagong vessels, and encounter Sage wayfinding intelligence.",
        gated: false
      },
      {
        route: "/about",
        label: "About Creative Steeping",
        purpose: "A standalone background portal honoring the lineage of THE ÅLIËN SCÖÕL, referencing Kamau Zuberi Akabueze (KzA) creative practices.",
        gated: false
      },
      {
        route: "/engage",
        label: "Program Details & Tiers",
        purpose: "The onboarding doorway mapping structural progress pathways, cohort session details, and leveling coordinates.",
        gated: false
      },
      {
        route: "/creative-context",
        label: "The Creative Context Room",
        purpose: "An agentic workspace and open mirror of the repository. Provides real-time project DNA, tone structures, sitemaps, and downloadable configurations for AI integrations.",
        gated: false
      },
      {
        route: "/dashboard",
        label: "The Steeping Space Dashboard",
        purpose: "A Guided Scholar+ view of a practitioner's own archived ledgers, historical score, and account state.",
        gated: true
      },
      {
        route: "/calendar",
        label: "The Steeping Calendar",
        purpose: "The Echolocation Sonar Map — session scheduling and cohort timing.",
        gated: false
      },
      {
        route: "/legacy",
        label: "Legacy Screengrab Portal",
        purpose: "The Social Geometry Generator — a standalone tool for producing shareable images of past reflections.",
        gated: false
      },
      {
        route: "/notes/:id",
        label: "Steeping Notes, deep link",
        purpose: "Opens a specific Steeping Notes issue directly (id must be in the VALID_NOTE_IDS allowlist in App.jsx — arbitrary ids are ignored, not routed).",
        gated: false
      },
      {
        route: "/nightlight",
        label: "Instrument Mode (hidden)",
        purpose: "Not linked from any UI. Auto-opens Hexagong 08 in Instrument Mode, where keystrokes strike the Algorave Synth instead of writing text. Discovered by code archaeology, not documented anywhere else — recorded here specifically so it doesn't need rediscovering.",
        gated: false,
        hidden: true
      }
    ]
  },

  designTokens: {
    typography: {
      serif: "'Playfair Display', serif :: Used for hero banners, headings, and ceremonial callouts.",
      mono: "'DM Mono', monospace :: Used for micro-navs, status metrics, metadata, and systemic indicators.",
      body: "'EB Garamond', serif :: Dedicated to deep reading, reflection prompts, and prose bodies."
    },
    layout: {
      navHeight: "56px",
      tabHeight: "72px",
      easing: "cubic-bezier(0.16, 1, 0.3, 1)"
    },
    // Each mode's full palette (bg/surface/cardBg/accent/glow/text1/text2 — the complete MODES
    // object shape in App.jsx, not the 4-field subset this file previously carried) plus a one-line
    // "soul" — the character each mode carries into Orient Me's ambient sound (useSonnetEngine.jsx's
    // MODE_ESSAYIST_PERSONALITIES table), not just its color.
    modes: {
      incandescent: {
        name: "Incandescent", colorFocus: "Gold",
        bg: "#090500", surface: "#1c1000", cardBg: "#271508", accent: "#d4922a", glow: "rgba(212,146,42,0.16)",
        text1: "#fff0d9", text2: "#a88b68",
        soul: "Warmth held close — firelight, not spotlight. The default a first-time visitor arrives in."
      },
      oceanic: {
        name: "Oceanic", colorFocus: "Cyan",
        bg: "#00080a", surface: "#001a22", cardBg: "#052833", accent: "#38bdf8", glow: "rgba(56,189,248,0.16)",
        text1: "#e0f2fe", text2: "#7dd3fc",
        soul: "Flow and depth — the register that gave this whole practice its water-and-tea-leaf vocabulary."
      },
      emergent: {
        name: "Emergent", colorFocus: "Grey",
        bg: "#050505", surface: "#1a1a1a", cardBg: "#262626", accent: "#e5e5e5", glow: "rgba(229,229,229,0.16)",
        text1: "#ffffff", text2: "#a3a3a3",
        soul: "Clean and unornamented — the register with no metaphor coloring it, closest to plain observation."
      },
      planetary: {
        name: "Planetary", colorFocus: "Magenta",
        bg: "#050008", surface: "#0a0010", cardBg: "#12001c", accent: "#ff00ff", glow: "rgba(255,0,255,0.20)",
        text1: "#ffffff", text2: "#e0b3ff",
        soul: "Expansive and cosmic — the one mode that already changes the musical scale itself (176Hz base), not just the palette."
      },
      darkMatter: {
        name: "Dark Matter", colorFocus: "Muted Colorless / Dark Steel",
        bg: "#000000", surface: "#050505", cardBg: "#0a0a0a", accent: "#6b7280", glow: "rgba(107,114,128,0.05)",
        text1: "#f3f4f6", text2: "#9ca3af",
        soul: "Sparse and quiet — the mode most often left without a bespoke branch in older code; worth checking new mode-aware features against it specifically."
      }
    }
  },

  philosophyModel: {
    physics: "The arc is the angle of change :: Every transformation traces a visible and mathematically precise arc of movement.",
    state: "Å Discovery Worth Steeping In :: Creative discoveries are not consumed instantly; they are steeped in over time, requiring temperature, containment, and systemic letting go.",
    theSevenSteeps: [
      "Essence :: The source level of clean raw reality.",
      "Mosaic :: The fragmented parts coming into relational geometry.",
      "Summits :: The apex moments of clarity and achievement.",
      "Mirror :: The direct reflective gaze confronting oneself.",
      "Labyrinth :: Navigating complex subterranean pathways.",
      "Conclave :: Gathering within nested community rings.",
      "Crown Jewels :: The integrated treasure returned to the baseline world."
    ],
    wayfindingSignals: [
      "Stillness :: Tracked through keyboard and mouse pauses.",
      "Typing Rhythm :: Dynamic density measurement of text.",
      "Depth Index :: Structural analysis of the written reflection.",
      "Visit Count :: Stored locally to calibrate greeting registries."
    ],
    theSageAsPointGuard: "Sage's value is orchestration, not content — the vessels, the essays, the sound are the scoring; Sage's job is knowing where a visitor is, anticipating where they're headed, and delivering the right small thing at the right moment. Its 'assist rate' is how often it successfully orients someone toward what they actually needed next, not how much it says. As of 5.1.0 this is no longer aspirational: askSage() reads the actual query against a local site-knowledge table before falling into its older behavioral-pool responses — the called play now sits alongside the broken-play read it already did.",
    theSageEssayistFlowPhases: [
      "kindling :: the threshold before writing begins",
      "opening :: words beginning to arrive, surface tension releasing",
      "current :: rhythm established, in the flow",
      "depth :: extended engagement, stillness between bursts",
      "crystallizing :: form solidifying, velocity slowing after depth"
    ]
  },

  // Two registers, kept distinct on purpose: the cosmological/HDM vocabulary this file has always
  // carried, and the concrete, currently-shipped UI vocabulary (src/OrientationGlossary.js and
  // src/SageSiteKnowledge.js) that visitors actually hover over or ask Sage about. An agent working
  // on copy needs both — the felt register and the literal one — without confusing which is which.
  glossaryMapping: {
    // -- Cosmological / HDM register --
    TURAO: "The Universe Receiving All Offerings :: The exterior cosmos; the absolute context where every somatic action or creative offering lands.",
    ThePocket: "The direct, felt coordinate of aligned capacity and intentional action. Meeting the present moment cleanly without excess rush.",
    SurfaceTension: "The felt emotional or creative friction that signals expanding capacity. It is the boundary where limitation meets possibility.",
    PING: "The sudden, felt moment of pristine somatic recognition, clarity, and connection. A systemic alignment prompt within our awareness technology.",
    Collabination: "The spontaneous, organic convergence of unique entities generating collaborative intelligence that no single component could manifest on its own.",
    AlgorithmOfA: "The highest structural and existential blueprint of awareness planning; navigating by relational sufficiency.",
    ActionalIntention: "A present-tense orientation mapping where creative consciousness actively meets localized physical experience.",
    Capacity: "The internal dimensional capacity required to hold complex insight, expansion, and stillness concurrently without fracturing.",
    AwarenessPlanning: "The structured mapping of negative space; deciding where we deliberately decide NOT to act in order to potentialize the space.",
    aiContemplation: "Action Intention Contemplation :: A three-phase operational cycle consisting of the Pause, the Pivot, and the final Merge.",
    Steam: "The energetic bridge that connects the internal subjective landscape with the active external universe. The offering that TURAO receives.",
    HDM: "Human Development Mathematics :: A relational framework recognizing each practitioner as a unique particle beam in magnificent motion.",

    // -- Shipped product vocabulary (mirrors OrientationGlossary.js + SageSiteKnowledge.js) --
    Hexagong: "The six-sided vessel at the center of the practice. Nine exist, numbered 00 through 08 — what waits inside one differs entirely from what waits inside another. A separate hidden mode (/nightlight) turns the same object into an instrument.",
    Sage: "The practice's local behavioral intelligence. Reads pacing, visit history, and which Steep a practitioner is in; as of 5.1.0 also reads explicit questions against a local site-knowledge table. Never an external AI, never a database of what anyone has written — see meta.activeReleaseLog above for the explicit confirmation of this.",
    Nomad: "The tier every practitioner starts in — open, ungated, no account required. Held entirely in the visitor's own browser.",
    YourArchitecture: "The writing surface inside each Hexagong, labeled on screen as 'Your Architecture' (never 'scratchpad' in shipped UI, though that word does still appear in the internal state variable name and in one paragraph of the in-app Privacy Policy). Signed in above Nomad, it syncs to Supabase and waits across visits — the one field whose text leaves the visitor's device.",
    Keystroke: "One press of one key. Named specifically in the 'About Your Keystrokes' privacy work because it's the smallest unit of what a practitioner gives the practice, and small units are where a privacy promise either holds or breaks.",
    OrientMe: "The two-tier orientation system: an auto-opening overlay (WayfindingOverlay.jsx, first-time visitors only, reachable any time after via the nav) plus hover-glossary terms across the site. Avoid the word 'wayfinding' in any user-facing label for this feature — useWayfinding.jsx already owns that word internally for the unrelated behavioral-signal engine.",
    MeIn5D: "The Compass — a five-axis biometric reflection (resonance, stillness, clarity, depth, alignment), reachable from the nav. A mirror, not a score.",
    SteepingNotes: "The archive of essays and field notes behind the practice, including The Sound of Becoming. Free to read any time, no vessel required.",
    TheSoundOfBecoming: "A neuroscience essay (and Steeping Notes issue, id sound-of-becoming) on why writing and hearing your own words at once engages more of the body than either alone."
  },

  voiceAndToneRules: {
    toneRegisters: {
      somatic: "Grounded and sensory :: Speaks WITH the practitioner, focusing on temperature, timing, breath, and spatial texture.",
      observational: "Precise and unhurried :: Speaks ABOUT the territory, carrying a physics-meets-poetry clear-eyed authority.",
      invitational: "Welcoming and non-transactional :: Speaks TOWARD the practitioner, gesturing toward the horizon without persuasion."
    },
    semanticRules: [
      "The Double-Colon Pause :: Use '::' to reflect organic pacing, breathing room, and conceptual bridge-building.",
      "Collective Pronouns :: Anchor communication around the collective 'we' and 'our' :: placing AI and practitioner side-by-side as mutual explorers.",
      "The Negative Imagination Filter :: Eliminate 'deficit spending'. Rather than declaring what something behaves as NOT, state the precise affirmative architecture immediately.",
      "The Mechanics Test :: Ask :: 'If this negation did not exist, what would I be holding in my active hands?' Write that instead.",
      "Vertical Economy (added 5.1.0, see steeping-v5-laboratory/CLARITY_BRIDGE_AUDIT_LENS.md) :: Copy must honor the space it's given rather than asking the layout to compensate for it — and the trim must remove excess, never the rhythm (repetition, rule-of-three) or the wayfinding underneath it. A tightening pass that flattens a deliberate repeated structure has cut the wrong thing."
    ],
    fiveKnotTransformations: [
      { knot: "Not", becomes: "Is", before: "This is not a traditional classroom.", after: "This operates as a living field of inquiry." },
      { knot: "Don't", becomes: "Do", before: "We don't rely on outdated metrics.", after: "We navigate by the experiential axis of relational awareness." },
      { knot: "Won't", becomes: "Will", before: "This won't be another theoretical exercise.", after: "This encounter demands immediate, tactile engagement." },
      { knot: "Can't", becomes: "Require", before: "You can't solve this with the old tools.", after: "This threshold requires the cultivation of a new geometry." },
      { knot: "Isn't", becomes: "Functions As", before: "The journey isn't a straight line.", after: "The journey functions as a geometric bloom." }
    ]
  },

  progressionFunnel: {
    accessTiers: [
      {
        tier: "nomad",
        level: "L1",
        label: "Nomad State",
        access: "Open and ungated first-time visitor experience. Allows basic vessel exploration and local wayfinding feedback. This is the default tier for registered scholars.",
        retentionMechanism: "Temporary session caches & initial Supabase profile."
      },
      {
        tier: "guided_scholar",
        level: "L2",
        label: "Guided Scholar",
        access: "Requires magic link authentication. Unlocks persistent historical score tracing, the Steepers Ledger vault, deep metric archives, and Hexagong 'Your Architecture' sync.",
        retentionMechanism: "Supabase table 'steeper_profiles' database persistence."
      },
      {
        tier: "cohort_initiate",
        level: "L3",
        label: "Cohort Initiate",
        access: "Deep programmatic co-creation. Grants direct 1-1 session scheduling, nested group cohort integration, and custom diagnostic modules. Also the boundary for Sage-inquiry visibility: a Circle-enrolled visitor's questions to Sage are logged (membrane_pings, action_type SAGE_INQUIRY, metadata column added 5.1.0) — Nomad and Guided Scholar visitors' questions are not.",
        retentionMechanism: "Direct scheduling APIs, dedicated custom profiles, and direct connection pipelines."
      }
    ],
    onboardingPath: "Orient Me (see glossaryMapping.OrientMe) is the primary first-time-visitor onboarding mechanism as of 5.1.0 — it auto-opens once, is reachable any time after from the nav as [ ORIENT ME ], and is the intended answer to 'how does a new visitor learn what's here' rather than a separate funnel step."
  }
};
