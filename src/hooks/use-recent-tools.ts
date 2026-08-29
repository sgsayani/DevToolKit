"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "devkit:recent-tools";
const MAX_RECENT = 8;

function loadRecent(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveRecent(slugs: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    // localStorage unavailable — recents just won't persist across reloads.
  }
}

/** localStorage-backed list of recently-visited tool slugs, most recent first. */
export function useRecentTools() {
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time load from localStorage, which is unavailable during server rendering.
    setRecent(loadRecent());
  }, []);

  const recordVisit = useCallback((slug: string) => {
    setRecent((prev) => {
      const next = [slug, ...prev.filter((s) => s !== slug)].slice(0, MAX_RECENT);
      saveRecent(next);
      return next;
    });
  }, []);

  return { recent, recordVisit };
}
