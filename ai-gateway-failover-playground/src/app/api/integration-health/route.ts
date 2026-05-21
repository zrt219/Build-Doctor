import { NextResponse } from "next/server";
import { getIntegrationHealth } from "@/lib/integrations";

const app = "ai-gateway-failover-playground";

export async function GET() {
  return NextResponse.json(getIntegrationHealth(app));
}
