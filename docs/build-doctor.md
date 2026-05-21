# Build Doctor

Build Doctor is a developer tool that helps diagnose failed Next.js/Vercel builds. A deterministic engine reads pasted build logs, removes secrets, identifies the likely root cause, shows the evidence trail, suggests a safe patch draft, and exports a markdown incident report. An optional DeepSeek review through OpenRouter can improve the explanation, but the local diagnosis remains the source of truth.

1. Paste build logs.
2. Diagnose root cause.
3. Show diagnostic trace.
4. Suggest patch draft.
5. Export incident report.

## Deterministic Engine

`/api/diagnose` runs only the local deterministic engine. It redacts secrets, classifies the sanitized log against the local taxonomy, extracts evidence, creates trace steps, maps the failure to a patch template, and returns an expanded `Diagnosis`.

OpenRouter is never used as the primary classifier.

## How It Works

Build Doctor does not send raw logs directly to a model. It first redacts secrets, classifies the failure with deterministic rules, extracts evidence from the log, maps the failure to a patch template, and prepares an exportable report.

When live LLM review is enabled, only the sanitized diagnosis object is sent to DeepSeek through OpenRouter. If the model is rate-limited, unavailable, or returns invalid JSON, Build Doctor keeps the deterministic diagnosis and shows a safe provider status.

## Architecture

Build Doctor is built as a deterministic-first AI developer tool. The local engine owns the root-cause classification, evidence extraction, trace generation, patch draft, and report export. The LLM provider is isolated behind an optional enrichment layer.

This design avoids hallucination-first debugging. The model can improve wording and review the patch explanation, but it cannot replace the deterministic diagnosis or invent repository changes.

## Live DeepSeek Mode

Build Doctor can optionally call DeepSeek through OpenRouter using:

```txt
deepseek/deepseek-v4-flash:free
```

This is used only for AI patch review. The deterministic diagnosis remains the source of truth.

DeepSeek free mode uses plain JSON prompting instead of strict schema mode. The app extracts JSON, validates it with Zod, and fails closed if the response is invalid.

No paid models are allowed unless `ALLOW_PAID_LLM_MODELS=true`.

`/api/enrich` adds the optional DeepSeek review of the sanitized diagnosis through OpenRouter. DeepSeek reviews the explanation only; it cannot override the deterministic root-cause diagnosis or patch draft. It requires:

```txt
ENABLE_LLM_ENRICHMENT=true
LLM_PROVIDER=openrouter
OPENROUTER_API_KEY=
OPENROUTER_MODEL=deepseek/deepseek-v4-flash:free
OPENROUTER_SITE_URL=http://localhost:3000
OPENROUTER_APP_TITLE=Build Doctor
ALLOW_PAID_LLM_MODELS=false
```

Default model: `deepseek/deepseek-v4-flash:free`. Do not use `openrouter/free` or `openrouter/auto` because router selection and free-model rate limits are unstable for deterministic testing. Paid models are blocked unless `ALLOW_PAID_LLM_MODELS=true`.

Build Doctor does not use a router or fallback model list for the live demo. `openrouter/free`, `openrouter/auto`, paid models, and non-DeepSeek model IDs are rejected before any external call. DeepSeek free mode uses plain JSON prompting instead of strict `response_format`. Output is parsed and validated with Zod. Invalid output fails closed and does not affect deterministic diagnosis.

If enrichment is disabled, missing provider config, rate-limited, unavailable, or returns malformed JSON, Build Doctor fails closed and keeps the deterministic diagnosis usable.

Do not commit provider keys. Store local keys in `.env.local` and production keys in Vercel Project Settings. If a key is pasted into chat, logs, screenshots, or source control, rotate it.

## Security Model

Raw logs are redacted before classification, trace generation, patch drafting, report export, and optional OpenRouter calls.

Redaction covers API keys, bearer tokens, private keys, database URLs, Stripe keys, OpenRouter keys, Supabase keys, Vercel tokens, GitHub tokens, JWTs, auth headers, cookies, `.env` assignments, connection strings, and password-looking pairs.

OpenRouter receives only sanitized diagnosis JSON. The UI and markdown report do not expose raw secrets or private model reasoning.

Build Doctor blocks paid models by default, rejects unsafe router settings, validates model output with Zod, and fails closed when provider output is invalid.

No patch is applied automatically. The patch draft is a review aid, not an automated code change.

## Provider Failure Handling

DeepSeek review is optional. The deterministic diagnosis, evidence trail, local trace, patch draft, and report export do not depend on provider availability.

Free OpenRouter models may be rate-limited during live demos. When this happens, `/api/enrich` returns an explicit provider status such as `free_model_rate_limited` instead of treating the whole app as failed.

The UI surfaces the provider status as intentional fallback behavior: the core diagnosis remains complete, the DeepSeek free provider is rate-limited, optional review did not run, and report export remains available.

For employer-facing demos, the UI may show a clearly labeled cached DeepSeek demo review when `providerStatus=free_model_rate_limited`. This cached panel is fixture-based, marked as `Cached provider review example, not live output`, and exists only to show the expected review format when the free provider is unavailable. It does not replace the deterministic diagnosis and is never described as live provider output.

The exported report records the provider status. If a cached demo review is included, the report labels it as `Cached provider review example, not live output`.

## Reports

`/api/report` exports deterministic markdown with stable sections:

```md
# Build Doctor Incident Report
## Summary
## Root Cause
## Evidence
## Diagnostic Trace
## Patch Draft
## Optional LLM Review
## Verification Commands
## Remaining Risks
## Export Metadata
```

`AI Patch Review` appears only when optional enrichment has succeeded.

## API Contract Snapshot

- `/api/diagnose` returns deterministic diagnosis, redaction metadata, trace steps, local graph metadata, patch draft, verification commands, and readiness status.
- `/api/report` returns stable markdown and does not require provider configuration.
- `/api/enrich` returns `aiPatchReview: null` with a user-safe `error` and `providerStatus` unless strict OpenRouter guards pass and DeepSeek returns valid, schema-safe JSON.
- All provider review is sanitized-only and advisory.

## Local Commands

```powershell
npm run dev
npm run test
npm run test:e2e
npm run test:all
npm run build
npm run audit:45k
npm run audit:security
npm run audit:report
```

## Vercel Deployment Notes

The deterministic tool deploys without provider keys. Configure OpenRouter environment variables in Vercel Project Settings only if optional DeepSeek review should be enabled. Never commit real keys.

Required Vercel-safe defaults:

```txt
ENABLE_LLM_ENRICHMENT=false
LLM_PROVIDER=mock
OPENROUTER_API_KEY=
OPENROUTER_MODEL=deepseek/deepseek-v4-flash:free
OPENROUTER_SITE_URL=http://localhost:3000
OPENROUTER_APP_TITLE=Build Doctor
ALLOW_PAID_LLM_MODELS=false
```

## Known Limitations

- Patch drafts are deterministic templates, not repo-aware generated diffs.
- `UNKNOWN` failures intentionally return conservative guidance instead of invented code changes.
- DeepSeek review is advisory and cannot replace the local classifier.
- GitHub/Vercel/Supabase ingestion remains paste-only or deterministic fallback unless separately configured.
