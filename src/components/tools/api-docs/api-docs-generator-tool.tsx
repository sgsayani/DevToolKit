"use client";

import { useState } from "react";
import { CopyButton } from "@/components/tools/shared/copy-button";
import { DownloadButton } from "@/components/tools/shared/download-button";
import { EndpointList } from "@/components/tools/api-docs/endpoint-list";
import { EndpointEditor } from "@/components/tools/api-docs/endpoint-editor";
import { DocPreview } from "@/components/tools/api-docs/doc-preview";
import { toMarkdown, toHtml, toOpenApi, type ApiEndpointDef } from "@/lib/utils/api-docs";

export function ApiDocsGeneratorTool() {
  const [endpoints, setEndpoints] = useState<ApiEndpointDef[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = endpoints.find((e) => e.id === selectedId) ?? null;

  function updateSelected(next: ApiEndpointDef) {
    setEndpoints((prev) => prev.map((e) => (e.id === next.id ? next : e)));
  }

  function handleEndpointsChange(next: ApiEndpointDef[]) {
    setEndpoints(next);
    if (!next.some((e) => e.id === selectedId)) {
      setSelectedId(next[0]?.id ?? null);
    }
  }

  const markdown = toMarkdown(endpoints);
  const html = toHtml(endpoints);
  const openApiJson = JSON.stringify(toOpenApi(endpoints), null, 2);

  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs text-muted-foreground">
        OpenAPI export covers common cases — path/query/header parameters, JSON request and
        response bodies — not every OpenAPI feature. Use <code className="font-mono">{"{param}"}</code>{" "}
        in the path for path parameters.
      </p>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <aside className="lg:w-56 lg:shrink-0 lg:border-r lg:border-border lg:pr-4">
          <EndpointList
            endpoints={endpoints}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onChange={handleEndpointsChange}
          />
        </aside>
        <div className="min-w-0 flex-1">
          {selected ? (
            <EndpointEditor endpoint={selected} onChange={updateSelected} />
          ) : (
            <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Add an endpoint to get started.
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Preview
        </span>
        <div className="rounded-lg border border-border p-4">
          <DocPreview endpoints={endpoints} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Export
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <CopyButton value={markdown} label="Copy Markdown" />
          <DownloadButton value={markdown} filename="api-docs.md" label="Download .md" />
          <CopyButton value={html} label="Copy HTML" />
          <DownloadButton value={html} filename="api-docs.html" label="Download .html" />
          <CopyButton value={openApiJson} label="Copy OpenAPI" />
          <DownloadButton value={openApiJson} filename="openapi.json" label="Download OpenAPI" />
        </div>
      </div>
    </div>
  );
}
