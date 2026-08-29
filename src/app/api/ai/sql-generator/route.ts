import { NextResponse } from "next/server";
import { callAiTool } from "@/lib/server/ai-client";
import { checkAiRequest } from "@/lib/server/ai-route-guard";
import type { SqlGenerationResult } from "@/lib/utils/ai-client";

export const runtime = "nodejs";

const MAX_LENGTH = 1000;

const SYSTEM_PROMPT =
  "You are a senior developer writing a SQL query for a described request. This query is for the user to review and run themselves in their own database client — you are not executing it and never claim to. If table/column names weren't given, state the assumed schema explicitly in assumptions. If the request is ambiguous enough that the query might not match what the user actually wants, set ambiguityWarning explaining the ambiguity.";

const SCHEMA = {
  type: "object",
  properties: {
    sql: { type: "string" },
    explanation: { type: "string" },
    assumptions: {
      type: "array",
      items: { type: "string" },
      description: "Assumptions made about table/column names or schema. Empty array if the schema was fully specified.",
    },
    ambiguityWarning: {
      type: "string",
      description: "Set only if the request is ambiguous enough the query might not match intent. Omit otherwise.",
    },
  },
  required: ["sql", "explanation", "assumptions"],
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
    return NextResponse.json({ ok: false, error: "Describe the query you need." }, { status: 400 });
  }
  if (description.length > MAX_LENGTH) {
    return NextResponse.json(
      { ok: false, error: `Keep the description under ${MAX_LENGTH} characters.` },
      { status: 400 },
    );
  }

  const result = await callAiTool<SqlGenerationResult>(SYSTEM_PROMPT, description, SCHEMA);
  return NextResponse.json(result, { status: result.ok || result.code === "not_configured" ? 200 : 502 });
}
