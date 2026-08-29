import { NextResponse } from "next/server";
import { createRateLimiter } from "@/lib/server/rate-limit";
import { getClientKey, isSameOrigin } from "@/lib/server/request-guards";

// Same pattern as ai-route-guard.ts: state-mutating paste routes (create,
// edit, delete) get same-origin + a dedicated rate limit. Read routes
// (view, raw, list-mine) intentionally do NOT use this guard — they're
// meant to be reachable directly (a shared link opened in a new tab sends
// no Origin header at all) and are either public content or already scoped
// to the requester's own owner cookie.
const pasteWriteLimiter = createRateLimiter(10, 60_000);

export function checkPasteWriteRequest(request: Request): NextResponse | null {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { ok: false, error: "Cross-origin requests are not allowed." },
      { status: 403 },
    );
  }
  if (!pasteWriteLimiter.check(getClientKey(request))) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Try again in a minute." },
      { status: 429 },
    );
  }
  return null;
}
