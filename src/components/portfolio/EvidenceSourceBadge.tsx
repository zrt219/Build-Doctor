import type { EvidenceSource } from "@/types/liveWorkflowTracker";
import { formatConfidence } from "@/lib/formatMetrics";
import { confidenceClass, evidenceTypeLabel } from "@/lib/trackerEvidence";

type EvidenceSourceBadgeProps = {
  source: EvidenceSource;
};

export function EvidenceSourceBadge({ source }: EvidenceSourceBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] ${confidenceClass(source.confidence)}`}>
      {source.label}
      <span className="text-slate-300">/</span>
      {formatConfidence(source.confidence)}
      <span className="sr-only"> confidence, {evidenceTypeLabel(source.sourceType)} source</span>
    </span>
  );
}
