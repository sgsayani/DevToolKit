export interface DecodeJwtResult {
  ok: boolean;
  header?: unknown;
  payload?: Record<string, unknown>;
  /** Raw base64url signature segment — never verified, just displayed. */
  signature?: string;
  error?: string;
}

/** JWT segments use base64url (`-`/`_`, no padding) — different from the
 * standard base64 alphabet used by the Base64 Encoder/Decoder tool. */
function base64UrlDecode(segment: string): string {
  let base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) base64 += "=";
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

/** Decodes a JWT's header and payload. This never checks the signature —
 * decoding a JWT does not verify it. */
export function decodeJwt(token: string): DecodeJwtResult {
  const trimmed = token.trim();
  if (trimmed === "") {
    return { ok: false, error: "Enter a JWT to decode." };
  }

  const parts = trimmed.split(".");
  if (parts.length !== 3) {
    return {
      ok: false,
      error: `Not a valid JWT — expected 3 dot-separated segments, found ${parts.length}.`,
    };
  }

  const [headerPart, payloadPart, signaturePart] = parts;
  try {
    const header = JSON.parse(base64UrlDecode(headerPart));
    const payload = JSON.parse(base64UrlDecode(payloadPart));
    return { ok: true, header, payload, signature: signaturePart };
  } catch {
    return {
      ok: false,
      error: "Could not decode this token — the header or payload isn't valid Base64URL-encoded JSON.",
    };
  }
}

export type ExpiryState = "expired" | "active" | "not-yet-valid" | "unknown";

export interface ExpiryInfo {
  state: ExpiryState;
  message: string;
}

const STANDARD_TIME_CLAIMS = new Set(["exp", "iat", "nbf"]);

export function isStandardTimeClaim(key: string): boolean {
  return STANDARD_TIME_CLAIMS.has(key);
}

/** Renders a numeric claim (seconds since epoch, per the JWT spec) as a
 * human-readable local timestamp. */
export function formatClaimTimestamp(value: unknown): string | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const date = new Date(value * 1000);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "medium" });
}

/** Summarizes expiration state from the standard `exp`/`nbf` claims —
 * purely informational, not a signature check. */
export function describeExpiry(payload: Record<string, unknown> | undefined): ExpiryInfo {
  if (!payload) return { state: "unknown", message: "No payload." };

  const nowSeconds = Date.now() / 1000;
  const exp = typeof payload.exp === "number" ? payload.exp : undefined;
  const nbf = typeof payload.nbf === "number" ? payload.nbf : undefined;

  if (nbf !== undefined && nowSeconds < nbf) {
    return { state: "not-yet-valid", message: `Not valid until ${formatClaimTimestamp(nbf)}` };
  }
  if (exp !== undefined) {
    return nowSeconds >= exp
      ? { state: "expired", message: `Expired ${formatClaimTimestamp(exp)}` }
      : { state: "active", message: `Valid until ${formatClaimTimestamp(exp)}` };
  }
  return { state: "unknown", message: "No expiration claim (exp) present." };
}
