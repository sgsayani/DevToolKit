import { NextResponse } from "next/server";
import { callAiTool } from "@/lib/server/ai-client";
import { checkAiRequest } from "@/lib/server/ai-route-guard";
import type { CodeExplanation } from "@/lib/utils/ai-client";

export const runtime = "nodejs";

const MAX_LENGTH = 6000;

const SYSTEM_PROMPT =
  "You are a senior developer explaining a pasted code snippet to another developer who is unfamiliar with it. Be concrete and reference the actual code, not generic programming advice. Only include a complexity analysis when the code has a meaningfully analyzable time/space complexity (e.g. loops, recursion) — omit it for simple linear code.";

const SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string", description: "One or two sentence summary of what the code does." },
    importantSections: {
      type: "array",
      items: {
        type: "object",
        properties: {
          section: { type: "string", description: "Which part of the code, e.g. a function name or line range." },
          explanation: { type: "string" },
        },
        required: ["section", "explanation"],
        additionalProperties: false,
      },
      description: "The most important parts of the code and what they do.",
    },
    stepByStep: {
      type: "array",
      items: { type: "string" },
      description: "Step-by-step walkthrough of the logic, in order.",
    },
    potentialIssues: {
      type: "array",
      items: { type: "string" },
      description: "Bugs, edge cases, or code smells noticed. Empty array if none.",
    },
    complexity: {
      type: "string",
      description: "Time/space complexity, only if meaningfully analyzable — omit otherwise.",
    },
  },
  required: ["summary", "importantSections", "stepByStep", "potentialIssues"],
  additionalProperties: false,
};

export async function POST(request: Request) {
  const guardError = checkAiRequest(request);
  if (guardError) return guardError;

  let payload: { code?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  const code = typeof payload.code === "string" ? payload.code.trim() : "";
  if (!code) {
    return NextResponse.json({ ok: false, error: "Paste some code to explain." }, { status: 400 });
  }
  if (code.length > MAX_LENGTH) {
    return NextResponse.json(
      { ok: false, error: `Keep the input under ${MAX_LENGTH.toLocaleString()} characters.` },
      { status: 400 },
    );
  }

  const result = await callAiTool<CodeExplanation>(SYSTEM_PROMPT, code, SCHEMA);
  return NextResponse.json(result, { status: result.ok || result.code === "not_configured" ? 200 : 502 });
}
