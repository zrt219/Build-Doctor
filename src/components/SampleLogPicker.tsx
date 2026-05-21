"use client";

import { sampleLogs } from "@/lib/sample-logs";
import { InfoTip } from "./InfoTip";

export function SampleLogPicker({ activeId, onPick }: { activeId: string; onPick: (id: string) => void }) {
  return (
    <section className="rounded-lg border border-line bg-black/30 p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
        Simulated fixture logs{" "}
        <InfoTip label="Fixture log">A safe sample error log used to demonstrate the tool without exposing a real project.</InfoTip>
      </p>
      <div className="grid gap-2">
        {sampleLogs.map((sample, index) => (
          <button
            key={sample.id}
            type="button"
            onClick={() => onPick(sample.id)}
            className={`rounded-md border px-3 py-3 text-left transition ${
              activeId === sample.id ? "border-cyan bg-cyan/10" : "border-line bg-panel/65 hover:border-white/45"
            }`}
          >
            <span className="mr-2 font-mono text-xs text-gold">{String(index + 1).padStart(2, "0")}</span>
            <span className="text-sm font-medium text-white">{sample.title}</span>
            <span className="mt-1 block text-xs uppercase tracking-[0.16em] text-slate-400">{sample.expected}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
