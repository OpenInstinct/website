// Copies measured numbers and recorded model outputs from the openinstinct repo
// into src/data/site-data.json. Nothing here is typed in by hand: every metric
// comes from results/<run_id>/metrics.json and every probability from
// results/<run_id>/predictions.jsonl.
//
//   bun run sync-data            (expects the repo at ../../python/openinstinct)
//   OPENINSTINCT_REPO=/path bun run sync-data

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const repo = resolve(
  process.env.OPENINSTINCT_REPO ?? join(import.meta.dir, "../../../python/openinstinct"),
);
if (!existsSync(join(repo, "results"))) {
  console.error(`No results/ under ${repo}. Set OPENINSTINCT_REPO.`);
  process.exit(1);
}

const readJson = (p: string) => JSON.parse(readFileSync(join(repo, p), "utf8"));
const readJsonl = (p: string) =>
  readFileSync(join(repo, p), "utf8")
    .split("\n")
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l));

// Runs shown on the site, in display order.
const RUNS: { id: string; label: string; note: string }[] = [
  { id: "phase0_uniform", label: "Uniform guess", note: "Equal probability on every option" },
  { id: "phase1_qwen_reranker_0p6b", label: "Qwen3-Reranker 0.6B", note: "Yes/no scorer per option, untrained" },
  { id: "phase1_qwen_base_1p7b", label: "Qwen3-1.7B-Base, letters", note: "Next-token logprobs of option letters, untrained" },
  { id: "phase2_lora_1p7b", label: "openinstinct 1.7B (LoRA)", note: "Phase 2 checkpoint" },
  { id: "hard_qwen_base_1p7b", label: "Qwen3-1.7B-Base, letters", note: "Untrained baseline" },
  { id: "hard_phase2_lora_1p7b", label: "openinstinct 1.7B (LoRA)", note: "Phase 2 checkpoint" },
  { id: "hard_jev_1p13_floor", label: "Jev (closed, via API)", note: "Probabilities floored at 0.005 before scoring" },
];

const METRIC_KEYS = [
  "accuracy", "nll", "brier", "ece", "adaptive_ece", "aurc",
  "latency_p50_ms", "latency_p95_ms", "questions_per_s",
] as const;

const pickMetrics = (d: Record<string, number>) => ({
  n: d.n_questions,
  ...Object.fromEntries(METRIC_KEYS.map((k) => [k, d[k]])),
});

const runs = RUNS.filter((r) => existsSync(join(repo, "results", r.id, "metrics.json"))).map((r) => {
  const m = readJson(`results/${r.id}/metrics.json`);
  return {
    ...r,
    predictor: m.predictor?.name ?? m.run_info?.config?.predictor?.name ?? null,
    commit: m.run_info?.git_commit ?? null,
    timestamp: m.run_info?.timestamp_utc ?? null,
    overall: pickMetrics(m.overall),
    datasets: Object.fromEntries(
      Object.entries(m.datasets).map(([name, d]) => [name, pickMetrics(d as Record<string, number>)]),
    ),
  };
});

// Recorded examples: for each domain, the first English state in file order that
// has the most distinct question types. Selection never looks at the predictions.
const EXAMPLE_RUN = "hard_phase2_lora_1p7b";
const EXAMPLE_SET = "oi_samples_all";
const preds = new Map<string, number[]>();
for (const p of readJsonl(`results/${EXAMPLE_RUN}/predictions.jsonl`)) {
  if (p.dataset === EXAMPLE_SET) preds.set(`${p.id}::${p.qid}`, p.probs);
}

type Rec = {
  id: string; source: string; lang: string; state: string;
  questions: { qid: string; text: string; type: string; options: string[]; target_probs: number[]; meta?: Record<string, unknown> }[];
};
const byDomain = new Map<string, Rec[]>();
for (const r of readJsonl(`data/processed/${EXAMPLE_SET}.jsonl`) as Rec[]) {
  if (r.lang !== "en") continue;
  const domain = r.source.split("/").pop()!;
  byDomain.set(domain, [...(byDomain.get(domain) ?? []), r]);
}

const examples = [...byDomain.entries()].map(([domain, recs]) => {
  const variety = (r: Rec) => new Set(r.questions.map((q) => q.type)).size;
  const best = recs.reduce((a, b) => (variety(b) > variety(a) ? b : a));
  return {
    id: best.id,
    domain,
    state: best.state,
    questions: best.questions
      .filter((q) => preds.has(`${best.id}::${q.qid}`))
      .map((q) => ({
        qid: q.qid,
        text: q.text,
        type: q.type,
        options: q.options,
        target_probs: q.target_probs,
        probs: preds.get(`${best.id}::${q.qid}`)!,
        difficulty: (q.meta?.difficulty as string) ?? null,
      })),
  };
}).filter((e) => e.questions.length > 0);

const out = {
  generated_at: new Date().toISOString(),
  example_run: EXAMPLE_RUN,
  runs,
  examples,
};
mkdirSync(join(import.meta.dir, "../src/data"), { recursive: true });
writeFileSync(join(import.meta.dir, "../src/data/site-data.json"), JSON.stringify(out, null, 1) + "\n");
console.log(`runs: ${runs.length}, examples: ${examples.length} -> src/data/site-data.json`);
