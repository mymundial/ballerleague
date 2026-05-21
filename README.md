# Baller League — Phase 1 Tournament Refactor

This ZIP contains the Phase 1 logic refactor of the original Monday Cup penalty game into a 12-team Baller League format.

## What changed

- Replaced groups/Round-of-32 logic with a 12-team league table.
- Added single round-robin fixture generation: 11 gameweeks, 66 fixtures.
- Added top-four qualification.
- Added Final Four playoffs: 1st vs 4th, 2nd vs 3rd, then Championship Final.
- Kept the existing penalty gameplay and match presentation.
- Updated screens to use League / Playoffs labels.

## Run locally

```bash
npm install
npm run dev
```

## Deploy on Vercel

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`

## Main new files

- `src/logic/ballerLeague.js`
- `src/data/teams.js`
- `src/data/assets.js`
- `src/components/layout/Layout.jsx`
- updated `src/App.jsx`
- updated schedule, standings, and selection screens
