"use client";

import { ExternalLink, RotateCcw, Search, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { projectCategories, projects } from "@/data/projects";
import { compactLinkClass, proofActionLabel, proofStatusClass, proofStatusLabel, sectionShellClass } from "./shared";

const filters = ["All", "Proof brief", ...projectCategories, "Public demo", "GitHub repo", "Local evidence"];

export function ProjectDirectory() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const hasActiveSearch = normalizedQuery.length > 0;
  const hasActiveFilter = activeFilter !== "All";
  const activeControlCount = Number(hasActiveSearch) + Number(hasActiveFilter);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const filterMatch =
        activeFilter === "All" ||
        (activeFilter === "Proof brief" && Boolean(project.proofBriefSlug)) ||
        project.category === activeFilter ||
        (activeFilter === "Public demo" && project.proofStatus === "live" && Boolean(project.demoUrl)) ||
        (activeFilter === "GitHub repo" && Boolean(project.githubUrl)) ||
        (activeFilter === "Local evidence" && project.proofStatus === "local-evidence");

      const queryMatch =
        normalizedQuery.length === 0 ||
        [
          project.title,
          project.category,
          project.valueProposition,
          project.technicalSignal,
          project.stack.join(" "),
          proofStatusLabel(project.proofStatus),
          proofActionLabel(project.proofStatus),
          project.urlKind ?? "",
          project.githubUrl ? "GitHub repo public source" : "source pending",
          project.demoUrl ? "project URL demo reference" : "",
          project.evidenceRefs.join(" "),
          project.proofBriefSlug ? "signature proof brief project deep dive" : "",
          project.signatureDetails?.headline ?? "",
          project.signatureDetails?.proofSummary ?? "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return filterMatch && queryMatch;
    });
  }, [activeFilter, normalizedQuery]);

  function resetDirectory() {
    setActiveFilter("All");
    setQuery("");
  }

  return (
    <section id="projects" className={sectionShellClass}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Full GitHub project directory</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Searchable proof-backed project map.</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
            Public projects are grouped by technical signal. Local-only evidence is labeled instead of overstated.
          </p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
          <label htmlFor="project-search" className="sr-only">
            Search projects
          </label>
          <input
            id="project-search"
            type="search"
            suppressHydrationWarning
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects, stacks, proof briefs"
            className="min-h-11 w-full rounded-md border border-line bg-black/35 py-2 pl-10 pr-11 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan/70"
          />
          {hasActiveSearch ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md border border-line bg-black/35 text-slate-200 transition hover:border-cyan/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
              aria-label="Clear project search"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2" aria-label="Project filters">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            aria-pressed={activeFilter === filter}
            className={`min-h-10 rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan ${
              activeFilter === filter ? "border-cyan/80 bg-cyan/20 text-white shadow-[0_0_0_1px_rgba(109,216,255,0.18)]" : "border-line bg-black/25 text-slate-300 hover:border-cyan/60 hover:bg-cyan/10 hover:text-white"
            }`}
          >
            {filter}
          </button>
        ))}
        <button
          type="button"
          onClick={resetDirectory}
          disabled={!activeControlCount}
          className="min-h-10 rounded-full border border-line bg-black/25 px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-300 transition hover:border-cyan/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-line disabled:hover:text-slate-300"
        >
          <span className="inline-flex items-center gap-2">
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset filters
          </span>
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-line bg-black/20 px-3 py-2">
        <p className="text-sm font-semibold text-slate-200" aria-live="polite">
          Showing {filteredProjects.length} of {projects.length} proof-backed projects
        </p>
        <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.1em] text-slate-400">
          <span className="rounded-full border border-line bg-black/25 px-2 py-1">Filter: {activeFilter}</span>
          {hasActiveSearch ? <span className="rounded-full border border-cyan/35 bg-cyan/10 px-2 py-1 text-white">Search: {query.trim()}</span> : null}
          {activeControlCount ? <span className="rounded-full border border-gold/45 bg-gold/10 px-2 py-1 text-white">{activeControlCount} active</span> : null}
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {filteredProjects.length ? filteredProjects.map((project, index) => (
          <article key={project.id} className="grid gap-4 rounded-md border border-line bg-black/30 p-4 transition hover:border-cyan/60 hover:bg-black/40 lg:grid-cols-[0.18fr_0.62fr_0.32fr_0.28fr] lg:items-center">
            <div>
              <p className="font-mono text-xs text-cyan">{String(index + 1).padStart(2, "0")}</p>
              <span className={`mt-2 inline-flex rounded-full border px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] ${proofStatusClass(project.proofStatus)}`}>
                {proofStatusLabel(project.proofStatus)}
              </span>
            </div>
            <div>
              <p className="font-mono text-xs text-cyan">{project.category}</p>
              <h3 className="mt-1 text-xl font-semibold text-white">{project.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{project.valueProposition}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.stack.slice(0, 4).map((chip) => (
                <span key={chip} className="rounded-full border border-line bg-panel/70 px-2 py-1 text-xs text-slate-300">
                  {chip}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              {project.proofBriefSlug ? (
                <Link href={`/projects/${project.proofBriefSlug}`} className={compactLinkClass} aria-label={`View proof brief for ${project.title}`}>
                  Proof brief
                </Link>
              ) : null}
              {project.demoUrl ? (
                <a href={project.demoUrl} target="_blank" rel="noreferrer" className={compactLinkClass} aria-label={`${proofActionLabel(project.proofStatus)} for ${project.title}`}>
                  {proofActionLabel(project.proofStatus)} <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              ) : null}
              {project.githubUrl ? (
                <a href={project.githubUrl} target="_blank" rel="noreferrer" className={compactLinkClass} aria-label={`Open GitHub repo for ${project.title}`}>
                  Repo <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              ) : (
                <span role="status" aria-label={`Public source link pending for ${project.title}`} className="inline-flex min-h-10 items-center rounded-md border border-dashed border-gold/60 bg-gold/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-white">
                  Source link pending
                </span>
              )}
            </div>
          </article>
        )) : (
          <div className="rounded-md border border-dashed border-line bg-black/25 p-6 text-center">
            <p className="font-semibold text-white">No project matches these controls.</p>
            <p className="mt-2 text-sm text-slate-400">Try a broader term like RAG, Vercel, Solidity, agent, proof brief, or reset filters to keep browsing public-safe project evidence.</p>
            <button type="button" onClick={resetDirectory} className={`${compactLinkClass} mt-4`}>
              Reset project directory
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
