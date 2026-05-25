import { ExternalLink } from "lucide-react";
import { featuredProjects } from "@/data/projects";
import { compactLinkClass, primaryLinkClass, proofActionLabel, proofStatusClass, proofStatusLabel, sectionShellClass } from "./shared";

export function FeaturedProofGrid() {
  return (
    <section id="featured-projects" className={sectionShellClass}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Featured proof systems</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Start with the systems carrying the clearest technical evidence.</h2>
        </div>
        <a href="#projects" className={compactLinkClass}>
          Open full directory
        </a>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {featuredProjects.map((project) => (
          <article key={project.id} className={`rounded-md border p-5 transition hover:-translate-y-0.5 hover:border-cyan/70 ${project.signature ? "border-cyan/70 bg-cyan/10 shadow-glow lg:col-span-2" : "border-line bg-black/30"}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-cyan">{project.category}</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">{project.title}</h3>
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${proofStatusClass(project.proofStatus)}`}>
                {proofStatusLabel(project.proofStatus)}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{project.valueProposition}</p>
            <p className="mt-3 text-sm leading-6 text-slate-400">{project.technicalSignal}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((chip) => (
                <span key={chip} className="rounded-full border border-line bg-panel/70 px-3 py-1 text-xs text-slate-300">
                  {chip}
                </span>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.demoUrl ? (
                <a href={project.demoUrl} target="_blank" rel="noreferrer" className={project.signature ? primaryLinkClass : compactLinkClass}>
                  {proofActionLabel(project.proofStatus)} <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              ) : null}
              {project.githubUrl ? (
                <a href={project.githubUrl} target="_blank" rel="noreferrer" className={compactLinkClass}>
                  GitHub <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
