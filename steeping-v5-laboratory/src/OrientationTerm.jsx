import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { OrientationGlossary } from './OrientationGlossary';

// A hover-definition wrapper for UI/feature terms, styled through the app's own
// m-token system (not Tailwind) — the "living organism" pop-up half of Orient Me.
// Sibling to AncestralPortal.jsx, which stays as-is for ancestral/lineage terms;
// this component owns a separate registry (OrientationGlossary) for UI orientation.
export const OrientationTerm = ({ term, m, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const entry = OrientationGlossary[term.toLowerCase()];
  if (!entry) return <>{children}</>;

  const handlePointerEnter = (e) => {
    const rect = e.target.getBoundingClientRect();
    setCoords({ x: Math.max(10, rect.left), y: rect.bottom + window.scrollY });
    setIsOpen(true);
  };

  const tooltip = (
    <div style={{
      position: 'absolute', zIndex: 100000, maxWidth: '280px',
      top: coords.y + 12, left: coords.x - 10,
      padding: '16px 18px', background: m.bg, border: `1px solid ${m.accent}40`,
      boxShadow: '0 20px 60px rgba(0,0,0,0.85)', pointerEvents: 'none',
      animation: 'fadeIn 0.4s ease-out'
    }}>
      <div style={{ fontFamily: 'var(--fMono)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: m.accent, opacity: 0.8, marginBottom: '6px' }}>
        {entry.label}
      </div>
      <div style={{ fontFamily: 'var(--fBody)', fontSize: '0.95rem', lineHeight: 1.6, color: m.text2 }}>
        {entry.definition}
      </div>
    </div>
  );

  return (
    <span
      style={{ cursor: 'help', borderBottom: `1px dashed ${m.accent}70`, transition: 'border-color 0.3s ease' }}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={() => setIsOpen(false)}
    >
      {children}
      {isOpen && typeof document !== 'undefined' ? createPortal(tooltip, document.body) : null}
    </span>
  );
};
