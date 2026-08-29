import { NextResponse } from "next/server";
import { callAiTool } from "@/lib/server/ai-client";
import { checkAiRequest } from "@/lib/server/ai-route-guard";
import type { ErrorExplanation } from "@/lib/utils/ai-client";

export const runtime = "nodejs";

const MAX_LENGTH = 6000;

const SYSTEM_PROMPT =
  "You are a senior developer explaining an error message or stack trace to another developer. Be concrete and specific to the text given — don't give generic advice. If the language/framework is identifiable from the error, name it.";

const SCHEMA = {
  type: "object",
  properties: {
    whatHappened: { type: "string", description: "Plain-language summary of what the error means." },
    likelyCause: { type: "string", description: "The most likely root cause." },
    possibleFixes: {
      type: "array",
      items: { type: "string" },
      description: "Concrete steps to fix it, most likely first.",
    },
    exampleSolution: {
      type: "string",
      description: "A short example fix — a corrected code snippet or command.",
    },
  },
  required: ["whatHappened", "likelyCause", "possibleFixes", "exampleSolution"],
  additionalProperties: false,
};

export async function POST(request: Request) {
  const guardError = checkAiRequest(request);
  if (guardError) return guardError;

  let payload: { errorText?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  const errorText = typeof payload.errorText === "string" ? payload.errorText.trim() : "";
  if (!errorText) {
    return NextResponse.json({ ok: false, error: "Paste an error or stack trace." }, { status: 400 });
  }
  if (errorText.length > MAX_LENGTH) {
    return NextResponse.json(
      { ok: false, error: `Keep the input under ${MAX_LENGTH.toLocaleString()} characters.` },
      { status: 400 },
    );
  }

  const result = await callAiTool<ErrorExplanation>(SYSTEM_PROMPT, errorText, SCHEMA);
  return NextResponse.json(result, { status: result.ok || result.code === "not_configured" ? 200 : 502 });
}
