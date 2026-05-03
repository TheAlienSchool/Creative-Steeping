import React, { useEffect, useRef } from 'react';

export const SteeperverseBackground = ({ accentColor }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId;
        let stars = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        };

        const initStars = () => {
            stars = [];
            const numStars = Math.floor((window.innerWidth * window.innerHeight) / 3000); // Density
            for (let i = 0; i < numStars; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.5 + 0.1,
                    vx: (Math.random() - 0.5) * 0.1,
                    vy: (Math.random() - 0.5) * 0.1,
                    alpha: Math.random(),
                    alphaDir: Math.random() > 0.5 ? 1 : -1,
                    speedMultiplier: Math.random() * 0.02 + 0.005
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Use accent color for stars with varying opacity
            const [r, g, b] = hexToRgb(accentColor) || [255, 255, 255];

            stars.forEach(star => {
                // Update position (slow drift)
                star.x += star.vx;
                star.y += star.vy;

                // Wrap around edges
                if (star.x < 0) star.x = canvas.width;
                if (star.x > canvas.width) star.x = 0;
                if (star.y < 0) star.y = canvas.height;
                if (star.y > canvas.height) star.y = 0;

                // Update alpha (twinkle)
                star.alpha += star.alphaDir * star.speedMultiplier;
                if (star.alpha <= 0.1) {
                    star.alpha = 0.1;
                    star.alphaDir = 1;
                } else if (star.alpha >= 0.8) {
                    star.alpha = 0.8;
                    star.alphaDir = -1;
                }

                // Draw star
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${star.alpha})`;
                ctx.fill();

                // Add slight glow
                if (star.radius > 1) {
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = accentColor;
                } else {
                    ctx.shadowBlur = 0;
                }
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? [
                parseInt(result[1], 16),
                parseInt(result[2], 16),
                parseInt(result[3], 16)
            ] : null;
        };

        window.addEventListener('resize', resize);
        resize();
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [accentColor]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none',
                opacity: 0.6,
                mixBlendMode: 'screen',
                transition: 'opacity 2s ease'
            }}
        />
    );
};
