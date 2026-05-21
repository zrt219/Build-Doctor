# ZRT Vercel AI Systems Suite

The production root route is now the connected suite hub for four separate Vercel AI portfolio apps:

- Vercel Build Doctor Agent: `/build-doctor`
- Enterprise Agent Workflow Studio: `https://enterprise-agent-workflow-studio.vercel.app`
- AI Gateway Failover Playground: `https://ai-gateway-failover-playground.vercel.app`
- Resume Evidence RAG Auditor: `https://resume-evidence-rag-auditor.vercel.app`

Every app keeps GitHub as the first proof link: `https://github.com/zrt219`.

Reviewer packet: `REVIEWER_PACKET.md`.

Integration proof routes:

- `/api/integration-health`
- `https://enterprise-agent-workflow-studio.vercel.app/api/integration-health`
- `https://ai-gateway-failover-playground.vercel.app/api/integration-health`
- `https://resume-evidence-rag-auditor.vercel.app/api/integration-health`

# Vercel Build Doctor Agent

## What It Does

Build Doctor is a developer tool that helps diagnose failed Next.js/Vercel builds. A deterministic engine reads pasted build logs, removes secrets, identifies the likely root cause, shows the evidence trail, suggests a safe patch draft, and exports a markdown incident report. An optional DeepSeek review through OpenRouter can improve the explanation, but the local diagnosis remains the source of truth.

Detailed Build Doctor documentation: `docs/build-doctor.md`.

## Why I Built It

This project is a recruiter-facing AI engineering case study for applied developer tooling. It demonstrates deterministic guardrails, optional LLM review, safety-first log handling, report export, and test-covered workflow design without requiring paid model access.

## Target Roles

- OpenAI Codex / coding agents
- Vercel Agent / AI SDK / AI Gateway
- Anthropic Applied AI
- Grafana AI/Ops and observability
- Cohere workflow safety
- AI product engineering and developer tooling

## Architecture

```txt
Log input
  -> redactSecrets()
  -> parseBuildLog()
  -> taxonomy + fix recipes
  -> structured Diagnosis JSON
  -> optional sanitized DeepSeek review
  -> incident report + eval harness
```

Primary modules:

- `src/lib/redact-secrets.ts` redacts API keys, tokens, database URLs, bearer tokens, private keys, and `.env` values.
- `src/lib/log-parser.ts` performs deterministic classification and evidence extraction.
- `src/lib/failure-taxonomy.ts` defines supported failure classes, symptoms, likely causes, fixes, verification commands, and prevention checks.
- `src/lib/build-doctor/` orchestrates diagnosis, optional DeepSeek review, report generation, and eval scoring.

## Developer Workflow

1. Ingest build log.
2. Redact secrets before display, reporting, or optional LLM review.
3. Classify the first strong failure signal.
4. Extract evidence lines, file paths, warnings, and subsystem.
5. Map failure type to likely root cause and fix recipe.
6. Generate deterministic trace steps and a safe patch draft.
7. Optionally request DeepSeek review using sanitized diagnosis only.
8. Generate a markdown incident report.

## Failure Taxonomy

Supported failure types:

- `MISSING_ENV_VAR`
- `TYPESCRIPT_ERROR`
- `MODULE_NOT_FOUND`
- `NEXT_BUILD_ERROR`
- `PACKAGE_INSTALL_ERROR`
- `PACKAGE_JSON_PARSE`
- `SPAWN_PERMISSION`
- `PRISMA_DATABASE_ERROR`
- `SUPABASE_CONFIG_ERROR`
- `STRIPE_WEBHOOK_ERROR`
- `VERCEL_RUNTIME_ERROR`
- `OUT_OF_MEMORY`
- `UNKNOWN`

## Eval Harness

`/api/eval` runs eight deterministic fixture cases:

1. Missing `NEXT_PUBLIC_SUPABASE_URL`
2. TypeScript property does not exist
3. Module not found
4. Stripe webhook secret missing
5. Prisma `DATABASE_URL` invalid
6. Next.js dynamic server usage error
7. Vercel timeout / memory issue
8. npm dependency conflict

The scoring system marks cases as `PASS`, `PARTIAL`, or `FAIL` based on category correctness, evidence extraction, fix relevance, and redaction safety.

## Premium Audit Harness

The root project includes a generated Vitest audit harness for reviewer handoff:

```powershell
npm run audit:45k
npm run audit:security
npm run audit:report
```

`npm run audit:45k` runs exactly 45,000 deterministic checks across Build Doctor, AI Gateway, Enterprise Studio, Resume Auditor, cross-suite API contracts, and security payloads. Outputs are written to `audit-results/` and `SECURITY_AUDIT_HANDOFF.md`.

## Security / Redaction

The app never requires a real Vercel token and does not call Vercel APIs by default. Raw secrets are redacted before diagnosis and before incident report generation. Demo data is clearly marked as simulated.

Redaction labels:

- `[REDACTED_API_KEY]`
- `[REDACTED_TOKEN]`
- `[REDACTED_DATABASE_URL]`
- `[REDACTED_SECRET]`
- `[REDACTED_ENV_VALUE]`

DeepSeek review through OpenRouter is optional and server-side. It receives sanitized diagnosis JSON only, never raw logs, and it does not replace the deterministic classifier. No patch is applied automatically; the patch draft is a review aid.

## Local Development

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`.

Routes:

- `/` suite command center
- `/build-doctor` Build Doctor demo tool
- `/case-study` Build Doctor recruiter-facing case study
- `/api/health`, `/api/eval`, `/api/diagnose`, `/api/enrich`, `/api/report`

## Environment Variables

The deterministic demo works with no provider keys. Optional keys can be added later through Vercel project settings:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Build Doctor optional DeepSeek review through OpenRouter also supports:

```txt
OPENROUTER_API_KEY=
OPENROUTER_MODEL=deepseek/deepseek-v4-flash:free
OPENROUTER_SITE_URL=http://localhost:3000
OPENROUTER_APP_TITLE=Build Doctor
ALLOW_PAID_LLM_MODELS=false
```

Default Build Doctor model: `deepseek/deepseek-v4-flash:free`. Paid models, `openrouter/free`, `openrouter/auto`, and non-DeepSeek model IDs are blocked by default for Build Doctor enrichment. DeepSeek free uses plain JSON prompting; output is parsed and Zod-validated before it is shown.

## Deploy to Vercel

```powershell
npm install
npm run test
npm run test:e2e
npm run test:all
npm run audit:45k
npm run build
vercel --prod
```

No `.env` file should be committed.

## Known Limitations

- Current diagnosis is deterministic and local; it is not claiming live Vercel project introspection.
- Optional DeepSeek review is advisory and only runs when provider credentials are configured.
- The parser covers common Vercel/Next.js failure modes and should be extended with real incident logs over time.

## Screenshots

Screenshots are stored under `screenshots/` after the final visual QA pass:

- `screenshots/suite-hub.png`
- `screenshots/build-doctor.png`
- `screenshots/ai-gateway.png`
- `screenshots/enterprise-studio.png`
- `screenshots/resume-auditor.png`

## Resume Bullet

- Built Build Doctor, a Vercel-deployed AI developer tool that diagnoses failed Next.js/Vercel build logs through a deterministic taxonomy, redacts secrets, generates traceable root-cause receipts, suggests safe patch drafts, optionally enriches explanations through DeepSeek via OpenRouter, and validates reliability with unit and browser tests.
