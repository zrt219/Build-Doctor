"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ClipboardCheck, ExternalLink, FileWarning, ServerCog, ShieldCheck, TerminalSquare } from "lucide-react";
import { getCachedDeepSeekDemoReview } from "@/lib/build-doctor/cached-demo-reviews";
import { taxonomyById } from "@/lib/failure-taxonomy";
import { sampleLogs } from "@/lib/sample-logs";
import { socialLinks } from "@/lib/social-links";
import type { AiPatchReview, AutofillFixPlan, CachedProviderReview, Diagnosis } from "@/lib/schemas";
import { AiPatchReviewPanel } from "./AiPatchReviewPanel";
import { DiagnosisPanel } from "./DiagnosisPanel";
import { EvidenceTable } from "./EvidenceTable";
import { FixPlan } from "./FixPlan";
import { IncidentReport } from "./IncidentReport";
import { LogInput } from "./LogInput";
import { PatchDraftPanel } from "./PatchDraftPanel";
import { SampleLogPicker } from "./SampleLogPicker";
import { StatusChip } from "./StatusChip";
import { SuggestedSolutionsPanel } from "./SuggestedSolutionsPanel";
import { TraceTimeline } from "./TraceTimeline";

const proofCards = [
  { icon: ClipboardCheck, title: "Deterministic engine" },
  { icon: ShieldCheck, title: "Secret scan" },
  { icon: CheckCircle2, title: "Local trace" },
  { icon: ServerCog, title: "Optional DeepSeek review" },
  { icon: FileWarning, title: "Markdown export" },
];

const heroArchitectureSteps = ["Paste logs", "Redact secrets", "Classify failure", "Show trace", "Draft patch", "Export report"];

const explainerCards = [
  {
    title: "How it works",
    copy:
      "Build Doctor does not send raw logs directly to a model. It first redacts secrets, classifies the failure with deterministic rules, extracts evidence, maps the failure to a patch template, and prepares an exportable report.",
  },
  {
    title: "Architecture",
    copy:
      "The local engine owns the root-cause classification, evidence extraction, trace generation, patch draft, and report export. The optional LLM layer only reviews the sanitized result and improves the explanation.",
  },
  {
    title: "Safety model",
    copy:
      "Secrets are redacted before outputs or provider calls. Paid models are blocked by default, model output is validated, and no patch is applied automatically.",
  },
];

const employerProofCards = [
  {
    title: "Deterministic-first AI workflow",
    copy: "The local engine owns classification, evidence extraction, trace generation, patch draft, and export.",
  },
  {
    title: "Safe provider boundary",
    copy: "DeepSeek review is optional. Raw logs and secrets are not sent as the source of truth.",
  },
  {
    title: "Test-covered developer tool",
    copy: "Build, unit, browser, and security checks verify the workflow and failure handling.",
  },
  {
    title: "Employer-facing artifact",
    copy: "The app exports a markdown incident report that can be reviewed, copied, or saved.",
  },
];

export function BuildDoctorApp() {
  const [sampleId, setSampleId] = useState(sampleLogs[0].id);
  const activeSample = useMemo(() => sampleLogs.find((sample) => sample.id === sampleId) ?? sampleLogs[0], [sampleId]);
  const activeRecipe = taxonomyById[activeSample.expected];
  const [log, setLog] = useState(activeSample.log);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [aiReviewLoading, setAiReviewLoading] = useState(false);
  const [aiReviewMessage, setAiReviewMessage] = useState("");
  const [aiProviderStatus, setAiProviderStatus] = useState("");
  const [cachedProviderReview, setCachedProviderReview] = useState<CachedProviderReview | null>(null);
  const [selectedSolutionIds, setSelectedSolutionIds] = useState<string[]>([]);
  const [autofillFixPlan, setAutofillFixPlan] = useState<AutofillFixPlan | null>(null);
  const [inputError, setInputError] = useState("");
  const reportFileName = diagnosis ? `build-doctor-report-${diagnosis.failureType.toLowerCase()}.md` : "build-doctor-report.md";
  const headerLinks = socialLinks.filter((link) => ["GitHub", "LinkedIn"].includes(link.label));
  const redactionStatusText = !diagnosis
    ? "Secret scan enabled"
    : diagnosis.redactions.length
      ? `${diagnosis.redactions.length} sensitive values redacted`
      : "No sensitive values detected";
  const activeDemoSummary =
    activeRecipe.id === "SUPABASE_CONFIG_ERROR"
      ? "Demo log shows a missing Supabase URL or anon key in the captured build environment."
      : activeRecipe.description;
  const workflowSteps = [
    {
      index: "01",
      title: "Paste logs",
      copy: "Load a sample log or paste a failed build.",
    },
    {
      index: "02",
      title: "Diagnose root cause",
      copy: "Run the local engine and estimate confidence.",
    },
    {
      index: "03",
      title: "Show local trace",
      copy: "Review the receipt behind the diagnosis.",
    },
    {
      index: "04",
      title: "Review patch draft",
      copy: "Inspect likely files, snippet, and validation commands.",
    },
    {
      index: "05",
      title: "Export report",
      copy: "Generate a markdown incident report.",
    },
  ] as const;

  useEffect(() => {
    if (!diagnosis) {
      setSelectedSolutionIds([]);
      setAutofillFixPlan(null);
      return;
    }
    setSelectedSolutionIds(diagnosis.autofillFixPlan.selectedSuggestionIds);
    setAutofillFixPlan(diagnosis.autofillFixPlan);
  }, [diagnosis?.generatedAt, diagnosis?.failureType]);

  function pickSample(id: string) {
    const next = sampleLogs.find((sample) => sample.id === id);
    if (!next) return;
    setSampleId(id);
    setLog(next.log);
    setDiagnosis(null);
    setReport("");
    setAiReviewMessage("");
    setAiProviderStatus("");
    setCachedProviderReview(null);
    setSelectedSolutionIds([]);
    setAutofillFixPlan(null);
    setInputError("");
  }

  function updateLog(nextLog: string) {
    setLog(nextLog);
    setDiagnosis(null);
    setReport("");
    setAiReviewMessage("");
    setAiProviderStatus("");
    setCachedProviderReview(null);
    setSelectedSolutionIds([]);
    setAutofillFixPlan(null);
    setInputError("");
  }

  async function diagnose() {
    if (!log.trim()) {
      setInputError("Paste a build log or load a demo scenario before running diagnosis.");
      return;
    }
    setLoading(true);
    setReport("");
    setCachedProviderReview(null);
    setSelectedSolutionIds([]);
    setAutofillFixPlan(null);
    setInputError("");
    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ log, sampleId }),
      });
      const payload = (await response.json()) as { diagnosis?: Diagnosis; error?: { message?: string } };
      if (!response.ok || !payload.diagnosis) {
        setInputError(payload.error?.message ?? "Diagnosis failed safely. Check the log input and try again.");
        return;
      }
      setDiagnosis(payload.diagnosis);
      setAiReviewMessage("");
      setAiProviderStatus("");
    } catch {
      setInputError("Diagnosis request failed safely. The local workflow did not store raw logs.");
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
        body: JSON.stringify({
          diagnosis,
          providerStatus: aiProviderStatus || undefined,
          cachedProviderReview: cachedProviderReview ?? undefined,
          selectedSolutionSuggestions: diagnosis.solutionSuggestions.filter((suggestion) => selectedSolutionIds.includes(suggestion.id)),
          autofillFixPlan: autofillFixPlan ?? undefined,
        }),
      });
      const payload = (await response.json()) as { report?: string };
      if (!response.ok || !payload.report) return;
      setReport(payload.report);
    } finally {
      setReportLoading(false);
    }
  }

  async function runAiReview() {
    if (!diagnosis) return;
    const diagnosisWithoutReview = { ...diagnosis, aiPatchReview: undefined };
    setAiReviewLoading(true);
    setAiReviewMessage("");
    setAiProviderStatus("");
    setCachedProviderReview(null);
    setDiagnosis(diagnosisWithoutReview);
    try {
      const response = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diagnosis: diagnosisWithoutReview }),
      });
      const payload = (await response.json()) as { aiPatchReview: AiPatchReview | null; error?: string; providerStatus?: string };
      setAiProviderStatus(payload.providerStatus ?? "");
      if (payload.aiPatchReview) {
        setDiagnosis({ ...diagnosisWithoutReview, aiPatchReview: payload.aiPatchReview });
        setReport("");
        setAiReviewMessage("");
        setCachedProviderReview(null);
      } else {
        setReport("");
        if (payload.providerStatus === "free_model_rate_limited") {
          setCachedProviderReview(getCachedDeepSeekDemoReview(diagnosisWithoutReview.failureType));
        }
        setAiReviewMessage(payload.error ?? "Optional review did not run. The deterministic diagnosis remains available.");
      }
    } catch {
      setAiProviderStatus("llm_error");
      setCachedProviderReview(null);
      setReport("");
      setAiReviewMessage("Optional review did not run. The deterministic diagnosis remains available.");
    } finally {
      setAiReviewLoading(false);
    }
  }

  return (
    <main className="relative mx-auto min-h-screen max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 shadow-[0_18px_70px_rgba(0,0,0,0.22)] backdrop-blur">
        <div className="flex min-w-[240px] items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan/35 bg-cyan/10">
            <ServerCog className="h-5 w-5 text-cyan" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-300">Build Failure Diagnosis</p>
            <p className="text-sm font-semibold text-white">Vercel Build Doctor</p>
          </div>
        </div>
        <nav className="flex flex-wrap gap-2 lg:order-3" aria-label="Build Doctor navigation">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition hover:border-cyan/60 hover:bg-cyan/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan">
            <ArrowLeft className="h-3 w-3" aria-hidden="true" />
            Suite Overview
          </Link>
          {headerLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-100 transition hover:border-cyan/60 hover:bg-cyan/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan"
            >
              {link.label}
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          ))}
        </nav>
        <div className="flex flex-wrap items-center gap-2 lg:order-2">
          <StatusChip kind="simulated" label="Simulated demo" />
          <StatusChip kind="locked" label="Secret scan" />
        </div>
      </header>

      <section className="mb-6 overflow-hidden rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(30,41,59,0.9),rgba(15,23,42,0.76))] shadow-[0_26px_100px_rgba(0,0,0,0.28)]">
        <div className="p-6 sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(300px,0.72fr)]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan">
                <FileWarning className="h-4 w-4" aria-hidden="true" />
                Build failure triage
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[0.98] tracking-[-0.04em] text-white sm:text-5xl lg:text-[64px]">
                Find the root cause in failed Vercel builds.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Paste a Next.js or Vercel build log. Build Doctor redacts sensitive values, identifies the likely failure, shows the evidence trail, suggests a safe patch draft, and exports a markdown incident report.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="#diagnose"
                  className="inline-flex items-center gap-2 rounded-xl border border-cyan/70 bg-cyan/15 px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_0_34px_rgba(109,216,255,0.14)] transition hover:bg-cyan/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan"
                >
                  Run Demo Diagnosis
                </a>
                <Link
                  href="/case-study"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-slate-100 transition hover:border-gold/60 hover:bg-gold/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
                >
                  View Case Study
                </Link>
                <a href="#architecture" className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan">
                  See Architecture
                </a>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {proofCards.map(({ icon: Icon, title }) => (
                  <span key={title} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200">
                    <Icon className="h-3.5 w-3.5 text-cyan" aria-hidden="true" />
                    {title}
                  </span>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-cyan/20 bg-slate-950/35 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]" aria-label="Build Doctor mini architecture">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200">
                  {heroArchitectureSteps.map((item, index) => (
                    <span key={item} className="inline-flex items-center gap-2">
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">{item}</span>
                      {index < heroArchitectureSteps.length - 1 ? <span className="text-cyan" aria-hidden="true">-&gt;</span> : null}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-black/25 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    <TerminalSquare className="h-4 w-4 text-cyan" aria-hidden="true" />
                    Sample input
                  </div>
                  <pre className="mt-3 whitespace-pre-wrap text-xs leading-5 text-slate-300">Type error: Property 'deploymentUrl' does not exist...
src/components/DeploymentCard.tsx:42:19</pre>
                </div>
                <span className="inline-flex w-fit rounded-full border border-gold/55 bg-gold/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-gold">
                  TYPESCRIPT_ERROR - 91% confidence
                </span>
              </div>
            </div>
            <aside className="rounded-2xl border border-white/10 bg-slate-900/45 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Demo path</p>
              <div className="mt-4 space-y-2.5">
                {workflowSteps.map((step) => (
                  <article key={step.index} className="rounded-2xl border border-white/10 bg-white/[0.055] p-3.5 transition hover:border-cyan/35 hover:bg-cyan/10">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-cyan/45 bg-cyan/10 font-mono text-[11px] text-cyan">
                        {step.index}
                      </span>
                      <div>
                        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-white">{step.title}</h2>
                        <p className="mt-1 text-xs leading-5 text-slate-300">{step.copy}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Active demo</p>
                <p className="mt-2 text-lg font-semibold text-white">{activeRecipe.label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{activeDemoSummary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-cyan/40 bg-cyan/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan">
                    {activeRecipe.id}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
                    {activeSample.requiredFixSignals.length} signals
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section id="architecture" className="mb-6 rounded-2xl border border-cyan/20 bg-cyan/10 px-4 py-3 text-sm font-semibold text-slate-100 shadow-[0_16px_50px_rgba(0,0,0,0.16)]" aria-label="Build Doctor architecture">
        <div className="flex flex-wrap items-center justify-center gap-2 text-center">
          {["Deterministic engine", "Local trace", "Safe patch draft", "Optional DeepSeek review", "Markdown report"].map((item, index, items) => (
            <span key={item} className="inline-flex items-center gap-2">
              <span className="rounded-full border border-white/10 bg-slate-950/35 px-3 py-1">{item}</span>
              {index < items.length - 1 ? <span className="text-cyan" aria-hidden="true">-&gt;</span> : null}
            </span>
          ))}
        </div>
      </section>

      <section className="mb-6 grid gap-4 lg:grid-cols-3" aria-label="How Build Doctor works">
        {explainerCards.map((card) => (
          <article key={card.title} className="rounded-2xl border border-white/10 bg-slate-900/55 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan">{card.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">{card.copy}</p>
          </article>
        ))}
      </section>

      <section className="mb-6 rounded-[26px] border border-white/10 bg-slate-900/55 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)]" aria-label="Employer-facing Build Doctor proof">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Employer proof</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Why this project matters</h2>
          </div>
          <Link
            href="/case-study"
            className="inline-flex items-center gap-2 rounded-xl border border-gold/45 bg-gold/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-gold/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
          >
            View architecture case study
          </Link>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {employerProofCards.map((card, index) => (
            <article key={card.title} className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <span className="font-mono text-xs text-gold">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-base font-semibold text-white">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{card.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="diagnose" className="rounded-[26px] border border-white/10 bg-slate-900/55 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Build Doctor Workflow</p>
              <h2 className="text-xl font-semibold text-white">Complete the five-step review from log intake to exportable incident report.</h2>
            </div>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-400">
            The page sends the log to the local diagnosis API, renders a deterministic trace, presents a safe patch draft, and exports the result as markdown.
          </p>
        </div>
        <div className="space-y-5 p-4 sm:p-5">
          <section className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan/45 bg-cyan/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan">Step 1</span>
              <h3 className="text-lg font-semibold text-white">Paste build logs</h3>
            </div>
            <SampleLogPicker activeId={sampleId} onPick={pickSample} />
            <div className="mt-4">
              <LogInput value={log} onChange={updateLog} onDiagnose={diagnose} loading={loading} error={inputError} redactionStatus={redactionStatusText} />
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan/45 bg-cyan/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan">Step 2</span>
              <h3 className="text-lg font-semibold text-white">Diagnose root cause</h3>
            </div>
            {diagnosis ? (
              <DiagnosisPanel diagnosis={diagnosis} compact />
            ) : (
              <div className="rounded-2xl border border-dashed border-white/20 bg-white/[0.02] p-5 text-sm leading-6 text-slate-300">
                Run the local diagnosis engine to classify the failure, calculate confidence, and capture the probable root cause for review.
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan/45 bg-cyan/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan">Step 3</span>
              <h3 className="text-lg font-semibold text-white">Show diagnostic trace</h3>
            </div>
            {diagnosis ? (
              <div className="space-y-4">
                <TraceTimeline diagnosis={diagnosis} />
                <EvidenceTable diagnosis={diagnosis} compact />
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/20 bg-white/[0.02] p-5 text-sm leading-6 text-slate-300">
                The diagnostic trace appears after analysis and shows the deterministic engine steps plus the exact evidence lines it used.
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan/45 bg-cyan/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan">Step 4</span>
              <h3 className="text-lg font-semibold text-white">Suggest patch draft</h3>
            </div>
            {diagnosis ? (
              <div className="space-y-4">
                <PatchDraftPanel diagnosis={diagnosis} />
                {autofillFixPlan ? (
                  <SuggestedSolutionsPanel
                    diagnosis={diagnosis}
                    selectedSuggestionIds={selectedSolutionIds}
                    autofillFixPlan={autofillFixPlan}
                    onSelectedSuggestionIdsChange={setSelectedSolutionIds}
                    onAutofillFixPlanChange={(plan) => {
                      setAutofillFixPlan(plan);
                      setReport("");
                    }}
                  />
                ) : null}
                <AiPatchReviewPanel diagnosis={diagnosis} loading={aiReviewLoading} message={aiReviewMessage} providerStatus={aiProviderStatus} cachedProviderReview={cachedProviderReview} onReview={runAiReview} />
                <FixPlan diagnosis={diagnosis} compact />
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/20 bg-white/[0.02] p-5 text-sm leading-6 text-slate-300">
                The patch draft appears after diagnosis with likely file targets, a deterministic snippet, and validation commands. It is a review aid, not an automatic code change.
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan/45 bg-cyan/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan">Step 5</span>
              <h3 className="text-lg font-semibold text-white">Export incident report</h3>
            </div>
            {diagnosis ? (
              <IncidentReport report={report} onGenerate={generateReport} loading={reportLoading} compact fileName={reportFileName} />
            ) : (
              <div className="rounded-2xl border border-dashed border-white/20 bg-white/[0.02] p-5 text-sm leading-6 text-slate-300">
                Run a diagnosis to generate an exportable incident report.
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
