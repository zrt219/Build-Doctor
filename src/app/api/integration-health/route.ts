import { NextResponse } from "next/server";
import { getIntegrationHealth } from "@/lib/integrations";

const app = "vercel-build-doctor-agent";

export async function GET() {
  return NextResponse.json(getIntegrationHealth(app));
}
