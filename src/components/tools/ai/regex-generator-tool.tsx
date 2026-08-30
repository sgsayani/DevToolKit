"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolPanel, ToolActionBar } from "@/components/tools/shared/tool-panels";
import { AiNotConfiguredNotice } from "@/components/tools/ai/ai-not-configured-notice";
import { AiResultSection } from "@/components/tools/ai/ai-result-section";
import { CodeBlock } from "@/components/tools/shared/code-block";
import { useAiConfigured } from "@/hooks/use-ai-configured";
import { callAiEndpoint, type AiResult, type RegexGenerationResult } from "@/lib/utils/ai-client";

const MAX_LENGTH = 500;
const SAMPLE = "A US phone number, optionally with dashes or parentheses";

export function RegexGeneratorTool() {
  const configured = useAiConfigured();
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<AiResult<RegexGenerationResult> | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setResult(null);
    const res = await callAiEndpoint<RegexGenerationResult>("regex-generator", { description });
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

      <ToolPanel title="Describe the pattern you need" htmlFor="regex-generator-input">
        <Input
          id="regex-generator-input"
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
          <AiResultSection
            title="Regex"
            copyValue={`/${result.data.regex}/${result.data.flags}`}
          >
            <CodeBlock
              code={`/${result.data.regex}/${result.data.flags}`}
              language="text"
              lineNumbers={false}
              className="rounded-md"
            />
          </AiResultSection>
          <AiResultSection title="Explanation" copyValue={result.data.explanation}>
            <p className="text-sm">{result.data.explanation}</p>
          </AiResultSection>
          <AiResultSection title="Example matches" copyValue={result.data.exampleMatches.join("\n")}>
            <ul className="flex flex-col gap-1 font-mono text-sm">
              {result.data.exampleMatches.map((m, i) => (
                <li key={i} className="text-emerald-700 dark:text-emerald-400">
                  {m}
                </li>
              ))}
            </ul>
          </AiResultSection>
          <AiResultSection
            title="Example non-matches"
            copyValue={result.data.exampleNonMatches.join("\n")}
          >
            <ul className="flex flex-col gap-1 font-mono text-sm">
              {result.data.exampleNonMatches.map((m, i) => (
                <li key={i} className="text-destructive">
                  {m}
                </li>
              ))}
            </ul>
          </AiResultSection>
        </div>
      )}
    </div>
  );
}
