export function generateUuids(count: number): string[] {
  const n = Math.max(1, Math.min(50, Math.floor(count) || 1));
  return Array.from({ length: n }, () => crypto.randomUUID());
}

export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

const CHAR_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

function buildPool(options: PasswordOptions): string {
  let pool = "";
  if (options.uppercase) pool += CHAR_SETS.uppercase;
  if (options.lowercase) pool += CHAR_SETS.lowercase;
  if (options.numbers) pool += CHAR_SETS.numbers;
  if (options.symbols) pool += CHAR_SETS.symbols;
  return pool;
}

/** Uniform random index in [0, max) via rejection sampling — avoids the
 * modulo bias a plain `randomByte % max` would introduce. */
function randomIndex(max: number): number {
  const range = 256 - (256 % max);
  const bytes = new Uint8Array(1);
  let value: number;
  do {
    crypto.getRandomValues(bytes);
    value = bytes[0];
  } while (value >= range);
  return value % max;
}

export function generatePassword(options: PasswordOptions): string {
  const pool = buildPool(options);
  if (pool.length === 0) return "";
  const length = Math.max(1, Math.floor(options.length));
  const chars = new Array<string>(length);
  for (let i = 0; i < length; i++) {
    chars[i] = pool[randomIndex(pool.length)];
  }
  return chars.join("");
}

export function estimatePasswordEntropyBits(options: PasswordOptions): number {
  const poolSize = buildPool(options).length;
  if (poolSize === 0) return 0;
  return Math.floor(options.length * Math.log2(poolSize));
}
