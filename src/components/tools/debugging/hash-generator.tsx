"use client";

import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToolPanel, ToolActionBar } from "@/components/tools/shared/tool-panels";
import { CopyButton } from "@/components/tools/shared/copy-button";
import { computeHash, HASH_ALGORITHMS, type HashAlgorithm, type HashResult } from "@/lib/utils/hash";

export function HashGeneratorTool() {
  const [text, setText] = useState("");
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>("SHA-256");
  const [result, setResult] = useState<HashResult | null>(null);

  useEffect(() => {
    // Nothing to compute for empty input — `effectiveResult` below already
    // treats empty text as "no result" without needing state here.
    if (text === "") return;
    let ignore = false;
    computeHash(text, algorithm).then((r) => {
      if (!ignore) setResult(r);
    });
    return () => {
      ignore = true;
    };
  }, [text, algorithm]);

  // Derived rather than reset via a synchronous setState in the effect
  // above: guarantees stale results never render while text is empty.
  const effectiveResult = text === "" ? null : result;

  return (
    <div className="flex flex-col gap-4">
      <ToolPanel title="Text" htmlFor="hash-input">
        <Textarea
          id="hash-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="The quick brown fox jumps over the lazy dog"
          className="min-h-[140px] font-mono text-sm"
          spellCheck={false}
        />
      </ToolPanel>

      <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" />
        <p>
          Hashing is one-way and is not encryption — it can&rsquo;t be reversed to recover the
          original text.
        </p>
      </div>

      <ToolActionBar>
        <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as HashAlgorithm)}>
          <SelectTrigger size="default" className="w-32" aria-label="Algorithm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {HASH_ALGORITHMS.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <CopyButton value={effectiveResult?.ok ? (effectiveResult.hex ?? "") : ""} />
        <Button variant="ghost" size="sm" onClick={() => setText("")}>
          Clear
        </Button>
      </ToolActionBar>

      {effectiveResult && !effectiveResult.ok && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {effectiveResult.error}
        </div>
      )}

      <ToolPanel title={`${algorithm} hash`}>
        <div className="min-h-[60px] rounded-lg border border-border bg-muted/20 p-3 font-mono text-sm break-all">
          {effectiveResult?.ok ? (
            effectiveResult.hex
          ) : (
            <span className="text-muted-foreground">Hash will appear here.</span>
          )}
        </div>
      </ToolPanel>
    </div>
  );
}
