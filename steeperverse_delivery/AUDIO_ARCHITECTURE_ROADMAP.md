# THE SONIC UNFOLDMENT: AUDIO ARCHITECTURE ROADMAP

*The Architecture of the Pause — Environmental Design Principles*

This document serves as the precise, origami-like blueprint for how we will package, fold, and deploy physical audio files into the Steeperverse ecosystem. 

As we move from synthesized WebAudio (the current 528Hz geometry) into richly textured, physical audio files (spoken word, environmental room tones, field recordings), we must adhere to the principles of Japanese packaging: **Everything has a specific, highly intentional place. There is no bloat. There is no excess.**

---

## I. The Fold: Structural Packaging

To maintain a pristine Vercel deployment, our audio will not be scattered. It will be housed entirely within the `public/audio/` directory, folded into three distinct architectural spaces.

### 1. The `geometry/` Folder
**The function:** Short, tactical, instantaneous sounds that map to physical interactions.
**The files:** Keystrokes, Hexagong unlocks, slider clicks, Resonance Vault dimming.
**The format:** `.mp3` or highly compressed `.ogg`. (Must be under 100kb per file for zero-latency playback).
**The rule:** These files are *eagerly loaded*. They must be ready the millisecond a practitioner enters the portal.

### 2. The `atmosphere/` Folder
**The function:** Long, looping, environmental room tones. The "water" of the Steeping Space.
**The files:** Low-frequency 528Hz hums, Algorave ambient tracks, background textures for Active Pause rituals.
**The format:** High-quality `.mp3` (128kbps - 192kbps).
**The rule:** These files are *lazy-loaded*. They do not stall the visual loading of the portal. They gently fade in 2-3 seconds after the practitioner has already arrived.

### 3. The `transmission/` Folder
**The function:** The human element. Spoken word, Historical Scores, guided audio steeps from the Author.
**The files:** Narrative tracks, Session introductions, deeply personal reflections.
**The format:** `.mp3` (Voice-optimized, mono or narrow stereo to reduce file size).
**The rule:** These are *demand-loaded*. They only download when a practitioner explicitly presses `[ LISTEN ]` or engages a specific vessel.

---

## II. The Origami Mechanics (Implementation)

When you are ready to upload the files, we will implement them with supreme simplicity. No bloated third-party audio libraries. We will use native HTML5 Audio interwoven with our existing `useSonnetEngine`.

**The Three-Step Unfoldment:**

1. **Upload & Prune:** You will drop your pristine audio files into the respective folders inside `steeping-v5-laboratory/public/audio/`.
2. **The Atlas Mapping:** We will create a single, clean `audioMap.js` file. This acts as the index, mapping your file names to their systemic functions (e.g., `HEX_UNLOCK: '/audio/geometry/chime_01.mp3'`).
3. **The Engine Update:** We will elegantly update `useSonnetEngine.jsx` to cross-fade between our current synthetic 528Hz waves and your new, organic audio files.

---

## III. Environmental Design Principles for Audio

To ensure the deployment remains pristine and performant:

*   **The Void is a Sound:** Do not be afraid of silence. Not every interaction requires an audio file. The architecture of the pause relies on empty space.
*   **Compression is Elegance:** Massive `.wav` files are the enemy of a fluid web experience. Before uploading, audio should be mastered and compressed to `.mp3` or `.ogg` to honor the practitioner's bandwidth and mobile experience.
*   **Fade Geometry:** Audio must never cut abruptly. Every sound must have a programmed `0.5s` fade-in and a `1.5s` fade-out. The decay is as important as the attack.

When you have the physical audio assets mastered and ready, simply place them in the `public/audio` directory, and we will execute this exact unfoldment.
