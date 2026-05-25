import { ArrowRight, CheckCircle2 } from "lucide-react";
import { sectionShellClass } from "./shared";

const workflowSteps = [
  "Input evidence",
  "Context construction",
  "Ralph planner",
  "Subagent lanes",
  "Implementation",
  "Browser QA",
  "Proof ledger",
  "Portfolio stats refresh",
];

const lanes = [
  {
    title: "Architect / Planner",
    detail: "Maps repo structure, evidence boundaries, affected files, risks, and verification shape before implementation.",
  },
  {
    title: "Builder / Integrator",
    detail: "Ships scoped changes through existing components, data configs, and route conventions without widening the blast radius.",
  },
  {
    title: "Verifier / Evidence Curator",
    detail: "Runs typecheck, tests, builds, browser QA, screenshots, deployment checks, and factual engineering-log updates.",
  },
];

export function RalphplanWorkflowMap() {
  return (
    <section id="ralphplan-workflow" className={sectionShellClass}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Ralphplan workflow diagram</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">How Codex work becomes proof instead of loose claims.</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
            Local/demo operating model: scoped planning, implementation, verification, and evidence packaging are handled as one loop.
          </p>
        </div>
        <span className="rounded-sm border border-dotted border-white/45 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white">
          Local / demo operating model
        </span>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-8">
        {workflowSteps.map((step, index) => (
          <div key={step} className="relative rounded-md border border-line bg-black/30 p-4">
            <p className="font-mono text-xs text-cyan">{String(index + 1).padStart(2, "0")}</p>
            <h3 className="mt-2 text-sm font-semibold text-white">{step}</h3>
            {index < workflowSteps.length - 1 ? <ArrowRight aria-hidden="true" className="absolute -right-4 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-cyan/60 lg:block" /> : null}
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {lanes.map((lane) => (
          <article key={lane.title} className="rounded-md border border-cyan/30 bg-cyan/5 p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-cyan" aria-hidden="true" />
              <h3 className="font-semibold text-white">{lane.title}</h3>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-300">{lane.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
