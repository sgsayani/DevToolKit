# DevKit

A fast, practical developer utility platform — JSON tools, encoding, generators, and web utilities, all running locally in the browser.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # eslint
```

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · shadcn/ui · next-themes

No backend and no database — every tool in Phase 1 processes input entirely client-side, so nothing you paste in ever leaves your browser.

## Adding a new tool

Tools are registered in one place: [`src/lib/tools/registry.ts`](src/lib/tools/registry.ts). To add one:

1. Write the pure logic as functions in `src/lib/utils/<name>.ts`.
2. Write the UI in `src/components/tools/<category>/<name>.tsx`.
3. Add one entry to `registry.ts`.

The dynamic route, sidebar, command palette (⌘K), and homepage search all read from that registry automatically — no routing or layout changes needed.
