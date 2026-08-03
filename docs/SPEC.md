# Quest Tree + Emancipation Track — Design Spec

A visual, motivating skill tree for raising kids (roughly ages 9–18) who are genuinely
ready to leave home. Two parallel tracks:

- **Track A — the Skill Tree**: kids build real capabilities and earn expanded freedom
  as they demonstrate them. *Competence buys autonomy.*
- **Track B — the Emancipation Track**: a calendar of freedoms handed over *by age,
  unconditionally*, because some autonomy can't be earned without starting a control
  battle. A launched adult needs both — capable *and* progressively treated as an adult.

Built for one family (five kids) but designed to be customized and shared, not obeyed.

---

## Track A — The Skill Tree

Three levels, designed backwards from the goal: **Outcomes ← Lanes ← Skills.**

### The 9 outcomes (the definition of "launched")

| id | Outcome |
|----|---------|
| `household` | 🏡 Run an Independent Household |
| `financial` | 💰 Support Yourself Financially |
| `learning` | 🎓 Direct Your Own Learning & Work |
| `wellbeing` | ❤️ Own Your Wellbeing |
| `relationships` | 🤝 Build & Keep Relationships |
| `adversity` | 🌱 Respond Well to Adversity *(receptive — how you meet what happens to you)* |
| `adultworld` | 🧭 Navigate the Adult World |
| `faith` | ✝️ Live an Owned Faith |
| `beyond` | 🤲 Live Beyond Yourself *(other-directed)* |

Everything in the tree exists to feed at least one outcome.

### The 14 lanes

Clusters group lanes for display. The last three lanes are **character** (formation);
the rest are **competence** (capability).

| Cluster | Lanes |
|---------|-------|
| Self-Management | Self-Direction · Learn How to Learn |
| Provision | Money & Work |
| Home Base | Food & Kitchen · Home & Repair · Health & Body |
| Social | People & Comms · Relationships & Safety |
| World | Getting Around · Digital & Online Life · Civics & Community |
| Character | Facing Hard Things · Walk with Jesus · Serve & Give |

Each lane is a small **prerequisite tree** (not a chain) ending in a **finale** that
carries the lane's biggest unlock. The prerequisite graph is the skeleton; **age is
only a tint** (an age *floor* means "rarely before ~N", never "should have by N").
Lanes leak into each other on purpose — cross-lane prerequisites are encouraged where
real (a first job needs People skills).

On **character lanes**, prerequisites are *soft* — suggestions, not locks (character
develops in a spiral). Character finales carry a celebration, not a privilege unlock —
lightest possible touch: shared language for noticing growth *with* a kid, never a
scorecard kept *about* them.

### The node — the heart of the whole thing

Every node is a **skill**: a capability you can *do or be* — never an activity, never
a fact. Fields:

- **Name** — a capability ("Make and keep a budget"), not a task ("make a budget
  spreadsheet").
- **Got it when** — observable mastery, written *to the kid* ("you…"), describing the
  competent behavior. Reached by *matching the description*, not by counting reps.
- **It looks like** — 2–3 concrete example situations, ordered small→large, so the
  skill is self-recognizable. Required for abstract skills.
- **Ways to build it** — 2–4 *suggestions*. This is where specific actions, reps, and
  challenges live. Many roads in — these suggest, never gate.
- **Comes after** — prerequisite node ids (soft on character lanes). May cross lanes.
- **Age floor** (optional) — "rarely before ~N."
- **Unlock** (optional) — an expanded freedom, with parent co-sign if it's a real
  privilege. Competence lanes only; see the Track B audit rule below.
- **Assessment mode** — `self-check` (kid can judge alone) / `debrief` (a conversation)
  / `observed` (a parent has seen it). Self-checks belong to the kid — the app records
  whose hand marked them.
- **Touch** (optional) — `"light"` marks a disposition node living in a competence lane
  (attention, footprint, inner weather). Light nodes get character-grade handling
  wherever they live: soft prereqs, never a gate for an unlock, never counted in
  progress numbers, marked in retrospect.
- **Finale** flag — one per lane; the only place a 🎉 celebration lives.

**Three states per kid: not yet · working on it · got it.** "Working on it" is the
normal, non-failing state. Any skill can be marked "got it" immediately to **recognize
what's already there** (e.g. something school taught) — no busywork.

### The 8 rules for writing a good node

1. **A capability, not an activity** — *extract* the real ability, don't substitute a
   neighbor. ("Get a job" → "Land a job" = run a search end to end, *and* "Hold down a
   job" — two skills, a ladder.)
2. **Mastery must be observable.**
3. **Describe the competent behavior, never its failure** (no "without a meltdown").
   If it's about resisting a real threat, name the threat, not the kid's slip.
4. **Numbers are actions** — "for a month," "3×" go in *Ways to build it*, never in
   *Got it when*. Durability words ("over time," "by habit," "consistently") stay.
5. **One skill per node.**
6. **Many roads in** — build ideas suggest, never gate.
7. **Right grain** — not "put your plate away," not "be responsible."
8. **Worth carrying into adulthood.**

**Governing test:** *reading this about myself, would I honestly know whether I have it?*

Same skill at different sizes/ages is a **developmental ladder**, not duplication —
keep those.

### Motivational principles

- **Unlock freedom, not treats** (overjustification effect — tangible rewards kill
  intrinsic motivation; expanded autonomy strengthens it).
- Celebrations (🎉) are rare, finale-only.
- Never turn intrinsic joys into chores.
- Recognition over busywork — mark what's already there.

---

## Track B — The Emancipation Track

A calendar of freedoms, adapted from Ken Wilgus's *Planned Emancipation* (*Feeding the
Mouth That Bites You*). Core distinction: **a privilege is "I'll be nice and let you";
a freedom is "it's no longer up to me."**

**Four rules:**
1. Announce it before it arrives.
2. It arrives regardless of performance.
3. It never comes back (never revoked as punishment).
4. Boundaries exist only to protect everyone else — not because you dislike the choice.

**The sorting test** — which track does something belong on?
*Could I actually enforce this if they decided otherwise?*
- **No** (music, clothes, friends, beliefs, free time) → Track B calendar. Gating it
  is a fiction that costs influence.
- **Yes, with physical/financial stakes** (driving, credit card, home alone) →
  Track A skill tree.
- **Both** (money, driving) → both apply.

**Unlock audit rule:** any Track A unlock that would arrive by age anyway is a
scheduled freedom masquerading as an earned one — move it to Track B. Track A unlocks
must be genuinely enforceable privileges with real stakes.

**Gate audit rule** (the audit run backwards): an unlock may never gate on a
character-lane or light-touch node — that converts shared language into a scorecard
with stakes; fold the requirement into the unlock node's own "got it when" instead
(this is why *Drive safely* carries its own steadiness clause rather than a prereq on
*Stay steady*). And the bigger the unlock, the more observable its gates must be —
a finale gating on self-check evidence turns assessment into negotiation. A Track A
unlock must also never quietly gut a Track B row's enforceability (a fully
self-administered device arriving before the social-media freedom would make that
freedom's gating a fiction — the device finale's floor sits at ~15 for this reason,
and freedoms not yet arrived remain expectations kept by trust, not controls).
Both checks live in `npm run validate`.

**Default calendar** (all ages adjustable; values-loaded rows — faith, dating — are
flagged as the family's to set):
- **~12 — Your own space & taste**: room decor, music, hairstyle, clothes
- **~14 — Your own time & people**: choice of friends, discretionary-money spending,
  bedtime on non-school nights
- **~15 — Your own work**: daily schoolwork management, social media
- **~16 — Your own choices**: dating, screen time, earned money
- **~17 — Your own convictions**: church attendance, appearance
- **After graduation — everything** (curfew last)

**Companions:**
- An **Expectations & Consequences** list, written in *video-camera terms* (if you
  filmed them meeting it, what would you see?). Consequences touch privileges, never
  transferred freedoms.
- A **declared adulthood date**, told to the kid years in advance.

---

## Decisions made and *reversed* — do not relitigate

- Three node kinds (skill/habit/knowledge) collapsed into one; the mastery description
  absorbs all three (habit = "consistently, without reminders"; knowledge = "you can
  explain it").
- Counting reps → assessment against a description.
- A "redundancy test" was tried and dropped — developmental ladders are not duplicates.
- Age-bands-as-rows → age as a tint; the prerequisite graph is the real structure.
- Knowledge nodes → observable skills ("understand taxes" → "read a paycheck: explain
  your own pay stub").
- Building the app before the content model was premature (twice). Content first.

## Open questions — resolved in this build

1. **"Take feedback"** lives in **Facing Hard Things** (receiving critique well is
   meeting a hard thing); Learn How to Learn has "Use feedback to get better" with a
   cross-lane prerequisite on it — receiving vs. applying, a ladder, not a duplicate.
2. **"Persist"** lives in **Self-Direction** as "Finish what you start" (persistence
   toward chosen goals); Facing Hard Things keeps recovery-flavored resilience
   (try again after failing).
3. **"See through a sales pitch" split**: everyday marketing/persuasion stays in
   **Money & Work**; outright fraud is **Digital & Online Life**'s "Spot a scam."
4. **Visual identity**: warm field-guide — light, paper-warm, like a beautifully
   printed family handbook. Not dark, not RPG.
5. **One shared tree, per-kid progress** (not per-kid trees).
6. Emancipation ages on values-loaded rows and the Expectations & Consequences content
   are **family decisions** — the app makes them editable and flags the defaults.
7. Unlock audit applied: age-scheduled freedoms moved to Track B; Track A unlocks are
   genuinely enforceable privileges only.

## Lessons from the raising-a-child simulations (2026-08)

Two imagined runs of the tool — one kid nine-to-graduation, then two kids of opposite
temperament with a focus on evaluation — produced these standing decisions:

1. **The tool is an attention instrument first, an assessment instrument second.**
   Its best work is telling a parent what to notice. Cadence lives in the *focus*
   (one kid, one lane, two weeks) and the recognition pass, not in daily marking.
2. **Debrief on Tuesday, mark on Thursday.** The honest version of a hard
   conversation can't coexist with a kid watching for the checkbox at the end of it.
3. **Assessment integrity varies inversely with unlock value** — hence the gate
   audit rule, and the relabeling of finale gates to observable/debrief modes.
4. **Regression is normal**: the first got-it date survives every revisit, and
   re-opening a node is presented as the ladder continuing, never a demotion.
5. **Character must never acquire a scorecard by UI accident**: character lanes and
   light nodes show no counts, no bars, no percentages, anywhere.
6. **The kid-facing layer is temperament-dependent.** A systems kid can self-serve
   the whole tree; a private kid may only ever see a paper sheet. Never compare
   siblings' trees.
7. **Coverage gaps filled**: water safety (`health.water`); a discovery thread
   (`selfdir.try`, `selfdir.quit` — knowing what you love, and ending things well);
   the roommate tier (`home.together`). Still open: in-app node editing (today,
   customization means editing JSON — fine for a developer-family, a wall for
   everyone else).

## Guiding philosophy

Nothing has to be *right* — it has to be *started and visible*, then adjusted against
real kids. A calendar you can move is not a commitment you're locked into.
