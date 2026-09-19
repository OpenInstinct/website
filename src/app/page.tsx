import Link from "next/link";
import { ProbBars } from "@/components/prob-bars";
import { REPO_URL, fmt, prettyState, run, siteData, type Run } from "@/lib/site";

const HELD_OUT = [
  { key: "banking77_test", label: "Banking77", detail: "77 intents" },
  { key: "boolq_validation", label: "BoolQ", detail: "yes / no" },
  { key: "race_high_test", label: "RACE-H", detail: "4 options" },
];
const HELD_OUT_RUNS = ["phase0_uniform", "phase1_qwen_reranker_0p6b", "phase1_qwen_base_1p7b", "phase2_lora_1p7b"];
const HARD_RUNS = ["hard_qwen_base_1p7b", "hard_phase2_lora_1p7b", "hard_jev_1p13_floor"];

const PHASES = [
  { name: "Foundation", what: "Schema, dataset converters, evaluation harness, metrics tests", state: "done" },
  { name: "Baselines", what: "Untrained Qwen3 and Qwen3-Reranker through the same harness", state: "done" },
  {
    name: "Simplest trained head",
    what: "LoRA on Qwen3-1.7B-Base, one question per pass. Accuracy gate passed; calibration on BoolQ and RACE did not beat the baseline, so it is under review",
    state: "in review",
  },
  { name: "Full architecture", what: "Many questions per pass, option-order invariance, custom attention mask", state: "not started" },
  { name: "Dataset", what: "Openly licensed synthetic training set with soft labels", state: "not started" },
  { name: "Calibration", what: "Per-type temperature, target ECE at or below 0.03", state: "not started" },
  { name: "Release", what: "Weights, dataset card, inference server", state: "not started" },
];

function isOurs(r: Run) {
  return r.predictor === "openinstinct";
}

export default function Home() {
  const hero = siteData.examples.find((e) => e.domain === "devops") ?? siteData.examples[0];
  const heroQ = hero.questions[0];
  const phase2 = run("phase2_lora_1p7b");
  const hardOurs = run("hard_phase2_lora_1p7b")?.datasets.oi_samples_hard;
  const hardJev = run("hard_jev_1p13_floor")?.datasets.oi_samples_hard;

  return (
    <>
      <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 pt-14 pb-20 sm:px-8 lg:grid-cols-[1fr_minmax(0,30rem)] lg:gap-14 lg:pt-24">
        <div className="min-w-0">
          <h1 className="font-display text-5xl leading-[1.02] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Decisions as probabilities, not paragraphs.
          </h1>
          <p className="mt-7 max-w-[58ch] text-lg leading-relaxed text-muted">
            openinstinct reads any text or JSON, takes your questions with your own answer options,
            and returns a probability for each option. One forward pass of a small Qwen3 model, no
            text generation, so an answer takes about{" "}
            {phase2 ? `${Math.round(phase2.overall.latency_p50_ms)} ms` : "a tenth of a second"} on
            one GPU. It is an open alternative to closed decision models such as Jev.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/playground"
              className="rounded-full bg-signal px-6 py-3 font-medium text-white hover:bg-ink"
            >
              Open playground
            </Link>
            <a
              href={REPO_URL}
              className="rounded-full border border-ink px-6 py-3 font-medium hover:bg-ink hover:text-ground"
            >
              Read the source
            </a>
          </div>
          <p className="mt-6 max-w-[58ch] text-sm text-muted">
            Work in progress. Weights are not released yet, and the numbers below include the places
            where the model is still behind.
          </p>
        </div>

        <figure className="min-w-0 self-start rounded-2xl border border-line bg-panel">
          <pre className="max-h-56 overflow-auto border-b border-line p-5 font-mono text-xs leading-relaxed text-muted">
            {prettyState(hero.state)}
          </pre>
          <div className="p-5">
            <p className="mb-4 font-medium">{heroQ.text}</p>
            <ProbBars
              options={heroQ.options}
              probs={heroQ.probs}
              targets={heroQ.target_probs}
              independent={heroQ.type === "multi"}
            />
          </div>
          <figcaption className="border-t border-line px-5 py-3 text-xs text-muted">
            Recorded output of the Phase 2 checkpoint. The gold tick is the reference label from an
            eight-vote ensemble.
          </figcaption>
        </figure>
      </section>

      <section className="border-y border-line bg-panel">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-8 md:grid-cols-3">
          <div>
            <h2 className="font-display text-2xl font-semibold">Your options, not a fixed label set</h2>
            <p className="mt-3 leading-relaxed text-muted">
              Yes or no, one of many, several at once, or a score on a range. Options are plain text
              you write per request, up to 255 per question. Nothing is retrained when they change.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold">Probabilities you can threshold</h2>
            <p className="mt-3 leading-relaxed text-muted">
              The goal is calibration: when the model says 80%, it should be right about 80% of the
              time. Every run reports ECE, Brier score and selective risk next to accuracy, so you
              can decide when to act and when to send a case to a person.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold">No generation step</h2>
            <p className="mt-3 leading-relaxed text-muted">
              A marker token after each option is scored by a small head on top of Qwen3&apos;s
              hidden states. There is no decoding loop, no output to parse, and latency does not grow
              with the length of an answer.
            </p>
          </div>
        </div>
      </section>

      <section id="results" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-8">
        <h2 className="font-display text-4xl font-semibold tracking-tight">Measured so far</h2>
        <p className="mt-4 max-w-[68ch] leading-relaxed text-muted">
          Every number on this page is copied by a script from a <code>metrics.json</code> written by
          the evaluation harness in the repository. Held-out sets never enter training. ECE is the
          expected calibration error with 15 bins; lower is better.
        </p>

        <h3 className="mt-12 font-display text-xl font-semibold">Public held-out sets</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[44rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink text-left">
                <th className="py-2 pr-4 font-medium">Model</th>
                {HELD_OUT.map((d) => (
                  <th key={d.key} colSpan={2} className="py-2 pr-4 font-medium">
                    {d.label} <span className="font-normal text-muted">{d.detail}</span>
                  </th>
                ))}
              </tr>
              <tr className="border-b border-line text-left text-muted">
                <th />
                {HELD_OUT.map((d) => (
                  <Fragmented key={d.key} />
                ))}
              </tr>
            </thead>
            <tbody>
              {HELD_OUT_RUNS.map((id) => {
                const r = run(id);
                if (!r) return null;
                return (
                  <tr key={id} className={`border-b border-line ${isOurs(r) ? "bg-signal-soft font-medium" : ""}`}>
                    <td className="py-3 pr-4 pl-2">
                      {r.label}
                      <span className="block text-xs font-normal text-muted">{r.note}</span>
                    </td>
                    {HELD_OUT.map((d) => (
                      <MetricCells key={d.key} acc={r.datasets[d.key]?.accuracy} ece={r.datasets[d.key]?.ece} />
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <h3 className="mt-14 font-display text-xl font-semibold">Hard cases, next to a closed model</h3>
        <p className="mt-3 max-w-[68ch] leading-relaxed text-muted">
          {hardOurs && hardJev ? (
            <>
              On {hardOurs.n} deliberately hard questions from our own sample set (date arithmetic,
              negation, borderline judgement), Jev answers {fmt(hardJev.accuracy, 2)} correctly and
              the current checkpoint {fmt(hardOurs.accuracy, 2)}. The Phase 2 model has only seen
              converted public datasets; closing this gap is what the next phases are for.
            </>
          ) : (
            "Hard-case comparison: not run."
          )}
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink text-left">
                <th className="py-2 pr-4 font-medium">Model</th>
                <th className="py-2 pr-4 font-medium">Accuracy</th>
                <th className="py-2 pr-4 font-medium">ECE</th>
                <th className="py-2 pr-4 font-medium">Brier</th>
                <th className="py-2 pr-4 font-medium">NLL</th>
              </tr>
            </thead>
            <tbody>
              {HARD_RUNS.map((id) => {
                const r = run(id);
                const d = r?.datasets.oi_samples_hard;
                if (!r) return null;
                return (
                  <tr key={id} className={`border-b border-line ${isOurs(r) ? "bg-signal-soft font-medium" : ""}`}>
                    <td className="py-3 pr-4 pl-2">
                      {r.label}
                      <span className="block text-xs font-normal text-muted">{r.note}</span>
                    </td>
                    <td className="py-3 pr-4">{fmt(d?.accuracy)}</td>
                    <td className="py-3 pr-4">{fmt(d?.ece)}</td>
                    <td className="py-3 pr-4">{fmt(d?.brier)}</td>
                    <td className="py-3 pr-4">{fmt(d?.nll)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted">
          Full tables with slices by question type, option count and input length are in{" "}
          <a className="underline" href={`${REPO_URL}/blob/main/docs/RESULTS.md`}>
            docs/RESULTS.md
          </a>
          .
        </p>
      </section>

      <section id="status" className="border-t border-line bg-panel">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-8">
          <h2 className="font-display text-4xl font-semibold tracking-tight">Where the project is</h2>
          <p className="mt-4 max-w-[68ch] leading-relaxed text-muted">
            The work runs in phases, each ending at a gate with tests and written numbers. A phase
            that misses its gate gets investigated before the next one starts.
          </p>
          <ol className="mt-10 grid gap-x-10 sm:grid-cols-2">
            {PHASES.map((p, i) => (
              <li key={p.name} className="flex gap-4 border-t border-line py-5">
                <span className="w-6 shrink-0 font-display text-xl font-semibold text-muted">{i}</span>
                <div>
                  <p className="font-medium">
                    {p.name}{" "}
                    <span
                      className={`ml-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.state === "done"
                          ? "bg-ink text-ground"
                          : p.state === "in review"
                            ? "bg-gold text-white"
                            : "border border-line text-muted"
                      }`}
                    >
                      {p.state}
                    </span>
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{p.what}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}

function Fragmented() {
  return (
    <>
      <th className="py-1.5 pr-4 text-xs font-normal">accuracy</th>
      <th className="py-1.5 pr-4 text-xs font-normal">ECE</th>
    </>
  );
}

function MetricCells({ acc, ece }: { acc?: number; ece?: number }) {
  return (
    <>
      <td className="py-3 pr-4">{fmt(acc)}</td>
      <td className="py-3 pr-4">{fmt(ece)}</td>
    </>
  );
}
