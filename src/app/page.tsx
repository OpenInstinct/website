import { Arrow, Check, Mark } from "@/components/icons";
import { DecisionDemo } from "@/components/decision-demo";
import { CONSOLE_URL, DOCS_URL } from "@/lib/site";

export default function Home() {
  return <>
    <section className="site-container hero">
      <div className="hero-copy">
        <div className="release-tag"><span className="status-dot" /> INTRODUCING INSTINCT ONE <span className="tag-divider" /> DECISION INTELLIGENCE</div>
        <h1>Every workflow.<br />A clearer<br /><span className="accent-word">next move.<svg viewBox="0 0 240 15" fill="none" aria-hidden="true"><path d="M3 10C64 0 162 0 237 7M30 14C99 7 163 6 216 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></span></h1>
        <p className="hero-description">Turn context into decisions with Instinct One. Bring your text, images, or structured data. Define what matters. Get answers your software can act on.</p>
        <div className="hero-actions"><a href={CONSOLE_URL} className="button button-green">Open console <Arrow diagonal /></a><a href={DOCS_URL} className="text-link">Read the docs <Arrow /></a></div>
        <div className="hero-note"><span className="note-line" /> Available through the OpenInstinct API.</div>
      </div>
      <DecisionDemo />
    </section>

    <div className="model-strip"><div className="site-container model-strip-inner"><span className="micro-label">BUILT FOR THE MOMENTS<br />YOUR SOFTWARE NEEDS TO DECIDE.</span><div><strong>Text + images</strong><span>Context in the format you have</span></div><div><strong>Your criteria</strong><span>Questions shaped around your task</span></div><div><strong>Structured answers</strong><span>Ready for your application</span></div></div></div>

    <section className="site-container section-space" id="model">
      <div className="section-heading"><div><p className="eyebrow">01 / MEET INSTINCT ONE</p><h2>Context in.<br />A decision comes next.</h2></div><p>From a customer message to an operational alert,<br className="desktop-break" /> connect what you know to what you do.</p></div>
      <div className="workflow">
        <article className="workflow-step"><span className="step-number">01 / CONTEXT</span><h3>Bring the whole picture.</h3><p>Pass text, JSON, or images. Give the model the information your decision depends on.</p><div className="input-illustration" aria-hidden="true"><span><span className="file-symbol">≡</span> customer_message <span>TEXT</span></span><span><span className="file-symbol">{ "{ }" }</span> application_state <span>JSON</span></span><span><span className="file-symbol">▧</span> product_photo <span>IMAGE</span></span></div></article>
        <article className="workflow-step model-step"><span className="step-number">02 / CRITERIA</span><h3>You define the decision.</h3><p>Ask a yes-or-no question, choose between your options, or score against a scale you define.</p><div className="model-illustration"><span className="model-ring ring-one"/><span className="model-ring ring-two"/><Mark /><span className="model-chip">Instinct One</span></div></article>
        <article className="workflow-step"><span className="step-number">03 / ACTION</span><h3>Build on the answer.</h3><p>Use structured results to route work, prioritize a queue, or bring a person into the loop.</p><div className="decision-illustration"><span className="micro-label">YOUR APPLICATION LOGIC</span><div><span className="branch-dot"/> Meets your criteria <span>Take action <Arrow /></span></div><div><span className="branch-dot muted-dot"/> Needs a closer look <span>Human review <Arrow /></span></div></div></article>
      </div>
      <div className="formats"><span className="micro-label">THREE WAYS TO MAKE A DECISION</span><span><i>01</i> Yes / No</span><span><i>02</i> Choose an option</span><span><i>03</i> Score a range</span></div>
    </section>

    <section className="use-cases-section" id="use-cases"><div className="site-container section-space">
      <div className="section-heading"><div><p className="eyebrow">02 / MADE FOR YOUR WORKFLOW</p><h2>Small decisions.<br />A meaningful difference.</h2></div><p>Keep your business rules in your application.<br className="desktop-break" /> Let Instinct One help interpret the context.</p></div>
      <div className="use-case-grid">
        <article><span className="use-case-index">01 — SUPPORT</span><h3>The right queue.<br />The right attention.</h3><p>Classify incoming messages, identify intent, and send each request to the team that can help.</p><span className="use-case-label">Message → team</span></article>
        <article><span className="use-case-index">02 — OPERATIONS</span><h3>Know what needs<br />a closer look.</h3><p>Evaluate alerts against your criteria and flag cases that need a person to review them.</p><span className="use-case-label">Context → priority</span></article>
        <article><span className="use-case-index">03 — COMMERCE</span><h3>Make sense of<br />every interaction.</h3><p>Organize product feedback, assess sentiment, and classify requests across your customer journey.</p><span className="use-case-label">Feedback → insight</span></article>
      </div>
    </div></section>

    <section className="site-container section-space integration-section" id="developers">
      <div className="integration-copy"><p className="eyebrow">03 / FROM IDEA TO INTEGRATION</p><h2>A decision layer.<br />On your terms.</h2><p>Explore a question in the console, create an API key, and bring the same request into your application.</p><ul><li><Check />Try your own context in the playground</li><li><Check />Manage API keys in one workspace</li><li><Check />Track usage and balance in the console</li></ul><a href={DOCS_URL} className="text-link">Explore the API documentation <Arrow /></a></div>
      <div className="api-card"><div className="api-card-header"><span><span className="status-dot" /> ONE REQUEST. A CLEAR ANSWER.</span><span>JSON</span></div><div className="api-endpoint"><span>POST</span> /v1/systemone</div><pre aria-label="Example API request"><code>{`{
  "model": "instinct-one-latest",
  "state": "I was charged twice this month.",
  "questions": {
    "route": {
      "type": "choice",
      "instructions": "Choose the right team.",
      "criteria": {
        "billing": "Payments and refunds",
        "support": "Technical issues"
      }
    }
  }
}`}</code></pre><div className="api-card-footer"><span>Authenticate with your API key.</span><a href={CONSOLE_URL}>Get started <Arrow diagonal /></a></div></div>
    </section>

    <section className="site-container access-section" id="access"><div><p className="eyebrow">MODEL ACCESS</p><h2>Built by us.<br />Put to work by you.</h2></div><div><p>Instinct One is a proprietary model, available through the OpenInstinct API. Model weights, training data, and implementation details are not publicly distributed.</p><p>Start in the console to explore available models and try your own use cases.</p><a href={CONSOLE_URL} className="text-link">Go to console <Arrow diagonal /></a></div></section>

    <section className="closing-section"><div className="site-container"><div className="closing-symbol" aria-hidden="true"><Mark /></div><p className="eyebrow">YOUR NEXT MOVE STARTS HERE</p><h2>Give your software<br />a little instinct.</h2><p>Bring a question. Make your first decision.</p><div className="hero-actions"><a href={CONSOLE_URL} className="button button-green">Open console <Arrow diagonal /></a><a href={DOCS_URL} className="text-link">Read the docs <Arrow /></a></div></div></section>
  </>;
}
