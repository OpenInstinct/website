import type { Metadata } from "next";
import { REPO_URL, fmt, run, type Run } from "@/lib/site";

export const metadata: Metadata = { title: "Evaluation | openinstinct" };

const HELD_OUT = [
  { key: "banking77_test", label: "Banking77", detail: "77 intents" },
  { key: "boolq_validation", label: "BoolQ", detail: "yes / no" },
  { key: "race_high_test", label: "RACE-H", detail: "4 options" },
];
const HELD_OUT_RUNS = ["phase0_uniform", "phase1_qwen_reranker_0p6b", "phase1_qwen_base_1p7b", "phase2_lora_1p7b"];
const HARD_RUNS = ["hard_qwen_base_1p7b", "hard_phase2_lora_1p7b", "hard_jev_1p13_floor"];

function isOurs(r: Run) {
  return r.predictor === "openinstinct";
}

// Keep presentation labels separate from the original evaluation metadata.
// Exact model identities and training details remain in the linked repository.
function modelLabel(r: Run) {
  switch (r.predictor) {
    case "qwen_reranker":
      return "Reranker baseline · 0.6B";
    case "qwen_base":
      return "Base model baseline · 1.7B";
    case "openinstinct":
      return "openinstinct · 1.7B";
    default:
      return r.label;
  }
}

export default function ResultsPage() {
  const checkpoint = run("phase2_lora_1p7b");
  const hardOurs = run("hard_phase2_lora_1p7b")?.datasets.oi_samples_hard;
  const hardJev = run("hard_jev_1p13_floor")?.datasets.oi_samples_hard;
  return (
      <section id="results" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-8">
        <p className="eyebrow">RESEARCH / EVALUATION</p><h1 className="mt-4 font-display text-5xl font-semibold tracking-tight">The evidence behind the model.</h1>
        <p className="mt-4 max-w-[68ch] leading-relaxed text-muted">
          Every number on this page is copied by a script from a <code>metrics.json</code> written by
          the evaluation harness in the repository. Held-out sets never enter training. ECE is the
          expected calibration error with 15 bins; lower is better.
        </p>

        {checkpoint && <div className="mt-7 rounded-lg border border-line bg-panel p-5 text-sm text-muted"><p className="font-medium text-ink">Phase 2 timing</p><p className="mt-2">{Math.round(checkpoint.overall.latency_p50_ms)} ms median · {Math.round(checkpoint.overall.latency_p95_ms)} ms at the 95th percentile · {checkpoint.overall.n.toLocaleString("en-US")} evaluated questions.</p><p className="mt-2 text-xs">Measured across the full evaluation run, including the adversarial set. Hardware and workload affect timing; these are recorded measurements, not live API guarantees.</p></div>}

        <h2 className="mt-12 font-display text-xl font-semibold">Public held-out sets</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[44rem] border-collapse text-sm"><caption className="sr-only">Accuracy and calibration error on public held-out datasets</caption>
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
                      {modelLabel(r)}
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

        <h2 className="mt-14 font-display text-xl font-semibold">Hard cases, next to a closed model</h2>
        <p className="mt-3 max-w-[68ch] leading-relaxed text-muted">
          {hardOurs && hardJev ? (
            <>
              On {hardOurs.n} deliberately hard questions from our own sample set (date arithmetic,
              negation, borderline judgement), Jev answers {(hardJev.accuracy * 100).toFixed(1)}% correctly and
              the current checkpoint {(hardOurs.accuracy * 100).toFixed(1)}%. The Phase 2 model has only seen
              converted public datasets; closing this gap is what the next phases are for.
            </>
          ) : (
            "Hard-case comparison: not run."
          )}
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-sm"><caption className="sr-only">Model comparison on hard cases</caption>
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
                      {modelLabel(r)}
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
          Exact model identities, training details, and full result tables are in{" "}
          <a className="underline" href={`${REPO_URL}/blob/main/docs/RESULTS.md`}>
            docs/RESULTS.md
          </a>
          .
        </p>
      </section>

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
