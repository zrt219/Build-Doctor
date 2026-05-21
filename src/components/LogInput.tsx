"use client";

import { ClipboardPaste, Loader2, Play } from "lucide-react";
import { InfoTip } from "./InfoTip";

export function LogInput({
  value,
  onChange,
  onDiagnose,
  loading,
  error,
  redactionStatus,
}: {
  value: string;
  onChange: (value: string) => void;
  onDiagnose: () => void;
  loading: boolean;
  error?: string;
  redactionStatus: string;
}) {
  return (
    <section className="rounded-2xl border border-cyan/30 bg-[linear-gradient(180deg,rgba(30,41,59,0.82),rgba(15,23,42,0.76))] p-5 shadow-[0_18px_70px_rgba(0,0,0,0.2)]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">Build Log Intake</p>
          <h2 className="text-xl font-semibold leading-snug text-white">
            Paste a failed Next.js or Vercel build log{" "}
            <InfoTip label="Build log">The text output from a failed deployment. It usually contains the first signal needed to identify the failure source.</InfoTip>
          </h2>
        </div>
        <span className="inline-flex items-center gap-2 rounded-xl border border-dashed border-gold/60 bg-gold/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          <ClipboardPaste className="h-4 w-4" aria-hidden="true" />
          {redactionStatus}
        </span>
      </div>
      <textarea
        aria-label="Build log input"
        aria-describedby="build-log-description build-log-error"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[260px] w-full resize-y rounded-2xl border border-white/10 bg-slate-950/70 p-4 font-mono text-sm leading-6 text-slate-100 outline-none transition focus:border-cyan"
        spellCheck={false}
      />
      <p id="build-log-description" className="mt-2 text-xs leading-5 text-slate-400">
        Local-first demo input only. Raw logs are redacted before classification, reporting, or optional provider review.
      </p>
      {error ? (
        <p id="build-log-error" role="alert" className="mt-3 rounded-xl border border-dashed border-gold/60 bg-gold/10 px-3 py-2 text-sm font-semibold text-gold">
          {error}
        </p>
      ) : null}
      <button
        type="button"
        onClick={onDiagnose}
        aria-busy={loading}
        disabled={loading || !value.trim()}
        className="mt-4 inline-flex min-w-44 items-center justify-center gap-2 rounded-xl border border-cyan/80 bg-cyan/30 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_14px_34px_rgba(109,216,255,0.12)] transition hover:bg-cyan/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan disabled:cursor-not-allowed disabled:opacity-45"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
        {loading ? "Running diagnosis..." : "Run diagnosis"}
      </button>
    </section>
  );
}
