"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ToolPanel,
  ToolPanelGrid,
  ToolActionBar,
  ToolErrorPanel,
} from "@/components/tools/shared/tool-panels";
import { CopyButton } from "@/components/tools/shared/copy-button";
import { DownloadButton } from "@/components/tools/shared/download-button";
import { ShortcutHint } from "@/components/tools/shared/shortcut-hint";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import type { EncodingResult } from "@/lib/utils/encoding";

interface TextTransformToolProps {
  actionLabel: string;
  transform: (input: string) => EncodingResult;
  inputPlaceholder: string;
  outputPlaceholder: string;
  downloadFilename: string;
  inputId: string;
}

/** Shared shell for the four text-to-text encoding tools — same layout,
 * different pure transform function passed in. */
export function TextTransformTool({
  actionLabel,
  transform,
  inputPlaceholder,
  outputPlaceholder,
  downloadFilename,
  inputId,
}: TextTransformToolProps) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<EncodingResult | null>(null);

  function handleRun() {
    setResult(transform(input));
  }

  function handleClear() {
    setInput("");
    setResult(null);
  }

  useKeyboardShortcut("Enter", handleRun, { mod: true });

  const output = result?.ok ? (result.output ?? "") : "";
  const errorMessage = result && !result.ok ? (result.error ?? null) : null;

  return (
    <div className="flex flex-col gap-4">
      <ToolPanelGrid>
        <ToolPanel title="Input" htmlFor={inputId}>
          <Textarea
            id={inputId}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={inputPlaceholder}
            className="min-h-[280px] font-mono text-sm"
            spellCheck={false}
          />
        </ToolPanel>
        <ToolPanel title="Output">
          {errorMessage ? (
            <ToolErrorPanel>{errorMessage}</ToolErrorPanel>
          ) : (
            <Textarea
              value={output}
              readOnly
              placeholder={outputPlaceholder}
              className="min-h-[280px] font-mono text-sm"
              spellCheck={false}
            />
          )}
        </ToolPanel>
      </ToolPanelGrid>

      <ToolActionBar>
        <Button size="sm" onClick={handleRun}>
          {actionLabel}
          <ShortcutHint>⌘⏎</ShortcutHint>
        </Button>
        <CopyButton value={output} />
        <DownloadButton value={output} filename={downloadFilename} />
        <Button variant="ghost" size="sm" onClick={handleClear}>
          Clear
        </Button>
      </ToolActionBar>
    </div>
  );
}
