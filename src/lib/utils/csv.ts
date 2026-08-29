export interface CsvResult {
  ok: boolean;
  output?: string;
  error?: string;
}

// --- CSV parsing/serializing (RFC 4180-ish: quoted fields, embedded
// commas/newlines, doubled-quote escaping) ---

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;
  const n = text.length;

  while (i < n) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += char;
      i++;
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (char === ",") {
      row.push(field);
      field = "";
      i++;
      continue;
    }
    if (char === "\r") {
      i++;
      continue;
    }
    if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i++;
      continue;
    }
    field += char;
    i++;
  }

  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function needsQuoting(value: string): boolean {
  return /[",\n\r]/.test(value);
}

function escapeCsvField(value: string): string {
  if (!needsQuoting(value)) return value;
  return `"${value.replace(/"/g, '""')}"`;
}

function serializeCsv(rows: string[][]): string {
  return rows.map((row) => row.map(escapeCsvField).join(",")).join("\r\n");
}

// --- JSON -> CSV ---

function flattenValue(value: unknown, prefix: string, out: Record<string, unknown>) {
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) {
      out[prefix] = "{}";
      return;
    }
    for (const [key, val] of entries) {
      flattenValue(val, prefix ? `${prefix}.${key}` : key, out);
    }
    return;
  }
  // Arrays are stored as their JSON text — fully expanding them would
  // multiply rows ambiguously, so this is "nested data where reasonable".
  if (Array.isArray(value)) {
    out[prefix] = JSON.stringify(value);
    return;
  }
  out[prefix] = value;
}

function flattenObject(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  flattenValue(obj, "", out);
  return out;
}

export function jsonToCsv(jsonText: string): CsvResult {
  if (jsonText.trim() === "") return { ok: false, error: "Input is empty." };

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch (err) {
    return { ok: false, error: err instanceof Error ? `Invalid JSON — ${err.message}` : "Invalid JSON." };
  }

  const rows = Array.isArray(parsed) ? parsed : [parsed];
  if (rows.length === 0) return { ok: false, error: "JSON array is empty." };
  if (!rows.every((r) => r !== null && typeof r === "object" && !Array.isArray(r))) {
    return { ok: false, error: "Expected a JSON array of objects (or a single object)." };
  }

  const flatRows = rows.map((r) => flattenObject(r as Record<string, unknown>));
  const headerSet = new Set<string>();
  for (const row of flatRows) for (const key of Object.keys(row)) headerSet.add(key);
  const headers = Array.from(headerSet);

  const csvRows: string[][] = [headers];
  for (const row of flatRows) {
    csvRows.push(
      headers.map((h) => {
        const v = row[h];
        return v === undefined || v === null ? "" : String(v);
      }),
    );
  }

  return { ok: true, output: serializeCsv(csvRows) };
}

// --- CSV -> JSON ---

function coerceCsvValue(value: string): unknown {
  if (value === "") return "";
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null") return null;
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    const num = Number(value);
    if (!Number.isNaN(num)) return num;
  }
  return value;
}

function unflattenRow(headers: string[], values: string[]): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  headers.forEach((header, idx) => {
    const parts = header.split(".");
    let target = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      const existing = target[part];
      if (typeof existing !== "object" || existing === null || Array.isArray(existing)) {
        target[part] = {};
      }
      target = target[part] as Record<string, unknown>;
    }
    target[parts[parts.length - 1]] = coerceCsvValue(values[idx] ?? "");
  });
  return obj;
}

export function csvToJson(csvText: string): CsvResult {
  if (csvText.trim() === "") return { ok: false, error: "Input is empty." };

  const rows = parseCsv(csvText).filter((r) => !(r.length === 1 && r[0] === ""));
  if (rows.length === 0) return { ok: false, error: "No rows found." };

  const [headers, ...dataRows] = rows;
  if (headers.length === 0 || headers.every((h) => h.trim() === "")) {
    return { ok: false, error: "Could not find a header row." };
  }

  const objects = dataRows.map((row) => unflattenRow(headers, row));
  return { ok: true, output: JSON.stringify(objects, null, 2) };
}
