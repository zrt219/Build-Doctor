export type EvidenceConfidence = "high" | "medium" | "low" | "pending";

export type EvidenceSourceType =
  | "markdown-tracker"
  | "daily-report"
  | "session-index"
  | "portfolio-stats-source"
  | "generated-artifact"
  | "manual-fallback";

export interface EvidenceSource {
  id: string;
  label: string;
  sourceType: EvidenceSourceType;
  publicSafeLabel: string;
  lastRefreshed?: string;
  confidence: EvidenceConfidence;
  supports: string[];
  privatePathRedacted?: boolean;
}

export interface WorkflowEventHistoryPoint {
  date: string;
  workflowEvents: number;
  dailyDelta: number;
  sessionRows: number;
  label?: string;
}

export interface MetricDefinition {
  id: string;
  label: string;
  definition: string;
  sourceLabel: string;
  confidence: EvidenceConfidence;
}

export interface LiveWorkflowTrackerSnapshot {
  lastRefreshed: string;
  codexMode: "full" | "partial" | "unknown";
  currentWorkflowEvents: number;
  currentDelta: number;
  sessionIndexRows: number;
  uniqueThreadIds: number;
  jsonlFiles: number;
  corpusSizeGb: number;
  sourceCodeLines: number;
  sessionsUpdatedToday: number;
  localSessionLogs?: number;
  portfolioStatsRefreshed: boolean;
  publicGitHubReposScanned?: number;
  solidityFilesFound?: number;
  foundryProjectsFound?: number;
  aiRagAgentFilesFound?: number;
  generatedExports?: number;
  history: WorkflowEventHistoryPoint[];
  evidenceSources: EvidenceSource[];
  metricDefinitions: MetricDefinition[];
  privacyNote: string;
  sourceLabel: string;
}

export type TrackerMetric = "workflowEvents" | "sessionRows" | "dailyDelta";
