import type { AiPatchReview, Diagnosis } from "../schemas";
import { diagnosisSchema } from "../schemas";
import { redactSecrets } from "../redact-secrets";
import {
  DEEPSEEK_FREE_MODEL,
  extractJsonObjectFromModelText,
  providerStatusMessage,
  reviewWithOpenRouterDeepSeek,
  validateOpenRouterModel,
  type ProviderStatus,
} from "./llm/openrouter-deepseek";

export {
  DEEPSEEK_FREE_MODEL,
  extractJsonObjectFromModelText,
  providerStatusMessage,
  reviewWithOpenRouterDeepSeek,
  validateOpenRouterModel,
  type ProviderStatus,
};

export type OpenRouterEnrichmentResult = {
  aiPatchReview: AiPatchReview | null;
  providerStatus: ProviderStatus;
};

export function getBuildDoctorOpenRouterConfig() {
  const enabled = process.env.ENABLE_LLM_ENRICHMENT === "true";
  const provider = process.env.LLM_PROVIDER ?? "mock";
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || DEEPSEEK_FREE_MODEL;
  const missingEnv = [
    ...(!enabled ? ["ENABLE_LLM_ENRICHMENT=true"] : []),
    ...(provider !== "openrouter" ? ["LLM_PROVIDER=openrouter"] : []),
    ...(!apiKey ? ["OPENROUTER_API_KEY"] : []),
  ];

  return {
    enabled,
    provider,
    apiKey,
    model,
    siteUrl: process.env.OPENROUTER_SITE_URL ?? "http://localhost:3000",
    appTitle: process.env.OPENROUTER_APP_TITLE ?? "Build Doctor",
    configured: enabled && provider === "openrouter" && Boolean(apiKey),
    missingEnv,
  };
}

export function sanitizeDiagnosisForOpenRouter(diagnosis: Diagnosis) {
  const parsed = diagnosisSchema.parse(diagnosis);
  const serialized = JSON.stringify({
    failureType: parsed.failureType,
    label: parsed.label,
    confidence: parsed.confidence,
    affectedSubsystem: parsed.affectedSubsystem,
    probableRootCause: parsed.probableRootCause,
    evidence: parsed.evidence,
    affectedFiles: parsed.affectedFiles,
    traceSteps: parsed.traceSteps,
    patchDraft: parsed.patchDraft,
    verificationCommands: parsed.verificationCommands,
    remainingRisks: parsed.readinessReport.remainingRisks,
    redactions: parsed.redactions,
  });
  const { redacted } = redactSecrets(serialized);
  return JSON.parse(redacted) as unknown;
}

export async function enrichDiagnosisWithOpenRouter(
  input: { sanitizedDiagnosis: unknown; model?: string; timeoutMs?: number },
  fetchImpl: typeof fetch = fetch,
): Promise<OpenRouterEnrichmentResult> {
  const config = getBuildDoctorOpenRouterConfig();
  if (!config.enabled || config.provider !== "openrouter") {
    return { aiPatchReview: null, providerStatus: "disabled" };
  }

  return reviewWithOpenRouterDeepSeek({
    sanitizedDiagnosis: input.sanitizedDiagnosis,
    model: input.model ?? config.model,
    timeoutMs: input.timeoutMs,
    fetchImpl,
  });
}
