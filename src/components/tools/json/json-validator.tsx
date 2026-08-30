"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolActionBar } from "@/components/tools/shared/tool-panels";
import { EditorPanel } from "@/components/tools/shared/editor-panel";
import { ShortcutHint } from "@/components/tools/shared/shortcut-hint";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { validateJson, formatJsonErrorMessage, type ValidateJsonResult } from "@/lib/utils/json";

const SAMPLE = `{"id":1,"name":"Ada Lovelace","active":true,"roles":["admin","editor"]}`;

export function JsonValidatorTool() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ValidateJsonResult | null>(null);

  function handleValidate() {
    setResult(validateJson(input));
  }

  function handleClear() {
    setInput("");
    setResult(null);
  }

  useKeyboardShortcut("Enter", handleValidate, { mod: true });

  return (
    <div className="flex flex-col gap-4">
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

      <ToolActionBar>
        <Button size="sm" onClick={handleValidate}>
          Validate
          <ShortcutHint>⌘⏎</ShortcutHint>
        </Button>
        <Button variant="ghost" size="sm" onClick={handleClear}>
          Clear
        </Button>
      </ToolActionBar>

      {result && (
        <div
          className={
            result.valid
              ? "flex items-start gap-2 rounded-lg border border-emerald-600/30 bg-emerald-600/5 p-3 text-sm text-emerald-700 dark:text-emerald-400"
              : "flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
          }
        >
          {result.valid ? (
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          ) : (
            <XCircle className="mt-0.5 size-4 shrink-0" />
          )}
          <div className="whitespace-pre-wrap">
            {result.valid
              ? "Valid JSON."
              : `Invalid JSON — ${formatJsonErrorMessage(result.error!)}`}
          </div>
        </div>
      )}
    </div>
  );
}
