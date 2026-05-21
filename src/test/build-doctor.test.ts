import { describe, expect, it } from "vitest";
import { diagnoseBuildLog, generateIncidentReport, runEvalSuite } from "@/lib/build-doctor";
import { getIntegrationHealth, recordSuiteEvent } from "@/lib/integrations";
import { redactSecrets } from "@/lib/redact-secrets";
import { sampleLogs } from "@/lib/sample-logs";

describe("Vercel Build Doctor deterministic engine", () => {
  it("classifies every sample log as the expected failure type", () => {
    for (const sample of sampleLogs) {
      expect(diagnoseBuildLog(sample.log).failureType, sample.title).toBe(sample.expected);
    }
  });

  it("redacts secret-looking values before returning diagnostic logs", () => {
    const input = "DATABASE_URL=postgresql://user:secret@db.example.com/app OPENAI_API_KEY=sk-abcdefghijklmnopqrstuvwxyz123456 Bearer abcdefghijklmnopqrstuvwxyz";
    const result = redactSecrets(input);

    expect(result.redacted).not.toContain("user:secret");
    expect(result.redacted).not.toContain("sk-abcdefghijklmnopqrstuvwxyz123456");
    expect(result.redacted).toContain("[REDACTED_DATABASE_URL]");
    expect(result.redacted).toContain("[REDACTED_ENV_VALUE]");
  });

  it("runs the eval suite with eight passing fixture cases", () => {
    const evals = runEvalSuite();

    expect(evals.total).toBe(8);
    expect(evals.failed).toBe(0);
    expect(evals.score).toBeGreaterThanOrEqual(90);
  });

  it("generates a markdown incident report without raw database credentials", () => {
    const prismaSample = sampleLogs.find((sample) => sample.id === "prisma-database-url");
    expect(prismaSample).toBeDefined();

    const diagnosis = diagnoseBuildLog(prismaSample!.log);
    const report = generateIncidentReport(diagnosis);

    expect(report).toContain("# Build Doctor Incident Report");
    expect(report).toContain("Commands To Verify");
    expect(report).not.toContain("user:secret");
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
});
