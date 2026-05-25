import { jsonResponse } from "../_utils";
import { runEvalSuite } from "@/lib/build-doctor";
import { sampleLogs } from "@/lib/sample-logs";

export async function GET() {
  const evals = runEvalSuite();
  const health = {
    service: "vercel-build-doctor-agent",
    status: evals.failed === 0 ? "READY" : "REVIEW",
    mode: "DETERMINISTIC DEMO",
    checks: {
      sampleLogs: sampleLogs.length,
      evalScore: evals.score,
      diagnosisApi: true,
      reportExport: true,
      secretRedaction: true,
      suiteHub: true,
      buildDoctorRoute: "/build-doctor",
    },
    generatedAt: new Date().toISOString(),
  };

  return jsonResponse({ ok: true, data: health, ...health });
}
