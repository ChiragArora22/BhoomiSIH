# AGENTS.md — BHOOMI-SETU-AI

Instructions for AI agents working in this repository. Read this before editing anything.
Detailed handoff docs are in `docs/Arena/`.

## What this project actually is

Idea submission for **Smart India Hackathon 2026, problem statement 26018** ("Intelligent Land
Record Digitization and Validation System", Dept. of Land Resources).

The thesis: India's revenue records are already self-validating. A village's own registers —
7/12 (Satbara), 8A Khatauni, mutation register, Khasra Pass-book — must satisfy arithmetic
identities. A mis-transcribed digit breaks an identity, so errors can be **detected and localised
with no labels, no ground truth and no GPU.** We validate against the record system's own
redundancy instead of trusting an OCR confidence score.

**The novel part lives in the sibling backend repo, not here.** This repo is the operator/citizen
UI plus deterministic client-side rule checks.

## Two repos — do not merge them

| Repo | Role |
|---|---|
| `BHOOMI-SETU-AI` (this one) | Frontend of record. React 18 + Vite + TS + Tailwind. |
| `land-record-validator` | Backend of record. FastAPI + Postgres 15/PostGIS 3.3, Alembic, pytest, Poetry (py 3.11.8). |

`land-record-validator/frontend/` is a 6-file React skeleton superseded by this repo. Do not
reconcile the two frontends; leave the skeleton alone and put all UI work here.

## Commands

```bash
npm run dev      # vite dev server
npm run build    # tsc && vite build  <- this is the check that gates a change
npx tsc --noEmit # typecheck only, fast
```
There is **no test runner** in this repo. `tsc` + `vite build` are the only automated checks, so a
change that doesn't pass them does not exist.

## Structure

```
src/components/{dashboard,digitization,gis,citizen,audit,learning,integration,layout}
src/context/LandRecordContext.tsx   # single source of state; localStorage-backed
src/data/sampleRecords.ts           # 5 synthetic demo records — the demo's spine
src/data/mockAnalytics.ts           # national baseline, transcribed from DoLR — see rules below
src/utils/validationRules.ts        # validateLandRecord(record, allRecords): ValidationIssue[]
src/utils/areaConverter.ts          # AREA_CONVERSIONS_TO_HECTARE — see BUG below
src/utils/cryptoAudit.ts            # calculateSHA256
src/utils/translations.ts           # en/hi/mr/ta/te dictionaries
src/types/{landRecord,gis,audit,learning}.ts
```

## Hard rules for this repo

1. **Never invent a number and display it as data.** Unpublished statistics are `null` in
   `src/data/mockAnalytics.ts` and render as `not published`. That convention is deliberate —
   do not "fix" a null by filling in a plausible value. National figures must be cited + dated.
2. **No AI-generated narration or TTS anywhere in submission assets.** SIH 2026 requires team
   voices in the demo video.
3. **BIGHA is not a constant.** `areaConverter.ts` has `BIGHA: 0.2529` with a comment claiming
   "Standard UP/MP". Bigha ranges roughly 0.1–0.7 ha by district (and *kaccha* vs *pucca* differs).
   Any new area code must take a region key. Do not add code that assumes the constant is safe.
4. **`cryptoAudit.ts` has a fallback that is not a hash.** If SubtleCrypto is unavailable it
   returns a 32-bit rolling hash while the UI still labels it "SHA-256". Either make the backend
   compute it (`backend/ingestion/pipeline.py::file_sha256` exists) or make the fallback throw.
   Never let it silently produce a weak value.
5. Don't write "blockchain" in user-facing copy unless there is an actual chain. What we have is an
   append-only log.

## Verification protocol for every change

```bash
npx tsc --noEmit && npm run build
```
Then, if you touched anything a judge sees on screen, run the render check:
```bash
npx vite build --ssr src/__ssr_entry.tsx --outDir .ssrout   # see docs/Arena/ENHANCEMENTS.md §6
node -e "import('./.ssrout/__ssr_entry.js').then(m=>console.log(m.render().replace(/<[^>]+>/g,' ')))"
```
Grep the output for the string you were supposed to remove. Passing `tsc` is not evidence a copy
change happened.

## What "done" means here

Nothing in this repo claims a model is trained. The repo contains **no training code and no
weights**, and the UI must keep saying so plainly ("planned, not trained"). Honest scoring beats
impressive scoring for this submission: a judge can open the repo.

## Motion

Animation lives in `src/index.css` as five small utilities plus
`src/utils/useCountUp.ts`. Animate transform/opacity only, always keep a valid static end
state, and never add motion without the matching `prefers-reduced-motion` opt-out. Do not
introduce an animation library for these effects.
