"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolPanelGrid, ToolActionBar, ToolErrorPanel } from "@/components/tools/shared/tool-panels";
import { EditorPanel } from "@/components/tools/shared/editor-panel";
import { CodeBlock } from "@/components/tools/shared/code-block";
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
        <EditorPanel label="INPUT">
          <Textarea
            variant="code"
            aria-label="Input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={SAMPLE}
            className="min-h-[320px] rounded-none border-0 focus-visible:ring-0"
            spellCheck={false}
          />
        </EditorPanel>

        {errorMessage ? (
          <EditorPanel label="OUTPUT">
            <ToolErrorPanel className="min-h-[320px] rounded-none border-0 bg-transparent">
              {errorMessage}
            </ToolErrorPanel>
          </EditorPanel>
        ) : (
          <EditorPanel label="OUTPUT">
            {output ? (
              <CodeBlock code={output} language="json" lineNumbers={false} className="min-h-[320px]" />
            ) : (
              <p className="min-h-[320px] bg-editor px-3 py-2 text-sm text-editor-muted">
                Minified JSON will appear here.
              </p>
            )}
          </EditorPanel>
        )}
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
