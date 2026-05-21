# ZRT Vercel AI Systems Suite

The production root route is now the connected suite hub for four separate Vercel AI portfolio apps:

- Vercel Build Doctor Agent: `/build-doctor`
- Enterprise Agent Workflow Studio: `https://enterprise-agent-workflow-studio.vercel.app`
- AI Gateway Failover Playground: `https://ai-gateway-failover-playground.vercel.app`
- Resume Evidence RAG Auditor: `https://resume-evidence-rag-auditor.vercel.app`

Every app keeps GitHub as the first proof link: `https://github.com/zrt219`.

# Vercel Build Doctor Agent

## What It Does

Vercel Build Doctor Agent is a Next.js/TypeScript debugging assistant for failed Vercel and Next.js builds. A developer pastes a failing build log, and the app redacts secrets, classifies the failure, extracts evidence, proposes fixes, generates verification commands, and exports a markdown incident report.

## Why I Built It

This project is a recruiter-facing AI engineering case study for applied developer tooling. It demonstrates agentic diagnosis workflow design, structured outputs, deterministic fallback behavior, safety-first log handling, and eval discipline without requiring paid model access.

## Target Roles

- OpenAI Codex / coding agents
- Vercel Agent / AI SDK / AI Gateway
- Anthropic Applied AI
- Grafana AI/Ops and observability
- Cohere agentic workflows
- AI product engineering and developer tooling

## Architecture

```txt
Log input
  -> redactSecrets()
  -> parseBuildLog()
  -> taxonomy + fix recipes
  -> structured Diagnosis JSON
  -> incident report + eval harness
```

Primary modules:

- `src/lib/redact-secrets.ts` redacts API keys, tokens, database URLs, bearer tokens, private keys, and `.env` values.
- `src/lib/log-parser.ts` performs deterministic classification and evidence extraction.
- `src/lib/failure-taxonomy.ts` defines supported failure classes, symptoms, likely causes, fixes, verification commands, and prevention checks.
- `src/lib/build-doctor.ts` orchestrates diagnosis, report generation, and eval scoring.

## Agent Workflow

1. Ingest build log.
2. Redact secrets before display, reporting, or optional AI calls.
3. Classify the first strong failure signal.
4. Extract evidence lines, file paths, warnings, and subsystem.
5. Map failure type to likely root cause and fix recipe.
6. Generate patch checklist and verification commands.
7. Generate a deployment readiness report.

## Failure Taxonomy

Supported failure types:

- `MISSING_ENV_VAR`
- `TYPESCRIPT_ERROR`
- `MODULE_NOT_FOUND`
- `NEXT_BUILD_ERROR`
- `PACKAGE_INSTALL_ERROR`
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

## Security / Redaction

The app never requires a real Vercel token and does not call Vercel APIs by default. Raw secrets are redacted before diagnosis and before incident report generation. Demo data is clearly marked as simulated.

Redaction labels:

- `[REDACTED_API_KEY]`
- `[REDACTED_TOKEN]`
- `[REDACTED_DATABASE_URL]`
- `[REDACTED_SECRET]`
- `[REDACTED_ENV_VALUE]`

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
- `/api/health`, `/api/eval`, `/api/diagnose`, `/api/report`

## Environment Variables

The deterministic demo works with no provider keys. Optional keys can be added later through Vercel project settings:

```txt
OPENAI_API_KEY=
AI_GATEWAY_API_KEY=
BUILD_DOCTOR_MODEL=
```

## Deploy to Vercel

```powershell
npm install
npm run test
npm run build
vercel --prod
```

No `.env` file should be committed.

## Known Limitations

- Current diagnosis is deterministic and local; it is not claiming live Vercel project introspection.
- Optional LLM enhancement is intentionally deferred until provider credentials are configured.
- The parser covers common Vercel/Next.js failure modes and should be extended with real incident logs over time.

## Screenshots

Add screenshots after a verified visual QA pass:

- Main diagnosis screen
- Generated incident report
- Case study eval section

## Resume Bullet

- Built Vercel Build Doctor Agent, a Next.js/TypeScript AI debugging assistant that ingests failed build logs, classifies deployment failures, redacts secrets, generates structured root-cause reports, and includes an eval harness for diagnosis accuracy and safety.
