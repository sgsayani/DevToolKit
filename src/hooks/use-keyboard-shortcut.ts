"use client";

import { useEffect } from "react";

interface ShortcutOptions {
  /** Require Cmd (macOS) or Ctrl (other platforms). */
  mod?: boolean;
  /** Prevent the browser default for this combo (e.g. Ctrl+K search bar). */
  preventDefault?: boolean;
  /** Set false to temporarily disable the listener. */
  enabled?: boolean;
}

/** Registers a global key-combo listener for the given key (e.g. "k", "Enter"). */
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  { mod = false, preventDefault = true, enabled = true }: ShortcutOptions = {},
) {
  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(event: KeyboardEvent) {
      const modMatches = mod ? event.metaKey || event.ctrlKey : true;
      const keyMatches = event.key.toLowerCase() === key.toLowerCase();

      if (keyMatches && modMatches) {
        if (preventDefault) event.preventDefault();
        callback();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [key, callback, mod, preventDefault, enabled]);
}
