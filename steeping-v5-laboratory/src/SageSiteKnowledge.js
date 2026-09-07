// Sage's site-knowledge layer — the "called play" half of what Sage reads. The rest of
// useSageWayfinding.jsx reads behavioral signals (a broken play, read off the floor);
// this is what fires when a visitor asks Sage something explicit about the site itself.
// Same voice as OrientationGlossary.js (the hover-tooltip version of these same facts),
// written for conversation: `insight` is the deliberate answer, `direction` is the assist —
// where to actually go for more, the way a point guard delivers to where a teammate can score.
export const SageSiteKnowledge = [
  {
    topic: 'compass',
    keywords: ['compass', 'me in 5d', '5d', 'five axes', 'biometric'],
    label: 'Me in 5D',
    insight: "Five axes read the shape of your practice back to you — a mirror, not a score.",
    direction: "Open the Compass any time from the menu below.",
  },
  {
    topic: 'steeping-notes',
    keywords: ['steeping notes', 'notes', 'archive', 'essays', 'field notes'],
    label: 'Steeping Notes',
    insight: "The archive of essays and field notes behind the practice — including The Sound of Becoming.",
    direction: "Free to read any time from the menu, no vessel required.",
  },
  {
    topic: 'sound-of-becoming',
    keywords: ['sound of becoming', '528hz', '528', 'frequency', 'neuroscience', 'sound bath'],
    label: 'The Sound of Becoming',
    insight: "A neuroscience essay explaining why writing and hearing your own words at once engages more of the body than either alone.",
    direction: "Find it inside Steeping Notes, or from the Orient Me guide.",
  },
  {
    topic: 'hexagong',
    keywords: ['hexagong', 'vessels', 'vessel', 'nine vessels'],
    label: 'Hexagong',
    insight: "The six-sided vessel at the center of the practice. Nine exist, numbered 00 through 08 — what waits inside one is not what waits inside another.",
    direction: "Return to the Matrix to open one.",
  },
  {
    topic: 'your-architecture',
    keywords: ['your architecture', 'scratchpad', 'writing field', 'where i write'],
    label: 'Your Architecture',
    insight: "The writing surface inside each Hexagong, where a reflection is held. Signed in above the Nomad tier, it saves and waits for you across visits.",
    direction: "It's the field at the base of each vessel you open.",
  },
  {
    topic: 'timer',
    keywords: ['active pause', 'timer', 'timers', '5 15 22', 'minutes'],
    label: 'The Global Timer',
    insight: "Three timers sit at the lower left — 5, 15, or 22 minutes — for an Active Pause whenever you need one.",
    direction: "Set one from the lower left of the screen, any time.",
  },
  {
    topic: 'nav-menu',
    keywords: ['hamburger', 'navigation', 'guide to the steeperverse', 'menu'],
    label: 'The Hamburger Menu',
    insight: "Every door in Creative Steeping — Steeping Notes, Me in 5D, this Guide, About — opens from the same small icon, top corner, always present.",
    direction: "Look for the small ☰ icon, top right.",
  },
  {
    topic: 'nomad',
    keywords: ['nomad', 'sign up', 'sign in', 'create an account', 'account', 'tier'],
    label: 'Nomad',
    insight: "The tier every practitioner starts in — open, ungated, no account required.",
    direction: "Creating an account moves you to Guided Scholar, where Your Architecture starts to sync.",
  },
  {
    topic: 'orient-me',
    keywords: ['orient me', 'orientation', 'the tour', 'structural manual'],
    label: 'Orient Me',
    insight: "A short guided tour of everything inside Creative Steeping, available any time.",
    direction: "Find it in the menu as [ ORIENT ME ].",
  },
  {
    topic: 'sage',
    keywords: ['who are you', 'what are you', 'are you ai', 'are you real', 'what is sage', 'are you human'],
    label: 'Sage',
    insight: "A local behavioral intelligence — reads your pacing and which Steep you're in, never an external AI, never a database of what you've written.",
    direction: "Ask about anything on the site; the answer will point you where to go.",
  },
];

// Longest-keyword-wins: a query can brush against several entries' generic words
// ("notes" inside "steeping notes"), so the most specific phrase actually present decides it.
export function matchSiteKnowledge(query) {
  if (!query || typeof query !== 'string') return null;
  const q = query.toLowerCase();
  let best = null;
  let bestLen = 0;
  for (const entry of SageSiteKnowledge) {
    for (const kw of entry.keywords) {
      if (q.includes(kw) && kw.length > bestLen) {
        best = entry;
        bestLen = kw.length;
      }
    }
  }
  return best;
}
