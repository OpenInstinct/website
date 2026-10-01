# OpenInstinct website

Public product website for Instinct One. Next.js App Router, Tailwind CSS, Bun.

```sh
bun install --frozen-lockfile
bun run dev
bun run lint
bun run build
```

The console defaults to https://console.openinstinct.dev and documentation to
https://docs.openinstinct.dev/docs. Override these at build time using the public
variables in `.env.example`.

## Public content boundary

This website contains product capabilities and editorial examples only. Demo
scores are illustrative, not recorded predictions or benchmark claims. Do not
import model artifacts, training data, evaluation runs, internal identifiers,
architecture details, or inference credentials into this project.

The former `/results` page redirects to the product overview. `/playground`
redirects to the authenticated console playground. The old `/api/predict`
endpoint returns 410 and makes no upstream request. Real inference uses the
console or the authenticated public API.

Model access is proprietary; the site does not advertise source or weight releases.
