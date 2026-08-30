"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolActionBar } from "@/components/tools/shared/tool-panels";
import { EditorPanel } from "@/components/tools/shared/editor-panel";
import { AiNotConfiguredNotice } from "@/components/tools/ai/ai-not-configured-notice";
import { AiResultSection } from "@/components/tools/ai/ai-result-section";
import { useAiConfigured } from "@/hooks/use-ai-configured";
import { callAiEndpoint, type AiResult, type CodeExplanation } from "@/lib/utils/ai-client";

const MAX_LENGTH = 6000;
const SAMPLE = `function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}`;

export function CodeExplainerTool() {
  const configured = useAiConfigured();
  const [code, setCode] = useState("");
  const [result, setResult] = useState<AiResult<CodeExplanation> | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleExplain() {
    setLoading(true);
    setResult(null);
    const res = await callAiEndpoint<CodeExplanation>("code-explainer", { code });
    setLoading(false);
    setResult(res);
  }

  function handleClear() {
    setCode("");
    setResult(null);
  }

  return (
    <div className="flex flex-col gap-4">
      {configured === false && <AiNotConfiguredNotice />}

      <EditorPanel label="CODE">
        <Textarea
          variant="code"
          aria-label="Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={SAMPLE}
          className="min-h-[200px] rounded-none border-0 focus-visible:ring-0"
          spellCheck={false}
          maxLength={MAX_LENGTH}
        />
      </EditorPanel>

      <ToolActionBar>
        <Button onClick={handleExplain} disabled={loading || configured === false || !code.trim()}>
          {loading ? "Explaining…" : "Explain"}
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
          <AiResultSection title="Summary" copyValue={result.data.summary}>
            <p className="text-sm">{result.data.summary}</p>
          </AiResultSection>

          {result.data.importantSections.length > 0 && (
            <AiResultSection
              title="Important sections"
              copyValue={result.data.importantSections
                .map((s) => `${s.section}: ${s.explanation}`)
                .join("\n")}
            >
              <div className="flex flex-col gap-2">
                {result.data.importantSections.map((s, i) => (
                  <div key={i}>
                    <span className="font-mono text-xs font-semibold">{s.section}</span>
                    <p className="text-sm text-muted-foreground">{s.explanation}</p>
                  </div>
                ))}
              </div>
            </AiResultSection>
          )}

          <AiResultSection title="Step by step" copyValue={result.data.stepByStep.join("\n")}>
            <ol className="list-decimal space-y-1 pl-4 text-sm">
              {result.data.stepByStep.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </AiResultSection>

          <AiResultSection
            title="Potential issues"
            copyValue={result.data.potentialIssues.join("\n") || "None noted."}
          >
            {result.data.potentialIssues.length > 0 ? (
              <ul className="list-disc space-y-1 pl-4 text-sm">
                {result.data.potentialIssues.map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">None noted.</p>
            )}
          </AiResultSection>

          {result.data.complexity && (
            <AiResultSection title="Complexity" copyValue={result.data.complexity}>
              <p className="font-mono text-sm">{result.data.complexity}</p>
            </AiResultSection>
          )}
        </div>
      )}
    </div>
  );
}
