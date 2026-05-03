import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Mock AudioContext for the Sonnet Engine
window.AudioContext = class {
  createGain() { return { gain: { value: 0, setTargetAtTime: vi.fn(), setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }, connect: vi.fn() }; }
  createOscillator() { return { start: vi.fn(), stop: vi.fn(), connect: vi.fn(), frequency: { value: 0, setTargetAtTime: vi.fn(), setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() } }; }
  createBiquadFilter() { return { connect: vi.fn(), frequency: { value: 0, setTargetAtTime: vi.fn(), setValueAtTime: vi.fn() }, Q: { value: 0 } }; }
  createStereoPanner() { return { connect: vi.fn(), pan: { value: 0, setTargetAtTime: vi.fn() } }; }
  createDelay() { return { connect: vi.fn(), delayTime: { value: 0 } }; }
  createConvolver() { return { connect: vi.fn() }; }
  createBuffer() { return { getChannelData: () => new Float32Array(100) }; }
};
window.webkitAudioContext = window.AudioContext;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Automatically clean up react components after each test
afterEach(() => {
  cleanup();
});
