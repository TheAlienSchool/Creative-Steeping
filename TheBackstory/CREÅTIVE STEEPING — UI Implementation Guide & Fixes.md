# CREÅTIVE STEEPING — UI Implementation Guide & Fixes

**Date:** Feb 23, 2026
**Author:** Manus AI
**Status:** Ready for Implementation

---

## 1. Overview

This document provides a structured, token-based guide for correcting the UI/UX issues identified in the early Creative Steeping mockups. It is designed to be a direct, actionable brief for the development team.

**All fixes and callouts in this document directly reference the [Visual Feedback Roadmap](https://8080-igpsjetuiu8nym23ix36i-7438c71a.us1.manus.computer). Please use the roadmap as a visual companion to this guide.**

### Guiding Principles

1.  **Establish Confidence:** The design has soul. The fixes should amplify its confidence by ensuring every element is deliberate, well-spaced, and correctly sized.
2.  **Ensure Accessibility (WCAG AA):** All text and interactive elements must meet a minimum contrast ratio of 4.5:1. This is non-negotiable.
3.  **Systematize with Tokens:** Move away from one-off pixel values. Implement a system of design tokens for color, typography, and spacing. This will be the foundation for a scalable and maintainable design system.

---

## 2. Design Token Definitions

Implement the following tokens in your CSS/styling system (e.g., CSS variables, Tailwind config, etc.). All subsequent fixes will reference these tokens.

### Color Tokens

#### Global Palette

| Token | Value | Usage |
|---|---|---|
| `color-bg-primary` | `#0a0a0a` | Primary page background |
| `color-bg-surface` | `#141414` | Card backgrounds, elevated surfaces |
| `color-text-primary` | `#e8e8e8` | Primary body text |
| `color-text-secondary` | `#999999` | Secondary/muted text, labels |
| `color-text-placeholder` | `rgba(232, 232, 232, 0.5)` | Placeholder text in input fields |
| `color-border-primary` | `#2a2a2a` | Primary borders for cards, inputs |
| `color-border-interactive` | `#555555` | Borders for interactive elements (e.g., buttons) |

#### Thematic Accent Palette

| Token | Value | Usage |
|---|---|---|
| `color-accent-oceanic` | `#4a9eca` | Accent color for Oceanic mode (links, highlights) |
| `color-accent-incandescent` | `#c8a96e` | Accent color for Incandescent mode |
| `color-accent-emergent` | `#e8e8e8` | Accent color for Emergent mode (often same as primary text) |

### Typographic Scale

| Token | `rem` | `px` (approx) | Usage |
|---|---|---|---|
| `font-size-xs` | `0.75rem` | 12px | Microcopy, legal text (use sparingly) |
| `font-size-sm` | `0.875rem` | 14px | **New Nav & Footer size**, secondary labels |
| `font-size-base` | `1rem` | 16px | Primary body text |
| `font-size-md` | `1.25rem` | 20px | Sub-headings |
| `font-size-lg` | `1.75rem` | 28px | Large quote text, secondary headings |
| `font-size-xl` | `2.5rem` | 40px | Hero headings (`Who do I Think I Am?`) |

### Spacing Scale (Base unit: 8px)

| Token | `rem` | `px` | Usage |
|---|---|---|---|
| `space-1` | `0.25rem` | 4px | Micro-gaps |
| `space-2` | `0.5rem` | 8px | Inline element padding |
| `space-3` | `1rem` | 16px | Component padding (buttons), small gaps |
| `space-4` | `1.5rem` | 24px | Medium gaps between elements |
| `space-5` | `2rem` | 32px | Section padding, large gaps |
| `space-6` | `3rem` | 48px | Gaps between major sections |
| `space-7` | `4rem` | 64px | Page-level padding |

---

## 3. Implementation Order: Phased Fixes

Follow this sequence. Phase 1 addresses critical bugs and accessibility failures. Phase 2 focuses on usability and consistency. Phase 3 is for aesthetic polish.

### Phase 1: High-Priority (Fix First)

These issues break functionality or fail accessibility standards. **Resolve these before any other work.**

1.  **Fix: Input Placeholder Clipping & Contrast**
    *   **Reference:** `[Roadmap: S1-6, S2-4, S3-4, S6-6]`
    *   **Problem:** Placeholder text is clipped and has critically low contrast.
    *   **Scope:** Global Input Component (`<input>`, `<textarea>`)
    *   **Solution:**
        1.  Set placeholder color globally: `color: var(--color-text-placeholder);`
        2.  Ensure the input component has a `min-height` sufficient to display the full placeholder text without clipping, or reduce the placeholder `font-size` to fit on a single line.

2.  **Fix: Nav Font Size & Wrapping**
    *   **Reference:** `[Roadmap: S1-1, S1-2, S2-2]`
    *   **Problem:** Nav links are too small and `THE ÅLIËN SCÖOL` wraps.
    *   **Scope:** Header Navigation Component
    *   **Solution:**
        1.  Update all nav link styles to use `font-size: var(--font-size-sm);`
        2.  Target the `THE ÅLIËN SCÖOL` link specifically and apply `white-space: nowrap;`

3.  **Fix: Vessel Map Layout Collapse**
    *   **Reference:** `[Roadmap: S4-1, S4-2, S4-3, S4-4, S4-5]`
    *   **Problem:** Overlapping ovals cause text collision, truncation, and invisibility.
    *   **Scope:** Vessel Map Component
    *   **Solution:** This requires a structural refactor. See **Section 4: Vessel Map Refactor** below for the required approach.

4.  **Fix: Critical Contrast Failures (Oceanic Mode)**
    *   **Reference:** `[Roadmap: S1-4, S6-2, S6-4]`
    *   **Problem:** Multiple elements in Oceanic mode are illegible.
    *   **Scope:** Oceanic Theme Styles
    *   **Solution:**
        1.  **Mode Label (`OCEANIC MODE`):** The text color must be updated to provide a minimum 3:1 contrast ratio against the background. Suggest using `var(--color-accent-oceanic)` at a higher opacity or a lighter variant.
        2.  **Eyebrow Text (`A JOURNEY...`):** Update text color to `var(--color-text-secondary)`. It must clear 4.5:1.
        3.  **CTA Button (`ENTER THE STEEP`):** The button border and text color must be updated to `var(--color-accent-oceanic)` or `var(--color-text-primary)` to ensure a 4.5:1 contrast ratio.

### Phase 2: Medium-Priority (Same Sprint)

These issues impact usability and visual consistency.

1.  **Update: Global Footer & CTA Sizing**
    *   **Reference:** `[Roadmap: S1-7, S1-8]`
    *   **Problem:** Footer text is unreadable; CTA buttons lack confidence.
    *   **Scope:** Footer Component, Global Button Component
    *   **Solution:**
        1.  **Footer:** Update all text elements to use `font-size: var(--font-size-sm);`
        2.  **Buttons:** Apply `padding: var(--space-3) var(--space-4);` to all primary CTA buttons. Ensure a `min-height` of `48px` for touch compliance.

2.  **Refine: Spacing & Alignment**
    *   **Reference:** `[Roadmap: S1-3, S5-3]`
    *   **Problem:** Inconsistent spacing and misaligned elements.
    *   **Scope:** Header, Identity Entry Page
    *   **Solution:**
        1.  **Header Dead-Band:** Reduce the large empty space between the nav and main content to `var(--space-6)`. This should be a `margin-bottom` on the header or `margin-top` on the main content area.
        2.  **Button/Input Axis:** On the Identity Entry screen, align both the input field and the CTA button to the same axis. Left-aligning both is recommended for standard forms.

3.  **Fix: Nav Underline & Attribution Contrast**
    *   **Reference:** `[Roadmap: S3-1, S1-5, S2-3]`
    *   **Problem:** Inconsistent nav underline; illegible attribution text.
    *   **Scope:** Nav Component, Quote Card Component
    *   **Solution:**
        1.  **Nav Underline:** Refactor the active state underline to be a `::after` pseudo-element with `width: 100%` relative to the text element, not a fixed pixel value.
        2.  **Attribution Text:** Update the attribution line (`— STEEPING SAGE...`) to use `color: var(--color-text-secondary);` and `font-size: var(--font-size-xs);` across all themes.

### Phase 3: Low-Priority (Polish Pass)

These are aesthetic refinements that complete the visual system.

1.  **Adjust: Type Hierarchy**
    *   **Reference:** `[Roadmap: S5-1]`
    *   **Problem:** Sub-copy on the Identity screen competes with the hero heading.
    *   **Scope:** Identity Entry Page
    *   **Solution:** Update the sub-copy (`Your answer opens the steep...`) to use `font-size: var(--font-size-md);`

2.  **Refine: Surface Contrast**
    *   **Reference:** `[Roadmap: S2-5, S3-3]`
    *   **Problem:** Quote cards have minimal differentiation from the background.
    *   **Scope:** Quote Card Component
    *   **Solution:** Update the card background color to `var(--color-bg-surface);` across all themes. This provides a subtle but consistent elevation.

---

## 4. Vessel Map Refactor (High Priority)

**The current overlapping oval layout is not viable and must be replaced.** The text collision and truncation issues are critical usability failures.

**Proposed Solution: Structured Grid Layout**

1.  **Layout:** Refactor the vessel map into a responsive two-column grid (`grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));`).
2.  **Vessel Component:** Each vessel should be a self-contained card, not a free-floating oval. The card can have a subtle oval motif as a background element, but the container itself should be rectangular for predictable layout flow.
3.  **Content:** Inside each card:
    *   `Vessel 01` (as a kicker/eyebrow)
    *   `What is Creative Steeping` (as the main heading)
    *   `ORIENTATION + PRACTICE` (as a sub-label)
4.  **Spacing:** Use `gap: var(--space-5);` for the grid spacing.

This approach preserves the vessel concept while ensuring 100% legibility and a robust, responsive structure.

---

## 5. Verification Checklist

- [ ] All colors, fonts, and spacing values reference the new design tokens.
- [ ] All text meets WCAG AA contrast of 4.5:1 (use a contrast checker tool).
- [ ] Input placeholder text is fully visible and legible in all modes.
- [ ] Header navigation is legible (`14px`), and no items wrap.
- [ ] The Vessel Map has been refactored into a structured, legible grid.
- [ ] CTA buttons are consistently sized with proper padding.
- [ ] Footer text is legible (`14px`).
- [ ] There are no instances of text clipping or overflow outside of intentional ellipsis.
- [ ] All fixes have been verified against the [Visual Feedback Roadmap](https://8080-igpsjetuiu8nym23ix36i-7438c71a.us1.manus.computer).
