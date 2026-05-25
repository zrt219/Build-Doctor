import { CheckCircle2, Database, GitBranch, ShieldCheck } from "lucide-react";
import { portfolioStatsLastUpdated } from "@/data/portfolioStats";
import { latestWorkflowSnapshot } from "@/data/workflowEvents";
import { runEvalSuite } from "@/lib/build-doctor";
import { formatCount } from "./shared";

const callouts = [
  { label: "Claims", value: "Source-labeled", icon: ShieldCheck },
  { label: "Agent lanes", value: "3-lane Ralphplan", icon: GitBranch },
  { label: "Evidence refresh", value: portfolioStatsLastUpdated, icon: Database },
  { label: "Build Doctor eval", value: "Deterministic", icon: CheckCircle2 },
];

export function HolographicProofPanel() {
  const buildDoctorEvals = runEvalSuite();

  return (
    <aside className="relative min-h-[390px] overflow-hidden rounded-lg border border-cyan/35 bg-[#07111d]/90 p-5 shadow-glow" aria-label="Source-labeled proof panel">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(109,216,255,0.22),transparent_36%),linear-gradient(135deg,rgba(109,216,255,0.08),transparent_50%)]" />
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative grid gap-3 sm:grid-cols-2">
        {callouts.map((callout) => {
          const Icon = callout.icon;
          return (
            <div key={callout.label} className="rounded-md border border-cyan/30 bg-black/30 p-3">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-cyan" aria-hidden="true" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">{callout.label}</p>
              </div>
              <p className="mt-2 text-sm font-semibold text-white">{callout.value}</p>
            </div>
          );
        })}
      </div>

      <div className="relative mt-6 flex min-h-[180px] items-center justify-center">
        <div className="holo-ring absolute h-48 w-48 rounded-full border border-cyan/45" />
        <div className="holo-ring holo-ring-delay absolute h-36 w-36 rounded-full border border-cyan/40" />
        <div className="absolute h-24 w-24 rotate-45 rounded-md border border-cyan/80 bg-cyan/20 shadow-[0_0_44px_rgba(109,216,255,0.55)]" />
        <div className="absolute h-16 w-16 rotate-45 rounded-md border border-white/60 bg-[#0e7bff]/50 shadow-[0_0_28px_rgba(14,123,255,0.7)]" />
        <div className="absolute bottom-4 h-2 w-60 rounded-full bg-cyan/40 blur-md" />
      </div>

      <div className="relative mt-5 grid gap-3 rounded-md border border-line bg-black/35 p-4 sm:grid-cols-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Workflow events</p>
          <p className="mt-1 text-xl font-semibold text-white">{formatCount(latestWorkflowSnapshot.workflowEvents)}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Codex sessions</p>
          <p className="mt-1 text-xl font-semibold text-white">{formatCount(latestWorkflowSnapshot.sessionRows)}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Eval fixtures</p>
          <p className="mt-1 text-xl font-semibold text-white">{buildDoctorEvals.passed}/{buildDoctorEvals.total}</p>
        </div>
      </div>
    </aside>
  );
}
