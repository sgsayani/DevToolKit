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
import { formatSql, type FormatSqlResult } from "@/lib/utils/sql-formatter";

const SAMPLE = `select id, name, email from users where active = true and role = 'admin' order by name;`;

export function SqlFormatterTool() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<FormatSqlResult | null>(null);

  function handleFormat() {
    setResult(formatSql(input));
  }

  function handleClear() {
    setInput("");
    setResult(null);
  }

  useKeyboardShortcut("Enter", handleFormat, { mod: true });

  const output = result?.ok ? (result.output ?? "") : "";

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-muted-foreground">
        Formats common SQL (SELECT/INSERT/UPDATE/DELETE, JOINs, WHERE, GROUP BY/ORDER BY,
        subqueries). It&rsquo;s a line-break formatter, not a full parser — it doesn&rsquo;t
        validate syntax or support every database&rsquo;s dialect-specific extensions.
      </p>

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

        {result && !result.ok ? (
          <EditorPanel label="OUTPUT">
            <ToolErrorPanel className="min-h-[320px] rounded-none border-0 bg-transparent">
              {result.error}
            </ToolErrorPanel>
          </EditorPanel>
        ) : (
          <EditorPanel label="OUTPUT">
            {output ? (
              <CodeBlock code={output} language="sql" className="min-h-[320px]" />
            ) : (
              <p className="min-h-[320px] bg-editor px-3 py-2 text-sm text-editor-muted">
                Formatted SQL will appear here.
              </p>
            )}
          </EditorPanel>
        )}
      </ToolPanelGrid>

      <ToolActionBar>
        <Button size="sm" onClick={handleFormat}>
          Format
          <ShortcutHint>⌘⏎</ShortcutHint>
        </Button>
        <CopyButton value={output} />
        <DownloadButton value={output} filename="formatted.sql" />
        <Button variant="ghost" size="sm" onClick={handleClear}>
          Clear
        </Button>
      </ToolActionBar>
    </div>
  );
}
