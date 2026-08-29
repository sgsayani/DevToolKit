import { NextResponse } from "next/server";
import { createMock, listMocks } from "@/lib/server/mock-registry";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { getClientKey, isSameOrigin } from "@/lib/server/request-guards";
import { HTTP_METHODS, type HttpMethod } from "@/lib/utils/api-client";
import { MAX_DELAY_MS, MAX_RECORD_COUNT, MOCK_FIELD_TYPES, type MockField } from "@/lib/utils/mock-data";

export const runtime = "nodejs";

interface CreateMockBody {
  method?: string;
  path?: string;
  fields?: unknown;
  recordCount?: unknown;
  responseShape?: unknown;
  status?: unknown;
  delayMs?: unknown;
}

export async function GET(request: Request) {
  if (!checkRateLimit(getClientKey(request))) {
    return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  }
  return NextResponse.json({ ok: true, mocks: listMocks() });
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { ok: false, error: "Cross-origin requests are not allowed." },
      { status: 403 },
    );
  }
  if (!checkRateLimit(getClientKey(request))) {
    return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  }

  let payload: CreateMockBody;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  const method = typeof payload.method === "string" ? payload.method.toUpperCase() : "";
  if (!HTTP_METHODS.includes(method as HttpMethod)) {
    return NextResponse.json({ ok: false, error: "Unsupported HTTP method." }, { status: 400 });
  }

  const path = typeof payload.path === "string" ? payload.path.trim() : "";
  if (!path.startsWith("/")) {
    return NextResponse.json({ ok: false, error: "Path must start with '/'." }, { status: 400 });
  }

  const rawFields = Array.isArray(payload.fields) ? payload.fields : [];
  const fields: MockField[] = rawFields
    .filter(
      (f): f is { name: string; type: string } =>
        !!f &&
        typeof f === "object" &&
        typeof (f as { name?: unknown }).name === "string" &&
        (f as { name: string }).name.trim() !== "" &&
        MOCK_FIELD_TYPES.includes((f as { type?: string }).type as (typeof MOCK_FIELD_TYPES)[number]),
    )
    .map((f) => ({ id: crypto.randomUUID(), name: f.name.trim(), type: f.type as MockField["type"] }));

  if (fields.length === 0) {
    return NextResponse.json({ ok: false, error: "Add at least one valid field." }, { status: 400 });
  }

  const recordCount = Math.max(1, Math.min(MAX_RECORD_COUNT, Math.floor(Number(payload.recordCount)) || 1));
  const responseShape = payload.responseShape === "object" ? "object" : "array";
  const statusNum = Number(payload.status);
  const status = Number.isInteger(statusNum) && statusNum >= 100 && statusNum <= 599 ? statusNum : 200;
  const delayMs = Math.max(0, Math.min(MAX_DELAY_MS, Math.floor(Number(payload.delayMs)) || 0));

  const result = createMock({
    method: method as HttpMethod,
    path,
    fields,
    recordCount,
    responseShape,
    status,
    delayMs,
  });

  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
