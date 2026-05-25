"use client";

import { Copy, Database, FileCode2, GitBranch, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { liveWorkflowTrackerSnapshot } from "@/data/liveWorkflowTracker";
import { formatGigabytes, formatMetricNumber, formatSignedMetric } from "@/lib/formatMetrics";
import type { LiveWorkflowTrackerSnapshot, TrackerMetric } from "@/types/liveWorkflowTracker";
import { EvidenceSourceBadge } from "./EvidenceSourceBadge";
import { LiveWorkflowEventsChart } from "./LiveWorkflowEventsChart";
import { TrackerDeltaBadge } from "./TrackerDeltaBadge";
import { TrackerEvidenceDrawer } from "./TrackerEvidenceDrawer";
import { TrackerHeartbeat } from "./TrackerHeartbeat";
import { TrackerMetricCard } from "./TrackerMetricCard";
import { compactLinkClass, sectionShellClass } from "./shared";

type LiveWorkflowEventsTrackerProps = {
  snapshot?: LiveWorkflowTrackerSnapshot;
  compact?: boolean;
};

const metricOptions: Array<{ id: TrackerMetric; label: string }> = [
  { id: "workflowEvents", label: "Workflow events" },
  { id: "sessionRows", label: "Session rows" },
  { id: "dailyDelta", label: "Daily delta" },
];

const pipelineSteps = ["Codex logs", "Session index", "Event counter", "Markdown tracker", "Portfolio stats", "Public UI"];

function selectedMetricDisplay(snapshot: LiveWorkflowTrackerSnapshot, metric: TrackerMetric) {
  if (metric === "sessionRows") {
    return {
      eyebrow: "Selected metric",
      value: formatMetricNumber(snapshot.sessionIndexRows),
      label: "Codex session rows",
      helper: "Session index rows aligned to local session logs in the dated evidence refresh.",
      source: "Daily Evidence Report",
    };
  }

  if (metric === "dailyDelta") {
    return {
      eyebrow: "Selected metric",
      value: formatSignedMetric(snapshot.currentDelta),
      label: "daily event delta",
      helper: "Workflow-event growth compared with the previous tracker snapshot.",
      source: "Workflow Events Tracker",
    };
  }

  return {
    eyebrow: "Current evidence signal",
    value: formatMetricNumber(snapshot.currentWorkflowEvents),
    label: "workflow events",
    helper: "Total workflow records counted in the dated, source-safe evidence refresh.",
    source: "Workflow Events Tracker",
  };
}

export function LiveWorkflowEventsTracker({ snapshot = liveWorkflowTrackerSnapshot, compact = false }: LiveWorkflowEventsTrackerProps) {
  const [metric, setMetric] = useState<TrackerMetric>("workflowEvents");
  const [selectedIndex, setSelectedIndex] = useState(Math.max(snapshot.history.length - 1, 0));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const summary = useMemo(
    () =>
      `Live Workflow Events Tracker: ${formatMetricNumber(snapshot.currentWorkflowEvents)} workflow events, ${formatSignedMetric(snapshot.currentDelta)} daily delta, ${formatMetricNumber(snapshot.sessionIndexRows)} Codex sessions, ${formatMetricNumber(snapshot.jsonlFiles)} JSONL logs, ${formatGigabytes(snapshot.corpusSizeGb)} corpus, ${formatMetricNumber(snapshot.sourceCodeLines)} source-code lines. Last refreshed ${snapshot.lastRefreshed}.`,
    [snapshot],
  );

  const metricCards = [
    {
      label: "Codex sessions",
      value: formatMetricNumber(snapshot.sessionIndexRows),
      helper: `${formatMetricNumber(snapshot.uniqueThreadIds)} unique thread ids in the dated refresh.`,
      confidence: "high" as const,
      sourceLabel: "Daily Evidence Report",
    },
    {
      label: "JSONL logs",
      value: formatMetricNumber(snapshot.jsonlFiles),
      helper: "Aggregate local session-log count; raw logs are not exposed.",
      confidence: "high" as const,
      sourceLabel: "Workflow Events Tracker",
    },
    {
      label: "Corpus size",
      value: formatGigabytes(snapshot.corpusSizeGb),
      helper: "Evidence corpus size from the public-safe tracker summary.",
      confidence: "high" as const,
      sourceLabel: "Workflow Events Tracker",
    },
    {
      label: "Source-code lines",
      value: formatMetricNumber(snapshot.sourceCodeLines),
      helper: "Workspace source-extension line scan.",
      confidence: "medium" as const,
      sourceLabel: "Daily Evidence Report",
    },
  ];
  const activeMetric = selectedMetricDisplay(snapshot, metric);

  function changeMetric(nextMetric: TrackerMetric) {
    setMetric(nextMetric);
    setSelectedIndex(Math.max(snapshot.history.length - 1, 0));
  }

  async function copySummary() {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(summary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  if (!snapshot) {
    return (
      <section id="workflow-tracker" className={sectionShellClass}>
        <h2 className="text-2xl font-semibold text-white">Live Workflow Events Tracker</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">Tracker data unavailable. Run the evidence refresh pipeline or verify live-workflow-events-tracker.md.</p>
      </section>
    );
  }

  return (
    <section
      id="workflow-tracker"
      className={`${sectionShellClass} overflow-hidden border-cyan/25 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.13),transparent_34%),linear-gradient(180deg,#07111f_0%,#08111d_100%)]`}
      aria-labelledby="workflow-tracker-title"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Live Workflow Events Tracker</p>
          <h2 id="workflow-tracker-title" className="mt-2 max-w-4xl text-3xl font-semibold text-white md:text-4xl">
            Evidence-maintained telemetry from Codex session logs.
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">
            This tracker summarizes the engineering activity behind the portfolio. Local Codex session logs are indexed, workflow events are counted, source-code volume is scanned, and the resulting metrics are synchronized into the public portfolio stats layer.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <TrackerHeartbeat label="Static evidence snapshot" />
          <TrackerDeltaBadge value={snapshot.currentDelta} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.82fr_1.18fr]">
        <div className="rounded-lg border border-cyan/20 bg-black/35 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.34)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">{activeMetric.eyebrow}</p>
          <p className="mt-4 text-5xl font-semibold leading-none text-white sm:text-6xl">{activeMetric.value}</p>
          <p className="mt-3 text-lg font-semibold text-slate-100">{activeMetric.label}</p>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {activeMetric.helper} This is not a real-time stream; it is a dated, source-safe aggregate from the local evidence refresh.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-cyan/45 bg-cyan/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">Last refreshed {snapshot.lastRefreshed}</span>
            <span className="rounded-full border border-line bg-black/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200">Source {activeMetric.source}</span>
            <span className="rounded-full border border-line bg-black/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200">Codex mode {snapshot.codexMode}</span>
          </div>
          <div className="mt-5 grid gap-2 text-sm text-slate-300">
            <p className="flex items-center gap-2"><Database className="h-4 w-4 text-cyan" aria-hidden="true" /> {formatMetricNumber(snapshot.sessionsUpdatedToday)} sessions updated today</p>
            <p className="flex items-center gap-2"><FileCode2 className="h-4 w-4 text-cyan" aria-hidden="true" /> {formatMetricNumber(snapshot.aiRagAgentFilesFound ?? 0)} AI/RAG/agent files found</p>
            <p className="flex items-center gap-2"><GitBranch className="h-4 w-4 text-cyan" aria-hidden="true" /> {formatMetricNumber(snapshot.publicGitHubReposScanned ?? 0)} public GitHub repos scanned</p>
          </div>
        </div>

        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2" aria-label="Tracker metric mode">
              {metricOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => changeMetric(option.id)}
                  aria-pressed={metric === option.id}
                  className={`min-h-10 rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan ${
                    metric === option.id ? "border-cyan/80 bg-cyan/20 text-white shadow-[0_0_0_1px_rgba(109,216,255,0.2)]" : "border-line bg-black/25 text-slate-300 hover:border-cyan/50 hover:bg-cyan/10 hover:text-white"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <button type="button" onClick={copySummary} className={compactLinkClass} aria-label="Copy Live Workflow Events Tracker metric summary">
              <Copy className="h-4 w-4" aria-hidden="true" />
              {copied ? "Copied" : "Copy metric summary"}
            </button>
          </div>
          <LiveWorkflowEventsChart history={snapshot.history} metric={metric} selectedIndex={selectedIndex} onSelectPoint={setSelectedIndex} />
        </div>
      </div>

      {!compact ? (
        <>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {metricCards.map((card) => (
              <TrackerMetricCard key={card.label} {...card} />
            ))}
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-lg border border-cyan/20 bg-black/30 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">What this shows</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                The count reflects an operational loop for context construction, agent-assisted development, refresh automation, evidence hygiene, and QA discipline.
              </p>
              <ul className="mt-4 grid gap-2 text-sm leading-6 text-slate-300">
                <li>- Agentic engineering work is documented, not just claimed.</li>
                <li>- Workflow volume is tied to session logs and refresh reports.</li>
                <li>- Portfolio stats are synchronized from evidence sources.</li>
                <li>- Claims can be audited without exposing private raw logs.</li>
              </ul>
            </div>
            <div className="rounded-lg border border-cyan/20 bg-black/30 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Evidence sources</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {snapshot.evidenceSources.map((source) => (
                  <EvidenceSourceBadge key={source.id} source={source} />
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Workflow events are extracted from local Codex JSONL session logs. The tracker displays aggregate counts only. Raw logs, secrets, and private paths are not exposed in the public portfolio.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={() => setDrawerOpen(true)} className={compactLinkClass}>
                  How this works
                </button>
                <a href="#evidence-ledger" className={compactLinkClass}>
                  View evidence ledger
                </a>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-cyan/20 bg-black/30 p-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300" aria-label="Evidence refresh pipeline">
              {pipelineSteps.map((step, index) => (
                <span key={step} className="inline-flex items-center gap-2">
                  {index > 0 ? <span className="text-cyan/60">-&gt;</span> : null}
                  <span className="rounded-full border border-line bg-black/25 px-3 py-1">{step}</span>
                </span>
              ))}
            </div>
            <p className="mt-4 flex items-start gap-2 text-sm leading-6 text-slate-300">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan" aria-hidden="true" />
              {snapshot.privacyNote}
            </p>
          </div>
        </>
      ) : null}

      <TrackerEvidenceDrawer sources={snapshot.evidenceSources} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </section>
  );
}
