// Forwards a prediction request to an openinstinct inference server.
// The server address stays on the server side: set OPENINSTINCT_API_URL
// (and optionally OPENINSTINCT_API_KEY) in the environment. Without it the
// route answers 503 and the playground falls back to recorded examples.

const TYPES = new Set(["choice", "bool", "multi", "score"]);
const MAX_STATE_CHARS = 20_000;
const MAX_QUESTIONS = 16;
const MAX_OPTIONS = 255;

type Question = { qid: string; text: string; type: string; options: string[] };

function validate(body: unknown): { state: string; questions: Question[] } | string {
  const b = body as { state?: unknown; questions?: unknown };
  if (typeof b?.state !== "string" || !b.state.trim()) return "state must be a non-empty string";
  if (b.state.length > MAX_STATE_CHARS) return `state is longer than ${MAX_STATE_CHARS} characters`;
  if (!Array.isArray(b.questions) || b.questions.length === 0) return "add at least one question";
  if (b.questions.length > MAX_QUESTIONS) return `at most ${MAX_QUESTIONS} questions per request`;
  const questions: Question[] = [];
  for (const [i, q] of (b.questions as Partial<Question>[]).entries()) {
    if (typeof q?.text !== "string" || !q.text.trim()) return `question ${i + 1} has no text`;
    if (!TYPES.has(q.type ?? "")) return `question ${i + 1} has an unknown type`;
    const options = Array.isArray(q.options) ? q.options.filter((o) => typeof o === "string" && o.trim()) : [];
    if (options.length < 2) return `question ${i + 1} needs at least two options`;
    if (options.length > MAX_OPTIONS) return `question ${i + 1} has more than ${MAX_OPTIONS} options`;
    questions.push({ qid: q.qid ?? `q${i + 1}`, text: q.text, type: q.type!, options });
  }
  return { state: b.state, questions };
}

export async function POST(request: Request) {
  const base = process.env.OPENINSTINCT_API_URL;
  if (!base) {
    return Response.json({ error: "Live inference is not connected to this site yet." }, { status: 503 });
  }
  const parsed = validate(await request.json().catch(() => null));
  if (typeof parsed === "string") return Response.json({ error: parsed }, { status: 400 });

  const started = performance.now();
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/predict`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.OPENINSTINCT_API_KEY
          ? { authorization: `Bearer ${process.env.OPENINSTINCT_API_KEY}` }
          : {}),
      },
      body: JSON.stringify(parsed),
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) {
      return Response.json({ error: `The inference server answered ${res.status}.` }, { status: 502 });
    }
    const data = (await res.json()) as { results?: { qid: string; probs: number[] }[] };
    if (!Array.isArray(data.results)) {
      return Response.json({ error: "The inference server sent an unexpected response." }, { status: 502 });
    }
    return Response.json({ results: data.results, round_trip_ms: Math.round(performance.now() - started) });
  } catch {
    return Response.json({ error: "The inference server did not respond." }, { status: 504 });
  }
}
