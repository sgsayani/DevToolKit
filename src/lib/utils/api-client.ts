import { base64Encode } from "@/lib/utils/encoding";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export const HTTP_METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

export type BodyType = "none" | "json" | "text";

export const METHOD_BADGE_CLASS: Record<HttpMethod, string> = {
  GET: "text-blue-700 dark:text-blue-400",
  POST: "text-emerald-700 dark:text-emerald-400",
  PUT: "text-amber-700 dark:text-amber-400",
  PATCH: "text-amber-700 dark:text-amber-400",
  DELETE: "text-destructive",
};

export interface KeyValueRow {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export function createEmptyRow(): KeyValueRow {
  return { id: crypto.randomUUID(), key: "", value: "", enabled: true };
}

export function rowsToRecord(rows: KeyValueRow[]): Record<string, string> {
  const record: Record<string, string> = {};
  for (const row of rows) {
    if (row.enabled && row.key.trim() !== "") record[row.key] = row.value;
  }
  return record;
}

export function buildUrlWithParams(baseUrl: string, params: KeyValueRow[]): string {
  const active = params.filter((p) => p.enabled && p.key.trim() !== "");
  if (active.length === 0) return baseUrl;
  try {
    const url = new URL(baseUrl);
    for (const p of active) url.searchParams.append(p.key, p.value);
    return url.toString();
  } catch {
    // baseUrl may be incomplete while the user is still typing it.
    const query = active
      .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
      .join("&");
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}${query}`;
  }
}

export type AuthType = "none" | "basic" | "bearer";

export interface AuthConfig {
  type: AuthType;
  username: string;
  password: string;
  token: string;
}

export const DEFAULT_AUTH: AuthConfig = { type: "none", username: "", password: "", token: "" };

/** Builds the `Authorization` header value for the selected auth mode.
 * Basic auth reuses the existing UTF-8-safe base64 encoder — HTTP Basic
 * auth uses the same base64 alphabet. */
export function buildAuthHeader(auth: AuthConfig): string | null {
  if (auth.type === "basic" && (auth.username || auth.password)) {
    const encoded = base64Encode(`${auth.username}:${auth.password}`);
    return encoded.ok && encoded.output ? `Basic ${encoded.output}` : null;
  }
  if (auth.type === "bearer" && auth.token.trim()) {
    return `Bearer ${auth.token.trim()}`;
  }
  return null;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

const SENSITIVE_HEADER_KEYS = new Set([
  "authorization",
  "cookie",
  "x-api-key",
  "proxy-authorization",
]);

/** Keeps header names but blanks values for known-sensitive headers before
 * they're written to localStorage history. */
export function redactHeadersForHistory(rows: KeyValueRow[]): KeyValueRow[] {
  return rows.map((row) =>
    SENSITIVE_HEADER_KEYS.has(row.key.trim().toLowerCase()) ? { ...row, value: "" } : row,
  );
}

const SENSITIVE_BODY_KEYS = new Set([
  "password",
  "secret",
  "token",
  "apikey",
  "api_key",
  "authorization",
]);

function redactJsonValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redactJsonValue);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      out[key] = SENSITIVE_BODY_KEYS.has(key.toLowerCase()) ? "***redacted***" : redactJsonValue(val);
    }
    return out;
  }
  return value;
}

/** Best-effort: walks a JSON body and blanks values for common secret-shaped
 * keys before it's written to history. Falls back to storing as-is if the
 * body isn't valid JSON (structural redaction isn't possible then). */
export function redactJsonBodyForHistory(bodyText: string): string {
  try {
    const parsed = JSON.parse(bodyText);
    return JSON.stringify(redactJsonValue(parsed));
  } catch {
    return bodyText;
  }
}

export interface ProxySuccessResult {
  ok: true;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  durationMs: number;
  sizeBytes: number;
  truncated: boolean;
}

export interface ProxyErrorResult {
  ok: false;
  error: string;
}

export type ProxyResult = ProxySuccessResult | ProxyErrorResult;

export interface ProxyRequestPayload {
  method: HttpMethod;
  url: string;
  headers: Record<string, string>;
  body?: string;
}

export async function sendProxyRequest(payload: ProxyRequestPayload): Promise<ProxyResult> {
  try {
    const res = await fetch("/api/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as ProxyResult;
    return data;
  } catch {
    return { ok: false, error: "Could not reach the DevKit proxy. Check your connection." };
  }
}
