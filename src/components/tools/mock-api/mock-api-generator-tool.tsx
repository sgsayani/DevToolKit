"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToolPanel, ToolActionBar } from "@/components/tools/shared/tool-panels";
import { ResponsePanel } from "@/components/tools/api-client/response-panel";
import { FieldSchemaEditor } from "@/components/tools/mock-api/field-schema-editor";
import { MockPreview } from "@/components/tools/mock-api/mock-preview";
import { MockList } from "@/components/tools/mock-api/mock-list";
import { useMocks } from "@/hooks/use-mocks";
import {
  MAX_DELAY_MS,
  MAX_RECORD_COUNT,
  type MockField,
  type MockResponseShape,
} from "@/lib/utils/mock-data";
import { HTTP_METHODS, type HttpMethod, type ProxyResult } from "@/lib/utils/api-client";
import type { StoredMock } from "@/lib/server/mock-registry";

// Fixed (not crypto.randomUUID()) ids for this static seed data — a
// module-level random value would differ between the server render and
// the client render and churn React's reconciliation keys on hydration.
const DEFAULT_FIELDS: MockField[] = [
  { id: "seed-id", name: "id", type: "integer" },
  { id: "seed-name", name: "name", type: "name" },
  { id: "seed-email", name: "email", type: "email" },
];

export function MockApiGeneratorTool() {
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [path, setPath] = useState("/users");
  const [fields, setFields] = useState<MockField[]>(DEFAULT_FIELDS);
  const [recordCount, setRecordCount] = useState(5);
  const [responseShape, setResponseShape] = useState<MockResponseShape>("array");
  const [status, setStatus] = useState(200);
  const [delayMs, setDelayMs] = useState(0);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  const [testResult, setTestResult] = useState<ProxyResult | null>(null);
  const [testing, setTesting] = useState(false);

  const { mocks, publish, remove } = useMocks();

  async function handlePublish() {
    setPublishing(true);
    setPublishError(null);
    const result = await publish({ method, path, fields, recordCount, responseShape, status, delayMs });
    setPublishing(false);
    if (!result.ok) setPublishError(result.error ?? "Could not publish this mock.");
  }

  async function handleTest(mock: StoredMock) {
    setTesting(true);
    setTestResult(null);
    const url = `/api/mock${mock.path}`;
    const startedAt = performance.now();
    try {
      const res = await fetch(url, { method: mock.method });
      const bodyText = await res.text();
      const durationMs = Math.round(performance.now() - startedAt);
      const headers: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        headers[key] = value;
      });
      setTestResult({
        ok: true,
        status: res.status,
        statusText: res.statusText,
        headers,
        body: bodyText,
        durationMs,
        sizeBytes: new TextEncoder().encode(bodyText).length,
        truncated: false,
      });
    } catch {
      setTestResult({ ok: false, error: "Could not reach the mock endpoint." });
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Select value={method} onValueChange={(v) => setMethod(v as HttpMethod)}>
            <SelectTrigger size="default" className="w-28" aria-label="HTTP method">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {HTTP_METHODS.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="/users or /users/{id}"
            className="flex-1 font-mono text-sm"
            spellCheck={false}
          />
        </div>

        <ToolPanel title="Schema">
          <FieldSchemaEditor fields={fields} onChange={setFields} />
        </ToolPanel>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Records</Label>
            <Input
              type="number"
              min={1}
              max={MAX_RECORD_COUNT}
              value={recordCount}
              disabled={responseShape === "object"}
              onChange={(e) => setRecordCount(Number(e.target.value) || 1)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Shape</Label>
            <Select value={responseShape} onValueChange={(v) => setResponseShape(v as MockResponseShape)}>
              <SelectTrigger size="default" aria-label="Response shape">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="array">Array</SelectItem>
                <SelectItem value="object">Single object</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Status</Label>
            <Input
              type="number"
              min={100}
              max={599}
              value={status}
              onChange={(e) => setStatus(Number(e.target.value) || 200)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Delay (ms)</Label>
            <Input
              type="number"
              min={0}
              max={MAX_DELAY_MS}
              value={delayMs}
              onChange={(e) => setDelayMs(Number(e.target.value) || 0)}
            />
          </div>
        </div>

        <ToolPanel title="Preview">
          <MockPreview fields={fields} recordCount={recordCount} responseShape={responseShape} />
        </ToolPanel>

        <ToolActionBar>
          <Button onClick={handlePublish} disabled={publishing}>
            {publishing ? "Publishing…" : "Publish mock"}
          </Button>
        </ToolActionBar>
        {publishError && <p className="text-sm text-destructive">{publishError}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Published mocks
        </span>
        <MockList mocks={mocks} onDelete={remove} onTest={handleTest} />
      </div>

      {(testing || testResult) && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Test result
          </span>
          <ResponsePanel result={testResult} loading={testing} />
        </div>
      )}
    </div>
  );
}
