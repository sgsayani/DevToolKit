"use client";

import { Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/tools/shared/copy-button";
import { METHOD_BADGE_CLASS } from "@/lib/utils/api-client";
import type { StoredMock } from "@/lib/server/mock-registry";

interface MockListProps {
  mocks: StoredMock[];
  onDelete: (id: string) => void;
  onTest: (mock: StoredMock) => void;
}

export function MockList({ mocks, onDelete, onTest }: MockListProps) {
  if (mocks.length === 0) {
    return <p className="text-sm text-muted-foreground">No published mocks yet.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {mocks.map((mock) => {
        const path = `/api/mock${mock.path}`;
        const fullUrl =
          typeof window !== "undefined" ? `${window.location.origin}${path}` : path;
        return (
          <div
            key={mock.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span className={`font-mono text-xs font-semibold ${METHOD_BADGE_CLASS[mock.method]}`}>
                {mock.method}
              </span>
              <span className="truncate font-mono text-sm">{path}</span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {mock.status} · {mock.delayMs}ms · {mock.recordCount} rec
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <CopyButton value={fullUrl} label="Copy URL" />
              <Button type="button" variant="outline" size="sm" onClick={() => onTest(mock)}>
                <Play className="size-3.5" />
                Test
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Delete mock"
                onClick={() => onDelete(mock.id)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
