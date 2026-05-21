import { BrainCircuit, Boxes, Radar, ShieldCheck } from "lucide-react";
import { runEvalSuite } from "@/lib/build-doctor";
import { StatusChip } from "./StatusChip";

export function CaseStudySection() {
  const evals = runEvalSuite();
  const items = [
    ["Developer tooling", "failed build diagnosis, evidence extraction, report export"],
    ["AI product engineering", "deterministic source of truth with optional model review"],
    ["Reliability", "provider failure handling, redaction tests, browser workflow coverage"],
    ["Safety", "sanitized inputs, paid-model blocking, no automatic patch application"],
  ];

  return (
    <section className="rounded-lg border border-line bg-panel/90 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan">Case Study Signal</p>
          <h2 className="text-2xl font-semibold text-white">Deterministic build diagnosis with optional DeepSeek review</h2>
        </div>
        <StatusChip kind={evals.failed === 0 ? "pass" : "review"} label={`Eval score ${evals.score}%`} />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {[
          [BrainCircuit, "Deterministic-first", "Local rules own the root-cause diagnosis, evidence, trace, patch draft, and report."],
          [Radar, "Evidence trail", "Parser extracts fatal lines, files, warnings, and root-cause signals."],
          [ShieldCheck, "Secret safety", "Logs are redacted before diagnosis, display, reports, and optional DeepSeek review."],
          [Boxes, "Developer workflow", "The app turns pasted logs into a safe patch draft and markdown incident report."],
        ].map(([Icon, title, body]) => (
          <div key={String(title)} className="rounded-md border border-line bg-black/35 p-4">
            <Icon className="h-5 w-5 text-gold" aria-hidden="true" />
            <h3 className="mt-3 font-semibold text-white">{title as string}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">{body as string}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-3">
        {items.map(([role, evidence]) => (
          <div key={role} className="rounded-md border border-line bg-black/30 p-4">
            <p className="font-semibold text-white">{role}</p>
            <p className="mt-1 text-sm text-slate-400">{evidence}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
