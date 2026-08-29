export interface FormatSqlResult {
  ok: boolean;
  output?: string;
  error?: string;
}

interface Token {
  type: "string" | "comment" | "punct" | "word";
  value: string;
  /** Whether whitespace separated this token from the previous one in the
   * original input — used to decide function-call-style "(" (no space,
   * `COUNT(x)`) vs a grouping/argument-list "(" (space, `INTO t (a, b)`)
   * by preserving what the user actually wrote, rather than guessing from
   * a keyword list (which can't distinguish a table name from a function
   * name). */
  spaceBefore: boolean;
}

const TOKEN_RE =
  /'(?:[^']|'')*'|"(?:[^"]|"")*"|`(?:[^`]|``)*`|--[^\n]*|\/\*[\s\S]*?\*\/|[(),;]|\s+|[^\s(),;'"`]+/g;

function tokenize(sql: string): Token[] {
  const tokens: Token[] = [];
  const matches = sql.match(TOKEN_RE) ?? [];
  let spaceBefore = false;
  for (const value of matches) {
    if (/^\s+$/.test(value)) {
      spaceBefore = true;
      continue;
    }
    if (value[0] === "'" || value[0] === '"' || value[0] === "`") {
      tokens.push({ type: "string", value, spaceBefore });
    } else if (value.startsWith("--") || value.startsWith("/*")) {
      tokens.push({ type: "comment", value, spaceBefore });
    } else if (value === "(" || value === ")" || value === "," || value === ";") {
      tokens.push({ type: "punct", value, spaceBefore });
    } else {
      tokens.push({ type: "word", value, spaceBefore });
    }
    spaceBefore = false;
  }
  return tokens;
}

// Longest phrases first so "UNION ALL" matches before bare "UNION", etc.
// The sort below guarantees this regardless of listed order.
const CLAUSE_PHRASES: string[][] = [
  ["LEFT", "OUTER", "JOIN"],
  ["RIGHT", "OUTER", "JOIN"],
  ["FULL", "OUTER", "JOIN"],
  ["INSERT", "INTO"],
  ["DELETE", "FROM"],
  ["UNION", "ALL"],
  ["GROUP", "BY"],
  ["ORDER", "BY"],
  ["LEFT", "JOIN"],
  ["RIGHT", "JOIN"],
  ["INNER", "JOIN"],
  ["FULL", "JOIN"],
  ["CROSS", "JOIN"],
  ["SELECT"],
  ["FROM"],
  ["WHERE"],
  ["HAVING"],
  ["LIMIT"],
  ["OFFSET"],
  ["SET"],
  ["VALUES"],
  ["UPDATE"],
  ["UNION"],
  ["WITH"],
  ["JOIN"],
].sort((a, b) => b.length - a.length);

function matchClausePhrase(tokens: Token[], start: number): string[] | null {
  for (const phrase of CLAUSE_PHRASES) {
    let matches = true;
    for (let j = 0; j < phrase.length; j++) {
      const token = tokens[start + j];
      if (!token || token.type !== "word" || token.value.toUpperCase() !== phrase[j]) {
        matches = false;
        break;
      }
    }
    if (matches) return phrase;
  }
  return null;
}

const INDENT = "  ";

function render(tokens: Token[]): string {
  const lines: string[] = [];
  let current: string[] = [];
  let indent = 0;
  let parenDepth = 0;
  let clauseParenDepth = 0;
  let lastWord = "";

  function joinLine(parts: string[]): string {
    let out = "";
    for (const part of parts) {
      if (out === "") {
        out = part;
        continue;
      }
      const noSpaceBefore = part === "," || part === ")" || part === ";";
      const noSpaceAfter = out.endsWith("(");
      out += noSpaceBefore || noSpaceAfter ? part : ` ${part}`;
    }
    return out;
  }

  function flush() {
    if (current.length > 0) {
      lines.push(INDENT.repeat(indent) + joinLine(current));
      current = [];
    }
  }

  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];

    if (token.type === "comment") {
      flush();
      lines.push(INDENT.repeat(indent) + token.value.trim());
      i++;
      continue;
    }

    if (token.type === "string") {
      current.push(token.value);
      i++;
      continue;
    }

    if (token.type === "punct") {
      if (token.value === "(") {
        if (!token.spaceBefore && current.length > 0) {
          current[current.length - 1] += "(";
        } else {
          current.push("(");
        }
        parenDepth++;
      } else if (token.value === ")") {
        parenDepth = Math.max(0, parenDepth - 1);
        current.push(")");
      } else if (token.value === ",") {
        current.push(",");
        if (parenDepth === clauseParenDepth) {
          flush();
          indent = clauseParenDepth + 1;
        }
      } else if (token.value === ";") {
        current.push(";");
        flush();
        indent = 0;
        clauseParenDepth = 0;
      }
      i++;
      continue;
    }

    // word token
    const phrase = matchClausePhrase(tokens, i);
    if (phrase) {
      flush();
      indent = parenDepth;
      clauseParenDepth = parenDepth;
      current.push(phrase.join(" "));
      lastWord = phrase[phrase.length - 1];
      i += phrase.length;
      continue;
    }

    const upper = token.value.toUpperCase();
    if ((upper === "AND" || upper === "OR") && lastWord !== "BETWEEN") {
      flush();
      indent = clauseParenDepth + 1;
      current.push(upper);
      lastWord = upper;
      i++;
      continue;
    }

    current.push(token.value);
    lastWord = upper;
    i++;
  }

  flush();
  return lines.join("\n");
}

/**
 * Formats common ANSI-ish SQL (SELECT/INSERT/UPDATE/DELETE, JOINs, WHERE,
 * GROUP BY/ORDER BY, subqueries). This is a tokenizer-driven line-break
 * formatter, not a full SQL parser — it doesn't validate syntax or claim
 * to support every database's dialect-specific extensions.
 */
export function formatSql(input: string): FormatSqlResult {
  if (input.trim() === "") {
    return { ok: false, error: "Input is empty." };
  }
  try {
    const tokens = tokenize(input);
    if (tokens.length === 0) {
      return { ok: false, error: "Input is empty." };
    }
    return { ok: true, output: render(tokens) };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not format this SQL." };
  }
}
