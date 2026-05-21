"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, ExternalLink, FileSearch, Info, ShieldAlert } from "lucide-react";
import { auditRequestSchema, auditResumeClaims, evidenceCorpus, generateReport } from "@/lib/rag-auditor";
import { socialLinks } from "@/lib/social";
import { activeWorkflowStepId, suiteLinks, suiteProof, suiteWorkflowSteps } from "@/lib/suite";

function InfoTip({ label, children }: { label: string; children: string }) {
  return (
    <span className="help-tip">
      <span className="help-icon" tabIndex={0} role="note" aria-label={`${label}: ${children}`}>
        <Info size={13} aria-hidden="true" />
      </span>
      <span className="help-bubble">
        <span className="help-title">{label}</span>
        {children}
      </span>
    </span>
  );
}

export function ResumeAuditorApp() {
  const defaults = auditRequestSchema.parse({});
  const [jobDescription, setJobDescription] = useState(defaults.jobDescription);
  const [claimsText, setClaimsText] = useState(defaults.claims.join("\n"));
  const claims = claimsText.split("\n").map((claim) => claim.trim()).filter(Boolean);
  const audit = useMemo(() => auditResumeClaims({ jobDescription, claims }), [jobDescription, claimsText]);
  const report = useMemo(() => generateReport(audit), [audit]);
  const matchTerms = Array.from(new Set(audit.auditedClaims.flatMap((claim) => claim.jobOverlap))).slice(0, 10);

  return (
    <main className="shell">
      <header className="panel" style={{ padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div className="muted mono" style={{ fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase" }}>ZRT Vercel AI Systems Suite</div>
            <strong>Resume Evidence RAG Auditor</strong>
          </div>
          <nav className="nav" aria-label="Suite navigation">
            {suiteLinks.map((link) => <a key={link.href} className="chip" href={link.href} aria-current={link.label === "Resume Auditor" ? "page" : undefined}>{link.label}</a>)}
          </nav>
        </div>
        <nav className="nav" aria-label="ZRT social links" style={{ marginTop: 14 }}>
          {socialLinks.map((link) => <a key={link.href} className="chip" href={link.href} target="_blank" rel="noreferrer">{link.label}<ExternalLink size={12} /></a>)}
        </nav>
      </header>

      <section className="grid two" style={{ marginTop: 24 }}>
        <div className="panel" style={{ padding: 28 }}>
          <span className="chip review">DEMO JSON RETRIEVAL</span>
          <h1 style={{ fontSize: 48, lineHeight: 1, margin: "24px 0 16px" }}>Audit resume claims against project evidence before tailoring bullets.</h1>
          <p className="muted" style={{ fontSize: 18, lineHeight: 1.65 }}>Editable job description, local retrieval corpus, claim verification states, unverified-claim flags, evidence gaps, and grounded bullet export.</p>
          <div className="plain-panel">
            <div className="muted mono" style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase" }}>Plain English</div>
            <p className="muted" style={{ marginBottom: 0 }}>This tool checks whether resume claims are backed by real project evidence, then helps rewrite only the claims that can be supported.</p>
          </div>
          <div className="nav" style={{ marginTop: 18 }}>{suiteProof.map((item) => <span key={item} className="chip pass">{item}</span>)}</div>
        </div>
        <div className="panel" style={{ padding: 24 }}>
          <h2>Readiness Console <InfoTip label="Readiness">A quick view of how many claims are supported and whether the resume needs review.</InfoTip></h2>
          <div className="grid two">
            <div className="metric"><span className="muted">Readiness <InfoTip label="Readiness">READY means all entered claims have evidence. REVIEW means some claims need proof or rewriting.</InfoTip></span><strong>{audit.readiness.status}</strong></div>
            <div className="metric"><span className="muted">Verified score <InfoTip label="Verified score">The percent of claims that matched project evidence.</InfoTip></span><strong>{audit.summary.score}%</strong></div>
            <div className="metric"><span className="muted">Verified <InfoTip label="Verified claims">Claims that found a matching project evidence record.</InfoTip></span><strong>{audit.summary.verified}/{audit.summary.total}</strong></div>
            <div className="metric"><span className="muted">Evidence records <InfoTip label="Evidence records">The local proof documents the demo searches through.</InfoTip></span><strong>{evidenceCorpus.length}</strong></div>
          </div>
          <p className="muted" style={{ marginTop: 14 }}>Matched job terms: {matchTerms.join(", ") || "none yet"}</p>
        </div>
      </section>

      <section className="grid two" style={{ marginTop: 16 }}>
        <div className="panel" style={{ padding: 24 }}>
          <h2>Inputs <InfoTip label="Inputs">Paste the job description and the resume claims you want checked.</InfoTip></h2>
          <label className="muted" htmlFor="jd">Job description</label>
          <textarea id="jd" className="field" value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} style={{ minHeight: 130 }} />
          <label className="muted" htmlFor="claims" style={{ display: "block", marginTop: 12 }}>Claims, one per line</label>
          <textarea id="claims" className="field" value={claimsText} onChange={(event) => setClaimsText(event.target.value)} style={{ minHeight: 160 }} />
        </div>
        <div className="panel" style={{ padding: 24 }}>
          <h2><FileSearch size={20} /> Evidence Corpus <InfoTip label="Evidence corpus">The small library of project proof this demo searches. In a larger system, this could be a database or document store.</InfoTip></h2>
          {evidenceCorpus.map((item) => (
            <div key={item.id} className="metric" style={{ marginBottom: 10 }}>
              <strong style={{ fontSize: 18 }}>{item.title}</strong>
              <p className="muted">{item.proof}</p>
              <p className="mono muted">{item.tags.join(" | ")}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel" style={{ padding: 24, marginTop: 16 }}>
        <h2>Claim Review <InfoTip label="Claim review">Each claim is marked VERIFIED when evidence supports it, or UNVERIFIED when it needs proof.</InfoTip></h2>
        <div className="grid">
          {audit.auditedClaims.map((claim) => (
            <div key={claim.claim} className="metric" style={{ borderStyle: claim.status === "VERIFIED" ? "solid" : "dashed" }}>
              <p className={claim.status === "VERIFIED" ? "chip pass" : "chip review"}>{claim.status === "VERIFIED" ? <CheckCircle2 size={13} /> : <ShieldAlert size={13} />}{claim.status}</p>
              <strong style={{ fontSize: 18 }}>{claim.claim}</strong>
              <p className="muted">Confidence {Math.round(claim.confidence * 100)}% | Job overlap: {claim.jobOverlap.join(", ") || "none"}</p>
              {claim.evidence.map((item) => <p key={item.id} className="muted">Evidence: {item.title} | {item.matchedTags.join(", ")}</p>)}
              {claim.flags.map((flag) => <p key={flag} className="chip review" style={{ marginRight: 8 }}>{flag}</p>)}
            </div>
          ))}
        </div>
      </section>

      <section className="panel" style={{ padding: 24, marginTop: 16 }}>
        <h2>Cross-App Build Repair Workflow <InfoTip label="Export report">The final handoff packages verified evidence and report text without inflating claims.</InfoTip></h2>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))" }}>
          {suiteWorkflowSteps.map((step, index) => (
            <a key={step.id} className={step.id === activeWorkflowStepId ? "metric workflow-active" : "metric"} href={step.href} style={{ textDecoration: "none" }}>
              <div className="mono muted">STEP {index + 1} | {step.appName}</div>
              <strong style={{ fontSize: 17 }}>{step.label}</strong>
              <p className={step.id === activeWorkflowStepId ? "chip pass" : "chip"}>{step.output}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="grid two" style={{ marginTop: 16 }}>
        <div className="panel" style={{ padding: 24 }}>
          <h2>Evidence Gaps + Checklist <InfoTip label="Evidence gap">A missing proof point. The safest action is to remove the claim, rewrite it, or attach evidence.</InfoTip></h2>
          {audit.evidenceGaps.length ? audit.evidenceGaps.map((gap) => (
            <div key={gap.claim} className="metric" style={{ marginBottom: 10, borderStyle: "dashed" }}>
              <p className="chip review">Evidence gap</p>
              <p className="muted">{gap.claim}</p>
              <p>{gap.gap}</p>
            </div>
          )) : <p className="chip pass">No gaps detected</p>}
          {audit.readiness.checklist.map((item) => <p key={item} className="chip" style={{ marginRight: 8 }}>{item}</p>)}
        </div>
        <div className="panel" style={{ padding: 24 }}>
          <h2>Grounded Bullet Export <InfoTip label="Grounded bullet">A resume bullet generated only from supported claims, not inflated claims.</InfoTip></h2>
          <pre className="mono" style={{ whiteSpace: "pre-wrap", color: "#dceaff", maxHeight: 340, overflow: "auto" }}>{audit.tailoredBullets.map((bullet) => `- ${bullet}`).join("\n")}</pre>
        </div>
      </section>

      <section className="panel" style={{ padding: 24, marginTop: 16 }}>
        <h2>Markdown Report Export <InfoTip label="Markdown report">A copyable report for reviewer handoff, generated from the current audited claims.</InfoTip></h2>
        <pre className="mono" style={{ whiteSpace: "pre-wrap", color: "#dceaff", maxHeight: 360, overflow: "auto" }}>{report}</pre>
      </section>
    </main>
  );
}
