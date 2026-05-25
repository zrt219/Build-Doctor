"use client";

import type { KeyboardEvent } from "react";
import type { TrackerMetric, WorkflowEventHistoryPoint } from "@/types/liveWorkflowTracker";
import { formatMetricNumber, formatSignedMetric } from "@/lib/formatMetrics";

type LiveWorkflowEventsChartProps = {
  history: WorkflowEventHistoryPoint[];
  metric: TrackerMetric;
  selectedIndex: number;
  onSelectPoint: (index: number) => void;
};

const width = 680;
const height = 300;
const padding = 48;

const metricLabels: Record<TrackerMetric, string> = {
  workflowEvents: "Workflow events",
  sessionRows: "Session rows",
  dailyDelta: "Daily delta",
};

function metricValue(point: WorkflowEventHistoryPoint, metric: TrackerMetric) {
  if (metric === "workflowEvents") return point.workflowEvents;
  if (metric === "sessionRows") return point.sessionRows;
  return point.dailyDelta;
}

function formatChartValue(value: number, metric: TrackerMetric) {
  return metric === "dailyDelta" ? formatSignedMetric(value) : formatMetricNumber(value);
}

function coordinates(history: WorkflowEventHistoryPoint[], metric: TrackerMetric) {
  const values = history.map((point) => metricValue(point, metric));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return history.map((point, index) => ({
    point,
    x: padding + (index * (width - padding * 2)) / Math.max(history.length - 1, 1),
    y: height - padding - ((metricValue(point, metric) - min) / range) * (height - padding * 2),
  }));
}

export function LiveWorkflowEventsChart({ history, metric, selectedIndex, onSelectPoint }: LiveWorkflowEventsChartProps) {
  if (history.length === 0) {
    return (
      <div className="rounded-md border border-line bg-black/35 p-5">
        <p className="font-semibold text-white">Tracker data unavailable.</p>
        <p className="mt-2 text-sm leading-6 text-slate-300">Run the evidence refresh pipeline or verify live-workflow-events-tracker.md.</p>
      </div>
    );
  }

  const points = coordinates(history, metric);
  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");
  const fillPath = `${points[0]?.x ?? padding},${height - padding} ${polyline} ${points[points.length - 1]?.x ?? width - padding},${height - padding}`;
  const selected = history[selectedIndex] ?? history[history.length - 1];

  function handlePointKey(event: KeyboardEvent<SVGCircleElement>, index: number) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelectPoint(index);
    }
  }

  return (
    <div className="rounded-lg border border-cyan/20 bg-black/35 p-4">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${metricLabels[metric]} chart for workflow tracker history`} className="h-auto w-full">
        <defs>
          <linearGradient id="trackerLine" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="trackerFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.02" />
          </linearGradient>
          <filter id="trackerGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {[0, 1, 2, 3].map((line) => {
          const y = padding + (line * (height - padding * 2)) / 3;
          return <line key={line} x1={padding} x2={width - padding} y1={y} y2={y} stroke="rgba(255,255,255,0.1)" strokeDasharray="4 8" />;
        })}
        <polygon points={fillPath} fill="url(#trackerFill)" />
        <polyline points={polyline} fill="none" stroke="url(#trackerLine)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" filter="url(#trackerGlow)" />
        {points.map(({ point, x, y }, index) => {
          const active = index === selectedIndex;
          return (
            <g key={point.date}>
              <circle
                cx={x}
                cy={y}
                r={active ? 12 : 9}
                fill={active ? "#67e8f9" : "#07111f"}
                stroke={active ? "#f8fafc" : "#67e8f9"}
                strokeWidth="3"
                tabIndex={0}
                role="button"
                aria-label={`${point.date}: ${metricLabels[metric]} ${formatChartValue(metricValue(point, metric), metric)}`}
                onMouseEnter={() => onSelectPoint(index)}
                onFocus={() => onSelectPoint(index)}
                onClick={() => onSelectPoint(index)}
                onKeyDown={(event) => handlePointKey(event, index)}
                className="cursor-pointer outline-none focus-visible:stroke-white"
              />
              <text x={x} y={height - 17} textAnchor="middle" fill="#a7b4c8" fontSize="14" fontWeight="600">
                {point.date.slice(5)}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-3 rounded-md border border-cyan/25 bg-cyan/5 p-3" aria-live="polite">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan">Tracker tooltip</p>
        <p className="mt-2 text-sm text-white">
          {selected.date}: {formatMetricNumber(selected.workflowEvents)} events, {formatSignedMetric(selected.dailyDelta)} delta, {formatMetricNumber(selected.sessionRows)} sessions.
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-400">Workflow events are extracted from local Codex JSONL session logs during the evidence refresh process.</p>
      </div>
    </div>
  );
}
