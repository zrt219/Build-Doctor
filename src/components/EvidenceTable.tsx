import type { Diagnosis } from "@/lib/schemas";
import { InfoTip } from "./InfoTip";

export function EvidenceTable({ diagnosis, compact = false }: { diagnosis: Diagnosis; compact?: boolean }) {
  return (
    <section className={`${compact ? "rounded-2xl border border-white/10 bg-white/[0.035] p-4" : "rounded-lg border border-line bg-panel/90 p-5"}`}>
      <h3 className="text-lg font-semibold text-white">
        Evidence behind the diagnosis{" "}
        <InfoTip label="Evidence">The exact lines used by the tool so the diagnosis can be independently reviewed.</InfoTip>
      </h3>
      <div className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-black/20">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-[0.16em] text-slate-300">
            <tr>
              <th className="px-3 py-3 text-left">Line</th>
              <th className="px-3 py-3 text-left">Type</th>
              <th className="px-3 py-3 text-left">Evidence</th>
            </tr>
          </thead>
          <tbody>
            {diagnosis.evidence.map((line) => (
              <tr key={`${line.lineNumber}-${line.content}`} className="border-t border-line">
                <td className="px-3 py-3 font-mono text-gold">L{line.lineNumber}</td>
                <td className="px-3 py-3">
                  <span className="rounded-full border border-cyan/30 bg-cyan/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan">
                    {line.kind}
                  </span>
                </td>
                <td className="px-3 py-3 font-mono text-slate-200 whitespace-pre-wrap break-words">{compact ? line.content.slice(0, 120) : line.content}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
