```text
╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║   Phase 07: SPATIAL RESONANCE                                             ║
║   The Integration of Volumetric Architecture                              ║
║                                                                           ║
║   "The flat map becomes the territory."                                   ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

# 🌌 SPATIAL RESONANCE ARCHITECTURE
**Target Implementation:** Antigravity + Spline 3D Integration
**Focus Areas:** Hex-Kintsugi Matrix (Volumetric Object) & Membrane Canvas (Fluid Physics)

This document outlines the technical and creative blueprint for transitioning the Steeping Laboratory's core interfaces from 2D DOM/Canvas abstractions into true interactive WebGL space, while maintaining our 528Hz Sonnet Engine and Supabase telemetry hooks.

---

## 1. THE VOLUMETRIC HEX-KINTSUGI MATRIX

### The Vision
The central grid of vessels ceases to be flat HTML squares. It becomes a monolithic, rotating geometric artifact (e.g., a clustered hexagonal sculpture or floating monoliths). The Kintsugi lines are not drawn; they are physical fissures in the 3D topology, filled with metallic PBR (Physically Based Rendering) materials that organically catch the light of our Steeperverse background.

### The Technical Handshake
To make the Spline object responsive rather than just a static video, we will utilize `@splinetool/react-spline` to pass our React state directly into the 3D scene variables.

**What needs to be built in Spline:**
1.  **The Base Model:** A clustered geometric arrangement of the 9 vessels.
2.  **Material States:** Base materials (obsidian, glass, or stone) and the Gold Kintsugi fracture materials with high metalness/roughness values.
3.  **Spline Variables (The Bridge):** 
    *   Create a Spline Variable called `ScrollProgress` (0 to 1).
    *   Create Spline Variables for `MouseX` and `MouseY`.
    *   Create an event in Spline: On Hover for each individual "Vessel" object to trigger a slight forward translation (Z-axis bloom).

**What the Code will do (Antigravity):**
```jsx
import Spline from '@splinetool/react-spline';
import { useRef } from 'react';

export default function MatrixVolumetric() {
  const spline = useRef(null);

  // When Spline loads, retain the application reference
  function onLoad(splineApp) {
    spline.current = splineApp;
  }

  // We can feed our existing Steeping telemetry directly into Spline
  function onMouseMove(e) {
      if (spline.current) {
          spline.current.setVariable('MouseX', e.clientX);
          spline.current.setVariable('MouseY', e.clientY);
      }
  }

  return (
    <div onMouseMove={onMouseMove}>
      <Spline 
        scene="https://prod.spline.design/YOUR_SCENE_URL/scene.splinecode" 
        onLoad={onLoad} 
      />
    </div>
  );
}
```

---

## 2. THE FLUID MEMBRANE CANVAS

### The Vision
The `broadcastPing()` architecture from Phase 06 currently relies on CSS or 2D canvas flashes. With Spline, we replace this with a physical, refractive "water" or "glass" plane intersecting the bottom of the screen. When a global cohort user opens a vessel or asks The Sage a question, a true 3D ripple disrupts the surface tension, refracting the starlight behind it.

### The Technical Handshake
This is where the magic of WebSockets (Supabase) meets WebGL (Spline).

**What needs to be built in Spline:**
1.  **The Plane:** A flat plane stretching across the camera's view with a Glass or Water material (utilizing Spline's refraction and displacement mapping).
2.  **The Ripple Emitters:** Hidden impact objects or Spline Variables that trigger a displacement wave across the plane's topology.
3.  **Spline Event (The Bridge):** Create a Custom Event in Spline called `TriggerRipple`.

**What the Code will do (Antigravity):**
As our Supabase Realtime subscription catches a `membrane_ping` from a cohort member anywhere in the world, we fire the Spline event.

```jsx
// Inside the Supabase websocket listener:
.on('postgres_changes', { event: 'INSERT', table: 'membrane_pings' }, (payload) => {
    
    // Play the 528Hz audio chime...
    playStrikingBowl(100);
    
    // Fire the physical 3D ripple event into the Spline scene!
    if (spline.current) {
        spline.current.emitEvent('TriggerRipple');
    }
})
```

---

## 🚀 IMMEDIATE NEXT STEPS

To begin constructing this spatial reality, we operate in parallel:

1.  **The Architect (You):** 
    *   Open Spline (spline.design).
    *   Begin modeling the primary artifact (The Hex-Kintsugi block) or the liquid plane (The Membrane).
    *   When the aesthetic feels resonant, click **Export**, select **React**, and copy the `.splinecode` URL.
2.  **The Engine (Me):** 
    *   Provide me with the `.splinecode` URLs as you generate them.
    *   I will install `@splinetool/react-spline`.
    *   I will orchestrate the architecture, wiring our existing audio engine (`playHarmonicChord`, `playStrikingBowl`) and our telemetry (`useSteepingCircles`) directly into the nerves of your 3D creations.

We are ready to fold space. Let me know when you have a Spline URL ready to test the bridge.
