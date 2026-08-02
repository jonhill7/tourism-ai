import { useMemo } from 'react'
import { getLane, skillById, outcomeById } from '../lib/content'
import { layoutLane } from '../lib/layout'
import { useAppState, setSkillState, grantUnlock, skillStateFor } from '../lib/store'
import { ageOf } from '../lib/age'
import type { Lane, Skill, SkillState } from '../types'

const NODE_W = 176
const NODE_H = 72
const GAP_X = 56
const GAP_Y = 20
const PAD = 24

const stateLabel: Record<SkillState, string> = {
  'not-yet': 'not yet',
  working: 'working on it',
  'got-it': 'got it',
}

const StateButtons = ({ kidId, skill }: { kidId: string; skill: Skill }) => {
  const state = useAppState()
  const current = skillStateFor(state, kidId, skill.id)
  return (
    <div className="state-buttons" role="radiogroup" aria-label="Skill state">
      {(['not-yet', 'working', 'got-it'] as SkillState[]).map((s) => (
        <button
          key={s}
          role="radio"
          aria-checked={current === s}
          className={`state-btn s-${s} ${current === s ? 'active' : ''}`}
          onClick={() => setSkillState(kidId, skill.id, s)}
        >
          {s === 'got-it' ? '✓ ' : ''}
          {stateLabel[s]}
        </button>
      ))}
    </div>
  )
}

const DetailPanel = ({ lane, skill }: { lane: Lane; skill: Skill }) => {
  const state = useAppState()
  const kid = state.kids.find((k) => k.id === state.activeKidId) ?? null
  const current = kid ? skillStateFor(state, kid.id, skill.id) : 'not-yet'
  const unlockGranted = kid ? state.unlocksGranted[kid.id]?.[skill.id] ?? false : false
  const tooYoung = kid && skill.ageFloor !== undefined && ageOf(kid) < skill.ageFloor

  return (
    <aside className="detail-panel">
      <div className="detail-head">
        <h2>
          {skill.finale && <span className="finale-star" title="Lane finale">🎉</span>} {skill.name}
        </h2>
        <div className="detail-meta">
          <span className={`assess-badge a-${skill.assessment}`}>{skill.assessment}</span>
          {skill.ageFloor !== undefined && (
            <span className={`age-chip ${tooYoung ? 'tinted' : ''}`}>rarely before ~{skill.ageFloor}</span>
          )}
          {skill.outcomes.map((o) => {
            const oc = outcomeById.get(o)
            return oc ? (
              <span key={o} className="outcome-chip" title={oc.name}>
                {oc.emoji}
              </span>
            ) : null
          })}
        </div>
      </div>

      <section className="detail-block got-it-when">
        <h3>Got it when…</h3>
        <p>{skill.gotItWhen}</p>
      </section>

      <section className="detail-block">
        <h3>It looks like</h3>
        <ul>
          {skill.looksLike.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
      </section>

      <section className="detail-block">
        <h3>Ways to build it <span className="muted-note">(suggestions, never requirements)</span></h3>
        <ul>
          {skill.waysToBuild.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
      </section>

      {skill.comesAfter.length > 0 && (
        <section className="detail-block">
          <h3>Comes after {lane.kind === 'character' && <span className="muted-note">(suggestions here — character grows in a spiral)</span>}</h3>
          <div className="prereq-chips">
            {skill.comesAfter.map((p) => {
              const pre = skillById.get(p)
              if (!pre) return null
              const cross = pre.laneId !== lane.id
              const done = kid ? skillStateFor(state, kid.id, p) === 'got-it' : false
              return (
                <a
                  key={p}
                  className={`prereq-chip ${done ? 'done' : ''} ${cross ? 'cross' : ''}`}
                  href={`#/lane/${pre.laneId}/${p}`}
                  title={cross ? `from ${getLane(pre.laneId)?.name}` : undefined}
                >
                  {done ? '✓ ' : ''}
                  {cross ? `${getLane(pre.laneId)?.emoji} ` : ''}
                  {pre.name}
                </a>
              )
            })}
          </div>
        </section>
      )}

      {skill.unlock && (
        <section className={`unlock-box ${current === 'got-it' ? 'ready' : ''}`}>
          <h3>🔓 Unlocks</h3>
          <p>{skill.unlock.text}</p>
          {skill.unlock.coSign && kid && (
            <label className="cosign">
              <input
                type="checkbox"
                checked={unlockGranted}
                disabled={current !== 'got-it'}
                onChange={(e) => grantUnlock(kid.id, skill.id, e.target.checked)}
              />
              parent co-signed{current !== 'got-it' ? ' (after "got it")' : ''}
            </label>
          )}
        </section>
      )}

      {kid ? (
        <section className="detail-block">
          <h3>{kid.name}'s state</h3>
          <StateButtons kidId={kid.id} skill={skill} />
          {current === 'not-yet' && (
            <p className="muted small">
              Already true? Mark it got — recognizing what's there is the point, not busywork.
            </p>
          )}
        </section>
      ) : (
        <p className="muted">
          <a href="#/family">Add your kids</a> to start tracking.
        </p>
      )}
    </aside>
  )
}

export default function LaneView({ laneId, skillId }: { laneId?: string; skillId?: string }) {
  const lane = laneId ? getLane(laneId) : undefined
  const state = useAppState()
  const layout = useMemo(() => (lane ? layoutLane(lane) : null), [lane])
  if (!lane || !layout) return <p className="muted">Lane not found. <a href="#/">Back home</a></p>

  const kid = state.kids.find((k) => k.id === state.activeKidId) ?? null
  const selected = skillId ? lane.skills.find((s) => s.id === skillId) : undefined
  const got = kid ? lane.skills.filter((s) => skillStateFor(state, kid.id, s.id) === 'got-it').length : 0

  const width = layout.cols * (NODE_W + GAP_X) - GAP_X + PAD * 2
  const height = layout.rows * (NODE_H + GAP_Y) - GAP_Y + PAD * 2
  const xy = (col: number, row: number) => ({
    x: PAD + col * (NODE_W + GAP_X),
    y: PAD + row * (NODE_H + GAP_Y),
  })

  return (
    <div className="lane-view">
      <header className="lane-head">
        <a className="crumb" href="#/">← all lanes</a>
        <h1>
          <span className="lane-emoji big">{lane.emoji}</span> {lane.name}
        </h1>
        <p className="lane-tagline">{lane.tagline}</p>
        <div className="lane-head-meta">
          <span className={`kind-badge ${lane.kind}`}>{lane.kind}</span>
          {kid && (
            <span className="lane-counts">
              {kid.name}: {got}/{lane.skills.length} got it
            </span>
          )}
          <a className="print-link" href={`#/print/${lane.id}`}>
            🖨 check-in sheet
          </a>
        </div>
      </header>

      <div className="tree-scroll">
        <div className="tree-canvas" style={{ width, height }}>
          <svg className="tree-edges" width={width} height={height} aria-hidden>
            {layout.edges.map(([from, to]) => {
              const a = layout.pos.get(from)!
              const b = layout.pos.get(to)!
              const p1 = xy(a.col, a.row)
              const p2 = xy(b.col, b.row)
              const x1 = p1.x + NODE_W
              const y1 = p1.y + NODE_H / 2
              const x2 = p2.x
              const y2 = p2.y + NODE_H / 2
              const mx = (x1 + x2) / 2
              const done = kid ? skillStateFor(state, kid.id, from) === 'got-it' : false
              return (
                <path
                  key={`${from}-${to}`}
                  d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
                  className={`edge ${done ? 'edge-done' : ''} ${lane.kind === 'character' ? 'edge-soft' : ''}`}
                />
              )
            })}
          </svg>
          {layout.nodes.map(({ skill, col, row }) => {
            const { x, y } = xy(col, row)
            const st = kid ? skillStateFor(state, kid.id, skill.id) : 'not-yet'
            const tooYoung = kid && skill.ageFloor !== undefined && ageOf(kid) < skill.ageFloor
            const crossPrereqs = skill.comesAfter.some((p) => !p.startsWith(lane.id + '.'))
            return (
              <a
                key={skill.id}
                href={`#/lane/${lane.id}/${skill.id}`}
                className={[
                  'tree-node',
                  `st-${st}`,
                  skill.finale ? 'finale' : '',
                  selected?.id === skill.id ? 'selected' : '',
                  tooYoung ? 'too-young' : '',
                ].join(' ')}
                style={{ left: x, top: y, width: NODE_W, height: NODE_H }}
              >
                <span className="node-name">
                  {skill.finale ? '🎉 ' : ''}
                  {skill.name}
                </span>
                <span className="node-badges">
                  {st === 'got-it' ? <span className="node-check">✓</span> : st === 'working' ? <span className="node-working">…</span> : null}
                  {skill.unlock && <span title="carries an unlock">🔓</span>}
                  {crossPrereqs && <span title="has prerequisites in other lanes">⇄</span>}
                  {tooYoung && <span className="node-age">~{skill.ageFloor}</span>}
                </span>
              </a>
            )
          })}
        </div>
      </div>

      {lane.kind === 'character' && (
        <p className="character-note">
          Prerequisites on this lane are dotted for a reason: they're suggestions. Character develops in a
          spiral — this is shared language for noticing growth <em>with</em> a kid, never a scorecard kept{' '}
          <em>about</em> them.
        </p>
      )}

      {selected && <DetailPanel lane={lane} skill={selected} />}
    </div>
  )
}
