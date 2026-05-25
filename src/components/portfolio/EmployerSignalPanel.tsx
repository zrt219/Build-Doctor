import { BrainCircuit, ClipboardCheck, Code2, ShieldCheck, Workflow, Zap } from "lucide-react";
import { sectionShellClass } from "./shared";

const signals = [
  {
    title: "Proof-oriented AI engineering",
    detail: "Codex workflow counts, public GitHub projects, Vercel demos, and daily evidence artifacts are presented with source labels and confidence boundaries.",
    icon: ShieldCheck,
  },
  {
    title: "Agentic workflow design",
    detail: "Ralphplan-style planning, subagent lanes, context construction, implementation loops, browser QA, and evidence curation are treated as one delivery system.",
    icon: Workflow,
  },
  {
    title: "RAG, eval, and observability discipline",
    detail: "Local RAG demos, deterministic eval routes, claim auditing, trace timelines, and report exports show how AI output gets checked before it becomes a public claim.",
    icon: BrainCircuit,
  },
  {
    title: "Developer tools under ambiguity",
    detail: "Build Doctor, gateway failover, and resume evidence tooling show product thinking around logs, failures, fallbacks, proof paths, and measurable QA.",
    icon: ClipboardCheck,
  },
  {
    title: "Full-stack shipped surfaces",
    detail: "Next.js, Vercel, TypeScript, FastAPI, Supabase-adjacent workflows, document exports, and browser regression checks connect backend evidence to usable interfaces.",
    icon: Code2,
  },
  {
    title: "Web3 and deterministic proof systems",
    detail: "Solidity state machines, Foundry projects, XRPL EVM dashboards, provenance protocols, and testnet/demo labeling support audit-style engineering proof.",
    icon: Zap,
  },
];

export function EmployerSignalPanel() {
  return (
    <section id="capabilities" className={sectionShellClass}>
      <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">AI engineering capability map</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">What the work proves.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            The portfolio is organized around evidence: open the demos, inspect the repos, read the source labels, and check the QA path before taking any claim at face value.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {signals.map((signal) => {
            const Icon = signal.icon;
            return (
              <article key={signal.title} className="rounded-md border border-line bg-black/30 p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-cyan/45 bg-cyan/10">
                    <Icon aria-hidden="true" className="h-4 w-4 text-cyan" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{signal.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{signal.detail}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
