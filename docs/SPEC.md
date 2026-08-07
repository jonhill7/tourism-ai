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

Read it as a **map, not a checklist**: many branches deliberately feed no finale —
they're territory to wander, not steps to complete. Two markers keep ~210 nodes
navigable. The **🎯 Launch Core** flags the ~35 college-critical skills (`core: true`;
competence lanes only — character never gets a checklist); everything outside the core
is an extension, and a family that only ever works the core has used the tool
correctly. The **🏁 launch capstone** (`capstone.json`) is the one cross-lane node —
*run a week of your life*: meals, money, transport, appointments, deadlines, paperwork,
and an unexpected problem, all at once, adults on-call only. Lane finales prove skills
in isolation; the capstone is the integration test.

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
  wherever they live: **no prerequisites at all** ("never gated" runs in both
  directions), never a gate for an unlock, never counted in progress numbers, marked in
  retrospect. Their assessment mode only names how growth gets noticed together — it is
  never a scored checkpoint.
- **Core** (optional) — `true` marks a Launch Core skill (see above).
- **Region** (optional) — e.g. `"US"`: the node's specifics (taxes, voting, financial
  aid, legal rights) are jurisdiction-bound. Keep the skill, swap the specifics.
- **Finale** flag — one per lane; the only place a 🎉 celebration lives.

### What "got it" means — self-correcting, not flawless

Two kinds of node share one format. **Threshold skills** you cross once and you're
across (read a pay stub, change a tire, cook an unfamiliar recipe). **Practice skills**
never terminate, because they're maintenance — keeping track of your stuff, keeping
your word, keeping a cushion. Adults work on those forever; that is the nature of the
skill, not evidence the adult failed. Written as a permanent steady state, a practice
node describes a person who doesn't exist, nobody can honestly mark it, and the bar
quietly becomes perfectionism.

So "got it" means **ownership with self-repair**, not permanent success: they have a
working method, they run it themselves, and when it breaks *they* are the one who
notices and repairs it. Two tests, both observable:

- **The recovery test** — when it fails, who catches it? Them, or you (or a consequence
  landing on someone else)?
- **The reliance test** — is anyone else quietly load-bearing for this?

**The adult test** is how you audit a description: *would a competent adult honestly
mark this "got it"?* If not, ask whether that's because they're genuinely not launched —
or because the description is wrong. Where it's the description, it needs the repair
clause (rule 10). This is the governing test pointed at an adult instead of a kid, and
it applies to the ~17 practice-flavored nodes rewritten in 2026-08; character and
light-touch nodes are exempt by construction — they're never scored, so no bar to clear.

**Three states per kid: not yet · working on it · got it.** "Working on it" is the
normal, non-failing state. Any skill can be marked "got it" immediately to **recognize
what's already there** (e.g. something school taught) — no busywork.

### The rules for writing a good node

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
9. **Mastery may not depend on luck or elapsed time.** "A friendship measured in years"
   and "a trial life handed you" can't be practised on demand — assess the underlying
   behaviors (the tending, the toolkit), and let the life event be *optional evidence*,
   never the entry bar.
10. **A practice skill must name the repair, not just the steady state.** If the skill is
    maintenance rather than a threshold, say who catches the failure and what they do
    about it — "when it slips, you're the one who notices and puts it back." Steady state
    alone sets a bar no adult clears. Threshold skills ("you can…") need no repair clause,
    and high-stakes safety nodes (meds, water, emergencies) keep their strict bar on
    purpose. This does not bend rule 3: the repair clause describes *competent behavior*
    in response to an ordinary, expected event — it never defines mastery as the absence
    of a slip.

**Governing test:** *reading this about myself, would I honestly know whether I have it?*
**Audit test:** *would a competent adult honestly mark this "got it"?* (See "What 'got
it' means" above — if not, the description is usually what's wrong.)

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

**Unlocks are conditional and reversible — on purpose.** An unlock is a privilege, not
a freedom: one demonstration opens the door, but it stays open through ongoing judgment.
Law, medication risk, other families' consent, and the household's standing rules always
still apply; a privilege can pause when context changes (the co-sign is the "context
still fits" check, and un-checking it is a supported move, not a betrayal). Unlock text
should carry its own standing conditions where the stakes demand it (meds custody,
overnights, the credit card). Only Track B freedoms get the never-comes-back guarantee —
that asymmetry is what makes handing a freedom over mean something.

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

## Lessons from the external review (2026-08)

A structured critique of the full tree produced these standing decisions:

1. **A Launch Core, not a smaller tree.** ~35 college-critical skills flagged
   `core: true`; the other ~175 relabeled (in the Guide and the home screen) as
   extensions. The fix for "206 nodes feels like a compliance checklist" is a smaller
   *foreground*, not less content.
2. **One cross-lane capstone.** Lane finales test skills in isolation; `capstone.json`
   (*run a week of your life*) is the integration test, and the only node outside every
   lane.
3. **A college-transition overlay without a new lane**: `learn.college` (registration,
   syllabi, drop deadlines, office hours, integrity), `money.aid`, `money.credit`,
   `home.lease`, `health.coverage`, `health.emergency-friend` (helping an intoxicated
   friend, overdose recognition, safe transport) — slotted into existing lanes at
   floors ~14–17, most of them core.
4. **Light-touch means never gated, both directions.** Light nodes now carry no
   prerequisites (validator-enforced), and their assessment mode is documented as "how
   growth gets noticed," never a checkpoint.
5. **No luck-gated mastery** (rule 9): the relationships and facing finales were
   rewritten to assess tending behaviors and the toolkit reflex; the years-long
   friendship and the real trial became optional evidence.
6. **Deliberate near-duplicates now differentiate themselves in-text** (initiative vs.
   unasked help; mistake-analysis vs. retry vs. own-it; inner weather vs. in-the-moment
   settling; source-judgment vs. feed-speed media literacy — the last pair now also a
   cross-lane ladder). Ladders stay ladders; the differentiation just stopped being
   implicit.
7. **The parent arc is first-class**: model → practise together → observe → step back,
   surfaced per-node (derived from assessment mode), plus the kid-first check ("watch
   me") and appeal path (description arbitrates → two-week focus with agreed evidence).
   Supervision — shown → together → observed → cleared solo — is the real dial on
   blades/flames/wheels/meds nodes; age floors stay tints.
8. **Jurisdiction and values are tagged, not baked in**: `region: "US"` on
   taxes/voting/aid/rights nodes; the faith lane is `configurable` and can be switched
   off in-app without orphaning the other thirteen lanes.

## Lessons from the mastery-criteria pass (2026-08)

The question that prompted it: *many of these nodes are things adults are still working
on — how do I know when a kid has it enough to move on?*

1. **Threshold vs. practice** is the distinction that was missing — not a fourth state,
   and emphatically not a return to the collapsed skill/habit/knowledge kinds. It's about
   the shape of *mastery*, so it lives in the writing rules, not in the schema.
2. **"Got it" = ownership with self-repair**, checked by the recovery test and the
   reliance test. This is also the honest line between a launched adult and a dependent
   one, which is why it belongs at the center rather than as a caveat.
3. **The adult test audits descriptions, not kids.** Seventeen practice nodes failed it
   and got repair clauses; the rest were already written as capabilities ("you can…"),
   already hedged ("roughly," "mostly"), or already carried the repair
   (`money.budget`, `money.cushion`, `health.move` were the models to copy).
4. **Character and light-touch lanes were left alone** — they're never scored, so there
   is no bar to make honest, and adding repair clauses would have imported assessment
   machinery into exactly the place the spec keeps it out of.
5. **"Enough to move on" is mostly a non-question structurally.** The graph is a map;
   `comesAfter` is readiness for the next thing, not proof of mastery. Only unlocks
   genuinely gate, and there a high bar is correct — the gate audit rule already guards it.
   Everywhere else, "working on it" is a fine permanent home for a skill.

## Guiding philosophy

Nothing has to be *right* — it has to be *started and visible*, then adjusted against
real kids. A calendar you can move is not a commitment you're locked into.
