import { NextResponse } from "next/server";
import { getIntegrationHealth, recordSuiteEvent } from "@/lib/integrations";

const app = "resume-evidence-rag-auditor";

export async function GET() {
  return NextResponse.json(getIntegrationHealth(app));
}

export async function POST() {
  const result = await recordSuiteEvent({
    app,
    eventType: "integration_probe",
    summary: "Resume Evidence RAG Auditor integration-health probe from reviewer QA.",
    payload: { route: "/api/integration-health", source: "reviewer-packet" },
  });
  return NextResponse.json({ app, result, health: getIntegrationHealth(app) });
}
