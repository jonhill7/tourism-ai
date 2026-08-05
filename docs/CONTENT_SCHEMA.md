# Content schema

Content lives in `src/content/` as JSON, imported directly by the app and validated by
`scripts/validate.mjs` (`npm run validate`).

## Lane file — `src/content/lanes/<laneId>.json`

```jsonc
{
  "id": "money",                  // short lane id, used as node id prefix
  "name": "Money & Work",
  "emoji": "💰",
  "cluster": "Provision",         // one of the six clusters
  "kind": "competence",           // "competence" | "character"
  "tagline": "One sentence on what this lane is for.",
  "skills": [
    {
      "id": "money.budget",       // "<laneId>.<slug>", globally unique
      "name": "Make and keep a budget",            // a capability, not a task
      "gotItWhen": "You…",        // observable mastery, written TO the kid, no counts
      "looksLike": [              // 2–3 concrete situations, small → large
        "…", "…"
      ],
      "waysToBuild": [            // 2–4 suggestions; reps/numbers live HERE
        "…", "…"
      ],
      "comesAfter": ["money.track"],   // node ids; may cross lanes; [] for roots
      "ageFloor": 11,             // optional; "rarely before ~11"
      "assessment": "debrief",    // "self-check" | "debrief" | "observed"
      "touch": "light",           // optional; a disposition node in a competence lane:
                                  // character-grade handling — never a gate, never scored,
                                  // and never gated: light nodes carry no prerequisites
      "core": true,               // optional; Launch Core — one of the ~35 college-critical
                                  // skills (competence, non-light only; the validator keeps
                                  // the core between 25 and 40)
      "region": "US",             // optional; jurisdiction-specific content (taxes, voting,
                                  // aid) — keep the skill, swap the specifics
      "unlock": {                 // optional; competence lanes only
        "text": "…an expanded freedom with real stakes…",
        "coSign": true            // true if it's a real privilege needing parent sign-off
      },
      "finale": true,             // exactly one node per lane
      "outcomes": ["financial"]   // ≥1 of the 9 outcome ids
    }
  ]
}
```

Rules the validator enforces: unique ids; prefix matches lane; prerequisites exist;
graph is acyclic; exactly one finale per lane; every skill maps to ≥1 valid outcome;
2–3 `looksLike`, 2–4 `waysToBuild`; digits are not allowed in `gotItWhen` (numbers are
actions — they belong in `waysToBuild`); character-lane nodes carry no `unlock`;
light-touch nodes carry no prerequisites ("never gated" runs in both directions);
`core` only on competence, non-light nodes, with the Launch Core kept between 25 and 40.

The lane object may also carry `"configurable": true` — a values-loaded lane (the faith
lane) a family can switch off in the app without touching the other thirteen.

**Gate audit** (also enforced): an unlock-bearing node may never have a character-lane
or `touch: "light"` prerequisite — that would turn shared language into a scorecard
with stakes; fold the requirement into the node's own `gotItWhen` instead. And a
finale unlock gating on `self-check` evidence draws a warning: the bigger the freedom,
the more observable its gates should be, or assessment turns into negotiation.

## Other files

- `src/content/capstone.json` — the one cross-lane launch capstone ("run a week of your
  life"). Same node shape minus lane-only fields (no unlock, no outcomes, no finale flag);
  validated like a node, must draw prerequisites from at least four lanes, and may never
  gate on character/light nodes.
- `src/content/outcomes.json` — the 9 outcomes (id, emoji, name, note).
- `src/content/clusters.json` — cluster display order.
- `src/content/emancipation.json` — default calendar: rows with `id`, `defaultAge`
  (or `"graduation"`), `title`, `freedoms[]`, `valuesLoaded` flag, `notes`; plus the
  four rules and the sorting test text.
- `src/content/expectations.json` — starter Expectations & Consequences template in
  video-camera terms (explicitly a family-editable starting point).
