# CREÅTIVE STEEPING — V4 Build Offload
## Handoff README · February 2026

---

## What You Are Receiving

Three files. Everything the build team needs to move from artifact to production.

```
steeping-v4-offload/
├── README.md                              ← You are here
├── steeping-portal-v4.jsx                 ← The production component
├── CREATIVE_STEEPING_Master_Brief_v1.docx ← Full project brief (read this first)
└── STEEPING-PORTAL-BUILD-PROMPT-v4.md    ← Architectural predecessor + tech spec
```

---

## Read First

Open `CREATIVE_STEEPING_Master_Brief_v1.docx` before touching any code.

Section 07 of that document has instructions specifically written for the dev team. It will tell you what to do on day one.

---

## The Component: steeping-portal-v4.jsx

A complete, self-contained React component. 1,036 lines. No external dependencies beyond:
- Google Fonts (Playfair Display, EB Garamond, DM Mono) — loaded via @import in the style block
- Anthropic Messages API — for the Steeping Sage

### To run locally

```bash
# In any React project (Vite, Next.js, CRA):
npm install
# Copy steeping-portal-v4.jsx into /src/
# Import and render as root component
import App from './steeping-portal-v4'
```

The component renders fully without an Anthropic API key. The Sage will fail silently and return the mode greeting. Everything else — entrance, vessels, navigation, modes, mobile sheet — works offline.

### To activate the Sage

The fetch call in `sendSage()` hits `https://api.anthropic.com/v1/messages` directly. For local development, add your API key as a request header temporarily. **For production, this call must be proxied through a server-side route — never expose the API key client-side.**

```javascript
// Current fetch in sendSage() — add header for local dev only:
headers: {
  "Content-Type": "application/json",
  "x-api-key": process.env.ANTHROPIC_API_KEY,        // server-side only
  "anthropic-version": "2023-06-01",
  "anthropic-dangerous-direct-browser-access": "true" // artifact env only
}
```

---

## Architecture in 90 Seconds

### State
- `mode` — "incandescent" | "oceanic" | "emergent"
- `phase` — "entrance" | "portal"
- `identity` — the visitor's entrance answer (their resonant signature)
- `openV` — which vessel is expanded (null = none)
- `sageText` / `sageIn` / `history` — Sage conversation state
- `hits` — Sage exchange count (threshold offer reveals at 2+)
- `modeSheetOpen` — mobile mode bottom sheet

### Key Objects
- `T` — design token object (typography scale, spacing scale, line heights)
- `MODES` — three mode definitions (colors, prompts, particle config, CTA style)
- `VESSELS` — nine vessel data objects (num, name, theme, body, reflection, interaction, invocation, cta)

### Key Components
- `App` — root, holds all state, renders Nav + Entrance or Portal
- `VesselDetail` — extracted component, shared by mobile (inline) and desktop (panel)
- `useAtmosphere()` — canvas hook, atmospheric particle field, mode-reactive
- `useIsMobile()` — breakpoint hook, triggers at 640px

### Mobile vs Desktop
- `isMob = useIsMobile()` — boolean available throughout
- Nav: desktop = three mode buttons + school name | mobile = brand + mode pill
- Mode selection: desktop = inline buttons | mobile = slide-up bottom sheet
- Vessel grid: desktop = `repeat(auto-fit, minmax(280px, 1fr))` | mobile = `1fr`
- Vessel layout: desktop = horizontal cup card | mobile = horizontal row (num / name / chevron)
- Bottom tab bar: mobile portal only — mode indicator + identity echo + Sage jump

---

## What is Complete (Do Not Rebuild)

- ✅ All WCAG AA contrast — three modes fully audited and corrected
- ✅ Manus Phase 1, 2, 3 fixes — all visual audit items resolved
- ✅ Mobile-first responsive layout — tested at 375px and 390px
- ✅ Nav: 14px, nowrap, ::after underline, no overflow
- ✅ Vessel grid: structured, no truncation, no collision
- ✅ Placeholder contrast: 0.5 opacity via CSS variable
- ✅ CTA buttons: 48px minHeight, correct padding, Oceanic filled
- ✅ Three Sage system prompts: mode-specific, identity-interpolated
- ✅ Threshold commerce: reveals after 2 Sage exchanges
- ✅ Atmospheric canvas: 44 particles, mode-colored, cleanup on unmount

---

## What Is Next (Phase 1 — Start Here)

### Day 1 — No code required

Create the **Content Master Sheet**. Spreadsheet. 9 rows (one per vessel) × 6 columns:

| Column | What It Is | Who Writes |
|--------|-----------|------------|
| Body | 2–3 sentence orientation | Dev team drafts, KzA approves |
| Reflection | 1–2 sentence depth layer | Source from workbook verbatim |
| Interaction | 1 sentence — what the visitor does | Dev team |
| Invocation | Haiku — verbatim from workbook | Vessels 01–07 done. 08–09 pending KzA |
| CTA Label | Button text | Dev team |
| Sage Seed | Pre-loaded Sage input text from vessel | Dev team |

Source material: `CREATIVE_STEEPING_The_Workbook.pdf` (in the project repository). The workbook REFLECTION sections map directly to vessel Reflection slots. Read the seven steeps before writing a word.

**No vessel goes live without all six slots approved by KzA.**

### Days 2–3 — One developer, no new code

Enrich the three Sage system prompts. Full spec in Section 04 of the brief. Add:
- Seven steep names in sequence
- Core vocabulary (steeping, resonance, trace, threshold, infusion, knowing)
- The equation: `Patience × Procrastination = Steeping`
- The phrase: `"Deliberation is where purpose can become de:liberated from the idea"`
- Per-mode Invocation tone vocabulary (Oceanic: Stillness/Resonance, Incandescent: Alchemy/Embodiment, Emergent: Courage/Unveiling)

Document the enriched prompts as `SAGE-PROMPTS-v2.md` in the repository.

---

## Production Checklist (Phase 5)

When content is approved and you are moving to deployed production:

- [ ] Extract into Next.js or Vite project — component structure in brief Section 05
- [ ] Move Sage API call to server-side route (`/api/sage`) — never client-side key
- [ ] Replace `window.storage` with Supabase or Firebase (one table: `traces`, two columns: `identity_string`, `created_at`)
- [ ] Add OpenGraph + Twitter card meta tags
- [ ] Preload Google Fonts
- [ ] Reduce canvas particles to 20 on mobile (currently 44)
- [ ] Test on physical devices: iPhone SE (375px), iPhone 14 (390px), iPad (768px), desktop (1280px+)

---

## Design System Quick Reference

All values are in the `T` constant at the top of `steeping-portal-v4.jsx`.

```javascript
// Typography
T.xs   = "0.75rem"   // 12px — microcopy
T.sm   = "0.875rem"  // 14px — nav, footer, labels, CTAs
T.base = "1rem"      // 16px — body
T.md   = "1.25rem"   // 20px — sub-headings
T.lg   = "1.75rem"   // 28px — quotes
T.xl   = "2.5rem"    // 40px — secondary headings

// Spacing (8px base unit)
T.s3 = "1rem"    // 16px — button padding
T.s4 = "1.5rem"  // 24px — component gaps
T.s5 = "2rem"    // 32px — grid gap, section padding
T.s6 = "3rem"    // 48px — page padding
T.s7 = "4rem"    // 64px — hero spacing
```

**Rules that do not bend:**
- 20px minimum body text. Always.
- 400 weight minimum for body copy. Never light.
- 44px minimum touch target. 48px for primary CTAs.
- No hardcoded colors. Everything goes through `MODES[mode]`.
- No new pixel values that don't map to a `T` token.

---

## Vocabulary (Use These Terms Precisely)

| Term | Meaning |
|------|---------|
| Steeping | The practice — not "meditation," not "journaling" |
| Steepee | A practitioner — not "user," not "participant" |
| Vessel | A portal navigation card — also the container (cup, mind, body) |
| Resonant Signature | The visitor's entrance identity answer |
| Trace | What a visitor leaves — anonymous, stored in community memory |
| Threshold | A critical crossing point — earned, not presented |
| Invocation | The haiku closure of each steep — not a prompt, not an instruction |
| The Sage | The AI elder — demonstrates, never instructs, eternally forward |
| The Equation | `Patience × Procrastination = Steeping` — never alter it |

Full vocabulary in Section 08 of the brief.

---

## Repository Source Documents

These must be in the project repository alongside this package:

| File | Role |
|------|------|
| `CREATIVE_STEEPING_The_Workbook.pdf` | Primary content source — seven steeps, all invocations |
| `Creative_Steeping_eBook_Draft.pdf` | eBook arc, welcome voice, community framing |
| `CREA_TIVE_STEEPING___UI_Feedback_Roadmap.pdf` | Manus visual audit — annotated screenshots |
| `CREA_TIVE_STEEPING___UI_Implementation_Guide___Fixes.md` | Manus developer prompt — tokens, fix order |
| `Synthesis__The_Quiet_Warrior___The_Creative_Steeping_UI.md` | Triakis Protocol synthesis |

---

## Questions

If something in this package conflicts with something in the brief, the brief wins.

If something in the brief conflicts with something in the workbook, the workbook wins.

If you need to make a decision that isn't covered, apply the one test:

**Does this deepen the visitor's relationship with their own creative identity, or does it distract from it?**

---

*Assembled by Claude (Anthropic) at the direction of Kamau Zuberi Akabueze.*
*THE ÅLïEN SCöÕL for Creative Thinking · thealienschool.com*
*v4 Offload · February 2026*
