"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

const MAX_ENTRIES_PER_NODE = 500;
const INDENT_PX = 14;

function valueColorClass(value: unknown): string {
  if (typeof value === "string") return "text-emerald-700 dark:text-emerald-400";
  if (typeof value === "number") return "text-blue-700 dark:text-blue-400";
  if (typeof value === "boolean" || value === null) return "text-amber-700 dark:text-amber-400";
  return "";
}

function formatPrimitive(value: unknown): string {
  if (typeof value === "string") return `"${value}"`;
  if (value === null) return "null";
  return String(value);
}

function KeyLabel({ label }: { label: string | number | undefined }) {
  if (label === undefined) return null;
  return (
    <span className="text-muted-foreground">
      {typeof label === "number" ? label : `"${label}"`}:{" "}
    </span>
  );
}

function JsonNode({
  label,
  value,
  depth,
}: {
  label?: string | number;
  value: unknown;
  depth: number;
}) {
  const isCollection = value !== null && typeof value === "object";
  // Auto-expand the first two levels so useful content is visible up front.
  const [expanded, setExpanded] = useState(depth < 2);

  if (!isCollection) {
    return (
      <div className="py-0.5" style={{ paddingLeft: depth * INDENT_PX }}>
        <KeyLabel label={label} />
        <span className={valueColorClass(value)}>{formatPrimitive(value)}</span>
      </div>
    );
  }

  const isArray = Array.isArray(value);
  const entries: [string | number, unknown][] = isArray
    ? (value as unknown[]).map((v, i) => [i, v])
    : Object.entries(value as Record<string, unknown>);
  const [open, close] = isArray ? ["[", "]"] : ["{", "}"];
  const visibleEntries = entries.slice(0, MAX_ENTRIES_PER_NODE);
  const hiddenCount = entries.length - visibleEntries.length;

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center gap-1 rounded py-0.5 text-left hover:bg-muted/40"
        style={{ paddingLeft: depth * INDENT_PX }}
      >
        {expanded ? (
          <ChevronDown className="size-3 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="size-3 shrink-0 text-muted-foreground" />
        )}
        <KeyLabel label={label} />
        <span className="text-muted-foreground">
          {open}
          {!expanded && ` ${entries.length} item${entries.length === 1 ? "" : "s"} `}
          {!expanded && close}
        </span>
      </button>
      {expanded && (
        <div>
          {visibleEntries.map(([k, v]) => (
            <JsonNode key={k} label={k} value={v} depth={depth + 1} />
          ))}
          {hiddenCount > 0 && (
            <div
              className="py-0.5 text-muted-foreground"
              style={{ paddingLeft: (depth + 1) * INDENT_PX }}
            >
              … {hiddenCount} more
            </div>
          )}
          <div className="text-muted-foreground" style={{ paddingLeft: depth * INDENT_PX }}>
            {close}
          </div>
        </div>
      )}
    </div>
  );
}

export function JsonTreeView({ data }: { data: unknown }) {
  return (
    <div className="font-mono text-xs">
      <JsonNode value={data} depth={0} />
    </div>
  );
}
