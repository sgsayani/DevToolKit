"use client";

import { useCallback, useRef, useState } from "react";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { useRequestHistory, type HistoryEntry } from "@/hooks/use-request-history";
import { RequestEditor } from "@/components/tools/api-client/request-editor";
import { ResponsePanel } from "@/components/tools/api-client/response-panel";
import { HistoryPanel } from "@/components/tools/api-client/history-panel";
import {
  DEFAULT_AUTH,
  buildAuthHeader,
  buildUrlWithParams,
  rowsToRecord,
  sendProxyRequest,
  type AuthConfig,
  type BodyType,
  type HttpMethod,
  type KeyValueRow,
  type ProxyResult,
} from "@/lib/utils/api-client";

const MIN_RESPONSE_HEIGHT = 200;
const MAX_RESPONSE_HEIGHT = 800;
const DEFAULT_RESPONSE_HEIGHT = 420;

export function ApiClientTool() {
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [url, setUrl] = useState("");
  const [params, setParams] = useState<KeyValueRow[]>([]);
  const [headers, setHeaders] = useState<KeyValueRow[]>([]);
  const [bodyType, setBodyType] = useState<BodyType>("none");
  const [bodyText, setBodyText] = useState("");
  const [auth, setAuth] = useState<AuthConfig>(DEFAULT_AUTH);

  const [result, setResult] = useState<ProxyResult | null>(null);
  const [sending, setSending] = useState(false);

  const [responseHeight, setResponseHeight] = useState(DEFAULT_RESPONSE_HEIGHT);
  const dragRef = useRef<{ startY: number; startHeight: number } | null>(null);

  const { entries, addEntry, removeEntry, clearHistory } = useRequestHistory();

  const handleSend = useCallback(async () => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl || sending) return;

    const finalUrl = buildUrlWithParams(trimmedUrl, params);
    let parsed: URL;
    try {
      parsed = new URL(finalUrl);
    } catch {
      setResult({ ok: false, error: "Enter a valid absolute URL, e.g. https://api.example.com" });
      return;
    }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      setResult({ ok: false, error: "Only http and https URLs are supported." });
      return;
    }

    const headerRecord = rowsToRecord(headers);
    const authHeader = buildAuthHeader(auth);
    if (authHeader) headerRecord["Authorization"] = authHeader;
    if (
      bodyType === "json" &&
      !Object.keys(headerRecord).some((k) => k.toLowerCase() === "content-type")
    ) {
      headerRecord["Content-Type"] = "application/json";
    }

    setSending(true);
    setResult(null);

    const response = await sendProxyRequest({
      method,
      url: finalUrl,
      headers: headerRecord,
      body: bodyType === "none" ? undefined : bodyText,
    });

    setSending(false);
    setResult(response);

    addEntry({
      method,
      url: trimmedUrl,
      params,
      headers,
      bodyType,
      body: bodyText,
      authType: auth.type,
      authUsername: auth.username,
      lastStatus: response.ok ? response.status : null,
    });
  }, [url, params, headers, bodyType, bodyText, auth, method, sending, addEntry]);

  useKeyboardShortcut("Enter", () => void handleSend(), { mod: true });

  function handleReopen(entry: HistoryEntry) {
    setMethod(entry.method);
    setUrl(entry.url);
    setParams(entry.params);
    setHeaders(entry.headers);
    setBodyType(entry.bodyType);
    setBodyText(entry.body);
    // Password/token are never persisted to history, so only username
    // carries over — the rest must be re-entered.
    setAuth({ type: entry.authType, username: entry.authUsername, password: "", token: "" });
    setResult(null);
  }

  function handleResizePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    dragRef.current = { startY: e.clientY, startHeight: responseHeight };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function handleResizePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current) return;
    const delta = e.clientY - dragRef.current.startY;
    const next = Math.min(
      MAX_RESPONSE_HEIGHT,
      Math.max(MIN_RESPONSE_HEIGHT, dragRef.current.startHeight + delta),
    );
    setResponseHeight(next);
  }
  function handleResizePointerUp() {
    dragRef.current = null;
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
      <aside className="order-2 lg:order-1 lg:w-56 lg:shrink-0 lg:border-r lg:border-border lg:pr-4">
        <HistoryPanel
          entries={entries}
          onReopen={handleReopen}
          onRemove={removeEntry}
          onClear={clearHistory}
        />
      </aside>

      <div className="order-1 flex min-w-0 flex-1 flex-col gap-3 lg:order-2">
        <RequestEditor
          method={method}
          onMethodChange={setMethod}
          url={url}
          onUrlChange={setUrl}
          params={params}
          onParamsChange={setParams}
          headers={headers}
          onHeadersChange={setHeaders}
          bodyType={bodyType}
          onBodyTypeChange={setBodyType}
          bodyText={bodyText}
          onBodyTextChange={setBodyText}
          auth={auth}
          onAuthChange={setAuth}
          onSend={() => void handleSend()}
          sending={sending}
        />

        <div
          role="separator"
          aria-orientation="horizontal"
          aria-label="Resize response panel"
          className="flex h-3 cursor-row-resize touch-none items-center justify-center"
          onPointerDown={handleResizePointerDown}
          onPointerMove={handleResizePointerMove}
          onPointerUp={handleResizePointerUp}
        >
          <div className="h-1 w-10 rounded-full bg-border" />
        </div>

        <div
          className="overflow-y-auto rounded-lg border border-border p-3"
          style={{ height: responseHeight }}
        >
          <ResponsePanel result={result} loading={sending} />
        </div>
      </div>
    </div>
  );
}
