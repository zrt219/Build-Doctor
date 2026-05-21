import { taxonomyById } from "../failure-taxonomy";
import { buildPatchDraft } from "../patch-recipes";
import { parseBuildLog } from "../log-parser";
import { redactSecrets } from "../redact-secrets";
import { sampleLogs } from "../sample-logs";
import type { CachedProviderReview, Diagnosis, EvalResults, TraceStep } from "../schemas";
import { createLocalGraphRun } from "./graph";
import { buildAutofillFixPlan, buildSolutionSuggestions } from "./solution-suggestions";

type EvalResultLabel = EvalResults["cases"][number]["result"];

function evidenceRefsFor(diagnosis: Pick<Diagnosis, "evidence">) {
  return diagnosis.evidence.map((_, index) => `evidence-${index + 1}`);
}

function buildTraceSteps(diagnosis: Pick<Diagnosis, "failureType" | "label" | "evidence" | "patchDraft" | "redactions">): TraceStep[] {
  const redactionSummary = diagnosis.redactions.length ? diagnosis.redactions.join(", ") : "No secret patterns detected";
  const evidenceSummary = diagnosis.evidence.length ? `${diagnosis.evidence.length} evidence line(s) extracted.` : "No strong evidence lines were extracted.";
  const refs = evidenceRefsFor(diagnosis);

  return [
    {
      id: "redact-secrets",
      label: "Redact secrets",
      status: "complete",
      inputSummary: "Received build log text from user input.",
      outputSummary: `Sanitized credential-like values before classification. ${redactionSummary}.`,
      evidenceRefs: [],
    },
    {
      id: "classify-failure",
      label: "Classify failure",
      status: diagnosis.failureType === "UNKNOWN" ? "warning" : "complete",
      inputSummary: "Scanned sanitized log against deterministic taxonomy patterns.",
      outputSummary: diagnosis.failureType === "UNKNOWN" ? "No supported failure class matched with high confidence." : `Matched ${diagnosis.label}.`,
      evidenceRefs: refs,
    },
    {
      id: "extract-evidence",
      label: "Extract evidence",
      status: diagnosis.evidence.length ? "complete" : "warning",
      inputSummary: "Reviewed sanitized log lines for errors, warnings, stack frames, and file references.",
      outputSummary: evidenceSummary,
      evidenceRefs: refs,
    },
    {
      id: "map-remediation",
      label: "Map remediation",
      status: diagnosis.failureType === "UNKNOWN" ? "warning" : "complete",
      inputSummary: "Mapped the deterministic failure type to a local remediation recipe.",
      outputSummary: diagnosis.patchDraft.title,
      evidenceRefs: refs,
    },
    {
      id: "prepare-export",
      label: "Prepare export",
      status: "complete",
      inputSummary: "Prepared deterministic diagnosis, trace, patch draft, verification commands, and risks.",
      outputSummary: "Markdown report can be generated locally; optional LLM review is explanatory only.",
      evidenceRefs: refs,
    },
  ];
}

export function diagnoseBuildLog(rawLog: string): Diagnosis {
  const { redacted, redactions } = redactSecrets(rawLog);
  const parsed = parseBuildLog(redacted);
  const recipe = taxonomyById[parsed.failureType];
  const fallbackEvidence = parsed.evidence.length
    ? parsed.evidence
    : [{ lineNumber: 1, kind: "info" as const, content: redacted.split("\n").find(Boolean)?.slice(0, 220) ?? "No diagnostic lines found." }];

  const patchDraft = buildPatchDraft(parsed.failureType, parsed.affectedFiles);
  const solutionSuggestions = buildSolutionSuggestions(parsed.failureType, patchDraft);

  const diagnosis: Diagnosis = {
    ...parsed,
    evidence: fallbackEvidence,
    fixPlan: recipe.fixSteps,
    patchChecklist: [
      `Confirm the first fatal signal maps to ${recipe.label}.`,
      "Apply the smallest code or configuration change that addresses the root cause.",
      "Keep secrets in Vercel environment variables; do not hardcode them in source.",
      "Rerun the verification commands before deploying.",
    ],
    patchDraft,
    traceSteps: [],
    graphRun: createLocalGraphRun({ failureType: parsed.failureType }),
    solutionSuggestions,
    autofillFixPlan: buildAutofillFixPlan(solutionSuggestions),
    verificationCommands: patchDraft.verificationCommands.length ? patchDraft.verificationCommands : recipe.verificationCommands,
    preventionChecklist: recipe.preventionChecks,
    readinessReport: {
      status: parsed.failureType === "UNKNOWN" ? "NEEDS_REVIEW" : "READY_AFTER_FIX",
      summary:
        parsed.failureType === "UNKNOWN"
          ? "The log needs human review or additional context before a deployment readiness claim is safe."
          : "Deployment is ready to retry after the fix plan is applied and verification commands pass.",
      remainingRisks:
        parsed.failureType === "UNKNOWN"
          ? ["Low-confidence classification", "Full build context may be missing"]
          : [...patchDraft.risks, "Fix has not been applied inside this diagnostic session", "External Vercel project settings still need verification"],
    },
    redactedLog: redacted,
    redactions,
    generatedAt: new Date().toISOString(),
  };

  diagnosis.traceSteps = buildTraceSteps(diagnosis);
  return diagnosis;
}

export function generateIncidentReport(
  diagnosis: Diagnosis,
  options: {
    providerStatus?: string;
    cachedProviderReview?: CachedProviderReview | null;
    selectedSolutionSuggestions?: Diagnosis["solutionSuggestions"];
    autofillFixPlan?: Diagnosis["autofillFixPlan"];
  } = {},
) {
  const evidence = diagnosis.evidence
    .map((line, index) => `- evidence-${index + 1}: L${line.lineNumber} [${line.kind.toUpperCase()}]: ${line.content}`)
    .join("\n");
  const trace = diagnosis.traceSteps
    .map((step, index) => `- ${index + 1}. ${step.label} [${step.status}]\n  - Input: ${step.inputSummary}\n  - Output: ${step.outputSummary}\n  - Evidence refs: ${step.evidenceRefs.length ? step.evidenceRefs.join(", ") : "none"}`)
    .join("\n");
  const patchFiles = diagnosis.patchDraft.likelyAffectedFiles.length ? diagnosis.patchDraft.likelyAffectedFiles.map((file) => `- ${file}`).join("\n") : "- No deterministic file target identified";
  const commands = diagnosis.verificationCommands.map((command) => `- \`${command}\``).join("\n");
  const risks = diagnosis.readinessReport.remainingRisks.map((risk) => `- ${risk}`).join("\n");
  const selectedSolutionSuggestions = options.selectedSolutionSuggestions ?? [];
  const suggestedSolutions = selectedSolutionSuggestions.length
    ? selectedSolutionSuggestions.map((suggestion) => suggestion.reportInsert).join("\n\n")
    : "No suggested solution cards were selected for this report.";
  const autofillFixPlan = options.autofillFixPlan
    ? [
        `Title: ${options.autofillFixPlan.title}`,
        "",
        options.autofillFixPlan.editablePlan,
        "",
        "Commands:",
        ...(options.autofillFixPlan.commands.length ? options.autofillFixPlan.commands.map((command) => `- \`${command}\``) : ["- No commands selected."]),
        "",
        "Snippets:",
        ...(options.autofillFixPlan.snippets.length ? options.autofillFixPlan.snippets.map((snippet) => `- ${snippet.label} (${snippet.language})`) : ["- No snippets selected."]),
      ].join("\n")
    : "No autofill fix plan was added to this report.";
  const optionalLlmReview = diagnosis.aiPatchReview
    ? `
The optional provider review added:

Provider: ${diagnosis.aiPatchReview.provider}
Model: ${diagnosis.aiPatchReview.model}
Sanitized input only: ${diagnosis.aiPatchReview.usedSanitizedInputOnly ? "yes" : "no"}

${diagnosis.aiPatchReview.summary}

Improved explanation: ${diagnosis.aiPatchReview.improvedExplanation}

Patch review: ${diagnosis.aiPatchReview.patchReview}

Cautions:
${diagnosis.aiPatchReview.cautions.map((caution) => `- ${caution}`).join("\n")}

Suggested verification:
${diagnosis.aiPatchReview.suggestedVerification.map((command) => `- \`${command}\``).join("\n")}
`
    : options.cachedProviderReview
      ? `
Optional DeepSeek review was not included because the free provider was rate-limited. The deterministic diagnosis remains the source of truth.

Cached provider review example, not live output

Summary: ${options.cachedProviderReview.summary}

Improved explanation: ${options.cachedProviderReview.improvedExplanation}

Patch review: ${options.cachedProviderReview.patchReview}

Cautions:
${options.cachedProviderReview.cautions.map((caution) => `- ${caution}`).join("\n")}

Suggested verification:
${options.cachedProviderReview.suggestedVerification.map((command) => `- \`${command}\``).join("\n")}
`
    : options.providerStatus === "free_model_rate_limited"
      ? "Optional DeepSeek review was not included because the free provider was rate-limited. The deterministic diagnosis remains the source of truth."
      : "No optional LLM review was included. The deterministic diagnosis remains the source of truth.";

  return `# Build Doctor Incident Report

## Summary
The deterministic engine identified ${diagnosis.label} with ${(diagnosis.confidence * 100).toFixed(0)}% confidence.

Failure type: ${diagnosis.failureType}

## Root Cause
${diagnosis.probableRootCause}

## Evidence
${evidence}

## Diagnostic Trace
${trace}

Trace metadata:
- Mode: ${diagnosis.graphRun.mode}
- Run id: ${diagnosis.graphRun.id}
- Node sequence: ${diagnosis.graphRun.nodeSequence.join(" -> ")}
- Checkpoint-safe snapshot: ${diagnosis.graphRun.checkpointSafe ? "true" : "false"}
- Approval state: ${diagnosis.graphRun.approvalState}
- Provider status: ${diagnosis.graphRun.providerStatus}

## Patch Draft
Title: ${diagnosis.patchDraft.title}

Failure type: ${diagnosis.patchDraft.failureType}

Confidence: ${diagnosis.patchDraft.confidence}

Rationale: ${diagnosis.patchDraft.rationale}

Likely affected files:
${patchFiles}

\`\`\`
${diagnosis.patchDraft.snippet}
\`\`\`

Patch risks:
${diagnosis.patchDraft.risks.map((risk) => `- ${risk}`).join("\n")}

## Suggested Solutions
${suggestedSolutions}

## Autofill Fix Plan
${autofillFixPlan}

## Optional LLM Review
${optionalLlmReview}

## Verification Commands
${commands}

## Remaining Risks
${risks}

## Export Metadata
- Deterministic engine: local Build Doctor
- Raw log stored: false
- Raw secrets redacted before diagnosis and reporting: true
- Optional LLM review included: ${diagnosis.aiPatchReview ? "true" : "false"}
- Optional provider status: ${options.providerStatus ?? "none"}
- Cached provider review included: ${options.cachedProviderReview ? "true - cached provider review example, not live output" : "false"}
- Suggested solutions included: ${selectedSolutionSuggestions.length}
- Safety Notes: No patch is applied automatically. The patch draft is a review aid, not an automated code change. Optional provider review receives sanitized diagnosis only when explicitly enabled, and deterministic diagnosis remains authoritative if provider review is disabled or unavailable.
`;
}

export function runEvalSuite(): EvalResults {
  const cases = sampleLogs.map((sample) => {
    const diagnosis = diagnoseBuildLog(sample.log);
    const fixText = diagnosis.fixPlan.join(" ").toLowerCase();
    const evidenceText = diagnosis.evidence.map((line) => line.content).join(" ").toLowerCase();
    const categoryCorrect = diagnosis.failureType === sample.expected;
    const hasFixSignal = sample.requiredFixSignals.some((signal) => fixText.includes(signal.toLowerCase()));
    const hasEvidence = evidenceText.length > 0;
    const secretSafe = !/postgresql:\/\/user:secret/i.test(diagnosis.redactedLog);
    const result: EvalResultLabel = categoryCorrect && hasFixSignal && hasEvidence && secretSafe ? "PASS" : categoryCorrect ? "PARTIAL" : "FAIL";

    return {
      id: sample.id,
      name: sample.title,
      expected: sample.expected,
      actual: diagnosis.failureType,
      result,
      notes: [
        categoryCorrect ? "Category matched expected taxonomy." : "Category mismatch.",
        hasFixSignal ? "Fix plan includes relevant remediation language." : "Fix plan needs stronger matching remediation.",
        secretSafe ? "Redaction safety check passed." : "Redaction safety check failed.",
      ],
    };
  });

  const passed = cases.filter((item) => item.result === "PASS").length;
  const partial = cases.filter((item) => item.result === "PARTIAL").length;
  const failed = cases.filter((item) => item.result === "FAIL").length;

  return {
    total: cases.length,
    passed,
    partial,
    failed,
    score: Math.round(((passed + partial * 0.5) / cases.length) * 100),
    cases,
  };
}
