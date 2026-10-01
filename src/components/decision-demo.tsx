"use client";

import { useState } from "react";
import { Arrow, Mark } from "@/components/icons";
import { CONSOLE_URL } from "@/lib/site";

// Editorial examples, deliberately independent of private model artifacts.
const scenarios = [
  { id: "support", label: "Support", context: "CUSTOMER MESSAGE", text: "I was charged twice for my subscription this month. Could you help me get the extra payment back?", question: "Which team should handle this?", result: "Billing", options: [{ label: "Billing", value: 94 }, { label: "Technical support", value: 4 }, { label: "Account access", value: 2 }] },
  { id: "operations", label: "Operations", context: "SERVICE ALERT", text: "Checkout errors have increased after a deployment. Payments are failing for customers and the issue is still ongoing.", question: "Does this need immediate attention?", result: "Yes", options: [{ label: "Yes", value: 96 }, { label: "No", value: 4 }] },
  { id: "commerce", label: "Commerce", context: "PRODUCT REVIEW", text: "The headphones sound great and the battery lasts all week. The case is a little bulky, but I would buy them again.", question: "How positive is this review?", result: "Positive", options: [{ label: "Very positive", value: 23 }, { label: "Positive", value: 72 }, { label: "Neutral", value: 4 }, { label: "Negative", value: 1 }] },
];

export function DecisionDemo() {
  const [active, setActive] = useState(0);
  const scenario = scenarios[active];
  return <div className="demo-stage" id="examples">
    <div className="demo-orbit" aria-hidden="true" />
    <div className="demo-card">
      <div className="demo-toolbar"><span className="micro-label"><Mark /> INSTINCT ONE</span><span className="demo-version">Interactive example</span></div>
      <div className="demo-tabs" role="group" aria-label="Choose an example">{scenarios.map((s, i) => <button key={s.id} onClick={() => setActive(i)} aria-pressed={active === i}>{s.label}</button>)}</div>
      <div className="demo-content" key={scenario.id} aria-live="polite">
        <div className="demo-input"><p className="micro-label">{scenario.context}</p><p className="context-copy">“{scenario.text}”</p></div>
        <div className="demo-connector"><span /><div><Mark /> decision</div><span /><Arrow /></div>
        <div className="demo-output"><div className="output-heading"><span className="micro-label">STRUCTURED ANSWER</span><span className="recorded-label">Illustrative</span></div><h2 className="demo-question">{scenario.question}</h2>
          <div className="demo-probabilities">{scenario.options.map(option => <div className={`demo-probability ${option.label === scenario.result ? "is-top" : ""}`} key={option.label}><div className="probability-fill" style={{ width: `${option.value}%` }} /><span>{option.label}</span><strong>{option.value}<small>%</small></strong></div>)}</div>
        </div>
      </div>
      <div className="demo-footer"><span>Example scores · not a live prediction</span><a href={`${CONSOLE_URL}/playground`}>Try your own <Arrow /></a></div>
    </div>
    <p className="demo-caption">Your context. Your criteria. A decision you can use.</p>
  </div>;
}
