export interface EncodingResult {
  ok: boolean;
  output?: string;
  error?: string;
}

/** UTF-8 safe Base64 encode — plain btoa() breaks on characters outside Latin1. */
export function base64Encode(input: string): EncodingResult {
  try {
    const bytes = new TextEncoder().encode(input);
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return { ok: true, output: btoa(binary) };
  } catch {
    return { ok: false, error: "Could not encode this input as Base64." };
  }
}

export function base64Decode(input: string): EncodingResult {
  const trimmed = input.trim();
  if (trimmed === "") return { ok: false, error: "Input is empty." };
  try {
    const binary = atob(trimmed);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const output = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return { ok: true, output };
  } catch {
    return {
      ok: false,
      error: "Invalid Base64 input — check for missing padding or invalid characters.",
    };
  }
}

export function urlEncode(input: string): EncodingResult {
  try {
    return { ok: true, output: encodeURIComponent(input) };
  } catch {
    return { ok: false, error: "Could not URL-encode this input." };
  }
}

export function urlDecode(input: string): EncodingResult {
  const trimmed = input.trim();
  if (trimmed === "") return { ok: false, error: "Input is empty." };
  try {
    return { ok: true, output: decodeURIComponent(trimmed) };
  } catch {
    return {
      ok: false,
      error: "Invalid percent-encoding — check for malformed % sequences.",
    };
  }
}
