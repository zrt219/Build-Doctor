import { Activity, CheckCircle2, Code2, Database, FileCode2, Github, ShieldCheck, Sigma } from "lucide-react";
import { portfolioAnalytics, portfolioStats, portfolioStatsLastUpdated } from "@/data/portfolioStats";
import { proofChipClass } from "./shared";

const iconByIndex = [Activity, Database, FileCode2, Github, ShieldCheck, Code2, Sigma, CheckCircle2];
const statCards = [
  ...portfolioStats.slice(0, 4),
  ...portfolioAnalytics.map((item) => ({
    id: item.id,
    label: item.label,
    value: item.value,
    displayValue: item.value,
    sourceLabel: item.sourceLabel,
    sourceFile: item.sourceFile,
    confidence: "High" as const,
    detail: "Verified summary value from the May 24 evidence snapshot.",
    description: item.label,
    publicSafe: true,
    lastVerified: portfolioStatsLastUpdated,
  })),
];

export function StatsRibbon() {
  return (
    <section id="metrics" className="scroll-mt-28 rounded-lg border border-cyan/30 bg-black/25 p-4" aria-label="Verified proof stats snapshot">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Verified proof stats</p>
          <h2 className="mt-1 text-xl font-semibold text-white">May 24 evidence snapshot</h2>
        </div>
        <span className={proofChipClass}>
          <CheckCircle2 className="h-3.5 w-3.5 text-cyan" aria-hidden="true" />
          Not image-derived
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = iconByIndex[index % iconByIndex.length];
          return (
            <article key={stat.id} className="rounded-md border border-line bg-[#07111d]/75 p-4 transition-colors hover:border-cyan/45 hover:bg-[#0a1624]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-2xl font-semibold leading-none text-white md:text-3xl">{stat.displayValue}</p>
                  <h3 className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200">{stat.label}</h3>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-cyan/45 bg-cyan/10">
                  <Icon aria-hidden="true" className="h-4 w-4 text-cyan" />
                </span>
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-400">{stat.description}</p>
              <p className="mt-3 rounded-sm border border-dashed border-cyan/30 bg-cyan/5 px-2 py-1 text-[11px] uppercase tracking-[0.1em] text-slate-300">
                {stat.confidence} confidence - {stat.sourceLabel}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
