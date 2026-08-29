"use client";

import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { METHOD_BADGE_CLASS } from "@/lib/utils/api-client";
import type { HistoryEntry } from "@/hooks/use-request-history";

function formatRelativeTime(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

interface HistoryPanelProps {
  entries: HistoryEntry[];
  onReopen: (entry: HistoryEntry) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function HistoryPanel({ entries, onReopen, onRemove, onClear }: HistoryPanelProps) {
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          History
        </span>
        {entries.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            <Trash2 className="size-3.5" />
            Clear
          </Button>
        )}
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sent requests appear here.</p>
      ) : (
        <div className="flex flex-col gap-1 overflow-y-auto">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="group flex items-start gap-1 rounded-md px-1.5 py-1.5 hover:bg-muted/60"
            >
              <button
                type="button"
                onClick={() => onReopen(entry)}
                className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-left"
              >
                <div className="flex w-full items-center gap-1.5">
                  <span
                    className={`font-mono text-xs font-semibold ${METHOD_BADGE_CLASS[entry.method]}`}
                  >
                    {entry.method}
                  </span>
                  {entry.lastStatus !== null && (
                    <span className="text-xs text-muted-foreground">{entry.lastStatus}</span>
                  )}
                </div>
                <span className="w-full truncate font-mono text-xs text-muted-foreground">
                  {entry.url}
                </span>
                <span className="text-[0.7rem] text-muted-foreground">
                  {formatRelativeTime(entry.timestamp)}
                </span>
              </button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Delete from history"
                className="opacity-0 group-hover:opacity-100"
                onClick={() => onRemove(entry.id)}
              >
                <X className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
