import { NextResponse } from "next/server";
import { chatRequestSchema, routeRequestWithOpenRouter } from "@/lib/gateway";

export const runtime = "edge";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_CHAT_REQUEST", issues: parsed.error.issues }, { status: 400 });
  }
  return NextResponse.json(await routeRequestWithOpenRouter(parsed.data));
}
