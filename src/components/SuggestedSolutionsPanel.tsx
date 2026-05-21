"use client";

import { useState } from "react";
import { CheckCircle2, Clipboard, FilePlus2, ShieldAlert, TerminalSquare } from "lucide-react";
import { buildAutofillFixPlan } from "@/lib/build-doctor/solution-suggestions";
import type { AutofillFixPlan, Diagnosis } from "@/lib/schemas";
import { InfoTip } from "./InfoTip";

export function SuggestedSolutionsPanel({
  diagnosis,
  selectedSuggestionIds,
  autofillFixPlan,
  onSelectedSuggestionIdsChange,
  onAutofillFixPlanChange,
}: {
  diagnosis: Diagnosis;
  selectedSuggestionIds: string[];
  autofillFixPlan: AutofillFixPlan;
  onSelectedSuggestionIdsChange: (ids: string[]) => void;
  onAutofillFixPlanChange: (plan: AutofillFixPlan) => void;
}) {
  const [copyState, setCopyState] = useState("");
  const selectedSuggestions = diagnosis.solutionSuggestions.filter((suggestion) => selectedSuggestionIds.includes(suggestion.id));

  async function copyText(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopyState(`${label} copied`);
    } catch {
      setCopyState("Clipboard unavailable");
    }
  }

  function toggleSuggestion(id: string) {
    const nextIds = selectedSuggestionIds.includes(id)
      ? selectedSuggestionIds.filter((selectedId) => selectedId !== id)
      : [...selectedSuggestionIds, id];
    onSelectedSuggestionIdsChange(nextIds);
    onAutofillFixPlanChange(buildAutofillFixPlan(diagnosis.solutionSuggestions, nextIds));
  }

  function autofillFromSelected() {
    onAutofillFixPlanChange(buildAutofillFixPlan(diagnosis.solutionSuggestions, selectedSuggestionIds));
    setCopyState("Fix plan autofilled from selected solutions");
  }

  function updateEditablePlan(editablePlan: string) {
    onAutofillFixPlanChange({
      ...autofillFixPlan,
      selectedSuggestionIds,
      editablePlan,
    });
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Suggested solutions{" "}
            <InfoTip label="Suggested solutions">Deterministic repair options based on the detected failure type. These are templates for review, not automatic code changes.</InfoTip>
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
            Review deterministic solution cards, choose what belongs in the report, and autofill an editable fix plan. Build Doctor does not modify repository files.
          </p>
        </div>
        <button
          type="button"
          onClick={autofillFromSelected}
          className="inline-flex items-center gap-2 rounded-xl border border-cyan/60 bg-cyan/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-cyan/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan"
        >
          <FilePlus2 className="h-4 w-4" aria-hidden="true" />
          Autofill Fix Plan
        </button>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {diagnosis.solutionSuggestions.map((suggestion) => {
          const selected = selectedSuggestionIds.includes(suggestion.id);
          return (
            <article
              key={suggestion.id}
              className={`rounded-2xl border p-4 transition ${
                selected ? "border-cyan/65 bg-cyan/10 shadow-[0_14px_42px_rgba(109,216,255,0.08)]" : "border-white/10 bg-black/25"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan">{suggestion.confidence} confidence</p>
                  <h4 className="mt-2 text-base font-semibold text-white">{suggestion.title}</h4>
                </div>
                <button
                  type="button"
                  onClick={() => toggleSuggestion(suggestion.id)}
                  aria-pressed={selected}
                  className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] transition ${
                    selected ? "border-cyan/60 bg-cyan/10 text-cyan" : "border-white/15 bg-white/[0.04] text-slate-300 hover:border-cyan/40 hover:text-white"
                  }`}
                >
                  {selected ? "Selected" : "Add to report"}
                </button>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{suggestion.summary}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">When to use</p>
              <p className="mt-1 text-sm leading-6 text-slate-300">{suggestion.whenToUse}</p>

              {suggestion.envVars?.length ? (
                <div className="mt-4 rounded-xl border border-gold/35 bg-gold/5 p-3">
                  <div className="flex items-center gap-2 text-gold">
                    <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                    <p className="text-xs font-semibold uppercase tracking-[0.14em]">Environment values</p>
                  </div>
                  <div className="mt-3 space-y-2">
                    {suggestion.envVars.map((envVar) => (
                      <div key={envVar.name} className="rounded-lg border border-white/10 bg-black/25 p-3">
                        <p className="font-mono text-xs text-slate-100">{envVar.name}={envVar.placeholder}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-400">
                          {envVar.visibility.replaceAll("_", " ")} / {envVar.required ? "required" : "optional"}
                        </p>
                        {envVar.warning ? <p className="mt-2 text-xs leading-5 text-gold">{envVar.warning}</p> : null}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <ol className="mt-4 space-y-2 text-sm leading-6 text-slate-300">
                {suggestion.steps.map((step, index) => (
                  <li key={step} className="flex gap-2">
                    <span className="font-mono text-xs text-gold">{index + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>

              {suggestion.snippet ? (
                <div className="mt-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan">{suggestion.snippet.label}</p>
                    <button
                      type="button"
                      onClick={() => copyText("Snippet", suggestion.snippet?.value ?? "")}
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-200 hover:border-cyan/40"
                    >
                      <Clipboard className="h-3.5 w-3.5" aria-hidden="true" />
                      Copy snippet
                    </button>
                  </div>
                  <pre className="mt-2 max-h-[180px] overflow-auto rounded-xl border border-white/10 bg-slate-950/80 p-3 whitespace-pre-wrap text-xs leading-5 text-slate-100">
                    <code>{suggestion.snippet.value}</code>
                  </pre>
                </div>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2">
                {suggestion.verificationCommands.map((command) => (
                  <button
                    key={command}
                    type="button"
                    onClick={() => copyText("Command", command)}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/35 px-3 py-2 font-mono text-xs text-slate-100 transition hover:border-cyan/40"
                  >
                    <TerminalSquare className="h-3.5 w-3.5 text-cyan" aria-hidden="true" />
                    {command}
                  </button>
                ))}
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan">Autofill fix plan</p>
            <h4 className="mt-1 text-base font-semibold text-white">{autofillFixPlan.title}</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => copyText("Fix plan", autofillFixPlan.editablePlan)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:border-cyan/40"
            >
              <Clipboard className="h-3.5 w-3.5" aria-hidden="true" />
              Copy plan
            </button>
            <button
              type="button"
              onClick={() => copyText("Commands", autofillFixPlan.commands.join("\n"))}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:border-cyan/40"
            >
              <TerminalSquare className="h-3.5 w-3.5" aria-hidden="true" />
              Copy commands
            </button>
          </div>
        </div>
        <textarea
          value={autofillFixPlan.editablePlan}
          onChange={(event) => updateEditablePlan(event.target.value)}
          aria-label="Editable autofill fix plan"
          className="mt-4 min-h-[220px] w-full rounded-xl border border-white/10 bg-slate-950/80 p-4 font-mono text-sm leading-6 text-slate-100 outline-none transition focus:border-cyan/60 focus:ring-2 focus:ring-cyan/30"
        />
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400" aria-live="polite">
          <CheckCircle2 className="h-3.5 w-3.5 text-cyan" aria-hidden="true" />
          {selectedSuggestions.length} selected solution(s) will be added to the exported report.
          {copyState ? <span className="rounded-full border border-cyan/35 bg-cyan/10 px-2 py-1 text-cyan">{copyState}</span> : null}
        </div>
      </div>
    </section>
  );
}
