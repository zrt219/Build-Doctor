"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Clipboard, Download, FileText } from "lucide-react";

export function IncidentReport({
  report,
  onGenerate,
  loading,
  compact = false,
  fileName = "build-doctor-report.md",
}: {
  report: string;
  onGenerate: () => void;
  loading: boolean;
  compact?: boolean;
  fileName?: string;
}) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  useEffect(() => {
    setCopyState("idle");
  }, [report]);

  async function copyReport() {
    try {
      await navigator.clipboard.writeText(report);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }

  function downloadReport() {
    const blob = new Blob([report], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className={`${compact ? "rounded-2xl border border-white/10 bg-white/[0.035] p-4" : "rounded-lg border border-line bg-panel/90 p-5"}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan">Export incident report</p>
          <h3 className="text-lg font-semibold text-white">Markdown incident report</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {report
              ? "Markdown report generated. Copy it or download it for review."
              : "Ready to export a markdown report with evidence, root cause, patch draft, validation commands, and remaining risks."}
          </p>
        </div>
        <button
          type="button"
          onClick={report ? downloadReport : onGenerate}
          disabled={loading}
          aria-busy={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-gold/60 bg-gold/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition hover:bg-gold/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold disabled:opacity-50"
        >
          {report ? <Download className="h-4 w-4" aria-hidden="true" /> : <FileText className="h-4 w-4" aria-hidden="true" />}
          {loading ? "Preparing Report" : report ? "Download Markdown" : "Generate Report"}
        </button>
      </div>
      {report ? (
        <>
          <div className="sticky top-2 z-10 mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-slate-950/85 p-3 backdrop-blur">
            <button
              type="button"
              onClick={copyReport}
              disabled={!report}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:border-cyan/45 hover:bg-cyan/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan"
            >
              <Clipboard className="h-4 w-4" aria-hidden="true" />
              Copy Markdown
            </button>
            <span
              aria-live="polite"
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] ${
                copyState === "error" ? "border-dashed border-gold/70 bg-gold/10 text-gold" : "border-cyan/45 bg-cyan/10 text-cyan"
              }`}
            >
              {copyState === "error" ? <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" /> : <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />}
              {copyState === "copied" ? "Copied" : copyState === "error" ? "Clipboard unavailable" : "Markdown preview ready"}
            </span>
          </div>
          <pre className={`${compact ? "max-h-[300px]" : "max-h-[380px]"} mt-4 overflow-auto rounded-xl border border-white/10 bg-slate-950/75 p-4 whitespace-pre-wrap text-sm leading-6 text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]`}>{report}</pre>
        </>
      ) : (
        <p className="mt-4 rounded-xl border border-dashed border-white/20 p-4 text-sm leading-6 text-slate-300">Ready to export a markdown report with evidence, root cause, patch draft, validation commands, and remaining risks.</p>
      )}
    </section>
  );
}
