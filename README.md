![Build Doctor Fuji banner](assets/build-doctor-readme/fuji-banner.png)

# Zhane's Portfolio Vercel / Build Doctor

Zhane's Portfolio Vercel is the public command center for Zhane Grey's Vercel-hosted AI engineering portfolio. The hub keeps Build Doctor as the flagship deploy-debugging tool while linking the broader portfolio surface: resume tailoring, evidence dashboards, gateway failover, enterprise agent workflows, RAG/digital twin systems, visual systems, DatumX, and supporting Vercel demos.

Build Doctor is a Vercel-deployed developer tool that turns failed Next.js and Vercel build logs into a traceable root-cause diagnosis, safe patch draft, optional DeepSeek review, and exportable markdown incident report.

The deterministic engine is the source of truth. Optional LLM review is isolated behind a fail-closed enrichment layer and only receives sanitized diagnosis data.

## Live Links

- Portfolio hub: [https://vercel-build-doctor-agent.vercel.app](https://vercel-build-doctor-agent.vercel.app)
- Build Doctor: [https://vercel-build-doctor-agent.vercel.app/build-doctor](https://vercel-build-doctor-agent.vercel.app/build-doctor)
- Case study: [https://vercel-build-doctor-agent.vercel.app/case-study](https://vercel-build-doctor-agent.vercel.app/case-study)
- Reviewer packet: [`REVIEWER_PACKET.md`](REVIEWER_PACKET.md)
- Engineering log: [`ai-engineering/daily-engineering-log.md`](ai-engineering/daily-engineering-log.md)
- Build Doctor docs: [`docs/build-doctor.md`](docs/build-doctor.md)
- Release evidence: [`docs/build-doctor-release-evidence.md`](docs/build-doctor-release-evidence.md)

## Portfolio Vercel Directory

- [Vercel Build Doctor Agent](https://vercel-build-doctor-agent.vercel.app) - [GitHub](https://github.com/zrt219/Build-Doctor)
- [AI Resume Tailor Service](https://ai-resume-tailor-service.vercel.app) - [GitHub](https://github.com/zrt219/AI-resume-tailor-service-)
- [Zhane Grey Evidence Dashboard](https://zhane-grey-evidence-dashboard.vercel.app) - [GitHub](https://github.com/zrt219/AI-Engineering-Evidence-Engine)
- [AI Gateway Failover Playground](https://ai-gateway-failover-playground.vercel.app) - [GitHub](https://github.com/zrt219/ai-gateway-failover-playground)
- [Enterprise Agent Workflow Studio](https://enterprise-agent-workflow-studio.vercel.app) - [GitHub](https://github.com/zrt219/enterprise-agent-workflow-studio)
- [Agentic RAG Memory Digital Twin Edge System](https://agentic-rag-memory-digital-twin-edg.vercel.app) - [GitHub](https://github.com/zrt219/agentic-rag-memory-digital-twin-edge-system)
- [Fuji by ZRT](https://fuji-byzrt.vercel.app) - [GitHub](https://github.com/zrt219/Fuji)
- [Resume Evidence RAG Auditor](https://resume-evidence-rag-auditor.vercel.app)
- [DatumX](https://datumx.vercel.app) - [GitHub](https://github.com/zrt219/DatumX)
- [Untitled X Nine](https://untitled-x-nine.vercel.app)
- [UI Pi Eight](https://ui-pi-eight.vercel.app)

## Fuji Detail

![Lake Kawaguchiko and Mount Fuji](assets/build-doctor-readme/kawaguchiko-closeup.png)

This close-up frame keeps the README atmospheric without weakening the technical layout.

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

## On-Chain Systems Portfolio

Core XRPL EVM systems plus related public product and AI repositories from the same portfolio.

<table>
  <thead>
    <tr>
      <th>Project</th>
      <th>Description</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="https://github.com/zrt219/Zuc-Mine-Command-Center">ZUC Mine Command Center</a></td>
      <td>On-chain uranium mining operations dashboard with real-time reserve tracking, miner registry, and direct contract interaction through a frontend-only control surface.</td>
      <td><a href="https://zuc-mine-command-center.vercel.app/">Live</a></td>
    </tr>
    <tr>
      <td><a href="https://github.com/zrt219/-U235-Fuel-Cycle-">U235 Fuel Cycle</a></td>
      <td>Deterministic XRPL EVM fuel-cycle pipeline that tracks uranium batches from ore to enriched fuel rod with full on-chain traceability.</td>
      <td><a href="https://u235-fuel-cycle.vercel.app/">Live</a></td>
    </tr>
    <tr>
      <td><a href="https://github.com/zrt219/ISR-Network">ISR Network</a></td>
      <td>In-situ recovery control system with on-chain asset tracking, lifecycle state transitions, and operator-facing industrial simulation.</td>
      <td><a href="https://isr-network.vercel.app/">Live</a></td>
    </tr>
    <tr>
      <td><a href="https://github.com/zrt219/Dark-Matter-Farm">Dark Matter Farm</a></td>
      <td>XRPL EVM staking protocol with three orbit tiers, lock-period yield mechanics, and event-driven reward emissions.</td>
      <td><a href="https://dark-matter-farm.vercel.app/">Live</a></td>
    </tr>
    <tr>
      <td><a href="https://github.com/zrt219/Cohr-Lab">Cohr Lab</a></td>
      <td>Semiconductor laser fabrication lifecycle modeled as an immutable on-chain state machine from crystal growth to final pigtail.</td>
      <td><a href="https://cohr-lab.vercel.app">Live</a></td>
    </tr>
    <tr>
      <td><a href="https://github.com/zrt219/ForgeX">ForgeX</a></td>
      <td>Foundry-powered XRPL EVM deployment console that combines a natural-language UI, Node CLI orchestration, and realtime shader-based visuals.</td>
      <td><a href="https://forgex-theta.vercel.app">Live</a></td>
    </tr>
    <tr>
      <td><a href="https://github.com/zrt219/DatumX">DatumX</a></td>
      <td>Verification protocol for AI-transformed industrial data with deterministic lineage, validator review, and XRPL EVM finalization.</td>
      <td><a href="https://datumx.vercel.app">Live</a></td>
    </tr>
    <tr>
      <td><a href="https://github.com/zrt219/Ethex-Lottery-Game">Ethex Lottery Game</a></td>
      <td>Foundry plus Next.js betting workflow that modernizes the EthexLoto lifecycle for XRPL EVM reviewer-facing execution.</td>
      <td>Public Repo</td>
    </tr>
    <tr>
      <td><a href="https://github.com/zrt219/3DMoonX">3DMoonX</a></td>
      <td>Cinematic lunar industrial-base experience that combines Blender source assets with a React Three Fiber web runtime.</td>
      <td><a href="https://3dmoonx.vercel.app">Live</a></td>
    </tr>
    <tr>
      <td><a href="https://github.com/zrt219/Unknown002">Unknown002</a></td>
      <td>Browser-based 3D engineering viewer for a nuclear-electric propulsion spacecraft concept with staged prompt-pack support.</td>
      <td>Public Repo</td>
    </tr>
    <tr>
      <td><a href="https://github.com/zrt219/AI-Engineering-Evidence-Engine">AI Engineering Evidence Engine</a></td>
      <td>Interactive evidence dashboard that turns local engineering proof into a reviewer-facing systems narrative.</td>
      <td><a href="https://zhane-grey-evidence-dashboard.vercel.app/">Live</a></td>
    </tr>
    <tr>
      <td><a href="https://github.com/zrt219/Build-Doctor">Build Doctor</a></td>
      <td>Codex-style build diagnosis harness for failed Next.js and Vercel builds with deterministic failure analysis.</td>
      <td><a href="https://vercel-build-doctor-agent.vercel.app">Live</a></td>
    </tr>
    <tr>
      <td><a href="https://github.com/zrt219/ai-gateway-failover-playground">AI Gateway Failover Playground</a></td>
      <td>Public-facing sandbox for request routing, provider fallback, and resilient AI gateway behavior.</td>
      <td><a href="https://ai-gateway-failover-playground.vercel.app">Live</a></td>
    </tr>
    <tr>
      <td><a href="https://github.com/zrt219/enterprise-agent-workflow-studio">Enterprise Agent Workflow Studio</a></td>
      <td>Public-facing studio for approval-gated enterprise agent workflows, risk scoring, and audit-oriented design.</td>
      <td><a href="https://enterprise-agent-workflow-studio.vercel.app">Live</a></td>
    </tr>
    <tr>
      <td><a href="https://github.com/zrt219/resume-evidence-rag-auditor">Resume Evidence RAG Auditor</a></td>
      <td>Public-facing proof surface for claim verification, evidence retrieval, and grounded resume bullet generation.</td>
      <td><a href="https://resume-evidence-rag-auditor.vercel.app">Live</a></td>
    </tr>
    <tr>
      <td><a href="https://github.com/zrt219/AI-resume-tailor-service-">AI Resume Tailor Service</a></td>
      <td>Static Vercel-ready application for evidence-backed resume, cover-letter, and job-packet tailoring.</td>
      <td><a href="https://ai-resume-tailor-service.vercel.app">Live</a></td>
    </tr>
    <tr>
      <td><a href="https://github.com/zrt219/Fuji">Fuji</a></td>
      <td>Cinematic Next.js Fuji gallery atlas for portfolio storytelling and visual system design.</td>
      <td><a href="https://fuji-byzrt.vercel.app">Live</a></td>
    </tr>
    <tr>
      <td><a href="https://github.com/zrt219/ai-agents-for-beginners">AI Agents for Beginners</a></td>
      <td>Lesson repository for getting started building AI agents.</td>
      <td>Public Repo</td>
    </tr>
    <tr>
      <td><a href="https://github.com/zrt219/agentic-rag-memory-digital-twin-edge-system">Agentic RAG Memory Digital Twin Edge System</a></td>
      <td>Public-facing landing page for an agentic RAG, memory, and digital-twin edge-system portfolio project.</td>
      <td><a href="https://agentic-rag-memory-digital-twin-edg.vercel.app">Live</a></td>
    </tr>
  </tbody>
</table>

