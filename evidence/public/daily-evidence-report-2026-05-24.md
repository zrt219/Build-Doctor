# Public-Safe Daily Evidence Report Summary - 2026-05-24

- Source: Daily Codex Evidence Refresh Report
- Scope: public-safe summary for portfolio UI verification
- Public boundary: private absolute paths, raw session logs, tokens, prompts, and secrets are excluded.

## Live Counts

| Metric | Current Count | Evidence Source | Confidence |
|---|---:|---|---|
| Codex sessions found | 757 | Rebuilt session index plus stored rollout corpus | High |
| Live workflow events | 1,160,551 | Non-empty JSONL records across active and archived local session storage | High |
| Local session logs | 757 | JSONL files across local Codex session storage | High |
| Source code lines | 600,493 | Source-extension line count across the scanned workspace | Medium |
| Sessions updated today | 44 | Current-day JSONL rollouts plus rebuilt index rows dated 2026-05-24 | High |
| Public GitHub repos scanned | 22 | Effective public GitHub snapshot for zrt219 | High |
| Solidity files found | 326 | Workspace .sol scan excluding build/dependency directories | Medium |
| Foundry projects found | 18 | Workspace foundry.toml scan excluding build/dependency directories | Medium |
| AI/RAG/agent files found | 12,891 | Workspace path scan for AI/agent/RAG/eval terms | Medium |
| Generated exports | 8 | Root resume/packet/diary DOCX, PDF, HTML, and ATS TXT artifacts | High |

## Evidence Boundary

These counts are a dated evidence snapshot, not live telemetry. The public portfolio must label them as last verified on 2026-05-24 unless the refresh pipeline runs again.
