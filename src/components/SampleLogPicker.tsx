"use client";

import { useMemo, useState } from "react";
import { taxonomyById } from "@/lib/failure-taxonomy";
import { sampleLogs } from "@/lib/sample-logs";
import type { FailureType } from "@/lib/schemas";
import { InfoTip } from "./InfoTip";

type ScenarioCategory = "All" | "Env" | "TypeScript" | "Package" | "Vercel" | "Framework" | "Security";

const categoryFilters: ScenarioCategory[] = ["All", "Env", "TypeScript", "Package", "Vercel", "Framework", "Security"];

const scenarioCategoryByFailure: Record<FailureType, Exclude<ScenarioCategory, "All">> = {
  MISSING_ENV_VAR: "Env",
  SUPABASE_CONFIG_ERROR: "Env",
  STRIPE_WEBHOOK_ERROR: "Security",
  PRISMA_DATABASE_ERROR: "Env",
  VERCEL_ENV_VAR_MISSING: "Env",
  TYPESCRIPT_ERROR: "TypeScript",
  MODULE_NOT_FOUND: "Package",
  PACKAGE_INSTALL_ERROR: "Package",
  PACKAGE_JSON_PARSE: "Package",
  PNPM_LOCKFILE_MISMATCH: "Package",
  SPAWN_PERMISSION: "Package",
  OUT_OF_MEMORY: "Vercel",
  SERVERLESS_FUNCTION_LIMIT: "Vercel",
  VERCEL_RUNTIME_ERROR: "Vercel",
  NEXT_BUILD_ERROR: "Framework",
  NEXT_STATIC_GENERATION_ERROR: "Framework",
  APP_ROUTER_ROUTE_HANDLER_ERROR: "Framework",
  ESLINT_BUILD_ERROR: "Framework",
  VITE_BUILD_ERROR: "Framework",
  UNKNOWN: "Framework",
};

export function SampleLogPicker({ activeId, onPick }: { activeId: string; onPick: (id: string) => void }) {
  const [activeCategory, setActiveCategory] = useState<ScenarioCategory>("All");
  const visibleSamples = useMemo(
    () => sampleLogs.filter((sample) => activeCategory === "All" || scenarioCategoryByFailure[sample.expected] === activeCategory),
    [activeCategory],
  );

  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
          Sample build scenarios{" "}
          <InfoTip label="Sample log">Controlled sample error logs used to demonstrate the tool without exposing a real project.</InfoTip>
        </p>
        <div className="flex flex-wrap gap-2" aria-label="Sample scenario filters">
          {categoryFilters.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
              className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] transition ${
                activeCategory === category
                  ? "border-cyan/70 bg-cyan/15 text-white shadow-[inset_0_2px_0_rgba(109,216,255,0.85)]"
                  : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/30 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      {visibleSamples.length ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {visibleSamples.map((sample, index) => {
            const recipe = taxonomyById[sample.expected];
            const category = scenarioCategoryByFailure[sample.expected];
            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => onPick(sample.id)}
                aria-pressed={activeId === sample.id}
                className={`rounded-xl border px-3 py-3 text-left transition ${
                  activeId === sample.id
                    ? "border-cyan/70 bg-cyan/10 shadow-[inset_0_3px_0_rgba(109,216,255,0.85),0_14px_40px_rgba(109,216,255,0.08)]"
                    : "border-white/10 bg-white/[0.055] hover:border-white/30 hover:bg-white/[0.075]"
                }`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="min-w-0">
                    <span className="mr-2 font-mono text-xs text-gold">{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-sm font-semibold text-white">{sample.title}</span>
                  </span>
                  {activeId === sample.id ? <span className="rounded-full border border-cyan/50 bg-cyan/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan">Selected</span> : null}
                </span>
                <span className="mt-3 block text-sm leading-5 text-slate-300">{recipe.label}</span>
                <span className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-black/25 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-300">{category}</span>
                  <span className="rounded-full border border-white/10 bg-black/25 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">{sample.expected}</span>
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.025] p-5 text-sm text-slate-300">
          No scenarios in this category.
        </div>
      )}
    </section>
  );
}
