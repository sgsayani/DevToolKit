export interface RegexGroup {
  name: string | number;
  value: string | undefined;
}

export interface RegexMatch {
  index: number;
  match: string;
  groups: RegexGroup[];
}

export interface RunRegexResult {
  ok: boolean;
  matches?: RegexMatch[];
  error?: string;
}

/** Caps returned matches so a pattern that matches on every character of a
 * huge input doesn't produce an unbounded result list. */
const MAX_MATCHES = 1000;

export function runRegex(pattern: string, flags: string, text: string): RunRegexResult {
  if (pattern === "") return { ok: true, matches: [] };

  let regex: RegExp;
  try {
    // matchAll requires the "g" flag — add it if the user didn't.
    const effectiveFlags = flags.includes("g") ? flags : `${flags}g`;
    regex = new RegExp(pattern, effectiveFlags);
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Invalid regular expression." };
  }

  try {
    const matches: RegexMatch[] = [];
    for (const m of text.matchAll(regex)) {
      const groups: RegexGroup[] = [];
      for (let i = 1; i < m.length; i++) {
        groups.push({ name: i, value: m[i] });
      }
      if (m.groups) {
        for (const [name, value] of Object.entries(m.groups)) {
          groups.push({ name, value });
        }
      }
      matches.push({ index: m.index ?? 0, match: m[0], groups });
      if (matches.length >= MAX_MATCHES) break;
      // A zero-length match (e.g. pattern "a*") would otherwise loop forever
      // at the same index — matchAll already advances past it internally,
      // but guard defensively against pathological input sizes too.
      if (matches.length > 0 && text.length > 5_000_000) break;
    }
    return { ok: true, matches };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not run this pattern." };
  }
}

export interface CommonPattern {
  label: string;
  pattern: string;
  flags: string;
}

export const COMMON_PATTERNS: CommonPattern[] = [
  { label: "Email address", pattern: "[\\w.+-]+@[\\w-]+\\.[\\w.-]+", flags: "g" },
  { label: "URL", pattern: "https?:\\/\\/[^\\s]+", flags: "g" },
  { label: "IPv4 address", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b", flags: "g" },
  { label: "Hex color", pattern: "#[0-9a-fA-F]{3,8}\\b", flags: "g" },
  { label: "Digits", pattern: "\\d+", flags: "g" },
  { label: "Whitespace", pattern: "\\s+", flags: "g" },
];
