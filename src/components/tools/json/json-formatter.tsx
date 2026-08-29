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
        <ToolPanel title="Input" htmlFor="json-formatter-input">
          <Textarea
            id="json-formatter-input"
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
              placeholder="Formatted JSON will appear here."
              className="min-h-[320px] font-mono text-sm"
              spellCheck={false}
            />
          )}
        </ToolPanel>
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
