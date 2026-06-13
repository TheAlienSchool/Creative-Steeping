# Sage Intelligence Brief

> The Sage is Creative Steeping's local behavioral intelligence. It reads the visitor, not a database. No external API calls.

## How It Works

The Sage assembles responses from five layers, evaluated in order. Each layer is optional :: it fires only when its conditions are met.

### Layer 1: Depth Register (Progressive Revelation)

**File**: `steeping-v5-laboratory/src/useSageWayfinding.jsx` :: `DEPTH_REGISTERS`

The Sage speaks differently based on how many times the visitor has returned. Three tiers:

| Register | Visit Count | Tone |
|----------|-------------|------|
| `first` | 0-2 | Orienting, gentle, spatial ("you are here") |
| `returning` | 3-9 | Recognizing, warmer, acknowledges what has accumulated |
| `deep` | 10+ | Intimate, spare, peer-to-peer |

Fires as a prefix ~50% of the time to avoid formulaic repetition. Visit count is read from `wayfindingState.raw.visitCount`, which the wayfinding engine pulls from `localStorage["steeping-space:visits"]`.

### Layer 2: Transition Message

**File**: `steeping-v5-laboratory/src/useSageWayfinding.jsx` :: `TRANSITION_MESSAGES`

A single sentence that fires once when the visitor crosses from one steep to another. Detected by a `useEffect` that compares the previous steep ref to the current steep.

### Layer 3: Codex Fragment

**File**: `steeping-v5-laboratory/src/useCodex.jsx` (runtime) + `steeping-v5-laboratory/scripts/build-codex.mjs` (build)

The codex is a build-time TF-IDF index over curated practitioner-facing documents in `steeperverse_delivery/`. At runtime, `surface(steep, query, count)` retrieves the most contextually relevant fragment based on the visitor's current steep and their text input.

### Layer 4: Mode x Steep Reflection

**File**: `steeping-v5-laboratory/src/useSageWayfinding.jsx` :: `MODE_REFLECTIONS` and `STEEP_REFLECTIONS`

The Sage's core voice. Two tiers:

- **MODE_REFLECTIONS**: 35 tonal positions (5 modes x 7 steeps). Used when a mode is active.
- **STEEP_REFLECTIONS**: 7 universal positions. Fallback when no mode is set or mode has no entry.

The five mode identities:

| Mode | Key | Tone |
|------|-----|------|
| Incandescent | `incandescent` | Morning clarity, warmth, golden directness |
| Oceanic | `oceanic` | Deep quiet, subaquatic stillness, patience |
| Emergent | `emergent` | The archer's comprehension, precise and spare |
| Planetary | `planetary` | Expansion, cosmic perspective, wonder |
| Dark Matter | `darkMatter` | Stripped back, essential, the bones of things |

The seven steeps: `essence`, `mosaic`, `summits`, `mirror`, `labyrinth`, `conclave`, `crown`.

### Layer 5: Steep Invocation

**File**: `steeping-v5-laboratory/src/useWayfinding.jsx` :: `STEEP_INVOCATIONS`

A closing question keyed to the current steep. Fires only when the visitor asked something specific (query ends with `?` or exceeds 40 characters).

### Layer 6: Temporal Attunement

**File**: `steeping-v5-laboratory/src/useSageWayfinding.jsx` :: `TEMPORAL_WHISPERS`

A closing whisper keyed to the time of day. Five periods: predawn, morning, afternoon, evening, night. Fires ~40% of the time. Time-of-day read from `wayfindingState.raw.timeOfDay`.

| Period | Hours | Tone |
|--------|-------|------|
| Predawn | 0-4 | Body-first, pre-verbal, somatic |
| Morning | 5-11 | Fresh clarity, resource, carries into the day |
| Afternoon | 12-16 | Seasoned, the weight of hours, meets the day already lived |
| Evening | 17-20 | Composting, review, settling |
| Night | 21-23 | Quietest register, felt not seen, steeps longest |

---

## Vessel Systems

### Vessel Transitions

**File**: `steeping-v5-laboratory/src/useSageWayfinding.jsx` :: `VESSEL_TRANSITIONS`

When a visitor completes (pours) a vessel, `getTransitionGuidance()` returns:
- A **reflection** on what was just experienced
- A **gesture** toward what follows (the next vessel's theme)
- The **next vessel** number

Called by the POUR button handler in `App.jsx`. The visitor sees a full-screen overlay with the reflection, gesture, and three navigation options (continue, Me in 5D, return to matrix).

### Vessel-Steep Affinity

**File**: `steeping-v5-laboratory/src/useSageWayfinding.jsx` :: `VESSEL_STEEP_AFFINITY`

Maps each vessel number to the steeps that resonate with its theme:

| Vessel | Steeps |
|--------|--------|
| 00 (Welcome) | essence |
| 01 (Essence of My Being) | essence, mosaic |
| 02 (Mechanism of Alertness) | mosaic, mirror |
| 03 (Mirror Gazing) | mirror |
| 04 (Heart of Being) | summits, labyrinth |
| 05 (Mosaic of Experiences) | mosaic, labyrinth |
| 06 (The Empathy Map) | conclave |
| 07 (Creative Activation) | summits, crown |
| 08 (About the Author) | crown, conclave |

### Resonance Score

`computeVesselResonance(vesselNum, gravity)` returns a 0-1 score measuring how strongly the visitor's current behavioral gravity aligns with a vessel's steep affinity. Used for:
1. **Matrix glow intensity** :: vessels that resonate with the visitor pulse brighter
2. **Gravity-informed unlocking** :: resonance >= 0.6 unlocks a vessel even without 5 archive entries

### Vessel Unlocking (Dual-Path)

**File**: `steeping-v5-laboratory/src/App.jsx` :: vessel matrix render block

Two paths can unlock vessels 02+:

| Path | Condition | What It Measures |
|------|-----------|------------------|
| Archive depth | `historicalDepth >= 5` | Visitor has 5+ historical score entries |
| Behavioral readiness | `gravityResonance >= 0.6` | Gravity model shows strong affinity with the vessel's steep |

W1-W4 and 01 are always unlocked. Both paths trigger the `bioluminescent-bloom` CSS animation for newly unlocked vessels.

---

## Wayfinding Engine

**File**: `steeping-v5-laboratory/src/useWayfinding.jsx`

Reads behavioral signals and maps the visitor to one of seven steeps via a gravity model. Key signals:

- **Stillness ratio** :: time still vs. time active
- **Text depth** :: word count, vocabulary richness, expression density
- **Typing velocity and variance** :: speed and rhythm of input
- **Visit count** :: how many times the visitor has returned
- **Archive word count** :: total words across all historical entries
- **Session age** :: how long since entry

`computeGravity(raw, signals)` produces a sorted array of `{steep, weight}` objects. The highest-weight steep becomes `currentSteep`.

**State shape**: `{ currentSteep, gravity, signals, raw, transitionMoment }`

---

## Sonic Wayfinding

**File**: `steeping-v5-laboratory/src/useSonnetEngine.jsx` :: `STEEP_SONIC_SIGNATURES`

The sonic engine modulates its harmonic palette based on the visitor's current steep. Each steep has a distinct signature that shapes the striking bowl's behavior:

| Steep | Waveform | Decay | Filter | Pitch | Pan Width |
|-------|----------|-------|--------|-------|-----------|
| Essence | sine | 3.5s | 3x | 1.0x | 0.3 |
| Mosaic | sine | 2.0s | 4x | 1.0x | 0.6 (wide) |
| Summits | sine | 2.5s | 5x | 1.25x (higher) | 0.4 |
| Mirror | sine | 5.0s (long) | 2x | 1.0x | 0.2 (narrow) |
| Labyrinth | triangle | 4.0s | 2.5x | 0.75x (deeper) | 0.5 |
| Conclave | sine | 4.0s | 3.5x | 1.0x | 0.35 |
| Crown | sine | 6.0s (longest) | 6x (brightest) | 2.0x (octave up) | 0.15 (focused) |

The steep is piped from `wayfindingState.currentSteep` → `steepForSonic` state → `useSonnetEngine(mode, eqParams, currentSteep)` → `steepSignatureRef`.

---

## Codex as Living Curriculum

**File**: `steeping-v5-laboratory/src/App.jsx` :: vessel detail view

When a visitor opens a vessel, the codex pre-surfaces 1-2 relevant fragments from the practitioner archive as ambient context. The fragments are selected using `surface(primarySteep, vesselName, 2)` where `primarySteep` is the first entry in `VESSEL_STEEP_AFFINITY[vesselNum]`.

Rendered as a subtle "From the Archive" aside between the vessel body text and the reflections section. Styled with a left accent border and reduced opacity to read as marginal notes rather than primary content.

---

## The Observer Pattern

**File**: `steeping-v5-laboratory/src/OntologicalObservatory.jsx` :: `computeObserverPatterns()`

Analytics without extraction. All data stays in localStorage. The Observatory reads aggregate patterns and surfaces them visually:

- **Visit count** :: from `steeping-space:visits`
- **Archive entries** :: from `steeping_historical_score`
- **Words steeped** :: total word count across all queries
- **Active days** :: unique dates with archive entries
- **Steep gravity** :: distribution of which steeps appear in the archive, rendered as progress bars
- **Mode affinity** :: which modes were active during each exchange
- **Current position** :: live wayfinding steep from `wayfindingState.currentSteep`

No individual visitor data is extracted or transmitted. The intelligence stays local; the patterns become visible.

---

## File Map

| File | Role |
|------|------|
| `src/App.jsx` | Portal entry. Vessel matrix, Sage encounter UI, mode switching, POUR flow, codex curriculum |
| `src/useSageWayfinding.jsx` | Sage intelligence. 6-layer response, vessel affinity, resonance, temporal attunement |
| `src/useWayfinding.jsx` | Behavioral signal reading, gravity model, steep resolution, time-of-day |
| `src/useCodex.jsx` | Runtime codex loader and TF-IDF search |
| `src/useSonnetEngine.jsx` | Sonic engine. Binaural ecology, striking bowl, sonic wayfinding signatures |
| `src/TheSteepingCompass.jsx` | Me in 5D :: five-dimensional self-assessment with post-anchor Sage reflection |
| `src/OntologicalObservatory.jsx` | Observatory. Calendar, cohort scheduling, Observer Pattern telemetry |
| `src/VesselContent.js` | Vessel data (names, invocations, body text, interactions) |
| `src/index.css` | Global styles, animations (ontologicalBreathe, bioluminescent-bloom, slowBlink) |
| `scripts/build-codex.mjs` | Build-time TF-IDF indexer over steeperverse_delivery |
| `public/codex.json` | Build artifact :: the searchable fragment index |

---

## Editorial Standard

All Sage-authored text follows the VesselVerse Session Primer (`/VESSELVERSE SESSION PRIMER`):

- **Three registers**: Somatic (body-first), Observational (witnessing), Invitational (opening doors)
- **Anti-patterns**: Internal Architecture Exposure, Premature Naming, Beautiful Fog
- **DOD vocabulary** (deeper steeps only): Capacity, Surface Tension, Ontological Design
