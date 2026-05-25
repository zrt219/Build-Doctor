import { jsonResponse, readJsonBody, safeErrorResponse } from "../_utils";
import { providerStatusMessage, reviewWithOpenRouterDeepSeek, sanitizeDiagnosisForOpenRouter } from "@/lib/build-doctor/openrouter";
import { containsUnredactedSecret } from "@/lib/redact-secrets";
import { enrichRequestSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const bodyResult = await readJsonBody(request);
  if (!bodyResult.ok) {
    return bodyResult.response;
  }

  const parsed = enrichRequestSchema.safeParse(bodyResult.body);

  if (!parsed.success) {
    return jsonResponse(
      {
        ok: false,
        data: null,
        aiPatchReview: null,
        error: { code: "INVALID_DIAGNOSIS", message: "Request body failed validation." },
      },
      { status: 400 },
    );
  }

  const sanitizedDiagnosis = sanitizeDiagnosisForOpenRouter(parsed.data.diagnosis);

  if (containsUnredactedSecret(JSON.stringify(sanitizedDiagnosis))) {
    return safeErrorResponse("UNREDACTED_SECRET", "Diagnosis contains unredacted secret-like values.", 400);
  }

  if (process.env.ENABLE_LLM_ENRICHMENT !== "true" || process.env.LLM_PROVIDER !== "openrouter") {
    const providerStatus = "disabled" as const;
    return jsonResponse({
      ok: false,
      data: null,
      aiPatchReview: null,
      error: providerStatusMessage(providerStatus),
      providerStatus,
    });
  }

  const result = await reviewWithOpenRouterDeepSeek({ sanitizedDiagnosis });
  const message = providerStatusMessage(result.providerStatus);

  return jsonResponse({
    ok: Boolean(result.aiPatchReview),
    data: result.aiPatchReview ? { aiPatchReview: result.aiPatchReview, providerStatus: result.providerStatus } : null,
    aiPatchReview: result.aiPatchReview,
    error: result.aiPatchReview ? undefined : message,
    providerStatus: result.providerStatus,
  });
}
