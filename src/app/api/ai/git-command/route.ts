import { NextResponse } from "next/server";
import { callAiTool } from "@/lib/server/ai-client";
import { checkAiRequest } from "@/lib/server/ai-route-guard";
import type { GitCommandResult } from "@/lib/utils/ai-client";

export const runtime = "nodejs";

const MAX_LENGTH = 500;

const SYSTEM_PROMPT =
  "You are a senior developer helping with Git. Given a description of what someone wants to do, produce the exact git command(s) to run. Always set isDestructive to true for anything that rewrites history, force-pushes, discards uncommitted work, or deletes branches/tags — and explain specifically what could be lost and how to avoid it in that case.";

const SCHEMA = {
  type: "object",
  properties: {
    command: { type: "string", description: "The exact git command(s) to run, one per line." },
    explanation: { type: "string", description: "What this command does and why, in context of the request." },
    isDestructive: {
      type: "boolean",
      description: "True if this can lose commits/work or rewrite shared history.",
    },
    warning: {
      type: "string",
      description: "A specific warning when isDestructive is true. Omit when not destructive.",
    },
  },
  required: ["command", "explanation", "isDestructive"],
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
    return NextResponse.json({ ok: false, error: "Describe what you want to do." }, { status: 400 });
  }
  if (description.length > MAX_LENGTH) {
    return NextResponse.json(
      { ok: false, error: `Keep the description under ${MAX_LENGTH} characters.` },
      { status: 400 },
    );
  }

  const result = await callAiTool<GitCommandResult>(SYSTEM_PROMPT, description, SCHEMA);
  return NextResponse.json(result, { status: result.ok || result.code === "not_configured" ? 200 : 502 });
}
