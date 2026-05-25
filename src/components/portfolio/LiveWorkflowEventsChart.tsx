"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
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

const metricDescriptions: Record<TrackerMetric, string> = {
  workflowEvents: "Total counted workflow records in the dated evidence refresh.",
  sessionRows: "Codex session index rows aligned to local session logs.",
  dailyDelta: "Change in workflow events compared with the previous tracker snapshot.",
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
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [scrubberX, setScrubberX] = useState<number | null>(null);

  if (history.length === 0) {
    return (
      <div className="rounded-md border border-line bg-black/35 p-5">
        <p className="font-semibold text-white">Tracker data unavailable.</p>
        <p className="mt-2 text-sm leading-6 text-slate-300">Run the evidence refresh pipeline or verify live-workflow-events-tracker.md.</p>
      </div>
    );
  }

  const points = coordinates(history, metric);
  const values = history.map((point) => metricValue(point, metric));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");
  const fillPath = `${points[0]?.x ?? padding},${height - padding} ${polyline} ${points[points.length - 1]?.x ?? width - padding},${height - padding}`;
  const selected = history[selectedIndex] ?? history[history.length - 1];
  const selectedPoint = points[selectedIndex] ?? points[points.length - 1];
  const selectedMetricValue = metricValue(selected, metric);
  const activeScrubberX = dragging && scrubberX !== null ? scrubberX : selectedPoint.x;
  const showPreviewRail = dragging && Math.abs(activeScrubberX - selectedPoint.x) > 4;

  function getScrubberX(clientX: number) {
    const bounds = svgRef.current?.getBoundingClientRect();
    if (!bounds) {
      return null;
    }

    const ratio = Math.min(Math.max((clientX - bounds.left) / bounds.width, 0), 1);
    return Math.min(Math.max(ratio * width, padding), width - padding);
  }

  function selectNearestPoint(svgX: number) {
    const nearest = points.reduce(
      (closest, point, index) => {
        const distance = Math.abs(point.x - svgX);
        return distance < closest.distance ? { index, distance } : closest;
      },
      { index: selectedIndex, distance: Number.POSITIVE_INFINITY },
    );
    onSelectPoint(nearest.index);
  }

  function scrubToClientX(clientX: number) {
    const nextScrubberX = getScrubberX(clientX);
    if (nextScrubberX === null) {
      return;
    }

    setScrubberX(nextScrubberX);
    selectNearestPoint(nextScrubberX);
  }

  function handlePointerDown(event: PointerEvent<SVGSVGElement>) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    scrubToClientX(event.clientX);
  }

  function handlePointerMove(event: PointerEvent<SVGSVGElement>) {
    if (dragging) {
      event.preventDefault();
      scrubToClientX(event.clientX);
    }
  }

  function handlePointerEnd(event: PointerEvent<SVGSVGElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragging(false);
    setScrubberX(null);
  }

  function handlePointKey(event: KeyboardEvent<SVGCircleElement>, index: number) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelectPoint(index);
    }
  }

  function handleChartKey(event: KeyboardEvent<SVGSVGElement>) {
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      onSelectPoint(Math.max(selectedIndex - 1, 0));
    }
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      onSelectPoint(Math.min(selectedIndex + 1, history.length - 1));
    }
  }

  return (
    <div className="rounded-lg border border-cyan/20 bg-black/35 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan">Active chart metric</p>
          <p className="mt-1 text-sm text-slate-300">{metricDescriptions[metric]}</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">Drag the highlighted evidence node or chart rail to inspect points. Arrow keys move the selected date.</p>
        </div>
        <span
          data-testid="workflow-scrub-state"
          className="rounded-full border border-cyan/45 bg-cyan/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white"
        >
          {dragging ? "Scrubbing timeline" : `Showing ${metricLabels[metric]}`}
        </span>
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        tabIndex={0}
        aria-label={`${metricLabels[metric]} draggable chart for workflow tracker history`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onPointerLeave={(event) => {
          if (dragging) {
            handlePointerMove(event);
          }
        }}
        onKeyDown={handleChartKey}
        className="h-auto w-full cursor-grab touch-none select-none outline-none active:cursor-grabbing focus-visible:rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
      >
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
        <text x={padding - 10} y={padding + 4} textAnchor="end" fill="#a7b4c8" fontSize="12" fontWeight="600">
          {formatChartValue(max, metric)}
        </text>
        <text x={padding - 10} y={height - padding + 4} textAnchor="end" fill="#a7b4c8" fontSize="12" fontWeight="600">
          {formatChartValue(min, metric)}
        </text>
        <polygon points={fillPath} fill="url(#trackerFill)" />
        <polyline points={polyline} fill="none" stroke="url(#trackerLine)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" filter="url(#trackerGlow)" />
        <rect x={padding} y={padding - 20} width={width - padding * 2} height={height - padding * 2 + 40} rx="16" fill="transparent" pointerEvents="all" />
        {showPreviewRail ? (
          <line
            data-testid="workflow-scrub-preview-rail"
            x1={activeScrubberX}
            x2={activeScrubberX}
            y1={padding - 8}
            y2={height - padding + 8}
            stroke="#67e8f9"
            strokeOpacity="0.28"
            strokeWidth="2"
            strokeDasharray="2 7"
          />
        ) : null}
        <line
          data-testid="workflow-scrubber-rail"
          x1={selectedPoint.x}
          x2={selectedPoint.x}
          y1={padding - 14}
          y2={height - padding + 12}
          stroke="#f8fafc"
          strokeOpacity={dragging ? "0.88" : "0.62"}
          strokeWidth={dragging ? "3" : "2"}
          strokeDasharray="5 6"
          className={dragging ? "" : "transition-all duration-200 ease-out"}
        />
        {points.map(({ point, x, y }, index) => {
          const active = index === selectedIndex;
          return (
            <g key={point.date}>
              {active ? (
                <circle
                  data-testid="workflow-scrubber-handle"
                  cx={x}
                  cy={y}
                  r={dragging ? 18 : 15}
                  fill="none"
                  stroke="#f8fafc"
                  strokeOpacity={dragging ? "0.82" : "0.58"}
                  strokeWidth="2"
                  strokeDasharray={dragging ? "none" : "4 5"}
                  className={dragging ? "" : "transition-all duration-200 ease-out"}
                />
              ) : null}
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
                onClick={(event) => {
                  event.stopPropagation();
                  onSelectPoint(index);
                }}
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
          {selected.date}: {metricLabels[metric]} {formatChartValue(selectedMetricValue, metric)}.
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-400">
          Snapshot context: {formatMetricNumber(selected.workflowEvents)} events, {formatSignedMetric(selected.dailyDelta)} delta, {formatMetricNumber(selected.sessionRows)} sessions.
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-400">
          {dragging ? "The highlighted handle stays on the nearest dated evidence node; the faint preview rail follows your pointer." : "Drag position is inspect-only; tracker points are not editable."}
        </p>
      </div>
    </div>
  );
}
