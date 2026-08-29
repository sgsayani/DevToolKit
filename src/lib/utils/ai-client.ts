export interface AiResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
  code?: "not_configured" | "upstream_error";
}

export interface ErrorExplanation {
  whatHappened: string;
  likelyCause: string;
  possibleFixes: string[];
  exampleSolution: string;
}

export interface CodeExplanation {
  summary: string;
  importantSections: { section: string; explanation: string }[];
  stepByStep: string[];
  potentialIssues: string[];
  complexity?: string;
}

export interface GitCommandResult {
  command: string;
  explanation: string;
  isDestructive: boolean;
  warning?: string;
}

export interface SqlGenerationResult {
  sql: string;
  explanation: string;
  assumptions: string[];
  ambiguityWarning?: string;
}

export interface RegexGenerationResult {
  regex: string;
  flags: string;
  explanation: string;
  exampleMatches: string[];
  exampleNonMatches: string[];
}

export async function callAiEndpoint<T>(
  endpoint: string,
  body: Record<string, unknown>,
): Promise<AiResult<T>> {
  try {
    const res = await fetch(`/api/ai/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return (await res.json()) as AiResult<T>;
  } catch {
    return { ok: false, error: "Could not reach the server." };
  }
}

export async function checkAiConfigured(): Promise<boolean> {
  try {
    const res = await fetch("/api/ai/status");
    const data = await res.json();
    return !!data.configured;
  } catch {
    return false;
  }
}
