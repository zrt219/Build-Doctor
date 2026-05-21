import type { AutofillFixPlan, FailureType, PatchDraft, SolutionSuggestion } from "../schemas";

function normalizeSnippetLanguage(language: NonNullable<PatchDraft["snippetLanguage"]>): "bash" | "ts" | "json" | "env" | "txt" {
  if (language === "text" || language === "tsx" || language === "js") return "txt";
  return language;
}

const envVarSuggestions: Partial<Record<FailureType, SolutionSuggestion["envVars"]>> = {
  SUPABASE_CONFIG_ERROR: [
    {
      name: "NEXT_PUBLIC_SUPABASE_URL",
      visibility: "public_client",
      required: true,
      placeholder: "https://your-project.supabase.co",
      warning: "Use the public project URL only. Do not paste service-role keys into client code.",
    },
    {
      name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      visibility: "public_client",
      required: true,
      placeholder: "public-anon-key-from-supabase-settings",
      warning: "Anon keys are public client configuration. Service-role keys must stay server-only.",
    },
  ],
  PRISMA_DATABASE_ERROR: [
    {
      name: "DATABASE_URL",
      visibility: "server_only",
      required: true,
      placeholder: "[REDACTED_DATABASE_URL]",
      warning: "Database URLs are server-only secrets and should never be exposed to client bundles.",
    },
  ],
  STRIPE_WEBHOOK_ERROR: [
    {
      name: "STRIPE_WEBHOOK_SECRET",
      visibility: "server_only",
      required: true,
      placeholder: "[REDACTED_STRIPE_WEBHOOK_SECRET]",
      warning: "Use the matching test or live webhook secret for the deployment environment.",
    },
  ],
  MISSING_ENV_VAR: [
    {
      name: "REQUIRED_ENV_NAME",
      visibility: "unknown",
      required: true,
      placeholder: "set-in-vercel-project-settings",
      warning: "Confirm whether the variable is public client configuration or server-only before exposing it.",
    },
  ],
  VERCEL_ENV_VAR_MISSING: [
    {
      name: "REQUIRED_ENV_NAME",
      visibility: "unknown",
      required: true,
      placeholder: "set-in-vercel-project-settings",
      warning: "Check Preview and Production scopes separately in Vercel.",
    },
  ],
};

function buildReportInsert(suggestion: Pick<SolutionSuggestion, "title" | "summary" | "steps" | "verificationCommands" | "risks">) {
  return [
    `### ${suggestion.title}`,
    "",
    suggestion.summary,
    "",
    "Steps:",
    ...suggestion.steps.map((step) => `- ${step}`),
    "",
    "Verification commands:",
    ...suggestion.verificationCommands.map((command) => `- \`${command}\``),
    "",
    "Review risks:",
    ...suggestion.risks.map((risk) => `- ${risk}`),
  ].join("\n");
}

export function buildSolutionSuggestions(failureType: FailureType, patchDraft: PatchDraft): SolutionSuggestion[] {
  const primary: Omit<SolutionSuggestion, "reportInsert"> = {
    id: `${failureType.toLowerCase()}-primary-fix`,
    title: patchDraft.title,
    summary: patchDraft.rationale,
    whenToUse:
      failureType === "UNKNOWN"
        ? "Use this when the log does not contain enough evidence for a safe code change."
        : "Use this when the evidence lines match the detected failure type and the patch draft targets the first fatal signal.",
    failureType,
    confidence: patchDraft.confidence,
    likelyAffectedFiles: patchDraft.likelyAffectedFiles,
    envVars: envVarSuggestions[failureType],
    steps:
      failureType === "UNKNOWN"
        ? ["Collect the complete build log.", "Identify the first fatal error and nearby stack frames.", "Avoid applying a code patch until stronger evidence exists."]
        : ["Review the evidence line and affected files.", "Apply the smallest configuration or code change that addresses the failure.", "Run verification commands before redeploying."],
    snippet: {
      label: "Suggested snippet",
      language: normalizeSnippetLanguage(patchDraft.snippetLanguage ?? "text"),
      value: patchDraft.snippet,
    },
    verificationCommands: patchDraft.verificationCommands,
    risks: patchDraft.risks,
  };

  const verification: Omit<SolutionSuggestion, "reportInsert"> = {
    id: `${failureType.toLowerCase()}-verification-check`,
    title: failureType === "UNKNOWN" ? "Collect more diagnostic evidence" : "Verify the fix before redeploying",
    summary:
      failureType === "UNKNOWN"
        ? "The safest solution is to gather stronger evidence before changing code."
        : "Treat the suggested patch as a review aid and prove the build locally before pushing a new deployment.",
    whenToUse:
      failureType === "UNKNOWN"
        ? "Use this when the classifier intentionally returned conservative guidance."
        : "Use this after reviewing or applying the primary fix outside Build Doctor.",
    failureType,
    confidence: failureType === "UNKNOWN" ? "low" : "medium",
    likelyAffectedFiles: patchDraft.likelyAffectedFiles,
    steps:
      failureType === "UNKNOWN"
        ? ["Re-run the build with verbose logging if available.", "Capture the first fatal error and stack trace.", "Add a new deterministic recipe only after the failure class is understood."]
        : ["Run the listed verification commands.", "Confirm no secrets were added to source files.", "Retry the Vercel build only after local verification passes."],
    snippet:
      failureType === "UNKNOWN"
        ? {
            label: "Evidence checklist",
            language: "txt",
            value: "First fatal error:\nAffected file:\nFramework/package version:\nRecent config or dependency change:",
          }
        : {
            label: "Verification checklist",
            language: "bash",
            value: patchDraft.verificationCommands.join("\n"),
          },
    verificationCommands: patchDraft.verificationCommands,
    risks:
      failureType === "UNKNOWN"
        ? ["A generic fix could hide the real failure.", "Additional repository context may be required."]
        : ["A passing local build does not guarantee Vercel environment variables are configured.", "Do not treat this as an automatic code patch."],
  };

  return [primary, verification].map((suggestion) => ({
    ...suggestion,
    reportInsert: buildReportInsert(suggestion),
  }));
}

export function buildAutofillFixPlan(suggestions: SolutionSuggestion[], selectedSuggestionIds = suggestions.slice(0, 1).map((suggestion) => suggestion.id)): AutofillFixPlan {
  const selected = suggestions.filter((suggestion) => selectedSuggestionIds.includes(suggestion.id));
  const active = selected.length ? selected : suggestions.slice(0, 1);
  const commands = Array.from(new Set(active.flatMap((suggestion) => suggestion.verificationCommands)));
  const snippets = active.flatMap((suggestion) => (suggestion.snippet ? [suggestion.snippet] : []));
  const editablePlan = active
    .map((suggestion, index) => [`${index + 1}. ${suggestion.title}`, suggestion.summary, ...suggestion.steps.map((step) => `- ${step}`)].join("\n"))
    .join("\n\n");

  return {
    title: "Editable deterministic fix plan",
    selectedSuggestionIds: active.map((suggestion) => suggestion.id),
    editablePlan,
    commands,
    snippets,
  };
}
