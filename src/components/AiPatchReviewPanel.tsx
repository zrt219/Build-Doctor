import { AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";
import type { CachedProviderReview, Diagnosis } from "@/lib/schemas";
import { InfoTip } from "./InfoTip";

const providerStatusLabels: Record<string, string> = {
  openrouter_success: "DeepSeek review added.",
  free_model_rate_limited: "DeepSeek free review is currently rate-limited. The deterministic diagnosis, trace, patch draft, and report export are still available.",
  free_model_unavailable: "DeepSeek free review is unavailable. The deterministic diagnosis is still available.",
  llm_json_parse_failed: "DeepSeek returned invalid JSON. The deterministic diagnosis is still available.",
  llm_schema_validation_failed: "DeepSeek response failed validation. The deterministic diagnosis is still available.",
  unsafe_paid_model_blocked: "Paid model blocked by safety settings.",
  unsupported_model: "Only deepseek/deepseek-v4-flash:free is allowed in this demo.",
  disabled: "Live LLM review is disabled. Build Doctor is running in deterministic mode.",
};

export function AiPatchReviewPanel({
  diagnosis,
  loading,
  message,
  providerStatus,
  cachedProviderReview,
  onReview,
}: {
  diagnosis: Diagnosis;
  loading: boolean;
  message: string;
  providerStatus?: string;
  cachedProviderReview?: CachedProviderReview | null;
  onReview: () => void;
}) {
  const review = diagnosis.aiPatchReview;
  const visibleStatus = review ? "openrouter_success" : providerStatus;
  const isRateLimited = visibleStatus === "free_model_rate_limited";
  const reviewStatusLabel = review ? "Complete" : isRateLimited ? "Rate-limited" : visibleStatus ? "Did not run" : "Not run";
  const reviewStatusTone = review ? "border-cyan/45 bg-cyan/10 text-cyan" : isRateLimited ? "border-dashed border-gold/70 bg-gold/10 text-gold" : "border-dashed border-white/20 bg-white/[0.035] text-slate-300";

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Live DeepSeek review{" "}
            <InfoTip label="DeepSeek review">Build Doctor can optionally send the sanitized diagnosis to DeepSeek through OpenRouter. DeepSeek reviews the explanation only; the deterministic diagnosis remains the source of truth.</InfoTip>
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
            Build Doctor can optionally send the sanitized diagnosis to DeepSeek through OpenRouter for a second-pass explanation review. The local diagnosis remains the source of truth.
          </p>
        </div>
        <button
          type="button"
          onClick={onReview}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-cyan/60 bg-cyan/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-cyan/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          {loading ? "Reviewing" : "Run DeepSeek Review"}
        </button>
      </div>

      {review ? (
        <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-cyan/35 bg-cyan/10 p-4">
            <div className="flex items-center gap-2 text-cyan">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              <p className="text-xs font-semibold uppercase tracking-[0.16em]">DeepSeek review added</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-100">{review.summary}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.14em] text-slate-300">
              {review.provider} / {review.model} / sanitized input only
            </p>
            <p className="mt-2 inline-flex rounded-full border border-cyan/45 bg-cyan/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan">
              Provider status: {visibleStatus}
            </p>
            <div className="mt-4 flex flex-wrap gap-2" aria-label="Provider review status">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan/45 bg-cyan/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                Core diagnosis: Complete
              </span>
              <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${reviewStatusTone}`}>
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                DeepSeek review: {reviewStatusLabel}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan/45 bg-cyan/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                Report export: Available
              </span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan">Patch review</p>
            <p className="mt-3 text-sm leading-6 text-slate-200">{review.patchReview}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-gold">Cautions</p>
            <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-300">
              {review.cautions.map((caution) => (
                <li key={caution}>- {caution}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-gold/50 bg-gold/5 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 text-gold" aria-hidden="true" />
            <div>
              <h4 className="text-base font-semibold text-white">
                {isRateLimited ? "DeepSeek free review is rate-limited" : "Optional review did not run"}
              </h4>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {isRateLimited
                  ? providerStatusLabels.free_model_rate_limited
                  : message || (visibleStatus ? providerStatusLabels[visibleStatus] : "Live LLM review has not run. The deterministic diagnosis, trace, patch draft, and export still work without it.")}
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2" aria-label="Provider fallback status">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan/45 bg-cyan/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              Core diagnosis: Complete
            </span>
            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${reviewStatusTone}`}>
              <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
              DeepSeek review: {reviewStatusLabel}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan/45 bg-cyan/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              Report export: Available
            </span>
            {visibleStatus ? (
              <span className="inline-flex rounded-full border border-dashed border-gold/60 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
                Provider status: {visibleStatus}
              </span>
            ) : null}
          </div>
          {isRateLimited && cachedProviderReview ? (
            <div className="mt-4 grid gap-4 rounded-2xl border border-cyan/25 bg-slate-950/35 p-4 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-base font-semibold text-white">Cached DeepSeek demo review</p>
                  <span className="inline-flex rounded-full border border-dashed border-gold/70 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
                    Cached provider review example, not live output
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Live DeepSeek review is currently rate-limited. This cached example shows the expected review format.
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-100">{cachedProviderReview.summary}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
                  Demo fixture / {diagnosis.failureType} / not live output
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan">Example patch review</p>
                <p className="mt-3 text-sm leading-6 text-slate-200">{cachedProviderReview.patchReview}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-gold">Cautions</p>
                <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-300">
                  {cachedProviderReview.cautions.map((caution) => (
                    <li key={caution}>- {caution}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
