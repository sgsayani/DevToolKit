import { NextResponse } from "next/server";
import { deleteMock } from "@/lib/server/mock-registry";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { getClientKey, isSameOrigin } from "@/lib/server/request-guards";

export const runtime = "nodejs";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { ok: false, error: "Cross-origin requests are not allowed." },
      { status: 403 },
    );
  }
  if (!checkRateLimit(getClientKey(request))) {
    return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  }

  const { id } = await params;
  const removed = deleteMock(id);
  if (!removed) {
    return NextResponse.json({ ok: false, error: "Mock not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
