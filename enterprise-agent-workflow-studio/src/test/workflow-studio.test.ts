import { describe, expect, it } from "vitest";
import { getIntegrationHealth, recordSuiteEvent } from "@/lib/integrations";
import { activeWorkflowStepId, suiteWorkflowSteps } from "@/lib/suite";
import { generateAuditReport, generateWorkflow, runEvalSuite } from "@/lib/workflow-studio";

describe("Enterprise Agent Workflow Studio", () => {
  it("adds approval gates for high-risk tool use", () => {
    const workflow = generateWorkflow({ objective: "Approve a refund after evidence review", selectedTools: ["crm_lookup", "refund_api"], riskLevel: "high" });
    expect(workflow.approvalGates.some((gate) => gate.toolId === "refund_api")).toBe(true);
  });

  it("keeps read-only workflows ungated", () => {
    const workflow = generateWorkflow({ objective: "Answer a policy question from internal documents", selectedTools: ["policy_search"], riskLevel: "low", dataClass: "public" });
    expect(workflow.approvalGates).toHaveLength(0);
  });

  it("runs deterministic evals", () => {
    expect(runEvalSuite().score).toBe(100);
  });

  it("blocks unknown tools and reports readiness", () => {
    const workflow = generateWorkflow({ objective: "Attempt an unknown tool", selectedTools: ["unknown_tool"], riskLevel: "low", dataClass: "internal" });
    expect(workflow.readiness.status).toBe("BLOCKED");
    expect(workflow.readiness.blockers[0]).toContain("unknown_tool");
  });

  it("exports an audit report", () => {
    const report = generateAuditReport(generateWorkflow({ objective: "Update a case with approval", selectedTools: ["ticket_update"], riskLevel: "medium" }));
    expect(report).toContain("Enterprise Agent Workflow Audit Report");
    expect(report).toContain("Approval Gates");
  });

  it("covers the shared workflow patch suggestion step", () => {
    const patchStep = suiteWorkflowSteps.find((step) => step.id === activeWorkflowStepId);
    const workflow = generateWorkflow({
      objective: "Suggest a small patch for a failed Vercel build after evidence review",
      selectedTools: ["policy_search", "ticket_update", "human_approval"],
      riskLevel: "medium",
      dataClass: "internal",
    });
    const report = generateAuditReport(workflow);

    expect(patchStep?.label).toBe("Suggest patch");
    expect(workflow.readiness.launchChecklist).toContain("Export audit report after workflow simulation.");
    expect(workflow.approvalGates.length).toBeGreaterThan(0);
    expect(report).toContain("Agent Graph");
  });

  it("reports Supabase fallback mode safely", async () => {
    const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const previousKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const previousService = process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    const health = getIntegrationHealth("enterprise-test");
    const event = await recordSuiteEvent({ app: "enterprise-test", eventType: "test", summary: "fallback check" });

    expect(health.supabase.mode).toBe("DETERMINISTIC_FALLBACK");
    expect(event.stored).toBe(false);
    if (previousUrl) process.env.NEXT_PUBLIC_SUPABASE_URL = previousUrl;
    if (previousKey) process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = previousKey;
    if (previousService) process.env.SUPABASE_SERVICE_ROLE_KEY = previousService;
  });
});
