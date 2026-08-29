import { NextResponse } from "next/server";
import { createRateLimiter } from "@/lib/server/rate-limit";
import { getClientKey, isSameOrigin } from "@/lib/server/request-guards";

// Stricter than the API-testing proxy/mock limiters (30/min) — AI calls cost
// real money per request, so a lower ceiling is warranted.
const aiRateLimiter = createRateLimiter(10, 60_000);

/** Shared guard for every /api/ai/* route: same-origin only (an AI route
 * mutates nothing but still spends the deployer's API budget, so it
 * shouldn't be callable blind from another website) + a stricter rate
 * limit. Returns a response to short-circuit with, or null to proceed. */
export function checkAiRequest(request: Request): NextResponse | null {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { ok: false, error: "Cross-origin requests are not allowed." },
      { status: 403 },
    );
  }
  if (!aiRateLimiter.check(getClientKey(request))) {
    return NextResponse.json(
      { ok: false, error: "Too many AI requests. Try again in a minute." },
      { status: 429 },
    );
  }
  return null;
}
