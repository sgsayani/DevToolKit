import { GoogleGenAI, ApiError } from "@google/genai";

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const MAX_OUTPUT_TOKENS = 4096;

export const NOT_CONFIGURED_MESSAGE =
  "AI features need a GEMINI_API_KEY environment variable. Add one to your .env.local file (see .env.example) and restart the server.";

export function isAiConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

let cachedClient: GoogleGenAI | null = null;
function getClient(): GoogleGenAI {
  if (!cachedClient) cachedClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return cachedClient;
}

export interface AiCallResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
  code?: "not_configured" | "upstream_error";
}

/**
 * Calls Gemini with a JSON response schema so the output is reliable
 * structured JSON — no prose-JSON parsing, no markdown-fence stripping.
 * Never logs prompt or response content, only the outcome.
 */
export async function callAiTool<T>(
  system: string,
  userPrompt: string,
  jsonSchema: Record<string, unknown>,
): Promise<AiCallResult<T>> {
  if (!isAiConfigured()) {
    return { ok: false, code: "not_configured", error: NOT_CONFIGURED_MESSAGE };
  }

  try {
    const response = await getClient().models.generateContent({
      model: MODEL,
      contents: userPrompt,
      config: {
        systemInstruction: system,
        maxOutputTokens: MAX_OUTPUT_TOKENS,
        responseMimeType: "application/json",
        responseJsonSchema: jsonSchema,
      },
    });

    const text = response.text;
    if (!text) {
      return {
        ok: false,
        code: "upstream_error",
        error: "The AI didn't return a structured response. Try again.",
      };
    }
    try {
      return { ok: true, data: JSON.parse(text) as T };
    } catch {
      return {
        ok: false,
        code: "upstream_error",
        error: "The AI returned a response that couldn't be parsed. Try again.",
      };
    }
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 401 || err.status === 403) {
        console.error("[ai] authentication failed — check GEMINI_API_KEY");
        return { ok: false, code: "upstream_error", error: "AI request failed: invalid API key." };
      }
      if (err.status === 429) {
        console.error("[ai] upstream rate limited");
        return {
          ok: false,
          code: "upstream_error",
          error: "The AI provider is rate-limiting requests. Try again shortly.",
        };
      }
      console.error(`[ai] API error (status ${err.status})`);
      return { ok: false, code: "upstream_error", error: "The AI request failed. Try again in a moment." };
    }
    console.error("[ai] request failed (network or unknown error)");
    return { ok: false, code: "upstream_error", error: "The AI request failed. Try again in a moment." };
  }
}
