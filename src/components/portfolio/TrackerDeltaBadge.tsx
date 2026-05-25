import { TrendingUp } from "lucide-react";
import { formatSignedMetric } from "@/lib/formatMetrics";

type TrackerDeltaBadgeProps = {
  value: number;
  label?: string;
};

export function TrackerDeltaBadge({ value, label = "daily delta" }: TrackerDeltaBadgeProps) {
  const positive = value > 0;

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${positive ? "border-cyan/55 bg-cyan/10 text-white" : "border-white/40 bg-white/5 text-slate-200"}`}>
      <TrendingUp className="h-3.5 w-3.5 text-cyan" aria-hidden="true" />
      {formatSignedMetric(value)} {label}
    </span>
  );
}
