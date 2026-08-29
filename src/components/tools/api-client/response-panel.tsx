"use client";

import { useMemo } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "@/components/tools/shared/copy-button";
import { DownloadButton } from "@/components/tools/shared/download-button";
import { JsonTreeView } from "@/components/tools/api-client/json-tree-view";
import { httpStatuses } from "@/lib/utils/http-status";
import { formatBytes, formatDuration, type ProxyResult } from "@/lib/utils/api-client";

function statusClass(status: number): string {
  if (status >= 200 && status < 300)
    return "text-emerald-700 dark:text-emerald-400 border-emerald-600/30 bg-emerald-600/5";
  if (status >= 300 && status < 400)
    return "text-blue-700 dark:text-blue-400 border-blue-600/30 bg-blue-600/5";
  if (status >= 400 && status < 500)
    return "text-amber-700 dark:text-amber-400 border-amber-600/30 bg-amber-600/5";
  return "text-destructive border-destructive/30 bg-destructive/5";
}

interface ResponsePanelProps {
  result: ProxyResult | null;
  loading: boolean;
}

export function ResponsePanel({ result, loading }: ResponsePanelProps) {
  const parsedJson = useMemo(() => {
    if (!result || !result.ok || result.body.trim() === "") return undefined;
    try {
      return { value: JSON.parse(result.body) as unknown };
    } catch {
      return undefined;
    }
  }, [result]);

  if (loading) {
    return (
      <div className="flex h-full min-h-[160px] flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
        Sending request…
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex h-full min-h-[160px] items-center justify-center rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        Send a request to see the response.
      </div>
    );
  }

  if (!result.ok) {
    return (
      <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" />
        <div>
          <div className="font-medium">Request failed</div>
          <p>{result.error}</p>
        </div>
      </div>
    );
  }

  const statusMeta = httpStatuses.find((s) => s.code === result.status);
  const filenameExt = parsedJson ? "json" : "txt";
  const prettyBody = parsedJson ? JSON.stringify(parsedJson.value, null, 2) : result.body;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`rounded-lg border px-2.5 py-1 font-mono text-sm font-semibold ${statusClass(result.status)}`}
        >
          {result.status} {result.statusText}
        </span>
        <span className="text-sm text-muted-foreground">{formatDuration(result.durationMs)}</span>
        <span className="text-sm text-muted-foreground">{formatBytes(result.sizeBytes)}</span>
        {statusMeta && (
          <span className="text-sm text-muted-foreground">— {statusMeta.meaning}</span>
        )}
      </div>

      {result.truncated && (
        <p className="text-xs text-amber-700 dark:text-amber-400">
          Response body was truncated at 5MB.
        </p>
      )}

      <Tabs defaultValue="body">
        <TabsList aria-label="Response">
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="headers">
            Headers ({Object.keys(result.headers).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="body" className="flex flex-col gap-2 pt-3">
          <div className="flex items-center gap-2">
            <CopyButton value={prettyBody} label="Copy response" />
            <DownloadButton
              value={prettyBody}
              filename={`response.${filenameExt}`}
              label="Download"
            />
          </div>
          <div className="rounded-lg border border-border p-3">
            {result.body.trim() === "" ? (
              <p className="text-sm text-muted-foreground">Empty response body.</p>
            ) : parsedJson ? (
              <JsonTreeView data={parsedJson.value} />
            ) : (
              <pre className="font-mono text-sm break-words whitespace-pre-wrap">
                {result.body}
              </pre>
            )}
          </div>
        </TabsContent>

        <TabsContent value="headers" className="pt-3">
          <div className="rounded-lg border border-border">
            {Object.entries(result.headers).length === 0 ? (
              <p className="p-3 text-sm text-muted-foreground">No response headers.</p>
            ) : (
              Object.entries(result.headers).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-start justify-between gap-4 border-b border-border/60 px-3 py-2 text-sm last:border-0"
                >
                  <span className="font-mono text-muted-foreground">{key}</span>
                  <span className="text-right font-mono break-all">{value}</span>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
