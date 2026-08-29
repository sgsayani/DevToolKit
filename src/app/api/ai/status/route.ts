import { NextResponse } from "next/server";
import { isAiConfigured } from "@/lib/server/ai-client";

export const runtime = "nodejs";

/** Lets the client show a "not configured" notice before the user types
 * anything, instead of after a wasted request. */
export async function GET() {
  return NextResponse.json({ configured: isAiConfigured() });
}
