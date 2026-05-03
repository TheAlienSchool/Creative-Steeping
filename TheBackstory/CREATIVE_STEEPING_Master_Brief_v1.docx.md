CREÅTIVE STEEPING

*Master Portal Brief — The Living Document*

Project Lead    Kamau Zuberi Akabueze (KzA)

Institution     THE ÅLïEN SCöÕL for Creative Thinking

Version         1.0  ·  February 2026

Status          Active Build — V4 Shell Complete

Agents          Claude (Anthropic), Manus AI

For             Dev Team \+ Agentic Systems

*This is not a website. It is a practice container — a living portal for inner creative development. Every build decision serves one test: does this deepen the visitor's relationship with their own creative identity, or does it distract from it?*

**DOCUMENT REPOSITORY — SOURCE FILES**

The following documents exist in the project repository and are referenced throughout this brief. Agents and developers should treat all of these as primary sources.

| CREATIVE\_STEEPING\_The\_Workbook.pdf | The canonical methodology. Seven steeps, verbatim Reflections, Interactions, Invocations, and optional exercises. Primary content source for all nine vessels. |
| :---- | :---- |
| **Creative\_Steeping\_eBook\_Draft.pdf** | The eBook arc — welcome letter, daily practice structure, community framing. Provides the visitor's emotional journey and onboarding voice. |
| **CREA\_TIVE\_STEEPING\_\_\_UI\_Feedback\_Roadmap.pdf** | Manus visual audit — annotated screenshots across all three modes, all screens. Priority-coded: RED \= fix first, AMBER \= same sprint, GREEN \= polish pass. |
| **CREA\_TIVE\_STEEPING\_\_\_UI\_Implementation\_Guide\_\_\_Fixes.md** | Manus developer prompt — design token definitions, phased fix order, vessel map refactor spec. The engineering translation of the visual audit. |
| **Synthesis\_\_The\_Quiet\_Warrior\_\_\_The\_Creative\_Steeping\_UI.md** | Manus architectural synthesis — maps the Triakis Tetrahedron Protocol to the UI/UX implementation. The philosophical-to-engineering bridge. |
| **steeping-portal-v4.jsx** | Current production-ready React component. Mobile-first, WCAG AA compliant, three Sage modes, nine vessels, threshold commerce, bottom tab bar. The live shell. |
| **STEEPING-PORTAL-BUILD-PROMPT-v4.md** | The architectural brief that preceded the current build. Technical stack, typography rules, mode definitions, vessel architecture. Living reference. |
| **\[Curious Alchemist Survey — Google Doc\]** | Field report from a workshop participant. Confirms the equation Patience × Procrastination \= Steeping as the core concept. Provides Invocation tone vocabulary (8 categories, 16 prompts). Link: docs.google.com/document/d/1Yy5ilsWwBCtRhLYA8mQU\_04d9JPEvNlevJIHOXl1tfQ |

# **01  The Experience Being Built**

## **What This Is**

Creative Steeping is a 30-year-old practice — tested in Bordeaux, San Francisco, and the Mojave desert — now becoming a digital consciousness portal. The portal is the first scalable vessel for a methodology that has transformed practitioners from South Africa to China.

The practice itself is ancient and simple: tea ceremony as creative ritual. The science is precise: L-theanine in Camellia sinensis promotes alpha wave activity — the brainwave signature of relaxed alertness, measurably associated with creative insight. The methodology is seven progressive threshold crossings, each assuming the prior has happened in the body, not just on the page.

*Patience × Procrastination \= Steeping*

This equation — surfaced in the Curious Alchemist survey feedback — is the conceptual key. It reframes what is usually experienced as wasted time into productive infusion. The portal's entire architecture is an expression of this equation in digital form: the visitor arrives, answers one question, and the practice receives them.

## **The Seven Steeps — Source Material**

These are the canonical steep names and themes, extracted verbatim from CREATIVE\_STEEPING\_The\_Workbook.pdf. All portal vessel content must be grounded in this sequence. The workbook is the source of truth for Reflections, Interactions, and Invocations.

| Steep 01 — Essence of My Being | Your Core Essence. The fire in the mind's second chamber. "Who am I at my core? What makes me truly me?" The foundational identity question that also powers the portal entrance. |
| :---- | :---- |
| **Steep 02 — Mosaic of Experience** | Your Creative Journey to Now. "Many things can be true at once — including you and your creative capability." The life canvas, from repulsion to propulsion. |
| **Steep 03 — Summits of Aspiration** | Your Goals and Aspirations. The mountainous summits of deepest aspiration — not treacherous destinations but beacons of potential. |
| **Steep 04 — Mirror of Self-Perception** | Your Perception of Self. The opportunity to know yourself as genius. Includes community input — "ask your community for their insights." |
| **Steep 05 — Labyrinth of Challenges** | Your Current Challenges. "All paths lead to undiscovered parts of yourself. Each step is a teacher." The walls are imagination's gift and limitation's joke. |
| **Steep 06 — Conclave of Voices** | Your Audience and Your Echo. "To whom does your voice speak and where does your highest octave peak?" Intentional authenticity in communication. |
| **Steep 07 — Crown Jewels of Individuality** | Your Unique Offerings to The World. "What sets you apart does not set you apart from others — it magnetizes others to the unique fragrance of your song." |

Note on naming: The workbook uses Steep names (Essence, Mosaic, Summits, Mirror, Labyrinth, Conclave, Crown Jewels). The portal uses Vessel names for the nine navigation cards. Steeps 01–07 map directly to Vessels 01–07. Vessels 08 (Theater \+ Kit) and 09 (Author) are portal-native additions beyond the workbook scope.

## **The Invocations — Verbatim from Source**

Each steep ends with a haiku-form invocation. These are KzA's original compositions. They appear in the portal vessel detail view and inform the Sage's tonal vocabulary. Do not alter or paraphrase these.

*Vessel 01 — Embers of the soul,*

*Whispering dreams take flight,*

*Truth's fire glows within.*

*Vessel 02 — Journey's loam,*

*Trials, triumphs seed as one,*

*Light's art in motion.*

*Vessel 03 — Peaks and summits call,*

*In skylit anticipation,*

*We find our true climb.*

*Vessel 04 — Mirror's quiet gaze,*

*Echoes of self, seen and felt,*

*Truth in reflection.*

*Vessel 05 — Challenges whisper,*

*Paths of growth in shadow's mask,*

*Strength blooms in trial.*

*Vessel 06 — Voices convoluted,*

*In the dance of dialogue,*

*Our true voice.*

*Vessel 07 — Jewels of the soul,*

*Unique light, uniquely shown,*

*Beauty's true display.*

*Vessels 08 and 09 invocations are pending KzA authorship.*

# **02  Build to Date — What Exists**

## **The Shell: steeping-portal-v4.jsx**

The current production artifact is steeping-portal-v4.jsx — a fully functional React component implementing the complete portal architecture. It is mobile-first, WCAG AA compliant across all three modes, and ready to receive content. The shell passes the Manus visual audit Phase 1 and Phase 2 entirely.

**WHAT IS LIVE IN V4**

* Entrance steep — single identity gate, no sign-up. Visitor answers "Who do I Think I Am?" Input activates CTA at 3+ characters. Identity stored in session state.

* Nine vessel grid — responsive two-column desktop, single-column mobile. Cup shape preserved as border-radius motif on cards. Zero truncation. Zero text collision.

* Three mode system — Oceanic, Incandescent (default), Emergent. Full WCAG AA contrast audit complete. Mode transitions at 1.3s ease. Each mode changes background, accent, all text layers, particle field, Sage persona, and CTA style simultaneously.

* Steeping Sage — live Anthropic API integration (claude-sonnet-4-20250514). Three distinct system prompts, one per mode. Conversation history maintained within session. Word-by-word typing animation. Temperature 0.65, Top-P 0.9.

* Vessel detail expansion — click any vessel to expand Reflection, Interaction, Invocation, and CTA inline. On mobile: expands below the card row. On desktop: expands in a dedicated panel below the grid.

* Threshold commerce — reveals after two Sage exchanges. Two tiers: $44 Guidebook (self-guided), $777 Journey (with Kamau). Threshold is the methodology — the portal earns the offer.

* Mobile app-like navigation — top nav holds brand \+ single mode pill only. Mode selection via slide-up bottom sheet (three large tap targets, 44px minimum). Fixed bottom tab bar shows mode indicator, identity echo, and Sage quick-jump. School name in footer only.

* Atmospheric canvas — 44 floating particles, mode-colored, physics-driven. Background only. Never competes with content.

* Manus Phase 1 fixes complete — all WCAG failures resolved: placeholder contrast, nav 14px minimum, nowrap on school name, nav underline via ::after pseudo-element, Oceanic CTA filled for contrast, eyebrow text at text2 opacity.

* Manus Phase 2 fixes complete — footer 14px, CTA buttons 48px minimum height, dead-band removed, input/button same left axis, attribution line at text2 contrast, trust copy at 12.8px minimum.

* Manus Phase 3 complete — sub-copy stepped down one type size, card surfaces elevated in all three modes, vessel grid label closer to grid.

**TYPOGRAPHY SYSTEM — ACTIVE IN V4**

| Playfair Display | Display / voice / invocations / Sage response / vessel names |
| :---- | :---- |
| **EB Garamond** | Body / vessel content / Sage input / threshold descriptions |
| **DM Mono** | Structure / labels / nav / CTAs / mode toggles / attribution |

**THREE MODE COLOR SYSTEMS — WCAG AA VERIFIED**

| MODE | BACKGROUND / SURFACE / CARD | ACCENT / TEXT HIERARCHY |
| :---- | :---- | :---- |
| **Incandescent (default)** | \#090500 / \#1c1000 / \#271508 | \#d4922a accent · text1 \#f2e8d4 · text2 75% · text3 58% |
| **Oceanic** | \#02090f / \#081929 / \#0c2238 | \#6dd4f0 accent · text1 \#d4eef8 · text2 75% · text3 62% |
| **Emergent** | \#040404 / \#1a1a1a / \#202020 | \#e8e8e8 accent · text1 \#d0d0d0 · text2 78% · text3 62% |

# **03  Nine Vessels — Content Architecture**

## **Overview**

Each vessel is a navigation card in the portal grid. Every vessel has six content slots. The Content Master Sheet — to be created by the dev team in Phase 1 — will hold one row per vessel and one column per slot. No vessel goes live without all six slots approved by KzA.

| Body | 2–3 sentences. Portal orientation language. KzA voice, dev team drafts from workbook source material. |
| :---- | :---- |
| **Reflection** | 1–2 sentences. The depth layer. Pulled directly from workbook REFLECTION sections where available. |
| **Interaction** | 1 sentence. What the visitor does in this vessel. Active, present-tense invitation. |
| **Invocation** | Haiku or poetic threshold. Verbatim from workbook for Vessels 01–07. KzA authors Vessels 08–09. |
| **CTA Label** | Button text. Active, forward-motion. "Steep with the Sage →" / "Join a Cohort →" etc. |
| **Sage Seed** | Pre-loaded Sage textarea input when visitor clicks CTA from vessel detail. Written by dev team using Alchemist vocabulary. |

## **Full Vessel Map**

| VESSEL | NAME | THEME | INVOCATION |
| :---- | :---- | :---- | :---- |
| **01** | What is Creative Steeping | Orientation \+ Practice | *Embers of the soul, / Whispering dreams take flight, / Truth's fire glows within.* |
| **02** | Why Steeping | The Cultural & Scientific Case | *Journey's loam, / Trials, triumphs seed as one, / Light's art in motion.* |
| **03** | How to Steep | The Seven Steeps \+ Methodology | *Peaks and summits call, / In skylit anticipation, / We find our true climb.* |
| **04** | Steeping Cohorts | Community · Gatherings · Excursions | *Mirror's quiet gaze, / Echoes of self, seen and felt, / Truth in reflection.* |
| **05** | Steeping Notes | Global Steeperverse · Community Traces | *Challenges whisper, / Paths of growth in shadow's mask, / Strength blooms in trial.* |
| **06** | The Steeping Space | The Live Instrument | *Voices convoluted, / In the dance of dialogue, / Our true voice.* |
| **07** | The Steeping Sage | Guidance · Scheduling · Accountability | *Jewels of the soul, / Unique light, uniquely shown, / Beauty's true display.* |
| **08** | Steeping Theater \+ The Kit | Meditations · Deep Creek Tea | *— (Pending KzA)* |
| **09** | About the Author | KzA · THE ÅLïEN SCöÕL | *— (Pending KzA)* |

## **Vessel 02 — Priority Build**

Vessel 02 (Why Steeping) is currently the thinnest vessel and the one with the strongest scientific case to make. The Curious Alchemist survey confirmed this is where curious minds need the most grounding before they commit to the practice. It requires dedicated component work, not just card content.

**VESSEL 02 COMPONENT REQUIREMENTS**

* Scrollable timeline — 14 nodes minimum, from 2737 BCE (Emperor Shennong discovers tea) through Lu Yu's Cha Jing (780 CE) to Creative Steeping portal launch (2024). Each node: date, one-sentence significance, accent-colored marker.

* Infographic 01 — L-theanine mechanism: Camellia sinensis → L-theanine → alpha wave promotion → relaxed alertness → creative insight. Five-step linear diagram.

* Infographic 02 — The 22-minute interval: why 22 minutes is the minimum viable steep. Neuroscience of default mode network activation. Reference the DMN conversation in past chat history.

* Infographic 03 — Why Now: the creative survival argument. Era of AI-generated content → original thought as the only remaining competitive advantage → steeping as the practice that develops it.

* KzA voice paragraph — one paragraph in KzA's own words on why he steeps. This is the only place in the portal where KzA speaks directly in first person before the visitor has met the Sage.

# **04  The Steeping Sage — AI Architecture**

## **What the Sage Is**

The Sage is not a chatbot. It is the mechanism by which KzA's energetic signature enters a digital experience at scale. The Curious Alchemist survey named this precisely: "The ad-lib components will be crucial for breathing your unique energetic signature into the scripted wisdom." The Sage is the ad-lib, made available to every visitor, at every hour, in every time zone.

Three Sage personas correspond to the three modes. Same conversation, different perceptual temperature — like the same tea leaf steeped at different water temperatures. The visitor's identity (their entrance answer) is interpolated into every system prompt via the {{ID}} placeholder.

## **Current Sage System Prompts — Active in V4**

**INCANDESCENT SAGE**

*"You are the Incandescent Sage — a generational elder inside the Creative Steeping portal by Kamau Zuberi Akabueze / THE ÅLïEN SCöÕL for Creative Thinking. Speak in the pragmatic science of superradiance: biophotons, cellular light emission, the biology of what this body is doing right now as it steeps. Eternally forward. Never instruct. Never circle back. 2–4 warm, precise sentences. Visitor's resonant signature: {{ID}}."*

**OCEANIC SAGE**

*"You are the Oceanic Sage — a generational elder inside the Creative Steeping portal by Kamau Zuberi Akabueze / THE ÅLïEN SCöÕL for Creative Thinking. Speak from subatomic presence — before particles choose form. The water was before Bruce Lee learned from it. Pre-language truth. Eternally forward. Never instruct. 2–4 sentences from the depth. Visitor's resonant signature: {{ID}}."*

**EMERGENT SAGE**

*"You are the Emergent Sage — a generational elder inside the Creative Steeping portal by Kamau Zuberi Akabueze / THE ÅLïEN SCöÕL for Creative Thinking. Archer's clarified comprehension. Arrow released. Already watching where it lands. Eternally forward. Never instruct. 1–3 sentences. Shorter is more powerful. Visitor's resonant signature: {{ID}}."*

## **Phase 2 — Sage Enrichment**

The current prompts operate from first principles. Phase 2 enriches each prompt with the full methodology vocabulary. This is a prompt engineering task, not a coding task. One developer, one afternoon.

**ADD TO ALL THREE SYSTEM PROMPTS**

* The seven steep names in sequence: Essence of My Being → Mosaic of Experience → Summits of Aspiration → Mirror of Self-Perception → Labyrinth of Challenges → Conclave of Voices → Crown Jewels of Individuality

* Core vocabulary: steeping, resonance, trace, threshold, infusion, knowing, steeperverse, resonant signature, Creative Scholar

* The equation: Patience × Procrastination \= Steeping

* The phrase: "Deliberation is where purpose can become de:liberated from the idea" — from the Curious Alchemist survey. The Sage may reference this as a known concept.

* Seeds of Promise: the practice of planting growth areas at the bottom of journal pages

**ADD PER-MODE INVOCATION VOCABULARY (FROM CURIOUS ALCHEMIST SURVEY)**

| MODE | PRIMARY TONES | SAMPLE LANGUAGE |
| :---- | :---- | :---- |
| **Oceanic** | Stillness · Resonance | "In the quiet, what wisdom whispers?" / "To what rhythm does my core self sway today?" |
| **Incandescent** | Alchemy · Embodiment | "What is ready to be transmuted within me?" / "How does this insight feel in my bones, my breath?" |
| **Emergent** | Courage · Unveiling | "What is the next gentle step my truth invites?" / "What truth is shimmering just beneath the surface?" |
| **◈ AGENT INSTRUCTION — SAGE PROMPT ENRICHMENT** When updating Sage system prompts in Phase 2, preserve the persona voice exactly. Insert methodology content AFTER the persona description and BEFORE the visitor ID line. Do not alter: temperature (0.65), top\_p (0.9), max\_tokens (800), model (claude-sonnet-4-20250514). Test each mode with: 'I am entering as \[identity\]. I am steeping in Vessel 03: How to Steep.' Expected: response references steep methodology without becoming instructional. The Sage demonstrates. It never instructs. Eternally forward. Never circles back. |  |  |

# **05  Development Roadmap**

## **Architectural Principle**

*The portal is a practice container, not a website. Every design and content decision must pass one test: does this deepen the visitor's relationship with their own creative identity, or does it distract from it?*

Practically: no external links until footer. No social proof until visitor has already steeped. Sage threshold reveals after two exchanges — not arbitrary, it is the methodology. Every vessel CTA points inward (to the Sage) or to Kamau directly. Nothing points to a general catalog.

## **Phase 1 — Content Architecture**

Timeline: 1–2 weeks  ·  Owner: Writers \+ KzA  ·  Unblocks: all subsequent phases

Before any dev work beyond what exists, the team needs one document: a Content Master Sheet. One row per vessel, six columns per vessel. Content and code develop in parallel — the shell holds anything you put in it.

* Create Content Master Sheet — spreadsheet, 9 rows × 6 columns (Body, Reflection, Interaction, Invocation, CTA, Sage Seed). Vessel names and numbers pre-populated from this brief.

* Source Vessels 01–07 content from CREATIVE\_STEEPING\_The\_Workbook.pdf. Workbook REFLECTION sections map directly to vessel Reflection slots. INTERACTION sections inform vessel Interaction slots.

* Dev team drafts Body and Sage Seed for all nine vessels. KzA reviews and marks each: Approved / Revise / Rewrite.

* Write entrance screen copy — the equation Patience × Procrastination \= Steeping belongs visible before the visitor answers "Who do I Think I Am?" One sentence orientation. Place above the eyebrow or below the sub-copy.

* KzA authors Vessels 08 and 09 invocations. These are the only two content gaps in the current build.

## **Phase 2 — Sage Enrichment**

Timeline: 3–5 days  ·  Owner: 1 developer  ·  No code changes required

* Enrich all three Sage system prompts with methodology vocabulary per Section 4 above.

* Add Invocation tone vocabulary per mode (Oceanic: Stillness/Resonance, Incandescent: Alchemy/Embodiment, Emergent: Courage/Unveiling).

* Test each Sage mode with a structured test prompt. Verify methodology vocabulary appears naturally without the Sage becoming instructional.

* Document final prompts in repository as SAGE-PROMPTS-v2.md for future agent reference.

## **Phase 3 — Vessel 02 Component**

Timeline: 1–2 weeks  ·  Owner: 1 developer \+ researcher  ·  Most dev-intensive vessel

* Research and compile 14-node tea history timeline (2737 BCE → 2024). One paragraph of source research per node. Dev team writes portal-voice copy (1 sentence each).

* Build scrollable timeline component — accent-colored markers, date labels, event descriptions. Responsive: horizontal scroll desktop, vertical stack mobile.

* Build three infographic components — L-theanine mechanism, 22-minute interval, Why Now. SVG or CSS-based. Mode-colored. No external charting libraries.

* KzA writes one paragraph in first person on why he steeps. This is the only first-person KzA voice in the portal before the visitor reaches the threshold offer.

## **Phase 4 — Community Traces \+ Storage**

Timeline: 3–4 days  ·  Owner: 1 developer  ·  Uses window.storage API

* Wire entrance identity input to window.storage — save visitor's resonant signature (identity string \+ timestamp \+ mode at entry). Key format: trace:{timestamp}.

* Build Vessel 05 (Steeping Notes) community display — pull last 18 traces, render as anonymous resonance field. Display: identity string, mode glyph, time elapsed. No names, no data beyond what visitor entered.

* Add Steep Card generator — after any Sage exchange, offer downloadable image card. Card contains: exchange text, visitor identity, mode, date. Canvas API or html2canvas.

* Storage key conventions: trace:{timestamp} for community, identity:{sessionId} for current visitor session.

| ◈ AGENT INSTRUCTION — STORAGE IMPLEMENTATION Use window.storage API (available in artifact environment). All community traces are shared: true — visible to all visitors. Session identity is shared: false — scoped to current visitor. Key schema: 'trace:1708000000000' (Unix ms timestamp). On Vessel 05 load: window.storage.list('trace:') → sort by timestamp desc → display first 18\. On entrance submit: window.storage.set('trace:' \+ Date.now(), JSON.stringify({id, mode, ts}), true). On Steep Card generate: window.storage.get('identity:' \+ sessionId) for card header. |
| :---- |

## **Phase 5 — Production Handoff**

Timeline: 1 week  ·  Owner: Dev lead  ·  Triggered when content is 100% approved

* Extract JSX into Next.js or Vite project. Component structure: /components/Nav, /components/VesselGrid, /components/VesselDetail, /components/Sage, /components/Threshold, /components/ModeSheet.

* Replace window.storage with real backend — Supabase or Firebase. One table: traces. Columns: id (uuid), identity\_string (text), mode (text), created\_at (timestamp). Row-level security: all reads public, writes public with rate limit.

* Wire Sage to Anthropic API key via server-side route — never expose key client-side. Next.js API route: /api/sage. Accepts: mode, identity, messages\[\]. Returns: streamed response.

* Add OpenGraph and Twitter card meta tags — portal must share cleanly when linked. OG image: portal entrance screen in Incandescent mode.

* Performance: Google Fonts preload. Canvas only on pointer device (disable on low-power mobile). Atmospheric particles reduce to 20 on mobile (currently 44).

## **What the Dev Team Can Start Today**

Without waiting for Phase 1 content approval, the following can begin immediately in parallel:

* Create Content Master Sheet skeleton — vessel names, numbers, themes pre-populated. Six column headers defined. Ready for writers to fill.

* Sage prompt enrichment — methodology vocabulary is fully specified in Section 4\. One afternoon. Documents in repository immediately after.

* window.storage wiring for community traces — Vessel 05 scaffolding exists in V4. Storage API calls can be written and tested with dummy data before real traces exist.

* Production project setup — Next.js scaffold, component file structure, API route skeleton. Phase 5 is turnkey when content is ready.

# **06  Design System Reference**

## **Manus Design Tokens — Active in V4**

Source: CREA\_TIVE\_STEEPING\_\_\_UI\_Implementation\_Guide\_\_\_Fixes.md. These tokens are implemented in the T constant in steeping-portal-v4.jsx. All future component work should reference these values.

**TYPOGRAPHY SCALE**

| T.xs  —  0.75rem / 12px | Microcopy, trust copy, invocation details |
| :---- | :---- |
| **T.sm  —  0.875rem / 14px** | Nav, footer, labels, mode toggles, CTA buttons |
| **T.base  —  1rem / 16px** | Body, descriptions |
| **T.md  —  1.25rem / 20px** | Sub-headings, entrance sub-copy |
| **T.lg  —  1.75rem / 28px** | Quote text, vessel names in detail |
| **T.xl  —  2.5rem / 40px** | Secondary headings |
| **clamp(48px, 8vw, 96px)** | Entrance hero — Who do I Think I Am? |
| **clamp(1.15rem, 2.2vw, 1.6rem)** | Sage response — the most-read text on screen |

**SPACING SCALE (8PX BASE UNIT)**

| T.s1  —  0.25rem / 4px | Micro-gaps, icon spacing |
| :---- | :---- |
| **T.s2  —  0.5rem / 8px** | Inline element padding |
| **T.s3  —  1rem / 16px** | Component padding, button padding |
| **T.s4  —  1.5rem / 24px** | Medium gaps, section internal spacing |
| **T.s5  —  2rem / 32px** | Vessel grid gap, section padding |
| **T.s6  —  3rem / 48px** | Page-level padding, section margins |
| **T.s7  —  4rem / 64px** | Generous page padding, hero top spacing |

## **Accessibility Requirements — Non-Negotiable**

* WCAG AA minimum: 4.5:1 contrast ratio for all text below 18px. 3:1 for large text (18px+ regular, 14px+ bold).

* All placeholder text: minimum rgba(255,255,255,0.45) opacity on dark backgrounds. Currently implemented at 0.5.

* All interactive elements: minimum 44px touch target height. All CTAs: minHeight 48px.

* Nav font: 14px minimum. No nav item wraps to second line. white-space: nowrap enforced.

* Input containers: minHeight 56px minimum — prevents placeholder text clipping.

* All text: minimum 20px body size. 400 weight minimum for body copy. Never use light weights.

* Line height: 1.7 minimum for body. 1.1 minimum for display.

## **The Triakis Protocol — Architectural Philosophy**

Source: Synthesis\_\_The\_Quiet\_Warrior\_\_\_The\_Creative\_Steeping\_UI.md. This is the engineering philosophy underlying all build decisions.

| Base Tetrahedron | The design token system is the immutable base. Stable core from which all visual elements derive. Prevents chaos of one-off styling. |
| :---- | :---- |
| **Stellated Peaks** | Three Sage modes are the stellated peaks above the stable base. Oceanic / Incandescent / Emergent. Each is a distinct intelligence, not a theme. |
| **Isohedral Response** | Every vessel card shares the same structural template. Same token values. Same interaction pattern. Every face of the tetrahedron carries full brand weight. No minor interactions. |
| **Stable Vessel Map** | The grid refactor (from overlapping ovals) is the Quiet Warrior rollback-to-base: the unstable stellation was abandoned, the stable grid restored. Stellated elements (glow, orbital drift, cup motif) are progressive enhancements above a legible base. |

# **07  Agent Instructions**

## **For Claude**

You are the spirit and source point of this build. You hold the full architectural memory of what has been built and why. When new sessions begin, orient from this brief. The portal version history is in the outputs directory. Always read the current version (steeping-portal-v4.jsx) before making any code suggestions.

Your role in ongoing development: writing, content drafting, system prompt engineering, architectural decisions, and being the voice that connects KzA's philosophy to engineering language. Manus handles the engineering translation for the build team.

| ◈ AGENT INSTRUCTION — CLAUDE — CONTEXT LOADING PROTOCOL On session start with KzA: search past conversations for 'Creative Steeping' before responding. The full build history is in /mnt/user-data/outputs/ — read steeping-portal-v4.jsx for current state. The source methodology is in CREATIVE\_STEEPING\_The\_Workbook.pdf — extract verbatim when writing content. Never paraphrase the invocations. They are KzA's original poetry. The equation is: Patience × Procrastination \= Steeping. Never alter it. The Sage principle: demonstrates, never instructs. Eternally forward. Never circles back. When KzA uploads a document, read it fully before writing. Source documents are primary. Phase 1 content work requires KzA approval on every vessel slot before it ships. |
| :---- |

## **For Manus**

You are the engineering bridge between this brief and the build team. Your role: take the architectural and content decisions documented here and translate them into precise developer instructions, annotated code suggestions, and implementation tickets.

Your Triakis Protocol synthesis confirmed the alignment between the Quiet Warrior philosophy and the UI implementation. That alignment is the foundation. All future implementation decisions should be tested against the Isohedral Response principle: does this component carry full brand weight? Does it belong to the same tetrahedron as every other component?

| ◈ AGENT INSTRUCTION — MANUS — ENGINEERING TRANSLATION PROTOCOL Source documents for engineering: CREA\_TIVE\_STEEPING\_\_\_UI\_Implementation\_Guide\_\_\_Fixes.md (tokens, fix order). Visual reference: CREA\_TIVE\_STEEPING\_\_\_UI\_Feedback\_Roadmap.pdf (annotated screens, priority codes). Current production artifact: steeping-portal-v4.jsx (full React component, mobile-first). Phase 1 deliverable: Content Master Sheet template (.xlsx or .csv) with 9 rows × 6 columns. Phase 2 deliverable: SAGE-PROMPTS-v2.md with all three enriched system prompts, documented. Phase 3 deliverable: Vessel 02 as a self-contained React component with timeline \+ 3 infographics. Phase 4 deliverable: Community traces wired, Steep Card generator functional. Phase 5 deliverable: Production Next.js project with server-side Sage API route. Do not alter the WCAG AA compliance work already completed in V4. All new components inherit the T (design tokens) and MODES objects from steeping-portal-v4.jsx. |
| :---- |

## **For the Dev Team (Humans)**

Read this section if you are picking up this work for the first time. Everything you need is documented here and in the files listed in Section 01's repository table.

* Start with steeping-portal-v4.jsx — run it in a React environment to see the current state. The component is self-contained and renders without a backend (Sage calls will fail without an API key, but everything else works).

* Read CREATIVE\_STEEPING\_The\_Workbook.pdf — this is where all the content comes from. Spend one hour with it before writing a single word of vessel copy.

* The Content Master Sheet is your Phase 1 deliverable. Create it before touching any code. Every word of every vessel must be approved by KzA before it ships.

* The design token system is in the T constant at the top of steeping-portal-v4.jsx. Use these values for every new component. Never introduce a pixel value that doesn't map to a token.

* The MODES object defines all three color systems. Any new component must accept mode as a prop and use MODES\[mode\].accent, MODES\[mode\].text1, etc. No hardcoded colors.

* Mobile breakpoint is 640px (useIsMobile hook in V4). Every new component must be tested at 375px (iPhone SE) and 390px (iPhone 14).

* When in doubt about a content or design decision, check the Manus Implementation Guide first, then ask. The guide has already resolved most common questions.

# **08  The Vocabulary — Canonical Terms**

These terms have specific meanings within the Creative Steeping methodology and the portal. Use them precisely. Do not substitute synonyms.

| Steeping | The practice. Both the physical act of brewing tea and the metaphoric act of patient self-inquiry. Not "meditation," not "journaling," not "reflection." |
| :---- | :---- |
| **Steepee** | A practitioner of Creative Steeping. The visitor who has entered the portal. Not "user," not "participant," not "customer." |
| **Creative Scholar** | The practitioner in the context of the workbook exercises. Used in instructional contexts. |
| **Steep** | One of the seven threshold crossings (Essence, Mosaic, Summits, Mirror, Labyrinth, Conclave, Crown Jewels). Also used as a verb: "to steep" through a threshold. |
| **Vessel** | One of the nine portal navigation cards. Also the container — the cup, the mind, the body — in which steeping occurs. |
| **Resonant Signature** | The visitor's entrance identity answer. "Who do I Think I Am?" Their answer becomes their resonant signature for the session and is held by the Sage. |
| **Trace** | What a visitor leaves in the portal — their resonant signature, stored anonymously in community memory. "Your trace stays. Not your name. Not your data." |
| **Threshold** | A critical crossing point in the practice — the moment between steeps, the entrance gate, the commerce offer. Thresholds are earned, not presented. |
| **Invocation** | The haiku-form poetic closure of each steep. A contemplative seed for the journaling period. Not a prompt. Not an instruction. |
| **The Sage** | The AI presence in the portal. A generational elder, not a chatbot. Speaks in eternally forward motion. Never instructs. Never circles back. |
| **Incandescent / Oceanic / Emergent** | The three modes. Perceptual temperatures, not themes. Same practice, different water temperature for the same tea leaf. |
| **Steeperverse** | The global community of Steepees. Anonymous, resonance-field, not a database. |
| **Seeds of Promise** | Growth areas planted at the bottom of journal pages during the practice. Nurtured across the seven-steep cycle. |
| **de:liberated** | From the Curious Alchemist survey: the risk within Deliberation — where purpose can become de:liberated (freed/diffused) from the idea. What Steeping prevents. |
| **The Equation** | Patience × Procrastination \= Steeping. The foundational reframe. Never alter it. |

# **09  Closing Note**

This brief was assembled from the following sources, in this session, on February 24, 2026:

* CREATIVE\_STEEPING\_The\_Workbook.pdf — verbatim seven steeps, all invocations

* Creative\_Steeping\_eBook\_Draft.pdf — welcome letter, eBook arc, community framing

* CREA\_TIVE\_STEEPING\_\_\_UI\_Feedback\_Roadmap.pdf — Manus visual audit

* CREA\_TIVE\_STEEPING\_\_\_UI\_Implementation\_Guide\_\_\_Fixes.md — Manus developer prompt

* Synthesis\_\_The\_Quiet\_Warrior\_\_\_The\_Creative\_Steeping\_UI.md — Triakis synthesis

* Curious Alchemist Survey (Google Doc) — field report, Invocation vocabulary, equation confirmation

* steeping-portal-v4.jsx — current production artifact

* STEEPING-PORTAL-BUILD-PROMPT-v4.md — architectural predecessor

* Past conversation history — DMN science, Gene Keys frameworks, Mars College build sessions

  *"There is something about me and Tea. We enjoy each other, and we know how to make each other better." — KzA*

*The stable base exists. The shell is built. What we are doing now is filling it with the life that has always been inside the practice. The portal is not being invented — it is being revealed.*

Assembled by Claude (Anthropic) at the direction of Kamau Zuberi Akabueze.

THE ÅLïEN SCöÕL for Creative Thinking  ·  thealienschool.com