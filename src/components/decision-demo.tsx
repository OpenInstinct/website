"use client";

import { useState } from "react";
import Link from "next/link";
import type { Example } from "@/lib/site";
import { Arrow, Mark } from "@/components/icons";

const scenarios = [
  { domain: "support", label: "Support", qid: "routing_team", context: "CUSTOMER MESSAGE", title: "A ticket comes in.", summary: null },
  { domain: "devops", label: "DevOps", qid: "should_page_now", context: "SERVICE ALERT · SUMMARY", title: "An error rate spikes.", summary: "checkout-api errors rose from 0.4% to 2.1% in eu-west-1. The spike has lasted 12 minutes, following a recent deployment." },
  { domain: "ecommerce", label: "Commerce", qid: "within_return_window", context: "RETURN REQUEST · SUMMARY", title: "A return needs a decision.", summary: "An unopened charger, delivered August 17. A return requested September 18. The store has a 30-day return window." },
];

export function DecisionDemo({ examples }: { examples: Example[] }) {
  const [active, setActive] = useState("support");
  const scenario = scenarios.find(s => s.domain === active)!;
  const example = examples.find(e => e.domain === active);
  const question = example?.questions.find(q => q.qid === scenario.qid);
  if (!example || !question) return null;
  const top = question.probs.indexOf(Math.max(...question.probs));
  return <div className="demo-stage" id="examples">
    <div className="demo-orbit" aria-hidden="true" />
    <div className="demo-card">
      <div className="demo-toolbar"><span className="micro-label"><span className="status-dot" /> SEE IT IN ACTION</span><span className="demo-version">Phase 2 / preview</span></div>
      <div className="demo-tabs" role="group" aria-label="Choose a use case">{scenarios.map(s => <button key={s.domain} onClick={() => setActive(s.domain)} aria-pressed={active === s.domain}>{s.label}</button>)}</div>
      <div className="demo-content" key={active} aria-live="polite">
        <div className="demo-input"><p className="micro-label">{scenario.context}</p><h2>{scenario.title}</h2><p className="context-copy">{scenario.summary ?? example.state}</p></div>
        <div className="demo-connector"><span /><div><Mark /> openinstinct</div><span /><Arrow /></div>
        <div className="demo-output"><div className="output-heading"><span className="micro-label">MODEL OUTPUT</span><span className="recorded-label">Recorded</span></div><p className="demo-question">{question.text}</p>
          <div className="demo-probabilities">{question.options.map((option, i) => <div className={`demo-probability ${i === top ? "is-top" : ""}`} key={option} title={option}><div className="probability-fill" style={{ width: `${question.probs[i] * 100}%` }} /><span>{option.split(":")[0].replaceAll("_", " ")}</span><strong>{(question.probs[i] * 100).toFixed(1)}<small>%</small></strong></div>)}</div>
        </div>
      </div>
      <div className="demo-footer"><span>Real checkpoint. Real output.</span><Link href={`/playground?example=${encodeURIComponent(example.id)}`}>Explore example <Arrow /></Link></div>
    </div>
    <p className="demo-caption">Your context in. Probabilities over your options out.</p>
  </div>;
}
