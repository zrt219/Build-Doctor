import type { EvidenceConfidence } from "@/types/liveWorkflowTracker";
import { formatConfidence } from "@/lib/formatMetrics";
import { confidenceClass } from "@/lib/trackerEvidence";

type TrackerMetricCardProps = {
  label: string;
  value: string | number;
  helper?: string;
  confidence?: EvidenceConfidence;
  sourceLabel?: string;
};

export function TrackerMetricCard({ label, value, helper, confidence = "high", sourceLabel }: TrackerMetricCardProps) {
  return (
    <article className="rounded-md border border-cyan/15 bg-[#07111f]/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-colors hover:border-cyan/35">
      <p className="text-2xl font-semibold leading-none text-white">{value}</p>
      <h3 className="mt-3 text-sm font-semibold text-slate-100">{label}</h3>
      {helper ? <p className="mt-2 text-xs leading-5 text-slate-400">{helper}</p> : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {sourceLabel ? <span className="rounded-full border border-line bg-black/25 px-2 py-1 text-[11px] uppercase tracking-[0.1em] text-slate-300">{sourceLabel}</span> : null}
        <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] ${confidenceClass(confidence)}`}>
          {formatConfidence(confidence)}
        </span>
      </div>
    </article>
  );
}
