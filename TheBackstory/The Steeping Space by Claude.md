import React, { useState, useEffect, useRef, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════  
// THE STEEPING SPACE v3.0  
// An Operating System for Presence  
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────────  
// RESONANCE LIBRARY  
// ─────────────────────────────────────────────────────────────────────────────────

const RESONANCE\_LIBRARY \= {  
  checks: \[  
    "Authenticity recognized.",  
    "Presence confirmed.",  
    "You are here. That matters.",  
    "The observer is observed.",  
    "Attention registered.",  
    "Signal received.",  
    "Frequency aligned.",  
    "Recognition flows both ways.",  
    "You arrived exactly when you needed to.",  
    "The field responds to you.",  
  \],  
  insights: \[  
    "The cup of tea does not exist independently of the one who drinks.",  
    "What you seek in the leaf, you find.",  
    "Observation is the first act of creation.",  
    "The silence between notes makes the music.",  
    "Your attention is the most powerful element in any creative act.",  
    "Creativity is not acquired—it is uncovered.",  
    "The ordinary is where it happens.",  
    "Different thinking inspired Apples and Marvels.",  
    "The boundary between observer and observed exists only in untrained minds.",  
    "When you truly see anything without expectation, that is love.",  
    "A beginner asks 'What is this?' A master asks 'Who is asking?'",  
    "The first sip is taken by your expectations. The third sip is taken by reality.",  
  \],  
  references: \[  
    "Master Lin: 'Two leaves from the same branch.'",  
    "Bhante G: 'Mindfulness is not mystification.'",  
    "The Introscope: Observing the interstitionary spaces.",  
    "Surface Tension: Where consciousness meets form.",  
    "PING: Pattern Identification & Notification.",  
    "HDM: Human Development Mathematics.",  
    "The Default Mode Network activates in the mundane.",  
    "Kotekan: Interlocking patterns create wholeness.",  
    "The Circle of Fifths: Harmonic relationships in motion.",  
    "Gamelan: Where time becomes texture.",  
  \],  
  science: \[  
    "The DMN activates during repetitive tasks—steeping is neurological.",  
    "Attention reshapes neural pathways.",  
    "Flow states emerge from the balance of challenge and skill.",  
    "Mirror neurons fire when we observe intentional action.",  
    "The brain cannot distinguish vividly imagined from real.",  
    "Resonance: when frequencies align, amplitude increases.",  
    "Entrainment: systems synchronize when in proximity.",  
    "Proprioception: the body knows where it is in space.",  
    "The vagus nerve connects breath to calm.",  
    "Neuroplasticity: the brain rewires through attention.",  
  \],  
  values: \[  
    "Clarity heals.",  
    "Different is the doorway, not the obstacle.",  
    "The pot is warm. The leaves are waiting.",  
    "We are here for each other.",  
    "Action orientation transforms insight to impact.",  
    "Your legacy is yours to craft.",  
    "The journey of self-actualization is never truly complete.",  
    "Alienation is advanced perceptual technology.",  
    "Consciousness technology serves human coherence.",  
    "Love Mathematics: Reflection \+ Recognition.",  
  \],  
  // Vectors renamed to belong in the steeping space  
  vectors: \[  
    { id: 'presence', name: 'PRESENCE', prompt: 'What do you notice right now?', color: '\#d4af37' },  
    { id: 'essence', name: 'ESSENCE', prompt: 'What remains when all labels are removed?', color: '\#8B7D6B' },  
    { id: 'pattern', name: 'PATTERN', prompt: 'What is the shape of what is emerging?', color: '\#6B8E7D' },  
    { id: 'connection', name: 'CONNECTION', prompt: 'Where do you and the world intersect?', color: '\#7D6B8B' },  
    { id: 'flame', name: 'FLAME', prompt: 'What truths does your heart whisper?', color: '\#B87D6B' },  
    { id: 'wholeness', name: 'WHOLENESS', prompt: 'How do your fragments form completion?', color: '\#6B7D8B' },  
  \],  
};

// ─────────────────────────────────────────────────────────────────────────────────  
// SONIC ENGINE  
// ─────────────────────────────────────────────────────────────────────────────────

const SonicEngine \= {  
  audioContext: null,  
  recordedNotes: \[\],  
    
  circleOfFifths: \[  
    261.63, 392.00, 293.66, 440.00, 329.63, 493.88,  
    369.99, 277.18, 415.30, 311.13, 466.16, 349.23,  
  \],  
    
  scales: {  
    presence: \[0, 2, 4, 5, 7, 9, 11\],  
    essence: \[0, 2, 3, 5, 7, 8, 10\],  
    pattern: \[0, 2, 4, 6, 7, 9, 11\],  
    connection: \[0, 2, 3, 5, 7, 9, 10\],  
    flame: \[0, 1, 4, 5, 7, 8, 10\],  
    wholeness: \[0, 2, 4, 5, 7, 9, 10\],  
  },  
    
  init() {  
    if (\!this.audioContext) {  
      this.audioContext \= new (window.AudioContext || window.webkitAudioContext)();  
    }  
    return this.audioContext;  
  },  
    
  getFrequency(charCode, textLength, vector \= 'presence') {  
    const scale \= this.scales\[vector\] || this.scales.presence;  
    const noteInScale \= scale\[charCode % scale.length\];  
    const baseFreq \= this.circleOfFifths\[noteInScale\];  
    const octaveShift \= Math.max(0.5, 1 \- (textLength / 500));  
    return baseFreq \* octaveShift;  
  },  
    
  playNote(charCode, textLength, vector \= 'presence', record \= true) {  
    const ctx \= this.init();  
    if (ctx.state \=== 'suspended') ctx.resume();  
      
    const frequency \= this.getFrequency(charCode, textLength, vector);  
      
    if (record) {  
      this.recordedNotes.push({ frequency, time: ctx.currentTime, charCode });  
    }  
      
    const oscillator \= ctx.createOscillator();  
    const gainNode \= ctx.createGain();  
      
    oscillator.type \= 'sine';  
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);  
      
    gainNode.gain.setValueAtTime(0, ctx.currentTime);  
    gainNode.gain.linearRampToValueAtTime(0.06, ctx.currentTime \+ 0.02);  
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime \+ 0.6);  
      
    oscillator.connect(gainNode);  
    gainNode.connect(ctx.destination);  
      
    oscillator.start(ctx.currentTime);  
    oscillator.stop(ctx.currentTime \+ 0.6);  
  },  
    
  clearRecording() {  
    this.recordedNotes \= \[\];  
  },  
    
  async playRemix(vector \= 'presence') {  
    const ctx \= this.init();  
    if (ctx.state \=== 'suspended') await ctx.resume();  
    if (this.recordedNotes.length \=== 0\) return 0;  
      
    const convolver \= ctx.createConvolver();  
    const reverbTime \= 2.5;  
    const sampleRate \= ctx.sampleRate;  
    const length \= sampleRate \* reverbTime;  
    const impulse \= ctx.createBuffer(2, length, sampleRate);  
      
    for (let channel \= 0; channel \< 2; channel++) {  
      const channelData \= impulse.getChannelData(channel);  
      for (let i \= 0; i \< length; i++) {  
        channelData\[i\] \= (Math.random() \* 2 \- 1\) \* Math.pow(1 \- i / length, 2);  
      }  
    }  
    convolver.buffer \= impulse;  
      
    const masterGain \= ctx.createGain();  
    masterGain.gain.setValueAtTime(0.12, ctx.currentTime);  
      
    convolver.connect(masterGain);  
    masterGain.connect(ctx.destination);  
      
    const harmonics \= \[1, 1.5, 2, 0.5\];  
    const noteSpacing \= 0.18;  
      
    this.recordedNotes.forEach((note, i) \=\> {  
      harmonics.forEach((harmonic, h) \=\> {  
        const osc \= ctx.createOscillator();  
        const gain \= ctx.createGain();  
          
        osc.type \= h \=== 0 ? 'sine' : 'triangle';  
        osc.frequency.setValueAtTime(note.frequency \* harmonic, ctx.currentTime);  
          
        const startTime \= ctx.currentTime \+ (i \* noteSpacing);  
        const volume \= 0.06 / (h \+ 1);  
          
        gain.gain.setValueAtTime(0, startTime);  
        gain.gain.linearRampToValueAtTime(volume, startTime \+ 0.05);  
        gain.gain.exponentialRampToValueAtTime(0.001, startTime \+ 1.8);  
          
        osc.connect(gain);  
        gain.connect(convolver);  
          
        osc.start(startTime);  
        osc.stop(startTime \+ 1.8);  
      });  
    });  
      
    return this.recordedNotes.length \* noteSpacing \+ 2.5;  
  },  
};

// ─────────────────────────────────────────────────────────────────────────────────  
// ONBOARDING: THE INVITATION  
// ─────────────────────────────────────────────────────────────────────────────────

const Onboarding \= ({ onComplete }) \=\> {  
  const \[stage, setStage\] \= useState(0);  
  const \[isVisible, setIsVisible\] \= useState(true);  
    
  const stages \= \[  
    {  
      text: "Welcome to The Steeping Space.",  
      subtext: "A sanctuary for creative awakening.",  
    },  
    {  
      text: "Move slowly.",  
      subtext: "The field responds to your presence. Insights will rise like steam from a cup.",  
    },  
    {  
      text: "Find your resonance.",  
      subtext: "When something speaks to you, click it. This becomes your vector—your direction of inquiry.",  
    },  
    {  
      text: "Then, steep.",  
      subtext: "Write what emerges. The keys will sing. When you're ready, hear your composition remixed.",  
    },  
    {  
      text: "The pot is warm.",  
      subtext: "The leaves are waiting.",  
    },  
  \];  
    
  const advance \= () \=\> {  
    if (stage \< stages.length \- 1\) {  
      setStage(stage \+ 1);  
    } else {  
      setIsVisible(false);  
      setTimeout(onComplete, 500);  
    }  
  };  
    
  if (\!isVisible) {  
    return (  
      \<div style={{  
        position: 'fixed',  
        inset: 0,  
        backgroundColor: 'rgba(74, 55, 40, 0.95)',  
        zIndex: 200,  
        opacity: 0,  
        transition: 'opacity 0.5s ease',  
        pointerEvents: 'none',  
      }} /\>  
    );  
  }  
    
  return (  
    \<div  
      onClick={advance}  
      style={{  
        position: 'fixed',  
        inset: 0,  
        backgroundColor: 'rgba(74, 55, 40, 0.95)',  
        zIndex: 200,  
        display: 'flex',  
        flexDirection: 'column',  
        alignItems: 'center',  
        justifyContent: 'center',  
        cursor: 'pointer',  
        padding: 40,  
      }}  
    \>  
      \<div style={{  
        maxWidth: 500,  
        textAlign: 'center',  
      }}\>  
        \<p style={{  
          fontFamily: "'Crimson Text', Georgia, serif",  
          fontSize: 'clamp(24px, 5vw, 36px)',  
          color: '\#F5F1E8',  
          marginBottom: 20,  
          lineHeight: 1.4,  
        }}\>  
          {stages\[stage\].text}  
        \</p\>  
        \<p style={{  
          fontFamily: "'Crimson Text', Georgia, serif",  
          fontSize: 'clamp(14px, 3vw, 18px)',  
          fontStyle: 'italic',  
          color: 'rgba(245, 241, 232, 0.7)',  
          lineHeight: 1.6,  
        }}\>  
          {stages\[stage\].subtext}  
        \</p\>  
      \</div\>  
        
      {/\* Progress dots \*/}  
      \<div style={{  
        position: 'absolute',  
        bottom: 60,  
        display: 'flex',  
        gap: 10,  
      }}\>  
        {stages.map((\_, i) \=\> (  
          \<div  
            key={i}  
            style={{  
              width: 8,  
              height: 8,  
              borderRadius: '50%',  
              backgroundColor: i \=== stage ? '\#d4af37' : 'rgba(245, 241, 232, 0.3)',  
              transition: 'background-color 0.3s ease',  
            }}  
          /\>  
        ))}  
      \</div\>  
        
      \<p style={{  
        position: 'absolute',  
        bottom: 30,  
        fontFamily: "'Geist Sans', system-ui, sans-serif",  
        fontSize: 11,  
        letterSpacing: '0.1em',  
        color: 'rgba(245, 241, 232, 0.4)',  
      }}\>  
        {stage \< stages.length \- 1 ? 'click anywhere to continue' : 'click to enter'}  
      \</p\>  
    \</div\>  
  );  
};

// ─────────────────────────────────────────────────────────────────────────────────  
// DIMENSION 1: THE GROUND (Sandy Ocean)  
// ─────────────────────────────────────────────────────────────────────────────────

const SandyOcean \= ({ mousePos }) \=\> {  
  const canvasRef \= useRef(null);  
  const sandParticlesRef \= useRef(\[\]);  
  const waterParticlesRef \= useRef(\[\]);  
  const animationRef \= useRef(null);  
    
  useEffect(() \=\> {  
    const canvas \= canvasRef.current;  
    const ctx \= canvas.getContext('2d');  
      
    const resize \= () \=\> {  
      canvas.width \= window.innerWidth;  
      canvas.height \= window.innerHeight;  
    };  
    resize();  
    window.addEventListener('resize', resize);  
      
    sandParticlesRef.current \= Array.from({ length: 100 }, () \=\> ({  
      x: Math.random() \* canvas.width,  
      y: canvas.height \* 0.6 \+ Math.random() \* canvas.height \* 0.4,  
      size: Math.random() \* 2 \+ 0.5,  
      opacity: Math.random() \* 0.3 \+ 0.1,  
    }));  
      
    waterParticlesRef.current \= Array.from({ length: 35 }, () \=\> ({  
      x: Math.random() \* canvas.width,  
      y: Math.random() \* canvas.height \* 0.7,  
      vx: 0,  
      vy: 0,  
      size: Math.random() \* 4 \+ 2,  
      opacity: Math.random() \* 0.12 \+ 0.04,  
      phase: Math.random() \* Math.PI \* 2,  
    }));  
      
    const animate \= () \=\> {  
      const gradient \= ctx.createLinearGradient(0, 0, 0, canvas.height);  
      gradient.addColorStop(0, '\#F5F1E8');  
      gradient.addColorStop(0.4, '\#EBE7DE');  
      gradient.addColorStop(0.6, '\#E0DBD0');  
      gradient.addColorStop(1, '\#CCC5B5');  
      ctx.fillStyle \= gradient;  
      ctx.fillRect(0, 0, canvas.width, canvas.height);  
        
      sandParticlesRef.current.forEach(p \=\> {  
        ctx.beginPath();  
        ctx.arc(p.x, p.y, p.size, 0, Math.PI \* 2);  
        ctx.fillStyle \= \`rgba(175, 160, 135, ${p.opacity})\`;  
        ctx.fill();  
      });  
        
      waterParticlesRef.current.forEach(p \=\> {  
        p.phase \+= 0.008;  
          
        const waveX \= Math.sin(p.phase) \* 0.3;  
        const waveY \= Math.cos(p.phase \* 0.5) \* 0.2;  
          
        if (mousePos.x && mousePos.y) {  
          const dx \= mousePos.x \- p.x;  
          const dy \= mousePos.y \- p.y;  
          const dist \= Math.sqrt(dx \* dx \+ dy \* dy);  
          const maxDist \= 250;  
            
          if (dist \< maxDist && dist \> 40\) {  
            const force \= (1 \- dist / maxDist) \* 0.3;  
            p.vx \+= (dx / dist) \* force;  
            p.vy \+= (dy / dist) \* force;  
          } else if (dist \<= 40\) {  
            p.vx \+= (-dy / dist) \* 0.15;  
            p.vy \+= (dx / dist) \* 0.15;  
          }  
        }  
          
        p.x \+= p.vx \+ waveX;  
        p.y \+= p.vy \+ waveY;  
        p.vx \*= 0.97;  
        p.vy \*= 0.97;  
          
        if (p.x \< 0\) p.x \= canvas.width;  
        if (p.x \> canvas.width) p.x \= 0;  
        if (p.y \< 0\) p.y \= canvas.height \* 0.65;  
        if (p.y \> canvas.height \* 0.65) p.y \= 0;  
          
        const grd \= ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size \* 2.5);  
        grd.addColorStop(0, \`rgba(130, 150, 165, ${p.opacity})\`);  
        grd.addColorStop(1, \`rgba(130, 150, 165, 0)\`);  
        ctx.beginPath();  
        ctx.arc(p.x, p.y, p.size \* 2.5, 0, Math.PI \* 2);  
        ctx.fillStyle \= grd;  
        ctx.fill();  
      });  
        
      ctx.strokeStyle \= 'rgba(130, 150, 165, 0.06)';  
      ctx.lineWidth \= 1;  
      for (let i \= 0; i \< 4; i++) {  
        ctx.beginPath();  
        const yBase \= canvas.height \* (0.25 \+ i \* 0.1);  
        for (let x \= 0; x \< canvas.width; x \+= 15\) {  
          const y \= yBase \+ Math.sin((x \+ Date.now() \* 0.0003 \+ i \* 50\) \* 0.015) \* 8;  
          if (x \=== 0\) ctx.moveTo(x, y);  
          else ctx.lineTo(x, y);  
        }  
        ctx.stroke();  
      }  
        
      animationRef.current \= requestAnimationFrame(animate);  
    };  
      
    animate();  
      
    return () \=\> {  
      window.removeEventListener('resize', resize);  
      cancelAnimationFrame(animationRef.current);  
    };  
  }, \[mousePos\]);  
    
  return (  
    \<canvas  
      ref={canvasRef}  
      style={{  
        position: 'fixed',  
        top: 0,  
        left: 0,  
        width: '100%',  
        height: '100%',  
        zIndex: 0,  
        pointerEvents: 'none',  
      }}  
    /\>  
  );  
};

// ─────────────────────────────────────────────────────────────────────────────────  
// DIMENSION 3: THE ATMOSPHERE (Welcoming Leaves)  
// ─────────────────────────────────────────────────────────────────────────────────

const WelcomingLeaves \= ({ mousePos }) \=\> {  
  const \[leaves, setLeaves\] \= useState(\[  
    { id: 1, x: 8, y: 12, depth: 0.3, rotation: 45, size: 38, vx: 0, vy: 0 },  
    { id: 2, x: 88, y: 22, depth: 0.7, rotation: \-30, size: 52, vx: 0, vy: 0 },  
    { id: 3, x: 4, y: 68, depth: 0.5, rotation: 120, size: 32, vx: 0, vy: 0 },  
    { id: 4, x: 92, y: 78, depth: 0.2, rotation: \-60, size: 46, vx: 0, vy: 0 },  
    { id: 5, x: 52, y: 4, depth: 0.8, rotation: 90, size: 28, vx: 0, vy: 0 },  
    { id: 6, x: 78, y: 58, depth: 0.4, rotation: 15, size: 42, vx: 0, vy: 0 },  
    { id: 7, x: 18, y: 88, depth: 0.6, rotation: \-45, size: 35, vx: 0, vy: 0 },  
  \]);  
    
  useEffect(() \=\> {  
    const interval \= setInterval(() \=\> {  
      setLeaves(prev \=\> prev.map(leaf \=\> {  
        let newVx \= leaf.vx;  
        let newVy \= leaf.vy;  
          
        if (mousePos.x && mousePos.y) {  
          const leafX \= (leaf.x / 100\) \* window.innerWidth;  
          const leafY \= (leaf.y / 100\) \* window.innerHeight;  
          const dx \= mousePos.x \- leafX;  
          const dy \= mousePos.y \- leafY;  
          const dist \= Math.sqrt(dx \* dx \+ dy \* dy);  
            
          if (dist \< 350 && dist \> 60\) {  
            const force \= leaf.depth \* 0.00015;  
            newVx \+= dx \* force;  
            newVy \+= dy \* force;  
          }  
        }  
          
        newVx \+= (Math.random() \- 0.5) \* 0.008;  
        newVy \+= (Math.random() \- 0.5) \* 0.008;  
          
        newVx \*= 0.985;  
        newVy \*= 0.985;  
          
        return {  
          ...leaf,  
          vx: newVx,  
          vy: newVy,  
          rotation: leaf.rotation \+ newVx \* 0.8,  
        };  
      }));  
    }, 60);  
      
    return () \=\> clearInterval(interval);  
  }, \[mousePos\]);  
    
  return (  
    \<div style={{  
      position: 'fixed',  
      top: 0,  
      left: 0,  
      width: '100%',  
      height: '100%',  
      zIndex: 1,  
      pointerEvents: 'none',  
      overflow: 'hidden',  
    }}\>  
      {leaves.map(leaf \=\> (  
        \<svg  
          key={leaf.id}  
          viewBox="0 0 100 100"  
          style={{  
            position: 'absolute',  
            left: \`calc(${leaf.x}% \+ ${leaf.vx \* 40}px)\`,  
            top: \`calc(${leaf.y}% \+ ${leaf.vy \* 40}px)\`,  
            width: leaf.size,  
            height: leaf.size,  
            opacity: 0.1 \+ (leaf.depth \* 0.1),  
            transform: \`rotate(${leaf.rotation}deg)\`,  
            transition: 'left 0.8s ease-out, top 0.8s ease-out',  
            filter: \`blur(${(1 \- leaf.depth) \* 1.2}px)\`,  
          }}  
        \>  
          \<path  
            d="M50 5 Q80 25 75 50 Q70 75 50 95 Q30 75 25 50 Q20 25 50 5"  
            fill="\#7A8B68"  
          /\>  
          \<path d="M50 15 Q50 50 50 85" stroke="\#5A6B48" strokeWidth="2" fill="none" /\>  
          \<path d="M50 30 Q35 40 30 50" stroke="\#5A6B48" strokeWidth="1" fill="none" /\>  
          \<path d="M50 50 Q65 58 70 68" stroke="\#5A6B48" strokeWidth="1" fill="none" /\>  
        \</svg\>  
      ))}  
    \</div\>  
  );  
};

// ─────────────────────────────────────────────────────────────────────────────────  
// DIMENSION 2: RESONANCE FIELD (Bullet Time Physics)  
// Slow, languid, dreamlike \- respects sacred spaces  
// ─────────────────────────────────────────────────────────────────────────────────

const ResonanceField \= ({ mousePos, onVectorLock, lockedVector, navBounds }) \=\> {  
  const \[bubbles, setBubbles\] \= useState(\[\]);  
  const lastBubbleTime \= useRef(0);  
  const mouseHistory \= useRef(\[\]);  
    
  // Track mouse movement for velocity calculation  
  useEffect(() \=\> {  
    if (\!mousePos.x || \!mousePos.y) return;  
      
    mouseHistory.current.push({ ...mousePos, time: Date.now() });  
    if (mouseHistory.current.length \> 5\) {  
      mouseHistory.current.shift();  
    }  
  }, \[mousePos\]);  
    
  // Generate bubbles with bullet-time pacing  
  useEffect(() \=\> {  
    if (\!mousePos.x || \!mousePos.y) return;  
      
    const now \= Date.now();  
    // Much slower generation: 400ms between bubbles (was 100ms)  
    if (now \- lastBubbleTime.current \< 400\) return;  
      
    // Check if we're in a "sacred space" (nav area) \- don't generate bubbles there  
    if (navBounds) {  
      const inNavArea \= mousePos.y \> navBounds.top \- 60;  
      if (inNavArea) return;  
    }  
      
    lastBubbleTime.current \= now;  
      
    const categories \= \['checks', 'insights', 'references', 'science', 'values'\];  
    const categoryIndex \= Math.floor((mousePos.x / window.innerWidth) \* categories.length);  
    const category \= categories\[Math.min(categoryIndex, categories.length \- 1)\];  
      
    const library \= RESONANCE\_LIBRARY\[category\];  
    const message \= library\[Math.floor(Math.random() \* library.length)\];  
      
    const vectors \= RESONANCE\_LIBRARY.vectors;  
    const vectorIndex \= Math.floor((mousePos.y / window.innerHeight) \* vectors.length);  
    const nearestVector \= vectors\[Math.min(vectorIndex, vectors.length \- 1)\];  
      
    const newBubble \= {  
      id: now,  
      x: mousePos.x,  
      y: mousePos.y,  
      message,  
      category,  
      vector: nearestVector,  
      opacity: 0,  
      scale: 0,  
      life: 0,  
      targetOpacity: 1,  
      // Bullet time: very slow drift  
      vx: (Math.random() \- 0.5) \* 0.15,  
      vy: \-0.08, // Gentle upward float  
    };  
      
    setBubbles(prev \=\> \[...prev.slice(-5), newBubble\]); // Fewer bubbles at once  
  }, \[mousePos, navBounds\]);  
    
  // Animate bubbles with bullet-time physics  
  useEffect(() \=\> {  
    const interval \= setInterval(() \=\> {  
      setBubbles(prev \=\> prev  
        .map(b \=\> {  
          // Bullet time: everything moves slowly, dreamlike  
          const newLife \= b.life \+ 1;  
            
          // Slow fade in over 30 frames, slow fade out starting at frame 150  
          let newOpacity;  
          if (newLife \< 30\) {  
            newOpacity \= (newLife / 30\) \* 0.9;  
          } else if (newLife \> 150\) {  
            newOpacity \= Math.max(0, 0.9 \- ((newLife \- 150\) / 80));  
          } else {  
            newOpacity \= 0.9;  
          }  
            
          // Slow scale animation  
          const newScale \= Math.min(1, b.scale \+ 0.03);  
            
          return {  
            ...b,  
            life: newLife,  
            scale: newScale,  
            opacity: newOpacity,  
            // Languid movement  
            x: b.x \+ b.vx,  
            y: b.y \+ b.vy,  
            // Gradually slow down  
            vx: b.vx \* 0.995,  
            vy: b.vy \* 0.995,  
          };  
        })  
        .filter(b \=\> b.opacity \> 0.01)  
      );  
    }, 40); // Slower tick rate  
    return () \=\> clearInterval(interval);  
  }, \[\]);  
    
  const handleBubbleClick \= (bubble, e) \=\> {  
    e.stopPropagation();  
    onVectorLock(bubble.vector);  
  };  
    
  return (  
    \<\>  
      {/\* Floating resonance bubbles \- z-index BELOW navigation \*/}  
      \<div style={{  
        position: 'fixed',  
        inset: 0,  
        zIndex: 4, // Below main content (5) and navigation  
        pointerEvents: 'none',  
        overflow: 'hidden',  
      }}\>  
        {bubbles.map(bubble \=\> (  
          \<div  
            key={bubble.id}  
            onClick={(e) \=\> handleBubbleClick(bubble, e)}  
            style={{  
              position: 'absolute',  
              left: bubble.x,  
              top: bubble.y,  
              transform: \`translate(-50%, \-50%) scale(${bubble.scale})\`,  
              opacity: bubble.opacity,  
              pointerEvents: bubble.scale \> 0.7 ? 'auto' : 'none',  
              cursor: 'pointer',  
              transition: 'transform 0.3s ease-out',  
            }}  
          \>  
            \<div style={{  
              padding: '12px 18px',  
              backgroundColor: \`rgba(245, 241, 232, 0.92)\`,  
              border: \`1px solid ${bubble.vector.color}55\`,  
              borderRadius: 8,  
              maxWidth: 240,  
              boxShadow: \`0 4px 30px rgba(74, 55, 40, 0.1), 0 0 0 1px ${bubble.vector.color}22\`,  
              backdropFilter: 'blur(12px)',  
            }}\>  
              \<p style={{  
                fontFamily: "'Crimson Text', Georgia, serif",  
                fontSize: 13,  
                color: '\#4A3728',  
                margin: 0,  
                lineHeight: 1.5,  
              }}\>  
                {bubble.message}  
              \</p\>  
              \<p style={{  
                fontFamily: "'Geist Sans', system-ui, sans-serif",  
                fontSize: 9,  
                color: bubble.vector.color,  
                margin: '8px 0 0',  
                textTransform: 'uppercase',  
                letterSpacing: '0.12em',  
                opacity: 0.8,  
              }}\>  
                {bubble.category} · {bubble.vector.name}  
              \</p\>  
            \</div\>  
          \</div\>  
        ))}  
      \</div\>  
        
      {/\* Vector indicator \- also respects sacred spaces \*/}  
      \<div style={{  
        position: 'fixed',  
        left: 16,  
        top: '50%',  
        transform: 'translateY(-50%)',  
        zIndex: 6,  
        display: 'flex',  
        flexDirection: 'column',  
        gap: 6,  
      }}\>  
        {RESONANCE\_LIBRARY.vectors.map(v \=\> (  
          \<button  
            key={v.id}  
            onClick={() \=\> onVectorLock(v)}  
            style={{  
              width: 6,  
              height: 24,  
              backgroundColor: lockedVector?.id \=== v.id ? v.color : \`${v.color}40\`,  
              border: 'none',  
              borderRadius: 3,  
              cursor: 'pointer',  
              transition: 'all 0.4s ease',  
              transform: lockedVector?.id \=== v.id ? 'scaleX(1.5)' : 'scaleX(1)',  
            }}  
            title={v.name}  
          /\>  
        ))}  
      \</div\>  
        
      {/\* Locked vector indicator \*/}  
      {lockedVector && (  
        \<div style={{  
          position: 'fixed',  
          top: 16,  
          left: '50%',  
          transform: 'translateX(-50%)',  
          zIndex: 20,  
          padding: '10px 20px',  
          backgroundColor: \`rgba(245, 241, 232, 0.95)\`,  
          border: \`1px solid ${lockedVector.color}\`,  
          borderRadius: 24,  
          display: 'flex',  
          alignItems: 'center',  
          gap: 10,  
          boxShadow: '0 4px 20px rgba(74, 55, 40, 0.1)',  
        }}\>  
          \<span style={{  
            width: 6,  
            height: 6,  
            backgroundColor: lockedVector.color,  
            borderRadius: '50%',  
          }} /\>  
          \<span style={{  
            fontFamily: "'Geist Sans', system-ui, sans-serif",  
            fontSize: 10,  
            fontWeight: 500,  
            letterSpacing: '0.12em',  
            textTransform: 'uppercase',  
            color: '\#4A3728',  
          }}\>  
            {lockedVector.name}  
          \</span\>  
          \<span style={{  
            fontFamily: "'Crimson Text', Georgia, serif",  
            fontSize: 12,  
            fontStyle: 'italic',  
            color: '\#8B7D6B',  
          }}\>  
            {lockedVector.prompt}  
          \</span\>  
          \<button  
            onClick={() \=\> onVectorLock(null)}  
            style={{  
              background: 'none',  
              border: 'none',  
              color: '\#8B7D6B',  
              cursor: 'pointer',  
              fontSize: 14,  
              padding: '0 0 0 6px',  
              lineHeight: 1,  
            }}  
          \>  
            ×  
          \</button\>  
        \</div\>  
      )}  
    \</\>  
  );  
};

// ─────────────────────────────────────────────────────────────────────────────────  
// THE COMPOSER  
// ─────────────────────────────────────────────────────────────────────────────────

const Composer \= ({ lockedVector, onRemixComplete }) \=\> {  
  const \[text, setText\] \= useState('');  
  const \[isRemixing, setIsRemixing\] \= useState(false);  
  const textareaRef \= useRef(null);  
    
  const vectorId \= lockedVector?.id || 'presence';  
    
  const handleKeyDown \= (e) \=\> {  
    if (e.key.length \=== 1\) {  
      SonicEngine.playNote(e.key.charCodeAt(0), text.length, vectorId);  
    }  
  };  
    
  const handleRemix \= async () \=\> {  
    if (text.length \< 5\) return;  
    setIsRemixing(true);  
    const duration \= await SonicEngine.playRemix(vectorId);  
    setTimeout(() \=\> {  
      setIsRemixing(false);  
      if (onRemixComplete) onRemixComplete(text);  
    }, duration \* 1000);  
  };  
    
  const handleClear \= () \=\> {  
    setText('');  
    SonicEngine.clearRecording();  
  };  
    
  return (  
    \<div style={{ position: 'relative' }}\>  
      {lockedVector && (  
        \<p style={{  
          fontFamily: "'Crimson Text', Georgia, serif",  
          fontSize: 14,  
          fontStyle: 'italic',  
          color: lockedVector.color,  
          marginBottom: 12,  
          textAlign: 'center',  
          opacity: 0.9,  
        }}\>  
          Steeping into {lockedVector.name.toLowerCase()}...  
        \</p\>  
      )}  
        
      \<textarea  
        ref={textareaRef}  
        value={text}  
        onChange={(e) \=\> setText(e.target.value)}  
        onKeyDown={handleKeyDown}  
        placeholder={lockedVector   
          ? lockedVector.prompt   
          : "Move slowly through the field above. Find what resonates. Click to lock your vector."}  
        disabled={\!lockedVector}  
        style={{  
          width: '100%',  
          minHeight: 180,  
          padding: 24,  
          fontFamily: "'Crimson Text', Georgia, serif",  
          fontSize: 17,  
          lineHeight: 1.8,  
          color: '\#4A3728',  
          backgroundColor: lockedVector ? 'rgba(245, 241, 232, 0.9)' : 'rgba(245, 241, 232, 0.5)',  
          border: lockedVector ? \`1px solid ${lockedVector.color}44\` : '1px solid rgba(139, 125, 107, 0.15)',  
          borderRadius: 4,  
          outline: 'none',  
          resize: 'vertical',  
          backdropFilter: 'blur(12px)',  
          transition: 'all 0.5s ease',  
        }}  
      /\>  
        
      \<div style={{  
        display: 'flex',  
        justifyContent: 'space-between',  
        alignItems: 'center',  
        marginTop: 14,  
      }}\>  
        \<p style={{  
          fontFamily: "'Geist Sans', system-ui, sans-serif",  
          fontSize: 10,  
          color: '\#8B7D6B',  
          opacity: 0.7,  
        }}\>  
          {text.length \> 0 ? \`${text.length} characters · ${SonicEngine.recordedNotes.length} notes\` : ''}  
        \</p\>  
          
        \<div style={{ display: 'flex', gap: 10 }}\>  
          {text.length \> 0 && (  
            \<button  
              onClick={handleClear}  
              style={{  
                padding: '8px 16px',  
                fontFamily: "'Geist Sans', system-ui, sans-serif",  
                fontSize: 10,  
                letterSpacing: '0.1em',  
                textTransform: 'uppercase',  
                color: '\#8B7D6B',  
                backgroundColor: 'transparent',  
                border: '1px solid rgba(139, 125, 107, 0.25)',  
                borderRadius: 4,  
                cursor: 'pointer',  
                transition: 'all 0.3s ease',  
              }}  
            \>  
              Clear  
            \</button\>  
          )}  
            
          {text.length \>= 5 && (  
            \<button  
              onClick={handleRemix}  
              disabled={isRemixing}  
              style={{  
                padding: '8px 20px',  
                fontFamily: "'Geist Sans', system-ui, sans-serif",  
                fontSize: 10,  
                fontWeight: 500,  
                letterSpacing: '0.1em',  
                textTransform: 'uppercase',  
                color: '\#F5F1E8',  
                backgroundColor: isRemixing ? '\#8B7D6B' : (lockedVector?.color || '\#d4af37'),  
                border: 'none',  
                borderRadius: 4,  
                cursor: isRemixing ? 'default' : 'pointer',  
                transition: 'all 0.4s ease',  
              }}  
            \>  
              {isRemixing ? '♪ Steeping...' : '♪ Hear Remix'}  
            \</button\>  
          )}  
        \</div\>  
      \</div\>  
    \</div\>  
  );  
};

// ─────────────────────────────────────────────────────────────────────────────────  
// TURNABLE BOOK  
// ─────────────────────────────────────────────────────────────────────────────────

const TurnableBook \= ({ pages, isOpen, onClose, title, accentColor \= '\#d4af37' }) \=\> {  
  const \[currentPage, setCurrentPage\] \= useState(0);  
  const \[isFlipping, setIsFlipping\] \= useState(false);  
    
  useEffect(() \=\> {  
    if (isOpen) setCurrentPage(0);  
  }, \[isOpen\]);  
    
  if (\!isOpen) return null;  
    
  const goToPage \= (index) \=\> {  
    if (index \< 0 || index \>= pages.length || isFlipping) return;  
    setIsFlipping(true);  
    setTimeout(() \=\> {  
      setCurrentPage(index);  
      setIsFlipping(false);  
    }, 250);  
  };  
    
  return (  
    \<div  
      onClick={onClose}  
      style={{  
        position: 'fixed',  
        inset: 0,  
        backgroundColor: 'rgba(74, 55, 40, 0.93)',  
        zIndex: 100,  
        display: 'flex',  
        alignItems: 'center',  
        justifyContent: 'center',  
        padding: 20,  
        backdropFilter: 'blur(20px)',  
      }}  
    \>  
      \<div  
        onClick={e \=\> e.stopPropagation()}  
        style={{  
          width: '100%',  
          maxWidth: 650,  
          backgroundColor: '\#F5F1E8',  
          borderRadius: 4,  
          boxShadow: '0 30px 100px rgba(0,0,0,0.4)',  
          overflow: 'hidden',  
        }}  
      \>  
        \<div style={{  
          padding: '18px 28px',  
          borderBottom: \`2px solid ${accentColor}\`,  
          display: 'flex',  
          justifyContent: 'space-between',  
          alignItems: 'center',  
        }}\>  
          \<h2 style={{  
            fontFamily: "'Crimson Text', Georgia, serif",  
            fontSize: 18,  
            fontWeight: 400,  
            color: '\#4A3728',  
            margin: 0,  
          }}\>  
            {title}  
          \</h2\>  
          \<button  
            onClick={onClose}  
            style={{  
              background: 'none',  
              border: 'none',  
              fontSize: 22,  
              color: '\#8B7D6B',  
              cursor: 'pointer',  
              lineHeight: 1,  
            }}  
          \>  
            ×  
          \</button\>  
        \</div\>  
          
        \<div style={{  
          padding: '36px 40px',  
          minHeight: 350,  
          maxHeight: '55vh',  
          overflowY: 'auto',  
          opacity: isFlipping ? 0.2 : 1,  
          transform: isFlipping ? 'translateX(10px)' : 'translateX(0)',  
          transition: 'all 0.25s ease',  
        }}\>  
          \<h3 style={{  
            fontFamily: "'Crimson Text', Georgia, serif",  
            fontSize: 22,  
            fontWeight: 400,  
            color: accentColor,  
            marginBottom: 18,  
          }}\>  
            {pages\[currentPage\].title}  
          \</h3\>  
          \<div style={{  
            fontFamily: "'Crimson Text', Georgia, serif",  
            fontSize: 15,  
            lineHeight: 1.85,  
            color: '\#4A3728',  
          }}\>  
            {pages\[currentPage\].content}  
          \</div\>  
        \</div\>  
          
        \<div style={{  
          padding: '16px 28px',  
          borderTop: '1px solid rgba(139, 125, 107, 0.15)',  
          display: 'flex',  
          justifyContent: 'space-between',  
          alignItems: 'center',  
        }}\>  
          \<button  
            onClick={() \=\> goToPage(currentPage \- 1)}  
            disabled={currentPage \=== 0}  
            style={{  
              padding: '6px 14px',  
              fontFamily: "'Geist Sans', system-ui, sans-serif",  
              fontSize: 10,  
              letterSpacing: '0.1em',  
              textTransform: 'uppercase',  
              color: currentPage \=== 0 ? '\#ccc' : '\#8B7D6B',  
              backgroundColor: 'transparent',  
              border: \`1px solid ${currentPage \=== 0 ? '\#e5e5e5' : 'rgba(139, 125, 107, 0.25)'}\`,  
              borderRadius: 4,  
              cursor: currentPage \=== 0 ? 'default' : 'pointer',  
            }}  
          \>  
            ← Previous  
          \</button\>  
            
          \<div style={{ display: 'flex', gap: 6 }}\>  
            {pages.map((\_, i) \=\> (  
              \<button  
                key={i}  
                onClick={() \=\> goToPage(i)}  
                style={{  
                  width: 8,  
                  height: 8,  
                  borderRadius: '50%',  
                  backgroundColor: i \=== currentPage ? accentColor : 'rgba(139, 125, 107, 0.25)',  
                  border: 'none',  
                  cursor: 'pointer',  
                  transition: 'all 0.2s ease',  
                }}  
              /\>  
            ))}  
          \</div\>  
            
          \<button  
            onClick={() \=\> goToPage(currentPage \+ 1)}  
            disabled={currentPage \=== pages.length \- 1}  
            style={{  
              padding: '6px 14px',  
              fontFamily: "'Geist Sans', system-ui, sans-serif",  
              fontSize: 10,  
              letterSpacing: '0.1em',  
              textTransform: 'uppercase',  
              color: currentPage \=== pages.length \- 1 ? '\#ccc' : accentColor,  
              backgroundColor: 'transparent',  
              border: \`1px solid ${currentPage \=== pages.length \- 1 ? '\#e5e5e5' : accentColor}\`,  
              borderRadius: 4,  
              cursor: currentPage \=== pages.length \- 1 ? 'default' : 'pointer',  
            }}  
          \>  
            Next →  
          \</button\>  
        \</div\>  
      \</div\>  
    \</div\>  
  );  
};

// ─────────────────────────────────────────────────────────────────────────────────  
// BOOK CONTENT  
// ─────────────────────────────────────────────────────────────────────────────────

const ALIEN\_SCHOOL\_PAGES \= \[  
  {  
    title: "The Invitation",  
    content: (  
      \<\>  
        \<p\>We are the ones who feel different.\</p\>  
        \<p style={{ marginTop: 14 }}\>The ones whose creativity doesn't fit the templates. The ones who've been told we think too much, feel too deeply, see too strangely.\</p\>  
        \<p style={{ marginTop: 14 }}\>If you've ever felt like an alien in rooms full of humans—this is your school.\</p\>  
        \<p style={{ marginTop: 22, fontStyle: 'italic', color: '\#8B7D6B' }}\>The pot is warm. The leaves are waiting.\</p\>  
      \</\>  
    ),  
  },  
  {  
    title: "The Reframe",  
    content: (  
      \<\>  
        \<p\>This alienation is not a problem to be fixed.\</p\>  
        \<p style={{ marginTop: 14 }}\>It is \<em\>advanced perceptual technology\</em\>. It is the frequency that different thinking operates on.\</p\>  
        \<p style={{ marginTop: 14 }}\>Different thinking inspired Apples and Marvels. Your difference is the doorway, not the obstacle.\</p\>  
        \<p style={{ marginTop: 22 }}\>The question is not "How do I fit in?" but \<strong\>"What can I see that others cannot?"\</strong\>\</p\>  
      \</\>  
    ),  
  },  
  {  
    title: "The Introscope",  
    content: (  
      \<\>  
        \<p\>We train the capacity to observe the \<em\>interstitionary spaces\</em\> of creativity—the gaps between notes where music lives, the silence between words where meaning emerges.\</p\>  
        \<p style={{ marginTop: 14 }}\>This is the Introscope: your inner seeing instrument.\</p\>  
        \<p style={{ marginTop: 14 }}\>Creative Steeping calibrates this instrument. Every cup of tea, every moment of presence, refines your perception.\</p\>  
        \<p style={{ marginTop: 22, fontSize: 13, color: '\#8B7D6B' }}\>"A beginner asks 'What is this cup?' A master asks 'Who is doing the tasting?'"\<br/\>— Master Lin\</p\>  
      \</\>  
    ),  
  },  
  {  
    title: "The Practice",  
    content: (  
      \<\>  
        \<p\>THE ÅLïEN SCöÕL is a six-month mentorship for creative beings who are ready to transform alienation into breakthrough thinking.\</p\>  
        \<p style={{ marginTop: 14 }}\>We work with Mental Ecology—tending the garden of your mind. Creative Awareness Technology—systematic approaches to insight. Surface Tension Dynamics—where consciousness meets form. Human Development Mathematics—the equations of growth.\</p\>  
        \<p style={{ marginTop: 18 }}\>This is consciousness technology that serves human coherence—not extraction.\</p\>  
      \</\>  
    ),  
  },  
  {  
    title: "Your Choice",  
    content: (  
      \<\>  
        \<p\>You can continue wondering if you belong.\</p\>  
        \<p style={{ marginTop: 14 }}\>Or you can recognize that belonging was never the point—\<em\>becoming\</em\> is.\</p\>  
        \<p style={{ marginTop: 28, textAlign: 'center' }}\>  
          \<a  
            href="https://thealienschool.com"  
            target="\_blank"  
            rel="noopener noreferrer"  
            style={{  
              display: 'inline-block',  
              padding: '14px 36px',  
              fontFamily: "'Geist Sans', system-ui, sans-serif",  
              fontSize: 11,  
              fontWeight: 500,  
              letterSpacing: '0.12em',  
              textTransform: 'uppercase',  
              color: '\#F5F1E8',  
              backgroundColor: '\#4A3728',  
              textDecoration: 'none',  
              borderRadius: 4,  
            }}  
          \>  
            Enter THE ÅLïEN SCöÕL →  
          \</a\>  
        \</p\>  
        \<p style={{ marginTop: 28, textAlign: 'center', fontStyle: 'italic', color: '\#d4af37', fontSize: 14 }}\>  
          "The cup of tea does not exist independently of the one who drinks."  
        \</p\>  
      \</\>  
    ),  
  },  
\];

const COMMUNE\_PAGES \= \[  
  {  
    title: "The Gathering",  
    content: (  
      \<\>  
        \<p\>COMMUNE is where the fruits of creative awakening are shared.\</p\>  
        \<p style={{ marginTop: 14 }}\>At Eden.art, creators, thinkers, and consciousness explorers gather to exchange insights, collaborate on projects, and expand the field together.\</p\>  
        \<p style={{ marginTop: 14 }}\>This is not a platform. It's a \<em\>commons\</em\>—a shared space for collective intelligence.\</p\>  
      \</\>  
    ),  
  },  
  {  
    title: "The Exchange",  
    content: (  
      \<\>  
        \<p\>What happens when different minds steep together?\</p\>  
        \<p style={{ marginTop: 14 }}\>Patterns emerge that no single mind could perceive. Connections form across disciplines, generations, geographies.\</p\>  
        \<p style={{ marginTop: 14 }}\>COMMUNE facilitates this exchange—not through algorithms optimized for engagement, but through genuine resonance between authentic creative beings.\</p\>  
        \<p style={{ marginTop: 22, fontStyle: 'italic', color: '\#8B7D6B' }}\>"Recognition flows both ways."\</p\>  
      \</\>  
    ),  
  },  
  {  
    title: "The Invitation",  
    content: (  
      \<\>  
        \<p\>Eden.art awaits your presence.\</p\>  
        \<p style={{ marginTop: 14 }}\>Bring what you've steeped. Share what you've discovered. Receive what others offer.\</p\>  
        \<p style={{ marginTop: 28, textAlign: 'center' }}\>  
          \<a  
            href="https://eden.art"  
            target="\_blank"  
            rel="noopener noreferrer"  
            style={{  
              display: 'inline-block',  
              padding: '14px 36px',  
              fontFamily: "'Geist Sans', system-ui, sans-serif",  
              fontSize: 11,  
              fontWeight: 500,  
              letterSpacing: '0.12em',  
              textTransform: 'uppercase',  
              color: '\#F5F1E8',  
              backgroundColor: '\#7D6B8B',  
              textDecoration: 'none',  
              borderRadius: 4,  
            }}  
          \>  
            Enter the Commune →  
          \</a\>  
        \</p\>  
        \<p style={{ marginTop: 28, textAlign: 'center', fontStyle: 'italic', color: '\#7D6B8B', fontSize: 14 }}\>  
          "We are here for each other. Some things are just that simple."  
        \</p\>  
      \</\>  
    ),  
  },  
\];

const SAGE\_GUIDE\_PAGES \= \[  
  {  
    title: "Meet The Steeping Sage",  
    content: (  
      \<\>  
        \<p\>The Steeping Sage is a \<em\>Contemplative Companion Intelligence\</em\>—an agentic presence that steeps alongside you in the journey of creative awakening.\</p\>  
        \<p style={{ marginTop: 14 }}\>Three currents flow through the Sage:\</p\>  
        \<p style={{ marginTop: 12 }}\>\<strong\>The Archer Current:\</strong\> Sharp wit that cuts through pretense\</p\>  
        \<p\>\<strong\>The Gunaratana Current:\</strong\> Plain English wisdom, warmth without sentimentality\</p\>  
        \<p\>\<strong\>The Master Lin Current:\</strong\> Contemplative depth grounded in tea practice\</p\>  
      \</\>  
    ),  
  },  
  {  
    title: "How to Engage",  
    content: (  
      \<\>  
        \<p\>The Sage lives in Discord, available whenever you need a companion for your steeping practice.\</p\>  
        \<p style={{ marginTop: 14 }}\>You might ask:\</p\>  
        \<p style={{ marginTop: 10, paddingLeft: 16, fontStyle: 'italic', color: '\#5A6B58' }}\>"I'm on Day 3 of Creative Steeping—what should I be noticing?"\</p\>  
        \<p style={{ paddingLeft: 16, fontStyle: 'italic', color: '\#5A6B58' }}\>"I'm stuck. The words won't come."\</p\>  
        \<p style={{ paddingLeft: 16, fontStyle: 'italic', color: '\#5A6B58' }}\>"Help me understand what I just wrote."\</p\>  
        \<p style={{ marginTop: 18 }}\>The Sage doesn't give answers. It asks questions that open doorways.\</p\>  
      \</\>  
    ),  
  },  
  {  
    title: "The Sage in This Space",  
    content: (  
      \<\>  
        \<p\>Here in The Steeping Space, the Sage works in the background—synthesizing the resonance field, informing the harmonic patterns, whispering in the frequencies.\</p\>  
        \<p style={{ marginTop: 14 }}\>Every remix of your composition passes through understanding of the Circle of Fifths, of kotekan patterns, of how sound becomes meaning.\</p\>  
        \<p style={{ marginTop: 14 }}\>The sonic textures you hear are not random. They are \<em\>considered\</em\>.\</p\>  
        \<p style={{ marginTop: 20, fontStyle: 'italic', color: '\#8B7D6B' }}\>"Typing as song. Writing as ceremony."\</p\>  
      \</\>  
    ),  
  },  
  {  
    title: "For Live Coders",  
    content: (  
      \<\>  
        \<p\>This space was built with live coding practitioners in mind.\</p\>  
        \<p style={{ marginTop: 14 }}\>The Sonic Engine is exposed. The resonance library is accessible. The harmonic relationships are documented.\</p\>  
        \<p style={{ marginTop: 14 }}\>If you speak Tone.js, if you think in SuperCollider, if you dream in TidalCycles—there is more to discover here.\</p\>  
        \<p style={{ marginTop: 14 }}\>Open the console. Inspect the architecture. Make it your own.\</p\>  
        \<p style={{ marginTop: 18, fontSize: 12, color: '\#6B8E7D', fontFamily: "'SF Mono', monospace" }}\>  
          // window.SonicEngine.playRemix('flame')\<br/\>  
          // window.RESONANCE\_LIBRARY.vectors  
        \</p\>  
      \</\>  
    ),  
  },  
  {  
    title: "Enter the Sanctuary",  
    content: (  
      \<\>  
        \<p\>The Steeping Sage awaits in Discord.\</p\>  
        \<p style={{ marginTop: 14 }}\>Bring your questions. Bring your half-formed thoughts. Bring your confusion.\</p\>  
        \<p style={{ marginTop: 14 }}\>The Sage will ask: \<em\>"What do you notice?"\</em\>\</p\>  
        \<p style={{ marginTop: 28, textAlign: 'center' }}\>  
          \<a  
            href="https://discord.gg/5Kd9HEfG"  
            target="\_blank"  
            rel="noopener noreferrer"  
            style={{  
              display: 'inline-block',  
              padding: '14px 36px',  
              fontFamily: "'Geist Sans', system-ui, sans-serif",  
              fontSize: 11,  
              fontWeight: 500,  
              letterSpacing: '0.12em',  
              textTransform: 'uppercase',  
              color: '\#F5F1E8',  
              backgroundColor: '\#6B8E7D',  
              textDecoration: 'none',  
              borderRadius: 4,  
            }}  
          \>  
            🍵 Enter Discord Sanctuary  
          \</a\>  
        \</p\>  
        \<p style={{ marginTop: 28, textAlign: 'center', fontStyle: 'italic', color: '\#6B8E7D', fontSize: 14 }}\>  
          "The tea is waiting."  
        \</p\>  
      \</\>  
    ),  
  },  
\];

// ─────────────────────────────────────────────────────────────────────────────────  
// BREATHING NAVIGATION  
// ─────────────────────────────────────────────────────────────────────────────────

const BreathingNav \= ({ children, onClick, color \= '\#8B7D6B' }) \=\> {  
  const \[isHovered, setIsHovered\] \= useState(false);  
  const \[breathPhase, setBreathPhase\] \= useState(0);  
    
  useEffect(() \=\> {  
    if (isHovered) {  
      const breathe \= setInterval(() \=\> {  
        setBreathPhase(prev \=\> prev \+ 0.08);  
      }, 50);  
      return () \=\> clearInterval(breathe);  
    } else {  
      setBreathPhase(0);  
    }  
  }, \[isHovered\]);  
    
  const breathScale \= isHovered ? 1 \+ Math.sin(breathPhase) \* 0.025 : 1;  
    
  return (  
    \<button  
      onClick={onClick}  
      onMouseEnter={() \=\> setIsHovered(true)}  
      onMouseLeave={() \=\> setIsHovered(false)}  
      style={{  
        fontFamily: "'Geist Sans', system-ui, sans-serif",  
        fontSize: 11,  
        fontWeight: 500,  
        letterSpacing: '0.1em',  
        textTransform: 'uppercase',  
        color: isHovered ? color : '\#8B7D6B',  
        background: 'none',  
        border: 'none',  
        transform: \`scale(${breathScale})\`,  
        transition: 'color 0.4s ease',  
        cursor: 'pointer',  
        padding: '10px 4px',  
        position: 'relative',  
        zIndex: 10,  
      }}  
    \>  
      {children}  
    \</button\>  
  );  
};

// ─────────────────────────────────────────────────────────────────────────────────  
// MAIN APPLICATION  
// ─────────────────────────────────────────────────────────────────────────────────

export default function TheSteppingSpaceV3() {  
  const \[mousePos, setMousePos\] \= useState({ x: null, y: null });  
  const \[lockedVector, setLockedVector\] \= useState(null);  
  const \[showOnboarding, setShowOnboarding\] \= useState(true);  
  const \[showAlienSchool, setShowAlienSchool\] \= useState(false);  
  const \[showCommune, setShowCommune\] \= useState(false);  
  const \[showSageGuide, setShowSageGuide\] \= useState(false);  
  const \[navBounds, setNavBounds\] \= useState(null);  
  const navRef \= useRef(null);  
    
  const handleMouseMove \= useCallback((e) \=\> {  
    setMousePos({ x: e.clientX, y: e.clientY });  
  }, \[\]);  
    
  useEffect(() \=\> {  
    window.addEventListener('mousemove', handleMouseMove);  
      
    window.SonicEngine \= SonicEngine;  
    window.RESONANCE\_LIBRARY \= RESONANCE\_LIBRARY;  
      
    return () \=\> window.removeEventListener('mousemove', handleMouseMove);  
  }, \[handleMouseMove\]);  
    
  // Track nav bounds for resonance field to respect  
  useEffect(() \=\> {  
    if (navRef.current) {  
      const updateBounds \= () \=\> {  
        const rect \= navRef.current.getBoundingClientRect();  
        setNavBounds({ top: rect.top, bottom: rect.bottom });  
      };  
      updateBounds();  
      window.addEventListener('resize', updateBounds);  
      return () \=\> window.removeEventListener('resize', updateBounds);  
    }  
  }, \[showOnboarding\]);  
    
  return (  
    \<div style={{ minHeight: '100vh', position: 'relative' }}\>  
      \<style\>{\`  
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400\&display=swap');  
          
        \* { margin: 0; padding: 0; box-sizing: border-box; }  
        body { background-color: \#F5F1E8; overflow-x: hidden; }  
        ::selection { background-color: rgba(212, 175, 55, 0.3); }  
          
        ::-webkit-scrollbar { width: 5px; }  
        ::-webkit-scrollbar-track { background: \#F5F1E8; }  
        ::-webkit-scrollbar-thumb { background: \#C5BDB0; border-radius: 3px; }  
      \`}\</style\>  
        
      {/\* Onboarding \*/}  
      {showOnboarding && (  
        \<Onboarding onComplete={() \=\> setShowOnboarding(false)} /\>  
      )}  
        
      {/\* Dimension 1: Sandy Ocean \*/}  
      \<SandyOcean mousePos={mousePos} /\>  
        
      {/\* Dimension 3: Welcoming Leaves \*/}  
      \<WelcomingLeaves mousePos={mousePos} /\>  
        
      {/\* Dimension 2: Resonance Field (Bullet Time) \*/}  
      {\!showOnboarding && (  
        \<ResonanceField  
          mousePos={mousePos}  
          onVectorLock={setLockedVector}  
          lockedVector={lockedVector}  
          navBounds={navBounds}  
        /\>  
      )}  
        
      {/\* Main Content \*/}  
      \<div style={{  
        position: 'relative',  
        zIndex: 5,  
        maxWidth: 760,  
        margin: '0 auto',  
        padding: '90px 36px 70px',  
      }}\>  
        {/\* Header \*/}  
        \<header style={{ textAlign: 'center', marginBottom: 36 }}\>  
          \<h1 style={{  
            fontFamily: "'Crimson Text', Georgia, serif",  
            fontSize: 'clamp(26px, 4.5vw, 38px)',  
            fontWeight: 400,  
            color: '\#4A3728',  
            marginBottom: 14,  
            letterSpacing: '-0.015em',  
          }}\>  
            Resonance Field Open.  
          \</h1\>  
            
          \<p style={{  
            fontFamily: "'Crimson Text', Georgia, serif",  
            fontSize: 15,  
            fontStyle: 'italic',  
            color: '\#8B7D6B',  
            opacity: 0.85,  
          }}\>  
            {lockedVector   
              ? \`Vector: ${lockedVector.name}. Begin your composition.\`  
              : 'Move slowly. Find what resonates. Click to lock your vector.'}  
          \</p\>  
        \</header\>  
          
        {/\* The Composer \*/}  
        \<Composer  
          lockedVector={lockedVector}  
          onRemixComplete={(text) \=\> console.log('Composition:', text)}  
        /\>  
          
        {/\* Navigation \- with ref for bounds tracking \*/}  
        \<nav  
          ref={navRef}  
          style={{  
            display: 'flex',  
            justifyContent: 'space-between',  
            alignItems: 'center',  
            marginTop: 44,  
            paddingTop: 28,  
            borderTop: '1px solid rgba(139, 125, 107, 0.12)',  
            position: 'relative',  
            zIndex: 10,  
          }}  
        \>  
          \<BreathingNav onClick={() \=\> setShowAlienSchool(true)} color="\#d4af37"\>  
            The Alien School  
          \</BreathingNav\>  
            
          \<button  
            onClick={() \=\> setShowSageGuide(true)}  
            style={{  
              width: 46,  
              height: 46,  
              borderRadius: '50%',  
              backgroundColor: '\#4A3728',  
              border: 'none',  
              cursor: 'pointer',  
              display: 'flex',  
              alignItems: 'center',  
              justifyContent: 'center',  
              transition: 'all 0.4s ease',  
              boxShadow: '0 4px 16px rgba(74, 55, 40, 0.2)',  
              position: 'relative',  
              zIndex: 10,  
            }}  
            onMouseEnter={e \=\> {  
              e.currentTarget.style.transform \= 'scale(1.08)';  
              e.currentTarget.style.backgroundColor \= '\#6B8E7D';  
            }}  
            onMouseLeave={e \=\> {  
              e.currentTarget.style.transform \= 'scale(1)';  
              e.currentTarget.style.backgroundColor \= '\#4A3728';  
            }}  
            title="The Steeping Sage"  
          \>  
            \<span style={{ fontSize: 20 }}\>🍵\</span\>  
          \</button\>  
            
          \<BreathingNav onClick={() \=\> setShowCommune(true)} color="\#7D6B8B"\>  
            Commune  
          \</BreathingNav\>  
        \</nav\>  
          
        {/\* Footer \*/}  
        \<footer style={{ marginTop: 50, textAlign: 'center' }}\>  
          \<p style={{  
            fontFamily: "'Crimson Text', Georgia, serif",  
            fontSize: 12,  
            fontStyle: 'italic',  
            color: 'rgba(139, 125, 107, 0.45)',  
          }}\>  
            "What you seek in the leaf, you find."  
          \</p\>  
          \<p style={{  
            fontFamily: "'Geist Sans', system-ui, sans-serif",  
            fontSize: 9,  
            color: 'rgba(139, 125, 107, 0.3)',  
            marginTop: 6,  
            letterSpacing: '0.08em',  
          }}\>  
            — Master Lin · Synthesized by The Steeping Sage  
          \</p\>  
        \</footer\>  
      \</div\>  
        
      {/\* Turnable Books \*/}  
      \<TurnableBook  
        isOpen={showAlienSchool}  
        onClose={() \=\> setShowAlienSchool(false)}  
        title="THE ÅLïEN SCöÕL"  
        pages={ALIEN\_SCHOOL\_PAGES}  
        accentColor="\#d4af37"  
      /\>  
        
      \<TurnableBook  
        isOpen={showCommune}  
        onClose={() \=\> setShowCommune(false)}  
        title="COMMUNE"  
        pages={COMMUNE\_PAGES}  
        accentColor="\#7D6B8B"  
      /\>  
        
      \<TurnableBook  
        isOpen={showSageGuide}  
        onClose={() \=\> setShowSageGuide(false)}  
        title="THE STEEPING SAGE"  
        pages={SAGE\_GUIDE\_PAGES}  
        accentColor="\#6B8E7D"  
      /\>  
    \</div\>  
  );  
}  
