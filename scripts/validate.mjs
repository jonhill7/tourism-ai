#!/usr/bin/env node
// Validates the content graph against docs/CONTENT_SCHEMA.md.
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const contentDir = join(root, 'src', 'content')
const lanesDir = join(contentDir, 'lanes')

const errors = []
const warnings = []
const err = (m) => errors.push(m)
const warn = (m) => warnings.push(m)

const outcomes = JSON.parse(readFileSync(join(contentDir, 'outcomes.json'), 'utf8')).outcomes
const outcomeIds = new Set(outcomes.map((o) => o.id))
const clusters = JSON.parse(readFileSync(join(contentDir, 'clusters.json'), 'utf8')).clusters
const clusterIds = new Set(clusters.map((c) => c.id))

const laneFiles = readdirSync(lanesDir).filter((f) => f.endsWith('.json')).sort()
const lanes = []
for (const f of laneFiles) {
  try {
    lanes.push(JSON.parse(readFileSync(join(lanesDir, f), 'utf8')))
  } catch (e) {
    err(`${f}: does not parse — ${e.message}`)
  }
}

const allSkills = new Map()
for (const lane of lanes) {
  const L = `lane ${lane.id}`
  if (!lane.id || !lane.name || !lane.emoji || !lane.tagline) err(`${L}: missing id/name/emoji/tagline`)
  if (!clusterIds.has(lane.cluster)) err(`${L}: unknown cluster "${lane.cluster}"`)
  if (!['competence', 'character'].includes(lane.kind)) err(`${L}: bad kind "${lane.kind}"`)
  if (!Array.isArray(lane.skills) || lane.skills.length === 0) { err(`${L}: no skills`); continue }

  let finales = 0
  for (const s of lane.skills) {
    const S = s.id ?? `${lane.id}.<missing id>`
    if (!s.id || !s.id.startsWith(lane.id + '.')) err(`${S}: id must start with "${lane.id}."`)
    if (allSkills.has(s.id)) err(`${S}: duplicate id`)
    allSkills.set(s.id, { ...s, lane: lane.id, laneKind: lane.kind })
    if (!s.name) err(`${S}: missing name`)
    if (!s.gotItWhen || s.gotItWhen.length < 40) err(`${S}: gotItWhen missing or too thin`)
    if (/\d/.test(s.gotItWhen ?? '')) err(`${S}: digits in gotItWhen — numbers are actions, move them to waysToBuild`)
    if (!/\byou\b|\byour\b|\byou'/i.test(s.gotItWhen ?? '')) err(`${S}: gotItWhen must be written to the kid ("you…")`)
    if (!Array.isArray(s.looksLike) || s.looksLike.length < 2 || s.looksLike.length > 3)
      err(`${S}: looksLike must have 2–3 entries (has ${s.looksLike?.length ?? 0})`)
    if (!Array.isArray(s.waysToBuild) || s.waysToBuild.length < 2 || s.waysToBuild.length > 4)
      err(`${S}: waysToBuild must have 2–4 entries (has ${s.waysToBuild?.length ?? 0})`)
    if (!Array.isArray(s.comesAfter)) err(`${S}: comesAfter must be an array`)
    if (!['self-check', 'debrief', 'observed'].includes(s.assessment)) err(`${S}: bad assessment "${s.assessment}"`)
    if (s.ageFloor !== undefined && (typeof s.ageFloor !== 'number' || s.ageFloor < 8 || s.ageFloor > 18))
      err(`${S}: ageFloor out of range`)
    if (!Array.isArray(s.outcomes) || s.outcomes.length === 0) err(`${S}: needs ≥1 outcome`)
    else for (const o of s.outcomes) if (!outcomeIds.has(o)) err(`${S}: unknown outcome "${o}"`)
    if (s.touch !== undefined) {
      if (s.touch !== 'light') err(`${S}: touch must be "light" if present`)
      if (lane.kind === 'character') warn(`${S}: touch:"light" is redundant on a character lane — the whole lane is light`)
      if (s.finale) err(`${S}: a light-touch node cannot be a finale`)
      if (s.unlock) err(`${S}: a light-touch node cannot carry an unlock — light nodes are language, never gates`)
    }
    if (s.finale) finales++
    if (s.unlock) {
      if (lane.kind === 'character') err(`${S}: character lanes carry no unlocks`)
      if (!s.unlock.text) err(`${S}: unlock without text`)
    }
    if (s.finale && lane.kind === 'competence' && !s.unlock) warn(`${S}: competence finale without an unlock`)
  }
  if (finales !== 1) err(`${L}: must have exactly 1 finale (has ${finales})`)
}

// cluster coverage
const laneIds = new Set(lanes.map((l) => l.id))
for (const c of clusters)
  for (const id of c.lanes) if (!laneIds.has(id)) err(`clusters.json: cluster ${c.id} lists unknown lane "${id}"`)
const clustered = new Set(clusters.flatMap((c) => c.lanes))
for (const id of laneIds) if (!clustered.has(id)) err(`lane ${id} appears in no cluster`)

// prerequisite references + acyclicity
for (const [id, s] of allSkills)
  for (const p of s.comesAfter ?? []) {
    if (!allSkills.has(p)) err(`${id}: comesAfter references unknown skill "${p}"`)
    if (p === id) err(`${id}: depends on itself`)
  }

// gate audit: freedoms with real stakes need observable gates, never character/light ones.
for (const [id, s] of allSkills) {
  if (!s.unlock) continue
  for (const p of s.comesAfter ?? []) {
    const pre = allSkills.get(p)
    if (!pre) continue
    if (pre.laneKind === 'character' || pre.touch === 'light')
      err(
        `${id}: unlock gates on character/light node "${p}" — a scorecard kept about them. ` +
          `Fold the requirement into this node's own gotItWhen instead.`,
      )
    if (s.finale && pre.assessment === 'self-check')
      warn(
        `${id}: big unlock gates on self-check evidence ("${p}") — the bigger the freedom, ` +
          `the more observable its gates should be, or assessment turns into negotiation.`,
      )
  }
}

const state = new Map() // 0 visiting, 1 done
const visit = (id, path) => {
  if (state.get(id) === 1) return
  if (state.get(id) === 0) { err(`cycle: ${[...path, id].join(' → ')}`); return }
  state.set(id, 0)
  for (const p of allSkills.get(id)?.comesAfter ?? []) if (allSkills.has(p)) visit(p, [...path, id])
  state.set(id, 1)
}
for (const id of allSkills.keys()) visit(id, [])

// emancipation + expectations shape
const em = JSON.parse(readFileSync(join(contentDir, 'emancipation.json'), 'utf8'))
if (!Array.isArray(em.rows) || em.rows.length < 3) err('emancipation.json: rows missing')
for (const r of em.rows ?? [])
  if (!r.id || !r.title || !Array.isArray(r.freedoms) || (typeof r.defaultAge !== 'number' && r.defaultAge !== 'graduation'))
    err(`emancipation row ${r.id ?? '?'}: bad shape`)
const ex = JSON.parse(readFileSync(join(contentDir, 'expectations.json'), 'utf8'))
for (const e of ex.expectations ?? []) if (!e.expectation || !e.consequence) err(`expectations ${e.id}: bad shape`)

const totals = `${lanes.length} lanes, ${allSkills.size} skills, ${[...allSkills.values()].filter((s) => s.finale).length} finales, ${[...allSkills.values()].filter((s) => s.unlock).length} unlocks`
for (const w of warnings) console.log(`⚠️  ${w}`)
if (errors.length) {
  for (const e of errors) console.error(`✗ ${e}`)
  console.error(`\n${errors.length} error(s). ${totals}`)
  process.exit(1)
}
console.log(`✓ content valid — ${totals}`)
