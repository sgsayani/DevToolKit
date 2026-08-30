"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolPanel, ToolActionBar } from "@/components/tools/shared/tool-panels";
import { AiNotConfiguredNotice } from "@/components/tools/ai/ai-not-configured-notice";
import { AiResultSection } from "@/components/tools/ai/ai-result-section";
import { CodeBlock } from "@/components/tools/shared/code-block";
import { useAiConfigured } from "@/hooks/use-ai-configured";
import { callAiEndpoint, type AiResult, type GitCommandResult } from "@/lib/utils/ai-client";

const MAX_LENGTH = 500;
const SAMPLE = "I accidentally committed to main but haven't pushed yet";

export function GitCommandTool() {
  const configured = useAiConfigured();
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<AiResult<GitCommandResult> | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setResult(null);
    const res = await callAiEndpoint<GitCommandResult>("git-command", { description });
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

      <ToolPanel title="What do you want to do?" htmlFor="git-command-input">
        <Input
          id="git-command-input"
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
          <AiResultSection title="Command" copyValue={result.data.command}>
            <CodeBlock code={result.data.command} language="text" lineNumbers={false} className="rounded-md" />
          </AiResultSection>
          <AiResultSection title="Explanation" copyValue={result.data.explanation}>
            <p className="text-sm">{result.data.explanation}</p>
          </AiResultSection>
          {result.data.isDestructive && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <div>
                <p className="font-medium">This command can lose work or rewrite history.</p>
                {result.data.warning && <p className="mt-1">{result.data.warning}</p>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
