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
import { minifyJson, formatJsonErrorMessage, type FormatJsonResult } from "@/lib/utils/json";

const SAMPLE = `{
  "id": 1,
  "name": "Ada Lovelace",
  "active": true,
  "roles": ["admin", "editor"]
}`;

export function JsonMinifierTool() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<FormatJsonResult | null>(null);

  function handleMinify() {
    setResult(minifyJson(input));
  }

  function handleClear() {
    setInput("");
    setResult(null);
  }

  useKeyboardShortcut("Enter", handleMinify, { mod: true });

  const output = result?.ok ? (result.output ?? "") : "";
  const errorMessage = result && !result.ok && result.error ? formatJsonErrorMessage(result.error) : null;

  return (
    <div className="flex flex-col gap-4">
      <ToolPanelGrid>
        <ToolPanel title="Input" htmlFor="json-minifier-input">
          <Textarea
            id="json-minifier-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={SAMPLE}
            className="min-h-[320px] font-mono text-sm"
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
              placeholder="Minified JSON will appear here."
              className="min-h-[320px] font-mono text-sm"
              spellCheck={false}
            />
          )}
        </ToolPanel>
      </ToolPanelGrid>

      <ToolActionBar>
        <Button size="sm" onClick={handleMinify}>
          Minify
          <ShortcutHint>⌘⏎</ShortcutHint>
        </Button>
        <CopyButton value={output} />
        <DownloadButton value={output} filename="minified.json" />
        <Button variant="ghost" size="sm" onClick={handleClear}>
          Clear
        </Button>
      </ToolActionBar>
    </div>
  );
}
