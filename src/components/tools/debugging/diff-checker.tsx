"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolPanelGrid, ToolActionBar } from "@/components/tools/shared/tool-panels";
import { EditorPanel } from "@/components/tools/shared/editor-panel";
import { CopyButton } from "@/components/tools/shared/copy-button";
import { cn } from "@/lib/utils";
import { diffLines, toUnifiedText, type DiffLineType } from "@/lib/utils/diff";

const SAMPLE_ORIGINAL =
  "function greet(name) {\n  console.log('Hello ' + name);\n  return true;\n}";
const SAMPLE_MODIFIED =
  "function greet(name) {\n  console.log('Hi ' + name + '!');\n  return true;\n}";

const MAX_RENDER_LINES = 3000;

function rowClass(type: DiffLineType): string {
  switch (type) {
    case "added":
      return "bg-emerald-500/10";
    case "removed":
      return "bg-destructive/15";
    default:
      return "";
  }
}

function markerClass(type: DiffLineType): string {
  switch (type) {
    case "added":
      return "text-emerald-400 font-semibold";
    case "removed":
      return "text-red-400 font-semibold";
    default:
      return "text-editor-muted/50";
  }
}

function marker(type: DiffLineType): string {
  return type === "added" ? "+" : type === "removed" ? "-" : "";
}

export function DiffCheckerTool() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");

  const result = useMemo(() => {
    if (!original && !modified) return null;
    return diffLines(original, modified);
  }, [original, modified]);

  const unifiedText = result ? toUnifiedText(result) : "";
  const visibleLines = result ? result.lines.slice(0, MAX_RENDER_LINES) : [];
  const truncated = result ? result.lines.length > MAX_RENDER_LINES : false;

  function handleSwap() {
    setOriginal(modified);
    setModified(original);
  }

  function handleClear() {
    setOriginal("");
    setModified("");
  }

  return (
    <div className="flex flex-col gap-4">
      <ToolPanelGrid>
        <EditorPanel label="ORIGINAL">
          <Textarea
            variant="code"
            aria-label="Original"
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder={SAMPLE_ORIGINAL}
            className="min-h-[220px] rounded-none border-0 focus-visible:ring-0"
            spellCheck={false}
          />
        </EditorPanel>
        <EditorPanel label="MODIFIED">
          <Textarea
            variant="code"
            aria-label="Modified"
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder={SAMPLE_MODIFIED}
            className="min-h-[220px] rounded-none border-0 focus-visible:ring-0"
            spellCheck={false}
          />
        </EditorPanel>
      </ToolPanelGrid>

      <ToolActionBar>
        <Button variant="outline" size="sm" onClick={handleSwap}>
          <ArrowLeftRight className="size-3.5" />
          Swap
        </Button>
        <CopyButton value={unifiedText} label="Copy diff" />
        <Button variant="ghost" size="sm" onClick={handleClear}>
          Clear
        </Button>
      </ToolActionBar>

      {result && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="text-emerald-700 dark:text-emerald-400">+{result.added} added</span>
            <span className="text-destructive">-{result.removed} removed</span>
            {result.simplified && (
              <span>
                Large input — showing a simplified diff (common prefix/suffix trimmed).
              </span>
            )}
            {truncated && (
              <span>
                Showing the first {MAX_RENDER_LINES.toLocaleString()} of{" "}
                {result.lines.length.toLocaleString()} lines.
              </span>
            )}
          </div>

          <div className="overflow-x-auto rounded-lg border border-editor-border bg-editor font-mono text-xs text-editor-foreground">
            {visibleLines.map((line, i) => (
              <div key={i} className={cn("flex", rowClass(line.type))}>
                <span className="w-10 shrink-0 px-2 py-0.5 text-right text-editor-muted select-none">
                  {line.aLine ?? ""}
                </span>
                <span className="w-10 shrink-0 border-r border-editor-border px-2 py-0.5 text-right text-editor-muted select-none">
                  {line.bLine ?? ""}
                </span>
                <span className={cn("w-4 shrink-0 px-1 py-0.5 text-center select-none", markerClass(line.type))}>
                  {marker(line.type)}
                </span>
                <span className="flex-1 px-1 py-0.5 break-all whitespace-pre-wrap">
                  {line.content === "" ? " " : line.content}
                </span>
              </div>
            ))}
            {visibleLines.length === 0 && (
              <div className="p-4 text-center text-editor-muted">No differences.</div>
            )}
          </div>
        </div>
      )}

      {!result && (
        <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Enter text in both panels to see the difference.
        </div>
      )}
    </div>
  );
}
