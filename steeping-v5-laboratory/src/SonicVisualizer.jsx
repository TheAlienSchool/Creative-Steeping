import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * THE SONIC VISUALIZER
 * A visceral, medicinal visualizer for The Steeping Space.
 * Designed to reflect the 528Hz frequency as a somatic, breathing entity rather than a frantic frequency bar.
 */
export const SonicVisualizer = ({ 
    vesselId = 'VESSEL_00', 
    layer = 'LAYER_1', 
    intention = 'STILLNESS',
    audioContext = null, 
    audioSource = null,
    isPlaying = false 
}) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const analyserRef = useRef(null);
    
    // The visual palette of the Steeping Space
    const m = {
        accent: '#D4AF37', // The gold thread
        bg: '#050505',
        surface: '#0A0A0A',
        text1: '#EAEAEA',
        text2: '#A0A0A0'
    };

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        let analyser = null;
        let dataArray = null;

        // If an actual Web Audio context is passed, we connect to it.
        // Otherwise, we simulate the medicinal breathing based on the 'isPlaying' state.
        if (audioContext && audioSource) {
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            audioSource.connect(analyser);
            const bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);
            analyserRef.current = analyser;
        }

        let time = 0;

        const renderFrame = () => {
            time += 0.01;
            
            // Resize canvas to match display size
            const width = canvas.parentElement.clientWidth;
            const height = canvas.parentElement.clientHeight || 200;
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
            }

            ctx.clearRect(0, 0, width, height);

            const centerX = width / 2;
            const centerY = height / 2;

            // Get live audio data or simulate a slow somatic breath (Vagus nerve pacing, ~6 breaths per minute)
            let avgFrequency = 0;
            if (analyser && isPlaying) {
                analyser.getByteFrequencyData(dataArray);
                const sum = dataArray.reduce((a, b) => a + b, 0);
                avgFrequency = sum / dataArray.length;
            } else if (isPlaying) {
                // Simulate slow breathing resonance: 10 second cycle (6 breaths/min)
                avgFrequency = 50 + Math.sin(time * 0.6) * 30;
            } else {
                // Resting stillness
                avgFrequency = 10 + Math.sin(time * 0.2) * 5;
            }

            // Draw the Medicinal Ring (The Water)
            // It is not a frantic visualizer; it is a resonant pool.
            const baseRadius = Math.min(width, height) * 0.25;
            const reactiveRadius = baseRadius + (avgFrequency * 0.5);

            ctx.beginPath();
            ctx.arc(centerX, centerY, reactiveRadius, 0, 2 * Math.PI);
            
            // Create a gradient that mimics bioluminescence or gold dust in water
            const gradient = ctx.createRadialGradient(centerX, centerY, baseRadius * 0.5, centerX, centerY, reactiveRadius);
            gradient.addColorStop(0, `${m.accent}00`);
            gradient.addColorStop(0.8, `${m.accent}${Math.min(Math.floor(avgFrequency), 50).toString(16).padStart(2, '0')}`);
            gradient.addColorStop(1, `${m.accent}00`);

            ctx.fillStyle = gradient;
            ctx.fill();

            // Draw the Kintsugi Thread (The Boundary)
            ctx.beginPath();
            ctx.arc(centerX, centerY, baseRadius * 1.2 + (Math.sin(time) * 5), 0, 2 * Math.PI);
            ctx.strokeStyle = `${m.accent}40`;
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 12]);
            ctx.stroke();
            ctx.setLineDash([]);

            // Draw floating particles (The Resonance)
            const numParticles = 24;
            for (let i = 0; i < numParticles; i++) {
                const angle = (i / numParticles) * Math.PI * 2 + (time * 0.1);
                const pRadius = reactiveRadius * 0.9 + Math.sin(time * 2 + i) * 15;
                const px = centerX + Math.cos(angle) * pRadius;
                const py = centerY + Math.sin(angle) * pRadius;

                ctx.beginPath();
                ctx.arc(px, py, 1.5, 0, 2 * Math.PI);
                ctx.fillStyle = `${m.text1}${Math.floor((avgFrequency / 255) * 80 + 20).toString(16).padStart(2, '0')}`;
                ctx.fill();
            }

            animationRef.current = requestAnimationFrame(renderFrame);
        };

        renderFrame();

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            if (analyserRef.current && audioSource) {
                try { audioSource.disconnect(analyserRef.current); } catch(e) {}
            }
        };
    }, [audioContext, audioSource, isPlaying]);

    return (
        <div style={{
            position: 'relative', width: '100%', height: '100%', minHeight: '200px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />
            
            {/* The Cartridge Metadata / Intention Imprint */}
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}
                style={{
                    position: 'absolute', bottom: 'var(--space-md)', width: '100%',
                    display: 'flex', justifyContent: 'space-between', padding: '0 var(--space-xl)',
                    fontFamily: 'var(--fMono)', fontSize: '0.6rem', color: m.text2, letterSpacing: '0.2em',
                    pointerEvents: 'none', opacity: 0.6
                }}
            >
                <span>[ {layer} ]</span>
                <span style={{ color: m.accent }}>{intention}</span>
                <span>[ {vesselId} ]</span>
            </motion.div>
        </div>
    );
};
