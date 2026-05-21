import { describe, expect, it } from "vitest";
import { runSecurityOnlyAudit } from "./audit-runner";

describe("security-specific generated audit", () => {
  it("runs exactly 4,000 security checks without failures", () => {
    const result = runSecurityOnlyAudit();

    expect(result.summary.expectedTotal).toBe(4000);
    expect(result.summary.total).toBe(4000);
    expect(result.summary.passed).toBe(4000);
    expect(result.summary.failed).toBe(0);
    expect(result.summary.skipped).toBe(0);
    expect(result.failures).toHaveLength(0);
  }, 60000);
});
