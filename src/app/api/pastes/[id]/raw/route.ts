import { getOwnerHash } from "@/lib/server/owner-token";
import { getPasteById } from "@/lib/server/paste-store";
import { isMongoConfigured, NOT_CONFIGURED_MESSAGE } from "@/lib/server/mongodb";

export const runtime = "nodejs";
// A private paste's raw content is requester-specific (only its owner can
// see it) — force-dynamic plus no-store so a shared cache can never serve
// one visitor's raw response to another.
export const dynamic = "force-dynamic";

// No same-origin check here on purpose: this is meant to be opened directly
// (a shared link, "Raw" opened in a new tab) which sends no Origin header,
// and it's read-only. Content-Type is force-set to text/plain with a
// nosniff header so a pasted HTML/JS snippet is served as inert text, never
// as something a browser could execute.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isMongoConfigured()) {
    return new Response(NOT_CONFIGURED_MESSAGE, {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "private, no-store" },
    });
  }
  const { id } = await params;
  const paste = await getPasteById(id);
  const ownerHash = await getOwnerHash();
  const isOwner = !!paste && ownerHash === paste.ownerHash;

  if (!paste || (paste.visibility === "private" && !isOwner)) {
    return new Response("Not found.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "private, no-store" },
    });
  }

  return new Response(paste.content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
