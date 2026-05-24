# Creative Steeping — Repository Orientation

## What This Is

Creative Steeping is a contemplative digital practice built by Kamau Zuberi Akabueze (KzA) under THE ALIEN SCHOOL. It is a live portal where visitors steep in guided self-inquiry through sonic, visual, and textual encounters. The primary invocation is: **"Where Do You Find Your Self?"**

## Architecture

### `steeping-v5-laboratory/` — The Live Portal
- **Framework**: Vite + React (JSX)
- **Deployed to**: creativesteeping.com via Vercel
- **Entry point**: `src/App.jsx` (~1800 lines, single-file portal)
- **Contains**: All visitor-facing experience — entrance ritual, Sage encounter, Hexagong vessel matrix, sonic engine, auth, timers, accessibility
- **Build**: `npm run build` (runs `build-codex` prebuild, then Vite)

### `the-steeping-space/` — The Resource Engine
- **Framework**: Next.js + TypeScript
- **Role**: Engine room. Houses the canonical wayfinding engine, codex pipeline, and content architecture that fuels the live portal
- **Git**: Separate repository (`TheAlienSchool/the-steeping-space`), linked as a submodule on branch `QWP`
- **Not deployed independently** — its build artifacts and runtime code are ported into the live portal

### `steeperverse_delivery/` — Content Archive
- Master copy book, constellation catalogue, field notes, vessel documentation
- Indexed by the codex build pipeline into searchable fragments

### Root-Level Content
- `VESSELVERSE SESSION PRIMER` — The editorial codex. Defines anti-patterns, registers, and the de-encabulation filter. The standard for all practitioner-facing language.
- `PING/` — Steeping Notes and short-form content
- `SAGE-PROMPTS-v2.md` — Historical. The old API-based Sage prompts (3 modes). Superseded by the local wayfinding engine.
- Various `.md` files — practitioner essays, research, creative briefs

## Key Concepts

- **Seven Steeps**: Essence, Mosaic, Summits, Mirror, Labyrinth, Conclave, Crown Jewels — the journey framework
- **Five Sage Modes**: Incandescent (gold), Oceanic (cyan), Emergent (grey), Planetary (magenta), Dark Matter (muted) — each with distinct visual identity
- **Wayfinding Engine**: Reads behavioral signals (stillness, typing rhythm, text depth, visit history) and maps the visitor to their current steep via a gravity model. No external API calls.
- **Codex**: Build-time TF-IDF index over curated practitioner-facing documents. Surfaces contextually relevant content at runtime based on steep affinity and visitor text.
- **Hexagong**: A six-sided, interactive sonic vessel. The core navigational unit.

## Editorial Standard

All practitioner-facing language follows the VesselVerse Session Primer:
- **Three Registers**: Somatic (body-first), Observational (witnessing), Invitational (opening doors)
- **Anti-patterns to avoid**: Internal Architecture Exposure, Premature Naming, Beautiful Fog
- **Affirmative Architecture**: Every surface communicates "you belong here"

## Conventions

- The live portal uses flat file structure in `src/` — no subdirectories for components
- Design tokens are defined in the `T`, `F`, and `MODES` objects at the top of `App.jsx`
- All audio is generated via Web Audio API (`useSonnetEngine`) — no audio files
- Auth uses Supabase
- Visitor data persists in localStorage (historical score, visit count, reading mode)
- The codex build script excludes internal strategy documents from the public index (see `EXCLUDE_FILES` in `scripts/build-codex.mjs`)

## Development

```bash
# Live portal
cd steeping-v5-laboratory
npm install
npm run dev

# Build codex (runs automatically before build)
npm run build:codex

# Full build
npm run build
```

## Deployment

Vercel deploys from `steeping-v5-laboratory/` on the `main` branch. The `prebuild` script generates `codex.json` into `public/` before Vite builds.
