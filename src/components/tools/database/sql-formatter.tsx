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
        <ToolPanel title="Input" htmlFor="sql-formatter-input">
          <Textarea
            id="sql-formatter-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={SAMPLE}
            className="min-h-[320px] font-mono text-sm"
            spellCheck={false}
          />
        </ToolPanel>
        <ToolPanel title="Output">
          {result && !result.ok ? (
            <ToolErrorPanel>{result.error}</ToolErrorPanel>
          ) : (
            <Textarea
              value={output}
              readOnly
              placeholder="Formatted SQL will appear here."
              className="min-h-[320px] font-mono text-sm"
              spellCheck={false}
            />
          )}
        </ToolPanel>
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
