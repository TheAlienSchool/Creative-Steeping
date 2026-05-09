import { useEffect, useRef, useCallback } from 'react';

// ==========================================
// THE ALCHEMICAL BOTANY BIOACOUSTIC ENGINE
// ==========================================
// Evolved from the L1 SonnetEngine.
// Grounded in 5D Biophilic Architecture & Era III Bioacoustics.
// Baseline: 528Hz Miracle Tone
// Root Foraging: 220Hz 

export function useBioacousticResonance(spatialSeed = 0) {
    const audioCtxRef = useRef(null);

    // Master routing
    const masterGainRef = useRef(null);
    const reverbNodeRef = useRef(null);
    
    // Bioacoustic Specific Layers
    const rootForagingOscRef = useRef(null);
    const rootForagingGainRef = useRef(null);
    const bioluminescentOscRef = useRef(null);

    const initEngine = useCallback(() => {
        if (audioCtxRef.current) {
            if (audioCtxRef.current.state === 'suspended') {
                audioCtxRef.current.resume();
            }
            return;
        }

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        audioCtxRef.current = ctx;

        // Master Volume Routing
        const masterGain = ctx.createGain();
        masterGain.gain.value = 0.6;
        masterGain.connect(ctx.destination);
        masterGainRef.current = masterGain;

        // Mycorrhizal Reverb Tail (Lush, expansive)
        const reverbLength = ctx.sampleRate * 6.0; // 6s diffuse tail
        const impulse = ctx.createBuffer(2, reverbLength, ctx.sampleRate);
        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            for (let i = 0; i < reverbLength; i++) {
                const decay = Math.exp(-i / (ctx.sampleRate * 2.0));
                channelData[i] = (Math.random() * 2 - 1) * decay;
            }
        }
        const convolver = ctx.createConvolver();
        convolver.buffer = impulse;
        convolver.connect(masterGain);
        reverbNodeRef.current = convolver;

    }, []);

    // -----------------------------------------------------
    // 1. THE 220Hz ROOT FORAGING FREQUENCY (Era III Botany)
    // -----------------------------------------------------
    const playRootForagingTone = useCallback((durationSeconds = 60) => {
        initEngine();
        const ctx = audioCtxRef.current;
        if (!ctx) return;

        // Clean up previous
        if (rootForagingOscRef.current) {
            rootForagingOscRef.current.stop();
            rootForagingOscRef.current.disconnect();
        }

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        // 220Hz: The exact frequency roots grow toward seeking water
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, ctx.currentTime);

        // Deep underwater low-pass filter
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, ctx.currentTime);
        // Gentle algorithmic filter movement
        filter.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + (durationSeconds * 0.5));
        filter.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + durationSeconds);

        // Volume envelope (Slow emergence)
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 4); // 4 second swell
        gain.gain.setValueAtTime(0.3, ctx.currentTime + durationSeconds - 5);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + durationSeconds);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(reverbNodeRef.current);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + durationSeconds);

        rootForagingOscRef.current = osc;
        rootForagingGainRef.current = gain;
    }, [initEngine]);

    // -----------------------------------------------------
    // 2. THE XYLEM CAVITATION CUE (The Alchemical Break)
    // -----------------------------------------------------
    const playXylemCavitation = useCallback(() => {
        initEngine();
        const ctx = audioCtxRef.current;
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const panner = ctx.createStereoPanner();
        
        // High frequency micro-pop representing the water tension breaking
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

        panner.pan.value = (Math.random() * 2) - 1; // Random spatial pop

        osc.connect(gain);
        gain.connect(panner);
        panner.connect(reverbNodeRef.current);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.8);
    }, [initEngine]);

    // -----------------------------------------------------
    // 3. THE MYCORRHIZAL TRANSMISSION (Collabination Pulse)
    // -----------------------------------------------------
    const playMycorrhizalPulse = useCallback((intensity = 0.5) => {
        initEngine();
        const ctx = audioCtxRef.current;
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // 528Hz Miracle Tone baseline
        osc.type = 'sine';
        osc.frequency.setValueAtTime(528, ctx.currentTime);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.15 * intensity, ctx.currentTime + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 3.0);

        osc.connect(gain);
        gain.connect(reverbNodeRef.current);

        osc.start();
        osc.stop(ctx.currentTime + 3.0);
    }, [initEngine]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
                audioCtxRef.current.close();
            }
        };
    }, []);

    return {
        initEngine,
        playRootForagingTone,
        playXylemCavitation,
        playMycorrhizalPulse
    };
}
