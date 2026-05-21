import { Info } from "lucide-react";

export function InfoTip({ label, children }: { label: string; children: string }) {
  return (
    <span className="group relative inline-flex align-middle">
      <span
        tabIndex={0}
        role="note"
        aria-label={`${label}: ${children}`}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-cyan/60 bg-cyan/10 text-cyan outline-none transition hover:bg-cyan/20 focus:border-white focus:bg-cyan/20"
      >
        <Info className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
      <span className="pointer-events-none absolute left-1/2 top-7 z-30 hidden w-72 -translate-x-1/2 rounded-md border border-line bg-[#071018] p-3 text-left text-xs normal-case leading-5 tracking-normal text-slate-200 shadow-2xl group-hover:block group-focus-within:block">
        <span className="mb-1 block font-semibold uppercase tracking-[0.14em] text-cyan">{label}</span>
        {children}
      </span>
    </span>
  );
}
