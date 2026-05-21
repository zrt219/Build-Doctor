import { z } from "zod";
import type { AiPatchReview } from "../../schemas";
import { containsUnredactedSecret } from "../../redact-secrets";

export const DEEPSEEK_FREE_MODEL = "deepseek/deepseek-v4-flash:free";

export type ProviderStatus =
  | "disabled"
  | "mock"
  | "openrouter_success"
  | "openrouter_missing_key"
  | "unsafe_paid_model_blocked"
  | "unsupported_model"
  | "free_model_rate_limited"
  | "free_model_unavailable"
  | "llm_json_parse_failed"
  | "llm_schema_validation_failed"
  | "llm_timeout"
  | "llm_error";

export const AiPatchReviewSchema = z.object({
  summary: z.string().min(1),
  improvedExplanation: z.string().min(1),
  patchReview: z.string().min(1),
  cautions: z.array(z.string()).default([]),
  suggestedVerification: z.array(z.string()).default([]),
  confidence: z.enum(["high", "medium", "low"]),
});

export function validateOpenRouterModel(model: string): {
  allowed: boolean;
  providerStatus?: ProviderStatus;
} {
  const allowPaid = process.env.ALLOW_PAID_LLM_MODELS === "true";

  if (model === "openrouter/auto" || model === "openrouter/free") {
    return {
      allowed: false,
      providerStatus: "unsafe_paid_model_blocked",
    };
  }

  if (!allowPaid && !model.endsWith(":free")) {
    return {
      allowed: false,
      providerStatus: "unsafe_paid_model_blocked",
    };
  }

  if (model !== DEEPSEEK_FREE_MODEL) {
    return {
      allowed: false,
      providerStatus: "unsupported_model",
    };
  }

  return { allowed: true };
}

export function extractJsonObjectFromModelText(text: string): unknown | null {
  const trimmed = text.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    // Continue with tolerant extraction for plain JSON mode.
  }

  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fencedMatch?.[1]) {
    try {
      return JSON.parse(fencedMatch[1].trim());
    } catch {
      // Continue with brace extraction.
    }
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    try {
      return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
    } catch {
      return null;
    }
  }

  return null;
}

export function providerStatusMessage(status: ProviderStatus) {
  switch (status) {
    case "openrouter_success":
      return "DeepSeek review added.";
    case "free_model_rate_limited":
      return "DeepSeek free provider is rate-limited. The deterministic diagnosis remains available.";
    case "free_model_unavailable":
      return "DeepSeek free review is unavailable. The deterministic diagnosis is still available.";
    case "llm_json_parse_failed":
      return "DeepSeek returned invalid JSON. The deterministic diagnosis is still available.";
    case "llm_schema_validation_failed":
      return "DeepSeek response failed validation. The deterministic diagnosis is still available.";
    case "unsafe_paid_model_blocked":
      return "Paid model blocked by safety settings.";
    case "unsupported_model":
      return `Only ${DEEPSEEK_FREE_MODEL} is allowed in this demo.`;
    case "openrouter_missing_key":
      return "OpenRouter key is missing. Build Doctor is running in deterministic mode.";
    case "disabled":
      return "Live LLM review is disabled. Build Doctor is running in deterministic mode.";
    case "llm_timeout":
      return "DeepSeek review timed out. The deterministic diagnosis is still available.";
    case "mock":
      return "Mock provider mode is active. Build Doctor is running in deterministic mode.";
    case "llm_error":
    default:
      return "Optional review did not run. The deterministic diagnosis remains available.";
  }
}

function buildDeepSeekRequestBody(model: string, sanitizedDiagnosis: unknown) {
  return {
    model,
    temperature: 0,
    max_tokens: 900,
    messages: [
      {
        role: "system",
        content: [
          "You are reviewing a deterministic build diagnosis.",
          "The deterministic diagnosis is the source of truth.",
          "Return ONLY valid JSON.",
          "No markdown.",
          "No code fences.",
          "No explanation outside JSON.",
          "Do not reveal chain-of-thought.",
          "Do not invent files.",
          "Do not invent repository context.",
          "Do not request secrets.",
          "Do not reclassify the failure unless the deterministic evidence is internally inconsistent.",
        ].join(" "),
      },
      {
        role: "user",
        content: JSON.stringify({
          task: "Return a JSON AI patch review for this sanitized deterministic Build Doctor diagnosis.",
          requiredJsonShape: {
            summary: "string",
            improvedExplanation: "string",
            patchReview: "string",
            cautions: ["string"],
            suggestedVerification: ["string"],
            confidence: "high | medium | low",
          },
          sanitizedDiagnosis,
        }),
      },
    ],
  };
}

export async function reviewWithOpenRouterDeepSeek(input: {
  sanitizedDiagnosis: unknown;
  model?: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}): Promise<{
  aiPatchReview: AiPatchReview | null;
  providerStatus: ProviderStatus;
}> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = input.model ?? process.env.OPENROUTER_MODEL ?? DEEPSEEK_FREE_MODEL;

  if (!apiKey) {
    return {
      aiPatchReview: null,
      providerStatus: "openrouter_missing_key",
    };
  }

  const modelGuard = validateOpenRouterModel(model);
  if (!modelGuard.allowed) {
    return {
      aiPatchReview: null,
      providerStatus: modelGuard.providerStatus ?? "unsupported_model",
    };
  }

  const serialized = JSON.stringify(input.sanitizedDiagnosis);
  if (containsUnredactedSecret(serialized)) {
    return {
      aiPatchReview: null,
      providerStatus: "llm_error",
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), input.timeoutMs ?? 15000);
  const fetchImpl = input.fetchImpl ?? fetch;

  try {
    const response = await fetchImpl("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.OPENROUTER_SITE_URL ?? "http://localhost:3000",
        "X-OpenRouter-Title": process.env.OPENROUTER_APP_TITLE ?? "Build Doctor",
      },
      body: JSON.stringify(buildDeepSeekRequestBody(model, input.sanitizedDiagnosis)),
    });

    if (response.status === 429) {
      return {
        aiPatchReview: null,
        providerStatus: "free_model_rate_limited",
      };
    }

    if (response.status === 503) {
      return {
        aiPatchReview: null,
        providerStatus: "free_model_unavailable",
      };
    }

    if (!response.ok) {
      return {
        aiPatchReview: null,
        providerStatus: "llm_error",
      };
    }

    const json = await response.json();
    const content = json?.choices?.[0]?.message?.content;

    if (!content || typeof content !== "string") {
      return {
        aiPatchReview: null,
        providerStatus: "llm_json_parse_failed",
      };
    }

    const extracted = extractJsonObjectFromModelText(content);

    if (!extracted) {
      return {
        aiPatchReview: null,
        providerStatus: "llm_json_parse_failed",
      };
    }

    const parsed = AiPatchReviewSchema.safeParse(extracted);

    if (!parsed.success) {
      return {
        aiPatchReview: null,
        providerStatus: "llm_schema_validation_failed",
      };
    }

    return {
      providerStatus: "openrouter_success",
      aiPatchReview: {
        enabled: true,
        provider: "openrouter",
        model,
        summary: parsed.data.summary,
        improvedExplanation: parsed.data.improvedExplanation,
        patchReview: parsed.data.patchReview,
        cautions: parsed.data.cautions,
        suggestedVerification: parsed.data.suggestedVerification,
        confidence: parsed.data.confidence,
        usedSanitizedInputOnly: true,
      },
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return {
        aiPatchReview: null,
        providerStatus: "llm_timeout",
      };
    }

    return {
      aiPatchReview: null,
      providerStatus: "llm_error",
    };
  } finally {
    clearTimeout(timeout);
  }
}
