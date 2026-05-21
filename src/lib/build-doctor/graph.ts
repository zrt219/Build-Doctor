import type { Diagnosis, GraphRun } from "../schemas";

const localGraphNodes = [
  "redact-secrets",
  "classify-failure",
  "extract-evidence",
  "map-remediation",
  "prepare-export",
] as const;

export function createLocalGraphRun(diagnosis: Pick<Diagnosis, "failureType">): GraphRun {
  return {
    id: `local-${diagnosis.failureType.toLowerCase()}`,
    mode: "local-deterministic",
    nodeSequence: [...localGraphNodes],
    checkpointSafe: true,
    approvalState: "not_required",
    providerStatus: "disabled",
  };
}

export function checkpointDiagnosisSnapshot(diagnosis: Pick<Diagnosis, "failureType" | "label" | "confidence" | "redactions" | "traceSteps" | "patchDraft">) {
  return {
    failureType: diagnosis.failureType,
    label: diagnosis.label,
    confidence: diagnosis.confidence,
    redactions: diagnosis.redactions,
    traceStepIds: diagnosis.traceSteps.map((step) => step.id),
    patchDraft: {
      title: diagnosis.patchDraft.title,
      failureType: diagnosis.patchDraft.failureType,
      confidence: diagnosis.patchDraft.confidence,
    },
  };
}
