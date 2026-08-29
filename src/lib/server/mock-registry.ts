import type { HttpMethod } from "@/lib/utils/api-client";
import type { MockField, MockResponseShape } from "@/lib/utils/mock-data";

export interface StoredMock {
  id: string;
  method: HttpMethod;
  path: string; // e.g. "/users" or "/users/{id}"
  fields: MockField[];
  recordCount: number;
  responseShape: MockResponseShape;
  status: number;
  delayMs: number;
  createdAt: number;
}

export type CreateMockInput = Omit<StoredMock, "id" | "createdAt">;

/**
 * In-memory, single-process registry — same trade-off already accepted for
 * the API Client's rate limiter (lib/server/rate-limit.ts): resets on
 * server restart, doesn't coordinate across multiple instances. A real
 * database would be overkill for a dev tool's throwaway mocks.
 */
const MAX_MOCKS = 50;
const mocks = new Map<string, StoredMock>();

export function listMocks(): StoredMock[] {
  return Array.from(mocks.values()).sort((a, b) => b.createdAt - a.createdAt);
}

export function createMock(
  input: CreateMockInput,
): { ok: true; mock: StoredMock } | { ok: false; error: string } {
  if (mocks.size >= MAX_MOCKS) {
    return { ok: false, error: `Limit of ${MAX_MOCKS} active mocks reached — delete one first.` };
  }
  const mock: StoredMock = { ...input, id: crypto.randomUUID(), createdAt: Date.now() };
  mocks.set(mock.id, mock);
  return { ok: true, mock };
}

export function deleteMock(id: string): boolean {
  return mocks.delete(id);
}

function normalizeSegments(path: string): string[] {
  return path.split("/").filter(Boolean);
}

function pathMatches(template: string, actualSegments: string[]): boolean {
  const templateSegments = normalizeSegments(template);
  if (templateSegments.length !== actualSegments.length) return false;
  return templateSegments.every(
    (segment, i) => segment.startsWith("{") || segment.startsWith(":") || segment === actualSegments[i],
  );
}

export function findMock(method: string, pathSegments: string[]): StoredMock | undefined {
  for (const mock of mocks.values()) {
    if (mock.method !== method) continue;
    if (pathMatches(mock.path, pathSegments)) return mock;
  }
  return undefined;
}
