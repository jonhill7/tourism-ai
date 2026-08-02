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
actions — they belong in `waysToBuild`); character-lane nodes carry no `unlock`.

## Other files

- `src/content/outcomes.json` — the 9 outcomes (id, emoji, name, note).
- `src/content/clusters.json` — cluster display order.
- `src/content/emancipation.json` — default calendar: rows with `id`, `defaultAge`
  (or `"graduation"`), `title`, `freedoms[]`, `valuesLoaded` flag, `notes`; plus the
  four rules and the sorting test text.
- `src/content/expectations.json` — starter Expectations & Consequences template in
  video-camera terms (explicitly a family-editable starting point).
