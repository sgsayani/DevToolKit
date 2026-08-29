"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/tools/shared/copy-button";
import { ToolActionBar } from "@/components/tools/shared/tool-panels";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { generateUuids } from "@/lib/utils/generators";

function UuidRow({ value }: { value: string }) {
  const { copied, copy } = useCopyToClipboard();
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 font-mono text-sm">
      <span className="truncate">{value}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Copy UUID"
        onClick={() => copy(value)}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </Button>
    </div>
  );
}

export function UuidGeneratorTool() {
  // Kept as raw text while typing so clearing the field doesn't snap back
  // to a clamped value mid-edit — it's only clamped when generating.
  const [countInput, setCountInput] = useState("5");
  const [uuids, setUuids] = useState<string[]>([]);

  function handleGenerate() {
    const count = Math.max(1, Math.min(50, Math.floor(Number(countInput)) || 1));
    setCountInput(String(count));
    setUuids(generateUuids(count));
  }

  function handleClear() {
    setUuids([]);
  }

  const allText = uuids.join("\n");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="uuid-count"
            className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
          >
            Count
          </Label>
          <Input
            id="uuid-count"
            type="number"
            min={1}
            max={50}
            value={countInput}
            onChange={(e) => setCountInput(e.target.value)}
            className="w-24"
          />
        </div>
        <Button size="sm" onClick={handleGenerate}>
          Generate
        </Button>
      </div>

      {uuids.length > 0 ? (
        <div className="flex flex-col gap-2">
          {uuids.map((id, i) => (
            <UuidRow key={`${id}-${i}`} value={id} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Generated UUIDs will appear here.
        </div>
      )}

      <ToolActionBar>
        <CopyButton value={allText} label="Copy all" />
        <Button variant="ghost" size="sm" onClick={handleClear}>
          Clear
        </Button>
      </ToolActionBar>
    </div>
  );
}
