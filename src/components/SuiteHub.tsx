import Link from "next/link";
import { ArrowRight, CheckCircle2, ExternalLink, GitBranch, RadioTower, ShieldCheck } from "lucide-react";
import { runEvalSuite } from "@/lib/build-doctor";
import { suiteApps, suiteDemoFlow } from "@/lib/suite-metadata";
import { SocialLinks } from "./SocialLinks";
import { StatusChip } from "./StatusChip";

const jobFamilies = [
  ["OpenAI Codex Core Agent", "long-horizon coding, failure analysis, tool-use strategy"],
  ["Vercel Agent / AI Gateway", "deploy debugging, AI SDK routing, production readiness"],
  ["Grafana AI/Ops", "incident analysis, noisy signal reduction, observability-style reports"],
  ["Anthropic Applied AI", "customer-facing workflows, evals, safety discipline"],
  ["Cohere Agentic Workflows", "enterprise tool use, auditability, approval gates"],
];

export function SuiteHub() {
  const buildDoctorEvals = runEvalSuite();

  return (
    <main className="relative mx-auto min-h-screen max-w-7xl px-5 py-6 lg:px-8">
      <header className="mb-8 rounded-lg border border-line bg-black/35 p-4 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md border border-cyan/60 bg-cyan/10">
              <RadioTower className="h-5 w-5 text-cyan" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">ZRT Vercel AI Systems Suite</p>
              <p className="font-semibold text-white">Connected portfolio command center</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusChip kind="simulated" label="Demo systems" />
            <StatusChip kind="pass" label="4 production apps" />
            <StatusChip kind="locked" label="GitHub-first proof" />
          </div>
          <SocialLinks />
        </div>
      </header>

      <section className="mb-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-lg border border-line bg-panel/85 p-7 shadow-glow">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan">Recruiter-ready AI engineering system</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-white md:text-6xl">One suite for deploy debugging, agent safety, AI gateway routing, and evidence-grounded resume proof.</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">
            Four separate Vercel apps are connected through one premium command center. Every demo is deterministic, explicitly labeled, production deployed, and built to show applied AI product engineering without fake integrations.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/build-doctor" className="inline-flex items-center gap-2 rounded-md border border-cyan/70 bg-cyan/15 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white hover:bg-cyan/25">
              Start guided demo <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a href="https://github.com/zrt219" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-line bg-black/30 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white hover:border-white/45">
              GitHub proof <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="rounded-lg border border-line bg-black/35 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Suite Readiness</p>
          <div className="mt-4 grid gap-3">
            <div className="rounded-md border border-line bg-panel/70 p-4">
              <p className="text-sm text-slate-400">Build Doctor local evals</p>
              <p className="mt-2 text-4xl font-semibold text-white">{buildDoctorEvals.score}%</p>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">{buildDoctorEvals.passed}/{buildDoctorEvals.total} fixtures passing</p>
            </div>
            {["Separate Vercel projects", "Health endpoints", "Eval endpoints", "Cross-app navigation"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-md border border-line bg-panel/70 p-3">
                <CheckCircle2 className="h-4 w-4 text-cyan" aria-hidden="true" />
                <span className="text-sm font-medium text-slate-100">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-8 grid gap-4 md:grid-cols-2">
        {suiteApps.map((app, index) => (
          <article key={app.id} className="rounded-lg border border-line bg-black/35 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-cyan">0{index + 1} / {app.demoMode}</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{app.name}</h2>
              </div>
              <StatusChip kind="pass" label={app.evalSummary} />
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{app.subtitle}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {app.proofSignals.map((signal) => (
                <span key={signal} className="rounded-full border border-line bg-panel/70 px-3 py-1 text-xs uppercase tracking-[0.12em] text-slate-300">{signal}</span>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={app.demoUrl} className="inline-flex items-center gap-2 rounded-md border border-cyan/60 bg-cyan/10 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan/20">
                {app.primaryDemoAction} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href={app.statusEndpoint} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-line px-4 py-2 text-sm text-slate-200 hover:border-white/45">
                Health <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href={app.evalEndpoint} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-line px-4 py-2 text-sm text-slate-200 hover:border-white/45">
                Eval <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </article>
        ))}
      </section>

      <section className="mb-8 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-lg border border-line bg-panel/85 p-6">
          <GitBranch className="h-5 w-5 text-gold" aria-hidden="true" />
          <h2 className="mt-3 text-2xl font-semibold text-white">Guided Demo Flow</h2>
          <div className="mt-4 space-y-3">
            {suiteDemoFlow.map((step, index) => (
              <div key={step} className="flex gap-3 rounded-md border border-line bg-black/30 p-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-cyan/50 font-mono text-xs text-cyan">{index + 1}</span>
                <p className="text-sm leading-6 text-slate-300">{step}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-line bg-panel/85 p-6">
          <ShieldCheck className="h-5 w-5 text-cyan" aria-hidden="true" />
          <h2 className="mt-3 text-2xl font-semibold text-white">Job Alignment</h2>
          <div className="mt-4 grid gap-3">
            {jobFamilies.map(([role, evidence]) => (
              <div key={role} className="rounded-md border border-line bg-black/30 p-4">
                <p className="font-semibold text-white">{role}</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">{evidence}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
