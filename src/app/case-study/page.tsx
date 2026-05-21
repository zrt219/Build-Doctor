import Link from "next/link";
import { ArrowLeft, CheckCircle2, Route, ShieldCheck } from "lucide-react";
import { CaseStudySection } from "@/components/CaseStudySection";
import { StatusChip } from "@/components/StatusChip";
import { runEvalSuite } from "@/lib/build-doctor";
import { failureTaxonomy } from "@/lib/failure-taxonomy";

export default function CaseStudyPage() {
  const evals = runEvalSuite();

  return (
    <main className="relative mx-auto min-h-screen max-w-6xl px-5 py-6 lg:px-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line bg-black/35 px-4 py-3">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-slate-200 hover:text-white">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Suite
        </Link>
        <div className="flex flex-wrap gap-2">
          <StatusChip kind="simulated" label="Case study demo" />
          <StatusChip kind={evals.failed === 0 ? "pass" : "review"} label={`${evals.passed}/${evals.total} eval pass`} />
        </div>
      </header>

      <section className="rounded-lg border border-line bg-panel/85 p-7 shadow-glow">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan">Recruiter-facing AI engineering proof</p>
        <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl">Vercel Build Doctor Agent</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
          A deterministic agent workflow for diagnosing failed builds, deployment misconfigurations, runtime errors, and unsafe log handling. It is designed to demonstrate practical AI product engineering, not a generic chatbot.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/build-doctor" className="inline-flex items-center gap-2 rounded-md border border-cyan/70 bg-cyan/15 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan/25">
            Open Build Doctor
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 rounded-md border border-line bg-black/30 px-4 py-2 text-sm font-semibold text-white hover:border-white/45">
            View full suite
          </Link>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-line bg-black/35 p-5">
          <Route className="h-5 w-5 text-cyan" aria-hidden="true" />
          <h2 className="mt-3 font-semibold text-white">Agent Workflow</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">Ingest, redact, classify, extract evidence, map recipes, emit patch and verification plans.</p>
        </div>
        <div className="rounded-lg border border-line bg-black/35 p-5">
          <ShieldCheck className="h-5 w-5 text-gold" aria-hidden="true" />
          <h2 className="mt-3 font-semibold text-white">Security First</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">Secrets are redacted before diagnosis, display, report generation, or optional provider calls.</p>
        </div>
        <div className="rounded-lg border border-line bg-black/35 p-5">
          <CheckCircle2 className="h-5 w-5 text-cyan" aria-hidden="true" />
          <h2 className="mt-3 font-semibold text-white">Eval Harness</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">Eight fixture logs test category correctness, fix relevance, evidence extraction, and redaction safety.</p>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-line bg-panel/90 p-6">
        <h2 className="text-2xl font-semibold text-white">Failure Taxonomy</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {failureTaxonomy.map((entry) => (
            <div key={entry.id} className="rounded-md border border-line bg-black/30 p-4">
              <p className="text-sm font-semibold text-white">{entry.label}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-cyan">{entry.id}</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">{entry.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-line bg-panel/90 p-6">
        <h2 className="text-2xl font-semibold text-white">Eval Results</h2>
        <p className="mt-2 text-sm text-slate-400">Score: {evals.score}% | Passed: {evals.passed} | Partial: {evals.partial} | Failed: {evals.failed}</p>
        <div className="mt-4 grid gap-3">
          {evals.cases.map((item) => (
            <div key={item.id} className="rounded-md border border-line bg-black/30 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-semibold text-white">{item.name}</p>
                <StatusChip kind={item.result === "PASS" ? "pass" : item.result === "PARTIAL" ? "review" : "blocked"} label={item.result} />
              </div>
              <p className="mt-2 text-sm text-slate-400">Expected {item.expected}; actual {item.actual}.</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-6">
        <CaseStudySection />
      </div>
    </main>
  );
}
