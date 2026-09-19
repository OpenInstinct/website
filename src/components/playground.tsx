"use client";

import { useState } from "react";
import { ProbBars } from "@/components/prob-bars";
import { prettyState, type Example, type QuestionType } from "@/lib/site";

type Draft = { qid: string; text: string; type: QuestionType; optionsText: string };
type Scored = { probs: number[]; targets?: number[] };

const TYPE_HELP: Record<QuestionType, string> = {
  bool: "Yes or no",
  choice: "Exactly one option",
  multi: "Any number of options",
  score: "Bins on a range",
};

const toDrafts = (e: Example): Draft[] =>
  e.questions.map((q) => ({ qid: q.qid, text: q.text, type: q.type, optionsText: q.options.join("\n") }));

const recorded = (e: Example): Record<string, Scored> =>
  Object.fromEntries(e.questions.map((q) => [q.qid, { probs: q.probs, targets: q.target_probs }]));

const splitOptions = (t: string) => t.split("\n").map((o) => o.trim()).filter(Boolean);

export function Playground({ live, examples, exampleRun, initialExampleId }: { live: boolean; examples: Example[]; exampleRun: string; initialExampleId?: string }) {
  const first = examples.find((e) => e.id === initialExampleId) ?? examples.find((e) => e.domain === "support") ?? examples[0];
  const [exampleId, setExampleId] = useState<string | null>(first?.id ?? null);
  const [state, setState] = useState(first ? prettyState(first.state) : "");
  const [drafts, setDrafts] = useState<Draft[]>(first ? toDrafts(first) : []);
  const [scores, setScores] = useState<Record<string, Scored>>(first ? recorded(first) : {});
  const [source, setSource] = useState<"recorded" | "live" | null>(first ? "recorded" : null);
  const [roundTrip, setRoundTrip] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [nextId, setNextId] = useState(1);

  function loadExample(e: Example) {
    setExampleId(e.id);
    setState(prettyState(e.state));
    setDrafts(toDrafts(e));
    setScores(recorded(e));
    setSource("recorded");
    setRoundTrip(null);
    setError(null);
  }

  // Any edit invalidates the scores on screen: they no longer describe the input.
  function edited() {
    setExampleId(null);
    setScores({});
    setSource(null);
    setRoundTrip(null);
    setError(null);
  }

  function updateDraft(i: number, patch: Partial<Draft>) {
    setDrafts((ds) => ds.map((d, j) => (j === i ? { ...d, ...patch } : d)));
    edited();
  }

  function addQuestion() {
    setDrafts((ds) => [...ds, { qid: `custom_${nextId}`, text: "", type: "bool", optionsText: "yes\nno" }]);
    setNextId((n) => n + 1);
    edited();
  }

  async function runModel() {
    setRunning(true);
    setError(null);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          state,
          questions: drafts.map((d) => ({ qid: d.qid, text: d.text, type: d.type, options: splitOptions(d.optionsText) })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "The request failed.");
        return;
      }
      setScores(Object.fromEntries(data.results.map((r: { qid: string; probs: number[] }) => [r.qid, { probs: r.probs }])));
      setSource("live");
      setRoundTrip(data.round_trip_ms ?? null);
    } catch {
      setError("Could not reach the site's prediction endpoint. Check your connection and run again.");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-8">
      <div className="playground-heading"><div><p className="eyebrow">EXPLORE / PLAYGROUND</p><h1 className="mt-4 font-display text-4xl font-medium tracking-tight sm:text-5xl">A closer look at a decision.</h1></div><span className="playground-mode">{live ? "Live inference connected" : "Recorded examples"}</span></div>
      <p className="playground-intro">{live ? "Choose an example or bring your own context. Ask a question, define the options, and run the model." : "Pick a real example. Explore the context, the questions, and the probability of each answer. Live inference is not connected yet."}</p>
      <details className="playground-provenance"><summary>About these examples</summary><p>Outputs are recorded from the Phase 2 checkpoint ({exampleRun}). Examples were selected by position, not by correctness. Gold markers show reference labels. Model weights are not yet released.</p></details>

      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Examples">
        {examples.map((e) => (
          <button
            key={e.id}
            disabled={running}
            onClick={() => loadExample(e)}
            aria-pressed={exampleId === e.id}
            className={`rounded-md border px-3.5 py-2 text-sm ${e.domain.length <= 2 ? "uppercase" : "capitalize"} ${
              exampleId === e.id ? "border-ink bg-ink text-ground" : "border-line hover:border-ink"
            }`}
          >
            {e.domain}
          </button>
        ))}
      </div>

      <fieldset disabled={running} className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div>
          <label htmlFor="state" className="font-medium">
            Input
          </label>
          <p className="text-sm text-muted">Any text: a ticket, a log line, an email, a JSON payload.</p>
          <textarea
            id="state"
            value={state}
            onChange={(e) => {
              setState(e.target.value);
              edited();
            }}
            spellCheck={false}
            className="mt-2 h-80 w-full resize-y rounded-xl border border-line bg-panel p-4 font-mono text-xs leading-relaxed lg:h-[34rem]"
          />
        </div>

        <div className="flex flex-col gap-4">
          {drafts.map((d, i) => {
            const s = scores[d.qid];
            const options = splitOptions(d.optionsText);
            return (
              <article key={d.qid} className="rounded-xl border border-line bg-panel p-4">
                <div className="flex flex-wrap items-start gap-2 sm:flex-nowrap">
                  <textarea
                    aria-label={`Question ${i + 1}`}
                    value={d.text}
                    rows={2}
                    placeholder="Ask something about the input"
                    onChange={(e) => updateDraft(i, { text: e.target.value })}
                    className="min-w-0 flex-1 basis-full resize-y rounded-lg sm:basis-0 border border-line bg-white px-3 py-2 font-medium"
                  />
                  <select
                    aria-label={`Answer type of question ${i + 1}`}
                    value={d.type}
                    onChange={(e) => updateDraft(i, { type: e.target.value as QuestionType })}
                    className="h-10 rounded-lg border border-line bg-white px-2 text-sm"
                  >
                    {(Object.keys(TYPE_HELP) as QuestionType[]).map((t) => (
                      <option key={t} value={t}>
                        {TYPE_HELP[t]}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      setDrafts((ds) => ds.filter((_, j) => j !== i));
                      edited();
                    }}
                    aria-label={`Remove question ${i + 1}`}
                    className="h-10 rounded-lg border border-line px-3 text-muted hover:border-ink hover:text-ink"
                  >
                    ×
                  </button>
                </div>

                {s && s.probs.length === options.length ? (
                  <div className="mt-4">
                    <ProbBars options={options} probs={s.probs} targets={s.targets} independent={d.type === "multi"} />
                    <button onClick={() => updateDraft(i, {})} className="mt-3 text-sm text-signal underline">
                      Edit options
                    </button>
                  </div>
                ) : (
                  <textarea
                    aria-label={`Options of question ${i + 1}, one per line`}
                    value={d.optionsText}
                    onChange={(e) => updateDraft(i, { optionsText: e.target.value })}
                    rows={Math.min(Math.max(options.length + 1, 3), 8)}
                    placeholder="One option per line"
                    className="mt-3 w-full resize-y rounded-lg border border-line bg-white px-3 py-2 text-sm"
                  />
                )}
              </article>
            );
          })}

          <div className="flex flex-wrap items-center gap-3">
            <button onClick={addQuestion} className="rounded-md border border-ink px-5 py-2.5 font-medium hover:bg-ink hover:text-ground">
              Add question
            </button>
            <button
              onClick={runModel}
              disabled={!live || running || drafts.length === 0}
              className="rounded-md bg-signal px-5 py-2.5 font-medium text-white hover:bg-ink disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
            >
              {running ? "Running…" : "Run model"}
            </button>
            {source === "live" && roundTrip !== null && (
              <span className="text-sm text-muted">Scored live, {roundTrip} ms round trip</span>
            )}
            {source === "recorded" && (
              <span className="text-sm text-muted">
                Recorded output. Gold tick: reference label.
              </span>
            )}
          </div>

          {!live && source === null && (
            <p className="rounded-xl border border-gold/50 bg-gold/10 p-4 text-sm leading-relaxed">
              This preview shows recorded examples only. Choose an example above to restore its results. Scoring your edits will be available when live inference is connected.
            </p>
          )}
          {error && (
            <p role="alert" className="rounded-xl border border-red-700/40 bg-red-700/10 p-4 text-sm">
              {error}
            </p>
          )}
        </div>
      </fieldset>
    </div>
  );
}
