# 🌳 Quest Tree

A visual, motivating **skill tree** for raising kids (roughly ages 9–18) who are genuinely
ready to leave home — plus an **Emancipation Track**: freedoms handed over by age,
unconditionally. *Competence buys autonomy* on one track; the other track guarantees the
autonomy that can't be earned without a control battle.

Built for one family (five kids); designed to be customized and shared, not obeyed.

## What's here

- **14 lanes, 189 skills** in `src/content/lanes/` — each node has an observable
  "got it when" description, concrete examples, build suggestions, prerequisites, and
  (on competence lanes) real-world unlocks. Two reference lanes set the style:
  **Money & Work** (competence) and **Facing Hard Things** (character).
- **The Emancipation Track** in `src/content/emancipation.json` — the default freedom
  calendar (ages adjustable in-app), the four rules, the sorting test, and a starter
  Expectations & Consequences list.
- **A local-first web app** — React + Vite, no backend, no accounts. Per-kid progress
  lives in your browser (`localStorage`) with JSON export/import for backup and for
  sharing your customized tree with another family.
- **Printable check-in sheets** — every lane has a 🖨 paper sheet (skill · "got it
  when" · not yet / working / got it), built for the one-kid-one-lane-two-weeks pilot.

## Run it

```bash
npm install
npm run dev        # local dev server
npm run validate   # check the content graph (schema, prereqs, cycles, node rules)
npm run build      # validate + typecheck + production build (static, in dist/)
```

The build is fully static — host `dist/` anywhere (GitHub Pages workflow included in
`.github/workflows/deploy.yml`; enable Pages → GitHub Actions in repo settings).

## The design in 30 seconds

Three levels, designed backwards: **Outcomes ← Lanes ← Skills.** Nine outcomes define
"launched." Each lane is a small prerequisite tree ending in a finale; **age is only a
tint** ("rarely before ~11," never "should have by 11"). Three states per kid:
**not yet · working on it · got it** — working is the normal, non-failing state, and
anything already true gets marked immediately (recognition, not busywork). Rewards are
**expanded freedoms, never treats**. Character lanes (Facing Hard Things · Walk with
Jesus · Serve & Give) get the lightest touch: shared language for noticing growth
*with* a kid, never a scorecard kept *about* them.

Full spec: [`docs/SPEC.md`](docs/SPEC.md) · Content schema:
[`docs/CONTENT_SCHEMA.md`](docs/CONTENT_SCHEMA.md)

## Customizing

- **Ages**: emancipation ages are editable in-app (values-loaded rows — faith, dating —
  are flagged; they're yours to set on purpose).
- **Content**: edit the JSON in `src/content/` and run `npm run validate` — the
  validator enforces the node-writing rules (observable mastery, no digits in
  "got it when," 2–3 examples, one finale per lane, acyclic prerequisites…).
- **Walk with Jesus** is deliberately broad/non-denominational — work your own
  tradition in.

Track B adapts Ken Wilgus's *Planned Emancipation* (from *Feeding the Mouth That Bites
You*).
