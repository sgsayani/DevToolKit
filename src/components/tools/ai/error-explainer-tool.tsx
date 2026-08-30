"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolActionBar } from "@/components/tools/shared/tool-panels";
import { EditorPanel } from "@/components/tools/shared/editor-panel";
import { CodeBlock } from "@/components/tools/shared/code-block";
import { AiNotConfiguredNotice } from "@/components/tools/ai/ai-not-configured-notice";
import { AiResultSection } from "@/components/tools/ai/ai-result-section";
import { useAiConfigured } from "@/hooks/use-ai-configured";
import { callAiEndpoint, type AiResult, type ErrorExplanation } from "@/lib/utils/ai-client";

const MAX_LENGTH = 6000;
const SAMPLE =
  "TypeError: Cannot read properties of undefined (reading 'map')\n    at UserList (UserList.jsx:12:34)\n    at renderWithHooks (react-dom.development.js:16305:18)";

export function ErrorExplainerTool() {
  const configured = useAiConfigured();
  const [errorText, setErrorText] = useState("");
  const [result, setResult] = useState<AiResult<ErrorExplanation> | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleExplain() {
    setLoading(true);
    setResult(null);
    const res = await callAiEndpoint<ErrorExplanation>("error-explainer", { errorText });
    setLoading(false);
    setResult(res);
  }

  function handleClear() {
    setErrorText("");
    setResult(null);
  }

  return (
    <div className="flex flex-col gap-4">
      {configured === false && <AiNotConfiguredNotice />}

      <EditorPanel label="ERROR OR STACK TRACE">
        <Textarea
          variant="code"
          aria-label="Error or stack trace"
          value={errorText}
          onChange={(e) => setErrorText(e.target.value)}
          placeholder={SAMPLE}
          className="min-h-[160px] rounded-none border-0 focus-visible:ring-0"
          spellCheck={false}
          maxLength={MAX_LENGTH}
        />
      </EditorPanel>

      <ToolActionBar>
        <Button onClick={handleExplain} disabled={loading || configured === false || !errorText.trim()}>
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
          <AiResultSection title="What happened" copyValue={result.data.whatHappened}>
            <p className="text-sm">{result.data.whatHappened}</p>
          </AiResultSection>
          <AiResultSection title="Likely cause" copyValue={result.data.likelyCause}>
            <p className="text-sm">{result.data.likelyCause}</p>
          </AiResultSection>
          <AiResultSection title="Possible fixes" copyValue={result.data.possibleFixes.join("\n")}>
            <ul className="list-disc space-y-1 pl-4 text-sm">
              {result.data.possibleFixes.map((fix, i) => (
                <li key={i}>{fix}</li>
              ))}
            </ul>
          </AiResultSection>
          <AiResultSection title="Example solution" copyValue={result.data.exampleSolution}>
            <CodeBlock code={result.data.exampleSolution} language="text" lineNumbers={false} className="rounded-md" />
          </AiResultSection>
        </div>
      )}
    </div>
  );
}
