export interface JsonParseError {
  message: string;
  line?: number;
  column?: number;
  position?: number;
  snippet?: string;
}

export interface FormatJsonResult {
  ok: boolean;
  output?: string;
  error?: JsonParseError;
}

export interface ValidateJsonResult {
  valid: boolean;
  error?: JsonParseError;
}

export type IndentOption = 2 | 4 | "tab";

function locate(source: string, position: number) {
  let line = 1;
  let column = 1;
  for (let i = 0; i < position && i < source.length; i++) {
    if (source[i] === "\n") {
      line++;
      column = 1;
    } else {
      column++;
    }
  }
  const snippet = source.split("\n")[line - 1] ?? "";
  return { line, column, snippet };
}

/** Turns a JSON.parse SyntaxError into a line/column-aware error, when the
 * engine's message exposes enough information to locate it. */
export function describeJsonError(err: unknown, source: string): JsonParseError {
  const message = err instanceof Error ? err.message : String(err);

  const positionMatch = message.match(/position (\d+)/i);
  if (positionMatch) {
    const position = Number(positionMatch[1]);
    return { message, position, ...locate(source, position) };
  }

  const lineColMatch = message.match(/line (\d+) column (\d+)/i);
  if (lineColMatch) {
    const line = Number(lineColMatch[1]);
    const column = Number(lineColMatch[2]);
    const snippet = source.split("\n")[line - 1] ?? "";
    return { message, line, column, snippet };
  }

  return { message };
}

export function validateJson(input: string): ValidateJsonResult {
  if (input.trim() === "") {
    return { valid: false, error: { message: "Input is empty." } };
  }
  try {
    JSON.parse(input);
    return { valid: true };
  } catch (err) {
    return { valid: false, error: describeJsonError(err, input) };
  }
}

export function formatJson(input: string, indent: IndentOption = 2): FormatJsonResult {
  if (input.trim() === "") {
    return { ok: false, error: { message: "Input is empty." } };
  }
  try {
    const parsed = JSON.parse(input);
    const space = indent === "tab" ? "\t" : indent;
    return { ok: true, output: JSON.stringify(parsed, null, space) };
  } catch (err) {
    return { ok: false, error: describeJsonError(err, input) };
  }
}

/** Renders a JsonParseError as a short, human-readable multi-line message. */
export function formatJsonErrorMessage(error: JsonParseError): string {
  let message = error.message;
  if (error.line !== undefined && error.column !== undefined) {
    message += `\n\nLine ${error.line}, column ${error.column}`;
  } else if (error.position !== undefined) {
    message += `\n\nAt character ${error.position}`;
  }
  if (error.snippet) {
    message += `\n${error.snippet.trim()}`;
  }
  return message;
}

export function minifyJson(input: string): FormatJsonResult {
  if (input.trim() === "") {
    return { ok: false, error: { message: "Input is empty." } };
  }
  try {
    const parsed = JSON.parse(input);
    return { ok: true, output: JSON.stringify(parsed) };
  } catch (err) {
    return { ok: false, error: describeJsonError(err, input) };
  }
}
