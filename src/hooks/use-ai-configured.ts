"use client";

import { useEffect, useState } from "react";
import { checkAiConfigured } from "@/lib/utils/ai-client";

/** Whether GEMINI_API_KEY is set server-side. `null` while loading, so
 * callers can avoid flashing the "not configured" notice before the check
 * completes. */
export function useAiConfigured(): boolean | null {
  const [configured, setConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    checkAiConfigured().then((result) => {
      if (!cancelled) setConfigured(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return configured;
}
