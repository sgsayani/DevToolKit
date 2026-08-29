"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { httpStatuses, type HttpStatus, type StatusCategory } from "@/lib/utils/http-status";

const CATEGORY_LABEL: Record<StatusCategory, string> = {
  "2xx": "2xx — Success",
  "3xx": "3xx — Redirection",
  "4xx": "4xx — Client Error",
  "5xx": "5xx — Server Error",
};

const CATEGORY_ORDER: StatusCategory[] = ["2xx", "3xx", "4xx", "5xx"];

export function HttpStatusExplorerTool() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return httpStatuses;
    return httpStatuses.filter(
      (s) => String(s.code).includes(q) || s.name.toLowerCase().includes(q),
    );
  }, [query]);

  const grouped = useMemo(() => {
    const map = new Map<StatusCategory, HttpStatus[]>();
    for (const cat of CATEGORY_ORDER) map.set(cat, []);
    for (const status of filtered) map.get(status.category)!.push(status);
    return map;
  }, [filtered]);

  return (
    <div className="flex flex-col gap-6">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by code or name — e.g. 404 or Not Found"
        className="max-w-sm"
      />

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          No status codes match &ldquo;{query}&rdquo;.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {CATEGORY_ORDER.filter((cat) => (grouped.get(cat)?.length ?? 0) > 0).map((cat) => (
            <div key={cat} className="flex flex-col gap-2">
              <h2 className="text-sm font-semibold text-muted-foreground">
                {CATEGORY_LABEL[cat]}
              </h2>
              <div className="flex flex-col gap-2">
                {grouped.get(cat)!.map((status) => (
                  <div
                    key={status.code}
                    className="flex flex-col gap-1 rounded-lg border border-border p-3"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">
                        {status.code}
                      </Badge>
                      <span className="text-sm font-medium">{status.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{status.meaning}</p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground/70">Common cause: </span>
                      {status.commonCause}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
