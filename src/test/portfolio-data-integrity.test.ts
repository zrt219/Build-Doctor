import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { evidenceSources } from "@/data/evidenceSources";
import { portfolioStats } from "@/data/portfolioStats";
import { projects } from "@/data/projects";
import { workflowEventHistory, workflowEventsSourceFile } from "@/data/workflowEvents";

const repoRoot = process.cwd();
const forbiddenSourceTerms = /image|screenshot|mockup|prompt/i;

function readEvidenceFile(relativePath: string) {
  const absolutePath = join(repoRoot, relativePath);
  expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
  return readFileSync(absolutePath, "utf8");
}

describe("portfolio evidence integrity", () => {
  it("keeps displayed stats tied to public-safe evidence files", () => {
    for (const stat of portfolioStats) {
      expect(stat.publicSafe).toBe(true);
      expect(stat.sourceFile).not.toMatch(forbiddenSourceTerms);

      const evidence = readEvidenceFile(stat.sourceFile);
      expect(evidence).toContain(stat.value);
      expect(stat.lastVerified).toMatch(/^2026-05-24$/);
    }
  });

  it("keeps workflow history tied to public-safe tracker evidence", () => {
    expect(workflowEventsSourceFile).not.toMatch(forbiddenSourceTerms);
    const evidence = readEvidenceFile(workflowEventsSourceFile);

    for (const point of workflowEventHistory) {
      expect(point.sourceFile).toBe(workflowEventsSourceFile);
      expect(evidence).toContain(point.date);
      expect(evidence).toContain(point.workflowEvents.toLocaleString("en-US"));
      expect(evidence).toContain(point.sessionRows.toLocaleString("en-US"));
    }
  });

  it("requires verified evidence sources to resolve to a file or public URL", () => {
    for (const source of evidenceSources.filter((item) => item.status === "verified")) {
      expect(source.sourceFile || source.href, `${source.label} needs a source file or href`).toBeTruthy();
      if (source.sourceFile) {
        expect(source.sourceFile).not.toMatch(forbiddenSourceTerms);
        readEvidenceFile(source.sourceFile);
      }
      if (source.href) {
        expect(new URL(source.href).protocol).toBe("https:");
      }
    }
  });

  it("does not promote repo or reference URLs into public-demo semantics", () => {
    for (const project of projects) {
      expect(project.evidenceRefs.length).toBeGreaterThan(0);
      expect(project.lastVerified).toBe("2026-05-24");
      for (const evidenceRef of project.evidenceRefs) {
        expect(evidenceRef).not.toMatch(forbiddenSourceTerms);
        readEvidenceFile(evidenceRef);
      }

      if (project.demoUrl) {
        expect(new URL(project.demoUrl).protocol).toBe("https:");
      }

      if (project.proofStatus === "live") {
        expect(project.demoUrl, `${project.title} is public demo but lacks a demo URL`).toBeTruthy();
        expect(project.urlKind).toBe("live-demo");
      } else {
        expect(project.urlKind).not.toBe("live-demo");
      }
    }
  });
});
