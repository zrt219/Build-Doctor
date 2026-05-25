import { NextResponse } from "next/server";

const defaultMaxJsonBytes = 140_000;

export function jsonResponse(body: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Cache-Control", "no-store");
  return NextResponse.json(body, { ...init, headers });
}

export function safeErrorResponse(code: string, message = "Invalid request.", status = 400, issues?: unknown) {
  return jsonResponse(
    {
      ok: false,
      error: {
        code,
        message,
        ...(process.env.NODE_ENV === "production" || issues === undefined ? {} : { issues }),
      },
    },
    { status },
  );
}

export async function readJsonBody(request: Request, maxJsonBytes = defaultMaxJsonBytes) {
  const contentType = request.headers.get("content-type");
  if (contentType && !contentType.toLowerCase().includes("application/json")) {
    return {
      ok: false as const,
      response: safeErrorResponse("UNSUPPORTED_MEDIA_TYPE", "Expected JSON request body.", 415),
    };
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > maxJsonBytes) {
    return {
      ok: false as const,
      response: safeErrorResponse("PAYLOAD_TOO_LARGE", "Request body is too large for the public demo.", 413),
    };
  }

  const body = await request.json().catch(() => undefined);
  if (body === undefined) {
    return {
      ok: false as const,
      response: safeErrorResponse("BAD_JSON", "Request body must be valid JSON.", 400),
    };
  }

  return { ok: true as const, body };
}
