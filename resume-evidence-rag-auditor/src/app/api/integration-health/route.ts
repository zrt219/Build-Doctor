import { NextResponse } from "next/server";
import { getIntegrationHealth } from "@/lib/integrations";

const app = "resume-evidence-rag-auditor";

export async function GET() {
  return NextResponse.json(getIntegrationHealth(app));
}
