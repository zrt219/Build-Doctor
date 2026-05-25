import { jsonResponse, readJsonBody, safeErrorResponse } from "../_utils";
import { generateIncidentReport } from "@/lib/build-doctor";
import { reportRequestSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const bodyResult = await readJsonBody(request);
  if (!bodyResult.ok) {
    return bodyResult.response;
  }

  const parsed = reportRequestSchema.safeParse(bodyResult.body);

  if (!parsed.success) {
    return safeErrorResponse("INVALID_DIAGNOSIS", "Request body failed validation.", 400, parsed.error.issues);
  }

  const report = generateIncidentReport(parsed.data.diagnosis, {
      providerStatus: parsed.data.providerStatus,
      cachedProviderReview: parsed.data.cachedProviderReview,
      selectedSolutionSuggestions: parsed.data.selectedSolutionSuggestions,
      autofillFixPlan: parsed.data.autofillFixPlan,
    });

  return jsonResponse({
    ok: true,
    data: { report, format: "markdown", rawLogStored: false },
    report,
    format: "markdown",
    rawLogStored: false,
  });
}
