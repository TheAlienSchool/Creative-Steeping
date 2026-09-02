import { useEffect, useRef, useCallback } from 'react';

// ==========================================
// SCENE 5: THE SONNET AUDIO ENGINE
// ==========================================
// A binaural acoustic ecology driven by the Web Audio API. 
// "The sound of a hand moving through water" (Theremin Drone)
// "Resonate like a struck bowl" (Keystroke Sonification)

// C Major Pentatonic in A=444Hz Tuning (C5 = 528Hz "Miracle Tone")
const PENTATONIC_SCALE = [
    264.00, // C4
    296.33, // D4
    332.62, // E4
    395.55, // G4
    444.00, // A4
    528.00, // C5 (The Miracle Hz)
    592.67, // D5
    665.24  // E5
];

// 174Hz "Foundation" Solfeggio Pentatonic
const PENTATONIC_SCALE_174 = [
    174.00, // Root (Foundation Hz)
    195.75, // M2
    217.50, // M3
    261.00, // P5
    290.00, // M6
    348.00, // Root (Octave 1)
    391.50, // M2 (Octave 1)
    435.00  // M3 (Octave 1)
];

// 176Hz "BBB Edition" (Deep Desert Foundation)
const PENTATONIC_SCALE_176 = [
    176.00, // Finals Root
    198.00, // M2
    220.00, // M3
    264.00, // P5
    293.33, // M6
    352.00, // Root Octave 1
    396.00, // M2 Octave 1
    528.00  // P5 Miracle Hz directly included
];

// SONIC WAYFINDING — steep-specific harmonic signatures.
// Each steep modulates the striking bowl's timbre, decay, and pitch offset.
// The sonic palette shifts as the visitor's wayfinding position changes.
const STEEP_SONIC_SIGNATURES = {
    essence:   { waveform: 'sine',     decay: 3.5, filterMult: 3.0, pitchShift: 1.0,   panWidth: 0.3 },
    mosaic:    { waveform: 'sine',     decay: 2.0, filterMult: 4.0, pitchShift: 1.0,   panWidth: 0.6 },
    summits:   { waveform: 'sine',     decay: 2.5, filterMult: 5.0, pitchShift: 1.25,  panWidth: 0.4 },
    mirror:    { waveform: 'sine',     decay: 5.0, filterMult: 2.0, pitchShift: 1.0,   panWidth: 0.2 },
    labyrinth: { waveform: 'triangle', decay: 4.0, filterMult: 2.5, pitchShift: 0.75,  panWidth: 0.5 },
    conclave:  { waveform: 'sine',     decay: 4.0, filterMult: 3.5, pitchShift: 1.0,   panWidth: 0.35 },
    crown:     { waveform: 'sine',     decay: 6.0, filterMult: 6.0, pitchShift: 2.0,   panWidth: 0.15 },
};

export function useSonnetEngine(modeString, eqParams = { friction: 0, avian: 0, crackle: 0, drone: 0 }, currentSteep = 'essence') {
    const audioCtxRef = useRef(null);
    const activeScaleRef = useRef(PENTATONIC_SCALE);
    const steepSignatureRef = useRef(STEEP_SONIC_SIGNATURES.essence);

    // Ambient Drone Nodes
    const ambientOscRef = useRef(null);
    const ambientGainRef = useRef(null);
    const ambientPannerRef = useRef(null);
    const ambientFilterRef = useRef(null);

    // Master routing & Microcosm/Chase Bliss Aux Buses
    const masterGainRef = useRef(null);
    const reverbNodeRef = useRef(null);
    const delayNodeRef = useRef(null);
    const isAmbientActiveRef = useRef(false);

    // Subterranean EQ Nodes Layer Refs
    const frictionFilterRef = useRef(null);
    const frictionGainRef = useRef(null);

    // Oracle Booth Melodic Sequence Tracker
    const synthIndexRef = useRef(0);

    // Sage Essayist Composer — LFO refs for live ambient modulation
    const lfoRef = useRef(null);
    const lfoGainRef = useRef(null);
    const ampLfoRef = useRef(null);
    const ampLfoGainRef = useRef(null);

    // Natural Soundscape Layer Refs (Ocean Edge + Wind)
    const oceanGainRef = useRef(null);
    const oceanFilterRef = useRef(null);
    const windGainRef = useRef(null);
    const windPannerRef = useRef(null);
    const windFilterRef = useRef(null);

    // Initialize Audio Context on first interaction
    const initEngine = useCallback(() => {
        if (audioCtxRef.current) {
            if (audioCtxRef.current.state === 'suspended') {
                audioCtxRef.current.resume();
            }
            return;
        }

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return; // Browser unsupported

        const ctx = new AudioContext();
        audioCtxRef.current = ctx;

        // Master Volume Routing
        const masterGain = ctx.createGain();
        masterGain.gain.value = 0.5; // Starts at 50%
        masterGain.connect(ctx.destination);
        masterGainRef.current = masterGain;

        // 1. CHASE BLISS / MICROCOSM ARCHITECTURE (Aux Paths)
        // a. The Lush "Microcosm" Reverb (Generated IR)
        const reverbLength = ctx.sampleRate * 4.5; // 4.5s huge diffuse tail
        const impulse = ctx.createBuffer(2, reverbLength, ctx.sampleRate);
        const lChannel = impulse.getChannelData(0);
        const rChannel = impulse.getChannelData(1);
        for (let i = 0; i < reverbLength; i++) {
            // Exponential decay envelope for the synthetic impulse
            const decay = Math.exp(-i / (ctx.sampleRate * 1.5));
            lChannel[i] = (Math.random() * 2 - 1) * decay;
            rChannel[i] = (Math.random() * 2 - 1) * decay;
        }

        const convolver = ctx.createConvolver();
        convolver.buffer = impulse;
        const reverbGain = ctx.createGain();
        reverbGain.gain.value = 0.45; // 45% wet mix for that massive atmospheric space

        convolver.connect(reverbGain);
        reverbGain.connect(masterGain);
        reverbNodeRef.current = convolver;

        // b. The "Chase Bliss" Warped Tape Delay
        const delay = ctx.createDelay(5.0);
        delay.delayTime.value = 0.55; // Core 550ms rhythmic repeat

        const delayFilter = ctx.createBiquadFilter();
        delayFilter.type = 'lowpass';
        delayFilter.frequency.value = 900; // Very dark analog bucket-brigade style repeats

        const delayFeedback = ctx.createGain();
        delayFeedback.gain.value = 0.65; // High loop feedback to wash out

        // The Tape "Wow & Flutter" formulation (LFO modulating Delay Time)
        const warbleLFO = ctx.createOscillator();
        warbleLFO.type = 'sine';
        warbleLFO.frequency.value = 0.5; // Slowly dragging tape
        const warbleGain = ctx.createGain();
        warbleGain.gain.value = 0.008; // +/- 8ms time deviation to pitch-bend

        warbleLFO.connect(warbleGain);
        warbleGain.connect(delay.delayTime);
        warbleLFO.start();

        // Delay Bus Routing: Feed into itself, then to Master, AND bleed into Reverb
        delay.connect(delayFilter);
        delayFilter.connect(delayFeedback);
        delayFeedback.connect(delay);

        const delayOutGain = ctx.createGain();
        delayOutGain.gain.value = 0.35;
        delay.connect(delayOutGain);
        delayOutGain.connect(masterGain);
        delayOutGain.connect(convolver); // Push delay repeats directly into the massive reverb
        delayNodeRef.current = delay;

        // 2. Setup Ambient Drone (The cinematic atmosphere / Theremin)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const panner = ctx.createStereoPanner();
        const filter = ctx.createBiquadFilter();

        // Vibrato LFO (The undercurrent of miracle Hz)
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();

        // Wonder requires a purer, more celestial tone than a triangle
        osc.type = 'sine';
        osc.frequency.value = 264; // C4 base (exactly one octave below 528Hz)

        // LFO settings: a pulsing, loving 6Hz vibrato
        lfo.type = 'sine';
        lfo.frequency.value = 6.0;
        lfoGain.gain.value = 4.0; // Modulate frequency by +/- 4Hz for warmth

        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();
        lfoRef.current = lfo;
        lfoGainRef.current = lfoGain;

        // Filter out extreme high end but leave room for movement
        filter.type = 'lowpass';
        filter.frequency.value = 400;
        filter.Q.value = 1.0; // Lower resonance, softer edges

        // Sine oscillator is now silent — replaced by natural soundscape
        gain.gain.value = 0;

        // THE QUIET STORM: Somatic Heartbeat/Breath Amplitude LFO
        // A very slow, mellow pulse (0.2 Hz = 1 breath every 5 seconds) complementing the voice.
        const ampLfo = ctx.createOscillator();
        const ampLfoGain = ctx.createGain();
        ampLfo.type = 'sine';
        ampLfo.frequency.value = 0.2;
        ampLfoGain.gain.value = 0.03; // Gentle, barely perceptible volume fluctuation
        
        ampLfo.connect(ampLfoGain);
        ampLfoGain.connect(gain.gain);
        ampLfo.start();
        ampLfoRef.current = ampLfo;
        ampLfoGainRef.current = ampLfoGain;

        // Signal chain: Osc -> Filter -> Panner -> Gain -> Master Gain -> Out
        osc.connect(filter);
        filter.connect(panner);
        panner.connect(gain);
        gain.connect(masterGain);

        osc.start();

        // SUBTERRANEAN EQ: Setup Endogen Soil (Brown Noise Friction Engine)
        const frictionNode = ctx.createBufferSource();
        const bufferSize = ctx.sampleRate * 2; // 2 seconds of generative looping noise
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            data[i] = (lastOut + (0.02 * white)) / 1.02; // Standard Brown noise equation
            lastOut = data[i];
            data[i] *= 3.8; // Compensate for steep filtering attenuation
        }
        frictionNode.buffer = buffer;
        frictionNode.loop = true;

        const frictionFilter = ctx.createBiquadFilter();
        frictionFilter.type = 'lowpass';
        frictionFilter.frequency.value = 100; // Deep rumble by default

        const frictionGain = ctx.createGain();
        frictionGain.gain.value = 0; // Starts silent until Endogen EQ is active

        frictionNode.connect(frictionFilter);
        frictionFilter.connect(frictionGain);
        frictionGain.connect(masterGain);
        frictionNode.start();

        frictionFilterRef.current = frictionFilter;
        frictionGainRef.current = frictionGain;

        // OCEAN EDGE LAYER — brown noise shaped to simulate breaking waves
        const oceanSource = ctx.createBufferSource();
        const oceanBufSize = ctx.sampleRate * 4;
        const oceanBuf = ctx.createBuffer(1, oceanBufSize, ctx.sampleRate);
        const oceanData = oceanBuf.getChannelData(0);
        let oceanOut = 0;
        for (let i = 0; i < oceanBufSize; i++) {
            const wn = Math.random() * 2 - 1;
            oceanData[i] = (oceanOut + (0.02 * wn)) / 1.02;
            oceanOut = oceanData[i];
            oceanData[i] *= 3.5;
        }
        oceanSource.buffer = oceanBuf;
        oceanSource.loop = true;
        const oceanFilter = ctx.createBiquadFilter();
        oceanFilter.type = 'bandpass';
        oceanFilter.frequency.value = 320;
        oceanFilter.Q.value = 0.7;
        // Slow swell LFO — 0.1 Hz ≈ 10-second wave cycle
        const waveLFO = ctx.createOscillator();
        waveLFO.type = 'sine';
        waveLFO.frequency.value = 0.1;
        const waveLFOGain = ctx.createGain();
        waveLFOGain.gain.value = 0.006;
        waveLFO.connect(waveLFOGain);
        const oceanGain = ctx.createGain();
        oceanGain.gain.value = 0.015; // Silent until ambient activated
        waveLFOGain.connect(oceanGain.gain);
        waveLFO.start();
        oceanSource.connect(oceanFilter);
        oceanFilter.connect(oceanGain);
        oceanGain.connect(masterGain);
        oceanGain.connect(convolver); // Send some ocean into the reverb space
        oceanSource.start();
        oceanGainRef.current = oceanGain;
        oceanFilterRef.current = oceanFilter;

        // GENTLE WIND LAYER — pink noise approximation for a soft coastal breeze
        const windSource = ctx.createBufferSource();
        const windBufSize = ctx.sampleRate * 3;
        const windBuf = ctx.createBuffer(1, windBufSize, ctx.sampleRate);
        const windData = windBuf.getChannelData(0);
        let wb0=0, wb1=0, wb2=0, wb3=0, wb4=0, wb5=0, wb6=0;
        for (let i = 0; i < windBufSize; i++) {
            const wn = Math.random() * 2 - 1;
            wb0 = 0.99886 * wb0 + wn * 0.0555179;
            wb1 = 0.99332 * wb1 + wn * 0.0750759;
            wb2 = 0.96900 * wb2 + wn * 0.1538520;
            wb3 = 0.86650 * wb3 + wn * 0.3104856;
            wb4 = 0.55000 * wb4 + wn * 0.5329522;
            wb5 = -0.7616 * wb5 - wn * 0.0168980;
            windData[i] = (wb0 + wb1 + wb2 + wb3 + wb4 + wb5 + wb6 + wn * 0.5362) * 0.11;
            wb6 = wn * 0.115926;
        }
        windSource.buffer = windBuf;
        windSource.loop = true;
        const windFilter = ctx.createBiquadFilter();
        windFilter.type = 'bandpass';
        windFilter.frequency.value = 1200;
        windFilter.Q.value = 1.0;
        // Slow gust LFO — 0.06 Hz ≈ 16-second gust cycle
        const gustLFO = ctx.createOscillator();
        gustLFO.type = 'sine';
        gustLFO.frequency.value = 0.06;
        const gustLFOGain = ctx.createGain();
        gustLFOGain.gain.value = 0.008;
        gustLFO.connect(gustLFOGain);
        const windPanner = ctx.createStereoPanner();
        windPanner.pan.value = 0;
        const windGain = ctx.createGain();
        windGain.gain.value = 0.01; // Silent until ambient activated
        gustLFOGain.connect(windGain.gain);
        gustLFO.start();
        windSource.connect(windFilter);
        windFilter.connect(windPanner);
        windPanner.connect(windGain);
        windGain.connect(masterGain);
        windSource.start();
        windGainRef.current = windGain;
        windPannerRef.current = windPanner;
        windFilterRef.current = windFilter;

        ambientOscRef.current = osc;
        ambientGainRef.current = gain;
        ambientPannerRef.current = panner;
        ambientFilterRef.current = filter;

    }, []);

    // Ambient Drone Tuning Shift Based on Chosen Mode/Environment
    useEffect(() => {
        if (!audioCtxRef.current || !ambientOscRef.current) return;
        let targetHz = 264; // Default C4 / 528Hz division
        
        if (modeString === 'planetary') {
            activeScaleRef.current = PENTATONIC_SCALE_176;
            targetHz = 176; // Deeper desert foundation
        } else {
            activeScaleRef.current = PENTATONIC_SCALE;
        }

        ambientOscRef.current.frequency.setTargetAtTime(targetHz, audioCtxRef.current.currentTime, 1.5); // Slow elegant glide to new resonance
    }, [modeString]);

    // SONIC WAYFINDING: Update steep signature when wayfinding position changes
    useEffect(() => {
        steepSignatureRef.current = STEEP_SONIC_SIGNATURES[currentSteep] || STEEP_SONIC_SIGNATURES.essence;
    }, [currentSteep]);

    // Update physical parameters based on cursor movement (The 70mm Theremin)
    const updateBinauralTracking = useCallback((clientX, clientY, audioEngineMode = 'soul_sonnet') => {
        if (!audioCtxRef.current || !ambientPannerRef.current || !ambientFilterRef.current || !ambientOscRef.current) return;

        const { innerWidth, innerHeight } = window;

        // Normalize coordinates (0.0 to 1.0)
        const normX = clientX / innerWidth;
        const normY = clientY / innerHeight;

        // 1. X-Axis: Wind panning follows cursor left-right (gentle breeze direction)
        const panTarget = (normX * 2) - 1;
        if (windPannerRef.current) {
            windPannerRef.current.pan.setTargetAtTime(panTarget * 0.65, audioCtxRef.current.currentTime, 1.2);
        }

        // 2. Y-Axis: Wind intensity — higher cursor = stronger wind aloft
        if (windGainRef.current && isAmbientActiveRef.current) {
            const windIntensity = 0.025 + ((1 - normY) * 0.045);
            windGainRef.current.gain.setTargetAtTime(windIntensity, audioCtxRef.current.currentTime, 1.5);
        }

        // 3. Ocean gain — cursor lower on screen = closer to the shore
        if (oceanGainRef.current && isAmbientActiveRef.current) {
            const oceanIntensity = 0.018 + (normY * 0.012);
            oceanGainRef.current.gain.setTargetAtTime(oceanIntensity, audioCtxRef.current.currentTime, 2.5);
        }

        // Sine oscillator is replaced by the soundscape — keep gain at 0
        ambientGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.5);

    }, []);

    // Core Parameter Tracking for Subterranean EQ updates
    useEffect(() => {
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;
        
        // 1. Friction Layer Update (Endogen)
        if (frictionGainRef.current && frictionFilterRef.current) {
            const vol = eqParams?.friction * 0.15 || 0;
            const cutoff = 80 + (eqParams?.friction * 1400); // Opens up the hiss
            frictionGainRef.current.gain.setTargetAtTime(vol, ctx.currentTime, 0.4);
            frictionFilterRef.current.frequency.setTargetAtTime(cutoff, ctx.currentTime, 0.4);
        }

        // 2 & 3 & 4. Avian, Crackle, Drone updates are handled dynamically on trigger (below)
    }, [eqParams]);

    // Performant Serenity Voice Limiter
    const lastStrikeTimeRef = useRef(0);

    // Play a harmonic "bell" for keystrokes — modulated by Sonic Wayfinding
    const playStrikingBowl = useCallback((keyCode) => {
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;
        const sig = steepSignatureRef.current;

        // Performant Serenity: Limit polyphony explosion on rapid typing
        const now = ctx.currentTime;
        if (now - lastStrikeTimeRef.current < 0.05) return; // Prevent < 50ms overlap attacks
        lastStrikeTimeRef.current = now;

        // Determine pitch deterministically from the keyCode character
        const safeCode = (typeof keyCode === 'number' && !isNaN(keyCode)) ? keyCode : 50;
        const noteIndex = safeCode % activeScaleRef.current.length;
        const freq = activeScaleRef.current[noteIndex] * sig.pitchShift;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const panner = ctx.createStereoPanner();
        const filter = ctx.createBiquadFilter();

        // Waveform shifts with the steep (sine for most, triangle for labyrinth)
        osc.type = sig.waveform;
        osc.frequency.value = freq;

        filter.type = 'lowpass';
        filter.frequency.value = freq * sig.filterMult;

        // Envelope — decay stretches/contracts with the steep's character
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + sig.decay);

        // Stereo width shaped by steep — Mirror is narrow, Mosaic is wide
        panner.pan.value = (Math.random() * sig.panWidth * 2) - sig.panWidth;

        osc.connect(filter);
        filter.connect(panner);
        panner.connect(gain);

        // Connect to dry master
        gain.connect(masterGainRef.current || ctx.destination);

        // Tap the Microcosm / Chase Bliss architecture Aux routes
        if (reverbNodeRef.current) gain.connect(reverbNodeRef.current);
        if (delayNodeRef.current) gain.connect(delayNodeRef.current);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + sig.decay + 0.5);

    }, []);

    const playHarmonicChord = useCallback((index, pitchMultiplier = 1, noteCount = 3) => {
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;

        // We invite 3 notes from the pentatonic scale to build a resonant cluster
        // This cultivates alignment, as every note resides deeply within the 528Hz tuning.
        const safeIndex = (typeof index === 'number' && !isNaN(index)) ? index : 0;
        const scale = activeScaleRef.current;
        const base = safeIndex % scale.length;

        // Root, +2 steps (usually a 4th or 5th), +4 steps (often the octave)
        const triadIndices = [
            base,
            (base + 2) % scale.length,
            (base + 4) % scale.length
        ].slice(0, noteCount);

        triadIndices.forEach((noteIndex, i) => {
            // If the note wrapped around, push it up an octave for clarity
            const isOctaveUp = noteIndex < base;
            const freq = scale[noteIndex] * (isOctaveUp ? 2 : 1) * pitchMultiplier;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const panner = ctx.createStereoPanner();
            const filter = ctx.createBiquadFilter();

            osc.type = 'sine';
            osc.frequency.value = freq;

            filter.type = 'lowpass';
            filter.frequency.value = freq * 3;

            // Envelopes stagger slightly for cascading triad effect
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.08 - (i * 0.02), ctx.currentTime + 0.05 + (i * 0.1));
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 6.0); // Very long decay

            panner.pan.value = (Math.random() * 0.8) - 0.4;

            osc.connect(filter);
            filter.connect(panner);
            panner.connect(gain);

            gain.connect(masterGainRef.current || ctx.destination);
            if (reverbNodeRef.current) gain.connect(reverbNodeRef.current);
            if (delayNodeRef.current) gain.connect(delayNodeRef.current);

            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 7.0);
        });
    }, []);

    // ALGORAVE SYNTH: A responsive, thick subtractive synthesizer mimicking a performative instrument
    const playAlgoraveSynth = useCallback((keyCode, modeString = 'incandescent') => {
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;

        const scale = activeScaleRef.current;
        
        // ORACLE BOOTH LESSON: Algorithmic Melodic Leap & Octave Breathing 
        const step = synthIndexRef.current++;
        const cycle = Math.floor(step / scale.length);
        const baseIndex = ((step * 2) + cycle) % scale.length;
        
        // Octave Breathing pattern (vertical motion)
        const octavePattern = [0.5, 1, 2, 1, 0.5, 1, 2, 4];
        const octave = octavePattern[step % octavePattern.length];
        
        const freq = scale[baseIndex] * octave;

        // Routing
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        const panner = ctx.createStereoPanner();
        const filter = ctx.createBiquadFilter();

        // Environment Specific Sound Design Variables
        let targetVolume = 0.08;
        let decayTimeConstant = 1.2;
        let filterDropRate = 0.4;
        let wetMix = 1.5;

        // INCANDESCENT: Fireplace warmth, bonfire flamboyance, candle radiance
        // Wood popping transience, crackling saturation, warmer filter, shorter decay
        if (modeString === 'incandescent') {
            osc1.type = (keyCode % 2 === 0) ? 'sawtooth' : 'square';
            osc2.type = 'triangle';
            osc2.frequency.value = freq * 1.01; // Detune thickness

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(freq * 8, ctx.currentTime); // Brighter snap/crackle
            filterDropRate = 0.15; // Snappier popping like fire

            targetVolume = 0.05; // slightly quieter to leave room for crackle attack
            decayTimeConstant = 0.6; // Shorter tail, dry heat 
            wetMix = 0.6; // Let it stay close and intimate
        }

        // OCEANIC: the depths of ocean echo, subatomic ping, Sofar sonar
        // Sub-heavy, pure clean waves, long sweeping filter, massive wet tail
        else if (modeString === 'oceanic') {
            osc1.type = 'sine';
            osc2.type = 'triangle';
            osc2.frequency.value = freq * 0.505; // Deep sub-harmonic drone

            filter.type = 'bandpass'; // Sonar ping resonance
            filter.Q.value = 6.0;
            filter.frequency.setValueAtTime(freq * 12, ctx.currentTime);
            filterDropRate = 0.5; // Smooth sweeping submarine ping

            targetVolume = 0.12; // Louder to overcome bandpass slice
            decayTimeConstant = 2.0; // Long trailing wash
            wetMix = 2.5; // Immersed fully in water (reverb/delay)
        }

        // EMERGENT: A sound mirror in deep space, receptive, responsive echos in time's space
        // Ethereal, shimmering, glassy overtone clarity, incredible vast decay
        else if (modeString === 'emergent') {
            osc1.type = 'sine';
            osc2.type = 'sawtooth';
            osc2.frequency.value = freq * 2.01; // Glassy overtone shimmer / Sound mirror

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(freq * 6, ctx.currentTime); // Soft glass
            filterDropRate = 1.2; // Unfolding, slow opening in deep space

            targetVolume = 0.04; // Softer initial strike
            decayTimeConstant = 3.5; // Infinite void decay
            wetMix = 3.5; // Huge space mirror (maximum Aux send)
        }

        // PLANETARY: Breezy Beach Evening, Bonfire of Release
        // Softer, gentler, night air, divine action
        else if (modeString === 'planetary') {
            osc1.type = 'sine'; // Pure gentle air
            osc2.type = 'triangle'; // Warmth of a bonfire (softer than sawtooth)
            
            // Sub-drone EQ (Tetrahedral): Subtly shifts tuning and mixes much louder
            const drop = eqParams?.drone > 0.3 ? 0.25 : 0.502; // Massively deep foundations
            osc2.frequency.value = freq * drop; 

            filter.type = 'lowpass'; 
            filter.Q.value = 1.2; // Smooth, breathing filter, no harsh ping
            filter.frequency.setValueAtTime(freq * 3, ctx.currentTime); // Muffled highs, thick night air
            filterDropRate = 0.8; // Slower, breezier filter close

            targetVolume = 0.09 + (eqParams?.drone * 0.04 || 0); // Drone thickens main synth too
            decayTimeConstant = 2.2; // Gentle release into the night like drifting embers
            wetMix = 1.8; // Expansive but grounded, feels like open air rather than a metallic cavern
        }

        osc1.frequency.value = freq;
        // Sub-drone EQ fallback if not configured above
        if (modeString !== 'planetary') {
            osc2.frequency.value = freq * ((eqParams?.drone > 0.4) ? 0.25 : 0.501); 
            // if heavily weighting drone, drops two full octaves
        }
        filter.frequency.setTargetAtTime(freq, ctx.currentTime, filterDropRate);

        // Env: Custom attack/decay for the environment
        const attackTime = modeString === 'planetary' ? 0.07 : 0.04;
        const decayStart = modeString === 'planetary' ? 0.12 : 0.08;
        
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(targetVolume, ctx.currentTime + attackTime); // Strike or swell in
        gain.gain.setTargetAtTime(0, ctx.currentTime + decayStart, decayTimeConstant); // Bleed out

        panner.pan.value = (Math.random() * 0.8) - 0.4;

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(panner);
        panner.connect(gain);

        // Send a healthy amount to the dry channels
        gain.connect(masterGainRef.current || ctx.destination);

        // Boost the wet signal send drastically based on environment 'wet' vibe request
        const wetGain = ctx.createGain();
        wetGain.gain.value = wetMix;
        gain.connect(wetGain);

        if (reverbNodeRef.current) wetGain.connect(reverbNodeRef.current);
        if (delayNodeRef.current) wetGain.connect(delayNodeRef.current);

        // Tactile Crackle EQ layer (Kinetic Typing Texture)
        if (eqParams?.crackle > 0.01) {
            const crackleOsc = ctx.createOscillator();
            const crackleGain = ctx.createGain();
            crackleOsc.type = 'square'; // Very harsh friction microsound 
            crackleOsc.frequency.setValueAtTime(3000 + Math.random() * 4000, ctx.currentTime);
            
            crackleGain.gain.setValueAtTime((eqParams.crackle || 0) * 0.08, ctx.currentTime);
            crackleGain.gain.setTargetAtTime(0, ctx.currentTime + 0.005, 0.015); // Sharp 15ms snap
            
            crackleOsc.connect(crackleGain);
            crackleGain.connect(masterGainRef.current);
            crackleOsc.start(ctx.currentTime);
            crackleOsc.stop(ctx.currentTime + 0.04);
        }

        // ORACLE BOOTH LESSON: Algorithmic Ghost Notes (Auditory Shadows)
        if (modeString === 'emergent' || modeString === 'oceanic') {
            const ghostOsc = ctx.createOscillator();
            const ghostGainNode = ctx.createGain();
            const ghostFilter = ctx.createBiquadFilter();
            
            // Transposed +2 steps up the pentatonic scale
            const ghostIndex = (baseIndex + 2) % scale.length;
            const ghostFreq = scale[ghostIndex] * (octave * 2); // Jump an octave high
            
            ghostOsc.type = 'sine';
            ghostOsc.frequency.setValueAtTime(ghostFreq, ctx.currentTime);
            
            ghostFilter.type = 'bandpass';
            ghostFilter.frequency.value = ghostFreq * 2;
            
            // Ghost triggers 55ms late
            const ghostDelay = 0.055;
            ghostGainNode.gain.setValueAtTime(0, ctx.currentTime + ghostDelay);
            ghostGainNode.gain.linearRampToValueAtTime(targetVolume * 0.35, ctx.currentTime + ghostDelay + 0.1);
            ghostGainNode.gain.setTargetAtTime(0, ctx.currentTime + ghostDelay + 0.2, decayTimeConstant * 1.4);
            
            ghostOsc.connect(ghostFilter);
            ghostFilter.connect(ghostGainNode);
            ghostGainNode.connect(wetGain); // Route ghosts heavily to reverb
            
            ghostOsc.start(ctx.currentTime + ghostDelay);
            ghostOsc.stop(ctx.currentTime + 8.0);
        }

        osc1.start(ctx.currentTime);
        osc2.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 6.0); // Safe cushion to ensure delay lines catch everything
        osc2.stop(ctx.currentTime + 8.0);
    }, [eqParams]);

    // A faint harmonic signature that plays at random octaves while The Sage Considers
    const playConsideringHarmonic = useCallback(() => {
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;

        const scale = activeScaleRef.current;
        const baseIndex = Math.floor(Math.random() * scale.length);
        const octaveShift = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3 octaves up
        const freq = scale[baseIndex] * Math.pow(2, octaveShift);

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const panner = ctx.createStereoPanner();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.value = freq * 1.5;

        // Faint, slow attack and long trail
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 2.0);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 8.0);

        panner.pan.value = (Math.random() * 1.6) - 0.8; // Wide panning

        osc.connect(filter);
        filter.connect(panner);
        panner.connect(gain);

        gain.connect(masterGainRef.current || ctx.destination);
        if (reverbNodeRef.current) gain.connect(reverbNodeRef.current);
        if (delayNodeRef.current) gain.connect(delayNodeRef.current);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 10.0);
    }, []);

    // Generative "Towhee" Avian Trill (Subterranean EQ integration for Time Symphony)
    const playSandSonnet = useCallback(() => {
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;

        const scale = activeScaleRef.current;
        
        // Trill Complexity mapping based on the Tetrahedral Eq
        const trillComplexity = 1 + Math.floor((eqParams?.avian || 0) * 6); // 1 burst (default) up to 7 micro-trills
        const avianAmount = eqParams?.avian || 0;

        for (let i = 0; i < trillComplexity; i++) {
            const baseIndex = Math.floor(Math.random() * scale.length);
            const baseMultiplier = 2 + (avianAmount > 0.3 ? 2 : 0); // Push higher if avian is heavily engaged
            const freq = scale[baseIndex] * baseMultiplier + (Math.random() * (avianAmount * 200)); 

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const panner = ctx.createStereoPanner();

            osc.type = 'sine'; // Gentle, organic whistle
            
            const timeOffset = ctx.currentTime + (i * (0.04 + Math.random() * 0.04)); // Random rapid sputtering offsets
            
            osc.frequency.setValueAtTime(freq, timeOffset);
            osc.frequency.linearRampToValueAtTime(freq * (1.01 + avianAmount * 0.1), timeOffset + 0.5);

            gain.gain.setValueAtTime(0, timeOffset);
            
            if (trillComplexity > 1) {
                // Bright, chirping short envelopes
                gain.gain.linearRampToValueAtTime(0.005 + (avianAmount * 0.01), timeOffset + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.0001, timeOffset + 0.15 + Math.random() * 0.2); 
            } else {
                // The default, slow, single metronomic breath (0 Avian EQ)
                gain.gain.linearRampToValueAtTime(0.003, timeOffset + 0.1); 
                gain.gain.exponentialRampToValueAtTime(0.0001, timeOffset + 1.5); 
            }

            panner.pan.value = (Math.random() * 0.8) - 0.4; 

            osc.connect(panner);
            panner.connect(gain);
            gain.connect(masterGainRef.current || ctx.destination);
            
            // Route complex avian birdsong into the cavernous reverb
            if (avianAmount > 0.1 && reverbNodeRef.current) gain.connect(reverbNodeRef.current);

            osc.start(timeOffset);
            osc.stop(timeOffset + 2.0);
        }
    }, [eqParams]);

    // ORACLE BOOTH LESSON: Dedicated Mystical Completion Cue
    // 7-note ascending scale indicating profound narrative/task resolution
    const playCompletionCue = useCallback(() => {
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;
        const scale = activeScaleRef.current;
        
        // The Oracle's magical progression: root, 3rd, 5th, octave, 10th, 12th, 2xOctave
        const cueOffsets = [0, 2, 4, 5, 7, 9, 10]; 
        
        cueOffsets.forEach((offsetSteps, index) => {
            const baseFreq = scale[offsetSteps % scale.length];
            const octaveBoost = Math.floor(offsetSteps / scale.length);
            const freq = baseFreq * Math.pow(2, octaveBoost);
            
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            
            // Wait 120ms between notes
            const timeOffset = ctx.currentTime + (index * 0.120);
            
            gain.gain.setValueAtTime(0, timeOffset);
            gain.gain.linearRampToValueAtTime(0.04, timeOffset + 0.05); // Smooth chime
            // Decay scales upward so higher notes ring longer
            gain.gain.setTargetAtTime(0, timeOffset + 0.1, 0.45 + (index * 0.08)); 
            
            osc.connect(gain);
            gain.connect(masterGainRef.current);
            
            // Heavy wash of reverb/delay for the mystical cue
            if (reverbNodeRef.current) gain.connect(reverbNodeRef.current);
            if (delayNodeRef.current) gain.connect(delayNodeRef.current);
            
            osc.start(timeOffset);
            osc.stop(timeOffset + 5.0);
        });
    }, []);

    // ANCESTRAL RESONANCE: A deep, grounding bell that suspends time when an elder is invoked
    const playAncestralResonance = useCallback((frequency = 174) => {
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sine'; // A pure, deep tone
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(frequency * 4, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(frequency, ctx.currentTime + 2.0);

        // Very long, ancient attack and decay (like hitting a massive gong slowly)
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 1.5); // Slow 1.5s swell
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 12.0); // 12.0s decay

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGainRef.current || ctx.destination);
        
        // Massive spatial placement
        if (reverbNodeRef.current) gain.connect(reverbNodeRef.current);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 14.0);
    }, []);

    const playRootForagingFrequency = useCallback(() => {
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const panner = ctx.createStereoPanner();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(220.00, ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, ctx.currentTime);
        
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 3.0);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 65.0);

        panner.pan.setValueAtTime(-0.5, ctx.currentTime);
        panner.pan.linearRampToValueAtTime(0.5, ctx.currentTime + 60.0);

        osc.connect(filter);
        filter.connect(panner);
        panner.connect(gain);
        
        gain.connect(masterGainRef.current || ctx.destination);
        if (reverbNodeRef.current) gain.connect(reverbNodeRef.current);
        if (delayNodeRef.current) gain.connect(delayNodeRef.current);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 66.0);
    }, []);

    const setMasterVolume = useCallback((val) => {
        if (masterGainRef.current && audioCtxRef.current) {
            masterGainRef.current.gain.setTargetAtTime(val, audioCtxRef.current.currentTime, 0.1);
        }
    }, []);

    const setAmbientActive = useCallback((isActive) => {
        isAmbientActiveRef.current = isActive;
        if (!audioCtxRef.current) return;
        // Sine oscillator stays silent — natural soundscape takes over
        if (ambientGainRef.current) {
            ambientGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.5);
        }
        // Ocean: fade in to 0.05 when active, retreat to near-silence when off
        if (oceanGainRef.current) {
            oceanGainRef.current.gain.setTargetAtTime(isActive ? 0.042 : 0.001, audioCtxRef.current.currentTime, 2.0);
        }
        // Wind: fade in to 0.03 when active, retreat to near-silence when off
        if (windGainRef.current) {
            windGainRef.current.gain.setTargetAtTime(isActive ? 0.03 : 0.006, audioCtxRef.current.currentTime, 2.0);
        }
    }, []);

    // Time Symphony Mode Override (174Hz Foundation Resonance)
    const setSymphonyTuning = useCallback((isSymphony) => {
        activeScaleRef.current = isSymphony ? PENTATONIC_SCALE_174 : PENTATONIC_SCALE;

        // Glide the Theremin drone to match the foundation frequency
        if (ambientOscRef.current && audioCtxRef.current) {
            const targetHz = isSymphony ? 174 : 264;
            ambientOscRef.current.frequency.setTargetAtTime(targetHz, audioCtxRef.current.currentTime, 1.0); // 1-second smooth glide
        }
    }, []);

    // ==========================================
    // SAGE ESSAYIST COMPOSER
    // ==========================================
    // Each mode × flow phase has a sonic personality. The composer
    // glides the ambient drone through these states as the Essayist
    // moves from threshold → opening → current → depth → crystallizing.

    const MODE_ESSAYIST_PERSONALITIES = {
        incandescent: {
            kindling:      { droneFreq: 264, lfoRate: 0.12, lfoDepth: 4,  filterCutoff: 320, breathRate: 0.18 },
            opening:       { droneFreq: 264, lfoRate: 0.22, lfoDepth: 8,  filterCutoff: 480, breathRate: 0.22 },
            current:       { droneFreq: 396, lfoRate: 0.35, lfoDepth: 14, filterCutoff: 700, breathRate: 0.28 },
            depth:         { droneFreq: 264, lfoRate: 0.18, lfoDepth: 7,  filterCutoff: 420, breathRate: 0.16 },
            crystallizing: { droneFreq: 528, lfoRate: 0.10, lfoDepth: 3,  filterCutoff: 900, breathRate: 0.14 },
        },
        oceanic: {
            // Sub-harmonic pressure → sonar ping resonance → surface light
            kindling:      { droneFreq: 88,  lfoRate: 0.07, lfoDepth: 2,  filterCutoff: 180, breathRate: 0.10 },
            opening:       { droneFreq: 110, lfoRate: 0.12, lfoDepth: 4,  filterCutoff: 280, breathRate: 0.13 },
            current:       { droneFreq: 132, lfoRate: 0.15, lfoDepth: 6,  filterCutoff: 440, breathRate: 0.17 },
            depth:         { droneFreq: 88,  lfoRate: 0.06, lfoDepth: 8,  filterCutoff: 200, breathRate: 0.08 },
            crystallizing: { droneFreq: 220, lfoRate: 0.18, lfoDepth: 3,  filterCutoff: 600, breathRate: 0.14 },
        },
        emergent: {
            // Deep space mirror: absolute quiet → cascading reflections → singular overtone
            kindling:      { droneFreq: 132, lfoRate: 0.04, lfoDepth: 1,  filterCutoff: 200, breathRate: 0.12 },
            opening:       { droneFreq: 132, lfoRate: 0.07, lfoDepth: 2,  filterCutoff: 280, breathRate: 0.15 },
            current:       { droneFreq: 264, lfoRate: 0.09, lfoDepth: 3,  filterCutoff: 500, breathRate: 0.18 },
            depth:         { droneFreq: 176, lfoRate: 0.05, lfoDepth: 2,  filterCutoff: 250, breathRate: 0.10 },
            crystallizing: { droneFreq: 528, lfoRate: 0.06, lfoDepth: 2,  filterCutoff: 800, breathRate: 0.12 },
        },
        planetary: {
            // 176Hz celestial foundation → night sky choir → dawn light
            kindling:      { droneFreq: 176, lfoRate: 0.09, lfoDepth: 3,  filterCutoff: 240, breathRate: 0.15 },
            opening:       { droneFreq: 176, lfoRate: 0.13, lfoDepth: 5,  filterCutoff: 340, breathRate: 0.18 },
            current:       { droneFreq: 220, lfoRate: 0.16, lfoDepth: 7,  filterCutoff: 460, breathRate: 0.22 },
            depth:         { droneFreq: 176, lfoRate: 0.07, lfoDepth: 4,  filterCutoff: 290, breathRate: 0.14 },
            crystallizing: { droneFreq: 352, lfoRate: 0.11, lfoDepth: 3,  filterCutoff: 580, breathRate: 0.16 },
        },
        darkMatter: {
            // Pre-silence → gravitational density → single point of light
            kindling:      { droneFreq: 88,  lfoRate: 0.03, lfoDepth: 1,  filterCutoff: 140, breathRate: 0.08 },
            opening:       { droneFreq: 110, lfoRate: 0.05, lfoDepth: 2,  filterCutoff: 190, breathRate: 0.10 },
            current:       { droneFreq: 132, lfoRate: 0.09, lfoDepth: 3,  filterCutoff: 280, breathRate: 0.13 },
            depth:         { droneFreq: 88,  lfoRate: 0.04, lfoDepth: 2,  filterCutoff: 160, breathRate: 0.08 },
            crystallizing: { droneFreq: 264, lfoRate: 0.07, lfoDepth: 2,  filterCutoff: 380, breathRate: 0.11 },
        },
    };

    // Morph the ambient drone to match the Essayist's current mode × flow phase.
    // All transitions use long time constants so shifts feel like weather, not switches.
    const setEssayistAmbient = useCallback((phase, modeStr) => {
        if (!audioCtxRef.current || !ambientOscRef.current || !lfoRef.current) return;
        const ctx = audioCtxRef.current;
        const modeKey = MODE_ESSAYIST_PERSONALITIES[modeStr] ? modeStr : 'incandescent';
        const p = MODE_ESSAYIST_PERSONALITIES[modeKey][phase] ?? MODE_ESSAYIST_PERSONALITIES[modeKey].kindling;
        const t = ctx.currentTime;
        ambientOscRef.current.frequency.setTargetAtTime(p.droneFreq, t, 2.5);
        lfoRef.current.frequency.setTargetAtTime(p.lfoRate, t, 3.0);
        lfoGainRef.current.gain.setTargetAtTime(p.lfoDepth, t, 3.0);
        ambientFilterRef.current.frequency.setTargetAtTime(p.filterCutoff, t, 2.5);
        if (ampLfoRef.current) {
            ampLfoRef.current.frequency.setTargetAtTime(p.breathRate, t, 4.0);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Brief musical accent when the Essayist crosses a flow phase threshold.
    // Each phase has its own gestural signature — like punctuation in the sonic field.
    const playEssayistTransition = useCallback((phase) => {
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;
        const scale = activeScaleRef.current;
        const t = ctx.currentTime;

        if (phase === 'opening') {
            // Two-note ascending gesture — "a door has opened"
            [0, 2].forEach((step, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const freq = scale[step % scale.length] * 2;
                osc.type = 'sine';
                osc.frequency.value = freq;
                const start = t + i * 0.45;
                gain.gain.setValueAtTime(0, start);
                gain.gain.linearRampToValueAtTime(0.035, start + 0.18);
                gain.gain.exponentialRampToValueAtTime(0.001, start + 3.0);
                osc.connect(gain);
                gain.connect(masterGainRef.current || ctx.destination);
                if (reverbNodeRef.current) gain.connect(reverbNodeRef.current);
                osc.start(start); osc.stop(start + 4.0);
            });
        } else if (phase === 'current') {
            // Three-note ascending phrase — "the current is found"
            [0, 2, 4].forEach((step, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const freq = scale[step % scale.length] * 2;
                osc.type = 'sine';
                osc.frequency.value = freq;
                const start = t + i * 0.16;
                gain.gain.setValueAtTime(0, start);
                gain.gain.linearRampToValueAtTime(0.055, start + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, start + 2.2);
                osc.connect(gain);
                gain.connect(masterGainRef.current || ctx.destination);
                if (reverbNodeRef.current) gain.connect(reverbNodeRef.current);
                if (delayNodeRef.current) gain.connect(delayNodeRef.current);
                osc.start(start); osc.stop(start + 3.0);
            });
        } else if (phase === 'depth') {
            // Single sub-octave tone — "dropping into still water"
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = scale[0] * 0.5;
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.09, t + 1.4);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 8.0);
            osc.connect(gain);
            gain.connect(masterGainRef.current || ctx.destination);
            if (reverbNodeRef.current) gain.connect(reverbNodeRef.current);
            osc.start(t); osc.stop(t + 9.0);
        } else if (phase === 'crystallizing') {
            // Descending → resolving two-step gesture — "form finding its final shape"
            [4, 2, 3].forEach((step, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const freq = scale[step % scale.length] * 2;
                osc.type = 'sine';
                osc.frequency.value = freq;
                const start = t + i * 0.38;
                gain.gain.setValueAtTime(0, start);
                gain.gain.linearRampToValueAtTime(0.032, start + 0.12);
                gain.gain.exponentialRampToValueAtTime(0.001, start + 4.0);
                osc.connect(gain);
                gain.connect(masterGainRef.current || ctx.destination);
                if (reverbNodeRef.current) gain.connect(reverbNodeRef.current);
                osc.start(start); osc.stop(start + 5.5);
            });
        }
    }, []);

    // Receptive initialization on any interaction to support the flow of the very first keystroke
    useEffect(() => {
        const handleEagerInit = () => {
            initEngine();
            window.removeEventListener('mousedown', handleEagerInit);
            window.removeEventListener('touchstart', handleEagerInit);
            window.removeEventListener('keydown', handleEagerInit);
        };

        window.addEventListener('mousedown', handleEagerInit);
        window.addEventListener('touchstart', handleEagerInit);
        window.addEventListener('keydown', handleEagerInit);

        return () => {
            window.removeEventListener('mousedown', handleEagerInit);
            window.removeEventListener('touchstart', handleEagerInit);
            window.removeEventListener('keydown', handleEagerInit);

            if (audioCtxRef.current) {
                audioCtxRef.current.close();
            }
        };
    }, [initEngine]);

    return {
        initEngine,
        updateBinauralTracking,
        playStrikingBowl,
        playHarmonicChord,
        playAlgoraveSynth,
        playSandSonnet,
        playConsideringHarmonic,
        playCompletionCue,
        playAncestralResonance,
        playRootForagingFrequency,
        setMasterVolume,
        setAmbientActive,
        setSymphonyTuning,
        setEssayistAmbient,
        playEssayistTransition,
    };
}
