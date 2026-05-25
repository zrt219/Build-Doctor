import { Activity } from "lucide-react";

type TrackerHeartbeatProps = {
  label: string;
};

export function TrackerHeartbeat({ label }: TrackerHeartbeatProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-cyan/45 bg-black/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-cyan/60 opacity-70 motion-safe:animate-ping motion-reduce:animate-none" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan" />
      </span>
      <Activity className="h-3.5 w-3.5 text-cyan" aria-hidden="true" />
      {label}
    </span>
  );
}
