import { ArrowRight, Github, Mail } from "lucide-react";
import Link from "next/link";
import { portfolioStatsLastUpdated } from "@/data/portfolioStats";
import { HolographicProofPanel } from "./HolographicProofPanel";
import { primaryLinkClass, secondaryLinkClass } from "./shared";

export function HeroMainframe() {
  return (
    <section className="grid gap-6 py-10 lg:min-h-[560px] lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-14">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">Evidence-backed AI engineering systems</p>
        <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.04] text-white sm:text-5xl lg:text-6xl [text-wrap:balance]">
          AI engineering systems built like a <span className="text-cyan">proof layer</span>.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200 [text-wrap:pretty]">
          Agentic workflows, Vercel diagnostics, RAG/eval systems, Solidity proof layers, and working full-stack demos.
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 [text-wrap:pretty]">
          Visual style follows the supplied reference, but evidence does not. Public stats and project links are sourced from the May 24 local evidence refresh, public GitHub records, and verified Vercel/demo URLs.
        </p>

        <div className="mt-6 flex flex-wrap gap-3" aria-label="Primary portfolio actions">
          <a href="https://github.com/zrt219" target="_blank" rel="noreferrer" className={primaryLinkClass}>
            <Github className="h-4 w-4" aria-hidden="true" />
            View GitHub
          </a>
          <a href="mailto:zpeace11@gmail.com" className={secondaryLinkClass}>
            <Mail className="h-4 w-4" aria-hidden="true" />
            Email Zhane
          </a>
          <Link href="/build-doctor" className={secondaryLinkClass}>
            Try Build Doctor <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="#workflow-tracker" className={secondaryLinkClass}>
            View Workflow Snapshot <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="#projects" className={secondaryLinkClass}>
            View Project Directory <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2 rounded-md border border-line bg-black/25 p-3">
          <span className="rounded-full border border-cyan/45 bg-cyan/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white">
            Ralphplan mode
          </span>
          {["Evidence", "Context", "Subagents", "Implementation", "Browser QA", "Proof ledger"].map((item, index) => (
            <span key={item} className="inline-flex items-center gap-2 text-xs text-slate-400">
              {index > 0 ? <span className="text-cyan/60">-&gt;</span> : null}
              {item}
            </span>
          ))}
        </div>

        <p className="mt-4 text-xs uppercase tracking-[0.14em] text-slate-500">Stats snapshot last verified: {portfolioStatsLastUpdated}</p>
      </div>

      <HolographicProofPanel />
    </section>
  );
}
