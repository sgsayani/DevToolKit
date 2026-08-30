"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToolActionBar, ToolErrorPanel } from "@/components/tools/shared/tool-panels";
import { EditorPanel } from "@/components/tools/shared/editor-panel";
import { CopyButton } from "@/components/tools/shared/copy-button";
import { runRegex, COMMON_PATTERNS, type RegexMatch } from "@/lib/utils/regex";

const SAMPLE_TEXT =
  "Contact: ada@example.com or grace@example.org\nVisit https://example.com/docs for more.";

function renderHighlighted(text: string, matches: RegexMatch[]): ReactNode[] {
  if (matches.length === 0) return [text];
  const nodes: ReactNode[] = [];
  let cursor = 0;
  matches.forEach((m, i) => {
    if (m.index > cursor) nodes.push(text.slice(cursor, m.index));
    nodes.push(
      <mark key={i} className="rounded bg-amber-400/30 px-0.5 text-editor-foreground">
        {m.match}
      </mark>,
    );
    cursor = Math.max(cursor, m.index + m.match.length);
  });
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

export function RegexTesterTool() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testText, setTestText] = useState("");

  const result = useMemo(() => runRegex(pattern, flags, testText), [pattern, flags, testText]);
  const matches = result.ok ? (result.matches ?? []) : [];
  const matchesText = matches.map((m) => m.match).join("\n");

  function handlePickCommon(label: string) {
    const preset = COMMON_PATTERNS.find((p) => p.label === label);
    if (!preset) return;
    setPattern(preset.pattern);
    setFlags(preset.flags);
  }

  function handleClear() {
    setPattern("");
    setFlags("g");
    setTestText("");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto]">
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="regex-pattern"
            className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
          >
            Pattern
          </Label>
          <Input
            id="regex-pattern"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="[a-z]+@[a-z]+\.[a-z]+"
            className="font-mono text-sm"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="regex-flags"
            className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
          >
            Flags
          </Label>
          <Input
            id="regex-flags"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="gi"
            className="w-20 font-mono text-sm"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Examples
          </Label>
          <Select onValueChange={handlePickCommon}>
            <SelectTrigger size="default" className="w-44">
              <SelectValue placeholder="Common patterns" />
            </SelectTrigger>
            <SelectContent>
              {COMMON_PATTERNS.map((p) => (
                <SelectItem key={p.label} value={p.label}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <EditorPanel label="TEST TEXT">
        <Textarea
          variant="code"
          aria-label="Test text"
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          placeholder={SAMPLE_TEXT}
          className="min-h-[140px] rounded-none border-0 focus-visible:ring-0"
          spellCheck={false}
        />
      </EditorPanel>

      {!result.ok && <ToolErrorPanel>{result.error}</ToolErrorPanel>}

      {result.ok && (
        <>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {matches.length} match{matches.length === 1 ? "" : "es"}
            </span>
            <CopyButton value={matchesText} label="Copy matches" />
          </div>

          <div className="min-h-[80px] rounded-lg border border-editor-border bg-editor p-3 font-mono text-sm break-words whitespace-pre-wrap text-editor-foreground">
            {testText ? (
              renderHighlighted(testText, matches)
            ) : (
              <span className="text-editor-muted">No test text yet.</span>
            )}
          </div>

          {matches.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Matches
              </span>
              {matches.map((m, i) => (
                <div key={i} className="rounded-lg border border-border p-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono break-all">
                      {m.match === "" ? "(empty match)" : m.match}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">at {m.index}</span>
                  </div>
                  {m.groups.length > 0 && (
                    <div className="mt-2 flex flex-col gap-1 border-t border-border/60 pt-2">
                      {m.groups.map((g, gi) => (
                        <div key={gi} className="flex items-center justify-between gap-3 text-xs">
                          <span className="text-muted-foreground">Group {g.name}</span>
                          <span className="font-mono break-all">
                            {g.value === undefined ? (
                              <span className="text-muted-foreground">(no match)</span>
                            ) : (
                              g.value
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <ToolActionBar>
        <Button variant="ghost" size="sm" onClick={handleClear}>
          Clear
        </Button>
      </ToolActionBar>
    </div>
  );
}
