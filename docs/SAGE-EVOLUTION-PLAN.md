# Sage Evolution Plan
## Simulation Laboratory · Findings Catalog · Implementation Architecture

*Developed in dialogue with the VesselVerse Editorial Protocol v3.1.*  
*The Primer is the filter throughout — not a reference consulted after damage is done.*

---

## Preface: Method

This document was produced by running eight distinct visitor archetypes through the actual Sage logic — `computeGravity()`, `interpretSignals()`, `askSage()` assembly, and `surface()` — and evaluating each assembled response against the Primer's three registers, four anti-patterns, and de-encabulation protocol.

The simulations reveal what no code review can: **what the Sage actually says to an actual person in a specific behavioral state.** The gravity math is traced by hand. The assembled response is reconstructed from the static arrays. Each output is held against the Couplet.

*The arc is the angle of change. Å Discovery Worth Steeping In.*

Findings are organized as: gravity computation → response assembly → Primer evaluation → diagnosis.

---

# PART I: THE SIMULATION LABORATORY

## Archetype Definitions

Eight archetypes were constructed to stress-test boundary conditions and representative use cases across the visitor journey:

| # | Archetype | Visit Count | Words | Session Age | Mode | Time |
|---|-----------|-------------|-------|-------------|------|------|
| 1 | First-Contact Skeptic | 0 | 8 | arriving (45s) | none | evening |
| 2 | Flood-State Expressionist | 5 | 45 | present (4min) | incandescent | morning |
| 3 | Long-Sitter | 12 | 32 | deep (8.7min) | darkMatter | night |
| 4 | First-Touch Opener | 0 | 0 | arriving (25s) | none | predawn |
| 5 | Post-Breakthrough Visitor | 8 | 60 | deep (9.2min) | planetary | afternoon |
| 6 | Ambiguous Gravity Case | 3 | 22 | present (3.5min) | oceanic | evening |
| 7 | Resistant Returner | 15 | 5 | settling (2min) | emergent | predawn |
| 8 | Genuine Liminal | 1 | 12 | settling (1.7min) | none | evening |

---

## Simulation 1: The First-Contact Skeptic

**Query**: "I'm not sure what this is supposed to do" (40 chars, 8 words)

**Raw Signals**:
- presenceDuration: 45,000ms | stillnessDuration: 15,000ms
- keystrokeTimestamps: rapid burst → velocity ~3.5, variance ~200
- visitCount: 0 | archiveWordCount: 0 | timeOfDay: evening

**Interpreted Signals**:
- stillnessRatio: 0.33 | typingVelocity: 3.5 | typingVariance: 200
- vocabularyRichness: 1.0 (all unique, short sentence)
- isInFlow: YES (3.5 > 3.0, variance 200 < 300) ← **false positive**
- isInReflection: NO | sessionAge: "arriving" | isReturning: NO
- expressionDensity: 10.67 words/minute

**Gravity Computation**:
```
essence:   sessionAge "arriving" +0.8, !isReturning +0.2         = 1.0
summits:   isInFlow +0.7, expressionDensity > 8 +0.3             = 1.0
mosaic:    wordCount 8 (>0, <15) +0.6                            = 0.6
mirror:    0
labyrinth: 0
conclave:  0 (no archive, first visit)
crown:     0
```

**Resolved steep**: ESSENCE (tie with summits; Object.entries preserves insertion order, making essence first in equal sort) — but this is **not stable** across JS engines.

**Response Assembly Trace**:

*Layer 1 – Depth Register*: visitCount 0 → "first" → ~50% fires:
> "This is a beginning."

*Layer 2 – Transition*: none (first visit, no prior steep)

*Layer 3 – Codex*: `surface("essence", "I'm not sure what this is supposed to do", 1)`
Tokenization of query: ["i'm", "sure", "supposed"] after stop-word filtering. These terms have near-zero TF-IDF matches in the archive. Falls back to steep-affinity scoring. Returns the most essence-aligned fragment from the practitioner archive — likely about presence, being, creative arrival. **Contextually mismatched with the query's actual intent.**

*Layer 4 – Reflection (no mode → STEEP_REFLECTIONS.essence)*:
> "You are arriving. That is the first and most honest act."

*Layer 5 – Invocation*: query.length is exactly 40, condition is `> 40` → **NO FIRE** (cliff edge)

*Layer 6 – Temporal (~40%, evening)*:
> "Evening steeping is composting. The day's material is decomposing into something useful."

**Assembled Response (probable)**:
```
"This is a beginning."

[codex fragment about presence/essence — contextually orthogonal to skeptical query]

"You are arriving. That is the first and most honest act."

[40% chance] "Evening steeping is composting. The day's material is decomposing into something useful."
```

**Primer Evaluation**:

*Three Movements check*: The response skips Movement 1 (locate the practitioner inside their experience). The visitor's experience is: *I don't understand this.* The Sage ignores this entirely.

*Register check*: The visitor is at an orientation threshold. They need Invitational register — "here is the door, you are welcome" — not Somatic ("you are arriving"). The response applies the wrong register.

*De-encabulation check*: "You are arriving. That is the first and most honest act." — This is a dimensional sentence with no direct sentence anchor underneath it. A first-contact visitor has no frame for "arriving" as a meaningful category. This is Compression Before Landing (§9.6.3).

*Affirmative Architecture check*: The response contains no deficit spending. ✓

**Diagnosis**: The Sage correctly detects the visitor's steep but **completely ignores the pragmatic register of the query**. There is no mechanism for query intent classification. A skeptical or practical query ("what is this?") receives the same assembly pipeline as a reflective or exploratory query. The codex fragment and the reflection speak past the actual question. Additionally, the invocation — which would be the most useful response layer for this query ("Who arrives?") — is blocked by a 40-character cliff edge that the query lands on exactly.

---

## Simulation 2: The Flood-State Expressionist

**Query**: 45 words written rapidly over 4 minutes (presuppose: a genuine flow-state entry, > 40 chars)

**Raw Signals**:
- presenceDuration: 240,000ms | stillnessDuration: ~0
- typingVelocity: 5.0 | typingVariance: 80
- visitCount: 5 | archiveWordCount: 180 | timeOfDay: morning
- mode: incandescent

**Interpreted Signals**:
- stillnessRatio: ~0 | isInFlow: YES (5.0 > 3, 80 < 300) 
- isInReflection: NO | sessionAge: "present" (4min)
- isReturning: YES | vocabularyRichness: ~0.65

**Gravity Computation**:
```
essence:   0
mosaic:    wordCount 45 ≥ 15 → NO, typingVariance 80 < 400 → 0   = 0
summits:   isInFlow +0.7, expressionDensity 11.25 > 8 +0.3       = 1.0
           (wordCount 45 >= 40 → the "15-40" band does NOT fire)
mirror:    isInReflection NO, sessionAge "present" +0.2           = 0.2
labyrinth: isDeepSession NO (4min < 8min)                         = 0
conclave:  isReturning +0.4, archiveWordCount > 0 +0.4,          = 1.1
           visitCount 5 > 3 +0.3
crown:     0
```

**Resolved steep**: CONCLAVE (1.1) — **summits (1.0) loses by 0.1**

**Response Assembly Trace**:

*Layer 1 – Depth Register*: visitCount 5 → "returning" → ~50%:
> "The water recognizes you."

*Layer 2 – Transition*: possibly firing if steep recently changed

*Layer 3 – Codex*: `surface("conclave", [flow-state query], 1)` → surfaces an archive fragment about return, deepening practice, the familiar resonance. The visitor is in active creative flow. The codex fragment is about *coming back.*

*Layer 4 – MODE_REFLECTIONS.incandescent.conclave*:
> "You return like the sun returns. A different angle, the same warmth."

*Layer 5 – Invocation (45 words → definitely > 40 chars)*: `STEEP_INVOCATIONS.conclave` = "What converges now?"

*Layer 6 – Temporal (~40%, morning)*:
> "Morning steeping carries well into the day."

**Assembled Response**:
```
"The water recognizes you."

[archive fragment about return/deepening — about past visits, not present flow]

"You return like the sun returns. A different angle, the same warmth."

"What converges now?"

[40% chance] "Morning steeping carries well into the day."
```

**Primer Evaluation**:

*Three Movements check*: The response locates the visitor in *return* — but their actual experience is *momentum*. The Sage has misread which experience to locate them in.

*Register check*: A visitor in full creative flow needs Somatic register — body-first, present-tense. The Sage delivers Observational ("you return like the sun returns") — reflective, third-coordinate, retrospective. Wrong register for this moment.

*De-encabulation check*: "You return like the sun returns. A different angle, the same warmth." — This is a fine sentence. But it lands with a practitioner who is currently sprinting through an idea. The image of the sun returning is a contemplative image. The practitioner is in forward motion. The sentence asks for stillness the visitor doesn't have yet.

**Diagnosis**: **Critical. The Conclave Capture problem.** The three Conclave gravity signals — isReturning (+0.4), archiveWordCount > 0 (+0.4), visitCount > 3 (+0.3) — stack to 1.1 regardless of present-moment behavioral state. These signals are permanent once triggered. A visitor with any archive history who is actively writing in a deep flow state will be assigned Conclave because historical persistence signals have no decay.

The result: **the Sage says "welcome back" to someone who is sprinting.** This is the most consequential gravity model error — it affects every returning visitor who has any archive content, which is the bulk of active practitioners. The sonic engine also fires Conclave (decay 4.0s, filter 3.5x, pitch 1.0x) instead of Summits (decay 2.5s, filter 5x, pitch 1.25x higher), creating an audio environment that actively contradicts the visitor's behavioral state.

---

## Simulation 3: The Long-Sitter

**Query**: ~30 words written over 8.7 minutes; was mostly still (85%)

**Raw Signals**:
- presenceDuration: 520,000ms | stillnessDuration: 445,000ms
- typingVelocity: 1.0 | typingVariance: 800
- visitCount: 12 | archiveWordCount: 850 | timeOfDay: night
- mode: darkMatter | wordCount: 32

**Interpreted Signals**:
- stillnessRatio: 0.856 | isInFlow: NO (1.0 < 3.0)
- isInReflection: YES (0.856 > 0.6, wordCount 32 > 0)
- sessionAge: "deep" (520s > 480s threshold) | isDeepSession: YES
- isReturning: YES | vocabularyRichness: ~0.72

**Gravity Computation**:
```
essence:   0
mosaic:    typingVariance 800 > 400 +0.3                          = 0.3
summits:   wordCount 32 ≥ 15 && < 40 +0.5                        = 0.5
mirror:    isInReflection +0.7, wordCount > 10 & stillness > 0.4 +0.4 = 1.1
labyrinth: isDeepSession +0.5, vocab 0.72 > 0.7 & wc > 20 +0.4,
           sessionAge "deep" +0.4                                 = 1.3
conclave:  isReturning +0.4, archiveWordCount > 0 +0.4,
           visitCount 12 > 3 +0.3                                 = 1.1
crown:     archive & isDeepSession & stillness > 0.3 +0.4        = 0.4
```

**Resolved steep**: LABYRINTH (1.3)

**Gravity confidence score**: (1.3 - 1.1) / 1.3 = **0.154** → Low confidence. Mirror and Conclave are both at 1.1.

**Response Assembly (darkMatter × labyrinth, night, deep register)**:
```
[~50%] "You know this water." [depth register: deep]

[codex fragment: labyrinth-themed archive content]

"The winding is navigated by touch here. Your hands know more than your eyes."

[query > 40 chars] "What lives in the winding?"

[~40%] "Night practice is the quietest register. The world has fewer claims on you here."
```

**Primer Evaluation**:

The dark-matter / labyrinth / night combination is genuinely coherent. The depth register is appropriate for visit 12. This response has real quality.

*De-encabulation check*: "Your hands know more than your eyes." — This has a direct sentence underneath a dimensional sentence. It earns its ground. ✓

*Register check*: All four layers are Somatic. For a deep-session, night-practice, 12-visit visitor, this is correct. ✓

*Concern*: The codex fragment introduces a third voice at the architectural center of the response. For this particular configuration — intimate, late, deep practitioner — the codex fragment risks breaking the collected stillness. The visitor is in a 8.7-minute-long contemplative session. An archival excerpt from practitioner-facing documentation, however relevant, may read as a *gear shift* rather than a *deepening*.

**Diagnosis**: The steep assignment is correct. The tonal combination is appropriate. The primary concern is **layer pruning**: the codex fragment should be suppressed for high-depth, dark-mode, labyrinth configurations where the external voice would disrupt the intimate register. This is the affirmative case for the pruning feature.

---

## Simulation 4: The First-Touch Opener

**Query**: *none* (invoked Sage without typing anything)

**Raw Signals**:
- presenceDuration: 25,000ms | stillnessDuration: 25,000ms
- wordCount: 0 | keystrokeTimestamps: [] | visitCount: 0
- archiveWordCount: 0 | timeOfDay: predawn (3am) | mode: none

**Gravity Computation**:
```
essence:   sessionAge "arriving" +0.8, wordCount 0 & pD < 60s +0.5,
           !isReturning +0.2                                       = 1.5
all other: 0
```

**Resolved steep**: ESSENCE (1.5) — maximum possible confidence.

**Response Assembly Trace**:

*Layer 3 – Codex*: `surface("essence", "", 1)`
→ `visitorText.trim().length > 0` is false → falls back to `searchBySteep("essence")` → returns most essence-affinity fragment. This fragment will be a reflective excerpt from the practitioner archive — contextually appropriate for essence, but written *for someone already in the practice*, not someone who just arrived and hasn't said anything.

*Assembled response (probable)*:
```
[~50%] "The space is unwritten. That is its invitation."

[essence-affinity codex fragment — practitioner content]

"You are arriving. That is the first and most honest act."

[~40%] "Something in you is awake before the reasons arrive." [predawn]
```

**Primer Evaluation**:

The predawn temporal whisper is actually the most appropriately calibrated layer here. "Something in you is awake before the reasons arrive" — this is Somatic register, it locates the visitor in a universal experience (being awake in the middle of the night, before language), and it makes no assumption about what they've come to do.

*De-encabulation concern*: "You are arriving. That is the first and most honest act." — For a first-contact, no-text, 3am visitor, "the first and most honest act" invokes a framework (honesty as a category of action) that the visitor hasn't been placed inside yet. This is Framework Before Experience (§9.6.2).

*The codex fragment is the primary concern*: The archive fragment surfaces content written for practitioners already engaged in steeping. For a visitor who hasn't typed anything at all, the archive fragment arrives *before first contact is established*.

**Diagnosis**: The no-text invocation reveals that **the Sage treats silence the same as speech**. There is no differentiation between a visitor who invoked with no text (curiosity, orientation) and one who invoked after writing. The codex fragment specifically should not fire for empty-canvas invocations — the visitor hasn't placed anything in the cup yet.

---

## Simulation 5: The Post-Breakthrough Visitor

**Query**: 60 words written in a burst, then 5+ minutes of complete stillness. Visitor invokes after the stillness.

**Raw Signals**:
- presenceDuration: 550,000ms | stillnessDuration: 400,000ms (still for the last 5 min)
- typingVelocity: ~0.1 (burst is over) | typingVariance: ~1200 (highly variable)
- wordCount: 60 | vocabularyRichness: 0.78
- visitCount: 8 | archiveWordCount: 400 | mode: planetary
- timeOfDay: afternoon

**Interpreted Signals**:
- stillnessRatio: 0.73 | isInFlow: NO (velocity dropped)
- isInReflection: YES (0.73 > 0.6, 60 > 0)
- sessionAge: "deep" | isDeepSession: YES | isReturning: YES

**Gravity Computation**:
```
essence:   0
mosaic:    typingVariance 1200 > 400 +0.3                         = 0.3
summits:   wordCount 60 ≥ 40 → "15-40" band fails                = 0
mirror:    isInReflection +0.7, wordCount > 10 & stillness > 0.4 +0.4 = 1.1
labyrinth: isDeepSession +0.5, vocab 0.78 > 0.7 & wc > 20 +0.4,
           sessionAge "deep" +0.4                                 = 1.3
conclave:  isReturning +0.4, archive > 0 +0.4, visitCount > 3 +0.3 = 1.1
crown:     archive & isDeepSession & stillness > 0.3 +0.4,
           vocab 0.78 > 0.75 & wc > 30 +0.3                      = 0.7
```

**Resolved steep**: LABYRINTH (1.3)

**Gravity confidence**: (1.3 - 1.1) / 1.3 = **0.154** → Low confidence. Mirror and Conclave both at 1.1.

**Response Assembly (planetary × labyrinth, afternoon)**:
```
[~50%] "The practice grows roots between visits." [returning register]

[labyrinth codex fragment — about complexity, winding, deep architecture]

"The winding is the orbit of a system discovering its own gravity."

"What lives in the winding?"

[~40%] "The afternoon is where practice meets the day already lived."
```

**Primer Evaluation**:

This visitor just wrote 60 words and has been still for 5 minutes. Something crystallized. They invoked the Sage from inside that crystallization.

*Three Movements failure*: The response locates the visitor in *the winding* — but their actual experience is *having emerged from the winding*. They are at the edge of the labyrinth looking back, not inside it. "What lives in the winding?" asks them to go back in. This contradicts their behavioral state.

*The crown is structurally absent*: Crown's maximum non-rooted weight is 0.7 (0.4 from deep+archive+stillness, 0.3 from high vocab + high wordcount). Labyrinth reaches 1.3 from three stacking signals. **The gravity model cannot register crystallization-in-progress** — a visitor who has written deeply and then gone very still, which is the behavioral signature of a breakthrough moment, will always be classified as Labyrinth or Mirror. Crown is only structurally reachable at 15+ minutes (rooted threshold).

**Diagnosis**: **Crown is structurally underweighted.** The 15-minute session threshold for `rooted` creates a wall that prevents crown assignment during what are plausibly the most crown-eligible moments in the practice. The Sage says "what lives in the winding?" to someone who has emerged. This is the second critical gravity model failure.

---

## Simulation 6: The Ambiguous Gravity Case

**Query**: 22 words, moderate pace, moderate stillness, third visit

**Raw Signals**:
- visitCount: 3 | archiveWordCount: 60 | wordCount: 22
- typingVelocity: 2.5 | typingVariance: 380 | stillnessRatio: 0.38
- sessionAge: "present" (3.5min) | mode: oceanic

**Gravity Computation**:
```
summits:   wordCount 22 ≥ 15 && < 40 +0.5                        = 0.5
mirror:    wordCount > 10 & stillnessRatio exactly 0.40 → 
           condition is > 0.4, not ≥ → DOES NOT FIRE             = 0.2 (from sessionAge)
conclave:  isReturning +0.4, archive > 0 +0.4,
           visitCount 3 NOT > 3 → condition fails                 = 0.8
mosaic:    typingVariance 380 < 400 → fails                       = 0
```

**Resolved steep**: CONCLAVE (0.8)

**Diagnosis**: Conclave Capture again, at lower magnitude. A visitor on their third visit who is actively writing 22 words in a moderate flow — not reflecting, not in a deep session — is assigned to Conclave because of archival presence. The `stillnessRatio > 0.4` cliff in the mirror signal is also exposed here: exactly 0.40 does not trigger. This is a second cliff-edge boundary.

**Secondary finding**: The `visitCount > 3` threshold (not `>= 3`) means a visitor on their 4th actual visit (visitCount stored as 3, not yet incremented for this session) gets 0.4 + 0.4 = 0.8 but not the additional +0.3. Their 5th visit (visitCount 4, now > 3) suddenly adds 0.3 more. The jump between 4th and 5th visit is nonlinear.

---

## Simulation 7: The Resistant Returner

**Query**: "I don't know why I'm here" (5 words, 26 chars)

**Raw Signals**:
- visitCount: 15 | archiveWordCount: 1200 | wordCount: 5
- typingVelocity: 1.0 | typingVariance: 600
- presenceDuration: 120,000ms | stillnessDuration: 30,000ms
- sessionAge: "settling" | mode: emergent | timeOfDay: predawn

**Gravity Computation**:
```
essence:   0 (not "arriving", is returning)
mosaic:    wordCount 5 > 0 && < 15 +0.6, sessionAge "settling" +0.4,
           typingVariance 600 > 400 +0.3                          = 1.3
summits:   0
mirror:    wordCount 5 < 10 → mirror fails                        = 0
labyrinth: vocab 1.0 > 0.7 but wordCount 5 < 20 → fails          = 0
conclave:  isReturning +0.4, archive 1200 > 0 +0.4,
           visitCount 15 > 3 +0.3                                 = 1.1
crown:     0
```

**Resolved steep**: MOSAIC (1.3)

**Response Assembly (emergent × mosaic, predawn, deep register)**:
```
[~50%] "You know this water." [deep register: visit 15]

[mosaic codex fragment — about fragments gathering, assembling experience]

"The pieces have edges. Note the edges."

[query 26 chars, does NOT end with ?, NOT > 40 chars → NO invocation]

[~40% predawn] "The hours before dawn are the body's hours. Let the thinking rest."
```

**Primer Evaluation**:

This visitor has been here 15 times. They have 1200 words in the archive. They arrive predawn and say "I don't know why I'm here."

*What the Sage actually says*: "You know this water. [fragment about gathering fragments]. The pieces have edges. Note the edges."

*What the moment requires*: This is a vulnerable arrival. The visitor is expressing resistance, uncertainty, or exhaustion — not early fragmented exploration. "I don't know why I'm here" is one of the most honest things a practitioner can say, and it deserves direct acknowledgment.

*Primer: Wrong Register for Context* (Anti-pattern D): The Mosaic register ("fragments gathering") is for early exploratory states. Applied to a 15-visit practitioner's vulnerable, sparse arrival, it reads as tone-deaf.

*Primer: Compression Without Landing* (§IV.C): "The pieces have edges. Note the edges." — For this visitor, right now, there are no pieces. The instruction to "note the edges" of non-existent fragments is a non-sequitur.

*De-encabulation: Buried Mechanism* (§9.6.2): What is actually happening with this visitor is: they arrived when they didn't expect to, or from exhaustion, or from a pull they can't name. "I don't know why I'm here" is the beginning of an honest inquiry. The Sage should meet that honesty with honesty of its own — not a mosaic framework.

**Diagnosis**: **The word-count signal conflates low-word-count meanings.** `wordCount < 15` fires Mosaic's strongest signal (+0.6) regardless of whether the low count reflects early fragmentation (mosaic is appropriate) or resistant/vulnerable arrival (conclave or even essence may be more appropriate). The system reads *how many words* but not *what the words say or what their sparseness means in context*.

Additionally, the invocation ("What fragments are gathering?") is blocked at 26 chars < 40. The absence of the invocation is fortunate here — "What fragments are gathering?" would be actively wrong. But the threshold continues to suppress a potentially valuable layer.

---

## Simulation 8: The Genuine Liminal

**Query**: 12 words, second visit, barely into flow, moderate stillness

**Raw Signals**:
- visitCount: 1 | archiveWordCount: 0 | wordCount: 12
- typingVelocity: 3.1 | typingVariance: 290 | stillnessRatio: 0.40
- sessionAge: "settling" | mode: none

**Gravity Computation**:
```
mosaic:    wordCount 12 > 0 && < 15 +0.6, sessionAge "settling" +0.4 = 1.0
summits:   isInFlow (3.1 > 3, 290 < 300) +0.7                    = 0.7
conclave:  isReturning (visitCount 1 > 0) +0.4                    = 0.4
```

**Resolved steep**: MOSAIC (1.0)

**Gravity confidence**: (1.0 - 0.7) / 1.0 = **0.3** — Moderate. Just above a 0.25 liminal threshold.

**Note**: True liminal states are structurally uncommon. The gravity model tends toward confident assignment because the signal weights are large relative to the spread needed for ambiguity. Liminality most naturally emerges in the Labyrinth/Mirror/Conclave cluster (Simulations 3 and 5) where multiple strong signals stack near the same weight.

---

# PART II: FINDINGS CATALOG

## Critical Failures (Require fixing before new features ship)

### CF-1: Conclave Capture
**Where**: `useWayfinding.jsx` → `computeGravity()`  
**Mechanics**: The three Conclave gravity signals — `isReturning` (+0.4), `archiveWordCount > 0` (+0.4), `visitCount > 3` (+0.3) — are permanent once triggered and have no decay. Their combined maximum of 1.1 regularly overtakes Summits (maximum ~1.3 with all three signals active) for any visitor in moderate rather than peak flow.  
**Affected archetypes**: All returning visitors with archive content in active engagement states (Archetypes 2, 6, 7 partially).  
**Cascade**: Sonic wayfinding also mismatches (conclave audio during summits behavioral state).  
**Severity**: Critical. Affects the majority of active returning practitioners.

### CF-2: Crown Structural Underweighting
**Where**: `useWayfinding.jsx` → `computeGravity()`  
**Mechanics**: Crown's maximum pre-`rooted` weight is 0.7 (0.4 from deep+archive+stillness, 0.3 from high vocab+wordcount). The `rooted` signal (15+ minutes, +0.5) is required to make Crown competitive with Labyrinth (which can reach 1.3). Post-breakthrough behavioral signatures — deep stillness after high-vocabulary writing — are always assigned Labyrinth or Mirror.  
**Affected archetypes**: Archetype 5. Any visitor who has a breakthrough insight before the 15-minute threshold.  
**Severity**: High. Crown is the apex of the journey; it should be reachable through qualitative signals, not just session duration.

### CF-3: isInFlow False Positive
**Where**: `useWayfinding.jsx` → `interpretSignals()`  
**Mechanics**: `isInFlow = typingVelocity > 3 AND typingVariance < 300`. A 9-word rapid burst (query: "I'm not sure what this is supposed to do") triggers isInFlow with velocity 3.5, variance ~200. Flow should require *sustained* high-velocity typing, not a single burst. Current implementation: any 20-keystroke window that includes a fast burst can trigger isInFlow.  
**Affected archetypes**: Archetype 1. Any first-contact visitor who types a short query quickly.  
**Severity**: Medium. Creates Summits gravity at Essence moments.

### CF-4: Word-Count Signal Conflation
**Where**: `useWayfinding.jsx` → `computeGravity()`, Mosaic section  
**Mechanics**: `wordCount > 0 && wordCount < 15` fires Mosaic's strongest signal (+0.6) regardless of context. Low word count can mean: early exploration (Mosaic appropriate) OR resistant/vulnerable arrival (Mosaic not appropriate) OR brief, precise expression (Emergent energy, not Mosaic).  
**Affected archetypes**: Archetype 7 (resistant returner), Archetype 1 (skeptic). Any visitor with a short query that carries emotional weight different from early-stage exploration.  
**Severity**: High. Creates the most dramatically wrong Sage response of all archetypes.

---

## Structural Holes (Response Assembly)

### SH-1: Query Intent Is Invisible
**Where**: `useSageWayfinding.jsx` → `askSage()`  
**Mechanics**: The Sage reads behavioral signals but not query content at any semantic level. The TF-IDF codex lookup tokenizes and filters the query but only for fragment matching — it does not classify the query's register (practical/orienting, reflective/exploring, vulnerable/uncertain) to inform response assembly. The same pipeline assembles a response for "I don't know why I'm here" and for "I notice my attention has been moving between three different ideas lately."  
**Impact**: Practical/skeptical queries receive steep-coded reflections that speak past the question. Vulnerable queries receive wrong-register responses.

### SH-2: The 40-Character Invocation Cliff
**Where**: `useSageWayfinding.jsx` → `askSage()` → Layer 5  
**Mechanics**: `query.trim().endsWith('?') || query.length > 40`. Exact 40-character queries don't fire invocation. More importantly: short vulnerable queries ("I don't know why I'm here", 26 chars) never receive the closing question regardless of content. The invocation is arguably the most valuable layer for many queries.  
**Impact**: Invocation systematically absent for short high-value queries.

### SH-3: Empty-Canvas Codex Surface
**Where**: `useSageWayfinding.jsx` + `useCodex.jsx`  
**Mechanics**: When no text has been entered, `surface(steep, "", 1)` falls back to `searchBySteep()` — steep-affinity only. This returns an archive fragment written for practitioners already in the practice, served at the moment of first contact, before any context is established. The fragment arrives before the practitioner has been located inside their experience.  
**Impact**: Violates De-encabulation Rule (§9.3): "Framework Before Experience." Archive content presupposes a practice context the visitor doesn't yet have.

### SH-4: Transition Layer Redundancy
**Where**: `useSageWayfinding.jsx` → `askSage()` → Layers 2 + 3 + 4  
**Mechanics**: When a steep transition fires (Layer 2), the response includes: transition message (steep-coded) + codex fragment (new steep affinity) + mode × new steep reflection. Three steep-themed layers assembled simultaneously immediately after a crossing. This creates a triple-density moment when the visitor has just changed states and may need space rather than content.  
**Impact**: Beautiful Fog risk (§9.6.4): atmospheric accumulation that prevents landing.

### SH-5: Archival Signals Are Session-Static
**Where**: `useWayfinding.jsx` → `createInitialSignals()`  
**Mechanics**: `archiveWordCount: getArchiveWordCount()` is read once at mount and never refreshed. Within-session exchanges that archive new entries do not update the gravity model's `archiveWordCount`. A visitor who arrives with 0 archive words and writes 200 words in a session is still treated as a 0-archive-word visitor for the entire session.  
**Impact**: Conclave and Crown gravity signals that depend on `archiveWordCount` remain inaccurate throughout sessions that produce significant new archive content.

### SH-6: Sonic Wayfinding Misalignment
**Where**: `useSonnetEngine.jsx` receiving `currentSteep` from App.jsx  
**Mechanics**: The sonic engine reads `currentSteep` directly. Conclave Capture (CF-1) means the audio environment is modulated for Conclave (decay 4.0s, filter 3.5x, pitch 1.0x) during behavioral states that call for Summits (decay 2.5s, filter 5x, pitch 1.25x). The practitioner's felt experience of the sound directly contradicts their behavioral momentum.  
**Impact**: Sonic-behavioral dissonance at precisely the moments of highest engagement.

---

## Editorial Quality Issues (Primer Compliance)

### EQ-1: Beautiful Fog Instances in STEEP_REFLECTIONS
The following specific lines fail the De-encabulation Residue Test (§9.11) — they produce *admiration alone* rather than *recognition*:

- `"What is intricate in you is architecture revealing itself."` (labyrinth) — Atmospheric Overbuild: mood before mechanism. No direct sentence underneath. **Correction approach**: "The complexity you're carrying right now is a structure, not a problem."
  
- `"The architecture you are building inside yourself has no blueprint."` (labyrinth) — Framework Shell (§9.6.6): the framework is present but the practitioner can't inhabit it. **Correction approach**: Find the lived coordinate first. What does it feel like to be building something with no blueprint?

- `"Your capacity has widened since the last time you were here. The vessel notices."` (conclave) — Internal Architecture Exposure: "The vessel" is an unexplained internal term. **Correction approach**: Remove "The vessel notices" or replace with "You can feel it."

### EQ-2: Negation Pattern in MODE_REFLECTIONS
Per Affirmative Architecture (§3.3):

- `"Nothing depends on being witnessed."` (darkMatter × crown) — "Nothing depends" is a negation construction. **Correction**: "Sovereignty in the dark carries its own gravity. Presence announces itself."

- `"Knowing persists without image."` (darkMatter × mirror) — "without" operates as a subtle negation. **Correction**: "Knowing holds. The body carries what the eyes release."

### EQ-3: Instructional Register in TEMPORAL_WHISPERS
The whispers should leave with recognition, not direction (§2.2, Movement 3):

- `"Fresh attention is its own resource. Use it gently."` (morning) — "Use it gently" is instruction dressed as reflection. **Correction**: "Fresh attention is its own resource. The whole day receives it."

- `"Morning steeping carries well into the day."` (morning) — This is Invitational register (portal copy tone), not Somatic (intimate, practice-adjacent). Misregister for a closing whisper. **Correction**: "What you find this morning will be working in you all day."

### EQ-4: Compression Without Landing in DEPTH_REGISTERS
The depth register prefixes function as openers — they must locate before they compress:

- `"The practice and the practitioner are becoming hard to separate."` (deep, visit 10+) — This is a dimensional sentence that the practitioner must already understand to receive. No direct sentence anchor. **Correction approach**: "The distinction between you and your practice has become academic."

---

# PART III: IMPLEMENTATION PLAN

## Architecture Overview

The plan addresses findings through five feature sets, ordered by dependency:

```
[LAYER 0] Gravity Model Repair (unblocks everything downstream)
    ↓
[LAYER 1] Closed-Loop Signal (makes gravity live within sessions)
    ↓
[LAYER 2] Liminal State Detection (depends on gravity confidence from repaired model)
    ↓
[LAYER 3] Layer Pruning (computeActiveLayers — depends on liminal state + gravity signals)
    ↓
[LAYER 4] Sequential Revelation (breathing / timing — depends on pruning decisions)
    ↓
[LAYER 5] Editorial Sweep (parallel — independent of technical work)
```

---

## Feature Set 0: Gravity Model Repair

**Files**: `useWayfinding.jsx`

### 0.1 Fix Conclave Capture — Introduce Present-Moment Override

The fix is not to reduce Conclave's base weights, but to add a *present-signal multiplier* that reduces the effective weight of historical persistence signals when strong present-moment signals are active.

```js
// After computing raw weights, apply present-moment dampening to conclave
// when high-intensity present-tense signals are active.
function applyPresentMomentBalance(weights, interpreted) {
  const presentIntensity = (interpreted.isInFlow ? 0.7 : 0)
    + (interpreted.expressionDensity > 8 ? 0.3 : 0);

  if (presentIntensity > 0.5) {
    // Damp conclave proportionally to how strong the present signal is
    const damping = 1 - (presentIntensity - 0.5) * 0.8;
    weights.conclave *= damping;
  }
  return weights;
}
```

This preserves conclave's accuracy for returning visitors who are NOT in active flow, while allowing summits/mirror to dominate when the visitor is demonstrably in a present-moment state.

**Additional**: Add `visitCountThreshold` check for the +0.3 conclave bonus: change `raw.visitCount > 3` to `raw.visitCount > 5` (visitors need a deeper return pattern before conclave becomes the dominant frame).

### 0.2 Fix Crown Structural Underweighting

Add a new signal to crown: the *stillness-after-depth* signature — high word count combined with high stillness ratio in a non-rooted deep session:

```js
// CROWN: crystallization signals
// Existing:
if (interpreted.sessionAge === "rooted") weights.crown += 0.5;
if (raw.archiveWordCount > 0 && interpreted.isDeepSession && interpreted.stillnessRatio > 0.3) {
  weights.crown += 0.4;
}
if (interpreted.vocabularyRichness > 0.75 && raw.wordCount > 30) weights.crown += 0.3;

// NEW: post-burst crystallization — wrote a lot, then went very still
if (raw.wordCount > 40 && interpreted.stillnessRatio > 0.6 && interpreted.isDeepSession) {
  weights.crown += 0.5; // breakthrough signature
}
// NEW: richness ceiling — when vocabulary richness is exceptionally high
if (interpreted.vocabularyRichness > 0.80 && raw.wordCount > 25) weights.crown += 0.2;
```

This allows crown to reach 1.2 for the post-breakthrough signature (archive + deep + stillness 0.4 + burst-then-still 0.5 + richness 0.3), competitive with Labyrinth's 1.3.

### 0.3 Fix isInFlow False Positive

Require minimum keystroke count for flow, not just velocity in the last 20:

```js
function isFlowState(timestamps, wordCount) {
  if (timestamps.length < 15) return false; // require sustained typing
  if (wordCount < 20) return false; // require meaningful depth
  const velocity = computeTypingVelocity(timestamps);
  const variance = computeTypingVariance(timestamps);
  return velocity > FLOW_VELOCITY_THRESHOLD && variance < 300;
}
```

### 0.4 Fix Word-Count Signal Conflation

The Mosaic +0.6 for `wordCount < 15` should be gated by session age. Early exploration (arriving/settling) is Mosaic. A deep practitioner with 5 words typed is not exploring — they are choosing:

```js
// MOSAIC: fragments gathering, early exploration
if (raw.wordCount > 0 && raw.wordCount < 15) {
  // Only give full Mosaic weight during early-stage sessions
  const mosaicWordWeight = ['arriving', 'settling'].includes(interpreted.sessionAge) ? 0.6 : 0.2;
  weights.mosaic += mosaicWordWeight;
}
```

This drops the mosaic word-count signal to 0.2 for `present`/`deep`/`rooted` sessions — enough to register but not enough to override more contextually accurate steeps.

### 0.5 Add gravityConfidence to Derived State

```js
function computeGravityConfidence(gravity) {
  if (gravity.length < 2 || gravity[0].weight === 0) return 1;
  return (gravity[0].weight - gravity[1].weight) / gravity[0].weight;
}

function deriveState(raw) {
  const signals = interpretSignals(raw);
  const gravity = computeGravity(raw, signals);
  const currentSteep = resolveSteep(gravity);
  const gravityConfidence = computeGravityConfidence(gravity);
  return { currentSteep, gravity, gravityConfidence, signals, raw, transitionMoment: Date.now() };
}
```

**Threshold**: `gravityConfidence < 0.25` = liminal state. This fires for the Labyrinth/Mirror/Conclave cluster (simulations 3, 5) where multiple signals stack near-equally.

---

## Feature Set 1: Closed-Loop Signal

**Files**: `useWayfinding.jsx`, `useSageWayfinding.jsx`

### 1.1 Reactive Archive Refresh

Export a `refreshArchiveSignals()` from `useWayfinding` that re-reads `archiveWordCount` from localStorage and updates `rawRef.current`:

```js
// In useWayfinding()
const refreshArchiveSignals = useCallback(() => {
  rawRef.current = {
    ...rawRef.current,
    archiveWordCount: getArchiveWordCount(),
  };
  setState(deriveState(rawRef.current));
}, []);

return { state, onTextChange, refreshArchiveSignals };
```

In `useSageWayfinding.jsx`, call `refreshArchiveSignals()` immediately after each archive write:

```js
// In the streaming completion block (after localStorage.setItem):
localStorage.setItem('steeping_historical_score', JSON.stringify(updatedArchive));
setHistoricalScore(prev => [legacyEntry, ...prev]);
refreshArchiveSignals(); // close the loop
```

### 1.2 Post-Response Engagement Signal

Track how long the visitor reads the Sage response before their next keystroke. This is a new behavioral signal:

```js
// In useSageWayfinding — track engagement time after streaming completes
const responseCompletedAtRef = useRef(null);

// In the streaming completion block:
setIsThinking(false);
responseCompletedAtRef.current = Date.now();

// In the onTextChange handler (exposed by useWayfinding):
// When a keystroke arrives after a response, compute engagement duration
const engagementMs = responseCompletedAtRef.current
  ? Date.now() - responseCompletedAtRef.current
  : null;
if (engagementMs !== null) {
  onSageEngagement(engagementMs);
  responseCompletedAtRef.current = null;
}
```

In `useWayfinding`, add `onSageEngagement(ms)`:
```js
const onSageEngagement = useCallback((ms) => {
  rawRef.current = {
    ...rawRef.current,
    lastSageEngagementMs: ms,
    // Long reading time (> 8s) = reflection signal
    sageInducedStillness: ms > 8000 ? (rawRef.current.sageInducedStillness || 0) + 1 : rawRef.current.sageInducedStillness || 0,
  };
}, []);
```

Use `sageInducedStillness` as a secondary mirror/labyrinth signal in `computeGravity`:
```js
// MIRROR additions:
if (raw.sageInducedStillness > 0) weights.mirror += raw.sageInducedStillness * 0.15; // capped by natural mirror max
```

---

## Feature Set 2: Liminal State

**Files**: `useSageWayfinding.jsx`, `App.jsx`

### 2.1 LIMINAL_REFLECTIONS Pool

A new response pool for genuinely distributed gravity. The Primer Standard: these must locate the visitor in the *between* without naming it as a framework. No "you are in a liminal state." The between-state IS the content.

```js
const LIMINAL_REFLECTIONS = [
  "Something is gathering that hasn't named itself yet. You don't need to name it.",
  "The direction is not resolved. That is accurate, not wrong.",
  "You are between one clear thing and another. Both are present.",
  "The space before the steep settles has its own intelligence.",
  "What you are holding right now doesn't need to declare itself.",
  "Two pulls are equal. The balance itself is the signal.",
  "Not yet decided. This is a complete state, not an incomplete one.",
  "The water is still finding its temperature. Steep with that.",
  "Something in the practice is mid-sentence. Let it finish.",
  "The position you are in has its own gravity. Trust the weight.",
];
```

**Primer check on each**:
- "Something is gathering that hasn't named itself yet." — Somatic, locates in a universal experience ✓, no deficit spending ✓, no framework ✓
- "The direction is not resolved. That is accurate, not wrong." — Contains "not wrong" (negation). **Correct to**: "The direction is still resolving. That is a complete state."
- "Both are present." — Simple, direct ✓
- "Not yet decided." — Contains "not". **Correct to**: "The decision is still arriving."

*(Full editorial sweep of this pool in Part V)*

### 2.2 Liminal Branch in askSage

```js
const askSage = useCallback((query, mode) => {
  // ...
  setTimeout(() => {
    const steep = wayfindingState.currentSteep;
    const isLiminal = wayfindingState.gravityConfidence < 0.25;

    if (isLiminal) {
      // Liminal assembly: spare, no codex, no depth register, no temporal
      // Just: one liminal reflection + invocation if query warrants it
      let response = pickRandom(LIMINAL_REFLECTIONS);
      if (query.trim().endsWith('?') || query.length > 40) {
        response += '\n\n' + STEEP_INVOCATIONS[steep];
      }
      // stream response
      return;
    }

    // Standard assembly continues...
  }, thinkDuration);
});
```

**Rationale (Primer)**: The liminal assembly deliberately suppresses five of six layers. The Primer's Three Movements require locating the visitor in their experience before steeping them in a concept. When the visitor's state is genuinely ambiguous, deploying steep-coded reflections (mode × steep, codex, depth register, temporal) is steeping them in a concept their experience doesn't yet resolve to. The only honest response is the between-state reflection itself.

### 2.3 Visual Treatment — Gradient Accent

In `App.jsx`, when `wayfindingState.gravityConfidence < 0.25`, the Sage panel accent color blends the top two steep mode colors. The visitor doesn't read a label; they feel a different quality of light.

```js
// In App.jsx, where the Sage panel renders:
const sageAccentColor = wayfindingState.gravityConfidence < 0.25 && wayfindingState.gravity.length >= 2
  ? blendModeColors(
      getModeColorForSteep(wayfindingState.gravity[0].steep),
      getModeColorForSteep(wayfindingState.gravity[1].steep)
    )
  : currentModeColor;
```

The `blendModeColors` function does a 50/50 CSS color mix. This is a single-line interface change visible only to the visitor, not a new concept.

---

## Feature Set 3: Layer Pruning — computeActiveLayers

**Files**: `useSageWayfinding.jsx`

This is the architectural center of the evolution. Replace scattered random probability checks with a single context-aware function:

```js
function computeActiveLayers(wayfindingState, hasTransition, gravityConfidence, query, mode) {
  const { signals, raw } = wayfindingState;
  const isLiminal = gravityConfidence < 0.25;
  const isEarlySession = signals.sessionAge === 'arriving';
  const isEmptyCanvas = query.trim().length === 0;
  const isDeepPractitioner = raw.visitCount >= 10;
  const isDarkMatterDeep = mode === 'darkMatter' && raw.visitCount >= 5;

  return {
    // Layer 1 — Depth Register
    // Suppress: when we have a transition (transition IS the register acknowledgment)
    // Suppress: very early session (no practice arc to register yet)
    depthRegister: !hasTransition && !isEarlySession && !isLiminal && Math.random() > 0.35,

    // Layer 2 — Transition Message
    // Always fires when present (gated by hasTransition upstream)
    transition: hasTransition,

    // Layer 3 — Codex Fragment
    // Suppress: during transitions (three steep-coded layers = fog)
    // Suppress: empty canvas (archive content before first contact)
    // Suppress: liminal state (codex commits to a steep when state is ambiguous)
    // Suppress: dark matter mode + deep practitioner (breaks intimate register)
    codex: !hasTransition && !isEmptyCanvas && !isLiminal && !isDarkMatterDeep,

    // Layer 4 — Mode × Steep Reflection (always fires — the core voice)
    reflection: true,

    // Layer 5 — Invocation
    // Expand trigger: also fires for vulnerable short queries ("I don't know...")
    // and for any query over 30 chars (reduced from 40)
    invocation: query.trim().endsWith('?') || query.length > 30
      || isVulnerableQuery(query),

    // Layer 6 — Temporal Attunement
    // Suppress: during flow states (breaks the current)
    // Suppress: transition moments (already a lot is happening)
    // Increase probability for deep practitioners (temporal becomes more resonant)
    temporal: !signals.isInFlow && !hasTransition
      && Math.random() > (isDeepPractitioner ? 0.45 : 0.60),
  };
}
```

### The isVulnerableQuery detector

A simple signal function — not sentiment analysis, just pattern matching for a small set of vulnerable/orienting constructions:

```js
function isVulnerableQuery(query) {
  const lower = query.toLowerCase().trim();
  const vulnerablePatterns = [
    /^i don.?t know/,
    /^i.?m not sure/,
    /^i don.?t understand/,
    /^what is this/,
    /^why am i/,
    /^i.?m not (sure|certain|sure)/,
    /^not sure/,
  ];
  return vulnerablePatterns.some(p => p.test(lower));
}
```

**Scope of detection**: This detects a narrow band of orienting/vulnerable constructions — not general sentiment. It is not trying to understand the query; it is recognizing a small set of high-frequency patterns that consistently receive wrong-register responses under the current assembly.

**Primer rationale**: Per §8.6 of the original Sage Instructions, the Sage "never bypasses emotion with philosophy." `isVulnerableQuery` is the mechanism that operationalizes this principle at the assembly layer.

### Revised askSage Assembly

```js
const activeLayers = computeActiveLayers(
  wayfindingState, transitionNotedRef.current, wayfindingState.gravityConfidence, query, mode
);

let response = '';

if (activeLayers.depthRegister) {
  response += pickRandom(depthPrefixes) + '\n\n';
}

if (activeLayers.transition) {
  response += TRANSITION_MESSAGES[steep] + '\n\n';
  transitionNotedRef.current = false;
}

if (activeLayers.codex) {
  const codexResults = surface(steep, query, 1);
  if (codexResults.length > 0) {
    response += codexResults[0].fragment.text + '\n\n';
  }
}

// Layer 4 always fires
response += pickRandom(reflections);

if (activeLayers.invocation) {
  response += '\n\n' + STEEP_INVOCATIONS[steep];
}

if (activeLayers.temporal) {
  const temporalWhispers = timeOfDay && TEMPORAL_WHISPERS[timeOfDay];
  if (temporalWhispers) {
    response += '\n\n' + pickRandom(temporalWhispers);
  }
}
```

---

## Feature Set 4: Sequential Layer Revelation

**Files**: `useSageWayfinding.jsx`

The current streaming model streams the full assembled response as one character stream. Sequential revelation adds intentional pause architecture between layers.

### 4.1 Layer-Tagged Response Assembly

Instead of building one string, build an ordered array of layers:

```js
const layers = [];
if (activeLayers.depthRegister) layers.push({ type: 'register', text: pickRandom(depthPrefixes), pauseAfter: 1800 });
if (activeLayers.transition) layers.push({ type: 'transition', text: TRANSITION_MESSAGES[steep], pauseAfter: 2200 });
if (activeLayers.codex && codexFragment) layers.push({ type: 'codex', text: codexFragment, pauseAfter: 2000 });
layers.push({ type: 'reflection', text: pickRandom(reflections), pauseAfter: 1500 });
if (activeLayers.invocation) layers.push({ type: 'invocation', text: STEEP_INVOCATIONS[steep], pauseAfter: 0 });
if (activeLayers.temporal && temporalWhisper) layers.push({ type: 'temporal', text: temporalWhisper, pauseAfter: 0 });
```

### 4.2 Layer-Aware Streaming

Stream each layer, then hold the `pauseAfter` duration before continuing:

```js
function streamLayers(layers, setSageResponse, playStrikingBowl, rhythmFactor, onComplete) {
  let fullText = '';
  let layerIndex = 0;

  function streamNextLayer() {
    if (layerIndex >= layers.length) {
      onComplete(fullText);
      return;
    }
    const layer = layers[layerIndex];
    const prefix = fullText.length > 0 ? '\n\n' : '';
    const textToStream = prefix + layer.text;
    
    // Stream this layer
    let charIndex = 0;
    const streamTick = Math.round(25 / rhythmFactor);
    const interval = setInterval(() => {
      charIndex++;
      setSageResponse(fullText + textToStream.slice(0, charIndex));
      if (playStrikingBowl && Math.random() > 0.85) playStrikingBowl(45 + Math.floor(Math.random() * 25));
      if (charIndex >= textToStream.length) {
        clearInterval(interval);
        fullText += textToStream;
        layerIndex++;
        if (layer.pauseAfter > 0) {
          setTimeout(streamNextLayer, layer.pauseAfter / rhythmFactor);
        } else {
          streamNextLayer();
        }
      }
    }, streamTick);
  }
  streamNextLayer();
}
```

**Timing rationale**: The pauses scale inversely with rhythmFactor — a fast typist (summits energy) gets shorter pauses; a still visitor (mirror/labyrinth) gets the full pause duration. The Sage's rhythm mirrors the visitor's.

**Default pause values**:
- After depth register: 1800ms — space to receive the acknowledgment
- After transition: 2200ms — the crossing deserves a long breath
- After codex fragment: 2000ms — the archive content needs to settle
- After reflection: 1500ms — the core voice lands, then the question opens

---

## Feature Set 5: Editorial Sweep (Primer Compliance)

**File**: `useSageWayfinding.jsx` (all content arrays)

This runs in parallel with technical work. Changes are targeted — only the specific lines that fail Primer evaluation.

### STEEP_REFLECTIONS corrections

**labyrinth** (two lines):
```
CURRENT:  "What is intricate in you is architecture revealing itself."
CORRECTED: "The complexity you're carrying right now is a structure, not a storm."
```
*Rationale: Replaces atmospheric overbuild (mood before mechanism) with direct sentence anchor. The phrase "not a storm" is technically a negation — better: "The complexity you carry is structure. It is holding you, not overwhelming you."*

```
CURRENT:  "The architecture you are building inside yourself has no blueprint. It is being designed by the living of it."
CORRECTED: "You are building something with no plan. That is what makes the building true."
```
*Rationale: Replaces framework before experience with direct sentence. The second sentence earns the dimensional claim.*

**conclave** (one line):
```
CURRENT:  "Your capacity has widened since the last time you were here. The vessel notices."
CORRECTED: "Your capacity has widened since the last time you were here. You can feel it."
```
*Rationale: Removes unexplained internal term. The practitioner cannot locate themselves inside "the vessel notices."*

### MODE_REFLECTIONS corrections

**darkMatter × crown**:
```
CURRENT:  "Sovereignty in the dark is sovereignty everywhere. Nothing depends on being witnessed."
CORRECTED: "Sovereignty in the dark is sovereignty everywhere. Presence announces itself."
```

**darkMatter × mirror**:
```
CURRENT:  "Knowing persists without image. The body holds what the eyes release."
CORRECTED: "Knowing holds. The body carries what the eyes release."
```

### TEMPORAL_WHISPERS corrections

**morning** (two lines):
```
CURRENT:  "Fresh attention is its own resource. Use it gently."
CORRECTED: "Fresh attention is its own resource. The whole day receives what you find here."

CURRENT:  "Morning steeping carries well into the day."
CORRECTED: "What you find this morning will be working in you all day."
```

### DEPTH_REGISTERS corrections

**deep** (one line):
```
CURRENT:  "The practice and the practitioner are becoming hard to separate."
CORRECTED: "The distinction between you and your practice has become academic. You are the practice."
```

### LIMINAL_REFLECTIONS — full editorial pass

After writing the pool:
```
CORRECT:  "The direction is still resolving. That is a complete state."
          [was: "The direction is not resolved. That is accurate, not wrong."]

CORRECT:  "What you are holding right now is finding its shape."
          [was: "What you are holding right now doesn't need to declare itself." — 
          the phrasing is invitational but slightly instructional ("doesn't need")]

CORRECT:  "The decision is still arriving."
          [was: "Not yet decided." — a header, not a reflection]
```

---

## Feature Set 6: The Conclave Relationship Architecture

This is an opportunity surfaced by the simulations but not part of the original three features. It addresses a question the simulations revealed: *what does the Sage say to a returning practitioner that honors what has accumulated without misreading their present state?*

The current system assigns Conclave to returning visitors regardless of whether their present moment is actually conclave-like (convergence of return, deepening, integration). The Conclave layer in `askSage` fires based on steep assignment, not on the quality of the return.

### 6.1 The Recognizing Opener

Rather than the depth register carrying this work (which fires ~50% of the time, probabilistically), add a `recognizingOpener` function that fires specifically for returning visitors whose steep is NOT Conclave but whose archiveWordCount signals real depth:

```js
function getRecognizingOpener(visitCount, archiveWordCount, steep) {
  if (visitCount < 3 || archiveWordCount === 0) return null;
  if (steep === 'conclave') return null; // conclave handles its own

  const openers = {
    low: [ // visit 3-9
      "You've been here before. The water holds what you brought.",
      "Something in you has been steeping since last time.",
    ],
    deep: [ // visit 10+
      "The practice recognizes you.",
      "You know the water by now. It knows you.",
    ]
  };

  const tier = visitCount >= 10 ? 'deep' : 'low';
  return Math.random() > 0.65 ? pickRandom(openers[tier]) : null;
}
```

This opener fires as a *prefix to the reflection*, distinct from the depth register. It acknowledges the return specifically when the visitor is in a non-conclave steep — "you've been here before, and right now you're in summits" rather than Conclave overriding the present state.

---

# PART IV: IMPLEMENTATION ORDER AND DEPENDENCIES

```
SPRINT 1 — Foundation
━━━━━━━━━━━━━━━━━━━━
CF-1  Conclave Capture fix (0.1)
CF-2  Crown underweighting fix (0.2)
CF-3  isInFlow false positive fix (0.3)
CF-4  Word-count conflation fix (0.4)
F0.5  gravityConfidence to derived state

  ↳ Validate: Re-run all 8 simulations manually against updated computeGravity()

SPRINT 2 — Intelligence
━━━━━━━━━━━━━━━━━━━━━━━
F1.1  refreshArchiveSignals() export + call in useSageWayfinding
F1.2  Post-response engagement signal (onSageEngagement)
F2.2  Liminal branch in askSage (requires gravityConfidence from Sprint 1)
      + LIMINAL_REFLECTIONS pool (with full Primer editorial pass)
F2.3  Visual gradient accent for liminal (App.jsx — minimal change)

SPRINT 3 — Layer Architecture
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
F3    computeActiveLayers() + isVulnerableQuery()
      Replaces all existing random-probability layer conditionals
      
  ↳ Validate: Trace the 7 critical archetypes through new assembly logic

F4    Sequential layer revelation (streamLayers)
      Replaces direct string concatenation + single stream

SPRINT 4 — Editorial + Conclave Architecture
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EQ-1..4  Primer compliance sweep (targeted text replacements only)
F6       getRecognizingOpener() addition

SPRINT 5 — Validation Pass
━━━━━━━━━━━━━━━━━━━━━━━━━━
- Run all 8 archetypes against complete implementation
- Primer three-movements check on each assembled response
- Sonic wayfinding alignment verification (correct steep → correct audio)
- localStorage signal freshness check (confirm refreshArchiveSignals works)
```

---

# PART V: THE PRIMER AS COMPANION — A STANDING CONTRACT

The Primer enters every content decision in this plan as a filter, not a reference. Applied here:

**The Couplet as calibration**: Every new piece of Sage language goes to the Couplet first. *The arc is the angle of change* — does it carry the precision of a physicist-poet? *Å Discovery Worth Steeping In* — does it carry time, temperature, surrender?

**Three Movements in every response**: For each simulated archetype, the assembled response must now:
1. Locate the practitioner inside their experience (their *actual* current state, not just their steep assignment)
2. Steep the experience in a concept (the mode × steep reflection earns this)
3. Leave with recognition, not instruction

**De-encabulation standing rule**: Any new reflection written for LIMINAL_REFLECTIONS or RECOGNIZING_OPENERS must pass the Residue Test (§9.11). The question: "What remains after reading — recognition, or admiration alone?" Admiration alone means it is still encabulated.

**The One-Line Law**: When in doubt about any new Sage text:
> *Name the mechanism. Keep the magic.*

---

## A Note on What the Simulations Revealed

The simulations did not find a broken Sage. They found a Sage whose intelligence is deeper than its expression layer currently allows. The gravity model has real insight — it reads stillness, velocity, vocabulary, depth, and return. The response arrays contain genuine quality. The tonal architecture (five modes × seven steeps) is rich.

What the simulations found is a set of structural conditions that prevent this intelligence from transmitting accurately:

- **Conclave Capture** turns "welcome back" into a default response for every engaged returning visitor.
- **Crown underweighting** means the apex of the journey is harder to reach the harder you work.
- **The 40-character cliff** blocks the invocation from the queries that need it most.
- **The word-count conflation** makes the Sage tone-deaf to the specific kind of silence that is resistance, rather than early exploration.
- **The layer stacking** creates Beautiful Fog at the moments that call for clear air.

Each of these has a precise fix. None of them requires rebuilding the intelligence. They require clearing the path between what the Sage knows and what the practitioner receives.

*The mechanism is present. The signal is real. De-encabulation is the correction.*

---

*Document prepared: May 2026*  
*Working branch: `claude/steeping-sage-design-kenkT`*  
*Companion: VesselVerse Editorial Protocol v3.1*  
*Next: Implementation begins at Sprint 1 upon alignment*
