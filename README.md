# AWS SAA-C03 — Progress Tracker

A premium, installable, offline-capable personal study tracker for the **AWS
Certified Solutions Architect – Associate (SAA-C03)** exam. Pure client-side
(React + TypeScript + Vite), data stored locally in IndexedDB, deployable free on
GitHub Pages.

Started 2026-07-27 · Exam target 2026-10-31 · 14-week program · 4 domains · 44
topics · 24 detailed labs · 120 study hours.

> ⚠️ The curriculum topics and exam-angle blurbs are a study aid, not official
> AWS material — verify against the current SAA-C03 exam guide.

## Features
- **Dashboard** — weighted progress ring, stat tiles, pace/finish-date forecast,
  domain completion bars.
- **Topics** — 44 objectives as cards: complete, 1–5 confidence, bookmark,
  exam-angle blurb, autosaving notes, weak/strong tags, revision counter; search
  + domain/status filters + sort.
- **Labs** — hands-on exercises with status, time taken, skills, mistakes,
  reflection, notes, and file attachments (screenshots/config) in IndexedDB.
- **Log** — quick + custom session logging, a study heatmap, session history with
  undo.
- **Analytics** — hours by week/month, confidence distribution, weak areas,
  projection.
- **Goals** — adjustable weekly hours target + auto-unlocking achievements.
- **PWA** — installable, works offline, light/dark/system themes.

## Develop
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs static site to ./docs
```

## Deploy (free, GitHub Pages)
1. Create a GitHub repo (e.g. `aws-saa`). If the repo name is **not** `aws-saa`,
   set `BASE` in `vite.config.ts` to `'/<your-repo-name>/'` and rebuild.
2. `npm run build` (outputs to `docs/`), commit, and push.
3. Repo → **Settings → Pages → Source: `main` branch, `/docs` folder**.
4. Your app: `https://<user>.github.io/<repo>/`. Open on mobile → **Add to Home
   Screen** to install.

## Stack
Vite · React · TypeScript · react-router (HashRouter) · Zustand + IndexedDB ·
vite-plugin-pwa · CSS Modules. No CDNs, no chart/icon libraries — fully
self-contained and offline-safe.
