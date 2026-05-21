import { NextResponse } from "next/server";
import { getIntegrationHealth } from "@/lib/integrations";

const app = "enterprise-agent-workflow-studio";

export async function GET() {
  return NextResponse.json(getIntegrationHealth(app));
}
