export type WorkflowEventPoint = {
  date: string;
  workflowEvents: number;
  dailyDelta: number;
  sessionRows: number;
  status: "verified" | "review";
  sourceFile: string;
  note?: string;
};

export const workflowEventsLastUpdated = "2026-05-24";
export const workflowEventsSourceLabel = "Workflow Events Tracker";
export const workflowEventsSourceFile = "evidence/public/live-workflow-events-tracker.md";

export const workflowEventHistory: WorkflowEventPoint[] = [
  {
    date: "2026-05-23",
    workflowEvents: 1135833,
    dailyDelta: 0,
    sessionRows: 696,
    status: "review",
    sourceFile: workflowEventsSourceFile,
    note: "Tracker history point; retained to explain the +24,718 day-over-day delta.",
  },
  {
    date: "2026-05-24",
    workflowEvents: 1160551,
    dailyDelta: 24718,
    sessionRows: 757,
    status: "verified",
    sourceFile: workflowEventsSourceFile,
  },
];

export const latestWorkflowSnapshot = workflowEventHistory[workflowEventHistory.length - 1];
