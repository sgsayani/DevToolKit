"use client";

import { useMemo, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ToolPanel,
  ToolPanelGrid,
  ToolActionBar,
  ToolErrorPanel,
} from "@/components/tools/shared/tool-panels";
import { CopyButton } from "@/components/tools/shared/copy-button";
import {
  decodeJwt,
  describeExpiry,
  formatClaimTimestamp,
  isStandardTimeClaim,
  type ExpiryState,
} from "@/lib/utils/jwt";

const SAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSBMb3ZlbGFjZSIsImlhdCI6MTUxNjIzOTAyMn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U";

function expiryBadgeClass(state: ExpiryState): string {
  switch (state) {
    case "expired":
      return "border-destructive/30 bg-destructive/5 text-destructive";
    case "active":
      return "border-emerald-600/30 bg-emerald-600/5 text-emerald-700 dark:text-emerald-400";
    case "not-yet-valid":
      return "border-amber-600/30 bg-amber-600/5 text-amber-700 dark:text-amber-400";
    default:
      return "border-border bg-muted/40 text-muted-foreground";
  }
}

function ClaimRow({ claimKey, value }: { claimKey: string; value: unknown }) {
  const formatted = isStandardTimeClaim(claimKey) ? formatClaimTimestamp(value) : null;
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 py-2 last:border-0">
      <span className="font-mono text-xs text-muted-foreground">{claimKey}</span>
      <div className="text-right">
        <div className="font-mono text-sm break-all">
          {typeof value === "string" ? value : JSON.stringify(value)}
        </div>
        {formatted && <div className="text-xs text-muted-foreground">{formatted}</div>}
      </div>
    </div>
  );
}

export function JwtDebuggerTool() {
  const [token, setToken] = useState("");
  const result = useMemo(() => (token.trim() ? decodeJwt(token) : null), [token]);

  const claims =
    result?.ok && result.payload && typeof result.payload === "object"
      ? (result.payload as Record<string, unknown>)
      : null;
  const expiry = claims ? describeExpiry(claims) : null;
  const headerText = result?.ok ? JSON.stringify(result.header, null, 2) : "";
  const payloadText = result?.ok ? JSON.stringify(result.payload, null, 2) : "";

  return (
    <div className="flex flex-col gap-4">
      <ToolPanel title="Token" htmlFor="jwt-input">
        <Textarea
          id="jwt-input"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder={SAMPLE_JWT}
          className="min-h-[100px] font-mono text-xs"
          spellCheck={false}
        />
      </ToolPanel>

      <div className="flex items-start gap-2 rounded-lg border border-amber-600/30 bg-amber-600/5 p-3 text-sm text-amber-800 dark:text-amber-400">
        <ShieldAlert className="mt-0.5 size-4 shrink-0" />
        <p>
          <span className="font-medium">Decoded — not verified.</span> Decoding a JWT does not
          check its signature. Don&rsquo;t trust these claims without verifying the signature
          server-side.
        </p>
      </div>

      <ToolActionBar>
        <Button variant="ghost" size="sm" onClick={() => setToken("")}>
          Clear
        </Button>
      </ToolActionBar>

      {!result && (
        <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Paste a JWT above to decode its header and payload.
        </div>
      )}

      {result && !result.ok && <ToolErrorPanel>{result.error}</ToolErrorPanel>}

      {result?.ok && (
        <>
          {expiry && (
            <div
              className={`inline-flex w-fit items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm ${expiryBadgeClass(expiry.state)}`}
            >
              {expiry.message}
            </div>
          )}

          <ToolPanelGrid>
            <ToolPanel title="Header" action={<CopyButton value={headerText} />}>
              <Textarea
                value={headerText}
                readOnly
                className="min-h-[160px] font-mono text-sm"
                spellCheck={false}
              />
            </ToolPanel>
            <ToolPanel title="Payload" action={<CopyButton value={payloadText} />}>
              <Textarea
                value={payloadText}
                readOnly
                className="min-h-[160px] font-mono text-sm"
                spellCheck={false}
              />
            </ToolPanel>
          </ToolPanelGrid>

          <div className="rounded-lg border border-border p-4">
            <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Claims
            </span>
            <div className="mt-1">
              {claims && Object.entries(claims).length > 0 ? (
                Object.entries(claims).map(([key, value]) => (
                  <ClaimRow key={key} claimKey={key} value={value} />
                ))
              ) : (
                <p className="py-2 text-sm text-muted-foreground">No claims in payload.</p>
              )}
            </div>
          </div>

          <ToolPanel
            title="Signature (raw, unverified)"
            action={<CopyButton value={result.signature ?? ""} />}
          >
            <div className="rounded-lg border border-border bg-muted/30 p-3 font-mono text-xs break-all">
              {result.signature}
            </div>
          </ToolPanel>
        </>
      )}
    </div>
  );
}
