import { describe, expect, it, vi } from "vitest";
import { routeRequest, routeRequestWithOpenRouter, runEvalSuite } from "@/lib/gateway";
import { getIntegrationHealth, recordSuiteEvent } from "@/lib/integrations";
import { activeWorkflowStepId, suiteWorkflowSteps } from "@/lib/suite";

describe("AI Gateway Failover Playground", () => {
  it("routes normal balanced requests without fallback", () => {
    const result = routeRequest({ prompt: "hello", scenario: "normal", policy: "balanced" });
    expect(result.fallbackUsed).toBe(false);
    expect(result.provider.id).toBe("primary-large");
  });

  it("uses fallback during primary outage", () => {
    const result = routeRequest({ prompt: "hello", scenario: "primary_outage", policy: "highest_reliability" });
    expect(result.fallbackUsed).toBe(true);
    expect(result.provider.id).not.toBe("primary-large");
  });

  it("uses the lowest-cost provider under cost guardrail", () => {
    const result = routeRequest({ prompt: "hello", scenario: "cost_guardrail", policy: "lowest_cost" });
    expect(result.provider.id).toBe("fast-small");
  });

  it("marks readiness for tight budgets", () => {
    const result = routeRequest({ prompt: "hello", scenario: "primary_outage", policy: "highest_reliability", maxLatencyMs: 200, maxCostUsd: 0.002 });
    expect(result.readiness.status).toBe("REVIEW");
    expect(result.readiness.reasons.length).toBeGreaterThan(0);
  });

  it("passes eval fixtures", () => {
    expect(runEvalSuite().score).toBe(100);
  });

  it("covers the shared workflow trace step", () => {
    const traceStep = suiteWorkflowSteps.find((step) => step.id === activeWorkflowStepId);
    const result = routeRequest({ prompt: "trace a failed deploy diagnosis", scenario: "primary_outage", policy: "highest_reliability" });

    expect(traceStep?.label).toBe("Show trace");
    expect(result.trace.length).toBeGreaterThanOrEqual(5);
    expect(result.trace.some((event) => event.step === "provider_selected")).toBe(true);
    expect(result.safetyNotes.join(" ")).toContain("deterministic");
  });

  it("uses OpenRouter fallback when no API key is configured", async () => {
    const previous = process.env.OPENROUTER_API_KEY;
    delete process.env.OPENROUTER_API_KEY;
    const result = await routeRequestWithOpenRouter({ prompt: "hello", scenario: "normal", policy: "balanced" });

    expect(result.providerMode).toBe("MOCK_FALLBACK");
    expect(result.openRouter.status).toBe("SKIPPED");
    if (previous) process.env.OPENROUTER_API_KEY = previous;
  });

  it("parses a live OpenRouter-compatible response shape", async () => {
    const previous = process.env.OPENROUTER_API_KEY;
    process.env.OPENROUTER_API_KEY = "test-key";
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ choices: [{ message: { content: "OpenRouter test response" } }] }), { status: 200 })) as unknown as typeof fetch;

    const result = await routeRequestWithOpenRouter({ prompt: "hello", scenario: "normal", policy: "balanced" }, fetchMock);

    expect(result.providerMode).toBe("OPENROUTER_LIVE");
    expect(result.response).toBe("OpenRouter test response");
    expect(fetchMock).toHaveBeenCalledOnce();
    if (previous) process.env.OPENROUTER_API_KEY = previous;
    else delete process.env.OPENROUTER_API_KEY;
  });

  it("reports integration fallback safely", async () => {
    const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const previousKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const previousService = process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    const health = getIntegrationHealth("ai-gateway-test");
    const event = await recordSuiteEvent({ app: "ai-gateway-test", eventType: "test", summary: "fallback check" });

    expect(health.supabase.mode).toBe("DETERMINISTIC_FALLBACK");
    expect(event.stored).toBe(false);
    if (previousUrl) process.env.NEXT_PUBLIC_SUPABASE_URL = previousUrl;
    if (previousKey) process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = previousKey;
    if (previousService) process.env.SUPABASE_SERVICE_ROLE_KEY = previousService;
  });
});
