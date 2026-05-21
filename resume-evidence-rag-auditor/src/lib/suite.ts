export const suiteLinks = [
  { label: "Suite Hub", href: "https://vercel-build-doctor-agent.vercel.app" },
  { label: "Build Doctor", href: "https://vercel-build-doctor-agent.vercel.app/build-doctor" },
  { label: "AI Gateway", href: "https://ai-gateway-failover-playground.vercel.app" },
  { label: "Enterprise Studio", href: "https://enterprise-agent-workflow-studio.vercel.app" },
  { label: "Resume Auditor", href: "https://resume-evidence-rag-auditor.vercel.app" },
];

export const suiteProof = [
  "DEMO JSON RETRIEVAL",
  "Claim verification",
  "Evidence gaps",
  "Grounded bullets",
];

export const suiteWorkflowSteps = [
  { id: "paste-build-logs", appName: "Build Doctor", label: "Paste build logs", output: "Secret-redacted log input", href: "https://vercel-build-doctor-agent.vercel.app/build-doctor#diagnose" },
  { id: "diagnose-root-cause", appName: "Build Doctor", label: "Diagnose root cause", output: "Root cause, confidence, evidence lines", href: "https://vercel-build-doctor-agent.vercel.app/build-doctor#diagnose" },
  { id: "show-trace", appName: "AI Gateway", label: "Show trace", output: "Trace timeline with status labels", href: "https://ai-gateway-failover-playground.vercel.app" },
  { id: "suggest-patch", appName: "Enterprise Studio", label: "Suggest patch", output: "Patch checklist and audit gate", href: "https://enterprise-agent-workflow-studio.vercel.app" },
  { id: "export-report", appName: "Resume Auditor", label: "Export report", output: "Markdown report for reviewer handoff", href: "https://resume-evidence-rag-auditor.vercel.app" },
];

export const activeWorkflowStepId = "export-report";
