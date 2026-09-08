import { useRef, useEffect, useCallback } from 'react';

// VAPOR — the register for real dissolve. Ported from the Afterlight instrument
// (public/afterlight.html), where this exact particle + noise-sweep pair was proven:
// what a visitor takes back should dissolve, not simply vanish.
//
// Usage: const { canvasRef, burst, sweep } = useVaporField();
// Render <canvas ref={canvasRef} style={{ position:'absolute', inset:0, pointerEvents:'none' }} />
// inside a `position: relative` container the same size as the surface you want vapor over,
// then call burst(clientX, clientY, colorHex) and sweep(rootFreq) at the moment of deletion.

function hexToRgb(hex) {
  let h = (hex || '#e0f2fe').replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const num = parseInt(h, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

export function useVaporField() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);
  const audioCtxRef = useRef(null);
  const noiseBufferRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, rect.width * dpr);
      canvas.height = Math.max(1, rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctxRef.current = ctx;
    };
    resize();

    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      const ctx = ctxRef.current;
      if (!ctx) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.012;
        p.life -= p.decay;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${Math.max(p.life, 0) * 0.75})`;
        ctx.fill();
      }
    };
    loop();

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => () => {
    if (audioCtxRef.current) audioCtxRef.current.close();
  }, []);

  const burst = useCallback((clientX, clientY, colorHex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const { r, g, b } = hexToRgb(colorHex);
    for (let i = 0; i < 8; i++) {
      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 2.2,
        vy: -Math.random() * 1.4 - 0.3,
        life: 1,
        decay: 0.014 + Math.random() * 0.014,
        size: Math.random() * 1.8 + 0.8,
        r,
        g,
        b,
      });
    }
  }, []);

  const ensureAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      const ctx = new AC();
      const n = ctx.sampleRate; // 1s noise buffer
      const buffer = ctx.createBuffer(1, n, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < n; i++) data[i] = Math.random() * 2 - 1;
      audioCtxRef.current = ctx;
      noiseBufferRef.current = buffer;
    }
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
    return audioCtxRef.current;
  }, []);

  const sweep = useCallback((rootFreq = 220) => {
    const ctx = ensureAudio();
    if (!ctx || !noiseBufferRef.current) return;
    const now = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = noiseBufferRef.current;
    src.loop = true;
    const filt = ctx.createBiquadFilter();
    filt.type = 'bandpass';
    filt.Q.value = 1.4;
    const gain = ctx.createGain();
    const dur = 0.22;
    filt.frequency.setValueAtTime(rootFreq * 9, now);
    filt.frequency.exponentialRampToValueAtTime(rootFreq * 2.2, now + dur * 0.75);
    filt.frequency.exponentialRampToValueAtTime(rootFreq * 3.5, now + dur);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.05, now + dur * 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    src.connect(filt).connect(gain).connect(ctx.destination);
    src.start(now);
    src.stop(now + dur + 0.05);
  }, [ensureAudio]);

  return { canvasRef, burst, sweep };
}

// Robust caret pixel-position for a <textarea>, via the standard hidden-mirror-div
// technique. Needed because a multiline textarea has no native API for this — we copy
// its computed text-layout properties onto an off-screen div, render the text up to the
// caret into it, and measure where a marker span lands.
const MIRRORED_PROPS = [
  'boxSizing', 'width', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
  'fontStyle', 'fontVariant', 'fontWeight', 'fontStretch', 'fontSize', 'fontFamily',
  'lineHeight', 'letterSpacing', 'wordSpacing', 'tabSize', 'textIndent', 'textTransform',
  'textAlign',
];

export function getTextareaCaretClientCoords(textarea) {
  const rect = textarea.getBoundingClientRect();
  const style = window.getComputedStyle(textarea);

  const div = document.createElement('div');
  MIRRORED_PROPS.forEach((prop) => { div.style[prop] = style[prop]; });
  div.style.position = 'absolute';
  div.style.visibility = 'hidden';
  div.style.whiteSpace = 'pre-wrap';
  div.style.overflowWrap = 'break-word';
  div.style.top = '0';
  div.style.left = '-9999px';

  const caretIndex = textarea.selectionStart ?? textarea.value.length;
  div.textContent = textarea.value.substring(0, caretIndex);
  const marker = document.createElement('span');
  marker.textContent = '.';
  div.appendChild(marker);
  document.body.appendChild(div);

  const markerRect = marker.getBoundingClientRect();
  const divRect = div.getBoundingClientRect();
  const offsetX = markerRect.left - divRect.left;
  const offsetY = markerRect.top - divRect.top;
  document.body.removeChild(div);

  return {
    x: rect.left + offsetX - textarea.scrollLeft,
    y: rect.top + offsetY - textarea.scrollTop,
  };
}

// Caret pixel-position for a single-line <input>. Simpler than the textarea
// version above — no wrapping to account for, so a single hidden span
// measuring the pre-caret text is enough. Assumes left-aligned text; a
// centered or right-aligned input would need the offset math adjusted.
export function getInputCaretClientCoords(input) {
  const rect = input.getBoundingClientRect();
  const style = window.getComputedStyle(input);

  const span = document.createElement('span');
  span.style.position = 'absolute';
  span.style.visibility = 'hidden';
  span.style.whiteSpace = 'pre';
  span.style.font = style.font;
  span.style.letterSpacing = style.letterSpacing;
  const caretIndex = input.selectionStart ?? input.value.length;
  span.textContent = input.value.substring(0, caretIndex);
  document.body.appendChild(span);

  const textWidth = span.getBoundingClientRect().width;
  document.body.removeChild(span);

  const paddingLeft = parseFloat(style.paddingLeft) || 0;
  const borderLeft = parseFloat(style.borderLeftWidth) || 0;

  return {
    x: rect.left + paddingLeft + borderLeft + textWidth - input.scrollLeft,
    y: rect.top + rect.height / 2,
  };
}
