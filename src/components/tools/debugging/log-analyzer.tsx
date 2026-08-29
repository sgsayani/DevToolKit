"use client";

import { useMemo, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatBytes } from "@/lib/utils/api-client";
import {
  analyzeLog,
  groupCommonPatterns,
  type LogLevel,
} from "@/lib/utils/log-analyzer";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const MAX_RENDER_LINES = 2000;

const LEVELS: { level: LogLevel; label: string }[] = [
  { level: "error", label: "Error" },
  { level: "warning", label: "Warning" },
  { level: "info", label: "Info" },
  { level: "debug", label: "Debug" },
  { level: "other", label: "Other" },
];

function levelTextClass(level: LogLevel): string {
  switch (level) {
    case "error":
      return "text-destructive";
    case "warning":
      return "text-amber-700 dark:text-amber-400";
    case "info":
      return "text-blue-700 dark:text-blue-400";
    default:
      return "text-muted-foreground";
  }
}

function StatTile({ label, value, className }: { label: string; value: number; className?: string }) {
  return (
    <div className="flex min-w-[92px] flex-col gap-0.5 rounded-lg border border-border px-3 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-lg font-semibold ${className ?? ""}`}>{value.toLocaleString()}</span>
    </div>
  );
}

export function LogAnalyzerTool() {
  const [text, setText] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeLevels, setActiveLevels] = useState<Set<LogLevel>>(
    () => new Set(LEVELS.map((l) => l.level)),
  );
  const [selectedPattern, setSelectedPattern] = useState<Set<number> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analysis = useMemo(() => (text.trim() ? analyzeLog(text) : null), [text]);
  const patternGroups = useMemo(
    () => (analysis ? groupCommonPatterns(analysis.lines) : []),
    [analysis],
  );

  const filteredLines = useMemo(() => {
    if (!analysis) return [];
    const query = search.trim().toLowerCase();
    return analysis.lines.filter((line) => {
      if (!activeLevels.has(line.level)) return false;
      if (selectedPattern && !selectedPattern.has(line.lineNumber)) return false;
      if (query && !line.text.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [analysis, activeLevels, selectedPattern, search]);

  const visibleLines = filteredLines.slice(0, MAX_RENDER_LINES);

  function toggleLevel(level: LogLevel) {
    setActiveLevels((prev) => {
      const next = new Set(prev);
      if (next.has(level)) next.delete(level);
      else next.add(level);
      return next;
    });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      setFileError(`File is larger than ${formatBytes(MAX_FILE_SIZE)} — try a smaller excerpt.`);
      return;
    }
    setFileError(null);
    const reader = new FileReader();
    reader.onload = () => setText(String(reader.result ?? ""));
    reader.onerror = () => setFileError("Could not read this file.");
    reader.readAsText(file);
  }

  function handleClear() {
    setText("");
    setFileError(null);
    setSearch("");
    setSelectedPattern(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Log
        </span>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            "2024-06-01T10:00:00Z INFO  Server started on port 3000\n2024-06-01T10:00:02Z WARN  Slow query took 812ms\n2024-06-01T10:00:05Z ERROR Failed to connect to database: timeout"
          }
          className="min-h-[160px] max-h-[300px] overflow-y-auto font-mono text-sm"
          spellCheck={false}
        />
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".log,.txt,text/plain"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="size-3.5" />
            Upload .log/.txt
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={handleClear}>
            Clear
          </Button>
          <span className="text-xs text-muted-foreground">
            Files are read entirely in your browser and never uploaded anywhere.
          </span>
        </div>
        {fileError && <p className="text-xs text-destructive">{fileError}</p>}
      </div>

      {!analysis ? (
        <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Paste or upload a log to see a summary.
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            <StatTile label="Total lines" value={analysis.totalLines} />
            <StatTile label="Errors" value={analysis.counts.error} className="text-destructive" />
            <StatTile
              label="Warnings"
              value={analysis.counts.warning}
              className="text-amber-700 dark:text-amber-400"
            />
            <StatTile
              label="Info"
              value={analysis.counts.info}
              className="text-blue-700 dark:text-blue-400"
            />
            <StatTile label="Debug" value={analysis.counts.debug} />
            <StatTile label="Other" value={analysis.counts.other} />
          </div>

          {patternGroups.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Common error &amp; warning patterns
              </span>
              <div className="flex flex-col gap-1">
                {patternGroups.map((group) => (
                  <button
                    key={group.pattern}
                    type="button"
                    onClick={() =>
                      setSelectedPattern((prev) =>
                        prev === null ? new Set(group.lineNumbers) : null,
                      )
                    }
                    className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-1.5 text-left text-sm hover:bg-muted/50"
                  >
                    <span className="truncate font-mono text-xs text-muted-foreground">
                      {group.pattern}
                    </span>
                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                      {group.count}×
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search lines..."
              className="max-w-xs"
            />
            {LEVELS.map(({ level, label }) => (
              <button
                key={level}
                type="button"
                onClick={() => toggleLevel(level)}
                className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                  activeLevels.has(level)
                    ? "border-border bg-muted text-foreground"
                    : "border-border/60 text-muted-foreground hover:bg-muted/40"
                }`}
              >
                {label}
              </button>
            ))}
            {selectedPattern && (
              <button
                type="button"
                onClick={() => setSelectedPattern(null)}
                className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted/40"
              >
                Clear pattern filter ×
              </button>
            )}
          </div>

          <div className="rounded-lg border border-border">
            {visibleLines.length === 0 ? (
              <p className="p-4 text-center text-sm text-muted-foreground">
                No lines match the current filters.
              </p>
            ) : (
              <div className="max-h-[420px] overflow-y-auto font-mono text-xs">
                {visibleLines.map((line) => (
                  <div
                    key={line.lineNumber}
                    className="flex gap-3 border-b border-border/60 px-3 py-1 last:border-0"
                  >
                    <span className="shrink-0 text-muted-foreground select-none">
                      {line.lineNumber}
                    </span>
                    <span className={`whitespace-pre-wrap ${levelTextClass(line.level)}`}>
                      {line.text || " "}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {filteredLines.length > MAX_RENDER_LINES && (
            <p className="text-xs text-muted-foreground">
              Showing the first {MAX_RENDER_LINES.toLocaleString()} of{" "}
              {filteredLines.length.toLocaleString()} matching lines.
            </p>
          )}
        </>
      )}
    </div>
  );
}
