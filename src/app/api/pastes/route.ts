import { NextResponse } from "next/server";
import { checkPasteWriteRequest } from "@/lib/server/paste-route-guard";
import { getOrCreateOwnerHash, getOwnerHash } from "@/lib/server/owner-token";
import { createPaste, listPastesByOwner } from "@/lib/server/paste-store";
import { isMongoConfigured, NOT_CONFIGURED_MESSAGE } from "@/lib/server/mongodb";
import {
  expirationToDate,
  isPasteExpiration,
  isPasteLanguage,
  isPasteVisibility,
  PASTE_MAX_CONTENT_LENGTH,
  PASTE_MAX_TITLE_LENGTH,
} from "@/lib/utils/paste";

export const runtime = "nodejs";
// This response is personalized per owner cookie — force-dynamic plus an
// explicit no-store header so no shared cache (CDN, proxy, browser) can
// ever serve one visitor's paste list to a different visitor.
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "private, no-store" };

interface PastePayload {
  title?: unknown;
  content?: unknown;
  language?: unknown;
  visibility?: unknown;
  expiration?: unknown;
}

export async function POST(request: Request) {
  if (!isMongoConfigured()) {
    return NextResponse.json({ ok: false, code: "not_configured", error: NOT_CONFIGURED_MESSAGE });
  }
  const guardError = checkPasteWriteRequest(request);
  if (guardError) return guardError;

  let payload: PastePayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  const title =
    typeof payload.title === "string" ? payload.title.trim().slice(0, PASTE_MAX_TITLE_LENGTH) : "";
  const content = typeof payload.content === "string" ? payload.content : "";
  const language =
    typeof payload.language === "string" && isPasteLanguage(payload.language)
      ? payload.language
      : "plaintext";
  const visibility =
    typeof payload.visibility === "string" && isPasteVisibility(payload.visibility)
      ? payload.visibility
      : "public";
  const expiration =
    typeof payload.expiration === "string" && isPasteExpiration(payload.expiration)
      ? payload.expiration
      : "never";

  if (!content.trim()) {
    return NextResponse.json({ ok: false, error: "Paste content can't be empty." }, { status: 400 });
  }
  if (content.length > PASTE_MAX_CONTENT_LENGTH) {
    return NextResponse.json(
      { ok: false, error: `Keep pastes under ${PASTE_MAX_CONTENT_LENGTH.toLocaleString()} characters.` },
      { status: 400 },
    );
  }

  const ownerHash = await getOrCreateOwnerHash();
  const paste = await createPaste({
    title,
    content,
    language,
    visibility,
    ownerHash,
    expiresAt: expirationToDate(expiration),
  });

  return NextResponse.json({ ok: true, id: paste._id });
}

// Lists only the requester's own pastes (scoped by their owner cookie) —
// safe without the same-origin/rate-limit guard above, since it can never
// return another visitor's data.
export async function GET() {
  if (!isMongoConfigured()) {
    return NextResponse.json(
      { ok: false, code: "not_configured", error: NOT_CONFIGURED_MESSAGE, pastes: [] },
      { headers: NO_STORE },
    );
  }
  const ownerHash = await getOwnerHash();
  if (!ownerHash) {
    return NextResponse.json({ ok: true, pastes: [] }, { headers: NO_STORE });
  }
  const pastes = await listPastesByOwner(ownerHash);
  return NextResponse.json(
    {
      ok: true,
      pastes: pastes.map((paste) => ({
        id: paste._id,
        title: paste.title,
        language: paste.language,
        visibility: paste.visibility,
        createdAt: paste.createdAt.toISOString(),
        expiresAt: paste.expiresAt ? paste.expiresAt.toISOString() : null,
      })),
    },
    { headers: NO_STORE },
  );
}
