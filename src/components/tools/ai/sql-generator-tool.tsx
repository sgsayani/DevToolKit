"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolPanel, ToolActionBar } from "@/components/tools/shared/tool-panels";
import { AiNotConfiguredNotice } from "@/components/tools/ai/ai-not-configured-notice";
import { AiResultSection } from "@/components/tools/ai/ai-result-section";
import { CodeBlock } from "@/components/tools/shared/code-block";
import { useAiConfigured } from "@/hooks/use-ai-configured";
import { callAiEndpoint, type AiResult, type SqlGenerationResult } from "@/lib/utils/ai-client";

const MAX_LENGTH = 1000;
const SAMPLE = "Find the top 5 customers by total order value in the last 30 days";

export function SqlGeneratorTool() {
  const configured = useAiConfigured();
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<AiResult<SqlGenerationResult> | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setResult(null);
    const res = await callAiEndpoint<SqlGenerationResult>("sql-generator", { description });
    setLoading(false);
    setResult(res);
  }

  function handleClear() {
    setDescription("");
    setResult(null);
  }

  return (
    <div className="flex flex-col gap-4">
      {configured === false && <AiNotConfiguredNotice />}

      <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" />
        <p>This only generates SQL text for you to review — it never runs against a database.</p>
      </div>

      <ToolPanel title="Describe the query you need" htmlFor="sql-generator-input">
        <Input
          id="sql-generator-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={SAMPLE}
          maxLength={MAX_LENGTH}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
        />
      </ToolPanel>

      <ToolActionBar>
        <Button onClick={handleGenerate} disabled={loading || configured === false || !description.trim()}>
          {loading ? "Generating…" : "Generate"}
        </Button>
        <Button variant="ghost" size="sm" onClick={handleClear}>
          Clear
        </Button>
      </ToolActionBar>

      {result && !result.ok && result.code !== "not_configured" && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {result.error}
        </div>
      )}

      {result?.ok && result.data && (
        <div className="flex flex-col gap-3">
          <AiResultSection title="SQL" copyValue={result.data.sql}>
            <CodeBlock code={result.data.sql} language="sql" lineNumbers={false} className="rounded-md" />
          </AiResultSection>
          <AiResultSection title="Explanation" copyValue={result.data.explanation}>
            <p className="text-sm">{result.data.explanation}</p>
          </AiResultSection>
          {result.data.assumptions.length > 0 && (
            <AiResultSection title="Assumptions" copyValue={result.data.assumptions.join("\n")}>
              <ul className="list-disc space-y-1 pl-4 text-sm">
                {result.data.assumptions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </AiResultSection>
          )}
          {result.data.ambiguityWarning && (
            <div className="rounded-lg border border-amber-600/30 bg-amber-600/5 p-3 text-sm text-amber-800 dark:text-amber-400">
              <span className="font-medium">Ambiguous request: </span>
              {result.data.ambiguityWarning}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
