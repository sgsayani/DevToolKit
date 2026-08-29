"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseUrl } from "@/lib/utils/url";

const SAMPLE = "https://example.com:8080/products/search?q=laptop&sort=price&page=2#reviews";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/60 py-2 last:border-0">
      <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      <span className="text-right font-mono text-sm break-all">
        {value || <span className="text-muted-foreground">—</span>}
      </span>
    </div>
  );
}

export function UrlParserTool() {
  const [input, setInput] = useState("");
  const result = useMemo(() => (input.trim() ? parseUrl(input) : null), [input]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="url-parser-input"
          className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
        >
          URL
        </Label>
        <div className="flex gap-2">
          <Input
            id="url-parser-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={SAMPLE}
            className="font-mono text-sm"
            spellCheck={false}
          />
          <Button variant="ghost" size="sm" onClick={() => setInput("")}>
            Clear
          </Button>
        </div>
      </div>

      {result && !result.ok && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {result.error}
        </div>
      )}

      {result?.ok && result.result && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border p-4">
            <InfoRow label="Protocol" value={result.result.protocol} />
            <InfoRow label="Hostname" value={result.result.hostname} />
            <InfoRow label="Port" value={result.result.port || "(default)"} />
            <InfoRow label="Pathname" value={result.result.pathname} />
            <InfoRow label="Hash" value={result.result.hash} />
            <InfoRow label="Origin" value={result.result.origin} />
          </div>
          <div className="rounded-lg border border-border p-4">
            <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Query parameters
            </span>
            {result.result.queryParams.length > 0 ? (
              <div className="mt-2 flex flex-col gap-1.5">
                {result.result.queryParams.map((p, i) => (
                  <div
                    key={`${p.key}-${i}`}
                    className="flex items-baseline justify-between gap-3 rounded-md bg-muted/50 px-2.5 py-1.5 text-sm"
                  >
                    <span className="font-mono text-muted-foreground">{p.key}</span>
                    <span className="text-right font-mono break-all">{p.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">No query parameters.</p>
            )}
          </div>
        </div>
      )}

      {!result && (
        <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Parsed URL details will appear here.
        </div>
      )}
    </div>
  );
}
