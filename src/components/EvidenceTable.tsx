import type { Diagnosis } from "@/lib/schemas";
import { InfoTip } from "./InfoTip";

export function EvidenceTable({ diagnosis }: { diagnosis: Diagnosis }) {
  return (
    <section className="rounded-lg border border-line bg-panel/90 p-5">
      <h3 className="text-lg font-semibold text-white">
        Extracted Evidence{" "}
        <InfoTip label="Evidence">The exact lines the tool used to make its decision, so the diagnosis can be checked instead of trusted blindly.</InfoTip>
      </h3>
      <div className="mt-4 overflow-hidden rounded-md border border-line">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-[0.16em] text-slate-300">
            <tr>
              <th className="px-3 py-3 text-left">Line</th>
              <th className="px-3 py-3 text-left">Kind</th>
              <th className="px-3 py-3 text-left">Evidence</th>
            </tr>
          </thead>
          <tbody>
            {diagnosis.evidence.map((line) => (
              <tr key={`${line.lineNumber}-${line.content}`} className="border-t border-line">
                <td className="px-3 py-3 font-mono text-gold">{line.lineNumber}</td>
                <td className="px-3 py-3 uppercase tracking-[0.12em] text-cyan">{line.kind}</td>
                <td className="px-3 py-3 font-mono text-slate-200">{line.content}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
