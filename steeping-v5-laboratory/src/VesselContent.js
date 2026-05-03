// ==========================================
// V5 TRANSLATION MATRIX: VESSEL DATA
// ==========================================
// Extracted from "What is CREÅTIVE STEEPING__Vessels.md"
// Houses the 9 core vessels mapping the Steeperverse philosophy, 
// formatted to build the 54-slot mode matrices.

export const VESSELS = [
    {
        num: "00",
        name: "Welcome to\nCREÅTIVE STEEPING",
        invocation: "A sanctuary for your becoming,\nA quiet act of remembering,\nThe flavor is you.",
        body: "You are here to claim your native rhythm. Creative Steeping functions as a devotion to self-narration; a cellular-level invitation to feel your intelligence beyond thought and directly into knowing. As a solo Steeper, this portal operates as your private tea space. You are encouraged to brew your blend, bring your journal, and witness your own unfolding with creative trust. We are made of water. Tea teaches us this truth: the leaf (external) enters the water (internal) and transforms the whole.",
        reflection: [
            "What brought you to this quiet sanctuary today?",
            "What is the flavor of your curiosity in this exact moment?"
        ],
        interaction: {
            prompt: "In the space below, declare your primary reason for arriving.",
            placeholder: "I am here because..."
        },
        bgUrl: `${import.meta.env.BASE_URL}assets/steeperverse/10_the_alchemist.jpg`
    },
    {
        num: "01",
        name: "Essence of My Being",
        invocation: "A quiet cup,\nThe journey starts within the steam,\nYou meet yourself.",
        body: "Something knows before you do. Before the first word arrives, there is an essence that has always been present. Creative Steeping begins by returning to that foundational ground. It operates as a self-narration prerogative: the active assertion of your right to hear your own voice and trust the wisdom it carries. This first steep asks you to locate what remains when every assigned label has been removed. That remainder is yours. It has always been.",
        reflection: [
            "What is one truth you know about yourself, right in this moment, that cannot be taken away?",
            "If your curiosity had a flavor, what would it be today?"
        ],
        interaction: {
            prompt: "In the space below, write a single sentence that begins with \"I am...\"",
            placeholder: "I am..."
        },
        bgUrl: `${import.meta.env.BASE_URL}assets/steeperverse/10_mirrorwrights_forge.jpg`
    },
    {
        num: "02",
        name: "The Mechanism of Alertness",
        invocation: "The world outside,\nA universe within the cup,\nBoth worlds are yours.",
        body: "There is a particular quality of attention that arrives when the cup is still and the room has quieted. Something in the body slows without being asked. Tea has been inducing this state for millennia — through L-theanine, a compound that broadens your alpha waves and activates the Default Mode Network: the brain's reflective, associative mode. The mode where insight arrives sideways. Steeping functions as a practice of applied patience. It acts as the conscious choice to create a container for contemplation, allowing time to introduce you to new flavors of awareness.",
        reflection: [
            "Where in your day could you create a small container for quiet contemplation?",
            "What is one mundane activity that you could approach with a new sense of curiosity?"
        ],
        interaction: {
            prompt: "Complete the following sentence: The part of my day I usually rush through the most is [__]. Today, I will approach it with [__].",
            placeholder: "The part of my day..."
        },
        bgUrl: `${import.meta.env.BASE_URL}assets/steeperverse/04_low_string_dock.jpg`
    },
    {
        num: "03",
        name: "Mirror Gazing",
        invocation: "Tea becomes a mirror,\nThe practice of seeing beyond,\nThe surface reflects deeper.",
        body: "With your essence identified and the container built, you now gaze into the reflection. The liquid in your cup is a mirror for your consciousness. We begin the practice of observing the observer. What looks back at you when you finally stop moving?",
        reflection: [
            "If the tea were reflecting your deepest creative block, what would it look like?",
            "Who is looking back at you?"
        ],
        interaction: {
            prompt: "Write down the deepest unacknowledged truth you see reflected in the water. Claim it.",
            placeholder: "I have always known..."
        },
        bgUrl: `${import.meta.env.BASE_URL}assets/steeperverse/02_pattern_garden_nebula.jpg`
    },
    {
        num: "04",
        name: "Heart of Being",
        invocation: "The scattered thoughts,\nLike leaves before the water,\nFind their form in warmth.",
        body: "There is a moment when what you feel inside matches what you do outside. Coherence is the state of being whole and undivided. It is the choice to listen to the whisper of your intuition rather than the volume of your ego. As you watch the tea leaves unfurl, you are witnessing your own integration.",
        reflection: [
            "In what areas of your life do you feel the most coherent and aligned?",
            "What truths does your heart whisper when the room gets quiet?"
        ],
        interaction: {
            prompt: "Name one area of your life where you would like to cultivate greater coherence:",
            placeholder: "I seek coherence in..."
        },
        bgUrl: `${import.meta.env.BASE_URL}assets/steeperverse/07_dissonance_cloud.jpg`
    },
    {
        num: "05",
        name: "Mosaic of Experiences",
        invocation: "The fragments gather,\nA river from the inner sea,\nWholeness finds voice.",
        body: "Your story holds more at once than any single thread can carry. The tender moments and the difficult ones. The losses that shaped direction and the wins that were never celebrated. All of it present, all of it yours. Mosaic of Experiences is the practice of placing each piece in the light, allowing the pattern to reveal its inherent structural integrity. Your journal is the vessel that holds it. The unspoken finds its voice there.",
        reflection: [
            "How do your seemingly fractured experiences form a greater wholeness?",
            "If your journal could speak, what would it say to you right now?"
        ],
        interaction: {
            prompt: "Begin a letter to a part of yourself that you wish to understand better. You do not need to finish it.",
            placeholder: "Dear..."
        },
        bgUrl: `${import.meta.env.BASE_URL}assets/steeperverse/06_breath_path.jpg`
    },
    {
        num: "06",
        name: "The Empathy Map",
        invocation: "A hand reaches out,\nTerritory becomes tone,\nThe body knows first.",
        body: "We extend awareness outward. Your steep has saturated your internal space, and now it must spill over. How does your essence meet the world? The Empathy Map is the practice of tasting connection, of recognizing that the observer in you is the exact same observer in the person beside you.",
        reflection: [
            "Where do you and the world intersect most beautifully?",
            "How can your unique flavor of curiosity serve someone else today?"
        ],
        interaction: {
            prompt: "Write down the name of someone you wish to understand more deeply, and one question you want to ask them.",
            placeholder: "I want to ask..."
        },
        bgUrl: `${import.meta.env.BASE_URL}assets/steeperverse/16_the_steeping_space_planet.jpg`
    },
    {
        num: "07",
        name: "Creative Activation",
        invocation: "The final vessel,\nIntegration and emergence,\nThe authority is yours.",
        body: "The time spent holding must eventually become the act of offering. You are the author of your own experience, and this is where the voice within fully awakens. You have steeped in these vessels, wrestled with the reflections, and engaged with the interactions. You are ready to pour.",
        reflection: [
            "What is the most significant creative insight you have gained on this journey?",
            "What wants to be expressed through you right now?"
        ],
        interaction: {
            prompt: "Write a single sentence declaring your creative intention moving forward.",
            placeholder: "I am ready to..."
        },
        bgUrl: `${import.meta.env.BASE_URL}assets/steeperverse/13_the_neutrino_stream.jpg`
    },
    {
        num: "08",
        name: "About the Author",
        invocation: "The cup held full,\nPoured into the world it shapes,\nThe author signs here.",
        body: "You arrived as a visitor. You leave as the author. Every vessel you entered, every reflection you sat with, every interaction you completed — that is the work. The practice extends beyond this portal. It carries a signature now. This steep asks you to place it.",
        reflection: [
            "What is the most significant insight you have gained?",
            "How has your understanding of yourself shifted?"
        ],
        interaction: {
            prompt: "Sign your name as the author of this experience.",
            placeholder: "By..."
        },
        bgUrl: `${import.meta.env.BASE_URL}assets/steeperverse/15_the_human_as_star.jpg`
    }
];
