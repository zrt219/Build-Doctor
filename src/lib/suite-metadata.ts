export type SuiteApp = {
  id: string;
  name: string;
  subtitle: string;
  productionUrl: string;
  demoUrl: string;
  githubUrl: string;
  statusEndpoint: string;
  evalEndpoint: string;
  integrationEndpoint: string;
  demoMode: string;
  targetRoles: string[];
  proofSignals: string[];
  primaryDemoAction: string;
  evalSummary: string;
};

export type SuiteWorkflowStep = {
  id: string;
  appId: string;
  appName: string;
  label: string;
  plainEnglish: string;
  output: string;
  href: string;
};

export const suiteApps: SuiteApp[] = [
  {
    id: "build-doctor",
    name: "Vercel Build Doctor Agent",
    subtitle: "Diagnoses failed builds, extracts evidence, proposes fixes, and exports incident reports.",
    productionUrl: "https://vercel-build-doctor-agent.vercel.app",
    demoUrl: "https://vercel-build-doctor-agent.vercel.app/build-doctor",
    githubUrl: "https://github.com/zrt219",
    statusEndpoint: "https://vercel-build-doctor-agent.vercel.app/api/health",
    evalEndpoint: "https://vercel-build-doctor-agent.vercel.app/api/eval",
    integrationEndpoint: "https://vercel-build-doctor-agent.vercel.app/api/integration-health",
    demoMode: "DEMO MODE",
    targetRoles: ["OpenAI Codex", "Vercel Agent", "Grafana AI/Ops"],
    proofSignals: ["Log parsing", "Secret redaction", "Failure taxonomy", "Incident report export"],
    primaryDemoAction: "Diagnose a failed Vercel build",
    evalSummary: "8 deterministic build-failure fixtures",
  },
  {
    id: "gateway-failover",
    name: "AI Gateway Failover Playground",
    subtitle: "Simulates provider routing, outage fallback, latency budgets, cost controls, and request traces.",
    productionUrl: "https://ai-gateway-failover-playground.vercel.app",
    demoUrl: "https://ai-gateway-failover-playground.vercel.app",
    githubUrl: "https://github.com/zrt219",
    statusEndpoint: "https://ai-gateway-failover-playground.vercel.app/api/health",
    evalEndpoint: "https://ai-gateway-failover-playground.vercel.app/api/eval",
    integrationEndpoint: "https://ai-gateway-failover-playground.vercel.app/api/integration-health",
    demoMode: "DEMO PROVIDER MOCKS",
    targetRoles: ["Vercel AI Gateway", "Platform AI Infra", "AI SDK"],
    proofSignals: ["Provider policy", "Fallback trace", "Latency/cost dashboard", "Circuit breakers"],
    primaryDemoAction: "Route a request through failover",
    evalSummary: "5 routing and budget fixtures",
  },
  {
    id: "enterprise-workflow",
    name: "Enterprise Agent Workflow Studio",
    subtitle: "Designs tool-safe enterprise agent workflows with approval gates, risk scoring, and audit exports.",
    productionUrl: "https://enterprise-agent-workflow-studio.vercel.app",
    demoUrl: "https://enterprise-agent-workflow-studio.vercel.app",
    githubUrl: "https://github.com/zrt219",
    statusEndpoint: "https://enterprise-agent-workflow-studio.vercel.app/api/health",
    evalEndpoint: "https://enterprise-agent-workflow-studio.vercel.app/api/eval",
    integrationEndpoint: "https://enterprise-agent-workflow-studio.vercel.app/api/integration-health",
    demoMode: "DEMO LOCAL ONLY",
    targetRoles: ["Cohere Agentic Workflows", "Anthropic Enterprise", "PointClickCare Autonomous Agent"],
    proofSignals: ["Tool registry", "Approval gates", "Agent graph", "Audit report"],
    primaryDemoAction: "Generate an approval-gated workflow",
    evalSummary: "4 approval-policy fixtures",
  },
  {
    id: "resume-rag-auditor",
    name: "Resume Evidence RAG Auditor",
    subtitle: "Audits resume claims against project evidence and generates grounded, role-aligned bullets.",
    productionUrl: "https://resume-evidence-rag-auditor.vercel.app",
    demoUrl: "https://resume-evidence-rag-auditor.vercel.app",
    githubUrl: "https://github.com/zrt219",
    statusEndpoint: "https://resume-evidence-rag-auditor.vercel.app/api/health",
    evalEndpoint: "https://resume-evidence-rag-auditor.vercel.app/api/eval",
    integrationEndpoint: "https://resume-evidence-rag-auditor.vercel.app/api/integration-health",
    demoMode: "DEMO JSON RETRIEVAL",
    targetRoles: ["Applied AI", "RAG Engineer", "Customer-facing AI Engineer"],
    proofSignals: ["Evidence retrieval", "Claim verification", "Gap flags", "Grounded bullet export"],
    primaryDemoAction: "Verify claims against evidence",
    evalSummary: "4 safety and grounding fixtures",
  },
];

export const suiteWorkflowSteps: SuiteWorkflowStep[] = [
  {
    id: "paste-build-logs",
    appId: "build-doctor",
    appName: "Build Doctor",
    label: "Paste build logs",
    plainEnglish: "Start with a failed Vercel or Next.js build log.",
    output: "Secret-redacted log input",
    href: "https://vercel-build-doctor-agent.vercel.app/build-doctor#diagnose",
  },
  {
    id: "diagnose-root-cause",
    appId: "build-doctor",
    appName: "Build Doctor",
    label: "Diagnose root cause",
    plainEnglish: "Classify the first fatal signal and expose the supporting evidence lines.",
    output: "Root cause, confidence, evidence lines",
    href: "https://vercel-build-doctor-agent.vercel.app/build-doctor#diagnose",
  },
  {
    id: "show-trace",
    appId: "gateway-failover",
    appName: "AI Gateway",
    label: "Show trace",
    plainEnglish: "Display a deterministic request trace that explains the route and fallback decision.",
    output: "Trace timeline with status labels",
    href: "https://ai-gateway-failover-playground.vercel.app",
  },
  {
    id: "suggest-patch",
    appId: "enterprise-workflow",
    appName: "Enterprise Studio",
    label: "Suggest patch",
    plainEnglish: "Turn the diagnosis into a guarded patch plan with approval and verification checks.",
    output: "Patch checklist and audit gate",
    href: "https://enterprise-agent-workflow-studio.vercel.app",
  },
  {
    id: "export-report",
    appId: "resume-rag-auditor",
    appName: "Resume Auditor",
    label: "Export report",
    plainEnglish: "Export a grounded evidence report that stays within verified project scope.",
    output: "Markdown report for reviewer handoff",
    href: "https://resume-evidence-rag-auditor.vercel.app",
  },
];

export const suiteDemoFlow = suiteWorkflowSteps.map((step) => `${step.label}: ${step.output}.`);
