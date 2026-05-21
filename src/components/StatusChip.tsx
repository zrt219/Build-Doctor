import { AlertTriangle, CheckCircle2, CircleDot, Lock, ShieldAlert } from "lucide-react";

type StatusKind = "pass" | "review" | "blocked" | "simulated" | "locked";

const iconByKind = {
  pass: CheckCircle2,
  review: AlertTriangle,
  blocked: ShieldAlert,
  simulated: CircleDot,
  locked: Lock,
};

const classByKind = {
  pass: "rounded-full border-solid border-cyan/60 bg-cyan/10",
  review: "rounded-full border-dashed border-gold/70 bg-gold/10",
  blocked: "rounded-md border-2 border-white/70 bg-white/10",
  simulated: "rounded-sm border-dotted border-white/45 bg-white/5",
  locked: "rounded-full border-solid border-line bg-black/30",
};

export function StatusChip({ kind, label }: { kind: StatusKind; label: string }) {
  const Icon = iconByKind[kind];
  return (
    <span className={`inline-flex items-center gap-2 border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white ${classByKind[kind]}`}>
      <Icon aria-hidden="true" className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
