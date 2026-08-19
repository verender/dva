# Two Years, In Frame

Private 2-year anniversary microsite. Trailer → 3D constellation → Wrapped-style
stats → finale. Built with Vite + React 19 + TypeScript + Tailwind + React
Three Fiber. See `../../CLAUDE.md` at the repo root for the full architecture
notes.

## Local setup

```bash
npm install
npm run dev
```

## Access gate

The whole site sits behind a PIN, enforced server-side by a Netlify Edge
Function (`netlify/edge-functions/gate.ts`) that runs in front of every
request — the app shell, the JS bundle, and every photo/video/audio file
under `public/`. Unlike a client-side check, the PIN is never sent to the
browser until it's typed and verified, so it can't be read out of the JS
bundle via devtools.

Set an env var named **`SITE_PIN`** in the Netlify dashboard (Site settings
→ Environment variables) — deliberately **not** prefixed `VITE_`, since that
prefix is what tells Vite to inline a var into the client bundle, which is
exactly what this avoids. `netlify dev` reads the same dashboard-linked env
vars locally if you want to test the gate before deploying; `npm run dev`
alone (plain Vite) bypasses the gate entirely since it doesn't run Netlify's
edge runtime — that's expected and fine for day-to-day UI work.

This is paired with `noindex`/`robots.txt` so the deployed URL also doesn't
get indexed by search engines.

## Media

- **Photos, video, and audio** (`public/photos/`, `public/video/`,
  `public/audio/`) are all committed directly into the repo as regular
  files. [Netlify Large Media](https://docs.netlify.com/large-media/overview/)
  (the Git-LFS-backed option originally planned here) was deprecated by
  Netlify in 2023 and its CLI setup command no longer exists, so it's not an
  option for this project. Fine in practice since nothing here approaches
  GitHub's 100MB single-file limit — if a future video/audio file gets close
  to that, compress it before committing rather than reaching for LFS.

## Build

```bash
npm run build     # tsc -b && vite build -> dist/
npm run preview
```
