import { useMemo } from 'react'
import { getLane, skillById, outcomeById, isScored } from '../lib/content'
import { layoutLane } from '../lib/layout'
import {
  useAppState,
  grantUnlock,
  skillStateFor,
  setSkillNote,
  setSkillBy,
  setFocus,
} from '../lib/store'
import { ageOf, ageAt, fmtMonth } from '../lib/age'
import { StateButtons } from './StateButtons'
import type { Lane, Skill } from '../types'

const NODE_W = 176
const NODE_H = 72
const GAP_X = 56
const GAP_Y = 20
const PAD = 24

const FOCUS_DAYS = 14

const DetailPanel = ({ lane, skill }: { lane: Lane; skill: Skill }) => {
  const state = useAppState()
  const kid = state.kids.find((k) => k.id === state.activeKidId) ?? null
  const entry = kid ? state.progress[kid.id]?.[skill.id] : undefined
  const current = kid ? skillStateFor(state, kid.id, skill.id) : 'not-yet'
  const unlockGranted = kid ? state.unlocksGranted[kid.id]?.[skill.id] ?? false : false
  const tooYoung = kid && skill.ageFloor !== undefined && ageOf(kid) < skill.ageFloor
  const light = skill.touch === 'light' || lane.kind === 'character'
  const revisiting = current === 'working' && !!entry?.firstGot

  return (
    <aside className="detail-panel">
      <div className="detail-head">
        <h2>
          {skill.finale && <span className="finale-star" title="Lane finale">🎉</span>} {skill.name}
        </h2>
        <div className="detail-meta">
          <span className={`assess-badge a-${skill.assessment}`}>{skill.assessment}</span>
          {skill.touch === 'light' && (
            <span
              className="light-badge"
              title="Light touch — shared language to notice with your kid; never a gate, never scored."
            >
              🪶 light touch
            </span>
          )}
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

      {skill.touch === 'light' && (
        <p className="light-note">
          This one is a disposition, not a checkbox — treat it like a character node wherever it
          lives. Read it together, notice it in the wild, and mark it in retrospect (never mid-moment).
        </p>
      )}

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
              const preLane = getLane(pre.laneId)
              const cross = pre.laneId !== lane.id
              const soft = preLane?.kind === 'character' || pre.touch === 'light'
              const done = kid ? skillStateFor(state, kid.id, p) === 'got-it' : false
              return (
                <a
                  key={p}
                  className={`prereq-chip ${done ? 'done' : ''} ${cross ? 'cross' : ''} ${soft ? 'soft' : ''}`}
                  href={`#/lane/${pre.laneId}/${p}`}
                  title={
                    soft
                      ? 'a suggestion, never a gate — character and light-touch nodes are language, not locks'
                      : cross
                        ? `from ${preLane?.name}`
                        : undefined
                  }
                >
                  {done ? '✓ ' : ''}
                  {cross ? `${preLane?.emoji} ` : ''}
                  {pre.name}
                  {soft ? ' ·suggestion' : ''}
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
          {current === 'got-it' && entry?.date && (
            <p className="muted small state-when">
              ✓ got it {fmtMonth(new Date(entry.date + 'T12:00:00'))} (~age {ageAt(kid, entry.date)})
            </p>
          )}
          {revisiting && entry?.firstGot && (
            <p className="muted small revisit-note">
              First got it at ~{ageAt(kid, entry.firstGot)} — revisiting now. Skills regress;
              re-opening a node is the ladder continuing, not a demotion.
            </p>
          )}
          {current === 'not-yet' && !light && (
            <p className="muted small">
              Already true? Mark it got — recognizing what's there is the point, not busywork.
            </p>
          )}
          {light && (
            <p className="muted small">
              If a check-in here ever feels like a performance review, stop and shrink it.
            </p>
          )}
          {skill.assessment === 'self-check' && entry && current !== 'not-yet' && (
            <label className="marked-by">
              marked by{' '}
              <span className="marked-by-buttons">
                {(['kid', 'parent'] as const).map((who) => (
                  <button
                    key={who}
                    className={`ghost-btn tiny ${(entry.by ?? 'parent') === who ? 'active' : ''}`}
                    onClick={() => setSkillBy(kid.id, skill.id, who)}
                  >
                    {who === 'kid' ? kid.name : 'parent'}
                  </button>
                ))}
              </span>
              <span className="muted small"> — a self-check belongs to the kid; best marked by their hand.</span>
            </label>
          )}
          <label className="note-field">
            <span className="note-label">Notes & evidence <span className="muted-note">(private — what you saw, when, what's left)</span></span>
            <textarea
              key={`${kid.id}:${skill.id}`}
              defaultValue={entry?.note ?? ''}
              placeholder="e.g. did the full errand run solo in March — substitution and change both right"
              onBlur={(e) => setSkillNote(kid.id, skill.id, e.target.value)}
            />
          </label>
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
  const scored = lane.skills.filter((s) => isScored(s, lane))
  const got = kid ? scored.filter((s) => skillStateFor(state, kid.id, s.id) === 'got-it').length : 0

  const focus = kid ? state.focus[kid.id] : undefined
  const isFocus = focus?.laneId === lane.id
  const focusDay = isFocus
    ? Math.min(
        FOCUS_DAYS,
        Math.max(1, Math.floor((Date.now() - new Date(focus!.started + 'T12:00:00').getTime()) / 86400000) + 1),
      )
    : 0

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
          {kid && lane.kind === 'competence' && (
            <span className="lane-counts">
              {kid.name}: {got}/{scored.length} got it
            </span>
          )}
          {kid && (
            <button
              className={`ghost-btn focus-btn ${isFocus ? 'active' : ''}`}
              title="One kid, one lane, two weeks — the check-in rhythm"
              onClick={() => setFocus(kid.id, isFocus ? null : lane.id)}
            >
              {isFocus ? `★ our focus — day ${focusDay} of ${FOCUS_DAYS}` : '☆ make this our focus'}
            </button>
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
              const softEdge =
                lane.kind === 'character' ||
                skillById.get(from)?.touch === 'light' ||
                skillById.get(to)?.touch === 'light'
              return (
                <path
                  key={`${from}-${to}`}
                  d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
                  className={`edge ${done ? 'edge-done' : ''} ${softEdge ? 'edge-soft' : ''}`}
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
                  skill.touch === 'light' ? 'light-touch' : '',
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
                  {skill.touch === 'light' && <span title="light touch — language, not a gate">🪶</span>}
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
          <em>about</em> them. That's also why this lane shows no counts and no progress bar.
        </p>
      )}

      {selected && <DetailPanel lane={lane} skill={selected} />}
    </div>
  )
}
