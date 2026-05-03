import { useEffect, useRef } from 'react';

// ==========================================
// V5 PHYSICS: SUBATOMIC RESONANCE CANVAS
// ==========================================
// Replaces V4 floating particles with a slow, exfiltrating wave mesh.
// Creates a sense of subatomic buoyancy and frequency when struck.

export function useResonanceCanvas(modeAccentRGB) {
    const canvasRef = useRef(null);
    const ripplesRef = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        // Fixed geographic nodes that conduct the resonance
        const nodes = [];
        const spacing = 80;
        for (let x = 0; x < width; x += spacing) {
            for (let y = 0; y < height; y += spacing) {
                // Offset alternating rows to create hexagon/diamond tessellation feel
                const xOffset = (y / spacing) % 2 === 0 ? 0 : spacing / 2;
                nodes.push({ baseX: x + xOffset, baseY: y, x: x + xOffset, y: y });
            }
        }

        // Colors mapping
        let [r, g, b] = modeAccentRGB || [212, 146, 42];

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', resize);

        // Add a ripple function to expose to the component
        const addRipple = (x, y) => {
            ripplesRef.current.push({
                x, y,
                radius: 0,
                maxRadius: Math.max(width, height) * 0.8,
                speed: 1.2,       // Very slow expansion (buoyancy, not punch)
                life: 1.0,        // Starts full strength
                decay: 0.004      // Extremely slow decay (~4.2 seconds)
            });
        };

        // Attach to window click for global resonance
        const onClick = (e) => addRipple(e.clientX, e.clientY);
        window.addEventListener('click', onClick);

        let animationId;
        const render = () => {
            ctx.clearRect(0, 0, width, height);

            // 1. Process and draw ripples
            const activeRipples = [];

            ripplesRef.current.forEach(rip => {
                rip.radius += rip.speed;
                rip.life -= rip.decay;

                if (rip.life > 0) {
                    activeRipples.push(rip);

                    // Draw the leading edge of the subatomic exhalation
                    ctx.beginPath();
                    ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${rip.life * 0.15})`;
                    ctx.lineWidth = 1 + (rip.life * 2);
                    ctx.stroke();
                }
            });
            ripplesRef.current = activeRipples;

            // 2. Draw the nodes and apply wave displacement
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.2)`;

            nodes.forEach(node => {
                let dxSum = 0;
                let dySum = 0;
                let intensitySum = 0;

                // Calculate displacement from all active ripples
                activeRipples.forEach(rip => {
                    const dx = node.baseX - rip.x;
                    const dy = node.baseY - rip.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // If the node is exactly on the wave crest
                    const distFromWave = Math.abs(dist - rip.radius);
                    if (distFromWave < 40) {
                        // Push node outward along the wave normal
                        const push = Math.sin((1 - distFromWave / 40) * Math.PI) * 12 * rip.life;
                        dxSum += (dx / dist) * push;
                        dySum += (dy / dist) * push;
                        intensitySum += rip.life * (1 - distFromWave / 40);
                    }
                });

                // Spring physics: pull back to base position
                node.x += (node.baseX + dxSum - node.x) * 0.1;
                node.y += (node.baseY + dySum - node.y) * 0.1;

                // Draw the node
                const size = 1 + (intensitySum * 1.5);
                ctx.beginPath();
                ctx.arc(node.x, node.y, size, 0, Math.PI * 2);

                // Node pulses brighter as wave passes through it
                if (intensitySum > 0.1) {
                    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.2 + (intensitySum * 0.4)})`;
                } else {
                    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.15)`;
                }

                ctx.fill();
            });

            animationId = requestAnimationFrame(render);
        };

        render();

        // The returned trigger function allows manual firing from React (e.g., onKeyDown)
        canvasRef.current.triggerResonance = addRipple;

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('click', onClick);
            cancelAnimationFrame(animationId);
        };
    }, [modeAccentRGB]);

    return canvasRef;
}
