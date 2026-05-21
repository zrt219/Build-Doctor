import { NextResponse } from "next/server";
import { providerStatusMessage, reviewWithOpenRouterDeepSeek, sanitizeDiagnosisForOpenRouter } from "@/lib/build-doctor/openrouter";
import { containsUnredactedSecret } from "@/lib/redact-secrets";
import { enrichRequestSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = enrichRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { aiPatchReview: null, error: "Request body failed validation." },
      { status: 400 },
    );
  }

  const sanitizedDiagnosis = sanitizeDiagnosisForOpenRouter(parsed.data.diagnosis);

  if (containsUnredactedSecret(JSON.stringify(sanitizedDiagnosis))) {
    return NextResponse.json(
      { aiPatchReview: null, error: "Diagnosis contains unredacted secret-like values." },
      { status: 400 },
    );
  }

  if (process.env.ENABLE_LLM_ENRICHMENT !== "true" || process.env.LLM_PROVIDER !== "openrouter") {
    const providerStatus = "disabled" as const;
    return NextResponse.json({
      aiPatchReview: null,
      error: providerStatusMessage(providerStatus),
      providerStatus,
    });
  }

  const result = await reviewWithOpenRouterDeepSeek({ sanitizedDiagnosis });
  const message = providerStatusMessage(result.providerStatus);

  return NextResponse.json({
    aiPatchReview: result.aiPatchReview,
    error: result.aiPatchReview ? undefined : message,
    providerStatus: result.providerStatus,
  });
}
