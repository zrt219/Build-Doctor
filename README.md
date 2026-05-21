![Build Doctor Fuji banner](assets/build-doctor-readme/fuji-banner.png)

# Build Doctor

Build Doctor is a Vercel-deployed developer tool that turns failed Next.js and Vercel build logs into a traceable root-cause diagnosis, safe patch draft, optional DeepSeek review, and exportable markdown incident report.

The deterministic engine is the source of truth. Optional LLM review is isolated behind a fail-closed enrichment layer and only receives sanitized diagnosis data.

## Live Links

- Production app: [https://vercel-build-doctor-agent.vercel.app](https://vercel-build-doctor-agent.vercel.app)
- Build Doctor: [https://vercel-build-doctor-agent.vercel.app/build-doctor](https://vercel-build-doctor-agent.vercel.app/build-doctor)
- Case study: [https://vercel-build-doctor-agent.vercel.app/case-study](https://vercel-build-doctor-agent.vercel.app/case-study)
- Reviewer packet: [`REVIEWER_PACKET.md`](REVIEWER_PACKET.md)
- Engineering log: [`ai-engineering/daily-engineering-log.md`](ai-engineering/daily-engineering-log.md)
- Build Doctor docs: [`docs/build-doctor.md`](docs/build-doctor.md)
- Release evidence: [`docs/build-doctor-release-evidence.md`](docs/build-doctor-release-evidence.md)

## What It Does

Build Doctor supports a five-step workflow:

1. Paste build logs
2. Diagnose root cause
3. Show local trace
4. Suggest patch draft
5. Export report

The app:

- Redacts secrets before display, reporting, or optional provider review.
- Classifies the likely failure with deterministic rules.
- Extracts evidence lines and affected subsystem signals.
- Builds a local diagnostic trace and safe patch draft.
- Offers deterministic suggested solutions and an editable fix plan.
- Optionally requests a DeepSeek review through OpenRouter using sanitized diagnosis JSON only.
- Exports a markdown incident report with evidence and remaining risks.

## Core Product Positioning

Build Doctor is not a hallucination-first debugging agent.

The local pipeline owns:

- redaction
- failure classification
- evidence extraction
- diagnostic trace
- patch draft
- suggested solutions
- markdown export

The optional DeepSeek layer can improve the explanation, but it does not replace deterministic diagnosis and it does not apply code changes.

## Architecture

```txt
Build log input
  -> redact secrets
  -> classify failure
  -> extract evidence
  -> map remediation
  -> build patch draft
  -> build suggested solutions
  -> export markdown report
  -> optional sanitized DeepSeek review
```

![Build Doctor Fuji dashboard](assets/build-doctor-readme/fuji-dashboard.png)

Primary implementation areas:

- `src/lib/redact-secrets.ts`
- `src/lib/log-parser.ts`
- `src/lib/failure-taxonomy.ts`
- `src/lib/patch-recipes.ts`
- `src/lib/build-doctor/index.ts`
- `src/lib/build-doctor/openrouter.ts`
- `src/lib/build-doctor/llm/openrouter-deepseek.ts`
- `src/lib/build-doctor/solution-suggestions.ts`
- `src/app/api/diagnose/route.ts`
- `src/app/api/enrich/route.ts`
- `src/app/api/report/route.ts`

## Failure Coverage

Current deterministic taxonomy includes:

- `MISSING_ENV_VAR`
- `TYPESCRIPT_ERROR`
- `MODULE_NOT_FOUND`
- `NEXT_BUILD_ERROR`
- `NEXT_STATIC_GENERATION_ERROR`
- `APP_ROUTER_ROUTE_HANDLER_ERROR`
- `PACKAGE_INSTALL_ERROR`
- `PACKAGE_JSON_PARSE`
- `PNPM_LOCKFILE_MISMATCH`
- `SPAWN_PERMISSION`
- `PRISMA_DATABASE_ERROR`
- `SUPABASE_CONFIG_ERROR`
- `STRIPE_WEBHOOK_ERROR`
- `VERCEL_ENV_VAR_MISSING`
- `VERCEL_RUNTIME_ERROR`
- `SERVERLESS_FUNCTION_LIMIT`
- `OUT_OF_MEMORY`
- `ESLINT_BUILD_ERROR`
- `VITE_BUILD_ERROR`
- `UNKNOWN`

## Optional DeepSeek Review

OpenRouter enrichment is optional and guarded.

Current live model target:

- `deepseek/deepseek-v4-flash:free`

Safety rules:

- paid models are blocked by default
- `openrouter/free` is blocked
- `openrouter/auto` is blocked
- raw logs are not sent to the provider
- secrets are not sent to the provider
- plain JSON output is parsed and Zod-validated
- invalid provider output fails closed
- deterministic diagnosis remains available when provider review fails

## Suggested Solutions

Step 4 includes deterministic suggested solutions for major failure classes.

The user can:

- review solution cards
- inspect likely affected files
- copy snippets
- copy verification commands
- autofill an editable fix plan
- include selected solutions in the exported report

These suggestions do not auto-apply patches and do not require a model provider.

## Security Model

Security controls currently verified in the repo:

- secret redaction before UI output
- secret redaction before report export
- secret redaction before optional provider review
- no paid-model fallback by default
- read-only `GET /api/integration-health`
- public integration-health write probes removed
- `.vercelignore` excludes local `.env`, `.omx`, `.next`, `node_modules`, and test artifacts from deployment upload
- Vercel production env vars are configured as encrypted project variables

Supabase status:

- project: `gajpnqqfkjtmqdnufbcf`
- evidence tables present: `suite_events`, `demo_runs`, `eval_runs`, `exported_reports`
- probe-like rows cleaned from `suite_events`

## Verification

Latest verified release checks:

- `npm run typecheck`
- `npm run test`
- `npm run build`
- `npm run test:e2e`
- `npm audit --audit-level=moderate`
- `npm run audit:security`
- `npm run audit:45k`
- `npm run audit:report`

Latest verified results:

- unit tests: `25` passing
- E2E tests: `4` passing
- npm audit: `0 vulnerabilities`
- security audit: `4,000 / 4,000`
- premium audit: `45,000 / 45,000`

Generated audit artifacts:

- [`audit-results/summary.json`](audit-results/summary.json)
- [`audit-results/security-summary.json`](audit-results/security-summary.json)

## Engineering Log

The repo includes a running verified engineering log:

- [`ai-engineering/daily-engineering-log.md`](ai-engineering/daily-engineering-log.md)

Use it as the canonical proof trail for:

- shipped changes
- verification commands
- deployment evidence
- resume-safe summaries

Recent verified themes from the log:

- deterministic Build Doctor architecture and failure taxonomy expansion
- DeepSeek free OpenRouter integration with fail-closed guards
- employer-facing UI and report copy polish
- deterministic suggested solutions and editable fix plans
- Supabase readiness verification and probe cleanup
- release hardening, dependency vulnerability remediation, Vercel deployment hardening, and GitHub publication

## Repo Structure

Key paths:

- `src/app/build-doctor` UI routes and page entry points
- `src/components/` Build Doctor UI components
- `src/lib/build-doctor/` diagnosis and provider orchestration
- `src/test/build-doctor.test.ts` deterministic unit coverage
- `e2e/build-doctor.spec.ts` Playwright browser coverage
- `docs/` deeper product and release documentation
- `screenshots/` visual QA evidence
- `ai-engineering/` verified engineering log

## Local Development

```powershell
npm install
npm run dev
```

Open:

- `http://localhost:3000/`
- `http://localhost:3000/build-doctor`

Useful commands:

```powershell
npm run typecheck
npm run test
npm run build
npm run test:e2e
npm run audit:security
npm run audit:45k
npm run audit:report
```

## Environment

Deterministic mode works without paid provider access.

See:

- [`.env.example`](.env.example)

Important variables:

```txt
ENABLE_LLM_ENRICHMENT=false
LLM_PROVIDER=mock
OPENROUTER_API_KEY=
OPENROUTER_MODEL=deepseek/deepseek-v4-flash:free
OPENROUTER_SITE_URL=http://localhost:3000
OPENROUTER_APP_TITLE=Build Doctor
ALLOW_PAID_LLM_MODELS=false
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Deployment

Production deploy target:

- [https://vercel-build-doctor-agent.vercel.app](https://vercel-build-doctor-agent.vercel.app)

Latest verified production deployment:

- deployment id: `dpl_251nHCbKjvck2zthFXunuCcTEG2p`

GitHub repository:

- [https://github.com/zrt219/Build-Doctor](https://github.com/zrt219/Build-Doctor)

Latest release commits:

- `9160af1` `Harden Vercel deployment inputs`
- `df04d48` `Document Build Doctor release evidence`
- `cfb9b52` `Release Build Doctor security hardening`

## Screenshots

Selected visual evidence:

- `screenshots/build-doctor-final-desktop.png`
- `screenshots/build-doctor-final-mobile.png`
- `screenshots/build-doctor-final-diagnosed.png`
- `screenshots/build-doctor-suggested-solutions.png`

## Limitations

- Diagnosis is deterministic and log-based, not live repo introspection.
- Optional provider review can be rate-limited.
- Suggested solutions are template-driven and should be reviewed by a developer before code changes.
- This is a reviewer-facing engineering product, not a multi-tenant SaaS platform.

## Resume-Safe Summary

- Built Build Doctor, a Vercel-deployed developer tool that diagnoses failed Next.js and Vercel build logs through a deterministic taxonomy, redacts secrets, generates traceable root-cause receipts, suggests safe patch drafts and deterministic remediation plans, optionally enriches explanations through DeepSeek via OpenRouter, and validates reliability with unit, browser, and audit coverage.
