import { cookies } from "next/headers";
import { createHash, randomBytes } from "crypto";

// There is no login system in DevKit, so paste ownership ("My Pastes",
// edit/delete rights, private-paste access) is scoped to an anonymous,
// unguessable identity stored in an httpOnly cookie per browser — never a
// literal user account. Only the SHA-256 hash of the token is ever stored
// or compared, so a database read alone can't be used to forge the cookie.

const COOKIE_NAME = "devkit_owner";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Read-only: works in Server Components too. Returns null if the visitor
 * has never created a paste (no cookie issued yet). */
export async function getOwnerHash(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return token ? hashToken(token) : null;
}

/** Route-Handler-only: issues the owner cookie on first use. Cookies can
 * only be set from a Route Handler or Server Function, never while
 * rendering a Server Component — callers must be a route.ts handler. */
export async function getOrCreateOwnerHash(): Promise<string> {
  const store = await cookies();
  let token = store.get(COOKIE_NAME)?.value;
  if (!token) {
    token = randomBytes(32).toString("hex");
    store.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });
  }
  return hashToken(token);
}
