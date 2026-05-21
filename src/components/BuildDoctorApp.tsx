"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ServerCog } from "lucide-react";
import { sampleLogs } from "@/lib/sample-logs";
import type { Diagnosis } from "@/lib/schemas";
import { suiteApps } from "@/lib/suite-metadata";
import { CaseStudySection } from "./CaseStudySection";
import { DiagnosisPanel } from "./DiagnosisPanel";
import { EvidenceTable } from "./EvidenceTable";
import { FixPlan } from "./FixPlan";
import { InfoTip } from "./InfoTip";
import { IncidentReport } from "./IncidentReport";
import { LogInput } from "./LogInput";
import { SampleLogPicker } from "./SampleLogPicker";
import { SocialLinks } from "./SocialLinks";
import { StatusChip } from "./StatusChip";

export function BuildDoctorApp() {
  const [sampleId, setSampleId] = useState(sampleLogs[0].id);
  const activeSample = useMemo(() => sampleLogs.find((sample) => sample.id === sampleId) ?? sampleLogs[0], [sampleId]);
  const [log, setLog] = useState(activeSample.log);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  function pickSample(id: string) {
    const next = sampleLogs.find((sample) => sample.id === id);
    if (!next) return;
    setSampleId(id);
    setLog(next.log);
    setDiagnosis(null);
    setReport("");
  }

  async function diagnose() {
    setLoading(true);
    setReport("");
    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ log, sampleId }),
      });
      const payload = (await response.json()) as { diagnosis: Diagnosis };
      setDiagnosis(payload.diagnosis);
    } finally {
      setLoading(false);
    }
  }

  async function generateReport() {
    if (!diagnosis) return;
    setReportLoading(true);
    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diagnosis }),
      });
      const payload = (await response.json()) as { report: string };
      setReport(payload.report);
    } finally {
      setReportLoading(false);
    }
  }

  return (
    <main className="relative mx-auto min-h-screen max-w-7xl px-5 py-6 lg:px-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line bg-black/35 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-cyan/60 bg-cyan/10">
            <ServerCog className="h-5 w-5 text-cyan" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">ZRT Build Reliability Lab</p>
            <p className="font-semibold text-white">Vercel Build Doctor Agent</p>
          </div>
        </div>
        <nav className="flex flex-wrap gap-2" aria-label="Suite navigation">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-line bg-black/25 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-200 hover:border-cyan/70 hover:text-white">
            <ArrowLeft className="h-3 w-3" aria-hidden="true" />
            Suite
          </Link>
          {suiteApps.slice(1).map((app) => (
            <a key={app.id} href={app.demoUrl} className="inline-flex items-center gap-2 rounded-full border border-line bg-black/25 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-200 hover:border-cyan/70 hover:text-white">
              {app.id.replace("-", " ")}
            </a>
          ))}
        </nav>
        <div className="flex flex-wrap gap-2">
          <StatusChip kind="simulated" label="Demo mode" />
          <StatusChip kind="locked" label="No raw log storage" />
          <StatusChip kind="pass" label="Deterministic fallback" />
        </div>
        <SocialLinks />
      </header>

      <section className="mb-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-lg border border-line bg-panel/80 p-7 shadow-glow">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan">AI debugging assistant for failed builds</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-white md:text-6xl">Diagnose Vercel build failures from evidence, not vibes.</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">
            Paste a failing Vercel or Next.js build log. Build Doctor classifies the failure, extracts evidence, proposes fixes, generates a patch checklist, and exports a recruiter-ready incident report.
          </p>
          <div className="mt-5 rounded-md border border-dashed border-cyan/40 bg-cyan/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Plain English</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              When a website fails to deploy, the error log can look overwhelming. This tool reads the log, hides secrets, points to the likely cause, and gives the next commands to try.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#diagnose" className="inline-flex items-center gap-2 rounded-md border border-cyan/70 bg-cyan/15 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white hover:bg-cyan/25">
              Run diagnosis <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <Link href="/case-study" className="inline-flex items-center gap-2 rounded-md border border-line bg-black/30 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white hover:border-white/45">
              View case study
            </Link>
          </div>
        </div>
        <div className="rounded-lg border border-line bg-black/35 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            Diagnostic Pipeline{" "}
            <InfoTip label="Pipeline">The step-by-step path the tool follows, from pasted log to fix checklist.</InfoTip>
          </p>
          {["Ingest log", "Redact secrets", "Classify failure", "Extract evidence", "Map fix recipe", "Generate report"].map((step, index) => (
            <div key={step} className="mt-4 flex items-center gap-3 rounded-md border border-line bg-panel/70 p-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-sm border border-cyan/50 font-mono text-xs text-cyan">{index + 1}</span>
              <span className="text-sm font-medium text-slate-100">{step}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8 grid gap-4 md:grid-cols-3">
        {[
          ["Suite role", "First stop in the connected AI systems demo: turn an incident signal into evidence."],
          ["Recruiter signal", "Shows failure analysis, structured outputs, redaction safety, and eval discipline."],
          ["Next handoff", "Use the incident report as context for gateway routing, workflow approval, and resume evidence."],
        ].map(([title, copy]) => (
          <div key={title} className="rounded-lg border border-line bg-black/30 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">{title}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{copy}</p>
          </div>
        ))}
      </section>

      <div id="diagnose" className="grid gap-5 lg:grid-cols-[330px_1fr]">
        <SampleLogPicker activeId={sampleId} onPick={pickSample} />
        <LogInput value={log} onChange={setLog} onDiagnose={diagnose} loading={loading} />
      </div>

      <div className="mt-6 space-y-5">
        {diagnosis ? (
          <>
            <DiagnosisPanel diagnosis={diagnosis} />
            <EvidenceTable diagnosis={diagnosis} />
            <FixPlan diagnosis={diagnosis} />
            <IncidentReport report={report} onGenerate={generateReport} loading={reportLoading} />
          </>
        ) : (
          <section className="rounded-lg border border-dashed border-line bg-black/25 p-6 text-sm text-slate-400">
            Select a fixture or paste your own log, then run the deterministic diagnosis pipeline. Demo data is labeled simulated and raw logs are not stored.
          </section>
        )}
        <CaseStudySection />
      </div>
    </main>
  );
}
