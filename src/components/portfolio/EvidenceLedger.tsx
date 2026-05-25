import { ExternalLink } from "lucide-react";
import { evidenceSources } from "@/data/evidenceSources";
import { suiteApps } from "@/lib/suite-metadata";
import { compactLinkClass, sectionShellClass } from "./shared";

const statusClass = {
  verified: "border-cyan/60 bg-cyan/10 text-white",
  documented: "border-white/45 bg-white/5 text-slate-100",
  demo: "border-cyan/40 bg-black/25 text-slate-100",
  review: "border-gold/70 border-dashed bg-gold/10 text-white",
};

export function EvidenceLedger() {
  return (
    <section id="evidence-ledger" className={sectionShellClass}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Evidence and QA ledger</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Public-safe proof sources and live check routes.</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
            Raw private logs stay private. This ledger exposes source labels, public demos, health/eval endpoints, and browser QA artifacts.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {evidenceSources.map((source) => (
          <article key={source.id} className="grid gap-3 rounded-md border border-line bg-black/30 p-4 transition hover:border-cyan/45 hover:bg-black/40 md:grid-cols-[0.62fr_0.28fr_0.28fr] md:items-center">
            <div>
              <p className="font-mono text-xs text-cyan">{source.type}</p>
              <h3 className="mt-1 font-semibold text-white">{source.label}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{source.detail}</p>
            </div>
            <p className="rounded-sm border border-dashed border-cyan/30 bg-cyan/5 px-2 py-1 text-xs text-slate-300">{source.publicLabel}</p>
            <div className="flex flex-wrap items-center gap-2 md:justify-end">
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${statusClass[source.status]}`}>{source.status}</span>
              {source.sourceHref ? (
                <a href={source.sourceHref} target="_blank" rel="noreferrer" className={compactLinkClass} aria-label={`Open public-safe source file for ${source.label}`}>
                  Source file <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              ) : null}
              {source.href ? (
                <a href={source.href} target="_blank" rel="noreferrer" className={compactLinkClass} aria-label={`Open ${source.label}`}>
                  Open <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {suiteApps.map((app) => (
          <article key={app.id} className="rounded-md border border-line bg-black/30 p-4">
            <h3 className="font-semibold text-white">{app.name}</h3>
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-400">{app.demoMode}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href={app.statusEndpoint} target="_blank" rel="noreferrer" className={compactLinkClass} aria-label={`Open ${app.name} health endpoint`}>
                Health
              </a>
              <a href={app.evalEndpoint} target="_blank" rel="noreferrer" className={compactLinkClass} aria-label={`Open ${app.name} eval endpoint`}>
                Eval
              </a>
              <a href={app.integrationEndpoint} target="_blank" rel="noreferrer" className={compactLinkClass} aria-label={`Open ${app.name} integration endpoint`}>
                Integration
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
