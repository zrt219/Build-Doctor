import type { ProofStatus } from "@/data/projects";

export const primaryLinkClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-cyan/70 bg-cyan/15 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-cyan hover:bg-cyan/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan active:translate-y-0";

export const secondaryLinkClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-line bg-black/25 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:-translate-y-0.5 hover:border-white/55 hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan active:translate-y-0";

export const compactLinkClass =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-line bg-black/25 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:-translate-y-0.5 hover:border-cyan/70 hover:bg-cyan/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan active:translate-y-0";

export const sectionShellClass = "scroll-mt-28 rounded-lg border border-line bg-panel/85 p-5 sm:p-6 lg:p-7";

export const proofChipClass =
  "inline-flex items-center gap-2 rounded-full border border-cyan/45 bg-cyan/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white";

export function formatCount(value: number) {
  return value.toLocaleString("en-US");
}

export function proofStatusLabel(status: ProofStatus) {
  switch (status) {
    case "live":
      return "Public demo";
    case "repo":
      return "Public repo";
    case "local-evidence":
      return "Local evidence";
    case "planned":
      return "Planned";
    case "unverified":
      return "Unverified";
  }
}

export function proofActionLabel(status: ProofStatus) {
  switch (status) {
    case "live":
      return "Open demo";
    case "repo":
      return "Open project URL";
    case "local-evidence":
      return "Evidence noted";
    case "planned":
      return "Planned";
    case "unverified":
      return "Unverified";
  }
}

export function proofStatusClass(status: ProofStatus) {
  switch (status) {
    case "live":
      return "border-cyan/60 bg-cyan/10 text-white";
    case "repo":
      return "border-cyan/45 bg-black/25 text-slate-100";
    case "local-evidence":
      return "border-gold/70 border-dashed bg-gold/10 text-white";
    case "planned":
      return "border-white/40 border-dotted bg-white/5 text-slate-200";
    case "unverified":
      return "border-white/60 border-2 bg-white/10 text-white";
  }
}
