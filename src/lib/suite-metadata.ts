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

export const suiteDemoFlow = [
  "Diagnose a failed build in Build Doctor.",
  "Route an AI request through Gateway Failover.",
  "Design an approval-gated enterprise workflow.",
  "Verify resume and project claims with RAG Auditor.",
  "Export evidence links and reports for recruiter review.",
];
