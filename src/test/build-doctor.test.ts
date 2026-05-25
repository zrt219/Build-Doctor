import { describe, expect, it, vi } from "vitest";
import { POST as diagnosePost } from "@/app/api/diagnose/route";
import { POST as enrichPost } from "@/app/api/enrich/route";
import { GET as evalGet } from "@/app/api/eval/route";
import { GET as healthGet } from "@/app/api/health/route";
import { GET as integrationHealthGet } from "@/app/api/integration-health/route";
import { POST as reportPost } from "@/app/api/report/route";
import { diagnoseBuildLog, generateIncidentReport, runEvalSuite } from "@/lib/build-doctor";
import { getAllCachedDeepSeekDemoReviews, getCachedDeepSeekDemoReview } from "@/lib/build-doctor/cached-demo-reviews";
import { DEEPSEEK_FREE_MODEL, enrichDiagnosisWithOpenRouter, extractJsonObjectFromModelText, getBuildDoctorOpenRouterConfig, sanitizeDiagnosisForOpenRouter, validateOpenRouterModel } from "@/lib/build-doctor/openrouter";
import { checkpointDiagnosisSnapshot } from "@/lib/build-doctor/graph";
import { getIntegrationHealth, recordSuiteEvent } from "@/lib/integrations";
import { containsUnredactedSecret, redactSecrets } from "@/lib/redact-secrets";
import { sampleLogs } from "@/lib/sample-logs";

describe("Vercel Build Doctor deterministic engine", () => {
  it("classifies every sample log as the expected failure type", () => {
    for (const sample of sampleLogs) {
      expect(diagnoseBuildLog(sample.log).failureType, sample.title).toBe(sample.expected);
    }
  });

  it("redacts secret-looking values before returning diagnostic logs", () => {
    const databaseUrl = ["postgresql://user", ":", "secret", "@db.example.com/app"].join("");
    const apiKey = ["sk", "abcdefghijklmnopqrstuvwxyz123456"].join("-");
    const openRouterKey = ["sk-or-v1", "abcdefghijklmnopqrstuvwxyz1234567890"].join("-");
    const bearer = `Bearer ${"abcdefghijklmnopqrstuvwxyz"}`;
    const github = `github_pat_${"abcdef1234567890abcdef1234567890"}`;
    const privateKey = "-----BEGIN PRIVATE KEY-----\nabc123\n-----END PRIVATE KEY-----";
    const cookie = "Cookie: session=secretvalue; other=token";
    const passwordPair = "admin@example.com:supersecret";
    const input = `DATABASE_URL=${databaseUrl} OPENAI_API_KEY=${apiKey} OPENROUTER_API_KEY=${openRouterKey} ${bearer} ${github} ${privateKey} ${cookie} ${passwordPair}`;
    const result = redactSecrets(input);

    expect(result.redacted).not.toContain("user:secret");
    expect(result.redacted).not.toContain(apiKey);
    expect(result.redacted).not.toContain(openRouterKey);
    expect(result.redacted).not.toContain(github);
    expect(result.redacted).not.toContain("supersecret");
    expect(result.redacted).toContain("[REDACTED_DATABASE_URL]");
    expect(result.redacted).toContain("[REDACTED_ENV_VALUE]");
    expect(containsUnredactedSecret(result.redacted)).toBe(false);
  });

  it("runs the eval suite with every fixture passing", () => {
    const evals = runEvalSuite();

    expect(evals.total).toBe(sampleLogs.length);
    expect(evals.failed).toBe(0);
    expect(evals.score).toBeGreaterThanOrEqual(90);
  });

  it("generates a markdown incident report without raw database credentials", () => {
    const prismaSample = sampleLogs.find((sample) => sample.id === "prisma-database-url");
    expect(prismaSample).toBeDefined();

    const diagnosis = diagnoseBuildLog(prismaSample!.log);
    const report = generateIncidentReport(diagnosis);

    expect(report).toContain("# Build Doctor Incident Report");
    expect(report).toContain("## Root Cause");
    expect(report).toContain("## Evidence");
    expect(report).toContain("## Diagnostic Trace");
    expect(report).toContain("## Patch Draft");
    expect(report).toContain("## Optional LLM Review");
    expect(report).toContain("## Verification Commands");
    expect(report).toContain("## Remaining Risks");
    expect(report).toContain("## Export Metadata");
    expect(report).not.toContain("user:secret");
  });

  it("explains optional DeepSeek rate limits in exported reports", () => {
    const diagnosis = diagnoseBuildLog(sampleLogs[1].log);
    const report = generateIncidentReport(diagnosis, { providerStatus: "free_model_rate_limited" });

    expect(report).toContain("## Optional LLM Review");
    expect(report).toContain("Optional DeepSeek review was not included because the free provider was rate-limited. The deterministic diagnosis remains the source of truth.");
    expect(report).toContain("- Optional provider status: free_model_rate_limited");
    expect(report).toContain("## Verification Commands");
  });

  it("provides cached DeepSeek demo reviews for major failure classes", () => {
    const fixtures = getAllCachedDeepSeekDemoReviews();

    expect(Object.keys(fixtures).sort()).toEqual([
      "MODULE_NOT_FOUND",
      "NEXT_BUILD_ERROR",
      "PACKAGE_INSTALL_ERROR",
      "SUPABASE_CONFIG_ERROR",
      "TYPESCRIPT_ERROR",
      "UNKNOWN",
    ]);

    for (const review of Object.values(fixtures)) {
      expect(review.label).toBe("Cached DeepSeek demo review");
      expect(review.cached).toBe(true);
      expect(review.summary.length).toBeGreaterThan(20);
      expect(review.suggestedVerification.length).toBeGreaterThan(0);
    }

    expect(getCachedDeepSeekDemoReview("NEXT_STATIC_GENERATION_ERROR").summary).toBe(fixtures.NEXT_BUILD_ERROR.summary);
    expect(getCachedDeepSeekDemoReview("UNKNOWN").confidence).toBe("low");
  });

  it("labels cached provider review examples in exported reports without marking them live", () => {
    const diagnosis = diagnoseBuildLog(sampleLogs[1].log);
    const cachedProviderReview = getCachedDeepSeekDemoReview(diagnosis.failureType);
    const report = generateIncidentReport(diagnosis, {
      providerStatus: "free_model_rate_limited",
      cachedProviderReview,
    });

    expect(report).toContain("Cached provider review example, not live output");
    expect(report).toContain(cachedProviderReview.summary);
    expect(report).toContain("- Optional provider status: free_model_rate_limited");
    expect(report).toContain("- Cached provider review included: true - cached provider review example, not live output");
    expect(report).toContain("- Optional LLM review included: false");
    expect(report).not.toContain("The optional provider review added:");
    expect(report).not.toContain("DeepSeek review added.");
  });

  it("adds a deterministic trace receipt and patch draft to known diagnoses", () => {
    const typeScriptSample = sampleLogs.find((sample) => sample.expected === "TYPESCRIPT_ERROR");
    expect(typeScriptSample).toBeDefined();
    const diagnosis = diagnoseBuildLog(typeScriptSample!.log);

    expect(diagnosis.probableRootCause).toBeTruthy();
    expect(diagnosis.patchChecklist.length).toBeGreaterThan(0);
    expect(diagnosis.traceSteps.map((step) => step.id)).toEqual([
      "redact-secrets",
      "classify-failure",
      "extract-evidence",
      "map-remediation",
      "prepare-export",
    ]);
    expect(diagnosis.traceSteps.every((step) => ["complete", "warning", "skipped"].includes(step.status))).toBe(true);
    expect(diagnosis.graphRun).toMatchObject({
      mode: "local-deterministic",
      checkpointSafe: true,
      approvalState: "not_required",
      providerStatus: "disabled",
    });
    expect(diagnosis.patchDraft.title).toBeTruthy();
    expect(diagnosis.patchDraft.snippet).toContain("deploymentUrl");
    expect(diagnosis.patchDraft.likelyAffectedFiles.length).toBeGreaterThan(0);
    expect(diagnosis.solutionSuggestions.length).toBeGreaterThanOrEqual(2);
    expect(diagnosis.solutionSuggestions[0]).toMatchObject({
      failureType: "TYPESCRIPT_ERROR",
      confidence: "high",
    });
    expect(diagnosis.autofillFixPlan.editablePlan).toContain(diagnosis.solutionSuggestions[0].title);
    expect(diagnosis.autofillFixPlan.commands).toContain("npm run typecheck");
  });

  it("uses the unknown fallback patch draft when no deterministic class matches", () => {
    const diagnosis = diagnoseBuildLog("[SIMULATED VERCEL LOG]\nUnhandled vendor failure without known rule");

    expect(diagnosis.failureType).toBe("UNKNOWN");
    expect(diagnosis.patchDraft.title).toContain("Collect more context");
    expect(diagnosis.patchDraft.snippet).toContain("No automatic patch suggested");
    expect(diagnosis.patchDraft.confidence).toBe("low");
    expect(diagnosis.traceSteps[1].status).toBe("warning");
    expect(diagnosis.solutionSuggestions[0].title).toContain("Collect more context");
    expect(diagnosis.solutionSuggestions[0].steps.join(" ")).toContain("Avoid applying a code patch");
  });

  it("adds selected deterministic solutions and autofill plans to exported reports", () => {
    const diagnosis = diagnoseBuildLog(sampleLogs[0].log);
    const report = generateIncidentReport(diagnosis, {
      selectedSolutionSuggestions: diagnosis.solutionSuggestions.slice(0, 1),
      autofillFixPlan: diagnosis.autofillFixPlan,
    });

    expect(report).toContain("## Suggested Solutions");
    expect(report).toContain(diagnosis.solutionSuggestions[0].title);
    expect(report).toContain("## Autofill Fix Plan");
    expect(report).toContain("Editable deterministic fix plan");
    expect(report).toContain("- Suggested solutions included: 1");
    expect(report).not.toContain("SUPABASE_SERVICE_ROLE_KEY=");
  });

  it("returns deterministic patch drafts for every taxonomy class", () => {
    for (const sample of sampleLogs) {
      const diagnosis = diagnoseBuildLog(sample.log);
      expect(diagnosis.patchDraft.failureType).toBe(diagnosis.failureType);
      expect(diagnosis.patchDraft.verificationCommands.length).toBeGreaterThan(0);
      expect(diagnosis.patchDraft.risks.length).toBeGreaterThan(0);
    }
  });

  it("classifies package JSON parse and spawn permission failures", () => {
    expect(diagnoseBuildLog("npm ERR! code EJSONPARSE\nFailed to parse package.json").failureType).toBe("PACKAGE_JSON_PARSE");
    expect(diagnoseBuildLog("Error: spawn ./scripts/build.sh EACCES\npermission denied").failureType).toBe("SPAWN_PERMISSION");
    expect(diagnoseBuildLog("ERR_PNPM_OUTDATED_LOCKFILE Cannot install with frozen-lockfile because pnpm-lock.yaml is not up to date").failureType).toBe("PNPM_LOCKFILE_MISMATCH");
    expect(diagnoseBuildLog("Error occurred prerendering page \"/reports\". Export encountered errors").failureType).toBe("NEXT_STATIC_GENERATION_ERROR");
    expect(diagnoseBuildLog("Route handler /api/report failed\nsrc/app/api/report/route.ts").failureType).toBe("APP_ROUTER_ROUTE_HANDLER_ERROR");
    expect(diagnoseBuildLog("Serverless Function has exceeded the maximum execution duration. FUNCTION_INVOCATION_TIMEOUT").failureType).toBe("SERVERLESS_FUNCTION_LIMIT");
    expect(diagnoseBuildLog("ESLint: React Hook useEffect has a missing dependency. Failed to compile").failureType).toBe("ESLINT_BUILD_ERROR");
    expect(diagnoseBuildLog("vite build\nRollup failed to resolve import").failureType).toBe("VITE_BUILD_ERROR");
  });

  it("creates checkpoint-safe local graph snapshots without raw logs", () => {
    const diagnosis = diagnoseBuildLog(sampleLogs[1].log);
    const snapshot = checkpointDiagnosisSnapshot(diagnosis);

    expect(snapshot.traceStepIds).toEqual(diagnosis.graphRun.nodeSequence);
    expect(JSON.stringify(snapshot)).not.toContain("[SIMULATED VERCEL LOG]");
  });

  it("allows DeepSeek free and blocks unsafe paid/router models by default", () => {
    const previousAllowPaid = process.env.ALLOW_PAID_LLM_MODELS;
    process.env.ALLOW_PAID_LLM_MODELS = "false";

    expect(validateOpenRouterModel(DEEPSEEK_FREE_MODEL)).toMatchObject({ allowed: true });
    expect(validateOpenRouterModel("openrouter/free")).toMatchObject({ allowed: false, providerStatus: "unsafe_paid_model_blocked" });
    expect(validateOpenRouterModel("openrouter/auto")).toMatchObject({ allowed: false, providerStatus: "unsafe_paid_model_blocked" });
    expect(validateOpenRouterModel("openai/gpt-4o")).toMatchObject({ allowed: false, providerStatus: "unsafe_paid_model_blocked" });
    expect(validateOpenRouterModel("anthropic/claude-sonnet-4.5")).toMatchObject({ allowed: false, providerStatus: "unsafe_paid_model_blocked" });
    expect(validateOpenRouterModel("google/gemini-2.5-flash-lite")).toMatchObject({ allowed: false, providerStatus: "unsafe_paid_model_blocked" });
    expect(validateOpenRouterModel("google/gemma-4-31b-it:free")).toMatchObject({ allowed: false, providerStatus: "unsupported_model" });

    if (previousAllowPaid === undefined) delete process.env.ALLOW_PAID_LLM_MODELS;
    else process.env.ALLOW_PAID_LLM_MODELS = previousAllowPaid;
  });

  it("extracts plain JSON from direct, fenced, and prefixed model text", () => {
    expect(extractJsonObjectFromModelText("{\"summary\":\"ok\"}")).toEqual({ summary: "ok" });
    expect(extractJsonObjectFromModelText("```json\n{\"summary\":\"ok\"}\n```")).toEqual({ summary: "ok" });
    expect(extractJsonObjectFromModelText("Here is JSON {\"summary\":\"ok\"}")).toEqual({ summary: "ok" });
    expect(extractJsonObjectFromModelText("not json")).toBeNull();
  });

  it("sanitizes DeepSeek payloads and parses valid JSON review output", async () => {
    const previousKey = process.env.OPENROUTER_API_KEY;
    const previousEnabled = process.env.ENABLE_LLM_ENRICHMENT;
    const previousProvider = process.env.LLM_PROVIDER;
    const previousMockProvider = process.env.MOCK_LLM_PROVIDER;
    const previousAllowPaid = process.env.ALLOW_PAID_LLM_MODELS;
    process.env.ENABLE_LLM_ENRICHMENT = "true";
    process.env.LLM_PROVIDER = "openrouter";
    process.env.MOCK_LLM_PROVIDER = "true";
    process.env.ALLOW_PAID_LLM_MODELS = "false";
    process.env.OPENROUTER_API_KEY = "sk-or-v1-testkeytestkeytestkeytestkey";
    const diagnosis = diagnoseBuildLog(`${sampleLogs[1].log}\nOPENROUTER_API_KEY=sk-or-v1-${"a".repeat(32)}`);
    const sanitized = sanitizeDiagnosisForOpenRouter(diagnosis);
    expect(JSON.stringify(sanitized)).not.toContain("sk-or-v1-");

    const fetchMock = vi.fn(async (_url: string | URL | Request, _init?: RequestInit) => {
      return new Response(JSON.stringify({
        choices: [{ message: { content: JSON.stringify({
          summary: "The deterministic patch is consistent with the evidence.",
          improvedExplanation: "The type contract needs alignment before build retry.",
          patchReview: "Patch target is appropriate; verify with typecheck.",
          cautions: ["Do not rename fields without checking API producers."],
          suggestedVerification: ["npm run typecheck", "npm run build"],
          confidence: "high",
        }) } }],
      }), { status: 200 });
    });

    const result = await enrichDiagnosisWithOpenRouter({ sanitizedDiagnosis: sanitized, model: DEEPSEEK_FREE_MODEL }, fetchMock as unknown as typeof fetch);
    expect(result.providerStatus).toBe("openrouter_success");
    expect(result.aiPatchReview?.provider).toBe("openrouter");
    expect(result.aiPatchReview?.model).toBe(DEEPSEEK_FREE_MODEL);
    expect(result.aiPatchReview?.usedSanitizedInputOnly).toBe(true);
    const completionCall = fetchMock.mock.calls.find((call) => String(call[0]).includes("/chat/completions"));
    const completionBody = JSON.parse(String(completionCall?.[1]?.body));
    expect(completionBody.response_format).toBeUndefined();
    expect(completionBody.max_tokens).toBe(900);
    expect(completionBody.model).toBe(DEEPSEEK_FREE_MODEL);
    expect(JSON.stringify(fetchMock.mock.calls)).not.toContain("sk-or-v1-aaaaaaaa");
    if (previousKey === undefined) delete process.env.OPENROUTER_API_KEY;
    else process.env.OPENROUTER_API_KEY = previousKey;
    if (previousEnabled === undefined) delete process.env.ENABLE_LLM_ENRICHMENT;
    else process.env.ENABLE_LLM_ENRICHMENT = previousEnabled;
    if (previousProvider === undefined) delete process.env.LLM_PROVIDER;
    else process.env.LLM_PROVIDER = previousProvider;
    if (previousMockProvider === undefined) delete process.env.MOCK_LLM_PROVIDER;
    else process.env.MOCK_LLM_PROVIDER = previousMockProvider;
    if (previousAllowPaid === undefined) delete process.env.ALLOW_PAID_LLM_MODELS;
    else process.env.ALLOW_PAID_LLM_MODELS = previousAllowPaid;
  });

  it("uses DeepSeek plain JSON mode without response_format", async () => {
    const previousKey = process.env.OPENROUTER_API_KEY;
    const previousEnabled = process.env.ENABLE_LLM_ENRICHMENT;
    const previousProvider = process.env.LLM_PROVIDER;
    const previousMockProvider = process.env.MOCK_LLM_PROVIDER;
    const previousAllowPaid = process.env.ALLOW_PAID_LLM_MODELS;
    process.env.ENABLE_LLM_ENRICHMENT = "true";
    process.env.LLM_PROVIDER = "openrouter";
    process.env.MOCK_LLM_PROVIDER = "true";
    process.env.ALLOW_PAID_LLM_MODELS = "false";
    process.env.OPENROUTER_API_KEY = "sk-or-v1-testkeytestkeytestkeytestkey";
    const fetchMock = vi.fn(async (_url: string | URL | Request, _init?: RequestInit) => {
      return new Response(JSON.stringify({
        choices: [{ message: { content: JSON.stringify({
          summary: "DeepSeek reviewed the deterministic diagnosis.",
          improvedExplanation: "The type contract mismatch should be fixed before redeploying.",
          patchReview: "The patch draft matches the deterministic evidence.",
          cautions: ["Do not treat this review as the classifier."],
          suggestedVerification: ["npm run typecheck", "npm run build"],
          confidence: "medium",
        }) } }],
      }), { status: 200 });
    });

    const result = await enrichDiagnosisWithOpenRouter(
      { sanitizedDiagnosis: sanitizeDiagnosisForOpenRouter(diagnoseBuildLog(sampleLogs[1].log)), model: DEEPSEEK_FREE_MODEL },
      fetchMock as unknown as typeof fetch,
    );
    const completionCall = fetchMock.mock.calls.find((call) => String(call[0]).includes("/chat/completions"));
    const completionBody = JSON.parse(String(completionCall?.[1]?.body));

    expect(result.providerStatus).toBe("openrouter_success");
    expect(result.aiPatchReview?.model).toBe(DEEPSEEK_FREE_MODEL);
    expect(completionBody.response_format).toBeUndefined();
    expect(completionBody.max_tokens).toBe(900);

    if (previousKey === undefined) delete process.env.OPENROUTER_API_KEY;
    else process.env.OPENROUTER_API_KEY = previousKey;
    if (previousEnabled === undefined) delete process.env.ENABLE_LLM_ENRICHMENT;
    else process.env.ENABLE_LLM_ENRICHMENT = previousEnabled;
    if (previousProvider === undefined) delete process.env.LLM_PROVIDER;
    else process.env.LLM_PROVIDER = previousProvider;
    if (previousMockProvider === undefined) delete process.env.MOCK_LLM_PROVIDER;
    else process.env.MOCK_LLM_PROVIDER = previousMockProvider;
    if (previousAllowPaid === undefined) delete process.env.ALLOW_PAID_LLM_MODELS;
    else process.env.ALLOW_PAID_LLM_MODELS = previousAllowPaid;
  });

  it("validates DeepSeek markdown-fenced JSON output", async () => {
    const previousKey = process.env.OPENROUTER_API_KEY;
    const previousEnabled = process.env.ENABLE_LLM_ENRICHMENT;
    const previousProvider = process.env.LLM_PROVIDER;
    const previousAllowPaid = process.env.ALLOW_PAID_LLM_MODELS;
    process.env.ENABLE_LLM_ENRICHMENT = "true";
    process.env.LLM_PROVIDER = "openrouter";
    process.env.ALLOW_PAID_LLM_MODELS = "false";
    process.env.OPENROUTER_API_KEY = "sk-or-v1-testkeytestkeytestkeytestkey";
    const review = {
      summary: "Fenced JSON still parses.",
      improvedExplanation: "The deterministic diagnosis remains the source of truth.",
      patchReview: "The patch draft is safe to review manually.",
      cautions: ["Do not auto-apply the patch."],
      suggestedVerification: ["npm run build"],
      confidence: "medium",
    };
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({
      choices: [{ message: { content: `\`\`\`json\n${JSON.stringify(review)}\n\`\`\`` } }],
    }), { status: 200 }));

    const result = await enrichDiagnosisWithOpenRouter(
      { sanitizedDiagnosis: sanitizeDiagnosisForOpenRouter(diagnoseBuildLog(sampleLogs[1].log)), model: DEEPSEEK_FREE_MODEL },
      fetchMock as unknown as typeof fetch,
    );

    expect(result.providerStatus).toBe("openrouter_success");
    expect(result.aiPatchReview?.summary).toBe(review.summary);

    if (previousKey === undefined) delete process.env.OPENROUTER_API_KEY;
    else process.env.OPENROUTER_API_KEY = previousKey;
    if (previousEnabled === undefined) delete process.env.ENABLE_LLM_ENRICHMENT;
    else process.env.ENABLE_LLM_ENRICHMENT = previousEnabled;
    if (previousProvider === undefined) delete process.env.LLM_PROVIDER;
    else process.env.LLM_PROVIDER = previousProvider;
    if (previousAllowPaid === undefined) delete process.env.ALLOW_PAID_LLM_MODELS;
    else process.env.ALLOW_PAID_LLM_MODELS = previousAllowPaid;
  });

  it("maps DeepSeek invalid JSON, invalid schema, rate limits, and unavailable responses to safe statuses", async () => {
    const previousKey = process.env.OPENROUTER_API_KEY;
    const previousEnabled = process.env.ENABLE_LLM_ENRICHMENT;
    const previousProvider = process.env.LLM_PROVIDER;
    const previousMockProvider = process.env.MOCK_LLM_PROVIDER;
    const previousAllowPaid = process.env.ALLOW_PAID_LLM_MODELS;
    process.env.ENABLE_LLM_ENRICHMENT = "true";
    process.env.LLM_PROVIDER = "openrouter";
    process.env.MOCK_LLM_PROVIDER = "true";
    process.env.ALLOW_PAID_LLM_MODELS = "false";
    process.env.OPENROUTER_API_KEY = "sk-or-v1-testkeytestkeytestkeytestkey";
    const runWithCompletion = (completion: Response) => enrichDiagnosisWithOpenRouter(
      { sanitizedDiagnosis: sanitizeDiagnosisForOpenRouter(diagnoseBuildLog(sampleLogs[1].log)), model: DEEPSEEK_FREE_MODEL },
      vi.fn(async () => completion) as unknown as typeof fetch,
    );

    await expect(runWithCompletion(new Response(JSON.stringify({ choices: [{ message: { content: "not json" } }] }), { status: 200 }))).resolves.toMatchObject({ providerStatus: "llm_json_parse_failed" });
    await expect(runWithCompletion(new Response(JSON.stringify({ choices: [{ message: { content: "{\"summary\":\"missing required fields\"}" } }] }), { status: 200 }))).resolves.toMatchObject({ providerStatus: "llm_schema_validation_failed" });
    await expect(runWithCompletion(new Response("rate limited", { status: 429 }))).resolves.toMatchObject({ providerStatus: "free_model_rate_limited" });
    await expect(runWithCompletion(new Response("unavailable", { status: 503 }))).resolves.toMatchObject({ providerStatus: "free_model_unavailable" });

    if (previousKey === undefined) delete process.env.OPENROUTER_API_KEY;
    else process.env.OPENROUTER_API_KEY = previousKey;
    if (previousEnabled === undefined) delete process.env.ENABLE_LLM_ENRICHMENT;
    else process.env.ENABLE_LLM_ENRICHMENT = previousEnabled;
    if (previousProvider === undefined) delete process.env.LLM_PROVIDER;
    else process.env.LLM_PROVIDER = previousProvider;
    if (previousMockProvider === undefined) delete process.env.MOCK_LLM_PROVIDER;
    else process.env.MOCK_LLM_PROVIDER = previousMockProvider;
    if (previousAllowPaid === undefined) delete process.env.ALLOW_PAID_LLM_MODELS;
    else process.env.ALLOW_PAID_LLM_MODELS = previousAllowPaid;
  });

  it("returns openrouter_missing_key when enabled without a key", async () => {
    const previousKey = process.env.OPENROUTER_API_KEY;
    const previousEnabled = process.env.ENABLE_LLM_ENRICHMENT;
    const previousProvider = process.env.LLM_PROVIDER;
    process.env.ENABLE_LLM_ENRICHMENT = "true";
    process.env.LLM_PROVIDER = "openrouter";
    delete process.env.OPENROUTER_API_KEY;

    const result = await enrichDiagnosisWithOpenRouter(
      { sanitizedDiagnosis: sanitizeDiagnosisForOpenRouter(diagnoseBuildLog(sampleLogs[1].log)), model: DEEPSEEK_FREE_MODEL },
      vi.fn() as unknown as typeof fetch,
    );
    expect(result).toMatchObject({ aiPatchReview: null, providerStatus: "openrouter_missing_key" });

    if (previousKey === undefined) delete process.env.OPENROUTER_API_KEY;
    else process.env.OPENROUTER_API_KEY = previousKey;
    if (previousEnabled === undefined) delete process.env.ENABLE_LLM_ENRICHMENT;
    else process.env.ENABLE_LLM_ENRICHMENT = previousEnabled;
    if (previousProvider === undefined) delete process.env.LLM_PROVIDER;
    else process.env.LLM_PROVIDER = previousProvider;
  });

  it("fails OpenRouter enrichment closed when the provider is unavailable", async () => {
    const previousKey = process.env.OPENROUTER_API_KEY;
    const previousEnabled = process.env.ENABLE_LLM_ENRICHMENT;
    const previousProvider = process.env.LLM_PROVIDER;
    const previousMockProvider = process.env.MOCK_LLM_PROVIDER;
    process.env.ENABLE_LLM_ENRICHMENT = "true";
    process.env.LLM_PROVIDER = "openrouter";
    process.env.MOCK_LLM_PROVIDER = "true";
    process.env.OPENROUTER_API_KEY = "sk-or-v1-testkeytestkeytestkeytestkey";
    const fetchMock = vi.fn(async () => new Response("rate limited", { status: 429 }));
    const review = await enrichDiagnosisWithOpenRouter(
      { sanitizedDiagnosis: sanitizeDiagnosisForOpenRouter(diagnoseBuildLog(sampleLogs[1].log)), model: DEEPSEEK_FREE_MODEL },
      fetchMock as unknown as typeof fetch,
    );
    expect(review).toMatchObject({ aiPatchReview: null, providerStatus: "free_model_rate_limited" });
    if (previousKey === undefined) delete process.env.OPENROUTER_API_KEY;
    else process.env.OPENROUTER_API_KEY = previousKey;
    if (previousEnabled === undefined) delete process.env.ENABLE_LLM_ENRICHMENT;
    else process.env.ENABLE_LLM_ENRICHMENT = previousEnabled;
    if (previousProvider === undefined) delete process.env.LLM_PROVIDER;
    else process.env.LLM_PROVIDER = previousProvider;
    if (previousMockProvider === undefined) delete process.env.MOCK_LLM_PROVIDER;
    else process.env.MOCK_LLM_PROVIDER = previousMockProvider;
  });

  it("keeps OpenRouter disabled by default unless strict guards are satisfied", () => {
    const previousEnabled = process.env.ENABLE_LLM_ENRICHMENT;
    const previousProvider = process.env.LLM_PROVIDER;
    const previousKey = process.env.OPENROUTER_API_KEY;
    delete process.env.ENABLE_LLM_ENRICHMENT;
    delete process.env.LLM_PROVIDER;
    delete process.env.OPENROUTER_API_KEY;

    expect(getBuildDoctorOpenRouterConfig()).toMatchObject({
      enabled: false,
      provider: "mock",
      configured: false,
    });

    if (previousEnabled === undefined) delete process.env.ENABLE_LLM_ENRICHMENT;
    else process.env.ENABLE_LLM_ENRICHMENT = previousEnabled;
    if (previousProvider === undefined) delete process.env.LLM_PROVIDER;
    else process.env.LLM_PROVIDER = previousProvider;
    if (previousKey === undefined) delete process.env.OPENROUTER_API_KEY;
    else process.env.OPENROUTER_API_KEY = previousKey;
  });

  it("validates diagnose, enrich, and report route payloads safely", async () => {
    const previousEnabled = process.env.ENABLE_LLM_ENRICHMENT;
    const previousProvider = process.env.LLM_PROVIDER;
    process.env.ENABLE_LLM_ENRICHMENT = "false";
    process.env.LLM_PROVIDER = "mock";
    const badDiagnose = await diagnosePost(new Request("http://localhost/api/diagnose", { method: "POST", headers: { "content-type": "application/json" }, body: "{}" }));
    expect(badDiagnose.status).toBe(400);

    const diagnosis = diagnoseBuildLog(sampleLogs[1].log);
    const goodDiagnose = await diagnosePost(new Request("http://localhost/api/diagnose", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ log: sampleLogs[1].log }),
    }));
    expect(goodDiagnose.status).toBe(200);
    expect(await goodDiagnose.json()).toMatchObject({ ok: true, mode: "deterministic", data: { mode: "deterministic" } });

    const enrich = await enrichPost(new Request("http://localhost/api/enrich", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ diagnosis }),
    }));
    expect(enrich.status).toBe(200);
    expect(await enrich.json()).toMatchObject({ ok: false, aiPatchReview: null, providerStatus: "disabled" });

    const report = await reportPost(new Request("http://localhost/api/report", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        diagnosis,
        providerStatus: "free_model_rate_limited",
        cachedProviderReview: getCachedDeepSeekDemoReview(diagnosis.failureType),
      }),
    }));
    expect(report.status).toBe(200);
    const reportPayload = await report.json();
    expect(reportPayload).toMatchObject({ ok: true, data: { format: "markdown", rawLogStored: false } });
    expect(reportPayload.report).toContain("# Build Doctor Incident Report");
    expect(reportPayload.report).toContain("Optional DeepSeek review was not included because the free provider was rate-limited.");
    expect(reportPayload.report).toContain("Cached provider review example, not live output");
    expect(reportPayload.report).toContain("- Optional provider status: free_model_rate_limited");

    if (previousEnabled === undefined) delete process.env.ENABLE_LLM_ENRICHMENT;
    else process.env.ENABLE_LLM_ENRICHMENT = previousEnabled;
    if (previousProvider === undefined) delete process.env.LLM_PROVIDER;
    else process.env.LLM_PROVIDER = previousProvider;
  });

  it("returns stable no-store JSON shapes for read APIs", async () => {
    const health = await healthGet();
    expect(health.headers.get("cache-control")).toBe("no-store");
    expect(await health.json()).toMatchObject({
      ok: true,
      data: {
        service: "vercel-build-doctor-agent",
      },
    });

    const evals = await evalGet();
    expect(evals.headers.get("cache-control")).toBe("no-store");
    expect(await evals.json()).toMatchObject({
      ok: true,
      data: {
        failed: 0,
      },
      failed: 0,
    });

    const integration = await integrationHealthGet();
    const integrationPayload = await integration.json();
    expect(integration.headers.get("cache-control")).toBe("no-store");
    expect(integrationPayload.ok).toBe(true);
    expect(JSON.stringify(integrationPayload)).not.toContain("urlHost");
    expect(JSON.stringify(integrationPayload)).not.toContain("writableTables");
  });

  it("rejects unsupported API content types and unrecognized report provider statuses", async () => {
    const textResponse = await diagnosePost(new Request("http://localhost/api/diagnose", {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body: "not json",
    }));

    expect(textResponse.status).toBe(415);
    expect(await textResponse.json()).toMatchObject({ ok: false, error: { code: "UNSUPPORTED_MEDIA_TYPE" } });

    const diagnosis = diagnoseBuildLog(sampleLogs[1].log);
    const badReport = await reportPost(new Request("http://localhost/api/report", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        diagnosis,
        providerStatus: "raw-unvalidated-provider",
      }),
    }));

    expect(badReport.status).toBe(400);
    expect(await badReport.json()).toMatchObject({ ok: false, error: { code: "INVALID_DIAGNOSIS" } });
  });

  it("reports deterministic integration fallback without Supabase env vars", () => {
    const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const previousKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const previousService = process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    const health = getIntegrationHealth("test-app");

    expect(health.supabase.mode).toBe("DETERMINISTIC_FALLBACK");
    expect(JSON.stringify(health)).not.toContain("urlHost");
    expect(JSON.stringify(health)).not.toContain("writableTables");
    expect(health.supabase.missingEnv.length).toBeGreaterThan(0);
    if (previousUrl) process.env.NEXT_PUBLIC_SUPABASE_URL = previousUrl;
    if (previousKey) process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = previousKey;
    if (previousService) process.env.SUPABASE_SERVICE_ROLE_KEY = previousService;
  });

  it("does not attempt Supabase writes when env vars are missing", async () => {
    const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const previousKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const previousService = process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    const result = await recordSuiteEvent({ app: "test-app", eventType: "test", summary: "fallback check" });

    expect(result.stored).toBe(false);
    expect(result.mode).toBe("DETERMINISTIC_FALLBACK");
    if (previousUrl) process.env.NEXT_PUBLIC_SUPABASE_URL = previousUrl;
    if (previousKey) process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = previousKey;
    if (previousService) process.env.SUPABASE_SERVICE_ROLE_KEY = previousService;
  });

  it("rejects oversized public demo build logs", async () => {
    const oversizedLog = "x".repeat(120_001);
    const response = await diagnosePost(new Request("http://localhost/api/diagnose", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ log: oversizedLog }),
    }));

    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload.error.message).toContain("Redact secrets");
  });
});
