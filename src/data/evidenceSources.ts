export type EvidenceSource = {
  id: string;
  label: string;
  type: string;
  publicLabel: string;
  status: "verified" | "documented" | "demo" | "review";
  detail: string;
  sourceFile?: string;
  sourceHref?: string;
  href?: string;
};

const githubBlobBase = "https://github.com/zrt219/Zhanes-Portfolio-Vercel-/blob/master";

export const evidenceSources: EvidenceSource[] = [
  {
    id: "workflow-tracker",
    label: "Workflow events tracker",
    type: "Local evidence summary",
    publicLabel: "Workflow Events Tracker",
    status: "verified",
    sourceFile: "evidence/public/live-workflow-events-tracker.md",
    sourceHref: `${githubBlobBase}/evidence/public/live-workflow-events-tracker.md`,
    detail: "Stores the May 23 to May 24 workflow-event history and current Codex session counts.",
  },
  {
    id: "daily-report",
    label: "Daily evidence report",
    type: "Verification report",
    publicLabel: "Daily Evidence Report",
    status: "verified",
    sourceFile: "evidence/public/daily-evidence-report-2026-05-24.md",
    sourceHref: `${githubBlobBase}/evidence/public/daily-evidence-report-2026-05-24.md`,
    detail: "Refresh report for counts, exports, source scans, GitHub memory, and claim boundaries.",
  },
  {
    id: "session-index",
    label: "Codex session summary",
    type: "Evidence index",
    publicLabel: "Codex session summary",
    status: "verified",
    sourceFile: "evidence/public/session-index-summary.md",
    sourceHref: `${githubBlobBase}/evidence/public/session-index-summary.md`,
    detail: "Public UI shows counts only. Private evidence contents, local paths, credentials, and sensitive logs stay out of the site.",
  },
  {
    id: "github-source-memory",
    label: "GitHub source memory",
    type: "Public repo snapshot",
    publicLabel: "GitHub Source Memory",
    status: "verified",
    sourceFile: "evidence/public/github-profile-source-memory.md",
    sourceHref: `${githubBlobBase}/evidence/public/github-profile-source-memory.md`,
    href: "https://github.com/zrt219",
    detail: "Public-only fallback snapshot for zrt219 repositories and homepage links.",
  },
  {
    id: "build-doctor-evals",
    label: "Build Doctor eval endpoint",
    type: "Public app endpoint",
    publicLabel: "/api/eval",
    status: "demo",
    href: "https://vercel-build-doctor-agent.vercel.app/api/eval",
    detail: "Secret-safe deterministic fixture score for the build-failure diagnostic demo.",
  },
  {
    id: "integration-health",
    label: "Integration health endpoint",
    type: "Public app endpoint",
    publicLabel: "/api/integration-health",
    status: "demo",
    href: "https://vercel-build-doctor-agent.vercel.app/api/integration-health",
    detail: "Reports live or fallback integration state without exposing credentials.",
  },
  {
    id: "evidence-dashboard",
    label: "Evidence Dashboard",
    type: "Public Vercel demo",
    publicLabel: "zhane-grey-evidence-dashboard.vercel.app",
    status: "demo",
    href: "https://zhane-grey-evidence-dashboard.vercel.app",
    detail: "Signature proof surface backed by the public AI-Engineering-Evidence-Engine repository.",
  },
  {
    id: "qa-screenshots",
    label: "Portfolio browser QA",
    type: "Screenshot evidence",
    publicLabel: "Portfolio QA screenshots",
    status: "documented",
    detail: "Desktop, tablet, and mobile screenshots captured after implementation verification.",
  },
];
