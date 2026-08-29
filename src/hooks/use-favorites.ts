"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "devkit:favorites";

function loadFavorites(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveFavorites(slugs: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    // localStorage unavailable — favorites just won't persist across reloads.
  }
}

/** localStorage-backed favorite tool slugs. */
export function useFavorites() {
  // Starts empty so server and client render identical markup; the real
  // list is loaded post-mount, same pattern as use-request-history.ts.
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time load from localStorage, which is unavailable during server rendering.
    setFavorites(loadFavorites());
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    saveFavorites(favorites);
  }, [favorites, hasLoaded]);

  const isFavorite = useCallback((slug: string) => favorites.includes(slug), [favorites]);

  const toggleFavorite = useCallback((slug: string) => {
    setFavorites((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }, []);

  return { favorites, isFavorite, toggleFavorite };
}
