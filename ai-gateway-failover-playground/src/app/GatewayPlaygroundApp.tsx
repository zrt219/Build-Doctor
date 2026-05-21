"use client";

import { useMemo, useState } from "react";
import { ArrowRight, ExternalLink, Gauge, RadioTower, ShieldAlert } from "lucide-react";
import { circuitBreakers, providers, routeRequest, type ChatRequest } from "@/lib/gateway";
import { socialLinks } from "@/lib/social";
import { suiteLinks, suiteProof } from "@/lib/suite";

const scenarioNotes: Record<NonNullable<ChatRequest["scenario"]>, string> = {
  normal: "All providers are healthy; policy decides the route.",
  primary_outage: "Primary model is unavailable; fallback pool must preserve reliability.",
  rate_limited: "Fast provider is synthetically rate-limited; trace should explain fallback.",
  cost_guardrail: "Cost policy prefers cheaper adapters and records budget tradeoffs.",
};

export function GatewayPlaygroundApp() {
  const [scenario, setScenario] = useState<ChatRequest["scenario"]>("primary_outage");
  const [policy, setPolicy] = useState<ChatRequest["policy"]>("highest_reliability");
  const [maxLatencyMs, setMaxLatencyMs] = useState(900);
  const [maxCostUsd, setMaxCostUsd] = useState(0.02);
  const routed = useMemo(
    () => routeRequest({ prompt: "Route this request through a deterministic provider policy.", scenario, policy, maxLatencyMs, maxCostUsd }),
    [scenario, policy, maxLatencyMs, maxCostUsd],
  );

  return (
    <main className="shell">
      <header className="panel" style={{ padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div className="muted mono" style={{ fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase" }}>ZRT Vercel AI Systems Suite</div>
            <strong>AI Gateway Failover Playground</strong>
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
          <span className="chip review">DEMO PROVIDER MOCKS</span>
          <h1 style={{ fontSize: 48, lineHeight: 1, margin: "24px 0 16px" }}>Exercise provider routing, fallback, and budgets before production scale exists.</h1>
          <p className="muted" style={{ fontSize: 18, lineHeight: 1.65 }}>Unified `/api/chat` simulation with routing policies, outage scenarios, latency and cost budgets, circuit breakers, and an auditable request trace.</p>
          <div className="nav" style={{ marginTop: 18 }}>{suiteProof.map((item) => <span key={item} className="chip pass">{item}</span>)}</div>
        </div>
        <div className="panel" style={{ padding: 24 }}>
          <h2>Selected Route</h2>
          <div className="grid two">
            <div className="metric"><span className="muted">Provider</span><strong>{routed.provider.label}</strong></div>
            <div className="metric"><span className="muted">Readiness</span><strong>{routed.readiness.status}</strong></div>
            <div className="metric"><span className="muted">Latency</span><strong>{routed.dashboard.latencyMs}ms</strong></div>
            <div className="metric"><span className="muted">Cost</span><strong>${routed.dashboard.costUsd.toFixed(3)}</strong></div>
          </div>
          <p className="muted" style={{ marginTop: 14 }}>{scenarioNotes[scenario ?? "normal"]}</p>
        </div>
      </section>

      <section className="grid two" style={{ marginTop: 16 }}>
        <div className="panel" style={{ padding: 24 }}>
          <h2>Routing Controls</h2>
          <label>Scenario<select className="field" value={scenario} onChange={(event) => setScenario(event.target.value as ChatRequest["scenario"])}><option value="normal">normal</option><option value="primary_outage">primary_outage</option><option value="rate_limited">rate_limited</option><option value="cost_guardrail">cost_guardrail</option></select></label>
          <label>Policy<select className="field" value={policy} onChange={(event) => setPolicy(event.target.value as ChatRequest["policy"])}><option value="balanced">balanced</option><option value="lowest_latency">lowest_latency</option><option value="lowest_cost">lowest_cost</option><option value="highest_reliability">highest_reliability</option></select></label>
          <label>Max latency ms<input className="field" type="number" value={maxLatencyMs} onChange={(event) => setMaxLatencyMs(Number(event.target.value))} /></label>
          <label>Max cost USD<input className="field" type="number" step="0.001" value={maxCostUsd} onChange={(event) => setMaxCostUsd(Number(event.target.value))} /></label>
        </div>
        <div className="panel" style={{ padding: 24 }}>
          <h2>Provider Pool</h2>
          {providers.map((provider) => (
            <div key={provider.id} className="metric" style={{ marginBottom: 10, borderColor: provider.id === routed.provider.id ? "#6dd8ff" : "#31445b" }}>
              <strong style={{ fontSize: 18 }}>{provider.label}</strong>
              <p className="muted">{provider.region} | {provider.latencyMs}ms | ${provider.costUsd.toFixed(3)} | reliability {Math.round(provider.reliability * 1000) / 10}%</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid two" style={{ marginTop: 16 }}>
        <div className="panel" style={{ padding: 24 }}>
          <h2><RadioTower size={20} /> Circuit Breakers</h2>
          {circuitBreakers.map((breaker) => (
            <div key={breaker.id} className="metric" style={{ marginBottom: 10, borderStyle: "dashed" }}>
              <p className="chip review"><ShieldAlert size={13} />{breaker.providerId}: {breaker.state}</p>
              <p className="muted">{breaker.reason}</p>
            </div>
          ))}
        </div>
        <div className="panel" style={{ padding: 24 }}>
          <h2><Gauge size={20} /> Budget Status</h2>
          <p className={routed.dashboard.latencyStatus === "PASS" ? "chip pass" : "chip review"}>Latency {routed.dashboard.latencyStatus}</p>
          <p className={routed.dashboard.budgetStatus === "PASS" ? "chip pass" : "chip review"} style={{ marginLeft: 8 }}>Cost {routed.dashboard.budgetStatus}</p>
          {routed.readiness.reasons.map((reason) => <p key={reason} className="muted">{reason}</p>)}
          {routed.safetyNotes.map((note) => <p key={note} className="chip" style={{ marginRight: 8 }}>{note}</p>)}
        </div>
      </section>

      <section className="panel" style={{ padding: 24, marginTop: 16 }}>
        <h2>Request Trace Viewer</h2>
        {routed.trace.map((event, index) => (
          <div key={event.step} className="metric" style={{ marginBottom: 10 }}>
            <p className={event.status === "PASS" ? "chip pass" : "chip review"}>{index + 1}. {event.step}: {event.status}</p>
            <p className="muted">{event.detail}</p>
          </div>
        ))}
        <a className="button" href="https://vercel-build-doctor-agent.vercel.app">Return to suite hub <ArrowRight size={16} /></a>
      </section>
    </main>
  );
}
