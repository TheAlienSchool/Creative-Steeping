import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useHonorings } from './useHonorings';
import { useSonnetEngine } from './useSonnetEngine';

export const AncestralPortal = ({ term, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const { registry } = useHonorings();
  const { playAncestralResonance } = useSonnetEngine('', {}); // We extract only what we need safely
  
  const honoring = registry[term.toLowerCase()];

  if (!honoring) return <>{children}</>;

  const handlePointerEnter = (e) => {
    const rect = e.target.getBoundingClientRect();
    setCoords({ x: Math.max(10, rect.left), y: rect.bottom + window.scrollY });
    setIsOpen(true);
    
    // Triggering the deep root note
    if (playAncestralResonance) {
       playAncestralResonance(honoring.frequencyHz);
    }
  };

  const tooltipElement = (
     <div 
        className="absolute z-[100] max-w-xs p-4 bg-void/95 backdrop-blur-md border border-oceanic/40 shadow-2xl pointer-events-none"
        style={{ 
           top: coords.y + 12, 
           left: coords.x - 20,
           animation: 'fadeIn 0.4s ease-out'
        }}
     >
        <div className="text-[10px] tracking-widest text-oceanic uppercase mb-1 font-mono">
          Lineage: {honoring.tradition}
        </div>
        <div className="text-lg font-serif text-incandescent mb-2">
          {honoring.elder}
        </div>
        <div className="text-sm text-starlight/90 leading-relaxed italic border-l-2 border-oceanic/50 pl-3">
          "{honoring.transmission}"
        </div>
        <div className="text-[9px] text-starlight/40 mt-3 flex justify-between">
           <span>{honoring.lineage}</span>
           <span>{honoring.frequencyHz}Hz</span>
        </div>
     </div>
  );

  return (
    <>
      <span 
        className="cursor-pointer border-b border-dashed border-oceanic/70 hover:text-incandescent hover:border-incandescent transition-all duration-300 relative group"
        onPointerEnter={handlePointerEnter}
        onPointerLeave={() => setIsOpen(false)}
      >
        {children}
        <div className="absolute -bottom-1 left-0 w-full h-[1px] bg-incandescent opacity-0 transform scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 origin-left transition-all duration-500"></div>
      </span>

      {/* We prepend the animation keyframes dynamically strictly for this component if needed, or rely on tailwind. We use standard react styles here. */}
      <style>{`
        @keyframes fadeIn {
           from { opacity: 0; transform: translateY(-5px); }
           to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {isOpen && document.body ? createPortal(tooltipElement, document.body) : null}
    </>
  );
};
