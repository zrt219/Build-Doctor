"use client";

import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, ExternalLink, GitBranch, Info, ShieldAlert } from "lucide-react";
import { generateAuditReport, generateWorkflow, toolRegistry, type WorkflowRequest } from "@/lib/workflow-studio";
import { socialLinks } from "@/lib/social";
import { suiteLinks, suiteProof } from "@/lib/suite";

const scenarios = [
  {
    label: "Enterprise escalation",
    request: {
      objective: "Coordinate an enterprise customer escalation with evidence gathering, ticket drafting, and human approval before write actions.",
      selectedTools: ["crm_lookup", "policy_search", "ticket_update", "human_approval"],
      riskLevel: "high",
      dataClass: "internal",
    } satisfies WorkflowRequest,
  },
  {
    label: "Regulated review",
    request: {
      objective: "Review regulated care-adjacent context, summarize policy evidence, and block any write action until human approval.",
      selectedTools: ["ehr_context", "policy_search", "human_approval"],
      riskLevel: "high",
      dataClass: "regulated",
    } satisfies WorkflowRequest,
  },
  {
    label: "Read-only policy answer",
    request: {
      objective: "Answer a policy question using retrieval only, with no write-capable tools in the workflow.",
      selectedTools: ["policy_search"],
      riskLevel: "low",
      dataClass: "public",
    } satisfies WorkflowRequest,
  },
];

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

export function EnterpriseStudioApp() {
  const [activeScenario, setActiveScenario] = useState(scenarios[0].label);
  const [objective, setObjective] = useState(scenarios[0].request.objective);
  const [riskLevel, setRiskLevel] = useState<WorkflowRequest["riskLevel"]>(scenarios[0].request.riskLevel);
  const [dataClass, setDataClass] = useState<WorkflowRequest["dataClass"]>(scenarios[0].request.dataClass);
  const [selectedTools, setSelectedTools] = useState<string[]>(scenarios[0].request.selectedTools ?? []);
  const request = useMemo(() => ({ objective, selectedTools, riskLevel, dataClass }), [objective, selectedTools, riskLevel, dataClass]);
  const workflow = generateWorkflow(request);
  const report = generateAuditReport(workflow);

  function loadScenario(label: string) {
    const scenario = scenarios.find((item) => item.label === label) ?? scenarios[0];
    setActiveScenario(scenario.label);
    setObjective(scenario.request.objective);
    setRiskLevel(scenario.request.riskLevel);
    setDataClass(scenario.request.dataClass);
    setSelectedTools(scenario.request.selectedTools ?? []);
  }

  function toggleTool(toolId: string) {
    setSelectedTools((current) => current.includes(toolId) ? current.filter((id) => id !== toolId) : [...current, toolId]);
  }

  return (
    <main className="shell">
      <header className="panel" style={{ padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div className="muted mono" style={{ fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase" }}>ZRT Vercel AI Systems Suite</div>
            <strong>Enterprise Agent Workflow Studio</strong>
          </div>
          <nav className="nav" aria-label="Suite navigation">
            {suiteLinks.map((link) => <a key={link.href} className="chip" href={link.href}>{link.label}</a>)}
          </nav>
        </div>
        <nav className="nav" aria-label="ZRT social links" style={{ marginTop: 14 }}>
          {socialLinks.map((link) => <a key={link.href} className="chip" href={link.href} target="_blank" rel="noreferrer">{link.label}<ExternalLink size={12} /></a>)}
        </nav>
      </header>

      <section className="grid two" style={{ marginTop: 24 }}>
        <div className="panel" style={{ padding: 28 }}>
          <span className="chip review">DEMO LOCAL ONLY</span>
          <h1 style={{ fontSize: 48, lineHeight: 1, margin: "24px 0 16px" }}>Design enterprise-safe agent workflows before tools can act.</h1>
          <p className="muted" style={{ fontSize: 18, lineHeight: 1.65 }}>Build an auditable agent graph with tool scope, data classification, risk score, approval gates, launch checks, and exportable evidence.</p>
          <div className="plain-panel">
            <div className="muted mono" style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase" }}>Plain English</div>
            <p className="muted" style={{ marginBottom: 0 }}>This is a planning board for AI agents. It shows which tools an AI would use, which steps need a human to approve them, and what evidence must be saved before anything risky happens.</p>
          </div>
          <div className="nav" style={{ marginTop: 18 }}>{suiteProof.map((item) => <span key={item} className="chip pass">{item}</span>)}</div>
        </div>
        <div className="panel" style={{ padding: 24 }}>
          <h2>Readiness Console <InfoTip label="Readiness">A quick status view showing whether this workflow is safe to demo, needs human approval, or is blocked.</InfoTip></h2>
          <div className="grid two">
            <div className="metric"><span className="muted">Readiness <InfoTip label="Readiness">The launch state after checking selected tools, risk, and data sensitivity.</InfoTip></span><strong>{workflow.readiness.status}</strong></div>
            <div className="metric"><span className="muted">Risk score <InfoTip label="Risk score">A simple 0 to 100 score estimating how careful the workflow needs to be.</InfoTip></span><strong>{workflow.riskScore}/100</strong></div>
          </div>
          <p className="muted" style={{ marginTop: 14 }}>{workflow.auditSummary}</p>
          {workflow.readiness.blockers.map((blocker) => <p key={blocker} className="chip review">{blocker}</p>)}
        </div>
      </section>

      <section className="grid two" style={{ marginTop: 16 }}>
        <div className="panel" style={{ padding: 24 }}>
          <h2>Workflow Definition <InfoTip label="Workflow">The goal, risk level, data type, and tools the agent is allowed to use.</InfoTip></h2>
          <label className="muted" htmlFor="scenario">Scenario preset</label>
          <select id="scenario" className="field" value={activeScenario} onChange={(event) => loadScenario(event.target.value)}>
            {scenarios.map((scenario) => <option key={scenario.label}>{scenario.label}</option>)}
          </select>
          <label className="muted" htmlFor="objective" style={{ display: "block", marginTop: 12 }}>Objective</label>
          <textarea id="objective" className="field" value={objective} onChange={(event) => setObjective(event.target.value)} style={{ minHeight: 110 }} />
          <div className="grid two" style={{ marginTop: 12 }}>
            <label>Risk level <InfoTip label="Risk level">How serious the action is. Higher risk adds approval gates.</InfoTip><select className="field" value={riskLevel} onChange={(event) => setRiskLevel(event.target.value as WorkflowRequest["riskLevel"])}><option value="low">low</option><option value="medium">medium</option><option value="high">high</option></select></label>
            <label>Data class <InfoTip label="Data class">How sensitive the information is. Regulated data means extra care.</InfoTip><select className="field" value={dataClass} onChange={(event) => setDataClass(event.target.value as WorkflowRequest["dataClass"])}><option value="public">public</option><option value="internal">internal</option><option value="regulated">regulated</option></select></label>
          </div>
        </div>
        <div className="panel" style={{ padding: 24 }}>
          <h2>Tool Registry <InfoTip label="Tool registry">The list of pretend business systems the demo agent can use, such as lookup, search, ticket update, or refund preparation.</InfoTip></h2>
          {toolRegistry.map((tool) => (
            <label key={tool.id} className="metric" style={{ display: "block", marginBottom: 10, borderStyle: tool.approval ? "dashed" : "solid" }}>
              <input type="checkbox" checked={selectedTools.includes(tool.id)} onChange={() => toggleTool(tool.id)} /> <strong style={{ display: "inline", fontSize: 16 }}>{tool.name}</strong>
              <p className="muted">{tool.scope} | risk: {tool.risk} | {tool.approval ? "approval required" : "read-safe"}</p>
            </label>
          ))}
        </div>
      </section>

      <section className="panel" style={{ padding: 24, marginTop: 16 }}>
        <h2><GitBranch size={20} /> Generated Agent Graph <InfoTip label="Agent graph">A map of the order the agents and tools would run in.</InfoTip></h2>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
          {workflow.nodes.map((node, index) => (
            <div key={node.id} className="metric">
              <div className="mono muted">STEP {index + 1} | {node.type}</div>
              <strong style={{ fontSize: 18 }}>{node.label}</strong>
              <p className={node.status === "APPROVAL REQUIRED" ? "chip review" : "chip pass"}>{node.status === "APPROVAL REQUIRED" ? <ShieldAlert size={13} /> : <CheckCircle2 size={13} />}{node.status}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid two" style={{ marginTop: 16 }}>
        <div className="panel" style={{ padding: 24 }}>
          <h2>Approval Gates + Launch Checks <InfoTip label="Approval gate">A stop sign that requires a person to review the evidence before a risky tool runs.</InfoTip></h2>
          {workflow.approvalGates.map((gate) => (
            <div key={gate.toolId} className="metric" style={{ marginBottom: 10 }}>
              <strong style={{ fontSize: 18 }}>{gate.label}</strong>
              <p className="muted">{gate.gate}</p>
              <p className="mono muted">Evidence: {gate.evidenceRequired.join(" | ")}</p>
            </div>
          ))}
          {workflow.readiness.launchChecklist.map((item) => <p key={item} className="chip" style={{ marginRight: 8 }}>{item}</p>)}
        </div>
        <div className="panel" style={{ padding: 24 }}>
          <h2>Audit Export <InfoTip label="Audit export">A copyable report explaining what the workflow would do and why it is safe or blocked.</InfoTip></h2>
          <pre className="mono" style={{ whiteSpace: "pre-wrap", color: "#cfe0f5", maxHeight: 340, overflow: "auto" }}>{report}</pre>
        </div>
      </section>
    </main>
  );
}
