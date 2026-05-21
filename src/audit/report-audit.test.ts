import { describe, expect, it } from "vitest";
import { regenerateAuditReport } from "./audit-runner";

describe("security audit handoff report generation", () => {
  it("regenerates SECURITY_AUDIT_HANDOFF.md from latest audit artifacts", () => {
    const result = regenerateAuditReport();

    expect(result.summary.total).toBe(result.summary.expectedTotal);
    expect(result.handoff).toContain("Security Audit Handoff");
    expect(result.handoff).toContain("PASS WITH CONDITIONS");
  });
});
