export type DiffLineType = "unchanged" | "added" | "removed";

export interface DiffLine {
  type: DiffLineType;
  content: string;
  aLine?: number;
  bLine?: number;
}

export interface DiffResult {
  lines: DiffLine[];
  added: number;
  removed: number;
  /** True when the input exceeded MAX_LCS_LINES and the cheaper
   * prefix/suffix-trim fallback was used instead of a full LCS diff. */
  simplified: boolean;
}

const MAX_LCS_LINES = 4000;

export function diffLines(a: string, b: string): DiffResult {
  const aLines = a.split("\n");
  const bLines = b.split("\n");

  if (aLines.length > MAX_LCS_LINES || bLines.length > MAX_LCS_LINES) {
    return simplifiedDiff(aLines, bLines);
  }
  return lcsDiff(aLines, bLines);
}

/** Standard LCS-based line diff — O(n·m) time and space, using a flat
 * typed array so it stays fast and memory-light up to MAX_LCS_LINES. */
function lcsDiff(aLines: string[], bLines: string[]): DiffResult {
  const n = aLines.length;
  const m = bLines.length;
  const width = m + 1;
  const dp = new Uint32Array((n + 1) * width);

  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i * width + j] =
        aLines[i] === bLines[j]
          ? dp[(i + 1) * width + (j + 1)] + 1
          : Math.max(dp[(i + 1) * width + j], dp[i * width + (j + 1)]);
    }
  }

  const lines: DiffLine[] = [];
  let added = 0;
  let removed = 0;
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (aLines[i] === bLines[j]) {
      lines.push({ type: "unchanged", content: aLines[i], aLine: i + 1, bLine: j + 1 });
      i++;
      j++;
    } else if (dp[(i + 1) * width + j] >= dp[i * width + (j + 1)]) {
      lines.push({ type: "removed", content: aLines[i], aLine: i + 1 });
      removed++;
      i++;
    } else {
      lines.push({ type: "added", content: bLines[j], bLine: j + 1 });
      added++;
      j++;
    }
  }
  while (i < n) {
    lines.push({ type: "removed", content: aLines[i], aLine: i + 1 });
    removed++;
    i++;
  }
  while (j < m) {
    lines.push({ type: "added", content: bLines[j], bLine: j + 1 });
    added++;
    j++;
  }

  return { lines, added, removed, simplified: false };
}

/** O(n+m) fallback for very large inputs: trims the common prefix and
 * suffix and treats the differing middle as one remove/add block, rather
 * than running a full O(n·m) LCS. */
function simplifiedDiff(aLines: string[], bLines: string[]): DiffResult {
  let start = 0;
  const maxStart = Math.min(aLines.length, bLines.length);
  while (start < maxStart && aLines[start] === bLines[start]) start++;

  let endA = aLines.length - 1;
  let endB = bLines.length - 1;
  while (endA >= start && endB >= start && aLines[endA] === bLines[endB]) {
    endA--;
    endB--;
  }

  const lines: DiffLine[] = [];
  let added = 0;
  let removed = 0;

  for (let k = 0; k < start; k++) {
    lines.push({ type: "unchanged", content: aLines[k], aLine: k + 1, bLine: k + 1 });
  }
  for (let k = start; k <= endA; k++) {
    lines.push({ type: "removed", content: aLines[k], aLine: k + 1 });
    removed++;
  }
  for (let k = start; k <= endB; k++) {
    lines.push({ type: "added", content: bLines[k], bLine: k + 1 });
    added++;
  }
  const offset = bLines.length - aLines.length;
  for (let k = endA + 1; k < aLines.length; k++) {
    lines.push({ type: "unchanged", content: aLines[k], aLine: k + 1, bLine: k + offset + 1 });
  }

  return { lines, added, removed, simplified: true };
}

export function toUnifiedText(result: DiffResult): string {
  return result.lines
    .map((line) => {
      const prefix = line.type === "added" ? "+" : line.type === "removed" ? "-" : " ";
      return `${prefix} ${line.content}`;
    })
    .join("\n");
}
