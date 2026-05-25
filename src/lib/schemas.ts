import { z } from "zod";

export const failureTypeSchema = z.enum([
  "MISSING_ENV_VAR",
  "TYPESCRIPT_ERROR",
  "MODULE_NOT_FOUND",
  "NEXT_BUILD_ERROR",
  "NEXT_STATIC_GENERATION_ERROR",
  "PACKAGE_INSTALL_ERROR",
  "PNPM_LOCKFILE_MISMATCH",
  "PACKAGE_JSON_PARSE",
  "SPAWN_PERMISSION",
  "VERCEL_ENV_VAR_MISSING",
  "SERVERLESS_FUNCTION_LIMIT",
  "ESLINT_BUILD_ERROR",
  "VITE_BUILD_ERROR",
  "APP_ROUTER_ROUTE_HANDLER_ERROR",
  "PRISMA_DATABASE_ERROR",
  "SUPABASE_CONFIG_ERROR",
  "STRIPE_WEBHOOK_ERROR",
  "VERCEL_RUNTIME_ERROR",
  "OUT_OF_MEMORY",
  "UNKNOWN",
]);

export type FailureType = z.infer<typeof failureTypeSchema>;

export const taxonomyEntrySchema = z.object({
  id: failureTypeSchema,
  label: z.string(),
  description: z.string(),
  symptoms: z.array(z.string()),
  likelyCauses: z.array(z.string()),
  fixSteps: z.array(z.string()),
  verificationCommands: z.array(z.string()),
  preventionChecks: z.array(z.string()),
});

export const evidenceLineSchema = z.object({
  lineNumber: z.number(),
  kind: z.enum(["error", "warning", "stack", "file", "info"]),
  content: z.string(),
});

export const traceStepSchema = z.object({
  id: z.string(),
  label: z.string(),
  status: z.enum(["complete", "warning", "skipped"]),
  inputSummary: z.string(),
  outputSummary: z.string(),
  evidenceRefs: z.array(z.string()),
  summary: z.string().optional(),
  detail: z.string().optional(),
});

export const graphRunSchema = z.object({
  id: z.string(),
  mode: z.literal("local-deterministic"),
  nodeSequence: z.array(z.string()),
  checkpointSafe: z.boolean(),
  approvalState: z.enum(["not_required", "pending", "approved", "rejected"]),
  providerStatus: z.enum(["disabled", "skipped", "mocked", "blocked", "unavailable", "complete"]),
});

export const patchDraftSchema = z.object({
  title: z.string(),
  failureType: failureTypeSchema,
  likelyAffectedFiles: z.array(z.string()),
  rationale: z.string(),
  snippet: z.string(),
  verificationCommands: z.array(z.string()),
  risks: z.array(z.string()),
  confidence: z.enum(["high", "medium", "low"]),
  affectedFiles: z.array(z.string()).optional(),
  snippetLanguage: z.enum(["bash", "ts", "tsx", "js", "json", "env", "text"]).optional(),
  verificationNote: z.string().optional(),
});

export const solutionSuggestionSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  whenToUse: z.string(),
  failureType: failureTypeSchema,
  confidence: z.enum(["high", "medium", "low"]),
  likelyAffectedFiles: z.array(z.string()),
  envVars: z
    .array(
      z.object({
        name: z.string(),
        visibility: z.enum(["public_client", "server_only", "unknown"]),
        required: z.boolean(),
        placeholder: z.string(),
        warning: z.string().optional(),
      }),
    )
    .optional(),
  steps: z.array(z.string()),
  snippet: z
    .object({
      label: z.string(),
      language: z.enum(["bash", "ts", "json", "env", "txt"]),
      value: z.string(),
    })
    .optional(),
  verificationCommands: z.array(z.string()),
  risks: z.array(z.string()),
  reportInsert: z.string(),
});

export const autofillFixPlanSchema = z.object({
  title: z.string(),
  selectedSuggestionIds: z.array(z.string()),
  editablePlan: z.string(),
  commands: z.array(z.string()),
  snippets: z.array(
    z.object({
      label: z.string(),
      language: z.string(),
      value: z.string(),
    }),
  ),
});

export const aiPatchReviewSchema = z.object({
  enabled: z.boolean(),
  provider: z.literal("openrouter"),
  model: z.string(),
  summary: z.string(),
  improvedExplanation: z.string(),
  patchReview: z.string(),
  cautions: z.array(z.string()),
  suggestedVerification: z.array(z.string()),
  confidence: z.enum(["high", "medium", "low"]),
  usedSanitizedInputOnly: z.boolean(),
});

export const cachedProviderReviewSchema = z.object({
  label: z.literal("Cached DeepSeek demo review"),
  cached: z.literal(true),
  summary: z.string(),
  improvedExplanation: z.string(),
  patchReview: z.string(),
  cautions: z.array(z.string()),
  suggestedVerification: z.array(z.string()),
  confidence: z.enum(["high", "medium", "low"]),
});

export const diagnosisSchema = z.object({
  failureType: failureTypeSchema,
  label: z.string(),
  confidence: z.number().min(0).max(1),
  affectedSubsystem: z.string(),
  probableRootCause: z.string(),
  evidence: z.array(evidenceLineSchema),
  affectedFiles: z.array(z.string()),
  warnings: z.array(z.string()),
  fixPlan: z.array(z.string()),
  patchChecklist: z.array(z.string()),
  traceSteps: z.array(traceStepSchema),
  graphRun: graphRunSchema,
  patchDraft: patchDraftSchema,
  solutionSuggestions: z.array(solutionSuggestionSchema),
  autofillFixPlan: autofillFixPlanSchema,
  aiPatchReview: aiPatchReviewSchema.optional(),
  verificationCommands: z.array(z.string()),
  preventionChecklist: z.array(z.string()),
  readinessReport: z.object({
    status: z.enum(["READY_AFTER_FIX", "NEEDS_REVIEW", "BLOCKED"]),
    summary: z.string(),
    remainingRisks: z.array(z.string()),
  }),
  redactedLog: z.string(),
  redactions: z.array(z.string()),
  generatedAt: z.string(),
});

export type Diagnosis = z.infer<typeof diagnosisSchema>;
export type EvidenceLine = z.infer<typeof evidenceLineSchema>;
export type TraceStep = z.infer<typeof traceStepSchema>;
export type GraphRun = z.infer<typeof graphRunSchema>;
export type PatchDraft = z.infer<typeof patchDraftSchema>;
export type SolutionSuggestion = z.infer<typeof solutionSuggestionSchema>;
export type AutofillFixPlan = z.infer<typeof autofillFixPlanSchema>;
export type AiPatchReview = z.infer<typeof aiPatchReviewSchema>;
export type CachedProviderReview = z.infer<typeof cachedProviderReviewSchema>;

export const maxBuildLogInputChars = 120_000;

export const diagnoseRequestSchema = z.object({
  log: z
    .string()
    .min(1)
    .max(maxBuildLogInputChars, "Build log is too large for the public demo. Redact secrets and trim to the failing section before retrying."),
  sampleId: z.string().optional(),
});

export const reportRequestSchema = z.object({
  diagnosis: diagnosisSchema,
  providerStatus: z
    .enum([
      "disabled",
      "mock",
      "openrouter_success",
      "openrouter_missing_key",
      "unsafe_paid_model_blocked",
      "unsupported_model",
      "free_model_rate_limited",
      "free_model_unavailable",
      "llm_json_parse_failed",
      "llm_schema_validation_failed",
      "llm_timeout",
      "llm_error",
    ])
    .optional(),
  cachedProviderReview: cachedProviderReviewSchema.optional(),
  selectedSolutionSuggestions: z.array(solutionSuggestionSchema).optional(),
  autofillFixPlan: autofillFixPlanSchema.optional(),
});

export const enrichRequestSchema = z.object({
  diagnosis: diagnosisSchema,
});

export const evalCaseResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  expected: failureTypeSchema,
  actual: failureTypeSchema,
  result: z.enum(["PASS", "PARTIAL", "FAIL"]),
  notes: z.array(z.string()),
});

export const evalResultsSchema = z.object({
  total: z.number(),
  passed: z.number(),
  partial: z.number(),
  failed: z.number(),
  score: z.number(),
  cases: z.array(evalCaseResultSchema),
});

export type EvalResults = z.infer<typeof evalResultsSchema>;
