import { Activity, ClipboardCheck, Gauge, SearchCheck, ShieldCheck } from "lucide-react";
import type { Diagnosis } from "@/lib/schemas";
import { InfoTip } from "./InfoTip";
import { StatusChip } from "./StatusChip";

export function DiagnosisPanel({ diagnosis, compact = false }: { diagnosis: Diagnosis; compact?: boolean }) {
  const percent = Math.round(diagnosis.confidence * 100);
  const redactionCount = diagnosis.redactions.length;
  const redactionSummary = redactionCount ? `${redactionCount} sensitive values redacted` : "No sensitive values detected";

  return (
    <section className={`${compact ? "rounded-2xl border border-white/10 bg-white/[0.035] p-4" : "rounded-lg border border-cyan/30 bg-panel/95 p-5 shadow-glow"}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">Root-cause assessment</p>
          <h2 className={`${compact ? "mt-2 text-xl" : "mt-1 text-2xl"} font-semibold text-white`}>{diagnosis.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{diagnosis.probableRootCause}</p>
        </div>
        <StatusChip kind={diagnosis.readinessReport.status === "READY_AFTER_FIX" ? "pass" : "review"} label={diagnosis.readinessReport.status.replaceAll("_", " ")} />
      </div>
      <div className={`mt-5 grid gap-3 ${compact ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-5" : "md:grid-cols-2 xl:grid-cols-5"}`}>
        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
          <SearchCheck className="h-5 w-5 text-cyan" aria-hidden="true" />
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-400">
            Likely root cause{" "}
            <InfoTip label="Likely root cause">The deterministic classification based on known failure patterns and extracted evidence.</InfoTip>
          </p>
          <p className="mt-2 text-sm font-semibold leading-6 text-white">{diagnosis.probableRootCause}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
          <Gauge className="h-5 w-5 text-gold" aria-hidden="true" />
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-400">
            Confidence{" "}
            <InfoTip label="Confidence">How strongly the log matches known failure patterns. It is a review signal, not a guarantee.</InfoTip>
          </p>
          <p className={`${compact ? "text-2xl" : "text-3xl"} mt-1 font-semibold text-white`}>{percent}%</p>
          <div className="mt-3 h-2 rounded-full bg-white/10">
            <div className="h-2 rounded-full border border-cyan/70 bg-cyan/45" style={{ width: `${percent}%` }} />
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
          <Activity className="h-5 w-5 text-cyan" aria-hidden="true" />
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-400">
            Affected subsystem{" "}
            <InfoTip label="Subsystem">The application area likely involved, such as TypeScript, environment variables, database setup, or package installation.</InfoTip>
          </p>
          <p className="mt-1 text-xl font-semibold text-white">{diagnosis.affectedSubsystem}</p>
          <p className="mt-2 rounded-full border border-white/10 bg-white/[0.035] px-2 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-400">{diagnosis.failureType}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
          <ShieldCheck className="h-5 w-5 text-gold" aria-hidden="true" />
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-400">
            Secret scan{" "}
            <InfoTip label="Secret scan">Sensitive-looking values are replaced with labels before the log is shown, reported, or reviewed by an optional provider.</InfoTip>
          </p>
          <p className="mt-1 text-xl font-semibold text-white">{redactionSummary}</p>
          <p className="mt-2 text-sm text-slate-400">{diagnosis.redactions.join(", ") || "No sensitive values detected"}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
          <ClipboardCheck className="h-5 w-5 text-cyan" aria-hidden="true" />
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-400">
            Report readiness{" "}
            <InfoTip label="Report readiness">Whether the current deterministic diagnosis can be exported as a markdown incident report.</InfoTip>
          </p>
          <p className="mt-1 text-xl font-semibold text-white">Export available</p>
          <p className="mt-2 text-sm text-slate-400">{diagnosis.readinessReport.status.replaceAll("_", " ")}</p>
        </div>
      </div>
    </section>
  );
}
