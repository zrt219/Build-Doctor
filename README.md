![Build Doctor Fuji banner](assets/build-doctor-readme/fuji-banner.png)

# Zhane Grey AI Engineering Mainframe

This repository powers the public Zhane Grey AI Engineering Mainframe and the Build Doctor diagnostic app. It combines a polished systems portfolio with deterministic Vercel/Next.js build diagnostics, evidence-backed workflow metrics, searchable project proof, and public-safe links to related AI, Web3, RAG, eval, and visual systems.

The site is intentionally evidence-bound. Public copy and metrics are sourced from public GitHub metadata, verified demo URLs, deterministic tests, local evidence summaries, and browser QA screenshots. Raw local logs, private paths, secrets, prompt contents, and private repo data are not exposed.

## Live Links

| Surface | URL |
|---|---|
| Portfolio Mainframe | <https://vercel-build-doctor-agent.vercel.app> |
| Build Doctor App | <https://vercel-build-doctor-agent.vercel.app/build-doctor> |
| Case Study | <https://vercel-build-doctor-agent.vercel.app/case-study> |
| GitHub Profile | <https://github.com/zrt219> |
| Evidence Dashboard | <https://zhane-grey-evidence-dashboard.vercel.app> |

## What This Repo Contains

- A Next.js App Router portfolio mainframe with a dark technical command-center UI.
- A live workflow tracker backed by public-safe aggregate evidence summaries.
- Searchable/filterable project directory data for public GitHub and demo surfaces.
- Build Doctor, a deterministic failed-build diagnosis workflow for Vercel and Next.js logs.
- API routes for diagnosis, report generation, optional LLM enrichment, eval fixtures, and integration health.
- Unit, E2E, audit, and browser QA coverage.
- Public-safe evidence summary files under `evidence/public/`.

## Current Mainframe Sections

1. Hero and primary actions
2. Verified stats ribbon
3. Live Workflow Events Tracker
4. Featured proof systems
5. Guided proof path
6. Ralphplan workflow map
7. Searchable project directory
8. AI engineering capability map
9. Evidence and QA ledger
10. Contact

## Evidence Snapshot

Latest public-safe metric snapshot: `2026-05-24`

| Metric | Value | Source Label |
|---|---:|---|
| Workflow events | 1,160,551 | Workflow Events Tracker |
| Daily delta | +24,718 | Workflow Events Tracker |
| Codex sessions | 757 | Daily Evidence Report |
| Unique thread ids | 757 | Daily Evidence Report |
| JSONL files | 757 | Daily Evidence Report |
| Corpus size | 34.1 GB | Workflow Events Tracker |
| Source-code lines | 600,493 | Daily Evidence Report |
| Sessions updated today | 44 | Daily Evidence Report |
| Public GitHub repos scanned | 22 | GitHub Source Memory |
| Foundry projects | 18 | Daily Evidence Report |
| Solidity files | 326 | Daily Evidence Report |
| AI/RAG/agent files | 12,891 | Daily Evidence Report |
| Generated exports | 8 | Daily Evidence Report |

Public-safe evidence files:

- `evidence/public/live-workflow-events-tracker.md`
- `evidence/public/daily-evidence-report-2026-05-24.md`
- `evidence/public/session-index-summary.md`
- `evidence/public/github-profile-source-memory.md`

## Featured Systems

| Project | Focus | Links |
|---|---|---|
| Zhane Grey Evidence Dashboard | Evidence organization, claim grounding, public proof surface | [Demo](https://zhane-grey-evidence-dashboard.vercel.app) / [Repo](https://github.com/zrt219/AI-Engineering-Evidence-Engine) |
| Vercel Build Doctor Agent | Deterministic build-log diagnosis, redaction, report export | [Demo](https://vercel-build-doctor-agent.vercel.app/build-doctor) / [Repo](https://github.com/zrt219/Build-Doctor) |
| AI Resume Tailor Service | Evidence-aware resume and packet generation workflow | [Demo](https://ai-resume-tailor-service.vercel.app) / [Repo](https://github.com/zrt219/AI-resume-tailor-service-) |
| Resume Evidence RAG Auditor | Resume claim verification and RAG/eval discipline | [Demo](https://resume-evidence-rag-auditor.vercel.app) / [Repo](https://github.com/zrt219/resume-evidence-rag-auditor) |
| AI Gateway Failover Playground | Provider routing, fallback behavior, request traces | [Demo](https://ai-gateway-failover-playground.vercel.app) / [Repo](https://github.com/zrt219/ai-gateway-failover-playground) |
| Enterprise Agent Workflow Studio | Approval-gated agent workflows and risk scoring | [Demo](https://enterprise-agent-workflow-studio.vercel.app) / [Repo](https://github.com/zrt219/enterprise-agent-workflow-studio) |
| DatumX | AI data provenance, validation, and on-chain lineage | [Demo](https://datumx.vercel.app) / [Repo](https://github.com/zrt219/DatumX) |

## Build Doctor

Build Doctor turns failed Next.js and Vercel build logs into a traceable diagnostic report.

Workflow:

1. Paste or load a build log.
2. Redact secrets.
3. Classify the failure with deterministic rules.
4. Extract evidence lines and affected subsystem signals.
5. Generate a local diagnostic trace, safe patch draft, suggested solutions, and markdown incident report.
6. Optionally request a sanitized DeepSeek review through OpenRouter. The deterministic diagnosis remains the source of truth.

Primary implementation paths:

- `src/lib/redact-secrets.ts`
- `src/lib/log-parser.ts`
- `src/lib/failure-taxonomy.ts`
- `src/lib/patch-recipes.ts`
- `src/lib/build-doctor/index.ts`
- `src/lib/build-doctor/llm/openrouter-deepseek.ts`
- `src/app/api/diagnose/route.ts`
- `src/app/api/enrich/route.ts`
- `src/app/api/report/route.ts`

## Architecture

```txt
Portfolio Mainframe
  -> typed project data
  -> public-safe evidence summaries
  -> workflow metric snapshot
  -> responsive proof UI
  -> browser QA screenshots

Build Doctor
  -> redact secrets
  -> classify failure
  -> extract evidence
  -> map remediation
  -> draft report
  -> optional sanitized LLM review
```

![Build Doctor Fuji dashboard](assets/build-doctor-readme/fuji-dashboard.png)

## Security and Privacy Boundaries

- No raw local Codex logs are rendered in the public UI.
- No raw JSONL contents are rendered in the public UI.
- No private absolute paths are rendered in the public UI.
- Secret-like values are redacted before diagnosis output, optional provider review, and report export.
- Optional LLM enrichment fails closed when disabled, missing credentials, rate-limited, or invalid.
- Integration health routes return public-safe readiness/fallback state only.
- Deployment upload ignores local `.env`, `.codex`, `.omx`, `.qa`, prompt, and private evidence artifacts.

## Verification

Latest local verification after the portfolio mainframe, tracker, QA, and wording passes:

| Command | Result |
|---|---|
| `npm run typecheck` | PASS |
| `npm test` | PASS, 32 tests |
| `npm run build` | PASS |
| `npm run test:e2e` | PASS, 15 tests |
| `npm run audit:security` | PASS |
| `npm run audit:45k` | PASS |
| `npm run audit:report` | PASS |
| `npm audit --audit-level=moderate` | PASS, 0 vulnerabilities |
| `git diff --check` | PASS, line-ending warnings only |

Browser QA captured:

- desktop/tablet/mobile portfolio screenshots
- live workflow tracker screenshots
- public copy screenshots
- command palette and evidence-ledger checks
- rendered-page private-path and banned-copy scans

The local browser QA harnesses and screenshots are intentionally ignored from Git and deployment upload.

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
npm test
npm run build
npm run test:e2e
npm run audit:security
npm run audit:45k
npm run audit:report
npm audit --audit-level=moderate
```

## Environment

Deterministic Build Doctor mode works without paid model access. Optional LLM enrichment is disabled by default and uses sanitized diagnosis JSON only when explicitly configured.

Use `.env.example` for variable names and defaults. Do not commit local `.env` files.

## Deployment

Production target:

- <https://vercel-build-doctor-agent.vercel.app>

Recommended deploy gate:

1. `npm run typecheck`
2. `npm test`
3. `npm run build`
4. `npm run test:e2e`
5. `npm audit --audit-level=moderate`
6. `npx vercel --prod`

## Repo Structure

| Path | Purpose |
|---|---|
| `src/app/` | App Router pages and API routes |
| `src/components/portfolio/` | Portfolio mainframe UI components |
| `src/data/` | Typed public portfolio data and evidence-backed stats |
| `src/lib/build-doctor/` | Build Doctor diagnosis and optional provider orchestration |
| `src/test/` | Vitest coverage |
| `e2e/` | Playwright browser coverage |
| `evidence/public/` | Public-safe evidence summaries |
| `ai-engineering/` | Verified engineering log |

## Limitations

- Build Doctor diagnoses pasted/build-log evidence; it does not inspect a live repository automatically.
- Optional provider review may be unavailable or rate-limited.
- Suggested solutions are deterministic guidance and should be reviewed before code changes.
- Public workflow metrics are dated snapshots, not a real-time stream.
- Local-only evidence is labeled and not overstated as a live demo.

## Resume-Safe Summary

Built and hardened a public AI engineering portfolio mainframe with evidence-backed workflow metrics, searchable project proof, responsive SVG analytics, deterministic Build Doctor diagnostics, safe optional LLM enrichment, public/private evidence boundaries, and verified TypeScript, unit, E2E, audit, and browser QA coverage.

## Additional Public Systems

| Project | System Focus | Status |
|---|---|---|
| [ZUC Mine Command Center](https://github.com/zrt219/Zuc-Mine-Command-Center) | Uranium mining operations dashboard with reserve tracking and XRPL EVM interaction | [Live](https://zuc-mine-command-center.vercel.app/) |
| [U235 Fuel Cycle](https://github.com/zrt219/-U235-Fuel-Cycle-) | Deterministic XRPL EVM fuel-cycle pipeline from ore to enriched fuel rod | [Live](https://u235-fuel-cycle.vercel.app/) |
| [ISR Network](https://github.com/zrt219/ISR-Network) | In-situ recovery workflow with asset tracking and lifecycle state transitions | [Live](https://isr-network.vercel.app/) |
| [Dark Matter Farm](https://github.com/zrt219/Dark-Matter-Farm) | XRPL EVM staking protocol with tiered locks and reward emissions | [Live](https://dark-matter-farm.vercel.app/) |
| [Cohr Lab](https://github.com/zrt219/Cohr-Lab) | Semiconductor laser fabrication modeled as an immutable lifecycle state machine | [Live](https://cohr-lab.vercel.app) |
| [ForgeX](https://github.com/zrt219/ForgeX) | Foundry-powered XRPL EVM deployment console with command-style interaction | [Live](https://forgex-theta.vercel.app) |
| [3DMoonX](https://github.com/zrt219/3DMoonX) | Cinematic lunar industrial-base experience with 3D web runtime direction | [Live](https://3dmoonx.vercel.app) |
| [Unknown002](https://github.com/zrt219/Unknown002) | Browser-based 3D engineering viewer for frontier-systems visualization | Public repo |
