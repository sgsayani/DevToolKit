"use client";

import { useCallback, useEffect, useState } from "react";
import type { CreateMockInput, StoredMock } from "@/lib/server/mock-registry";

interface CreateMockResponse {
  ok: boolean;
  mock?: StoredMock;
  error?: string;
}

/** Talks to /api/mocks (the management API) to publish/list/delete
 * server-side mock endpoints. The mocks themselves live in the server's
 * in-memory registry — this hook just keeps a client-side view in sync. */
export function useMocks() {
  const [mocks, setMocks] = useState<StoredMock[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/mocks");
      const data = await res.json();
      if (data.ok) setMocks(data.mocks ?? []);
    } catch {
      // Leave the last-known list in place rather than clearing it.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch of server state on mount; setState happens after the await inside refresh(), not synchronously.
    void refresh();
  }, [refresh]);

  const publish = useCallback(
    async (input: CreateMockInput): Promise<CreateMockResponse> => {
      try {
        const res = await fetch("/api/mocks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        const data = (await res.json()) as CreateMockResponse;
        if (data.ok) await refresh();
        return data;
      } catch {
        return { ok: false, error: "Could not reach the server." };
      }
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      await fetch(`/api/mocks/${id}`, { method: "DELETE" }).catch(() => {});
      await refresh();
    },
    [refresh],
  );

  return { mocks, loading, publish, remove, refresh };
}
