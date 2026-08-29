import { NextResponse } from "next/server";
import { isSafeUrl } from "@/lib/server/ssrf-guard";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { getClientKey, isSameOrigin } from "@/lib/server/request-guards";

// Needs Node's `dns`/`net` for the SSRF guard — not available on Edge.
export const runtime = "nodejs";

const TIMEOUT_MS = 15_000;
const MAX_RESPONSE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_METHODS = new Set(["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"]);

interface ProxyRequestBody {
  method?: string;
  url?: string;
  headers?: Record<string, string>;
  body?: string;
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { ok: false, error: "Cross-origin requests to this proxy are not allowed." },
      { status: 403 },
    );
  }

  if (!checkRateLimit(getClientKey(request))) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Try again in a moment." },
      { status: 429 },
    );
  }

  let payload: ProxyRequestBody;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  const { url, body } = payload;
  const method = payload.method?.toUpperCase();

  if (!method || !ALLOWED_METHODS.has(method)) {
    return NextResponse.json({ ok: false, error: "Unsupported HTTP method." }, { status: 400 });
  }
  if (!url || typeof url !== "string") {
    return NextResponse.json({ ok: false, error: "URL is required." }, { status: 400 });
  }

  const safety = await isSafeUrl(url);
  if (!safety.safe) {
    return NextResponse.json(
      { ok: false, error: safety.reason ?? "This URL is not allowed." },
      { status: 400 },
    );
  }

  const upstreamHeaders = new Headers();
  if (payload.headers && typeof payload.headers === "object") {
    for (const [key, value] of Object.entries(payload.headers)) {
      if (typeof value !== "string" || !key.trim()) continue;
      try {
        upstreamHeaders.set(key, value);
      } catch {
        // Some header names are rejected by the Fetch spec — skip rather
        // than fail the whole request over one bad header.
      }
    }
  }

  const hasBody = body !== undefined && body !== "" && method !== "GET" && method !== "HEAD";

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const startedAt = Date.now();

  try {
    const upstreamResponse = await fetch(url, {
      method,
      headers: upstreamHeaders,
      body: hasBody ? body : undefined,
      redirect: "follow",
      signal: controller.signal,
    });

    const durationMs = Date.now() - startedAt;

    // Read the body ourselves (rather than response.text()) so a huge or
    // slow-streaming response can be capped instead of exhausting memory.
    const reader = upstreamResponse.body?.getReader();
    const chunks: Uint8Array[] = [];
    let receivedBytes = 0;
    let truncated = false;
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (!value) continue;
        if (receivedBytes + value.byteLength > MAX_RESPONSE_BYTES) {
          const remaining = MAX_RESPONSE_BYTES - receivedBytes;
          if (remaining > 0) chunks.push(value.slice(0, remaining));
          receivedBytes = MAX_RESPONSE_BYTES;
          truncated = true;
          reader.cancel().catch(() => {});
          break;
        }
        chunks.push(value);
        receivedBytes += value.byteLength;
      }
    }

    const combined = new Uint8Array(receivedBytes);
    let offset = 0;
    for (const chunk of chunks) {
      combined.set(chunk, offset);
      offset += chunk.byteLength;
    }
    const bodyText = new TextDecoder("utf-8", { fatal: false }).decode(combined);

    const responseHeaders: Record<string, string> = {};
    upstreamResponse.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return NextResponse.json({
      ok: true,
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders,
      body: bodyText,
      durationMs,
      sizeBytes: receivedBytes,
      truncated,
    });
  } catch (err) {
    const durationMs = Date.now() - startedAt;
    const aborted = err instanceof Error && err.name === "AbortError";

    // Never log headers or body — only enough to debug connectivity.
    let safeHost = "";
    try {
      safeHost = new URL(url).host;
    } catch {
      // ignore
    }
    console.error(
      `[proxy] ${method} ${safeHost} failed after ${durationMs}ms (${aborted ? "timeout" : "network error"})`,
    );

    return NextResponse.json(
      {
        ok: false,
        error: aborted
          ? `Request timed out after ${TIMEOUT_MS / 1000}s.`
          : "Network error — the target could not be reached.",
      },
      { status: aborted ? 504 : 502 },
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
