# Orient Me — Editorial Draft

**Purpose of this document.** The orientation overlay needs to stop requiring a scroll to read any slide. Rather than pick a layout mechanism first and ask the words to conform to it, this pass goes the other way: tighten the language, see what the real word counts look like once that's done, and let *that* — not a guess — decide the layout approach next. Shorter, plainer copy keeps every option open (a fixed size, a shrink mechanism, a restructured layout, or some mix); it's worth doing regardless of which one gets picked.

Every number below is computed from the actual shipped strings in `WayfindingOverlay.jsx`, not estimated.

---

## 1. Where the copy stands today

| Slide | Title (words/chars) | Subtitle (words/chars) | Description (words/chars) |
|---|---|---|---|
| You Are Here (matrix view) | 5 / 21 | 3 / 19 | 24 / 141 |
| The Architecture of the Pause | 5 / 29 | 3 / 21 | 36 / 225 |
| Engaging the Hexagong | 3 / 21 | 3 / 27 | **57 / 317** |
| Sonic Awareness | 2 / 15 | 4 / 18 | 47 / 289 |
| Me in 5D | 3 / 8 | 3 / 22 | 39 / 192 |
| Steeping Notes | 2 / 14 | 4 / 22 | 40 / 240 |
| The Sound of Becoming (+ CTA: 3 / 14) | 4 / 21 | 5 / 33 | 38 / 199 |
| Everything, One Click Away | 4 / 26 | 3 / 18 | 40 / 229 |
| Permission to Pause | 3 / 19 | 4 / 17 | 34 / 187 |
| There's More Than the Prompt | 5 / 28 | 4 / 25 | 39 / 218 |

**Description averages across all 10 slides:** 39.4 words / 223.7 characters. **Range:** 24 words (You Are Here) to 57 words (Engaging the Hexagong) — more than double, and the clearest outlier worth trimming first. **Title averages:** 3.6 words, ranging 2–5.

That range is the actual thing driving the scroll problem — it's not that the deck runs long on average, it's that a few slides run nearly 2.5x longer than the shortest one, and the layout has to accommodate the longest case everywhere.

---

## 2. Per-slide: current copy, a tightened first pass, your edit

Each entry shows what's shipped, a plainer/shorter draft (mine, not final), and blank space for what you actually want to say. Edit either column — replace, blend, or discard the middle one entirely.

### You Are Here *(dynamic — shown when no vessel is open)*
- **Current** (24w/141c): The Hexagong Matrix. Nine vessels, each a distinct steep. You have held 0 moments so far. The practice builds where you bring your attention.
- **Tighter draft** (21w/122c): Nine vessels, each a distinct steep. You've held 0 moments so far — the practice builds wherever you bring your attention.
- **Your version:**

### The Architecture of the Pause
- **Current** (36w/225c): This is a private, resonant instrument for thought. Your depth of attention grows the longer you inhabit these spaces. The more fully you arrive in each vessel, the more your Resonance Imprint accumulates across the practice.
- **Tighter draft** (25w/151c): A private instrument for thought. The longer you stay, the more your attention deepens — and the more your Resonance Imprint grows across the practice.
- **Your version:**

### Engaging the Hexagong *(the longest slide — start here)*
- **Current** (57w/317c): When you open a vessel, the screen opens into two spaces. On the left: The Compass :: context, coordinates, and The Sage. On the right: Your Architecture, the field that holds your reflection. Read the inquiry. Let the questions land. Write in the space below. When something is ready to be held, it finds its way in.
- **Tighter draft** (31w/189c): Opening a vessel splits the screen in two. Left: the Compass and the Sage, holding context. Right: Your Architecture, where reflection is written. Read the inquiry, let it land, then write.
- **Your version:**

### Sonic Awareness
- **Current** (47w/289c): The space responds to you. Sound and cursor move together :: a scored, biometric field. The striking bowl marks recognition, not completion. The global timers (5m, 15m, 22m) open an Active Pause whenever you need one. The Sage's eye opens when it's calculating. You'll feel the difference.
- **Tighter draft** (34w/192c): The space responds to you — sound and cursor move together. The striking bowl marks recognition, never completion. Set a timer (5, 15, or 22 minutes) for an Active Pause whenever you need one.
- **Your version:**

### Me in 5D
- **Current** (39w/192c): Five axes read the shape of your practice back to you :: not a score to chase, a mirror to sit with. Open the Compass any time from the menu below and see where your attention has been living.
- **Tighter draft** (23w/112c): Five axes read your practice back to you — a mirror, not a score. Open the Compass any time from the menu below.
- **Your version:**

### Steeping Notes
- **Current** (40w/240c): Field notes, essays, and research reports live behind one door :: the accumulated thinking beneath the practice, free to read whenever you want the ground under your feet. It's reachable from the menu below at any point, no vessel required.
- **Tighter draft** (25w/137c): Field notes and essays live behind one door — the thinking beneath the practice. Free to read any time from the menu, no vessel required.
- **Your version:**

### The Sound of Becoming
- **Current** (38w/199c): There's a neuroscience essay behind the sound in this practice :: why writing and hearing your own words at once engages more of the body than either does alone. This is a taste, not the whole of it.
- **Tighter draft** (27w/143c): A neuroscience essay explains why writing and hearing your own words at once engages more of the body than either alone. This is a taste of it.
- **Your version:**
- *(CTA button label, currently "Open the Essay" — fine as-is, flagging only because it's part of the same slide's word budget)*

### Everything, One Click Away
- **Current** (40w/229c): Steeping Notes. This Guide. Me in 5D. Program Details. About the practice. Every door in Creative Steeping opens from the same small icon, top corner, always present :: nothing here is ever more than one click from where you are.
- **Tighter draft** (26w/149c): Steeping Notes. This Guide. Me in 5D. Program Details. About. Every door opens from the same small icon, top corner, always present — one click away.
- **Your version:**

### Permission to Pause
- **Current** (34w/187c): Three global timers sit quietly at the edge of the practice. Set one and an Active Pause opens when it ends :: a held moment before you decide what's next. Nothing here punishes stopping.
- **Tighter draft** (28w/140c): Three timers sit at the edge of the practice. Set one, and an Active Pause opens when it ends — a held moment before you decide what's next.
- **Your version:**

### There's More Than the Prompt
- **Current** (39w/218c): Each of the nine Hexagongs holds its own inquiry, its own tone, its own sonic signature :: what waits in Hexagong 00 differs entirely from what waits in Hexagong 08. Depth of practice unlocks them, on its own schedule.
- **Tighter draft** (31w/167c): Each of the nine Hexagongs holds its own inquiry, tone, and sound. What waits in 00 differs entirely from what waits in 08 — depth unlocks them, on their own timeline.
- **Your version:**
- *(Title could also shorten to "More Than the Prompt" — your call)*

---

## 3. What the tighter pass alone buys

Applying just the drafts above (before any further edit from you): total description word count drops from **394 to 271 words — a 31% reduction**, and the worst outlier (Engaging the Hexagong) goes from 57 words down to 31, closing most of the gap with the rest of the deck. That's the "balanced view" the layout decision needs — a deck that's already tighter and more even, rather than one long slide the layout has to design around.

---

## 4. A proposal for the Clarity Bridge lens itself

`CLARITY_BRIDGE_AUDIT_LENS.md` currently checks five things: Somatic Grounding, Topological Clarity, Pacing Regulation, Reflective Integration, and Language Resonance (no negations). None of them ask whether a piece of copy fits the space it's been given — that's a real gap this exercise surfaced. A draft addition, for you to accept, edit, or drop:

> **6. Vertical Economy** :: Does the copy honor the space it's given, rather than asking the layout to compensate for it?

A lightweight companion for `clarity_bridge_audit.py`: flag any slide whose word count runs well past the deck's median (say, more than 1.5x) as an editorial signal — not a hard failure, just a flare, the same spirit as the existing negation check. I haven't touched the actual lens file or the script — this is a proposal living in this draft until you say go.

---

*Prepared as a working draft, not final copy. Nothing here has been applied to the codebase yet — reply with your edits (in place, or however's easiest) and the next round will bring the layout decision and the implementation together.*
