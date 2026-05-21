import { Activity, Gauge, ShieldCheck } from "lucide-react";
import type { Diagnosis } from "@/lib/schemas";
import { InfoTip } from "./InfoTip";
import { StatusChip } from "./StatusChip";

export function DiagnosisPanel({ diagnosis }: { diagnosis: Diagnosis }) {
  const percent = Math.round(diagnosis.confidence * 100);

  return (
    <section className="rounded-lg border border-cyan/30 bg-panel/95 p-5 shadow-glow">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan">Structured Diagnosis</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">{diagnosis.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{diagnosis.probableRootCause}</p>
        </div>
        <StatusChip kind={diagnosis.readinessReport.status === "READY_AFTER_FIX" ? "pass" : "review"} label={diagnosis.readinessReport.status.replaceAll("_", " ")} />
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-md border border-line bg-black/35 p-4">
          <Gauge className="h-5 w-5 text-gold" aria-hidden="true" />
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-400">
            Root-cause confidence{" "}
            <InfoTip label="Confidence">How sure the tool is based on matching known error patterns. It is a guide, not a guarantee.</InfoTip>
          </p>
          <p className="mt-1 text-3xl font-semibold text-white">{percent}%</p>
          <div className="mt-3 h-2 rounded-full bg-white/10">
            <div className="h-2 rounded-full border border-cyan/70 bg-cyan/45" style={{ width: `${percent}%` }} />
          </div>
        </div>
        <div className="rounded-md border border-line bg-black/35 p-4">
          <Activity className="h-5 w-5 text-cyan" aria-hidden="true" />
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-400">
            Affected subsystem{" "}
            <InfoTip label="Subsystem">The part of the app likely involved, such as TypeScript, environment variables, database setup, or package install.</InfoTip>
          </p>
          <p className="mt-1 text-xl font-semibold text-white">{diagnosis.affectedSubsystem}</p>
          <p className="mt-2 text-sm text-slate-400">{diagnosis.failureType}</p>
        </div>
        <div className="rounded-md border border-line bg-black/35 p-4">
          <ShieldCheck className="h-5 w-5 text-gold" aria-hidden="true" />
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-400">
            Redaction state{" "}
            <InfoTip label="Redaction">Secret-looking values are replaced with labels before the log is shown or reported.</InfoTip>
          </p>
          <p className="mt-1 text-xl font-semibold text-white">{diagnosis.redactions.length || 0} redaction classes</p>
          <p className="mt-2 text-sm text-slate-400">{diagnosis.redactions.join(", ") || "No secret patterns detected"}</p>
        </div>
      </div>
    </section>
  );
}
