import Link from "next/link";
import { Arrow, Check, Mark } from "@/components/icons";
import { DecisionDemo } from "@/components/decision-demo";
import { REPO_URL, run, siteData } from "@/lib/site";

export default function Home() {
  const checkpoint = run("phase2_lora_1p7b");
  const examples = siteData.examples.filter(e => ["support", "devops", "ecommerce"].includes(e.domain));
  return <>
    <section className="site-container hero">
      <div className="hero-copy">
        <div className="release-tag"><span className="status-dot" /> AN OPEN DECISION MODEL <span className="tag-divider" /> IN DEVELOPMENT</div>
        <h1>A small model.<br />A clear next <span className="accent-word">move.<svg viewBox="0 0 240 15" fill="none" aria-hidden="true"><path d="M3 10C64 0 162 0 237 7M30 14C99 7 163 6 216 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></span></h1>
        <p className="hero-description">Turn messy context into decisions your software can use. Give openinstinct a question and possible answers. Get a probability for each.</p>
        <div className="hero-actions"><Link href="/playground" className="button button-green">Explore the model <Arrow /></Link><a href={REPO_URL} className="text-link">View source <Arrow diagonal /></a></div>
        <div className="hero-note"><span className="note-line" /> Open source. Trained for decisions.</div>
      </div>
      <DecisionDemo examples={examples} />
    </section>

    <div className="model-strip"><div className="site-container model-strip-inner"><span className="micro-label">SMALL BY DESIGN.<br />PURPOSEFUL BY TRAINING.</span><div><strong>1.7B</strong><span>model parameters</span></div><div><strong>4</strong><span>question formats</span></div><div><strong>~{checkpoint ? Math.round(checkpoint.overall.latency_p50_ms) : "98"}<small> ms</small></strong><span>measured median latency*</span></div><div><strong>0</strong><span>generated tokens</span></div></div></div>

    <section className="site-container section-space" id="how-it-works">
      <div className="section-heading"><div><p className="eyebrow">01 / THE MODEL</p><h2>From context to a next step.</h2></div><p>A focused model for the moment<br className="desktop-break" /> your application needs to choose.</p></div>
      <div className="workflow">
        <article className="workflow-step"><span className="step-number">01</span><h3>Bring your context.</h3><p>A support ticket, an alert, a document, or JSON. Start with the information you already have.</p><div className="input-illustration" aria-hidden="true"><span><span className="file-symbol">≡</span> customer_message.txt <span>TXT</span></span><span><span className="file-symbol">{ "{ }" }</span> application_state.json <span>JSON</span></span></div></article>
        <article className="workflow-step model-step"><span className="step-number">02</span><h3>Ask. Define the options.</h3><p>You write the question and possible answers. The trained model evaluates each option.</p><div className="model-illustration"><span className="model-ring ring-one"/><span className="model-ring ring-two"/><Mark /><span className="model-chip">openinstinct decision model</span></div></article>
        <article className="workflow-step"><span className="step-number">03</span><h3>Make the next move.</h3><p>Use the scores to route a request, select an action, or send an uncertain case to a person.</p><div className="decision-illustration"><span className="micro-label">YOUR APPLICATION LOGIC</span><div><span className="branch-dot"/> Above your threshold <span>Take action <Arrow /></span></div><div><span className="branch-dot muted-dot"/> Needs a closer look <span>Human review <Arrow /></span></div></div></article>
      </div>
      <div className="formats"><span className="micro-label">ONE MODEL, FOUR WAYS TO ASK</span><span><i>01</i> Yes / No</span><span><i>02</i> Choose one</span><span><i>03</i> Choose several</span><span><i>04</i> Score a range</span></div>
      <p className="technical-footnote">The current checkpoint scores one question per pass. Multi-question inference and improved calibration are planned.</p>
    </section>

    <section className="progress-section" id="progress"><div className="site-container section-space">
      <div className="section-heading"><div><p className="eyebrow">02 / BUILDING IN THE OPEN</p><h2>A working model.<br />An open road ahead.</h2></div><p>From the first data pipeline to a trained checkpoint.<br className="desktop-break" /> Here is what we have built, and what comes next.</p></div>
      <div className="progress-grid">
        <article className="checkpoint-card"><div className="card-topline"><Mark /><span className="pill">CURRENT CHECKPOINT</span></div><div><p className="micro-label">OPENINSTINCT / PHASE 02</p><h3>The first instinct.</h3><p>Our first trained decision model: 1.7 billion parameters, a dedicated scoring head, and probabilities over your own answer options.</p></div><div className="checkpoint-bottom"><span><span className="status-dot" /> Trained & evaluated</span><span>Weights not yet released</span></div></article>
        <article className="built-card"><p className="micro-label">ALREADY BUILT</p><h3>The foundation is in place.</h3><ul><li><Check /><span>A shared input and question format</span></li><li><Check /><span>Dataset converters and evaluation tools</span></li><li><Check /><span>Baseline models for comparison</span></li><li><Check /><span>A trained decision-model checkpoint</span></li></ul><a href={REPO_URL} className="text-link">Explore the repository <Arrow diagonal /></a></article>
        <article className="next-card"><div><p className="micro-label">IN REVIEW → UP NEXT</p><h3>Better confidence. Broader capability.</h3><p>Accuracy passed the first gate. Calibration still needs work on BoolQ and RACE. Next: multiple questions per pass, synthetic training data, and a release of the weights.</p></div><Link href="/results" className="text-link">See the evaluation <Arrow /></Link></article>
      </div>
      <p className="technical-footnote">* Median latency from the Phase 2 evaluation run; not a live API guarantee. <Link href="/results">See measurements and limitations <Arrow /></Link></p>
    </div></section>

    <section className="site-container closing-section"><div className="closing-symbol" aria-hidden="true"><Mark /></div><p className="eyebrow">MEET YOUR NEXT DECISION LAYER</p><h2>Less guesswork.<br />More instinct.</h2><p>Explore recorded examples. Inspect the scores.<br />Follow the model as it grows.</p><div className="hero-actions"><Link href="/playground" className="button button-green">Open the playground <Arrow /></Link><a href={REPO_URL} className="text-link">Build with us <Arrow diagonal /></a></div></section>
  </>;
}
