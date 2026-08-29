export type LogLevel = "error" | "warning" | "info" | "debug" | "other";

export interface LogLine {
  lineNumber: number;
  level: LogLevel;
  text: string;
}

export interface LogAnalysis {
  totalLines: number;
  lines: LogLine[];
  counts: Record<LogLevel, number>;
}

const LEVEL_PATTERNS: { level: LogLevel; pattern: RegExp }[] = [
  { level: "error", pattern: /\b(error|err|fatal|critical|exception|panic)\b/i },
  { level: "warning", pattern: /\b(warn|warning)\b/i },
  { level: "info", pattern: /\b(info|notice)\b/i },
  { level: "debug", pattern: /\b(debug|trace)\b/i },
];

function classifyLine(text: string): LogLevel {
  for (const { level, pattern } of LEVEL_PATTERNS) {
    if (pattern.test(text)) return level;
  }
  return "other";
}

export function analyzeLog(text: string): LogAnalysis {
  const rawLines = text.split(/\r\n|\r|\n/);
  // A trailing newline produces one spurious empty "line" — drop it.
  if (rawLines.length > 0 && rawLines[rawLines.length - 1] === "") rawLines.pop();

  const counts: Record<LogLevel, number> = { error: 0, warning: 0, info: 0, debug: 0, other: 0 };
  const lines: LogLine[] = rawLines.map((lineText, idx) => {
    const level = classifyLine(lineText);
    counts[level]++;
    return { lineNumber: idx + 1, level, text: lineText };
  });

  return { totalLines: lines.length, lines, counts };
}

export interface PatternGroup {
  pattern: string;
  count: number;
  example: string;
  lineNumbers: number[];
}

const MAX_PATTERN_GROUPS = 20;
const MAX_TRACKED_LINES_PER_GROUP = 500;

/** Collapses variable parts (numbers, hex/uuid-looking tokens, quoted
 * strings) so structurally-identical log lines group together even when
 * their specific values differ. */
function normalizeForGrouping(text: string): string {
  return text
    .replace(/0x[0-9a-f]+/gi, "0xHEX")
    .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, "UUID")
    .replace(/"[^"]*"|'[^']*'/g, '"…"')
    .replace(/\d+/g, "#")
    .trim();
}

export function groupCommonPatterns(
  lines: LogLine[],
  levels: LogLevel[] = ["error", "warning"],
): PatternGroup[] {
  const levelSet = new Set(levels);
  const groups = new Map<string, PatternGroup>();

  for (const line of lines) {
    if (!levelSet.has(line.level)) continue;
    const key = normalizeForGrouping(line.text);
    if (!key) continue;
    let group = groups.get(key);
    if (!group) {
      group = { pattern: key, count: 0, example: line.text, lineNumbers: [] };
      groups.set(key, group);
    }
    group.count++;
    if (group.lineNumbers.length < MAX_TRACKED_LINES_PER_GROUP) {
      group.lineNumbers.push(line.lineNumber);
    }
  }

  return Array.from(groups.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, MAX_PATTERN_GROUPS);
}
