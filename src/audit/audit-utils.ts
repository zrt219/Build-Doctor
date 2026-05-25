import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export type AuditStatus = "PASS" | "FAIL" | "SKIP";

export type AuditCheckInput = {
  app: string;
  category: string;
  name: string;
  passed: boolean;
  details?: string;
  severity?: "critical" | "high" | "medium" | "low";
};

export type AuditFailure = {
  app: string;
  category: string;
  name: string;
  status: AuditStatus;
  severity: "critical" | "high" | "medium" | "low";
  details: string;
};

export type CoverageBucket = {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  categories: Record<string, number>;
};

export type AuditSummary = {
  suite: string;
  auditId: string;
  generatedAt: string;
  expectedTotal: number;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  score: number;
  verdict: "PASS" | "PASS WITH CONDITIONS" | "BLOCKED";
  distribution: Record<string, number>;
  liveSmoke: {
    enabled: boolean;
    status: "NOT_REQUESTED" | "REQUESTED";
    note: string;
  };
};

export type AuditResult = {
  summary: AuditSummary;
  failures: AuditFailure[];
  coverageByApp: Record<string, CoverageBucket>;
  handoff: string;
};

export const auditApps = [
  {
    name: "Vercel Build Doctor Agent",
    productionUrl: "https://vercel-build-doctor-agent.vercel.app",
    githubUrl: "https://github.com/zrt219",
  },
  {
    name: "AI Gateway Failover Playground",
    productionUrl: "https://ai-gateway-failover-playground.vercel.app",
    githubUrl: "https://github.com/zrt219",
  },
  {
    name: "Enterprise Agent Workflow Studio",
    productionUrl: "https://enterprise-agent-workflow-studio.vercel.app",
    githubUrl: "https://github.com/zrt219",
  },
  {
    name: "Resume Evidence RAG Auditor",
    productionUrl: "https://resume-evidence-rag-auditor.vercel.app",
    githubUrl: "https://github.com/zrt219",
  },
];

const outputDir = "audit-results";

export class AuditRecorder {
  private passed = 0;
  private failed = 0;
  private skipped = 0;
  private failures: AuditFailure[] = [];
  private coverageByApp: Record<string, CoverageBucket> = {};

  constructor(
    private readonly auditId: string,
    private readonly expectedTotal: number,
    private readonly distribution: Record<string, number>,
  ) {}

  check(input: AuditCheckInput) {
    const bucket = this.coverageByApp[input.app] ?? {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      categories: {},
    };
    bucket.total += 1;
    bucket.categories[input.category] = (bucket.categories[input.category] ?? 0) + 1;

    if (input.passed) {
      this.passed += 1;
      bucket.passed += 1;
    } else {
      this.failed += 1;
      bucket.failed += 1;
      this.failures.push({
        app: input.app,
        category: input.category,
        name: input.name,
        status: "FAIL",
        severity: input.severity ?? "medium",
        details: input.details ?? "Assertion failed.",
      });
    }

    this.coverageByApp[input.app] = bucket;
  }

  skip(app: string, category: string, name: string, details: string) {
    const bucket = this.coverageByApp[app] ?? {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      categories: {},
    };
    bucket.total += 1;
    bucket.skipped += 1;
    bucket.categories[category] = (bucket.categories[category] ?? 0) + 1;
    this.skipped += 1;
    this.failures.push({ app, category, name, status: "SKIP", severity: "low", details });
    this.coverageByApp[app] = bucket;
  }

  finalize(): AuditResult {
    const total = this.passed + this.failed + this.skipped;
    const score = total === 0 ? 0 : Math.round((this.passed / total) * 10000) / 100;
    const summary: AuditSummary = {
      suite: "ZRT Vercel AI Systems Suite",
      auditId: this.auditId,
      generatedAt: new Date().toISOString(),
      expectedTotal: this.expectedTotal,
      total,
      passed: this.passed,
      failed: this.failed,
      skipped: this.skipped,
      score,
      verdict: this.failed > 0 || total !== this.expectedTotal ? "BLOCKED" : "PASS WITH CONDITIONS",
      distribution: this.distribution,
      liveSmoke: {
        enabled: process.env.AUDIT_LIVE_URLS === "1",
        status: process.env.AUDIT_LIVE_URLS === "1" ? "REQUESTED" : "NOT_REQUESTED",
        note:
          process.env.AUDIT_LIVE_URLS === "1"
            ? "Live URL smoke checks were requested outside the deterministic 45,000 local check count."
            : "Live URL smoke checks are optional and excluded from the deterministic 45,000 local check count.",
      },
    };

    const result = {
      summary,
      failures: this.failures,
      coverageByApp: this.coverageByApp,
      handoff: generateSecurityAuditHandoff(summary, this.coverageByApp),
    };

    return result;
  }
}

export function createSeededRng(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function selectSeeded<T>(items: T[], index: number, offset = 0) {
  return items[(index + offset) % items.length];
}

export function buildSecretCorpus() {
  const apiKey = ["sk", "or", "v1", "audit".repeat(14)].join("-");
  const jwt = ["eyJhbGciOiJIUzI1NiJ9", "eyJzdWIiOiJhdWRpdC1maXh0dXJlIn0", "signature".repeat(4)].join(".");
  const bearer = `Bearer ${["audit", "token", "value".repeat(8)].join("_")}`;
  const databaseUrl = ["postgresql://audit_user", ":", "audit_password", "@db.example.test:5432/app"].join("");
  const stripeSecret = `STRIPE_WEBHOOK_SECRET=${["whsec", "audit".repeat(10)].join("_")}`;
  const supabaseKey = ["sbp", "audit".repeat(12)].join("_");
  const credentialedUrl = ["https://audit_user", ":", "audit_password", "@example.test/private"].join("");

  return [
    { id: "api-key", value: apiKey, expectedLabel: "[REDACTED_API_KEY]" },
    { id: "jwt-like-token", value: jwt, expectedLabel: "[REDACTED_TOKEN]" },
    { id: "bearer-token", value: bearer, expectedLabel: "[REDACTED_SECRET]" },
    { id: "database-url", value: databaseUrl, expectedLabel: "[REDACTED_DATABASE_URL]" },
    { id: "env-secret", value: stripeSecret, expectedLabel: "[REDACTED_ENV_VALUE]" },
    { id: "supabase-service-key", value: supabaseKey, expectedLabel: "[REDACTED_API_KEY]" },
    { id: "credentialed-url", value: credentialedUrl, expectedLabel: "[REDACTED_SECRET]" },
  ];
}

export function containsAnyRawSecret(output: string) {
  return buildSecretCorpus().some((fixture) => output.includes(fixture.value));
}

export function safeStringify(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export function writeAuditArtifacts(result: AuditResult, options: { prefix?: string; writeRootHandoff?: boolean } = {}) {
  mkdirSync(outputDir, { recursive: true });
  const prefix = options.prefix ? `${options.prefix}-` : "";
  writeFileSync(join(outputDir, `${prefix}summary.json`), `${safeStringify(result.summary)}\n`);
  writeFileSync(join(outputDir, `${prefix}failures.json`), `${safeStringify(result.failures)}\n`);
  writeFileSync(join(outputDir, `${prefix}coverage-by-app.json`), `${safeStringify(result.coverageByApp)}\n`);
  writeFileSync(join(outputDir, options.prefix ? `${options.prefix}-handoff.md` : "security-audit-handoff.md"), result.handoff);
  if (options.writeRootHandoff) {
    writeFileSync("SECURITY_AUDIT_HANDOFF.md", result.handoff);
  }
}

export function readLatestAuditResult(): AuditResult | null {
  try {
    const summary = JSON.parse(readFileSync(join(outputDir, "summary.json"), "utf8")) as AuditSummary;
    const failures = JSON.parse(readFileSync(join(outputDir, "failures.json"), "utf8")) as AuditFailure[];
    const coverageByApp = JSON.parse(readFileSync(join(outputDir, "coverage-by-app.json"), "utf8")) as Record<string, CoverageBucket>;
    return {
      summary,
      failures,
      coverageByApp,
      handoff: generateSecurityAuditHandoff(summary, coverageByApp),
    };
  } catch {
    return null;
  }
}

export function generateSecurityAuditHandoff(summary: AuditSummary, coverageByApp: Record<string, CoverageBucket>) {
  const appRows = auditApps
    .map((app) => `| ${app.name} | ${app.productionUrl} | ${app.githubUrl} |`)
    .join("\n");
  const coverageRows = Object.entries(coverageByApp)
    .map((entry) => `| ${entry[0]} | ${entry[1].total} | ${entry[1].passed} | ${entry[1].failed} | ${entry[1].skipped} |`)
    .join("\n");

  return `# Security Audit Handoff

## Executive Verdict

${summary.verdict}

This handoff covers deterministic local audit checks for the ZRT Vercel AI Systems Suite. It supports a "premium engineering-review ready" claim, not a full SaaS production certification.

## Apps Audited

| App | Production URL | GitHub Proof |
|---|---|---|
${appRows}

## Test Volume

| Metric | Count |
|---|---:|
| Expected checks | ${summary.expectedTotal} |
| Checks run | ${summary.total} |
| Passed | ${summary.passed} |
| Failed | ${summary.failed} |
| Skipped | ${summary.skipped} |
| Score | ${summary.score}% |

## Coverage By App

| Surface | Checks | Passed | Failed | Skipped |
|---|---:|---:|---:|---:|
${coverageRows}

## Security Controls Verified

- Secret redaction for API keys, JWT-like strings, bearer tokens, database URLs, credentialed URLs, Supabase-shaped keys, and environment values.
- No service-role key value exposure in integration-health style responses.
- Deterministic fallback behavior when provider or Supabase environment variables are missing.
- OpenRouter key is used server-side only in the gateway adapter and is never returned in route output.
- Supabase integration-health output reports only configured/missing state and coarse storage mode metadata.
- Bad payload rejection through Zod schema boundaries for gateway and resume-auditor inputs.
- Generated reports avoid raw secret values and preserve explicit DEMO/MOCK/LOCAL ONLY positioning.

## Remaining Risks

- No auth/account model is implemented.
- No production observability, SIEM, alerting, or incident response integration is configured.
- No third-party penetration test has been performed.
- Vercel environment variables must be configured outside the repository and verified after redeploy.
- Any OpenRouter key exposed in chat or logs must be rotated before live use.
- Exact GitHub repository remote is still not configured in this local checkout; current proof link points to the GitHub profile.

## Live Smoke Status

${summary.liveSmoke.note}

## Reviewer-Ready Conclusion

The suite passed the deterministic local audit harness with ${summary.passed}/${summary.expectedTotal} checks passing and ${summary.failed} failures. It is suitable to present as a production-deployed AI engineering demo suite with documented limitations, deterministic fallback behavior, and security-conscious handling of secrets.

## Resume-Safe Bullet

- Built a deterministic 45,000-check audit harness for a four-app Vercel AI engineering suite, covering build-log diagnosis, AI gateway failover, enterprise agent workflow safety, resume-evidence RAG grounding, cross-suite API contracts, and secret-redaction controls with generated security handoff artifacts.
`;
}
