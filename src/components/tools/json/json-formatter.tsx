"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToolPanelGrid, ToolActionBar, ToolErrorPanel } from "@/components/tools/shared/tool-panels";
import { EditorPanel } from "@/components/tools/shared/editor-panel";
import { CodeBlock } from "@/components/tools/shared/code-block";
import { CopyButton } from "@/components/tools/shared/copy-button";
import { DownloadButton } from "@/components/tools/shared/download-button";
import { ShortcutHint } from "@/components/tools/shared/shortcut-hint";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import {
  formatJson,
  formatJsonErrorMessage,
  type FormatJsonResult,
  type IndentOption,
} from "@/lib/utils/json";

const SAMPLE = `{"id":1,"name":"Ada Lovelace","active":true,"roles":["admin","editor"],"address":{"city":"London"}}`;

export function JsonFormatterTool() {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState<string>("2");
  const [result, setResult] = useState<FormatJsonResult | null>(null);

  function handleFormat() {
    const indentOption: IndentOption = indent === "tab" ? "tab" : (Number(indent) as 2 | 4);
    setResult(formatJson(input, indentOption));
  }

  function handleClear() {
    setInput("");
    setResult(null);
  }

  useKeyboardShortcut("Enter", handleFormat, { mod: true });

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
              <CodeBlock code={output} language="json" className="min-h-[320px]" />
            ) : (
              <p className="min-h-[320px] bg-editor px-3 py-2 text-sm text-editor-muted">
                Formatted JSON will appear here.
              </p>
            )}
          </EditorPanel>
        )}
      </ToolPanelGrid>

      <ToolActionBar>
        <Select value={indent} onValueChange={setIndent}>
          <SelectTrigger size="sm" className="w-32" aria-label="Indentation">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2 spaces</SelectItem>
            <SelectItem value="4">4 spaces</SelectItem>
            <SelectItem value="tab">Tab</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" onClick={handleFormat}>
          Format
          <ShortcutHint>⌘⏎</ShortcutHint>
        </Button>
        <CopyButton value={output} />
        <DownloadButton value={output} filename="formatted.json" />
        <Button variant="ghost" size="sm" onClick={handleClear}>
          Clear
        </Button>
      </ToolActionBar>
    </div>
  );
}
