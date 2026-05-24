import { useEffect, useRef, useState, useCallback } from "react";

// ==========================================
// THE CODEX : LOCAL RAG ENGINE
// ==========================================
// Loads the pre-built codex.json (TF-IDF indexed
// fragments of practitioner-facing documentation)
// and surfaces contextually relevant content
// based on the visitor's steep and text.

// --- Search Utilities ---

const STOP_WORDS = new Set([
  "the", "and", "for", "are", "but", "not", "you", "all", "can", "had",
  "her", "was", "one", "our", "out", "has", "have", "been", "will",
  "with", "this", "that", "from", "they", "were", "been", "said",
  "each", "which", "their", "what", "about", "would", "make", "like",
  "into", "than", "them", "then", "some", "when", "come", "made",
  "after", "also", "more", "other", "very", "just", "your",
]);

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function queryTokens(text) {
  return tokenize(text).filter((t) => !STOP_WORDS.has(t));
}

export function searchByTerms(codex, query, limit = 5) {
  const tokens = queryTokens(query);
  if (tokens.length === 0) return [];

  const results = [];
  for (const fragment of codex.fragments) {
    let score = 0;
    const matched = [];
    for (const token of tokens) {
      const tf = fragment.terms[token];
      if (tf) {
        score += tf * (codex.idf[token] ?? 1);
        matched.push(token);
      }
    }
    if (score > 0) results.push({ fragment, score, matchedTerms: matched });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

export function searchBySteep(codex, steep, limit = 5) {
  const results = [];
  for (const fragment of codex.fragments) {
    const affinity = fragment.steepAffinity[steep];
    if (affinity && affinity > 0) {
      results.push({ fragment, score: affinity, matchedTerms: [steep] });
    }
  }
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

export function searchBySteepAndTerms(codex, steep, query, limit = 5) {
  const tokens = queryTokens(query);
  const results = [];

  for (const fragment of codex.fragments) {
    let termScore = 0;
    const matched = [];
    for (const token of tokens) {
      const tf = fragment.terms[token];
      if (tf) {
        termScore += tf * (codex.idf[token] ?? 1);
        matched.push(token);
      }
    }
    const steepAffinity = fragment.steepAffinity[steep] ?? 0;
    const combined = termScore * 0.75 + steepAffinity * 0.25;
    if (combined > 0) results.push({ fragment, score: combined, matchedTerms: matched });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

export function searchByTheme(codex, theme, limit = 5) {
  return codex.fragments
    .filter((f) => f.themes.includes(theme))
    .map((f) => ({
      fragment: f,
      score: (f.themes.length > 0 ? 1 / f.themes.length : 0) + 0.5,
      matchedTerms: [theme],
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function surfaceForWayfinding(codex, steep, visitorText, previousIds = new Set(), limit = 3) {
  const hasText = visitorText.trim().length > 0;

  const candidates = hasText
    ? searchBySteepAndTerms(codex, steep, visitorText, limit * 3)
    : searchBySteep(codex, steep, limit * 3);

  return candidates
    .filter((r) => !previousIds.has(r.fragment.id))
    .slice(0, limit);
}

// --- React Hook ---

export function useCodex() {
  const [codex, setCodex] = useState(null);
  const [loading, setLoading] = useState(true);
  const surfacedIds = useRef(new Set());

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}codex.json`)
      .then((res) => res.json())
      .then((data) => {
        setCodex(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const surface = useCallback(
    (steep, visitorText, limit = 3) => {
      if (!codex) return [];
      const results = surfaceForWayfinding(
        codex, steep, visitorText, surfacedIds.current, limit
      );
      for (const r of results) {
        surfacedIds.current.add(r.fragment.id);
      }
      return results;
    },
    [codex]
  );

  const resetSurfaced = useCallback(() => {
    surfacedIds.current.clear();
  }, []);

  return { codex, loading, surface, resetSurfaced };
}
