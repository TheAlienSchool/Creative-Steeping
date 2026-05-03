import React from 'react';

// ==========================================
// THE EYE OF THE SAGE (VESICA PISCIS)
// ==========================================
// Rendered above the Sage input. Comes alive when sageBusy is true.
// "An intelligence inhaling before it speaks."

export function EyeOfTheSage({ sageBusy, accentColor }) {
    return (
        <div className="sage-eye-container" style={{
            position: 'relative',
            width: '120px',
            height: '180px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: sageBusy ? 1 : 0.6,
            transition: 'opacity 1.2s ease',
            transform: 'scale(0.8)' // slightly scaled down to fit cleanly above input
        }}>

            {/* TOP CIRCLE: The Iris / Pupil */}
            <div style={{
                position: 'absolute',
                top: 0,
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                border: `1px solid ${accentColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'invert(0.1)',
                zIndex: 2
            }}>
                {/* The Pupil dilates (scales) when busy */}
                <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: accentColor,
                    transform: sageBusy ? 'scale(1.8)' : 'scale(1)',
                    transition: 'transform 2.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: sageBusy ? `0 0 20px ${accentColor}` : 'none'
                }} />
            </div>

            {/* BOTTOM CIRCLE: The Horizon / Processor */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                border: `1px solid ${accentColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                zIndex: 1
            }}>
                {/* The Horizon Lines rotate when busy */}
                <div style={{
                    width: '140%',
                    height: '140%',
                    background: `repeating-conic-gradient(from 0deg, transparent 0deg 10deg, ${accentColor} 10deg 11deg)`,
                    opacity: 0.15,
                    animation: sageBusy ? 'spin 8s linear infinite' : 'none',
                    transition: 'opacity 1.2s ease'
                }} />

                {/* Hard horizon crop */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '50%',
                    backgroundColor: 'var(--card)' // obscures top half of the bottom circle for the horizon effect
                }} />
            </div>

            {/* CSS Keyframes injected here for the spin since it's a standalone component */}
            <style>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
