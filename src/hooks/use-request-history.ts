"use client";

import { useCallback, useEffect, useState } from "react";
import {
  redactHeadersForHistory,
  redactJsonBodyForHistory,
  type AuthType,
  type BodyType,
  type HttpMethod,
  type KeyValueRow,
} from "@/lib/utils/api-client";

const STORAGE_KEY = "devkit:api-client:history";
const MAX_HISTORY = 50;

export interface HistoryEntry {
  id: string;
  method: HttpMethod;
  url: string;
  params: KeyValueRow[];
  headers: KeyValueRow[];
  bodyType: BodyType;
  body: string;
  authType: AuthType;
  authUsername: string;
  timestamp: number;
  lastStatus: number | null;
}

export type NewHistoryEntryInput = Omit<HistoryEntry, "id" | "timestamp">;

function loadHistory(): HistoryEntry[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // localStorage unavailable (private mode, quota, etc.) — history just
    // won't persist across reloads; not fatal to the tool working.
  }
}

/** localStorage-backed request history. Sensitive header values and
 * common secret-shaped JSON body keys are redacted before persisting —
 * see redactHeadersForHistory / redactJsonBodyForHistory. */
export function useRequestHistory() {
  // Starts empty so server and client render identical markup; localStorage
  // only exists client-side, so the real history is loaded post-mount.
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time load from localStorage, which is unavailable during server rendering.
    setEntries(loadHistory());
  }, []);

  const addEntry = useCallback((input: NewHistoryEntryInput) => {
    const entry: HistoryEntry = {
      ...input,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      headers: redactHeadersForHistory(input.headers),
      body: input.bodyType === "json" ? redactJsonBodyForHistory(input.body) : input.body,
    };
    setEntries((prev) => {
      const next = [entry, ...prev].slice(0, MAX_HISTORY);
      saveHistory(next);
      return next;
    });
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => {
      const next = prev.filter((e) => e.id !== id);
      saveHistory(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setEntries([]);
    saveHistory([]);
  }, []);

  return { entries, addEntry, removeEntry, clearHistory };
}
