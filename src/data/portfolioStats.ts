export type PortfolioStat = {
  id: string;
  label: string;
  value: string;
  displayValue: string;
  sourceLabel: string;
  sourceFile: string;
  confidence: "High" | "Medium";
  detail: string;
  description: string;
  publicSafe: boolean;
  lastVerified: string;
};

export const portfolioStatsLastUpdated = "2026-05-24";
export const portfolioStatsSnapshotLabel = "May 24 Codex Evidence Refresh";
export const portfolioStatsPrivacyBoundary =
  "Public UI shows dated snapshot counts and source labels only. Private evidence contents, local paths, credentials, and sensitive logs are excluded.";

export const portfolioStats: PortfolioStat[] = [
  {
    id: "workflow-events",
    label: "Workflow events",
    value: "1,160,551",
    displayValue: "1,160,551",
    sourceLabel: "Workflow Events Tracker",
    sourceFile: "evidence/public/live-workflow-events-tracker.md",
    confidence: "High",
    detail: "Non-empty local Codex workflow records counted across active and archived session storage.",
    description: "Tracked workflow records across the local Codex evidence corpus.",
    publicSafe: true,
    lastVerified: portfolioStatsLastUpdated,
  },
  {
    id: "codex-sessions",
    label: "Codex sessions",
    value: "757",
    displayValue: "757",
    sourceLabel: "Daily Evidence Report",
    sourceFile: "evidence/public/daily-evidence-report-2026-05-24.md",
    confidence: "High",
    detail: "Rebuilt session index rows and local session logs aligned in the May 24 refresh.",
    description: "Codex session rows recorded by the evidence refresh.",
    publicSafe: true,
    lastVerified: portfolioStatsLastUpdated,
  },
  {
    id: "source-lines",
    label: "Source-code lines",
    value: "600,493",
    displayValue: "600,493",
    sourceLabel: "Daily Evidence Report",
    sourceFile: "evidence/public/daily-evidence-report-2026-05-24.md",
    confidence: "Medium",
    detail: "Source-extension line count across the scanned AI engineering workspace.",
    description: "Source-line scan across included workspace file types.",
    publicSafe: true,
    lastVerified: portfolioStatsLastUpdated,
  },
  {
    id: "public-repos",
    label: "Public GitHub repos scanned",
    value: "22",
    displayValue: "22",
    sourceLabel: "GitHub Source Memory",
    sourceFile: "evidence/public/github-profile-source-memory.md",
    confidence: "High",
    detail: "Public GitHub fallback snapshot for zrt219 with private repositories excluded.",
    description: "Public repository count from the source-memory snapshot.",
    publicSafe: true,
    lastVerified: portfolioStatsLastUpdated,
  },
  {
    id: "foundry-projects",
    label: "Foundry projects",
    value: "18",
    displayValue: "18",
    sourceLabel: "Daily Evidence Report",
    sourceFile: "evidence/public/daily-evidence-report-2026-05-24.md",
    confidence: "Medium",
    detail: "Workspace foundry.toml scan excluding build and dependency directories.",
    description: "Foundry project count from the May 24 workspace scan.",
    publicSafe: true,
    lastVerified: portfolioStatsLastUpdated,
  },
  {
    id: "solidity-files",
    label: "Solidity files",
    value: "326",
    displayValue: "326",
    sourceLabel: "Daily Evidence Report",
    sourceFile: "evidence/public/daily-evidence-report-2026-05-24.md",
    confidence: "Medium",
    detail: "Workspace .sol scan excluding build and dependency directories.",
    description: "Solidity files counted in the evidence workspace scan.",
    publicSafe: true,
    lastVerified: portfolioStatsLastUpdated,
  },
  {
    id: "ai-rag-agent-files",
    label: "AI/RAG/agent files",
    value: "12,891",
    displayValue: "12,891",
    sourceLabel: "Daily Evidence Report",
    sourceFile: "evidence/public/daily-evidence-report-2026-05-24.md",
    confidence: "Medium",
    detail: "Path scan for AI, agent, RAG, and eval terms across the workspace.",
    description: "AI, agent, RAG, and eval file-name/path matches from the scan.",
    publicSafe: true,
    lastVerified: portfolioStatsLastUpdated,
  },
  {
    id: "generated-exports",
    label: "Generated exports",
    value: "8",
    displayValue: "8",
    sourceLabel: "Daily Evidence Report",
    sourceFile: "evidence/public/daily-evidence-report-2026-05-24.md",
    confidence: "High",
    detail: "Root resume, application packet, diary, HTML, DOCX, PDF, and ATS text artifacts.",
    description: "Generated public-safe resume/application artifacts recorded by the refresh.",
    publicSafe: true,
    lastVerified: portfolioStatsLastUpdated,
  },
];

export const portfolioStatsConflictNotes = [
  "Raw local storage may continue changing after the May 24 refresh; public counts stay pinned until the evidence refresh pipeline reruns.",
  "GitHub source memory is a public fallback snapshot, not a private repository inventory.",
  "Resume markdown still contains an older 20-repo phrase; the May 24 GitHub source memory verifies 22 public repos for this UI.",
];

export const portfolioAnalytics = [
  {
    id: "daily-delta",
    label: "Daily event delta",
    value: "+24,718",
    sourceLabel: "Workflow Events Tracker",
    sourceFile: "evidence/public/live-workflow-events-tracker.md",
  },
  {
    id: "jsonl-files",
    label: "JSONL logs",
    value: "757",
    sourceLabel: "Workflow Events Tracker",
    sourceFile: "evidence/public/live-workflow-events-tracker.md",
  },
  {
    id: "corpus-size",
    label: "Corpus size",
    value: "34.1 GB",
    sourceLabel: "Workflow Events Tracker",
    sourceFile: "evidence/public/live-workflow-events-tracker.md",
  },
  {
    id: "sessions-updated",
    label: "Sessions updated today",
    value: "44",
    sourceLabel: "Daily Evidence Report",
    sourceFile: "evidence/public/daily-evidence-report-2026-05-24.md",
  },
];
