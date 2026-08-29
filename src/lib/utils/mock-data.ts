export type MockFieldType =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "email"
  | "name"
  | "uuid"
  | "date"
  | "url"
  | "paragraph";

export const MOCK_FIELD_TYPES: MockFieldType[] = [
  "string",
  "number",
  "integer",
  "boolean",
  "email",
  "name",
  "uuid",
  "date",
  "url",
  "paragraph",
];

export interface MockField {
  id: string;
  name: string;
  type: MockFieldType;
}

export function createEmptyMockField(): MockField {
  return { id: crypto.randomUUID(), name: "", type: "string" };
}

export const MAX_RECORD_COUNT = 1000;
export const MAX_DELAY_MS = 10_000;

const FIRST_NAMES = [
  "Ada", "Grace", "Alan", "Linus", "Margaret", "Tim", "Barbara", "Dennis",
  "Katherine", "Guido", "Radia", "Ken", "Frances", "Edsger", "Donald",
];
const LAST_NAMES = [
  "Lovelace", "Hopper", "Turing", "Torvalds", "Hamilton", "Berners-Lee",
  "Liskov", "Ritchie", "Johnson", "van Rossum", "Perlman", "Thompson",
  "Allen", "Dijkstra", "Knuth",
];
const WORDS = [
  "system", "data", "service", "network", "cloud", "interface", "module",
  "request", "response", "record", "value", "process", "queue", "cache", "session",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Every field type maps to a fixed, safe generator function below — there
 * is no template evaluation or code execution of any kind. An unrecognized
 * type string (the schema is user-editable free-ish text before it's
 * validated against MOCK_FIELD_TYPES) just falls through to the generic
 * placeholder, never to interpreting the string as anything executable.
 */
function generateFieldValue(type: MockFieldType, index: number): unknown {
  switch (type) {
    case "number":
      return Math.round(Math.random() * 10000) / 100;
    case "integer":
      return index + 1;
    case "boolean":
      return Math.random() < 0.5;
    case "email": {
      // Strip spaces/punctuation from multi-word last names (e.g. "van
      // Rossum", "Berners-Lee") so the result is a syntactically valid
      // local-part, not just visually name-like.
      const last = pick(LAST_NAMES).toLowerCase().replace(/[^a-z0-9]/g, "");
      return `${pick(FIRST_NAMES).toLowerCase()}.${last}@example.com`;
    }
    case "name":
      return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
    case "uuid":
      return crypto.randomUUID();
    case "date":
      return new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365)).toISOString();
    case "url":
      return `https://example.com/${pick(WORDS)}/${index + 1}`;
    case "paragraph":
      return `${Array.from({ length: 8 }, () => pick(WORDS)).join(" ")}.`;
    case "string":
    default:
      return `${pick(WORDS)}-${index + 1}`;
  }
}

export function generateRecord(fields: MockField[], index: number): Record<string, unknown> {
  const record: Record<string, unknown> = {};
  for (const field of fields) {
    if (!field.name.trim()) continue;
    record[field.name] = generateFieldValue(field.type, index);
  }
  return record;
}

export type MockResponseShape = "array" | "object";

export function generateMockData(
  fields: MockField[],
  count: number,
  shape: MockResponseShape,
): unknown {
  if (shape === "object") return generateRecord(fields, 0);
  const safeCount = Math.max(1, Math.min(MAX_RECORD_COUNT, Math.floor(count) || 1));
  return Array.from({ length: safeCount }, (_, i) => generateRecord(fields, i));
}
