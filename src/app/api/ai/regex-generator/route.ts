import { NextResponse } from "next/server";
import { callAiTool } from "@/lib/server/ai-client";
import { checkAiRequest } from "@/lib/server/ai-route-guard";
import type { RegexGenerationResult } from "@/lib/utils/ai-client";

export const runtime = "nodejs";

const MAX_LENGTH = 500;

const SYSTEM_PROMPT =
  "You are a senior developer writing a JavaScript-compatible regular expression for a described pattern. Provide realistic example matches and non-matches that actually exercise the edge cases of the pattern you wrote.";

const SCHEMA = {
  type: "object",
  properties: {
    regex: { type: "string", description: "The regex pattern, without delimiters." },
    flags: { type: "string", description: "Suggested flags, e.g. 'gi'. Empty string if none needed." },
    explanation: { type: "string" },
    exampleMatches: { type: "array", items: { type: "string" } },
    exampleNonMatches: { type: "array", items: { type: "string" } },
  },
  required: ["regex", "flags", "explanation", "exampleMatches", "exampleNonMatches"],
  additionalProperties: false,
};

export async function POST(request: Request) {
  const guardError = checkAiRequest(request);
  if (guardError) return guardError;

  let payload: { description?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  const description = typeof payload.description === "string" ? payload.description.trim() : "";
  if (!description) {
    return NextResponse.json({ ok: false, error: "Describe the pattern you need." }, { status: 400 });
  }
  if (description.length > MAX_LENGTH) {
    return NextResponse.json(
      { ok: false, error: `Keep the description under ${MAX_LENGTH} characters.` },
      { status: 400 },
    );
  }

  const result = await callAiTool<RegexGenerationResult>(SYSTEM_PROMPT, description, SCHEMA);
  return NextResponse.json(result, { status: result.ok || result.code === "not_configured" ? 200 : 502 });
}
