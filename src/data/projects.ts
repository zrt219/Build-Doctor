export type ProofStatus = "live" | "repo" | "local-evidence" | "planned" | "unverified";

export type PortfolioProjectRecord = {
  id: string;
  title: string;
  category:
    | "AI / Agentic Systems"
    | "RAG / Evidence / Eval Systems"
    | "Vercel Developer Tools"
    | "Web3 / Solidity / Foundry"
    | "Digital Twin / Simulation"
    | "Product Systems / UMATTR"
    | "Visual / Interactive Systems";
  valueProposition: string;
  stack: string[];
  githubUrl?: string;
  demoUrl?: string;
  proofStatus: ProofStatus;
  technicalSignal: string;
  evidenceRefs: string[];
  lastVerified: string;
  confidence: "High" | "Medium" | "Review";
  urlKind?: "live-demo" | "repo" | "reference" | "external";
  featured?: boolean;
  signature?: boolean;
  proofBriefSlug?: string;
  signatureDetails?: SignatureProjectDetails;
};

export const projectsLastUpdated = "2026-05-24";
export const projectsSourceLabel = "github-profile-source-memory.md + May 24 evidence report";

export type SignatureProjectDetails = {
  slug: string;
  headline: string;
  purpose: string;
  proofSummary: string;
  proofPoints: Array<{
    label: string;
    detail: string;
  }>;
  evidenceSources: Array<{
    label: string;
    detail: string;
    href?: string;
  }>;
  qaStatus: Array<{
    label: string;
    result: string;
  }>;
  limitations: string[];
};

const githubBlobBase = "https://github.com/zrt219/Zhanes-Portfolio-Vercel-/blob/master";

const signatureDetailsById: Record<string, SignatureProjectDetails> = {
  "evidence-dashboard": {
    slug: "evidence-dashboard",
    headline: "A public proof surface for AI engineering evidence and claim grounding.",
    purpose: "Organizes project proof, public-safe documentation, source labels, and portfolio evidence into a single inspection surface.",
    proofSummary: "Best starting point for understanding the evidence system behind the portfolio.",
    proofPoints: [
      { label: "Evidence architecture", detail: "Shows how work artifacts, project links, and proof-safe summaries can be organized without exposing raw private logs." },
      { label: "Claim discipline", detail: "Positions source labels and public-safe documentation ahead of unsupported portfolio language." },
      { label: "Portfolio integration", detail: "Serves as the signature proof system linked from the mainframe, README, and featured project grid." },
    ],
    evidenceSources: [
      { label: "Public demo", detail: "Live Vercel surface for the Evidence Dashboard.", href: "https://zhane-grey-evidence-dashboard.vercel.app" },
      { label: "Public repository", detail: "AI-Engineering-Evidence-Engine source repository.", href: "https://github.com/zrt219/AI-Engineering-Evidence-Engine" },
      { label: "GitHub source memory", detail: "Public-safe repository/source snapshot used by the mainframe.", href: `${githubBlobBase}/evidence/public/github-profile-source-memory.md` },
    ],
    qaStatus: [
      { label: "Production link", result: "Live demo linked from featured card and README." },
      { label: "Mainframe role", result: "Pinned as the signature proof surface." },
      { label: "Privacy boundary", result: "Uses public-safe descriptions and links only." },
    ],
    limitations: [
      "This brief does not expose raw local evidence, private paths, private prompts, or session logs.",
      "Claims are intentionally scoped to visible project proof and public-safe source summaries.",
    ],
  },
  "build-doctor": {
    slug: "build-doctor",
    headline: "A deterministic diagnostic workflow for failed Vercel and Next.js builds.",
    purpose: "Turns pasted build logs into redacted, traceable diagnostic reports with root cause, evidence lines, safe patch draft, and exportable incident markdown.",
    proofSummary: "Shows developer-tool product thinking around failure analysis, redaction, deterministic rules, optional model review, and test coverage.",
    proofPoints: [
      { label: "Deterministic diagnosis", detail: "Classifies build failures through local rules before optional provider review is considered." },
      { label: "Secret-safe workflow", detail: "Redacts sensitive values before report generation or optional external enrichment." },
      { label: "Operational QA", detail: "Covered by unit tests, Playwright workflow tests, audit checks, and production health endpoints." },
    ],
    evidenceSources: [
      { label: "Build Doctor app", detail: "Live diagnostic workflow route.", href: "https://vercel-build-doctor-agent.vercel.app/build-doctor" },
      { label: "Public repository", detail: "Build Doctor source repository.", href: "https://github.com/zrt219/Build-Doctor" },
      { label: "Public health endpoint", detail: "Production readiness response for the deterministic demo.", href: "https://vercel-build-doctor-agent.vercel.app/api/health" },
    ],
    qaStatus: [
      { label: "Unit coverage", result: "Vitest suite covers deterministic diagnosis behavior." },
      { label: "Browser workflow", result: "Playwright covers the five-step Build Doctor flow." },
      { label: "Production", result: "Deployed to Vercel production with health checks." },
    ],
    limitations: [
      "Optional LLM enrichment is not the source of truth and can be disabled or rate-limited.",
      "Demo fixtures are labeled as deterministic demo behavior, not production incident history.",
    ],
  },
  "resume-evidence-rag-auditor": {
    slug: "resume-evidence-rag-auditor",
    headline: "A resume-claim audit surface for evidence-grounded RAG and eval discipline.",
    purpose: "Checks resume-style claims against project evidence and highlights unsupported or weak wording before it becomes public copy.",
    proofSummary: "Shows how retrieval, evaluation, and claim boundaries can be presented as a practical product workflow.",
    proofPoints: [
      { label: "Claim grounding", detail: "Connects portfolio language to supporting project evidence instead of relying on broad assertions." },
      { label: "RAG/eval UX", detail: "Frames retrieval and evaluation as an inspectable workflow for documentation quality." },
      { label: "Public-safe writing", detail: "Supports the broader mainframe rule that uncertain claims must be qualified or removed." },
    ],
    evidenceSources: [
      { label: "Public demo", detail: "Live Resume Evidence RAG Auditor app.", href: "https://resume-evidence-rag-auditor.vercel.app" },
      { label: "Public repository", detail: "Resume Evidence RAG Auditor source repository.", href: "https://github.com/zrt219/resume-evidence-rag-auditor" },
      { label: "Daily evidence report", detail: "Public-safe evidence refresh summary.", href: `${githubBlobBase}/evidence/public/daily-evidence-report-2026-05-24.md` },
    ],
    qaStatus: [
      { label: "Project status", result: "Live public demo and repository linked from the mainframe." },
      { label: "Evidence boundary", result: "Presented as claim-audit work, not as unsupported hiring claims." },
      { label: "Mainframe coverage", result: "Included in featured proof systems and searchable directory." },
    ],
    limitations: [
      "The proof brief does not include private resume artifacts or raw local documents.",
      "The brief describes the public project role and does not claim production customer usage.",
    ],
  },
  "ai-gateway-failover": {
    slug: "ai-gateway-failover",
    headline: "A provider-routing playground for AI gateway fallback and observability thinking.",
    purpose: "Simulates provider routing, fallback paths, latency budgets, outage handling, and trace-style AI infrastructure decisions.",
    proofSummary: "Shows applied AI infrastructure design through a small, inspectable product surface.",
    proofPoints: [
      { label: "Fallback architecture", detail: "Models how AI systems should continue gracefully when a provider is slow, unavailable, or over budget." },
      { label: "Traceability", detail: "Presents routing and request behavior as observable product state." },
      { label: "Product clarity", detail: "Turns infrastructure tradeoffs into a usable demo instead of a hidden backend note." },
    ],
    evidenceSources: [
      { label: "Public demo", detail: "Live AI Gateway Failover Playground.", href: "https://ai-gateway-failover-playground.vercel.app" },
      { label: "Public repository", detail: "AI Gateway Failover source repository.", href: "https://github.com/zrt219/ai-gateway-failover-playground" },
      { label: "GitHub source memory", detail: "Public-safe repository/source snapshot.", href: `${githubBlobBase}/evidence/public/github-profile-source-memory.md` },
    ],
    qaStatus: [
      { label: "Project status", result: "Live public demo and repository linked from the mainframe." },
      { label: "Mainframe category", result: "Grouped under AI / Agentic Systems." },
      { label: "Proof boundary", result: "Described as a playground and simulation, not production traffic." },
    ],
    limitations: [
      "The public brief does not claim real provider uptime, paid traffic, or production SLA history.",
      "Routing behavior is positioned as a demonstration of infrastructure design patterns.",
    ],
  },
  "enterprise-workflow": {
    slug: "enterprise-workflow",
    headline: "An approval-gated agent workflow studio for risk-aware AI system design.",
    purpose: "Shows how agent workflows can include approval gates, risk scoring, audit handoff, and review checkpoints before actions proceed.",
    proofSummary: "Demonstrates governance patterns for agentic workflows without claiming enterprise deployment.",
    proofPoints: [
      { label: "Agent workflow design", detail: "Models multi-step agent flows with explicit handoff and review checkpoints." },
      { label: "Governance UX", detail: "Makes risk scoring and approval gates visible instead of burying them in backend logic." },
      { label: "Audit posture", detail: "Frames agent outputs as reviewable artifacts rather than automatic truth." },
    ],
    evidenceSources: [
      { label: "Public demo", detail: "Live Enterprise Agent Workflow Studio.", href: "https://enterprise-agent-workflow-studio.vercel.app" },
      { label: "Public repository", detail: "Enterprise Agent Workflow Studio source repository.", href: "https://github.com/zrt219/enterprise-agent-workflow-studio" },
      { label: "Daily evidence report", detail: "Public-safe evidence refresh summary.", href: `${githubBlobBase}/evidence/public/daily-evidence-report-2026-05-24.md` },
    ],
    qaStatus: [
      { label: "Project status", result: "Live public demo and repository linked from the mainframe." },
      { label: "Mainframe category", result: "Grouped under AI / Agentic Systems." },
      { label: "Proof boundary", result: "Described as a workflow studio, not enterprise customer deployment." },
    ],
    limitations: [
      "The public brief does not claim production enterprise adoption or private customer data.",
      "Approval and risk concepts are presented as product-system patterns unless separately verified.",
    ],
  },
};

const projectRecords: Omit<PortfolioProjectRecord, "evidenceRefs" | "lastVerified" | "confidence" | "urlKind" | "proofBriefSlug" | "signatureDetails">[] = [
  {
    id: "evidence-dashboard",
    title: "Zhane Grey Evidence Dashboard",
    category: "RAG / Evidence / Eval Systems",
    valueProposition: "Signature proof surface that organizes AI engineering evidence, portfolio artifacts, and public-safe documentation.",
    stack: ["Next.js", "Evidence UI", "Documentation", "Vercel"],
    githubUrl: "https://github.com/zrt219/AI-Engineering-Evidence-Engine",
    demoUrl: "https://zhane-grey-evidence-dashboard.vercel.app",
    proofStatus: "live",
    technicalSignal: "Proof-oriented AI engineering and claim verification.",
    featured: true,
    signature: true,
  },
  {
    id: "build-doctor",
    title: "Vercel Build Doctor Agent",
    category: "Vercel Developer Tools",
    valueProposition: "Diagnoses failed Vercel/Next.js builds, redacts secrets, explains root cause, and exports incident reports.",
    stack: ["Next.js", "TypeScript", "Vitest", "Playwright", "Vercel"],
    githubUrl: "https://github.com/zrt219/Build-Doctor",
    demoUrl: "https://vercel-build-doctor-agent.vercel.app/build-doctor",
    proofStatus: "live",
    technicalSignal: "Developer tools, build diagnostics, evals, and reliability UX.",
    featured: true,
  },
  {
    id: "ai-resume-tailor",
    title: "AI Resume Tailor Service",
    category: "AI / Agentic Systems",
    valueProposition: "Role-targeted resume and cover-letter workflow with evidence-first positioning.",
    stack: ["React", "TypeScript", "Vercel", "GitHub"],
    githubUrl: "https://github.com/zrt219/AI-resume-tailor-service-",
    demoUrl: "https://ai-resume-tailor-service.vercel.app",
    proofStatus: "live",
    technicalSignal: "Applied AI product UX and evidence-aware document automation.",
    featured: true,
  },
  {
    id: "resume-evidence-rag-auditor",
    title: "Resume Evidence RAG Auditor",
    category: "RAG / Evidence / Eval Systems",
    valueProposition: "Audits resume claims against project evidence and flags unsupported wording.",
    stack: ["Next.js", "RAG", "Evidence QA", "Vercel"],
    githubUrl: "https://github.com/zrt219/resume-evidence-rag-auditor",
    demoUrl: "https://resume-evidence-rag-auditor.vercel.app",
    proofStatus: "live",
    technicalSignal: "RAG, claim grounding, eval discipline, and evidence-centered AI QA.",
    featured: true,
  },
  {
    id: "ai-gateway-failover",
    title: "AI Gateway Failover Playground",
    category: "AI / Agentic Systems",
    valueProposition: "Simulates provider routing, outage fallback, latency budgets, and request traces.",
    stack: ["Next.js", "AI Gateway", "Routing", "Eval fixtures"],
    githubUrl: "https://github.com/zrt219/ai-gateway-failover-playground",
    demoUrl: "https://ai-gateway-failover-playground.vercel.app",
    proofStatus: "live",
    technicalSignal: "AI infrastructure thinking, provider fallbacks, and observability.",
    featured: true,
  },
  {
    id: "enterprise-workflow",
    title: "Enterprise Agent Workflow Studio",
    category: "AI / Agentic Systems",
    valueProposition: "Designs approval-gated agent workflows with risk scoring and audit handoff.",
    stack: ["Next.js", "Agent graphs", "Approval gates", "Audit reports"],
    githubUrl: "https://github.com/zrt219/enterprise-agent-workflow-studio",
    demoUrl: "https://enterprise-agent-workflow-studio.vercel.app",
    proofStatus: "live",
    technicalSignal: "Enterprise-safe agent workflow design and governance patterns.",
    featured: true,
  },
  {
    id: "agentic-rag-memory-digital-twin",
    title: "Agentic RAG Memory Digital Twin Edge System",
    category: "Digital Twin / Simulation",
    valueProposition: "Public repository lane for RAG memory and digital-twin edge-system concepts; demo URL is withheld until reverified.",
    stack: ["RAG", "Digital twin", "Edge systems", "Vercel"],
    githubUrl: "https://github.com/zrt219/agentic-rag-memory-digital-twin-edge-system",
    proofStatus: "repo",
    technicalSignal: "Agent memory, cyber-physical systems, and edge workflow architecture.",
    featured: true,
  },
  {
    id: "datumx",
    title: "DatumX",
    category: "Web3 / Solidity / Foundry",
    valueProposition: "Verification protocol for AI-transformed data with provenance, validator review, and on-chain lineage.",
    stack: ["TypeScript", "Solidity", "Foundry", "XRPL EVM"],
    githubUrl: "https://github.com/zrt219/DatumX",
    demoUrl: "https://datumx.vercel.app",
    proofStatus: "live",
    technicalSignal: "AI data provenance, Web3 state, and audit-ready event systems.",
    featured: true,
  },
  {
    id: "forgex",
    title: "ForgeX",
    category: "Web3 / Solidity / Foundry",
    valueProposition: "Browser deployment terminal for Foundry build, deploy, and call workflows with command-style interaction.",
    stack: ["Node.js", "Express", "Foundry", "Three.js", "GLSL"],
    githubUrl: "https://github.com/zrt219/ForgeX",
    demoUrl: "https://forgex-theta.vercel.app",
    proofStatus: "live",
    technicalSignal: "Developer tooling for blockchain deployment workflows and command surfaces.",
  },
  {
    id: "uo2x",
    title: "UO2X / Nuclear Frontier",
    category: "Digital Twin / Simulation",
    valueProposition: "Deterministic simulation architecture for nuclear fuel logistics and strategy-game systems.",
    stack: ["Next.js", "TypeScript", "MapLibre", "deck.gl", "Vitest"],
    proofStatus: "local-evidence",
    technicalSignal: "Simulation systems, deterministic product state, and technical game-core architecture.",
  },
  {
    id: "u235-fuel-cycle",
    title: "U235 Fuel Cycle",
    category: "Web3 / Solidity / Foundry",
    valueProposition: "Six-stage uranium processing pipeline modeled as a deterministic Solidity state machine.",
    stack: ["Solidity", "Foundry", "XRPL EVM", "HTML"],
    githubUrl: "https://github.com/zrt219/-U235-Fuel-Cycle-",
    demoUrl: "https://u235-fuel-cycle.vercel.app/",
    proofStatus: "live",
    technicalSignal: "Foundry-tested state machines and industrial workflow modeling.",
  },
  {
    id: "zuc-mine-command-center",
    title: "ZUC Mine Command Center",
    category: "Web3 / Solidity / Foundry",
    valueProposition: "Real-time uranium mine operations dashboard for XRPL EVM sidechain testnet workflows.",
    stack: ["Solidity", "Three.js", "XRPL EVM", "HTML"],
    githubUrl: "https://github.com/zrt219/Zuc-Mine-Command-Center",
    demoUrl: "https://zuc-mine-command-center.vercel.app/",
    proofStatus: "live",
    technicalSignal: "3D operational dashboards and wallet-connected state-machine UX.",
  },
  {
    id: "isr-network",
    title: "ISR Network",
    category: "Web3 / Solidity / Foundry",
    valueProposition: "In-situ recovery uranium extraction workflow with event-driven Solidity lifecycle modeling.",
    stack: ["Solidity", "XRPL EVM", "State machines", "HTML"],
    githubUrl: "https://github.com/zrt219/ISR-Network",
    demoUrl: "https://isr-network.vercel.app/",
    proofStatus: "live",
    technicalSignal: "Domain-specific smart-contract workflow design.",
  },
  {
    id: "dark-matter-farm",
    title: "Dark Matter Farm",
    category: "Web3 / Solidity / Foundry",
    valueProposition: "XRPL EVM testnet staking protocol with tiered locks, yield multipliers, and dashboard proof.",
    stack: ["Solidity", "Staking", "XRPL EVM", "HTML"],
    githubUrl: "https://github.com/zrt219/Dark-Matter-Farm",
    demoUrl: "https://dark-matter-farm.vercel.app/",
    proofStatus: "live",
    technicalSignal: "Protocol design, token accounting, and Web3 frontend integration.",
  },
  {
    id: "cohr-lab",
    title: "COHR Lab",
    category: "Web3 / Solidity / Foundry",
    valueProposition: "Semiconductor laser fabrication modeled as an immutable on-chain lifecycle workflow.",
    stack: ["Solidity", "State machines", "XRPL EVM", "HTML"],
    githubUrl: "https://github.com/zrt219/Cohr-Lab",
    demoUrl: "https://cohr-lab.vercel.app",
    proofStatus: "live",
    technicalSignal: "Industrial digital-process modeling with audit-style lifecycle events.",
  },
  {
    id: "fuji",
    title: "Fuji",
    category: "Visual / Interactive Systems",
    valueProposition: "Visual portfolio atlas and gallery system built as a Next.js App Router project.",
    stack: ["Next.js", "TypeScript", "Visual systems", "Vercel"],
    githubUrl: "https://github.com/zrt219/Fuji",
    demoUrl: "https://fuji-byzrt.vercel.app",
    proofStatus: "live",
    technicalSignal: "Visual product polish and portfolio presentation systems.",
  },
  {
    id: "ethex",
    title: "Ethex Dynamic House Edge Console",
    category: "Web3 / Solidity / Foundry",
    valueProposition: "Betting and settlement dApp with bounded settlement flows and public repo proof.",
    stack: ["Solidity", "Foundry", "Next.js", "viem"],
    githubUrl: "https://github.com/zrt219/Ethex-Lottery-Game",
    demoUrl: "https://ui-pi-eight.vercel.app",
    proofStatus: "repo",
    technicalSignal: "Smart-contract testing, queue settlement, and dApp review flows.",
  },
  {
    id: "umattr",
    title: "UMATTR Product Surfaces",
    category: "Product Systems / UMATTR",
    valueProposition: "Public AI readiness and product/course surfaces spanning Singapore, Malaysia, and athlete-facing routes.",
    stack: ["Next.js", "Product QA", "Course UX", "Vercel"],
    demoUrl: "https://umattr.ca/singapore",
    proofStatus: "live",
    technicalSignal: "Full-stack product systems, content architecture, and public AI readiness UX.",
  },
  {
    id: "3dmoonx",
    title: "3DMoonX",
    category: "Visual / Interactive Systems",
    valueProposition: "Interactive moon/space visual system represented in the public GitHub source memory.",
    stack: ["Python", "Vercel", "Visual systems"],
    githubUrl: "https://github.com/zrt219/3DMoonX",
    demoUrl: "https://3dmoonx.vercel.app",
    proofStatus: "live",
    technicalSignal: "Interactive visual prototyping and simulation-adjacent presentation.",
  },
  {
    id: "unknown002",
    title: "Unknown002",
    category: "Visual / Interactive Systems",
    valueProposition: "Browser-based 3D engineering viewer for frontier-systems visualization.",
    stack: ["JavaScript", "Three.js", "HTML", "CSS"],
    githubUrl: "https://github.com/zrt219/Unknown002",
    demoUrl: "https://unknown02.vercel.app",
    proofStatus: "repo",
    technicalSignal: "3D systems visualization and technical storytelling.",
  },
  {
    id: "ld-website",
    title: "LD 2.0 Website",
    category: "Product Systems / UMATTR",
    valueProposition: "Speaker website and product-polish lane with public repo and Vercel surface.",
    stack: ["TypeScript", "Vercel", "Product UI"],
    githubUrl: "https://github.com/zrt219/ld-2-0-website",
    demoUrl: "https://ld-2-0-website-zrt219s-projects.vercel.app",
    proofStatus: "live",
    technicalSignal: "Product presentation, handoff discipline, and cross-platform polish.",
  },
  {
    id: "zhane-resume-package",
    title: "Zhane Resume Package",
    category: "RAG / Evidence / Eval Systems",
    valueProposition: "Document refresh and public-safe export workspace for resume and application packet evidence.",
    stack: ["Python", "PowerShell", "Static HTML", "Vercel"],
    githubUrl: "https://github.com/zrt219/Zhane-Resume-Package",
    proofStatus: "repo",
    technicalSignal: "Repeatable evidence automation and documentation operations.",
  },
  {
    id: "codex-evidence-rag-plugin",
    title: "Codex Evidence RAG Plugin",
    category: "RAG / Evidence / Eval Systems",
    valueProposition: "Public repo lane for Codex evidence and RAG plugin work; kept as supporting proof until metadata matures.",
    stack: ["Codex", "RAG", "Evidence plugin"],
    githubUrl: "https://github.com/zrt219/codex-evidence-rag-plugin",
    proofStatus: "repo",
    technicalSignal: "Evidence retrieval plugin direction with public repo boundary.",
  },
  {
    id: "ai-agents-for-beginners",
    title: "AI Agents for Beginners",
    category: "AI / Agentic Systems",
    valueProposition: "Reference and study repo used alongside original agentic systems work.",
    stack: ["Jupyter", "Python", "Agents"],
    githubUrl: "https://github.com/zrt219/ai-agents-for-beginners",
    demoUrl: "https://aka.ms/ai-agents-beginners",
    proofStatus: "repo",
    technicalSignal: "Agent fundamentals context; supporting item rather than flagship proof.",
  },
];

function confidenceForStatus(status: ProofStatus): PortfolioProjectRecord["confidence"] {
  if (status === "live" || status === "repo") {
    return "High";
  }
  if (status === "local-evidence") {
    return "Medium";
  }
  return "Review";
}

function urlKindForProject(project: Omit<PortfolioProjectRecord, "evidenceRefs" | "lastVerified" | "confidence" | "urlKind">): PortfolioProjectRecord["urlKind"] {
  if (!project.demoUrl) {
    return project.githubUrl ? "repo" : undefined;
  }
  if (project.proofStatus === "live") {
    return "live-demo";
  }
  if (project.id === "ai-agents-for-beginners") {
    return "external";
  }
  return "reference";
}

function evidenceRefsForProject(project: Omit<PortfolioProjectRecord, "evidenceRefs" | "lastVerified" | "confidence" | "urlKind">) {
  const refs = ["evidence/public/github-profile-source-memory.md"];
  if (project.proofStatus === "local-evidence") {
    refs.push("evidence/public/daily-evidence-report-2026-05-24.md");
  }
  return refs;
}

export const projects: PortfolioProjectRecord[] = projectRecords.map((project) => ({
  ...project,
  evidenceRefs: evidenceRefsForProject(project),
  lastVerified: projectsLastUpdated,
  confidence: confidenceForStatus(project.proofStatus),
  urlKind: urlKindForProject(project),
  proofBriefSlug: signatureDetailsById[project.id]?.slug,
  signatureDetails: signatureDetailsById[project.id],
}));

export const projectCategories = Array.from(new Set(projects.map((project) => project.category)));
export const featuredProjects = projects.filter((project) => project.featured);
export const signatureProjects = projects.filter((project) => project.signatureDetails);
export const signatureProjectSlugs = signatureProjects.map((project) => project.proofBriefSlug).filter(Boolean);

export function getSignatureProjectBySlug(slug: string) {
  return signatureProjects.find((project) => project.proofBriefSlug === slug);
}
