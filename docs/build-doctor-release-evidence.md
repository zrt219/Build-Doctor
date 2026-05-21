# Build Doctor Release Evidence

Date: 2026-05-21

## Positioning

Build Doctor is a developer tool that helps diagnose failed Next.js/Vercel builds. A deterministic engine reads pasted build logs, removes secrets, identifies the likely root cause, shows the evidence trail, suggests a safe patch draft, and exports a markdown incident report. Optional DeepSeek review through OpenRouter can improve the explanation, but the local diagnosis remains the source of truth.

## Verified Claims Checklist

- Deterministic diagnosis works without OpenAI, OpenRouter, Supabase, GitHub, or Vercel API credentials.
- DeepSeek review through OpenRouter is supported only when explicitly enabled with server-side environment variables.
- Raw logs and secret-like values are redacted before diagnosis, report generation, diagnostic trace metadata, and optional provider review.
- Reports include root cause, evidence, diagnostic trace, patch draft, optional LLM review, verification commands, remaining risks, and export metadata.
- UNKNOWN failures use conservative fallback language and do not invent code changes.

## API Contract Snapshot

- `/api/diagnose`: local deterministic diagnosis, no raw-log storage, stable `Diagnosis` schema.
- `/api/report`: deterministic markdown export from a validated diagnosis payload.
- `/api/enrich`: optional sanitized DeepSeek review with fail-closed `providerStatus`.

## Screenshot Evidence Plan

- Use only simulated fixture logs.
- Do not include API keys, personal logs, customer data, or unredacted secrets.
- Capture `/build-doctor` default state, diagnosed state, report-ready state, and mobile layout.

## Resume-Safe Bullet

- Built Build Doctor, a Vercel-deployed AI developer tool that diagnoses failed Next.js/Vercel build logs through a deterministic taxonomy, redacts secrets, generates traceable root-cause receipts, suggests safe patch drafts, optionally enriches explanations through DeepSeek via OpenRouter, and validates reliability with unit and browser tests.
