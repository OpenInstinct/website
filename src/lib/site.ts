import raw from "@/data/site-data.json";

export const REPO_URL = "https://github.com/OpenInstinct/openinstinct";

export type QuestionType = "choice" | "bool" | "multi" | "score";

export type Metrics = {
  n: number;
  accuracy: number;
  nll: number;
  brier: number;
  ece: number;
  adaptive_ece: number;
  aurc: number;
  latency_p50_ms: number;
  latency_p95_ms: number;
  questions_per_s: number;
};

export type Run = {
  id: string;
  label: string;
  note: string;
  predictor: string | null;
  commit: string | null;
  timestamp: string | null;
  overall: Metrics;
  datasets: Record<string, Metrics>;
};

export type ExampleQuestion = {
  qid: string;
  text: string;
  type: QuestionType;
  options: string[];
  target_probs: number[];
  probs: number[];
  difficulty: string | null;
};

export type Example = { id: string; domain: string; state: string; questions: ExampleQuestion[] };

export const siteData = raw as unknown as {
  generated_at: string;
  example_run: string;
  runs: Run[];
  examples: Example[];
};

export const run = (id: string) => siteData.runs.find((r) => r.id === id);

export const fmt = (x: number | undefined, digits = 3) =>
  x === undefined || x === null ? "not run" : x.toFixed(digits);

// States are often JSON serialised to a string; show them indented.
export function prettyState(state: string) {
  try {
    const v = JSON.parse(state);
    if (v && typeof v === "object") return JSON.stringify(v, null, 2);
  } catch {}
  return state;
}
