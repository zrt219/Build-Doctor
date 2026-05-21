import { TerminalSquare } from "lucide-react";
import type { Diagnosis } from "@/lib/schemas";
import { InfoTip } from "./InfoTip";

export function FixPlan({ diagnosis, compact = false }: { diagnosis: Diagnosis; compact?: boolean }) {
  return (
    <section className={`grid gap-4 ${compact ? "grid-cols-1" : "lg:grid-cols-2"}`}>
      <div className={`${compact ? "rounded-2xl border border-white/10 bg-white/[0.035] p-4" : "rounded-lg border border-line bg-panel/90 p-5"}`}>
        <h3 className="text-lg font-semibold text-white">
          Recommended next steps{" "}
          <InfoTip label="Remediation steps">A practical checklist for reviewing and repairing the likely cause.</InfoTip>
        </h3>
        <ol className="mt-4 space-y-3">
          {diagnosis.fixPlan.map((step, index) => (
            <li key={step} className="flex gap-3 text-sm text-slate-200">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold/70 font-mono text-xs text-gold">{index + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>
      <div className={`${compact ? "rounded-2xl border border-white/10 bg-white/[0.035] p-4" : "rounded-lg border border-line bg-panel/90 p-5"}`}>
        <h3 className="text-lg font-semibold text-white">
          Validation commands{" "}
          <InfoTip label="Verification">Commands to run after the fix to verify that the app builds or tests correctly.</InfoTip>
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">Run these commands after applying the patch draft.</p>
        <div className="mt-4 space-y-2">
          {diagnosis.verificationCommands.map((command) => (
            <div key={command} className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-3 py-3 font-mono text-sm text-slate-100">
              <TerminalSquare className="h-4 w-4 text-cyan" aria-hidden="true" />
              {command}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
