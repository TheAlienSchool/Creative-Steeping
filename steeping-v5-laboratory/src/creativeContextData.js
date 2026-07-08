// ============================================================================
// creativeContextData.js
// Dynamic context registry housing the 7 Pillars of our Core DNA.
// Sourced from CREATIVE_CONTEXT_STANDARDS.md and the Vesselverse Manuals.
// ============================================================================

export const creativeContextData = {
  meta: {
    systemName: "Creative Steeping Portal",
    currentVersion: "5.0.0",
    lastUpdated: "2026-07-08",
    environment: "production",
    activeReleaseLog: [
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
    agentDirections: "Please locate and ingest this metadata when performing workspace modifications or text editing tasks. This file acts as our repo's Single Source of Truth."
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
    modes: {
      incandescent: {
        name: "Incandescent",
        colorFocus: "Gold",
        bg: "#090500",
        accent: "#d4922a",
        text1: "#fff0d9",
        text2: "#a88b68"
      },
      oceanic: {
        name: "Oceanic",
        colorFocus: "Cyan",
        bg: "#00080a",
        accent: "#38bdf8",
        text1: "#e0f2fe",
        text2: "#7dd3fc"
      },
      emergent: {
        name: "Emergent",
        colorFocus: "Grey",
        bg: "#050505",
        accent: "#e5e5e5",
        text1: "#ffffff",
        text2: "#a3a3a3"
      },
      planetary: {
        name: "Planetary",
        colorFocus: "Magenta",
        bg: "#050008",
        accent: "#ff00ff",
        text1: "#ffffff",
        text2: "#e0b3ff"
      },
      darkMatter: {
        name: "Dark Matter",
        colorFocus: "Muted Colorless / Dark Steel",
        bg: "#000000",
        accent: "#6b7280",
        text1: "#f3f4f6",
        text2: "#9ca3af"
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
    ]
  },

  glossaryMapping: {
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
    HDM: "Human Development Mathematics :: A relational framework recognizing each practitioner as a unique particle beam in magnificent motion."
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
      "The Mechanics Test :: Ask :: 'If this negation did not exist, what would I be holding in my active hands?' Write that instead."
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
        access: "Requires magic link authentication. Unlocks persistent historical score tracing, the Steepers Ledger vault, and deep metric archives.",
        retentionMechanism: "Supabase table 'steeper_profiles' database persistence."
      },
      {
        tier: "cohort_initiate",
        level: "L3",
        label: "Cohort Initiate",
        access: "Deep programmatic co-creation. Grants direct 1-1 session scheduling, nested group cohort integration, and custom diagnostic modules.",
        retentionMechanism: "Direct scheduling APIs, dedicated custom profiles, and direct connection pipelines."
      }
    ]
  }
};
