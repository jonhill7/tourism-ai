import type { Lane, Skill } from '../types'

export interface LaidOutNode {
  skill: Skill
  col: number // depth: longest in-lane prerequisite path
  row: number // stacking position within the column
}

export interface LaneLayout {
  nodes: LaidOutNode[]
  cols: number
  rows: number
  /** in-lane edges as [fromId, toId] */
  edges: [string, string][]
  pos: Map<string, { col: number; row: number }>
}

/** Layered DAG layout. Columns = longest path from a lane root; cross-lane
 * prerequisites don't affect placement (they render as chips, not edges). */
export const layoutLane = (lane: Lane): LaneLayout => {
  const inLane = new Set(lane.skills.map((s) => s.id))
  const byId = new Map(lane.skills.map((s) => [s.id, s]))
  const depth = new Map<string, number>()

  const depthOf = (id: string, seen: Set<string>): number => {
    if (depth.has(id)) return depth.get(id)!
    if (seen.has(id)) return 0 // cycle guard; validator forbids real cycles
    seen.add(id)
    const skill = byId.get(id)!
    const parents = skill.comesAfter.filter((p) => inLane.has(p))
    const d = parents.length === 0 ? 0 : Math.max(...parents.map((p) => depthOf(p, seen))) + 1
    depth.set(id, d)
    return d
  }
  for (const s of lane.skills) depthOf(s.id, new Set())

  const cols = Math.max(...[...depth.values()]) + 1
  const columns: Skill[][] = Array.from({ length: cols }, () => [])
  for (const s of lane.skills) columns[depth.get(s.id)!].push(s)

  // order each column by the average row of in-lane parents to reduce crossings
  const rowOf = new Map<string, number>()
  columns.forEach((colSkills, c) => {
    if (c > 0) {
      colSkills.sort((a, b) => {
        const avg = (s: Skill) => {
          const ps = s.comesAfter.filter((p) => inLane.has(p) && rowOf.has(p))
          return ps.length ? ps.reduce((acc, p) => acc + rowOf.get(p)!, 0) / ps.length : 99
        }
        return avg(a) - avg(b)
      })
    }
    colSkills.forEach((s, r) => rowOf.set(s.id, r))
  })

  const nodes: LaidOutNode[] = lane.skills.map((s) => ({
    skill: s,
    col: depth.get(s.id)!,
    row: rowOf.get(s.id)!,
  }))
  const edges: [string, string][] = []
  for (const s of lane.skills)
    for (const p of s.comesAfter) if (inLane.has(p)) edges.push([p, s.id])

  const rows = Math.max(...columns.map((c) => c.length))
  const pos = new Map(nodes.map((n) => [n.skill.id, { col: n.col, row: n.row }]))
  return { nodes, cols, rows, edges, pos }
}
