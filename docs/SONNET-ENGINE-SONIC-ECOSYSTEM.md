```
 ████████╗██╗  ██╗███████╗    ███████╗ ██████╗ ███╗   ██╗███╗   ██╗███████╗████████╗
    ██╔══╝██║  ██║██╔════╝    ██╔════╝██╔═══██╗████╗  ██║████╗  ██║██╔════╝╚══██╔══╝
    ██║   ███████║█████╗      ███████╗██║   ██║██╔██╗ ██║██╔██╗ ██║█████╗     ██║
    ██║   ██╔══██║██╔══╝      ╚════██║██║   ██║██║╚██╗██║██║╚██╗██║██╔══╝     ██║
    ██║   ██║  ██║███████╗    ███████║╚██████╔╝██║ ╚████║██║ ╚████║███████╗   ██║
    ╚═╝   ╚═╝  ╚═╝╚══════╝    ╚══════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═══╝╚══════╝   ╚═╝

 ███████╗███╗   ██╗ ██████╗ ██╗███╗   ██╗███████╗
 ██╔════╝████╗  ██║██╔════╝ ██║████╗  ██║██╔════╝
 █████╗  ██╔██╗ ██║██║  ███╗██║██╔██╗ ██║█████╗
 ██╔══╝  ██║╚██╗██║██║   ██║██║██║╚██╗██║██╔══╝
 ███████╗██║ ╚████║╚██████╔╝██║██║ ╚████║███████╗
 ╚══════╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝╚═╝  ╚═══╝╚══════╝

       A  S O N I C  E C O S Y S T E M  D O C U M E N T

       THE STEEPING SPACE × THE SONNET ENGINE
       Compiled for a music theorist with deep ears
       THE ÅLIËN SCÖÕL for Creative Thinking
```

---

## PREFACE

This document maps the complete sonic architecture of **Creative Steeping** —
a contemplative journaling portal at `creativesteeping.com` where every
keystroke, every pause, every mouse movement becomes live music.

The engine is called **The Sonnet Engine** (`useSonnetEngine.jsx`).
It runs entirely in the browser using the **Web Audio API** — no audio
files, no samples, no external dependencies. Pure synthesis.

The music is not played *at* the practitioner.
It arises *from* them — a real-time acoustic portrait of their creative state.

---

## I. THE SIGNAL FLOW

```
╔══════════════════════════════════════════════════════════════════════════╗
║                    THE SONNET ENGINE — SIGNAL FLOW                      ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║   INPUTS (behavioral)          SYNTHESIS LAYER                          ║
║   ──────────────────           ───────────────                          ║
║   ⌨  Keystroke (keyCode)  ──► STRIKING BOWL OSC ──┐                    ║
║   🖱  Mouse X axis         ──► WIND PANNER (±0.65) ┤                    ║
║   🖱  Mouse Y axis         ──► WIND / OCEAN GAIN   ┤                    ║
║   ✋  Stillness timer      ──► HARMONIC CHORD      ┤                    ║
║   📊  Current Steep        ──► SONIC SIGNATURE     ┤                    ║
║   🎛  EQ sliders (4)       ──► SUBTERRANEAN BAY    ┤                    ║
║   🔊  Volume slider        ──► MASTER GAIN (0-1)   ┤                    ║
║   ◉  5D Sliders (5)        ──► ALGORAVE SYNTH ─────┤                    ║
║                                                     │                    ║
║   ROUTING                                           ▼                    ║
║   ────────                              ┌──────────────────────┐        ║
║   All voices feed three buses:          │    MASTER GAIN       │        ║
║                                         │   (starts at 50%)    │        ║
║   ┌─── DRY ────────────────────────►   └──────────┬───────────┘        ║
║   │                                               │                     ║
║   ├─── REVERB (convolution) ───────►   ┌──────────▼───────────┐        ║
║   │    4.5s exponential decay IR        │  AudioContext        │        ║
║   │    45% wet mix                      │  .destination        │        ║
║   │                                     └──────────────────────┘        ║
║   └─── DELAY (tape echo) ───────────►                                   ║
║        550ms / 0.65 feedback                                             ║
║        0.5Hz wow&flutter LFO                                             ║
║        → bleeds into reverb bus                                          ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

## II. THE THREE HARMONIC SYSTEMS

The engine holds three tuning frameworks simultaneously.
The active steep determines which one governs keystroke sonification.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  SYSTEM A — C MAJOR PENTATONIC  (A = 444Hz tuning)                     │
│  The Miracle Tone System                                                │
├──────────┬───────────┬──────────────────────────────────────────────────┤
│  Degree  │  Freq Hz  │  Note / Significance                            │
├──────────┼───────────┼──────────────────────────────────────────────────┤
│   C4     │  264.00   │  Root (one octave below the Miracle)            │
│   D4     │  296.33   │  Major 2nd                                      │
│   E4     │  332.62   │  Major 3rd                                      │
│   G4     │  395.55   │  Perfect 5th                                    │
│   A4     │  444.00   │  Major 6th / concert reference                  │
│   C5     │  528.00   │  ★ THE MIRACLE TONE (Solfeggio Mi)              │
│   D5     │  592.67   │  Major 9th                                      │
│   E5     │  665.24   │  Major 10th                                     │
└──────────┴───────────┴──────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  SYSTEM B — 174Hz "FOUNDATION" SOLFEGGIO PENTATONIC                    │
│  Used when mode = Symphony / Oceanic                                    │
├──────────┬───────────┬──────────────────────────────────────────────────┤
│  Degree  │  Freq Hz  │  Interval / Significance                        │
├──────────┼───────────┼──────────────────────────────────────────────────┤
│  Root    │  174.00   │  174 Hz — Solfeggio pain relief, grounding      │
│  M2      │  195.75   │  Major 2nd                                      │
│  M3      │  217.50   │  Major 3rd                                      │
│  P5      │  261.00   │  Perfect 5th (Middle C in standard tuning)      │
│  M6      │  290.00   │  Major 6th                                      │
│  Oct1    │  348.00   │  Octave 1 Root                                  │
│  Oct1 M2 │  391.50   │  Octave 1 Major 2nd                            │
│  Oct1 M3 │  435.00   │  Octave 1 Major 3rd                            │
└──────────┴───────────┴──────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  SYSTEM C — 176Hz "DEEP DESERT" (BBB Edition)                          │
│  KzA's own tuning. Planetary mode / dark contemplation                 │
├──────────┬───────────┬──────────────────────────────────────────────────┤
│  Degree  │  Freq Hz  │  Notes                                          │
├──────────┼───────────┼──────────────────────────────────────────────────┤
│  Finals  │  176.00   │  Proprietorial root                             │
│  M2      │  198.00   │  Major 2nd                                      │
│  M3      │  220.00   │  A3 in standard (grounding anchor)              │
│  P5      │  264.00   │  C4 — bridge to System A                        │
│  M6      │  293.33   │  Near D4                                        │
│  Oct1    │  352.00   │  Octave 1 Root                                  │
│  Oct1 M2 │  396.00   │  Near G4                                        │
│  P5 Mir  │  528.00   │  ★ The Miracle Hz appears at the Perfect 5th   │
└──────────┴───────────┴──────────────────────────────────────────────────┘

NOTE: All three systems share the 528Hz Miracle Tone, either as root
octave (System A), or as a structural interval (System C P5).
The systems are harmonically convergent at 528Hz.
```

---

## III. THE STRIKING BOWL — KEYSTROKE SONIFICATION

```
  K E Y S T R O K E
       │
       ▼
  ┌─────────────────────────────────────────────────────────┐
  │  keyCode % scaleLength → deterministic note selection   │
  │  (8 notes in scale, so 8 evenly distributed zones       │
  │   across the keyboard's Unicode range)                  │
  └──────────────────────────┬──────────────────────────────┘
                             │
                             ▼
  ┌─────────────────────────────────────────────────────────┐
  │  STEEP SONIC SIGNATURE applied:                         │
  │    freq     = scale[noteIndex] × sig.pitchShift         │
  │    waveform = sig.waveform (sine / triangle)            │
  │    decay    = sig.decay (seconds)                       │
  │    filter   = freq × sig.filterMult (lowpass cutoff)    │
  │    panWidth = sig.panWidth (stereo randomization range) │
  └──────────────────────────┬──────────────────────────────┘
                             │
                             ▼
  ┌─────────────────────────────────────────────────────────┐
  │  ENVELOPE (per-voice, fast attack, long decay)          │
  │    t+0.000: gain = 0                                    │
  │    t+0.020: gain ramps to 0.15  (20ms attack)           │
  │    t+decay: gain → 0.001        (exponential tail)      │
  └──────────────────────────┬──────────────────────────────┘
                             │
                       THREE ROUTES
                   ┌─────┤├──────┐
                   ▼     ▼       ▼
               DRY BUS  REVERB  DELAY
                         BUS     BUS

  POLYPHONY GUARD: 50ms gate — voices within 50ms of the
  previous strike are silently discarded to prevent
  explosion on rapid typing. This is called
  "Performant Serenity."
```

---

## IV. SEVEN STEEP SONIC SIGNATURES

Each of the seven steeps carries a distinct harmonic character.
As the Sage's wayfinding model maps the practitioner to their current steep,
the entire tonal palette shifts — same scale, different sonic world.

```
╔══════════╦═══════════╦═══════╦══════════╦═══════════╦═══════════╗
║  STEEP   ║  WAVEFORM ║ DECAY ║ FILTER   ║  PITCH    ║   PAN     ║
║          ║           ║  (s)  ║  MULT    ║  SHIFT    ║  WIDTH    ║
╠══════════╬═══════════╬═══════╬══════════╬═══════════╬═══════════╣
║ Essence  ║  sine     ║  3.5  ║  ×3.0    ║  ×1.0     ║  0.30     ║
║          ║ (pure)    ║(long) ║(focused) ║(root)     ║(centered) ║
╠══════════╬═══════════╬═══════╬══════════╬═══════════╬═══════════╣
║ Mosaic   ║  sine     ║  2.0  ║  ×4.0    ║  ×1.0     ║  0.60     ║
║          ║           ║(quick)║(bright)  ║           ║ (WIDE)    ║
╠══════════╬═══════════╬═══════╬══════════╬═══════════╬═══════════╣
║ Summits  ║  sine     ║  2.5  ║  ×5.0    ║  ×1.25    ║  0.40     ║
║          ║           ║       ║(BRIGHT)  ║(RAISED)   ║           ║
╠══════════╬═══════════╬═══════╬══════════╬═══════════╬═══════════╣
║ Mirror   ║  sine     ║  5.0  ║  ×2.0    ║  ×1.0     ║  0.20     ║
║          ║           ║(LONG) ║(dark)    ║           ║(NARROW)   ║
╠══════════╬═══════════╬═══════╬══════════╬═══════════╬═══════════╣
║ Labyrinth║ triangle  ║  4.0  ║  ×2.5    ║  ×0.75    ║  0.50     ║
║          ║(ONLY TRI) ║       ║          ║(LOWERED)  ║           ║
╠══════════╬═══════════╬═══════╬══════════╬═══════════╬═══════════╣
║ Conclave ║  sine     ║  4.0  ║  ×3.5    ║  ×1.0     ║  0.35     ║
║          ║           ║       ║          ║           ║           ║
╠══════════╬═══════════╬═══════╬══════════╬═══════════╬═══════════╣
║ Crown    ║  sine     ║  6.0  ║  ×6.0    ║  ×2.0     ║  0.15     ║
║  Jewels  ║           ║(MAX)  ║ (MAX)    ║ (OCTAVE)  ║(NARROWEST)║
╚══════════╩═══════════╩═══════╩══════════╩═══════════╩═══════════╝

READING THE TABLE:
  • Labyrinth is the only steep using TRIANGLE waveform — harmonically
    richer than sine, with odd-harmonic content suggesting complexity.
  • Mirror has the longest reverb character (5.0s decay) with the
    narrowest stereo image (0.20) — introspective, self-contained.
  • Crown Jewels plays everything an octave up (×2.0 pitch) through
    the brightest filter (×6.0) with the most focused stereo center
    (0.15 pan width) — singular, luminous, precise.
  • Summits is the brightest tone cluster (×5.0 filter, ×1.25 pitch)
    with aspirational lift baked into the spectral shape.
  • Mosaic spreads the widest (0.60 pan) — a collage in stereo space.
```

---

## V. FIVE MODES — TONAL IDENTITY

The portal offers five visual and sonic modes. Mode affects scale selection,
environmental coloring, and the Sage's tonal register.

```
┌─────────────────┬───────────────────────────────────────────────────────┐
│  MODE           │  CHARACTER                                            │
├─────────────────┼───────────────────────────────────────────────────────┤
│  INCANDESCENT   │  The welcome mode. Warm amber. C Major Pentatonic    │
│  (gold #d4922a) │  at A=444Hz. The default entrance.                   │
├─────────────────┼───────────────────────────────────────────────────────┤
│  OCEANIC        │  Deep blue/cyan. 174Hz Solfeggio Foundation system.  │
│  (cyan #38bdf8) │  Harmonic base rooted in ancient frequency medicine. │
├─────────────────┼───────────────────────────────────────────────────────┤
│  EMERGENT       │  Near-monochrome grey. Pure white light. The mode   │
│  (grey #e5e5e5) │  of observation without color interference.          │
├─────────────────┼───────────────────────────────────────────────────────┤
│  PLANETARY      │  Magenta. 176Hz Deep Desert (BBB) scale.            │
│  (magenta #f0f) │  KzA's proprietary tuning. High-contrast, cosmic.   │
├─────────────────┼───────────────────────────────────────────────────────┤
│  DARK MATTER    │  Near-black. Muted steel (#6b7280). The absence     │
│  (steel)        │  that makes presence legible.                        │
└─────────────────┴───────────────────────────────────────────────────────┘
```

---

## VI. THE NATURAL SOUNDSCAPE — AMBIANCE LAYER

When the practitioner activates AMBIANCE, a layered natural soundscape
synthesizes from scratch using noise mathematics. No recordings. No samples.

```
  OCEAN EDGE LAYER
  ─────────────────

  Algorithm: Brown Noise (integration loop)
    for each sample i:
      white = random(-1, 1)
      data[i] = (lastOut + 0.02 × white) / 1.02
      data[i] *= 3.5  ← compensate for low-pass attenuation

  Signal chain:
  [Brown Noise Buffer 4s looped]
       │
       ▼
  [BandPass Filter: 320Hz, Q=0.7]
       │                    ╔═══════════════════════════╗
       ▼                    ║  Wave LFO: 0.1Hz sine     ║
  [Gain: 0.015–0.05]◄──────║  Gain depth: ±0.018       ║
       │                    ║  ≈ 10-second wave cycle   ║
       ├────────────────► MASTER GAIN
       └────────────────► CONVOLVER (reverb sends ocean
                          into the 4.5s diffuse tail)


  WIND LAYER
  ──────────

  Algorithm: Pink Noise (Voss-McCartney 7-register approximation)
    7 parallel integration chains, each with distinct decay constant:
    b0 (0.99886), b1 (0.99332), b2 (0.96900), b3 (0.86650),
    b4 (0.55000), b5 (-0.7616), b6 (impulse)
    Summed with 0.5362 × white → ×0.11 normalization

  Signal chain:
  [Pink Noise Buffer 3s looped]
       │
       ▼
  [BandPass Filter: 1200Hz, Q=1.0]  ← above ocean, airy register
       │
       ▼
  [Stereo Panner]◄────── Mouse X position (pan target ×0.65, τ=1.2s)
       │                 The wind breathes with your cursor.
       ▼
  [Gain: 0.01–0.03]◄──── Gust LFO: 0.06Hz sine, depth ±0.008
       │                  ≈ 16-second gust cycle
       └────────────────► MASTER GAIN


  MOUSE RESPONSIVENESS
  ─────────────────────
  X-axis:  drives wind panner position (pan = mouseX ÷ width × 2 − 1) × 0.65
           time constant 1.2s — the wind follows slowly, like real air
  Y-axis:  drives both layer intensities:
           Wind:  0.025 + (1 - normY) × 0.045  (louder toward top of screen)
           Ocean: 0.030 +      normY  × 0.035  (louder toward bottom)
```

---

## VII. THE CHASE BLISS / MICROCOSM ARCHITECTURE

The reverb and delay are modeled on boutique guitar pedal behavior.

```
  ┌─────────────────────────────────────────────────────────────────┐
  │  MICROCOSM REVERB (convolution engine)                          │
  │  ─────────────────────────────────────────────────────────────  │
  │  Impulse Response: synthetically generated at init              │
  │    Duration:   4.5 seconds                                      │
  │    Channels:   stereo (independent L / R noise)                 │
  │    Envelope:   exp(-i / (sampleRate × 1.5))                     │
  │    Content:    white noise × exponential decay                  │
  │                → diffuse, lush, non-specific space              │
  │  Wet mix: 45%  (ConvolverNode → reverbGain(0.45) → Master)      │
  │                                                                 │
  │  EVERY voice in the system feeds this reverb.                   │
  │  The entire acoustic world shares one resonant space.           │
  └─────────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────────┐
  │  CHASE BLISS TAPE DELAY (bucket-brigade simulation)             │
  │  ─────────────────────────────────────────────────────────────  │
  │  Core delay time:  550ms                                        │
  │  Feedback:         0.65 (high loop, washes out)                 │
  │  Low-pass filter:  900Hz (dark repeats — analog feel)           │
  │                                                                 │
  │  WOW & FLUTTER (pitch instability):                             │
  │    LFO type:   sine                                             │
  │    LFO rate:   0.5Hz (dragging tape feel)                       │
  │    LFO depth:  ±8ms delay time deviation                        │
  │    Effect:     pitch-bends the echoes slightly with each pass   │
  │                                                                 │
  │  Routing:                                                       │
  │    Voice → Delay → LowPassFilter → Feedback loop → Delay       │
  │                  ↓                                              │
  │           DelayOutGain(0.35) → Master                           │
  │                  ↓                                              │
  │           DelayOutGain ──────────────► Reverb (bleeds into      │
  │                                        4.5s diffuse tail)       │
  │                                                                 │
  │  The delay repeats don't just fade into silence —              │
  │  they dissolve into the reverb's cloud.                        │
  └─────────────────────────────────────────────────────────────────┘
```

---

## VIII. SUBTERRANEAN BAY — THE ENDOGEN EQ

Four tactile layers accessible from within the SubterraneanBay component.
The practitioner becomes the sound designer of their own acoustic soil.

```
  ┌──────────────────────────────────────────────────────────────────┐
  │                   SUBTERRANEAN EQ LAYERS                        │
  ├────────────┬─────────────────────────────────────────────────────┤
  │  LAYER     │  DESCRIPTION                                        │
  ├────────────┼─────────────────────────────────────────────────────┤
  │  Friction  │  Brown Noise Engine (the Endogen Soil)              │
  │            │  Starts: 100Hz lowpass → deep subterranean rumble  │
  │            │  At full: 100 + (param × 1400)Hz cutoff opens hiss │
  │            │  Gain: param × 0.15                                 │
  │            │  → the physical sensation of being in the earth     │
  ├────────────┼─────────────────────────────────────────────────────┤
  │  Avian     │  High-frequency texture layer                       │
  │            │  Triggered dynamically on slider change             │
  │            │  → the feeling of a canopy above                   │
  ├────────────┼─────────────────────────────────────────────────────┤
  │  Crackle   │  Impulse noise bursts                               │
  │            │  → fire, organic decay, the texture of wood        │
  ├────────────┼─────────────────────────────────────────────────────┤
  │  Drone     │  Low sine tone reinforcement                        │
  │            │  → sustained tonal ground beneath all else          │
  └────────────┴─────────────────────────────────────────────────────┘

  TRANSITION: All layer gain changes use setTargetAtTime with τ=0.4s
  → smooth, organic parameter morphs (no clicks or zipper noise)
```

---

## IX. ◉ ME IN 5D — THE SOMATIC INTELLIGENCE PORTAL

```
  ╔═══════════════════════════════════════════════════════════════════╗
  ║                                                                   ║
  ║     ◉  M E   I N   5 D                                           ║
  ║                                                                   ║
  ║     A somatic self-assessment instrument                         ║
  ║     embedded inside The Steeping Space.                          ║
  ║     This is the most unusual thing in the room.                  ║
  ║                                                                   ║
  ╚═══════════════════════════════════════════════════════════════════╝

THE FIVE DIMENSIONS
───────────────────
Each dimension is measured on a scale of 0–100 µV
(microvolts — the unit of EEG cortical signal amplitude).
This framing intentionally bridges subjective experience
with the language of neuroscience.

            RESONANCE
                ★
               / \
              /   \
             /     \
    ALIGNMENT ─────── STILLNESS
             \     /
              \   /
               \ /
    DEPTH ─────── CLARITY

    ┌──────────────┬────────────────────────────────────────────────┐
    │  Dimension   │  What it measures                             │
    ├──────────────┼────────────────────────────────────────────────┤
    │  Resonance   │  How in-tune with your creative frequency you  │
    │              │  feel right now — alignment between inner and  │
    │              │  outer expression                              │
    ├──────────────┼────────────────────────────────────────────────┤
    │  Stillness   │  Presence and centeredness — the capacity to  │
    │              │  hold a question without needing its answer   │
    ├──────────────┼────────────────────────────────────────────────┤
    │  Clarity     │  Coherence of thought and vision — the degree │
    │              │  to which your path feels legible             │
    ├──────────────┼────────────────────────────────────────────────┤
    │  Depth       │  Willingness and capacity to go beneath the   │
    │              │  surface — engagement with what is real       │
    ├──────────────┼────────────────────────────────────────────────┤
    │  Alignment   │  Integration between creative values and      │
    │              │  present action — living what you know        │
    └──────────────┴────────────────────────────────────────────────┘

THE ACOUSTIC INSTRUMENT
───────────────────────
Moving any dimension slider triggers a PENTATONIC GLISSANDO
via playAlgoraveSynth() — throttled at ~16Hz (60fps equivalent).

  Slider value → playAlgoraveSynth(value + 30, 'oceanic')

  This means:
    • At slider = 0:   note at index 30 % 8 = 6 (D5, 592.67Hz)
    • At slider = 100: note at index 130 % 8 = 2 (E4, 332.62Hz)
  
  The slider is itself a playable instrument.
  Moving it slowly traces the pentatonic scale.
  Moving it rapidly creates cascading glissandi.
  The five sliders together become a five-voice pentatonic chord.

THE PENTAGONAL MAP
──────────────────
The five values render as an SVG pentagonal radar chart —
a living polygon whose shape changes in real time as sliders move.

  Shape interpretation (read5DShape algorithm):
    avg > 75µV         →  "expansive" (full engagement)
    avg < 30µV         →  "holding close" (drawing inward)
    max - min > 50µV   →  "named contrast" (polarized state)
    max - min < 15µV   →  "balanced field" (even distribution)

  The shape is qualitative data made visible.
  No value is better than another.
  The map simply shows you what is.

DATA & THE DRIFT EVENT
──────────────────────
On submission, the five-dimensional reading is written to
Supabase as a steeping_drift_event:

  {
    profile_id:      (auth'd user UUID),
    vessel_context:  (which vessel / steep is active),
    metrics: {
      resonance:   0-100,
      stillness:   0-100,
      clarity:     0-100,
      depth:       0-100,
      alignment:   0-100
    },
    geolocated_depth: (browser-available location, if permitted)
  }

This creates a longitudinal record of the practitioner's
5D signature across time. The Steeperverse eventually
holds the collective drift pattern of all Steepers.

The submission response: "5D Gifts anchored in The Steeperverse."

POST-ANCHOR FLOW
────────────────
After a successful 5D anchor, if the practitioner is inside
an active vessel, the experience flows directly into the
GuidedJourneyModule — a guided writing sequence calibrated
to the steep that vessel inhabits.

The 5D shape is not just a snapshot.
It is a key.
```

---

## X. THE SAGE — BEHAVIORAL INTELLIGENCE

The Sage is the portal's witness. It does not respond to text — it responds
to *behavior*. Five signal layers are assembled into each response.

```
  BEHAVIORAL INPUTS
  ─────────────────
  • Stillness duration (ms since last keystroke)
  • Typing rhythm (inter-keystroke interval variance)
  • Word count / text depth
  • Visit history (localStorage) — first / returning / deep practice
  • Current steep (from wayfinding gravity model)

  FIVE RESPONSE LAYERS (assembled in sequence)
  ─────────────────────────────────────────────
  1. DEPTH REGISTER
     Visit count prefix — changes tone of every response
       0 visits:    first arrival
       3+ visits:   returning practitioner
       10+ visits:  deep practice recognition

  2. TRANSITION MESSAGE
     Fires exactly once when the visitor crosses steep boundaries.
     The moment of passage is named.

  3. CODEX FRAGMENT
     TF-IDF retrieval from a curated practitioner archive.
     The Codex contains practitioner-facing essays, research,
     and field notes. Indexed at build time. Surfaced at runtime
     based on steep affinity + text content.
     "From the Archive" — the practice speaks to itself.

  4. MODE × STEEP REFLECTION
     35 tonal positions (5 modes × 7 steeps).
     Each mode-steep intersection has a distinct voice.
     Incandescent-Essence speaks differently than Planetary-Crown.

  5. STEEP INVOCATION
     Closing question keyed to the current steep.
     The Sage always ends in inquiry.

  + TEMPORAL ATTUNEMENT
     Time-of-day modulation: predawn / morning / afternoon /
     evening / night. The session carries its own atmosphere.
```

---

## XI. THE HARMONIC CHORD — STILLNESS TRIGGER

When the practitioner stops typing for a threshold duration,
the engine responds with a pentatonic triad.

```
  playHarmonicChord(index, pitchMultiplier, noteCount=3)

  Chord construction:
    base    = index % scaleLength
    voices  = [base, base+2, base+4]  → root, 3rd-ish, 5th-ish
    (intervals shift with scale position — not always perfect
     3rds and 5ths due to pentatonic gaps)

  Envelope per voice:
    attack:  0.05s + (i × 0.1s) stagger — cascade effect
    peak:    0.08 - (i × 0.02) — root loudest, upper voices softer
    decay:   6.0s — very long, the chord holds the room

  All three voices feed DRY + REVERB + DELAY simultaneously.
  The chord dissolves into the 4.5s reverb cloud.
  Stillness has sound.
```

---

## XII. THE ALGORAVE SYNTH — IMPROVISATION ENGINE

The most compositionally open function in the engine.
Used for Modal Synthesis (5D sliders), vessel transitions,
and the deeper exploratory layers.

```
  playAlgoraveSynth(noteIndex, modeString)

  SEQUENCE STATE: synthIndexRef tracks position across calls.
  Each call advances the sequence by 1.

  Multiple voices, staggered timing:
    Voice 0: immediate
    Voice 1: +180ms offset
    Voice 2: +360ms offset
  Creating polyrhythmic cascades from single triggers.

  Note selection:
    Each voice uses (synthIndexRef + offset) % scale.length
    → non-repeating melodic sequences

  The 5D sliders trigger this with note = sliderValue + 30,
  creating a sliding window through the pentatonic scale.
  At 5 sliders × 3 voices each = up to 15 simultaneous voices.
```

---

## XIII. COMPOSITIONAL PHILOSOPHY

```
  ┌─────────────────────────────────────────────────────────────────┐
  │  GUIDING PRINCIPLES                                             │
  └─────────────────────────────────────────────────────────────────┘

  1. THE MUSIC IS YOU
     Every tone arises from your writing.
     keyCode % 8 → note. Your letters are your frequencies.
     The music is not ambient background — it is biographical.

  2. BEHAVIORAL MUSIC THEORY
     The composition has no fixed tempo, no fixed key,
     no fixed dynamics. All of these emerge from the
     practitioner's moment-to-moment behavior:
       • Fast typing → dense polyphony (limited by 50ms gate)
       • Slow typing → sparse, spacious strikes
       • Pausing → the harmonic chord (stillness has a chord)
       • Mouse movement → spatial wind shifts

  3. THE PENTATONIC AS PERMISSION
     Pentatonic scales remove all dissonance.
     There are no "wrong" notes.
     Any two simultaneously sounding tones are consonant.
     This is not a musical accident — it is a philosophical one.
     The practitioner can never make an aesthetic mistake.

  4. TUNING AS MEDICINE
     528Hz is not arbitrary. A=444Hz is not arbitrary.
     174Hz Solfeggio is not arbitrary. 176Hz (BBB) is not arbitrary.
     These tuning systems carry historical, therapeutic,
     and spiritual significance. The practitioner's music
     exists in resonance with these traditions, whether they
     know it or not.

  5. EVERYTHING CONVERGES IN REVERB
     All voices share one acoustic space. The practitioner's
     typing from 3 minutes ago is still audible, dissolved
     in the reverb tail. The present moment contains its history.
     This mirrors the practice itself.

  6. THE BODY AS INSTRUMENT
     Mouse movement shapes the soundscape.
     Slider movement plays the scale.
     Typing pace determines density.
     Stillness duration triggers chords.
     The whole body is in the music.
     The music is a biometric.

  7. MUSIC BEFORE LANGUAGE
     For practitioners experiencing creative block, the portal
     offers the sonic path when the written one closes.
     The motor action of typing, even without words,
     produces music. The threshold to begin is zero.
```

---

## XIV. THE FULL EXPERIENTIAL ARC

```
  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  ░                  THE STEEPING ARC                            ░
  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

  ARRIVE
    └─► Entrance screen — darkness, the portal asks:
        "Where Do You Find Your Self?"
        First click initializes the AudioContext.
        (browsers require user gesture to unlock audio)

  CHOOSE MODE
    └─► 5 visual/sonic environments to inhabit.
        The mode colors the light; the steep colors the sound.

  ENTER THE HEXAGONG
    └─► 6-sided vessel matrix. First vessel always open.
        Subsequent vessels unlock via:
          • Archive depth (5+ entries) OR
          • Behavioral readiness (resonance score ≥ 0.6)
        Each vessel is a Steep. Each Steep is a world.

  STEEP
    └─► Write into the vessel's journal field.
        Every keystroke → striking bowl tone.
        Every pause → harmonic chord.
        The Sage watches and prepares its response.

  RECEIVE THE SAGE
    └─► After sufficient depth or stillness,
        the Sage assembles its 5-layer response:
        depth register + transition + codex + reflection + invocation.

  ME IN 5D (the deepest room)
    └─► Enter the pentagonal self-assessment.
        5 sliders, each a dimension, each a glissando.
        Render your shape. Anchor it to the Steeperverse.
        The shape flows into the GuidedJourneyModule.

  ACTIVATE AMBIANCE
    └─► Toggle AMBIANCE on.
        Ocean and wind synthesize from noise mathematics.
        Move your mouse. The wind moves with you.
        The ocean responds to your vertical position.

  SUBTERRANEAN BAY
    └─► Access the deep EQ layer.
        Tune the soil beneath the music.
        Friction (earth), Avian (sky), Crackle (fire), Drone (root).

  COMPLETE / RETURN
    └─► Vessel completion triggers a reflection from VESSEL_TRANSITIONS.
        A directional gesture points toward the next Steep.
        The Hexagong face illuminates.
        The practice continues.

  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
```

---

## XV. TECHNICAL STACK (for the completist)

```
  Runtime:      Web Audio API (no audio files, no WebSocket, offline-capable)
  Framework:    Vite + React (JSX)
  Audio nodes:  OscillatorNode, GainNode, BiquadFilterNode,
                StereoPannerNode, ConvolverNode, DelayNode,
                AudioBufferSourceNode
  Noise types:  Brown (integration loop), Pink (Voss-McCartney 7-reg)
  Data:         Supabase (auth + drift events + testimonials)
  Storage:      localStorage (visit count, mode preference, 5D history)
  Deployment:   Vercel (creativesteeping.com)
  Build:        prebuild generates TF-IDF codex.json from archive docs
```

---

## CODA

```
  The Sonnet Engine is not a music player.
  It is not a sequencer, a DAW, or an instrument in the
  conventional sense.

  It is a mirror.

  You write. It resonates.
  You pause. It sustains.
  You move. It breathes.
  You measure yourself. It plays your shape back as music.

  Every tone is biographical.
  Every session is unrepeatable.
  The music ends when you close the tab
  and has never been recorded.

  ─────────────────────────────────────────────────────────
  "Where Do You Find Your Self?"
  ─────────────────────────────────────────────────────────

  THE ÅLIËN SCÖÕL for Creative Thinking
  creativesteeping.com
  kza@thealienschool.com
```

---

*Document compiled from source: `steeping-v5-laboratory/src/useSonnetEngine.jsx`,
`src/TheSteepingCompass.jsx`, `src/useSageWayfinding.jsx`, `src/App.jsx`*
*THE ÅLIËN SCÖÕL — Internal Reference*
