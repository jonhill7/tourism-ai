import type { Capstone, Cluster, EmancipationData, ExpectationItem, Lane, Outcome, Skill } from '../types'
import outcomesJson from '../content/outcomes.json'
import clustersJson from '../content/clusters.json'
import emancipationJson from '../content/emancipation.json'
import expectationsJson from '../content/expectations.json'
import capstoneJson from '../content/capstone.json'

const laneModules = import.meta.glob('../content/lanes/*.json', { eager: true }) as Record<
  string,
  { default: Lane }
>

export const outcomes: Outcome[] = (outcomesJson as { outcomes: Outcome[] }).outcomes
export const clusters: Cluster[] = (clustersJson as { clusters: Cluster[] }).clusters
export const emancipation = emancipationJson as EmancipationData
export const expectations: ExpectationItem[] = (expectationsJson as { intro: string; expectations: ExpectationItem[] }).expectations
export const expectationsIntro: string = (expectationsJson as { intro: string }).intro

const laneById = new Map<string, Lane>()
for (const mod of Object.values(laneModules)) {
  const lane = (mod as { default?: Lane }).default ?? (mod as unknown as Lane)
  laneById.set(lane.id, lane)
}

/** Lanes in cluster display order. */
export const lanes: Lane[] = clusters.flatMap((c) => c.lanes.map((id) => laneById.get(id)!).filter(Boolean))

export const getLane = (id: string): Lane | undefined => laneById.get(id)

export const skillById = new Map<string, Skill & { laneId: string }>()
for (const lane of lanes) for (const s of lane.skills) skillById.set(s.id, { ...s, laneId: lane.id })

export const outcomeById = new Map(outcomes.map((o) => [o.id, o]))

export const totalSkills = skillById.size

/**
 * A node counts toward progress numbers only if it's a competence skill without the
 * light-touch flag. Character lanes and light nodes are shared language, never a score.
 */
export const isScored = (skill: Skill, lane: Lane): boolean =>
  lane.kind === 'competence' && skill.touch !== 'light'

export const scoredSkillIds = new Set(
  lanes.flatMap((l) => l.skills.filter((s) => isScored(s, l)).map((s) => s.id)),
)

export const scoredTotal = scoredSkillIds.size

/** The Launch Core — the ~three dozen college-critical skills. Everything else is an extension. */
export const coreSkillIds = new Set(
  lanes.flatMap((l) => l.skills.filter((s) => s.core).map((s) => s.id)),
)

export const coreTotal = coreSkillIds.size

/** The one cross-lane launch capstone — lives outside every lane. */
export const capstone = capstoneJson as Capstone

/** Lanes visible for this family — configurable lanes can be switched off in Family settings. */
export const visibleLanes = (hiddenLanes: string[]): Lane[] =>
  lanes.filter((l) => !hiddenLanes.includes(l.id))
