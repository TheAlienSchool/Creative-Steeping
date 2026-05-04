# Building a sacred geometry music tool for embodied, live-coded learning

The most effective music theory learning tool for a dyslexic live coder would fuse **Coltrane's geometric spirituality**, **gamelan's interlocking patterns**, and **embodied cognition principles** into an audio-first, visually-driven system where code becomes instrument. The research reveals a striking convergence: from Coltrane's hand-drawn mandalas to Scriabin's color-light keyboards to kotekan's complementary patterns, music's deepest thinkers consistently discovered that harmony is **spatial, cyclical, and bodily**—not textual.

This report synthesizes findings across six interconnected domains, prioritizing frameworks that bypass text-heavy notation while honoring the mathematical-spiritual traditions that connect sound to cosmos.

---

## Coltrane's tone circle as design blueprint

John Coltrane's hand-drawn diagram, gifted to saxophonist Yusef Lateef between sets at a 1961 gig and published in Lateef's *Repository of Scales and Melodic Patterns* (1981), offers a profound template for visualizing harmony. Unlike the standard circle of fifths, Coltrane drew **two concentric rings** representing hexatonic whole-tone scales (C–D–E–F♯–G♯–A♯ outer; B–D♭–E♭–F–G–A inner), with a **pentagram connecting the Do notes** and circled chromatic neighbor tones forming what physicist Stephon Alexander calls "a unified theory of music."

The diagram encodes the harmonic engine behind "Giant Steps"—**three tonal centers separated by major thirds** (B, G, E♭) forming an augmented triad that divides the octave into three equal parts. This creates the notorious "Coltrane Changes": 26 chord changes in 16 bars, each major chord preceded by its dominant. Coltrane described the bass line as "kind of lop-sided... going from minor thirds to fourths" rather than strictly chromatic movement.

For learning tool design, the Coltrane Circle reveals **sacred geometry embedded in practical music theory**:
- The **Star of David/hexagram** emerges from augmented triads
- The **pentagram** connects whole-tone relationships  
- The **Merkaba** (star tetrahedron) represents "light-spirit-body" and appears when extending to 3D

Coltrane studied Einstein, the Bhagavad Gita, and Nicolas Slonimsky's *Thesaurus of Scales and Melodic Patterns* (directly quoting passages in "Giant Steps"). His spiritual awakening in 1957 led him to seek music that could "make others happy"—the diagram was his attempt to map cosmic harmony visually. An interactive learning tool could animate the Coltrane Circle, showing how chord progressions trace geometric paths and how "A Love Supreme's" four-note motif (F–A♭–A–B♭) appears in all 12 keys during "Acknowledgement."

---

## Live coding pedagogy and the flow channel

The three dominant live coding environments—**Tidal Cycles**, **Strudel**, and **Sonic Pi**—share pedagogical DNA that aligns with Csikszentmihalyi's flow research. Each prioritizes **immediate sonic feedback**, **pattern-based thinking**, and **minimal installation friction** (Strudel runs entirely in-browser at strudel.cc).

Sonic Pi creator Sam Aaron developed his tool through extensive collaboration with UK schools, emphasizing "conceptual efficiency"—minimum complexity for maximum creative output. His core insight: treating **code as musical instrument and self-expression**, not programming exercise. The built-in tutorials use progressive disclosure, starting with `play 60` and building to complex compositions.

Tidal Cycles uses "mini-notation" that compresses musical patterns into cycles: `d1 $ sound "kick snare kick snare"` creates a four-beat loop. Learning advances through pattern grouping, Euclidean rhythms (distributing beats mathematically), and control patterns that modify sound parameters. Common beginner challenges include understanding cycle/time relationships and pattern combination logic (the leftmost pattern determines rhythm).

Flow state research identifies **eight conditions** critical for learning tool design:

1. Clear goals with immediate feedback
2. Balance between challenge and skill ("flow channel")
3. Concentration and focused attention
4. Loss of self-consciousness
5. Sense of control
6. Altered perception of time
7. Intrinsic reward (autotelic experience)

The key insight: **skill-challenge balance is dynamic**. As learners improve, challenge must increase to maintain flow. Music is ideal for flow because it provides instant feedback and clear structure. The warning against "junk flow" (superficial game mechanics that become addictive without producing growth) suggests prioritizing intrinsic motivation through autonomy, competence, and creative expression over points and badges.

Adaptive learning systems like Yousician and EarMaster use AI to identify strengths/weaknesses and dynamically adjust difficulty. Stanford research on "RealEarTrainer" shows that **connecting exercises to learners' favorite songs** dramatically enhances motivation—a principle directly applicable to live coding.

---

## Color-sound mappings from Newton to Scriabin

The attempt to connect color wheels and tone circles has a **320-year history** beginning with Isaac Newton's 1704 *Opticks*, which mapped seven spectral colors (ROYGBIV) to the seven notes of the Dorian mode, believing colors and music shared analogous mathematical ratios. This "cosmic harmony" concept persisted through Louis-Bertrand Castel's 1726 "Ocular Harpsichord" (a keyboard producing colored light, intended partly to help deaf people "see" music) to Alexander Scriabin's **clavier à lumières**.

Scriabin's color-key assignments follow the circle of fifths: C=Red, G=Orange, D=Yellow, A=Green, E=Sky blue, B=Blue, F♯=Bright blue/violet, and so on. When arranged spectrally (ROYGBIV), the colors produce the circle of fifths sequence. His 1910 *Prometheus: Poem of Fire* included a "Luce" part with two color lines—one following the circle of fifths, one following tonal center. The work premiered at Carnegie Hall in 1915, after Scriabin's death; Yale University created a successful multimedia performance in 2010.

Research on chromesthesia (sound-to-color synesthesia) confirms that pitch classes have consistent "rainbow hues" even in non-synesthetes: do=red, re=yellow, mi=green through si=violet. Colors associate more with pitch-class **names** than raw sounds—a concept-mediated mapping. This suggests color-coding in learning tools should be **consistent and conceptually grounded**, not arbitrary.

For practical implementation, Margaret Hubicki's "Coloured Staff" system for dyslexic learners uses: A=pink, B=dark blue, C=red, D=orange, E=yellow, F=green, G=light blue. The **Boomwhacker colors** (C=red, D=orange, E=yellow, F=green, G=teal, A=purple, B=pink) are widely recognized in educational contexts.

---

## Gamelan as alternative harmonic framework

Gamelan music theory offers a **complete alternative to Western chord-based thinking**, potentially transformative for learners struggling with conventional theory. The two tuning systems—**slendro** (5 notes, roughly equal spacing of ~240 cents) and **pelog** (7 notes, unequal intervals)—create emotional landscapes impossible in 12-tone equal temperament.

Slendro, named after the 8th-century Sailendra dynasty, produces a "light, cheerful atmosphere" used for war scenes and marching, but becomes sad/romantic when played "miring" (out of place). Pelog feels "manly, regal, and sacred"—especially in pelog nem notation. Crucially, **each gamelan is uniquely tuned**; instruments from different sets cannot mix. Where Western tuning is culture-wide standard, gamelan tuning is ensemble-wide standard.

The **ombak** (beating/wave) created by paired instruments tuned 5-10 Hz apart produces gamelan's characteristic shimmer—considered a "stepping stone to meditative state." This inharmonic quality relates to the metallophone overtones, which don't follow the harmonic series. William Sethares argues: "The inharmonic spectra of gamelan instruments are related to pelog and slendro scales in the same way harmonic spectra relate to Western diatonic scales."

**Kotekan** (interlocking patterns) is gamelan's most live-coding-relevant concept. Two independent parts—**polos** (on-beat) and **sangsih** (off-beat)—combine to create "the illusion of a single melodic line faster than any human could play." Colin McPhee documented that parts are "incomplete when played alone and dependent exclusively on each other." The technique uses minimal building blocks (single note, single rest, pair of adjacent tones) combined into four types:

- **Nyog cag**: Simple alternation at fastest tempos
- **Nyok cok**: Neighbor-note motion anticipating melody
- **Kotekan telu**: Three-tone cells creating 3-against-4 cross-rhythms
- **Kotekan empat**: Four tones with no shared notes, generating emergent "third rhythm"

For live coding, kotekan principles translate directly: **simple rules create complex emergent patterns**. Design complementary processes that "fill gaps" of each other, focus on synchronization, and build polyrhythms from modular cells. Steve Reich's phasing technique was influenced by his 1973-74 study of Balinese gamelan, though his phase-shifting approach differs from traditional interlocking.

---

## Embodied cognition and the dyslexic learner

The 4E model of cognition—**Embodied, Embedded, Enactive, Extended**—revolutionizes music learning design. Research shows musical understanding emerges from brain-body integration, not abstract mental processing. The body helps us **anticipate and predict** musical elements; different movements make different aspects of music salient.

**Dalcroze Eurhythmics**, developed by Émile Jaques-Dalcroze, provides the foundational model: "We do not only listen to music with our ears, it resonates in our whole body, in the brain and the heart." The method trains structural elements (beat, rhythm, meter) and aesthetic elements (dynamics, articulation, affect) **through movement before visual representation**. Key strategies include quick-reaction games responding to changing musical cues, canons in sound and motion, and time-space-energy explorations.

For dyslexic learners, standard notation presents specific barriers:
- Sight-reading requires simultaneous horizontal AND vertical processing
- "Third transposition" errors (reading notes one line/space too high/low)
- Text-heavy theory materials compound reading difficulties

Evidence-based beneficial approaches include:

- **Color-coding systems** (colors stimulate more neurological activity than neutral stimuli)
- **Multi-sensory methods** combining hearing, vision, and movement
- **Audio-first teaching** (learning by ear before notation)
- **The Orff approach**: "Experience first, then intellectualize"
- **Kodály method**: Aural-oral-kinesthetic before written-visual-abstract

Research on Cognitivo-Musical Training shows that **18 hours of rhythmic/temporal musical training** significantly improves categorical perception, auditory attention, phonological awareness, and reading abilities in dyslexic learners. Music-language analogies mean training music improves shared brain circuits.

**Entrainment**—being "pulled" toward synchronization with music—is universal and progression-based: finding → keeping → being the beat. **Alignment** includes phase alignment (moving to the beat) and inter-phase alignment (visualizing melody, dynamics, harmony through movement). A learning tool should leverage these by allowing gesture input and body-based interaction.

For "warm" vs. "clinical" technology design, research identifies key elements: **human-like features**, **rounded lines** instead of sharp edges, **warm colors**, and **anthropomorphic qualities**. Body-based metaphors for music interfaces include: pitch is up/down, intervals have sizes/lengths, chords are containers for notes, progression is movement along a path.

---

## Visualization tools and the Tonnetz alternative

Beyond the standard circle of fifths, the **Tonnetz** (tone-network) offers a powerful alternative visualization. Invented by Leonhard Euler in 1739 and revived by neo-Riemannian theorists, it represents tonal space as a triangular lattice where major and minor triads appear as triangles sharing common tones. Three axes represent perfect fifths, major thirds, and minor thirds; the 3D form wraps into a **torus**.

Neo-Riemannian transformations move between adjacent triangles:
- **P (Parallel)**: C major ↔ C minor
- **R (Relative)**: C major ↔ A minor  
- **L (Leading-tone exchange)**: C major ↔ E minor

These compound to create "chromatic mediants" popular in film scoring. Interactive Tonnetz tools at tonnetz.liamrosenfeld.com and girlinbluemusic.com demonstrate how voice-leading movements trace elegant paths across the grid.

**Hooktheory** (hooktheory.com) pioneered data-driven music theory visualization. Their Trends tool shows chord probability based on **65,000+ analyzed songs**—as you build progressions, larger shapes indicate more common following chords. TheoryTab database breaks real songs into visual chord/melody representations, and Hookpad provides intelligent chord suggestions during composition.

**Chrome Music Lab** (musiclab.chromeexperiments.com) offers 13 experiments including Song Maker (grid-based composition), Spectrogram (frequency visualization), and Kandinsky (draw shapes that become music). Built on Tone.js and Web Audio API, it's fully open-source and works on any device with zero setup.

For accessibility, research recommends:
- Don't rely on color alone; use shape, pattern, texture, position
- Avoid red-green and blue-yellow combinations
- Use ColorBrewer or Viridis/Plasma palettes (perceptually uniform, colorblind-safe)
- Maximum 8 colors for categories
- WCAG 2.1 AA requires 4.5:1 contrast ratio for text

**Lightnote** (lightnote.co) demonstrates excellent progressive disclosure: scrolling lessons reveal complexity gradually, using numbers (1-12) before traditional note names. Waveform visualization shows actual wave shapes for intervals, making ratios tangible.

---

## Implementation cheat codes for the learning tool

Based on the synthesis of all research domains, here are actionable frameworks for building the music theory tool:

**Architecture principles**:
- **Sound-first**: Audio is always primary; visuals support sonic experience
- **Immediate feedback**: Real-time audio response for all interactions
- **No reading required**: Iconic/symbolic representations replace text
- **Body-integrated**: Design for gesture and movement as input
- **Warm aesthetics**: Rounded shapes, friendly colors, encouraging feedback

**Coltrane Circle implementation**:
- Animate the two-ring structure with highlighted chord progressions
- Show geometric patterns (pentagram, hexagram) for different scale relationships
- Trace Giant Steps changes as paths through the circle
- Map whole-tone, diminished, and chromatic relationships to distinct visual layers

**Kotekan live coding patterns**:
- Build exercises around complementary pattern creation
- Design "polos" and "sangsih" templates that combine into composite melodies
- Use 3-against-4 polyrhythms from kotekan telu as rhythmic challenges
- Show how simple rules create complex emergent results

**Flow channel design**:
- Start with minimal features, expand through mastery
- Dynamic difficulty adjustment based on performance
- Connect to learner's existing musical preferences (favorite songs as examples)
- Treat "wrong" choices as productive exploration, not failure

**Dyslexia-friendly interface**:
- Consistent color-coding (consider Scriabin's circle-of-fifths spectrum or Hubicki's system)
- Spatial rather than linear representations
- Audio instructions as default, text as optional
- Large, high-contrast interactive elements
- Support oral/aural learning modes

**Visualization stack**:
- p5.js with p5.sound for creative coding visualization
- Tonnetz for showing voice-leading and transformations
- Circular representations for scales and modes
- Animation for chord transitions and progression flow
- Sankey-style diagrams for chord probability flows

**Choose-your-own-adventure structure**:
- Branch by learning modality (visual/auditory/kinesthetic paths)
- Branch by musical interest (rhythm-first vs. melody-first vs. harmony-first)
- Allow "wrong" paths to loop back with new insights
- Use narrative context to embed abstract concepts

The convergence across domains is clear: from Coltrane's cosmological diagrams to gamelan's interlocking parts to embodied cognition research, **music learning works best when it's geometric, cyclical, bodily, and alive**. The most innovative music minds have always reached toward sacred geometry and multi-sensory experience—a live-coded learning tool can finally realize what Newton, Scriabin, Coltrane, and the Balinese masters imagined.