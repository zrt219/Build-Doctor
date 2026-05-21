import { describe, expect, it } from "vitest";
import { getIntegrationHealth, recordSuiteEvent } from "@/lib/integrations";
import { auditResumeClaims, generateReport, runEvalSuite } from "@/lib/rag-auditor";

describe("Resume Evidence RAG Auditor", () => {
  it("verifies claims with local evidence", () => {
    const audit = auditResumeClaims({ jobDescription: "RAG and evals", claims: ["Built Vercel Build Doctor Agent with evals and reports."] });
    expect(audit.auditedClaims[0].status).toBe("VERIFIED");
    expect(audit.auditedClaims[0].evidence.length).toBeGreaterThan(0);
  });

  it("flags inflated claims without evidence", () => {
    const audit = auditResumeClaims({ jobDescription: "Applied AI engineering role", claims: ["Led production AI platform for millions of users."] });
    expect(audit.auditedClaims[0].status).toBe("UNVERIFIED");
    expect(audit.evidenceGaps).toHaveLength(1);
  });

  it("generates an evidence report", () => {
    const audit = auditResumeClaims({ jobDescription: "agent workflows", claims: ["Built enterprise-safe agent workflow demos with approval gates and audit reports."] });
    expect(generateReport(audit)).toContain("Resume Evidence RAG Audit Report");
  });

  it("passes eval fixtures", () => {
    expect(runEvalSuite().score).toBe(100);
  });

  it("adds job-overlap evidence to verified claims", () => {
    const audit = auditResumeClaims({ jobDescription: "RAG retrieval evals", claims: ["Built Resume Evidence RAG Auditor with retrieval and evals."] });
    expect(audit.auditedClaims[0].jobOverlap.length).toBeGreaterThan(0);
    expect(audit.tailoredBullets[0]).toContain("evidence:");
  });

  it("reports Supabase fallback mode safely", async () => {
    const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const previousKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const previousService = process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    const health = getIntegrationHealth("resume-auditor-test");
    const event = await recordSuiteEvent({ app: "resume-auditor-test", eventType: "test", summary: "fallback check" });

    expect(health.supabase.mode).toBe("DETERMINISTIC_FALLBACK");
    expect(event.stored).toBe(false);
    if (previousUrl) process.env.NEXT_PUBLIC_SUPABASE_URL = previousUrl;
    if (previousKey) process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = previousKey;
    if (previousService) process.env.SUPABASE_SERVICE_ROLE_KEY = previousService;
  });
});
