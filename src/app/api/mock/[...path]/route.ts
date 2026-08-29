import { NextResponse } from "next/server";
import { findMock } from "@/lib/server/mock-registry";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { getClientKey } from "@/lib/server/request-guards";
import { generateMockData } from "@/lib/utils/mock-data";

export const runtime = "nodejs";

// Deliberately NOT origin-checked, unlike /api/mocks — the whole point of a
// mock endpoint is to be callable from the app being developed against it
// (or curl), not just from this page. Rate limiting is the abuse guard here.
async function handle(request: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  if (!checkRateLimit(getClientKey(request))) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const { path } = await params;
  const segments = path ?? [];
  const mock = findMock(request.method, segments);
  if (!mock) {
    return NextResponse.json(
      { error: `No mock registered for ${request.method} /${segments.join("/")}` },
      { status: 404 },
    );
  }

  if (mock.delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, mock.delayMs));
  }

  const body = generateMockData(mock.fields, mock.recordCount, mock.responseShape);
  return NextResponse.json(body, { status: mock.status });
}

export { handle as GET, handle as POST, handle as PUT, handle as PATCH, handle as DELETE };
