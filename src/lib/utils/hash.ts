export type HashAlgorithm = "SHA-256" | "SHA-384" | "SHA-512";

export const HASH_ALGORITHMS: HashAlgorithm[] = ["SHA-256", "SHA-384", "SHA-512"];

export interface HashResult {
  ok: boolean;
  hex?: string;
  error?: string;
}

/** Hashing is one-way — this cannot be reversed to recover the input.
 * Uses the browser's Web Crypto API (SubtleCrypto), available in secure
 * contexts (https/localhost). */
export async function computeHash(text: string, algorithm: HashAlgorithm): Promise<HashResult> {
  if (text === "") return { ok: false, error: "Enter text to hash." };
  try {
    const bytes = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest(algorithm, bytes);
    const hex = Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return { ok: true, hex };
  } catch {
    return { ok: false, error: "Could not compute a hash in this browser context." };
  }
}
