"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

const MAX_ENTRIES_PER_NODE = 500;
const INDENT_PX = 14;

/** Rendered exclusively on the dark --editor surface (API Tester's response
 * body, Mock API Generator's preview) — colors are the fixed --syntax-*
 * palette, not a light/dark pair. */
function valueColorClass(value: unknown): string {
  if (typeof value === "string") return "text-syntax-string";
  if (typeof value === "number") return "text-syntax-number";
  if (typeof value === "boolean" || value === null) return "text-syntax-boolean";
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
    <span className="text-editor-muted">
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
        className="flex w-full items-center gap-1 rounded py-0.5 text-left hover:bg-editor-toolbar"
        style={{ paddingLeft: depth * INDENT_PX }}
      >
        {expanded ? (
          <ChevronDown className="size-3 shrink-0 text-editor-muted" />
        ) : (
          <ChevronRight className="size-3 shrink-0 text-editor-muted" />
        )}
        <KeyLabel label={label} />
        <span className="text-editor-muted">
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
              className="py-0.5 text-editor-muted"
              style={{ paddingLeft: (depth + 1) * INDENT_PX }}
            >
              … {hiddenCount} more
            </div>
          )}
          <div className="text-editor-muted" style={{ paddingLeft: depth * INDENT_PX }}>
            {close}
          </div>
        </div>
      )}
    </div>
  );
}

export function JsonTreeView({ data }: { data: unknown }) {
  return (
    <div className="font-mono text-xs text-editor-foreground">
      <JsonNode value={data} depth={0} />
    </div>
  );
}
