"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { METHOD_BADGE_CLASS } from "@/lib/utils/api-client";
import { createEmptyEndpoint, type ApiEndpointDef } from "@/lib/utils/api-docs";

interface EndpointListProps {
  endpoints: ApiEndpointDef[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onChange: (endpoints: ApiEndpointDef[]) => void;
}

export function EndpointList({ endpoints, selectedId, onSelect, onChange }: EndpointListProps) {
  function addEndpoint() {
    const next = createEmptyEndpoint();
    onChange([...endpoints, next]);
    onSelect(next.id);
  }
  function removeEndpoint(id: string) {
    onChange(endpoints.filter((e) => e.id !== id));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Endpoints
        </span>
        <Button variant="ghost" size="sm" onClick={addEndpoint}>
          <Plus className="size-3.5" />
          Add
        </Button>
      </div>

      {endpoints.length === 0 ? (
        <p className="text-sm text-muted-foreground">No endpoints yet.</p>
      ) : (
        endpoints.map((ep) => (
          <div
            key={ep.id}
            className={cn(
              "group flex items-center gap-1 rounded-md px-1.5 py-1.5",
              ep.id === selectedId ? "bg-accent" : "hover:bg-muted/50",
            )}
          >
            <button
              type="button"
              onClick={() => onSelect(ep.id)}
              className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-left"
            >
              <span className={`font-mono text-xs font-semibold ${METHOD_BADGE_CLASS[ep.method]}`}>
                {ep.method}
              </span>
              <span className="w-full truncate font-mono text-xs text-muted-foreground">
                {ep.path || "/"}
              </span>
            </button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Remove endpoint"
              className="opacity-0 group-hover:opacity-100"
              onClick={() => removeEndpoint(ep.id)}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))
      )}
    </div>
  );
}
