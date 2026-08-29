/** Best-effort client identifier for rate limiting — the first hop of
 * X-Forwarded-For behind a reverse proxy, falling back to X-Real-Ip. */
export function getClientKey(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/** Another origin's page can POST here even though it could never read the
 * response (CORS only blocks reading, not sending) — without this check a
 * state-mutating route would be usable blind from any website. Read-only
 * routes meant to be called from outside the app (e.g. a served mock
 * endpoint) should NOT use this check — it's only for routes that mutate
 * server state or proxy requests on the user's behalf. */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // no Origin header — typical of a same-page fetch
  const host = request.headers.get("host");
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
