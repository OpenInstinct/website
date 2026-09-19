# openinstinct website

Landing page and playground for [openinstinct](https://github.com/OpenInstinct/openinstinct),
an open decision model on Qwen3. Next.js (App Router), Tailwind, bun.

```
bun install
bun run sync-data   # copy metrics + recorded outputs from the openinstinct repo
bun run dev
bun run lint && bun run build
```

## Where the numbers come from

Nothing on the site is typed in by hand. `scripts/sync-data.ts` reads
`results/<run_id>/metrics.json`, `results/<run_id>/predictions.jsonl` and
`data/processed/oi_samples_all.jsonl` from the openinstinct repo (default
`../../python/openinstinct`, override with `OPENINSTINCT_REPO`) and writes
`src/data/site-data.json`. Re-run it after every new evaluation run. Playground
examples are chosen by position in the sample files, never by looking at the
predictions.

The model overview and progress cards in `src/app/page.tsx` are hand-maintained;
update them at every gate. Detailed benchmark tables live at `/results`. The home
page demo uses recorded support, DevOps, and commerce examples; its links open the
same example in `/playground?example=<id>`. Context summaries in the demo are
editorial; all displayed probabilities come from the recorded data.

## Live inference

The playground shows recorded outputs until a server is connected. Set
`OPENINSTINCT_API_URL` (see `.env.example`); `/api/predict` then forwards

```
POST {OPENINSTINCT_API_URL}/predict
{ "state": "...", "questions": [{ "qid": "q1", "text": "...", "type": "bool|choice|multi|score", "options": ["..."] }] }
-> { "results": [{ "qid": "q1", "probs": [0.9, 0.1] }] }
```

This shape follows the repo's own schema. The Phase 6 server is planned to mirror
TypeSafe's public request format instead; adjust `src/app/api/predict/route.ts`
when that lands.
