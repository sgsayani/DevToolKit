// Shared, framework-agnostic constants and validators for Code Share —
// imported from both client form components and server routes, so it has
// no "use client"/"use server" directive and no side effects.

export const PASTE_LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "sql", label: "SQL" },
  { value: "bash", label: "Bash" },
  { value: "plaintext", label: "Plain Text" },
  { value: "other", label: "Other" },
] as const;

export type PasteLanguage = (typeof PASTE_LANGUAGES)[number]["value"];

export const PASTE_VISIBILITIES = [
  { value: "public", label: "Public", description: "Anyone with the link can view it." },
  {
    value: "unlisted",
    label: "Unlisted",
    description: "Not shown in any listing, but viewable by anyone with the link.",
  },
  { value: "private", label: "Private", description: "Only you can view it." },
] as const;

export type PasteVisibility = (typeof PASTE_VISIBILITIES)[number]["value"];

export const PASTE_EXPIRATIONS = [
  { value: "never", label: "Never", ms: null },
  { value: "10m", label: "10 minutes", ms: 10 * 60 * 1000 },
  { value: "1h", label: "1 hour", ms: 60 * 60 * 1000 },
  { value: "1d", label: "1 day", ms: 24 * 60 * 60 * 1000 },
  { value: "1w", label: "1 week", ms: 7 * 24 * 60 * 60 * 1000 },
] as const satisfies { value: string; label: string; ms: number | null }[];

export type PasteExpiration = (typeof PASTE_EXPIRATIONS)[number]["value"];

export const PASTE_MAX_CONTENT_LENGTH = 300_000;
export const PASTE_MAX_TITLE_LENGTH = 200;

export function isPasteLanguage(value: string): value is PasteLanguage {
  return PASTE_LANGUAGES.some((l) => l.value === value);
}

export function isPasteVisibility(value: string): value is PasteVisibility {
  return PASTE_VISIBILITIES.some((v) => v.value === value);
}

export function isPasteExpiration(value: string): value is PasteExpiration {
  return PASTE_EXPIRATIONS.some((e) => e.value === value);
}

export function languageLabel(value: string): string {
  return PASTE_LANGUAGES.find((l) => l.value === value)?.label ?? value;
}

/** Computes the absolute expiry Date for a relative expiration choice,
 * measured from `from` (defaults to now) — used both at creation and
 * whenever a paste is edited, since editing resets the countdown. */
export function expirationToDate(expiration: PasteExpiration, from: Date = new Date()): Date | null {
  const entry = PASTE_EXPIRATIONS.find((e) => e.value === expiration);
  if (!entry || entry.ms === null) return null;
  return new Date(from.getTime() + entry.ms);
}

export const FILE_EXTENSION_BY_LANGUAGE: Record<PasteLanguage, string> = {
  javascript: "js",
  typescript: "ts",
  python: "py",
  java: "java",
  cpp: "cpp",
  c: "c",
  go: "go",
  rust: "rs",
  html: "html",
  css: "css",
  json: "json",
  sql: "sql",
  bash: "sh",
  plaintext: "txt",
  other: "txt",
};
