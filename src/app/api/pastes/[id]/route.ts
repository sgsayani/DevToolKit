import { NextResponse } from "next/server";
import { checkPasteWriteRequest } from "@/lib/server/paste-route-guard";
import { getOwnerHash } from "@/lib/server/owner-token";
import { deleteOwnedPaste, getPasteById, updateOwnedPaste } from "@/lib/server/paste-store";
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
// isOwner (and, for private pastes, the content itself) is personalized per
// requester — force-dynamic plus no-store so a shared cache can never serve
// one visitor's view of a paste to another.
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "private, no-store" };

interface PastePayload {
  title?: unknown;
  content?: unknown;
  language?: unknown;
  visibility?: unknown;
  expiration?: unknown;
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  if (!isMongoConfigured()) {
    return NextResponse.json(
      { ok: false, code: "not_configured", error: NOT_CONFIGURED_MESSAGE },
      { headers: NO_STORE },
    );
  }
  const { id } = await params;
  const paste = await getPasteById(id);
  const ownerHash = await getOwnerHash();
  const isOwner = !!paste && ownerHash === paste.ownerHash;

  // A private paste a non-owner tries to read is reported as "not found",
  // not "forbidden" — this avoids confirming to a stranger that a given id
  // even exists.
  if (!paste || (paste.visibility === "private" && !isOwner)) {
    return NextResponse.json({ ok: false, error: "Paste not found." }, { status: 404, headers: NO_STORE });
  }

  return NextResponse.json(
    {
      ok: true,
      paste: {
        id: paste._id,
        title: paste.title,
        content: paste.content,
        language: paste.language,
        visibility: paste.visibility,
        createdAt: paste.createdAt.toISOString(),
        expiresAt: paste.expiresAt ? paste.expiresAt.toISOString() : null,
        isOwner,
      },
    },
    { headers: NO_STORE },
  );
}

export async function PATCH(request: Request, { params }: RouteParams) {
  if (!isMongoConfigured()) {
    return NextResponse.json({ ok: false, code: "not_configured", error: NOT_CONFIGURED_MESSAGE });
  }
  const guardError = checkPasteWriteRequest(request);
  if (guardError) return guardError;

  const { id } = await params;
  const ownerHash = await getOwnerHash();
  if (!ownerHash) {
    return NextResponse.json(
      { ok: false, error: "You don't have permission to edit this paste." },
      { status: 403 },
    );
  }

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

  // Editing resets the expiration countdown, measured from now — the UI
  // makes this explicit rather than trying to preserve an original
  // creation-relative expiry across edits.
  const updated = await updateOwnedPaste(id, ownerHash, {
    title,
    content,
    language,
    visibility,
    expiresAt: expirationToDate(expiration),
  });
  if (!updated) {
    return NextResponse.json({ ok: false, error: "Paste not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, id });
}

export async function DELETE(request: Request, { params }: RouteParams) {
  if (!isMongoConfigured()) {
    return NextResponse.json({ ok: false, code: "not_configured", error: NOT_CONFIGURED_MESSAGE });
  }
  const guardError = checkPasteWriteRequest(request);
  if (guardError) return guardError;

  const { id } = await params;
  const ownerHash = await getOwnerHash();
  if (!ownerHash) {
    return NextResponse.json(
      { ok: false, error: "You don't have permission to delete this paste." },
      { status: 403 },
    );
  }
  const deleted = await deleteOwnedPaste(id, ownerHash);
  if (!deleted) {
    return NextResponse.json({ ok: false, error: "Paste not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
